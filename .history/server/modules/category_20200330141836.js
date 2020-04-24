const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

router.get('/categorydata', async (req, res) => {

  let data = await db('select * from category where parent_id = 0')
  let allData = await db('select * from category')
  data.forEach((item, index) => {
    let children = []
    allData.forEach((item1, index1) => {
      if (item1.parent_id === item.cat_id) {
        children.push(item1)
      }
    })
    data[index].children = children
  })

  let returnData = dealData.dealReturnData(data)
  res.send(returnData)
})

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router