define([ 'Util',
    'text!modules/knowledgeAppNew/secKmToolBar.tpl',
    'js/constants/constants','js/constants/kmUtil',
    'js/knowledgeAppNew/phoneEvent','js/errCode','js/knowledgeAppNew/personCfg','Log','js/btnAuthority'
], function(Util,tpl,Constants,KmUtil,PhoneEvent,errCode,PersonCfg,Log,btnAuthority){

    var gconfig={};
    var selectedNode={};
    var userInfo = {};
    var staffName;
    KmUtil.setLogConfig();

    /**
     * 数组排序用
     * @param property
     * @returns {Function}
     */
    function compare(property){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    }

    var setDispatchInfo = function(userInfo){
        if(userInfo.effDispatchInfo && userInfo.effDispatchInfo.length > 1){
            KmUtil.setStorage("dispatchInfo","true");
        }else{
            window.localStorage.removeItem("dispatchInfo");
        }
    };

    /**
     * toolbar 加载工具条初始化函数
     */
    var initMethod =  function(callbk){
        var superRrl = Constants.AJAXURL+'/kmConfig/getUserInfo';
        var type = KmUtil.getOpenMode();
        if("2" == type){
            $("#tbmynhid").css('display','none');
        }
        Util.ajax.getJson(superRrl,{},function(json,status){
            if(status){
                userInfo = json.bean;
                staffName = userInfo.staffName;
                var staffCode = userInfo.staffCode;
                var prov = userInfo.ctiProvnce;
                var scope = userInfo.scope;
                var ngmttServicetype = userInfo.ngmttServicetype;
                var groupCodes = userInfo.groupCodes;
                KmUtil.setStorage("prov",prov);
                KmUtil.setStorage("channelCode",userInfo.channelCode);
                //融合坐席调度 设置调度信息
                setDispatchInfo(userInfo);

                var env = Constants.getEnvment();
                var params=JSON.parse(localStorage.getItem("ngkm_ly_call"));
                if (Constants.NGKM_ENVIROMENT_TEST == env) { // 测试环境
                    if (staffCode) {
                        //洛阳资源池账号登录夜间专席不自动切换地域
                       // staffCode = staffCode.substring(0, 2);
                       /* var isContainsNtbkDcForTest = false;
                        // if (groupCodes.indexOf(Constants.NGKM_NTBK_DIAMOND_CARD_GROUP_CODE_TEST) != -1) {
                        if ($.inArray(Constants.NGKM_NTBK_DIAMOND_CARD_GROUP_CODE_TEST,groupCodes) != -1) {
                            isContainsNtbkDcForTest = true;
                        }*/

                       //普卡用户
                        if (ngmttServicetype == "ntbk"&&((params&&params.nightCalled=='1')||params==null)) {
                            scope = "992";
                            switchSessionScope(scope, callbk);
                        }else if(ngmttServicetype == "zkytzq"){
                            scope = "996";
                            switchSessionScope(scope, callbk);
                        }else {
                            //获取质检传递渠道号、省份编码，切换session
                            zjSwitchScope(scope, callbk);
                        }
                    } else {
                        //获取质检传递渠道号、省份编码，切换session
                        zjSwitchScope(scope, callbk);
                    }
                } else if (Constants.NGKM_ENVIROMENT_PRODUCT == env) { // 生产环境
                    if (staffCode) {
                        //洛阳资源池账号登录夜间专席不自动切换地域
                        //staffCode = staffCode.substring(0, 2);
                        /*var isContainsNtbkDcForPrduct = false;
                        // if (groupCodes.indexOf(Constants.NGKM_NTBK_DIAMOND_CARD_GROUP_CODE_PRODUCT) != -1) {
                        if ($.inArray(Constants.NGKM_NTBK_DIAMOND_CARD_GROUP_CODE_PRODUCT,groupCodes) != -1) {
                            isContainsNtbkDcForPrduct = true;
                        }*/
                        //普卡
                        if (ngmttServicetype == "ntbk"&&((params&&params.nightCalled=='1')||params==null)) {
                            scope = "992";
                            switchSessionScope(scope, callbk);
                        }else if(ngmttServicetype == "zkytzq"){
                            scope = "996";
                            switchSessionScope(scope, callbk);
                        } else {
                            //获取质检传递渠道号、省份编码，切换session
                            zjSwitchScope(scope, callbk);
                        }
                    } else {
                        //获取质检传递渠道号、省份编码，切换session
                        zjSwitchScope(scope, callbk);
                    }
                } else { // 开发环境
                    if (staffCode) {
                        //洛阳资源池账号登录夜间专席不自动切换地域
                        //staffCode = staffCode.substring(0, 2);
                        //普卡
                        if (ngmttServicetype == "ntbk"&&((params&&params.nightCalled=='1')||params==null)) {
                            scope = "992";
                            switchSessionScope(scope, callbk);
                        }else if(ngmttServicetype == "zkytzq"){
                            scope = "996";
                            switchSessionScope(scope, callbk);
                        } else {
                            //获取质检传递渠道号、省份编码，切换session
                            zjSwitchScope(scope, callbk);
                        }
                    } else {
                        //获取质检传递渠道号、省份编码，切换session
                        zjSwitchScope(scope, callbk);
                    }
                }

            }else{
                callbk();

            }
        });
    };

    /**
     * 根据地域编号查询地域信息
     * @param scope
     */
    var getScopeInfoAndInitTree = function (scope,callbk) {
        var superRrl = Constants.AJAXURL+'/kmConfig/getCacheCityByRegnId';
        Util.ajax.postJson(superRrl,{regnId:scope},function(json,status){
            if(status){
                var regnInfo = json.bean;
                var hrcySeqno = regnInfo.hrcySeqno+"";
                var nodeInfo = {name:scope,tid:Constants.COUNTRY_CODE,sid:"#",cid:"#",hrcySeqno:"1"};
                if('1' == hrcySeqno){//国家等一级地区
                    nodeInfo = {name:regnInfo.regnNm,tid:regnInfo.regnId,sid:"#",cid:"#",hrcySeqno:hrcySeqno};
                }else if('2' == hrcySeqno){//省份信息
                    nodeInfo = {name:regnInfo.regnNm,tid:regnInfo.suprRegnId,sid:regnInfo.regnId,cid:"#",hrcySeqno:hrcySeqno};
                }else if('3' == hrcySeqno){//地市信息
                    nodeInfo = {name:regnInfo.regnNm,tid:Constants.COUNTRY_CODE,sid:regnInfo.suprRegnId,cid:regnInfo.regnId,hrcySeqno:hrcySeqno};
                }
                //根据后台的scope信息只做页面修改操作，不做scope后台保存操作
                setSelectedInfoForInit(nodeInfo.name,nodeInfo.tid,nodeInfo.sid,nodeInfo.cid,nodeInfo.hrcySeqno,true,callbk);
            }else{
                callbk();

            }
        });
    };

    /**
     * 设置工具条上的地域信息
     * @param name 地域名称
     * @param tid 国家编号
     * @param sid 省编号
     * @param cid 地市编号
     * @param hrcySeqno 地域等级
     * @param notSet 是否不保存 false: 手动地域树切换；true:首页初始化地域信息
     */
    var setSelectedInfoForInit = function(name,tid,sid,cid,hrcySeqno,notSet,callbk){
        var curScope = "";
        var selectedCity = $("#selectedCity");
        if('1' == hrcySeqno){
            curScope = tid;
        }else if('2' == hrcySeqno){
            curScope = sid;
        }else if('3' == hrcySeqno){
            curScope = cid;
        }
        selectedCity.attr("scope",curScope);
        selectedCity.attr("tid",tid);
        selectedCity.attr("sid",sid);
        selectedCity.attr("cid",cid);
        selectedCity.attr("leve",hrcySeqno);
        selectedCity.attr("cname",name);
        selectedCity.empty();
        selectedCity.append(name+'<i class="icon km-xiajiantou-copy"></i>');
        $("#city").hide();

        selectedNode = {scope:curScope,name:name,sid:sid,cid:cid,gid:Constants.COUNTRY_CODE,leve:hrcySeqno};
        if(!callbk){
            callbk = function () {

            }
        }
        //手动切换
        if(!notSet){
            Util.ajax.getJson(Constants.AJAXURL+'/kmConfig/setCurrScope',{scope:curScope},function(json,status){
                if(status){

                }else{
                    Log.log(errCode.type13,"修改地域编号出错。。。");

                }
                json=json;//规避检查
                callbk();
            });
        }else {
            callbk();
        }
    };

    /**
     * @Description:初始化市信息
     * @Date: 15:28 2017/9/22
     * @Author: Liuhenghui
     */
    var showCityContent = function(sidParam){
        var superRrl = Constants.AJAXURL+'/kmConfig/getCacheCitysBySuprRegnId';
        Util.ajax.postJson(superRrl,{suprRegnId:sidParam},function(json,status){
            if(status){
                var currCitys = json.beans||[];
                currCitys = currCitys.sort(compare('argeSeqno'));
                var $city = $("#city");
                $city.empty();
                //添加省km
                $city.append('<li>'+
                    '<a id="proNameId" class="locationa" sid="'+sidParam+'" cid="#" leve="2" href="javascript:void(0)"></a>'
                    + (userInfo.ctiProvnce == Constants.COUNTRY_CODE || window.localStorage.getItem("dispatchInfo") ? '<a href="javascript:void(0)" id="goBackProv">【返回省份】</a>':"")+//
                    '</li>');
                //添加市信息
                var cityHtml = '';
                for(var i = 0; i<currCitys.length;i++){
                    var item = currCitys[i];
                    cityHtml += '<dd><a class="locationa" href="javascript:void(0)" leve="3" sid="'+item.suprRegnId+'" cid="'+item.regnId+'">'+item.regnNm+'</a></dd>';
                };
                $city.append('<li><dl class="city-list">'+cityHtml+'</dl></li>');
                $("#province").hide();
                $city.show();
                $("#goBackProv").click(function(e){
                    e.stopPropagation();
                    showProvContent();
                });
                $(".locationa").unbind().click(function(e){//点击事件
                    e.stopPropagation();
                    var $target = $(e.target);
                    var sid = $target.attr("sid");
                    var cid = $target.attr("cid");
                    var leve = $target.attr("leve");
                    var name = $target.html();
                    var scope = Constants.COUNTRY_CODE;
                    if(scope=="屏蔽Sonar扫描!!!!!"){
                    }
                    setSelectedInfoForInit(name,Constants.COUNTRY_CODE,sid,cid,leve,false);
                    if(leve == "3"){
                        scope = cid;
                    }else if(leve == "2"){
                        scope = sid;
                    }else{
                        scope = Constants.COUNTRY_CODE;
                    }
                    selectedNode = {scope:scope,name:name,sid:sid,cid:cid,gid:Constants.COUNTRY_CODE,leve:leve};
                    //刷新业务树
                    $("#goBackHomeImg").click();
                    gconfig.clickLocation(selectedNode);
                });

                var superRrl2 = Constants.AJAXURL+'/kmConfig/getCacheCityByRegnId';
                Util.ajax.postJson(superRrl2,{regnId:sidParam},function(json,status){
                    if(status){
                        $("#proNameId").html(json.bean.regnNm);
                    }else{

                    }
                });
            }else{

            }
        });
    };

    /**
     * @Description:【初始化】省份数据转换
     * @Date: 15:10 2017/9/22
     * @Author: Liuhenghui
     */
    var transDataforHtml = function(plist){
        var hList = [];
        hList.push([{regnNm:'A-G'}]);
        hList.push([{regnNm:'H-J'}]);
        hList.push([{regnNm:'L-S'}]);
        hList.push([{regnNm:'T-Z'}]);

        for(var i = 0; i<plist.length ;i++){
            var item = plist[i];
            if(item.alphShtnCode >= 'A' &&  item.alphShtnCode <= 'G'){
                hList[0].push(item);
            }else if(item.alphShtnCode >= 'H' &&  item.alphShtnCode <= 'J'){
                hList[1].push(item);
            }else if(item.alphShtnCode >= 'L' &&  item.alphShtnCode <= 'S'){
                hList[2].push(item);
            }else if(item.alphShtnCode >= 'T' &&  item.alphShtnCode <= 'Z'){
                hList[3].push(item);
            }
        }
        return hList;
    };

    /**
     * 展示全国省份信息
     */
    var showProvContent = function () {
        if(window.localStorage.getItem("dispatchInfo")){
            $("#allCounty").hide();
        }

        var $province = $("#province");
        if($("#province li").length>1){
            $("#city").hide();
            $province.show();
            return;
        }
        var superRrl = Constants.AJAXURL+'/kmConfig/getDispatchProvList';
        Util.ajax.postJson(superRrl,{suprRegnId:Constants.COUNTRY_CODE},function(json,status){
            if(status){
                var plist = json.beans;
                var plist = transDataforHtml(plist);
                var html = '';
                for(var i = 0; i < plist.length ; i++){
                    html += '<li><dl><dt><span>'+plist[i][0].regnNm+'</span></dt>';
                    for(var j = 1 ; j < plist[i].length ; j++){
                        html += '<dd><a href="javascript:void(0)" id="'+plist[i][j].regnId+'">'+plist[i][j].regnNm+'</a></dd>';
                    }
                    html += '</li>';
                }
                $("#province>li").not(":eq(0)").remove();
                $province.append(html);
                //省份点击事件
                $("#province a").click(function(e){
                    e.stopPropagation();
                    var me = this;
                    var sid = $(me).attr("id");
                    if(sid == "allCounty"){
                        $province.hide();
                        //setSelectedInfoForInit($(me).html(),Constants.COUNTRY_CODE,"#","#","1",false);
                        return;
                    }
                    showCityContent(sid);
                });
                $("#city").hide();
                $province.show();
            }else{

            }
        });
    };

    /**
     * 展示地域浮动面板
     * @param scope
     * @param tid
     * @param sid
     * @param cid
     * @param leve
     */
    var showLocationFloat = function (scope,tid,sid,cid,leve) {
        if(leve == "2" || leve == "3"){//展示地市
            showCityContent(sid);
        }else if(leve == "1"){//展示省份
            showProvContent();
        }
    };

    /**
     * @Description:注册事件函数
     * @Date: 15:10 2017/9/22
     * @Author: Liuhenghui
     */
    var eventInit = function(){

        var $province = $("#province");
        //点击所选地域弹出选择浮动选择面板
        $("#selectedCity").mouseover(function(e){
            //判断当前是否已经展示
            if($province.is(':visible') || $("#city").is(':visible')){
                return ;
            }
            e.stopPropagation();
            var $target = $(e.target);
            if(e.target.nodeName == "I"){
                $target = $target.parent();
            }
            var tid = $target.attr("tid");
            var sid = $target.attr("sid");
            var cid = $target.attr("cid");
            var leve = $target.attr("leve");
            var scope = $target.attr("scope");
            showLocationFloat(scope,tid,sid,cid,leve);
        });
        //点击其他区域隐藏区域
        $(document).bind('click',function(e){

            if(e.target.id=='selectedCity'){
                return;
            }
            $province.hide();
            $("#city").hide();
            $(".km-scene-setting.show").removeClass('show');
            $(".km-scene-setting").hide();
        });

        // 用户刷新
        $(".page-refresh").click(function(e){
            var mode = KmUtil.getOpenMode();
            if(gconfig.refreshIcon){
                if(mode == "1"){
                    gconfig.refreshIcon.execOpenMode(e);
                }else{
                    PhoneEvent.toolbarRefresh(function () {
                        //重新加载刷新工具条数据
                        initMethod(function () {
                            if(gconfig.refreshIcon.execInnerMode){
                                gconfig.refreshIcon.execInnerMode(e);
                            }else{

                                gconfig.clickLocation(selectedNode);
                            }
                        });
                    });
                }
            }else{
                if(mode == "2"){
                    PhoneEvent.toolbarRefresh(function () {
                        //重新加载刷新工具条数据
                        initMethod(function () {

                            gconfig.clickLocation(selectedNode);
                        });
                    });
                }else{//外窗口打开
                    location.reload();
                }
            }
        });

        // 点击授权短信
        $("#tbmyyzid").click(function(e){
            if(gconfig.clickPreCut){
                gconfig.clickPreCut(e);
            }else{
                var mo = $("#tbmyyzid").attr("mo");
                KmUtil.openTab("授权短信",Constants.PREAJAXURL+Constants.ROOTURL+"/modules/personalCenterNew/authorizeMessage.html",{mo:mo});
            }
        });
        // 点击我的收藏
        $("#tbmyscid").click(function(e){
            if(gconfig.clickFav){
                gconfig.clickFav(e);
            }else{
                KmUtil.openTab("我的收藏",Constants.PREAJAXURL+Constants.ROOTURL+"/modules/personalCenterNew/favoritesKnowlg.html",{});
            }
        });
        // 点击我的反馈
        $("#tbmyfkid").click(function(e){
            if(gconfig.clickFb){
                gconfig.clickFb(e);
            }else{
                KmUtil.openTab("我的反馈",Constants.PREAJAXURL+Constants.ROOTURL+"/modules/personalCenterNew/klgfdbk-list.html",{});
            }
        });
        // 点击个性化设置
        $("#tbmycjid").on('click', function(e){
            e.stopPropagation();
            //渲染个性化设置
            PersonCfg.initFun();
            return;
        });
        // 测试知识库新首页
        $("#tbmynhid").on('click', function(e){
            var url = window.location.protocol+'//' + window.location.host+"/ngkm/src/modules/knowledgeAppNew/kmSecondHomeNew.html";
            var tagOpenWin = $("#tagOpenWin");
            tagOpenWin.attr("href",url);
            document.getElementById("tagOpenWin").click();
        });
    };

    //收藏
    var getKlgFdbkCount = function(){
        Util.ajax.getJson(Constants.AJAXURL+'/klgfdbk/getUnReadMyFdbkCount',function(data,status){
            var $tbmyfkid =  $("#tbmyfkid");
            if(status){
                if(data.bean > 0){
                    $tbmyfkid.addClass("new-msg");
                    $tbmyfkid.html("我的反馈("+data.bean+")");
                }else{
                    $tbmyfkid.removeClass("new-msg");
                    $tbmyfkid.html("我的反馈");
                }

            }else{

            }
        });
    };

    /**
     * 切换session中scope
     * @param curScope
     */
    var switchSessionScope = function (curScope,callback) {
        Util.ajax.getJson(Constants.AJAXURL+'/kmConfig/setCurrScope',{scope:curScope},function(json,status){
            if(status){

                $(".user-name").html('<i class="icon km-icon-test"></i>'+staffName);
                getScopeInfoAndInitTree(curScope,callback)
            }else{
                Log.log(errCode.type13,"修改地域编号出错。。。");

            }
        });
    }

    /**
     * 质检切换scope
     */
    var zjSwitchScope = function (prov,callback) {
        var scope = prov;
        var storage =  window.sessionStorage;
        var zjScope = storage.getItem("zjScope");
        //var zjChannel = storage.getItem("zjChannel");
        if(zjScope)  {
            switchSessionScope(zjScope,callback);
            scope = zjScope;
        } else {
            /*if(userInfo.ngmttServicetype && userInfo.ngmttServicetype == 'ngchnl') {
                zjScope = "992"; //夜间渠道 洛阳资源池
            }*/
            //switchSessionScope(prov);
            $(".user-name").html('<i class="icon km-icon-test"></i>'+staffName);
            getScopeInfoAndInitTree(scope,callback)
        }
        return scope;
    }


    /**
     * @Description:封装toolbar 组件
     * @Date:   15:11 2017/9/22
     * @Author: Liuhenghui
     */
    var toolBar = function(config){
        var pageInit = function () {};
        if(typeof config.afterCreate == 'function'){
            pageInit = config.afterCreate;
        }
        gconfig = config;
        config.ele.empty().append($(tpl));
        new btnAuthority($(".km-toolbar"));
        initMethod(pageInit);
        eventInit();
        getKlgFdbkCount();
        //获取当前接节点
        this.getCurrentNode=function(){
            return selectedNode;
        };
        //刷新重加载工具条
        this.reloadToolBar=function (callback) {
            initMethod(function () {
                callback();
            });
        };
    };
    return toolBar;
})

