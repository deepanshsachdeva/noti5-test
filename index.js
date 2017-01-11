var express = require('express')

var app = express()

app.use('/login', require('./routes/login'))
app.use('/timeline', require('./routes/timeline'))

app.listen(3000, function(){
    console.log('server running on port 3000')
})