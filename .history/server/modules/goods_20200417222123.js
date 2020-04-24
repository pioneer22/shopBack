const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

// 商品列表数据
router.get('/goods', async (req, res) => {
  let pagenum = parseInt(req.query.pagenum) // 页码
  let pagesize = parseInt(req.query.pagesize) // 显示条数

  let sql = "select goods_id,goods_name,goods_price,goods_number,goods_weight,goods_state,add_time,upd_time,hot_mumber,is_promote from sp_goods limit " + (pagenum - 1) * pagesize + "," + pagesize
  let result = await db(sql)

  let sql1 = "select count(*) as num from sp_goods"
  let result1 = await db(sql1)
  let returnData = {}
  let data = {
    "total": result1[0].num,
    "pagenum": pagenum,
    "goods": result
  }

  if (result.length > 0) {
    returnData = dealData.dealReturnData(data)
  } else {
    returnData = {
      "data": data,
      "meta": {
        "msg": '没有更多的数据',
        "status": 200
      }
    }
  }
  res.send(returnData)
})

// 添加商品
router.post('/addGoods', async (req, res) => {
  let goods_name = req.body.goods_name
  let goods_cat = req.body.goods_cat.split(",")
  let goods_price = req.body.goods_price
  let goods_number = req.body.goods_number
  let goods_weight = req.body.goods_weight
  let goods_introduce = req.body.goods_introduce ? req.body.goods_introduce : ''
  let pics = pics ? pics : []
  let attrs = attrs ? attrs : []
  let time = new Date().getTime()

  let sql = "insert into sp_goods (goods_name,goods_price,goods_number,goods_weight,cat_id,goods_introduce,add_time,upd_time,cat_one_id,cat_two_id,cat_three_id) values ('" +
    goods_name + "','" + goods_price + "','" + goods_number + "','" + goods_weight + "','" + goods_cat[2] + "','" + goods_introduce + "','" + time + "','" + time + "','" + goods_cat[0] + "','" + goods_cat[1] + "','" + goods_cat[2] + "')"

  let result = await db(sql)
  let goods_id = result.insertId
  console.log(result.insertId)

})

// 根据id查询商品
router.get('/getDetails', async (req, res) => {
  let id = parseInt(req.query.id)
  let sql = "select goods_id,goods_name,goods_price,goods_number,goods_weight,goods_state,add_time,upd_time,hot_mumber,is_promote,goods_big_logo,goods_small_logo,goods_introduce from sp_goods where goods_id=" + id
  let result = await db(sql)

  let sql1 = "select * from sp_goods_pics where goods_id=" + id
  let result1 = await db(sql1)

  let sql2 = "select * from sp_goods_attr where goods_id=" + id
  let result2 = await db(sql2)

  result[0].pics = result1
  result[0].attrs = result2

  let returnData = dealData.dealReturnData(result[0])
  res.send(returnData)
})

// 编辑商品提交
router.put('/editGoods', async (req, res) => {
  let id = req.query.id

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