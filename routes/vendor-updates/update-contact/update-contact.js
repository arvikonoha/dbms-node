const Router = require('express').Router()
const pool = require('../../../util/database-config')
const auth = require('../../../auth/auth')
const joi = require('joi')
Router.post('/', auth, async (req, res) => {
  const schema = joi
    .object({
      email: joi
        .string().email()
        .required(),
      phone: joi
        .string()
        .length(10)
        .required(),
      address: joi
        .string()
        .required()
    })
    .required();

  console.log(req.body);

  let result = joi.validate(req.body, schema);
  console.log(result.error);
  if (result.error !== null) {
    return res.status(404).json({
      validation: result.error.details[0].message
    });
  } else {
    let {
      email,
      phone,
      address
    } = req.body
    try {
      let results = await pool.query("update vendor_details set email=$1,phone=$2,address=$3 where vid=$4 RETURNING email,phone,address", [email, phone, address, req.user])
      return res.json(results.rows[0])
    } catch (err) {
      console.log(err)
      res.status(500).json({
        server: "server error"
      })
    }
  }
})

module.exports = Router