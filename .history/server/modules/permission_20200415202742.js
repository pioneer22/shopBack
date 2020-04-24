// 权限管理
const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

// 所有权限列表,值 list 或 tree
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
      if (item.ps_pid === 0) {
        data.push(item)
      }
    })

    data.forEach((item, index) => {
      let children = []
      dataAll.forEach((item1, index1) => {
        let temp = item1
        if (item1.ps_pid === item.ps_id) {
          let children1 = []
          dataAll.forEach(item2 => {
            if (item2.ps_pid === item1.ps_id) {
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

// 左侧菜单权限
router.get('/menus', async (req, res) => {
  let sql = "select per1.ps_id,ps_name,ps_api_path,ps_pid from sp_permission as per1,sp_permission_api as per2 where per1.ps_id = per2.ps_id"
  let data = await db(sql)
  let array = []

  data.forEach((item, index) => {
    if (item.ps_pid === 0) {
      array.push(item)
    }
  })

  array.forEach((item, index) => {
    let children = []
    data.forEach((item1, index1) => {
      let temp = item1
      if (item1.ps_pid === item.ps_id) {
        let children1 = []
        data.forEach(item2 => {
          if (item2.ps_pid === item1.ps_id) {
            children1.push(item2)
          }
        })
        temp.children = children1
        children.push(temp)
      }
    })
    array[index].children = children
  })
})

// 
/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router