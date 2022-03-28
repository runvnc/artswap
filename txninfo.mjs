#!/bin/env node
import {getIndexer} from './access.mjs'

const print = console.log

let indexer = getIndexer('DEV')

let txid = process.argv[2]
print(txid)

let opts = {}

let logsOnly = false

for (let a of process.argv) {
  if (a == '-l') logsOnly = true
}

const decodeB64 = (str) => Buffer.from(str, 'base64').toString('utf8')

const printLogs = (txn) => {
  if (txn.logs) {
	for (let l of txn.logs) print(decodeB64(l))	
  }
}

const go = async () => {
  let response = await indexer.searchForTransactions().txid(txid).do()
  if (!logsOnly) print(response)

  for (let txn of response.transactions) {
    if (!logsOnly) print(txn)
    printLogs(txn)
    if (txn['inner-txns']) {
    	for (let t of txn['inner-txns']) {
    		if (!logsOnly) print(t)
    		printLogs(t)
    	}
    }
  }
}

go().catch(console.error)
