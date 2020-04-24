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
  database: 'wzry'
})

connection.connect()

// app.use('/api/user', require(__dirname + '/modules/user'))
// app.use('/api/hero', require(__dirname + '/modules/hero'))
// app.use('/api/skill', require(__dirname + '/modules/skill'))


let port =6666
app.listen(port, () => {
  console.log(`running at the port ${port}`)
})

module.exports = app
