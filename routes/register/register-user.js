const Route = require('express').Router()
const joi = require('joi')
const pool = require('../../util/database-config')
const uuid = require('uuid/v4')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

Route.post('/', async (req, res) => {

  const schema = joi.object({
    user_fname: joi.string().min(2).required(),
    user_lname: joi.string().min(2).required(),
    user_email: joi.string().email().required(),
    user_password: joi.string().min(5).required(),
    user_cpassword: joi.string().valid(joi.ref('user_password')).min(5).required()
  }).required()

  console.log(req.body)

  let result = joi.validate(req.body, schema)
  console.log(result.error)
  if (result.error !== null) {
    return res.status(404).json(...result.error.details)
  } else {
    try {

      let email = await pool.query('SELECT email from  user_details where email=$1', [result.value.user_email])
      if (email.rowCount != 0)
        return res.status(403).json({
          "email": "email aready exisits"
        })

      let salt = await bcrypt.genSalt(10)
      let hash = await bcrypt.hash(result.value.user_password, salt)
      let uid = uuid()
      let result1 = await pool.query('INSERT INTO user_details(f_name, l_name,email,password,uid) VALUES($1, $2,$3,$4,$5) RETURNING *', [result.value.user_fname, result.value.user_lname, result.value.user_email, hash, uid])
      let token = await jwt.sign({
        uid
      }, process.env.JWT_SECRET, {
        expiresIn: '6h'
      })
      delete result1.rows[0].password
      result1.rows[0].token = token
      return res.json(result1.rows[0])
    } catch (err) {
      return res.status(500).json({
        server: "server error"
      })
    }
  }
})

module.exports = Route