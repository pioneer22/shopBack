const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser')
// 用于获取post请求传来的数据
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

/* 处理node的request请求 */
const request = require('request')

const db = require('../helper/db')
const wx = require('../helper/wxconfig.json')
const WXBizDataCrypt = require('../utils/WXBizDataCrypt')
const dealDate = require('../utils/dealData')

const jwt = require('jsonwebtoken')

/* router.get('/abc', async (req, res) => {
  let data = await db("select * from user")
  res.send(data)
})
 */
router.post('/login', (req, res) => {
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

    request(options, async (error, response, body) => {
      if (error) {
        res.json({
          "status": "error",
          "code": "尴尬了,请求不到信息~"
        })
      } else {
        // 拿到session_key和openid,返回值转json字符串
        let _data = JSON.parse(body)

        let iv = req.body.iv
        let encryptedData = req.body.encryptedData

        // 解密个人数据
        var pc = new WXBizDataCrypt(wx.appid, _data.session_key)
        var p_data = pc.decryptData(encryptedData, iv)

        // 生成token
        let token = jwt.sign(_data, _data.openid, { expiresIn: '7 days' });

        // 查询openid是否存在
        let check_openid = await db("select * from user where openid='" + p_data.openId + "'")

        // 不存在，写入数据库
        if (check_openid.length === 0) {
          let time = dealDate.getTime(new Date())
          await db("insert into user (nickName,avatarUrl,sex,openid,addtime,token) values ('" + p_data.nickName + "','" + p_data.avatarUrl + "'," + p_data.gender + ",'" + p_data.openId + "','" + time + "','" + token + "')")
        } else {
          // 存在时更新token
          await db("update user set token='" + token + "' where openid ='" + p_data.openId + "'")
        }

        res.send({ 'token': token })
        //验证token
        /*  jwt.verify(token, _data.openid, function (err, decoded) {
           if (decoded) {
             console.log("success?:", decoded) // bar
             //save in db 
           } else {
 
           }
         }); */
        // 数据库操作，当数据库没有该openid,插入，当查询到openid时更新token

      }
    })
  }
})

module.exports = router