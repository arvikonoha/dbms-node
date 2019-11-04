const Router = require('express').Router()
const pool = require('../../util/database-config')

Router.post('/:ishigh', async (req, res) => {
  let {
    ishigh
  } = req.params
  ishigh = ishigh === "true" ? "desc" : "asc"
  let {
    category,
    title,
    location
  } = req.body
  try {
    let result = await pool.query("select v.title,v.category,v.location,avg(s.price),v.vid from vendor_details v,service_details s where s.vid = v.vid and LOWER(v.category) LIKE LOWER($1) AND LOWER(v.location) LIKE LOWER($2) AND LOWER(v.title) LIKE LOWER($3) group by v.vid order by avg(s.price) " + ishigh, [`%${category}%`, `%${location}%`, `%${title}%`])
    if (result.rowCount == 0) {
      return res.status(404).json({
        "not found": "There are no such vendors please try different search"
      })
    } else {
      return res.json(result.rows)
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      server: "server error"
    })
  }
})

module.exports = Router