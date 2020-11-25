$(function(){
    var chujidata = []
    var gaojidata = []
    var one_data = []   
    var two_data = []
    var three_data = []
    var getQueryString = function(name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) return unescape(r[2]); 
        return null; 
    } 
    $.ajax({
		type:"GET",
        //url: "https://h5resource.xintiaoshijie.com/offical.web/editor/getTutorial",
        url: "http://192.168.1.66:8083/editor/getTutorial",
		data: "",
		headers:{},
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
		},
		success:function(data, status, xhr){
            for(var i in data.data){
                if(data.data[i].tutorialType == 1){
                    chujidata.push(data.data[i])
                }else{
                    gaojidata.push(data.data[i])
                }
            }
            init_layer()
			console.log("success")
		},
		error: function(err){
			console.log("error")
		}
    })
    var t_id = getQueryString("id")
	if(t_id==2){
		$("#head_png .title_png").attr({"src":"images/gaoji.jpg"})
	}
    //基础教程
    $("#Course_conten .primary").click(function(){
        if(t_id==1){
            //初级跳转
            window.open("../jcpage/base/index.html")
        }else{
            //高级跳转
            window.open("../jcpage/senior/index.html")
        }
    })
    var intermediate_show = false;var intermediate_length = 0
    $("#Course_conten .intermediate .one_level").click(function(){
        if(intermediate_show){
            $("#Course_conten .intermediate .one_level .right").css({'transform':'rotate(90deg)'})
            intermediate_show = false 
            $("#Course_conten .intermediate .two_level .aaaa").remove()
            intermediate_length = $("#Course_conten .intermediate .two_level .aaaa").length
            change_info_poy1()
        }else{
            $("#Course_conten .intermediate .one_level .right").css({'transform':'rotate(-90deg)'})
            intermediate_show = true
            for(var i=0;i<two_data.length-1;i++){
                var row = $('<div class="aaaa aaaa'+i+'"></div>');
                row.append('<img src="" class="icon icon'+i+'">');
                row.append('<a class="bt bt'+i+'"></a>');
                row.append('<img src="images/right__black.png" class="right">');
                $("#Course_conten .intermediate .two_level").prepend(row);
                var str = two_data[i].tutorialTitle.split("|")
                $('#Course_conten .intermediate .two_level .bt'+i).text(str[1])
                $("#Course_conten .intermediate .two_level .icon"+i).attr("src","images/"+two_data[i].icon)
                $("#Course_conten .intermediate .two_level .aaaa"+i).click(function(){
                    open_page(this.i)
                    console.log(this.i)
                }.bind({i:i}))
            }
            intermediate_length = $("#Course_conten .intermediate .two_level .aaaa").length
            change_info_poy()
        }
    })   
    var senior_show = false;var senior_length = 0
    $("#Course_conten .senior .one_level").click(function(){
        if(senior_show){
            $("#Course_conten .senior .one_level .right").css({'transform':'rotate(90deg)'})
            senior_show = false 
            $("#Course_conten .senior .two_level .aaaa").remove()
            senior_length = $("#Course_conten .senior .two_level .aaaa").length
            change_info_poy1()
        }else{
            $("#Course_conten .senior .one_level .right").css({'transform':'rotate(-90deg)'})
            senior_show = true
            for(var i=0;i<three_data.length-1;i++){
                var row = $('<div class="aaaa aaaa'+i+'"></div>');
                row.append('<img src="" class="icon icon'+i+'">');
                row.append('<a class="bt bt'+i+'"></a>');
                row.append('<img src="images/right__black.png" class="right">');
                $("#Course_conten .senior .two_level").prepend(row);
                var str = three_data[i].tutorialTitle.split("|")
                $('#Course_conten .senior .two_level .bt'+i).text(str[1])
                $("#Course_conten .senior .two_level .icon"+i).attr("src","images/"+three_data[i].icon)
                $("#Course_conten .senior .two_level .aaaa"+i).click(function(){
                    console.log(this.i)
                    open_page1(this.i)
                }.bind({i:i}))
            }
            senior_length = $("#Course_conten .senior .two_level .aaaa").length
            change_info_poy()
        }
    })
    var change_info_poy = function(type){
        var py = -(senior_length+intermediate_length)*178+450
        $("#info").css({"bottom":py})
       
    }
    var change_info_poy1 = function(type){
        if(senior_length != 0 || intermediate_length!= 0){
            var py = -(senior_length+intermediate_length)*178+450
            $("#info").css({"bottom":py})
        }else{
            var py = -(senior_length+intermediate_length)*178
            $("#info").css({"bottom":py})
        }
    }
    $("#info p").click(function(){
        window.open("http://shang.qq.com/wpa/qunwpa?idkey=076852d56d2181b927b3b7c3eb3fd9e4ea98b2c167e2372fad69efa28c4d928a")
    })
    var init_layer = function(){
        var id = getQueryString("id")
        var data = null
        if(id==1){
            data = chujidata
            for(var k in data){
                var id = parseInt(data[k].id/100)
                if(id == 101){
                    one_data.push(data[k])
                }else if(id == 102){
                    two_data.push(data[k])
                }else if(id == 103){
                    three_data.push(data[k])
                }
            }
            two_data.sort(function(a,b){
                return b.sort-a.sort
            })
            three_data.sort(function(a,b){
                return b.sort-a.sort
            })
        }else{
            data = gaojidata 
            for(var k in data){
                var id = parseInt(data[k].id/100)
                if(id == 201){
                    one_data.push(data[k])
                }else if(id == 202){
                    two_data.push(data[k])
                }else if(id == 203){
                    three_data.push(data[k])
                }
            }
            two_data.sort(function(a,b){
                return b.sort-a.sort
            })
            three_data.sort(function(a,b){
                return b.sort-a.sort
            })
        }  
    }

    //中级流程
    var open_page = function(i){
        switch(t_id){
            case "1":
                switch(i){
                    case 9:
                        window.location.href = "../jcpage/common/edit.html"
                        break
                    case 8:
                        window.location.href = "../jcpage/simple/camera.html"
                        break
                    case 7://对白
                        window.location.href = "../jcpage/simple/dialogue.html"
                        break
                    case 6://道具
                        window.location.href = "../jcpage/simple/prop.html"
                        break
                    case 5://音效
                        window.location.href = "../jcpage/simple/music.html"
                        break
                    case 4://角色特效
                        window.location.href = "../jcpage/simple/special.html"
                        break
                    case 2://镜头特效
                        window.location.href = "../jcpage/simple/polt.html"
                        break
                    default:
                        alert("敬请期待！")
                        break
                }
                break
            case "2":
                switch(i){
                    case 9:
                        window.location.href = "../jcpage/common/edit.html"
                        break
                    case 8:
                        window.location.href = "../jcpage/higher/move.html"
                        break
                    case 7:
                        window.location.href = "../jcpage/higher/camera.html"
                        break
                    case 6://对白
                        window.location.href = "../jcpage/simple/dialogue.html"
                        break
                    case 5://道具
                        window.location.href = "../jcpage/simple/prop.html"
                        break
                    case 4://音效
                        window.location.href = "../jcpage/simple/music.html"
                        break
                    case 2://角色特效
                        window.location.href = "../jcpage/simple/special.html"
                        break
                    case 3://镜头特效
                        window.location.href = "../jcpage/simple/polt.html"
                        break
                    default:
                        alert("敬请期待！")
                        break
                }
                break
        }
    }
    //高级流程
    var open_page1 = function(i){
        switch(t_id){
            case "1":
                switch(i){
                    case 3://
                        window.location.href = "../jcpage/simple/scene.html"
                        break
                    case 4://
                        window.location.href = "../jcpage/simple/scene.html"
                        break
                    default:
                        alert("敬请期待！")
                        break
                }
                break
            case "2":
                switch(i){
                    case 4://
                        window.location.href = "../jcpage/simple/scene.html"
                        break
                    case 5://
                        window.location.href = "../jcpage/simple/scene.html"
                        break
                    default:
                        alert("敬请期待！")
                        break
                }
                break
        }
    }
})