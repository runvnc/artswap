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
  txn.transfer(Tmpl.Int('TMPL_REDEEM_ASSET'), n)

def opt_ins():
  txn.opt_in(Tmpl.Int('TMPL_REDEEM_ASSET'))
  txn.opt_in(Tmpl.Int('TMPL_ASSET1'))
  if num_assets > 1:
    txn.opt_in(Tmpl.Int('TMPL_ASSET2'))
  if num_assets > 2:
    txn.opt_in(Tmpl.Int('TMPL_ASSET3'))


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
    opt_ins()
    return 1

  if Txn.application_args[0] == 'swap':   
    n = check_transfers()
    complete_swap(n)
    return 1

  print("Did not match method.")
  return 1
