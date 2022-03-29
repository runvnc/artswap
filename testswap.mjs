import {createSwapTxns} from './dotxns.mjs'
import {getAlgod} from './access.mjs'
import algosdk from 'algosdk'

const print = console.log

let acct

const loadAccount = () => {
  acct = algosdk.mnemonicToSecretKey(process.env.ACCOUNT2_MNEMONIC)
}

const test = async () => {  
  let algod = getAlgod('DEV')

  loadAccount()

  let params = await algod.getTransactionParams().do()
  
  let customer = acct.addr
  let assets = [51]
  let redeemAsset = 41
  let amount = 1
  let appIndex = 60
  let appAddress = 'MDT3YKSTRNM4ICLPIV7PD7YBRWME46I5FJG7YX7VB275LP5KHCMBSOBJHY'
  console.log({customer, appAddress})
  let txns = await createSwapTxns({params, redeemAsset, customer, appAddress, appIndex, assets, amount})  
  
  print(txns)
  let signed1 = txns[0].signTxn(acct.sk)
  let signed2 = txns[1].signTxn(acct.sk)
  let signed3 = txns[2].signTxn(acct.sk)
  
  let res = await algod.sendRawTransaction([signed1,signed2,signed3]).do()
  console.log(res)
}

test().catch(console.error)
