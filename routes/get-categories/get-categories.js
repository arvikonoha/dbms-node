const Router = require('express').Router()
const pool = require('../../util/database-config')

Router.get('/', async (req, res) => {
  try {
    let categories = await pool.query('select * from (select row_number() over (order by count(*)) row_number,category from vendor_details v,service_details s where v.vid = s.vid group by v.vid having count(*)>=1) as row_details where row_number < 4')
    if (categories.rowCount > 0)
      return res.json(categories.rows)
    else
      return res.status(404).json({
        "not found": "There are no vendors registered"
      })
  } catch (err) {
    console.log(err)
    res.json({
      server: "server error"
    })
  }
})

module.exports = Router