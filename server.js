const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')

const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())
app.use('/tmp', express.static('tmp'))

const puppeteer = require('puppeteer')

/*Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)

  next()
})*/

var whitelist = ['http://localhost:3000', 'http://localhost', 'http://localhost:4000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))

app.post('/api/convert/svg', async (req, res) => {
  const svg = req.body.svg

  if (!svg) {
    res.status(500)
    return
  }

  const productSVG = `product-${new Date().getTime()}.svg`;
  fs.writeFile(`./tmp/${productSVG}`, svg, async(err) => {
    if (err) {
      return console.log(err)
    }

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(`https://imagehelper.herokuapp.com/tmp/${productSVG}`)

    const productPNG = productSVG.replace('.svg','.png');
    await page.screenshot({ path: `./tmp/${productPNG}` }).then((response) => {
      res.json({url: `https://imagehelper.herokuapp.com/tmp/${productPNG}`})
      console.log({url: `https://imagehelper.herokuapp.com/tmp/${productPNG}`})
      browser.close()
    })
  })
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
