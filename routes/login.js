var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var users = require('./../models/users')
var router = express.Router()

router.use(cookieParser())
router.use(bodyParser.urlencoded({extended:true}))

router.use(function(req, res, next){
  if(req.cookies.user != undefined){
    res.redirect('/timeline')
  }else{
    next()
  }
})

router.route('/')
    .get(function(req, res){
      var err = false
      if(req.cookies.loginerr){
        err = true
        res.clearCookie('loginerr')
      }
      res.render('login.ejs', {data: err})
    })

    .post(function(req, res){
      var inputEmail = req.body.inputEmail
      var inputPassword = req.body.inputPassword

      users.findOne({email: inputEmail}, function(err, data){
        if(err){
          throw err
          //err if user data not found
        }else{
          console.log(inputEmail, inputPassword);
          if(data != null && inputPassword == data.password){

            res.cookie('user', data.user)
            res.cookie('email', data.email)
            res.redirect('/timeline')
          }else{
            res.cookie('loginerr', true)
            res.redirect('/login')
          }
        }
      })
    })

module.exports = router
