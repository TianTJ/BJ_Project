$(function(){
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
   

    $(".info .t3 .a1").click(function(){
      //短剧
      $(".line .line_img").css({"left":"120px"})
      $(".info .dj").show();$(".info .fj").hide();$(".info .xh").hide()
      $(".info .t3 .a1").css({"color":"#000000"})
      $(".info .t3 .a2").css({"color":"#636363"})
      $(".info .t3 .a3").css({"color":"#636363"})
    })
    $(".info .t3 .a2").click(function(){
      //番剧
      $(".line .line_img").css({"left":"350px"})
      $(".info .dj").hide();$(".info .fj").show();$(".info .xh").hide()
      $(".info .t3 .a1").css({"color":"#636363"})
      $(".info .t3 .a2").css({"color":"#000000"})
      $(".info .t3 .a3").css({"color":"#636363"})
    })
    $(".info .t3 .a3").click(function(){
      //喜欢
      $(".line .line_img").css({"left":"568px"})
      $(".info .dj").hide();$(".info .fj").hide();$(".info .xh").show()
      $(".info .t3 .a1").css({"color":"#636363"})
      $(".info .t3 .a2").css({"color":"#636363"})
      $(".info .t3 .a3").css({"color":"#000000"})
    })
    $(".info .gz").click(function(){
      $(".gz_div").show()
    })
    $(".gz_div .close").click(function(){
      $(".gz_div").hide()
    })

    $('.bottom .open').click(function(){
      if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        if(isAndroid){
          window.location.href = "https://sj.qq.com/myapp/detail.htm?apkName=com.sycx.xtsj"
        }else if(isIOS){
          window.location.href = "https://itunes.apple.com/cn/app//id1448229470?mt=8"
        }
      }else {
        window.location.href = "https://sj.qq.com/myapp/detail.htm?apkName=com.sycx.xtsj"
      }
    })

    //打开app
    $(".head .open, .gz_div .opendk, .info .dj .openapp .img, .info .fj .openapp .img, .info .xh .openapp .img").click(function(){
      console.log("11111111111")
    })

    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
      MobLink([
        {
          el: "#open_app",
          path: "demo/a",
          
          params: {
            key1: "value1",
            key2: "value2",
          }
        },
      ])
    }
})