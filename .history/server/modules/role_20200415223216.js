// 角色管理
const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser')
// 用于获取post请求传来的数据
express().use(bodyParser.json())
express().use(bodyParser.urlencoded({ extended: false }))

let db = require('../helper/db')

// 角色列表
router.get('/roles', async (req, res) => {
  let sql = "select role_id,role_name,role_desc,ps_ids from sp_role"
  let data = await db(sql)

  data.forEach((item, index) => {

  })
  res.send(data)
})

router.post('/aaa', async (req, res) => {
  console.log(req.body)
  res.send({"aaa":77})
})

// 添加角色
router.post('/roles', async (req, res) => {
  console.log(req.body.roleName)
  let roleName = req.body.roleName
  let roleDesc = req.body.roleDesc ? req.body.roleDesc : ''
  if(roleName){
    let sql = "insert into sp_role(role_name,role_desc) values ('"+roleName+"','"+roleDesc+"')" 
    let data = await db(sql)
    console.log("666:",data)
    res.send(data)
  }

})
module.exports = router