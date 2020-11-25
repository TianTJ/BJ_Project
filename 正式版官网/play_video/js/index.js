$(function(){
    var u = navigator.userAgent
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    $("#cn .touxiangwaikuang,#cn .icon,#cn .dianzan,#cn .pinglun,#cn .shoucang,#cn .fenxiang,#cn .qudoukan").click(function(){
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

    //获取url参数
    function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
    }

    var myVideo = document.getElementById('video_play');
    let video_time = 0
    let progress = document.getElementById('progress');
    let temp 
    $("#cn .paly_btn").click(function(){
        $("#cn .paly_btn").hide()
        $("#cn .hide,.fensebiaoqian,.fs_tx,.blue_t,.bl_tx,.jujimingdi,.fanjutubiao,.name_tx,.cnt_tx,.wuming").css({'opacity':'0'})
        video_time = parseInt(myVideo.duration)
        myVideo.play();
        $(this).hide()
        let idx = 0
        temp = 1/video_time
        var d_t = setInterval(function(){
            if(idx>video_time){
                window.clearInterval(d_t);
            }
            idx++
            progress.value+=temp
        },1000)
    })
    myVideo.addEventListener('ended', function () {  
        $("#cn .hide,.fensebiaoqian,.fs_tx,.blue_t,.bl_tx,.jujimingdi,.fanjutubiao,.name_tx,.cnt_tx,.wuming").css({'opacity':'1'})
        $("#cn .paly_btn").show();
    }, false);

    
    myVideo.addEventListener('pause',function(){
        $("#cn .paly_btn").show();
    })
    $.ajax({
        type:"post",
        url: "http://192.168.1.87:8099/list/share/"+getQueryVariable('id'),
        //url: "http://192.168.1.87:8099/list/share/UI8JTU8TSSTCZEDSSA3ZTU8TUI8JTHFDSB2VZEDSTWAWON25ZEDSZEDSZEDS",
        //url: "http://192.168.1.66:8099/list/share/"+getQueryVariable('id'),
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
        },
        success:function(data, status, xhr){
            if(data.code == 200){
                update_ui(data.data)
            }else if(data.code == 1008){
                //删除
                $('#video').hide()
                $('#cn').hide()
                $('body').css({'background-color':"#000000"})
                $('#error').text('来迟了，该视频已被删除')
            }else if(data.code == 1009){  
                //无权限
                $('#video').hide()
                $('#cn').hide()
                $('body').css({'background-color':"#000000"})
                $('#error').text('没有权限查看')
            }else if(data.code == 500){  
                //失败
                $('#video').hide()
                $('#cn').hide()
                $('body').css({'background-color':"#000000"})
                $('#error').text('请求发送失败，请稍后重试')
            }else if(data.code == 1010){
                $.ajax({
                    type:"post",
                    url: "http://192.168.1.87:8099/list/share/"+getQueryVariable('id'),
                    //url: "http://192.168.1.66:8099/list/share/UI8JTU8TSSTCZEDSSA3ZTU8TUI8JTHFDSB2VZEDSTWAWON25ZEDSZEDSZEDS",
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
                    },
                    success:function(data, status, xhr){
                        if(data.code == 200){
                            update_ui(data.data)
                            return
                        }else if(data.code == 1008){
                            //删除
                            $('#video').hide()
                            $('#cn').hide()
                            $('body').css({'background-color':"#000000"})
                            $('#error').text('来迟了，该视频已被删除')
                        }else if(data.code == 1009){  
                            //无权限
                            $('#video').hide()
                            $('#cn').hide()
                            $('body').css({'background-color':"#000000"})
                            $('#error').text('没有权限查看')
                        }else if(data.code == 500){  
                            //失败
                            $('#video').hide()
                            $('#cn').hide()
                            $('body').css({'background-color':"#000000"})
                            $('#error').text('请求发送失败，请稍后重试')
                        }                                                                                                                                                                                                        
                    },
                    error: function(err){
                    }
                }) 
            }                                                                                                                                                                                                          
        },
        error: function(err){
        }
    }) 
})
function update_ui(data){
    $('#cn .wuming').text(data.userName)
	
	if(data.mainTag != null){
		data.tags.unshift(data.mainTag)
	}
	
    if(data.tags.length == 0){
        $('#cn .blue_t,#cn .bl_tx,#cn .fensebiaoqian,#cn .fs_tx').hide()
    }else if(data.tags.length == 1){
        $('#cn .blue_t,#cn .bl_tx').hide()
        $('#cn .fs_tx').css({'width':data.tags[0].name.length*45+'px'})
        $('#cn .fensebiaoqian').css({'width':data.tags[0].name.length*45+'px'})
        $('#cn .fs_tx').text(data.tags[0].name)
    }else if(data.tags.length >= 2){
        $('#cn .fs_tx').css({'width':data.tags[0].name.length*45+'px'})
        $('#cn .fensebiaoqian').css({'width':data.tags[0].name.length*45+'px'})
        $('#cn .fs_tx').text(data.tags[0].name)
        
        $('#cn .blue_t').css({'width':data.tags[1].name.length*45+'px',"left":parseInt($('#cn .fensebiaoqian').css('width'))+80+'px'})
        $('#cn .bl_tx').css({'width':data.tags[1].name.length*45+'px',"left":parseInt($('#cn .fensebiaoqian').css('width'))+80+'px'})
        $('#cn .bl_tx').text(data.tags[1].name)
    }
    //名字 进度
	let number_idx = 0
    for(let k in data.storys){
		if(data.storys[k]>100){
			number_idx = parseInt(k)
		}
	}
    if(data.videoSetName){$('#cn .name_tx').text(data.videoSetName +' 更新至'+ (++number_idx)+'话')}else $('#cn .name_tx,#cn .fanjutubiao,#cn .jujimingdi').hide()
    //描述
    if(data.intro){
        var str_arr = data.intro.split('')
        var str1 = ''
        for(var k in str_arr){
            if(parseInt(k) < 41){
                str1+=str_arr[k]
            }
        }

        str1+="..."
        $('#cn .cnt_tx').text(str1)
    }else $('#cn .cnt_tx').text(data.name)
    
    //头像
    var a = data.avatar.split(",")
    if(a.length>1){
        //user-100.xintiaoshijie.com
        $('#cn .icon').attr('src',"http://test-user-1.xintiaoshijie.com/"+a[0]+"_"+a[1])
    }else{
        $('#cn .icon').attr('src',a[0])
    }
    
    
    //点赞
    $('#cn .d_tx').text(data.likes?data.likes:0)
    //评论
    $('#cn .p_tx').text(data.comment?data.comment:0)
    //收藏
    $('#cn .s_tx').text(data.collect?data.collect:0)
    //分享
    $('#cn .f_tx').text(data.share?data.share:0)
    //音乐
    if(data.music){$('#cn .m_tx').text(data.music)}else $('#cn .m_tx').text(data.userName+'的原声音乐')
 
    //视频
    if(Hls.isSupported()) {
        var video = document.getElementById('video_play');
        var hls = new Hls();
        hls.loadSource(data.path);
        hls.attachMedia(video);
        video.addEventListener('canplaythrough',function(){
            $("#cn .paly_btn").show();
        });
    }
} 
