import algosdk from 'algosdk'

export async function createSaleSwapTxns({params, customer, appAddress,
                         payTo, appIndex, redeemAsset, assets, amount, price}) {
  let txns = []
  console.log({customer, appAddress, assets})
  for (let asset of assets) {
    txns.push( 
      algosdk.makeAssetTransferTxnWithSuggestedParams(
        customer, appAddress, undefined, undefined, amount, undefined, asset, params
      )
    )
  }
  let optin = await algosdk.makeAssetTransferTxnWithSuggestedParams(
    customer, customer, undefined, undefined, 0, undefined, redeemAsset, params)

  let pay = await algosdk.makePaymentWithSuggestedParamsFromObject(
          { amount: price, from: customer, to: payTo, suggestedParams: params } )
  
  txns.push(optin)
  let callXfer = new Buffer("swap")
  callXfer = new Uint8Array(callXfer)
  txns.push(
    await algosdk.makeApplicationCallTxnFromObject({
     from: customer, foreignAssets: [redeemAsset], appArgs: [callXfer], appIndex,
     onComplete: algosdk.OnApplicationComplete.NoOpOC, suggestedParams: params
    })
  )
  let txgroup = algosdk.assignGroupID(txns)
  return txns    
}
