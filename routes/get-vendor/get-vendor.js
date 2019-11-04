const Route = require('express').Router()
const pool = require('../../util/database-config')
const auth = require('../../auth/auth')
const fetchOrders = require('../util-functions/fetch-vendor-order')
Route.get('/', auth, async (req, res) => {
  try {
    console.log(req.user)
    let results = await pool.query('SELECT * from  vendor_details where vid=$1', [req.user])
    if (results.rowCount > 0) {
      delete results.rows[0].password
      let results_s = await pool.query('SELECT * from  service_details where vid=$1', [req.user])
      if (results_s.rowCount > 0)
        results.rows[0].services = results_s.rows
      results.rows[0].orders = await fetchOrders(req, results.rows[0])
      return res.json(results.rows[0])
    } else
      return res.status(404).json({
        user: "No such vendor found"
      })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      server: "server error"
    })
  }
})

module.exports = Route