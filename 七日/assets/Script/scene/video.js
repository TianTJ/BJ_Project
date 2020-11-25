import { parse } from 'querystring';

var gamedata = require('data');
var server = require('server'); 
cc.Class({
    extends: cc.Component,

    properties: {
        listPrefab: {
            default: null,
            type: cc.Prefab
        },
        scrollview: {
            default: null,
            type: cc.Node
        },
        character_btn_1: {
            default: null,
            type: cc.Sprite
        },
        character_btn_2: {
            default: null,
            type: cc.Sprite
        },
        character_btn_3: {
            default: null,
            type: cc.Sprite
        },
        character_btn_4: {
            default: null,
            type: cc.Sprite
        },
        Selected_img:{
            default: null,
            type: cc.Sprite
        },
        icon_1: {
            default: null,
            type: cc.SpriteFrame
        },
        icon_2: {
            default: null,
            type: cc.SpriteFrame
        },
        icon_3: {
            default: null,
            type: cc.SpriteFrame
        },
        icon_4: {
            default: null,
            type: cc.SpriteFrame
        },
        vide_node: {
            default: null,
            type: cc.Prefab
        },
        black_layer:{
            default: null,
            type: cc.Prefab
        },
        Tip_frame:{
            default: null,
            type: cc.Prefab
        },
        up_list: {
            default: null,
            type: cc.ScrollView
        }
    },
    onLoad: function(){
        this.schedule(function() {
            gamedata.heart_server();
        },15,cc.macro.REPEAT_FOREVER,0);
        var self = this
        self.character_btn_1.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.Selected_img.node.x = self.character_btn_1.node.x
            self.updatelist(self.character_btn_1.id)
        });
        self.character_btn_2.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.Selected_img.node.x = self.character_btn_2.node.x
            self.updatelist(self.character_btn_2.id)
        });
        self.character_btn_3.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.Selected_img.node.x = self.character_btn_3.node.x
            self.updatelist(self.character_btn_3.id)
        });
        self.character_btn_4.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.Selected_img.node.x = self.character_btn_4.node.x
            self.updatelist(self.character_btn_4.id)
        });

        this.video_all_conf = null
        this.drop_num_data = {}
        gamedata.load_json_data("video",function(data){
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
                        self.drop_num_data[s_data.data.thing_list[k].tid] = s_data.data.thing_list[k]
                    }
                }
                self.video_all_conf = data
    
                self.initui()
                self.updatelist(1004)
            })
        })
    
        
    },
    initui : function(){
        var self = this
        gamedata.load_json_data("role",function(data){
            for(var k in data){
                cc.loader.loadRes('icon/'+data[k].icon,cc.SpriteFrame,function(err,texture){
                    if(data[this.k].user_id == 1001){
                        self.character_btn_4.spriteFrame = texture
                        self.character_btn_4.id = data[this.k].user_id
                    }else if(data[this.k].user_id == 1002){
                        self.character_btn_3.spriteFrame = texture
                        self.character_btn_3.id = data[this.k].user_id
                    }else if(data[this.k].user_id == 1003){
                        self.character_btn_2.spriteFrame = texture
                        self.character_btn_2.id = data[this.k].user_id
                    }else if(data[this.k].user_id == 1004){
                        self.character_btn_1.spriteFrame = texture
                        self.character_btn_1.id = data[this.k].user_id
                    }
                }.bind({k:k}))
            }
        })
        if(this.drop_num_data[5104] && this.drop_num_data[5104].count >= 8 && gamedata.cat_paw_coin >= 20){
            this.character_btn_1.node.getChildByName("gantanhao").active = true
        }else{this.character_btn_1.node.getChildByName("gantanhao").active = false}
        if(this.drop_num_data[5102] && this.drop_num_data[5102].count >= 8 && gamedata.cat_paw_coin >= 20){
            this.character_btn_2.node.getChildByName("gantanhao").active = true
        }else{this.character_btn_2.node.getChildByName("gantanhao").active = false}
        if(this.drop_num_data[5103] && this.drop_num_data[5103].count >= 8 && gamedata.cat_paw_coin >= 20){
            this.character_btn_3.node.getChildByName("gantanhao").active = true
        }else{this.character_btn_3.node.getChildByName("gantanhao").active = false}
        if(this.drop_num_data[5101] && this.drop_num_data[5101].count >= 8 && gamedata.cat_paw_coin >= 20){
            this.character_btn_4.node.getChildByName("gantanhao").active = true
        }else{this.character_btn_4.node.getChildByName("gantanhao").active = false}
       
    },
    start () {

    },
    updatelist : function(id){
        var list_num = 0
        var self= this
        this.scrollview.removeAllChildren()
        var r_data = []
        for(var k in this.video_all_conf){
            if(this.video_all_conf[k].role == id){
                r_data.push(this.video_all_conf[k])
            }
        }
        for(var i=0;i<r_data.length;i++){
            var item = cc.instantiate(this.listPrefab);
            if(r_data[i].address){this.scrollview.addChild(item);list_num++}
            item.id = r_data[i].address
            item.x = 0
            item.y = -100-i*215

            item.getChildByName("unlock").active = false
            var paly = item.getChildByName("button")

            paly.on(cc.Node.EventType.TOUCH_END, function (event) {
                if(cc.director.getScene().getChildByName('Canvas').getChildByName("video_play")){
                    return
                }
                if(!self.drop_num_data[this.item.id]){
                    if((gamedata.cat_paw_coin-20)<0){
                        if(gamedata.is_show_tip_move){
                            gamedata.showSysHint("","钻石不足！") 
                            return
                        }else{
                            return
                        }
                    }
                    var tip_layout = cc.instantiate(self.black_layer);
                    cc.director.getScene().getChildByName('Canvas').addChild(tip_layout)
                    tip_layout.x = 0;tip_layout.y=0
                    tip_layout.on(cc.Node.EventType.TOUCH_END, function (event) {})
    
                    var tip_frame = cc.instantiate(self.Tip_frame);
                    tip_frame.zIndex = 999
                    cc.director.getScene().getChildByName('Canvas').addChild(tip_frame)
                    tip_frame.getChildByName("xiao_hao").active = false
                    tip_frame.getChildByName("content").getComponent(cc.RichText).string = "是否解锁"+r_data[this.i].chapter+"："+r_data[this.i].introduce
                    tip_frame.getChildByName("confirm").on(cc.Node.EventType.TOUCH_END, function (event) {
                        cc.director.getScene().getChildByName('Canvas').removeChild(tip_frame)
                        cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout)
                        // if(this.item.id == ""){
                        //     if(gamedata.is_show_tip_move){
                        //         gamedata.showSysHint("","未上架！") 
                        //         return
                        //     }
                        // }
                        // //未解锁视频，扣除消耗品
                        // for(var k in r_data){
                        //     if(r_data[k].address == this.item.id){
                        //         var id_d = r_data[k].unlockinggoods.split(',')
                        //         server.send({               
                        //                  rid:"common_thing_consume",  
                        //                  subject:"COMMON",          
                        //                  cmd:"COMMON_THING_CONSUME",      
                        //                  udid:gamedata.userid,      
                        //                  req:{thing_list:[parseInt(id_d[0]),parseInt(id_d[1])]}            
                        //         })
                        //         server.send({               
                        //                  rid:"pay_add_coin",  
                        //                  subject:"PAY",          
                        //                  cmd:"PAY_ADD_COIN",      
                        //                  udid:gamedata.userid,      
                        //                  req:{coin:-parseInt(id_d[3])}            
                        //         })
                        //         gamedata.message_fun_map.set('pay_add_coin',function(data){})
                        //         gamedata.cat_paw_coin-=parseInt(id_d[3])
                        //         if(gamedata.coin_label){gamedata.coin_label.node.getComponent(cc.Label).string=gamedata.cat_paw_coin}
                        //         gamedata.message_fun_map.set('common_thing_consume',function(s_data,code){
                        //             if(code==200){
                        //                 var video_node = cc.instantiate(self.vide_node);
                        //                 video_node.zIndex = 99999
                        //                 cc.director.getScene().getChildByName('Canvas').addChild(video_node)
                        //                 video_node.getChildByName("pink_back").on(cc.Node.EventType.TOUCH_END, function (event) {
                        //                     video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).stop()
                        //                     //video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).remoteURL = ""
                        //                     cc.director.getScene().getChildByName('Canvas').removeChild(video_node)
                        //                     self.update_scn(id)
                        //                 });
                        //                 video_node.on(cc.Node.EventType.TOUCH_END, function (event) {})
                        //                 //video_node.getChildByName('videoplayer').resourceType = cc.VideoPlayer.ResourceType.REMOTE;
                        //                 //video_node.getChildByName('videoplayer').resourceType = cc.VideoPlayer.ResourceType.LOCAL;
                        //                 //video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).remoteURL = gamedata.ani_video_url+this.item.id+".mp4"

                        //                 video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).clip = "res/raw-assets/resources/video/"+this.item.id+".mp4"
                        //                 video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).play()
                            
                        //                 var ani = video_node.getChildByName('l_1').getComponent(cc.Animation)
                        //                 ani.play("loading")
                        //                 video_node.getChildByName('light_b').runAction(cc.repeatForever(cc.rotateBy(1,360)))

                        //                 video_node.getChildByName('videoplayer').on("ready-to-play",function(){
                        //                     cc.log("play video")
                        //                     video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).play()
                        //                     video_node.getChildByName('l_1').active = false
                        //                     video_node.getChildByName('light_b').active = false
                        //                 },this)
                        //                 video_node.getChildByName('videoplayer').on("completed",function(){
                        //                     //video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).remoteURL = ""
                        //                     cc.director.getScene().getChildByName('Canvas').removeChild(video_node)
                        //                     self.update_scn(id)
                        //                 },this)
                        //                 //存储玩家解锁视频id 
                        //                 server.send({               
                        //                          rid:"common_thing_store",          
                        //                          subject:"COMMON",          
                        //                          cmd:"COMMON_THING_STORE",      
                        //                          udid:gamedata.userid,      
                        //                          req:{thing_list:[parseInt(this.item.id),1]}            
                        //                 })
                        //                 gamedata.message_fun_map.set('common_thing_store',function(data){
                                        
                        //                 })
                        //             }else if(code==202){
                        //                 if(gamedata.is_show_tip_move){
                        //                     gamedata.showSysHint("","道具不足！") 
                        //                 }
                        //             }
                        //         }.bind({item:this.item,i:this.i}))
                            
                        //         // var Video = wx.createVideo() 
                        //         // Video.x = 0;Video.y = 0;Video.width = 750;Video.height = 480;Video.src = gamedata.ani_video_url+this.item.id+".mp4";
                        //         // Video.autoplay =false;Video.loop =false;Video.initialTime=0;Video.objectFit ='contain'
                        //         // Video.requestFullScreen()
                        //         // Video.onPlay()
                        //     }
                        // }  
                        var video_node = cc.instantiate(self.vide_node);
                        video_node.zIndex = 99999
                        cc.director.getScene().getChildByName('Canvas').addChild(video_node)
                        video_node.getChildByName("pink_back").on(cc.Node.EventType.TOUCH_END, function (event) {
                            video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).stop()
                            //video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).remoteURL = ""
                            cc.director.getScene().getChildByName('Canvas').removeChild(video_node)
                            self.update_scn(id)
                        });
                        video_node.on(cc.Node.EventType.TOUCH_END, function (event) {})
                        //video_node.getChildByName('videoplayer').resourceType = cc.VideoPlayer.ResourceType.REMOTE;
                        //video_node.getChildByName('videoplayer').resourceType = cc.VideoPlayer.ResourceType.LOCAL;
                        //video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).remoteURL = gamedata.ani_video_url+this.item.id+".mp4"

                        console.log('测试1')
                        video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).clip = "res/raw-assets/resources/video/"+this.item.id+".mp4"
                        video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).play()
            
                        var ani = video_node.getChildByName('l_1').getComponent(cc.Animation)
                        ani.play("loading")
                        video_node.getChildByName('light_b').runAction(cc.repeatForever(cc.rotateBy(1,360)))

                        video_node.getChildByName('videoplayer').on("ready-to-play",function(){
                            cc.log("play video")
                            video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).play()
                            video_node.getChildByName('l_1').active = false
                            video_node.getChildByName('light_b').active = false
                        },this)
                        video_node.getChildByName('videoplayer').on("completed",function(){
                            //video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).remoteURL = ""
                            cc.director.getScene().getChildByName('Canvas').removeChild(video_node)
                            self.update_scn(id)
                        },this)                                                        
                    }.bind({item:this.item,i:this.i}))
                    tip_frame.getChildByName("cancel").on(cc.Node.EventType.TOUCH_END, function (event) {
                        cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout)
                        cc.director.getScene().getChildByName('Canvas').removeChild(tip_frame)
                    })
                }else{
                    var video_node = cc.instantiate(self.vide_node);
                    video_node.zIndex = 99999
                    cc.director.getScene().getChildByName('Canvas').addChild(video_node)
                    video_node.getChildByName("pink_back").on(cc.Node.EventType.TOUCH_END, function (event) {
                        video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).stop()
                        //video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).remoteURL = ""
                        cc.director.getScene().getChildByName('Canvas').removeChild(video_node)
                    });
                    video_node.on(cc.Node.EventType.TOUCH_END, function (event) {})
                    //video_node.getChildByName('videoplayer').resourceType = cc.VideoPlayer.ResourceType.REMOTE;
                    //video_node.getChildByName('videoplayer').resourceType = cc.VideoPlayer.ResourceType.LOCAL;
                    //video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).remoteURL = gamedata.ani_video_url+this.item.id+".mp4"
                    console.log('测试2')
                    video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).clip = "res/raw-assets/resources/video/"+this.item.id+".mp4"
                    video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).play()
                  
                    var ani = video_node.getChildByName('l_1').getComponent(cc.Animation)
                    ani.play("loading")
                    video_node.getChildByName('light_b').runAction(cc.repeatForever(cc.rotateBy(1,360)))

                    video_node.getChildByName('videoplayer').on("ready-to-play",function(){
                        cc.log("play video")
                        video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).play()
                        video_node.getChildByName('l_1').active = false
                        video_node.getChildByName('light_b').active = false
                    },this)
                    video_node.getChildByName('videoplayer').on("completed",function(){
                        //video_node.getChildByName('videoplayer').getComponent(cc.VideoPlayer).remoteURL = ""
                        cc.director.getScene().getChildByName('Canvas').removeChild(video_node)
                    },this)          
                }
            }.bind({item:item,i:i}));

            var icon = item.getChildByName('baomihua')

            var consume_data = r_data[i].unlockinggoods.split(',')
            if(consume_data[0]==5101){
                icon.getComponent(cc.Sprite).spriteFrame = this.icon_3
            }else if(consume_data[0]==5102){
                icon.getComponent(cc.Sprite).spriteFrame = this.icon_1
            }else if(consume_data[0]==5103){
                icon.getComponent(cc.Sprite).spriteFrame = this.icon_2
            }else if(consume_data[0]==5104){
                icon.getComponent(cc.Sprite).spriteFrame = this.icon_4
            }

            item.getChildByName('name').active= false
            item.getChildByName('name').getComponent(cc.Label).string = r_data[i].chapter
            item.getChildByName('richtext').getComponent(cc.RichText).string = r_data[i].introduce

            var d_num = 0
            if(this.drop_num_data[consume_data[0]]){d_num=this.drop_num_data[consume_data[0]].count}

            item.getChildByName('now_prop_1').getComponent(cc.Label).string = consume_data[1]
            item.getChildByName('all_prop_1').getComponent(cc.Label).string = "/"+d_num
            item.getChildByName('now_prop_2').getComponent(cc.Label).string = consume_data[3]
            item.getChildByName('all_prop_2').getComponent(cc.Label).string = "/"+gamedata.cat_paw_coin

            var video_bg = item.getChildByName('video_img')
            if(r_data[i].icon){
                //cc.loader.load(gamedata.ani_photo_url+r_data[i].icon+".png"+gamedata.version_number,function(err,texture){
                //     this.video_bg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                //     this.video_bg.width = 314;
                //     this.video_bg.height = 184
                // }.bind({video_bg:video_bg}))
       
                video_bg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/video_title/"+r_data[i].icon+".jpg"))
                video_bg.width = 314;
                video_bg.height = 184
            }

            if(this.drop_num_data[item.id]){
                //已解锁
                item.getChildByName("baomihua").active=false;item.getChildByName("hbsqmz").active=false;
                item.getChildByName("now_prop_1").active=false;item.getChildByName("all_prop_1").active=false;
                item.getChildByName("now_prop_2").active=false;item.getChildByName("all_prop_2").active=false;
                item.getChildByName("unlock").active = true
            }
        }
        this.scrollview.height = 830
        if((200*list_num+list_num*15) > 830){
            this.scrollview.height = 200*list_num+list_num*15
        }
        this.up_list.scrollToTop(0)
    },
    update_scn:function(id){
        var self = this
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
                    self.drop_num_data[s_data.data.thing_list[k].tid] = s_data.data.thing_list[k]
                }
            }
            self.updatelist(id)
        })
    }
    // update (dt) {},
});
