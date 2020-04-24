const express = require('express')
const router = express.Router()

/* 处理node的request请求 */
const request = require('request')

let db = require('../helper/db')

router.get('/abc', async (req, res) => {
  let data = await db("select * from user")
  res.send(data)
})

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router