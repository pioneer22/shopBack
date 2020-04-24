const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

// 商品列表数据
router.get('/goods', async (req, res) => {
  let pagenum = parseInt(req.query.pagenum) // 页码
  let pagesize = parseInt(req.query.pagesize) // 显示条数

  let sql = "select * from sp_goods limit(" + (pagenum - 1) + ")*" + pagesize + "," + pagesize


})

/* 商品列表搜索 */
router.get('/search', async (req, res) => {
  /* 搜索内容 */
  let reqData = req.query.searchval
  let reqId = isNaN(parseInt(reqData)) ? 0 : parseInt(reqData)
  let sql = "select * from goods where goods_name like '%" + reqData + "%' or cat_id = " + reqId
  let data = await db(sql)

  if (data.length > 0) {
    let message = {
      "total": 10,
      "pagenum": 1,
      "goods": data
    }
    let returnData = dealData.dealReturnData(message)
    res.send(returnData)
  } else {
    let returnData = dealData.dealReturnData(data)
    res.send(returnData)
  }
})

/* 商品详情 */
router.get('/details', async (req, res) => {
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

/* 商品搜索 */
router.get('/qsearch', async (req, res) => {
  let reqData = req.query.searchval
  let goods_id = isNaN(parseInt(reqData)) ? 0 : parseInt(reqData)
  let sql = "select goods_id,goods_name from goods where goods_name like '%" + reqData + "%' or goods_id = " + goods_id
  let data = await db(sql)

  let returnData = dealData.dealReturnData(data)
  res.send(returnData)
})


module.exports = router