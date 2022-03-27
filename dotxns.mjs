

export async function createSwapTxns({params, customer, appAddress, appIndex, assets, amount}) {
  let txns = []
  for (let asset of assets) {
    txns.push( 
      algosdk.makeAssetTransferTxnwithSuggestedParams(
        customer, app_address, null, null, amount, null, asset, params
      )
    )
  }
  txns.push(algosdk.makeApplicationNoOpTxn(
    customer, params, appIndex, appArgs: [ new Uint8Array([0])]
  ))
  
}
