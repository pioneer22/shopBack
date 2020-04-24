/*
 * @Author: Pioneer 
 * @Date: 2019-10-18 13:27:10 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-10-31 14:30:49
 */

const mysql = require('mysql')

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '123abc',
  database: 'wzry'
})

db.connect()

module.exports = (sql, callback) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, res, fields) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
}



