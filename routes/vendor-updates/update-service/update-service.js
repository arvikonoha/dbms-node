const Router = require('express').Router()
const auth = require('../../../auth/auth')
const pool = require('../../../util/database-config')

Router.post('/:service_id', auth, async (req, res) => {
  let {
    service_id
  } = req.params
  let {
    service,
    price
  } = req.body
  try {
    let result = await pool.query("UPDATE service_details set service_text=$1,price=$2 where service_id=$3 RETURNING *", [service, price, service_id])
    return res.json(result.rows[0])
  } catch (err) {
    console.log(err)
    res.status(500).json({
      server: "server error"
    })
  }
})

module.exports = Router