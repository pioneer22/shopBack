const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

/* 商品分类 */
router.get('/category', async (req, res) => {
  let sql = "select cat_id,cat_name,cat_pid,cat_level,cat_deleted from sp_category where cat_pid = 0"
  let data = await db(sql)
  let sql1 = "select cat_id,cat_name,cat_pid,cat_level,cat_deleted from sp_category"
  let allData = await db(sql1)
  data.forEach((item, index) => {
    let children = []
    allData.forEach((item1, index1) => {
      let temp = item1
      if (item1.cat_pid === item.cat_id) {
        let children1 = []
        allData.forEach(item2 => {
          if (item2.cat_pid === item1.cat_id) {
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

// 添加分类
router.post('/addCategory', async (req, res) => {
  let catPid = parseInt(req.body.cat_id)
  let catName = req.body.cat_name
  let catLevel = req.body.cat_level

  let sql = "insert into sp_category (cat_pid,cat_name,cat_level) values (" + catPid + ",'" + catName + "','" + catLevel + "')"
  let result = await db(sql)

  if(result.aff)

  res.send(data)
})

module.exports = router