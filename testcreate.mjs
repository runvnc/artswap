import {makeSwapApp, fundCallTransferTxns} from './makeswap.mjs'
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
  let fund = 1000000
  let appIndex = 9
  let appAddress = 'BAXQDLV55Y24TA35PSFOOQU6KCZT7AP3SMKW54GTDSN3DUQAFW7BYKKVRQ'
  console.log({addr, appAddress})
  let txns = await fundCallTransferTxns({addr, appIndex, appAddress, redeemAsset, amount, fund, params})
  
  print(JSON.stringify(txns,null,4))
  let signed = []
  for (let txn of txns) signed.push(txn.signTxn(acct.sk))
  console.log(signed)
  print("Sending fund..")
  let res = await algod.sendRawTransaction(signed[0]).do()  
  print(res)
  print("Sending call..")
  res = await algod.sendRawTransaction(signed[1]).do()  
  print(res)
  print("Sending transfer..")
  res = await algod.sendRawTransaction(signed[2]).do()  
  print(res)
}

//testMakeApp().catch(console.error)

testFundXfer().catch(console.error)

