/*
*   @author:wangzhengkai
*   @date:2017-11-06
*   @version:0.2.0
*   @desc:前端日志采集js插码
*   发出的报文格式：data="od|dm|ul|tl|rf|sh|sw|cd|bt";
*/
(function () {
    if (window.Log) {//如果不为空，直接返回，避免重复安装
        return;
    }
    var params = {
        isClick:false,
        sign:{
            'dt': '',  //数据类型标识
            'sid': '', //系统id            
            'pr':''    //省份编码
        },
        base:{
            'wid': '', //工单流水号
            'uid': '', //坐席id
            'cn': ''   //呼入号码
        },
        common: {
            'ts': '',    //时间戳            
            'tl': '',    //页面标题
            'ul': ''     //当前页面url
        },
        eve: {
            'rf': '',    //上一页链接
            'lp': '',    //页面加载时间        
            'dr': '',    //dom加载时间
            'ws': '',    //白屏时间
            'ec': '',    //事件类型
            'ea': '',    //事件标题
            'ev': '',    //事件值
            'cb': '',    //通话开始时间
            'ce': ''     //通话结束时间
        },
        mou: {
            'cl': ''    //点击位置(x,y)
        }
    };

    // localStorage 不可用的情况下，不处理日志
    var storage = window.localStorage || {
        getItem: function () { },
        setItem: function () { }
    };
    var default_options = {
        server1: 'http://172.20.120.9:20007/servefc?data=', // 日志中心server地址
        server2: 'http://172.20.120.9:20008/servefc?data='
    };
    var LOG_SPLIT_FLAG = '@@',//每条日志分隔符（仅内部使用）
        StorageKey = "allLog",
        ClickKey = "click",
        callKey = "callKey";
    //日志采集
    var Log = {
        init: function () {
            var start = new Date().getTime(), end, _this = this;
            _this.getDataType();
            _this.getDocument();
            _this.getWindow();
            if(params.isClick == true){
                _this.getMousePos();
            }
        },
        //Document对象数据
        getDocument: function () {
            if (document) {
                if (document.title.indexOf("|") != -1) {
                    var title = document.title.replace("|", " ");
                    params.common.tl = title;
                } else {
                    params.common.tl = document.title || '';
                }
                params.common.ul = document.URL || '';
                params.eve.rf = document.referrer || '';
            }
        },
        getCookie: function(key){
            if (document.cookie.length>0){
                c_start = document.cookie.indexOf(key + "=");
                if (c_start != -1){
                    c_start = c_start + key.length+1;
                    c_end = document.cookie.indexOf(";",c_start);
                    if (c_end == -1) c_end=document.cookie.length;
                    return unescape(document.cookie.substring(c_start,c_end));
                }
            }
            return "";
        },
        findStartCookie : function() {
            var aSubCookies = this.getCookie('CMOSA').split('&');
            var startTime, bReferrerMatch;
            for ( var j = 0; j < aSubCookies.length; j++ ) {
                if ( 0 === aSubCookies[j].indexOf("s=") ) {
                    startTime = aSubCookies[j].substring(2);
                }
                else if ( 0 === aSubCookies[j].indexOf("r=") ) {
                    var startPage = aSubCookies[j].substring(2);
                    bReferrerMatch = ( document.referrer == startPage );
                }
            }
            if ( bReferrerMatch && startTime ) {
                return startTime;
            }
            return undefined;
        },
        //Window对象数据
        getWindow: function () {
            var _this = this;
            if (window.performance) {
                window.onload = new function () {
                    var t = window.performance.timing;
                    params.eve.lp = t.loadEventEnd - t.navigationStart;//页面加载时长
                    if (params.eve.lp <= 0) {
                        // 未加载完，延迟200ms后继续getWindow方法，直到成功
                        setTimeout(function () {
                            _this.getWindow();
                        }, 200);
                        return;
                    }
                    params.eve.ws = t.responseStart - t.navigationStart;//白屏
                    params.eve.dr = t.domContentLoadedEventEnd - t.navigationStart;//dom加载时长
                    //判断是否是单页面应用，如果是单页面，就不执行自动发送
                    if (params.common.ul != document.URL) {
                        return;
                    }
                    Log.setData(StorageKey, Log.getParams(params.common) +"|"+ Log.getParams(params.eve), "page");
                };
            } else {
                var startTime = this.findStartCookie();
                window.onload = new function () {
                    var loadEndTime = new Date().getTime();
                    params.eve.lp = startTime ? (loadEndTime - startTime) : '';
                }
                Log.setData(StorageKey, Log.getParams(params.common) +"|"+ Log.getParams(params.eve), "page");
            }
        },
        
        //事件跟踪
        trackEvent: function (trackInfo, obj) {
            var _this = this;
            for (var i in params.eve) {
                if (i != 'ce') {
                    params.eve[i] = '';
                } 
            }
            params.eve.ec = trackInfo[0] || '';     //类别
            params.eve.ea = trackInfo[1] || '';     //动作
            params.eve.ev = trackInfo[2] || '';     //数值
            var hrefVal = obj.getAttribute('href') || '';
            if (hrefVal.indexOf('.html') === -1 && hrefVal.indexOf('.jsp') === -1) {
                _this.setData(StorageKey, _this.getParams(params.common)+"|"+ _this.getParams(params.eve),"page");
                params.eve.ec = '';
                params.eve.ea = '';
                params.eve.ev = '';
            } else {
                if (window.addEventListener) {
                    //离开页面时
                    window.addEventListener('unload', function (event) {
                        _this.setData(StorageKey, _this.getParams(params.common)+"|"+ _this.getParams(params.eve),"page");
                    });
                } else {
                    window.attachEvent('onunload', function (event) {
                        _this.setData(StorageKey, _this.getParams(params.common)+"|"+ _this.getParams(params.eve),"page");
                    });
                }
            }
        },

        //提供通话开始时的方法
        CallStart:function (wid, uid, cn) {
            var _this = this;
            var str =  wid +"|" + uid + "|" + cn;
            var cb = new Date().getTime();
            localStorage.setItem(callKey, str);
            _this.setData(StorageKey, cb+"||||||||||"+cb+"|","page");
        },

        //提供通话结束时的方法
        CallEnd:function() {
            var _this = this;            
            var ce = new Date().getTime();
            _this.setData(StorageKey, ce+"|||||||||||"+ce,"page");            
            localStorage.setItem(callKey, "||");
        },

        //鼠标点击事件
        getMousePos: function (event) {
            var _this = this;
            if (document.addEventListener) {
                document.addEventListener("mousedown", function () {
                    var e = event || window.event;
                    params.mou.cl = '(' + e.clientX + ',' + e.clientY + ')';
                    _this.getDocument();
                    _this.setData(ClickKey, _this.getParams(params.common)+"|"+ _this.getParams(params.mou),"click");
                });
            }else{
                document.attachEvent("onmousedown",function () {
                    var e = event || window.event;
                    params.mou.cl = '(' + e.clientX + ',' + e.clientY + ')';
                    _this.getDocument();
                    _this.setData(ClickKey, _this.getParams(params.common)+"|"+ _this.getParams(params.mou),"click");
                })
            }
            
        },

        //拼接参数串
        getParams: function (name) {
            params.common.ts = new Date().getTime();//每条数据添加时间戳
            params.eve.ce = 'knowledge';
            var args = '';
            for (var i in name) {
                if ( i !="ts" && i != "rf" && i!="cl") {
                    args += '|';
                }
                args += name[i];
            }
            return args;
        },

        //发送数据
        sendMsg: function (datas,server) {
            var data = encodeURIComponent(datas);
            //通过Image对象向跨域后端发送报文
            var img = new Image(1, 1);
            if (server == '20007') {
                img.src = default_options.server1 + data;                
            } else {
                img.src = default_options.server2 + data;                
            }
        },

        getDataType: function (){
            if (_cmosq) {
                for (var i in _cmosq) {
                    switch (_cmosq[i][0]) {
                        case 'dataType':
                            params.sign.dt = _cmosq[i][1];
                            break;
                        case 'sid':
                            params.sign.sid = _cmosq[i][1];
                            break;
                        case 'prov':
                            params.sign.pr = _cmosq[i][1];
                            break;
                        case 'isClick':
                            params.isClick = _cmosq[i][1];
                            break;
                        default:
                            break;
                    }
                }
            }
        },

        //将数据存储到localStorage中
        setData: function (key, str, signLabel) {
            //发送日志
            var _this = this;
            var callInfo = localStorage.getItem(callKey)||"||";
            var log = params.sign.dt + '|' + params.sign.sid + '|' + params.sign.pr + '|' + callInfo + "|" + str;
            if(signLabel == 'page'){
                _this.sendMsg(log,'20007');
            }
            if(signLabel == 'click'){
                _this.sendMsg(log,'20008');
            }
        },
    };
    
    Log.init();
    window.Log = Log;
})();
