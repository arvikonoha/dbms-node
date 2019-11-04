const Route = require('express').Router()
const pool = require('../../util/database-config')
const auth = require('../../auth/auth')
const fetchOrders = require('../util-functions/fetch-orders')
Route.get('/', auth, async (req, res) => {
  try {
    console.log(req.user)
    let results = await pool.query('SELECT * from  user_details where uid=$1', [req.user])
    if (results.rowCount > 0) {
      delete results.rows[0].password
      results.rows[0].orders = await fetchOrders(req, results.rows[0])
      return res.json(results.rows[0])
    } else
      return res.status(404).json({
        user: "No such user found"
      })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      server: "server error"
    })
  }
})

module.exports = Route