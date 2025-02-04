//知识前台打开页面方式,1:open,2:tab
/**
 * 知识库工具类,,'waterMarks'
 */
define(["Util","crossAPI","js/constants/constants","Log",'gwm','waterMarks','waterMarksNew', 'js/personalCenter/MyAlert'],
    function(Util,crossAPI,Constants,logs,gwm,waterMarks,waterMarksNew, MyAlert){
    var _root =  window.location.protocol+"//"+ window.location.host;
    var oldCallInfoTag;
    var oldProductTag;
    var opPrsnId;
    var scrollHt = 0;
    var pageGetFocus = true;
    var getProductOld = localStorage.getItem("ngkm_getProduct");
    if($("#tagOpenWin").length<1){
        $("body").append('<a id="tagOpenWin" target="_blank" ></a>');
    }
        /**
         * 打开新页面
         *
         * @param openMode 打开方式
         * @param openType crossAPI相关信息
         * @param url 页面地址
         * @param param 参数
         * @param name 页面名称
         * @param paramConcatChar 参数拼接分隔符
         */
    var openTab = function(openMode, openType, url, param, name, paramConcatChar){
        //2采用crossAPI打开页面
        var openModeMap  =  {open:"1",tab:"2"};
        if(openMode == openModeMap.tab){
            var count = 0;
            if(null != param){
                var paramStr = "";
                for(var key in param){
                    if(count != 0){
                        paramStr = paramStr + "&";
                    }
                    paramStr = paramStr + key+"="+param[key];
                    count++;
                }
                if(null != paramStr && paramStr != ""){
                    url = url + (url.indexOf("?") != -1 ? "&" : "?") + paramStr;
                    //url = url + (paramConcatChar ? paramConcatChar : "?") +paramStr;
                }
            }
            if(openType && openType.crossAPIArg){
                crossAPI = openType.crossAPIArg;
            }
            crossAPI.destroyTab(name);
            crossAPI.createTab(name, _root +url, param);
            if(openType && openType.tabName){
                crossAPI.destroyTab(openType.tabName);
            }
        }
        else{
            var fulls = "left=0,screenX=0,top=0,screenY=0,scrollbars=1";
            if (window.screen) {
                var ah = screen.availHeight - 30;
                var aw = screen.availWidth - 10;
                fulls += ",height=" + ah;
                fulls += ",innerHeight=" + ah;
                fulls += ",width=" + aw;
                fulls += ",innerWidth=" + aw;
                fulls += ",resizable"
            } else {
                fulls += ",resizable"; // 对于不支持screen属性的浏览器，可以手工进行最大化。 manually
            }
            var count = 0;
            if(null != param){
                var paramStr = "";
                for(var key in param){
                    if(count != 0){
                        paramStr = paramStr + "&";
                    }
                    paramStr = paramStr + key+"="+param[key];
                    count++;
                }
                if(null != paramStr && paramStr != ""){
                    url = url + (paramConcatChar ? paramConcatChar : "?") +paramStr;
                }
            }
//                window.location.href = url;
            var tagOpenWin = $("#tagOpenWin");
            tagOpenWin.attr("href",url);
            if(openType && openType.target){
                tagOpenWin.attr("target",openType.target);
            }
            document.getElementById("tagOpenWin").click();
        }
    };

    return{
        /**
         * 打开方式常量
         **/
        openMode : {open:"1",tab:"2"},
        /**
         * 获取URL参数
         **/
        getUrlParamter : function(key, url){
            var searchURL = decodeURI(window.location.href);
            if(url){
                searchURL = decodeURI(url);
            }
            var begin = searchURL.indexOf("?");
            searchURL = searchURL.substr(begin+1);
            var query = decodeURI(searchURL);
            // var query = location.search.substring(1); //获取查询串
            var pairs = query.split("&"); //在逗号处断开
            for (var i = 0; i < pairs.length; i++) {
                var pos = pairs[i].indexOf('='); //查找name=value
                if (pos == -1) continue; //如果没有找到就跳过
                var argname = pairs[i].substring(0, pos); //提取name
                if(argname == key){
                var param =  pairs[i].substring(pos + 1);
                if(param.indexOf("#") != -1){
                   var attr = param.split('#');
                   param = attr[0];
                }
                    return param;
                }
            }
            return null;
        },
        getUrlParamsEncode:function (key) {
            var searchURL = window.location.href;
            var begin = searchURL.indexOf("?");
            searchURL = searchURL.substr(begin+1);
            var query = searchURL;
            // var query = location.search.substring(1); //获取查询串
            var pairs = query.split("&"); //在逗号处断开
            for (var i = 0; i < pairs.length; i++) {
                var pos = pairs[i].indexOf('='); //查找name=value
                if (pos == -1) continue; //如果没有找到就跳过
                var argname = pairs[i].substring(0, pos); //提取name
                if(argname == key){
                    var param =  pairs[i].substring(pos + 1);
                    if(param.indexOf("#") != -1){
                        var attr = param.split('#');
                        param = attr[0];
                    }
                    return decodeURIComponent(param);
                }
            }
            return null;
        },
        /**
         * 设置前台页面打开方式
         **/
        setOpenMode:function(openMode){
            var storage = window.localStorage;
            storage.setItem('openMode', openMode);
            window.openMode = openMode;
        },
        /**
         * 获取页面打开方式
         **/
        getOpenMode:function(){
            var storage = window.localStorage;
            return storage.getItem('openMode');
        },
        /**
         * 设置前台页面省份编码
         **/
        setStorage:function(key,value){
            var storage = window.localStorage;
            storage.setItem(key, value);
        },
        setPrsnId:function(value){
            opPrsnId = value;
        },
        getScrollHt:function(){
            return scrollHt;
        },
        //设置当前滚动条的高度
        setScrollHt:function(value){
            scrollHt = value;
        },
        getFocusFalg :function(){
            return pageGetFocus;
        },
        setFocusFalg :function(value){
            pageGetFocus = value;
        },
        /**
         *知识前台打开另一页面方法
         * @param name 名称
         * @param url 路径
         * @param param 参数，示例:{ businessID:15 }
         * @param openType 参数，示例:{target:"_self",tabName:"需要关闭的选项卡名称"};
         */
        openTab : function(name,url,param,openType,mode){
            param = param || {};
            var storage = window.localStorage;
            var openMode = storage.getItem('openMode');
            var sessionId = storage.getItem("sessionId");
            if(sessionId != null && url.indexOf("kmsessionId") == -1){
                param.kmsessionId=sessionId;
            }
            if("2"==mode){
                openMode = "2";
            }
            if(url.indexOf("kmSecondHome.html") != -1 || url.indexOf("kmSecondHomeNew.html") != -1){
                url = storage.getItem("homeUrl") || url.replace("kmSecondHome.html", "kmSecondHomeNew.html");
                if(url.indexOf("kmSecondHomeNew.html") != -1){
                    name = "知识库首页";
                }
                url = url.replace(_root, "");
            }

            var host = window.location.host;

            //判断页面
            if((url.indexOf("knowledgeAppNew/knowledgeDetailNew.html") != -1 || url.indexOf("knowledgeDetailSection.html") != -1)){
                var knwlgId = param.knwlgId || this.getUrlParamter("knwlgId", url);
                param.sysCode = "ngkm";
                param.serviceName = "知识库-老详情页";
                param.accessType = "1";
                var pageCount = localStorage.getItem("pageCount");
                var tipsFlag = localStorage.getItem("tipsFlag");
                if(tipsFlag==='true' && Number(pageCount) >=8 ){
                    new MyAlert({
                        type: 'error',
                        text: '您已同时打开'+pageCount+'个知识页面，为避免出现页面卡顿，请关闭暂时不需要的页面',
                        falseShow: false,
                        trueName: "我知道了",
                        ok: function (){
                            Util.ajax.getJson(Constants.AJAXURL + "/staticDispose/getStaticHtmlProvnce", {}, function(data){
                                //非客服系统开启新详情页面缓存控制开关
                                var flag = true;
                                if(host.indexOf("ngkm.cs.cmos") != -1 || host.indexOf("localhost") != -1 || host.indexOf("127.0.0.1") != -1){
                                    flag = true;
                                }else{
                                    if(data.returnMessage != 1){
                                        flag = false
                                    }
                                }
                                if(data.object && flag){
                                    //取请求地址
                                    Util.ajax.getJson(Constants.AJAXURL + "/staticDispose/getStaticHtmlUrl?knwlgId=" + knwlgId, {}, function(data){
                                        if(data && data.returnCode == 0 && data.object){
                                            //记录点击
                                            param.serviceName = "detail-newPage";
                                            //将原始url上面携带参数转换到新链接上
                                            var searchURL = decodeURI(url);
                                            var begin = searchURL.indexOf("?");
                                            searchURL = searchURL.substr(begin+1);
                                            var query = decodeURI(searchURL);
                                            var pairs = query.split("&"); //在逗号处断开
                                            for (var i = 0; i < pairs.length; i++) {
                                                var k_v = pairs[i].split("=");
                                                if(k_v.length <= 1){
                                                    continue;
                                                }
                                                var key = k_v.splice(0, 1).join("=");
                                                if(!param[key]){
                                                    param[key] = k_v.join("=");
                                                }
                                            }
                                            url = data.object;
                                            openTab(openMode, openType, url, param, name, "&");
                                        }/*else{
                                //跳转异常  给出弹框提示
                                openTab(openMode, openType, url, param, name, "?");
                            }*/
                                    });
                                }else{

                                    openTab(openMode, openType, url, param, name, "?");
                                }
                            });
                            localStorage.setItem('tipsFlag','false');
                        }
                    });
                }else{
                    //取开关 原计划将打开方式写入本地缓存 然后设置有效时间 但是考虑到跨网协同等特殊情况 暂不予考虑
                    Util.ajax.getJson(Constants.AJAXURL + "/staticDispose/getStaticHtmlProvnce", {}, function(data){
                        //非客服系统开启新详情页面缓存控制开关
                        var flag = true;
                        if(host.indexOf("ngkm.cs.cmos") != -1 || host.indexOf("localhost") != -1 || host.indexOf("127.0.0.1") != -1){
                            flag = true;
                        }else{
                            if(data.returnMessage != 1){
                                flag = false
                            }
                        }
                        if(data.object && flag){
                            //取请求地址
                            Util.ajax.getJson(Constants.AJAXURL + "/staticDispose/getStaticHtmlUrl?knwlgId=" + knwlgId, {}, function(data){
                                if(data && data.returnCode == 0 && data.object){
                                    //记录点击
                                    param.serviceName = "detail-newPage";
                                    //将原始url上面携带参数转换到新链接上
                                    var searchURL = decodeURI(url);
                                    var begin = searchURL.indexOf("?");
                                    searchURL = searchURL.substr(begin+1);
                                    var query = decodeURI(searchURL);
                                    var pairs = query.split("&"); //在逗号处断开
                                    for (var i = 0; i < pairs.length; i++) {
                                        var k_v = pairs[i].split("=");
                                        if(k_v.length <= 1){
                                            continue;
                                        }
                                        var key = k_v.splice(0, 1).join("=");
                                        if(!param[key]){
                                            param[key] = k_v.join("=");
                                        }
                                    }
                                    url = data.object;
                                    openTab(openMode, openType, url, param, name, "&");
                                }/*else{
                                //跳转异常  给出弹框提示
                                openTab(openMode, openType, url, param, name, "?");
                            }*/
                            });
                        }else{

                            openTab(openMode, openType, url, param, name, "?");
                        }
                    });
                }
                localStorage.setItem('pageCount',Number(pageCount)+1);
            }else{
                openTab(openMode, openType, url, param, name, "?");
            }
        },
        openTabUseFullURLPath : function(name,url){
            var storage = window.localStorage;
            var openMode = storage.getItem('openMode');
            if(openMode == this.openMode.tab){
                crossAPI.destroyTab(name);
                crossAPI.createTab(name,  url, {});
            }else{
                $("#tagOpenWin").attr("href",url);
                document.getElementById("tagOpenWin").click();
            }
        },
        getSession : function(){
            var result = {};
            Util.ajax.getJson(Constants.AJAXURL+'/user/session',{}, function(data, status){
                if (status){
                    result = data.bean;
                    return result;
                }else{

                }
            },false);//此方法没用
            return result;
        },
        setLogConfig:function(){
            var userInfo = {};
            if(this.getOriginType("https://")){
                return;
            }
            Util.ajax.getJson(Constants.AJAXURL+'/user/session',{}, function(data, status){
                if (status){
                    userInfo = data.bean;
                    // 初始化设置日志内容
                    var HTMLhref = location.href;
                    var envFlag = window.localStorage.getItem("envFlag");
                    if(HTMLhref.indexOf("ngkm.cs.cmos:8080") != -1 || HTMLhref.indexOf("172.20.127.233") != -1 || 'test' == envFlag){
                        logs.setConfig({"userId":userInfo.staffCode,"systemCode":"ngkm","appName":"ngkm",province:userInfo.provnce,"server":"http://172.20.118.15:10010/frontlogger/errorlog"});
                    }else if(HTMLhref.indexOf("ngkm.cs.cmos") != -1 || 'product' == envFlag){
                        logs.setConfig({"userId":userInfo.staffCode,"systemCode":"ngkm","appName":"ngkm",province:userInfo.provnce,"server":"http://frontlog.cmos/frontlogger/errorlog"});
                    }else if(HTMLhref.indexOf("192.168.0.1") != -1 || HTMLhref.indexOf("localhost") != -1 || 'develop' == envFlag){
                        logs.setConfig({"userId":userInfo.staffCode,"systemCode":"ngkm","appName":"ngkm",province:userInfo.provnce,"server":"http://192.168.100.105:20000/frontlogger/errorlog"});
                    }
                }else{

                }
            });//同步，保证加载顺序
        },
        closeTab:function (name) {
            var storage = window.localStorage;
            var openMode = storage.getItem('openMode');
            if(openMode == this.openMode.tab){
                crossAPI.destroyTab(name);
            }
            else{
                window.close();
            }
        },
        getPhoneNum: function(callBack){
            var openMode = this.getOpenMode() || "1";
            if ("2" == openMode && crossAPI.url != undefined) {
                crossAPI.getContact("getClientBusiInfo", Constants.PARAMJSONBUSINFO, function (clientBusiInfo) {
                    var phoneNumber = clientBusiInfo.bean.msisdn || "";
                    if(callBack){
                        callBack(undefined,phoneNumber);
                    }
                });
            } else {
                Util.ajax.getJson(Constants.AJAXURL + '/kmClient/getClientInfo' + "?t=" + new Date().getTime(), {}, function (data, state) {
                    var phoneNumber;
                    if (state) {
                        if (data && data.bean && data.bean.msisdn) {
                            phoneNumber = data.bean.msisdn;
                        }
                    }
                    if(callBack){
                        callBack(undefined,phoneNumber);
                    }
                })
            }
        },
        getSerialNo: function(operateType,callBack){
            var openMode = this.getOpenMode() || "1";
            if ("2" == openMode && crossAPI.url != undefined) {
                crossAPI.getContact("getAgentState",Constants.PARAMJSONAGENT, function (agentState) {
                    if(agentState && agentState.agentState == "7"){
                        crossAPI.getContact("getCallingInfo",Constants.PARAMJSONCALL, function(callingInfo) {
                            var serialNo = "";
                            var callingNum;
                            var acceptNum;
                            if (callingInfo) {
                                serialNo = callingInfo.serialNo ? callingInfo.serialNo : "";
                                callingNum = callingInfo.callType == "0" ? callingInfo.callerNo : callingInfo.calledNo;
                                acceptNum = callingInfo.subsNumber;//受理号码
                            }
                            if(callBack){
                                callBack({isCalling:true, serialNo: serialNo, callingNum: callingNum, acceptNum: acceptNum});
                            }
                        });
                    }else{
                        if(callBack){
                            callBack({isCalling: false});
                        }
                    }
                });
            }else{
                if("1"==operateType){
                    //open方式 打开, 直接获取clientinfo
                    if(!oldCallInfoTag){
                        if(window.addEventListener){//IE8+
                            window.addEventListener("storage",function (e) {
                                if(e.key == "ngkm_getCallInfoResponse"){
                                    var callInfoResponse = e.newValue;
                                    if(callBack && callInfoResponse){
                                        callBack(JSON.parse(callInfoResponse));
                                    }
                                }
                            });

                        }else{//IE8
                            $(document).on("storage",function () {
                                var callInfoResponse = localStorage.getItem("ngkm_getCallInfoResponse");
                                if(callInfoResponse){
                                    var response = JSON.parse(callInfoResponse);
                                    if(response.oldCallInfoTag == oldCallInfoTag && callBack){
                                        callBack(callInfoResponse);
                                    }
                                }
                            });
                        }
                    }
                    oldCallInfoTag = new Date().getTime();
                    this.setStorage("ngkm_getCallInfo", oldCallInfoTag);
                }
                if("2"== operateType){
                    var startTime=new Date().getTime();
                    console.log("getSerialNo方法执行");
                    //open方式 打开, 直接获取clientinfo
                    if(!oldProductTag){
                       /* if(window.addEventListener){//IE8+
                            window.addEventListener("storage",function (e) {
                                if(e.key == "ngkm_getProductResponse"){
                                    var callInfoResponse = e.newValue;
                                    if(callBack && callInfoResponse){
                                        callBack(JSON.parse(callInfoResponse));
                                        console.log("getSerialNo方法执行结束，用时"+(new Date().getTime()-startTime)/1000+"秒");
                                    }
                                }
                            });
                        }*/

                        if(window.addEventListener){//IE8+
                            window.addEventListener("storage",function (e) {
                                var getProductNew = localStorage.getItem("ngkm_getProduct");
                                if(!getProductOld || getProductOld != getProductNew){
                                    var callInfoResponse = localStorage.getItem("ngkm_getProductResponse");
                                    console.log("回调函数的callInfoResponse为："+JSON.parse(callInfoResponse));
                                    var productResponse = JSON.parse(callInfoResponse);
                                    if(productResponse && callBack){
                                        callBack(productResponse);
                                        console.log("getSerialNo方法执行结束，用时"+(new Date().getTime()-startTime)/1000+"秒");
                                    }
                                    getProductOld = getProductNew;
                                }
                            });
                         }

                     }
                    oldProductTag = new Date().getTime();
                    this.setStorage("ngkm_getProduct", oldProductTag);
                }

            }
        },
        getOriginType: function(type){
            return this.getOrigin().indexOf(type) != -1;
        },
        getOrigin: function(){
            return window.location.protocol + "//" + window.location.host;
        },
        // 详情页添加水印
        addKlgDetailWaterMark:function (){
            //解耦框架详情页不添加水印
            var decoupWaterMark  = window.localStorage.getItem("decoupWaterMark");
            var nowTime = new Date().getTime()
            if (decoupWaterMark && nowTime-decoupWaterMark < 12*60*60*1000) {
                return;
            }
            Util.ajax.getJsonAsync(Constants.AJAXURL + '/knowledge/getKlgDetailWaterFlag' + "?t=" + new Date().getTime())
                .done(function (data, state) {
                    if (state) {
                        var mark =  $('.knowd-detail')[0];
                        var waterFlag = data.bean.waterFlag;
                        // var opPrsnId = data.bean.opPrsnId;

                        if(window.top===window.self){
                            //open方式添加水印
                            if ((!!window.ActiveXObject || "ActiveXObject" in window) && document.documentMode < 11) {
                                //判断ie9水印开关是否打开
                                var waterFlagIE9 = data.bean.waterFlagIE9;
                                if (waterFlagIE9 == "0"){
                                    $(mark).css("background-image", "url(data:image/png;base64," + data.bean.imageStr + ")");
                                    $(mark).addClass("waterMark");
                                }
                            }else {
                                //判断ie11水印开关是否打开
                                var waterFlagIE11 = data.bean.waterFlagIE11;
                                if (waterFlagIE11 == "0"){
                                    $(mark).css("background-image", "url(data:image/png;base64," + data.bean.imageStr + ")");
                                    $(mark).addClass("waterMark");
                                }
                            }
                        }else {
                            //内嵌方式根据配置添加水印
                             if ( waterFlag === "0"){
                                $(mark).css("background-image", "url(data:image/png;base64," + data.bean.imageStr + ")");
                                $(mark).addClass("waterMark");
                            }
                        }
                    }

                }).fail(function (data) {

            });
        },
        // 个人主页添加水印
        addHomePageWaterMark: function (dom) {
            Util.ajax.getJsonAsync(Constants.AJAXURL + '/knowledge/getwaterFlag' + "?t=" + new Date().getTime())
                .done(function (data, state) {
                    if (state) {
                        var waterMarkStr = data.bean.waterMarkStr;
                        if ((!!window.ActiveXObject || "ActiveXObject" in window) && document.documentMode < 11) {
                            //当前浏览器为ie11以下版本
                            var water = $("#repeat-watermark");
                            var waterFlagIE9 = data.bean.waterFlagIE9;
                            var $water = dom ? $(dom) : $('body');
                            if ("0" == waterFlagIE9) {
                                Util.ajax.getJsonAsync(Constants.AJAXURL + '/knowledge/getKlgDetailWaterFlag' + "?t=" + new Date().getTime())
                                    .done(function (datas, state) {
                                        if (state) {
                                            if (window.top === window.self) {
                                                //open方式添加水印
                                            } else {
                                                //内嵌方式根据配置添加水印
                                                $water.css("background-image", "url(data:image/png;base64," + datas.bean.imageStr + ")");
                                                $water.addClass("waterMark");
                                            }
                                        }

                                    }).fail(function (data) {

                                    });
                            }
                        } else {
                            //当前浏览器为ie11及其他浏览器
                            var water = $("div.water-mark-container");
                            if (water) {
                                $("div.water-mark-container").remove();
                            }
                            var waterFlag = data.bean.waterFlag;
                            var $water;
                            if ("0" == waterFlag) {
                                $water = dom ? $(dom)[0] : $('body')[0];//其他页面要绑定的水印区域的容器
                                var config = {
                                    text: waterMarkStr,
                                    markWidth: data.bean.waterWidth ? data.bean.waterWidth : 200,      // 水印宽度
                                    markHeight: data.bean.waterHeight ? data.bean.waterHeight : 80,    // 水印高度
                                    angle: 20,          // 倾斜角度
                                    fontSize: 20,      // 字体大小
                                    color: data.bean.waterColor ? data.bean.waterColor : "#8a8b8c",    // 字体颜色
                                    opacity: data.bean.opacity ? data.bean.opacity :0.3,//透明度
                                    fontFamily: 'normal 12px Arial', // 字体
                                }
                                new WaterMark($water, config);
                            }
                        }
                    }
                }).fail(function (data) {

                });
        },
        // pc端添加水印
        addWaterMark: function (flag){
            Util.ajax.getJsonAsync(Constants.AJAXURL + '/knowledge/getwaterFlag' + "?t=" + new Date().getTime())
                .done(function (data, state) {
                    if (state) {
                        if (window.top===window.self) {//省份配置添加水印且当前页面打开方式为Open
                            var waterMarkStr = data.bean.waterMarkStr;
                            if ((!!window.ActiveXObject || "ActiveXObject" in window) && document.documentMode < 11) {
                                //当前浏览器为ie11以下版本
                                var water = $("#repeat-watermark");
                                if (water) {
                                    $("#repeat-watermark").remove();
                                }
                                var waterFlagIE9 = data.bean.waterFlagIE9;
                                var $water = $('body');
                                if ("0"==waterFlagIE9) {
                                    var config = {
                                        texts: waterMarkStr,//水印文字
                                        fontStyle:"12px 微软雅黑", //水印字体
                                        rotateAngle:-30 * Math.PI / 180,//水印旋转度，ie8下此配置无效
                                        fontColor: data.bean.waterColor ? data.bean.waterColor : "rgba(138,139,140,0.1)",//水印字体颜色
                                        width:data.bean.waterWidth ? data.bean.waterWidth : 270,//每行水印文字的水平间距
                                        height: data.bean.waterHeight ? data.bean.waterHeight : 234, //水印文字的高度间距（低于文字高度会被替代）
                                        htmlOpacity:data.bean.opacity ? data.bean.opacity:0.8//仅ie8设置有效，设置页面元素透明度
                                    }
                                    new waterMarksNew($water,config);
                                }
                            }else {
                                //当前浏览器为ie11及其他浏览器
                                var water = $("div.water-mark-container");
                                if (water) {
                                    $("div.water-mark-container").remove();
                                }
                                var waterFlag = data.bean.waterFlag;
                                var $water;
                                if ("0"==waterFlag) {
                                    if (flag){
                                        if ("1" == flag){
                                            $water = $('.knowd-detail')[0];//详情页面要绑定的水印区域的容器
                                        } else if ("2" == flag) {
                                            $water = $('.ke-wrapper')[0];//咨询表查询页面添加水印
                                        }
                                    }else {
                                        $water = $('body')[0];//其他页面要绑定的水印区域的容器
                                    }
                                    var config = {
                                        text: waterMarkStr,
                                        markWidth:data.bean.waterWidth ? data.bean.waterWidth : 200,      // 水印宽度
                                        markHeight: data.bean.waterHeight ? data.bean.waterHeight : 80,    // 水印高度
                                        angle:20,          // 倾斜角度
                                        fontSize:20,      // 字体大小
                                        color: data.bean.waterColor ? data.bean.waterColor : "#8a8b8c",    // 字体颜色
                                        opacity:data.bean.opacity ? data.bean.opacity:0.3,
                                        fontFamily:'normal 12px Arial', // 字体
                                    }
                                    new WaterMark($water,config);
                                }
                            }
                        }
                    }
                }).fail(function (data) {

            });
        },
        //解耦框架添加水印
        addWaterMarkForDecoup: function (){
            Util.ajax.getJsonAsync(Constants.AJAXURL + '/knowledge/getwaterFlag' + "?t=" + new Date().getTime())
                .done(function (data, state) {
                    if (state) {
                        var waterFlagDecoup = data.bean.waterFlagDecoup;
                        if ("0" == waterFlagDecoup){
                            var waterMarkStr = data.bean.waterMarkStr;
                            var $water = $("#mainBody")[0];
                            if ((!!window.ActiveXObject || "ActiveXObject" in window) && document.documentMode < 11){
                                var config = {
                                    texts: waterMarkStr,//水印文字
                                    fontStyle:"14px 微软雅黑", //水印字体
                                    rotateAngle:-30 * Math.PI / 180,//水印旋转度，ie8下此配置无效
                                    fontColor: data.bean.waterColor ? data.bean.waterColor : "rgba(138,139,140,0.1)",//水印字体颜色
                                    width: data.bean.waterWidth ? data.bean.waterWidth : 270,//每行水印文字的水平间距
                                    height: data.bean.waterHeight ? data.bean.waterHeight : 234, //水印文字的高度间距（低于文字高度会被替代）
                                    htmlOpacity:data.bean.opacity ? data.bean.opacity:0.8//仅ie8设置有效，设置页面元素透明度
                                }
                                new waterMarksNew($water,config);
                            }else {
                                var config = {
                                    text: waterMarkStr,
                                    markWidth: data.bean.waterWidth ? data.bean.waterWidth : 200,      // 水印宽度
                                    markHeight: data.bean.waterHeight ? data.bean.waterHeight : 80,    // 水印高度
                                    angle: 20,          // 倾斜角度
                                    fontSize:20,      // 字体大小
                                    color: data.bean.waterColor ? data.bean.waterColor : "#8a8b8c",    // 字体颜色
                                    opacity:data.bean.opacity ? data.bean.opacity:0.3,
                                    fontFamily:'normal 16px Arial', // 字体
                                }
                                new WaterMark($water,config);
                            }
                            window.localStorage.setItem("decoupWaterMark",new Date().getTime());
                        }

                    }
                }).fail(function (data) {

            });
        },
        cleanWaterMark:function () {
            //删除水印
             if ((!!window.ActiveXObject || "ActiveXObject" in window) && document.documentMode < 11){
                 var water = $("#repeat-watermark");
                 if (water) {
                     $("#repeat-watermark").remove();
                 }
             }else {
                 var water = $("div.water-mark-container");
                 if (water) {
                     $("div.water-mark-container").remove();
                 }
             }
        },

        addWaterMarkH5 :function () {
            Util.ajax.getJsonAsync(Constants.AJAXURL + '/knowledge/getwaterFlag' + "?t=" + new Date().getTime())
                .done(function (data, state) {
                    if (state) {
                        var waterMarkH5 = data.bean.waterMarkStrH5;
                        var waterFlagH5 = data.bean.waterFlagH5;
                        if ("0"==waterFlagH5) {
                            var $water = $('body')[0];//要绑定的水印区域的容器
                            waterMarkH5 =  waterMarkH5.split("-");
                            if (waterMarkH5){
                                if (waterMarkH5.length==3) {
                                    waterMarkH5= [waterMarkH5[0]+"-"+waterMarkH5[1],waterMarkH5[2]]
                                }else if (waterMarkH5.length==2){
                                    waterMarkH5 = [waterMarkH5[0],waterMarkH5[1]];
                                }
                            }
                            var config = {
                                texts: waterMarkH5,//水印文字
                                fontColor: "rgba(0, 0, 0, .13)",//水印字体颜色
                                spaceX: 30,//水印文字水平间距
                                spaceY: 30, //水印文字的垂直间距
                                alpha:0.75,
                            }
                            new waterMarks($water, config);
                        }

                    }
                }).fail(function (data) {

            });
        },
        //H5详情页面添加暗水印
        addH5BlindWaterMark:function (){
            Util.ajax.getJson(Constants.AJAXURL + '/knowledge/getBlindWaterFlag'+ "?t=" + new Date().getTime(), {},  function (data) {
                if (data && data.returnCode == 0) {
                    var beanInfo = data.bean;
                    var obj = {
                        watermarkInfo: beanInfo.watermarkInfo,
                        pageLink: beanInfo.pageLink,
                        imagePath: beanInfo.imagePath,
                        targetHeightData: beanInfo.targetHeightData + "",
                        targetWidthData: beanInfo.targetWidthData + "",
                    };
                    var keys = Object.keys(obj);
                    //var k = keys.sort((a, b) => a.localeCompare(b));
                    var k = keys.sort(function(a, b) {
                        return a.localeCompare(b);
                    });
                    var val = "";
                    /*k.forEach((item) => {
                        val += hex_md5(obj[item]) + "_";
                    });*/
                    k.forEach(function(item) {
                        val += hex_md5(obj[item]) + "_";
                    });
                    val += beanInfo.appSecret+"_"+ beanInfo.operateTime;
                    console.log("var:"+val);
                    var sign = hex_md5(val);
                    console.log("sign:"+sign);
                    obj.operateTime = beanInfo.operateTime;
                    obj.sign = sign;
                    Util.ajax.postJson(Constants.AJAXURL + '/knowledge/getUIUEWaterCig', obj, function (rtnData) {
                        if (rtnData && rtnData.returnCode == "0" && rtnData.object) {
                            var water = $('body')[0];//要绑定的水印区域的容器
                            $(water).css("background-image", "url('"+ rtnData.object + "')");
                        }
                    });
                }
            });
        },
        //详情页面添加暗水印
        addKlgDetailBlindWaterMark:function (){
            //解耦框架详情页不添加水印
            var decoupWaterMark  = window.localStorage.getItem("decoupWaterMark");
            var nowTime = new Date().getTime()
            if (decoupWaterMark && nowTime-decoupWaterMark < 12*60*60*1000) {
                return;
            }
            Util.ajax.getJson(Constants.AJAXURL + '/knowledge/getBlindWaterFlag'+ "?t=" + new Date().getTime(), {},  function (data) {
                if (data && data.returnCode == 0) {
                    var beanInfo = data.bean;
                    var obj = {
                        watermarkInfo: beanInfo.watermarkInfo,
                        pageLink: beanInfo.pageLink,
                        imagePath: beanInfo.imagePath,
                        targetHeightData: beanInfo.targetHeightData + "",
                        targetWidthData: beanInfo.targetWidthData + "",
                    };
                    var keys = Object.keys(obj);
                    //var k = keys.sort((a, b) => a.localeCompare(b));
                    var k = keys.sort(function(a, b) {
                        return a.localeCompare(b);
                    });
                    var val = "";
                    /*k.forEach((item) => {
                        val += hex_md5(obj[item]) + "_";
                    });*/
                    k.forEach(function(item) {
                        val += hex_md5(obj[item]) + "_";
                    });
                    val += beanInfo.appSecret+"_"+ beanInfo.operateTime;
                    console.log("var:"+val);
                    var sign = hex_md5(val);
                    console.log("sign:"+sign);
                    obj.operateTime = beanInfo.operateTime;
                    obj.sign = sign;
                    Util.ajax.postJson(Constants.AJAXURL + '/knowledge/getUIUEWaterCig', obj, function (rtnData) {
                        if (rtnData && rtnData.returnCode == "0" && rtnData.object) {
                            var mark =  $('.knowd-detail')[0];
                            $(mark).css("background-image", "url('"+ rtnData.object + "')");
                            $(mark).addClass("waterMark");
                        }
                    });

                }
            });
        }
    }
});