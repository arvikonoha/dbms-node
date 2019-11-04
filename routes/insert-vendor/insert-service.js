const Router = require('express').Router()
const pool = require('../../util/database-config')
const auth = require('../../auth/auth')
const uuid = require('uuid/v4')

Router.post('/', auth, async (req, res) => {
  let {
    price
  } = req.body
  try {
    let result = await pool.query("INSERT INTO service_details (vid,service_id,service_text,price) VALUES($1,$2,$3,$4) RETURNING * ", [req.user, uuid(), req.body["ins-service"], price])
    return res.json(result.rows[0])
  } catch (err) {
    console.log(err)
    res.status(500).json({
      server: "server error"
    })
  }
})

module.exports = Router