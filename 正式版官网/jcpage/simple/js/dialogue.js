$(function(){
    var show_one = true
    var show_two = true
    var show_three = true
    var show_four = true
    $("#all .one .head").click(function(){
        if(show_one){
            $("#all .one .content .img").remove()
            $("#all .one .head .right").css({'transform':'rotate(90deg)'})
            show_one = false
        }else{
            show_one = true
            $("#all .one .head .right").css({'transform':'rotate(-90deg)'})
            var row = $('#all .one .content');
            row.append('<img src="images/dialogue/1.1.png" class="img">');
            row.append('<img src="images/dialogue/1.2.png" class="img">');
            row.append('<img src="images/dialogue/1.3.png" class="img">');
            row.append('<img src="images/dialogue/1.4.png" class="img">');
            row.append('<img src="images/dialogue/1.5.png" class="img">');
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
            row.append('<img src="images/dialogue/2.1.png" class="img">');
            row.append('<img src="images/dialogue/2.2.png" class="img">');
            row.append('<img src="images/dialogue/2.3.png" class="img">');
            row.append('<img src="images/dialogue/2.4.png" class="img">');
            row.append('<img src="images/dialogue/2.5.png" class="img">');
            row.append('<img src="images/dialogue/2.6.png" class="img">');
            row.append('<img src="images/dialogue/2.7.png" class="img">');
            row.append('<img src="images/dialogue/2.8.png" class="img">');
            row.append('<img src="images/dialogue/2.9.png" class="img">');
            row.append('<img src="images/dialogue/2.10.png" class="img">');
            row.append('<img src="images/dialogue/2.11.png" class="img">');
            row.append('<img src="images/dialogue/2.12.png" class="img">');
            row.append('<img src="images/dialogue/2.13.png" class="img">');
            row.append('<img src="images/dialogue/2.14.png" class="img">');
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
            row.append('<img src="images/dialogue/3.1.png" class="img">');
            row.append('<img src="images/dialogue/3.2.png" class="img">');
            row.append('<img src="images/dialogue/3.3.png" class="img">');
        }
        check_line()
    })
    $("#all .four .head").click(function(){
        if(show_four){
            $("#all .four .content .img").remove()
            $("#all .four .head .right").css({'transform':'rotate(90deg)'})
            show_four = false
            $("#bottom_div").hide()
        }else{
            show_four = true
            $("#bottom_div").show()
            $("#all .four .head .right").css({'transform':'rotate(-90deg)'})
            var row = $('#all .four .content');
            row.append('<img src="images/dialogue/4.1.png" class="img">');
            row.append('<img src="images/dialogue/4.2.png" class="img">');
            row.append('<img src="images/dialogue/4.3.png" class="img">');
            row.append('<img src="images/dialogue/4.4.png" class="img">');
            row.append('<img src="images/dialogue/4.5.png" class="img">');
            row.append('<img src="images/dialogue/4.6.png" class="img">');
            row.append('<img src="images/dialogue/4.7.png" class="img">');
            row.append('<img src="images/dialogue/4.8.png" class="img">');
            row.append('<img src="images/dialogue/end.png" class="img">');
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
    }
    $("#top img").click(function(){
		$("html, body").animate({scrollTop: 0},500);
    })
    var hh = $("#all .bottom").width()

    var hhh = $("#tip").width()
    $("#all .four .copy").css({"left":hh/2-180+"px"})
    $("#all .four .tx").css({"left":hh/2-150+"px"})
    $("#all .tip .tipimg").css({"left":hhh/2-300+"px"})
    var clipboard = new ClipboardJS('#all .four .copy',{
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
        $("#all .four .copy").css({'transform':'scale(0.8)'})
        $("#all .four .tx").css({'transform':'scale(0.8)'})
        $("#all .four .copy").css({'-webkit-transform':'scale(0.8)'})
        $("#all .four .tx").css({'-webkit-transform':'scale(0.8)'})
    })
    $("#all .copy").mouseup(function(){
        $("#all .four .copy").css({'transform':'scale(1)'})
        $("#all .four .tx").css({'transform':'scale(1)'})
        $("#all .four .copy").css({'-webkit-transform':'scale(1)'})
        $("#all .four .tx").css({'-webkit-transform':'scale(1)'})
    })

    $("#all .copy").bind('touchstart', function(){
        $("#all .four .copy").css({'transform':'scale(0.8)'})
        $("#all .four .tx").css({'transform':'scale(0.8)'})
        $("#all .four .copy").css({'-webkit-transform':'scale(0.8)'})
        $("#all .four .tx").css({'-webkit-transform':'scale(0.8)'})
    }).bind('touchend', function(){
        $("#all .four .copy").css({'transform':'scale(1)'})
        $("#all .four .tx").css({'transform':'scale(1)'})
        $("#all .four .copy").css({'-webkit-transform':'scale(1)'})
        $("#all .four .tx").css({'-webkit-transform':'scale(1)'})
    });
})