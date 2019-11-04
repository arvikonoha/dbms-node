const Router = require('express').Router()
const pool = require('../../../util/database-config')
const auth = require('../../../auth/auth')

Router.delete('/', auth, async (req, res) => {
  try {
    let result = await pool.query('UPDATE vendor_details set phone=null,address=null where vid=$1 RETURNING phone,address', [req.user])
    return res.json(result.rows[0])
  } catch (err) {
    console.log(err)
    res.status(500).json({
      server: "server error"
    })
  }
})

module.exports = Router