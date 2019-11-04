const Router = require('express').Router()
const pool = require('../../../util/database-config')
const auth = require('../../../auth/auth')

Router.delete('/', auth, async (req, res) => {
  try {

    await pool.query('DELETE from vendor_details where vid=$1', [req.user])

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