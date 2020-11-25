$(function(){
    var show_one = true
    var show_two = true
    var show_three = true
    var show_four = true
    var show_five = true
    var show_six = true
    var show_seven = true
    var show_eight = true
    var show_nine = true
    $("#all .one .head").click(function(){
        if(show_one){
            $("#all .one .content .img").remove()
            $("#all .one .head .right").css({'transform':'rotate(90deg)'})
            show_one = false
        }else{
            show_one = true
            $("#all .one .head .right").css({'transform':'rotate(-90deg)'})
            var row = $('#all .one .content');
            row.append('<img src="images/new_index/1.png" class="img">');
            row.append('<img src="images/new_index/2.png" class="img">');
            row.append('<img src="images/new_index/3.png" class="img">');
            row.append('<img src="images/new_index/4.png" class="img">');
            row.append('<img src="images/new_index/5.png" class="img">');
            row.append('<img src="images/new_index/6.png" class="img">');
            row.append('<img src="images/new_index/7.png" class="img">');
            row.append('<img src="images/new_index/8.png" class="img">');
            row.append('<img src="images/new_index/9.png" class="img">');
            row.append('<img src="images/new_index/10.png" class="img">');
            row.append('<img src="images/new_index/11.png" class="img">');
            row.append('<img src="images/new_index/12.png" class="img">');
        }
        check_line()
    })
    $("#all .two .head").click(function(){
        if(show_two){
            $("#all .two .content .img").remove()
            $("#all .two .head .right").css({'transform':'rotate(90deg)'})
            show_two = false
        }else{
            show_two = true
            $("#all .two .head .right").css({'transform':'rotate(-90deg)'})
            var row = $('#all .two .content');
            row.append('<img src="images/new_index/13.png" class="img">');
            row.append('<img src="images/new_index/14.png" class="img">');
            row.append('<img src="images/new_index/15.png" class="img">');
        }
        check_line()
    })
    $("#all .three .head").click(function(){
        if(show_three){
            $("#all .three .content .img").remove()
            $("#all .three .head .right").css({'transform':'rotate(90deg)'})
            show_three = false
        }else{
            show_three = true
            $("#all .three .head .right").css({'transform':'rotate(-90deg)'})
            var row = $('#all .three .content');
            row.append('<img src="images/new_index/16.png" class="img">');
            row.append('<img src="images/new_index/17.png" class="img">');
            row.append('<img src="images/new_index/18.png" class="img">');
            row.append('<img src="images/new_index/19.png" class="img">');
        }
        check_line()
    })
    $("#all .four .head").click(function(){
        if(show_four){
            $("#all .four .content .img").remove()
            $("#all .four .head .right").css({'transform':'rotate(90deg)'})
            show_four = false
        }else{
            show_four = true
            $("#all .four .head .right").css({'transform':'rotate(-90deg)'})
            var row = $('#all .four .content');
            row.append('<img src="images/new_index/20.png" class="img">');
            row.append('<img src="images/new_index/21.png" class="img">');
            row.append('<img src="images/new_index/22.png" class="img">');
            row.append('<img src="images/new_index/23.png" class="img">');
            row.append('<img src="images/new_index/24.png" class="img">');
            row.append('<img src="images/new_index/25.png" class="img">');
            row.append('<img src="images/new_index/26.png" class="img">');
            row.append('<img src="images/new_index/27.png" class="img">');
            row.append('<img src="images/new_index/28.png" class="img">');
            row.append('<img src="images/new_index/29.png" class="img">');
            row.append('<img src="images/new_index/30.png" class="img">');
        }
        check_line()
    })
    $("#all .five .head").click(function(){
        if(show_five){
            $("#all .five .content .img").remove()
            $("#all .five .head .right").css({'transform':'rotate(90deg)'})
            show_five = false
        }else{
            show_five = true
            $("#all .five .head .right").css({'transform':'rotate(-90deg)'})
            var row = $('#all .five .content');
            row.append('<img src="images/new_index/31.png" class="img">');
            row.append('<img src="images/new_index/32.png" class="img">');
            row.append('<img src="images/new_index/33.png" class="img">');
        }
        check_line()
    })
    $("#all .six .head").click(function(){
        if(show_six){
            $("#all .six .content .img").remove()
            $("#all .six .head .right").css({'transform':'rotate(90deg)'})
            show_six = false
        }else{
            show_six = true
            $("#all .six .head .right").css({'transform':'rotate(-90deg)'})
            var row = $('#all .six .content');
            row.append('<img src="images/new_index/34.png" class="img">');
            row.append('<img src="images/new_index/35.png" class="img">');
            row.append('<img src="images/new_index/36.png" class="img">');
        }
        check_line()
    })
    $("#all .seven .head").click(function(){
        if(show_seven){
            $("#all .seven .content .img").remove()
            $("#all .seven .head .right").css({'transform':'rotate(90deg)'})
            show_seven = false
        }else{
            show_seven = true
            $("#all .seven .head .right").css({'transform':'rotate(-90deg)'})
            var row = $('#all .seven .content');
            row.append('<img src="images/new_index/37.png" class="img">');
            row.append('<img src="images/new_index/38.png" class="img">');
        }
        check_line()
    })
    $("#all .eight .head").click(function(){
        if(show_eight){
            $("#bottom_div").hide()
            $("#all .eight .content .img").remove()
            $("#all .eight .head .right").css({'transform':'rotate(90deg)'})
            show_eight = false
        }else{
            show_eight = true
            $("#bottom_div").show()
            $("#all .eight .head .right").css({'transform':'rotate(-90deg)'})
            var row = $('#all .eight .content');
            row.append('<img src="images/new_index/39.png" class="img">');
            row.append('<img src="images/new_index/end.png" class="img">');
        }
        check_line()
    })
    var check_line = function(){
        if(!show_one){
            $("#all .one .line").css({"border-bottom":"0px"})
        }else{
            $("#all .one .line").css({"border-bottom":"1px solid #ededed"})
        }
        if(!show_two){
            $("#all .two .line").css({"border-bottom":"0px"})
        }else{
            $("#all .two .line").css({"border-bottom":"1px solid #ededed"})
        }
        if(!show_three){
            $("#all .three .line").css({"border-bottom":"0px"})
        }else{
            $("#all .three .line").css({"border-bottom":"1px solid #ededed"})
        }
        if(!show_four){
            $("#all .four .line").css({"border-bottom":"0px"})
        }else{
            $("#all .four .line").css({"border-bottom":"1px solid #ededed"})
        }
        if(!show_five){
            $("#all .five .line").css({"border-bottom":"0px"})
        }else{
            $("#all .five .line").css({"border-bottom":"1px solid #ededed"})
        }
        if(!show_six){
            $("#all .six .line").css({"border-bottom":"0px"})
        }else{
            $("#all .six .line").css({"border-bottom":"1px solid #ededed"})
        }
        if(!show_seven){
            $("#all .seven .line").css({"border-bottom":"0px"})
        }else{
            $("#all .seven .line").css({"border-bottom":"1px solid #ededed"})
        }
    }
    $("#top img").click(function(){
		$("html, body").animate({scrollTop: 0},500);
    })
    var hh = $("#all .bottom").width()

    var hhh = $("#tip").width()
    $("#all .eight .copy").css({"left":hh/2-180+"px"})
    $("#all .eight .tx").css({"left":hh/2-150+"px"})
    $("#all .tip .tipimg").css({"left":hhh/2-300+"px"})
    var clipboard = new ClipboardJS('#all .eight .copy',{
        text: function() {
            return '659740589';
        }
    });
    clipboard.on('success', function(e) {
        success_ani()
    });
    clipboard.on('error', function(e) {
        console.log(e);
    }); 
    var is_touch = false
    var success_ani = function(){
        if(!is_touch){
            is_touch = true
            $("#tip").show()
            $("#tip").animate({bottom:"1200px"},1000,function(){
                $("#tip").hide()
                $("#tip").css({bottom:"500px"})
                is_touch = false
            });
        }
    }
    
    $("#all .copy").mousedown(function(){
        $("#all .eight .copy").css({'transform':'scale(0.8)'})
        $("#all .eight .tx").css({'transform':'scale(0.8)'})
        $("#all .eight .copy").css({'-webkit-transform':'scale(0.8)'})
        $("#all .eight .tx").css({'-webkit-transform':'scale(0.8)'})
    })
    $("#all .copy").mouseup(function(){
        $("#all .eight .copy").css({'transform':'scale(1)'})
        $("#all .eight .tx").css({'transform':'scale(1)'})
        $("#all .eight .copy").css({'-webkit-transform':'scale(1)'})
        $("#all .eight .tx").css({'-webkit-transform':'scale(1)'})
    })

    $("#all .copy").bind('touchstart', function(){
        $("#all .eight .copy").css({'transform':'scale(0.8)'})
        $("#all .eight .tx").css({'transform':'scale(0.8)'})
        $("#all .eight .copy").css({'-webkit-transform':'scale(0.8)'})
        $("#all .eight .tx").css({'-webkit-transform':'scale(0.8)'})
    }).bind('touchend', function(){
        $("#all .eight .copy").css({'transform':'scale(1)'})
        $("#all .eight .tx").css({'transform':'scale(1)'})
        $("#all .eight .copy").css({'-webkit-transform':'scale(1)'})
        $("#all .eight .tx").css({'-webkit-transform':'scale(1)'})
    });
})