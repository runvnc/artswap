import {getAlgod} from './access.mjs'

import fs from 'fs/promises'

let net = 'DEV'

export async function makeSwapApp({addr, assets, redeemAsset, params, compile }) {
  let teal = await fs.readFile('swap.teal', 'utf8')
  let inserts = { TMPL_NUM_ASSETS: assets.length,
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

    const prog = await algod.compile(teal).do()
    let clearTeal  = await fs.readFile('clear.teal', 'utf8')
    const clear = await algod.compile(clearTeal).do()
    console.log(prog, clear)
    let appArgs = null
    let createTxn = await algod.makeApplicationCreateTxn(addr, params, OnApplicationComplete.NoOpOC, prog, clear, 1,1, 1, 1, appArgs)
    
    return createTxn
  }
}

