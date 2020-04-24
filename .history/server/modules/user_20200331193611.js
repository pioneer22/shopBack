const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser')
// 用于获取post请求传来的数据
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

/* 处理node的request请求 */
const request = require('request')

let db = require('../helper/db')
let wx = require('../helper/wxconfig.json')

const jwt = require('jsonwebtokens')

/* router.get('/abc', async (req, res) => {
  let data = await db("select * from user")
  res.send(data)
})
 */
router.post('/login', async (req, res) => {
  if (res.body.code) {
    let options = {
      method: 'GET',
      url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + res.body.code + '&grant_type=authorization_code',
      data: {},
      header: {
        'content-type': 'json'
      },
      success(res) {
        var openid = res.data.openid //返回openid
        console.log('openid为' + openid);
      }
    }

    request(options, (error, response, body) => {
      if (error) {
        res.json({
          "status": "error",
          "code": ""
        })
      } else {
        let data = JSON.parse(body)
        
      }
    })
  }
  res.send(data)
})

module.exports = router