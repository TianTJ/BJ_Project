//首页初始化
window.setInterval(function(){
     upt_time()
},1000);
function upt_time(){
    var now_time = new Date()
    var t_str = now_time.getFullYear()+"-"+ (now_time.getMonth()+1)+"-"+now_time.getDate()+" "+now_time.getHours()+":"+now_time.getMinutes()+":"+now_time.getSeconds()
    $("#time .upt").text("2018-04-9 24:00:00 — "+t_str)

    var s1 = new Date("2018-04-09 24:00:00"),
    s2 = new Date(),
    runTime = parseInt((s2.getTime() - s1.getTime()) / 1000);
    var year = Math.floor(runTime / 86400 / 365);
    runTime = runTime % (86400 * 365);
    var month = Math.floor(runTime / 86400 / 30);
    runTime = runTime % (86400 * 30);
    var day = Math.floor(runTime / 86400);
    runTime = runTime % 86400;
    var hour = Math.floor(runTime / 3600);
    runTime = runTime % 3600;
    var minute = Math.floor(runTime / 60);
    runTime = runTime % 60;
    var second = runTime;
    //亲爱的老婆，我们已经在一起
    $("#time .cn").text("亲爱的老婆，我们已经在一起"+year+"年"+month+"月"+day+"天"+hour+"时"+minute+"分"+second+"秒了")
}
upt_time()
$("#time").css({"top":$(window).height()/2-100})
$("#content .letter_content").css({"top":$(window).height()/2-30})
$("#content .letter_content1").css({"top":$(window).height()/2})
$("#content .content_icon").css({"top":$(window).height()/2-320})
$("#head .main_page").css({"left":$(window).width()/2})
$("#head .album_page").css({"left":$(window).width()/2+140})
$("#head .record_page").css({"left":$(window).width()/2+280})

$(".zhu").click(function(){
    window.open("lottery.html")
})