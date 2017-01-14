flag = true

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
                            // htmlData = "<hr><div>"
                            // htmlData += "<h1>"+data[i].Sector+"</h1>"
                            // htmlData += "<h2>"+data[i].Industry+"</h1>"
                            // htmlData += "<h2>"+data[i].Price+"</h1>"
                            // htmlData += "</div>"
                            var postedBy = (getCookie('user')==data[i].postedBy)?'You':data[i].postedBy
                            var date = formPostDate(new Date(data[i].postedOn))
                            htmlData = "<hr><div class='timeline-block'>"
                            htmlData += "<h1><u>"+data[i].imageCaption+"</u></h1>"
                            htmlData += "<div class='post-image'><img src='/imgs/"+data[i].imageFile+"' alt='post-image' height='300' width='300'></div>"
                            htmlData += "<h2> posted by "+postedBy+" at "
                            htmlData += date
                            htmlData += "</h2></div>"

                            $('.timeline-feed').append(htmlData)
                        }
                    }else{
                    }
                },
                error: function(data){
                    alert('somethings wrong dude')
                }
            })

            $.each($('img'), function(k, v){
              v.onload = function(){
                if(v.height > v.width){
                  v.height = '100%'
                  v.width = 'auto'
                }
              }
            })
})

$(window).scroll(function(){

    if($(window).scrollTop() + $(window).height() == $(document).height()){
        skip = $('#start').val()
        limit = $('#limit').val()
        no_data = true
        if(flag && no_data){
            flag = false
            $.ajax({
                url:'/timeline/data/'+skip+'/'+limit,
                method: 'get',
                success: function(data){
                    flag = true;
                    if(data.length > 0){
                        $('#start').val(Number(skip)+Number(limit))
                        for(var i = 0; i < data.length; i++){
                          var postedBy = (getCookie('user')==data[i].postedBy)?'You':data[i].postedBy
                          var date = formPostDate(new Date(data[i].postedOn))
                          htmlData = "<hr><div class='timeline-block'>"
                          htmlData += "<h1><u>"+data[i].imageCaption+"</u></h1>"
                          htmlData += "<div class='post-image'><img src='/imgs/"+data[i].imageFile+"' alt='post-image' height='300' width='300'></div>"
                          htmlData += "<h2> posted by "+postedBy+" at "
                          htmlData += date
                          htmlData += "</h2></div>"
                            $('.timeline-feed').append(htmlData)
                        }
                    }else{
                        no_data = false
                    }
                },
                error: function(data){
                    flag = true
                    no_data = false
                    alert('somethings wrong dude')
                }
            })
        }

    }
})

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function postData(formData){

    $.ajax({
        url: '/post',
        method: 'post',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
            console.log('done :)')
            $('#postModal').modal('toggle')
        },
        error: function(data){
            console.log('oops :(')
            console.log(data)
        }
    })
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

$('.submit').on('click', function(e){
    e.preventDefault()
    var file = $('#inputFile')[0].files[0]
    var caption = $('#inputCaption').val()

    var formData = new FormData()

    if(file.length == 0){
        alert('select an image to upload')
        return false
    }

    formData.append('imgFile', file)
    formData.append('imgCaption', caption)

    postData(formData)
})

$('#postModal').on('hidden.bs.modal', function(){
  //TODO: refresh page after upload
  window.location = '/timeline'
})
