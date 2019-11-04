const Router = require('express').Router()
const bcrypt = require('bcryptjs')
const pool = require('../../util/database-config')
const jwt = require('jsonwebtoken')
const fetchOrders = require('../util-functions/fetch-orders')
const fetchVendorOrders = require('../util-functions/fetch-vendor-order')

Router.post('/:isVendor', async (req, res) => {
  try {
    let {
      isVendor
    } = req.params;
    if (isVendor == "true") {
      let email = await pool.query("SELECT * from vendor_details where email = $1", [req.body.email])
      if (!email.rowCount) {
        return res.status(403).json({
          "auth": "invalid credentials"
        })
      } else {
        let isValid = await bcrypt.compare(req.body.password, email.rows[0].password)
        console.log(isValid, isVendor)
        if (!isValid) {
          return res.status(403).json({
            "auth": "invalid credentials"
          })
        } else {
          let token = jwt.sign({
            uid: email.rows[0].vid
          }, process.env.JWT_SECRET, {
            expiresIn: "6h"
          })
          let results_s = await pool.query('SELECT * from  service_details where vid=$1', [email.rows[0].vid])
          if (results_s.rowCount > 0)
            email.rows[0].services = results_s.rows
          delete email.rows[0].password
          req.user = email.rows[0].vid
          email.rows[0].orders = await fetchVendorOrders(req)
          email.rows[0].token = token
          return res.json(email.rows[0])
        }
      }
    } else {
      let email = await pool.query("SELECT * from user_details where email = $1", [req.body.email])
      if (!email.rowCount) {
        return res.status(403).json({
          "auth": "invalid credentials"
        })
      } else {
        let isValid = await bcrypt.compare(req.body.password, email.rows[0].password)
        console.log(isValid, isVendor)
        if (!isValid) {
          return res.status(403).json({
            "auth": "invalid credentials"
          })
        } else {
          let token = jwt.sign({
            uid: email.rows[0].uid
          }, process.env.JWT_SECRET, {
            expiresIn: "6h"
          })
          delete email.rows[0].password
          email.rows[0].token = token
          req.user = email.rows[0].uid
          email.rows[0].orders = await fetchOrders(req)
          return res.json(email.rows[0])
        }
      }
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      "server": "server error"
    })
  }
})

module.exports = Router