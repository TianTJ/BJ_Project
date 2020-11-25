// var getQueryString = function(name){
//     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
//     var r = window.location.search.substr(1).match(reg);
//     if (r != null) return decodeURI(r[2]);
//     return null; 
// }
var server = require('server')
var GameData = {
    chat_scene_id : 1,  //默认为聊天室场景  id==2 私聊场景
    main_scene_id : 1,  //默认为聊天室主界面 后面的界面+1
    wx_userinfo_data : null,    //微信用户数据

    account_number : 0,


    sever_close_time : 0,
    once_open_num: 0,
    
    //userid:getQueryString('openid')|| "test1", //用户唯一ID
    userid : "",    //boss_2018_5_19
    session_key: null,

    servertime: null,   
    game_progress_data: null,   //游戏进度数据

    cat_paw_coin: 0,     //猫爪数量
    username: "福禄娃",

    getservertime : function(fun){
        var self = this
        server.send({               
                 rid:"common_time_sync",          
                 subject:"COMMON",          
                 cmd:"COMMON_TIME_SYNC",      
                 udid:self.userid,      
                 req:{}            
        })
        self.message_fun_map.set('common_time_sync' ,function(data){
            fun && fun(data)
        })
    },
    message_fun_map: new Map(),

    all_plot_data: {1:[],2:[],3:[],4:[],5:[],6:[],7:[]},
    polt_state: 0,  //当前剧情的状态
    chat_room_polt_id: null,    //当前聊天室剧情ID\
    chat_room_backgroundmusic_id: null,    //当前聊天室背景音乐ID
    chat_room_polt_title: null,     //聊天室标题
    polt_Whether_join: 0,   //当前剧情是否可以参与  （0 不可参与只可阅读    1 可参与    2 重播剧情）
    
    user_choice_id: null,   //个人主页角色ID
    phone_polt_id: null,    //玩家电话消耗品id 用来确定是哪个剧情

    is_one_pay_polt: false,  //判断是否单个购买剧情
    is_show_tip_move : true,

    black_ly: null,
    tip_ly: null,
    main_time_label :  null,

    //部分动态变化ui控件
    shop_bg : null,
    coin_label : null,
    open_server_num:0,
    //界面刷新方法
    main_judge_news: null,
    friend_judge_news: null,
    personal_judge_news: null,
    video_judge_news: null,

    phone_card_type: 4,     //电话界面退出类型
    Lottery_number: 20,

    showSysHint: function(root,str,texture,fun){
        this.is_show_tip_move = false
        var tip_node = new cc.Node();
        var sp = tip_node.addComponent(cc.Sprite);
        var lb_node = new cc.Node();
        tip_node.addChild(lb_node)
        lb_node.y= -7
        lb_node.x= 15
        var thisLabel = lb_node.addComponent(cc.Label);
        thisLabel.fontSize = 25
        var icon_node = new cc.Node();
        tip_node.addChild(icon_node)
        var icon = icon_node.addComponent(cc.Sprite)
        icon_node.width = 15
        icon_node.height = 15
        icon_node.zIndex = 99999
        icon_node.x = -15
        if(texture){icon.spriteFrame = texture}
        cc.loader.loadRes("png/dsf",cc.SpriteFrame,function(err,texture){
            sp.spriteFrame = texture
        })
        thisLabel.string = str
        cc.director.getScene().getChildByName('Canvas').addChild(tip_node)
        tip_node.zIndex = 9999999999
        tip_node.x = 0
        tip_node.y = 0
        var self = this
        tip_node.runAction(cc.sequence(cc.moveBy(1,cc.p(0,100)),cc.callFunc(function(){
            cc.director.getScene().getChildByName('Canvas').removeChild(tip_node)
            fun&&fun()
        })))
        icon_node.runAction(cc.sequence(cc.delayTime(0.7),cc.callFunc(function(){
            self.is_show_tip_move = true
        })))
    },
    get_str_lenght: function(str){
        if (str == null) return 0;
        if (typeof str != "string"){
            str += "";
        }
        return str.replace(/[^\x00-\xff]/g,"1").length;
    },
    //文件url
    res_json_url: "http://xinxtsjh5.xintiaoshijie.com/json/",  //json文件
    scene_bg_url: "http://xinxtsjh5.xintiaoshijie.com/scene_bg/",  //背景文件
    chat_voice_url: "http://xinxtsjh5.xintiaoshijie.com/voice/soundeffect/",   //聊天室语音
    telephone_voice_url: "http://xinxtsjh5.xintiaoshijie.com/voice/telephonevoice/",   //电话语音
    ani_video_url: "http://xinxtsjh5.xintiaoshijie.com/video/",    //动画视频
    ani_photo_url: "http://xinxtsjh5.xintiaoshijie.com/photo/videocapture/",   //动画对应图片
    phone_photo_url: "http://xinxtsjh5.xintiaoshijie.com/photo/telephone/",   //电话对应图片
    album_photo_url: "http://xinxtsjh5.xintiaoshijie.com/photo/Illustrations/",   //图鉴对应图片
    friend_photo_url: "http://xinxtsjh5.xintiaoshijie.com/photo/circlefriends/",   //说说对应图片
    share_photo_url: "http://xinxtsjh5.xintiaoshijie.com/photo/share/",   //说说对应图片
    expression_photo_url: "http://xinxtsjh5.xintiaoshijie.com/photo/emoticon/",   //表情包
    background_music_url: "http://xinxtsjh5.xintiaoshijie.com/voice/background_music/",   //背景音乐
    //资源版本号
    version_number: "?version="+new Date().getTime(),
    load_json_type: 2,  //1，网页  2 移动
    //加载json 
    load_json_data: function(name,fun){
        if(this.load_json_type == 1){
            cc.loader.load(this.res_json_url+name+".json"+this.version_number,function(err,data){
                if(err){cc.log("load  "+name+".json   error")}else{
                    fun&&fun(data)
                }
            })
        }else{
            cc.loader.loadRes("json/"+name,function(err,data){
                if(err){cc.log("load  "+name+".json   error")}else{
                    fun&&fun(data)
                }
            })
        }
    },
    load_vioce : function(name,fun){
        if(this.load_json_type == 1){
            cc.loader.load(this.background_music_url+name+".mp3"+this.version_number,function(err,data){
                if(err){cc.log("load  "+name+".mp3   error")}else{
                    fun&&fun(data)
                }
            })
        }else{
            cc.loader.loadRes("background_music/"+name,function(err,data){
                if(err){cc.log("load  "+name+".mp3   error")}else{
                    fun&&fun(data)
                }
            })
        }
    },
    Luck_draw_pos: [cc.p(-230,190),cc.p(0,190),cc.p(230,190),cc.p(230,0),cc.p(230,-200),cc.p(0,-200),cc.p(-230,-200),cc.p(-230,0)],
    
    judge_news: function(){
        var self = this
        //聊天new判断
        this.main_judge_news.active = false
        server.send({               
            rid:"stat_story_list",          
            subject:"STAT",          
            cmd:"STAT_STORY_LIST",      
            udid:this.userid,      
            req:{}            
        })
        this.message_fun_map.set('stat_story_list',function(data){
            for(var k in data.data.story_list){
                if(data.data.story_list[k].stat == 0){
                    self.main_judge_news.active = true
                    break
                }
            }
        })
        //朋友圈new判断
        var is_pl = false
        var is_fb = false
        //视频判断
        var is_video = false
        //相册判断
        var is_album = false
        server.send({               
            rid:"stat_moments_list",          
            subject:"STAT",          
            cmd:"STAT_MOMENTS_LIST",      
            udid:this.userid,      
            req:{times:1}
        })
        this.message_fun_map.set('stat_moments_list',function(data){
            for(var k in data.data){
                var id_arr = data.data[k].rids.split(",")
                if(id_arr.indexOf("1") != -1){
                    is_pl = false
                }else{
                    is_pl = true
                }
            }
        })
        server.send({               
                 rid:"common_thing_list",  
                 subject:"COMMON",          
                 cmd:"COMMON_THING_LIST",      
                 udid:this.userid,      
                 req:{}            
        })
        this.message_fun_map.set('common_thing_list',function(h_data){
            var video_goods = []
            for(var k in h_data.data.thing_list){
                if(self.get_str_lenght(h_data.data.thing_list[k].tid) <= 3 ){
                    if(h_data.data.thing_list[k].count != 0){
                        is_fb = true
                    }else{
                        is_fb = false
                    }
                }
                if(h_data.data.thing_list[k].tid == 5101 || h_data.data.thing_list[k].tid == 5102 || h_data.data.thing_list[k].tid == 5103 || h_data.data.thing_list[k].tid == 5104){
                    video_goods.push(h_data.data.thing_list[k])
                }

                if(h_data.data.thing_list[k].tid == 6600005 && h_data.data.thing_list[k].count > 1000){
                    is_album = true
                }
            }
            if(is_pl || is_fb){
                self.friend_judge_news.active = true  
            }else{
                self.friend_judge_news.active = false 
            }

            //判断视频播放消耗品是否够
            for(var ak in video_goods){
                if(video_goods[ak].count >= 8 && self.cat_paw_coin>=20){
                    is_video = true
                    break
                }
            }
            if(is_video){
                self.video_judge_news.active = true 
            }else{
                self.video_judge_news.active = false 
            }
        })
        //判断个人主页新消息
        var is_sx_news = false
        var is_phone_news = false
        server.send({               
                 rid:"stat_letter_list",  
                 subject:"STAT",          
                 cmd:"STAT_LETTER_LIST",      
                 udid:this.userid,      
                 req:{}            
        })
        this.message_fun_map.set('stat_letter_list',function(data){
            for(var k in data.data.letter_list){
                if(data.data.letter_list[k].stat == 0){
                    is_sx_news = true
                    break
                }
            }
            server.send({               
                     rid:"stat_phonecard_list",  
                     subject:"STAT",          
                     cmd:"STAT_PHONECARD_LIST",      
                     udid:self.userid,      
                     req:{}            
            })
        })
        
        this.message_fun_map.set('stat_phonecard_list',function(data){
            for(var k in data.data.card_list){
                if(data.data.card_list[k].count > 0){
                    is_phone_news = true
                    break
                }
            }

            if(is_album || is_phone_news || is_sx_news){
                self.personal_judge_news.active = true 
            }else{
                self.personal_judge_news.active = false 
            }
        })
    },
    heart_server : function(){
        this.sever_close_time+=5
        if(this.sever_close_time >= 10){
            this.once_open_num++
            if(this.once_open_num == 1){
                //只需调用一次，后交于close完成
                server.reconnect()
            }
        }
        var self = this
        server.send({               
                 rid:"common_time_sync",          
                 subject:"COMMON",          
                 cmd:"COMMON_TIME_SYNC",      
                 udid:self.userid,      
                 req:{}            
        })
        self.message_fun_map.set('common_time_sync' ,function(data){
            self.sever_close_time = 0
            self.servertime = data.data.time
            var time = new Date(data.data.time)
            var hour = time.getHours()
            var minutes = time.getMinutes()
            if(minutes<10){minutes="0"+minutes}
            if(self.main_time_label&&self.main_time_label.node){
                self.main_time_label.node.getComponent(cc.Label).string = hour+":"+minutes
            }
        })
    },
    get_content_string: function(str){
        var end_str = ""
        if(str.indexOf("#玩家#") == -1){
            return  str
        }else{
            var str_data = str.split("#")
            for(var k in str_data){
                if(str_data[k]=="玩家"){
                    end_str+=this.username
                }else{
                    end_str+=str_data[k]
                }
            }
        }
        return end_str
    }
}
module.exports=GameData;

//自定义物品ID：   520001：抽奖次数   520002：分享次数  9999：朋友圈默认评论ID   6600001：新聊天  6600002：新朋友圈   6600003：新私信   6600004：新电话   6600005：新相册
                // 6600006：新视频   7000072:抽奖次数   8000082: 前一天天数存储
