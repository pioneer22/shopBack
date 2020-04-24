const express = require('express')
const router = express.Router()

/* 处理node的request请求 */
const request = require('request')

let db = require('../helper/db')

/* router.get('/abc', async (req, res) => {
  let data = await db("select * from user")
  res.send(data)
})
 */
router.post('/login', async (req, res) => {
  if (res.body.code) {
    let options = {
      method: 'POST',
      url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + res.body.code + '&grant_type=authorization_code',
      formData: {
        appid: wx.appid,
        secret: wx.secret,
        js_code: req.body.code,
        grant_type: 'authorization_code'
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