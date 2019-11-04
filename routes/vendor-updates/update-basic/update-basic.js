const Router = require('express').Router()
const pool = require('../../../util/database-config')
const auth = require('../../../auth/auth')

Router.post('/', auth, async (req, res) => {
  let {
    title,
    location,
    category
  } = req.body
  console.log(title)
  try {
    let results = await pool.query("update vendor_details set title=$1,category=$2,location=$3 where vid=$4 RETURNING title,category,location", [title, category, location, req.user])
    return res.json(results.rows[0])
  } catch (err) {
    console.log(err)
    res.status(500).json({
      server: "server error"
    })
  }
})

module.exports = Router