import {makeSwapApp} from './makeswap.mjs'
import {getAlgod} from './access.mjs'

const print = console.log

let acct

const loadAccount = () => {
  let acct = algosdk.mnemonicToSecretKey(process.env.ACCOUNT_MNEMONIC)
}

const test = async () => {  
  let algod = getAlgod('DEV')

  loadAccount()

  let params = await algod.getTransactionParams().do()
  
  //let addr = 'KNEQRACEJA4MO4J6HXJWNZE3PZZW7ICZAQPJ7TC4QCG6Z5F3ZJIGJX6KZE'
  let addr = acct.addr
  let assets = [2]
  let redeemAsset = 1
  let txn = await makeSwapApp({addr, assets, params, redeemAsset, compile: true})
  
  print(txn)
  let signed = txn.signTxn(acct.sk)
  console.log(signed)
  await algod.sendRawTransaction(signedTxn).do()
}


test().catch(console.error)
