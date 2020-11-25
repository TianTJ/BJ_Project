$(function(){
    var show_one = true
    var show_two = true
    var show_three = true
    var show_four = true
    var show_five = true
    var show_six = true
    var show_seven = true
    $("#all .one .head").click(function(){
        if(show_one){
            $("#all .one .content .img").remove()
            $("#all .one .head .right").css({'transform':'rotate(90deg)'})
            show_one = false
        }else{
            show_one = true
            $("#all .one .head .right").css({'transform':'rotate(-90deg)'})
            var row = $('#all .one .content');
            row.append('<img src="images/edit/1.1.png" class="img">');
            row.append('<img src="images/edit/1.2.png" class="img">');
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
            row.append('<img src="images/edit/2.1.png" class="img">');
            row.append('<img src="images/edit/2.2.png" class="img">');
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
            row.append('<img src="images/edit/3.1.png" class="img">');
            row.append('<img src="images/edit/3.2.png" class="img">');
            row.append('<img src="images/edit/3.3.png" class="img">');
            row.append('<img src="images/edit/3.4.png" class="img">');
            row.append('<img src="images/edit/3.5.png" class="img">');
            row.append('<img src="images/edit/3.6.png" class="img">');
            row.append('<img src="images/edit/3.7.png" class="img">');
            row.append('<img src="images/edit/3.8.png" class="img">');
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
            row.append('<img src="images/edit/4.1.png" class="img">');
            row.append('<img src="images/edit/4.2.png" class="img">');
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
            row.append('<img src="images/edit/5.1.png" class="img">');
            row.append('<img src="images/edit/5.2.png" class="img">');
            row.append('<img src="images/edit/5.3.png" class="img">');
            row.append('<img src="images/edit/5.4.png" class="img">');
        }
        check_line()
    })
    $("#all .six .head").click(function(){
        if(show_six){
            $("#bottom_div").hide()
            $("#all .six .content .img").remove()
            $("#all .six .head .right").css({'transform':'rotate(90deg)'})
            show_six = false
        }else{
            show_six = true
            $("#bottom_div").show()
            $("#all .six .head .right").css({'transform':'rotate(-90deg)'})
            var row = $('#all .six .content');
            row.append('<img src="images/edit/6.1.png" class="img">');
            row.append('<img src="images/edit/6.2.png" class="img">');
            row.append('<img src="images/edit/end.png" class="img">');
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
    }
    $("#top img").click(function(){
		$("html, body").animate({scrollTop: 0},500);
    })
    var hh = $("#all .bottom").width()

    var hhh = $("#tip").width()
    $("#all .six .copy").css({"left":hh/2-180+"px"})
    $("#all .six .tx").css({"left":hh/2-150+"px"})
    $("#all .tip .tipimg").css({"left":hhh/2-300+"px"})
    var clipboard = new ClipboardJS('#all .six .copy',{
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
        $("#all .six .copy").css({'transform':'scale(0.8)'})
        $("#all .six .tx").css({'transform':'scale(0.8)'})
        $("#all .six .copy").css({'-webkit-transform':'scale(0.8)'})
        $("#all .six .tx").css({'-webkit-transform':'scale(0.8)'})
    })
    $("#all .copy").mouseup(function(){
        $("#all .six .copy").css({'transform':'scale(1)'})
        $("#all .six .tx").css({'transform':'scale(1)'})
        $("#all .six .copy").css({'-webkit-transform':'scale(1)'})
        $("#all .six .tx").css({'-webkit-transform':'scale(1)'})
    })

    $("#all .copy").bind('touchstart', function(){
        $("#all .six .copy").css({'transform':'scale(0.8)'})
        $("#all .six .tx").css({'transform':'scale(0.8)'})
        $("#all .six .copy").css({'-webkit-transform':'scale(0.8)'})
        $("#all .six .tx").css({'-webkit-transform':'scale(0.8)'})
    }).bind('touchend', function(){
        $("#all .six .copy").css({'transform':'scale(1)'})
        $("#all .six .tx").css({'transform':'scale(1)'})
        $("#all .six .copy").css({'-webkit-transform':'scale(1)'})
        $("#all .six .tx").css({'-webkit-transform':'scale(1)'})
    });
})