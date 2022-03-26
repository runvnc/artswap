
@inline
def transfer(assetid, amount, to=Txn.sender):
  Next()
  SetField(TxnField.type_enum, TxnType.AssetTransfer)
  SetField(TxnField.xfer_asset, assetid)
  SetField(TxnField.asset_receiver, to)
  SetField(TxnField.asset_amount, amount)
  Submit()
