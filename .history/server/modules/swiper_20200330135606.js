const express = require('express')
const router = express.Router()

let db = require('../helper/db');
let dealData = require('../utils/dealData')

/* 获取轮播图数据 */
router.get('/swiperdata', async (req, res) => {
 /*  let returnData = {
    "message": [],
    "meta": {
      "msg": "获取失败",
      "status": 0
    }
  } */
  let data = await db('select * from swiper')
  /* if (data.length > 0) {
    returnData.message = data
    returnData.meta = {
      "msg": "获取成功",
      "status": 200
    }
    res.send(returnData)
  } */
  let returnData = dealData.dealReturnData(data)
  res.send(returnData)
})

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router