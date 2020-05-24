const express = require('express')
const svgToImg = require('svg-to-img')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())

/* Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)

  next()
})*/
app.use(cors())

app.post('/api/convert/svg', (req, res) => {
  const svg = req.body.svg
  console.log(req.body)
  
  if(!svg) {
    res.status(500)
    return
  }

  (async () => {
    const image = await svgToImg.from(svg).toPng();
    res.type('png')
    res.send(image)
  })();
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
