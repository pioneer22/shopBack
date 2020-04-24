const express = require('express')
const router = express.Router()

let db = require('../helper/db')

/* 获取导航菜单 */
router.get('/abc', async (req, res) => {
  let data = await db('select name,image_src,open_type,navigator_url from catitems')
  res.send(data)
})

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router