const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

/* 商品分类 */
router.get('/category', async (req, res) => {
  let data = await db('select * from sp_category where cat_pid = 0')
  let allData = await db('select * from sp_category')
  data.forEach((item, index) => {
    let children = []
    allData.forEach((item1, index1) => {
      let temp = item1
      if (item1.cat_pid === item.cat_id) {
        let children1 = []
        allData.forEach(item2 => {
          if(item2.cat_pid === item1.cat_id){
            children1.push(item2)
          }
        })
        temp.children = children1
        children.push(temp)
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