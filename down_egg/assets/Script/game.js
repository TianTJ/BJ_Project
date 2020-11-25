cc.Class({
    extends: cc.Component,

    properties: {
        xiaoji: {
            default: null,
            type: cc.Prefab
        },
        target:{
            default: null,
            type: cc.Prefab
        },
        lanzi:{
            default: null,
            type: cc.Node
        },
        chicken: [cc.Node],
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
    },
    start () {
        //cc.director.setDisplayStats(false);
        this.over_bg.active = false
        this.over_img.active = false
        var self = this
        this.egg_arr = [[],[],[],[],[]]  
        this.eggnum = 1
        this.isq = [false,false,false,false,false]
        this.d_num = 100
        this.score_num = 0
        this.li = null
        this.nodetx = null
        this.schedule(function() {
            //这里的 this 指向 component
            var idx = self.get_random_num(this.ii)
            self.ii = idx
            self.show_egg(idx);
        },1.5,cc.macro.REPEAT_FOREVER,1);
        self.tip_tx.active = false
        
        this.over_bg.on(cc.Node.EventType.TOUCH_END,function(){
            cc.director.loadScene("main")
        })

        //五种不同的类型对象池
        this.c_eggPool1 = new cc.NodePool();  
        for (let i = 0; i < 1; ++i) {
            var c_egg = cc.instantiate(this.xiaoji); 
            this.c_eggPool1.put(c_egg); 
        }
        this.c_eggPool2 = new cc.NodePool();  
        for (let i = 0; i < 1; ++i) {
            var c_egg = cc.instantiate(this.xiaoji); 
            this.c_eggPool2.put(c_egg);
        }
        this.c_eggPool3 = new cc.NodePool();  
        for (let i = 0; i < 1; ++i) {
            var c_egg = cc.instantiate(this.xiaoji); 
            this.c_eggPool3.put(c_egg);
        }
        this.c_eggPool4 = new cc.NodePool();  
        for (let i = 0; i < 1; ++i) {
            var c_egg = cc.instantiate(this.xiaoji);
            this.c_eggPool4.put(c_egg);
        }
        this.c_eggPool5 = new cc.NodePool();  
        for (let i = 0; i < 1; ++i) {
            var c_egg = cc.instantiate(this.xiaoji); 
            this.c_eggPool5.put(c_egg);
        }
    },
    show_egg:function(idx){    
        //-560
        var self = this
        var c_egg = null
        if(idx==0){
            var anim = this.chicken[idx].getComponent(cc.Animation);
            anim.play("egg_gray");
            anim.on('finished',function(){});
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
            var anim = this.chicken[idx].getComponent(cc.Animation);
            anim.play("egg_white");
            anim.on('finished',function(){});
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
            var anim = this.chicken[idx].getComponent(cc.Animation);
            anim.play("egg_yellow");
            anim.on('finished',function(){});
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
            var anim = this.chicken[idx].getComponent(cc.Animation);
            anim.play("egg_red");
            anim.on('finished',function(){});
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
        }else if(idx==4){
            var anim = this.chicken[idx].getComponent(cc.Animation);
            anim.play("egg_white");
            anim.on('finished',function(){});
            if (this.c_eggPool5.size() > 0) { 
                c_egg = this.c_eggPool5.get();
            } else {
                c_egg = cc.instantiate(this.xiaoji);
            }
            c_egg.active = false
            this.chicken[idx].addChild(c_egg)
            c_egg.x = 0;c_egg.y = 275
            this.egg_arr[4].push(c_egg)
            if(!this.isq[4]){
                this.schedule(function() {
                    //这里的 this 指向 component
                    self.down_egg5(c_egg,idx);
                    self.isq[4] = true
                },0,cc.macro.REPEAT_FOREVER,0);
            }
        }
    },
    get_random_num:function(idx){
        var num = []
        if(idx==0){
            num = [1,2,3,4]
        }else if(idx==1){
            num = [0,2,3,4]
        }else if(idx==2){
            num = [0,1,3,4]
        }else if(idx==3){
            num = [0,1,2,4]
        }else if(idx==4){
            num = [0,1,2,3]
        }else{
            num = [0,1,2,3,4]
            var idx = Math.floor(Math.random()*5)
            return num[idx]
        }
        var idx = Math.floor(Math.random()*4)
        return num[idx]
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
    down_egg5:function(egg,idx){
        egg.y-=this.speed[idx]
        if(egg.y<-105){egg.active=true}
        if(egg.y==-560 && (345<this.lanzi.x&&this.lanzi.x<370))this.down_basket(egg,5)
        for(var k in this.egg_arr[4]){
            if(this.egg_arr[4][k].y < -560){
                this.c_eggPool5.put(this.egg_arr[4][k]);
                this.egg_arr[4].splice(k, 1);
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
        //cc.log(str)

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
