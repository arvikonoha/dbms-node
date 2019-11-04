const Router = require('express').Router()
const pool = require('../../../util/database-config')
const auth = require('../../../auth/auth')

Router.delete('/', auth, async (req, res) => {
  try {
    await pool.query('DELETE from user_details where uid=$1', [req.user])
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