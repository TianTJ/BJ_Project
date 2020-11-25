$(function(){
    $("#top img").click(function(){
		$("html, body").animate({scrollTop: 0},500);
    })
    var hh = $("#all .one .bottom").width()
    var hhh = $("#tip").width()
    $("#all .one .copy").css({"left":hh/2-180+"px"})
    $("#all .one .tx").css({"left":hh/2-150+"px"})
    $("#all .tip .tipimg").css({"left":hhh/2-300+"px"})
    var clipboard = new ClipboardJS('#all .one .copy',{
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
                $("#tip").css({bottom:"800px"})
                is_touch = false
            });
        }
    }
    
    $("#all .one .copy").mousedown(function(){
        $("#all .one .copy").css({'transform':'scale(0.8)'})
        $("#all .one .tx").css({'transform':'scale(0.8)'})
        $("#all .one .copy").css({'-webkit-transform':'scale(0.8)'})
        $("#all .one .tx").css({'-webkit-transform':'scale(0.8)'})
    })
    $("#all .one .copy").mouseup(function(){
        $("#all .one .copy").css({'transform':'scale(1)'})
        $("#all .one .tx").css({'transform':'scale(1)'})
        $("#all .one .copy").css({'-webkit-transform':'scale(1)'})
        $("#all .one .tx").css({'-webkit-transform':'scale(1)'})
    })

    $("#all .one .copy").bind('touchstart', function(){
        $("#all .one .copy").css({'transform':'scale(0.8)'})
        $("#all .one .tx").css({'transform':'scale(0.8)'})
        $("#all .one .copy").css({'-webkit-transform':'scale(0.8)'})
        $("#all .one .tx").css({'-webkit-transform':'scale(0.8)'})
    }).bind('touchend', function(){
        $("#all .one .copy").css({'transform':'scale(1)'})
        $("#all .one .tx").css({'transform':'scale(1)'})
        $("#all .one .copy").css({'-webkit-transform':'scale(1)'})
        $("#all .one .tx").css({'-webkit-transform':'scale(1)'})
    });
})