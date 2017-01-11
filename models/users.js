var db = require('./db')
var schema = db.Schema

var usersSchema = new schema({
    _id: Number,
    username: String,
    passsword: String
})

var users = db.model('users', usersSchema)

module.exports = users