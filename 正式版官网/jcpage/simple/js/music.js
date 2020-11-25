$(function(){
    var show_one = true
    var show_two = true
    var show_three = true
    $("#all .one .head").click(function(){
        if(show_one){
            $("#all .one .content .img").remove()
            $("#all .one .head .right").css({'transform':'rotate(90deg)'})
            show_one = false
        }else{
            show_one = true
            $("#all .one .head .right").css({'transform':'rotate(-90deg)'})
            var row = $('#all .one .content');
            row.append('<img src="images/music/1.png" class="img">');
            row.append('<img src="images/music/2.png" class="img">');
            row.append('<img src="images/music/3.png" class="img">');
            row.append('<img src="images/music/4.png" class="img">');
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
            row.append('<img src="images/music/5.png" class="img">');
            row.append('<img src="images/music/6.png" class="img">');
            row.append('<img src="images/music/7.png" class="img">');
            row.append('<img src="images/music/8.png" class="img">');
            row.append('<img src="images/music/9.png" class="img">');
            row.append('<img src="images/music/10.png" class="img">');
            row.append('<img src="images/music/11.png" class="img">');
        }
        check_line()
    })
    $("#all .three .head").click(function(){
        if(show_three){
            $("#all .three .content .img").remove()
            $("#all .three .head .right").css({'transform':'rotate(90deg)'})
            show_three = false
            $("#bottom_div").hide()
        }else{
            show_three = true
            $("#bottom_div").show()
            $("#all .three .head .right").css({'transform':'rotate(-90deg)'})
            var row = $('#all .three .content');
            row.append('<img src="images/music/12.png" class="img">');
            row.append('<img src="images/music/13.png" class="img">');
            row.append('<img src="images/music/end.png" class="img">');
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
    }
    $("#top img").click(function(){
		$("html, body").animate({scrollTop: 0},500);
    })
    var hh = $("#all .bottom").width()

    var hhh = $("#tip").width()
    $("#all .three .copy").css({"left":hh/2-180+"px"})
    $("#all .three .tx").css({"left":hh/2-150+"px"})
    $("#all .tip .tipimg").css({"left":hhh/2-300+"px"})
    var clipboard = new ClipboardJS('#all .three .copy',{
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
        $("#all .three .copy").css({'transform':'scale(0.8)'})
        $("#all .three .tx").css({'transform':'scale(0.8)'})
        $("#all .three .copy").css({'-webkit-transform':'scale(0.8)'})
        $("#all .three .tx").css({'-webkit-transform':'scale(0.8)'})
    })
    $("#all .copy").mouseup(function(){
        $("#all .three .copy").css({'transform':'scale(1)'})
        $("#all .three .tx").css({'transform':'scale(1)'})
        $("#all .three .copy").css({'-webkit-transform':'scale(1)'})
        $("#all .three .tx").css({'-webkit-transform':'scale(1)'})
    })

    $("#all .copy").bind('touchstart', function(){
        $("#all .three .copy").css({'transform':'scale(0.8)'})
        $("#all .three .tx").css({'transform':'scale(0.8)'})
        $("#all .three .copy").css({'-webkit-transform':'scale(0.8)'})
        $("#all .three .tx").css({'-webkit-transform':'scale(0.8)'})
    }).bind('touchend', function(){
        $("#all .three .copy").css({'transform':'scale(1)'})
        $("#all .three .tx").css({'transform':'scale(1)'})
        $("#all .three .copy").css({'-webkit-transform':'scale(1)'})
        $("#all .three .tx").css({'-webkit-transform':'scale(1)'})
    });
})