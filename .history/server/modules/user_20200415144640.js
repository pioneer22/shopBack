const express = require('express')
const router = express.Router()

/* 处理node的request请求 */
const request = require('request')

const db = require('../helper/db')
const wx = require('../helper/wxconfig.json')
const WXBizDataCrypt = require('../utils/WXBizDataCrypt')
const dealData = require('../utils/dealData')

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
        let token = jwt.sign(_data, _data.openid, { expiresIn: '30 days' });

        // 查询openid是否存在
        let check_openid = await db("select * from sp_user where openid='" + p_data.openId + "'")

        // 不存在，写入数据库
        if (check_openid.length === 0) {
          let time = dealData.getTime(new Date())
          let sql = "insert into sp_user (nick_name,avatarUrl,user_sex,openid,create_time,update_time,token) values ('" + p_data.nickName + "','" + p_data.avatarUrl + "'," + p_data.gender + ",'" + p_data.openId + "','" + time + "','" + time + "','" + token + "')"
          await db(sql)
        } else {
          // 存在时更新token
          await db("update sp_user set token='" + token + "' where openid ='" + p_data.openId + "'")
        }
        res.send({ 'token': token })
      }
    })
  }
})

// 获取个人信息
router.get('/getUser', async (req, res) => {
  let token = req.headers.token
  let data = await db("select * from sp_user where token='" + token + "'")

  if (data.length > 0) {
    let openid = data[0].openid

    //验证token
    jwt.verify(token, openid, function (err, decoded) {
      if (decoded) {
        console.log("success:", decoded)
        res.send(data)
      } else {
        res.send({ "res": "The Token is invalid!" })
        // 前台跳转到登陆页面，重新传参获取token
      }
    });
  } else {
    res.send({ "res": "Can't find the token!" })
  }
})

// 获取用户数据列表
router.get('/users', async (req, res) => {
  let sql = "select * from sp_user"
  let data = await db(sql)
  let returnData = dealData.dealReturnData(data)
  res.send(returnData)
})

// 删除用户
router.post('/deleteUser', async (req, res) => {
  let openid = req.body.openid
  let data = await db("delete from sp_user where openid='" + openid + "'")
  let returnData = {
    meta: {
      msg: '删除成功',
      status: 200
    }
  }
  if (data.affectedRows !== 1) {
    returnData.meta.msg = "删除失败！"
    returnData.meta.status = 0
  }
  res.send(returnData)
})


module.exports = router