import MyAlgoConnect from '@randlabs/myalgo-connect';
const myAlgoWallet = new MyAlgoConnect();

const print = console.log, error = console.error

const doc = window.document
const qa = s => doc.querySelectorAll(s)
const qe = s => qa(s)[0]

let address, addresses

address = 'KNEQRACEJA4MO4J6HXJWNZE3PZZW7ICZAQPJ7TC4QCG6Z5F3ZJIGJX6KZE'

const showAddress = addr => qe('#addr').innerHTML = addr

const connect_ = async () => {
  address = (await myAlgoWallet.connect()).map(a => a.address)[0]  
  showAddress(address)
}

const connect = () => connect_().catch(error)

const fetch2 = async url => await (await fetch(url))

const make = async () => {
  let redeem = qe('#redeem').value
  let asset1 = qe('#asset1').value
  let asset2 = qe('#asset2').value
  let asset3 = qe('#asset3').value
  let addr = qe('#addr').innerHTML
  
  let assets = [asset1*1]
  if (asset2) assets.push(asset2 * 1)
  if (asset3) assets.push(asset3 * 1)
  assets = assets.join(',')
  let data = await fetch2(`/make?addr=${addr}&redeemAsset=${redeem}&assets=${assets}`)
  console.log(data)
  const signedTxn = await myAlgoWallet.signTransaction(txn.toByte())
  const response = await algod.sendRawTransaction(signedTxn.blob).do()  
}


Object.assign(window, {qa, qe, myAlgoWallet, make,
                       connect, connect_, showAddress})

showAddress(address)
