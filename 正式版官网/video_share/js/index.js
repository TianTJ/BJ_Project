$(function(){
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
   
    let video_idx = 0
    for(let i=1;i<=5;i++){
      video_idx++
      let row = $('.swiper-container .swiper-wrapper')
      row.append('<div class="swiper-slide swiper-slide_'+video_idx+'"></div>')
      for(let j=1;j<=3;j++){
        let rw = $('.swiper-container .swiper-wrapper .swiper-slide_'+video_idx)
        rw.append('<a class="a'+j+'"><img class="img_di" src="images/temp_b.png"><img class="djh" src="images/djh.png"><font class="h_num">第1话</font><img class="yy" src="images/yy.png"><img class="play_num_img" src="images/play_num.png"><font class="play_num">8596</font><font class="video_time">3:50</font><font class="name">空间相册空间的</font><img class="new" src="images/new.png"></a>')
      }
    } 
    new Swiper('.swiper-container', {
      slidesPerView: 1.6,
      spaceBetween: 30,
      direction: 'vertical',
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });

    $('.head .load').click(function(){
      //下載
    })
    $('.info .start_see').click(function(){
      //開始觀看
    })
    $('.video_head .xu').click(function(){
      //正序倒序

    })
    
})