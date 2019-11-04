const jwt = require('jsonwebtoken')

module.exports = async function (req, res, next) {
  let token = req.header("x-auth-token")
  if (!token)
    return res.status(403).json({
      auth: "No token sent"
    })
  try {
    let result = jwt.verify(token, process.env.JWT_SECRET)
    req.user = result.uid
    next()
  } catch (err) {
    res.status(500).json({
      server: "Could'nt parse your token"
    })
  }
}