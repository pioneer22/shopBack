const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

router.get('/searchdata', async (req, res) => {
  let reqData = req.query.searchval
  let data = await db('select * from goods where goods_name like %' + reqData + '% or cat_id =' + reqData )
  let returnData = {
    "message": {
      "total": 10,
      "pagenum": 1,
      "goods": []
    },
    "meta": {
      "msg": "获取失败",
      "status": 0
    }
  }
  if (data.length > 0) {
    returnData.message.goods = data
    returnData.meta = {
      "msg": "获取成功",
      "status": 200
    }
  }
  res.send(returnData)
})

/* 商品详情 */
router.get('/goodsdetails', async (req, res) => {
  /* 接受商品ID */
  let goods_id = parseInt(req.query.goods_id)
  let data = await db('select * from goods where goods_id =' + goods_id)
  let pics = await db('select * from pics where goods_id =' + goods_id)
  let attrs = await db('select * from attrs where goods_id =' + goods_id)
  if (data.length > 0) {
    let message = data[0]
    message.pics = pics
    message.attrs = attrs
    let returnData = dealData.dealReturnData(message)
    res.send(returnData)
  } else {
    let returnData = dealData.dealReturnData(data)
    res.send(returnData)
  }
})

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router