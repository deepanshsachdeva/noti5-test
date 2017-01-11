var db = require('./db')
var schema = db.Schema

var usersSchema = new schema({
    user: String,
    email: String,
    password: String
})

var users = db.model('users', usersSchema)

module.exports = users
