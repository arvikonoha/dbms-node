const Router = require('express').Router()
const pool = require('../../../util/database-config')
const auth = require('../../../auth/auth')

Router.post('/', auth, async (req, res) => {
  let {
    description
  } = req.body
  try {
    let results = await pool.query("update vendor_details set description=$1 where vid=$2 RETURNING description", [description, req.user])
    return res.json(results.rows[0])
  } catch (err) {
    console.log(err)
    res.status(500).json({
      server: "server error"
    })
  }
})

module.exports = Router