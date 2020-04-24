const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

router.get('/orders', async (req, res) => {
  let pagenum = parseInt(req.query.pagenum)
  let pagesize = parseInt(req.query.pagesize)

  let sql = "select * from sp_order limit " + (pagenum - 1) * pagesize + "," + pagesize
  let result = await db(sql)

  let sql1 = "select count(*) as num from sp_order"
  let result1 = await db(sql1)

  console.log('aa:',result1[0].num)

  res.send(result1)
})

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router