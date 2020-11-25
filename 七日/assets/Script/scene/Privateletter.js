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
        polt_blue_spr: {
            default: null,
            type: cc.SpriteFrame
        }, 
        role_name: {
            default: null,
            type: cc.Label
        },
    },
    onLoad: function(){
        var self = this
        self.back.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.director.loadScene("main");
        });
        this.initui()
    },
    initui : function(){

        var self = this
        this.letter_conf = {}
        this.role_conf = {} 
        this.stat_data = null
        this.letter_data = []
        this.show_letter_data = []
        this.list_num = 0
        //获取解锁私信id 
        server.send({               
                 rid:"stat_letter_list",  
                 subject:"STAT",          
                 cmd:"STAT_LETTER_LIST",      
                 udid:gamedata.userid,      
                 req:{}            
        })
        gamedata.message_fun_map.set('stat_letter_list',function(data){
            gamedata.load_json_data("role",function(rdata){
                gamedata.load_json_data("letters",function(sdata){
                    gamedata.load_json_data("letter_content",function(letter_data){
                        self.letter_data = letter_data

                        for(var k in sdata){
                            if(sdata[k].role == gamedata.user_choice_id){
                                self.letter_conf[sdata[k].privateletterid] = sdata[k]
                            }
                        }
                        for(var k in rdata){
                            self.role_conf[rdata[k].user_id] = rdata[k]
                        }
                        self.stat_data = data.data
                        for(var k in data.data.letter_list){
                            if(self.letter_conf[data.data.letter_list[k].lid] != null){
                                self.show_letter_data.push(data.data.letter_list[k])
                            }
                        }
                        self.updatelist(0)
                    })
                })
            })
        
        })
    },
    updatelist: function(idx){
        if(idx >= this.show_letter_data.length){return}
        this.role_name.node.getComponent(cc.Label).string = this.role_conf[gamedata.user_choice_id].name
        var self = this
        this.scrollview.height = 150*this.show_letter_data.length.length
        
            var item = cc.instantiate(this.listPrefab);
            this.scrollview.addChild(item)
           
            item.x = -375
            item.y = -75-idx*150

            item.id = this.show_letter_data[idx].lid
            //update ui
            var icon = item.getChildByName("icon_1")
            var name = item.getChildByName("name_lb")
            var time = item.getChildByName("time_lb")
            var title = item.getChildByName("content_lb")
            var news = item.getChildByName("new_xiaoxi")
            news.active = false
            var repeat = item.getChildByName("button")
            repeat.active = false
            var bg = item.getChildByName("lttm_tm")
            bg.on(cc.Node.EventType.TOUCH_END, function (event) {
                for(var k in self.show_letter_data){if(self.show_letter_data[k].lid==this.item.id){gamedata.polt_state=self.show_letter_data[k].stat}}
                if(self.get_is_unlosck(this.item.id) == 1){
                    //gamedata.polt_Whether_join = 1
                    gamedata.polt_state =0 
                    gamedata.polt_Whether_join = 0
                    gamedata.chat_scene_id = 2
                    gamedata.chat_room_polt_id = this.item.id
                    cc.director.loadScene("chat");
                }else if(self.get_is_unlosck(this.item.id) == 0){
                    gamedata.polt_Whether_join = 1
                    gamedata.chat_scene_id = 2
                    gamedata.chat_room_polt_id = this.item.id
                    cc.director.loadScene("chat");
                }
            }.bind({item:item}))

            var n_data = this.letter_conf[item.id]
            
            cc.loader.loadRes("icon/"+n_data.role,cc.SpriteFrame,function(err,texture){
                this.icon.getComponent(cc.Sprite).spriteFrame = texture
            }.bind({icon:icon}))

            name.getComponent(cc.Label).string = this.role_conf[n_data.role].name

            repeat.on(cc.Node.EventType.TOUCH_END, function (event) {
               
            }.bind({item:item}))

            var date = new Date(this.show_letter_data[idx].time)
            time.getComponent(cc.Label).string = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()

            if(this.get_now_polt_speed(this.show_letter_data) == item.id){
                news.active = true
                bg.getComponent(cc.Sprite).spriteFrame = this.polt_blue_spr
            }
            var g_data = []
            for(var k in this.letter_data){
                if(this.letter_data[k].linkid == item.id){
                    g_data.push(this.letter_data[k])
                }
            }
            if(this.show_letter_data[idx].stat==0){
                if(gamedata.get_str_lenght(g_data[0].content) > 5){
                    var str = g_data[0].content.substring(0,10)
                   title.getComponent(cc.Label).string = str + "..."
                }else{
                   title.getComponent(cc.Label).string = g_data[0].content
                }
                this.list_num++
                this.updatelist(this.list_num)
            }else{
                // 重播剧情获取玩家选择ID
                server.send({               
                         rid:"stat_story_user_select_get",  
                         subject:"STAT",          
                         cmd:"STAT_STORY_USER_SELECT_GET",      
                         udid:gamedata.userid,      
                         req:{sid:item.id}            
                    })
                gamedata.message_fun_map.set('stat_story_user_select_get',function(data){
                     var id = data.data.talk_list[data.data.talk_list.length-1]
                     for(var k in this.g_data){
                         if(this.g_data[k].contentid == id){
                             if(gamedata.get_str_lenght(this.g_data[k].content) > 5){
                                 var str = this.g_data[k].content.substring(0,10)
                                this.title.getComponent(cc.Label).string = str + "..."
                             }else{
                                this.title.getComponent(cc.Label).string = this.g_data[k].content
                             }
                         }
                     }
                     self.list_num++
                     self.updatelist(self.list_num)
                }.bind({title:title,g_data:g_data}))
        }
    },
    get_is_unlosck: function(id){
        for(var k in this.stat_data.letter_list){
            if(this.stat_data.letter_list[k].lid == id && this.stat_data.letter_list[k].stat==1){
                return 1
            }else if(this.stat_data.letter_list[k].lid == id && this.stat_data.letter_list[k].stat==0){
                return 0
            }
        }
    },
    get_now_polt_speed : function(data){
        var stat = []
        for(var k in data){
            if(data[k].stat == 0){
                stat.push(data[k])
            }
        }
        stat.sort(function(a,b){
            return a.lid - b.lid
        })
        if(stat.length != 0){
            return stat[0].lid
        }
        return null
    },
    start () {

    },

    // update (dt) {},
});
