// 角色管理
const express = require('express')
const router = express.Router()

let db = require('../helper/db')
let dealData = require('../utils/dealData')

// 角色列表
router.get('/roles', async (req, res) => {
  let sql = "select role_id,role_name,role_desc,ps_ids from sp_role"
  let data = await db(sql)

  data.forEach((item, index) => {

  })
  res.send(data)
})

// 添加角色
router.post('/roles', async (req, res) => {
  let roleName = req.body.roleName
  let roleDesc = req.body.roleDesc ? req.body.roleDesc : ''
  let data = {}
  console.log(roleName,roleDesc)
  if (roleName) {
    let sql = "insert into sp_role(role_name,role_desc) values ('" + roleName + "','" + roleDesc + "')"
    let addResult = await db(sql)
    if(addResult.affectedRows === 1){
      let sql1 = "select * from sp_role where where role_name='"+roleName+"',role_desc='"+role_desc+"' order by role_id desc"
      let getResult = await db(sql1)
      data = getResult[0]
    }
  } else {
    data.msg = "roleName has error!"
  }
  let returnData = dealData.dealReturnData(data)
  res.send(returnData)
})

module.exports = router