$(function(){
    $.ajax({
        type:"POST",
        url: "http://192.168.1.66:8083/system/clothingNotice",
        data: "",
        dataType:"json",
        headers:{},
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
        },
        success:function(data, status, xhr){
            initui(data.data)
        },
        error: function(err){
            console.log(err)
        }
         
    })

    function initui(data){
        data.sort(function(a,b){
            return a.sort - b.sort
        })
        for(let i in data){
            var row = $('#all');
            var str = '<div class="one"><img src="http://test-user-1.xintiaoshijie.com/'+data[i].name+'"></div>'
            row.append(str);
        }
        $('#all .one').css({"position":"relative","height":"auto","width":"1125px"})
    }
})
