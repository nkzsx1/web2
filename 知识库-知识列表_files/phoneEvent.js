/**
 * add by liuhenghui
 */
define([
    'Util','js/constants/constants','crossAPI','js/knowledgeAppNew/trdSysInterface','js/constants/kmUtil','js/errCode','Log'], function(Util,Constants,CrossAPI,TrdSysInterface,kmUtil,errCode,Log){

    var clientAndPrivIdInfo = {};//用户存放来电信息和获取到的CTI省份信息
    kmUtil.setLogConfig();
    var openPageInit;
    var clientInfo;
    var indexInfo;
    /**
     * @Description:注册获取来电监听
     * @Date: 15:03 2017/9/21
     * @Author: Liuhenghui
     */
    function EventListener() {
        var self = this;
        if (window.addEventListener) {
            window.addEventListener('message', function (e) {
                handleEvent.call(self, e);
            }, false);
        } else {
            window.attachEvent('onmessage', function (e) {
                handleEvent.call(self, e);
            });
        }
    }

    /**
     * @Description: PostMassage回调
     * @Date: 15:03 2017/9/21
     * @Author: Liuhenghui
     */
    function handleEvent(event) {
        if(typeof event.data == 'object'){
            return;
        }
        var client = JSON.parse(event.data);

        if(client.msisdn || client.msisdn==""){//为来电信息
            clientAndPrivIdInfo = client;
            getAndSetProvinceId(openPageInit);
        }else{//为省份信息 if(client.provinceId || client.provinceId=="")

            clientAndPrivIdInfo.provinceId = "";
            clientAndPrivIdInfo.xjhProvinceId = client.xjhProvinceId;
            clientAndPrivIdInfo.serviceTypeId = client.serviceTypeId;

            var newData = TrdSysInterface.converPostMessageData(clientAndPrivIdInfo);
            setClientInfo(newData,openPageInit);
        }
    }

    /**
     * 保存来电用户信息（通过系统编码有无可以判断是否是有效用户信息）
     * @param client 来电用户对象
     */
    var setClientInfo = function(client,callback){

        var superRrl = Constants.AJAXURL+"/kmClient/setClientInfo";
        Util.ajax.postJson(superRrl,client,function(json,status){
            if (callback) {
                callback();
            }
            if(status){

            }else{

            }
            json=json;//规避代码检查
        });
    };


    /**
     * 没有获取到来电归属编号后 获取坐席CTI省份信息并保存后台加载页面
     * @param client 来电的用户信息 可能有电话没有来电归属编码
     */
    var getAndSetProvinceId = function (callback) {
        var kmouter2 = localStorage.getItem("kmouter2");
        try{

            var provjson = {"name":"getProvinceId","type":"getData","param":{}};
            if(window == window.parent){
                kmouter2 = null;
            }
            postMessage(JSON.stringify(provjson), kmouter2);
        }catch(e){
            // Log.log(errCode.type15,"获取省份信息异常");

            setClientInfo(clientAndPrivIdInfo,callback);
        }
    };

    /**
     * @Description:获取来电信息 provinceId:登录CTI省份信息
     * @Date: 15:03 2017/9/21
     * @Author: Liuhenghui
     *
     */
    var getClientInfo = function(callback){
        var kmouter2 = localStorage.getItem("kmouter2");
        if((document.referrer+"").indexOf("Tyzhishi") > 0){ //首次进入
            localStorage.setItem("kmouter2",document.referrer);
            kmouter2 = document.referrer;
        }
        try{

            var clientjson = {"name":"clientInfo","type":"getData","param":{}};
            if(window == window.parent){
                kmouter2 = null;
            }
            postMessage(JSON.stringify(clientjson), kmouter2);

        }catch(e){
            // Log.log(errCode.type14,"获取来电信息异常");

            getAndSetProvinceId(callback);
        }
    };

    /**
     * 内嵌情况下工具条图标刷新
     * @param callbackfun
     */
    var tbarRefush = function (callbackfun) {
        var flag = true;
        CrossAPI.getContact("cross_data",Constants.PARAMJSONINDEX,function(info){
            CrossAPI.getContact("getClientBusiInfo", Constants.PARAMJSONBUSINFO,function(clientBusiInfo){
                //TODO 确认坐席登录状态
                clientInfo = clientBusiInfo;
                indexInfo = info;
                CrossAPI.getContact("getAgentState",Constants.PARAMJSONAGENT, function(agentState){
                    //坐席通话中
                    if(agentState && agentState.agentState == "7"){
                        CrossAPI.getContact("getCallingInfo",Constants.PARAMJSONCALL, function(callingInfo){
                            var serialNo = "";
                            var callingNum="";
                            var serviceTypeId = "";
                            var callerNo = "";
                            if(callingInfo){
                                serialNo = callingInfo.serialNo ? callingInfo.serialNo : "";
                                callingNum = callingInfo.callType == "0" ? callingInfo.callerNo : callingInfo.calledNo;
                                serviceTypeId = callingInfo.serviceTypeId;
                                callerNo = callingInfo.callerNo;
                            }
                            clientBusiInfo.bean.serialNo = serialNo;
                            clientBusiInfo.bean.callingNum = callingNum;
                            clientBusiInfo.bean.serviceTypeId = serviceTypeId;
                            clientBusiInfo.bean.callerNo = callerNo;

                            flag = false;
                            var data = TrdSysInterface.converCrossAPIData(clientBusiInfo,info);
                            setClientInfo(data,callbackfun);
                        });
                    }else{
                        CrossAPI.getContact("getSerialNo",function(serialNo){
                            clientBusiInfo.bean.serialNo = serialNo || "";
                            clientBusiInfo.bean.callerNo = "";
                            flag = false;
                            var data = TrdSysInterface.converCrossAPIData(clientBusiInfo,info);
                            setClientInfo(data,callbackfun);
                        });
                    }
                    callAnserListener();
                });
            });
        });
        setTimeout(function(){
            if(flag){
                callbackfun();
            }
        },2000);
    };
    var callAnserListener = function () {
        //来电接听事件监听
        CrossAPI.on('ngSendEventMsgToAll',function(data){
            CrossAPI.getContact("getCallingInfo",Constants.PARAMJSONCALL, function(callingInfo){
                var serialNo = "";
                var callingNum;
                var serviceTypeId = "";
                var callerNo = "";
                if(callingInfo){
                    serialNo = callingInfo.serialNo ? callingInfo.serialNo : "";
                    callingNum = callingInfo.callType == "0" ? callingInfo.callerNo : callingInfo.calledNo;
                    serviceTypeId = callingInfo.serviceTypeId;
                    callerNo = callingInfo.callerNo;
                }
                clientInfo.bean.serialNo = serialNo;
                clientInfo.bean.callingNum = callingNum;
                clientInfo.bean.serviceTypeId = serviceTypeId;
                clientInfo.bean.callerNo = callerNo;

                var data = TrdSysInterface.converCrossAPIData(clientInfo, indexInfo);
                setClientInfo(data, null);
            });
        });
    }
    /**
     * 设置完CTI 省份后 执行前台js
     * @param succCallbk
     */
    var setCTIProvinceId = function (succCallbk) {
        CrossAPI.getContact("cross_data",Constants.PARAMJSONINDEX,function(info){

            var serviceTypeId = info && info.userInfo && info.userInfo.serviceTypeId;

            var superRrl = Constants.AJAXURL+"/kmClient/setCTIProvinceId";
            Util.ajax.postJson(superRrl,{serviceTypeId:serviceTypeId},function(json,status){

                if(status && json.returnCode == 0){
                    succCallbk(json.bean);
                }else {

                    succCallbk(0);
                }
            });
        });
    };

    return {
        initEvent:function(callback){
            openPageInit = callback;
            EventListener();
            getClientInfo(callback);
        },
        //获取来电号码 归属地、CIT省份 后保存后台后 在执行回调函数
        toolbarRefresh:function (caback) {
            tbarRefush(caback);
        },
        setCTIProvinceId:setCTIProvinceId
    };
});