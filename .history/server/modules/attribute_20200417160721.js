const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

// 获取参数列表
router.get('/list', async (req, res) => {
  let id = parseInt(req.query.id)
  // let sel = req.query.sel

  let sql = "select attr_id,attr_name,cat_id,attr_sel,attr_write,attr_vals from sp_attribute where attr_id ="+id
  let result = await db(sql)

  console.log("result:",result)


  res.send(result)
})

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router