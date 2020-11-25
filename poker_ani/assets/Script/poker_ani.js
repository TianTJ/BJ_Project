// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        poker_side:{
            default: null,
            type: cc.SpriteFrame
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initui()
    },
    initui: function(){
        cc.director.setDisplayStats(false)
        var PokerAniarr = []
        //存储每个位置poker第一张坐标
        var PokerImgPos = [cc.p(-70,-330)];
        //存储poker面值
        var poker_id = [1,2,3,4,5]
        for(var i=1;i<=5;i++){
            var node = new cc.Node()
            var sprite = node.addComponent(cc.Sprite)
            cc.director.getScene().getChildByName('Canvas').addChild(node)
            node.x=0;node.y=0
            PokerAniarr.push(node)
            sprite.spriteFrame =  this.poker_side
        }
        var pani = function (inx) {
            if(PokerAniarr[inx]){
                var action = new cc.sequence(
                    cc.delayTime(0.1),
                    cc.moveTo(0.2,cc.p(PokerImgPos[0].x+(inx*30),PokerImgPos[0].y)),
                    cc.callFunc(function(){
                        PokerAniarr[inx].runAction(cc.sequence(
                            cc.rotateBy(0.2,0,-90),
                            cc.callFunc(function () {
                                PokerAniarr[inx-1].runAction(cc.flipX(true))
                                cc.loader.loadRes("poker_h_"+poker_id[inx-1],cc.SpriteFrame,function(err,texture){
                                    this.sprite.getComponent(cc.Sprite).spriteFrame =  texture
                                }.bind({sprite:PokerAniarr[inx-1]}))
                            }),
                            cc.rotateBy(0.2,0,-90)
                        ))   
                    }),
                    cc.callFunc(function () {
                        inx++
                        pani(inx)
                    }),
                    cc.delayTime(0.5));
                PokerAniarr[inx].runAction(action)
            }
        };
        pani(0)
    },

    start () {

    },

    // update (dt) {},
});
