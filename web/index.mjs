import MyAlgoConnect from '@randlabs/myalgo-connect'
import {getAlgod} from './access.mjs'
import algosdk from 'algosdk'
import {makeSwapApp} from './makeswap.mjs'
import delay from 'delay'

let algod = getAlgod('MAINNET')

const myAlgoWallet = new MyAlgoConnect()

const print = console.log, error = console.error

const doc = window.document
const qa = s => doc.querySelectorAll(s)
const qe = s => qa(s)[0]

let address, addresses

address = localStorage.getItem('swapaddr')


const showAddress = addr => qe('#addr').innerHTML = addr

const connect_ = async () => {
  address = (await myAlgoWallet.connect()).map(a => a.address)[0]  
  if (address) {
    showAddress(address)
    localStorage.setItem('swapaddr', address)
  }
}

const connect = () => connect_().catch(error)

const fetchjson = async url => await (await fetch(url)).json()

const fetchtext = async url => await (await fetch(url)).text()

const make = async () => {
  console.log("make")
  let redeemAsset = qe('#redeem').value
  let asset1 = qe('#asset1').value
  let asset2 = qe('#asset2').value
  let asset3 = qe('#asset3').value
  let addr = qe('#addr').innerHTML
  
  let assets = [asset1*1]
  if (asset2) assets.push(asset2 * 1)
  if (asset3) assets.push(asset3 * 1)
  assets = assets.join(',')
  console.log({addr,redeemAsset,assets})
  let params = await algod.getTransactionParams().do()
  let txn = await makeSwapApp({addr, assets, params, redeemAsset, compile: true})

  console.log(txn)

  const signedTxn = await myAlgoWallet.signTransaction(txn.toByte())
  const response = await algod.sendRawTransaction(signedTxn.blob).do()  
  console.log(response)
  let info = await waitForTxnInfo(response.txId)
  return false
}

const saveInputs = () => {
  let redeem = qe('#redeem').value
  let asset1 = qe('#asset1').value
  let asset2 = qe('#asset2').value
  let asset3 = qe('#asset3').value
  let addr = qe('#addr').innerHTML
  let obj = {redeem,asset1,asset2,asset3,addr}
  let json = JSON.stringify(obj)
  localStorage.setItem('swap_inputs', json)	
}

const loadInputs = () => {
  let json = localStorage.getItem('swap_inputs')
  let obj = JSON.parse(json)
  if (!obj) return
  let {redeem,asset1,asset2,asset3,addr} = obj
  qe('#redeem').value = obj.redeem
  if (addr) qe('#addr').innerHTML = addr
  if (asset1) qe('#asset1').value = asset1
  if (asset2) qe('#asset2').value = asset2
  if (asset3) qe('#asset3').value = asset3
}

const waitForTxnInfo = async (txid) => {
  let txninfo
  let tries = 0
  while (!txninfo && tries < 50) {
    await delay(1000)
    txninfo = await txninfo(txid)    
    tries += 1
  }
  return txninfo
}

const txninfo = async (txid) => {	
  let response = await indexer.searchForTransactions().txid(txid).do()
  if (!response) return
  print(response)

  for (let txn of response.transactions) {
    print(txn)
    printLogs(txn)
    if (txn['inner-txns']) {
    	for (let t of txn['inner-txns']) {
    		print(t)
    		printLogs(t)
    	}
    }
  }
  return response
}
 


Object.assign(window, {qa, qe, myAlgoWallet, make, fetchjson, fetchtext,
                       connect, connect_, showAddress, loadInputs, saveInputs})

showAddress(address)

loadInputs()
