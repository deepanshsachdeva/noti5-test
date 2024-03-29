flag = true

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function formPostDate(date){

  var result = ""
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours ? hours : 12
  minutes = minutes < 10 ? '0'+minutes : minutes
  var strTime = hours + ':' + minutes + ' ' + ampm

  result += date.getDate()
  result += (" "+monthNames[date.getMonth()])
  result += (" "+date.getFullYear())
  result += (" "+strTime)

  return result
}

function getBlockHtml(data){
  var postedBy = data.postedBy
  var date = formPostDate(new Date(data.postedOn))
  var htmlData = null

  htmlData = "<div class='timeline-block'>"
  //htmlData += "<div class='heading'>"+data.imageCaption+"</div>"
  // htmlData += "<div class='post-image'><img src='/imgs/"+data.imageFile+"' alt='post-image' height='300' width='300'></div>"
  htmlData += "<div class='post-image shadow-effect'><div class='photograph'><a href='/imgs/"+data.imageFile+"' data-lightbox='"+data.imageFile+"' data-title='"+data.imageCaption+"'>"
  htmlData += "<img src='/imgs/"+data.imageFile+"' alt='post-image' height='300' width='300'>"
  htmlData += "</a><div class='heading'>"+data.imageCaption+"</div></div></div>"
  htmlData += "<div class='block-info'><p class='text-muted'>posted by </p><p class='text-primary'><strong><a href='/profile/"+data.postedBy+"'>"+postedBy+"</a></strong><p class='text-muted'> on </p><p class='text-primary'><strong>"
  htmlData += date
  htmlData += "<strong></p></div></div><hr>"

  return htmlData
}

function validateFileExtension(field){
  var ext = field.val().split('.').pop().toLowerCase();
  if($.inArray(ext, ['png','jpg','jpeg']) == -1) {
    alert('invalid extension!')
    field.val("")
    return false
  }
  return true
}

function postData(formData){
    $.ajax({
        url: '/post',
        method: 'post',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
          if(data.resp == 'success'){
            console.log('done :)')
            $('.submit').attr('disabled', 'disabled').addClass('btn-success').button('complete')
            setTimeout(function(){
              //just wait
              $('.submit').removeClass('btn-success').removeAttr('disabled')
              $('#postModal').modal('toggle')
            }, 700)
          }else{
            $('.submit').attr('disabled', 'disabled').addClass('btn-danger').button('error')
            setTimeout(function(){
                $('.submit').removeClass('btn-danger').button('reset').removeAttr('disabled')
            },400)
          }
        },
        error: function(data){
            console.log('oops :(')
            console.log(data)
            $('.submit').attr('disabled', 'disabled').addClass('btn-danger').button('error')
            setTimeout(function(){
                $('.submit').removeClass('btn-danger').button('reset').removeAttr('disabled')
            },400)
        },
        complete: function(){
          $('#inputFile').val('')
          $('#inputCaption').val('')
        }
    })
}

$(document).ready(function(){
    skip = $('#start').val()
    limit = $('#limit').val()
    $.ajax({
      url:'/timeline/data/'+skip+'/'+limit,
      method: 'get',
      success: function(data){
          flag = true;
          if(data.length > 0){
              $('#start').val(Number(skip)+Number(limit))
              for(var i = 0; i < data.length; i++){
                  $('.timeline-feed').append(getBlockHtml(data[i]))
              }
          }
      },
      error: function(data){
          alert('Oops! somethings wrong')
      }
    })

    $(window).scroll(function(){

        if($(window).scrollTop() + $(window).height() == $(document).height()){
            skip = $('#start').val()
            limit = $('#limit').val()
            no_data = true

            if(flag && no_data){
              flag = false
              htmlLoader = "<div class='loader-img'><img src='/images/ajax-loader.gif' alt='loading'></div>"

              $.ajax({
                  url:'/timeline/data/'+skip+'/'+limit,
                  method: 'get',
                  beforeSend: function(){
                      $('.timeline-feed').append(htmlLoader)
                  },
                  complete: function(){
                      $('div').remove('.loader-img')
                  },
                  success: function(data){
                      flag = true;
                      if(data.length > 0){
                          $('#start').val(Number(skip)+Number(limit))
                          for(var i = 0; i < data.length; i++){
                            $('.timeline-feed').append(getBlockHtml(data[i]))
                          }
                      }else{
                          no_data = false
                      }
                  },
                  error: function(data){
                      flag = true
                      no_data = false
                  }
              })
            }
        }
    })

    $('.submit').on('click', function(e){
      e.preventDefault()
      var file = $('#inputFile')[0].files[0]
      var caption = $('#inputCaption').val()

      var formData = new FormData()

      if(!validateFileExtension($('#inputFile'))){
        return false
      }

      if(file != undefined && file.length == 0){
          alert('select an image to upload')
          return false
      }

      formData.append('imgFile', file)
      formData.append('imgCaption', caption)

      $(this).button('loading')

      postData(formData)
    })

    $('#postModal').on('hidden.bs.modal', function(){
      $('.submit').button('reset')
    })

    $.each($('img'), function(k, v){
      v.onload = function(){
        if(v.height > v.width){
        v.height = '100%'
        v.width = 'auto'
        }
      }
    })

    lightbox.option({
        disableScrolling: true,
        fadeDuration: 300
    })
})
