var express = require('express')
var cookieParser = require('cookie-parser')
var path = require('path')
var fs = require('fs')
var formidable = require('formidable')
var readChunk = require('read-chunk')
var fileType = require('file-type')
var posts = require('./../models/posts')

var router = express.Router()
var status = {
  resp: null
}

router.use(cookieParser())

router.use(function(req, res, next){
  if(req.cookies.user == undefined){
    res.redirect('/login')
  }else{
    next()
  }
})

router.route('/')
    .post(function(req, res){
      var form = new formidable.IncomingForm(), filename=null, caption=null, postDateTime=null

      form.uploadDir = path.join(__dirname, "..", "tmp")

      form.parse(req, function (err, fields, files) {
        caption = fields.imgCaption
      })

      form.on('fileBegin', function(name, file){
        console.log('receieved file  '+name+" -- "+file)
      })

      form.on('file', function (name, file){

        var buffer = readChunk.sync(file.path, 0, 262)
        var type = fileType(buffer)

        if (type !== null && (type.ext === 'png' || type.ext === 'jpg' || type.ext === 'jpeg')) {
          postDateTime = Date.now()
          filename = postDateTime + '-' + file.name
          fs.rename(file.path, path.join(__dirname, '..', 'public/imgs/' + filename))
          status.resp = 'success'
        }else{
          fs.unlink(file.path)
          status.resp = 'error'
        }
      })

      form.on('error', function(err) {
        console.log('Error: ' + err)

        status.resp = 'error'
        res.status(200).json(status)
      })

      form.on('end', function() {
        console.log('Form processed.');
        if(status.resp == 'success'){
          var post = new posts({
            imageFile: filename,
            imageCaption: caption,
            postedBy: req.cookies.user,
            postedOn: postDateTime
          })

          post.save(function(err){
            if(err){
              status.resp = 'error'
            }
          })
        }

        res.status(200).json(status)
      })

    })

module.exports = router
