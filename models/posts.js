var db = require('./db')
var schema = db.Schema

var postsSchema = new schema({
    imageFile: String,
    imageCaption: String,
    postedBy: String,
    postedOn: Date
})

var posts = db.model('posts', postsSchema)

module.exports = posts
