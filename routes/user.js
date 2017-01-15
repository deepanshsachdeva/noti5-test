var express = require('express')
var bodyParser = require('body-parser')
var users = require('./../models/users')

var router = express.Router()

router.use(bodyParser.urlencoded({extended:true}))

router.route('/add')
  .get(function(req, res){
    res.render('adduser.ejs')
  })
  .post(function(req, res){

    var newUser = new users({
      user: req.body.inputUser,
      email: req.body.inputEmail,
      password: req.body.inputPassword
    })

    newUser.save(function(err){
      console.log('user added')
      res.redirect('/login')
    })
  })

module.exports = router
