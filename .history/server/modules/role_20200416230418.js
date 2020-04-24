// 角色管理
const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

// 角色列表
router.get('/roles', async (req, res) => {
  let sql = "select role_id,role_name,role_desc,ps_ids from sp_role"
  let data = await db(sql)

  let sql1 = "select per1.ps_id,ps_name,ps_api_path,ps_pid,ps_level from sp_permission as per1,sp_permission_api as per2 where per1.ps_id = per2.ps_id"
  let dataAll = await db(sql1)

  data.forEach((item, index) => {
    let array = item.ps_ids.split(",")
    array.forEach((item1, index1) => {
      array[index1] = parseInt(item1)
    })
    array = dealData.quickSort(array)

    let firstLevel = [], secondLevel = [], thirdLevel = [], i = 0
    dataAll.forEach((item2, index2) => {
      if (item2.ps_id === array[i]) {
        i++;
        switch (parseInt(item2.ps_level)) {
          case 0:
            firstLevel.push(item2)
            break;
          case 1:
            secondLevel.push(item2)
            break;
          case 2:
            thirdLevel.push(item2)
            break;
        }
      }
    })

    firstLevel.forEach((item3, index3) => {
      let children1 = []
      secondLevel.forEach((item4, index4) => {
        let temp1 = item4
        if (item3.ps_id === item4.ps_pid) {
          let children2 = []
          thirdLevel.forEach((item5, index5) => {
            if (item4.ps_id === item5.ps_pid) {
              children2.push(item5)
            }
          })
          temp1.children = children2
          children1.push(temp1)
        }
      })
      firstLevel[index3].children = children1
    })
    data[index].children = firstLevel
  })
  let returnData = dealData.dealReturnData(data)
  res.send(returnData)
})

// 添加角色
router.post('/roles', async (req, res) => {
  let roleName = req.body.roleName
  let roleDesc = req.body.roleDesc ? req.body.roleDesc : ''
  let data = {}
  if (roleName) {
    let sql = "insert into sp_role(role_name,role_desc) values ('" + roleName + "','" + roleDesc + "')"
    let addResult = await db(sql)
    if (addResult.affectedRows === 1) {
      let sql1 = "select role_id,role_name,role_desc from sp_role where role_name='" + roleName + "' and role_desc='" + roleDesc + "' order by role_id desc"
      let getResult = await db(sql1)
      data = getResult[0]
    }
  } else {
    data.msg = "roleName has error!"
  }
  let returnData = dealData.dealReturnData(data)
  res.send(returnData)
})

// 根据Id查询角色
router.get('/getRoles', async (req, res) => {
  let id = parseInt(req.query.roleId)
  let sql = "select role_id,role_name,role_desc from sp_role where role_id=" + id
  let data = await db(sql)
  let returnData = dealData.dealReturnData(data[0])
  res.send(returnData)
})

// 编辑提交角色
router.post('/editRoles', async (req, res) => {
  let roleId = parseInt(req.body.roleId)
  let roleName = req.body.roleName
  let roleDesc = req.body.roleDesc ? req.body.roleDesc : ''

  let sql = "update sp_role set role_name='" + roleName + "',role_desc='" + roleDesc + "' where role_id=" + roleId
  let data = await db(sql)
  let returnData = {}
  if (data.affectedRows === 1) {
    let backData = {
      "roleId": roleId,
      "roleName": "roleName",
      "roleDesc": "roleDesc"
    }
    returnData = dealData.dealReturnData(backData)
  }
  res.send(returnData)
})

module.exports = router