const express = require('express')
const router = express.Router()

let db = require('../helper/db')

router.get('/categorydata', async (req, res) => {
  let data = await db('select * from category where parent_id = 0')
  data.forEach(async item => {
    let dataOne = await db('select * from category where parent_id =' + item.cat_id)
    console.log(dataOne)
    if (dataOne.length > 0) {
      item.children = dataOne
    }
  })
  res.send(data)
})

/* router.post('/bcd', async (req, res) => {
  console.log("bcd:", req.body)
  let data = await db('select * from user')
  res.send(data)
}) */

module.exports = router