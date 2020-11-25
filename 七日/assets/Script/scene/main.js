var gamedata=require('data');
var server = require('server')
var mainscene = cc.Class({
    extends: cc.Component,
    properties: {
       //主场景layout
        //聊天
        main_lay: {
            default: null,
            type: cc.Layout
        },
        main_btn: {
            default: null,
            type: cc.Button
        },
        main_btn_sprite: {
            default: null,
            type: cc.SpriteFrame
        },
        main_btn_sprite_1: {
            default: null,
            type: cc.SpriteFrame
        },
        //个人主页
        user_lay: {
            default: null,
            type: cc.Prefab
        },
        user_btn:{
            default: null,
            type: cc.Button
        },
        user_btn_sprite: {
            default: null,
            type: cc.SpriteFrame
        }, 
        user_btn_sprite_1: {
            default: null,
            type: cc.SpriteFrame
        },
        //视频
        video_lay: {
            default: null,
            type: cc.Prefab
        },
        video_btn: {
            default: null,
            type: cc.Button
        },
        video_btn_sprite: {
            default: null,
            type: cc.SpriteFrame
        },
        video_btn_sprite_1: {
            default: null,
            type: cc.SpriteFrame
        },
        //朋友圈
        friend_lay: {
            default: null,
            type: cc.Prefab
        },
        friend_btn: {
            default: null,
            type: cc.Button
        },
        friend_btn_sprite: {
            default: null,
            type: cc.SpriteFrame
        },
        friend_btn_sprite_1: {
            default: null,
            type: cc.SpriteFrame
        },
        //商城按钮
        shop_lay: {
            default: null,
            type: cc.Prefab
        },
        shop_btn: {
            default: null,
            type: cc.Button
        },
        shop_btn_sprite: {
            default: null,
            type: cc.SpriteFrame
        },
        shop_btn_sprite_1: {
            default: null,
            type: cc.SpriteFrame
        },
       //列表的预制资源
        //聊天预制
        listPrefab: {
            default: null,
            type: cc.Prefab
        },
        scrollview: {
            default: null,
            type: cc.Node
        },
        left_btn:{
            default: null,
            type: cc.Button
        },
        right_btn:{
            default: null,
            type: cc.Button
        },
        now_day_label:{
            default: null,
            type: cc.Label
        },
        Gray_sprite: {
            default: null,
            type: cc.SpriteFrame
        },
        White_sprite: {
            default: null,
            type: cc.SpriteFrame
        },
        //剧情进度资源
        polt_blue_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        all_lock_btn: {
            default: null,
            type: cc.SpriteFrame
        },
        Tip_frame: {
            default: null,
            type: cc.Prefab
        },
        coin: {
            default: null,
            type: cc.Label
        },
        time: {
            default: null,
            type: cc.Label
        },
        addcoin: {
            default: null,
            type: cc.Button
        },
        station: {
            default: null,
            type: cc.Button
        },
        Eggs: {
            default: null,
            type: cc.Sprite
        },
        main_bg: {
            default: null,
            type: cc.Sprite
        },
        main_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        black_layer: {
            default: null,
            type: cc.Prefab
        },
        time_black_frame:{
            default: null,
            type: cc.SpriteFrame
        },
        title_black_frame:{
            default: null,
            type: cc.SpriteFrame
        },
        buttom_black_frame:{
            default: null,
            type: cc.SpriteFrame
        },
        Identification: {
            default: null,
            type: cc.Sprite
        },
        new_polt_sprf:{
            default: null,
            type: cc.SpriteFrame
        },
        eggs_colour: {
            default: null,
            type: cc.SpriteFrame
        },
        eggs_gray: {
            default: null,
            type: cc.SpriteFrame
        },
        egg_tip:{
            default: null,
            type: cc.Prefab
        },
        top_scro: {
            default: null,
            type: cc.ScrollView
        },
        ssr_sprite:{
            default: null,
            type: cc.SpriteFrame
        },
        sr_sprite:{
            default: null,
            type: cc.SpriteFrame
        },
        r_sprite:{
            default: null,
            type: cc.SpriteFrame
        },
        loading_layer:{
            default: null,
            type: cc.Prefab
        },
    },
    onLoad : function(){
       

        gamedata.is_login_server = false
        
        gamedata.shop_bg = this.main_bg
        gamedata.coin_label = this.coin
        gamedata.main_time_label = this.time

        gamedata.friend_judge_news = this.friend_btn.node.getChildByName("tssth")
        gamedata.personal_judge_news = this.user_btn.node.getChildByName("tssth")
        gamedata.video_judge_news = this.video_btn.node.getChildByName("tssth")
        gamedata.main_judge_news = this.main_btn.node.getChildByName("tssth")

        //this.video_btn.node.active = false

        var touch_n = 0

        this.schedule(function() {
            gamedata.heart_server();
        },100,cc.macro.REPEAT_FOREVER,0);
        var self = this

        this.now_layout= null;  //当前界面显示界面

        //当前天数
        this.day_index=1    //用于天数计算，
        this.now_day = 1
        //显示剧情个数
        this.show_plot_num = 7
        //聊天室配置
        this.chat_conf = {1:[],2:[],3:[],4:[],5:[],6:[],7:[]}
        this.content_conf = null
        this.role_conf = null

        //当前需显示剧情
        this.show_chat_conf = []

        //显示剧情状态数据
        this.show_day_polt_stat_data =[]
        //所有剧情状态数据
        this.polt_stat_data = null

        this.is_lingqu_egg = false

        this.pay_polt_data = []     //全部解锁剧情

        //当前显示的天数
        this.show_day = 1

        //最新剧情，全部解锁按钮uid
        this.lock_btn_uuid = null

        this.is_receive_eggs = false    //是否可领取彩蛋
        this.Eggs.node.active = false

        //存储用户id 暂时使用
        server.send({               
            rid:"common_user_registry",          
            subject:"COMMON",          
            cmd:"COMMON_USER_REGISTRY",      
            udid:gamedata.userid,      
            req:{nickname:"福禄娃"}            
        })
        gamedata.message_fun_map.set('common_user_registry',function(data){
        })    
        //获取基本数据
        server.send({               
                 rid:"common_user_base_data",  
                 subject:"COMMON",          
                 cmd:"COMMON_USER_BASE_DATA",      
                 udid:gamedata.userid,      
                 req:{}            
        })
        gamedata.message_fun_map.set('common_user_base_data',function(data){
            gamedata.cat_paw_coin = data.data.coin
            self.coin.getComponent(cc.Label).string = data.data.coin
        })

         //初始化时间
         gamedata.getservertime(function(data){
            gamedata.servertime = data.data.time
            var time = new Date(data.data.time)
            var hour = time.getHours()
            var minutes = time.getMinutes()
            if(minutes<10){minutes="0"+minutes}
            self.time.string = hour+":"+minutes
        })
        var test_temp_day = 1
        //加载配置 获取数据
        gamedata.load_json_data("chat",function(data){
                //处理数据
                    for(var i=1;i<=7;i++){
                        for(var k in data){
                            if(data[k].day == i){
                                self.chat_conf[i].push(data[k])
                            }
                        }
                    }
                    gamedata.load_json_data("role",function(data){
                    
                        self.role_conf = data

                        //获取当前聊天室天数
                        server.send({               
                            rid:"common_get_current_day",          
                            subject:"COMMON",          
                            cmd:"COMMON_GET_CURRENT_DAY",      
                            udid:gamedata.userid,      
                            req:{}            
                        })

                        gamedata.message_fun_map.set('common_get_current_day',function(data){
                            //data.data.day
                            server.send({               
                                     rid:"common_thing_list",  
                                     subject:"COMMON",          
                                     cmd:"COMMON_THING_LIST",      
                                     udid:gamedata.userid,      
                                     req:{}            
                            })
                            gamedata.message_fun_map.set('common_thing_list',function(dh_data){
                                test_temp_day = data.data.day
                                var ddd_ay = 0
                                var cj_sy_num = 0
                                for(var k in dh_data.data.thing_list){
                                    if(dh_data.data.thing_list[k].tid == 8000082){
                                        ddd_ay = dh_data.data.thing_list[k].count
                                    }
                                    if(dh_data.data.thing_list[k].tid == 7000072){
                                        cj_sy_num = dh_data.data.thing_list[k].count
                                    }
                                }
                                if(ddd_ay==0){
                                    server.send({               
                                             rid:"common_thing_store",          
                                             subject:"COMMON",          
                                             cmd:"COMMON_THING_STORE",      
                                             udid:gamedata.userid,      
                                             req:{thing_list:[8000082,data.data.day]}            
                                    })
                                    gamedata.message_fun_map.set('common_thing_store',function(kd){})
                                }else{
                                    if(data.data.day > ddd_ay){
                                        server.send({               
                                                 rid:"common_thing_store",          
                                                 subject:"COMMON",          
                                                 cmd:"COMMON_THING_STORE",      
                                                 udid:gamedata.userid,      
                                                 req:{thing_list:[8000082,data.data.day]}            
                                        })
                                        gamedata.message_fun_map.set('common_thing_store',function(kd){})
                                        //天数增加
                                        server.send({               
                                                 rid:"common_thing_store",          
                                                 subject:"COMMON",          
                                                 cmd:"COMMON_THING_STORE",      
                                                 udid:gamedata.userid,      
                                                 req:{thing_list:[7000072,20-cj_sy_num]}            
                                        })
                                        gamedata.message_fun_map.set('common_thing_store',function(kd){})
                                    }
                                }
                            })
                            self.now_day = 7
                            if(data.data.day > 7){self.now_day = 7}
                            self.day_index = data.data.day
                            if(gamedata.account_number==2){
                                self.now_day = 3
                            }else if(gamedata.account_number==0){
                                self.now_day = data.data.day
                            }

                            for(var o in self.chat_conf[data.data.day]){
                                if(self.chat_conf[data.data.day][o].time > (new Date(gamedata.servertime).getHours())){
                                    self.pay_polt_data.push(self.chat_conf[data.data.day][o])
                                }
                            }
                            //获取当前剧情数据
                            server.send({               
                                rid:"stat_story_list",          
                                subject:"STAT",          
                                cmd:"STAT_STORY_LIST",      
                                udid:gamedata.userid,      
                                req:{}            
                            })
                        })                
                        
                        gamedata.message_fun_map.set('stat_story_list',function(data){
                            if(data.data.story_list.length==0){
                                server.send({               
                                         rid:"common_thing_store",          
                                         subject:"COMMON",          
                                         cmd:"COMMON_THING_STORE",      
                                         udid:gamedata.userid,      
                                         req:{thing_list:[7000072,20]}            
                                })
                                gamedata.message_fun_map.set('common_thing_store',function(data){
                                })
                                if(gamedata.account_number != 0){
                                    if(gamedata.account_number==2){
                                        self.add_Test_WP_Two()
                                    }else{
                                        self.add_Test_WP()
                                    }
                                }
                            }else{
                                if(test_temp_day>3){
                                    self.now_day += 2
                                    if(self.now_day>7){self.now_day=7}
                                }
                            }
                            self.polt_stat_data = data.data
                            //配置加载完成
                            var p_data_day = self.get_now_polt_speed(self.polt_stat_data)
                            if(p_data_day){
                                if(p_data_day==99999 || p_data_day==88888){
                                    self.show_day = self.now_day
                                }else{
                                    self.show_day = p_data_day.day
                                }
                            }
                            //得到当前显示的剧情
                            if(data.data.story_list){
                                for(var k in data.data.story_list){
                                    if(data.data.story_list[k].day == self.show_day){
                                        self.show_day_polt_stat_data.push(data.data.story_list[k])
                                    }
                                }
                            }
                            self.show_day_polt_stat_data.sort(function(a,b){
                                return a.sid - b.sid
                            })
                            self.storage_polt()
                            self.initui()
                            gamedata.judge_news()
                            self.updatelist(self.show_chat_conf,self.polt_stat_data)
                        }) 
                })
        })
        self.left_btn.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(self.show_day == 1){
                return
            }
            self.page_left_move()
            self.show_layout(1)
           
        });
        self.right_btn.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if((self.show_day+1) > self.now_day){
                if(gamedata.is_show_tip_move){
                    gamedata.showSysHint("","今天还没有度过哦！")
                }
                return
            }
            self.page_right_move()
            self.show_layout(1)
        });

        //界面选择按钮事件
        self.main_btn.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.show_layout(1)
            self.main_btn.normalSprite = self.main_btn_sprite 
            self.user_btn.normalSprite = self.user_btn_sprite_1 
            self.video_btn.normalSprite = self.video_btn_sprite_1 
            self.friend_btn.normalSprite = self.friend_btn_sprite_1 
            self.shop_btn.normalSprite = self.shop_btn_sprite_1 

            self.main_bg.node.getComponent(cc.Sprite).spriteFrame = self.main_spr
        });
        self.user_btn.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(self.now_layout.name == "user"){return}
            self.show_layout(2)
            self.user_btn.normalSprite = self.user_btn_sprite 
            self.main_btn.normalSprite = self.main_btn_sprite_1 
            self.video_btn.normalSprite = self.video_btn_sprite_1 
            self.friend_btn.normalSprite = self.friend_btn_sprite_1 
            self.shop_btn.normalSprite = self.shop_btn_sprite_1 
            self.main_bg.node.getComponent(cc.Sprite).spriteFrame = self.main_spr
        });
        self.video_btn.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(self.now_layout.name == "video"){return}
            self.show_layout(4)
            self.video_btn.normalSprite = self.video_btn_sprite 
            self.user_btn.normalSprite = self.user_btn_sprite_1 
            self.main_btn.normalSprite = self.main_btn_sprite_1 
            self.friend_btn.normalSprite = self.friend_btn_sprite_1 
            self.shop_btn.normalSprite = self.shop_btn_sprite_1 
            self.main_bg.node.getComponent(cc.Sprite).spriteFrame = self.main_spr
        });
        self.friend_btn.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(self.now_layout.name == "friend"){return}
            server.send({               
                rid:"stat_moments_list",          
                subject:"STAT",          
                cmd:"STAT_MOMENTS_LIST",      
                udid:gamedata.userid,      
                req:{times:1}
            })
            gamedata.message_fun_map.set('stat_moments_list',function(data){
                if(data.data.length == 0){
                    if(gamedata.is_show_tip_move){
                        gamedata.showSysHint("","还没有内容！")
                    };
                    return
                }
                self.show_layout(3)
                self.friend_btn.normalSprite = self.friend_btn_sprite 
                self.video_btn.normalSprite = self.video_btn_sprite_1 
                self.user_btn.normalSprite = self.user_btn_sprite_1 
                self.main_btn.normalSprite = self.main_btn_sprite_1 
                self.shop_btn.normalSprite = self.shop_btn_sprite_1 
                self.main_bg.node.getComponent(cc.Sprite).spriteFrame = self.main_spr           
            })
            
        });
        self.shop_btn.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(self.now_layout.name == "shop"){return}
            self.shop_btn.normalSprite = self.shop_btn_sprite 
            self.friend_btn.normalSprite = self.friend_btn_sprite_1
            self.video_btn.normalSprite = self.video_btn_sprite_1 
            self.user_btn.normalSprite = self.user_btn_sprite_1 
            self.main_btn.normalSprite = self.main_btn_sprite_1 
            self.show_layout(5)
        });
        self.addcoin.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            //猫爪增加按钮
            self.show_layout(5)
            cc.loader.load(gamedata.scene_bg_url+"shop1.jpg"+gamedata.version_number,function(err,texture){
                self.main_bg.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            })
        });
        self.station.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            //加油站增加按钮
            cc.director.loadScene("share")
        });

        self.Eggs.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            //彩蛋按钮
            var goods_conf = {}
            server.send({
                     rid:"common_thing_list",  
                     subject:"COMMON",          
                     cmd:"COMMON_THING_LIST",      
                     udid:gamedata.userid,      
                     req:{}            
            })
            gamedata.message_fun_map.set('common_thing_list',function(s_data){
                for(var k in s_data.data.thing_list){
                    if(s_data.data.thing_list[k].tid){
                        goods_conf[s_data.data.thing_list[k].tid] = s_data.data.thing_list[k]
                    }
                }
                var id = parseInt("810000"+self.show_day)
                if(goods_conf[id]){
                    if(gamedata.is_show_tip_move){gamedata.showSysHint("","已领取！");return}
                }
                if(self.is_receive_eggs){
                    self.Unlock_Eggs(function(data){
                        //+data.card_id
                        if(gamedata.is_show_tip_move){
                            var tip_layout = cc.instantiate(self.black_layer);
                            cc.director.getScene().getChildByName('Canvas').addChild(tip_layout)
                            tip_layout.zIndex = 998
                            tip_layout.x = 0;tip_layout.y=0
                            tip_layout.on(cc.Node.EventType.TOUCH_END, function (event) {})
                            var tip_frame = cc.instantiate(self.egg_tip);
                            tip_frame.zIndex = 999
                            tip_frame.x = 0; tip_frame.y = 450
                            cc.director.getScene().getChildByName('Canvas').addChild(tip_frame)
        
                            var icon = tip_frame.getChildByName("scrollview").getChildByName("view").getChildByName("content").getChildByName("icon")
                            var quality = tip_frame.getChildByName("quality")
                            var name = tip_frame.getChildByName("name")
                            var close_btn = tip_frame.getChildByName("button_1")
                            close_btn.on(cc.Node.EventType.TOUCH_END, function (event) {
                                cc.director.getScene().getChildByName('Canvas').removeChild(tip_frame)
                                cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout)
                            });
                            if(data.card_id==52105||data.card_id==52107||data.card_id==52109||data.card_id==52206||data.card_id==52210||data.card_id==52304||data.card_id==52306||data.card_id==52309||data.card_id==52310){
                                icon.y=218}else{icon.y=0}
                            tip_frame.active = false
                            tip_frame.active = false
        
                            gamedata.load_json_data("goods",function(conf){
                                var get_data = null
                                for(var k in conf){
                                    if(conf[k].goodsid == data.card_id){
                                        get_data = conf[k];break
                                    }
                                }
                                cc.loader.load(gamedata.phone_photo_url+data.card_id+".png"+gamedata.version_number,function(err,texture){
                                    icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                                    tip_frame.active = true
                                })
                                quality.width= 150;quality.heigth=150
                                quality.x=136;quality.y=-655
                                if(get_data.quality == 1){
                                    quality.getComponent(cc.Sprite).spriteFrame = self.ssr_sprite
                                    quality.width= 200;quality.heigth=104
                                    quality.x=170;quality.y=-696
                                }else if(get_data.quality == 2){
                                    quality.getComponent(cc.Sprite).spriteFrame = self.sr_sprite
                                }else if(get_data.quality == 3){
                                    quality.getComponent(cc.Sprite).spriteFrame = self.r_sprite
                                }
                                name.getComponent(cc.Label).string = get_data.nameitem
                            })
                        }
                        self.Eggs.node.getComponent(cc.Sprite).spriteFrame = self.eggs_gray
                    })
                }else{
                    if(gamedata.is_show_tip_move){gamedata.showSysHint("","请参与全部剧情！");return}
                }
            })
        });
        //检测时间 防止未登录剧情未存储
        gamedata.message_fun_map.set('COMMON_REQUEST_PERHOUR',function(data){
            gamedata.servertime = data.data.time
            if(self.now_layout){
                self.post_polt_stat();
            }
        })
    },
    initui : function(){
        this.Identification.node.active = false
        var self = this
        //初始化左右选择按钮
        if(this.show_day == 1){
            //this.left_btn.node.getComponent(cc.Sprite).spriteFrame = this.Gray_sprite
            this.left_btn.normalSprite = this.Gray_sprite 
            this.left_btn.pressedSprite = this.Gray_sprite 
            this.left_btn.hoverSprite = this.Gray_sprite 
            this.left_btn.node.rotation = 180
        }
        if(this.show_day == 7){
            this.right_btn.normalSprite = this.White_sprite 
            this.right_btn.pressedSprite = this.White_sprite 
            this.right_btn.hoverSprite = this.White_sprite 
            this.right_btn.node.rotation = 0
        }
        if(this.now_day == this.show_day){
            this.right_btn.normalSprite = this.Gray_sprite 
            this.right_btn.pressedSprite = this.Gray_sprite 
            this.right_btn.hoverSprite = this.Gray_sprite 
            this.right_btn.node.rotation = 0
        }
        this.day_index  = this.show_day
        //初始化界面显示
        this.show_layout(gamedata.main_scene_id)
        this.now_day_label.string = "第"+self.day_index+'天'
    },
    page_right_move: function(){
        if(this.day_index < this.now_day){
            this.day_index++
            this.now_day_label.string =  "第"+this.day_index+'天'
            this.left_btn.normalSprite = this.White_sprite 
            this.left_btn.pressedSprite = this.White_sprite 
            this.left_btn.hoverSprite = this.White_sprite 
            this.left_btn.node.rotation = 0
        }
        if(this.now_day == this.day_index){
            this.right_btn.normalSprite = this.Gray_sprite 
            this.right_btn.pressedSprite = this.Gray_sprite 
            this.right_btn.hoverSprite = this.Gray_sprite 
            this.right_btn.node.rotation = 0
        }
        this.change_data(1)
    },
    page_left_move: function(){
        if(this.day_index > 1){
            this.day_index--
            this.now_day_label.string =  "第"+this.day_index+'天'
            this.right_btn.normalSprite = this.White_sprite 
            this.right_btn.pressedSprite = this.White_sprite 
            this.right_btn.hoverSprite = this.White_sprite 
            this.right_btn.node.rotation = 180
        }
        if(this.day_index == 1){
            //this.left_btn.node.getComponent(cc.Sprite).spriteFrame = this.Gray_sprite
            this.left_btn.normalSprite = this.Gray_sprite 
            this.left_btn.pressedSprite = this.Gray_sprite 
            this.left_btn.hoverSprite = this.Gray_sprite 
            this.left_btn.node.rotation = 180
        }
        this.change_data(2)
    },
    show_layout : function(type){
        var self = this
        // 1:聊天 2：主页 3：朋友圈 4：视频 
        if(type==1){
            if(this.now_layout){
                cc.director.getScene().getChildByName('Canvas').removeChild(this.now_layout)
            }
            this.main_lay.node.active = true
            this.now_layout = this.main_lay
            this.now_layout.name = "main"
            this.main_btn.normalSprite = this.main_btn_sprite 
            this.user_btn.normalSprite = this.user_btn_sprite_1 
            this.video_btn.normalSprite = this.video_btn_sprite_1 
            this.friend_btn.normalSprite = this.friend_btn_sprite_1 
            this.shop_btn.normalSprite = this.shop_btn_sprite_1 
      
             //判断是否可领取彩蛋
             var unlock_num = 0
             var u_egg_ui = function(){
                if(unlock_num == 8){
                     self.Eggs.node.getComponent(cc.Sprite).spriteFrame = self.eggs_colour
                     self.is_receive_eggs = true
                 }else{
                     self.Eggs.node.getComponent(cc.Sprite).spriteFrame = self.eggs_gray
                     self.is_receive_eggs = false
                 }
                 self.Eggs.node.active = true
             }
             for(var k in this.polt_stat_data.story_list){
                if(this.polt_stat_data.story_list[k].day==self.show_day && this.polt_stat_data.story_list[k].stat==2){
                    unlock_num++
                }
             }
             u_egg_ui()
             server.send({               
                rid:"stat_story_list",          
                subject:"STAT",          
                cmd:"STAT_STORY_LIST",      
                udid:gamedata.userid,      
                req:{}            
            })
            gamedata.message_fun_map.set('stat_story_list',function(data){
                unlock_num = 0
                for(var k in data.data.story_list){
                    if(data.data.story_list[k].day==self.show_day && data.data.story_list[k].stat==2){
                        unlock_num++
                    }
                }
                u_egg_ui()
            })
        }else if(type==2){
            this.main_lay.node.active = false
            if(this.now_layout){
                cc.director.getScene().getChildByName('Canvas').removeChild(this.now_layout)
            }
            
            this.now_layout = cc.instantiate(this.user_lay);
            this.now_layout.x = -375
            this.now_layout.y = -667
            cc.director.getScene().getChildByName('Canvas').addChild(this.now_layout)
            this.now_layout.name = "user"

            this.main_btn.normalSprite = this.main_btn_sprite_1 
            this.user_btn.normalSprite = this.user_btn_sprite 
            this.video_btn.normalSprite = this.video_btn_sprite_1 
            this.friend_btn.normalSprite = this.friend_btn_sprite_1 
            this.shop_btn.normalSprite = this.shop_btn_sprite_1 
        }else if(type==3){
            this.main_lay.node.active = false
            if(this.now_layout){
                cc.director.getScene().getChildByName('Canvas').removeChild(this.now_layout)
            }
            
            this.now_layout = cc.instantiate(this.friend_lay);
            this.now_layout.x = -375
            this.now_layout.y = -667
            cc.director.getScene().getChildByName('Canvas').addChild(this.now_layout)
            this.now_layout.name = "friend"

            this.main_btn.normalSprite = this.main_btn_sprite_1 
            this.user_btn.normalSprite = this.user_btn_sprite_1 
            this.video_btn.normalSprite = this.video_btn_sprite 
            this.friend_btn.normalSprite = this.friend_btn_sprite_1 
            this.shop_btn.normalSprite = this.shop_btn_sprite_1 
        }else if(type==4){
            this.main_lay.node.active = false

            if(this.now_layout){
                cc.director.getScene().getChildByName('Canvas').removeChild(this.now_layout)
            }
            
            this.now_layout = cc.instantiate(this.video_lay);
            this.now_layout.x = -375
            this.now_layout.y = -667
            cc.director.getScene().getChildByName('Canvas').addChild(this.now_layout)
            this.now_layout.name = "video"

            this.main_btn.normalSprite = this.main_btn_sprite_1 
            this.user_btn.normalSprite = this.user_btn_sprite_1 
            this.video_btn.normalSprite = this.video_btn_sprite_1 
            this.friend_btn.normalSprite = this.friend_btn_sprite
            this.shop_btn.normalSprite = this.shop_btn_sprite_1 
        }else if(type==5){
            this.main_lay.node.active = false

            if(this.now_layout){
                cc.director.getScene().getChildByName('Canvas').removeChild(this.now_layout)
            }
            
            this.now_layout = cc.instantiate(this.shop_lay);
            this.now_layout.x = -375
            this.now_layout.y = -667
            cc.director.getScene().getChildByName('Canvas').addChild(this.now_layout)
            this.now_layout.name = "shop"

            this.main_btn.normalSprite = this.main_btn_sprite_1 
            this.user_btn.normalSprite = this.user_btn_sprite_1 
            this.video_btn.normalSprite = this.video_btn_sprite_1 
            this.friend_btn.normalSprite = this.friend_btn_sprite_1
            this.shop_btn.normalSprite = this.shop_btn_sprite 

            cc.loader.load(gamedata.scene_bg_url+"shop1.jpg"+gamedata.version_number,function(err,texture){
                self.main_bg.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            })
        }
    },
    updatelist: function(data,stat_data){
        this.top_scro.scrollToTop(0)
        var item_arr = []
        var end_polt_id = null
        for(var k in data){
            end_polt_id = data[k].chatroomid
        }
        var self = this
        if(data.length==0){
            this.scrollview.height = 200*1
            for(var i=1;i<=1;i++){
                var item = cc.instantiate(this.listPrefab);
                item.x = -375
                item.y = -100-(i-1)*200
                this.scrollview.addChild(item)

                //时间label
                var time_lb = item.getChildByName("time").getComponent(cc.Label)
                time_lb.string = "8:00"
                //标题label
                item.getChildByName("title_lb").getComponent(cc.Label).string = "???"
                for(var i=1;i<=4;i++){
                    var icon = item.getChildByName("icon_"+i)
                    icon.active= false
                }
                var lock = item.getChildByName("mzczan")
                lock.scale = 1.2
                lock.getComponent(cc.Sprite).spriteFrame = this.all_lock_btn
                lock.on(cc.Node.EventType.TOUCH_END, function (event) {
                    self.add_tip('你想使用魔法查看未来发生的全部的事情吗？',1,function(node1,node2){
                        //购买全部更改游戏状态，并且全部显示
                        var data = self.chat_conf[self.show_day]
                        self.show_chat_conf = data
                        var read_data = []
                        var caht_id_data = []
                        if(self.show_day == self.now_day){
                            //当前最新剧情，根据时间判断显示
                            var hours_time = new Date(gamedata.servertime).getHours()
                            for(var k in data){
                                if(data[k].time > hours_time){
                                    read_data.push(parseInt(data[k].chatroomid))
                                    caht_id_data.push(parseInt(data[k].chatroomid))
                                    var send_day = parseInt(data[k].chatroomid.substring(1,2))
                                    caht_id_data.push(send_day)
                                    read_data.push(4)
                                }
                            }
                            server.send({               
                                     rid:"stat_story_publish",          
                                     subject:"STAT",          
                                     cmd:"STAT_STORY_PUBLISH",      
                                     udid:gamedata.userid,      
                                     req:{story_list:caht_id_data}            
                            })
                            gamedata.message_fun_map.set('stat_story_publish',function(data){
                                
                               //购买剧情状态设置为4
                                server.send({               
                                         rid:"stat_story_read",  
                                         subject:"STAT",          
                                         cmd:"STAT_STORY_READ",      
                                         udid:gamedata.userid,      
                                         req:{stat_list:read_data}            
                                })
                                gamedata.message_fun_map.set('stat_story_read',function(data){
                                    server.send({               
                                        rid:"stat_story_list",          
                                        subject:"STAT",          
                                        cmd:"STAT_STORY_LIST",      
                                        udid:gamedata.userid,      
                                        req:{}            
                                    })
                                })
                                gamedata.message_fun_map.set('stat_story_list',function(data){
                                    self.polt_stat_data = data.data
                                    cc.director.getScene().getChildByName('Canvas').removeChild(node1)
                                    cc.director.getScene().getChildByName('Canvas').removeChild(node2)
                                    self.scrollview.removeAllChildren()
                                    self.updatelist(self.show_chat_conf,self.polt_stat_data)
                                })
                            })
                        }
                    })
                
                });
                return
            }
        }
        var self = this
        var stat_1 = 0
        var poltdata = null
        // if(this.polt_stat_data.story_list){
        //     for(var k in this.polt_stat_data.story_list){
        //         if(this.polt_stat_data.story_list[k].stat == 1 || this.polt_stat_data.story_list[k].stat == 2 || this.polt_stat_data.story_list[k].stat == 5){
        //             stat_1++
        //         }
        //     }
        // }
        // if(stat_1==8){
        //     poltdata = 99999
        // }else{
            
        // }
        poltdata = this.get_now_polt_speed(this.polt_stat_data)
        //判断全部解锁按钮位置
        this.scrollview.height = 200*8
        for(var i=1;i<=8;i++){
            var item = cc.instantiate(this.listPrefab);
            item.x = -375
            item.y = -100-(i-1)*200
            this.scrollview.addChild(item)
            item_arr.push(item)
                //时间label
                var time_lb = item.getChildByName("time").getComponent(cc.Label)
                time_lb.string = this.chat_conf[this.now_day][i-1].time+":00"
                //标题label
                var title_lb = item.getChildByName("title_lb").getComponent(cc.Label)
                var lock = item.getChildByName("mzczan")
                lock.active = false
                lock.on(cc.Node.EventType.TOUCH_END, function (event) {
                    //锁定按钮
                    gamedata.chat_room_polt_id = this.item.id
                    gamedata.chat_room_polt_title = this.item.getChildByName("title_lb").getComponent(cc.Label).string
                    
                        self.add_tip('你想使用魔法查看未来发生的全部的事情吗？',1,function(n1,n2){
                            //购买全部更改游戏状态，并且全部显示
                            var data = self.chat_conf[self.show_day]
                            self.show_chat_conf = data
                            var read_data = []
                            var caht_id_data = []
                            if(self.show_day == self.now_day){
                                //当前最新剧情，根据时间判断显示
                                var hours_time = new Date(gamedata.servertime).getHours()
                                for(var k in data){
                                    if(data[k].time > hours_time){
                                        read_data.push(parseInt(data[k].chatroomid))
                                        caht_id_data.push(parseInt(data[k].chatroomid))
                                        var send_day = parseInt(data[k].chatroomid.substring(1,2))
                                        caht_id_data.push(send_day)
                                        read_data.push(4)
                                    }
                                }
                                server.send({               
                                         rid:"stat_story_publish",          
                                         subject:"STAT",          
                                         cmd:"STAT_STORY_PUBLISH",      
                                         udid:gamedata.userid,      
                                         req:{story_list:caht_id_data}            
                                })
                                gamedata.message_fun_map.set('stat_story_publish',function(data){
                                   //购买剧情状态设置为4
                                    server.send({               
                                             rid:"stat_story_read",  
                                             subject:"STAT",          
                                             cmd:"STAT_STORY_READ",      
                                             udid:gamedata.userid,      
                                             req:{stat_list:read_data}            
                                    })
                                    gamedata.message_fun_map.set('stat_story_read',function(data){
                                        
                                        self.scrollview.removeAllChildren()
                                        server.send({               
                                            rid:"stat_story_list",          
                                            subject:"STAT",          
                                            cmd:"STAT_STORY_LIST",      
                                            udid:gamedata.userid,      
                                            req:{}            
                                        })
                                        gamedata.message_fun_map.set('stat_story_list',function(data){
                                            cc.director.getScene().getChildByName('Canvas').removeChild(n1)
                                            cc.director.getScene().getChildByName('Canvas').removeChild(n2)
                                            self.polt_stat_data = data.data
                                            self.updatelist(self.show_chat_conf,self.polt_stat_data)
                                        })
                                    })
                                })
                            }
                        })
                    
                }.bind({lock:lock,item:item}));
                //使用背景添加事件
                var bg2 = item.getChildByName("lttm_tm")
                bg2.on(cc.Node.EventType.TOUCH_END, function (event) {
                    if(this.item.id == undefined){
                        if(gamedata.is_show_tip_move){
                            gamedata.showSysHint("","请等待剧情解锁")
                        }
                        return
                    }
                    for(var k in item_arr){
                        if(item_arr[k].getChildByName("lttm_tm").getChildByName("touch_blue_sp")){
                            item_arr[k].getChildByName("lttm_tm").removeChild(item_arr[k].getChildByName("lttm_tm").getChildByName("touch_blue_sp"))
                        }
                    }
                    var touch_blue_sp = new cc.Node();
                    touch_blue_sp.name = "touch_blue_sp"
                    touch_blue_sp.addComponent(cc.Sprite).getComponent(cc.Sprite).spriteFrame = self.polt_blue_spr
                    touch_blue_sp.opacity = 80;touch_blue_sp.x=0;touch_blue_sp.y=50.5
                    this.item.getChildByName("lttm_tm").addChild(touch_blue_sp)

                    gamedata.chat_scene_id = 1
                    gamedata.chat_room_polt_id = this.item.id
                    gamedata.chat_room_backgroundmusic_id = this.data[this.i-1].backgroundmusic
                    gamedata.chat_room_polt_title = this.item.getChildByName("title_lb").getComponent(cc.Label).string
                    self.get_islock(this.item.id,function(data,id){

                        gamedata.polt_Whether_join = 1
                        cc.director.loadScene("chat");
                        return

                        var stat = data
                        //0 解锁前面剧情  1 当前剧情可进入参与  2 当前剧情已观看完，需重播 3 当前剧情为错过剧情,不可参与
                        //gamedata.polt_Whether_join = 1
                        for(var k in self.polt_stat_data.story_list){
                            if(self.polt_stat_data.story_list[k].sid == id){
                                gamedata.polt_state = self.polt_stat_data.story_list[k].stat
                            }
                        }
                        if(stat==0){
                            if(gamedata.is_show_tip_move){
                                gamedata.showSysHint('',"请阅读前面剧情！")
                            }
                            gamedata.polt_Whether_join = 0
                            return
                        }else if(stat==1){
                            //可参与剧情
                            gamedata.polt_Whether_join = 1
                            cc.director.loadScene("chat");
                            return
                        }else if(stat==2){
                            //cc.log("已读剧情")
                            self.add_frame(1)
                            gamedata.polt_Whether_join = 0
                            return
                        }else if(stat==3){
                            //cc.log("错过剧情！")
                            gamedata.polt_Whether_join = 0
                            self.add_frame(1)
                            return
                        }else if(stat==4){
                            gamedata.polt_Whether_join = 2
                            //cc.log("重播剧情！")
                            self.add_frame(2)
                            return
                        }else if(stat==999){
                            //购买剧情
                            gamedata.polt_Whether_join = 1
                            cc.director.loadScene("chat");
                            return
                        }
                    })
                }.bind({item:item,data:data,i:i}));
                
                var is_Read = item.getChildByName('wdxts')
                if(this.now_day == 1){
                    is_Read.getComponent(cc.Sprite).spriteFrame = this.new_polt_sprf
                }
                if(this.show_day == this.now_day){
                    if(data[i-1] && data[i-1].chatroomid == end_polt_id){
                        is_Read.getComponent(cc.Sprite).spriteFrame = this.new_polt_sprf
                    }
                }
                //四个icon   (剧情参与头像)
                var iconarr = []
                for(var j=1;j<=4;j++){
                    var icon = item.getChildByName('icon_'+j)
                    iconarr.push(icon)
                }
                if(data[i-1]){
                    for(var mmk in this.polt_stat_data.story_list){
                        if(this.polt_stat_data.story_list[mmk].sid == data[i-1].chatroomid && this.polt_stat_data.story_list[mmk].stat==4){
                            is_Read.getComponent(cc.Sprite).spriteFrame = this.new_polt_sprf
                        }
                    }
                    item.id = data[i-1].chatroomid
                    var iconarrid = data[i-1].participate.split(",")
                    for(var k=0;k<4;k++){
                        if(iconarrid[k]){
                            var sp = 'icon/'+iconarrid[k]
                            cc.loader.loadRes(sp,cc.SpriteFrame,function(err,texture){
                                this.iconarr[this.k].getComponent(cc.Sprite).spriteFrame = texture
                            }.bind({k:k,iconarr:iconarr}))
                        }else{
                            iconarr[k].active = false
                        }
                    }
                    title_lb.string = data[i-1].title
                }else{
                    item.getChildByName("title_lb").getComponent(cc.Label).string = "???"
                    for(var k in iconarr){
                        iconarr[k].active = false
                    }
                    is_Read.active = false
                    item.getChildByName("lttm_tm").getComponent(cc.Sprite).spriteFrame = this.buttom_black_frame
                    item.getChildByName("time_title").getComponent(cc.Sprite).spriteFrame = this.time_black_frame
                    item.getChildByName("title").getComponent(cc.Sprite).spriteFrame = this.title_black_frame
                }
                //状态初始化
                if(stat_data.story_list){
                    for(var k in stat_data.story_list){
                        if(item.id && stat_data.story_list[k].sid == item.id){
                            if(stat_data.story_list[k].stat == 0){
                                is_Read.active = true}else if(stat_data.story_list[k].stat == 1){
                                    is_Read.active =true}else if(stat_data.story_list[k].stat == 2 || stat_data.story_list[k].stat == 5){
                                        is_Read.active =false
                                    }
                        }
                    } 
                }
                if(this.show_day == poltdata.day){
                    if(poltdata.sid == item.id){bg2.getComponent(cc.Sprite).spriteFrame = this.polt_blue_spr}
                    this.Identification.node.active = true
                }else{
                    this.Identification.node.active = false
                }
                // if(data.length!=0 && item.id == data[data.length-1].chatroomid && 
                //     (parseInt(new Date(gamedata.servertime).getHours())-parseInt(data[data.length-1].time))<2
                // ){lock.active= false}

                if(i==(data.length+1)){
                    if(poltdata==88888){
                        bg2.getComponent(cc.Sprite).spriteFrame = this.polt_blue_spr
                    }
                    lock.getComponent(cc.Sprite).spriteFrame = this.all_lock_btn
                    this.lock_btn_uuid = lock.uuid
                    lock.active= true
                    lock.scale = 1.2
                }
                   
                
                // if(this.show_day != this.now_day){
                //     //当前显示不是最新剧情
                //     lock.active=true
                // }
            }
    },
    get_now_polt_speed: function(data){
        //获取当前剧情在第几天第几条
        var small_id = null
        var small_day = null
        var stat = []

        if(data.story_list.length==0){
            //第一次进入
            stat.push({day: this.now_day, sid: parseInt("1"+this.now_day+"01"), stat: 0})
            return stat[0]
        }
        var ovre_num = 0
        var overnum1 = 0
        for(var k in data.story_list){
            if(data.story_list[k].stat == 2 || data.story_list[k].stat == 5){
                if(data.story_list[k].day == this.now_day){
                    ovre_num++
                }
            }
            if(data.story_list[k].stat == 2 || data.story_list[k].stat == 5 || data.story_list[k].stat == 1){
                if(data.story_list[k].day == this.now_day){
                    overnum1++
                }
            }
        }
        if(ovre_num==data.story_list.length){
            //当前解锁剧情全部完成
            return 88888
        }
        if(overnum1==8){
            //当前剧情已读完
            return 99999
        }

        //删选出stat==0
        if(data.story_list){
            for(var k in data.story_list){
                if(data.story_list[k].stat == 0 || data.story_list[k].stat == 4){
                    stat.push(data.story_list[k])
                }
            }
        }
        if(stat.length == 0){
            return {day: this.now_day, sid: parseInt("1"+this.now_day+"01"), stat: 0}
        }
        stat.sort(function(a,b){
            return a.sid - b.sid
        })

        if(stat.length != 0){
            return stat[0]
        }
       
    },
    get_islock: function(id,fun){
        //判断当前剧情是否锁定状态
        var data = null
        var self = this
        var show_day_polt_stat_data = []
      
        server.send({               
            rid:"stat_story_list",          
            subject:"STAT",          
            cmd:"STAT_STORY_LIST",      
            udid:gamedata.userid,      
            req:{}            
        })
        gamedata.message_fun_map.set('stat_story_list',function(data){
            //得到当前显示的剧情
            if(self.now_day==1){
                for(var k in data.data.story_list){
                    if(data.data.story_list[k].stat==2 && data.data.story_list[k].sid == id){
                        //解锁剧情重新阅读后
                        return fun(4,id)}
                    if(data.data.story_list[k].stat==5 && data.data.story_list[k].sid == id){return fun(4,id)}
                }
                for(var k in data.data.story_list){
                    if(data.data.story_list[k].stat==5 && data.data.story_list[k].sid == id){return fun(4,id)}
                    if(data.data.story_list[k].stat==2 && data.data.story_list[k].sid == id){return fun(4,id)}
                    if((data.data.story_list[k].stat!=1 && data.data.story_list[k].stat!=2)&& parseInt(data.data.story_list[k].sid) < id){
                        //剧情微阅读
                        return fun(0,id)
                    }
                }
                return fun(1,id)
            }
            for(var k in data.data.story_list){
                if(data.data.story_list[k].stat==0 || data.data.story_list[k].stat==0){
                    if(data.data.story_list[k].sid < id){
                        return fun(0,id)
                    }
                }
                if(data.data.story_list[k].stat==2 && data.data.story_list[k].sid == id){return fun(4,id)}
                if(data.data.story_list[k].stat==5 && data.data.story_list[k].sid == id){return fun(4,id)}
            }
            var stat_4 = 0
            if(data.data.story_list){
                for(var k in data.data.story_list){
                    if(data.data.story_list[k].day == self.show_day){
                        if(data.data.story_list[k].stat == 4){
                            stat_4++
                        }
                        show_day_polt_stat_data.push(data.data.story_list[k])
                    }
                }
            }
            show_day_polt_stat_data.sort(function(a,b){
                return a.sid - b.sid
            })
            self.show_day_polt_stat_data = show_day_polt_stat_data
            for(var k in self.show_chat_conf){
                if(self.show_chat_conf[k].chatroomid == id){
                    data = self.show_chat_conf[k]
                }
            }
            if(stat_4 > 0){
                //当前页有全部解锁未参与剧情
                for(var k in show_day_polt_stat_data){
                    if(show_day_polt_stat_data[k].sid  == id && show_day_polt_stat_data[k].stat==1){
                        //已读剧情
                        return fun(2,id)
                    }else if(show_day_polt_stat_data[k].sid  == id && show_day_polt_stat_data[k].stat==0){
                        //错过剧情
                        return fun(3,id)
                    }else if(show_day_polt_stat_data[k].sid  == id && show_day_polt_stat_data[k].stat==2){
                        //互动剧情
                        return fun(4,id)
                    }else if(show_day_polt_stat_data[k].sid == id && show_day_polt_stat_data[k].stat==4){
                        return fun(999,id)
                    }
                }
            }

            if(data&& (parseInt(new Date(gamedata.servertime).getHours())-parseInt(data.time))<2 && self.day_index == self.now_day){
                //当前未超时剧情    判断前面剧情是否完成
                for(var k in show_day_polt_stat_data){
                    if(show_day_polt_stat_data[k].sid == id && show_day_polt_stat_data[k].stat==0){
                        //未阅读完前面剧情
                        return fun(1,id)
                    }
                }
                return fun(0,id)
            }
            for(var k in show_day_polt_stat_data){
                if(show_day_polt_stat_data[k].sid  == id && show_day_polt_stat_data[k].stat==1){
                    //已读剧情
                    return fun(2,id)
                }else if(show_day_polt_stat_data[k].sid  == id && show_day_polt_stat_data[k].stat==0){
                    for(var k in show_day_polt_stat_data){
                        if(show_day_polt_stat_data[k].stat==0 && show_day_polt_stat_data[k].sid < id){
                            return fun(0,id)
                        }
                    }
                    //错过剧情
                    return fun(3,id)
                }else if(show_day_polt_stat_data[k].sid  == id && show_day_polt_stat_data[k].stat==2){
                    //互动剧情
                    return fun(4,id)
                }else if(show_day_polt_stat_data[k].sid  == id && show_day_polt_stat_data[k].stat==5){
                    return fun(4,id)
                }
            }
        }) 

    },
    change_data: function(type){
        //type 1：增加  2：减少
        //删除列表所有节点，重新加载
        this.scrollview.removeAllChildren()
        var stat_4 = 0
        if(type==1){
            this.show_day++
            var data = this.chat_conf[this.show_day]
            this.show_day_polt_stat_data = []   
            this.show_chat_conf = [] 
            this.day_index=this.show_day
            if(this.show_day == this.now_day){
                //当前最最新剧情，根据时间判断显示
                var hours_time = new Date(gamedata.servertime).getHours()
                for(var k in data){
                    if(data[k].time <= hours_time){
                        this.show_chat_conf.push(data[k])
                    }
                }
            }else{
                for(var k in data){
                    this.show_chat_conf.push(data[k])
                }
                this.show_day_polt_stat_data.sort(function(a,b){
                    return a.sid - b.sid
                })
            }
            //拿到存储的剧情状态
            if(this.polt_stat_data.story_list){
                for(var k in this.polt_stat_data.story_list){
                    if(this.polt_stat_data.story_list[k].day == this.show_day){
                        if(this.polt_stat_data.story_list[k].stat==4 || this.polt_stat_data.story_list[k].stat==5 || this.polt_stat_data.story_list[k].stat==2 || this.polt_stat_data.story_list[k].stat==1){
                            stat_4++
                        }
                        this.show_day_polt_stat_data.push(this.polt_stat_data.story_list[k])
                    }
                }
            }
            if(stat_4 != 0){
                for(var k in data){
                    this.show_chat_conf.push(data[k])
                }
            }
            
            if(gamedata.account_number == 1 && this.show_day == 7){
                this.show_chat_conf = data
            }
            this.updatelist(this.show_chat_conf,this.polt_stat_data)
        }else if(type==2){
            this.show_day--
            var data = this.chat_conf[this.show_day]
            this.show_day_polt_stat_data = []   
            this.show_chat_conf = [] 
            this.day_index=this.show_day
            //天数减少  所有剧情都显示
            for(var k in data){
                this.show_chat_conf.push(data[k])
            }
            this.show_day_polt_stat_data.sort(function(a,b){
                return a.sid - b.sid
            })
            if(this.polt_stat_data.story_list){
                for(var k in this.polt_stat_data.story_list){
                    if(this.polt_stat_data.story_list[k].day == this.show_day){
                        this.show_day_polt_stat_data.push(this.polt_stat_data.story_list[k])
                    }
                }
            }
            this.updatelist(this.show_chat_conf,this.polt_stat_data)
        }
    },
    storage_polt: function(){
         //判断当前显示剧情个数
         var chat_id = []
         var hours_time = new Date(gamedata.servertime).getHours()
         var data = this.chat_conf[this.show_day]
         this.show_day_polt_stat_data = []
         this.show_chat_conf = []
         if(this.show_day != this.now_day){
             //前面剧情未完成，显示未完成的天数（全部剧情显示）
             this.show_chat_conf = data;
             //this.day_index=this.show_day
             if(this.polt_stat_data.story_list){
                for(var k in this.polt_stat_data.story_list){
                    if(this.polt_stat_data.story_list[k].day == this.show_day){
                       this.show_day_polt_stat_data.push(this.polt_stat_data.story_list[k])
                    }
                }
             }
             this.show_day_polt_stat_data.sort(function(a,b){
                 return a.sid - b.sid
             })
         }else{
             //正常当天 判断时间
             var stat_4 = 0
             var stat_2 = 0
             if(this.polt_stat_data.story_list){
                for(var k in this.polt_stat_data.story_list){
                    if(this.polt_stat_data.story_list[k].stat == 4 || this.polt_stat_data.story_list[k].stat == 5){
                        if(this.polt_stat_data.story_list[k].day == this.show_day){
                            stat_4++
                        }
                    }
                    if(this.polt_stat_data.story_list[k].stat == 2 || this.polt_stat_data.story_list[k].stat == 1){
                        if(this.polt_stat_data.story_list[k].day == this.show_day){
                            stat_2++
                        }
                    }
                }
             }
             if(stat_4>0){
                this.show_chat_conf = data
             }else if(stat_2==8){
                this.show_chat_conf = data
             }else{
                for(var k in data){
                    if(data[k].time <= hours_time){
                        this.show_chat_conf.push(data[k])
                    }
                }
             }
         }
        if(gamedata.account_number == 1 && this.show_day == 7){
            this.show_chat_conf = data
        }
         var is_show = false //判断当前剧情是否已存储
         if(this.polt_stat_data.length != 0){
             for(var k in this.chat_conf){
                 if(k<=this.now_day){
                     for(var k2 in this.chat_conf[k]){
                        for(var k1 in this.polt_stat_data.story_list){   
                            if(this.polt_stat_data.story_list[k1].sid == this.chat_conf[k][k2].chatroomid){
                                is_show = true
                            }  
                        }
                        if(!is_show){chat_id.push(parseInt(this.chat_conf[k][k2].chatroomid))
                            var send_day = parseInt(this.chat_conf[k][k2].chatroomid.substring(1,2))
                            chat_id.push(send_day)
                        }
                        is_show = false
                     }
                 }
             }      
         }else{
             for(var k in this.show_chat_conf){
                 chat_id.push(parseInt(this.show_chat_conf[k].chatroomid))
                 var send_day = parseInt(data[k].chatroomid.substring(1,2))
                 chat_id.push(send_day)
             }
         }      
        
         if(chat_id.length!=0){
             //存储剧情进度
             server.send({               
                      rid:"stat_story_publish",          
                      subject:"STAT",          
                      cmd:"STAT_STORY_PUBLISH",      
                      udid:gamedata.userid,      
                      req:{story_list:chat_id}            
             })
             gamedata.message_fun_map.set('stat_story_publish',function(data){
             })
         }
    },
    post_polt_stat: function(){
        var self = this
        server.send({               
            rid:"common_get_current_day",          
            subject:"COMMON",          
            cmd:"COMMON_GET_CURRENT_DAY",      
            udid:gamedata.userid,      
            req:{}            
        })

        gamedata.message_fun_map.set('common_get_current_day',function(data){
            if(data.data.day > self.now_day){
                self.right_btn.normalSprite = self.White_sprite 
                self.right_btn.pressedSprite = self.White_sprite 
                self.right_btn.hoverSprite = self.White_sprite 
                self.right_btn.node.rotation = 180
            }
            //data.data.day
            self.now_day = 7
            if(data.data.day > 7){self.now_day = 7}

            for(var o in self.chat_conf[data.data.day]){
                if(self.chat_conf[data.data.day][o].time > (new Date(gamedata.servertime).getHours())){
                    self.pay_polt_data.push(self.chat_conf[data.data.day][o])
                }
            }
            //获取当前剧情数据
            server.send({               
                rid:"stat_story_list",          
                subject:"STAT",          
                cmd:"STAT_STORY_LIST",      
                udid:gamedata.userid,      
                req:{}            
            })
        })                
        
        gamedata.message_fun_map.set('stat_story_list',function(data){
            self.polt_stat_data = data.data
            //配置加载完成
            var p_data_day = self.get_now_polt_speed(self.polt_stat_data)
            if(p_data_day){
                if(p_data_day==99999 || p_data_day==88888){
                    self.show_day = self.now_day
                }else{
                    self.show_day = p_data_day.day
                }
            }
            self.day_index = self.show_day 
            //得到当前显示的剧情
            if(data.data.story_list){
                for(var k in data.data.story_list){
                    if(data.data.story_list[k].day == self.show_day){
                        self.show_day_polt_stat_data.push(data.data.story_list[k])
                    }
                }
            }
            self.show_day_polt_stat_data.sort(function(a,b){
                return a.sid - b.sid
            })
            self.storage_polt()
            gamedata.judge_news()
            self.scrollview.removeAllChildren()
            self.updatelist(self.show_chat_conf,self.polt_stat_data)
        }) 
    },
    add_tip: function(str,type,fun){

        var self = this

        var tip_layout = cc.instantiate(this.black_layer);
        cc.director.getScene().getChildByName('Canvas').addChild(tip_layout)
        tip_layout.x = 0;tip_layout.y=0
        tip_layout.on(cc.Node.EventType.TOUCH_END, function (event) {})


        //type  1:全部解锁  2:单个解锁  3：重播
        var tip_frame = cc.instantiate(this.Tip_frame);
        tip_frame.zIndex = 999
        cc.director.getScene().getChildByName('Canvas').addChild(tip_frame)
        var lab = tip_frame.getChildByName("content").getComponent(cc.RichText)
        lab.string = str
        tip_frame.getChildByName("xiao_hao").getChildByName("label").getComponent(cc.Label).string = -30
        tip_frame.getChildByName("confirm").on(cc.Node.EventType.TOUCH_END, function (event) {

           
            if((gamedata.cat_paw_coin-30) < 0){
                gamedata.showSysHint("","钻石不足！");return
            }    
            gamedata.cat_paw_coin-=30
            cc.director.getScene().getChildByName('Canvas').removeChild(tip_frame)
            cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout)
            if(type == 1){
                var tip_layout1 = cc.instantiate(self.black_layer);
                cc.director.getScene().getChildByName('Canvas').addChild(tip_layout1)
                tip_layout1.zIndex = 998
                tip_layout1.x = 0;tip_layout1.y=0
                tip_layout1.on(cc.Node.EventType.TOUCH_END, function (event) {})
                var tip_frame1 = cc.instantiate(self.loading_layer);
                tip_frame1.zIndex = 999
                tip_frame1.x = 0; tip_frame1.y = 0
                cc.director.getScene().getChildByName('Canvas').addChild(tip_frame1)
                tip_frame1.getChildByName('light_b').runAction(cc.repeatForever(cc.rotateBy(1,360)))
                var ani = tip_frame1.getChildByName('l_1').getComponent(cc.Animation)
                ani.play("loading")
                server.send({               
                         rid:"pay_current_day_story",  
                         subject:"PAY",          
                         cmd:"PAY_CURRENT_DAY_STORY",      
                         udid:gamedata.userid,      
                         req:{}            
                })
                gamedata.message_fun_map.set('pay_current_day_story',function(data,code){
                    if(code==205){
                        if(gamedata.is_show_tip_move){ 
                            gamedata.showSysHint("","货币不足",null)  
                        }
                    }else{
                        //购买成功。修改游戏状态
                        fun&&fun(tip_layout1,tip_frame1)
                        self.coin.getComponent(cc.Label).string = data.data.overplus
                    }
                })
            }else if(type==2){
                //购买剧情
                server.send({               
                         rid:"pay_miss_story",  
                         subject:"PAY",          
                         cmd:"PAY_MISS_STORY",      
                         udid:gamedata.userid,      
                         req:{}            
                })
                gamedata.message_fun_map.set('pay_miss_story',function(data,code){
                    if(code==205){
                        if(gamedata.is_show_tip_move){ 
                            gamedata.showSysHint("","货币不足",null)  
                        }
                    }else{
                        //购买成功。修改游戏状态
                        fun&&fun()
                        self.coin.getComponent(cc.Label).string = data.data.overplus
                    }
                })
            }
        })
        
        tip_frame.getChildByName("cancel").on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.director.getScene().getChildByName('Canvas').removeChild(tip_frame)
            cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout)
        })

    },
    Unlock_Eggs: function(fun){
        var self = this
        var change_start = []
        for(var k in this.polt_stat_data.story_list){
            if(this.polt_stat_data.story_list[k].day==this.show_day && this.polt_stat_data.story_list[k].stat==2){
                change_start.push(parseInt(this.polt_stat_data.story_list[k].sid))
                change_start.push(5)
            }
        }
        var id = parseInt("810000"+this.show_day)
        server.send({               
                 rid:"common_thing_store",          
                 subject:"COMMON",          
                 cmd:"COMMON_THING_STORE",      
                 udid:gamedata.userid,      
                 req:{thing_list:[id,1]}            
        })
        gamedata.message_fun_map.set('common_thing_store',function(data){})
        //领取彩蛋后更改剧情状态
        server.send({               
            rid:"stat_story_read",          
            subject:"STAT",          
            cmd:"STAT_STORY_READ",      
            udid:gamedata.userid,      
            req:{stat_list:change_start}            
        })
        gamedata.message_fun_map.set('stat_story_read',function(data){

        })
        server.send({               
            rid:"common_drae_and_egg",  
            subject:"COMMON",          
            cmd:"COMMON_DRAW_AND_EGG",      
            udid:gamedata.userid,      
            req:{type:0}            
        })
        gamedata.message_fun_map.set('common_drae_and_egg',function(data){
            gamedata.is_show_tip_move = true
            self.is_receive_eggs = false
            fun(data.data)
        })
        server.send({               
            rid:"stat_story_list",          
            subject:"STAT",          
            cmd:"STAT_STORY_LIST",      
            udid:gamedata.userid,      
            req:{}            
        })
        gamedata.message_fun_map.set('stat_story_list',function(data){
            self.polt_stat_data = data.data
        })
    },
    add_frame: function(type){
        gamedata.is_one_pay_polt = false
        var self = this
        var tip_layout = cc.instantiate(this.black_layer);
        cc.director.getScene().getChildByName('Canvas').addChild(tip_layout)
        tip_layout.x = 0;tip_layout.y=0
        tip_layout.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.director.getScene().getChildByName('Canvas').removeChild(tip_frame)
            cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout)
        })
        //type  1:错过剧情  2:参与后剧情  
        var tip_frame = cc.instantiate(this.Tip_frame);
        tip_frame.zIndex = 999
        cc.director.getScene().getChildByName('Canvas').addChild(tip_frame)
        tip_frame.getChildByName("xiao_hao").active = true;tip_frame.getChildByName("xiao_hao").x=175;tip_frame.getChildByName("xiao_hao").y=-82

        if(type==1){
            tip_frame.getChildByName("content").getComponent(cc.RichText).string = "这段剧情你错过了哦！"
            tip_frame.getChildByName("confirm").getChildByName("Label").getComponent(cc.Label).string = "偷偷查看"
            tip_frame.getChildByName("cancel").getChildByName("Label").getComponent(cc.Label).string = "参与对话"

        }else if(type==2){
            tip_frame.getChildByName("content").getComponent(cc.RichText).string = "已参与过剧情"
            tip_frame.getChildByName("confirm").getChildByName("Label").getComponent(cc.Label).string = "偷偷回味"
            tip_frame.getChildByName("cancel").getChildByName("Label").getComponent(cc.Label).string = "重新参与"
           
        }
        tip_frame.getChildByName("confirm").on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.director.getScene().getChildByName('Canvas').removeChild(tip_frame)
            cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout)
            if(type==1){
                //偷偷查看
                cc.director.loadScene("chat");
            }else if(type==2){
                //偷偷回味
                cc.director.loadScene("chat");
            }
        })
        tip_frame.getChildByName("cancel").on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.director.getScene().getChildByName('Canvas').removeChild(tip_frame)
            cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout)
            if(type==1){
                //参与对话
                
                if((gamedata.cat_paw_coin-20) < 0){
                    gamedata.showSysHint("","钻石不足！");return
                }
                gamedata.cat_paw_coin-=20
                gamedata.polt_Whether_join = 1
                gamedata.is_one_pay_polt = true
                server.send({               
                         rid:"pay_add_coin",  
                         subject:"PAY",          
                         cmd:"PAY_ADD_COIN",      
                         udid:gamedata.userid,      
                         req:{coin:-20}            
                })
                gamedata.message_fun_map.set('pay_add_coin',function(data){})
                self.coin.getComponent(cc.Label).string = gamedata.cat_paw_coin
                cc.director.loadScene("chat");
            }else if(type==2){
                //重新参与
                
                if((gamedata.cat_paw_coin-20) < 0){
                    gamedata.showSysHint("","钻石不足！");return
                }
                gamedata.cat_paw_coin-=20
                gamedata.polt_Whether_join = 1
                gamedata.is_one_pay_polt = true
                server.send({               
                         rid:"pay_add_coin",  
                         subject:"PAY",          
                         cmd:"PAY_ADD_COIN",      
                         udid:gamedata.userid,      
                         req:{coin:-20}            
                })
                gamedata.message_fun_map.set('pay_add_coin',function(data){})
                self.coin.getComponent(cc.Label).string = gamedata.cat_paw_coin
                cc.director.loadScene("chat");
            }   
        })

    },
    add_loading_frame: function(){
        
    },
    start () {

    },
    updateui : function(data){
    },

    add_Test_WP: function(){
        var ccc = []
        var sss = []
        var kkk = []
        gamedata.load_json_data("goods",function(data){
            for(var k in data){
                if(data[k].type == "电话卡"){
                    ccc.push(parseInt(data[k].goodsid))
                    ccc.push(100)
                }
            }
            gamedata.message_fun_map.set('common_thing_store',function(data){
                cc.log("add common_thing_store")
            })
            server.send({               
                     rid:"stat_phonecard_save",  
                     subject:"STAT",          
                     cmd:"STAT_PHONECARD_SAVE",      
                     udid:gamedata.userid,      
                     req:{card_list:ccc}            
            })
            gamedata.message_fun_map.set('stat_phonecard_save',function(data){
                cc.log("add stat_phonecard_save")
            })
        })
        gamedata.load_json_data("album",function(data){
            ccc = []
            for(var k in data){
                ccc.push(parseInt(data[k].pokedexid))
            }
            server.send({               
                     rid:"stat_pokedex_save",  
                     subject:"STAT",          
                     cmd:"STAT_POKEDEX_SAVE",      
                     udid:gamedata.userid,      
                     req:{pokedex_list:ccc}            
            })
            gamedata.message_fun_map.set('stat_pokedex_save',function(data){
                cc.log("add stat_pokedex_save")
            })
        })
        gamedata.load_json_data("circlefriends",function(data){
            kkk = []
            for(var k in data){
                kkk.push(parseInt(data[k].circlefriendsid))
            }
            server.send({               
                rid:"stat_moments_save",          
                subject:"STAT",          
                cmd:"STAT_MOMENTS_SAVE",      
                udid:gamedata.userid,      
                req:{moments_list:kkk}            
            })
            gamedata.message_fun_map.set('stat_moments_save',function(data){
                add_friend_pl()
            })
        })
        gamedata.load_json_data("letters",function(data){
            ccc = []
            for(var k in data){
                ccc.push(parseInt(data[k].privateletterid))
            }
            server.send({               
                     rid:"stat_letter_publish",          
                     subject:"STAT",          
                     cmd:"STAT_LETTER_PUBLISH",      
                     udid:gamedata.userid,      
                     req:{letter_list:ccc}            
            })
            gamedata.message_fun_map.set('stat_letter_publish',function(data){
                
            })
        })
        var add_friend_pl = function(){
            gamedata.load_json_data("friend_comment",function(plot_close_comment){
                gamedata.load_json_data("circlefriends",function(f_data){
                    var r_id_friend = {}
                    var no_choice_data = []
                    var reply_id = []
                    for(var sk in f_data){
                        r_id_friend[f_data[sk].circlefriendsid]=f_data[sk]
                    }
                    if(kkk.length!=0){
                        for(var qk in kkk){
                            no_choice_data = []
                            reply_id = []
                            var jk_data = r_id_friend[kkk[qk]]
                            var c_d = jk_data.comment
                            for(var kp in plot_close_comment){
                                if(plot_close_comment[kp].linkid == c_d && plot_close_comment[kp].role != 1){
                                    no_choice_data.push(plot_close_comment[kp])
                                    if(plot_close_comment[kp].replycontent){
                                        var o_temp = plot_close_comment[kp].replycontent.split(",")
                                        reply_id.push(o_temp[0])
                                    }
                                }
                            }
                            //存储评论id
                            var l_data = []
                            
                            for(var ftk in no_choice_data){
                                l_data.push(parseInt(no_choice_data[ftk].comment))
                                l_data.push(parseInt(no_choice_data[ftk].role))
                                if(reply_id[ftk]){
                                    l_data.push(parseInt(reply_id[ftk]))
                                    l_data.push(parseInt(9999))
                                }
                            }
                            server.send({               
                                rid:"stat_moments_comments_save",          
                                subject:"STAT",          
                                cmd:"STAT_MOMENTS_COMMENTS_SAVE",      
                                udid:gamedata.userid,      
                                req:{moments_id:parseInt(kkk[qk]),comments_list:l_data}            
                            })
                            gamedata.message_fun_map.set('stat_moments_comments_save',function(data){
                                
                            })
                        }
                    }
                })
            })
        }
    },
    add_Test_WP_Two: function(){
        var ccc = []
        var sss = []
        gamedata.load_json_data("goods",function(data){
            for(var k in data){
                if(data[k].type == "电话卡"){
                    ccc.push(parseInt(data[k].goodsid))
                    ccc.push(100)
                }
            }
            server.send({               
                     rid:"stat_phonecard_save",  
                     subject:"STAT",          
                     cmd:"STAT_PHONECARD_SAVE",      
                     udid:gamedata.userid,      
                     req:{card_list:ccc}            
            })
            gamedata.message_fun_map.set('stat_phonecard_save',function(data){
                cc.log("add stat_phonecard_save")
            })
        })
        server.send({               
                 rid:"stat_pokedex_save",  
                 subject:"STAT",          
                 cmd:"STAT_POKEDEX_SAVE",      
                 udid:gamedata.userid,      
                 req:{pokedex_list:[100401,100301,100306,100101,100201,100102,100302,100402,100103,100203,100403,100303]}            
        })
        gamedata.message_fun_map.set('stat_pokedex_save',function(data){
            cc.log("add stat_pokedex_save")
        })
        var kkk = [1001001,1002001,101,1004001,1002002,1003003,102,1003001,103,1004002]
        server.send({               
            rid:"stat_moments_save",          
            subject:"STAT",          
            cmd:"STAT_MOMENTS_SAVE",      
            udid:gamedata.userid,      
            req:{moments_list:[1001001,1002001,101,1004001,1002002,1003003,102,1003001,103,1004002]}            
        })
        gamedata.message_fun_map.set('stat_moments_save',function(data){
            add_friend_pl()
        })
        var add_friend_pl = function(){
            gamedata.load_json_data("friend_comment",function(plot_close_comment){
                gamedata.load_json_data("circlefriends",function(f_data){
                    var r_id_friend = {}
                    var no_choice_data = []
                    var reply_id = []
                    for(var sk in f_data){
                        r_id_friend[f_data[sk].circlefriendsid]=f_data[sk]
                    }
                    if(kkk.length!=0){
                        for(var qk in kkk){
                            no_choice_data = []
                            reply_id = []
                            var jk_data = r_id_friend[kkk[qk]]
                            var c_d = jk_data.comment
                            for(var kp in plot_close_comment){
                                if(plot_close_comment[kp].linkid == c_d && plot_close_comment[kp].role != 1){
                                    no_choice_data.push(plot_close_comment[kp])
                                    if(plot_close_comment[kp].replycontent){
                                        var o_temp = plot_close_comment[kp].replycontent.split(",")
                                        reply_id.push(o_temp[0])
                                    }
                                }
                            }
                            //存储评论id
                            var l_data = []
                            
                            for(var ftk in no_choice_data){
                                l_data.push(parseInt(no_choice_data[ftk].comment))
                                l_data.push(parseInt(no_choice_data[ftk].role))
                                if(reply_id[ftk]){
                                    l_data.push(parseInt(reply_id[ftk]))
                                    l_data.push(parseInt(9999))
                                }
                            }
                            server.send({               
                                rid:"stat_moments_comments_save",          
                                subject:"STAT",          
                                cmd:"STAT_MOMENTS_COMMENTS_SAVE",      
                                udid:gamedata.userid,      
                                req:{moments_id:parseInt(kkk[qk]),comments_list:l_data}            
                            })
                            gamedata.message_fun_map.set('stat_moments_comments_save',function(data){
                                
                            })
                        }
                    }
                })
            })
        }
        server.send({               
                 rid:"stat_letter_publish",          
                 subject:"STAT",          
                 cmd:"STAT_LETTER_PUBLISH",      
                 udid:gamedata.userid,      
                 req:{letter_list:[2301,2401,2201,2101,2202,2302,2402,2102]}            
        })
        gamedata.message_fun_map.set('stat_letter_publish',function(data){
            
        })
    }   
    // update (dt) {},
});
