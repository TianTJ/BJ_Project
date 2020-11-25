var gamedata=require('data');
var server = require('server')
cc.Class({
    extends: cc.Component,
    login_code: null,
    properties: {
        black_layer: {
            default: null,
            type: cc.Prefab
        },
        tip_frame: {
            default: null,
            type: cc.Prefab
        },
        login_btn_1:{
            default: null,
            type: cc.Node
        },
        login_btn_2:{
            default: null,
            type: cc.Node
        },
        login_btn_0:{
            default: null,
            type: cc.Node
        },
        login_edit:{
            default: null,
            type: cc.EditBox
        },
        fade_img:{
            default: null,
            type: cc.Node
        },
        password:{
            default: null,
            type: cc.EditBox
        },
        register:{
            default: null,
            type: cc.Node
        },
        fade_zg:{
            default: null,
            type: cc.Node
        },
    },
    onLoad () {
        cc.director.setDisplayStats(false)
        var self = this

        var c_d = cc.director.getScene().getChildByName('Canvas').getChildren()
        for(var k in c_d){c_d[k].active = false}
        this.fade_img.active = true
        this.fade_img.runAction(cc.sequence(cc.fadeIn(2.5),cc.delayTime(0.5),cc.fadeOut(0.5),cc.delayTime(0.5),cc.callFunc(function(){
            self.fade_zg.active = true
            self.fade_zg.runAction(cc.sequence(cc.delayTime(1.5),cc.fadeOut(0.5),cc.callFunc(function(){
                for(var k in c_d){c_d[k].active = true}
                self.fade_img.active = false
                self.fade_zg.active = false
                self.initui()
            })))
        })))
        gamedata.black_ly = this.black_layer
        gamedata.tip_ly = this.tip_frame

    //小游戏登录
        // wx.login({
        //     success: function (data) {
        //         self.login_code = data.code
        //         cc.log("login_code=="+ data.code)
        //         wx.getUserInfo({
        //             success: function(res) {
        //                 gamedata.wx_userinfo_data = res
        //                 cc.log("res=="+JSON.stringify(gamedata.wx_userinfo_data.userInfo))
        //                 server.connect(function(){
        //                     server.send({               
        //                         rid:"common_get_openid",          
        //                         subject:"COMMON",          
        //                         cmd:"COMMON_GET_OPENID",      
        //                         udid:gamedata.userid,      
        //                         req:{code:data.code}            
        //                     })
        //                     gamedata.message_fun_map.set('common_get_openid',function(data){
        //                         cc.log(data)
        //                         gamedata.userid = data.data.openid
        //                         gamedata.session_key = data.data.session_key 
        //                         cc.log("gamedata.userid===" +gamedata.userid)
        //                         cc.director.loadScene("main");
        //                     })
        //                     server.send({               
        //                         rid:"common_user_registry",          
        //                         subject:"COMMON",          
        //                         cmd:"COMMON_USER_REGISTRY",      
        //                         udid:gamedata.userid,      
        //                         req:{nickname:gamedata.wx_userinfo_data.nickname}            
        //                     })
        //                     gamedata.message_fun_map.set('common_user_registry',function(data){
        //                     })    
        //                 })
        //             }
        //         })
               
        //         wx.showShareMenu(
        //             {withShareTicket:true}
        //         ) 
        //         var canvas = wx.createCanvas()
        //         wx.onShareAppMessage(function () {
        //             return {
        //               title: '转发标题',
        //               imageUrl: canvas.toTempFilePathSync({
        //                 destWidth: 500,
        //                 destHeight: 400
        //               }),
        //               success(res){
        //                   cc.log(res.shareTickets[0])
        //                   wx.getShareInfo({
        //                     shareTicket:res.shareTickets[0],
        //                     success:function(data){
        //                         cc.log("success")
        //                         cc.log(data)
        //                     },
        //                     fail:function(data){
        //                         cc.log("fail")
        //                         cc.log(data)
        //                     },
        //                     complete: function(){
        //                         cc.log("去你妈的！")
        //                     }
        //                 })
        //               }
        //             }
        //           })
               
        //     },
        //     fail: function(){
                
        //     },
        // });


        // wx.authorize({
        //     scope: 'scope.record',
        //     fail: function (res) {
        //       // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
        //       if (res.errMsg.indexOf('auth deny') > -1 ||     res.errMsg.indexOf('auth denied') > -1 ) {
        //         // 处理用户拒绝授权的情况
        //       }    
        //     }
        // })
       
        
    },
    initui : function(){
        var self = this
        var server_open_num = 0
        var again_server_open_num = 0
        this.register.on(cc.Node.EventType.TOUCH_END,function(){
            if(gamedata.is_show_tip_move){gamedata.showSysHint("","暂不支持注册账号！");return}
        })
        this.login_btn_0.on(cc.Node.EventType.TOUCH_END, function(){
            //gamedata.userid = "300062"
            gamedata.userid = "300059"
            gamedata.account_number = 0
            cc.director.loadScene("main")

        })
        this.login_btn_2.on(cc.Node.EventType.TOUCH_END, function(){
            gamedata.userid = "301058"
            gamedata.account_number = 2
            cc.director.loadScene("main")
        })
        this.login_btn_1.on(cc.Node.EventType.TOUCH_END, function(){
            gamedata.userid = "303057"
            gamedata.account_number = 1
            cc.director.loadScene("main")
        })
        // this.login_btn.on(cc.Node.EventType.TOUCH_END, function(){
        //     if(self.login_edit.string != "请输入账号" && self.login_edit.string !="" && self.password.string !=""){
        //         gamedata.userid = self.login_edit.string
        //         gamedata.load_json_data("password",function(conf){
        //             var p_c = {}
        //             for(var k in conf){
        //                 p_c[conf[k].zhanghao] = conf[k]
        //             }
        //             if(p_c[self.login_edit.string] && p_c[self.login_edit.string].mima == self.password.string){
        //                 gamedata.account_number = p_c[self.login_edit.string].quanxian
        //                 cc.director.loadScene("main")
        //             }else{
        //                 if(gamedata.is_show_tip_move){gamedata.showSysHint("","账号或密码错误！");return}
        //             }
        //         })
        //     }else{
        //         if(gamedata.is_show_tip_move){gamedata.showSysHint("","请输入账号或密码！");return}
        //     }
        // })
        //连接服务器
        gamedata.load_vioce("31006",function(audio){
            //var audioID = cc.audioEngine.play(audio,true,1)
        })

        var tip_layout = cc.instantiate(self.black_layer);
        self.node.addChild(tip_layout)
        tip_layout.x = 0;tip_layout.y=0
        tip_layout.on(cc.Node.EventType.TOUCH_END, function (event) {})
        tip_layout.active = false
        var tip_frame = cc.instantiate(self.tip_frame);
        tip_frame.zIndex = 999
        self.node.addChild(tip_frame)
        tip_frame.active = false
        tip_frame.getChildByName("xiao_hao").active = false
        tip_frame.getChildByName("confirm").active = false
        tip_frame.getChildByName("cancel").active = false
        var open_server = function(){
            server.connect(function(code){
                server_open_num++
                if(code==1001){
                    if(server_open_num >= 5){
                        if(again_server_open_num >= 3){
                            tip_layout.active = true
                            tip_frame.active = true
                            tip_frame.getChildByName("content").getComponent(cc.RichText).string = "网络连接异常，请检查网络！"
                            tip_frame.getChildByName("confirm").active = true;tip_frame.getChildByName("confirm").x = 0
                            tip_frame.getChildByName("confirm").on(cc.Node.EventType.TOUCH_END, function (event) {
                                open_server()
                                tip_layout.active = false
                                tip_frame.active = false
                            });
                            return
                        }else{
                            again_server_open_num++
                            tip_layout.active = true
                            tip_frame.active = true
                            tip_frame.getChildByName("content").getComponent(cc.RichText).string = "正在尝试重新连接（" + again_server_open_num+"/3）"
                            tip_frame.runAction(cc.sequence(cc.delayTime(1.5),cc.callFunc(function(){
                                open_server()
                            })))
                            return
                        }
                    }
                    open_server()
                }else{
                    server.send({               
                             rid:"common_thing_store",          
                             subject:"COMMON",          
                             cmd:"COMMON_THING_STORE",      
                             udid:gamedata.userid,      
                             req:{thing_list:[5101,100,5102,100,5103,100,5104,100]}            
                    })
                    gamedata.message_fun_map.set('common_thing_store',function(data){
                        //cc.director.loadScene("main")
                    })
                }

            })
        }
        open_server()
    },
    start () {

    },

    // update (dt) {},
});
