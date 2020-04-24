const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

router.get('/searchdata', async (req, res) => {
  let reqData = req.query.searchval
  let searchData = '%' + reqData + '%'
  let reqId = parseInt(reqData) === NaN ? 0 : parseInt(reqData)

  console.log("reqId:"+ parseInt(reqData))
  console.log("reqId:"+ reqId)
  console.log("reqId777:"+ 111)
  console.log("reqId666:"+ (NaN === NaN))
  // let data = await db("select * from goods where goods_name like '" + searchData + "' or cat_id = " + reqId)
  let data = await db("select * from goods where goods_name like '" + searchData + "'")

  if (data.length > 0) {
    let message = {}
    message.total = 10
    message.pagenum = 1
    message.goods = data
    let returnData = dealData.dealReturnData(message)
    res.send(returnData)
  } else {
    let returnData = dealData.dealReturnData(data)
    res.send(returnData)
  }
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