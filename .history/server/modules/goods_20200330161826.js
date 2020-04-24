const express = require('express')
const router = express.Router()

let db = require('../helper/db')

router.get('/searchdata', async (req, res) => {
  let data = await db('select * from goods')
  res.send(data)
})

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router