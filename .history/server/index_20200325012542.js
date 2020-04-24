const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// 用于获取post请求传来的数据
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 允许跨域 npm install cors
app.use(require('cors')())
app.use(express.json())

var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123abc',
  database: 'xcxsc'
})

connection.connect()

/* app.use('/api/address', require(__dirname + '/modules/address'))
app.use('/api/brand', require(__dirname + '/modules/brand'))
app.use('/api/category-brand', require(__dirname + '/modules/category-brand'))
app.use('/api/category', require(__dirname + '/modules/category'))
app.use('/api/catitems', require(__dirname + '/modules/catitems'))
app.use('/api/china-city', require(__dirname + '/modules/china-city'))
app.use('/api/goods', require(__dirname + '/modules/goods'))
app.use('/api/order-details', require(__dirname + '/modules/order-details'))
app.use('/api/order-status', require(__dirname + '/modules/order-status'))
app.use('/api/order', require(__dirname + '/modules/order'))
app.use('/api/swiper', require(__dirname + '/modules/swiper')) */
app.use('/api/user', require(__dirname + '/modules/user'))

let port = 7777
app.listen(port, () => {
  console.log(`running at the port ${port}`)
})

module.exports = app
