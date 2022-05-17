import MyAlgoConnect from '@randlabs/myalgo-connect'
import {getAlgod, getIndexer} from './access.mjs'
import algosdk from 'algosdk'
import {makeSwapApp, fundCallTransferTxns} from './makesale.mjs'
import delay from 'delay'

let algod = getAlgod('MAINNET')
let indexer = getIndexer('MAINNET')

const myAlgoWallet = new MyAlgoConnect()

const print = console.log, error = console.error

const doc = window.document
const qa = s => doc.querySelectorAll(s)
const qe = s => qa(s)[0]

window.appId = -1

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
  let price = qe('#price').value
  let max = qe('#max').value
  
  let assets = [asset1*1]
  if (asset2) assets.push(asset2 * 1)
  if (asset3) assets.push(asset3 * 1)

  console.log({addr,redeemAsset,assets})
  let params = await algod.getTransactionParams().do()
  let txn = await makeSwapApp({addr, assets, params, price, max, redeemAsset, compile: true})

  console.log(txn)

  const signedTxn = await myAlgoWallet.signTransaction(txn.toByte())
  let response
  try {
    response = await algod.sendRawTransaction(signedTxn.blob).do()  
  } catch (e) {
  	status(e.message)
  	return
  }
  console.log(response)
  let info = await waitForTxnInfo(response.txId)
  localStorage.setItem('swap_appid', info.appid)
  status('Application index: '+ info.appid)
  window.appId = info.appid
  window.appIndex = info.appid
  window.appAddress = algosdk.getApplicationAddress(info.appid)
  qe('#appaddress').innerHTML = window.appAddress
  localStorage.setItem('swap_app_address', window.appAddress)
  localStorage.setItem('swap_app_index', window.appIndex)
  qe('#showinfo').style.display = 'block'
  return false
}

const saveInputs = () => {
  let redeem = qe('#redeem').value
  let asset1 = qe('#asset1').value
  let asset2 = qe('#asset2').value
  let asset3 = qe('#asset3').value
  let price = qe('#price').value
  let max = qe('#max').value
  let addr = qe('#addr').innerHTML
  if (!price) price = 0
  if (!max) max = 99999999
  let obj = {redeem,asset1,asset2,asset3,addr,max,price}
  let json = JSON.stringify(obj)
  localStorage.setItem('swap_inputs', json)	
}

const loadInputs = () => {
  let json = localStorage.getItem('swap_inputs')
  let obj = JSON.parse(json)
  if (!obj) return
  let {redeem,asset1,asset2,asset3,addr,max,price} = obj
  qe('#redeem').value = obj.redeem
  let redeemAsset = redeem
  if (addr) qe('#addr').innerHTML = addr
  if (asset1) qe('#asset1').value = asset1
  if (asset2) qe('#asset2').value = asset2
  if (asset3) qe('#asset3').value = asset3
  if (max) qe('#max').value = max
  if (price && price>0) qe('#price').value = price
  window.appAddress = localStorage.getItem('swap_app_address')
  window.appIndex = localStorage.getItem('swap_app_index') * 1
  status(window.appIndex)
  if (window.appAddress) {
    qe('#appaddress').innerHTML = window.appAddress
    qe('#showinfo').style.display = 'block'

    qe('#embed').value = `<iframe class="embedswap" src="https://swap.algonfts.art/swap.html?label=Swap!&appAddress=${appAddress}&appIndex=${appIndex}&redeemAsset=${redeemAsset}&asset1=${asset1}&asset2=${asset2}&asset3=${asset3}">
     </iframe>`
  }
}

const txninfo = async (txid) => {	
  let response = await indexer.searchForTransactions().txid(txid).do()
  if (!response) return
  print(response)
  if (response.transactions.length == 0) return
  
  for (let txn of response.transactions) {
    print(txn)
    if (txn['created-application-index']) response.appid = txn['created-application-index']
    if (txn['inner-txns']) {
    	for (let t of txn['inner-txns']) {
    		print(t)
    		
    	}
    }
  }
  return response
}

const waitForTxnInfo = async (txid) => {
  let info
  let tries = 0
  status('Waiting for transaction confirmation..')
  while (!info && tries < 50) {
    await delay(500)
    status('..')
    await delay(500)
    status('Waiting for transaction confirmation..')
    info = await txninfo(txid)    
    tries += 1
  }
  return info
}

const fundAndTransfer = async () => {
  const params = await algod.getTransactionParams().do()
  let redeemAsset = qe('#redeem').value * 1
  let asset1 = qe('#asset1').value
  let asset2 = qe('#asset2').value
  let asset3 = qe('#asset3').value
  let addr = qe('#addr').innerHTML
  
  let assets = [asset1*1]
  if (asset2) assets.push(asset2 * 1)
  if (asset3) assets.push(asset3 * 1)

  let fund = 1000000
  let amount = qe('#amount').value * 1
  if (amount < 1 || isNaN(amount)) {
  	status('Specify amount of redeemable to transfer.')
  	return
  }
  let appIndex = window.appIndex
  let txns = await fundCallTransferTxns({addr, appIndex, appAddress, redeemAsset,
                                         assets, amount, fund, params})
  
  print(JSON.stringify(txns,null,4))
  let txs = txns.map( t => t.toByte() )
  let signed = await myAlgoWallet.signTransaction(txs)
  signed = signed.map (s => s.blob)    
  console.log(signed)
  status("Sending fund..")
  let res = await algod.sendRawTransaction(signed[0]).do()  
  console.log(res)
  status(res.txId)
  status("Sending call..")
  res = await algod.sendRawTransaction(signed[1]).do()  
  status(res.txId)
  for (let i = 2; i < signed.length; i++) {
    print("Sending transfer..")  
    res = await algod.sendRawTransaction(signed[i]).do()  
    status(res.txId)
  }

  qe('#embed').value = `<iframe class="embedswap" src="https://swap.algonfts.art/swap.html?label=Swap!&appAddress=${appAddress}&appIndex=${appIndex}&redeemAsset=${redeemAsset}&asset1=${asset1}&asset2=${asset2}&asset3=${asset3}">
     </iframe>`  
}

const transfer = async () => {
  let appIndex = window.appIndex
  let assetid = qe('#xferasset').value * 1
  let amount = qe('#xferamt').value * 1
  let address = qe('#addr').innerHTML
  
  const params = await algod.getTransactionParams().do()

  let callTransfer = new Buffer("transfer")
  callTransfer = new Uint8Array(callTransfer)
  let argamount = algosdk.encodeUint64(amount)
  
  let foreignAssets = [assetid]
  let call = await algosdk.makeApplicationCallTxnFromObject({from: address, foreignAssets, appArgs: [callTransfer, argamount], appIndex, 
     onComplete: algosdk.OnApplicationComplete.NoOpOC, suggestedParams: params })

  const myAlgoConnect = new MyAlgoConnect()
  const signedTxn = await myAlgoConnect.signTransaction(call.toByte())  	
  const response = await algod.sendRawTransaction(signedTxn.blob).do()  
  console.log(response)
  status(JSON.stringify(response) + '<br>Transfer success')  
}


const closeApp = async (appIndex) => {
  const params = await algod.getTransactionParams().do()

  const txn = {
    ...params,
    type: "appl",
    appOnComplete: 2,
    from: address,
    appIndex
  }

  const myAlgoConnect = new MyAlgoConnect()
  const signedTxn = await myAlgoConnect.signTransaction(txn)  	
  const response = await algod.sendRawTransaction(signedTxn.blob).do()  
  console.log(response)
  status(JSON.stringify(response))
  
}

const delApp = async (appIndex) => {
  const params = await algod.getTransactionParams().do()

  const txn = {
    ...params,
    type: "appl",
    appOnComplete: 5,
    from: address,
    appIndex
  }

  const myAlgoConnect = new MyAlgoConnect()
  const signedTxn = await myAlgoConnect.signTransaction(txn)  	
  const response = await algod.sendRawTransaction(signedTxn.blob).do()  
  console.log(response)
  status(JSON.stringify(response))
}

const status = (s) => {
  qe('#status').innerHTML = s	
}

const closeDel = async (appIndex) => {
  await closeApp(appIndex)
  status('Closeout OK')
  localStorage.setItem('swap_app_status', 'closed')
  await delApp(appIndex)
  status('App Deleted')
  localStorage.setItem('swap_app_status', 'deleted')
}


Object.assign(window, {qa, qe, myAlgoWallet, make, fetchjson, fetchtext,
                       connect, connect_, showAddress, loadInputs, saveInputs,
                       closeApp, delApp, fundAndTransfer, transfer})

showAddress(address)

loadInputs()
