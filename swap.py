from lib import txn

num_assets = Tmpl.Int("TMPL_NUM_ASSETS")

owner = Tmpl.Addr("TMPL_OWNER")

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
  return found

def complete_swap(n):
  txn.transfer(Txn.assets[0], n)

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
    #Reject()
  else:
    txn.transfer(Txn.assets[0], amount)


def checkOwner():
  if Txn.sender != owner:
    return 0
  else:
    return 1

def app():
  n = 0  
  if Txn.application_args.length() == 0:
    return checkOwner()

  print("arg found is: " + Txn.application_args[0])
      
  if Txn.application_args[0] == 'opt_in':
    check_assets(0)
    opt_ins()
    return 1

  if Txn.application_args[0] == 'swap':   
    check_assets(1)
    n = check_transfers()
    complete_swap(n)
    return 1

  if Txn.application_args[0] == 'transfer':
    transfer(Btoi(Txn.application_args[1]))
    return 1

  print("Did not match method.")
  return 0
