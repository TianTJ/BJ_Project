var Common = require('Common');
cc.Class({
    extends: cc.Component,

    properties: {
        monster:{
            default: null,
            type: cc.Node,
            displayName: '怪物',
        },
    },
    onLoad () {
        //隐藏怪物
        this.Player_Node = this.node.parent.getComponent('Game');
    },
    init_pos:function(){
        //出生Tile和结束Tile
        this.map = this.Player_Node.tilemap
        var players = this.map.getObjectGroup('players');
        var startPoint = players.getObject('starPoint');
        var endPoint = players.getObject('endPoint');
        this.barriers = this.map.getLayer('barriers');
        var startPos = cc.v2(startPoint.x, startPoint.y);
        var endPos = cc.v2(endPoint.x, endPoint.y);
        this.monsterTile = this.getTilePos(startPos);    
        this.endTile = this.getTilePos(endPos);
        this.monster_move()
    },
    monster_move:function(){
        var self = this
        this.schedule(function() {
            //这里的 this 指向 component
            self.updatemonsterpos();
            cc.log("111111111")
        },Common.Monster_Speed[Common.Now_Scene_ID],cc.macro.REPEAT_FOREVER,Common.Show_Monster_Time[Common.Now_Scene_ID]);
    },
    change_monster_speed:function(){
        var self = this
        this.stop_update()
        this.schedule(function() {
            //这里的 this 指向 component
            self.updatemonsterpos();
            cc.log("222222222")
        },Common.Monster_Speed[Common.Now_Scene_ID],cc.macro.REPEAT_FOREVER,0);
    },
    //将像素坐标转化为瓦片坐标
    getTilePos: function(posInPixel) {
        var mapSize = this.node.parent.getContentSize();
        var tileSize = this.map.getTileSize();
        var x = Math.floor(posInPixel.x / tileSize.width);
        var y = Math.floor((mapSize.height - posInPixel.y) / tileSize.height)-1;
        return cc.v2(x, y);
    },
    //monster移动
    updatemonsterpos:function(){
        this.monster.active = true
        if(!Common.People_Move_Pos[Common.Monster_Move_Speed]){
            cc.log('玩家路线数据存储！！！');
            this.Player_Node.gameover(1)
            this.stop_update()
        }
        var pos = this.barriers.getPositionAt(Common.People_Move_Pos[Common.Monster_Move_Speed]);
        this.monster.setPosition(pos);
        var p = cc.v2(this.Player_Node.sprite.x,this.Player_Node.sprite.y)
        var p_p = this.getTilePos(p)
        if (Math.round(p_p.x) == parseInt(Common.People_Move_Pos[Common.Monster_Move_Speed].x) && Math.round(p_p.y+1) == parseInt(Common.People_Move_Pos[Common.Monster_Move_Speed].y)) {
            this.Player_Node.gameover(1)
            cc.log('怪物追到玩家，游戏结束，玩家输！！！');
            this.stop_update()
        }
        Common.Monster_Move_Speed++
    },
    stop_update:function(){
        cc.director.getScheduler().unscheduleAllForTarget(this)
    }
    // update (dt) {},
});
