
$("#content .letter_content").css({"top":$(window).height()/2-300})
$("#time").css({"top":$(window).height()/2-100})
$("#content .letter_content1").css({"top":$(window).height()/2})
$("#content .letter_content2").css({"top":$(window).height()/2-200})
var num = 0;var time = 60
$("#time img").click(function(){
    if(num==0){
        var interval = setInterval(function(){
            time--
            if(time<0){time=0;clearInterval(interval)}
            $(".letter_content1 .lc").text("倒计时："+time);
        },1000);
    }
    if(time!=0){
        num++
        $(".letter_content1 .ln").text("次数："+num);
    }else{
        var n = 0
        if(num>=280){n=3}
        if(num>=300){n=2}
        if(num>=320){n=1}
        $('#content .letter_content2').css({'opacity':"1"})
        if(n==0){
            $(".letter_content2 .ln").text("没有获奖！！！");
            return
        }
        $(".letter_content2 .ln").text("恭喜获得"+n+"等奖");
    }
})