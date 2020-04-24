const express = require('express')
const router = express.Router()

let db = require('../helper/db')

router.get('/searchdata', async (req, res) => {
  let data = await db('select * from goods')
  let returnData = {
    "message": {
      "total": 10,
      "pagenum": 1,
      "goods": []
    },
    "meta": {
      "msg": "获取失败",
      "status": 0
    }
  }
  if(data.length > 0){
    returnData.message.goods = data
    returnData.meta = {
      "msg": "获取成功",
      "status": 200
    }
  }
  res.send(returnData)
})

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router