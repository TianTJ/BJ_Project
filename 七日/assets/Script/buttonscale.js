
cc.Class({
    extends: cc.Component,

    properties: {
        transDuration: 0
    },

    onLoad () {
        var self = this;
        self.initScale = this.node.scale;
        self.button = self.getComponent(cc.Button);
        self.scaleDownAction = cc.scaleTo(self.transDuration, 1.1);
        self.scaleUpAction = cc.scaleTo(self.transDuration, self.initScale);
        function onTouchDown (event) {
            cc.loader.loadRes("system_voice/touch_button",function(err,voice){
                cc.audioEngine.play(voice) 
            })
            cc.loader.releaseRes("system_voice/touch_button");
            this.stopAllActions();
            this.runAction(self.scaleDownAction);

        }
        function onTouchUp (event) {
            this.stopAllActions();
            this.runAction(self.scaleUpAction);
        }

        this.node.on(cc.Node.EventType.TOUCH_START, onTouchDown, this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, onTouchUp, this.node);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, onTouchUp, this.node);
    },

    start () {

    },

    // update (dt) {},
});
