//定义全局的变量
//处理事件的类库
var netConfig=require('NetConfig');

var NetControl={
    _sock:null,  //当前的webSocket的对象
    fun : null,
    open_num: 0,
    again_server_open_num:0,
    lockReconnect: false,
    tip_layout: null,
    tip_frame: null,
    connect: function (fun) {
        this.fun = fun
        this._sock = new WebSocket(netConfig.host); 
        this._sock.onopen = this._onOpen.bind(this);
        this._sock.onclose = this._onClose.bind(this);
        this._sock.onmessage = this._onMessage.bind(this);
        this._sock.onerror = this._onerror.bind(this)
        return this;
    },

    _onOpen:function(){
        this.open_num = 0
        cc.log("server open")
        if(this.fun)(this.fun())
    },
    _onClose:function(err){
        //onfire.fire("onclose",err);
        if(cc.director.getScene().name != "login"){
            //处理游戏内网络断开
            this._sock.close()
            if(this.open_num <= 5){
                this.reconnect()
            }else{
                this.show_open_server_frame()
            }
            cc.log("server close")
        }else{
            this.reconnect()
        }
    },
    _onMessage:function(obj){
        this._onMsg(obj.data)
    },
    _onerror: function(){
        var scn = cc.director.getScene()
        if(cc.director.getScene().name == "login"){
            //处理登录游戏网络问题
            this._sock.close()
            if(this.fun)(this.fun(1001))
        }
        cc.log("server error")
    },

    send:function(msg){
        var self = this
        var data = JSON.stringify(msg)
        this._sock.send(data);
    },
    _onMsg : function (json) {
        var data = null;
        try {
            data = JSON.parse(json);
        }
        catch(e){
            if(this._jsonstr) {
                this._jsonstr += json;
            }
            else{
                this._jsonstr = json;
            }
        }

        if (!data) {
            return;
        }
        this._jsonstr = null;
        if(data.resp.code != 200){
            cc.log(data.rid+"    error,code=="+data.resp.code)
        }
        this.sendMessage(data.rid, data,data.resp.code);
    },
    _processErrCode: function(code){
        if(code == 408){
            this._sock.close()
            //alert("请求超时！")
        }else if(code == 205){
            //alert("货币不足！")
        }else{
            cc.log(code)
        }
    },
    sendMessage: function(eventname,userdata,code){
        var gamedata=require('data');
        for(var x of gamedata.message_fun_map){
            if(x[0]==eventname){
                x[1](userdata.resp,code)
            }
        }
    },
    reconnect: function() {
        var self = this
        var open_server = setTimeout(function () {
            self.open_num++
            cc.log(self.open_num)
            self.connect()
        },60);
    },
    show_open_server_frame: function(){
        var self = this
        this._sock.close()
        var gamedata=require('data');
        if(gamedata.black_ly){
            this.again_server_open_num++
            if(!this.tip_frame && !this.tip_layout){
                this.tip_layout = cc.instantiate(gamedata.black_ly);
                cc.director.getScene().getChildByName("Canvas").addChild(this.tip_layout)
                this.tip_layout.x = 0;this.tip_layout.y=0
                this.tip_layout.on(cc.Node.EventType.TOUCH_END, function (event) {})
                this.tip_frame = cc.instantiate(gamedata.tip_ly);
                this.tip_frame.zIndex = 999
                cc.director.getScene().getChildByName("Canvas").addChild(this.tip_frame)
                this.tip_frame.getChildByName("xiao_hao").active = false
                this.tip_frame.getChildByName("confirm").active = false
                this.tip_frame.getChildByName("cancel").active = false                
            }
            if(this.again_server_open_num <= 3){
                this.tip_frame.getChildByName("content").getComponent(cc.RichText).string = "正在尝试重新连接（" + this.again_server_open_num+"/3）"
                this.tip_frame.runAction(cc.sequence(cc.delayTime(1.5),cc.callFunc(function(){
                    self.connect(function(){
                        cc.director.getScene().getChildByName("Canvas").removeChild(self.tip_layout)
                        cc.director.getScene().getChildByName("Canvas").removeChild(self.tip_frame)
                    })
                })))
            }else{
                this.tip_frame.getChildByName("content").getComponent(cc.RichText).string = "网络连接异常，请检查网络！"
                this.tip_frame.getChildByName("confirm").active = true;this.tip_frame.getChildByName("confirm").x = 0
                this.tip_frame.getChildByName("confirm").on(cc.Node.EventType.TOUCH_END, function (event) {
                    self.connect(function(){
                        cc.director.getScene().getChildByName("Canvas").removeChild(self.tip_layout)
                        cc.director.getScene().getChildByName("Canvas").removeChild(self.tip_frame)
                    })
                });               
            }
        }
    }
};

module.exports=NetControl;
