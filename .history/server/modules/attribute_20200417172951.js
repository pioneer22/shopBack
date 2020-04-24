const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

// 获取参数列表
router.get('/list', async (req, res) => {
  let id = parseInt(req.query.id)
  let sel = req.query.sel

  let sql = "select attr_id,attr_name,cat_id,attr_sel,attr_write,attr_vals from sp_attribute where cat_id=" + id + " and attr_sel='" + sel + "'"
  let result = await db(sql)

  result.forEach((item, index) => {
    result[index].attr_vals = result[index].attr_vals.split(",")
  })
  let returnData = dealData.dealReturnData(result)
  res.send(returnData)
})

// 添加参数或属性
router.post('/addParams', async (req, res) => {
  let cat_id = req.query.id
  let attr_name = req.body.attr_name
  let attr_sel = req.body.attr_sel
  let attr_vals = req.body.attr_vals ? req.body.attr_vals : ''

  let sql = "insert into sp_attribute (cat_id,attr_name,attr_sel,attr_vals) values ('" + cat_id + "','" + attr_name + "','" + attr_sel + "','" + attr_vals + "')"
  let result = await db(sql)
  let returnData = []

  if (result.affectedRows === 1) {
    let sql1 = "select * from sp_attribute order by attr_id desc"
    let result1 = await db(sql1)
    returnData = dealData.dealReturnData(result1[0])
  } else {
    returnData = dealData.constant('c')
  }
  res.send(returnData)
})

// 删除参数
router.delete('/delete', async (req, res) => {
  let attr_id = parseInt(req.query.attr_id)
  // let cat_id = parseInt(req.query.id)

  let sql = "delete from sp_attribute where attr_id=" + attr_id
  let result = await db(sql)
  let returnData = result.affectedRows === 1 ? dealData.constant('A') : dealData.constant('a')

  res.send(returnData)
})

module.exports = router