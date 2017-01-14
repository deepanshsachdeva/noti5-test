var express = require('express')
var cookieParser = require('cookie-parser')
var path = require('path')
var fs = require('fs')
var formidable = require('formidable')
var readChunk = require('read-chunk')
var fileType = require('file-type')
var posts = require('./../models/posts')

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
      res.send()
    })

    .post(function(req, res){
      var status = {}, form = new formidable.IncomingForm(), filename=null, caption=null, postDateTime=null

      form.uploadDir = path.join(__dirname, "..", "tmp")

      form.parse(req, function (err, fields, files) {
        caption = fields.imgCaption
      })

      form.on('fileBegin', function(name, file){
        console.log('begin '+name+" -- "+file)
      })

      form.on('file', function (name, file){
        console.log('file coming')

        var buffer = null, type = null

        buffer = readChunk.sync(file.path, 0, 262);
        type = fileType(buffer);
        if (type !== null && (type.ext === 'png' || type.ext === 'jpg' || type.ext === 'jpeg')) {
          postDateTime = Date.now()
          filename = postDateTime + '-' + file.name;
          fs.rename(file.path, path.join(__dirname, '..', 'public/imgs/' + filename))
          status.resp = 'done'
        }else{
         status.resp = 'error'
        }
      })

      form.on('error', function(err) {
        console.log('Error occurred during processing - ' + err);
      })

      form.on('end', function() {
        console.log('All the request fields have been processed.');
        console.log(filename, caption);
        var post = new posts({
          imageFile: filename,
          imageCaption: caption,
          postedBy: req.cookies.user,
          postedOn: postDateTime
        })
        post.save(function(err){
          if(err){
            throw err
          }else{
            console.log('added to db')
            res.status(200).json(status)
          }
        })
      })

    })

module.exports = router
