var gamedata = require('data');
var server = require('server')
cc.Class({
    extends: cc.Component,

    properties: {
        listPrefab: {
            default: null,
            type: cc.Prefab
        },
        photoPrefab: {
            default: null,
            type: cc.Prefab
        },
        scale_bg: {
            default: null,
            type: cc.Prefab
        },
        scrollview: {
            default: null,
            type: cc.Node
        },
        set_sc_buttom: {
            default: null,
            type: cc.ScrollView
        },
        title_name:{
            default: null,
            type: cc.Label
        },
        back:{
            default: null,
            type: cc.Button
        },
        bg_img: {
            default: null,
            type: cc.Sprite
        },
        fast_button: {
            default: null,
            type: cc.Button
        },
        slow_button: {
            default: null,
            type: cc.Button
        },
        close_button: {
            default: null,
            type: cc.Sprite
        },
        user_choice_frame: {
            default: null,
            type: cc.Layout
        },
        Tip_frame: {
            default: null,
            type: cc.Prefab
        },
        goods_frame: {
            default: null,
            type: cc.Prefab
        },
        move_sclist:{
            default: null,
            type: cc.Node
        },
        player_choice_btn:{
            default: null,
            type: cc.Sprite
        },
        test_tip: {
            default: null,
            type: cc.SpriteFrame
        },
        background: {
            default: null,
            type: cc.Sprite
        },
        black_layer: {
            default: null,
            type: cc.Prefab
        },
        white_layer: {
            default: null,
            type: cc.Prefab
        },
        test_add_speed: {
            default: null,
            type: cc.Button
        },
        stop_paly_btn: {
            default: null,
            type: cc.Sprite
        },
        play_frame: {
            default: null,
            type: cc.Sprite
        },
        stop_frame: {
            default: null,
            type: cc.Sprite
        },
        choice_frame: {
            default: null,
            type: cc.Sprite
        },
        albun_icon_sprf:{
            default: null,
            type: cc.SpriteFrame
        },
        tiantianquan: {
            default: null,
            type: cc.SpriteFrame
        },
        baomihua:{
            default: null,
            type: cc.SpriteFrame
        },
        bangbangtao:{
            default: null,
            type: cc.SpriteFrame
        },
        xiaodangao:{
            default: null,
            type: cc.SpriteFrame
        }
    },
    onLoad () {
        this.schedule(function() {
            gamedata.heart_server();
        },100,cc.macro.REPEAT_FOREVER,0);
        this.test_add_speed.node.active = false
        var self = this
        this.audioId = null

        //cc.audioEngine.pause(0)
        if(gamedata.chat_room_backgroundmusic_id){
            gamedata.load_vioce(gamedata.chat_room_backgroundmusic_id,function(audio){
                //self.audioId = cc.audioEngine.play(audio,true,1)    
            })
        }

        this.content_conf = []    //聊天内容配置（玩家不参与）
        this.join_content_conf = []     //聊天内容配置（玩家参与）
        this.item_index = 0     //当前聊天进度
        this.list_height = 0  //list位置（开始Y位置）
        this.scrollview_height = 0
        this.role_data = {}     //角色对象
        this.id_conf = {}
        this.replay_polt_id = 0     //  重播剧情id
        this.polt_voice_load = {}   //剧情音效预加载

        this.next_id_content = null

        this.user_choice_frame.node.active = false
        this.is_player_choice = false

        this.replay_polt_id_arr = null  //重播剧情id
        this.storage_replay_polt_palyer_data = []    //重播剧情玩家选择数据

        this.letter_replay_polt_data = []   //私信显示数据
        this.drop_photo_data = null
       
        if(gamedata.polt_Whether_join == 2 && gamedata.chat_scene_id == 1){
           // 重播剧情获取玩家选择ID
           server.send({               
                 rid:"stat_story_user_select_get",  
                 subject:"STAT",          
                 cmd:"STAT_STORY_USER_SELECT_GET",      
                 udid:gamedata.userid,      
                 req:{sid:gamedata.chat_room_polt_id}            
            })
            gamedata.message_fun_map.set('stat_story_user_select_get',function(data){
                self.replay_polt_id_arr = data.data.talk_list
            })
        }
        if(gamedata.chat_scene_id == 1){
            gamedata.main_scene_id = 1
        }else if(gamedata.chat_scene_id == 2){
            gamedata.main_scene_id = 2
        }
        this.choice_frame.node.active = false
        this.close_button.node.active = false
        this.play_frame.node.active = false
        this.album_conf = {}

        this.plot_close_comment = null

        gamedata.load_json_data("friend_comment",function(g_data){
           self.plot_close_comment = g_data 
        })

        gamedata.load_json_data("album",function(aadata){
            
            for(var k in aadata){
                self.album_conf[aadata[k].pokedexid] = aadata[k]
            }
            gamedata.load_json_data("role",function(data){
                for(var k in data){
                    self.role_data[data[k].user_id] = data[k]
                }
                if(gamedata.chat_scene_id == 2){
                    self.title_name.getComponent(cc.Label).string = self.role_data[gamedata.user_choice_id].name
                }else{
                    self.title_name.getComponent(cc.Label).string = gamedata.chat_room_polt_title
                }
                if(gamedata.chat_scene_id == 1){
                    gamedata.load_json_data("content",function(data){
                            for(var k in data){
                                if(gamedata.polt_Whether_join == 0){
                                    if(data[k].linkid == gamedata.chat_room_polt_id && data[k].spokesman != 1){
                                        //去除玩家选择内容（阅读剧情）
                                        self.content_conf.push(data[k])
                                        self.id_conf[data[k].contentid] = data[k]
                                    }
                                }else if(gamedata.polt_Whether_join == 1 || gamedata.polt_Whether_join == 2){
                                    //参与剧情
                                    if(data[k].linkid == gamedata.chat_room_polt_id){
                                        self.join_content_conf.push(data[k])
                                        self.id_conf[data[k].contentid] = data[k]
                                    }
                                }
                            }
                           self.load_voice()
                        
                    })
                }else if(gamedata.chat_scene_id == 2){
                    //私聊配置加载
                    //join_content_conf
                    if(gamedata.chat_scene_id == 2 && gamedata.polt_Whether_join == 0){
                        server.send({               
                                 rid:"stat_story_user_select_get",  
                                 subject:"STAT",          
                                 cmd:"STAT_STORY_USER_SELECT_GET",      
                                 udid:gamedata.userid,      
                                 req:{sid:gamedata.chat_room_polt_id}            
                        })
                        gamedata.message_fun_map.set('stat_story_user_select_get',function(ssdata){
                            self.replay_polt_id_arr = ssdata.data.talk_list
                            gamedata.load_json_data("letter_content",function(data){
                                for(var k in data){
                                if(gamedata.polt_Whether_join == 1 || gamedata.polt_Whether_join == 0){
                                        //参与剧情
                                        if(data[k].linkid == gamedata.chat_room_polt_id){
                                            self.join_content_conf.push(data[k])
                                            self.id_conf[data[k].contentid] = data[k]
                                        }
                                    }
                                }
                                self.load_voice()
                            })
                        })
                    }else{
                        gamedata.load_json_data("letter_content",function(data){
                            for(var k in data){
                            if(gamedata.polt_Whether_join == 1 || gamedata.polt_Whether_join == 0){
                                    //参与剧情
                                    if(data[k].linkid == gamedata.chat_room_polt_id){
                                        self.join_content_conf.push(data[k])
                                        self.id_conf[data[k].contentid] = data[k]
                                    }
                                }
                            }
                        self.load_voice()
                        })
                    }
                }
            })
        })
        var fast = 1,slow = 1
        var update_is_stop = false

        var is_play = true
       
        self.back.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(gamedata.polt_Whether_join){

                var tip_layout = cc.instantiate(self.black_layer);
                cc.director.getScene().getChildByName('Canvas').addChild(tip_layout)
                tip_layout.x = 0;tip_layout.y=0
                tip_layout.on(cc.Node.EventType.TOUCH_END, function (event) {})

                var tip_frame = cc.instantiate(self.Tip_frame);
                tip_frame.zIndex = 999
                cc.director.getScene().getChildByName('Canvas').addChild(tip_frame)
                if(cc.director.getScheduler().isTargetPaused(self)){
                    update_is_stop = true
                }else{
                    cc.director.getScheduler().pauseTarget(self)
                }
                tip_frame.getChildByName("xiao_hao").active = false
    
                var lab = tip_frame.getChildByName("content").getComponent(cc.RichText)
                lab.string = '退出后，剧情需要重新参与？'   
    
                tip_frame.getChildByName("confirm").on(cc.Node.EventType.TOUCH_END, function (event) {
                    cc.director.getScheduler().setTimeScale (1)
                    cc.director.getScheduler().unscheduleAllForTarget(self)
                    if(gamedata.chat_scene_id == 1){
                        cc.director.loadScene("main");
                    }else if(gamedata.chat_scene_id == 2){
                        cc.director.loadScene("Privateletter");
                    }
                    // cc.audioEngine.uncache("background_music/"+gamedata.chat_room_backgroundmusic_id+".mp3")
                    // cc.audioEngine.stop(self.audioId)
                    // cc.audioEngine.resume(0)
                })
                
                tip_frame.getChildByName("cancel").on(cc.Node.EventType.TOUCH_END, function (event) {
                    if(update_is_stop){
                    }else{
                        cc.director.getScheduler().resumeTarget(self)
                    }
                    cc.director.getScene().getChildByName('Canvas').removeChild(tip_frame)
                    cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout)
                    update_is_stop = false
                })
            }else{
                cc.director.getScheduler().unscheduleAllForTarget(self)
                if(gamedata.chat_scene_id == 1){
                    cc.director.loadScene("main");
                }else if(gamedata.chat_scene_id == 2){
                    cc.director.loadScene("Privateletter");
                }
                // cc.audioEngine.uncache("background_music/"+gamedata.chat_room_backgroundmusic_id+".mp3")
                // cc.audioEngine.stop(self.audioId)
                // cc.audioEngine.resume(0)
            }
        });
        self.stop_frame.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                self.play_frame.node.active = true  
                self.stop_frame.node.active = false
                self.choice_frame.node.active = false
                //暂停计时器
                var scheduler = cc.director.getScheduler();
                scheduler.pauseTarget(self)
               // cc.audioEngine.pause(self.audioId)
        });
        self.play_frame.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                self.play_frame.node.active = false
                self.stop_frame.node.active = true 
                self.choice_frame.node.active = false
                //恢复计时器
                var scheduler = cc.director.getScheduler();
                scheduler.resumeTarget(self)
              //  cc.audioEngine.resume(self.audioId)
        });
        self.test_add_speed.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.director.getScheduler().setTimeScale (200)
        });
        
        self.fast_button.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(fast > 2){fast=1;return}
            fast+=0.3
            cc.director.getScheduler().setTimeScale (fast)
        });
        self.slow_button.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(slow < 0.3){slow=1;return}
            slow-=0.2
            cc.director.getScheduler().setTimeScale (slow)
        });
        self.close_button.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.director.getScheduler().setTimeScale (1)
            cc.director.getScheduler().unscheduleAllForTarget(self)
            if(gamedata.chat_scene_id == 1){
                //状态改变在游戏阅读完成后  stat=1
                if(gamedata.chat_scene_id == 1 && gamedata.polt_state == 0 && gamedata.polt_Whether_join == 0){
                    if(!gamedata.is_one_pay_polt){
                        server.send({               
                            rid:"stat_story_read",  
                            subject:"STAT",          
                            cmd:"STAT_STORY_READ",      
                            udid:gamedata.userid,      
                            req:{stat_list:[parseInt(gamedata.chat_room_polt_id),1]}            
                        })
                        gamedata.message_fun_map.set('stat_story_read',function(data){
                            cc.director.loadScene("main");
                            // cc.audioEngine.uncache("background_music/"+gamedata.chat_room_backgroundmusic_id+".mp3")
                            // cc.audioEngine.stop(self.audioId)
                            // cc.audioEngine.resume(0)
                        })
                    }else{
                        cc.director.loadScene("main");
                    }
                }else{
                    cc.director.loadScene("main");
                    // cc.audioEngine.uncache("background_music/"+gamedata.chat_room_backgroundmusic_id+".mp3")
                    // cc.audioEngine.stop(self.audioId)
                    // cc.audioEngine.resume(0)
                }
            }else if(gamedata.chat_scene_id == 2){
                cc.director.loadScene("Privateletter");
                // cc.audioEngine.uncache("background_music/"+gamedata.chat_room_backgroundmusic_id+".mp3")
                // cc.audioEngine.stop(self.audioId)
                // cc.audioEngine.resume(0)
            }
        });
        self.set_sc_buttom.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(self.user_choice_frame.node.active){
                self.user_choice_frame.node.active = false
                self.move_sclist.height = 1100
                if(self.scrollview.height>1100){self.set_sc_buttom.scrollToBottom(0)}
            }
        }); 
    },
    load_voice: function(){
        var self = this
        var polt_voice_load = []
        if(gamedata.polt_Whether_join == 0){
            for(var k in this.content_conf){
                if(this.content_conf[k].voice){
                    polt_voice_load.push(this.content_conf[k].voice)
                }
            }
        }else if(gamedata.polt_Whether_join == 1 || gamedata.polt_Whether_join == 2){
            for(var k in this.join_content_conf){
                if(this.join_content_conf[k].voice){
                    polt_voice_load.push(this.join_content_conf[k].voice)
                }
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
        result.sort(function(a,b){
            return a-b
        })
        var loadnum = 0
        if(result.length == 0){
            self.initui()
            //剧情没有音效
            if(gamedata.polt_Whether_join == 0){
                if(gamedata.chat_scene_id==2){
                    //重播剧情特殊处理
                    this.choice_frame.node.active = false
                    this.close_button.node.active = true
                    this.play_frame.node.active = false
                    this.stop_frame.node.active = false
                    this.letter_updatelist()
                }else if(gamedata.chat_scene_id == 1){
                    self.schedule(function() {
                        // 这里的 this 指向 component
                        this.list_update();
                    },3.5, self.content_conf.length-1,0);
                }
            }else if(gamedata.polt_Whether_join == 1 || gamedata.polt_Whether_join == 2){
                if(gamedata.chat_scene_id==2){
                    self.schedule(function() {
                        // 这里的 this 指向 component
                        this.list_update();
                    }, 2, self.join_content_conf.length-1,0);
                }else{
                    self.schedule(function() {
                        // 这里的 this 指向 component
                        this.list_update();
                    }, 3.5, self.join_content_conf.length-1,0);
                }
            }
        }else{
            for(var s in result){
                //cc.loader.load(gamedata.chat_voice_url+result[s]+".mp3"+gamedata.version_number,function(err,audio){
                cc.loader.loadRes("voice/"+result[s]+gamedata.version_number,function(err,audio){
                    if(err){
                        cc.log("load voice error" + err)
                    }else{
                        self.polt_voice_load[result[this.s]] = audio
                        loadnum++
                        if(loadnum == result.length){
                            self.initui()
                            if(gamedata.polt_Whether_join == 0){
                                if(gamedata.chat_scene_id==2){
                                    this.choice_frame.node.active = false
                                    this.close_button.node.active = true
                                    this.play_frame.node.active = false
                                    this.stop_frame.node.active = false
                                    self.letter_updatelist()
                                    //重播剧情特殊处理
                                }else if(gamedata.chat_scene_id == 1){
                                    self.schedule(function() {
                                        // 这里的 this 指向 component
                                        this.list_update();
                                    },3.5, self.content_conf.length-1,0);
                                }
                            }else if(gamedata.polt_Whether_join == 1 || gamedata.polt_Whether_join == 2){
                                if(gamedata.chat_scene_id==2){
                                    self.schedule(function() {
                                        // 这里的 this 指向 component
                                        this.list_update();
                                    }, 2, self.join_content_conf.length-1,0);
                                }else{
                                    self.schedule(function() {
                                        // 这里的 this 指向 component
                                        this.list_update();
                                    }, 3.5, self.join_content_conf.length-1,0);
                                }
                            }
                        }
        
                    }
                   
                }.bind({s:s}))
            }
        }
        // this.initui()
        // if(gamedata.polt_Whether_join == 0){
        //     if(gamedata.chat_scene_id==2){
        //         this.choice_frame.node.active = false
        //         this.close_button.node.active = true
        //         this.play_frame.node.active = false
        //         this.stop_frame.node.active = false
        //         this.letter_updatelist()
        //         //重播剧情特殊处理
        //         this.schedule(function() {
        //             // 这里的 this 指向 component
        //             this.list_update();
        //         },2.5, self.content_conf.length-1,0);
        //     }
        // }else if(gamedata.polt_Whether_join == 1 || gamedata.polt_Whether_join == 2){
        //     this.schedule(function() {
        //         // 这里的 this 指向 component
        //         this.list_update();
        //     }, 2.5,self.join_content_conf.length-1,0);
        // }
    },
    initui: function(){
        
    },
    list_update: function(dt){
        var self = this
        var picture_list_height = 0
        var left_frame_width_fit = 0
        var left_frame_height_fit = 0

        var show_big_photo = function(node,id){
            var tip_layout = cc.instantiate(self.white_layer);
            cc.director.getScene().getChildByName('Canvas').addChild(tip_layout)
            tip_layout.x = 0;tip_layout.y=0
            var s_sp = cc.instantiate(self.scale_bg);
            s_sp.x = 0;s_sp.y = 0
            s_sp.getChildByName("album_spr").width=300;s_sp.getChildByName("album_spr").height=300
            if(id==107 || id == 108){
                s_sp.getChildByName("album_spr").width=750;s_sp.getChildByName("album_spr").height=1334
            }
            s_sp.scale = 0
            s_sp.getChildByName("album_spr").getComponent(cc.Sprite).spriteFrame = node.getComponent(cc.Sprite).spriteFrame
            cc.director.getScene().getChildByName('Canvas').addChild(s_sp)
            s_sp.runAction(cc.scaleTo(0.3,1,1))
            s_sp.on(cc.Node.EventType.TOUCH_END, function (event) {
                s_sp.runAction(cc.sequence(cc.scaleTo(0.3,0,0),cc.callFunc(function(){
                    cc.director.getScene().getChildByName('Canvas').removeChild(s_sp)
                    cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout)
                })))
            })
        }

        if(gamedata.polt_Whether_join == 0){
            var data = this.content_conf[this.item_index]
            var item = cc.instantiate(this.listPrefab);
            item.x = -375
            this.scrollview.addChild(item)
            var tip = item.getChildByName("tip")
            var tip_label = tip.getChildByName('tip_label')
        
            var icon1 = item.getChildByName("icon_left").getComponent(cc.Sprite)
            var icon2 = item.getChildByName("icon_right").getComponent(cc.Sprite)
            var name = item.getChildByName("name").getComponent(cc.Label)
            var left_frame = item.getChildByName("chat_speak_frame")
            var right_frame = item.getChildByName("me_talk_frame")
            var left_speak_lb = item.getChildByName("chat_speak_lb").getComponent(cc.RichText)
            var right_speak_lb = item.getChildByName("me_talk_lb").getComponent(cc.RichText)
            var input = item.getChildByName("input")
            var picture = item.getChildByName('picture')
            item.getChildByName('picture').active = false
            item.getChildByName("chat_speak_lb").active = false
            item.getChildByName("my_name").getComponent(cc.Label).string = gamedata.username
            item.getChildByName("my_name").active = false
            input.runAction(cc.sequence(cc.delayTime(1.0),cc.callFunc(function(){
                input.active = false
                item.getChildByName("chat_speak_lb").active = true
                left_frame.width = left_frame_width_fit
                left_frame.height = left_frame_height_fit
            })))
            if(data.voice){
                //self.choice_music_volume()
                //H5
                //cc.audioEngine.play(gamedata.chat_voice_url+data.voice+".mp3")
                
                //android
                cc.audioEngine.play(self.polt_voice_load[data.voice])
            }

            if(data.content)data.content = gamedata.get_content_string(data.content)
           
            if(data.spokesman == 0){
                item.getChildByName("icon_left").active = false
                item.getChildByName("name").active = false
                left_frame.active = false
                right_frame.active = false
                item.getChildByName("me_talk_lb").active = false
                item.getChildByName("icon_right").active = false
                item.getChildByName("chat_speak_lb").active = false
                tip.active = true
                tip_label.getComponent(cc.Label).string = data.content
                tip.y = -50
                item.height = 90
                input.active = false
            }else{
                name.string = this.role_data[data.spokesman].name
                //阅读不参与
                if(data.picture){
                    var p_data = data.picture.split(",")
                    if(p_data[1] == 0){
                        //显示图片
                        name.string = this.role_data[data.spokesman].name
                        item.getChildByName("me_talk_lb").active = false
                        right_frame.active = false
                        for(var m in item.children){
                            item.children[m].active = false
                        }
                        item.getChildByName('picture').active = true
                        cc.loader.load(gamedata.expression_photo_url+p_data[0]+".png"+gamedata.version_number,function(err,texture){
                            this.picture.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                            this.picture.width = 150;
                            this.picture.height =150
                            if(p_data[0]==107 || p_data[0]==108){
                                this.picture.width = 240;
                                this.picture.height = 427
                            }
                        }.bind({picture:picture,p_data:p_data}))
                        cc.loader.loadRes("icon/"+data.spokesman,cc.SpriteFrame,function(err,texture){
                            icon1.spriteFrame = texture
                        })
                        item.getChildByName("name").active= true
                        item.getChildByName("icon_left").active= true
                        item.height = 220
                        picture.y  = -130
                        if(p_data[0]==107 || p_data[0]==108){
                            item.height = 500
                            picture.x  = 262
                            picture.y  = -262
                        }
                        picture.on(cc.Node.EventType.TOUCH_END, function (event) {
                            show_big_photo(picture,this.p_data[0])
                        }.bind({p_data:p_data})); 
                    }else if(p_data[1] == 1){
                        this.new_info_voice()
                        //显示图片+文字
                        var photo_item = cc.instantiate(this.photoPrefab);
                        item.addChild(photo_item)
                        var p_picture = photo_item.getChildByName("picture")
                        photo_item.getChildByName("icon_right").active = false
                        cc.loader.loadRes("icon/"+data.spokesman,cc.SpriteFrame,function(err,texture){
                            photo_item.getChildByName("icon_left").getComponent(cc.Sprite).spriteFrame = texture
                        })
                        photo_item.getChildByName("name").getComponent(cc.Label).string = this.role_data[data.spokesman].name
                        cc.loader.load(gamedata.expression_photo_url+p_data[0]+".png"+gamedata.version_number,function(err,texture){
                            this.p_picture.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        }.bind({p_picture:p_picture}))

                        tip.active = false
                        right_frame.active = false
                        item.getChildByName('picture').active = false
                        item.getChildByName("me_talk_lb").active = false
                        item.getChildByName("icon_right").active = false
                        cc.loader.loadRes("icon/"+data.spokesman,cc.SpriteFrame,function(err,texture){
                            icon1.spriteFrame = texture
                        })
                        var len = gamedata.get_str_lenght(data.content)
                        if((len/14).toFixed(2) <= 1.05){
                            left_frame_width_fit = len*29.25
                            item.height = 140
                            left_frame_height_fit = 60
                            if(len <= 6){
                                left_frame_width_fit = (len+1)*29.25
                            }
                        }else{
                            left_frame_width_fit = 400
                            left_frame_height_fit = 60+(parseInt(len/14))*40
                            item.height = 140+(parseInt(len/14))*30
                        }
                        photo_item.x = 0;photo_item.y = 220
                        left_speak_lb.string = data.content
                        picture_list_height = photo_item.height
                        p_picture.on(cc.Node.EventType.TOUCH_END, function (event) {
                            show_big_photo(p_picture)
                        });
                        
                    }
                }else{
                    this.new_info_voice()
                    tip.active = false
                    right_frame.active = false
                    item.getChildByName("me_talk_lb").active = false
                    item.getChildByName("icon_right").active = false
                    cc.loader.loadRes("icon/"+data.spokesman,cc.SpriteFrame,function(err,texture){
                        icon1.spriteFrame = texture
                    })
                    var len = gamedata.get_str_lenght(data.content)
                    if((len/14).toFixed(2) <= 1.05){
                        left_frame_width_fit = len*29.25
                        item.height = 140
                        left_frame_height_fit = +60
                        if(len <= 6){
                            left_frame_width_fit = (len+1)*29.25
                        }
                    }else{
                        if((len%14)==0){
                            left_frame_height_fit = 60+(parseInt((len-1)/14))*40
                            item.height = 140+(parseInt((len-1)/14))*30
                        }else{
                            left_frame_height_fit = 60+(parseInt(len/14))*40
                            item.height = 140+(parseInt(len/14))*30
                        }
                        left_frame_width_fit = 400
                    }
                    // if(len*26 > 365){
                    //     //改变高度
                    //     left_frame.width = 400
                    //     left_frame.height = 90
                    //     item.height = 170
                    //     if(len*26 > 730){
                    //         left_frame.height = 130
                    //         item.height = 200
                    //     }
                    // }else{
                    //     left_frame.width = len*29.25
                    //     if(len <= 5){
                    //         left_frame.width = (len+1)*29.25
                    //     }
                    // }
                    left_speak_lb.string = data.content
                   
                }
            }
            item.y = this.list_height-picture_list_height
            this.list_height-= (item.height+picture_list_height)
            this.item_index++
            this.scrollview_height += Math.abs(parseInt(item.height+picture_list_height))
            this.scrollview.height = this.scrollview_height

            if(this.item_index == this.content_conf.length){
                this.choice_frame.node.active = false
                this.close_button.node.active = true
                this.play_frame.node.active = false
                this.stop_frame.node.active = false
            }
            if(this.scrollview.height > 1100){
                this.set_sc_buttom.scrollToBottom(0)
            }
            //this.set_sc_buttom.scrollToBottom(0)

        }else if(gamedata.polt_Whether_join == 1){
            //参与剧情
            if(this.item_index == 0 && this.join_content_conf[this.item_index].spokesman != 1){
                var data = this.join_content_conf[this.item_index]
            }else{
                if(this.next_id_content &&gamedata.get_str_lenght(this.next_id_content) > 8){
                    //玩家选择 
                    var c_arr = this.next_id_content.split(',')
                    var data = []
                    for(var k in c_arr){
                        if(!this.id_conf[c_arr[k]]){
                            this.polt_finish()
                            return
                        }
                        data.push(this.id_conf[c_arr[k]])
                    }
                    this.is_player_choice = true
                }else{
                    if(this.next_id_content && !this.id_conf[this.next_id_content]){
                        this.polt_finish()
                        return
                    }
                    if(!this.next_id_content){
                        var data = this.id_conf[this.join_content_conf[this.item_index].contentid]
                    }else{
                        var data = this.id_conf[this.next_id_content]
                    }
                    //玩家选择只有一条情况
                    if(data.spokesman == 1){
                        var s_data = []
                        s_data.push(data)

                        data = s_data
                        this.is_player_choice = true
                    }
                }
            }
           
            var item = cc.instantiate(this.listPrefab);
            item.x = -375
            this.scrollview.addChild(item)
            var tip = item.getChildByName("tip")
            var tip_label = tip.getChildByName('tip_label')
    
            var icon1 = item.getChildByName("icon_left").getComponent(cc.Sprite)
            var icon2 = item.getChildByName("icon_right").getComponent(cc.Sprite)
            var name = item.getChildByName("name").getComponent(cc.Label)
            var left_frame = item.getChildByName("chat_speak_frame")
            var right_frame = item.getChildByName("me_talk_frame")
            var left_speak_lb = item.getChildByName("chat_speak_lb").getComponent(cc.RichText)
            var right_speak_lb = item.getChildByName("me_talk_lb").getComponent(cc.RichText)
            var picture = item.getChildByName('picture')
            item.getChildByName('picture').active = false
            var input = item.getChildByName("input")
            item.getChildByName("chat_speak_lb").active = false
            item.getChildByName("my_name").getComponent(cc.Label).string = gamedata.username
            item.getChildByName("my_name").active = false
            input.runAction(cc.sequence(cc.delayTime(1.0),cc.callFunc(function(){
                input.active = false
                item.getChildByName("chat_speak_lb").active = true
                left_frame.width = left_frame_width_fit
                left_frame.height = left_frame_height_fit
            })))
            if(data.voice){
                //H5
                //cc.audioEngine.play(gamedata.chat_voice_url+data.voice+".mp3")
                //self.choice_music_volume()
                //android
                cc.audioEngine.play(self.polt_voice_load[data.voice])
            }
            
            if(data.spokesman == 0){
                item.getChildByName("icon_left").active = false
                item.getChildByName("name").active = false
                left_frame.active = false
                right_frame.active = false
                item.getChildByName("me_talk_lb").active = false
                item.getChildByName("icon_right").active = false
                item.getChildByName("chat_speak_lb").active = false
                tip.active = true
                if(this.next_id_content){
                    tip_label.getComponent(cc.Label).string = this.id_conf[this.next_id_content].content
                }else{
                    tip_label.getComponent(cc.Label).string = data.content
                }
                cc.loader.loadRes("png/tip_frame",cc.SpriteFrame,function(err,texture){
                    tip.getComponent(cc.Sprite).spriteFrame = texture
                })
                item.height = 90
                tip.y=-50
                input.active = false
                this.next_id_content = data.nextid
            }else if(data.spokesman==9999){
                this.new_info_voice()
                item.getChildByName("icon_left").active = false
                item.getChildByName("name").active = false
                input.active = false
                tip.active = false
                item.getChildByName("chat_speak_lb").active = false

                item.getChildByName("me_talk_lb").active = true
                item.getChildByName("me_talk_lb").getComponent(cc.RichText).string = data.content
                right_frame.active = true
                left_frame.active = false
            }else{
                tip.active = false
                if(this.is_player_choice){
                    self.play_frame.node.active = false
                    self.stop_frame.node.active = false
                    self.choice_frame.node.active = true
                    input.active = false
                    
                    var ani = self.player_choice_btn.getComponent(cc.Animation)
                    ani.play('choice_frame')
                   
                    cc.director.getScheduler().pauseTarget(this)
                     //出来玩家选项为1的情况
                    left_frame.active = false
                    right_frame.active = false
                    item.getChildByName("icon_right").active = false
                    item.getChildByName("chat_speak_lb").active = false
                    item.getChildByName("name").active = false
                    self.choice_frame.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                        //玩家发言、
                        if(self.scrollview.height<1100){
                            self.move_sclist.height = 1100
                        }else{
                            self.move_sclist.height = 820
                            self.set_sc_buttom.scrollToBottom(0)
                        }
                        self.user_choice_frame.node.active = true
                    });
                    
                    if(self.scrollview.height<1100){
                        self.move_sclist.height = 1100
                    }else{
                        self.move_sclist.height = 820
                        self.set_sc_buttom.scrollToBottom(0)
                    }
                    self.user_choice_frame.node.active = true
                    
                    var framearr= []

                    for(var i=1;i<=3;i++){
                        var frame = self.user_choice_frame.node.getChildByName('ts_head_'+i)
                        framearr.push(frame)
                    }
                    framearr[0].off(cc.Node.EventType.TOUCH_END, tou, framearr[0]);
                    framearr[1].off(cc.Node.EventType.TOUCH_END, tou, framearr[1]);
                    framearr[2].off(cc.Node.EventType.TOUCH_END, tou, framearr[2]);
                    //玩家加入图片，表情，语音处理
                    var add_p_e_v = function(data){
                        name.string = gamedata.username
                        
                        self.move_sclist.height = 1100
                        input.active = false
                        var len = gamedata.get_str_lenght(data.content)
                        if((len/14).toFixed(2) <= 1.05){
                            right_frame.width = len*29
                            item.height = 140
                            right_frame.height = 60
                            item.getChildByName("me_talk_lb").getComponent(cc.RichText).maxWidth = len*26
                            if(len <= 6){ 
                                right_frame.width = (len+1)*29
                                item.getChildByName("me_talk_lb").getComponent(cc.RichText).maxWidth = (len+1)*26
                                if(len <= 3){
                                    item.getChildByName("me_talk_lb").getComponent(cc.RichText).maxWidth = (len+0.7)*26
                                }
                            }
                        }else{
                            if((len%14)==0){
                                right_frame.height = 60+(parseInt((len-1)/14))*40
                                item.height = 140+(parseInt((len-1)/14))*30
                            }else{
                                right_frame.height = 60+(parseInt(len/14))*40
                                item.height = 140+(parseInt(len/14))*30
                            }
                            right_frame.width = 400
                        }
                        if(data.picture){
                            var p_data = data.picture.split(",")
                            if(p_data[1] == 0){
                                //显示图片
                                for(var m in item.children){
                                    item.children[m].active = false
                                }
                                item.getChildByName("name").active= true
                                item.getChildByName('picture').active = true
                                item.getChildByName('picture').x =510
                                cc.loader.load(gamedata.expression_photo_url+p_data[0]+".png"+gamedata.version_number,function(err,texture){
                                    this.picture.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                                    this.picture.width = 150;
                                    this.picture.height =150
                                    if(this.p_data[0]==107 || this.p_data[0]==108){
                                        this.picture.width = 240;
                                        this.picture.height =427
                                    }
                                }.bind({picture:picture,p_data:p_data}))
                                item.getChildByName("icon_right").active = true
                                item.getChildByName("my_name").active = true
                                item.height = 220
                                picture.y  = -130
                                if(p_data[0]==107 || p_data[0]==108){
                                    item.height = 500
                                    picture.x  = 262
                                    picture.y  = -262
                                }
                                picture.on(cc.Node.EventType.TOUCH_END, function (event) {
                                    show_big_photo(picture,this.p_data[0])
                                }.bind({p_data:p_data}));
                                
                            }else if(p_data[1] == 1){
                                self.new_info_voice()
                                //显示图片+文字
                                var photo_item = cc.instantiate(self.photoPrefab);
                                photo_item.height = 220
                                item.addChild(photo_item)
                                var p_picture = photo_item.getChildByName("picture")
                                p_picture.x = 510
                                photo_item.getChildByName("icon_left").active = false
                                photo_item.getChildByName("name").active = true
                                cc.loader.loadRes("icon/"+data.spokesman,cc.SpriteFrame,function(err,texture){
                                    //photo_item.getChildByName("icon_left").getComponent(cc.Sprite).spriteFrame = texture
                                })
                                //photo_item.getChildByName("name").string = self.role_data[data.spokesman].name
                                cc.loader.load(gamedata.expression_photo_url+p_data[0]+".png"+gamedata.version_number,function(err,texture){
                                    this.p_picture.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                                }.bind({p_picture:p_picture}))

                                tip.active = false
                                item.getChildByName('picture').active = false
                                item.getChildByName("me_talk_lb").active = true
                                item.getChildByName("icon_right").active = true
                                item.getChildByName("my_name").active = true
                                item.getChildByName("me_talk_frame").active = true
                                cc.loader.loadRes("icon/"+data.spokesman,cc.SpriteFrame,function(err,texture){
                                    //icon1.spriteFrame = texture
                                })

                                var len = gamedata.get_str_lenght(data.content)
                                if((len/14).toFixed(2) <= 1.05){
                                    right_frame.width = len*29
                                    item.height = 140
                                    right_frame.height = 60
                                    if(len <= 6){
                                        right_frame.width = (len+1)*29
                                        item.getChildByName("me_talk_lb").getComponent(cc.RichText).maxWidth = (len+1)*26
                                        if(len <= 3){
                                            item.getChildByName("me_talk_lb").getComponent(cc.RichText).maxWidth = (len+0.7)*26
                                        }
                                    }
                                }else{
                                    if((len%14)==0){
                                        right_frame.height = 60+(parseInt((len-1)/14))*40
                                        item.height = 140+(parseInt((len-1)/14))*30
                                    }else{
                                        right_frame.height = 60+(parseInt(len/14))*40
                                        item.height = 140+(parseInt(len/14))*30
                                    }
                                    right_frame.width = 400
                                }
                                photo_item.x = 0;photo_item.y = 220
                                left_speak_lb.string = data.content
                                picture_list_height = photo_item.height

                                p_picture.on(cc.Node.EventType.TOUCH_END, function (event) {
                                    show_big_photo(p_picture)
                                });
                            }
                        }else{
                            right_frame.active = true
                            item.getChildByName("me_talk_lb").active = true
                            item.getChildByName("icon_right").active = true
                            item.getChildByName("my_name").active = true
                            self.new_info_voice()
                        }
                        if(data.unlock){
                            //解锁图鉴
                            gamedata.showSysHint("","X1",self.test_tip)
                            self.drop_photo_data = data
                        }
                        self.play_frame.node.active = false
                        self.stop_frame.node.active = true
                        self.choice_frame.node.active = false
                        ani.stop('choice_frame')
                        //玩家选择后恢复数据
                        self.is_player_choice = false
                        if(gamedata.chat_scene_id == 2){item.getChildByName("my_name").active = false}
                       
                        self.storage_replay_polt_palyer_data.push(parseInt(data.contentid))
                        
                        self.next_id_content = data.nextid
                        item.y = self.list_height-picture_list_height
                        self.list_height-= (item.height+picture_list_height)
                        self.scrollview_height += Math.abs(parseInt(item.height+picture_list_height))
                        self.scrollview.height = self.scrollview_height
                        if(self.scrollview.height > 1100){
                            self.set_sc_buttom.scrollToBottom(0)
                        }
                        self.item_index++
                    }
                    framearr[0].y=329;framearr[1].y=205;framearr[2].y=78; 
                    for(var k0 in framearr){
                        if(data.length==3){
                            for(var k in framearr){
                                framearr[k].active = true
                                framearr[k].getChildByName('content').getComponent(cc.RichText).string = data[k].content
                            }
                        }else if(data.length==2){
                            framearr[0].active = true
                            framearr[0].getChildByName('content').getComponent(cc.RichText).string = data[0].content
                            framearr[0].y=300; 
                            framearr[2].active = true
                            framearr[2].getChildByName('content').getComponent(cc.RichText).string = data[1].content
                            framearr[2].y=108; 
                            framearr[1].active = false
                        }else if(data.length == 1){
                            framearr[0].active = false
                            framearr[2].active = false
                            framearr[1].active = true
                            framearr[1].getChildByName('content').getComponent(cc.RichText).string = data[0].content
                        }
                        var tou = framearr[k0].on(cc.Node.EventType.TOUCH_END, function (event) {
                            var id = 0
                            if(data.length==3){id=this.j}else if(data.length==2){if(this.j==2){id=1}}
                            if(this.j==0){id=0}
                            add_p_e_v(data[id])
                            self.user_choice_frame.node.active = false
                            item.getChildByName("me_talk_lb").getComponent(cc.RichText).string = data[id].content
                            cc.director.getScheduler().resumeTarget(self)
                        }.bind({j:k0}));
                    }
                }else{
                    if(data.content)data.content = gamedata.get_content_string(data.content)
                    name.string = this.role_data[data.spokesman].name
                    if(data.picture){
                        var p_data = data.picture.split(",")
                        if(p_data[1] == 0){
                            //显示图片
                            for(var m in item.children){
                                item.children[m].active = false
                            }
                            item.getChildByName("name").string = this.role_data[data.spokesman].name
                            item.getChildByName('picture').active = true
                            item.getChildByName("name").active= true
                            cc.loader.load(gamedata.expression_photo_url+p_data[0]+".png"+gamedata.version_number,function(err,texture){
                                this.picture.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                                this.picture.width = 150;
                                this.picture.height =150
                                if(this.p_data[0]==107 || this.p_data[0]==108){
                                    this.picture.width = 240;
                                    this.picture.height =427
                                }
                            }.bind({picture:picture,p_data:p_data}))
                            item.getChildByName("icon_left").active= true
                            cc.loader.loadRes("icon/"+data.spokesman,cc.SpriteFrame,function(err,texture){
                                icon1.spriteFrame = texture
                            })
                            item.height = 220
                            picture.y  = -130
                            if(p_data[0]==107 || p_data[0]==108){
                                item.height = 500
                                picture.x  = 262
                                picture.y  = -262
                            }
                            picture.on(cc.Node.EventType.TOUCH_END, function (event) {
                                show_big_photo(picture,this.p_data[0])
                            }.bind({p_data:p_data}));
                        }else if(p_data[1] == 1){
                            this.new_info_voice()
                            //显示图片+文字
                            var photo_item = cc.instantiate(this.photoPrefab);
                            item.addChild(photo_item)
                            var p_picture = photo_item.getChildByName("picture")
                            photo_item.getChildByName("icon_right").active = false
                            cc.loader.loadRes("icon/"+data.spokesman,cc.SpriteFrame,function(err,texture){
                                photo_item.getChildByName("icon_left").getComponent(cc.Sprite).spriteFrame = texture
                            })
                            photo_item.getChildByName("name").getComponent(cc.Label).string = this.role_data[data.spokesman].name
                            cc.loader.load(gamedata.expression_photo_url+p_data[0]+".png"+gamedata.version_number,function(err,texture){
                                this.p_picture.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                            }.bind({p_picture:p_picture}))
    
                            tip.active = false
                            right_frame.active = false
                            item.getChildByName('picture').active = false
                            item.getChildByName("me_talk_lb").active = false
                            item.getChildByName("icon_right").active = false
                            cc.loader.loadRes("icon/"+data.spokesman,cc.SpriteFrame,function(err,texture){
                                icon1.spriteFrame = texture
                            })
                            var len = gamedata.get_str_lenght(data.content)
                            if((len/14).toFixed(2) <= 1.05){
                                left_frame_width_fit = len*29.25
                                item.height = 140
                                left_frame_height_fit = 60
                                if(len <= 6){
                                    left_frame_width_fit = (len+1)*29.25
                                }
                            }else{
                                left_frame_width_fit = 400
                                left_frame_height_fit = 60+(parseInt(len/14))*40
                                item.height = 140+(parseInt(len/14))*30
                            }
                            photo_item.x = 0;photo_item.y = 220
                            left_speak_lb.string = data.content
                            picture_list_height = photo_item.height
                            p_picture.on(cc.Node.EventType.TOUCH_END, function (event) {
                                show_big_photo(p_picture)
                            });
                        }
                    }else{
                        this.new_info_voice()
                        right_frame.active = false
                        item.getChildByName("me_talk_lb").active = false
                        item.getChildByName("icon_right").active = false
        
                        cc.loader.loadRes("icon/"+data.spokesman,cc.SpriteFrame,function(err,texture){
                            icon1.spriteFrame = texture
                        })
                        //设置frame缩放
                        var len = gamedata.get_str_lenght(data.content)
                        if((len/14).toFixed(2) <= 1.05){
                            left_frame_width_fit = len*29.25
                            item.height = 140
                            left_frame_height_fit = 60
                            if(len <= 6){
                                left_frame_width_fit = (len+1)*29.25
                            }
                        }else{
                            if((len%14)==0){
                                left_frame_height_fit = 60+(parseInt((len-1)/14))*40
                                item.height = 140+(parseInt((len-1)/14))*30
                            }else{
                                left_frame_height_fit = 60+(parseInt(len/14))*40
                                item.height = 140+(parseInt(len/14))*30
                            }
                            left_frame_width_fit = 400
                            
                        }
                        if(this.next_id_content){
                            left_speak_lb.string = this.id_conf[this.next_id_content].content
                        }else{
                            left_speak_lb.string = data.content
                        }
                    }
                    item.getChildByName("name").active = true
                    if(gamedata.chat_scene_id == 2){item.getChildByName("name").active = false}
                }
            }
            if(!this.is_player_choice){
               
                this.next_id_content = data.nextid
                item.y = this.list_height-picture_list_height
                this.list_height-= (item.height+picture_list_height)
                this.scrollview_height += Math.abs(parseInt(item.height+picture_list_height))
                this.scrollview.height = this.scrollview_height
                if(this.scrollview.height > 1100){
                    this.set_sc_buttom.scrollToBottom(0)
                }
                this.item_index++ 
            }
        }else if(gamedata.polt_Whether_join == 2){
            //重播剧情
            var c_data =this.replay_polt_id_arr
            if(this.item_index == 0){
                var data = this.join_content_conf[this.item_index]
            }else{
                if(gamedata.get_str_lenght(this.next_id_content) > 8){
                    //玩家选择
                    var c_arr = this.next_id_content.split(',')
                    var data = []
                    for(var k in c_arr){
                        if(!this.id_conf[c_arr[k]]){
                            cc.director.getScheduler().pauseTarget(this)
                            self.play_frame.node.active = false
                            self.stop_frame.node.active = false
                            self.close_button.node.active = true 
                            return
                        }
                        data.push(this.id_conf[c_arr[k]])
                    }
                    this.is_player_choice = true
                }else{
                    if(!this.id_conf[this.next_id_content]){
                        cc.director.getScheduler().pauseTarget(this)
                        self.play_frame.node.active = false
                        self.stop_frame.node.active = false
                        self.close_button.node.active = true 
                        return
                    }
                    var data = this.id_conf[this.next_id_content]
                    //玩家选择只有一条情况
                    if(data.spokesman == 1){
                        var s_data = []
                        s_data.push(data)

                        data = s_data
                        this.is_player_choice = true
                    }
                }
            }
           
            var item = cc.instantiate(this.listPrefab);
            item.x = -375
            this.scrollview.addChild(item)
            var tip = item.getChildByName("tip")
            var tip_label = tip.getChildByName('tip_label')
    
            var icon1 = item.getChildByName("icon_left").getComponent(cc.Sprite)
            var icon2 = item.getChildByName("icon_right").getComponent(cc.Sprite)
            var name = item.getChildByName("name").getComponent(cc.Label)
            var left_frame = item.getChildByName("chat_speak_frame")
            var right_frame = item.getChildByName("me_talk_frame")
            var left_speak_lb = item.getChildByName("chat_speak_lb").getComponent(cc.RichText)
            var right_speak_lb = item.getChildByName("me_talk_lb").getComponent(cc.RichText)
            var picture = item.getChildByName('picture')
            item.getChildByName('picture').active = false
            var input = item.getChildByName("input")
            item.getChildByName("icon_right").active = false
            item.getChildByName("chat_speak_lb").active = false
            item.getChildByName("my_name").getComponent(cc.Label).string = gamedata.username
            item.getChildByName("my_name").active = false
            input.runAction(cc.sequence(cc.delayTime(1.0),cc.callFunc(function(){
                input.active = false
                item.getChildByName("chat_speak_lb").active = true
                left_frame.width = left_frame_width_fit
                left_frame.height = left_frame_height_fit
            })))
            if(data.voice){
                //self.choice_music_volume()
                //H5
                //cc.audioEngine.play(gamedata.chat_voice_url+data.voice+".mp3")
                //android
                cc.audioEngine.play(self.polt_voice_load[data.voice])
                
            }
            if(data.content)data.content = gamedata.get_content_string(data.content)
            if(data.spokesman == 0){
                item.getChildByName("icon_left").active = false
                item.getChildByName("name").active = false
                left_frame.active = false
                right_frame.active = false
                item.getChildByName("me_talk_lb").active = false
                item.getChildByName("icon_right").active = false
                item.getChildByName("chat_speak_lb").active = false
                tip.active = true
                if(this.next_id_content){
                    tip_label.getComponent(cc.Label).string = this.id_conf[this.next_id_content].content
                }else{
                    tip_label.getComponent(cc.Label).string = data.content
                }
                
                cc.loader.loadRes("png/tip_frame",cc.SpriteFrame,function(err,texture){
                    tip.getComponent(cc.Sprite).spriteFrame = texture
                })
                input.active = false
                this.next_id_content = data.nextid
                item.height = 110
            }else{
                tip.active = false
                if(this.is_player_choice){
                    name.string = gamedata.username
                    //玩家发言、
                    input.active = false
                    //出来玩家选项为1的情况
                    this.user_choice_frame.node.active = false
                    left_frame.active = false
                    right_frame.active = true
                    item.getChildByName("me_talk_lb").active = true
                    item.getChildByName("chat_speak_lb").active = false
                    item.getChildByName("icon_right").active = true
                    item.getChildByName("my_name").active = true
                    item.getChildByName("name").active = false

                    item.getChildByName("me_talk_lb").getComponent(cc.RichText).string = this.id_conf[c_data[this.replay_polt_id]].content
                    var len = gamedata.get_str_lenght(this.id_conf[c_data[this.replay_polt_id]].content)
                    if((len/14).toFixed(2) <= 1.05){
                        right_frame.width = len*29
                        item.height = 140
                        right_frame.height = 60
                        item.getChildByName("me_talk_lb").getComponent(cc.RichText).maxWidth = len*26
                        if(len <= 6){ 
                            right_frame.width = (len+1)*29
                            item.getChildByName("me_talk_lb").getComponent(cc.RichText).maxWidth = (len+1)*26
                            if(len <= 3){
                                item.getChildByName("me_talk_lb").getComponent(cc.RichText).maxWidth = (len+0.7)*26
                            }
                        }
                    }else{
                        if((len%14)==0){
                            right_frame.height = 60+(parseInt((len-1)/14))*40
                            item.height = 140+(parseInt((len-1)/14))*30
                        }else{
                            right_frame.height = 60+(parseInt(len/14))*40
                            item.height = 140+(parseInt(len/14))*30
                        }
                        right_frame.width = 400
                    }
                    if(this.id_conf[c_data[this.replay_polt_id]].picture){
                        var p_data = this.id_conf[c_data[this.replay_polt_id]].picture.split(",")
                        if(p_data[1] == 0){
                            //显示图片
                            for(var m in item.children){
                                item.children[m].active = false
                            }
                            item.getChildByName("me_talk_lb").active = false
                            item.getChildByName("name").active= true
                            right_frame.active = false
                            item.getChildByName('picture').active = true
                            item.getChildByName('picture').x = 500
                            cc.loader.load(gamedata.expression_photo_url+p_data[0]+".png"+gamedata.version_number,function(err,texture){
                                this.picture.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                                this.picture.width = 150;
                                this.picture.height =150
                                if(this.p_data[0]==107 || this.p_data[0]==108){
                                    this.picture.width = 240;
                                    this.picture.height =427
                                }
                            }.bind({picture:picture,p_data:p_data}))
                            item.getChildByName("icon_right").active= true
                            item.height = 220
                            picture.y  = -130
                            if(p_data[0]==107 || p_data[0]==108){
                                item.height = 500
                                picture.x  = 262
                                picture.y  = -262
                            }
                            picture.on(cc.Node.EventType.TOUCH_END, function (event) {
                                show_big_photo(picture,this.p_data[0])
                            }.bind({p_data:p_data}));
                        }else if(p_data[1] == 1){
                            this.new_info_voice()
                            //显示图片+文字
                            var photo_item = cc.instantiate(self.photoPrefab);
                            item.addChild(photo_item)
                            var p_picture = photo_item.getChildByName("picture")
                            p_picture.x = 510
                            photo_item.getChildByName("icon_left").active = false
                            photo_item.getChildByName("name").active = true
                            //cc.loader.loadRes("icon/"+data.spokesman,cc.SpriteFrame,function(err,texture){
                                //photo_item.getChildByName("icon_left").getComponent(cc.Sprite).spriteFrame = texture
                            //})
                            //photo_item.getChildByName("name").string = self.role_data[data.spokesman].name
                            cc.loader.load(gamedata.expression_photo_url+p_data[0]+".png"+gamedata.version_number,function(err,texture){
                                this.p_picture.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                               
                            }.bind({p_picture:p_picture}))

                            tip.active = false
                            item.getChildByName('picture').active = false
                            item.getChildByName("me_talk_lb").active = true
                            item.getChildByName("icon_right").active = true
                            item.getChildByName("my_name").active = true
                            item.getChildByName("me_talk_frame").active = true
                            //cc.loader.loadRes("icon/"+data.spokesman,cc.SpriteFrame,function(err,texture){
                                //icon1.spriteFrame = texture
                            //})

                            var len = gamedata.get_str_lenght(this.id_conf[c_data[this.replay_polt_id]].content)
                            if((len/14).toFixed(2) <= 1.05){
                                right_frame.width = len*29
                                item.height = 140
                                right_frame.height = 60
                                if(len <= 6){
                                    right_frame.width = (len+1)*29
                                    item.getChildByName("me_talk_lb").getComponent(cc.RichText).maxWidth = (len+1)*26
                                    if(len <= 3){
                                        item.getChildByName("me_talk_lb").getComponent(cc.RichText).maxWidth = (len+0.7)*26
                                    }
                                }
                            }else{
                                this.new_info_voice()
                                if((len%14)==0){
                                    right_frame.height = 60+(parseInt((len-1)/14))*40
                                    item.height = 140+(parseInt((len-1)/14))*30
                                }else{
                                    right_frame.height = 60+(parseInt(len/14))*40
                                    item.height = 140+(parseInt(len/14))*30
                                }
                                right_frame.width = 400
                            }
                            photo_item.x = 0;photo_item.y = 220
                            left_speak_lb.string = this.id_conf[c_data[this.replay_polt_id]].content
                            picture_list_height = photo_item.height

                            p_picture.on(cc.Node.EventType.TOUCH_END, function (event) {
                                show_big_photo(p_picture)
                            });
                        }
                    }

                    //玩家选择后恢复数据
                    
                    this.is_player_choice = false
                    this.next_id_content = this.id_conf[c_data[this.replay_polt_id]].nextid
                    this.replay_polt_id++

                }else{
                    name.string = this.role_data[data.spokesman].name
                    if(data.picture){
                        var p_data = data.picture.split(",")
                        if(p_data[1] == 0){
                            //显示图片
                            for(var m in item.children){
                                item.children[m].active = false
                            }
                            item.getChildByName("name").active= true
                            item.getChildByName('picture').active = true
                            cc.loader.load(gamedata.expression_photo_url+p_data[0]+".png"+gamedata.version_number,function(err,texture){
                                this.picture.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                                this.picture.width = 150;
                                this.picture.height =150
                                if(this.p_data[0]==107 || this.p_data[0]==108){
                                    this.picture.width = 240;
                                    this.picture.height = 427
                                }
                            }.bind({picture:picture,p_data:p_data}))
                            item.getChildByName("icon_left").active= true
                            cc.loader.loadRes("icon/"+data.spokesman,cc.SpriteFrame,function(err,texture){
                                icon1.spriteFrame = texture
                            })
                            this.next_id_content = data.nextid
                            item.height = 220
                            picture.y  = -130
                            if(p_data[0]==107 || p_data[0]==108){
                                item.height = 500
                                picture.x  = 262
                                picture.y  = -262
                            }
                            picture.on(cc.Node.EventType.TOUCH_END, function (event) {
                                show_big_photo(picture,this.p_data[0])
                            }.bind({p_data:p_data}));
                        }else if(p_data[1] == 1){
                            this.new_info_voice()
                            //显示图片+文字
                            var photo_item = cc.instantiate(this.photoPrefab);
                            item.addChild(photo_item)
                            var p_picture = photo_item.getChildByName("picture")
                            photo_item.getChildByName("icon_right").active = false
                            cc.loader.loadRes("icon/"+data.spokesman,cc.SpriteFrame,function(err,texture){
                                photo_item.getChildByName("icon_left").getComponent(cc.Sprite).spriteFrame = texture
                            })
                            photo_item.getChildByName("name").getComponent(cc.Label).string = this.role_data[data.spokesman].name
                            cc.loader.load(gamedata.expression_photo_url+p_data[0]+".png"+gamedata.version_number,function(err,texture){
                                this.p_picture.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                            }.bind({p_picture:p_picture}))
    
                            tip.active = false
                            right_frame.active = false
                            item.getChildByName('picture').active = false
                            item.getChildByName("me_talk_lb").active = false
                            item.getChildByName("icon_right").active = false
                            cc.loader.loadRes("icon/"+data.spokesman,cc.SpriteFrame,function(err,texture){
                                icon1.spriteFrame = texture
                            })
                            var len = gamedata.get_str_lenght(data.content)
                            if((len/14).toFixed(2) <= 1.05){
                                left_frame_width_fit = len*29.25
                                item.height = 140
                                left_frame_height_fit = 60
                                if(len <= 6){
                                    left_frame_width_fit = (len+1)*29.25
                                }
                            }else{
                                left_frame_width_fit = 400
                                left_frame_height_fit = 60+(parseInt(len/14))*40
                                item.height = 140+(parseInt(len/14))*30
                            }
                            photo_item.x = 0;photo_item.y = 220
                            left_speak_lb.string = data.content
                            picture_list_height = photo_item.height
                            this.next_id_content = data.nextid

                            p_picture.on(cc.Node.EventType.TOUCH_END, function (event) {
                                show_big_photo(p_picture)
                            });
                        }
                    }else{
                        this.new_info_voice()
                        right_frame.active = false
                        item.getChildByName("me_talk_lb").active = false
        
                        cc.loader.loadRes("icon/"+data.spokesman,cc.SpriteFrame,function(err,texture){
                            icon1.spriteFrame = texture
                        })
                        
                        //设置frame缩放
                       
                        if(this.next_id_content){
                            left_speak_lb.string = this.id_conf[this.next_id_content].content
                        }else{
                            left_speak_lb.string = data.content
                        }
                        var len = gamedata.get_str_lenght(data.content)
                        if((len/14).toFixed(2) <= 1.05){
                            left_frame_width_fit = len*29.25
                            item.height = 140
                            left_frame_height_fit = 60
                            if(len <= 6){
                                left_frame_width_fit = (len+1)*29.25
                            }
                        }else{
                            if((len%14)==0){
                                left_frame_height_fit = 60+(parseInt((len-1)/14))*40
                                item.height = 140+(parseInt((len-1)/14))*30
                            }else{
                                left_frame_height_fit = 60+(parseInt(len/14))*40
                                item.height = 140+(parseInt(len/14))*30
                            }
                            left_frame_width_fit = 400
                            
                        }
                        if(this.next_id_content){
                            left_speak_lb.string = this.id_conf[this.next_id_content].content
                        }else{
                            left_speak_lb.string = data.content
                        }
                        this.next_id_content = data.nextid
                    }
                }
               
            }
            item.y = this.list_height-picture_list_height
            this.list_height-= (item.height+picture_list_height)
            this.scrollview_height += (item.height+picture_list_height)
            this.scrollview.height = this.scrollview_height
            if(this.scrollview.height > 1100){
                this.set_sc_buttom.scrollToBottom(0)
            }
            this.item_index++        
        }
    },
    get_pos_scale: function(str){

        //缩放一个字对应 0.143
        var str_len = gamedata.get_str_lenght(str)
        if(str_len<13){
            var pos_w = (str_len+0.8)*30
        }else{
            var pos_w = str_len*30
        }
        if(pos_w>400){return 400}
        return pos_w
    },
    polt_finish : function(){

        var self = this

        //玩家参与剧情完成，解锁数据处理
        cc.director.getScheduler().pauseTarget(this)
        if(gamedata.chat_scene_id == 2){
            if(gamedata.polt_state == 0){
                server.send({               
                         rid:"stat_letter_read",  
                         subject:"STAT",          
                         cmd:"STAT_LETTER_READ",      
                         udid:gamedata.userid,      
                         req:{stat_list:[parseInt(gamedata.chat_room_polt_id)]}            
                })
                gamedata.message_fun_map.set('stat_letter_read',function(data){
                })
                 //发送玩家选择数据、
                server.send({               
                         rid:"STAT_STORY_USER_SELECT",          
                         subject:"STAT",          
                         cmd:"STAT_STORY_USER_SELECT",      
                         udid:gamedata.userid,      
                         req:{talk_list:this.storage_replay_polt_palyer_data,sid:gamedata.chat_room_polt_id}            
                })
                gamedata.message_fun_map.set('stat_story_user_select',function(data){
                    
                })
                gamedata.load_json_data("letters"+gamedata.version_number,function(data){
                    for(var k in data){
                        if(data[k].privateletterid == gamedata.chat_room_polt_id){
                            //剧情掉落
                            if(data[k].drop){
                                self.show_prop_frame(data[k],2)
                            } 
                        }
                    }
                })
            }
        }else{
            server.send({               
                     rid:"stat_story_read",          
                     subject:"STAT",          
                     cmd:"STAT_STORY_READ",      
                     udid:gamedata.userid,      
                     req:{stat_list:[parseInt(gamedata.chat_room_polt_id),2]}            
            })
            gamedata.message_fun_map.set('stat_story_read',function(data){
                
            })
             //发送玩家选择数据、
            server.send({               
                rid:"stat_story_user_select",          
                subject:"STAT",          
                cmd:"STAT_STORY_USER_SELECT",      
                udid:gamedata.userid,      
                req:{talk_list:this.storage_replay_polt_palyer_data,sid:gamedata.chat_room_polt_id}            
            })
            gamedata.message_fun_map.set('stat_story_user_select',function(data){
                server.send({               
                    rid:"stat_moments_list",          
                    subject:"STAT",          
                    cmd:"STAT_MOMENTS_LIST",      
                    udid:gamedata.userid,      
                    req:{times:1}            
                })
            })
            gamedata.message_fun_map.set('stat_moments_list',function(m_data){
                gamedata.load_json_data("circlefriends",function(f_data){
                    gamedata.load_json_data("chat",function(data){
                    for(var k in data){ 
                        if(data[k].chatroomid == gamedata.chat_room_polt_id){
                            //解锁私信
                            if(data[k].unlockingletters){
                                var letters_data = []
                                var prop_data = (data[k].unlockingletters.toString()).split(",")
                                for(var ak in prop_data){letters_data.push(parseInt(prop_data[ak]))}
                                server.send({               
                                         rid:"stat_letter_publish",          
                                         subject:"STAT",          
                                         cmd:"STAT_LETTER_PUBLISH",      
                                         udid:gamedata.userid,      
                                         req:{letter_list:letters_data}            
                                })
                                gamedata.message_fun_map.set('stat_letter_publish',function(data){
                                    
                                })
                            }
                            //解锁朋友圈
                            //掉落道具
                            if(data[k].dropid){
                                self.show_prop_frame(data[k],1)
                            }
                            
                            var r_friend = {}
                            var r_id_friend = {}
                            var temp_data = {}
                            var i_data =null
                            var comment_data = []
                            for(var sk in f_data){
                                if(f_data[sk].role==1){r_friend[f_data[sk].circlefriendsid]=f_data[sk]}
                                r_id_friend[f_data[sk].circlefriendsid]=f_data[sk]
                            }
                            if(gamedata.polt_state != 2 && gamedata.polt_state != 5){
                                //解锁朋友圈   
                                if(data[k].circlefriendsid){
                                    for(var Jk in m_data.data){
                                        temp_data[m_data.data[Jk].mid] = m_data.data[Jk]
                                    }
                                    i_data = data[k].circlefriendsid.toString().split(",")
                                    var id_arr= []
                                    for(var nk in i_data){
                                        if(temp_data[i_data[nk]]){
                                            //存储过
                                        }else{
                                            if(r_friend[i_data[nk]]){
                                                //玩家发布存储在物品
                                                server.send({               
                                                    rid:"common_thing_store",          
                                                    subject:"COMMON",          
                                                    cmd:"COMMON_THING_STORE",      
                                                    udid:gamedata.userid,      
                                                    req:{thing_list:[parseInt(i_data[nk]),1]}            
                                                })
                                                gamedata.message_fun_map.set('common_thing_store',function(data){
                                                        
                                                })
                                            }else{
                                                id_arr.push(parseInt(i_data[nk]))
                                            }
                                        }
                                    }
                                    //朋友圈ID
                                    server.send({               
                                        rid:"stat_moments_save",          
                                        subject:"STAT",          
                                        cmd:"STAT_MOMENTS_SAVE",      
                                        udid:gamedata.userid,      
                                        req:{moments_list:id_arr}            
                                    })
                                    gamedata.message_fun_map.set('stat_moments_save',function(data){
                                            
                                    })
                                    var no_choice_data = []
                                    var reply_id = []
                                    if(id_arr.length!=0){
                                        for(var qk in id_arr){
                                            no_choice_data = []
                                            reply_id = []
                                            var jk_data = r_id_friend[id_arr[qk]]
                                            var c_d = jk_data.comment
                                            for(var kp in self.plot_close_comment){
                                                if(self.plot_close_comment[kp].linkid == c_d && self.plot_close_comment[kp].role != 1){
                                                    no_choice_data.push(self.plot_close_comment[kp])
                                                    if(self.plot_close_comment[kp].replycontent){
                                                        var o_temp = self.plot_close_comment[kp].replycontent.split(",")
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
                                                req:{moments_id:parseInt(id_arr[qk]),comments_list:l_data}            
                                            })
                                            gamedata.message_fun_map.set('stat_moments_comments_save',function(data){
                                                
                                            })
                                        }
                                        for(var dk in i_data){if(r_friend[i_data[dk]]){
                                            //解锁玩家发布朋友圈 次数+1
                                            server.send({               
                                                rid:"stat_moments_times",          
                                                subject:"STAT",          
                                                cmd:"STAT_MOMENTS_TIMES",      
                                                udid:gamedata.userid,      
                                                req:{times:1}            
                                            })
                                            gamedata.message_fun_map.set('stat_moments_times',function(data){
                                                    
                                            })
                                        }}
                                    }
                                }
                            }
                        }
                    }
                })
                   
                })
            })
        }
       
        this.play_frame.node.active = false
        this.stop_frame.node.active = false
        this.close_button.node.active = true 
       
    },
    show_prop_frame: function(data,type){
        // type 1聊天室 2私聊
        var self = this
        var prop_data = null
        if(type==1){
            prop_data = data.dropid.split(",")
        }else if(type==2){
            prop_data = data.drop.split(",")
            
        }else if(type==3){
            prop_data = this.drop_photo_data.unlock.split(",")
        }

        var tip_layout = cc.instantiate(this.black_layer);
        cc.director.getScene().getChildByName('Canvas').addChild(tip_layout)
        tip_layout.x = 0;tip_layout.y=0
        tip_layout.on(cc.Node.EventType.TOUCH_END, function (event) {})
        
        var goods_frame = cc.instantiate(self.goods_frame);
        goods_frame.zIndex = 999
        cc.director.getScene().getChildByName('Canvas').addChild(goods_frame)
        
        //只掉落一种
        var spr_1 = goods_frame.getChildByName("goods_1").active = false
        var spr_2 = goods_frame.getChildByName("goods_2").active = false
        var num_1 = goods_frame.getChildByName("num_1").active = false
        var num_2 = goods_frame.getChildByName("num_2").active = false
        num_1.getComponent(cc.Label).string = "x"+prop_data[1]
        if(parseInt(prop_data[0])==5101){spr_1.getComponent(cc.Sprite).spriteFrame = this.xiaodangao}else if(parseInt(prop_data[0])==5102){
            spr_1.getComponent(cc.Sprite).spriteFrame = this.baomihua}else if(parseInt(prop_data[0])==5103){spr_1.getComponent(cc.Sprite).spriteFrame = this.tiantianquan}else
             if(parseInt(prop_data[0])==5104){spr_1.getComponent(cc.Sprite).spriteFrame = this.bangbangtao}
        num_1.getComponent(cc.Label).string = "x"+prop_data[1]
        if(this.drop_photo_data){
            goods_frame.getChildByName("goods_2").active = true
            goods_frame.getChildByName("num_2").active = true
            goods_frame.getChildByName("num_2").getComponent(cc.Label).string = "x1"
            goods_frame.getChildByName("goods_2").getComponent(cc.Sprite).spriteFrame = this.albun_icon_sprf
        }
        goods_frame.getChildByName("confirm").on(cc.Node.EventType.TOUCH_END, function (event) {
            if(type==1){
                //掉落动画道具
                //发送获得物品请求
                server.send({               
                         rid:"common_thing_store",          
                         subject:"COMMON",          
                         cmd:"COMMON_THING_STORE",      
                         udid:gamedata.userid,      
                         req:{thing_list:[parseInt(prop_data[0]),parseInt(prop_data[1])]}            
                })
                gamedata.message_fun_map.set('common_thing_store',function(data){
                    cc.director.getScene().getChildByName('Canvas').removeChild(goods_frame)
                    cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout)
                })
                if(self.drop_photo_data){
                     //图鉴掉落
                    server.send({               
                             rid:"stat_pokedex_save",          
                             subject:"STAT",          
                             cmd:"STAT_POKEDEX_SAVE",      
                             udid:gamedata.userid,      
                             req:{pokedex_list:[parseInt(self.drop_photo_data.unlock)]}            
                    })
                    gamedata.message_fun_map.set('stat_pokedex_save',function(data){
                        
                    })

                    //存储图鉴（用于判定是否有新图鉴）
                    server.send({               
                        rid:"common_thing_store",          
                        subject:"COMMON",          
                        cmd:"COMMON_THING_STORE",      
                        udid:gamedata.userid,      
                        req:{thing_list:[6600005,parseInt(self.album_conf[self.drop_photo_data.unlock].role)]}            
                    })
                    gamedata.message_fun_map.set('common_thing_store',function(data){
                            
                    })
                }
                cc.director.getScene().getChildByName('Canvas').removeChild(goods_frame)
                cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout)
            }else if(type==2){

                server.send({               
                         rid:"common_thing_store",          
                         subject:"COMMON",          
                         cmd:"COMMON_THING_STORE",      
                         udid:gamedata.userid,      
                         req:{thing_list:[parseInt(prop_data[0]),parseInt(prop_data[1])]}            
                })
                gamedata.message_fun_map.set('common_thing_store',function(data){
                    cc.director.getScene().getChildByName('Canvas').removeChild(goods_frame)
                    cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout)
                })

               
            }else if(type==3){
                
            }
            
        });        
    },
    letter_updatelist: function(){
        var self = this
        if(gamedata.chat_scene_id == 2){
            var next_id = 0
            var index = 0
            var p_id = 0 
            for(var k in this.join_content_conf){
                if(index == 0){
                    this.letter_replay_polt_data.push(this.join_content_conf[index])
                    next_id = this.join_content_conf[index].nextid
                    if(this.letter_replay_polt_data[index].spokesman == 1){p_id++}
                }else{
                    if(gamedata.get_str_lenght(next_id) > 8){
                        //玩家选择
                        this.letter_replay_polt_data.push(this.id_conf[this.replay_polt_id_arr[p_id]])
                        next_id = this.id_conf[this.replay_polt_id_arr[p_id]].nextid
                        p_id++
                    }else{
                        if(next_id == -1){break}
                        this.letter_replay_polt_data.push(this.id_conf[next_id])
                        next_id = this.id_conf[next_id].nextid
                    }
                }
                index++
            }
        }
        if(185*this.letter_replay_polt_data.length>1100){
            this.scrollview.height = 185*this.letter_replay_polt_data.length
        }
        for(var k in this.letter_replay_polt_data){
            var item = cc.instantiate(this.listPrefab);
            item.x = -375
            item.y = -60-k*180
            this.scrollview.addChild(item)
            var tip = item.getChildByName("tip")
            var tip_label = tip.getChildByName('tip_label')
            tip.active = false
            var icon1 = item.getChildByName("icon_left").getComponent(cc.Sprite)
            var icon2 = item.getChildByName("icon_right").getComponent(cc.Sprite)
            var name = item.getChildByName("name").getComponent(cc.Label)
            var left_frame = item.getChildByName("chat_speak_frame")
            var right_frame = item.getChildByName("me_talk_frame")
            var left_speak_lb = item.getChildByName("chat_speak_lb").getComponent(cc.RichText)
            var right_speak_lb = item.getChildByName("me_talk_lb").getComponent(cc.RichText)
            var picture = item.getChildByName('picture').getComponent(cc.Sprite)
            item.getChildByName('picture').active = false
            var input = item.getChildByName("input")
            item.getChildByName("icon_right").active = false
            item.getChildByName("chat_speak_lb").active = false
            item.getChildByName("my_name").getComponent(cc.Label).string = gamedata.username
            item.getChildByName("my_name").active = false
            input.active = false

            if(this.letter_replay_polt_data[k]==undefined || this.letter_replay_polt_data[k].spokesman == 1  ){
                left_frame.active = false
                right_frame.active = true
                item.getChildByName("me_talk_lb").active = true
                item.getChildByName("chat_speak_lb").active = false
                item.getChildByName("icon_right").active = true
                item.getChildByName("my_name").active = true
                item.getChildByName("name").active = false

                var len = gamedata.get_str_lenght(this.letter_replay_polt_data[k].content)
                if((len/14).toFixed(2) <= 1.05){
                    right_frame.width = len*29
                    item.height = 140
                    right_frame.height = 60
                    item.getChildByName("me_talk_lb").getComponent(cc.RichText).maxWidth = len*26
                    if(len <= 6){ 
                        right_frame.width = (len+1)*29
                        item.getChildByName("me_talk_lb").getComponent(cc.RichText).maxWidth = (len+1)*26
                        if(len <= 3){
                            item.getChildByName("me_talk_lb").getComponent(cc.RichText).maxWidth = (len+0.7)*26
                        }
                    }
                }else{
                    if((len%14)==0){
                        right_frame.height = 60+(parseInt((len-1)/14))*40
                        item.height = 140+(parseInt((len-1)/14))*30
                    }else{
                        right_frame.height = 60+(parseInt(len/14))*40
                        item.height = 140+(parseInt(len/14))*30
                    }
                    right_frame.width = 400
                }
                
                item.getChildByName("me_talk_lb").getComponent(cc.RichText).string = this.letter_replay_polt_data[k].content
            }else{
                right_frame.active = false
                item.getChildByName("me_talk_lb").active = false

                cc.loader.loadRes("icon/"+this.letter_replay_polt_data[k].spokesman,cc.SpriteFrame,function(err,texture){
                    this.icon1.spriteFrame = texture
                }.bind({icon1:icon1}))
                name.string = this.role_data[this.letter_replay_polt_data[k].spokesman].name
                //设置frame缩放
                var len = gamedata.get_str_lenght(this.letter_replay_polt_data[k].content)
                if((len/14).toFixed(2) <= 1.05){
                    left_frame.width = len*29.25
                    item.height = 140
                    left_frame.height = 60
                    if(len <= 6){
                        left_frame.width = (len+1)*29.25
                    }
                }else{
                    if((len%14)==0){
                        left_frame.height = 60+(parseInt((len-1)/14))*40
                        item.height = 140+(parseInt((len-1)/14))*30
                    }else{
                        left_frame.height = 60+(parseInt(len/14))*40
                        item.height = 140+(parseInt(len/14))*30
                    }
                    left_frame.width = 400
                    
                }
                left_speak_lb.string = this.letter_replay_polt_data[k].content
                item.getChildByName("chat_speak_lb").active = true
            }
        }
        this.set_sc_buttom.scrollToBottom(0.1)
    },
    choice_music_volume : function(){
        var self = this
        cc.audioEngine.setVolume(this.audioId,0.05)
        this.title_name.node.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(function(){
            cc.audioEngine.setVolume(self.audioId,0.5)
        }),cc.delayTime(1),cc.callFunc(function(){
            cc.audioEngine.setVolume(self.audioId,1)
        })))
    },
    new_info_voice: function(){
        cc.loader.loadRes("system_voice/info_prompting",function(err,voice){
            cc.audioEngine.play(voice,false,0.1)
        })
    },
    start () {
        

    },

    // update (dt) {},
});
