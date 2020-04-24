const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

/* 获取导航菜单 */
router.get('/catitemsdata', async (req, res) => {

  let data = await db('select name,image_src,open_type,navigator_url from catitems')
  let returnData = dealData.dealReturnData(data)
  res.send(returnData)
})

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router