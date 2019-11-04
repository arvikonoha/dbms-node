const Route = require('express').Router()
const pool = require('../../util/database-config')
const auth = require('../../auth/auth')
Route.get('/:vid', async (req, res) => {
  try {
    let results = await pool.query('SELECT * from  vendor_details where vid=$1', [req.params.vid])
    if (results.rowCount > 0) {
      delete results.rows[0].password
      let results_s = await pool.query('SELECT * from  service_details where vid=$1', [req.params.vid])
      console.log(results_s.rows)
      if (results_s.rowCount > 0)
        results.rows[0].services = results_s.rows
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