const express = require('express')
const router = express.Router()

let db = require('../helper/db')

router.get('/type', async (req, res) => {
  let type = req.query.type
  if (type === "list") {
    let sql = "select per1.ps_id,ps_name,ps_level,ps_pid,ps_api_path from sp_permission as per1,sp_permission_api as per2 where per1.ps_id = per2.ps_id"
    let data = await db(sql)

  } else if (type === "tree") {

  }
  res.send(data)
})

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router