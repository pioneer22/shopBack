// 角色管理
const express = require('express')
const router = express.Router()

let db = require('../helper/db')

// 角色列表
router.get('/roles', async (req, res) => {
  let data = await db('select * from sp_role')
  res.send(data)
})

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router