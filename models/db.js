var mongoose = require('mongoose')
var url = require('url')

var authStr = ""
// uncomment the section if username (and password) are required, with appropriate values in respective variables

/*
var username = ""
var password = ""
var authStr = username
if (password.length > 0){
  authStr += (":"+password)
}
*/

var database = "noti5"

var urlOptions = {
  protocol: "mongodb",
  slashes: true,
  auth: authStr,
  hostname: "localhost",
  port: "27017",
  pathname: "/"+database

}

var connectionString = url.format(urlOptions)
mongoose.connect(connectionString)

module.exports = mongoose
