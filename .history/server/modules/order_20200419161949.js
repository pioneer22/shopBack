const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

// 订单数据列表
router.get('/orders', async (req, res) => {
  let pagenum = parseInt(req.query.pagenum)
  let pagesize = parseInt(req.query.pagesize)

  let sql = "select * from sp_order limit " + (pagenum - 1) * pagesize + "," + pagesize
  let result = await db(sql)

  let sql1 = "select count(*) as num from sp_order"
  let result1 = await db(sql1)

  let returnData = {}
  if (result.length > 0) {
    let data = {
      "total": result1[0].num,
      "pagenum": pagenum,
      "goods": result
    }
    returnData = dealData.dealReturnData(data)
  } else {
    returnData = dealData.constant('d')
  }
  res.send(returnData)
})

// 修改订单状态
router.put('/changeOrders', async (req, res) => {
  let id = parseInt(req.query.id)
  let sql = "select * from sp_order where order_id=" + id
  let result = await db(sql)
  let is_send = '', order_pay = '', order_price = '', order_number = '', pay_status = '', returnData = {}

  if (result.length > 0) {
    is_send = req.body.is_send ? (req.body.is_send == 1 ? '是' : '否') : result[0].is_send
    order_pay = req.body.order_pay ? req.body.order_pay : result[0].order_pay
    order_price = req.body.order_price ? req.body.order_price : result[0].order_price
    order_number = req.body.order_number ? req.body.order_number : result[0].order_number
    pay_status = req.body.pay_status ? req.body.pay_status : result[0].pay_status

    let sql1 = "update sp_order set is_send='" + is_send + "',order_pay='" + order_pay + "',order_price='" +
      order_price + "',order_number='" + order_number + "',pay_status='" + pay_status + "' where order_id=" + id
    let result1 = await db(sql1)
    if (result1.affectedRows === 1) {
      let result2 = await db(sql)
      let sql2 = "select * from sp_order_goods where order_id=" + id
      let result3 = await db(sql2)
      result2[0].goods = result3
      returnData = dealData.dealReturnData(result2[0])
    }
  } else {
    returnData = dealData.constant('b')
  }
  res.send(returnData)
})

// 查看订单详情
router.get('/details', async (req, res) => {
  let id = parseInt(req.query.id)

  let sql = "select * from sp_order where order_id=" + id
  let result = await db(sql)
  let returnData = {}

  if (result.length > 0) {
    let sql1 = "select * from sp_order_goods where order_id=" + id
    let result1 = await db(sql1)
    result[0].goods = result1
    returnData = dealData.dealReturnData(result[0])
  } else {
    returnData = dealData.constant('d')
  }
  res.send(returnData)
})

// 删除订单信息
router.delete('/delete', async (req, res) => {
  let id = parseInt(req.query.id)

  let sql = "delete from sp_order where order_id=" + id
  let result = await db(sql)

  let sql1 = "delete from sp_order_goods where order_id=" + id
  await db(sql1)
  let returnData = result.affectedRows === 1 ? dealData.constant('A') : dealData.constant('a')
  res.send(returnData)
})

module.exports = router