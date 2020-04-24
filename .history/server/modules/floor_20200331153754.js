const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

/* 楼层数据 */
router.get('/floordata', async (req, res) => {
  let data = await db("select * from floor_title")
  let product = await db("select * from floor_product_list")

  let message = []
  data.forEach(item => {
    let productArr = []
    product.forEach(item1 => {
      if(item.floor_title_id === item1.floor_title_id){
        productArr.push(item1)
      }
    })
    let list = {
      "floor_title": item,
      "product_list": productArr
    }
    message.push(list)
  })
  let returnData = dealData.dealReturnData(message)
  res.send(returnData)
})

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router