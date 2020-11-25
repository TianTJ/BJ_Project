var show_name_head = "欢迎您，"
var GW = "http://www.doukan233.com"
var APK_URL = "https://sj.qq.com/myapp/detail.htm?apkName=com.sycx.xtsj"
var IOS_APK_URL = "https://itunes.apple.com/cn/app//id1448229470?mt=8"
var Now_Load_Apk ="http://config-100.xintiaoshijie.com/%E9%80%97%E7%9C%8B.apk"
var people_voice = {
	1:{
		img:"ajie.png",
		name:"阿杰",
		sound:{
			1:"ajie/buyue.mp3",
			2:"ajie/kending.mp3",
			3:"ajie/taoyam.mp3",
			4:"ajie/xihuan.mp3"
		},
	},
	2:{
		img:"tengxin.png",
		name:"藤新",
		sound:{
			1:"tengxin/wanan.mp3",
			2:"tengxin/kending.mp3",
			3:"tengxin/henni.mp3",
			4:"tengxin/xiangni.mp3"
		},
	},
	3:{
		img:"tongyin.png",
		name:"瞳音",
		sound:{
			1:"tongyin/buyue.mp3",
			2:"tongyin/kending.mp3",
			3:"tongyin/richang.mp3",
			4:"tongyin/yiwen.mp3"
		},
	},
	4:{
		img:"tthm.png",
		name:"图特哈蒙",
		sound:{
			1:"tthm/richang.mp3",
			2:"tthm/yiwen.mp3"
		},
	},
	5:{
		img:"yangyang.png",
		name:"咩咩",
		sound:{
			1:"yangyang/meiguanxi.mp3",
			2:"yangyang/kending.mp3",
			3:"yangyang/zaoan.mp3"
		},
	},
	6:{
		img:"shennianru.png",
		name:"沈念如",
		sound:{
			1:"shennianru/duibuqi.mp3",
			2:"shennianru/richang.mp3",
			3:"shennianru/xihuan.mp3",
			4:"shennianru/yiwen.mp3"
		},
	},
	7:{
		img:"yezhiqiu.png",
		name:"叶知秋",
		sound:{
			1:"yezhiqiu/kending.mp3",
			2:"yezhiqiu/taoyan.mp3",
			3:"yezhiqiu/xiexie.mp3",
			4:"yezhiqiu/yiwen.mp3"
		},
	},
	8:{
		img:"yanmeme.png",
		name:"阎么么",
		sound:{
			1:"yanmeme/kending.mp3",
			2:"yanmeme/meiguanxi.mp3",
			3:"yanmeme/zaoan.mp3"
		},
	},
	9:{
		img:"ywys.png",
		name:"幽舞越山",
		sound:{
			1:"ywys/haode.mp3",
			2:"ywys/kending.mp3",
			3:"ywys/xiangni.mp3",
			4:"ywys/zaoan.mp3",
		},
	},
	10:{
		img:"lilanling.png",
		name:"李兰陵",
		sound:{
			1:"lilanling/duibuqi.mp3",
			2:"lilanling/kending.mp3",
			3:"lilanling/meiguanxi.mp3"
		},
	},
	11:{
		img:"dingdang.png",
		name:"叮当",
		sound:{
			1:"dingdang/kending.mp3",
			2:"dingdang/yiwen.mp3",
			3:"dingdang/zaoan.mp3"
		},
	},
	12:{
		img:"guosheng.png",
		name:"郭盛",
		sound:{
			1:"guosheng/kending.mp3",
			2:"guosheng/xiangni.mp3",
			3:"guosheng/yiwen.mp3"
		},
	},
}
var content_info = {
	1:{
		p_img:"p_img_1.png", 	//人物图片
		i_img:"i_img_1.png",	//信息图片
		c_img:"c_img_1.png",	//底图
		f_img:"f_img_1.png"	//缩小图
	},
	2:{
		p_img:"p_img_2.png", 	//人物图片
		i_img:"i_img_2.png",	//信息图片
		c_img:"c_img_2.png",	//底图
		f_img:"f_img_2.png"	//缩小图
	},
	3:{
		p_img:"p_img_3.png", 	//人物图片
		i_img:"i_img_3.png",	//信息图片
		c_img:"c_img_3.png",	//底图
		f_img:"f_img_3.png"	//缩小图
	},
	4:{
		p_img:"p_img_4.png", 	//人物图片
		i_img:"i_img_4.png",	//信息图片
		c_img:"c_img_4.png",	//底图
		f_img:"f_img_4.png"	//缩小图
	},
	5:{
		p_img:"p_img_5.png", 	//人物图片
		i_img:"i_img_5.png",	//信息图片
		c_img:"c_img_5.png",	//底图
		f_img:"f_img_5.png"	//缩小图
	}
}
//检测手机号格式
function isPoneAvailable(str) {
    var myreg=/^[1][0-9]{10}$/;
    if (!myreg.test(str)) {
    } else {
        return true;
    }
}
//发送服务器请求
function send_data(type,url,dt,fun1,fun2){
	let t = localStorage.getItem('token')
	$.ajax({
		type:type,
		url: server_location+url,
		data: dt,
		dataType:"json",
		headers:{
			token:t
		},
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
		},
		success:function(data, status, xhr){
			if(data.code.code != 402){
				fun1(data)
			}
		},
		error: function(err){
			fun2(err)
		}
	})
}
var Phone_CDK = [
"S344935",
"S741344",
"S340195",
"S488542",
"S852682",
"S604882",
"S967292",
"S438604",
"S245256",
"S357719",
"S475557",
"S856840",
"S907926",
"S970038",
"S295973",
"S006745",
"S792119",
"S131441",
"S322028",
"S235023",
"S074075",
"S470025",
"S862844",
"S066425",
"S308580",
"S668388",
"S902577",
"S431841",
"S965040",
"S611036",
"S453640",
"S792847",
"S940715",
"S686736",
"S822030",
"S381083",
"S124941",
"S163358",
"S817761",
"S329422",
"S088015",
"S265547",
"S172188",
"S028614",
"S447848",
"S508539",
"S956310",
"S959246",
"S400718",
"S251669",
"S920219",
"S981526",
"S533706",
"S803944",
"S706821",
"S980293",
"S879102",
"S724160",
"S697653",
"S653330",
"S275506",
"S532525",
"S946257",
"S246355",
"S415772",
"S497840",
"S954458",
"S006107",
"S880180",
"S901929",
"S000237",
"S387937",
"S293923",
"S952427",
"S858024",
"S717776",
"S662322",
"S474226",
"S257879",
"S971411",
"S901888",
"S206887",
"S075207",
"S403795",
"S329594",
"S331107",
"S363211",
"S785039",
"S369057",
"S383520",
"S457018",
"S558819",
"S066508",
"S161850",
"S408794",
"S814522",
"S843600",
"S004910",
"S690010",
"S265663"
]