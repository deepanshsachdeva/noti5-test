var express = require('express')
var ejs = require('ejs')

var app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use('/login', require('./routes/login'))
app.use('/timeline', require('./routes/timeline'))
app.use('/post', require('./routes/post'))

app.listen(3000, function(){
    console.log('server running on port 3000')
})
