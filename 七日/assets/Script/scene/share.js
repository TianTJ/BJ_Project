var gamedata=require('data');
var server = require('server')
cc.Class({
    extends: cc.Component,

    properties: {
        back: {
            default: null,
            type: cc.Sprite
        },
        share_game: {
            default: null,
            type: cc.Sprite
        },
        now_share_num: {
            default: null,
            type: cc.Label
        },
        now_luck_num: {
            default: null,
            type: cc.Label
        },
        start_Luck_draw: {
            default: null,
            type: cc.Sprite
        },
        my_prize: {
            default: null,
            type: cc.Sprite
        },
        heart_world: {
            default: null,
            type: cc.Sprite
        },
        luck_draw_light: {
            default: null,
            type: cc.Sprite
        },
        get_prize_frame: {
            default: null,
            type: cc.Prefab
        },
        black_layout: {
            default: null,
            type: cc.Prefab
        },
        get_clothes_frame: {
            default: null,
            type: cc.Prefab
        },
        add_main_frame: {
            default: null,
            type: cc.Sprite
        },
        coin_label: {
            default: null,
            type: cc.Label
        },
        lxf_tz:{
            default: null,
            type: cc.Sprite
        },
        xjs_tz:{
            default: null,
            type: cc.Sprite
        },
        zc_tz:{
            default: null,
            type: cc.Sprite
        },
        ai_tz:{
            default: null,
            type: cc.Sprite
        },
        gray_tz: {
            default: null,
            type: cc.SpriteFrame
        },
        time_loadbar: {
            default: null,
            type: cc.ProgressBar
        },
        Diamonds_gray:{
            default: null,
            type: cc.SpriteFrame
        },
        Diamonds_yellow:{
            default: null,
            type: cc.SpriteFrame
        },
        Diamonds_1:{
            default: null,
            type: cc.Sprite
        },
        Diamonds_2:{
            default: null,
            type: cc.Sprite
        },
        Diamonds_3:{
            default: null,
            type: cc.Sprite
        },
        s_time_1:{
            default: null,
            type: cc.Label
        },
        s_time_2:{
            default: null,
            type: cc.Label
        },
        s_time_3:{
            default: null,
            type: cc.Label
        },
        down_time_1: {
            default: null,
            type: cc.Label
        },
        down_time_2: {
            default: null,
            type: cc.Label
        },
        down_time_3: {
            default: null,
            type: cc.Label
        }
    },
    onLoad () {

        this.heart_world.node.active= false

        this.is_luck_draw = false;      //是否正在抽奖
        this.goods_conf = {}
        this.goods_server_data = {}
        this.share_prize_num = 6

        this.damonds_1_Receive = false
        this.damonds_2_Receive = false
        this.damonds_3_Receive = false

        this.down_time_num = 59
        this.s_down_time_num = 0
        this.down_type = 1
        this.now_down_num = 0

        var self = this
        self.back.node.on(cc.Node.EventType.TOUCH_END, function (event) {
          
            gamedata.main_scene_id = 1
            cc.director.loadScene("main")
        });

        //钻石领取
        self.Diamonds_1.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(!self.damonds_1_Receive){
                if(gamedata.is_show_tip_move){
                    gamedata.showSysHint("","请过段时间再来！")
                }
            }else{
                self.Receive_time_prize()
            }
        });
        self.Diamonds_2.node.on(cc.Node.EventType.TOUCH_END, function (event) {
             if(!self.damonds_2_Receive){
                if(gamedata.is_show_tip_move){
                    gamedata.showSysHint("","请过段时间再来！")
                }
            }else{
                self.Receive_time_prize()
            }
        });
        self.Diamonds_3.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(!self.damonds_3_Receive){
                if(gamedata.is_show_tip_move){
                    gamedata.showSysHint("","请过段时间再来！")
                }
            }else{
                self.Receive_time_prize()
            }
        });
        //分享游戏按钮
        self.share_game.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            
            if(self.share_prize_num < 1){

            }else{
                //前6次分享有奖励
                // 分享次数减少
                self.share_prize_num -= 1
                server.send({               
                    rid:"common_thing_consume",  
                    subject:"COMMON",          
                    cmd:"COMMON_THING_CONSUME",      
                    udid:gamedata.userid,      
                    req:{thing_list:[parseInt(520002),1]}            
                })
                gamedata.message_fun_map.set('common_thing_consume',function(data){})
                //分享后抽奖次数增加
                self.now_luck_num.node.getComponent(cc.Label).string = self.now_luck_num.node.getComponent(cc.Label).string+1
                server.send({               
                    rid:"common_thing_store",  
                    subject:"COMMON",          
                    cmd:"COMMON_THING_STORE",      
                    udid:gamedata.userid,      
                    req:{thing_list:[parseInt(520001),1]}            
                })
                gamedata.message_fun_map.set('common_thing_store',function(data){})
                //钻石增加
                gamedata.cat_paw_coin += 40
                self.coin_label.getComponent(cc.Label).string = gamedata.cat_paw_coin
                server.send({               
                         rid:"pay_add_coin",  
                         subject:"PAY",          
                         cmd:"PAY_ADD_COIN",      
                         udid:gamedata.userid,      
                         req:{coin:40}            
                })
                gamedata.message_fun_map.set('pay_add_coin',function(data){})

                if(gamedata.is_show_tip_move){
                    gamedata.showSysHint("","恭喜获得40钻石 抽奖次数+1！")
                }
            }
        });
        //开始抽奖按钮
        self.start_Luck_draw.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            
            if(self.now_luck_num.node.getComponent(cc.Label).string < 1){
                if(gamedata.is_show_tip_move){
                    gamedata.showSysHint("","次数不足")
                }
                return
            }
            if(!self.is_luck_draw){
                self.is_luck_draw = true
                server.send({               
                         rid:"common_thing_consume",  
                         subject:"COMMON",          
                         cmd:"COMMON_THING_CONSUME",      
                         udid:gamedata.userid,      
                         req:{thing_list:[parseInt(520001),1]}            
                })
                gamedata.message_fun_map.set('common_thing_consume',function(data){
                    self.scrollStart()
                })
                self.now_luck_num.node.getComponent(cc.Label).string = self.now_luck_num.node.getComponent(cc.Label).string-1
            }else{
                if(gamedata.is_show_tip_move){
                    gamedata.showSysHint("","正在抽奖！")
                }
            }
        });
        //我的奖品
        self.my_prize.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            server.send({               
                     rid:"common_thing_list",  
                     subject:"COMMON",          
                     cmd:"COMMON_THING_LIST",      
                     udid:gamedata.userid,      
                     req:{}            
            })
            gamedata.message_fun_map.set('common_thing_list',function(data){
                var d_len = []
                for(var k in data.data.thing_list){
                    if(data.data.thing_list[k].tid == 5109 || data.data.thing_list[k].tid == 5110 || data.data.thing_list[k].tid == 5111 || data.data.thing_list[k].tid == 5112){ 
                        d_len.push(data.data.thing_list[k])
                    }
                }
                if(d_len.length == 0){
                    if(gamedata.is_show_tip_move){
                        gamedata.showSysHint("","还没有获得套装！")
                    }
                }else{
                    self.add_frame()
                }
            })
        });
         //心跳世界
        self.heart_world.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            
        });
        self.add_main_frame.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            //返回商城界面
            gamedata.main_scene_id = 5
            cc.director.loadScene("main")
        });
        
        server.send({               
                 rid:"common_thing_list",  
                 subject:"COMMON",          
                 cmd:"COMMON_THING_LIST",      
                 udid:gamedata.userid,      
                 req:{}            
        })
        gamedata.message_fun_map.set('common_thing_list',function(g_data){
            gamedata.load_json_data("goods",function(data){
                for(var k in data){
                    if(data[k].level == ""){
                        self.goods_conf[data[k].goodsid] = data[k]
                    }
                }
                for(var k in g_data.data.thing_list){
                    self.goods_server_data[g_data.data.thing_list[k].tid] = g_data.data.thing_list[k]
                }
                if(!self.goods_server_data[520002]){
                    //第一次进入，没有分享次数，存储默认分享次数6次
                    server.send({               
                             rid:"common_thing_store",  
                             subject:"COMMON",          
                             cmd:"COMMON_THING_STORE",      
                             udid:gamedata.userid,      
                             req:{thing_list:[parseInt(520002),6]}            
                    })
                    gamedata.message_fun_map.set('common_thing_store',function(data){})
                    self.share_prize_num = 6
                }else{
                    self.share_prize_num = self.goods_server_data[520002].count
                }
                if(!self.goods_server_data[520001]){
                    //第一次进入，没有抽奖次数，存储默认抽奖次数3次
                    server.send({               
                             rid:"common_thing_store",  
                             subject:"COMMON",          
                             cmd:"COMMON_THING_STORE",      
                             udid:gamedata.userid,      
                             req:{thing_list:[parseInt(520001),3]}            
                    })
                    gamedata.message_fun_map.set('common_thing_store',function(data){})
                    self.now_luck_num.node.getComponent(cc.Label).string = 3
                }else{
                    self.now_luck_num.node.getComponent(cc.Label).string = self.goods_server_data[520001].count
                }
                self.initui()
            })
        })
        this.coin_label.getComponent(cc.Label).string = gamedata.cat_paw_coin
    },
    initui: function(){
        var self = this

        this.Diamonds_1.node.getChildByName("Diamonds_light").active = false
        this.Diamonds_2.node.getChildByName("Diamonds_light").active = false
        this.Diamonds_3.node.getChildByName("Diamonds_light").active = false

        if(this.goods_server_data[5109]){
            this.lxf_tz.node.getComponent(cc.Sprite).spriteFrame = this.gray_tz
        }
        if(this.goods_server_data[5110]){
            this.xjs_tz.node.getComponent(cc.Sprite).spriteFrame = this.gray_tz
        }
        if(this.goods_server_data[5111]){
            this.zc_tz.node.getComponent(cc.Sprite).spriteFrame = this.gray_tz
        }
        if(this.goods_server_data[5112]){
            this.ai_tz.node.getComponent(cc.Sprite).spriteFrame = this.gray_tz
        }
        
        //初始化时间进度
        server.send({               
                 rid:"stat_timeunit_get",  
                 subject:"STAT",          
                 cmd:"STAT_TIMEUNIT_GET",      
                 udid:gamedata.userid,      
                 req:{}            
        })
        gamedata.message_fun_map.set('stat_timeunit_get',function(data){
            if(data.data.unit == 0){
                //第一次进入，两个奖励可领取
                self.time_loadbar.progress = 120/180
                self.init_dim_time(120)
                //进入后改变进度
                server.send({               
                         rid:"stat_timeunit_save",  
                         subject:"STAT",          
                         cmd:"STAT_TIMEUNIT_SAVE",      
                         udid:gamedata.userid,      
                         req:{unit:120}            
                })
                gamedata.message_fun_map.set('stat_timeunit_save',function(data){})
                 //第三个计时器开始
                self.down_type = 3
                self.init_dim_time(120)
            }else{
                var diff_time =  (new Date(gamedata.servertime).getTime()-new Date(data.data.time).getTime())/1000
                self.s_down_time_num = 60-parseInt(diff_time%60)
                //self.down_time_num = 60-parseInt(data.data.unit+parseInt((diff_time/60)))
                self.time_loadbar.progress = (data.data.unit+(diff_time/60))/180 
                if((data.data.unit+(diff_time/60))/180 > 1){self.time_loadbar.progress = 1}
                self.init_dim_time(data.data.unit+parseInt((diff_time/60)))
            }
            cc.log(data)

        })
    },
    init_dim_time: function(speed){
        if(this.down_time_num == 60){
            this.s_down_time_num = 0
        }
        if(speed>=180){
            //三个全部开启 不启动计时器
            this.down_time_1.node.getComponent(cc.Label).string =  ""
            this.down_time_2.node.getComponent(cc.Label).string =  ""
            this.down_time_3.node.getComponent(cc.Label).string =  ""
            this.s_time_1.node.getComponent(cc.Label).string =  ""
            this.s_time_2.node.getComponent(cc.Label).string =  ""
            this.s_time_3.node.getComponent(cc.Label).string =  ""

            this.Diamonds_1.node.getChildByName("Diamonds_light").active = true
            this.Diamonds_1.node.getComponent(cc.Sprite).spriteFrame = this.Diamonds_yellow
            this.damonds_1_Receive = true
            this.Diamonds_2.node.getChildByName("Diamonds_light").active = true
            this.Diamonds_2.node.getComponent(cc.Sprite).spriteFrame = this.Diamonds_yellow
            this.damonds_2_Receive = true
            this.Diamonds_3.node.getChildByName("Diamonds_light").active = true
            this.Diamonds_3.node.getComponent(cc.Sprite).spriteFrame = this.Diamonds_yellow
            this.damonds_3_Receive = true

            //时间满了  暂停计时器
            cc.director.getScheduler().unscheduleAllForTarget(this)
            return
        }
        if(speed>=120){
            this.Diamonds_1.node.getChildByName("Diamonds_light").active = true
            this.Diamonds_1.node.getComponent(cc.Sprite).spriteFrame = this.Diamonds_yellow
            this.damonds_1_Receive = true
            this.Diamonds_2.node.getChildByName("Diamonds_light").active = true
            this.Diamonds_2.node.getComponent(cc.Sprite).spriteFrame = this.Diamonds_yellow
            this.damonds_2_Receive = true

            this.down_time_1.node.getComponent(cc.Label).string =  ""
            this.down_time_2.node.getComponent(cc.Label).string =  ""
            this.down_time_3.node.getComponent(cc.Label).string =  180-speed+":"   
            this.s_time_1.node.getComponent(cc.Label).string =  ""
            this.s_time_2.node.getComponent(cc.Label).string =  ""
            this.s_time_3.node.getComponent(cc.Label).string = this.s_down_time_num
            if(this.s_down_time_num<10){this.s_time_3.node.getComponent(cc.Label).string = "0"+this.s_down_time_num}

            this.down_time_num = 180-speed
            this.down_type = 3
            //未到第二个开启，开启第二个计时器
            cc.director.getScheduler().unscheduleAllForTarget(this)
            this.schedule(function() {
                // 这里的 this 指向 component
                this.s_downtime();
            },1,3600,1);
            return
        }
        if(speed>=60){
            this.Diamonds_1.node.getChildByName("Diamonds_light").active = true
            this.Diamonds_1.node.getComponent(cc.Sprite).spriteFrame = this.Diamonds_yellow
            this.damonds_1_Receive = true
        
            this.down_time_1.node.getComponent(cc.Label).string =  ""
            this.down_time_2.node.getComponent(cc.Label).string =  120-speed+":"
            this.down_time_3.node.getComponent(cc.Label).string =  "60:"
            this.s_time_1.node.getComponent(cc.Label).string =  ""
            this.s_time_3.node.getComponent(cc.Label).string =  "00"
            this.s_time_2.node.getComponent(cc.Label).string = this.s_down_time_num
            if(this.s_down_time_num<10){this.s_time_2.node.getComponent(cc.Label).string = "0"+this.s_down_time_num}
            

            this.down_time_num = 120-speed
            this.down_type = 2  
            //未到第二个开启，开启第二个计时器
            cc.director.getScheduler().unscheduleAllForTarget(this)
            this.schedule(function() {
                // 这里的 this 指向 component
                this.s_downtime();
            },1,3600,1);
            return
        }
        if(speed<60){

            this.down_time_1.node.getComponent(cc.Label).string =  60-speed+":"   
            this.down_time_2.node.getComponent(cc.Label).string =  "60:"
            this.down_time_3.node.getComponent(cc.Label).string =  "60:"
            this.s_time_2.node.getComponent(cc.Label).string =  "00"
            this.s_time_3.node.getComponent(cc.Label).string =  "00"
            this.s_time_1.node.getComponent(cc.Label).string = this.s_down_time_num
            if(this.s_down_time_num<10){this.s_time_1.node.getComponent(cc.Label).string = "0"+this.s_down_time_num}

            this.down_time_num = 60-speed
            this.down_type = 1

            this.Diamonds_1.node.getChildByName("Diamonds_light").active = false
            this.Diamonds_1.node.getComponent(cc.Sprite).spriteFrame = this.Diamonds_gray
            this.damonds_1_Receive = false
            this.Diamonds_2.node.getChildByName("Diamonds_light").active = false
            this.Diamonds_2.node.getComponent(cc.Sprite).spriteFrame = this.Diamonds_gray
            this.damonds_2_Receive = false
            this.Diamonds_3.node.getChildByName("Diamonds_light").active = false
            this.Diamonds_3.node.getComponent(cc.Sprite).spriteFrame = this.Diamonds_gray
            this.damonds_3_Receive = false
            //未到第一个开启，开启第一个计时器
            cc.director.getScheduler().unscheduleAllForTarget(this)
            this.schedule(function() {
                // 这里的 this 指向 component
                this.s_downtime();
            },1,3600,1);
           
            return
        }
    }, 
    Receive_time_prize: function(){
        var self = this
        server.send({               
                 rid:"stat_timeunit_get",  
                 subject:"STAT",          
                 cmd:"STAT_TIMEUNIT_GET",      
                 udid:gamedata.userid,      
                 req:{}            
        })
        gamedata.message_fun_map.set('stat_timeunit_get',function(data){
            var now_unit = data.data.unit+parseInt((gamedata.servertime - data.data.time)/60000)
            var d_num = 0   //钻石增加
            var l_num = 0   //抽奖次数增加
            var surplus_unit = parseInt((gamedata.servertime - data.data.time)/60000)    //剩余时间
            if(now_unit >= 180){
                //全部可领取 （钻石30 抽奖次数+3）
                d_num = 30
                l_num = 3
                surplus_unit = 1
                gamedata.showSysHint("","恭喜获得钻石+30，抽奖次数+3！")
            }else if(now_unit >= 120){
                //领取前两个
                d_num = 20
                l_num = 2
                gamedata.showSysHint("","恭喜获得钻石+20，抽奖次数+2！")
            }else if(now_unit >= 60){
                //可领取第一个
                d_num = 10
                l_num = 1
                gamedata.showSysHint("","恭喜获得钻石+10，抽奖次数+1！")
            }
            if(now_unit>180){
                server.send({               
                         rid:"stat_timeunit_save",  
                         subject:"STAT",          
                         cmd:"STAT_TIMEUNIT_SAVE",      
                         udid:gamedata.userid,      
                         req:{unit:1}            
                })
                gamedata.message_fun_map.set('stat_timeunit_save',function(data){})
            }else{
                if(surplus_unit==0){surplus_unit=1}
                server.send({               
                         rid:"stat_timeunit_save",  
                         subject:"STAT",          
                         cmd:"STAT_TIMEUNIT_SAVE",      
                         udid:gamedata.userid,      
                         req:{unit:surplus_unit}            
                })
                gamedata.message_fun_map.set('stat_timeunit_save',function(data){})
            }
            //奖励存储
            gamedata.cat_paw_coin += d_num
                self.coin_label.getComponent(cc.Label).string = gamedata.cat_paw_coin
                server.send({               
                         rid:"pay_add_coin",  
                         subject:"PAY",          
                         cmd:"PAY_ADD_COIN",      
                         udid:gamedata.userid,       
                         req:{coin:d_num}            
                })
            gamedata.message_fun_map.set('pay_add_coin',function(data){})
            self.now_luck_num.node.getComponent(cc.Label).string = self.now_luck_num.node.getComponent(cc.Label).string+l_num
            server.send({               
                rid:"common_thing_store",  
                subject:"COMMON",          
                cmd:"COMMON_THING_STORE",      
                udid:gamedata.userid,      
                req:{thing_list:[parseInt(520001),1]}            
            })
            var diff_time =  (new Date(gamedata.servertime).getTime()-new Date(data.data.time).getTime())/1000
            gamedata.message_fun_map.set('common_thing_store',function(data){})
            self.time_loadbar.progress = surplus_unit/180 
            self.time_loadbar.progress = (surplus_unit+(diff_time/60))/180 
            if((surplus_unit+(diff_time/60))/180 > 1){self.time_loadbar.progress = 1}
            self.init_dim_time(surplus_unit+parseInt((diff_time/60)))
        })
    },  
    scrollStart: function(){
        //计算当前随机数据
        var self = this
        var random_data = []
        for(var k in this.goods_conf){
            random_data.push(this.goods_conf[k].goodsid)
        }
        server.send({               
                 rid:"common_thing_list",  
                 subject:"COMMON",          
                 cmd:"COMMON_THING_LIST",      
                 udid:gamedata.userid,      
                 req:{}            
        })
        gamedata.message_fun_map.set('common_thing_list',function(data){
            // 5109 5110 5111 5112 套装id
            for(var k in data.data.thing_list){
                var date1 = new Date(data.data.thing_list[k].time).getDate()
                var date2 = new Date(gamedata.servertime).getDate()
                if(data.data.thing_list[k].tid == 5109 || data.data.thing_list[k].tid == 5110 || data.data.thing_list[k].tid == 5111 || data.data.thing_list[k].tid == 5112){
                    if(date1==date2){
                        //今天已经抽到了套装
                        var idx = random_data.indexOf(5109)
                        random_data.splice(idx,1);
                        idx = random_data.indexOf(5110)
                        random_data.splice(idx,1);
                        idx = random_data.indexOf(5111)
                        random_data.splice(idx,1);
                        idx = random_data.indexOf(5112)
                        random_data.splice(idx,1);
                        break
                    }else{
                        if(data.data.thing_list[k].tid == 5109){
                            var idx = random_data.indexOf(5109)
                            random_data.splice(idx,1);
                        }
                        if(data.data.thing_list[k].tid == 5110){
                            idx = random_data.indexOf(5110)
                            random_data.splice(idx,1);
                        }
                        if(data.data.thing_list[k].tid == 5111){
                            idx = random_data.indexOf(5111)
                        random_data.splice(idx,1);
                        }
                        if(data.data.thing_list[k].tid == 5112){
                            idx = random_data.indexOf(5112)
                            random_data.splice(idx,1);
                        }
                    }
                }
            }

            var pos_id = {5105:1,5109:2,5107:3,5110:4,5108:5,5112:6,5106:7,5111:8}
            var idx = Math.floor(Math.random() * random_data.length)
            var get_id = random_data[idx]

            cc.log("get_id== " + get_id)

            var act1_time = 0.0005
            var delaytime_1 = 0.15
            var act2_time = 0.0025
            var delaytime_2 = 0.15
            var act3_time = 0.0025
            var delaytime_3 = 0.16
            var act4_time = 0.005
            var delaytime_4 = 0.18
            var act5_time = 0.02
            var delaytime_5 = 0.25
            var act5 = null
            if(get_id==5105){
                act5 = cc.delayTime(0.5)
            }else if(get_id==5109){
                act5 = cc.sequence(cc.moveTo(act5_time,gamedata.Luck_draw_pos[0]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[1]))
            }else if(get_id==5107){
                act5 = cc.sequence(cc.moveTo(act5_time,gamedata.Luck_draw_pos[0]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[1]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[2]))
            }else if(get_id==5110){
                act5 = cc.sequence(cc.moveTo(act5_time,gamedata.Luck_draw_pos[0]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[1]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[2]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[3]))
            }else if(get_id==5108){
                act5 = cc.sequence(cc.moveTo(act5_time,gamedata.Luck_draw_pos[0]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[1]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[2]),
                    cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[3]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[4]))
            }else if(get_id==5112){
                act5 = cc.sequence(cc.moveTo(act5_time,gamedata.Luck_draw_pos[0]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[1]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[2]),
                    cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[3]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[4]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[5]))
            }else if(get_id==5106){
                act5 = cc.sequence(cc.moveTo(act5_time,gamedata.Luck_draw_pos[0]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[1]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[2]),
                    cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[3]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[4]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[5]),
                    cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[6]))
            }else if(get_id==5111){
                act5 = cc.sequence(cc.moveTo(act5_time,gamedata.Luck_draw_pos[0]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[1]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[2]),
                cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[3]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[4]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[5]),
                cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[6]),cc.delayTime(delaytime_5),cc.moveTo(act5_time,gamedata.Luck_draw_pos[7]))
            }
            var act1 = cc.sequence(cc.moveTo(act1_time,gamedata.Luck_draw_pos[0]),cc.delayTime(delaytime_1),cc.moveTo(act1_time,gamedata.Luck_draw_pos[1]),cc.delayTime(delaytime_1),cc.moveTo(act1_time,gamedata.Luck_draw_pos[2]),cc.delayTime(delaytime_1)
            ,cc.moveTo(act1_time,gamedata.Luck_draw_pos[3]),cc.delayTime(delaytime_1),cc.moveTo(act1_time,gamedata.Luck_draw_pos[4]),cc.delayTime(delaytime_1),cc.moveTo(act1_time,gamedata.Luck_draw_pos[5]),cc.delayTime(delaytime_1),cc.moveTo(act1_time,gamedata.Luck_draw_pos[6]),cc.delayTime(delaytime_1)
            ,cc.moveTo(act1_time,gamedata.Luck_draw_pos[7]),cc.delayTime(delaytime_1),cc.moveTo(act1_time,gamedata.Luck_draw_pos[0]))
            var act2 = cc.sequence(cc.moveTo(act2_time,gamedata.Luck_draw_pos[0]),cc.delayTime(delaytime_2),cc.moveTo(0.005,gamedata.Luck_draw_pos[1]),cc.delayTime(delaytime_2),cc.moveTo(act2_time,gamedata.Luck_draw_pos[2]),cc.delayTime(delaytime_2)
                ,cc.moveTo(act2_time,gamedata.Luck_draw_pos[3]),cc.delayTime(delaytime_2),cc.moveTo(act2_time,gamedata.Luck_draw_pos[4]),cc.delayTime(delaytime_2),cc.moveTo(act2_time,gamedata.Luck_draw_pos[5]),cc.delayTime(delaytime_2),cc.moveTo(act2_time,gamedata.Luck_draw_pos[6]),cc.delayTime(delaytime_2)
                ,cc.moveTo(act2_time,gamedata.Luck_draw_pos[7]),cc.delayTime(delaytime_2),cc.moveTo(act2_time,gamedata.Luck_draw_pos[0]))
            var act3 = cc.sequence(cc.moveTo(act3_time,gamedata.Luck_draw_pos[0]),cc.delayTime(delaytime_3),cc.moveTo(act3_time,gamedata.Luck_draw_pos[1]),cc.delayTime(delaytime_3),cc.moveTo(act3_time,gamedata.Luck_draw_pos[2]),cc.delayTime(delaytime_3)
                ,cc.moveTo(act3_time,gamedata.Luck_draw_pos[3]),cc.delayTime(delaytime_3),cc.moveTo(act3_time,gamedata.Luck_draw_pos[4]),cc.delayTime(delaytime_3),cc.moveTo(act3_time,gamedata.Luck_draw_pos[5]),cc.delayTime(delaytime_3),cc.moveTo(act3_time,gamedata.Luck_draw_pos[6]),cc.delayTime(delaytime_3)
                ,cc.moveTo(act3_time,gamedata.Luck_draw_pos[7]),cc.delayTime(delaytime_3),cc.moveTo(act3_time,gamedata.Luck_draw_pos[0]))     
            var act4 = cc.sequence(cc.moveTo(act4_time,gamedata.Luck_draw_pos[0]),cc.delayTime(delaytime_4),cc.moveTo(act4_time,gamedata.Luck_draw_pos[1]),cc.delayTime(delaytime_4),cc.moveTo(act4_time,gamedata.Luck_draw_pos[2]),cc.delayTime(delaytime_4)
                ,cc.moveTo(act4_time,gamedata.Luck_draw_pos[3]),cc.delayTime(delaytime_4),cc.moveTo(act4_time,gamedata.Luck_draw_pos[4]),cc.delayTime(delaytime_4),cc.moveTo(act4_time,gamedata.Luck_draw_pos[5]),cc.delayTime(delaytime_4),cc.moveTo(act4_time,gamedata.Luck_draw_pos[6]),cc.delayTime(delaytime_4)
                ,cc.moveTo(act4_time,gamedata.Luck_draw_pos[7]),cc.delayTime(delaytime_4),cc.moveTo(act4_time,gamedata.Luck_draw_pos[0]))         
            self.luck_draw_light.node.runAction(cc.sequence(act1,act2,act3,act4,act5,cc.callFunc(function(){
                self.is_luck_draw = false
                if(get_id==5105){
                    gamedata.showSysHint("","恭喜获得10钻石！")
                    gamedata.cat_paw_coin += 10
                    self.coin_label.getComponent(cc.Label).string = gamedata.cat_paw_coin
                    server.send({               
                             rid:"pay_add_coin",  
                             subject:"PAY",          
                             cmd:"PAY_ADD_COIN",      
                             udid:gamedata.userid,      
                             req:{coin:10}            
                    })
                    gamedata.message_fun_map.set('pay_add_coin',function(data){})
                }else if(get_id==5106){
                    gamedata.showSysHint("","恭喜获得50钻石！")
                    gamedata.cat_paw_coin += 50
                    self.coin_label.getComponent(cc.Label).string = gamedata.cat_paw_coin
                    server.send({               
                             rid:"pay_add_coin",  
                             subject:"PAY",          
                             cmd:"PAY_ADD_COIN",      
                             udid:gamedata.userid,      
                             req:{coin:50}            
                    })
                    gamedata.message_fun_map.set('pay_add_coin',function(data){})
                }else if(get_id==5107){
                    gamedata.showSysHint("","恭喜获得抽奖次数加1！")
                    self.now_luck_num.node.getComponent(cc.Label).string = self.now_luck_num.node.getComponent(cc.Label).string+1
                    server.send({               
                             rid:"common_thing_store",  
                             subject:"COMMON",          
                             cmd:"COMMON_THING_STORE",      
                             udid:gamedata.userid,      
                             req:{thing_list:[parseInt(520001),1]}            
                    })
                    gamedata.message_fun_map.set('common_thing_store',function(data){})
                }else if(get_id==5108){
                    gamedata.showSysHint("","恭喜获得 谢谢惠顾！")
                }else{
                      //获得物品存储
                    server.send({               
                             rid:"common_thing_store",  
                             subject:"COMMON",          
                             cmd:"COMMON_THING_STORE",      
                             udid:gamedata.userid,      
                             req:{thing_list:[parseInt(get_id),1]}            
                    })
                    gamedata.message_fun_map.set('common_thing_store',function(data){})
                    self.show_get_clothes(get_id)
                }
            })))
        })
    },
    add_frame: function(){
        var self = this
        server.send({               
                 rid:"common_thing_list",  
                 subject:"COMMON",          
                 cmd:"COMMON_THING_LIST",      
                 udid:gamedata.userid,      
                 req:{}            
        })
        gamedata.message_fun_map.set('common_thing_list',function(data){
            gamedata.load_json_data("share",function(conf){
                var conf_date = {}
                var tz_data = []
                for(var k in conf){conf_date[conf[k].itemid] = conf[k]}
                for(var k in data.data.thing_list){
                    if(data.data.thing_list[k].tid == 5109 || data.data.thing_list[k].tid == 5110 || data.data.thing_list[k].tid == 5111 || data.data.thing_list[k].tid == 5112){
                        tz_data.push(data.data.thing_list[k])
                    }
                }
                var tip_layout1 = cc.instantiate(self.black_layout);
                cc.director.getScene().getChildByName('Canvas').addChild(tip_layout1)
                tip_layout1.zIndex = 998
                tip_layout1.x = 0;tip_layout1.y=0
                tip_layout1.on(cc.Node.EventType.TOUCH_END, function (event) {})
                var tip_frame1 = cc.instantiate(self.get_prize_frame);
                tip_frame1.zIndex = 999
                tip_frame1.x = 0; tip_frame1.y = 667
                cc.director.getScene().getChildByName('Canvas').addChild(tip_frame1)
    
                tip_frame1.getChildByName('confirm').on(cc.Node.EventType.TOUCH_END, function (event) {
                    cc.director.getScene().getChildByName('Canvas').removeChild(tip_frame1)
                    cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout1)
                });
                tip_frame1.getChildByName('copy').on(cc.Node.EventType.TOUCH_END, function (event) {
                
                });
                for(var i=1;i<=4;i++){
                    var frame = tip_frame1.getChildByName("share_frame_"+i)
                    if(tz_data[i-1]){
                        frame.id = tz_data[i-1].tid
                        cc.loader.load(gamedata.share_photo_url+conf_date[frame.id].headportrait+".png"+gamedata.version_number,function(err,texture){
                            this.frame.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        }.bind({frame:frame}))
                    }
                    frame.on(cc.Node.EventType.TOUCH_END, function (event) {
                        update_ui(this.frame.id)
                    }.bind({frame:frame}));
                }
                    
                tip_frame1.getChildByName("goods_name").getComponent(cc.Label).string = self.goods_conf[tz_data[0].tid].nameitem
                cc.loader.load(gamedata.share_photo_url+conf_date[tz_data[0].tid].chart+".png"+gamedata.version_number,function(err,texture){
                    tip_frame1.getChildByName("phone_bg").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                })
                var update_ui = function(id){
                    if(id==undefined){return}
                    tip_frame1.getChildByName("goods_name").getComponent(cc.Label).string = self.goods_conf[id].nameitem
                    cc.loader.load(gamedata.share_photo_url+conf_date[id].chart+".png"+gamedata.version_number,function(err,texture){
                        tip_frame1.getChildByName("phone_bg").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                    })
                }
            })
        })
        
    },
    show_get_clothes: function(id){
        var data = this.goods_conf[id]

        var tip_layout1 = cc.instantiate(this.black_layout);
        cc.director.getScene().getChildByName('Canvas').addChild(tip_layout1)
        tip_layout1.zIndex = 998
        tip_layout1.x = 0;tip_layout1.y=0
        tip_layout1.on(cc.Node.EventType.TOUCH_END, function (event) {})
        var tip_frame1 = cc.instantiate(this.get_clothes_frame);
        tip_frame1.zIndex = 999
        tip_frame1.x = 0; tip_frame1.y = 450
        cc.director.getScene().getChildByName('Canvas').addChild(tip_frame1)

        var icon = tip_frame1.getChildByName("icon")
        tip_frame1.getChildByName("name").getComponent(cc.Label).string = data.nameitem
        tip_frame1.getChildByName("button_1").on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.director.getScene().getChildByName('Canvas').removeChild(tip_frame1)
            cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout1)
        });

        gamedata.load_json_data("share",function(conf){
            for(var k in conf){
                if(conf[k].itemid == data.goodsid){
                    cc.loader.load(gamedata.share_photo_url+conf[k].popup+".png"+gamedata.version_number,function(err,texture){
                        icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                    })
                }
            }
        })
    },
    s_downtime: function(dt){
        if(this.s_down_time_num == 0){
            this.s_down_time_num = 60

            if(this.down_time_num==0){
                if(this.down_type == 1){
                    this.init_dim_time(60)
                }else if(this.down_type == 2){
                    this.init_dim_time(120)
                }else if(this.down_type == 3){
                    this.init_dim_time(180)
                }
            }

            var node1 = null
            if(this.down_type == 1){
                node1 = this.down_time_1            
            }else if(this.down_type == 2){
                node1 = this.down_time_2    
            }else if(this.down_type == 3){
                node1 = this.down_time_3    
            }
            this.down_time_num--
            node1.getComponent(cc.Label).string = this.down_time_num+":"
        }
        var node = null
        if(this.down_type == 1){
            node = this.s_time_1            
        }else if(this.down_type == 2){
            node = this.s_time_2    
        }else if(this.down_type == 3){
            node = this.s_time_3    
        }
        node.getComponent(cc.Label).string = this.s_down_time_num
        if(this.s_down_time_num<10){node.getComponent(cc.Label).string = "0"+ this.s_down_time_num}
        this.s_down_time_num--
    },
    start () {

    },

    // update (dt) {},
});
