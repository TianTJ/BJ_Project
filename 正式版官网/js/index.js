$(function(){
	var is_show_menu = false;
	var $window = $(window);
	var $document = $(document);
	var win_h = $window.height();
	var win_w = $window.width(); 
	var winscr = $window.scrollTop();
	var winper = Math.max(960,win_w)/1980;
	winper=winper*winper;
	var hper = win_h/960;
	var winbtm = win_h + winscr;
	var wincen = win_h / 2 + winscr;
	var contop = $("#contents").offset().top+45;
	var menufix =true;
	if (navigator.userAgent.indexOf("Chrome") != -1) var isWebkit = true;
	if (navigator.userAgent.indexOf("Safari") != -1) var isWebkit = true;
	if (navigator.userAgent.indexOf("iPad") != -1) var iPad = true;

	var h3num=0;
	var pnlnum=0;
	var pn_l=$(".pn").length;
	var ltnum=0;
	var lt_l=$(".lt").length;
	var specnum=0;
	var ytmo=false;
	var per = 1;
	var sX=0;
	var nX=0;
	var sY=0;
	var nY=0;
	var opend=false;
	var ctsc=[0]
	var nowpos=0;
	var oldpos=0;
	var btmpos=0;
	var oldbtm=1;
	var noaction=false;
	
	$("#m_bg").css({'top':-win_w*0.5});
	var d=500;
	$("div#contents").css({'height':win_h});
	$(window).bind("load", function(){
		if(!noaction){
			setTimeout(function(){$("html, body").animate({scrollTop: 80},600);},40);
			$("#white").fadeTo(900,0,function(){$(this).hide();});
			$("#menu").delay(d+2300).animate({'right':80},500,$.bez([0.137, 0.753, 0.27, 0.99]));
			$("#m_bg").animate({'top':0,opacity:1},1600,$.bez([0.283, 0.627, 0.467, 0.997]));
			$("#m_bg .bg2").css({y:-500}).animate({y:0},1600,$.bez([0.283, 0.627, 0.467, 0.997]));
			$("#mv").delay(700+d).fadeTo(1600,1);
			$("#mv .bg1").delay(800+d).fadeTo(500,1);
			$("#mv .bg2").delay(800+d).fadeTo(500,1);
			
			$("#mv .c1").delay(1350+d).css({scale:2,y:-22,"left":"140%",opacity:1}).animate({scale:1,"left":-sX/40,opacity:1},900,$.bez([0.147, 1.067, 0.597, 0.99]));
			$("#mv .c2").delay(1200+d).animate({scale:3,y:13,"left":"-190%",opacity:1},0).animate({scale:1.04,"left":-sX/20,opacity:1},900,$.bez([0.147, 1.067, 0.597, 0.99]));
			$("#mv .show_video").animate({opacity:1},1600);
			$("#mv .show_video_img").animate({opacity:1},1600);
			$("#mv .jptl").animate({opacity:1},1600);
			$("#mv .big_title").animate({opacity:1},1600);
			$("#video_div").animate({opacity:1},1600);
			setTimeout(function(){
				opend=true;
				$("#grk").css({"opacity":'1'})
				sizefix();
			},d+1000);
		}else{
			setTimeout(function(){$("html, body").css({scrollTop: 80},600);},40);
			$("#white").fadeTo(0,0,function(){$(this).hide();});
			$("#menu").css({'right':80});
			$("#m_bg").css({'top':0,opacity:1});
			$("#m_bg .bg2").css({y:0});
			$("#mv").fadeTo(0,1);
			$("#mv .bg1,#mv").fadeTo(0,1);
			$("#mv .bg2,#mv").fadeTo(0,1);
			$("#mv .c1").css({scale:1,"left":-sX/40,opacity:1});
			$("#mv .c2").css({scale:1,"left":-sX/20,opacity:1});
			$("#contents .show_video").css({opacity:1});
			$("#mv .show_video").animate({opacity:1},1600);
			$("#mv .show_video_img").animate({opacity:1},1600);
			$("#mv .jptl").animate({opacity:1},1600);
			$("#mv .big_title").animate({opacity:1},1600);
			$("#video_div").animate({opacity:1},1600);
			setTimeout(function(){
				opend=true;
				$("#grk").css({"opacity":'1'})
				sizefix();
			},d);
		}
	});
	setTimeout(function(){startTimer();} , 2500+d)
	if(noaction){
		$("div h3 img, .pn, .lt .bg, .lt p img, .lt h4, .copy img,#character .i1, #character .i2, #spec h2 img, #spec .subp,#reserve h4,#reserve .img,#reserve p.limited,#reserve .contents,#reserve p,#reserve a.store").fadeTo(0,1);
		$("#character .arrow, #qanda p").fadeTo(0,1);
	}else{
		$("#spec dt").css({"margin-right":112,"width":0});
		$("#spec dd").css({"margin-right":293,"width":0});
	}
	$("body").mousemove(function(e){
		sX=(e.clientX-win_w/2)
		sY=(e.clientY-win_h/2)
	});
	
	$window.scroll(function (){
		if(opend){scrollfunc();}
    });
	var scrollfunc=function(){
  		if(winscr>$window.scrollTop()){sft-=0.5}else{sft+=0.5}
    	winscr = $window.scrollTop();
    	winbtm = win_h + winscr
		if(!iPad && opend && !noaction){
			$("#m_bg").css({y:-winscr*0.18*winper});
			$("#m_bg .bg2").css({y:-winscr*0.03*winper});
			$("#bg").css({y:-winscr*0.6	});
		}
		if(winscr<contop){if(menufix){$("#menu").css({"position":"absolute","top":"120px"});menufix=false}}
				   else if(!menufix){$("#menu").css({"position":"fixed","top":"10px"});menufix=true}
		nowpos=0;
		btmpos=0;
		for(i=0;i<8;i++){if(winscr+500>ctsc[i]){nowpos++};if(winbtm-130>ctsc[i]){btmpos++}}
		if(oldpos!=nowpos){
			oldpos=nowpos;
			$("#menu .maru").css({"top":35+(nowpos)*40,opacity:1})
			$('#menu .maru').each( function() {$('#menu .maru').prop('src', $('#menu .maru').attr('src'));});
		}
		if(sft<0 && !noaction){
			if(oldbtm>btmpos){
				oldbtm=btmpos;
				h3num=btmpos
				if(btmpos==0){pnlnum=0;ltnum=0;}
				if(btmpos==1){pnlnum=1;ltnum=1;}
				if(btmpos==2){pnlnum=2;ltnum=1;}
				if(btmpos==3){pnlnum=5;ltnum=5;}
				if(btmpos==4){pnlnum=8;ltnum=8;}
				if(btmpos==5){pnlnum=11;ltnum=9;}
				if(btmpos==6){pnlnum=15;ltnum=12;specnum=0;}
			}
		}else{
			oldbtm=btmpos;
		}
		if(!noaction){
			for(var i=h3num;i<4;i++){
				if($("h3").eq(i).offset().top<winbtm-0*hper){
					h3num=i+1;
					h3anm(i);
				}
			}
			for(i=pnlnum;i<pn_l;i++){
				if($(".pn").eq(i).offset().top<winbtm-400*hper){
					pnlnum=i+1;
					pnlanm(i)
				}
			}
			for(i=ltnum;i<lt_l;i++){
				if($(".lt").eq(i).offset().top<winbtm-400*hper){
					ltnum=i+1;
					if($(".lt").eq(i).offset().left<win_w/2){ltanm(i,-1);}else{ltanm(i,1);}
				}
			}
		}
	}
	var pnlanm=function(num){
		if(num>8){ad=0}else{ad=0}
		if(num==1){
			$("#bg img").eq(0).transition({rotate:"0deg",x:0,y:0},1800,"cubic-bezier(0.187, 0.523, 0.323, 0.993)");
			setTimeout(function(){ytmo=true;},400);
		}
	}
	var h3anm=function(num){
		var size = $("h3").eq(num).find("img").length;
		$("h3").eq(num).css({"position":"relative","z-index":10});
		for(i=size-1;i>=0;i--){
			$("h3").eq(num).find("img").eq(i).delay(i*600/size)
			.css({scale: 2.1,y:-i*200/size,x:-150+i*400/size, opacity:1,perspective:'130px', rotate:'180deg',rotateY: '270deg'})
			.transition({scale: 1,x:0,y:0,rotate: '0deg',rotateY: '0deg'},1140,"cubic-bezier(0.277, 0.203, 0.03, 1)");
		}
	}
	var ltanm=function(num,LR,dlc){
		var size = $(".lt").eq(num).find("p img").length;if(dlc){dl=dlc}
		if(num==0){dl=450}else if(num==1){dl=650}else if(num==3){dl=750}else if(num==10){dl=350}else{dl=0}
	}
	$(window).bind("resize", function () {
		sizefix();
		if(opend){scrollfunc();}
	});
	var sizefix=function(){
		win_h = $window.height();
		win_w = $window.width();
		winper = Math.max(960,win_w)/1980;
		winper=winper*winper;
		hper = win_h/960;
		winscr = $window.scrollTop();
		winbtm = win_h + winscr;
		wincen = win_h / 2 + winscr;
		$("#m_bg .bg2").css({"width":Math.max(960,win_w)+20,"left":-10})
		ctsc=[$(".cts").eq(0).offset().top,$(".cts").eq(1).offset().top,$(".cts").eq(2).offset().top,$(".cts").eq(3).offset().top]
	};
	sizefix();
	var intv;
	var sft=1;
	var w1h=0;
	var w2h=0;
	var deg1=0;
	var deg2=0;
	$(".swing").css({perspective:'2500px'})
	$(".swing_l").css({perspective:'500px'})
	$(".swing_r").css({perspective:'1500px'})
	function startTimer(){
		intv=setInterval(function(){
			if(winscr<700){
				deg1+=(3+(Math.cos(deg1)+0.3))/50;
				deg2+=(3+(Math.cos(deg2)+0.3))/60;
				$("#mv .c2").css({y:Math.cos(deg1)*14,rotate:(Math.sin(deg1)*0.4)+"deg"});
				$("#mv .c1").css({y:-11-Math.cos(deg2)*10,rotate:(Math.sin(deg2)*-0.2)});
			}
			if(Math.abs(sX-nX)>2){
				nX+=(sX-nX)/6
				if(winscr<800){
				}
				$("#m_bg .bg2").css({x:nX*-0.004});
				$("h3, .scr2").css({x:nX*0.05});	
				$("#inner, .copy, .scr").css({x:nX*0.02});
				$(".swing").css({rotateY:(nX*0.01)+'deg'});
				$(".swing_l").css({rotateY:(nX*0.01)+'deg'});
				$(".swing_r").css({rotateY:(-1.3+nX*0.003)+'deg'});
			}else{
				nX=sX
			}
			if(Math.abs(sY-nY)>2){
				nY+=(sY-nY)/6
				$("h3, .scr2").css({y:nY*0.05});
				$("#inner, .copy, .scr").css({y:nY*0.02});
				$(".swing").css({rotateX:(nY*-0.02)+'deg'});
			}else{
				nY=sY
			}
			if(Math.abs(sft)>1)sft*=0.96
			$("#grk div").css({y:"-="+sft+"px"});
			for(i=0;i<6;i++){
				$("#grk img").eq(i*3+1).css({rotate:"+="+(sft*0.5*((i%2)*2-1))+"deg"})
			}
			if(sft>0){
				if(winscr>$("#grk .w1").offset().top+1280){
					$("#grk .w1").css({y: "+=2560px"});
					w1h=$("#grk .w1").offset().top;
				}
				else if(winscr>$("#grk .w2").offset().top+1280){
					$("#grk .w2").css({y: "+=2560px"});
					w2h=$("#grk .w1").offset().top;
				}
			}else{
				if(winbtm<$("#grk .w1").offset().top){
					$("#grk .w1").css({y: "-=2560px"});
					w1h=$("#grk .w1").offset().top;
				}else if(winbtm<$("#grk .w2").offset().top){
					$("#grk .w2").css({y: "-=2560px"});
					w2h=$("#grk .w1").offset().top;
				}
			}
		} , 30);
	}
	var share_qqimg = document.getElementsByClassName("share_qq")
	var share_wbimg = document.getElementsByClassName("share_weibo")
	var share_wximg = document.getElementsByClassName("share_wx")
	$(".share_qq").hover(function () {
		share_qqimg[0].src = "images/qq_ewm_2.png"
	},function(){
		share_qqimg[0].src = "images/qq_ewm.png"
	})
	$(".share_weibo").hover(function () {
		share_wbimg[0].src = "images/wb_ewm_2.png"
	},function(){
		share_wbimg[0].src = "images/wb_ewm.png"
	})
	$(".share_wx").hover(function () {
		share_wximg[0].src = "images/wx_ewm_2.png"
		$("#share_div .wx_share_ewm").css({opacity:1});
		$("#share_div .wx_share_ewm").show()
	},function(){
		share_wximg[0].src = "images/wx_ewm.png"
		$("#share_div .wx_share_ewm").css({opacity:0});
		$("#share_div .wx_share_ewm").hide()
	})
	$("#menu").hover(function () {
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		if(scrollTop<604){
			$("#menu .open").fadeTo(0,1);
			$("#menu .close img").fadeTo(0,0);
			$("#menu .open ul").css({"height":57}).stop().transition({"height":880},200,$.bez([0.25, 0.017, 0.21, 0.997]));	
			var left_idx = 0
			for(i=0;i<9;i++){
				if(i==0||i==1||i==2){left_idx=10}else if(i==3){left_idx=-12}else if(i==4||i==5){left_idx=-12}else if(i==6){left_idx=-8}else if(i==7){left_idx=35}else if(i==8){left_idx=80}
				$("#menu ul img").eq(i).delay(i*40).css({x:0,opacity:0}).transition({x:left_idx,opacity:1},200);
			}
		}
	},function () {
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		if(scrollTop<604){
			$("#menu .open ul").stop().animate({"height":57},200,$.bez([0.25, 0.017, 0.21, 0.997]),function(){
				$("#menu .open").fadeTo(0,0);$("#menu .close .bg").fadeTo(0,1);
			});
			$("#menu ul img").fadeTo(200,0);
			$("#menu .close .txt").fadeTo(0,0).delay(150).css({y:20}).transition({y:0,opacity:1},200);
		}
    });
	
	$("#menu ul").hover(function () {
		$(this).css({x:0}).transition({x:5},100)
	},function () {
		$(this).css({x:5}).transition({x:0},100)
    });
	
	$("#top_div").click(function(){
		$("html, body").animate({scrollTop: 0},1000);
	})
	$('a[href^=#]').click(function(){
		var href= $(this).attr("href");
		var position = 0
		var add_posx = document.body.offsetWidth/960
		if(add_posx<=1){add_posx=0}
		if(href=="#new"){
			position=900+add_posx*75
		}else if(href=="#characteristic"){
			position = 2600+add_posx*75
		}else if(href=="#contact"){
			position = 3600+add_posx*75
		}	
		var speed = 500+Math.abs($(window).scrollTop()-position)/3
		$("html, body").animate({scrollTop:position}, speed,$.bez([0.3, 0, 0.4, 1]),function(){});
		return false;
	})
	$(".ov").hover(function(){},function(){
		$(this).attr("src", $(this).attr("src").replace("_ov.", "."));
    });
	window.onscroll = function(){
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		if(scrollTop>604 && !is_show_menu){
			$("#top_div").show();$("#top_div").css({"opacity":"1"})
			$("#menu .open").fadeTo(0,1);
			$("#menu .close img").fadeTo(0,0);
			$("#menu .open ul").css({"height":57}).stop().transition({"height":880},200,$.bez([0.25, 0.017, 0.21, 0.997]));	
			var left_idx = 0
			for(i=0;i<9;i++){
				if(i==0||i==1||i==2){left_idx=10}else if(i==3){left_idx=-12}else if(i==4||i==5){left_idx=-12}else if(i==6){left_idx=-8}else if(i==7){left_idx=35}else if(i==8){left_idx=80}
				$("#menu ul img").eq(i).delay(i*40).css({x:0,opacity:0}).transition({x:left_idx,opacity:1},200);
			}
			is_show_menu = true
		}else if(scrollTop<604 && is_show_menu){
			$("#menu .open ul").stop().animate({"height":57},200,$.bez([0.25, 0.017, 0.21, 0.997]),function(){
				$("#menu .open").fadeTo(0,0);$("#menu .close .bg").fadeTo(0,1);
			});
			$("#menu ul img").fadeTo(200,0);
			$("#menu .maru").fadeTo(0,0);
			$("#menu .close .txt").fadeTo(0,0).delay(150).css({y:20}).transition({y:0,opacity:1},200);
			is_show_menu = false
			$("#top_div").hide();$("#top_div").css({"opacity":"0"})
		}
	}
});1