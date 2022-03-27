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
  let data = await fetch2(`/make`)
  console.log(data)
}


Object.assign(window, {qa, qe, myAlgoWallet, make,
                       connect, connect_, showAddress})

showAddress(address)
