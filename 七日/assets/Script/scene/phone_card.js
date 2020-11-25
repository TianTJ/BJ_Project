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
            R_btn: {
                default: null,
                type: cc.Button
            },
            SR_btn: {
                default: null,
                type: cc.Button
            },
            SSR_btn: {
                default: null,
                type: cc.Button
            },
            ALL_btn: {
                default: null,
                type: cc.Button
            },
            icon_sprite: {
                default: null,
                type: cc.Sprite 
            },
            back: {
                default: null,
                type: cc.Button
            },
            button_touch_1:{
                default: null,
                type: cc.SpriteFrame
            },
            button_touch_2:{
                default: null,
                type: cc.SpriteFrame 
            },
            r_spr: {
                default: null,
                type: cc.SpriteFrame 
            },
            sr_spr: {
                default: null,
                type: cc.SpriteFrame 
            },
            ssr_spr: {
                default: null,
                type: cc.SpriteFrame 
            },
            up_list: {
                default: null,
                type: cc.ScrollView
            },
            
        },
        onLoad () {
            
            var self = this
            this.schedule(function() {
                gamedata.heart_server();
            },100,cc.macro.REPEAT_FOREVER,0);
            self.back.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                cc.director.loadScene("main");
            });
            self.R_btn.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                self.R_btn.normalSprite = self.button_touch_1 
                self.SR_btn.normalSprite = self.button_touch_2 
                self.SSR_btn.normalSprite = self.button_touch_2 
                self.ALL_btn.normalSprite = self.button_touch_2
                gamedata.phone_card_type = 3 
                self.change_list(3)
            });
            self.SR_btn.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                self.R_btn.normalSprite = self.button_touch_2 
                self.SR_btn.normalSprite = self.button_touch_1
                self.SSR_btn.normalSprite = self.button_touch_2 
                self.ALL_btn.normalSprite = self.button_touch_2 
                gamedata.phone_card_type = 2
                self.change_list(2)
            });
            self.SSR_btn.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                self.R_btn.normalSprite = self.button_touch_2 
                self.SR_btn.normalSprite = self.button_touch_2 
                self.SSR_btn.normalSprite = self.button_touch_1 
                self.ALL_btn.normalSprite = self.button_touch_2 
                gamedata.phone_card_type = 1
                self.change_list(1)
            });
            self.ALL_btn.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                self.R_btn.normalSprite = self.button_touch_2 
                self.SR_btn.normalSprite = self.button_touch_2 
                self.SSR_btn.normalSprite = self.button_touch_2 
                self.ALL_btn.normalSprite = self.button_touch_1 
                gamedata.phone_card_type = 4
                self.change_list(4)
            });

            this.R_btn.node.active = false
            this.SR_btn.node.active = false
            this.SSR_btn.node.active = false

            this.phone_all_card = []
            this.have_phone_card = {}
            this.item_list = []
            this.role_conf = {} 
            this.card_id_conf = {}
            server.send({               
                     rid:"stat_phonecard_list",  
                     subject:"STAT",          
                     cmd:"STAT_PHONECARD_LIST",      
                     udid:gamedata.userid,      
                     req:{}            
            })
            gamedata.message_fun_map.set('stat_phonecard_list',function(data){
                gamedata.load_json_data("role",function(rdata){
                    gamedata.load_json_data("goods",function(adata){
                        for(var k in adata){
                            if(adata[k].type == "电话卡" && parseInt(adata[k].role)==gamedata.user_choice_id){
                                self.phone_all_card.push(adata[k])
                            }
                        }
    
                        self.phone_all_card.sort(function(a,b){
                            return a.quality - b.quality
                        })
                        for(var k in self.phone_all_card){
                            self.card_id_conf[self.phone_all_card[k].goodsid] = self.phone_all_card[k]
                        }
                        for(var k in rdata){
                            self.role_conf[rdata[k].user_id] = rdata[k]
                        }
                        for(var k in data.data.card_list){
                            if(data.data.card_list[k].pid){
                                self.have_phone_card[data.data.card_list[k].pid] = data.data.card_list[k]
                            }
                           
                        }
                        self.initui()
                        self.update_btn_sp(gamedata.phone_card_type)
                        self.change_list(gamedata.phone_card_type)
                    })
                })
            })
        },
        update_btn_sp: function(type){
            if(type==1){
                this.R_btn.normalSprite = this.button_touch_2 
                this.SR_btn.normalSprite = this.button_touch_2 
                this.SSR_btn.normalSprite = this.button_touch_1 
                this.ALL_btn.normalSprite = this.button_touch_2 
            }else if(type==2){
                this.R_btn.normalSprite = this.button_touch_2 
                this.SR_btn.normalSprite = this.button_touch_1
                this.SSR_btn.normalSprite = this.button_touch_2 
                this.ALL_btn.normalSprite = this.button_touch_2 
            }else if(type==3){
                this.R_btn.normalSprite = this.button_touch_1 
                this.SR_btn.normalSprite = this.button_touch_2 
                this.SSR_btn.normalSprite = this.button_touch_2 
                this.ALL_btn.normalSprite = this.button_touch_2
            }else if(type==4){
                this.R_btn.normalSprite = this.button_touch_2 
                this.SR_btn.normalSprite = this.button_touch_2 
                this.SSR_btn.normalSprite = this.button_touch_2 
                this.ALL_btn.normalSprite = this.button_touch_1 
            }
        },
        initui : function(){
            var self = this
            for(var k in this.role_conf){
                if(this.role_conf[k].user_id == gamedata.user_choice_id){
                    cc.loader.loadRes("icon/"+this.role_conf[k].icon,cc.SpriteFrame,function(err,texture){
                        self.icon_sprite.spriteFrame = texture
                    })
                }
            }

        },
        updatelist : function(card_data,show_data){
            var self = this
            var id_idx= 0
            var index = 0
            for(var k in card_data){index++}
            var s_width = parseInt(index/3)
            var y_item =  index%3
            //if(index>9){
                if(y_item == 0){
                    this.scrollview.height = 375*s_width+s_width*15
                }else{
                    this.scrollview.height = 375*(s_width+1)+(s_width+1)*15
                }
                cc.log( this.scrollview.height)
            //}
            for(var i=0;i<s_width;i++){
                for(var j=1;j<=3;j++){
                    var item = cc.instantiate(this.listPrefab);
                    item.id= card_data[id_idx].goodsid
                    this.scrollview.addChild(item)
                    item.x = -230+(j-1)*225
                    item.y = -187.5-i*385
                    this.item_list.push(item)
                    id_idx++
                }   
            }
            for(var m=0;m<y_item;m++){
                var item = cc.instantiate(this.listPrefab);
                this.scrollview.addChild(item)
                item.id = card_data[id_idx].goodsid
                item.x = -230+ m*225
                item.y = -187.5-s_width*385
                this.item_list.push(item)
                id_idx++
            }

            for(var k in this.item_list){
                var s_item = this.item_list[k]
                this.item_list[k].on(cc.Node.EventType.TOUCH_END, function (event) {
                    gamedata.phone_polt_id=this.item.id
                    var idx = 0
                    for(var k in self.have_phone_card){idx++}
                    if(idx==0){
                        if(gamedata.is_show_tip_move){
                            gamedata.showSysHint("","电话卡不足！");
                        }
                        return
                    }
                    if(!self.have_phone_card[this.item.id]){
                        if(gamedata.is_show_tip_move){
                            gamedata.showSysHint("","电话卡不足！");
                        }
                        return
                    }
                    if(self.have_phone_card[this.item.id] && self.have_phone_card[this.item.id].count < 1){
                        if(gamedata.is_show_tip_move){
                            gamedata.showSysHint("","电话卡不足！")
                        }
                        
                    }else{
                        cc.director.loadScene("Phone");
                    }
                }.bind({item:s_item}));

                var u_data = this.card_id_conf[this.item_list[k].id]

                var no_unlock = this.item_list[k].getChildByName('no_Unlock')
                var quality_spr = this.item_list[k].getChildByName('type_icon')
                quality_spr.active = false
                var title_name = this.item_list[k].getChildByName('name_lb')
                var card_num = this.item_list[k].getChildByName('green_img').getChildByName('num_card')
                var card_bg = this.item_list[k].getChildByName("phone_bg")

                
                if(this.have_phone_card[this.item_list[k].id]){
                    no_unlock.active = false
                }

                if(u_data.iconid){
                    cc.loader.load(gamedata.phone_photo_url+u_data.goodsid+".png"+gamedata.version_number,function(err,texture){
                        this.card_bg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        this.card_bg.width = 200;
                        this.card_bg.height = 315
                    }.bind({card_bg:card_bg}))
                }

                title_name.getComponent(cc.Label).string = u_data.nameitem
                if(u_data.quality == 1){
                    quality_spr.getComponent(cc.Sprite).spriteFrame = this.ssr_spr
                }else if(u_data.quality == 2){
                    quality_spr.getComponent(cc.Sprite).spriteFrame = this.sr_spr
                }else if(u_data.quality == 3){
                    quality_spr.getComponent(cc.Sprite).spriteFrame = this.r_spr
                }
                if(!this.have_phone_card){card_num.getComponent(cc.Label).string = 0}else{
                    if(this.have_phone_card[this.item_list[k].id]){
                        card_num.getComponent(cc.Label).string = this.have_phone_card[this.item_list[k].id].count
                    }else{
                        card_num.getComponent(cc.Label).string = 0
                    }
                }
            }
            //this.up_list.scrollToTop(0)
        },
        change_list: function(type){
            //type  1 SSR 2 SR 3 R 4 ALL
            this.scrollview.removeAllChildren()
            var temp = []
            if(type==4){
                this.updatelist(this.phone_all_card)
            }else{
                for(var k in this.phone_all_card){
                    if(this.phone_all_card[k].quality == type){
                        temp.push(this.phone_all_card[k])
                    }
                }
                this.updatelist(temp)
            }
        },
        start () {

        },

        // update (dt) {},
    });
