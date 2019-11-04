const Router = require('express').Router()
const auth = require('../../../auth/auth')
const pool = require('../../../util/database-config')

Router.delete('/:service_id', auth, async (req, res) => {
  let {
    service_id
  } = req.params
  try {
    let result = await pool.query("DELETE from service_details where service_id=$1", [service_id])

    await pool.query("delete from order_details where order_id not in (select order_id from register_details)")

    return res.json({
      success: "true"
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      server: "server error"
    })
  }
})

module.exports = Router