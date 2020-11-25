cc.Class({
    extends: cc.Component,

    properties: {
        lanzi:{
            default: null,
            type: cc.Node
        },
        chicken: [cc.Node],
        gjts:{
            default: null,
            type: cc.Node
        },
        xiaoji: {
            default: null,
            type: cc.Prefab
        },
        speed: [cc.Float],
        tip_tx:{
            default: null,
            type: cc.Node
        },
        d_num_tx:{
            default: null,
            type: cc.Node
        },
        score_tx:{
            default: null,
            type: cc.Node
        },
        over_bg:{
            default: null,
            type: cc.Node
        },
        over_img:{
            default: null,
            type: cc.Node
        },
        over_score:{
            default: null,
            type: cc.Node
        },
        jd_voice:{
            type: cc.AudioClip,
            default: null
        },
        bg_voice:{
            type: cc.AudioClip,
            default: null
        },
    },
    start () {
        this.gjts.active = false
        this.over_bg.active = false
        this.over_img.active = false
        this.gjts.scale = 0
        this.score_num = 0
        this.d_num = 100
        this.move_right();
        this.egg_arr = [[],[],[],[],[]]  
        this.isq = [false,false,false,false,false]
        var self = this

        //五种不同的类型对象池
        this.c_eggPool1 = new cc.NodePool();  
        for (let i = 0; i < 5; ++i) {
            var c_egg = cc.instantiate(this.xiaoji); 
            this.c_eggPool1.put(c_egg); 
        }
        this.c_eggPool2 = new cc.NodePool();  
        for (let i = 0; i < 5; ++i) {
            var c_egg = cc.instantiate(this.xiaoji); 
            this.c_eggPool2.put(c_egg);
        }
        this.c_eggPool3 = new cc.NodePool();  
        for (let i = 0; i < 5; ++i) {
            var c_egg = cc.instantiate(this.xiaoji); 
            this.c_eggPool3.put(c_egg);
        }
        this.c_eggPool4 = new cc.NodePool();  
        for (let i = 0; i < 5; ++i) {
            var c_egg = cc.instantiate(this.xiaoji);
            this.c_eggPool4.put(c_egg);
        }
        this.c_eggPool5 = new cc.NodePool();  
        for (let i = 0; i < 5; ++i) {
            var c_egg = cc.instantiate(this.xiaoji); 
            this.c_eggPool5.put(c_egg);
        }

        this.over_bg.on(cc.Node.EventType.TOUCH_END,function(){
            cc.director.loadScene("main")
        })

        //防止多次点击
        var touch_c_1,touch_c_2,touch_c_3,touch_c_4,touch_c_5 = false
        this.chicken[0].on(cc.Node.EventType.TOUCH_END,function(){
            if(self.d_num==0){return}
            if(touch_c_1)return
            touch_c_1 = true
            var anim = self.chicken[0].getComponent(cc.Animation);
            anim.play("egg_gray");
            anim.on('finished',function(){touch_c_1 = false});
            self.show_egg(0)
        })
        this.chicken[1].on(cc.Node.EventType.TOUCH_END,function(){
            if(self.d_num==0){return}
            if(touch_c_2)return
            touch_c_2 = true
            var anim = self.chicken[1].getComponent(cc.Animation);
            anim.play("egg_white");
            anim.on('finished',function(){touch_c_2 = false});
            self.show_egg(1)
            
        })
        this.chicken[2].on(cc.Node.EventType.TOUCH_END,function(){
            if(self.d_num==0){return}
            if(touch_c_3)return
            touch_c_3 = true
            var anim = self.chicken[2].getComponent(cc.Animation);
            anim.play("egg_yellow");
            anim.on('finished',function(){touch_c_3 = false});
            self.show_egg(2)
        })
        this.chicken[3].on(cc.Node.EventType.TOUCH_END,function(){
            if(self.d_num==0){return}
            if(touch_c_4)return
            touch_c_4 = true
            var anim = self.chicken[3].getComponent(cc.Animation);
            anim.play("egg_red");
            anim.on('finished',function(){touch_c_4 = false});
            self.show_egg(3)
            
        })
        this.chicken[4].on(cc.Node.EventType.TOUCH_END,function(){
            if(self.d_num==0){return}
            if(touch_c_5)return
            touch_c_5 = true
            var anim = self.chicken[4].getComponent(cc.Animation);
            anim.play("egg_white");
            anim.on('finished',function(){touch_c_5 = false});
            setTimeout(function(){
                self.gjts.active = true
                self.gjts.runAction(cc.spawn(cc.fadeIn(0.3),cc.scaleTo(0.3,1,1)))
            },1000)
            setTimeout(function(){
                self.gjts.runAction(cc.sequence(cc.spawn(cc.fadeOut(0.5),cc.scaleTo(0.5,0,0)),cc.callFunc(function(){
                    self.gjts.active = false
                })))
            },2000)
        })

    },
    move_left:function(){
        var self = this
        this.lanzi.runAction(cc.sequence(cc.moveTo(6,cc.p(-400,-260)),cc.callFunc(function(){
            self.move_right()
        })))
    },
    move_right:function(){
        var self = this
        this.lanzi.runAction(cc.sequence(cc.moveTo(4,cc.p(400,-260)),cc.callFunc(function(){
            self.move_left()
        })))
    },
    show_egg:function(idx){
        var self = this
        var c_egg = null
        if(idx==0){
            if (this.c_eggPool1.size() > 0) { 
                c_egg = this.c_eggPool1.get();
            } else {
                c_egg = cc.instantiate(this.xiaoji);
            }
            this.chicken[idx].addChild(c_egg)
            c_egg.x = 0;c_egg.y =555
            c_egg.active = false
            this.egg_arr[0].push(c_egg)
            if(!this.isq[0]){
                this.schedule(function() {
                    //这里的 this 指向 component
                    self.down_egg1(c_egg,idx);
                    self.isq[0] = true
                },0,cc.macro.REPEAT_FOREVER,0);
            }
        }else if(idx==1){
            if (this.c_eggPool2.size() > 0) { 
                c_egg = this.c_eggPool2.get();
            } else {
                c_egg = cc.instantiate(this.xiaoji);
            }
            c_egg.active = false
            this.chicken[idx].addChild(c_egg)
            c_egg.x = 0;c_egg.y = 165
            this.egg_arr[1].push(c_egg)
            if(!this.isq[1]){
                this.schedule(function() {
                    //这里的 this 指向 component
                    self.down_egg2(c_egg,idx);
                    self.isq[1] = true
                },0,cc.macro.REPEAT_FOREVER,0);
            }
        }else if(idx==2){
            if (this.c_eggPool3.size() > 0) { 
                c_egg = this.c_eggPool3.get();
            } else {
                c_egg = cc.instantiate(this.xiaoji);
            }
            c_egg.active = false
            this.chicken[idx].addChild(c_egg)
            c_egg.x = 0;c_egg.y = 195
            this.egg_arr[2].push(c_egg)
            if(!this.isq[2]){
                this.schedule(function() {
                    //这里的 this 指向 component
                    self.down_egg3(c_egg,idx);
                    self.isq[2] = true
                },0,cc.macro.REPEAT_FOREVER,0);
            }
        }else if(idx==3){
            if (this.c_eggPool4.size() > 0) { 
                c_egg = this.c_eggPool4.get();
            } else {
                c_egg = cc.instantiate(this.xiaoji);
            }
            c_egg.active = false
            this.chicken[idx].addChild(c_egg)
            c_egg.x = 0;c_egg.y = 165
            this.egg_arr[3].push(c_egg)
            if(!this.isq[3]){
                this.schedule(function() {
                    //这里的 this 指向 component
                    self.down_egg4(c_egg,idx);
                    self.isq[3] = true
                },0,cc.macro.REPEAT_FOREVER,0.5);
            }
        }
    },
    
    down_egg1:function(egg,idx){
        egg.y-=this.speed[idx]
        if(egg.y<-105){egg.active=true}
        if(egg.y==-555 && (-375<this.lanzi.x && this.lanzi.x<-350))this.down_basket(egg,1)
        for(var k in this.egg_arr[0]){
            if(this.egg_arr[0][k].y < -560){
                this.c_eggPool1.put(this.egg_arr[0][k]);
                this.egg_arr[0].splice(k, 1);
                this.d_num--
                this.gameover()
            }
        }
    },
    down_egg2:function(egg,idx){
        egg.y-=this.speed[idx]
        if(egg.y<-105){egg.active=true}
        if(egg.y==-556 && (-195<this.lanzi.x && this.lanzi.x<-170))this.down_basket(egg,2)
        for(var k in this.egg_arr[1]){
            if(this.egg_arr[1][k].y < -560){
                this.c_eggPool2.put(this.egg_arr[1][k]);
                this.egg_arr[1].splice(k, 1);
                this.d_num--
                this.gameover()
            }
        }
    },
    down_egg3:function(egg,idx){
        egg.y-=this.speed[idx]
        if(egg.y<-105){egg.active=true}
        if(egg.y==-560 && (-15<this.lanzi.x && this.lanzi.x<15))this.down_basket(egg,3)
        for(var k in this.egg_arr[2]){
            if(this.egg_arr[2][k].y < -560){
                this.c_eggPool3.put(this.egg_arr[2][k]);
                this.egg_arr[2].splice(k, 1);
                this.d_num--
                this.gameover()
            }
        }
    },
    down_egg4:function(egg,idx){
        egg.y-=this.speed[idx]
        if(egg.y<-105){egg.active=true}
        if(egg.y==-556 && (165<this.lanzi.x && this.lanzi.x<190))this.down_basket(egg,4);
        for(var k in this.egg_arr[3]){
            if(this.egg_arr[3][k].y < -560){
                this.c_eggPool4.put(this.egg_arr[3][k]);
                this.egg_arr[3].splice(k, 1);
                this.d_num--
                this.gameover()
            }
        }
    },
    down_basket:function(egg,type){
        var self = this
        var str = ""
        switch(type){
            case 1:
                this.score_num+=2
                str="＋2，接到了速度鸡的蛋！"
                break;
            case 2:
                this.score_num+=1
                str="＋1,继续加油！"
                break;
            case 3:
                this.score_num+=2
                str="＋2，接到了暴躁鸡的蛋！"
                break;
            case 4:
                this.score_num-=2
                str="－2，爆炸鸡的蛋不能接！"
                break;
            case 5:
                this.score_num+=1
                str="＋1，再接再厉！"
                break;
        }
        this.score_tx.getComponent(cc.Label).string = this.score_num
        if(this.tip_tx.getComponent(cc.Label).string == ""){
            this.tip_tx.getComponent(cc.Label).string = str
            this.tip_tx.active = true;
            this.tip_tx.runAction(cc.sequence(cc.moveTo(0.8,cc.p(0,100)),cc.delayTime(0.2),cc.callFunc(function(){
                self.tip_tx.active = false
                self.tip_tx.y = -100
                self.tip_tx.getComponent(cc.Label).string = ""
            })))
        }else{
            var node = cc.instantiate(this.target);
            node.setPosition(0,-100);
            this.node.addChild(node)
            node.getComponent(cc.Label).string  = str
            node.runAction(cc.sequence(cc.moveTo(0.8,cc.p(0,100)),cc.delayTime(0.2),cc.callFunc(function(){
                node.destroy()
            })))
        }
    },
    gameover:function(){
        this.d_num_tx.getComponent(cc.Label).string = this.d_num
        if(this.d_num == 0){
            this.over_bg.active = true
            this.over_img.active = true
            this.over_score.getComponent(cc.Label).string = this.score_num

            cc.director.getScheduler().unscheduleAllForTarget(this)
        }
    }
});
