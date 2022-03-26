import {getAlgod} from './acces.mjs'

import fs from 'fs/promises'

export async function makeSwapApp({addr, assets, redeemAsset, compile: true }) {
  let teal = await fs.readFile('swap.teal')
  let inserts = { TMPL_NUM_ASSETS: assets.length,
                  TMPL_REDEEM_ASSET: redeemAsset}
  let n = 1
  for (let asa of assets) {
    inserts[`TMPL_ASSET${n}`] = asa
    n += 1
  }                  
  for (let key in inserts) {
    teal = teal.replaceAll(key, inserts[key])
  }
  console.log(teal)
  if (compile) {
    const compiledSmartContract = await algod.compile(teal).do()
  }
}

