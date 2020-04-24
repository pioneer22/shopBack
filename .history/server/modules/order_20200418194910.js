const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

router.get('/orders', async (req, res) => {
  let pagenum = parseInt(req.query.pagenum)
  let pagesize = parseInt(req.query.pagesize)

  let sql = "select * from sp_orders litmit " + (pagenum - 1) * pagesize + "," + pagesize
  let data = await db('select * from china-city')
  res.send(data)
})

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router