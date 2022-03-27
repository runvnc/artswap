import {makeSwapApp} from './makeswap.mjs'
import {getAlgod} from './access.mjs'

const print = console.log

const test = async () => {  
  let algod = getAlgod('DEV')
  let params = await algod.getTransactionParams().do()
  
  let addr = 'KNEQRACEJA4MO4J6HXJWNZE3PZZW7ICZAQPJ7TC4QCG6Z5F3ZJIGJX6KZE'
  let assets = [2]
  let redeemAsset = 1
  let txn = await makeSwapApp({addr, assets, params, redeemAsset, compile: true})
  print(txn)
}


test().catch(console.error)
