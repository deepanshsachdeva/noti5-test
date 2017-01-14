var express = require('express')
var cookieParser = require('cookie-parser')
var stocks = require('./../models/stocks')
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

router.route('/')
    .get(function(req, res){
      var userValue = req.cookies.user
      var startValue = 0, limitValue = 5
      //res.clearCookie('user')
      res.render('timeline.ejs', {PgData:{
        user: userValue,
        start: startValue,
        limit: limitValue
      }})
    })

router.route('/data/:skipValue/:limitValue')
    .get(function(req, res){

      // stocks.aggregate()
      //   .skip(Number(req.params.skipValue))
      //   .limit(Number(req.params.limitValue))
      //   .exec(function(err, docs){
      //     if(err){
      //       throw err
      //     }else{
      //       console.log(req.params.skipValue, req.params.limitValue)
      //       res.json(docs)
      //     }
      // })

      posts.aggregate()
        .sort({postedOn:-1})
        .skip(Number(req.params.skipValue))
        .limit(Number(req.params.limitValue))
        .exec(function(err, docs){
          if(err){
            throw err
          }else{
            console.log(req.params.skipValue, req.params.limitValue)
            res.json(docs)
          }
      })
    })

module.exports = router
