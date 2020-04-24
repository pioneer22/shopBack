const express = require('express')
const router = express.Router()

let db = require('../helper/db')

/* 获取导航菜单 */
router.get('/catitemsdata', async (req, res) => {
  let returnData = {
    "message": [],
    "meta": {
      "msg": "获取失败",
      "status": 0
    }
  }
  let data = await db('select name,image_src,open_type,navigator_url from catitems')
  if (data.length > 0) {
    returnData.message = data
    returnData.meta = {
      "msg": "获取成功",
      "status": 200
    }
    res.send(returnData)
  }
})

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router