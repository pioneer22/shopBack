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
  let pics = req.body.pics ? eval("(" + req.body.pics + ")") : []
  let attrs = req.body.attrs ? eval("(" + req.body.attrs + ")") : []
  let time = new Date().getTime() / 1000

  let sql = "insert into sp_goods (goods_name,goods_price,goods_number,goods_weight,cat_id,goods_introduce,add_time,upd_time,cat_one_id,cat_two_id,cat_three_id) values ('"
    + goods_name + "','" + goods_price + "','" + goods_number + "','" + goods_weight + "','" + goods_cat[2] + "','" + goods_introduce + "','" + time + "','" + time + "','" + goods_cat[0] + "','" + goods_cat[1] + "','" + goods_cat[2] + "')"

  let result = await db(sql)
  let goods_id = parseInt(result.insertId)

  for (let item of attrs) {
    let sql1 = "insert into sp_goods_attr (goods_id,attr_id,attr_value) values (" + goods_id + ",'" + item.attr_id + "','" + item.attr_value + "')"
    await db(sql1)
  }

  for (let item of pics) {
    let sql2 = "insert into sp_goods_pics (goods_id,pics_big,pics_mid,pics_sma) values (" + goods_id + ",'" + item.pics_big + "','" + item.pics_mid + "','" + item.pics_sma + "')"
    await db(sql2)
  }

  let sql3 = "select * from sp_goods where goods_id=" + goods_id
  let sql4 = "select * from sp_goods_pics where goods_id=" + goods_id
  let sql5 = "select * from sp_goods_attr where goods_id=" + goods_id

  let result3 = await db(sql3)
  let result4 = await db(sql4)
  let result5 = await db(sql5)

  result3[0].pics = result4
  result3[0].attrs = result5

  let returnData = dealData.dealReturnData(result3[0])
  res.send(returnData)
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
  let id = parseInt(req.query.id)
  let goods_name = req.body.goods_name
  let goods_price = req.body.goods_price
  let goods_number = req.body.goods_number
  let goods_weight = req.body.goods_weight
  let goods_introduce = req.body.goods_introduce ? req.body.goods_introduce : ''
  let pics = req.body.pics ? eval("(" + req.body.pics + ")") : []
  let attrs = req.body.attrs ? eval("(" + req.body.attrs + ")") : []
  let time = new Date().getTime() / 1000

  let sql = "update sp_goods set goods_name='" + goods_name + "',goods_price='" + goods_price + "',goods_number='" + goods_number
    + "',goods_weight='" + goods_weight + "',goods_introduce='" + goods_introduce + "',upd_time='" + time + "' where goods_id=" + id
  let result = await db(sql)
  let returnData = {}

  if (result.affectedRows === 1) {
    for (let item of attrs) {
      let sql1 = "update sp_goods_attr set attr_id='" + item.attr_id + "',attr_value='" + item.attr_value + "' where id=" + parseInt(item.id)
      await db(sql1)
    }

    for (let item of pics) {
      let sql2 = "update sp_goods_pics set pics_big='" + item.pics_big + "',pics_mid='" + item.pics_mid + "',pics_sma='" + item.pics_sma + "' where pics_id=" + parseInt(item.id)
      await db(sql2)
    }

    let sql3 = "select * from sp_goods where goods_id=" + id
    let sql4 = "select * from sp_goods_pics where goods_id=" + id
    let sql5 = "select * from sp_goods_attr where goods_id=" + id

    let result3 = await db(sql3)
    let result4 = await db(sql4)
    let result5 = await db(sql5)
    result3[0].pics = result4
    result3[0].attrs = result5
    returnData = dealData.dealReturnData(result3[0])
  } else {
    returnData = dealData.constant('c')
  }
  res.send(returnData)
})

// 删除商品
router.delete('/deleteGoods', async (req, res) => {
  let goods_id = parseInt(req.query.id)
  let sql1 = "delete from sp_goods where goods_id=" + goods_id
  let sql2 = "delete from sp_goods_pics where goods_id=" + goods_id
  let sql3 = "delete from sp_goods_attr where goods_id=" + goods_id

  let result1 = await db(sql1)
  let result2 = await db(sql2)
  let result3 = await db(sql3)

  let returnData = {}
  if (result1.affectedRows === 1 || result2.affectedRows === 1 || result3.affectedRows === 1) {
    returnData = dealData.constant('A')
  } else {
    returnData = dealData.constant('a')
  }
  res.send(returnData)
})

/* 商品详情 */
router.get('/details', async (req, res) => {
  let goods_id = parseInt(req.query.goods_id)
  let data = await db('select * from sp_goods where goods_id =' + goods_id)
  let pics = await db('select * from sp_goods_pics where goods_id =' + goods_id)
  let attrs = await db('select * from sp_goods_attr where goods_id =' + goods_id)

  let returnData = {}
  if (data.length > 0) {
    let message = data[0]
    message.pics = pics
    message.attrs = attrs
    returnData = dealData.dealReturnData(message)
  } else {
    returnData = dealData.constant('d')
  }
  res.send(returnData)
})

/* 商品列表搜索 */
router.get('/search', async (req, res) => {
  let reqData = req.query.searchval
  let reqId = isNaN(parseInt(reqData)) ? 0 : parseInt(reqData)
  let pagenum = parseInt(req.query.pagenum)
  let pagesize = req.query.pagesize ? parseInt(req.query.pagesize) : 10

  let sql = "select * from sp_goods where goods_name like '%" + reqData + "%' or cat_id=" + reqId
    + " limit " + (pagenum - 1) * pagesize + "," + pagesize
  let data = await db(sql)
  let returnData = {}

  if (data.length > 0) {
    let sql1 = "select count(*) as total from sp_goods"
    let result1 = await db(sql1)

    for (let [index, elem] of new Map(data.map((item, i) => [i, item]))) {
      let sql2 = "select * from sp_goods_pics where goods_id=" + parseInt(elem.goods_id)
      let pics = await db(sql2)
      let sql3 = "select * from sp_goods_attr where goods_id=" + parseInt(elem.goods_id)
      let attr = await db(sql3)

      data[index].pics = pics
      data[index].attr = attr
    }

    let message = {
      "total": result1[0].total,
      "pagenum": pagenum,
      "goods": data
    }
    returnData = dealData.dealReturnData(message)
  } else {
    returnData = dealData.constant('d')
  }
  res.send(returnData)
})

/* 商品搜索 */
/* router.get('/qsearch', async (req, res) => {
  let reqData = req.query.searchval
  let goods_id = isNaN(parseInt(reqData)) ? 0 : parseInt(reqData)
  let sql = "select goods_id,goods_name from goods where goods_name like '%" + reqData + "%' or goods_id = " + goods_id
  let data = await db(sql)

  let returnData = dealData.dealReturnData(data)
  res.send(returnData)
}) */

// 获取轮播图数据
router.get('/swiper', async (req, res) => {
  // 随机获取四条数据
  let sql = "select * from sp_goods where goods_id>=(select floor(rand()*(select max(goods_id) from sp_goods))) order by goods_id limit 4"
  let result = await db(sql)
  for (let [index, elem] of new Map(result.map((item, i) => [i, item]))) {
    let sql1 = "select * from sp_goods_pics where goods_id=" + parseInt(elem.goods_id)
    let result1 = await db(sql1)
    result[index].pics = result1
  }
  let returnData = dealData.dealReturnData(result)
  res.send(returnData)
})

module.exports = router