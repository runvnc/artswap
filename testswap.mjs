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
  let assets = [2]
  let amount = 1
  let appIndex = 4
  let appAddress = '2B3I4PZIAH7N6PEQANWHZRALX35SRWNHULIVYEB335VW7X3PKW4CTBYFPY'
  console.log({customer, appAddress})
  let txns = await createSwapTxns({params, customer, appAddress, appIndex, assets, amount})  
  
  print(txns)
  let signed1 = txns[0].signTxn(acct.sk)
  let signed2 = txns[1].signTxn(acct.sk)
  
  let res = await algod.sendRawTransaction([signed1,signed2]).do()
  console.log(res)
}

test().catch(console.error)
