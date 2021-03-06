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

const jwt = require('jsonwebtoken')

/* router.get('/abc', async (req, res) => {
  let data = await db("select * from user")
  res.send(data)
})
 */
router.post('/login', async (req, res) => {
  if (req.body.code) {
    let options = {
      method: 'POST',
      url: 'https://api.weixin.qq.com/sns/jscode2session?',
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
          "code": "尴尬了,GG"
        })
      } else {
        // 拿到session_key和openid,返回值转json字符串
        let _data = JSON.parse(body)
        console.log(_data)
        // let _l = jwt.sign(req.body.code, _data.openid, _data.session_key)
        let token = jwt.sign(_data, _data.openid, {expiresIn: '7 days'});
        console.log("token:",token);

        //success
        jwt.verify(token, _data.openid, function(err, decoded) {
          if(decoded){
            console.log("success?:",decoded) // bar
            //save in db 
          }else{
            
          }
        });
        // 数据库操作，当数据库没有该openid,插入，当查询到openid时更新token

      }
    })
  }

  let data = { a: 1 }
  res.send(data)
})

module.exports = router