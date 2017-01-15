var express = require('express')
var cookieParser = require('cookie-parser')
var users = require('./../models/users')
var posts = require('./../models/posts')

var router = express.Router()

router.use(cookieParser())

router.use(function(req, res, next){
  if(req.cookies.user == undefined){
    res.redirect('/login')
  }else{
    next()
  }
})

router.route('/:username')
  .get(function(req, res){
    var username = req.params.username
    var response = {
      status: null,
      user: null,
      message: null
    }

    users.findOne({user: username}, function(err, docs){
      if(err){
        response.status = 'error'
        response.message = 'Error'
        res.render('profile.ejs', {pgData: response})
      }else{
        if(docs){
          posts.count({postedBy: username}, function(err, count){
            response.count = count
            response.status = 'match'
            response.user = username
            response.email = docs.email
            res.render('profile.ejs', {pgData: response})
          })
        }else{
          response.status = 'none'
          response.messsage = 'not a valid user'
          res.render('profile.ejs', {pgData: response})
        }
      }
    })
  })

module.exports = router
