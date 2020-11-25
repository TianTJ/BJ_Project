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
        spr_1001:{
            default: null,
            type: cc.SpriteFrame
        },
        spr_1002:{
            default: null,
            type: cc.SpriteFrame
        },
        spr_1003:{
            default: null,
            type: cc.SpriteFrame
        },
        spr_1004:{
            default: null,
            type: cc.SpriteFrame
        }
    },
    onLoad: function(){
        var self = this
        this.role_conf = []

        this.get_letter_data = null
        this.get_pokedex_data = null
        this.get_phonecard_data = null
        this.letter_data = null
        this.pokedex_data = null
        this.phonecard_data = null
        this.schedule(function() {
            gamedata.heart_server();
        },15,cc.macro.REPEAT_FOREVER,0);
        
        server.send({               
                 rid:"stat_pokedex_list",  
                 subject:"STAT",          
                 cmd:"STAT_POKEDEX_LIST",      
                 udid:gamedata.userid,      
                 req:{}            
        })
        
        gamedata.message_fun_map.set('stat_pokedex_list',function(p_data){
            self.get_pokedex_data = p_data
            self.loadjson()
        })
    },
    loadjson: function(){
        var init_num = 1 //data刷新会请求在这块接收
        var self = this
        server.send({               
                 rid:"stat_letter_list",  
                 subject:"STAT",          
                 cmd:"STAT_LETTER_LIST",      
                 udid:gamedata.userid,      
                 req:{}            
        })
        gamedata.message_fun_map.set('stat_letter_list',function(l_data){
            server.send({               
                     rid:"stat_phonecard_list",  
                     subject:"STAT",          
                     cmd:"STAT_PHONECARD_LIST",      
                     udid:gamedata.userid,      
                     req:{}            
            })
            gamedata.message_fun_map.set('stat_phonecard_list',function(ph_data){
                if(init_num==1){
                    self.get_phonecard_data = ph_data
                    self.get_letter_data = l_data
                    gamedata.load_json_data("role",function(rdata){
                        gamedata.load_json_data("letters",function(l_data){
                            gamedata.load_json_data("album",function(p_data){
                                gamedata.load_json_data("phone",function(ph_data){
                                    for(var k in rdata){self.role_conf.push(rdata[k])}
                                    self.role_conf.sort(function(a,b){
                                        return a.user_id - b.user_id
                                    })
                                    self.role_conf.reverse()
                                    self.letter_data = l_data
                                    self.pokedex_data = p_data
                                    self.phonecard_data = ph_data
                                    self.initui()
                                })
                            })
                        })
                    })
                }
                init_num++
            })
        })
    },
    initui : function(){
        var self = this
        var list_num = 0
        this.scrollview.height = 250*this.role_conf.length
        for(var k=0;k<this.role_conf.length;k++){
            var loading_all_num = 0
            var have_all_num = 0
            var item = cc.instantiate(this.listPrefab);
            this.scrollview.addChild(item)
            item.x = -375
            item.y = -125-k*250

            var icon = item.getChildByName("img_1")
            var name = item.getChildByName("name_lb")
            var loadbar = item.getChildByName('loadbar')

            var my_private =  []
            var my_phone = []
            var my_album = []

            //初始化loadbar
            for(var k1 in this.letter_data){
                if(this.letter_data[k1].role == this.role_conf[k].user_id){
                    loading_all_num++
                }
            }
            for(var k2 in this.pokedex_data){
                if(this.pokedex_data[k2].role == this.role_conf[k].user_id){
                    loading_all_num++
                }
            }
            for(var k3 in this.phonecard_data){
                if(this.phonecard_data[k3].role == this.role_conf[k].user_id){
                    loading_all_num++
                }
            }

            if(this.get_letter_data.data.letter_list.length){
                for(var k4 in this.get_letter_data.data.letter_list){
                    for(var h1 in this.letter_data){
                        if(this.get_letter_data.data.letter_list[k4].lid == this.letter_data[h1].privateletterid && this.role_conf[k].user_id==this.letter_data[h1].role){
                            my_private.push(this.get_letter_data.data.letter_list[k4])
                            have_all_num++
                        }
                    }
                }
            }
            if(this.get_pokedex_data.data.pokedex_list.length){
                for(var k5 in this.get_pokedex_data.data.pokedex_list){
                    for(var h2 in this.pokedex_data){
                        if(this.get_pokedex_data.data.pokedex_list[k5] == this.pokedex_data[h2].pokedexid && this.role_conf[k].user_id==this.pokedex_data[h2].role){
                            my_album.push(this.get_pokedex_data.data.pokedex_list[k5])
                            have_all_num++
                        }
                    }
                }
            }

            var p_card_l = []
            for(var qk1 in this.phonecard_data){
                if(this.phonecard_data[qk1].role == this.role_conf[k].user_id){
                    var pp_d = this.phonecard_data[qk1].consume.split(",")
                    p_card_l.push(pp_d[0])
                }
            }
            if(this.get_phonecard_data.data || this.get_phonecard_data.data.card_list.length){
                for(var k6 in this.get_phonecard_data.data.card_list){
                    for(var h3 in p_card_l){
                        if(this.get_phonecard_data.data.card_list[k6].pid && this.get_phonecard_data.data.card_list[k6].pid == p_card_l[h3]){
                            my_phone.push(this.get_phonecard_data.data.card_list[k6])
                            have_all_num++
                        }
                    }
                }
            }
            loadbar.getComponent(cc.ProgressBar).progress = have_all_num/loading_all_num

            item.id = this.role_conf[k].user_id
            name.getComponent(cc.Label).string = this.role_conf[k].name
            if(this.role_conf[k].user_id==1001){
                icon.getComponent(cc.Sprite).spriteFrame = this.spr_1001
            }else if(this.role_conf[k].user_id==1002){
                icon.getComponent(cc.Sprite).spriteFrame = this.spr_1002
            }else if(this.role_conf[k].user_id==1003){
                icon.getComponent(cc.Sprite).spriteFrame = this.spr_1003
            }else if(this.role_conf[k].user_id==1004){
                icon.getComponent(cc.Sprite).spriteFrame = this.spr_1004
            }

            var letter_btn = item.getChildByName("sixin_button")
            var phone_btn = item.getChildByName("dianhua_button")
            var album_btn = item.getChildByName("xiangce_button")
            letter_btn.getChildByName("new_img").active = false
            phone_btn.getChildByName("new_img").active = false
            album_btn.getChildByName("new_img").active = false

            //判断是否有新东西
            for(var sk in my_private){
                if(my_private[sk].stat == 0){
                    letter_btn.getChildByName("new_img").active = true
                    break
                }
            }

            for(var dk in my_phone){
                if(my_phone[dk].count > 0){
                    phone_btn.getChildByName("new_img").active = true
                    break
                }
            }
            for(var ak in my_album){
                album_btn.getChildByName("new_img").active = true
                break
            }
            // server.send({               
            //          rid:"common_thing_list",  
            //          subject:"COMMON",          
            //          cmd:"COMMON_THING_LIST",      
            //          udid:gamedata.userid,      
            //          req:{}            
            // })
            // gamedata.message_fun_map.set('common_thing_list',function(h_data){
            //     for(var k in h_data.data.thing_list){
            //         if(h_data.data.thing_list[k].tid == 6600005){
            //             for(var k1 in self.role_conf){
            //                 if(self.role_conf[k1].user_id == h_data.data.thing_list[k].count){
            //                     this.album_btn.getChildByName("new_img").active = true
            //                     break
            //                 }
            //             }
            //         }
            //     }
            // }.bind({album_btn:album_btn}))

            letter_btn.on(cc.Node.EventType.TOUCH_END, function (event) {
                var letter_conf = {}
                var s_item = this.item
                server.send({               
                         rid:"stat_letter_list",  
                         subject:"STAT",          
                         cmd:"STAT_LETTER_LIST",      
                         udid:gamedata.userid,      
                         req:{}            
                })
                gamedata.message_fun_map.set('stat_letter_list',function(data){
                    var k_item = this.s_item
                    gamedata.load_json_data("letters",function(sdata){
                        for(var k in sdata){
                            if(sdata[k].role == this.k_item.id){
                                letter_conf[sdata[k].privateletterid] = sdata[k]
                            }
                        }
                        var show_data = []
                        for(var k in data.data.letter_list){
                            if(letter_conf[data.data.letter_list[k].lid] != null){
                                show_data.push(data.data.letter_list[k])
                            }
                        }
                        if(show_data.length==0){
                            if(gamedata.is_show_tip_move){
                                gamedata.showSysHint("","还没有私信！")
                            }
                        }else{
                            gamedata.user_choice_id = this.k_item.id
                            gamedata.main_scene_id = 2
                            cc.director.loadScene("Privateletter");
                        }
                    }.bind({k_item:k_item}))
                }.bind({s_item:s_item}))
            }.bind({item:item}));
            phone_btn.on(cc.Node.EventType.TOUCH_END, function (event) {
                gamedata.user_choice_id = this.item.id
                gamedata.main_scene_id = 2
                gamedata.phone_card_type = 4
                cc.director.loadScene("Phone_Card");
            }.bind({item:item}));
            album_btn.on(cc.Node.EventType.TOUCH_END, function (event) {
                gamedata.user_choice_id = this.item.id
                gamedata.main_scene_id = 2
                cc.director.loadScene("Album");
            }.bind({item:item}));
        }

    },
    start () {

    },

    // update (dt) {},
});
