import {makeSwapApp} from './makeswap.mjs'
import {getAlgod} from './access.mjs'
import algosdk from 'algosdk'

const print = console.log

let acct

const loadAccount = () => {
  acct = algosdk.mnemonicToSecretKey(process.env.ACCOUNT_MNEMONIC)
}

const testMakeApp = async () => {  
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
  let res = await algod.sendRawTransaction(signed).do()
  console.log(res)
}

const testFundXfer = async () => {
  let algod = getAlgod('DEV')

  loadAccount()

  let params = await algod.getTransactionParams().do()
  
  let addr = acct.addr
  let assets = [2]
  let redeemAsset = 1
  let amount = 1
  let fund = 1
  let appAddress = '2B3I4PZIAH7N6PEQANWHZRALX35SRWNHULIVYEB335VW7X3PKW4CTBYFPY'
  let txns = fundCallTransferTxns({addr, appAddress, redeemAsset, amount, fund, params}) {
  
  print(txns)
  let signed = []
  for (let txn of txns) signed.push(txn.signTxn(acct.sk))
  console.log(signed)
  for (let s of signed) {
    let res = await algod.sendRawTransaction(s).do()
    console.log(res)
  }
  
}

testFundXfer().catch(console.error)

