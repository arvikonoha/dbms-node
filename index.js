const express = require('express')
const app = express()
const path = require('path');

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/register/user', require('./routes/register/register-user'))
app.use('/register/vendor', require('./routes/register/register-vendor'))
app.use('/getuser', require('./routes/get-user/get-user'))
app.use('/getvendor', require('./routes/get-vendor/get-vendor'))
app.use('/profile', require('./routes/get-vendor-profile/get-vendor-profile'))
app.use('/login', require('./routes/login/login'))
app.use('/updatebasic', require('./routes/vendor-updates/update-basic/update-basic'))
app.use('/updatecontact', require('./routes/vendor-updates/update-contact/update-contact'))
app.use('/updatedescription', require('./routes/vendor-updates/update-description/update-description'))
app.use('/insertservice', require('./routes/insert-vendor/insert-service'))
app.use('/deletecontact', require('./routes/delete-vendor/delete-contact/delete-contact'))
app.use('/deleteservice', require('./routes/delete-vendor/delete-service/delete-service'))
app.use('/deletedescription', require('./routes/delete-vendor/delete-description/delete-description'))
app.use('/deleteaccount/true', require('./routes/delete-vendor/delete-account/delete-account'))
app.use('/deleteaccount/false', require('./routes/delete-user/delete-account/delete-account'))
app.use('/updateservice', require('./routes/vendor-updates/update-service/update-service'))
app.use('/categories', require('./routes/get-categories/get-categories'))
app.use('/fetchvendors', require('./routes/fetch-vendors/fetch-vendors'))
app.use('/insertorder', require('./routes/insert-order/insert-order'))

app.listen(process.env.PORT || 5000, () => {
  console.log("Listening on port ", process.env.PORT || 5000)
})