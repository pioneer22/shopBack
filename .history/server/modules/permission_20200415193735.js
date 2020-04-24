const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

router.get('/type', async (req, res) => {
  let type = req.query.type
  let data = []
  if (type === "list") {
    let sql = "select per1.ps_id,ps_name,ps_level,ps_pid,ps_api_path from sp_permission as per1,sp_permission_api as per2 where per1.ps_id = per2.ps_id"
    let data = await db(sql)
  } else if (type === "tree") {
    let sql = "select per1.ps_id,ps_name,ps_api_path,ps_pid from sp_permission as per1,sp_permission_api as per2 where per1.ps_id = per2.ps_id"
    let dataAll = await db(sql)
    dataAll.forEach((item, index) => {
      if(item.ps_pid === 0){
        data.push(item)
      }
    })

    data.forEach((item, index) => {
      let children = []
      dataAll.forEach((item1, index1) => {
        let temp = item1
        if (item1.parent_id === item.cat_id) {
          let children1 = []
          dataAll.forEach(item2 => {
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
  }
  let returnData = dealData.dealReturnData(data)
  res.send(returnData)
})

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router