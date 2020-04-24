const express = require('express')
const router = express.Router()

/* 处理node的request请求 */
const request = require('request')

const db = require('../helper/db')
const wx = require('../helper/wxconfig.json')
const WXBizDataCrypt = require('../utils/WXBizDataCrypt')
const dealDate = require('../utils/dealData')

const jwt = require('jsonwebtoken')

// 登陆
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

        // 解密个人数据
        var pc = new WXBizDataCrypt(wx.appid, _data.session_key)
        var p_data = pc.decryptData(req.body.encryptedData, req.body.iv)

        // 生成token
        let token = jwt.sign(_data, _data.openid, { expiresIn: '7 days' });

        // 查询openid是否存在
        let check_openid = await db("select * from user where openid='" + p_data.openId + "'")

        // 不存在，写入数据库
        if (check_openid.length === 0) {
          let time = dealDate.getTime(new Date())
          let sql = "insert into user (nickName,avatarUrl,sex,openid,addtime,token) values ('" + p_data.nickName + "','" + p_data.avatarUrl + "'," + p_data.gender + ",'" + p_data.openId + "','" + time + "','" + token + "')"
          await db(sql)
        } else {
          // 存在时更新token
          await db("update user set token='" + token + "' where openid ='" + p_data.openId + "'")
        }
        res.send({ 'token': token })
      }
    })
  }
})

// 获取个人信息
router.get('/getData', async (req, res) => {
  let token = req.headers.token
  let data = await db("select * from user where token='" + token + "'")

  if (data.length > 0) {
    let openid = data[0].openid

    //验证token
    jwt.verify(token, openid, function (err, decoded) {
      if (decoded) {
        console.log("success:", decoded)
        res.send(data)
      } else {
        res.send({ "res": "The Token is invalid!" })
      }
    });
  }
})


module.exports = router