var gamedata = require('data');
var server = require('server'); 
cc.Class({
    extends: cc.Component,

    properties: {
        dial: {
            default: null,
            type: cc.Sprite
        },
        name_label: {
            default: null,
            type: cc.Label
        },
        dialogue: {
            default: null,
            type: cc.RichText
        },
        Hang_up: {
            default: null,
            type: cc.Sprite
        },
        choice_ly: {
            default: null,
            type: cc.Layout
        },
        goods_frame: {
            default: null,
            type: cc.Prefab
        },
        Answer_up: {
            default: null,
            type: cc.Sprite
        },
        loadbar: {
            default: null,
            type: cc.ProgressBar
        },
        phone_bg:{
            default: null,
            type: cc.Sprite
        },
        touch_ly: {
            default: null,
            type: cc.Layout
        },
        ani:{
            default: null,
            type: cc.Sprite
        },
        black_layer: {
            default: null,
            type: cc.Prefab
        },
        tip_frame: {
            default: null,
            type: cc.Prefab
        },
        baomihua:{
            default: null,
            type: cc.SpriteFrame
        },
        tiantianquan:{
            default: null,
            type: cc.SpriteFrame
        },
        xiaodangao:{
            default: null,
            type: cc.SpriteFrame
        },
        bangbangtao:{
            default: null,
            type: cc.SpriteFrame
        },
        album: {
            default: null,
            type: cc.SpriteFrame
        }
    },
    onLoad: function(){
        this.initui()

        var self = this

        this.ani.node.getComponent(cc.Animation).play('phone')
        this.ani.node.active = false
        this.phone_polt_data = []
        this.phone_voice_data = {}
        this.phone_polt_id_data = {}
        this.polt_idx = 0
        this.polt_next_id = null
        this.is_player_choice = false
        this.drop_conf = null

        this.goods_conf = {}

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
                    self.goods_conf[s_data.data.thing_list[k].tid] = s_data.data.thing_list[k]
                }
            }
        })

        cc.loader.loadRes("system_voice/dial_phone",function(err,voice){
            cc.audioEngine.play(voice,true) 
        })
        cc.loader.releaseRes("system_voice/dial_phone");
        this.album_conf = {}
        gamedata.load_json_data("album",function(aadata){
            for(var k in aadata){
                self.album_conf[aadata[k].pokedexid] = aadata[k]
            }
        })
        this.Answer_up.node.active = false

        this.is_stop_schedule = false
        self.Hang_up.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(!self.Answer_up.node.active){var tip_layout = cc.instantiate(self.black_layer);
                cc.director.getScene().getChildByName('Canvas').addChild(tip_layout)
                tip_layout.x = 0;tip_layout.y=0
                tip_layout.on(cc.Node.EventType.TOUCH_END, function (event) {})
                var tip_frame = cc.instantiate(self.tip_frame);
                tip_frame.zIndex = 999
                cc.director.getScene().getChildByName('Canvas').addChild(tip_frame)
                tip_frame.getChildByName("content").getComponent(cc.RichText).string = "是否退出通话！"
                tip_frame.getChildByName("xiao_hao").active = false
                tip_frame.getChildByName("confirm").on(cc.Node.EventType.TOUCH_END, function (event) {
                    cc.director.loadScene("Phone_Card");
                })
    
                tip_frame.getChildByName("cancel").on(cc.Node.EventType.TOUCH_END, function (event) {
                    cc.director.getScene().getChildByName('Canvas').removeChild(tip_frame)
                    cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout)
                })
            }else if(self.polt_next_id == -1){
                cc.director.loadScene("Phone_Card");
            }else{
                cc.director.loadScene("Phone_Card");
            }
            cc.audioEngine.stopAll()
        });
        self.touch_ly.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(self.is_stop_schedule){
                cc.director.getScheduler().resumeTarget(self)
                self.is_stop_schedule = false
            }
        });
        cc.loader.load(gamedata.phone_photo_url+gamedata.phone_polt_id+".png"+gamedata.version_number,function(err,texture){
            self.phone_bg.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            self.phone_bg.node.width = 750;
            self.phone_bg.node.height = 1334
        })
        
        self.Answer_up.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(self.loadbar.getComponent(cc.ProgressBar).progress == 1){
                //全部语音文件加载完成
                cc.loader.loadRes("system_voice/answer_phone",function(err,voice){
                    cc.audioEngine.play(voice) 
                })
                cc.loader.releaseRes("system_voice/answer_phone");
                cc.audioEngine.stopAll()
                self.Hang_up.node.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
                    self.dial.node.active = false
                    self.dialogue.node.active = true
                    self.Answer_up.node.active = false
                    self.loadbar.node.active = false
                    self.Hang_up.node.x = 0
                    self.schedule(function() {
                        // 这里的 this 指向 component
                        self.update_list();
                    }, 0.5, cc.macro.REPEAT_FOREVER,0);
                   
                    //发送消耗物品请求
                    server.send({               
                        rid:"stat_phonecard_use",  
                        subject:"STAT",          
                        cmd:"STAT_PHONECARD_USE",      
                        udid:gamedata.userid,      
                        req:{card_list:[parseInt(gamedata.phone_polt_id)]}            
                    })
                    gamedata.message_fun_map.set('stat_phonecard_use',function(data,code){
                        
                    })
               })))
            }
        });
        gamedata.load_json_data("phone",function(data){
            gamedata.load_json_data("content",function(c_data){
                var id = null
                var d_id = null
                for(var k in data){
                    d_id = data[k].consume.split(",")
                    if(d_id[0] == gamedata.phone_polt_id){
                        id = data[k].content
                        self.drop_conf = data[k]
                    }
                }
                for(var k in c_data){
                    if(c_data[k].linkid == id){
                        self.phone_polt_data.push(c_data[k])
                        self.phone_polt_id_data[c_data[k].contentid] = c_data[k]
                    }
                }
                self.load_res()
            })
        })
    },
    load_res: function(){
        if(this.drop_conf.drop){
            var drop_data = this.drop_conf.drop.split(',')
            server.send({               
                     rid:"common_thing_store",          
                     subject:"COMMON",          
                     cmd:"COMMON_THING_STORE",      
                     udid:gamedata.userid,      
                     req:{thing_list:[parseInt(drop_data[0]),parseInt(drop_data[1])]}            
            })
            gamedata.message_fun_map.set('common_thing_store',function(data){
                
            })

            //获得图鉴
            server.send({               
                     rid:"stat_pokedex_save",          
                     subject:"STAT",          
                     cmd:"STAT_POKEDEX_SAVE",      
                     udid:gamedata.userid,      
                     req:{pokedex_list:[parseInt(this.drop_conf.unlock)]}            
            })
            gamedata.message_fun_map.set('stat_pokedex_save',function(data){
                
            })
            //存储图鉴（用于判定是否有新图鉴）
            server.send({               
                rid:"common_thing_store",          
                subject:"COMMON",          
                cmd:"COMMON_THING_STORE",      
                udid:gamedata.userid,      
                req:{thing_list:[6600005,parseInt(this.album_conf[this.drop_conf.unlock].role)]}            
            })
            gamedata.message_fun_map.set('common_thing_store',function(data){
                    
            })
        }
        var self = this
        var polt_voice_load = []
        var voice_num = 0
        for(var k in this.phone_polt_data){
            if(this.phone_polt_data[k].voice){
                polt_voice_load.push(this.phone_polt_data[k].voice)
            }
        }
        //去除重复ID
        var result = [], hash = {};
        for (var i = 0, elem; (elem = polt_voice_load[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        if(result.length == 0){
            //没有语音文件
            this.Hang_up.node.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
                self.Answer_up.node.active = true
                self.loadbar.getComponent(cc.ProgressBar).progress = 1 
            })))
        }else{
            for(var s in result){
                cc.loader.load(gamedata.telephone_voice_url+result[s]+".mp3"+gamedata.version_number,function(err,audio){
                    self.phone_voice_data[result[this.s]] = audio
                    voice_num++
                    self.loadbar.getComponent(cc.ProgressBar).progress = voice_num/result.length
                    if(self.loadbar.getComponent(cc.ProgressBar).progress == 1){
                        self.Answer_up.node.active = true
                    }
                }.bind({s:s}))
            }
        }
    },  
    initui: function(){
        var self = this
        this.dialogue.node.active = false
        this.choice_ly.node.active = false
        gamedata.load_json_data("role",function(rdata){
            for(var k in rdata){
                if(rdata[k].user_id == gamedata.user_choice_id){
                    self.name_label.string = rdata[k].name
                }
            }
        })
    },
    update_list: function(dt){
        var self = this
        var list_data = null
        var d_arr = []
        if(this.polt_idx==0){
            list_data = this.phone_polt_data[0]
        }else{
            if(this.polt_next_id == -1){
                this.is_player_choice = null
                cc.director.getScheduler().pauseTarget(this)
                cc.director.getScheduler().unscheduleAllForTarget(this)

                var lo_id = this.drop_conf.consume.split(',')[0]
                if(self.goods_conf[lo_id]){
                    var tip_layout = cc.instantiate(self.black_layer);
                    cc.director.getScene().getChildByName('Canvas').addChild(tip_layout)
                    tip_layout.x = 0;tip_layout.y=0
                    tip_layout.on(cc.Node.EventType.TOUCH_END, function (event) {})
                    var tip_frame = cc.instantiate(self.tip_frame);
                    tip_frame.zIndex = 999
                    cc.director.getScene().getChildByName('Canvas').addChild(tip_frame)
                    tip_frame.getChildByName("content").getComponent(cc.RichText).string = "通话结束！"
                    tip_frame.getChildByName("xiao_hao").active = false
                    tip_frame.getChildByName("confirm").x=0
                    tip_frame.getChildByName("confirm").on(cc.Node.EventType.TOUCH_END, function (event) {
                        cc.director.loadScene("Phone_Card");
                    })
                    tip_layout.on(cc.Node.EventType.TOUCH_END, function (event) {})
                    tip_frame.getChildByName("cancel").active = false
                }else{
                    server.send({               
                             rid:"common_thing_store",          
                             subject:"COMMON",          
                             cmd:"COMMON_THING_STORE",      
                             udid:gamedata.userid,      
                             req:{thing_list:[parseInt(lo_id),1]}            
                    })
                    gamedata.message_fun_map.set('common_thing_store',function(data){})
                    //掉落
                    if(this.drop_conf.drop){
                        var drop_data = this.drop_conf.drop.split(',')
                        var goods_frame = cc.instantiate(this.goods_frame);
                        goods_frame.zIndex = 999
                        cc.director.getScene().getChildByName('Canvas').addChild(goods_frame)
                        goods_frame.getChildByName("confirm").on(cc.Node.EventType.TOUCH_END, function (event) {
                            cc.director.getScene().getChildByName('Canvas').removeChild(goods_frame)
                            cc.director.loadScene("Phone_Card")
                        })
                        var spr_1 = goods_frame.getChildByName("goods_1")
                        if(parseInt(drop_data[0])==5101){spr_1.getComponent(cc.Sprite).spriteFrame = this.xiaodangao}else if(parseInt(drop_data[0])==5102){
                            spr_1.getComponent(cc.Sprite).spriteFrame = this.baomihua}else if(parseInt(drop_data[0])==5103){spr_1.getComponent(cc.Sprite).spriteFrame = this.tiantianquan}else
                            if(parseInt(drop_data[0])==5104){spr_1.getComponent(cc.Sprite).spriteFrame = this.bangbangtao}
                        goods_frame.getChildByName("num_1").getComponent(cc.Label).string = "X"+drop_data[1]
                        if(this.drop_conf.unlock != ""){
                            goods_frame.getChildByName("num_2").getComponent(cc.Label).string = "x1"
                            goods_frame.getChildByName("goods_2").getComponent(cc.Sprite).spriteFrame = this.album
                        }
                    }else{
                        var tip_layout = cc.instantiate(self.black_layer);
                        cc.director.getScene().getChildByName('Canvas').addChild(tip_layout)
                        tip_layout.x = 0;tip_layout.y=0
                        tip_layout.on(cc.Node.EventType.TOUCH_END, function (event) {})
                        var tip_frame = cc.instantiate(self.tip_frame);
                        tip_frame.zIndex = 999
                        cc.director.getScene().getChildByName('Canvas').addChild(tip_frame)
                        tip_frame.getChildByName("content").getComponent(cc.RichText).string = "通话结束！"
                        tip_frame.getChildByName("xiao_hao").active = false
                        tip_frame.getChildByName("confirm").x=0
                        tip_frame.getChildByName("confirm").on(cc.Node.EventType.TOUCH_END, function (event) {
                            cc.director.loadScene("Phone_Card");
                        })
                        tip_layout.on(cc.Node.EventType.TOUCH_END, function (event) {})
                        tip_frame.getChildByName("cancel").active = false
                    }
                }
                return
            }
            if(gamedata.get_str_lenght(this.polt_next_id) > 12){
                var id_data = this.polt_next_id.split(",")
                for(var k in id_data){d_arr.push(this.phone_polt_id_data[id_data[k]])}
                this.is_player_choice = true
            }else{
                list_data = this.phone_polt_id_data[this.polt_next_id]
                if(list_data.unlock != ""){
                    //获得图鉴
                    server.send({               
                             rid:"stat_pokedex_save",          
                             subject:"STAT",          
                             cmd:"STAT_POKEDEX_SAVE",      
                             udid:gamedata.userid,      
                             req:{pokedex_list:[parseInt(list_data.unlock)]}            
                    })
                    gamedata.message_fun_map.set('stat_pokedex_save',function(data){
                        
                    })
    
                    //存储图鉴（用于判定是否有新图鉴）
                    server.send({               
                        rid:"common_thing_store",          
                        subject:"COMMON",          
                        cmd:"COMMON_THING_STORE",      
                        udid:gamedata.userid,      
                        req:{thing_list:[6600005,parseInt(this.album_conf[list_data.unlock].role)]}            
                    })
                    gamedata.message_fun_map.set('common_thing_store',function(data){
                            
                    })
                }
            }
        }
        if(this.is_player_choice == null){

        }else if(!this.is_player_choice){
            this.dialogue.string = list_data.content
            this.ani.node.active = true
            if(list_data.voice){
                cc.audioEngine.play(this.phone_voice_data[list_data.voice])
            }
            this.polt_next_id =  list_data.nextid
            this.polt_idx++
        }else{
            cc.director.getScheduler().pauseTarget(this)
            this.choice_ly.node.active =true
            this.dialogue.node.active = false
            this.ani.node.active = false
            this.show_choice_frame(d_arr,function(data){
                self.ani.node.active = true
                self.choice_ly.node.active =false
                self.dialogue.node.active = true
                self.dialogue.string = data.content
                if(data.voice){
                    cc.audioEngine.play(self.phone_voice_data[data.voice])
                }
                self.polt_next_id =  data.nextid
                self.polt_idx++
                self.is_player_choice = false
                self.dialogue.node.runAction(cc.delayTime(1),cc.callFunc(function(){
                    cc.director.getScheduler().resumeTarget(self)
                }))
            })
        }
        this.is_stop_schedule = true
        cc.director.getScheduler().pauseTarget(this)
    },
    show_choice_frame: function(data,fun){
        //显示玩家选择
        var self = this
        data.reverse()
        var n_arr = []
        for(var i=0;i<3;i++){
            var c_di = this.choice_ly.node.getChildByName("option_frame_"+parseInt(i))
            var content = c_di.getChildByName("content_"+parseInt(i))
            n_arr.push(c_di)
            if(data[i]){
                content.getComponent(cc.RichText).string = data[i].content
            }else{
                content.active = false
                c_di.active = false
            }
        }
        n_arr[0].off(cc.Node.EventType.TOUCH_END, tou1, c_di[0]);
        n_arr[1].off(cc.Node.EventType.TOUCH_END, tou2, c_di[1]);
        n_arr[2].off(cc.Node.EventType.TOUCH_END, tou3, c_di[2]);
        var tou1 = n_arr[0].on(cc.Node.EventType.TOUCH_END, function (event) {
            fun&&fun(data[0])
        });
        var tou2 = n_arr[1].on(cc.Node.EventType.TOUCH_END, function (event) {
            fun&&fun(data[1])
        });
        var tou3 = n_arr[2].on(cc.Node.EventType.TOUCH_END, function (event) {
            fun&&fun(data[2])
        });

    },
    start () {

    },
    // update (dt) {},
});
