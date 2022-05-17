from lib import txn

num_assets = Tmpl.Int("TMPL_NUM_ASSETS")

OWNER = Tmpl.Addr("TMPL_OWNER")

PRICE = Tmpl.Int("TMPL_PRICE")

FEE_ = 0.025
FEE_RATIO_DENOMINATOR = round(1.0 / FEE_)

PAY_FEE_TO = Addr("RMONE54GR6CYOJREKZQNFCZAUGJHSPBUJNFRBTXS4NKNQL3NJQIHVCS53M")


def get_asset(n):
  if n == 0: return Tmpl.Int("TMPL_ASSET1")
  if n == 1: return Tmpl.Int("TMPL_ASSET2")
  if n == 2: return Tmpl.Int("TMPL_ASSET3")
  return 0

def check_amount(transferred, previous):
  new_amount = previous
  if previous == 0:
    new_amount = transferred
  Assert(transferred > 0)
  Assert(new_amount == transferred)
  return new_amount  

def check_transfers():
  i = 0
  found = 0
  amount = 0
  while i < Global.group_size and found < num_assets:
    if (Gtxn[i].xfer_asset == get_asset(i) and 
        Gtxn[i].asset_receiver == app_address):
      amount = check_amount(Gtxn[i].asset_amount, amount)    
      found = found + 1
    i = i + 1

  Assert(found == num_assets)
  return amount

def check_payment():
  i = 0
  found = 0
  multiple = 0
  while i < Global.group_size and found != 1:
    if ( (Gtxn[i].amount % PRICE == 0) and 
        Gtxn[i].receiver == OWNER): 
      found = 1
      multiple = Gtxn[i].amount / PRICE
    i = i + 1

  Assert(found == 1 and multiple >= 1)
  return multiple


def pay_fee():
  Assert( Txn.accounts[1] == PAY_FEE_TO )
  txn.pay(app_address, Txn.accounts[1], PRICE / Int(FEE_RATIO_DENOMINATOR) )

def complete_swap(n):
  current = 0
  current = Btoi(App.localGet(Txn.sender, 'count'))
  Assert( current < Tmpl.Int('TMPL_MAX') )
  txn.transfer(Txn.assets[0], n)
  current = current + 1
  App.localPut(Txn.sender, 'count', current)

def opt_ins():
  txn.opt_in(Txn.assets[0])
  txn.opt_in(Txn.assets[1])
  if num_assets > 1:
    txn.opt_in(Txn.assets[2])
  if num_assets > 2:
    txn.opt_in(Txn.assets[3])

def check_assets(swap):
  Assert( Txn.assets[0] == Tmpl.Int('TMPL_REDEEM_ASSET') )
  if swap == 0:
    Assert( Txn.assets[1] == Tmpl.Int('TMPL_ASSET1') )
    if num_assets > 1:
      Assert( Txn.assets[2] == Tmpl.Int('TMPL_ASSET2') ) 
    if num_assets > 2:
      Assert( Txn.assets[3] == Tmpl.Int('TMPL_ASSET3') )


def transfer(amount):
  print("Checking owner")
  if checkOwner() != 1:
    print("sender is not owner")
    Reject()    
  else:
    print("Would try to transfer")    
    txn.transfer(Txn.assets[0], amount)


def checkOwner():
  if Txn.sender != OWNER:
    return 0
  else:
    return 1

def app():
  n = 0  
  num_paid = 0
  if Txn.application_args.length() == 0:
    return checkOwner()

  if Txn.on_completion != OnComplete.NoOp:
    return checkOwner()

  if Txn.application_args[0] == 'transfer':
      transfer(Btoi(Txn.application_args[1]))
      return 1      

  print("arg found is: " + Txn.application_args[0])
      
  if Txn.application_args[0] == 'opt_in':
    check_assets(0)
    opt_ins()
    return 1

  if Txn.application_args[0] == 'swap':    
    check_assets(1)
    n = check_transfers()
    
    if PRICE > 0:
      num_paid = check_payment()
      pay_fee()
      Assert( n == 0 or n == num_paid )
      n = num_paid
  
    complete_swap(n)
    return 1

  print("Did not match method.")
  return 0

