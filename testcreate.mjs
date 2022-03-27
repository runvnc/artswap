import {makeSwapApp} from './makeswap.mjs'

const test = async () => {  
  let addr = 'sdfsd'
  let assets = [2]
  let redeemAsset = 1
  await makeSwapApp({addr, assets, redeemAsset, compile: true})
}


test().catch(console.error)
