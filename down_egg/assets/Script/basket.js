
cc.Class({
    extends: cc.Component,

    properties: {
        bg:{
            default: null,
            type: cc.Node
        },
    },
    start () {
        var is_move = false
        this.node.on(cc.Node.EventType.TOUCH_START,function(event){
            is_move = true
        },this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,function(event){
            if(!is_move)return
            var pos=new cc.Vec2(event.getLocationX(),event.getLocationY());
            pos=this.bg.convertToNodeSpaceAR(pos);
            if(pos.x>425.5 || pos.x<-425.5)return
            this.node.x = pos.x
           
            //cc.log(pos)
        },this);
        this.node.on(cc.Node.EventType.TOUCH_END,function(event){
            is_move = false
        },this);

    },
});
