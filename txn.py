
@inline
def transfer(assetid, amount, to=Txn.sender):
  Begin()
  SetField(TxnField.type_enum, TxnType.AssetTransfer)
  SetField(TxnField.xfer_asset, assetid)
  SetField(TxnField.asset_receiver, to)
  SetField(TxnField.asset_amount, amount)
  Submit()

@inline
def opt_in(assetid, to=app_address):
  Begin()
  SetField(TxnField.type_enum, TxnType.AssetTransfer)
  SetField(TxnField.xfer_asset, assetid)
  SetField(TxnField.asset_receiver, to)
  SetField(TxnField.sender, to)
  SetField(TxnField.asset_amount, 0)
  Submit()
