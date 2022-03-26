import {makeSwapApp} from './makeswap.mjs'

const test = async () => {  
  let addr = 'LLDNYPG44BQTJFRLRGWUPF5466EIS26R3ZDVFR7IAFPAZEQ62IYZXRV6L4'
  let assets = [2]
  let redeemAsset = 1
  await makeSwapApp({addr, assets, redeemAsset, compile: false})
}


test().catch(console.error)
