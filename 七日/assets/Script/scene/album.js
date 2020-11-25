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
            back: {
                default: null,
                type: cc.Button
            },
            name_label: {
                default: null,
                type: cc.Label
            },
            icon: {
                default: null,
                type: cc.Sprite
            },
            head_bg: {
                default: null,
                type: cc.Sprite
            },
            heaad_bg: {
                default: null,
                type: cc.SpriteFrame
            },
            scale_bg: {
                default: null,
                type: cc.Prefab
            },
        },
        onLoad: function(){
            this.schedule(function() {
                gamedata.heart_server();
            },100,cc.macro.REPEAT_FOREVER,0);
            this.album_conf = {}
            this.role_conf = {} 
            this.item_list = []

            var self = this
            self.back.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                cc.director.loadScene("main");
            });

            //看到新物品，新物品变为0
            // server.send({               
            //     rid:"common_thing_consume", 
            //     subject:"COMMON",          
            //     cmd:"COMMON_THING_CONSUME",      
            //     udid:gamedata.userid,      
            //     req:{thing_list:[6600005,-1000]}            
            // })
            // gamedata.message_fun_map.set('common_thing_consume',function(data){
                
            // })

            server.send({               
                     rid:"stat_pokedex_list",  
                     subject:"STAT",          
                     cmd:"STAT_POKEDEX_LIST",      
                     udid:gamedata.userid,      
                     req:{}            
            })
            gamedata.message_fun_map.set('stat_pokedex_list',function(data){
                gamedata.load_json_data("role",function(rdata){
                    gamedata.load_json_data("album",function(adata){
                        var id_conf_data = []
                        for(var k in adata){
                            if(adata[k].role == gamedata.user_choice_id){
                                self.album_conf[adata[k].pokedexid] = adata[k]
                                id_conf_data.push(adata[k])
                            }
                        }
                        for(var k in rdata){
                            self.role_conf[rdata[k].user_id] = rdata[k]
                        }
                        var show_data = []
                        for(var k in data.data.pokedex_list){
                            if(self.album_conf[data.data.pokedex_list[k]] != null){
                                show_data.push(self.album_conf[data.data.pokedex_list[k]])
                            }
                        }
                        self.initui(id_conf_data)
                        self.updatelist(show_data)
                    })
                })
            })
        },
        initui : function(data){
            var self = this
            var id_idx= 0
            var index = 0
            for(var k in this.album_conf){index++}
            var s_width = parseInt(index/3)
            var y_item =  index%3
            if(y_item == 0){
                this.scrollview.height = 311*s_width+s_width*20
            }else{
                this.scrollview.height = 311*(s_width+1)+(s_width+1)*20
            }
            for(var i=0;i<s_width;i++){
                for(var j=1;j<=3;j++){
                    var item = cc.instantiate(this.listPrefab);
                    item.id= data[id_idx].pokedexid
                    this.scrollview.addChild(item)
                    item.x = -210+(j-1)*210
                    item.y = -155.5-i*330
                    this.item_list.push(item)
                    id_idx++
                }   
            }
            for(var m=0;m<y_item;m++){
                var item = cc.instantiate(this.listPrefab);
                this.scrollview.addChild(item)
                item.id= data[id_idx].pokedexid
                item.x = -210+ m*210
                item.y = -155.5-s_width*330
                this.item_list.push(item)
                id_idx++
            }
            for(var k in this.role_conf){
                if(this.role_conf[k].user_id == gamedata.user_choice_id){
                    this.name_label.string = this.role_conf[k].name
                    cc.loader.loadRes("icon/"+this.role_conf[k].icon,cc.SpriteFrame,function(err,texture){
                        self.icon.spriteFrame = texture
                    })
                }
            }

        },
        updatelist: function(s_data){
            var self = this
            for(var k in this.item_list){
                var icon = this.item_list[k].getChildByName("unlock")
                var lock_lb = this.item_list[k].getChildByName("unlock_lb")
                for(var k1 in s_data){
                    if(s_data[k1].pokedexid == this.item_list[k].id){
                        cc.loader.load(gamedata.album_photo_url+s_data[k1].address+".png"+gamedata.version_number,function(err,texture){
                            this.icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                            this.icon.width = 175;
                            this.icon.height = 311
                            this.lock_lb.active = false
                        }.bind({icon:icon,lock_lb:lock_lb}))
                    }
                }

                var is_show = false
                
                icon.on(cc.Node.EventType.TOUCH_END, function (event) {
                    var is_unlock = false
                    if(!is_show){
                        for(var k1 in s_data){
                            if(s_data[k1].pokedexid == self.item_list[this.k].id){
                                is_show = true
                                var s_sp = cc.instantiate(self.scale_bg);
                                s_sp.x = 0;s_sp.y = 0
                                s_sp.getChildByName("album_spr").width=750;s_sp.getChildByName("album_spr").height=1334
                                s_sp.scale = 0.8
                                s_sp.getChildByName("album_spr").getComponent(cc.Sprite).spriteFrame = this.icon.getComponent(cc.Sprite).spriteFrame
                                cc.director.getScene().getChildByName('Canvas').addChild(s_sp)
                                s_sp.runAction(cc.scaleTo(0.1,1,1))
                                s_sp.on(cc.Node.EventType.TOUCH_END, function (event) {
                                    s_sp.runAction(cc.sequence(cc.scaleTo(0,0,0),cc.callFunc(function(){
                                        cc.director.getScene().getChildByName('Canvas').removeChild(s_sp)
                                        is_show = false
                                    })))
                                })
                                is_unlock = true
                            }
                        }
                    }else{
                        return
                    }
                    if(!is_unlock){gamedata.showSysHint("","还没解锁！")}
                }.bind({k:k,icon:icon}))
            }
        },
        start () {

        },

        // update (dt) {},
    });
