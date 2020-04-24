// 收货地址
const express = require('express')
const router = express.Router()

let db = require('../helper/db')

// 新增地址
router.post('/addAddress', async (req, res) => {
  let token = req.headers.token
  let name = req.body.name
  let address = req.body.address
  let tel = req.body.tel
  let code = req.body.code ? req.body.code : '000000'
  let data = await db("select * from sp_user where token='" + token + "'")
  let returnData = {}

  if (data.length > 0) {
    let openid = data[0].openid
    //验证token
    await jwt.verify(token, openid,async function (err, decoded) {
      if (decoded) {
        let sql = "insert into sp_consignee (openid,cgn_name,cgn_address,cdn_tel,cgn_code) values ('" + openid + "','" + name + "','" + address + "','" + tel + "','" + code + "')"
        await db(sql)
        let sql1 = "select * from sp_consignee where openid='" + openid + "'"
        let result = await db(sql1)
        returnData = dealData.dealReturnData(result)
      } else {
        // 前台跳转到登陆页面，重新传参获取token
        returnData = dealData.dealReturnData({ "res": "The Token is invalid!", "status": 0 })
      }
    });
  } else {
    returnData = dealData.dealReturnData({ "res": "Can't find the token!", "status": 404 })
  }
  res.send(returnData)
})

/* router.get('/abc', async (req, res) => {
  console.log("abc:", req.query)
  let data = await db('select * from china-city')
  res.send(data)
}) */

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router