// 角色管理
const express = require('express')
const router = express.Router()

let db = require('../helper/db')

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
  console.log(req)
  let roleName = req.body.roleName
  let roleDesc = req.body.roleDesc ? req.body.roleDesc : ''
  if(roleName){
    let sql = "insert into sp_role(role_name,role_desc) values ('"+roleName+"','"+roleDesc+"')" 
    let data = await db(sql)
    console.log("666")
    console.log(data)
    res.send(data)
  }

})
module.exports = router