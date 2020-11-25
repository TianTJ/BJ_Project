cc.Class({
    extends: cc.Component,

    properties: {
        tip:{
            default: null,
            type: cc.Node
        },
        tip_btn:{
            default: null,
            type: cc.Node
        },
        tip_bg:{
            default: null,
            type: cc.Node
        },
        tip_tx:{
            default: null,
            type: cc.Node
        },
        jiedan:{
            default: null,
            type: cc.Node
        },
        fadan:{
            default: null,
            type: cc.Node
        },
        ani_ji:{
            default: null,
            type: cc.Node
        }
    },
    start () {
        this.tip.active = false
        this.tip_bg.active = false
        this.tip_tx.active = false
        var self = this
        this.tip_btn.on(cc.Node.EventType.TOUCH_START,function(event){
            self.tip_btn.scale = 0.45
        })
        this.tip_btn.on(cc.Node.EventType.TOUCH_END,function(event){
            self.tip_btn.scale = 0.5
            self.tip.active = true
            self.tip_bg.active = true
            self.tip_tx.active = true
        })
        this.tip.on(cc.Node.EventType.TOUCH_START,function(event){
            self.tip.active = false
            self.tip_bg.active = false
            self.tip_tx.active = false
        })
        this.jiedan.on(cc.Node.EventType.TOUCH_START,function(event){
            cc.director.loadScene("jiedan")
        })
        this.fadan.on(cc.Node.EventType.TOUCH_START,function(event){
            cc.director.loadScene("fadan")
        })

        var anim = this.ani_ji.getComponent(cc.Animation);
        var state = anim.play();state.repeatCount = "infinity"
        this.ani_ji.runAction(cc.moveTo(30,cc.p(-80,-281)))
    },
});
