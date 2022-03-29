import express from 'express'
import compression from 'compression'
import serveIndex from 'serve-index'

const app = express()

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

app.use(compression())

app.use(express.static('web'))

const port = 8033

app.get('/make', async (req, res) => {
  let {addr, assets, redeemAsset} = req.query
  assets = assets.split(',')
  print({addr, assets, redeemAsset})
  let algod = getAlgod('MAINNET')

  let params = await algod.getTransactionParams().do()
  let txn = await makeSwapApp({addr, assets, params, redeemAsset, compile: true})
  res.json(txn)
})


const server = app.listen(port, () => {
  console.log(`Market server on port ${port}`)
  
})
