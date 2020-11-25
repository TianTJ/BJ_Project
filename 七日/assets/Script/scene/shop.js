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
        Barrage: {
            default: null,
            type: cc.Layout
        },
        Buy_cat: {
            default: null,
            type: cc.Sprite
        },
        cat_btn: {
            default: null,
            type: cc.Sprite
        },
        phone_card_btn: {
            default: null,
            type: cc.Sprite
        },
        sc_active: {
            default: null,
            type: cc.Node
        },
        gray_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        red_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        tip: {
            default: null,
            type: cc.Prefab
        },
        black_layer: {
            default: null,
            type: cc.Prefab
        },
        r_sprite: {
            default: null,
            type: cc.SpriteFrame 
        },
        sr_sprite:{
            default: null,
            type: cc.SpriteFrame 
        },
        ssr_sprite: {
            default: null,
            type: cc.SpriteFrame 
        },
        shop_frame: {
            default: null,
            type: cc.Prefab
        },
        cat_res: {
            default: null,
            type: cc.SpriteFrame 
        },
        confirm_frame: {
            default: null,
            type: cc.Prefab
        },
        sy_num: {
            default: null,
            type: cc.Label 
        }
    },
    onLoad () {
        this.schedule(function() {
            gamedata.heart_server();
        },15,cc.macro.REPEAT_FOREVER,0);
        var self = this
          
        self.cat_btn.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.Barrage.node.active = false
            self.Buy_cat.node.active = false

            self.sc_active.active = true
            self.cat_btn.getComponent(cc.Sprite).spriteFrame = self.red_spr
            self.cat_btn.node.getChildByName("cat_name").getComponent(cc.Label).node.color = cc.Color.YELLOW
            self.phone_card_btn.getComponent(cc.Sprite).spriteFrame = self.gray_spr
            self.phone_card_btn.node.getChildByName("phone_card").getComponent(cc.Label).node.color = cc.Color.WHITE
            cc.loader.load(gamedata.scene_bg_url+"shop1.jpg"+gamedata.version_number,function(err,texture){
                if(gamedata.shop_bg){
                    gamedata.shop_bg.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                }
            })
        });
        self.phone_card_btn.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.Barrage.node.active = true
            self.Buy_cat.node.active = true

            self.sc_active.active = false
            self.cat_btn.getComponent(cc.Sprite).spriteFrame = self.gray_spr
            self.phone_card_btn.getComponent(cc.Sprite).spriteFrame = self.red_spr
            var kk = self.cat_btn.node.getChildByName("cat_name").getComponent(cc.Label).node.color = cc.Color.WHITE
            self.phone_card_btn.node.getChildByName("phone_card").getComponent(cc.Label).node.color = cc.Color.YELLOW
            cc.loader.load(gamedata.scene_bg_url+"shop2.jpg"+gamedata.version_number,function(err,texture){
                if(gamedata.shop_bg){
                    gamedata.shop_bg.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                }
            })
        });

          server.send({               
                     rid:"common_thing_list",  
                     subject:"COMMON",          
                     cmd:"COMMON_THING_LIST",      
                     udid:gamedata.userid,      
                     req:{}            
            })
            gamedata.message_fun_map.set('common_thing_list',function(h_data){
                for(var k in h_data.data.thing_list){
                    if(h_data.data.thing_list[k].tid == 7000072){
                        self.sy_num.getComponent(cc.Label).string = "今日剩余购买次数："+h_data.data.thing_list[k].count
                        gamedata.Lottery_number = h_data.data.thing_list[k].count
                    }
                }
            })

        //抽奖
        self.Buy_cat.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(gamedata.Lottery_number <= 0){
                if(gamedata.is_show_tip_move){
                    gamedata.showSysHint("","次数不足！",null);
                }
                return
            }
            server.send({               
                rid:"common_thing_consume", 
                subject:"COMMON",          
                cmd:"COMMON_THING_CONSUME",      
                udid:gamedata.userid,      
                req:{thing_list:[7000072,1]}            
            })
            gamedata.message_fun_map.set('common_thing_consume',function(data){
                
            })
            //抽取电话卡
            server.send({               
                rid:"common_draw_and_egg",          
                subject:"COMMON",          
                cmd:"COMMON_DRAW_AND_EGG",      
                udid:gamedata.userid,      
                req:{type:1}            
            })
            self.Buy_cat.node.active = false
            gamedata.message_fun_map.set('common_draw_and_egg',function(data,code){
                if(code==205){
                    self.Buy_cat.node.active =true
                    if(gamedata.is_show_tip_move){
                        gamedata.showSysHint("","货币不足",null)  
                    }
                }else{
                    var card_id = data.data.card_id

                    if(gamedata.coin_label){gamedata.coin_label.getComponent(cc.Label).string = gamedata.cat_paw_coin-50;gamedata.cat_paw_coin-=50}
                    var tip_layout = cc.instantiate(self.black_layer);
                    cc.director.getScene().getChildByName('Canvas').addChild(tip_layout)
                    tip_layout.zIndex = 998
                    tip_layout.x = 0;tip_layout.y=0
                    tip_layout.on(cc.Node.EventType.TOUCH_END, function (event) {})
                    var tip_frame = cc.instantiate(self.tip);
                    tip_frame.zIndex = 999
                    tip_frame.x = 0; tip_frame.y = 450
                    cc.director.getScene().getChildByName('Canvas').addChild(tip_frame)

                    var icon = tip_frame.getChildByName("scrollview").getChildByName("view").getChildByName("content").getChildByName("icon")
                    var quality = tip_frame.getChildByName("quality")
                    quality.active = false
                    var name = tip_frame.getChildByName("name")
                    var close_btn = tip_frame.getChildByName("button_1")
                    close_btn.on(cc.Node.EventType.TOUCH_END, function (event) {
                        cc.director.getScene().getChildByName('Canvas').removeChild(tip_frame)
                        cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout)
                    });
                    if(card_id==52105||card_id==52107||card_id==52109||card_id==52206||card_id==52210||card_id==52304||card_id==52306||card_id==52309||card_id==52310){
                        icon.y=218}else{icon.y=0}
                    tip_frame.active = false

                    gamedata.load_json_data("goods",function(conf){
                        var get_data = null
                        for(var k in conf){
                            if(conf[k].goodsid == data.data.card_id){
                                get_data = conf[k];break
                            }
                        }
                        cc.loader.load(gamedata.phone_photo_url+get_data.goodsid+".png"+gamedata.version_number,function(err,texture){
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
                        gamedata.Lottery_number--
                        name.getComponent(cc.Label).string = get_data.nameitem
                        self.Buy_cat.node.active =true
                        self.sy_num.getComponent(cc.Label).string = "今日剩余购买次数："+gamedata.Lottery_number
                    })
                    cc.log(data)
                }
            })  
        });
        this.initui()
        this.shop_server_data = {}
        this.shop_conf_data = {}

        server.send({               
            rid:"pay_get_goods_list",  
            subject:"PAY",          
            cmd:"PAY_GET_GOODS_LIST",      
            udid:gamedata.userid,      
            req:{}            
        })
        gamedata.message_fun_map.set('pay_get_goods_list',function(data,code){
            for(var k in data.data.goods_list){
                self.shop_server_data[data.data.goods_list[k].gid] = data.data.goods_list[k]
            }
            gamedata.load_json_data("shop",function(c_data){
                if(c_data){
                    self.shop_conf_data = c_data
                    self.update_list(c_data)
                }else{
                    return
                }
            })
        })
      
    },
    initui: function(){
        var self = this
        this.Barrage.node.active = false
        this.Buy_cat.node.active = false
       
    },
    update_list: function(shop_data){

        var self = this

        for(var i=0;i<shop_data.length;i++){
            var s_item = cc.instantiate(this.listPrefab);
            s_item.x = -150
            s_item.y = -50-i*130
            this.scrollview.addChild(s_item)

            var item = s_item.getChildByName("shop")
            var cat_num = item.getChildByName("num")
            var send_lb = item.getChildByName("Send")
            var money = item.getChildByName("money")
            var first = s_item.getChildByName("bianqian") 

            item.on(cc.Node.EventType.TOUCH_END, function (event) {
                var id = shop_data[this.i].grade

                var tip_layout1 = cc.instantiate(self.black_layer);
                cc.director.getScene().getChildByName('Canvas').addChild(tip_layout1)
                tip_layout1.zIndex = 998
                tip_layout1.x = 0;tip_layout1.y=0
                tip_layout1.on(cc.Node.EventType.TOUCH_END, function (event) {})
                var tip_frame1 = cc.instantiate(self.confirm_frame);
                tip_frame1.zIndex = 999
                tip_frame1.x = 0; tip_frame1.y = 0
                cc.director.getScene().getChildByName('Canvas').addChild(tip_frame1)
                tip_frame1.getChildByName("xiao_hao").active = false
                var str_data = shop_data[this.i].commodityname.split(",")
                tip_frame1.getChildByName("content").getComponent(cc.RichText).string = "是否花费"+str_data[0]+"购买"+str_data[1]
                tip_frame1.getChildByName("content").y = 0
                tip_frame1.getChildByName("confirm").on(cc.Node.EventType.TOUCH_END, function (event) {
                     //购买
                    server.send({               
                        rid:"pay_get_order",          
                        subject:"PAY",          
                        cmd:"PAY_GET_ORDER",      
                        udid:gamedata.userid,      
                        req:{gid:parseInt(id)}            
                    })
                    gamedata.message_fun_map.set('pay_get_order',function(data){

                        cc.director.getScene().getChildByName('Canvas').removeChild(tip_frame1)
                        cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout1)
                    
                        var tip_layout = cc.instantiate(self.black_layer);
                        cc.director.getScene().getChildByName('Canvas').addChild(tip_layout)
                        tip_layout.zIndex = 998
                        tip_layout.x = 0;tip_layout.y=0
                        tip_layout.on(cc.Node.EventType.TOUCH_END, function (event) {})
                        var tip_frame = cc.instantiate(self.shop_frame);
                        tip_frame.zIndex = 999
                        tip_frame.x = 0; tip_frame.y = 0
                        cc.director.getScene().getChildByName('Canvas').addChild(tip_frame)

                    
                        tip_frame.getChildByName("num_1").x = 110    
                        tip_frame.getChildByName("goods_1").x = 40
                        tip_frame.getChildByName("goods_1").width = 70;tip_frame.getChildByName("goods_1").heigth=35
                        tip_frame.getChildByName("gxgh_label").x = -70
                        tip_frame.getChildByName("goods_2").active = false
                        tip_frame.getChildByName("num_2").active = false
                        tip_frame.getChildByName("goods_1").getComponent(cc.Sprite).spriteFrame = self.cat_res
                        tip_frame.getChildByName("num_1").getComponent(cc.Label).string = "X"+(data.data.overplus-gamedata.coin_label.getComponent(cc.Label).string)
                        tip_frame.getChildByName("confirm").on(cc.Node.EventType.TOUCH_END, function (event) {
                            cc.director.getScene().getChildByName('Canvas').removeChild(tip_frame)
                            cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout)
                            if(gamedata.coin_label){
                                gamedata.coin_label.getComponent(cc.Label).string =  data.data.overplus
                                gamedata.cat_paw_coin = data.data.overplus
                            }

                            server.send({               
                                rid:"pay_get_goods_list",  
                                subject:"PAY",          
                                cmd:"PAY_GET_GOODS_LIST",      
                                udid:gamedata.userid,      
                                req:{}            
                            })
                            gamedata.message_fun_map.set('pay_get_goods_list',function(data,code){
                                for(var k in data.data.goods_list){
                                    self.shop_server_data[data.data.goods_list[k].gid] = data.data.goods_list[k]
                                }
                                self.update_list(self.shop_conf_data)
                            })
                        })
                    })    
                })
                tip_frame1.getChildByName("cancel").on(cc.Node.EventType.TOUCH_END, function (event) {
                    cc.director.getScene().getChildByName('Canvas').removeChild(tip_frame1)
                    cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout1)
                })
            
            }.bind({i:i}));

            cat_num.getComponent(cc.Label).string = shop_data[i].number
            money.getComponent(cc.Label).string = shop_data[i].money+"元"
            if(shop_data[i].describe != ""){
                var s_data = shop_data[i].describe.split(",")
                send_lb.getComponent(cc.Label).string = s_data[1]
                first.active = true
            }else{
                first.active = false
                send_lb.active = false
            }  

            if(this.shop_server_data[shop_data[i].grade] && this.shop_server_data[shop_data[i].grade].charge != 0){
                if(shop_data[i].concession_description != ""){
                    var ss_data = shop_data[i].concession_description.split(",")
                    send_lb.getComponent(cc.Label).string = ss_data[1]
                    s_item.getChildByName("bianqian").getChildByName("label").getComponent(cc.Label).string = ss_data[0]
                }
            }
        }
    },
    start () {
        
    },

    // update (dt) {},
});
