const express = require('express')
const router = express.Router()

let db = require('../helper/db')

router.get('/categorydata', async (req, res) => {
  let data = await db('select * from category')
  let returnData = {
    "message": [],
    "meta": {
      "msg": "获取失败",
      "status": 0
    }
  }
  data.forEach((item, index) => {
    let dataOne = db('select * from category where parent_id =' + item.cat_id)
    if (dataOne.length > 0) {
      data[index].children = dataOne
    }
    console.log(1)
  })
  res.send(data)
})

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router