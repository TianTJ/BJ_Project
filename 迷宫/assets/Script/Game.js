var Common = require('Common');
cc.Class({
    extends: cc.Component,

    properties: {
        bg:{
            default: null,
            type: cc.Sprite,
        },
        sprite: {
            default: null,
            type: cc.Node,
            displayName: '操控的目标',
        },   
        tilemap:{
            default:null,
            type:cc.TiledMap
        },
        monster:{
            default: null,
            type: cc.Node,
            displayName: '怪物',
        },
        top_btn:{
            default: null,
            type: cc.Sprite,
            displayName: '上',
        },
        down_btn:{
            default: null,
            type: cc.Sprite,
            displayName: '下',
        },
        left_btn:{
            default: null,
            type: cc.Sprite,
            displayName: '左',
        },
        right_btn:{
            default: null,
            type: cc.Sprite,
            displayName: '右',
        },
        btn_part:{
            default: null,
            type: cc.ParticleSystem,
        },
        gamefail:{
            default: null,
            type: cc.Layout,
        },
        gamesuccess:{
            default: null,
            type: cc.Layout,
        },
        f_againbtn:{
            default: null,
            type: cc.Sprite,
        },
        f_back_btn:{
            default: null,
            type: cc.Sprite,
        },
        s_back_btn:{
            default: null,
            type: cc.Sprite,
        },
        successbtn:{
            default: null,
            type: cc.Sprite,
        },
        success_voice:{
            default: null,
            type: cc.AudioClip
        },
        fail_voice:{
            default: null,
            type: cc.AudioClip
        },
        touch_voice:{
            default: null,
            type: cc.AudioClip
        },
        bg_voice:{
            default: null,
            type: cc.AudioClip
        },
        star_tip:{
            default: null,
            type: cc.Sprite,
        },
        star_tip_label:{
            default:null,
            type:cc.Label
        },
        time_label:{
            default:null,
            type:cc.Label
        },
        boomlabel:{
            default:null,
            type:cc.Label
        },
        tip_frame:{
            default: null,
            type: cc.Sprite,
        },
        trap_layer:{
            default:null,
            type:cc.Layout
        }
    },
    onLoad () {
        var self = this
        this.star_tip_label.string = Common.Show_SatrTip_Str[Common.Now_Scene_ID]
        this.star_tip.node.runAction(cc.sequence(cc.spawn(cc.fadeIn(0.3),cc.scaleTo(0.3,1,1)),cc.delayTime(2),cc.spawn(cc.fadeOut(0),cc.scaleTo(0.3,0,0)),cc.callFunc(function(){self.star_tip.node.active = false})))

        this.test_pos = []
        //背景音乐
        this.play_bg_music() 
        //隐藏游戏结束layout
        this.gamefail.node.active = false
        this.gamesuccess.node.active = false
        this.gamefail.node.on(cc.Node.EventType.TOUCH_START,function(event){})
        this.gamesuccess.node.on(cc.Node.EventType.TOUCH_START,function(event){})

        this.tip_frame.node.active = false
        this.trap_layer.node.active = false
        this.trap_layer.node.on(cc.Node.EventType.TOUCH_START,function(event){})
        
        this._MonsterNode = this.node.getChildByName("map").getComponent("monster")

        //点击移动
        var ani = this.btn_part.node.getComponent(cc.ParticleSystem)
        this.top_btn.node.on(cc.Node.EventType.TOUCH_START,function(event){
            cc.audioEngine.play(this.touch_voice, false, 1);
            this.btn_part.node.setPosition(cc.v2(-449,-129))
            ani.preview = true
            ani.resetSystem()
            var newTile = cc.v2(this.playerTile.x, this.playerTile.y);
            newTile.y -= 1;
            this.tryMoveToNewTile(newTile,2);
        }.bind(this))
        this.down_btn.node.on(cc.Node.EventType.TOUCH_START,function(event){
            cc.audioEngine.play(this.touch_voice, false, 1);
            this.btn_part.node.setPosition(cc.v2(-449,-264))
            ani.preview = true
            ani.resetSystem()
            var newTile = cc.v2(this.playerTile.x, this.playerTile.y);
            newTile.y += 1
            this.tryMoveToNewTile(newTile,4);
        }.bind(this)) 
        this.left_btn.node.on(cc.Node.EventType.TOUCH_START,function(event){
            cc.audioEngine.play(this.touch_voice, false, 1);
            this.btn_part.node.setPosition(cc.v2(-520,-200))
            ani.preview = true
            ani.resetSystem()
            var newTile = cc.v2(this.playerTile.x, this.playerTile.y);
            newTile.x -= 1;
            this.tryMoveToNewTile(newTile,1);
        }.bind(this)) 
        this.right_btn.node.on(cc.Node.EventType.TOUCH_START,function(event){
            cc.audioEngine.play(this.touch_voice, false, 1);
            this.btn_part.node.setPosition(cc.v2(-376,-200))
            ani.preview = true
            ani.resetSystem()
            var newTile = cc.v2(this.playerTile.x, this.playerTile.y);
            newTile.x += 1;
            this.tryMoveToNewTile(newTile,3);
        }.bind(this))
        this.f_againbtn.node.on(cc.Node.EventType.TOUCH_START,function(event){
            cc.audioEngine.play(this.touch_voice, false, 1);
            this.gamefail.node.active = false
            this.trap_layer.node.active = false
            this.gameagain()
        }.bind(this))                      
        this.f_back_btn.node.on(cc.Node.EventType.TOUCH_START,function(event){
            cc.director.loadScene("main")
        })
        this.successbtn.node.on(cc.Node.EventType.TOUCH_START,function(event){
            cc.audioEngine.play(this.touch_voice, false, 1);
            this.play_bg_music()
            this.trap_layer.node.active = false
            this.gamesuccess.node.active = false
            this.gameagain()
        }.bind(this))                        
        this.s_back_btn.node.on(cc.Node.EventType.TOUCH_START,function(event){
            cc.director.loadScene("main")
        })
        
        this.schedule(function() {
            //这里的 this 指向 component
            self.countdown();
        },1,cc.macro.REPEAT_FOREVER,1);

        this.game_speed = window.localStorage.getItem("game_speed") || 1
        this.game_speed = 3
        this.initbg()

        this.tilemap.node.active = false
        //初始化地图位置
        this.node.setPosition(cc.visibleRect.bottomLeft);
        //地图
        this.tiledMap = this.tilemap
        var str ="map/map"+Common.Now_Scene_ID+".tmx"
        cc.loader.loadRes(str,function(err,tile){
            this.tiledMap.tmxAsset = tile
            this.tilemap.node.active = true
            this.sprite.zIndex = 999
            this.monster.zIndex = 1000
            this._MonsterNode.init_pos()
            this.loadMap()
        }.bind(this))
        //test
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },
    onKeyDown: function(keyCode,event){
        var newTile = cc.v2(this.playerTile.x, this.playerTile.y);
        var type = 0
        if(keyCode.keyCode == 37){
            newTile.x -= 1;type=1
            //左
        }else if(keyCode.keyCode == 38){
            newTile.y -= 1;type=2
            //上
        }else if(keyCode.keyCode == 39){
            //右
            newTile.x += 1;type=3
        }else if(keyCode.keyCode == 40){
            //下
            newTile.y += 1;type=4
        }
        this.tryMoveToNewTile(newTile,type);
    },
    //加载地图文件时调用
    loadMap: function () {
        //获取游戏进度
       
        //players对象层
        var players = this.tiledMap.getObjectGroup('players');
        //startPoint和endPoint对象
        var startPoint = players.getObject('starPoint');
        var endPoint = players.getObject('endPoint');
        //像素坐标`
        var startPos = cc.v2(startPoint.x, startPoint.y);
        var endPos = cc.v2(endPoint.x, endPoint.y);
        //障碍物图层
        this.barriers = this.tiledMap.getLayer('barriers');
        //炸弹层
        this.boom_layer = this.tiledMap.getLayer('boom');
        //障碍层，每一关的障碍不同
        this.obstacle_layer = this.tiledMap.getLayer('obstacle');
        //怪物层
        this.monster_layer = this.tiledMap.getLayer('monstershow');
        //出生Tile和结束Tile
        this.playerTile = this.getTilePos(startPos);
        this.endTile = this.getTilePos(endPos);
        //更新player位置
        var pos = this.barriers.getPositionAt(this.playerTile);
        this.sprite.setPosition(pos)
        //更新Monster位置
        this.monster.setPosition(pos)
        this.monster.active = false

    },
    tryMoveToNewTile: function(newTile,type) {
        var mapSize = this.tiledMap._mapSize
        if (newTile.x < 0 || newTile.x >= mapSize.width) return;
        if (newTile.y < 0 || newTile.y >= mapSize.height) return
        if (!this.barriers.getTileGIDAt(newTile)) {//GID=0,则该Tile为空
            cc.log('This way is not road!');
            return false;
        }
        this.playerTile = newTile;  
        this.updatePlayerRes(type)
        this.updatePlayerPos();
        this.is_over()
    },
    updatePlayerRes:function(type){
        var anim = this.sprite.getComponent(cc.Animation);
        if(type==1){
            this.sprite.spriteFrame = "player_move/left_1.png"
            anim.play("palyerleft")
        }else if(type==2){
            this.sprite.spriteFrame = "player_move/top_1.png"
            anim.play("playertop")
        }else if(type==3){
            this.sprite.spriteFrame = "player_move/right_1.png"
            anim.play("playerright")
        }else if(type==4){
            this.sprite.spriteFrame = "player_move/down_1.png"
            anim.play("playerdown")
        }
    },
    updatePlayerPos: function() {
        this.test_pos.push(this.playerTile)

        // var ss = function(){
        //     var h = {};    
        //     var arr = [];  
        //     for(var i = 0; i < this.test_pos.length; i++){  
        //         if(!h[this.test_pos[i]]){  
        //             h[this.test_pos[i]] = true;  
        //             arr.push(this.test_pos[i]);  
        //         }  
        //    }  
        //    return arr
        // }.bind(this)
        // var tp = ss()
        // cc.log(tp)

        var pos = this.barriers.getPositionAt(this.playerTile);
        this.sprite.setPosition(pos)
        Common.People_Move_Pos.push(this.playerTile)
        if(this.boom_layer.getTileGIDAt(this.playerTile)){
            cc.log("炸弹")
            this.game_boom()
        }
        if(this.obstacle_layer.getTileGIDAt(this.playerTile)){
             cc.log("障碍")
             this.game_obstacle()
        }
        if(this.monster_layer && this.monster_layer.getTileGIDAt(this.playerTile)){
            cc.log("怪物大王")
            this.monster_king()
        }
    },
    //将像素坐标转化为瓦片坐标
    getTilePos: function(posInPixel) {
        var mapSize = this.node.getContentSize();
        var tileSize = this.tiledMap.getTileSize();
        var x = Math.floor(posInPixel.x / tileSize.width);
        var y = Math.floor((mapSize.height - posInPixel.y) / tileSize.height);
        return cc.v2(x, y);
    },
    is_over:function(){
        //判断游戏是否结束
        if (Math.round(this.playerTile.x) == this.endTile.x && (Math.round(this.playerTile.y)) == this.endTile.y) {
            this.gameover(2)
        }
        var p = this.getTilePos(cc.v2(this.monster.x,this.monster.y))
        if (Math.round(this.playerTile.x) == parseInt(p.x) && Math.round(this.playerTile.y) == parseInt(p.y)) {
            this.gameover(1)
        }
    },
    gameover:function(type){
        this.time_label.string = "0:00"
        cc.director.getScheduler().unscheduleAllForTarget(this)
        Common.People_Move_Pos = []
        Common.Monster_Move_Speed = 0 
        this.trap_layer.node.active = true
        if(type==1){
            //fail
            if(!this.monster.active)return
            this.play_fail_voice()
            this.stop_bg_music()
            this.gamefail.node.active = true
            this.gamefail.node.opacity = 255
            this._MonsterNode.stop_update()
            return
        }else{
            //success
            this.play_success_voice()
            this.gamesuccess.node.active = true
            this.gamesuccess.node.opacity = 255
            this._MonsterNode.stop_update()
            window.localStorage.setItem("game_speed",parseInt(this.game_speed)+1) 
            return
        }
    },
    play_success_voice:function(){
        cc.audioEngine.play(this.success_voice, false, 1);
    },
    play_fail_voice:function(){
        cc.audioEngine.play(this.fail_voice, false, 1);
    },
    stop_bg_music:function(){
        cc.audioEngine.stop(this.bgmusic);
    },
    play_bg_music:function(){
        this.bgmusic = cc.audioEngine.play(this.bg_voice, true);
    },
    gameagain:function(){
        this.star_tip.node.active = true
        this.star_tip.node.runAction(cc.sequence(cc.spawn(cc.fadeIn(1),cc.scaleTo(1,1,1)),cc.delayTime(0.5),cc.spawn(cc.fadeOut(0),cc.scaleTo(1,0,0)),cc.callFunc(function(){self.star_tip.node.active = false})))
        var self = this
        //更新player位置
        //更新Monster位置
        this.loadMap()
        this.time_label.string = "2:00"
        this.monster.active = false
        this._MonsterNode.init_pos()
        this._MonsterNode.monster_move()
        this.play_bg_music()
        this.schedule(function() {
            self.countdown();
        },1,cc.macro.REPEAT_FOREVER,1);
        this.sprite.spriteFrame = "player_move/down_1.png"
        Common.time_down = 120
    },
    countdown: function(){
        if(Common.time_down > 0){
            Common.time_down--
            var minutes = Math.floor(Common.time_down / 60);
            var seconds = Math.floor(Common.time_down % 60);
            if(seconds<10){this.time_label.string = minutes + ":0" + seconds;}else{
                this.time_label.string = minutes + ":" + seconds;
            }
        }else{
            this.gameover(1)
        }
    },
    game_boom:function(){
        var self = this;
        this.boomlabel.string="踩到炸弹"
        this.trap_layer.node.active=true;
        this.tip_frame.node.active = true
        var anim = this.sprite.getComponent(cc.Animation);
        anim.play("boom")
        this.tip_frame.node.runAction(cc.sequence(cc.spawn(cc.fadeIn(0.15),cc.scaleTo(0.15,1,1)),cc.delayTime(0.5),cc.callFunc(function(){
            //炸弹逻辑
            var pos = Common.level_pos[Common.Now_Scene_ID][Math.floor(Math.random()*Common.Rardom[Common.Now_Scene_ID])]
            anim.play("playerdown")
            var p = self.barriers.getPositionAt(pos);
            self.sprite.setPosition(p)
            // var q1x = parseInt(self.sprite.x + (p.x - self.sprite.x)*0.5);
            // var q2x = parseInt(self.sprite.x + (p.x - self.sprite.x)*0.5);
            // var q1 = cc.v2(q1x, 50 + self.sprite.y);
            // var q2 = cc.p(q2x, 50 + self.sprite.y);
            // var bezier = [q1, q2, p];
            // self.sprite.runAction(cc.sequence(cc.bezierTo(1, bezier),cc.callFunc(function(){
            // })))
            if(self.boom_layer.getTileGIDAt(pos)){
                //随机到炸弹的位置
                self.game_boom();return
            }
            if(self.monster_layer && self.monster_layer.getTileGIDAt(pos)){
            //怪物大王
                 this.monster_king()
                 return
            }
            self.trap_layer.node.active=false
            self.playerTile = pos
            self.tip_frame.node.active = false
            self.tip_frame.node.opacity = 0
            self.tip_frame.node.scale = 0
        })))
    },
    monster_king:function(){
        var self = this;this.boomlabel.string="碰到怪物大王，怪物速度增加一倍";this.tip_frame.node.active = true;
        this.tip_frame.node.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            self.tip_frame.node.active = false
            //碰到怪物大王，怪物速度增加一倍
            Common.Monster_Speed[Common.Now_Scene_ID] = Common.Monster_Speed[Common.Now_Scene_ID]/2
            self._MonsterNode.change_monster_speed()
        })))
    },
    game_obstacle:function(){
        var self = this;
        this.boomlabel.string="踩到树桩，倒计时3"
        this.trap_layer.node.active=true;
        this.tip_frame.node.active = true
        var anim = this.sprite.getComponent(cc.Animation);
        anim.pause()
        this.tip_frame.node.runAction(cc.sequence(cc.spawn(cc.fadeIn(0.15),cc.scaleTo(0.15,1,1)),cc.delayTime(1),cc.callFunc(function(){
            self.boomlabel.string="时间静止，倒计时2"
        }),cc.delayTime(1),cc.callFunc(function(){
            self.boomlabel.string="时间静止，倒计时1"
        }),cc.delayTime(1),cc.callFunc(function(){
            self.boomlabel.string="时间静止，倒计时0"
            self.tip_frame.node.active = false;
            self.trap_layer.node.active=false
            self.tip_frame.node.opacity = 0
            self.tip_frame.node.scale = 0
        })))
    },
    initbg:function(){
        if(Common.Now_Scene_ID==2){
            cc.loader.loadRes("bg/xuedi.jpg",function(error,res){
                this.bg.spriteFrame = new cc.SpriteFrame(res)
            }.bind(this))
        }else if(Common.Now_Scene_ID==3){
            cc.loader.loadRes("bg/caoyuan.jpg",function(error,res){
                this.bg.spriteFrame = new cc.SpriteFrame(res)
            }.bind(this))
        }
    },
    start () {
        
    },

    // update (dt) {},
});
