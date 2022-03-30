import MyAlgoConnect from '@randlabs/myalgo-connect'
import {getAlgod} from '../access.mjs'
import algosdk from 'algosdk'

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

const fetchbody = async url => await (await fetch(url)).body()

const make = async () => {
  console.log("make")
  let redeem = qe('#redeem').value
  let asset1 = qe('#asset1').value
  let asset2 = qe('#asset2').value
  let asset3 = qe('#asset3').value
  let addr = qe('#addr').innerHTML
  
  let assets = [asset1*1]
  if (asset2) assets.push(asset2 * 1)
  if (asset3) assets.push(asset3 * 1)
  assets = assets.join(',')
  console.log({addr,redeem,assets})
  let txn = await fetchjson(`/make?addr=${addr}&redeemAsset=${redeem}&assets=${assets}`)
  console.log(txn)
  print('create Transaction object')
  //txn = new algosdk.Transaction(txn)
  let algod = getAlgod('MAINNEt')
  const signedTxn = await myAlgoWallet.signTransaction(txn)
  const response = await algod.sendRawTransaction(signedTxn.blob).do()  
  console.log(response)
  return false
}


Object.assign(window, {qa, qe, myAlgoWallet, make, fetchjson, fetchbody,
                       connect, connect_, showAddress})

showAddress(address)
