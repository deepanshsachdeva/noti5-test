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
                            htmlData = "<hr><div>"
                            htmlData += "<h1>"+data[i].Sector+"</h1>"
                            htmlData += "<h2>"+data[i].Industry+"</h1>"
                            htmlData += "<h2>"+data[i].Price+"</h1>"
                            htmlData += "</div>"

                            $('.timeline-feed').append(htmlData)
                        }
                    }else{
                    }
                },
                error: function(data){
                    alert('somethings wrong dude')
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
                            htmlData = "<hr><div>"
                            htmlData += "<h1>"+data[i].Sector+"</h1>"
                            htmlData += "<h2>"+data[i].Industry+"</h1>"
                            htmlData += "<h2>"+data[i].Price+"</h1>"
                            htmlData += "</div>"
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