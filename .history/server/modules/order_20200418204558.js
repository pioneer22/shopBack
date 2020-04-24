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
      order_price + "',order_num='" + order_number + "',pay_status='" + pay_status + "' where order_id=" + id
    let result1 = await db(sql1)
    if (result1.affectedRows === 1) {
      let result2 = await db(sql)
      let sql2 = "select * from sp_order_goods where order_id=" + id
      let result3 = await db(sql2)
      result2.goods = result3
      returnData = dealData.dealReturnData(result2)
    }
  } else {
    returnData = dealData.constant('b')
  }
  res.send(data)
})

module.exports = router