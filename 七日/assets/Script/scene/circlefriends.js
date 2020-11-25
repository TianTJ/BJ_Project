var gamedata = require('data');
var server = require('server')
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
        release: {
            default: null,
            type: cc.Button
        },
        red_heart:{
            default: null,
            type: cc.SpriteFrame
        },
        white_heart: {
            default: null,
            type: cc.SpriteFrame
        },
        palyer_choice: {
            default: null,
            type: cc.Prefab
        },
        gray_spr:{
            default: null,
            type: cc.SpriteFrame
        },
        black_ly:{
            default: null,
            type: cc.Prefab
        },
        loading: {
            default: null,
            type: cc.Prefab
        },
        scale_bg:{
            default: null,
            type: cc.Prefab
        },
        ss_layout:{
            default: null,
            type: cc.Node
        }
    },
    onLoad () {

        this.add_Loading()
        this.schedule(function() {
            gamedata.heart_server();
        },15,cc.macro.REPEAT_FOREVER,0);
        var self = this
        self.release.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            var id = self.getshowdata()
            if(self.friend_touch_data){
                for(var k in self.friend_touch_data.data.thing_list){
                    if(self.friend_touch_data.data.thing_list[k].tid == id){
                        if(self.friend_touch_data.data.thing_list[k].count == 0){
                            if(gamedata.is_show_tip_move){
                                gamedata.showSysHint("","已经没有了哦！")
                            }
                            return
                        }
                    }
                }
            }
            
            if(id==0){
                if(gamedata.is_show_tip_move){
                    gamedata.showSysHint("","已经没有了哦！")
                }
                return
            }else{
                self.show_choice_frame(self.circlefriends_conf[id],1)
            }
        })
        
        server.send({               
            rid:"stat_moments_list",          
            subject:"STAT",          
            cmd:"STAT_MOMENTS_LIST",      
            udid:gamedata.userid,      
            req:{times:1}            
        })
        this.show_dynamic_id_conf = {}  //朋友圈状态数据
        this.circlefriends_conf = {}    //朋友圈表
        this.show_dynamic_conf = []     //p朋友圈数据
        this.friend_comment_conf = null
        this.role_conf = {}
        this.play_choice_data = []
        this.friend_touch_data = null
        var index = 0   //updatelist会有执行两次的概率 没时间找bug 暂时控制

        this.now_herart_unit = {}
    
        gamedata.message_fun_map.set('stat_moments_list',function(data){
            if(data.data.length != 0){
                gamedata.load_json_data("circlefriends",function(f_data){
                    gamedata.load_json_data("role",function(r_data){
                        gamedata.load_json_data("friend_comment",function(g_data){
                            server.send({               
                                     rid:"common_thing_list",  
                                     subject:"COMMON",          
                                     cmd:"COMMON_THING_LIST",      
                                     udid:gamedata.userid,      
                                     req:{}            
                            })
                            gamedata.message_fun_map.set('common_thing_list',function(h_data){
                                index++
                                if(index==1){
    
                                    for(var k in data.data){self.show_dynamic_id_conf[data.data[k].mid] = data.data[k]}
                                    self.show_dynamic_conf = data.data
                                   
                                    for(var k in f_data){
                                        self.circlefriends_conf[f_data[k].circlefriendsid] = f_data[k]
                                    }
                                    for(var k1 in r_data){
                                        self.role_conf[r_data[k1].user_id] = r_data[k1]
                                    }
                                    for(var lk in h_data.data.thing_list){
                                        if(h_data.data.thing_list[lk].tid && self.circlefriends_conf[h_data.data.thing_list[lk].tid] && h_data.data.thing_list[lk].count==1){
                                            self.play_choice_data.push(h_data.data.thing_list[lk])
                                        }
                                    }
                                    self.release_res()  
                                    self.friend_comment_conf = g_data;
                                    self.update_list()
                                    if(cc.director.getScene().getChildByName('Canvas').getChildByName("loading_black_frame")){
                                        cc.director.getScene().getChildByName('Canvas').removeChild(cc.director.getScene().getChildByName('Canvas').getChildByName("loading_black_frame"),true)
                                    }
                                    if(cc.director.getScene().getChildByName('Canvas').getChildByName("loading_frame")){
                                        cc.director.getScene().getChildByName('Canvas').removeChild(cc.director.getScene().getChildByName('Canvas').getChildByName("loading_frame"),true)
                                    }
                                }
                            })
                        })
                    })
                })
            }
           
        })
    },
    release_res: function(){
        // cc.loader.releaseRes("json/circlefriends");
        // cc.loader.releaseRes("json/role");
        // cc.loader.releaseRes("json/friend_comment"); 
    },
    update_list: function(){
        gamedata.judge_news()
        var scrollview_height = 0
        var posy = 0
        var self = this

        var conf = []
       
        for(var i=0;i<this.show_dynamic_conf.length;i++){
            var no_choice_data = []
            var player_choice_data = []
            var circle_data = this.circlefriends_conf[this.show_dynamic_conf[i].mid]
            var role_data = this.role_conf[circle_data.role]
            var stat_data = this.show_dynamic_id_conf[circle_data.circlefriendsid]

            var id_comment_conf = this.convert_comment_data(circle_data.comment)    //所有当前动态评论id模式

            for(var k in this.friend_comment_conf){
                if(this.friend_comment_conf[k].linkid == circle_data.comment){
                    if(this.friend_comment_conf[k].role != 1){
                        no_choice_data.push(this.friend_comment_conf[k])
                    }else{
                        player_choice_data.push(this.friend_comment_conf[k])
                    }
                }
            }
           
            var item = cc.instantiate(this.listPrefab);
            this.scrollview.addChild(item)

            item.id = circle_data.circlefriendsid

            var title_ly = item.getChildByName("title_layout")
            var img_ly = item.getChildByName("img_layout")
            var comment_ly = item.getChildByName("comment_layout")
            var division_line = item.getChildByName("fengexian")
            if(circle_data.picture){
                // 有图片
                var is_show = false
                var pi_data = circle_data.picture.split(",")
                 for(var il=1;il<=3;il++){
                     //getChildByName("scrollview_"+il).
                        var img = img_ly.getChildByName("view_"+il).getChildByName("img")
                        if(pi_data[il-1]==6100401){
                            img.width=147;img.height=167.74
                        }else if(pi_data[il-1]==6100301){
                            img.width=147;img.height=103.8
                        }else if(pi_data[il-1]==6100402){
                            img.width=147;img.height=194.23
                        }else if(pi_data[il-1]==6100403){
                            img.width=147;img.height=110.25
                        }else{
                            img.width=147;img.height=225.5
                        }            
                        if(pi_data[il-1]){
                            cc.loader.load(gamedata.friend_photo_url+pi_data[il-1]+".png"+gamedata.version_number,function(err,texture){
                                this.img.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                            }.bind({img:img}))
                            img.on(cc.Node.EventType.TOUCH_END, function (event) {
                                if(event.touch._point.y > 965){return}
                                if(!is_show){
                                    is_show = true
                                    var tip_layout = cc.instantiate(self.black_ly);
                                    tip_layout.opacity = 255
                                    cc.director.getScene().getChildByName('Canvas').addChild(tip_layout)
                                    tip_layout.x = 0;tip_layout.y=0
                                    var s_sp = cc.instantiate(self.scale_bg);
                                    s_sp.x = 0;s_sp.y = 0
                                    if(this.pi_data[0]==6100401){
                                        s_sp.getChildByName("album_spr").width=750;s_sp.getChildByName("album_spr").height=856
                                    }else if(this.pi_data[0]==6100301){
                                        s_sp.getChildByName("album_spr").width=750;s_sp.getChildByName("album_spr").height=530
                                    }else if(this.pi_data[0]==6100402){
                                        s_sp.getChildByName("album_spr").width=750;s_sp.getChildByName("album_spr").height=991
                                    }else if(this.pi_data[0]==6100403){
                                        s_sp.getChildByName("album_spr").width=750;s_sp.getChildByName("album_spr").height=562.5
                                    }else{
                                        s_sp.getChildByName("album_spr").width=750;s_sp.getChildByName("album_spr").height=1334
                                    }                                   
                                    s_sp.scale = 0.8
                                    s_sp.getChildByName("album_spr").getComponent(cc.Sprite).spriteFrame = this.icon.getComponent(cc.Sprite).spriteFrame
                                    cc.director.getScene().getChildByName('Canvas').addChild(s_sp)
                                    s_sp.runAction(cc.scaleTo(0.2,1,1))
                                    s_sp.on(cc.Node.EventType.TOUCH_END, function (event) {
                                        s_sp.runAction(cc.sequence(cc.scaleTo(0,0,0),cc.callFunc(function(){
                                            cc.director.getScene().getChildByName('Canvas').removeChild(s_sp)
                                            cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout)
                                            is_show = false
                                        })))
                                    })
                                    tip_layout.on(cc.Node.EventType.TOUCH_END, function (event) {
                                        s_sp.runAction(cc.sequence(cc.scaleTo(0,0,0),cc.callFunc(function(){
                                            cc.director.getScene().getChildByName('Canvas').removeChild(s_sp)
                                            cc.director.getScene().getChildByName('Canvas').removeChild(tip_layout)
                                            is_show = false
                                        })))
                                    })
                                }else{
                                    return
                                }
                            }.bind({pi_data:pi_data,icon:img}))
                          
                        }else{
                            img_ly.getChildByName("view_"+il).active = false
                        }

                    }
                // if(pi_data.length==1){
                   
                //     for(var m=1;m<=3;m++){
                //         var img = img_ly.getChildByName("img_"+m)
                //         img.active = false
                //         if(m==2){
                //             img.active = true
                //             cc.loader.load(gamedata.friend_photo_url+pi_data[0]+".png"+gamedata.version_number,function(err,texture){
                //                 var kkk = img_ly.getChildByName("img_2")
                //                 this.img.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                //             }.bind({img:img}))
                //         }
                //     }
                // }else if(pi_data.length==1){
                //     img_ly.getChildByName("img_1").x = -103
                //     img_ly.getChildByName("img_3").x = 103
                //     img_ly.getChildByName("img_2").active = false
                //     var idx = 0
                //     for(var m=1;m<=3;m++){
                //         idx++
                //         var img = img_ly.getChildByName("img_"+m)
                //         img.active = false
                //         if(m!=1){
                //             img.active = true
                //             cc.loader.load(gamedata.friend_photo_url+pi_data[idx]+".png"+gamedata.version_number,function(err,texture){
                //                 var kkk = img_ly.getChildByName("img_2")
                //                 this.img.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                //             }.bind({img:img}))
                //         }
                //     }
                // }else{
                   
                // }
                if(i!=(this.show_dynamic_conf.length-1) && i==0){posy+=680}
            }else{
                //删除图片layout
                item.removeChild(img_ly)
                //修改尺寸，位置 -340(评论容器当前位置) 680:(总容器高度) 140(图片容器高度)
                title_ly.y = 0
                comment_ly.y = -340+ img_ly.height
                item.height = 680 - 140
                if(i==0){posy+=item.height}
            }
            //主体内容
            var role_name = title_ly.getChildByName("name")
            var content_time = title_ly.getChildByName("time")
            var spot_heart = title_ly.getChildByName("dz_heart")
            var leav_message = title_ly.getChildByName("ly")
            var role_icon = title_ly.getChildByName("icon")
            var f_stat = title_ly.getChildByName("wdxts") 
            var content = title_ly.getChildByName("content") 
            var time = title_ly.getChildByName("time")
            var heart_num = title_ly.getChildByName("heart_num") 
            if(player_choice_data.length==0){
                leav_message.active = false
            }

            heart_num.getComponent(cc.Label).string = parseInt(circle_data.fabulous) + parseInt(stat_data.ups)
            this.now_herart_unit[item.id] = stat_data.ups
            
            var date = new Date(stat_data.time)
            time.getComponent(cc.Label).string = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()
            
            //判断留言按钮是否显示  
            var player_comment_data = stat_data.rids.split(",")
            for(var k in player_comment_data){
                if(player_comment_data[k]==1){
                    leav_message.getComponent(cc.Sprite).spriteFrame = this.gray_spr
                    break
                }
            }

            leav_message.on(cc.Node.EventType.TOUCH_END, function (event) {
                var player_comment_data = this.stat_data.rids.split(",")
                for(var k in player_comment_data){
                    if(player_comment_data[k]==1){
                        if(gamedata.is_show_tip_move){
                            gamedata.showSysHint("","已经没有了哦！")
                        }
                        return
                    }
                }
                if(gamedata.get_str_lenght(this.item.id) > 4){
                    self.show_choice_frame(this.player_choice_data[0],2,this.item.id)
                }else{
                    //玩家发布的动态s
                    self.show_choice_frame(this.player_choice_data,2,this.item.id)
                }
            }.bind({item:item,player_choice_data:player_choice_data,stat_data:stat_data}))
            title_ly.getChildByName("dz_heart_touch").on(cc.Node.EventType.TOUCH_END, function (event) {
                //点赞
                if(self.now_herart_unit[this.item.id]){
                    this.spot_heart.getComponent(cc.Sprite).spriteFrame = self.white_heart
                    this.heart_num.getComponent(cc.Label).string = this.heart_num.getComponent(cc.Label).string-1
                    self.now_herart_unit[this.item.id] = 0
                    server.send({               
                        rid:"stat_moments_up",          
                        subject:"STAT",          
                        cmd:"STAT_MOMENTS_UP",      
                        udid:gamedata.userid,      
                        req:{moments_id:parseInt(this.item.id),up_list:[1,-1]}            
                    })
                    gamedata.message_fun_map.set('stat_moments_up',function(data){}.bind(this)) 
                }else{
                    this.spot_heart.getComponent(cc.Sprite).spriteFrame = self.red_heart
                    this.heart_num.getComponent(cc.Label).string = this.heart_num.getComponent(cc.Label).string+1
                    self.now_herart_unit[this.item.id] = 1
                    server.send({               
                        rid:"stat_moments_up",          
                        subject:"STAT",          
                        cmd:"STAT_MOMENTS_UP",      
                        udid:gamedata.userid,      
                        req:{moments_id:parseInt(this.item.id),up_list:[1,1]}            
                    })
                    gamedata.message_fun_map.set('stat_moments_up',function(data){}.bind(this))    
                }
            }.bind({spot_heart:spot_heart,item:item,heart_num:heart_num}));

            if(stat_data.ups >= 1){
                spot_heart.getComponent(cc.Sprite).spriteFrame = this.red_heart
            }

            if(circle_data.role==1){
                role_name.getComponent(cc.Label).string = gamedata.username
            }else{
                role_name.getComponent(cc.Label).string = role_data.name
                cc.loader.loadRes("icon/"+role_data.icon,cc.SpriteFrame,function(err,texture){
                    this.role_icon.getComponent(cc.Sprite).spriteFrame = texture
                }.bind({role_icon:role_icon}))
            }
            content.getComponent(cc.RichText).string = circle_data.content

            //评论内容
            var comment_data = stat_data.cids.split(",")    //当前动态评论id列表
            var comment_role = stat_data.rids.split(",")    //评论用户id列表
            var role_comment_index = 0

            var di_l = comment_ly.getChildByName("layout")
            comment_ly.height = comment_data.length*40
            di_l.height = comment_data.length*40

            for(var si=0;si<8;si++){
                var c_lb = comment_ly.getChildByName("comment_lb_"+(si+1))
                if(si<8){
                    var xian = comment_ly.getChildByName("pl_fengexian_"+(si+1))
                }
                if(comment_data[si]){
                    if(comment_role[si] == 9999){
                        var n_str = ''
                        var t_dd = no_choice_data[role_comment_index].replycontent.split(',')
                        if(t_dd[0] = comment_data[si]){
                            var n_dd =no_choice_data[role_comment_index].replyperson.split(',')
                            n_str= "<color=#f87e93>"+this.role_conf[n_dd[0]].name+"</c>"+"回复"+"<color=#f87e93>"+this.role_conf[n_dd[1]].name+"</c>"
                        }
                        c_lb.getComponent(cc.RichText).string = n_str + ":  "+id_comment_conf[comment_data[si]]
                        role_comment_index++
                    }else if(comment_role[si] == 1){
                        if(gamedata.get_str_lenght(circle_data.circlefriendsid) < 4){
                            for(var k6 in player_choice_data){
                                var replycontent = player_choice_data[k6].replycontent.split(",")
                                if(replycontent[0] == comment_data[si]){
                                    var replyperson = player_choice_data[k6].replyperson.split(',')[1]
                                    c_lb.getComponent(cc.RichText).string = "<color=#ff9e2b>"+gamedata.username+"</c>" +"回复"+"<color=#f87e93>"+this.role_conf[replyperson].name+"</c>"+ ":  "+id_comment_conf[comment_data[si]]
                                }
                            }
                        }else{
                            c_lb.getComponent(cc.RichText).string = "<color=#ff9e2b>"+gamedata.username+"</c>" + ":  "+id_comment_conf[comment_data[si]]
                        }
                    }else if(comment_role[si] == 8888){
                        if(player_choice_data[0].replyperson){
                            var r_op = player_choice_data[0].replyperson.split(",")
                            c_lb.getComponent(cc.RichText).string =  "<color=#f87e93>"+this.role_conf[r_op[0]].name+"</c>" +"回复"+"<color=#ff9e2b>"+gamedata.username+"</c>" + ":  "+id_comment_conf[comment_data[si]]
                        }
                    }else{
                        c_lb.getComponent(cc.RichText).string = "<color=#f87e93>"+this.role_conf[comment_role[si]].name+"</c>"+":  "+id_comment_conf[comment_data[si]]
                    }
                    if(xian)xian.active = true
                }else{
                    if(xian)xian.active = false
                    comment_ly.removeChild(c_lb)
                }
            }
            item.height -= (8-comment_data.length)*40
            if(i==0)posy-=(8-comment_data.length)*40
            item.x = 0
            if(i==0){
                item.y = 0
            }else{
                item.y = -posy
                posy+=item.height
            }
            division_line.y = -(item.height-2)
            scrollview_height+=item.height
        }
        this.scrollview.height = scrollview_height+(this.show_dynamic_conf.length*10)
    },
    getshowdata: function(){
        //获取发布动态id
        if(this.play_choice_data.length == 0){
            return 0
        }
        this.play_choice_data.sort(function(a,b){
            return a.tid - b.tid
        })
        return this.play_choice_data[0].tid
    },  
    show_choice_frame: function(data,type,id){
        var self = this
        var item = cc.instantiate(this.palyer_choice);
        cc.director.getScene().getChildByName('Canvas').addChild(item)
        item.x = 0
        item.y = 0
        item.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.director.getScene().getChildByName('Canvas').removeChild(item)
        })
        var tip = item.getChildByName("tip")
        
        if(type==1){
            //发布
            for(var i=1;i<=3;i++){
                var frame = tip.getChildByName("xaunxiang_"+i)
                var lb = frame.getChildByName("choice_"+i)
                frame.active = false;lb.active= false
                if(i==2){
                    frame.active = true;lb.active= true
                    lb.getComponent(cc.RichText).string = data.content 
                    frame.on(cc.Node.EventType.TOUCH_END, function (event) {
                        self.add_Loading()
                        server.send({               
                            rid:"stat_moments_save",          
                            subject:"STAT",          
                            cmd:"STAT_MOMENTS_SAVE",      
                            udid:gamedata.userid,      
                            req:{moments_list:[parseInt(data.circlefriendsid)]}            
                        })
                        gamedata.message_fun_map.set('stat_moments_save',function(sdata){
                            server.send({               
                                rid:"common_thing_consume", 
                                subject:"COMMON",          
                                cmd:"COMMON_THING_CONSUME",      
                                udid:gamedata.userid,      
                                req:{thing_list:[parseInt(data.circlefriendsid),1]}            
                            })
                            gamedata.message_fun_map.set('common_thing_consume',function(data){
                                
                            })
                        })
                        var l_d_a = []
                        var temp_data = []
                        for(var k1 in self.friend_comment_conf){
                            if(self.friend_comment_conf[k1].linkid == data.comment && self.friend_comment_conf[k1].role != 1){
                                temp_data.push(self.friend_comment_conf[k1])
                            }
                        }
                        for(var k2 in temp_data){
                            l_d_a.push(parseInt(temp_data[k2].comment),parseInt(temp_data[k2].role))
                        }
                        server.send({               
                            rid:"stat_moments_comments_save",          
                            subject:"STAT",          
                            cmd:"STAT_MOMENTS_COMMENTS_SAVE",      
                            udid:gamedata.userid,      
                            req:{moments_id:parseInt(data.circlefriendsid),comments_list:l_d_a}            
                        })
                        gamedata.message_fun_map.set('stat_moments_comments_save',function(data){
                            self.replace_list()
                        })
                    })
                }
            }
        }else if(type==2){
            //评论
            if(data.length){
                for(var i=1;i<=3;i++){
                    var frame = tip.getChildByName("xaunxiang_"+i)
                    var lb = frame.getChildByName("choice_"+i)
                    var name = frame.getChildByName("name_"+i)
                    frame.active = false;lb.active= false;name.active=false

                    if(data.replyperson){
                        cc.log(data.replyperson)
                    }
                    if(data.length==1 && i==1){
                        frame.y = 0
                    }else if(data.length==2 && i<3){
                        if(i==1){frame.y = 60}else{frame.y=-60}
                    }
                    if(data[i-1]){
                        var replycontent = data[i-1].replycontent.split(",")
                        frame.active = true;lb.active = true
                        lb.getComponent(cc.RichText).string = replycontent[1]
                        if(data[i-1].replyperson){
                            var str = ""
                            var hf_id = data[i-1].replyperson.split(",")[1]
                            if(hf_id==1001){str="沉星"}else if(hf_id==1002){str="江小诗"}else if(hf_id==1003){str="总裁"}else if(hf_id==1004){str="智能少年"}
                            name.active=true,name.getComponent(cc.Label).string = "回复"+str+"："
                        }
                    }
                    frame.on(cc.Node.EventType.TOUCH_END, function (event) {
                        self.add_Loading()
                        var x_data = data[this.i-1].replycontent.split(",")
                        server.send({
                            rid:"stat_moments_comments_save",  
                            subject:"STAT",   
                            cmd:"STAT_MOMENTS_COMMENTS_SAVE",
                            udid:gamedata.userid,
                            req:{moments_id:parseInt(id),comments_list:[parseInt(x_data[0]),1]}
                        })
                        gamedata.message_fun_map.set('stat_moments_comments_save',function(data){
                            self.replace_list()
                        })
                    }.bind({i:i}))
                }
            }else{
                var c_id = data.comment.split(",")  //玩家回复id
                var content = data.content.split("#$")  //内容
                if(data.replycontent){
                    var replycontent = data.replycontent.split("#$") //回复id,内容
                }
                for(var i=1;i<=3;i++){
                    var frame = tip.getChildByName("xaunxiang_"+i)
                    var lb = frame.getChildByName("choice_"+i)
                    var name = frame.getChildByName("name_"+i)
                    frame.active = false;lb.active= false;name.active=false
                    
                    if(content.length==1 && i==1){
                        frame.y = 0
                    }else if(content.length==2 && i<3){
                        if(i==1){frame.y = 60}else{frame.y=-60}
                    }
    
                    if(content[i-1]){
                        frame.active = true;lb.active = true
                        lb.getComponent(cc.RichText).string = content[i-1]
                    }
                    frame.on(cc.Node.EventType.TOUCH_END, function (event) {
                        self.add_Loading()
                        var server_data = []
                        server_data.push(parseInt(c_id[this.i-1]))
                        server_data.push(parseInt(1))   //玩家回复role==1
                        if(replycontent){
                            var r_p_data = replycontent[this.i-1] //别人回复玩家数据
                            var ng = r_p_data.split(",")
                            server_data.push(parseInt(ng[0]))
                            server_data.push(parseInt(8888))       //别人回复玩家
                        }
                        server.send({
                            rid:"stat_moments_comments_save",  
                            subject:"STAT",   
                            cmd:"STAT_MOMENTS_COMMENTS_SAVE",
                            udid:gamedata.userid,
                            req:{moments_id:parseInt(id),comments_list:server_data}
                        })
                        gamedata.message_fun_map.set('stat_moments_comments_save',function(data){
                            self.replace_list()
                        })
    
                    }.bind({i:i}))
                }
            }
        }
    },
    add_Loading: function(){
        var tip_layout = cc.instantiate(this.black_ly);
        cc.director.getScene().getChildByName('Canvas').addChild(tip_layout)
        tip_layout.x = 0;tip_layout.y=0
        tip_layout.name = "loading_black_frame"
        tip_layout.on(cc.Node.EventType.TOUCH_END, function (event) {})

        var tip_frame = cc.instantiate(this.loading);
        tip_frame.name = "loading_frame"
        tip_frame.zIndex = 999
        tip_frame.x = 0;tip_frame.y=0
        cc.director.getScene().getChildByName('Canvas').addChild(tip_frame)
        var ani = tip_frame.getChildByName('l_1').getComponent(cc.Animation)
        ani.play("loading")
        tip_frame.getChildByName('light_b').runAction(cc.repeatForever(cc.rotateBy(1,360)))
    },
    replace_list: function(){
        var self = this
        server.send({               
            rid:"stat_moments_list",          
            subject:"STAT",          
            cmd:"STAT_MOMENTS_LIST",      
            udid:gamedata.userid,      
            req:{times:1}
        })
        gamedata.message_fun_map.set('stat_moments_list',function(data){
            server.send({               
                     rid:"common_thing_list",  
                     subject:"COMMON",          
                     cmd:"COMMON_THING_LIST",      
                     udid:gamedata.userid,      
                     req:{}            
            })
            gamedata.message_fun_map.set('common_thing_list',function(h_data){
                self.play_choice_data = []
                for(var lk in h_data.data.thing_list){
                    if(h_data.data.thing_list[lk].tid && self.circlefriends_conf[h_data.data.thing_list[lk].tid] && h_data.data.thing_list[lk].count==1){
                        self.play_choice_data.push(h_data.data.thing_list[lk])
                    }
                }
                self.friend_touch_data = h_data
                for(var k in data.data){self.show_dynamic_id_conf[data.data[k].mid] = data.data[k]}
                self.show_dynamic_conf = data.data
                self.scrollview.removeAllChildren()
                if(cc.director.getScene().getChildByName('Canvas').getChildByName("loading_black_frame")){
                    cc.director.getScene().getChildByName('Canvas').removeChild(cc.director.getScene().getChildByName('Canvas').getChildByName("loading_black_frame"),true)
                }
                if(cc.director.getScene().getChildByName('Canvas').getChildByName("loading_frame")){
                    cc.director.getScene().getChildByName('Canvas').removeChild(cc.director.getScene().getChildByName('Canvas').getChildByName("loading_frame"),true)
                }
                self.update_list()
            })
        })
    },
    convert_comment_data: function(id){
        //将所有回复数据转为ID模式
        var s_conf = {}
        var n_conf = []
        for(var k in this.friend_comment_conf){
            if(this.friend_comment_conf[k].linkid == id){
                n_conf.push(this.friend_comment_conf[k])
            }
        }
        for(var k in n_conf){
            var id_conf = n_conf[k].comment.split(",")
            var content_c = n_conf[k].content.split("#$") 
            if(n_conf[k].replycontent!=""){var re_conf = n_conf[k].replycontent.split("#$") }
           
            for(var k1 in id_conf){
                if(content_c[k1]!=""){
                    s_conf[id_conf[k1]] = content_c[k1]
                }
                if(re_conf){
                    for(var k2 in re_conf){
                        var d_d = re_conf[k2].split(",")
                        s_conf[d_d[0]] = d_d[1]
                    }
                }
            }
        }
        return s_conf
    },
    start () {

    },

    // update (dt) {},
});
