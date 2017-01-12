var express = require('express')
var cookieParser = require('cookie-parser')
var stocks = require('./../models/stocks')
var router = express.Router()

router.use(cookieParser())

router.use(function(req, res, next){
  if(req.cookies.user == undefined){
    res.redirect('/login')
  }else{
    console.log(req.cookies);
    next()
  }
})

router.route('/')
    .get()
    .post()


module.exports = router