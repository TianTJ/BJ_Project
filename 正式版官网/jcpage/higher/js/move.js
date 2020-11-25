$(function(){
    var show_one = true
    var show_two = true
    $("#all .one .head").click(function(){
        if(show_one){
            $("#all .one .content .img").remove()
            $("#all .one .head .right").css({'transform':'rotate(90deg)'})
            show_one = false
        }else{
            show_one = true
            $("#all .one .head .right").css({'transform':'rotate(-90deg)'})
            var row = $('#all .one .content');
            row.append('<img src="images/camera/1.1.png" class="img">');
            row.append('<img src="images/camera/1.2.png" class="img">');
            row.append('<img src="images/camera/1.3.png" class="img">');
        }
        check_line()
    })
    $("#all .two .head").click(function(){
        if(show_two){
            $("#all .two .content .img").remove()
            $("#all .two .head .right").css({'transform':'rotate(90deg)'})
            show_two = false
            $("#bottom_div").hide()
        }else{
            show_two = true
            $("#bottom_div").show()
            $("#all .two .head .right").css({'transform':'rotate(-90deg)'})
            var row = $('#all .two .content');
            row.append('<img src="images/camera/2.1.png" class="img">');
            row.append('<img src="images/camera/2.2.png" class="img">');
            row.append('<img src="images/camera/2.3.png" class="img">');
            row.append('<img src="images/camera/2.4.png" class="img">');
            row.append('<img src="images/camera/2.5.png" class="img">');
            row.append('<img src="images/camera/2.6.png" class="img">');
            row.append('<img src="images/camera/2.7.png" class="img">');
            row.append('<img src="images/camera/2.8.png" class="img">');
            row.append('<img src="images/camera/2.9.png" class="img">');
            row.append('<img src="images/camera/end.png" class="img">');
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
    $("#all .two .copy").css({"left":hh/2-180+"px"})
    $("#all .two .tx").css({"left":hh/2-150+"px"})
    $("#all .tip .tipimg").css({"left":hhh/2-300+"px"})
    var clipboard = new ClipboardJS('#all .two .copy',{
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
        $("#all .two .copy").css({'transform':'scale(0.8)'})
        $("#all .two .tx").css({'transform':'scale(0.8)'})
        $("#all .two .copy").css({'-webkit-transform':'scale(0.8)'})
        $("#all .two .tx").css({'-webkit-transform':'scale(0.8)'})
    })
    $("#all .copy").mouseup(function(){
        $("#all .two .copy").css({'transform':'scale(1)'})
        $("#all .two .tx").css({'transform':'scale(1)'})
        $("#all .two .copy").css({'-webkit-transform':'scale(1)'})
        $("#all .two .tx").css({'-webkit-transform':'scale(1)'})
    })

    $("#all .copy").bind('touchstart', function(){
        $("#all .two .copy").css({'transform':'scale(0.8)'})
        $("#all .two .tx").css({'transform':'scale(0.8)'})
        $("#all .two .copy").css({'-webkit-transform':'scale(0.8)'})
        $("#all .two .tx").css({'-webkit-transform':'scale(0.8)'})
    }).bind('touchend', function(){
        $("#all .two .copy").css({'transform':'scale(1)'})
        $("#all .two .tx").css({'transform':'scale(1)'})
        $("#all .two .copy").css({'-webkit-transform':'scale(1)'})
        $("#all .two .tx").css({'-webkit-transform':'scale(1)'})
    });
})