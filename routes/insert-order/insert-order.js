const Router = require('express').Router()
const pool = require('../../util/database-config')
const auth = require('../../auth/auth')
const uuid = require('uuid/v4')
const joi = require('joi')

async function* resolveService(services, oid) {
  let service_id;
  for (let service of services) {
    service_id = await pool.query("INSERT INTO register_details values($1,$2) RETURNING service_id", [oid, service])
    yield service_id.rows[0]
  }
}

Router.post('/', auth, async (req, res) => {
  let {
    services,
    title,
    from,
    to,
    phone,
    address
  } = req.body

  if (phone.length !== 10)
    return res.status(403).json({
      validation: "invalid phone number"
    })
  let fromJs = new Date(from)
  let toJs = new Date(to)
  if ((fromJs > toJs) || (fromJs < Date.now() || toJs < Date.now())) {
    return res.status(403).json({
      validation: "Make sure you enter valid dates"
    })
  }
  try {
    await pool.query("UPDATE user_details SET phone=$1,address=$2 where uid=$3", [phone, address, req.user])
    let order_details = await pool.query('INSERT INTO order_details (order_id,order_from,order_to,title,uid) values($1,$2,$3,$4,$5) RETURNING *', [uuid(), from, to, title, req.user])

    order_details.rows[0].services = []
    let vendorDetails
    for await (let service_id of resolveService(services, order_details.rows[0].order_id)) {
      console.log(service_id)
      vendorDetails = await pool.query("SELECT v.vid,v.title,s.service_text from vendor_details v,service_details s where v.vid = s.vid and s.service_id=$1", [service_id.service_id])
      console.log(vendorDetails.rows)
      order_details.rows[0].services.push({
        title: vendorDetails.rows[0].title,
        vid: vendorDetails.rows[0].vid,
        service_text: vendorDetails.rows[0].service_text
      })
      console.log(order_details.rows[0].services)
    }
    console.log(order_details.rows[0].services)
    return res.json(order_details.rows[0])
  } catch (err) {
    console.log(err)
    res.status(500).json({
      server: "server error"
    })
  }
})

module.exports = Router