var Common = require('Common');
cc.Class({
    extends: cc.Component,

    properties: {
        senlin:{
            default:null,
            type:cc.Sprite
        }, 
        xuedi:{
            default:null,
            type:cc.Sprite
        }, 
        caoyuan:{
            default:null,
            type:cc.Sprite
        }, 
        shamo:{
            default:null,
            type:cc.Sprite
        }, 
        dahai:{
            default:null,
            type:cc.Sprite
        }, 
        chengbao:{
            default:null,
            type:cc.Sprite
        }, 
        cunzhuang:{
            default:null,
            type:cc.Sprite
        }, 
        xuedi_lock:{
            default:null,
            type:cc.Sprite
        }, 
        caoyuan_lock:{
            default:null,
            type:cc.Sprite
        }, 
        shamo_lock:{
            default:null,
            type:cc.Sprite
        }, 
        dahai_lock:{
            default:null,
            type:cc.Sprite
        }, 
        chengbao_lock:{
            default:null,
            type:cc.Sprite
        }, 
        cunzhuang_lock:{
            default:null,
            type:cc.Sprite
        },
        sl_star:{
            default:null,
            type:cc.Sprite
        },
        xd_star:{
            default:null,
            type:cc.Sprite
        },
        cy_star:{
            default:null,
            type:cc.Sprite
        },
        sm_star:{
            default:null,
            type:cc.Sprite
        },
        dh_star:{
            default:null,
            type:cc.Sprite
        },
        cb_star:{
            default:null,
            type:cc.Sprite
        },
        cz_star:{
            default:null,
            type:cc.Sprite
        }
    },

    onLoad () {
        var self = this
        this.xd_star.node.active = false
        this.cy_star.node.active = false
        this.sm_star.node.active = false
        this.cb_star.node.active = false
        this.cz_star.node.active = false
        this.sl_star.node.active = false
        this.dh_star.node.active = false
        var game_speed = window.localStorage.getItem("game_speed") || 1
        game_speed = 3
        this.sl_star.node.on(cc.Node.EventType.TOUCH_START,function(event){
            Common.Now_Scene_ID = 1
            cc.log("senlin")
            cc.director.loadScene("game");
        })
        this.xd_star.node.on(cc.Node.EventType.TOUCH_START,function(event){
            if(self.xuedi_lock.node.active){alert("请完成前面关卡！！！");return;return}
            Common.Now_Scene_ID = 2
            cc.director.loadScene("game");
            cc.log("xuedi")
        })
        this.cy_star.node.on(cc.Node.EventType.TOUCH_START,function(event){
            if(self.caoyuan_lock.node.active){alert("请完成前面关卡！！！");return}
            Common.Now_Scene_ID = 3
            cc.director.loadScene("game");  
            cc.log("caoyuan")
        })
        this.sm_star.node.on(cc.Node.EventType.TOUCH_START,function(event){
            if(self.shamo.node.active){alert("请完成前面关卡！！！");return}
            Common.Now_Scene_ID = 4
            cc.director.loadScene("game");
            cc.log("shamo")
        })
        this.dh_star.node.on(cc.Node.EventType.TOUCH_START,function(event){
            if(self.dahai.node.active){alert("请完成前面关卡！！！");return}
            Common.Now_Scene_ID = 5
            cc.director.loadScene("game");
            cc.log("dahai")
        })
        this.cb_star.node.on(cc.Node.EventType.TOUCH_START,function(event){
            if(self.chengbao.node.active){alert("请完成前面关卡！！！");return}
            Common.Now_Scene_ID = 6
            cc.director.loadScene("game");
            cc.log("chengbao")
        })
        this.cz_star.node.on(cc.Node.EventType.TOUCH_START,function(event){
            if(self.cunzhuang.node.active){alert("请完成前面关卡！！！");return}
            Common.Now_Scene_ID = 7
            cc.director.loadScene("game");
            cc.log("cunzhuang")
        })

        switch(parseInt(game_speed)){
            case 1:
                this.senlin.node.opacity = 0
                this.sl_star.node.active = true
                break;
            case 2:
                this.senlin.node.opacity = 0
                this.xuedi.node.opacity = 0
                this.xuedi_lock.node.active = false
                this.sl_star.node.active = true
                this.xd_star.node.active = true
                break;
            case 3:
                this.senlin.node.opacity = 0
                this.xuedi.node.opacity = 0
                this.caoyuan.node.opacity = 0
                this.xuedi_lock.node.active = false
                this.caoyuan_lock.node.active = false
                this.sl_star.node.active = true
                this.xd_star.node.active = true
                this.cy_star.node.active = true
                break;
            case 4:
                this.senlin.node.opacity = 0
                this.xuedi.node.opacity = 0
                this.caoyuan.node.opacity = 0
                this.shamo.node.opacity = 0
                this.xuedi_lock.node.active = false
                this.caoyuan_lock.node.active = false
                this.shamo_lock.node.active = false
                this.sl_star.node.active = true
                this.xd_star.node.active = true
                this.cy_star.node.active = true
                this.sm_star.node.active = true
                break;
            case 5:
                this.senlin.node.opacity = 0
                this.xuedi.node.opacity = 0
                this.caoyuan.node.opacity = 0
                this.shamo.node.opacity = 0
                this.chengbao.node.opacity = 0
                this.xuedi_lock.node.active = false
                this.caoyuan_lock.node.active = false
                this.shamo_lock.node.active = false
                this.dahai_lock.node.active = false
                this.sl_star.node.active = true
                this.xd_star.node.active = true
                this.cy_star.node.active = true
                this.sm_star.node.active = true
                this.dh_star.node.active = true
                break;
            case 6:
                this.senlin.node.opacity = 0
                this.xuedi.node.opacity = 0
                this.caoyuan.node.opacity = 0
                this.shamo.node.opacity = 0
                this.chengbao.node.opacity = 0
                this.cunzhuang.node.opacity = 0
                this.xuedi_lock.node.active = false
                this.caoyuan_lock.node.active = false
                this.shamo_lock.node.active = false
                this.dahai_lock.node.active = false
                this.chengbao_lock.node.active = false
                this.sl_star.node.active = true
                this.xd_star.node.active = true
                this.cy_star.node.active = true
                this.sm_star.node.active = true
                this.cb_star.node.active = true
                this.dh_star.node.active = true
                break;
            case 6:
                this.senlin.node.opacity = 0
                this.xuedi.node.opacity = 0
                this.caoyuan.node.opacity = 0
                this.shamo.node.opacity = 0
                this.chengbao.node.opacity = 0
                this.cunzhuang.node.opacity = 0
                this.xuedi_lock.node.active = false
                this.caoyuan_lock.node.active = false
                this.shamo_lock.node.active = false
                this.chengbao_lock.node.active = false
                this.cunzhuang_lock.node.active = false
                this.sl_star.node.active = true
                this.xd_star.node.active = true
                this.cy_star.node.active = true
                this.sm_star.node.active = true
                this.cb_star.node.active = true
                this.cz_star.node.active = true
                break;       
        }
    },

    start () {

    },

    // update (dt) {},
});
