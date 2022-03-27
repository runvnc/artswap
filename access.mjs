import algosdk from 'algosdk'

export const getIndexer = (net) => {
  if (net == 'MAINNET') {
    const baseServer = "https://mainnet-algorand.api.purestake.io/idx2"
    const port = ''
    const token = {'X-API-key' : 'VGgpKbdrVC3PQz4vCHMIS9UvoPHkLZJI16RWSOi9'}
    return new algosdk.Indexer(token, baseServer, port)
  } else if (net == 'DEV') {
    
  
  } else {
    let net = 'https://algoindexer.testnet.algoexplorerapi.io'
    return new algosdk.Indexer('', net,'')
    return indexer
  }
}

export function getAlgod(which) {
  let net = 'https://node.algonfts.art'
  let token = '8854a3be0df4c5495a9e8f62ff7b0b74dc3fe197351bff3d66c4996201a912d0'
  let port = ''
  if (which == 'TESTNET') {
    net = 'https://node.testnet.algoexplorerapi.io'
    token = ''
  } else if (which == 'DEV') {
    net = 'http://localhost'
    token = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    port = 4001
  }
  let algod = new algosdk.Algodv2(token, net,port)
  return algod
}
