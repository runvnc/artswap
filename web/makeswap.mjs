import {getAlgod} from './access.mjs'
import algosdk from 'algosdk'

const print = console.log

let net = 'MAINNET'


export async function makeSwapApp({addr, assets, redeemAsset, params, compile }) {
  let teal = await fetchtext('swap.teal')
  let inserts = { TMPL_NUM_ASSETS: assets.length,
                  TMPL_OWNER: addr,
                  TMPL_REDEEM_ASSET: redeemAsset}
  for (let n = 1; n <= 3; n++) {
    if (n <= assets.length)
      inserts[`TMPL_ASSET${n}`] = assets[n-1]
    else
      inserts[`TMPL_ASSET${n}`] = 0
  }
  
  for (let key in inserts) {
    teal = teal.replaceAll(key, inserts[key])
  }
  console.log(teal)
  if (compile) {
    let algod = getAlgod(net)
    let prog = await algod.compile(teal).do()
    
    prog = Buffer.from(prog.result,'base64')
    let clearTeal  = await fetchtext('clear.teal')
    let clear = await algod.compile(clearTeal).do()
    clear = Buffer.from(clear.result, 'base64')
    clear = new Uint8Array(clear)
    prog = new Uint8Array(prog)
    let appArgs = null

    // optin to both assets

    let createTxn = algosdk.makeApplicationCreateTxn(
      addr, params, algosdk.OnApplicationComplete.NoOpOC, prog, clear, 1,1, 1, 1,[])
    
    return createTxn
  }
}

export async function fundCallTransferTxns({addr, appIndex, appAddress, redeemAsset, assets, amount, fund, params}) {
  console.log({appIndex,addr,appAddress,redeemAsset,assets})
  let pay = await algosdk.makePaymentTxnWithSuggestedParams(addr, appAddress, fund, undefined, undefined, params)
  let callOptIn = new Buffer("opt_in")
  callOptIn = new Uint8Array(callOptIn)
  let foreignAssets = [redeemAsset]
  for (let a of assets) foreignAssets.push(a)
  let call = await algosdk.makeApplicationCallTxnFromObject({from: addr, foreignAssets, appArgs: [callOptIn], appIndex, onComplete: algosdk.OnApplicationComplete.NoOpOC, suggestedParams: params })
  let xferasset = await algosdk.makeAssetTransferTxnWithSuggestedParams(
    addr, appAddress, undefined, undefined, amount, undefined, redeemAsset, params)
  
  return [pay, call, xferasset]
}

