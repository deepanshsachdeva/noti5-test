var express = require('express')
var cookieParser = require('cookie-parser')
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
    .get(function(req, res){
      var user = req.cookies.user
      res.send(user +' timeline')
    })

    .post(function(req, res){

    })

module.exports = router
