const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

// 获取参数列表
router.get('/list', async (req, res) => {
  let id = parseInt(req.query.id)
  let sel = req.query.sel

  let sql = "select attr_id,attr_name,cat_id,attr_sel,attr_write,attr_vals from sp_attribute where attr_id =" + id
  let result = await db(sql)
  if (sel != 'only') {
    result[0].attr_vals = result[0].attr_vals.split(",")
  }
  let returnData = dealData.dealReturnData(result[0])
  res.send(returnData)
})

// 添加参数或属性
router.post('/addParams', async (req, res) => {
  let attr_name = req.body.attr_name
  let attr_sel = req.body.attr_sel
  let attr_vals = req.body.attr_vals ? req.body.attr_vals : ''

  let sql = "insert into sp_attribute (attr_name,attr_sel,attr_vals) values ('" + attr_name + "','" + attr_sel + "','" + attr_vals + "')"
  let result = await db(sql)
  let returnData = {}

  if (result.affectedRows === 1) {
    let sql1 = "select * from sp_attribute order by attr_id desc"
    let result1 = await db(sql1)
    returnData = dealData.dealReturnData(result1[0])
  } else {
    returnData = dealData.constant('c')
  }
  res.send(result)
})

module.exports = router