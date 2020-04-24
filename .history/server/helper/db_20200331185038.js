
import { createConnection } from 'mysql'

const db = createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '123abc',
  database: 'xcxsc'
})

db.connect()

export default (sql, callback) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, res, fields) => {
      if (err) reject(err)
      else resolve(res)
    })
  }).catch((error) => {
    console.error(error);
  })
}