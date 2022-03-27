import express from 'express'
import compression from 'compression'
import serveIndex from 'serve-index'

const app = express()

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

app.use(compression())

app.use(express.static('web'))

const port = 8033

const server = app.listen(port, () => {
  console.log(`Market server on port ${port}`)
  
})
