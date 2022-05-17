from pyteal import *

globals().update(TealType.__members__)


def transfer(assetid, amount, to=Txn.sender()):
    return  Seq(
    	InnerTxnBuilder.Begin(),
    	InnerTxnBuilder.SetField(TxnField.type_enum, TxnType.AssetTransfer),
    	InnerTxnBuilder.SetField(TxnField.xfer_asset, assetid),
    	InnerTxnBuilder.SetField(TxnField.asset_receiver, to),
    	InnerTxnBuilder.SetField(TxnField.asset_amount, amount),
    	InnerTxnBuilder.Submit() )
def opt_in(assetid, to=Global.current_application_address()):
    return  Seq(
    	InnerTxnBuilder.Begin(),
    	InnerTxnBuilder.SetField(TxnField.type_enum, TxnType.AssetTransfer),
    	InnerTxnBuilder.SetField(TxnField.xfer_asset, assetid),
    	InnerTxnBuilder.SetField(TxnField.asset_receiver, to),
    	InnerTxnBuilder.SetField(TxnField.sender, to),
    	InnerTxnBuilder.SetField(TxnField.asset_amount, Int(0)),
    	InnerTxnBuilder.Submit() )
def pay(from_, to, amount):
  return InnerTxnBuilder.SetFields({
        TxnField.type_enum: TxnType.Payment,
        TxnField.receiver: to,
        TxnField.amount: amount,
        TxnField.sender: from_
      })




if __name__ == "__main__":
    print(compileTeal(app(), mode=Mode.Application, version=6))
