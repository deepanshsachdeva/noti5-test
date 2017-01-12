var db = require('./db')
var schema = db.Schema

var stocksSchema = new schema({
    sector: String,
    ticker: String,
    price: Number
})

var stocks = db.model('stocks', stocksSchema)

module.exports = stocks
