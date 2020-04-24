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
      let temp = item1
      if (item1.parent_id === item.cat_id) {
        let children1 = []
        allData.forEach(item2 => {
          if(item2.parent_id === item1.cat_id){
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