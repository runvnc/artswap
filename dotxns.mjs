import algosdk from 'algosdk'

export async function createSwapTxns({params, customer, appAddress, appIndex, assets, amount}) {
  let txns = []
  console.log({customer, appAddress, assets})
  for (let asset of assets) {
    txns.push( 
      algosdk.makeAssetTransferTxnWithSuggestedParams(
        customer, appAddress, undefined, undefined, amount, undefined, asset, params
      )
    )
  }
  txns.push(algosdk.makeApplicationNoOpTxn(
    customer, params, appIndex, [ new Uint8Array([0]) ]
  ))

  let txgroup = algosdk.assignGroupID(txns)
  return txns    
}
