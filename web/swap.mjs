import {createSwapTxns} from './dotxns.mjs'
import {getAlgod, getIndexer} from './access.mjs'
import algosdk from 'algosdk'

import MyAlgoConnect from '@randlabs/myalgo-connect'
import delay from 'delay'

let algod = getAlgod('MAINNET')
let indexer = getIndexer('MAINNET')

const myAlgoWallet = new MyAlgoConnect()

const print = console.log, error = console.error

const doc = window.document
const qa = s => doc.querySelectorAll(s)
const qe = s => qa(s)[0]

let customer

const showAddress = (a) => {
  qe('#addr').innerHTML = a	
}

const loadAccount = () => {
  let addr = localStorage.getItem('swap_customer')
  if (addr) {
  	customer = addr
    qe('#btngo').style.display = 'inline-block'
    showAddress(customer)
    return customer
  } else {
  }
}

loadAccount()

const connect = async () => {
    customer = (await myAlgoWallet.connect()).map(a => a.address)[0]  
    if (customer) {
      showAddress(customer)
      localStorage.setItem('swap_customer', customer)
      return
    }  		
}

const urlParams = new URLSearchParams(window.location.search)

let btntext = urlParams.get('label')
qe('#btngo').innerHTML = btntext
  
const go = async () => {  
  let algod = getAlgod('MAIN')

  if (!customer) return (await connect())

  let appAddress = urlParams.get('appAddress')
  let redeemAsset = urlParams.get('redeemAsset')*1
  let appIndex = urlParams.get('appIndex')*1
  let asset1 = urlParams.get('asset1')
  
  let asset2 = urlParams.get('asset2')
  let asset3 = urlParams.get('asset3')

  
  
  let assets = [asset1 * 1]
  if (asset2) assets.push(asset2*1)
  if (asset3) assets.push(asset3*1)

  let amount = qe('#amount').value * 1
  let params = await algod.getTransactionParams().do()
  
  let txns = await createSwapTxns({params, redeemAsset, customer, appAddress, appIndex, assets, amount})  
  
  print(txns)
  txns = txns.map( t => t.toByte())
  let signed = await myAlgoWallet.signTransaction(txns)
  signed = signed.map( s => s.blob)
  try {
    let res = await algod.sendRawTransaction(signed).do()
   
    console.log(res.txId)
    qe('#txid').innerHTML = `<p>Transfer succeeded!</p>`
  } catch (e) {
  	qe('#txid').innerHTML = e.message
  }
}

window.go = go
window.connect = connect

