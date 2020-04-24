const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// 用于获取post请求传来的数据
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* // 自定义跨域中间件
var allowCors = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  next();
};

//使用跨域中间件
app.use(allowCors); */

app.all("*", function (req, res, next) {
  var orginList = [
    "http://hwygzsj.cn",
    "http://localhost"
  ]

  console.log(req.headers.host)
  console.log(req)

  if (orginList.includes(req.headers.origin)) {
    console.log(66666)
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", req.headers.origin);
  }
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == 'options')
    res.send(200);  //让options尝试请求快速结束
  else
    next();
})

// 允许跨域 npm install cors
// app.use(require('cors')())

app.use(express.json())

app.use('/api/address', require(__dirname + '/modules/address'))
app.use('/api/brand', require(__dirname + '/modules/brand'))
app.use('/api/category', require(__dirname + '/modules/category'))
app.use('/api/catitems', require(__dirname + '/modules/catitems'))
app.use('/api/china-city', require(__dirname + '/modules/china-city'))
app.use('/api/floor', require(__dirname + '/modules/floor'))
app.use('/api/goods', require(__dirname + '/modules/goods'))
app.use('/api/order', require(__dirname + '/modules/order'))
app.use('/api/swiper', require(__dirname + '/modules/swiper'))
app.use('/api/user', require(__dirname + '/modules/user'))

let port = 7777
app.listen(port, () => {
  console.log(`running at the port ${port}`)
})

module.exports = app
