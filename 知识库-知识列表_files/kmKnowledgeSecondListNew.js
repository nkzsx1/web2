require(['Util','pagination','js/knowledgeAppNew/secKmMainNav',
        'js/knowledgeAppNew/secKmToolBar',
        "text!modules/knowledgeAppNew/kmKnowledgeSecondListBar.tpl",
        "text!modules/knowledgeAppNew/kmKnowledgeSecondListBarTwo.tpl",
        'js/personalCenter/KMFooter', 'js/constants/constants',
        'js/personalCenterNew/favKlgAdd','js/personalCenterNew/favBusiAdd','js/personalCenter/MyAlert','js/constants/kmUtil',
        'js/knowledgeAppNew/kmCompareNew',
        'text!js/components/page/page.tpl','dialog', 'js/knowledgeAppNew/knwlgIsFavorite','crossAPI'],
    function (Util, Pagination, SecKmMainNav,
              SecKmToolbar,
              secondListBar, SecondListBarTwo, KMFooter, Constants,
              favKlgAdd, favBusiAdd, MyAlert, kmUtil, KmCompareNew, PageTpl, Dialog, KnwlgIsFavorite,CrossAPI) {
        var page;
        var pArr = [];//位置
        var pId;//父节点ID
        var _state="";//默认状态是全部
        var _scope ;//获取地区编码
        var _leve ;//获取地区类型
        var _knowledgeType;// 知识类型
        var sid;
        var id;
        var params;
        var selectedLeve;
        var zTreeObj;
        var isParamHtmlFlag = true;//源页面是否为含参(nodeId)页面标示
        var showAllEle =  $("#showAll");
        var showNormalEle =  $("#showNormal");
        var showExpireEle =  $("#showExpire");
        var showPrepareEle =  $("#showPrepare");
        var showCountryAllEle = $('#showCountryAll');
        var showCountryEle = $('#showCountry');
        var showProvinceEle = $('#showProvince');
        var showVillageEle = $('#showVillage');
        var showCurKlgEle = $("#now-atc");

        //<editor-fold desc="业务树页面前台 全部、主业务、faq 筛选项展示功能" NGKM2019-1765 lizh23 20201104>
        var allResultListEle = $('#allResultList');
        var mainResulListEle = $('#mainResulList');
        var faqResultListEle = $('#faqResultList');
        //</editor-fold>

        var jumpFlage;
        var user_per_page;
        var btListColumn;//列分布,'1'：单列，‘2’:双列
        var curCataLogList = false; //是否展示为当前目录下知识,是true 否flase,默认暂为false
        var pageEleVal;//列表每页值
        var curPage;//双列知识当前页码
        //var btnFlag = '0';//当前目录按钮状态 1展开 0闭合
        var zjProvance = kmUtil.getUrlParamter("zjScope");
        //var zjChannel = kmUtil.getUrlParamter("hannel");
        if(zjProvance) {
            window.sessionStorage.setItem("zjScope",zjProvance);
        }

        if (kmUtil.getUrlParamter("openMode")) {
            var openMode =  kmUtil.getUrlParamter("openMode") || "2";
            kmUtil.setOpenMode(openMode);
        }
        var openMethod = kmUtil.getUrlParamter("openMethod");





        // <editor-fold desc="前端埋点神策 SDK 初始化">
        var sensorsDataInit = function() {
            var env = Constants.getEnvment();
            var receiveUrl = 'http://sensors.ipaas.cmos/sa?project=production';
            if (Constants.NGKM_ENVIROMENT_DEV == env) {
                receiveUrl = Constants.getSensorsTestEnvReceiveUrl();
            } else if (Constants.NGKM_ENVIROMENT_TEST == env) {
                receiveUrl = Constants.getSensorsTestEnvReceiveUrl();
            } else {
                var httpType = window.location.protocol;
                if ('https:' == httpType) {
                    receiveUrl = 'https://sensors.ipaas.cmos:20443/sa?project=production';
                }else {
                    receiveUrl = 'http://sensors.ipaas.cmos/sa?project=production';
                }
            }
            (function (para) {
                var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script', x = null, y = null;
                if(typeof(w['sensorsDataAnalytic201505']) !== 'undefined') {
                    return false;
                }
                w['sensorsDataAnalytic201505'] = n;
                w[n] = w[n] || function (a) {
                    return function () {
                        (w[n]._q = w[n]._q || []).push([a, arguments]);
                    }
                };
                var ifs = ['track', 'quick', 'register', 'registerPage', 'registerOnce', 'clearAllRegister', 'trackSignup', 'trackAbtest', 'setProfile', 'setOnceProfile', 'appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify', 'login', 'logout', 'trackLink', 'clearAllRegister'];
                for (var i = 0; i < ifs.length; i++) {
                    w[n][ifs[i]] = w[n].call(null, ifs[i]);
                }
                if (!w[n]._t) {
                    x = d.createElement(s), y = d.getElementsByTagName(s)[0];
                    x.async = 1;
                    x.src = p;

                    w[n].para = para;
                    y.parentNode.insertBefore(x, y);
                }
            })({
                sdk_url: '../../js/sensorsdata.min.js',
                name: 'sensorsdata',
                // server_url: 'http://172.22.243.150:8107/index.html?project=production'//神策数据接收地址
                server_url: receiveUrl,//神策数据接收地址
                heatmap_url: "../../js/heatmap.min.js",
                heatmap:{
                    clickmap:'default',
                    scroll_notice_map:'default',
                    collect_elements:"all"
                }
            });

            if(sensorsdata){
                Util.ajax.getJson(Constants.AJAXURL + '/user/session' + "?t=" + new Date().getTime(), {}, function (data, state) {
                    if (state) {
                        if (data && data.bean) {
                            //神策用户关联的方法，其中 user_id 为用户的真实 id，字符串或者数值类型都可以。
                            sensorsdata.identify(data.bean.staffCode,true);
                            //<editor-fold desc="神策要求添加的公共属性">
                            var call_id = "";
                            var call_mobile = "";
                            var dispose_mobile = "";
                            var belong_city = "";
                            var is_call = false;
                            if (kmUtil.getUrlParamter("openMode")) {
                                var openMode =  kmUtil.getUrlParamter("openMode");
                                kmUtil.setOpenMode(openMode);
                            }
                            var openMode = window.localStorage.getItem("openMode");
                            if ("2" == openMode && CrossAPI.url != undefined) {
                                CrossAPI.getContact("getCallingInfo",Constants.PARAMJSONCALL, function (CallingInfo) {
                                    if(CallingInfo){

                                        call_id = CallingInfo.callId ? CallingInfo.callId : "";
                                        call_mobile = CallingInfo.callerNo ? CallingInfo.callerNo : "";
                                        dispose_mobile = CallingInfo.subsNumber ? CallingInfo.subsNumber : "";
                                        is_call = true;
                                        belong_city = CallingInfo.destProvId ? CallingInfo.destProvId : "";
                                    }else{
                                        is_call = false;
                                    }
                                });
                            }
                            //</editor-fold>
                            sensorsdata.registerPage({
                                staff_id: data.bean.staffCode,
                                staff_name: data.bean.staffName,
                                provnce: data.bean.provnce,
                                serviceTypeId: data.bean.ngmttServicetype,
                                first_model: "知识库",
                                login_system: "知识库系统", // 登录的业务系统
                                call_id: call_id,
                                call_mobile: call_mobile,
                                dispose_mobile: dispose_mobile,
                                belong_city: belong_city,
                                is_call: is_call
                            });
                            sensorsdata.setProfile({
                                staff_id: data.bean.staffCode,
                                staff_name: data.bean.staffName,
                                provnce: data.bean.provnce,
                                serviceTypeId:data.bean.ngmttServicetype,
                                login_system: "知识库系统" // 登录的业务系统
                            });
                            var openMode = kmUtil.getOpenMode();
                            sensorsdata.quick("autoTrack", {
                                openMode:openMode
                            });
                        }
                    }
                })
            }
        }
        //</editor-fold>




        /* if(zjChannel) {
             kmUtil.setStorage("zjChannel", zjChannel);
         }*/
        //获取列表默认页签状态
        Util.ajax.ajax({
            type:"GET",
            async:true,
            url:Constants.AJAXURL+'/KmBusTree/getState?v='+new Date().getTime(),
            success:function(datas){

                //<editor-fold desc="业务树页面前台 全部、主业务、faq 筛选项展示功能" NGKM2019-1765 lizh23 20201104>
                var searchKnwlgType = datas && datas.bean && datas.bean.searchKnwlgType;
                //</editor-fold>

                if ("1" == datas.bean.configVal) {
                    _state = "";
                    showAllEle.attr("class","active");
                    showNormalEle.attr("class","");
                    showExpireEle.attr("class","");
                    showPrepareEle.attr("class","");
                } else if ("2" == datas.bean.configVal) {
                    _state = "1";
                    showAllEle.attr("class","");
                    showNormalEle.attr("class", "green-active act-chked");
                    showExpireEle.attr("class","");
                    showPrepareEle.attr("class","");
                } else if("3" == datas.bean.configVal){
                    _state = "1,3";
                    showAllEle.attr("class","");
                    showNormalEle.attr("class", "green-active act-chked");
                    showExpireEle.attr("class","");
                    showPrepareEle.attr("class","green-active act-chked");
                }else if("4" == datas.bean.configVal){
                    _state = "2";
                    showAllEle.attr("class","");
                    showNormalEle.attr("class", "");
                    showExpireEle.attr("class","green-active act-chked");
                    showPrepareEle.attr("class","");
                }else if("5" == datas.bean.configVal){
                    _state = "3";
                    showAllEle.attr("class","");
                    showNormalEle.attr("class", "");
                    showExpireEle.attr("class","");
                    showPrepareEle.attr("class","green-active act-chked");
                }else if("6" == datas.bean.configVal){
                    _state = "1,2";
                    showAllEle.attr("class","");
                    showNormalEle.attr("class", "green-active act-chked");
                    showExpireEle.attr("class","green-active act-chked");
                    showPrepareEle.attr("class","");
                }else if("7" == datas.bean.configVal){
                    _state = "2,3";
                    showAllEle.attr("class","");
                    showNormalEle.attr("class", "");
                    showExpireEle.attr("class","green-active act-chked");
                    showPrepareEle.attr("class","green-active act-chked");
                }

                //<editor-fold desc="业务树页面前台 全部、主业务、faq 筛选项展示功能" NGKM2019-1765 lizh23 20201104>
                if(searchKnwlgType){
                    $("#faqList").find("li").removeClass("active");
                    $("#faqList").find("li").eq(searchKnwlgType - 1).addClass("active");
                    _knowledgeType = searchKnwlgType;
                }
                //</editor-fold>


                user_per_page = (datas && datas.bean && datas.bean.userPerPage)
                    ? datas.bean.userPerPage : 20;//设置用户个性化分页条数
                if (user_per_page == 10){
                    user_per_page = 20;
                }

                btListColumn = (datas && datas.bean && datas.bean.btListColumn)
                    ? datas.bean.btListColumn : '1';//设置用户业务树列表单双布局，默认单列

                if(btListColumn == '1'){
                    $('#searchResultList').show();
                    $('.article-dob-tab').hide();
                } else if (btListColumn == '2') {
                    $('#searchResultList').hide();
                    $('.article-dob-tab').show();
                    $('.km-result-sort').show();
                }

                var treeShow = (datas && datas.bean && datas.bean.treeShow)
                    ? datas.bean.treeShow : '1';
                if (treeShow == '0'){
                    curCataLogList = true;
                    $('#now-atc').prop("checked",true);
                    $('#now-atc').attr("disabled","disabled");
                } else{
                    curCataLogList = false;
                    $('#now-atc').prop("checked",false);

                }
                initialize();
                rulerEvent();
            }, error: function () {
                initialize();
                return;
            }
        });

        var addKnwlgFav = function(knwlgIds){
            var callBack = function(data){
                var object = data.object;
                if(object){
                    var favKnwlgIds = object.split(",");
                    for(var i = 0; i < favKnwlgIds.length; i ++){
                        var $dom = $("#k_" + favKnwlgIds[i]);
                        $dom.attr("scflag", "1");
                        $dom.html('已收藏');
                    }
                }
            };
            KnwlgIsFavorite.isFavorite(knwlgIds, callBack);
        };

        //防止32位谷歌下列表不停跳动
        if (window.navigator && window.navigator.userAgent
            && (window.navigator.userAgent.toLowerCase().indexOf("chrome") > -1)
            && window.navigator.platform.indexOf("32") > -1) {
            var _window = $(window);
            var _document = $(document);
            _window.scroll(function () {
                if (_document.scrollTop() >= _document.height() - _window.height()) {
                    _document.scrollTop(_document.height() - _window.height() - 1);
                }
            });
        }

        //排序事件注册（知识标题，时间，点击量）
        var rulerEvent = function () {
            var sortByTimeEle = $("#sortByTime");//右上侧时间
            var sortByVisitEle = $("#sortByVisit");//右上侧点击量
            var klgNmRulerEle = $('.klgNmRuler');//表头标题
            var klgTimeRulerEle = $('#klgTimeRuler');//表头时间
            var klgHitRulerEle = $('#klgHitRuler');//表头点击量
            klgNmRulerEle.on('click', function () {//表头知识标题排序
                var iEle = klgNmRulerEle.find('i');
                if (params.sortingRule == 'spell=F' || params.sortingRule == 'spell=T') {
                    if (iEle.hasClass('km-xjt')) {
                        iEle.removeClass('km-xjt');
                        iEle.addClass('km-shangjiantou');
                        params.sortingRule = 'spell=T';
                    } else if (iEle.hasClass('km-shangjiantou')) {
                        iEle.removeClass('km-shangjiantou');
                        iEle.addClass('km-xjt');
                        params.sortingRule = 'spell=F';
                    }
                } else {
                    klgNmRulerEle.css('color', '#56B600');
                    if (iEle.hasClass('km-xjt')) {
                        params.sortingRule = 'spell=F';
                    } else {
                        params.sortingRule = 'spell=T';
                    }
                }
                if (btListColumn == '1') {
                    klgTimeRulerEle.css('color', '');
                    klgHitRulerEle.css('color', '');
                } else {
                    sortByVisitEle.attr("class", "");
                    sortByTimeEle.attr("class", "");
                }
                page.reset();
            });

            if (btListColumn == '1') {
                klgTimeRulerEle.on('click', function () {//表头时间排序事件
                    klgNmRulerEle.css('color', '');
                    klgHitRulerEle.css('color', '');
                    var iEle = klgTimeRulerEle.find('i');
                    if (params.sortingRule == 'time=F' || params.sortingRule == 'time=T') {
                        if (iEle.hasClass('km-xjt')) {
                            iEle.removeClass('km-xjt');
                            iEle.addClass('km-shangjiantou');
                            params.sortingRule = 'time=T';
                        } else if (iEle.hasClass('km-shangjiantou')) {
                            iEle.removeClass('km-shangjiantou');
                            iEle.addClass('km-xjt');
                            params.sortingRule = 'time=F';
                        }
                    } else {
                        klgTimeRulerEle.css('color', '#56B600');
                        if (iEle.hasClass('km-xjt')) {
                            params.sortingRule = 'time=F';
                        } else {
                            params.sortingRule = 'time=T';
                        }
                    }
                    page.reset();
                });

                klgHitRulerEle.on('click', function () {//表头点击量加排序事件
                    klgNmRulerEle.css('color', '');
                    klgTimeRulerEle.css('color', '');
                    var iEle = klgHitRulerEle.find('i');
                    if (params.sortingRule == 'hits=F' || params.sortingRule == 'hits=T') {
                        if (iEle.hasClass('km-xjt')) {
                            iEle.removeClass('km-xjt');
                            iEle.addClass('km-shangjiantou');
                            params.sortingRule = 'hits=T';
                        } else if (iEle.hasClass('km-shangjiantou')) {
                            iEle.removeClass('km-shangjiantou');
                            iEle.addClass('km-xjt');
                            params.sortingRule = 'hits=F';
                        }
                    } else {
                        klgHitRulerEle.css('color', '#56B600');
                        if (iEle.hasClass('km-xjt')) {
                            params.sortingRule = 'hits=F';
                        } else {
                            params.sortingRule = 'hits=T';
                        }
                    }
                    page.reset();
                });
            } else {
                var sortByTimeTag = false;
                sortByTimeEle.click(function () {//右上侧时间排序
                    sortByVisitEle.attr("class", "");
                    klgNmRulerEle.css('color', '');
                    sortByVisitTag = false;
                    $(this).attr("class", "selected");
                    var thisObj = $("#sortByTime i");
                    var classname = thisObj.attr("class");
                    if (classname == "icon km-shangjiantou") {
                        if (!sortByTimeTag) {
                            params.sortingRule = "time=T";
                            thisObj.attr("class", "icon km-shangjiantou");
                            sortByTimeTag = true;
                        } else {
                            params.sortingRule = "time=F";
                            thisObj.attr("class", "icon km-xjt");
                        }
                    } else {
                        if (!sortByTimeTag) {
                            params.sortingRule = "time=F";
                            thisObj.attr("class", "icon km-xjt");
                            sortByTimeTag = true;
                        } else {
                            params.sortingRule = "time=T";
                            thisObj.attr("class", "icon km-shangjiantou");
                        }
                    }
                    initCurrentKnowledge();
                });

                sortByVisitEle.click(function () {//右上侧点击量排序
                    sortByTimeEle.attr("class", "");
                    klgNmRulerEle.css('color', '');
                    sortByTimeTag = false;
                    $(this).attr("class", "selected");
                    var thisObj = $("#sortByVisit i");
                    var classname = thisObj.attr("class");
                    if (classname == "icon km-shangjiantou") {
                        if (!sortByVisitTag) {
                            params.sortingRule = "hits=T";
                            thisObj.attr("class", "icon km-shangjiantou");
                            sortByVisitTag = true;
                        } else {
                            params.sortingRule = "hits=F";
                            thisObj.attr("class", "icon km-xjt");
                        }
                    } else {
                        if (!sortByVisitTag) {
                            params.sortingRule = "hits=F";
                            thisObj.attr("class", "icon km-xjt");
                            sortByVisitTag = true;
                        } else {
                            params.sortingRule = "hits=T";
                            thisObj.attr("class", "icon km-shangjiantou");
                        }
                    }
                    initCurrentKnowledge();
                });
            }

        }

        var getQueryString = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        };
        var convert = function (datas){
            if(pId == 0){
                datas.push({
                    'id':"0",
                    'name':"业务树图",
                    'pId':"",
                    'isParent':"true",
                    'children':[]
                });
            }else{
                datas.push(pArr[pArr.length-2]);
            }
            return datas;
        }// convert 结束
        var getTreeData = function () {
            Util.ajax.ajax({
                type: "post",
                async:true,//异步
                url:Constants.AJAXURL+'/KmBusTree/nodesByParentIdOfEs',
                data:{//传输参数
                    regnId:_scope,//地市
                    catlId:pId
                },
                dataType:"json",
                success:function(data){
                    if (data.beans == null || data.beans.length == 0) {
                        pId = 0;
                        initLogicTree([]);
                    }else{
                        var _treeData =convert(data.beans || []);
                        initLogicTree(_treeData);

                    }
                },
                error: function () {
                    return;
                }
            })
        }//getTreeData 结束
        /**
         * 根据树数据 以及 当前节点Id 初始化树
         * @param treeData
         */
        var initLogicTree = function(treeData){
            var setting = {
                view: {
                    dblClickExpand: false//屏蔽掉双击事件
                },
                hasLine:true,//是否有节点连线
                callback: {
                    onClick: zTreeOnClick,//点击事件
                    onExpand: zTreeOnExpand//获取子节点事件
                },
                data:{
                    keep:{
                        leaf:true
                    },
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId",
                        rootPId: 0
                    }
                }
            };
            zTreeObj = $.fn.zTree.init($("#left-bussiness-tree"), setting, treeData);//初始化树
            zTreeObj.expandAll(false);//是否展开节点
            var nodes = zTreeObj.getNodes();//树的所有节点
            var node = zTreeObj.getNodeByParam("id", id, null);//获取当前节点
            zTreeObj.selectNode(node);//选中的节点
            for (var i = 0; i < nodes.length; i++) { //设置节点展开
                zTreeObj.expandNode(nodes[i], true, false, true);
            }
        }; //initLogicTree 结束

        /**
         * 根据nodeId的获取所有上级节点的数据
         */
        var getParentData = function (eventFlag) {
            pArr=[];
            Util.ajax.ajax({
                type: "post",
                //async:false,//同步，其他地方用到返回的pId
                async:true,//改为true异步
                //url:Constants.AJAXURL+'/KmBusTree/getSecondTreePath',
                url:Constants.AJAXURL+'/KmBusTree/secondTreePathOfEs',
                data:{
                    regnId:_scope,
                    catlId:id
                },
                dataType:"json",
                success:function(data){
                    data.object = JSON.parse(data.object);
                    if( data.object==null||data.object.length == 0){
                        pId = 0;//如果没有父节点，则说明该节点为根节点，则直接加载所有一级节点
                    }else{
                        pArr = data.object;
                        pId=pArr[data.object.length-1].pId;
                    }
                    initLocation(pArr);//初始化位置
                    if(eventFlag == 'zTreeOnClick' || eventFlag == 'curLocationEvent'){
                        return;
                    }//如果为左侧树节点点击事件或右侧当前位置点击事件，则不触发树重新加载
                    getTreeData();
                }, error: function () {
                    return;
                }
            })
        };//getParentData 结束

        //展示对应的跳转场景链接--因为异步调用所以将业务树当前位置点击事件放在ajax请求后
        var showChange = function () {
            Util.ajax.ajax({
                type: "POST",
                url:Constants.AJAXURL+"/KmTmplt/getMesByCatlId?catlId="+params.catlId+"&regnId="+params.regnId,
                async:true,
                success:function(data){
                    var jumpDivEle = $('#jumpDiv');
                    var jumpEle = $('#jump');
                    if (data.object=="1"){
                        jumpDivEle.show();
                        jumpEle.html('切换至优惠活动');
                        jumpFlage = "";
                    }else if (data.object=="2"){
                        jumpDivEle.show();
                        jumpEle.html('切换至套餐');
                        jumpFlage = "0";
                    }else if (data.object=="3"){
                        jumpDivEle.show();
                        jumpEle.html('切换至套餐');
                        jumpFlage = "1";
                    }else if (data.object=="4"){
                        jumpDivEle.show();
                        jumpEle.html('切换至套餐');
                        jumpFlage = "2";
                    }else if (data.object=="34"){//有相同目录让用户选择跳转到业务套餐还是宽带业务
                        jumpDivEle.show();
                        jumpEle.html('切换至套餐');
                        jumpFlage = "12";
                    }else{
                        //jumpDivEle.remove();
                        jumpEle.remove();
                    }
                    jumpScenario();
                },
                error: function () {return "";}
            });
        };

        //清空右侧知识搜索框
        var clearRightSearch = function () {
            $('#topSearchKey').val("");
            $('#searchDiv').attr("class", "search-con closed");
            $('#goSearchInput').css('color', ''); //颜色状态恢复
        }


        //当前位置下节点事件
        // var initLocationUnder = function (nodeId, postionArr) {
        //     Util.ajax.ajax({
        //         type: "post",
        //         async: true,
        //         url: Constants.AJAXURL + '/KmBusTree/nodesByParentIdOfEs',
        //         data: {catlId: nodeId, regnId: _scope},
        //         dataType: "json",
        //         success: function (data) {
        //             if (data.returnCode == 0) {
        //                 if (data.beans != null && data.beans.length > 0) {//如果有子节点，则切换dom
        //                     var childFileEle = $('#child_file');
        //                     childFileEle.empty();
        //                     var childFileHtml = '';
        //                     $.each(data.beans, function (idx, obj) {
        //                         childFileHtml += '<li><a class="has-folder" href="javascript:void(0)" id="' + obj.id + '">' + obj.name + '</a></li>';
        //                     });
        //                     childFileEle.html(childFileHtml);
        //                     //注册点击事件
        //                     initLocationUnderEvent(childFileEle, postionArr);
        //                 }
        //             }
        //         }, error: function () {
        //             return false;
        //         }
        //     });
        // }


        //当前位置下侧点击事件注册
        // var initLocationUnderEvent = function (childFileEle, postionArr) {
        //     childFileEle.find('li').unbind().click(function () {
        //         clearRightSearch();//清空右侧知识搜索框
        //         childFileEle.find('li').prop('class', '');//清空
        //         $(this).prop('class', 'floder-active');//选中节点变样式便于区分
        //         var selectedId = $(this).find('a').prop('id');
        //         // initLocationUnder(selectedId, postionArr);
        //         params.catlId = selectedId;
        //         initCurrentKnowledge();//1.刷新知识列表
        //         //2.左侧树当前选中节点设置
        //         //如果节点没有子节点，则需触发请求查询子节点并展开选中
        //         var nodeCur = zTreeObj.getNodeByParam("id", postionArr.length > 0 ? postionArr[postionArr.length - 1].id : '0', null);
        //         if (nodeCur.children && nodeCur.children.length > 0) {
        //             var node = zTreeObj.getNodeByParam("id", selectedId, null);//获取当前节点
        //             zTreeObj.selectNode(node, false, true);//选中的节点
        //             leftNodeExpand(zTreeObj, node);//左侧对应节点展开
        //             var lev = node.level;
        //             $('.inner-tab-container').scrollLeft(lev > 3 ? 30 * (lev - 3) : 0);
        //         } else {
        //             Util.ajax.ajax({
        //                 type: "post",
        //                 async: true,
        //                 url: Constants.AJAXURL + '/KmBusTree/nodesByParentIdOfEs',
        //                 data: {catlId: nodeCur.id, regnId: _scope},
        //                 dataType: "json",
        //                 success: function (data) {
        //                     if (data.returnCode == 0) {
        //                         if (nodeCur.children != null && nodeCur.children.length > 0) {
        //                             return;//ajax异步，防止双击加载重复数据
        //                         }
        //                         zTreeObj.addNodes(nodeCur, data.beans);
        //                         var node = zTreeObj.getNodeByParam("id", selectedId, null);//获取当前节点
        //                         zTreeObj.selectNode(node, false, true);//选中的节点
        //                         leftNodeExpand(zTreeObj, node);//左侧对应节点展开
        //                         var lev = node.level;
        //                         $('.inner-tab-container').scrollLeft(lev > 3 ? 30 * (lev - 3) : 0);
        //                     }
        //                 }, error: function () {
        //                     return false;
        //                 }
        //             });
        //         }
        //     });
        // }

        //收藏目录按钮
        var busiFavBtnEvent = function (postionArr) {
            //收藏按钮的悬浮事件
            $("#busiFavBtn").mouseover(function () {
                var me = $(this);
                if ($("#busiFavBtn").hasClass("km-shoucang")) {
                    me.html('添加收藏');
                } else {
                    me.html('取消收藏');
                }
            });
            $("#busiFavBtn").mouseout(function () {
                $(this).empty();
            });

            //目录节点收藏按钮点击事件
            $("#busiFavBtn").click(function () {
                var me = $(this);
                var favrtBizId = postionArr[postionArr.length - 1].catlId;
                var fixId = favrtBizId;
                if ($("#busiFavBtn").hasClass("km-shoucang")) {
                    //未收藏状态
                    var klgTitle = $.trim($(".form-content").text());
                    new favBusiAdd(klgTitle, fixId, me);
                    $(this).on("favrtResult", function (event, result) {
                        if (result == 0 || result == "123119") {
                            me.attr("scFlag", "1");
                            me.removeClass("km-shoucang");
                            me.addClass("km-duduyinleappicon2201");
                        }
                    });
                } else {
                    //已收藏状态，需要取消收藏
                    //调用取消收藏接口
                    Util.ajax.postJson(Constants.AJAXURL + '/klgFavrtInfo/deleteBusiInfo', {favrtBizId: fixId}, function (data, state) {
                        if (state) {
                            new MyAlert({'type': 'success', 'text': data.returnMessage});
                            me.attr("scFlag", "0");
                            me.removeClass("km-duduyinleappicon2201");
                            me.addClass("km-shoucang");
                        } else {
                            if (data.returnCode == "-1") {
                                new MyAlert({
                                    type: 'error',
                                    text: data.returnMessage,
                                    falseShow: false,
                                    trueName: '确定'
                                });
                                me.attr("scFlag", "0");
                                me.removeClass("km-duduyinleappicon2201");
                                me.addClass("km-shoucang");
                            } else {
                                new MyAlert({'type': 'success', 'text': data.returnMessage});
                            }
                        }
                    })
                }
            });
        }

        //文档目录控制按钮事件
        // var btnControl = function () {
        //     $('#btnControl').on('click', function () {
        //         var _this = $(this);
        //         var childFileEle = $('#child_file');
        //         if (_this.hasClass('close')) {
        //             btnFlag = '0';
        //             _this.removeClass('close').addClass('open');
        //             childFileEle.addClass('no-ellipsis');
        //             _this.attr('title', '展开');
        //         } else {
        //             btnFlag = '1';
        //             _this.removeClass('open').addClass('close');
        //             childFileEle.removeClass('no-ellipsis');
        //             _this.attr('title', '闭合');
        //         }
        //     });
        // }

        //处理当前位置目录较长,鼠标移到收藏按钮时不停晃动bug
        var favCatlogHandle = function () {
            var $formcontent = $('.form-content');
            var pathText = $formcontent.text();
            var len = 0;
            var code = 0;
            for (var i = 0; i < pathText.length; i++) {
                code = pathText.charCodeAt(i);
                if (code >= 0 && code <= 127) {
                    len += 1;

                } else {
                    len += 2;
                }
            }
            if (len > 80) {
                $formcontent.css('width', '100%');
            }
        }

        /**
         * //初始化当前位置
         * @param postionArr
         */
        var initLocation = function(postionArr){
            var directorySearch = $('.directory-search');
            if(postionArr.length == 0){
                var directoryHtml = '<label for="" title="当前位置">当前位置：</label><div class="form-content">业务树图<span class="mr-20">' +
                    '<a href="javascript:void(0);" ></a></span></div><div class="directory-search-btn" id="jumpDiv"></div>';
                // if (btnFlag == '0') {
                //     directoryHtml += '<a id="btnControl" href="javascript:void(0);" class="more-art-list open" title="展开"></a></div>';
                // } else {
                //     directoryHtml += '<a id="btnControl" href="javascript:void(0);" class="more-art-list close" title="关闭"></a></div>';
                // }
                directorySearch.html(directoryHtml);
                // btnControl();//目录文件夹展开按钮注册事件
            }else{
                var html = '<label for="" title="当前位置">当前位置： </label><div class="form-content">';
                for(var i=0; i<postionArr.length;i++){
                    var item =postionArr[i];
                    html=html+'<span class="mr-20"><a href="javascript:void(0);" id="l_'+item.id+'" >'+item.name+'</a></span><u>'+
                        ((i == (postionArr.length-1))? '':'/')+'</u>';
                }
                var favrtBizId = postionArr[postionArr.length-1].catlId;
                Util.ajax.postJson(Constants.AJAXURL+'/klgFavrtInfo/getBusiInfo?favrtBizId='+favrtBizId,{}, function(json, status){
                    if (status){
                        var item;
                        var ele;
                        if(json.object==null || json.object == undefined){
                            html = html+'</div><div class="after-add-link"><i class="icon km-shoucang" id="busiFavBtn" scFlag="0" style="cursor:pointer;"></i></div>';
                            html += '<div class="directory-search-btn" id="jumpDiv"><a id="jump" class="new-shift km-btn-xs km-blue-white" href="javascript:void(0);"></a></div>';
                        }else{
                            html = html+'</div><div class="after-add-link"><i class="icon km-duduyinleappicon2201" id="busiFavBtn" scFlag="1" style="cursor:pointer;"></i></div>';
                            html += '<div class="directory-search-btn" id="jumpDiv"><a id="jump" class="new-shift km-btn-xs km-blue-white" href="javascript:void(0);"></a></div>';
                        }
                        // if (btnFlag == '0') {
                        //     html += '<a id="btnControl" href="javascript:void(0);" class="more-art-list open" title="展开"></a></div>';
                        // } else {
                        //     html += '<a id="btnControl" href="javascript:void(0);" class="more-art-list close" title="关闭"></a></div>';
                        // }
                        directorySearch.html(html);

                        favCatlogHandle();//处理当前位置目录较长,鼠标移到收藏按钮时不停晃动bug
                        // btnControl();//目录文件夹展开按钮注册事件

                        busiFavBtnEvent(postionArr);
                        showChange();
                        for (var i = 0; i < postionArr.length; i++) {
                            item = postionArr[i];
                            ele = $("#l_" + item.id);
                            ele.attr("nodeId", item.id);
                            ele.attr("pId", item.pId);
                            ele.click(function () {//绑定点击事件
                                clearRightSearch();//清空右侧知识搜索框
                                // $('#child_file').find('li').prop('class', '');//清空子目录选中样式
                                var me = this;
                                pId = $(me).attr("pid");
                                id = $(me).attr("nodeId");
                                params.catlId = id;
                                refreshData();
                                getParentData("curLocationEvent");
                                var node = zTreeObj.getNodeByParam("id", id, null);//获取当前节点
                                zTreeObj.selectNode(node, false, true);//选中的节点
                                var lev = node.level;
                                $('.inner-tab-container').scrollLeft(lev > 3 ? 30 * (lev - 3) : 0);
                            });
                        }
                    }
                });
            }

            //新增当前位置节点子节点目录url:Constants.AJAXURL+'/KmBusTree/getNodesByParentId',
            // Util.ajax.postJson(Constants.AJAXURL+'/KmBusTree/nodesByParentIdOfEs',
            //     {'catlId':postionArr.length>0?postionArr[postionArr.length -1].id:'0','regnId':_scope},
            //     function(result,state){
            //         if(state){
            //             var childFileEle = $('#child_file');
            //             childFileEle.empty();
            //             var childFileHtml = '';
            //             if(result.beans.length>0){
            //                 $.each(result.beans,function(idx,obj){
            //                     childFileHtml += '<li><a class="has-folder" href="javascript:void(0)" id="' + obj.id + '">' + obj.name + '</a></li>';
            //                 });
            //             }
            //             childFileEle.html(childFileHtml);
            //             //注册点击事件
            //             initLocationUnderEvent(childFileEle, postionArr);
            //         }else{
            //
            //         }
            //     })
        };

        /**
         * 右侧当前位置下点击目录触发左侧对应目录自动展开方法;
         * @param zTreeObj
         * @param node
         */
        /*var leftNodeExpand = function (zTreeObj, node) {
            if (node.isParent && !(node.open)) {//如果有子节点且是闭合状态,则展开,否则无需处理
                if (node.children && node.children.length > 0) {//如果节点下已有子节点，说明不是初次加载，直接展开即可
                    zTreeObj.expandNode(node, true, false, false);//展开
                    return;
                }
                Util.ajax.ajax({
                    type: "post",
                    async: true,
                    url: Constants.AJAXURL + '/KmBusTree/nodesByParentIdOfEs',
                    data: {catlId: node.id, regnId: _scope},
                    dataType: "json",
                    success: function (data) {
                        if (data.returnCode == 0) {
                            if (node.children == undefined || node.children == '' || node.children == 'undefined') {
                                zTreeObj.addNodes(node, data.beans, false);//防止双击加载重复子节点
                            }
                            zTreeObj.expandNode(node, true, false, false);//展开
                        }

                    }, error: function () {
                        return false;
                    }
                });
            }
        };*/

        /**
         *  点击左侧树的点击事件函数;
         * @param event
         * @param treeId
         * @param treeNode
         */
        function zTreeOnClick(event, treeId, treeNode) {
            var lev = treeNode.level;
            $('.inner-tab-container').scrollLeft(lev > 3 ? 30 * (lev - 3) : 0);
            clearRightSearch();//清空右侧知识搜索框
            // $('#child_file').find('li').prop('class', '');//清空子目录选中样式
            id = treeNode.id;
            params.catlId=id;
            var eventFlag = "zTreeOnClick";//设置事件表识，如果为左侧树点击事件，则不触发树刷新
            getParentData(eventFlag);
            initCurrentKnowledge();
            if (treeNode.open) {
                zTreeObj.expandNode(treeNode, false, false, true);
            } else {
                zTreeOnExpand(event, treeId, treeNode)
                zTreeObj.expandNode(treeNode, true, false, true);
            }
        }//zTreeOnClick 结束

        /**
         * //将点击的节点查询到的子节点数据添加至该节点下
         * @param event
         * @param treeId
         * @param treeNode
         */
        function  zTreeOnExpand(event, treeId, treeNode){
            var lev = treeNode.level;
            var innerContainerEle = $('.inner-tab-container');
            if(treeNode.children != null && treeNode.children.length > 0){
                innerContainerEle.scrollLeft(lev > 2 ? 30 * (lev - 2) : 0);
                return;
            }
            Util.ajax.ajax({
                type: "post",
                async:true,
                url:Constants.AJAXURL+'/KmBusTree/nodesByParentIdOfEs',
                data:{
                    catlId:treeNode.id,
                    regnId:_scope
                },
                dataType:"json",
                success:function(data){
                    if (data.returnCode == 0){
                        if(treeNode.children != null && treeNode.children.length > 0){
                            innerContainerEle.scrollLeft(lev > 2 ? 30 * (lev - 2) : 0);
                            return;//ajax异步，防止双击加载重复数据
                        }
                        zTreeObj.addNodes(treeNode,data.beans);
                        innerContainerEle.scrollLeft(lev > 2 ? 30 * (lev - 2) : 0);
                    }
                }, error: function () {
                    return false
                }
            });
        }
        /**
         * 业务树跳转场景
         * */
        var jumpScenario = function () {
            var name;
            var url;
            if (jumpFlage==""){
                name = "优惠活动";
                url = Constants.PREAJAXURL+Constants.ROOTURL+"/modules/knowledgeAppNew/KmActivitis.html"
            }else if (jumpFlage=="0"||jumpFlage=="1"||jumpFlage=="2"||jumpFlage=="12") {
                name = "套餐";
                url = Constants.PREAJAXURL + Constants.ROOTURL + "/modules/knowledgeAppNew/KmScenario.html"
            }
            $('#jump').on('click',function () {
                var catlId = params.catlId;
                if (jumpFlage=="12"){
                    var config = {
                        title: '选择要跳转的场景模板',
                        content: '<div id="jumptaocan"><input type="radio" id="jumpyewu" name="套餐" value="1"/><label for="jumpyewu">业务套餐</label><input type="radio" id="jumpkuandai" name="套餐" value="2"><label for="jumpkuandai">宽带业务</label></div>',
                        cancel: function() {
                            var input = $("#jumptaocan").find("input[type='radio']:radio:checked");
                            if (input.length>0){
                                kmUtil.openTab(name,url,{catlId:catlId,flage:input.eq(0).attr("value")});
                            }
                        },
                        cancelValue: '确定',
                        width: 300,
                        height: 100
                    }
                    new Dialog(config);
                }else{
                    kmUtil.openTab(name,url,{catlId:catlId,flage:jumpFlage});
                }
            });
        };

        //双列列表分页页码dom处理
        var pageDom = function(count,num){
            var totalPage = Math.ceil(count/num);
            var template = Util.hdb.compile(PageTpl);
            var getPageArr = function () {
                var arr = [];
                page.pageShowArr = [];
                var count = 2;
                if (curPage <= 2 || totalPage - curPage < 2) {
                    count = 3;
                }
                if (curPage <= 1 || totalPage - curPage < 1) {
                    count = 4;
                }
                for (var i = 1; i <= totalPage; i++) {
                    var dif = Math.abs(curPage - i);
                    if (dif <= count) {
                        arr.push({ num: i, isCurrent: (i == curPage) });
                        page.pageShowArr.push(i);
                    }
                }
                return arr;
            };

            var pageEle = $('.page1');
            pageEle.html(template({
                prevName: '<span class="icon arrow-left"></span>',
                nextName: '<span class="icon arrow-right"></span>',
                current: curPage,
                totalPage: totalPage,
                perpage:num/2,
                totalNum: count,
                page: getPageArr.call(this)
            }));
            if (curPage == 1) {
                pageEle.find('.prev').addClass('hide');
            }
            if (curPage == totalPage) {
                pageEle.find('.next').addClass('hide');
            }

        }

        //双列列表渲染方法
        var klgListColumnTwo = function(data){
            var dataArr = data && data.articleList;
            if(pageEleVal == '' || pageEleVal == undefined){
                var num = parseInt(user_per_page * 2);
            }else{
                var num = parseInt(pageEleVal);
            }
            var searchResultListLeftEle = $("#searchResultListLeft");
            var searchResultListRightEle = $("#searchResultListRight");
            searchResultListLeftEle.children().not(":first").remove();
            searchResultListRightEle.children().not(":first").remove();
            if(dataArr.length > 0 && dataArr.length <= (num/2)){
                var leftHtml = Util.hdb.compile(SecondListBarTwo)({'articleList': dataArr});//解析tpl
                searchResultListLeftEle.find('thead').show();
                searchResultListRightEle.find('thead').hide();
                searchResultListLeftEle.append('<tbody>' + leftHtml + '</tbody>');
                floatTipsDom('left', dataArr);
                $("#floatRight").empty();//简介悬浮清空
            }else if(dataArr.length > 0 && dataArr.length > (num/2)){
                var leftHtml = Util.hdb.compile(SecondListBarTwo)({'articleList': dataArr.slice(0, (num / 2))});//解析左侧tpl
                var rightHtml = Util.hdb.compile(SecondListBarTwo)({'articleList': dataArr.slice((num / 2))});//解析右侧tpl
                searchResultListLeftEle.find('thead').show();
                searchResultListRightEle.find('thead').show();
                searchResultListLeftEle.append('<tbody>' + leftHtml + '</tbody>');
                searchResultListRightEle.append('<tbody>' + rightHtml + '</tbody>');
                floatTipsDom('left', dataArr.slice(0, (num / 2)));
                floatTipsDom('right', dataArr.slice((num / 2)));
            }
            var count = data.count || 0;
            calculateTotalPage(count,num);

            //知识简介悬浮事件
            var elp = $('.primary-key');
            elp.mouseenter(function (e) {
                var _this = $(this);
                var id = _this.parent().parent().attr('id');
                var floatTipsEle = $('#fltps' + id);
                floatTipsEle.parent().show();
                //判断简介内容是否超出，超出则加宽悬浮层
                var detail = floatTipsEle.find('div').text();
                if (detail && detail.length > 500) {
                    floatTipsEle.width(_this.width() + 140);
                } else {
                    floatTipsEle.width(_this.width());
                }

                //算高度,确定悬浮位置
                var dobListResult = $('#searchResultListLeft');
                var divScrollTop = dobListResult.parent().scrollTop();
                var index = $(elp).index(_this);
                if (index >= (num / 2)) {
                    var topH = (-$('#searchResultList').parent().height() + 64 + (36 * (index - num / 2)) - divScrollTop) + 'px';
                    floatTipsEle.css("left", '480px');
                } else {
                    var topH = (-$('#searchResultList').parent().height() + 64 + (36 * index) - divScrollTop) + 'px';
                }
                floatTipsEle.css("top", topH);
                e.stopPropagation();
            });
            elp.mouseleave(function (e) {
                var id = $(this).parent().parent().attr('id');
                var floatTipsEle = $('#fltps' + id);
                floatTipsEle.parent().hide();
                e.stopPropagation();
            });
        };

        //列表加载悬浮dom
        var floatTipsDom = function (flg, list) {
            var tipsHtml = '';
            $.each(list, function (idx, item) {
                tipsHtml = tipsHtml + '<div style="position:absolute;display:none" class="customClass">';
                tipsHtml = tipsHtml + '<div  id="fltps' + item.knwlgId + '" class="float-tips" style="position:relative">'
                    + '<h3>'
                    + '<span>名称：</span>'
                    + item.knwlgNm
                    + '</h3>';
                if (item.knlwgAls) {
                    tipsHtml = tipsHtml + '<h3><span>别名：</span>' + item.knlwgAls + '</h3>';
                }
                if (flg != 'one') {
                    tipsHtml = tipsHtml + '<h3><span>地区：</span>' + item.autorLocationName + '</h3>';
                }
                if (item.knlgDetail) {
                    tipsHtml = tipsHtml + '<div>' + item.knlgDetail + '</div>';
                }
                tipsHtml = tipsHtml + '</div></div>';
            });
            if (flg == 'one') {//单列
                $("#floatOne").html(tipsHtml);
            } else if (flg == 'left') {//双列左侧
                $("#floatLeft").html(tipsHtml);
            } else if (flg == 'right') {//双列右侧
                $("#floatRight").html(tipsHtml);
            }
        }

        //初始化当前知识信息
        var initCurrentKnowledge = function(){
            var value = $("#topSearchKey").val();
            if(value && value.length > Constants.KEYWORD_MAX_SIZE){
                value = value.substr(0,Constants.KEYWORD_MAX_SIZE);
            }
            params.searchKey = value;
            var searchResultListEle = $("#searchResultList");
            var searchResultListLeftEle = $("#searchResultListLeft");
            var searchResultListRightEle = $("#searchResultListRight");
            $('.page1').empty();
            var config = {
                el: $('.page1'),
                items_per_page: user_per_page,
                isShowPerPage:true,
                current_page:1,
                limited_width: true,
                callback:function(opt,done){
                    if(btListColumn == '2'){
                        pageEleVal = (opt.perpage)*2;
                        opt.perpage = pageEleVal;
                        opt.start = (opt.start) * 2;
                        curPage = opt.page;
                    }
                    opt.regnId = params.regnId;//区域编码
                    opt.scope= params.scope;//1-全部 2-全国 3-省份 4-地市
                    opt.leve = params.leve;//传入区域编码是地市还是省
                    opt.sid = params.sid;
                    opt.catlId = params.catlId;
                    opt.searchKey = params.searchKey;
                    opt.state =params.state;
                    opt.sortingRule=params.sortingRule;
                    opt.subAuthId=params.subAuthId;
                    opt.curCataLogList = curCataLogList;//是否展示当前节点下知识

                    opt.knowledgeType = params.knowledgeType;

                    //opt.klgSortFlag = klgSortFlag;//当前页知识标题排序标识
                    //滚动条回到顶部
                    $(".km-table-list").scrollTop(0);
                    var url = Constants.AJAXURL+'/searchKnowledgeNew/getSecondSearchKnlwByCondition';
                    Util.ajax.getJson(url,opt,function(data,state){
                        if (state) {
                            if (params.scope != opt.scope || params.state != opt.state || params.catlId != opt.catlId) {
                                return;
                            }
                            var count = data.object.count || 0;
                            searchResultListEle.children().not(":first").remove();
                            var articleArr = data && data.object && data.object.articleList;
                            var knwlgIds = [];
                            for (var i = 0; i < articleArr.length; i++) {
                                if (articleArr[i].knlgDetail != null && articleArr[i].knlgDetail != undefined) {
                                    articleArr[i].knlgDetail = articleArr[i].knlgDetail.replace(/<\/?[^>]*>/g, '');
                                }
                                knwlgIds.push(articleArr[i].knwlgId);
                            }
                            //新交互
                            if (btListColumn == '1') {//单列渲染
                                searchResultListLeftEle.hide();
                                searchResultListRightEle.hide();
                                searchResultListEle.show();
                                var tableListEle = $('.km-table-list');
                                if (articleArr.length == 0) {
                                    searchResultListEle.find('thead').hide();//隐藏表头
                                    //searchResultListEle.append(Constants.EMPTY_HTML);
                                    tableListEle.find('.km-norecord').remove();
                                    tableListEle.append(Constants.EMPTY_HTML);
                                    calculateTotalPage(count, Constants.PAGE_SIZE);
                                    $("#floatOne").empty();//简介悬浮清空
                                    return;
                                }
                                tableListEle.find('.km-norecord').remove();
                                searchResultListEle.find('thead').show();//展示表头
                                var filterHtml = Util.hdb.compile(secondListBar)(data.object);//解析tpl
                                searchResultListEle.append('<tbody>' + filterHtml + '</tbody>');
                                calculateTotalPage(count, opt.perpage);

                                //简介悬浮
                                floatTipsDom('one', articleArr);//加载悬浮dom
                                var elp = $('.primary-key');
                                elp.mouseenter(function (e) {//注册事件
                                    var _this = $(this);
                                    var id = _this.parent().parent().attr('id');
                                    var floatTipsEle = $('#fltps' + id);
                                    floatTipsEle.parent().show();
                                    floatTipsEle.width(_this.parent().width() + 50);
                                    //算高度,确定悬浮位置
                                    var divScrollTop = $('#searchResultList').parent().scrollTop();
                                    var index = $(elp).index(_this);
                                    var topH = (-$('#searchResultList').parent().height() + 64 + (36 * index) - divScrollTop) + 'px';
                                    floatTipsEle.css("top", topH);
                                    e.stopPropagation();
                                });
                                elp.mouseleave(function (e) {
                                    var id = $(this).parent().parent().attr('id');
                                    var floatTipsEle = $('#fltps' + id);
                                    floatTipsEle.parent().hide();
                                    e.stopPropagation();
                                });

                            } else if (btListColumn == '2') {//双列渲染
                                if (articleArr.length == 0) {
                                    searchResultListLeftEle.hide();
                                    searchResultListRightEle.hide();
                                    searchResultListEle.show();
                                    searchResultListEle.find('thead').hide();//隐藏表头
                                    //searchResultListEle.html(Constants.EMPTY_HTML);
                                    var tableListEle = $('.km-table-list');
                                    tableListEle.find('.km-norecord').remove();
                                    tableListEle.append(Constants.EMPTY_HTML);
                                    calculateTotalPage(count, Constants.PAGE_SIZE);
                                    $("#floatLeft").empty();//简介悬浮清空
                                    $("#floatRight").empty();//简介悬浮清空
                                    return;
                                }
                                var tableListEle = $('.km-table-list');
                                tableListEle.find('.km-norecord').remove();
                                searchResultListEle.hide();
                                searchResultListLeftEle.show();
                                searchResultListRightEle.show();
                                klgListColumnTwo(data.object);

                            }

                            addKnwlgFav(knwlgIds);

                            //修改for循环绑定事件
                            //知识详情查看
                            var listItemEle = $('.primary-key');
                            listItemEle.unbind('click').click(function () {
                                var me = $(this).parent().parent();
                                var fixId = me.attr("id");
                                var name = me.attr("name");
                                //判断当前用户是否有权限
                                Util.ajax.ajax({
                                    type: "POST",
                                    url: Constants.PREAJAXURL + "/knowledge/verifyPermission?knwlgId=" + fixId + "&verNo=" + "",
                                    async: true,
                                    success: function (data) {
                                        if (data.object) {
                                            kmUtil.openTab(name.replaceAll("&", "\&"), Constants.PREAJAXURL + Constants.ROOTURL + "/modules/knowledgeAppNew/knowledgeDetailNew.html", {knwlgId: fixId});
                                        } else {
                                            new MyAlert({
                                                type: 'error',
                                                text: "您尚无权限访问！",
                                                falseShow: false,
                                                trueName: "知道了"
                                            });
                                            return;
                                        }
                                    },
                                    error: function () {
                                        return false;
                                    }
                                });
                            });

                            $('.collectCls').unbind('click').on('click', function (e) {
                                var me = $(this);
                                var fixId = me.attr("id").substr(2);
                                if (me.attr("scFlag") == "0") {
                                    //收藏
                                    $(".favorite-add-inner").empty();
                                    var klgTitle = $("#" + fixId).attr("name");
                                    new favKlgAdd(klgTitle, fixId, me);
                                    me.on("favrtResult", function (event, result) {
                                        if (result == 0 || result == "123119") {
                                            me.attr("scFlag", "1");
                                            me.html('已收藏');
                                        }
                                    });
                                } else {
                                    //调用取消收藏接口
                                    Util.ajax.postJson(Constants.AJAXURL + '/klgFavrtInfo/delete' + '/' + fixId, {}, function (data, state) {
                                        if (state) {
                                            new MyAlert({'type': 'success', 'text': data.returnMessage});
                                            me.attr("scFlag", "0");
                                            me.html('收藏');
                                        } else {
                                            if (data.returnCode == "-1") {
                                                new MyAlert({
                                                    type: 'error',
                                                    text: data.returnMessage,
                                                    falseShow: false,
                                                    trueName: '确定'
                                                });
                                                me.attr("scFlag", "0");
                                                me.html('收藏');
                                            } else {
                                                new MyAlert({'type': 'success', 'text': data.returnMessage});
                                            }
                                        }
                                    })
                                }
                                e.stopPropagation();//阻止事件冒泡
                                return false;
                            });
                            new KmCompareNew(data.object.articleList);//对比
                            if(state){
                                done({
                                    beans:[{}],
                                    totalNum:count
                                });
                                if(btListColumn == '2'){//如果为双列，则处理分页dom
                                    pageDom(count,pageEleVal);
                                }
                                if ($(".select_per_page").find("option[value=10]")){
                                    $(".select_per_page").find("option[value=10]").remove();
                                }
                            }
                        }else{

                        }
                    },false);
                }
            };
            if (page) {
                page.reset();
            } else {
                page =  new Pagination(config);
            }
        };
        //计算总条数
        var calculateTotalPage = function(count,items_per_page){
            $("#totalMessage").empty();
            if (count == 0) {
                return;
            }
            $("#totalMessage").html("共<span>"+count+"</span>条,"+Math.ceil(count/items_per_page)+"页");
            if('1'==kmUtil.getOpenMode()){
                if ('2'!= openMethod){
                    kmUtil.cleanWaterMark();
                    kmUtil.addWaterMark();
                }
            }
        };


        /**
         * 自定义strKlgNmHandle方法,知识名称太长加省略号
         */
        Util.hdb.registerHelper('strKlgNmHandle', function (str, numFlag) {
            var widthKlgNm;
            if (btListColumn == '1') {
                if (numFlag == '3') {
                    widthKlgNm = 55;
                } else if (numFlag == '2') {
                    widthKlgNm = 60;
                } else {
                    widthKlgNm = 65;
                }
            } else {
                if (numFlag == '3') {
                    widthKlgNm = 40;
                } else if (numFlag == '2') {
                    widthKlgNm = 45;
                } else {
                    widthKlgNm = 50;
                }
            }

            var len = 0;
            var code = 0;
            for (var i = 0; i < str.length; i++) {
                code = str.charCodeAt(i);
                if (code >= 0 && code <= 127) {
                    len += 1;
                    if (len >= widthKlgNm) {
                        str = str.substr(0, i) + '...';
                        return str;
                    }
                } else {
                    len += 2;
                    if (len >= widthKlgNm) {
                        str = str.substr(0, i) + '...';
                        return str;
                    }
                }
            }
            return str;
        })

        /**
         * 自定义strHandle方法,地区内容太多加省略号
         */
        Util.hdb.registerHelper('strHandle', function (value) {
            if (value.length > 10) {
                value = value.substr(0, 10) + '...';
                return value;
            }
            return value;

        })

        /**
         * 自定义isEven方法，判断行号的奇偶，给加背景色
         */
        Util.hdb.registerHelper('isEven', function (value, options) {
            if ((value % 2) == 0) {
                return options.fn(this);
            }
            return options.inverse(this);
        })

        /**
         * 自定义isNotEqual方法
         */
        Util.hdb.registerHelper( 'isNotEqual', function( value1,value2,options) {
            if (value1 != value2){
                return options.fn(this);
            }
            return options.inverse(this);
        })

        /**
         * 自定义Helper方法
         */
        Util.hdb.registerHelper( 'isEqual', function( value1,value2,options) {
            if(/^[0-9]+.?[0-9]*$/.test(value2)){
                if (value1 == value2){
                    return options.fn(this);
                }
                return options.inverse(this);
            }else{//isEqual方法内容扩展，支持多条件||连接
                if(value2.indexOf("||") > -1){
                    var v2 = $.trim(value2).split("||");
                    var idx = $.inArray(value1, v2);
                    if(idx == -1){
                        return options.inverse(this);
                    }
                    return options.fn(this);
                }else{
                    if (value1 == value2){
                        return options.fn(this);
                    }
                    return options.inverse(this);
                }
            }
        });

        //为当前节点知识注册事件
        // $('#now-atc').unbind().click(function(){
        //     curCataLogList = $(this).prop('checked');
        //     initCurrentKnowledge();
        // });

        showAllEle.click(function(){
            $(this).attr("class","active");
            showNormalEle.attr("class","");
            showExpireEle.attr("class","");
            showPrepareEle.attr("class","");
            params.state="";
            initCurrentKnowledge();
        });
        showCurKlgEle.click(function(){
            if ($(this).is(":checked")) {
                curCataLogList = true;
            } else {
                curCataLogList = false;
            }
            initCurrentKnowledge();
        });

        showNormalEle.click(function(){
            if (!showNormalEle.hasClass('green-active')) {
                if (showExpireEle.hasClass('green-active') && showPrepareEle.hasClass('green-active')) {
                    //new MyAlert({type: 'error', text: "复合筛选最多支持勾选2项", falseShow: false, trueName: "确定"});
                    showExpireEle.attr("class", "");
                    showPrepareEle.attr("class", "");
                    params.state = "1";
                } else {
                    if (showExpireEle.hasClass('green-active') && !showPrepareEle.hasClass('green-active')) {
                        params.state = "1,2";
                    } else if (!showExpireEle.hasClass('green-active') && showPrepareEle.hasClass('green-active')) {
                        params.state = "1,3";
                    } else {
                        params.state = "1";
                    }
                }
                showAllEle.attr("class", "");
                showNormalEle.attr("class", "green-active act-chked");
                initCurrentKnowledge();
            } else {
                if (showExpireEle.hasClass('green-active')) {
                    params.state = "2";
                } else if (showPrepareEle.hasClass('green-active')) {
                    params.state = "3";
                } else {
                    showAllEle.attr("class", "active");
                    params.state = "";
                }
                showNormalEle.attr("class", "");
                initCurrentKnowledge();
            }
        });

        showExpireEle.click(function(){
            if (!showExpireEle.hasClass('green-active')) {
                if (showNormalEle.hasClass('green-active') && showPrepareEle.hasClass('green-active')) {
                    showNormalEle.attr("class", "");
                    showPrepareEle.attr("class", "");
                    params.state = "2";
                } else {
                    if (showNormalEle.hasClass('green-active') && !showPrepareEle.hasClass('green-active')) {
                        params.state = "1,2";
                    } else if (!showNormalEle.hasClass('green-active') && showPrepareEle.hasClass('green-active')) {
                        params.state = "2,3";
                    } else {
                        params.state = "2";
                    }
                }
                showAllEle.attr("class", "");
                showExpireEle.attr("class", "green-active act-chked");
                initCurrentKnowledge();
            } else {
                if (showNormalEle.hasClass('green-active')) {
                    params.state = "1";
                } else if (showPrepareEle.hasClass('green-active')) {
                    params.state = "3";
                } else {
                    showAllEle.attr("class", "active");
                    params.state = "";
                }
                showExpireEle.attr("class", "");
                initCurrentKnowledge();
            }
        });

        showPrepareEle.click(function(){
            if (!showPrepareEle.hasClass('green-active')) {
                if (showNormalEle.hasClass('green-active') && showExpireEle.hasClass('green-active')) {
                    //new MyAlert({type: 'error', text: "复合筛选最多支持勾选2项", falseShow: false, trueName: "确定"});
                    showNormalEle.attr("class", "");
                    showExpireEle.attr("class", "");
                    params.state = "3";
                } else {
                    if (showNormalEle.hasClass('green-active') && !showExpireEle.hasClass('green-active')) {
                        params.state = "1,3";
                    } else if (!showNormalEle.hasClass('green-active') && showExpireEle.hasClass('green-active')) {
                        params.state = "2,3";
                    } else {
                        params.state = "3";
                    }
                }
                showAllEle.attr("class", "");
                showPrepareEle.attr("class", "green-active act-chked");
                initCurrentKnowledge();
            } else {
                if (showNormalEle.hasClass('green-active')) {
                    params.state = "1";
                } else if (showExpireEle.hasClass('green-active')) {
                    params.state = "2";
                } else {
                    showAllEle.attr("class", "active");
                    params.state = "";
                }
                showPrepareEle.attr("class", "");
                initCurrentKnowledge();
            }
        });

        showCountryAllEle.click(function(){
            showCountryAllEle.attr("class","active");
            showCountryEle.removeClass("active");
            showProvinceEle.removeClass("active");
            showVillageEle.removeClass("active");
            selectedLeve = $("#selectedCity").attr("leve");
            if(selectedLeve=="1")
            {
                params.scope="2";
            }else{
                params.scope="1";
            }
            initCurrentKnowledge();
        });
        showCountryEle.click(function(){
            showCountryAllEle.removeClass("active");
            showCountryEle.attr("class","active");
            showProvinceEle.removeClass("active");
            showVillageEle.removeClass("active");
            params.scope="2";
            initCurrentKnowledge();
        });
        var showProvinceFunction = function(){
            showCountryAllEle.attr("class","");
            showCountryEle.attr("class","");
            showProvinceEle.attr("class","active");
            showVillageEle.removeClass("active");
            params.scope="3";
            initCurrentKnowledge();
        };
        var showVillageFunction = function () {
            showCountryAllEle.attr("class","");
            showCountryEle.attr("class","");
            showProvinceEle.attr("class","");
            showVillageEle.addClass("active");
            var cid = $("#selectedCity").attr("cid");
            params.scope="4";
            params.subAuthId = cid;
            initCurrentKnowledge();
        };
        var showCityContent = function (json) {
            var currCitys = json.beans || [];
            currCitys = currCitys.sort(compare('argeSeqno'));
            var cityListEle = $("#citylist");
            cityListEle.empty();
            var cityHtml = '';
            cityHtml += '<li><a class="locationss" href="javascript:void(0)" regnNm="全部" cid="all">全部</a></li>';
            for(var i = 0; i<currCitys.length;i++){
                var item = currCitys[i];
                cityHtml += '<li><a class="locationss" href="javascript:void(0)" sid="'+item.suprRegnId+'" cid="'+item.regnId+'"regnNm="'+item.regnNm+'">'+item.regnNm+'</a></li>';
            }
            cityListEle.append(cityHtml);
            $(".locationss").click(function(e) {//点击事件
                params.scope="4";
                e.stopPropagation();
                var cid = $(e.target).attr("cid");
                var regnNm =  $(e.target).attr("regnNm");
                params.subAuthId = cid;
                initCurrentKnowledge();
                cityListEle.addClass("hide");
                $("#showVillageText").html(regnNm+ " <i class=\"icon km-xiajiantou-copy\" id=\"xiajiantou\"></i>");
                showCountryAllEle.attr("class","");
                showCountryEle.attr("class","");
                showProvinceEle.attr("class","");
                showVillageEle.addClass("active");
            });
        };

        // 全部
        allResultListEle.click(function () {
            allResultListEle.attr("class", "active");
            mainResulListEle.removeClass("active");
            faqResultListEle.removeClass("active");
            params.knowledgeType = '1';
            initCurrentKnowledge();
        });

        // 主业务
        mainResulListEle.click(function () {
            mainResulListEle.attr("class", "active");
            allResultListEle.removeClass("active");
            faqResultListEle.removeClass("active");
            params.knowledgeType = '2';
            initCurrentKnowledge();
        });

        // FAQ
        faqResultListEle.click(function () {
            faqResultListEle.attr("class", "active");
            allResultListEle.removeClass("active");
            mainResulListEle.removeClass("active");
            params.knowledgeType = '3';
            initCurrentKnowledge();
        });


        var initVillage = function () {
            var sidParam = $("#selectedCity").attr("sid");
            var leve = $("#selectedCity").attr("leve");
            var superRrl = Constants.AJAXURL+'/kmConfig/getCacheCitysBySuprRegnId';
            Util.ajax.postJson(superRrl,{suprRegnId:sidParam},function(json,status){
                if(status) {
                    if(leve == "2" || leve == "3"){//展示地市
                        showCityContent(json);
                        $("#citylist").removeClass("hide");
                    }
                }

            });
        };
        //点击其他区域隐藏区域
        $(document).bind('click',function(){
            $("#citylist").addClass("hide");
        });
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

        $("#topSearchKey").bind('keypress',function (event) {
            if (event.keyCode == "13") {
                $("#goSearchInput").click();
            }
        });
        $("#clearSearchInput").click(function(){
            var ele = $('#topSearchKey');
            ele.val("");
            ele.focus();
            $('#searchDiv').attr("class","search-con");
        });
        $("#goSearchInput").click(function(){
            initCurrentKnowledge();
        });
        $("#topSearchKey").bind('input propertychange', function() {
            var searchDiv = $('#searchDiv');
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            var me = $(this);
            if (isIE11) {//如果为ie11
                if (me.val() == "" && (!searchDiv.hasClass('closed'))) {
                    searchDiv.attr("class", "search-con");
                } else if (me.val() != "" && (!searchDiv.hasClass('closed'))) {
                    searchDiv.attr("class", "search-con search-typein");
                }

            }else{
                if (me.val() == "") {
                    searchDiv.attr("class", "search-con");
                } else {
                    searchDiv.attr("class", "search-con search-typein");
                }
            }


        });

        //右侧搜索
        var rightSearchEvent = function(){

            //设置焦点相关---begin
            $.fn.setCursorPosition = function (position) {
                if (this.lengh == 0) {
                    return this;
                }
                return $(this).setSelection(position, position);
            };

            $.fn.setSelection = function (selectionStart, selectionEnd) {
                if (this.lengh == 0) {
                    return this;
                }
                input = this[0];

                if (input.createTextRange) {
                    var range = input.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', selectionEnd);
                    range.moveStart('character', selectionStart);
                    range.select();
                } else if (input.setSelectionRange) {
                    input.focus();
                    input.setSelectionRange(selectionStart, selectionEnd);
                }
                return this;
            };

            $.fn.focusEnd = function () {
                this.setCursorPosition(this.val().length);
            };
            //设置焦点相关---end


            $('#searchDiv').unbind('mouseenter').mouseenter(function () {
                var me = $(this);
                if (me.hasClass('closed')) {
                    me.removeClass('closed');
                    var ele = $('#topSearchKey');
                    if(ele.val() != ''){
                        me.prop("class", "search-con search-typein");
                    }
                    if (window.ActiveXObject || "ActiveXObject" in window) {
                        ele.focusEnd();
                    } else {
                        ele.focus();
                    }

                    //颜色状态去除
                    $('#searchDiv').removeClass('green');
                    $('#goSearchInput').css('color', '');
                }
            });
            $('#searchDiv').unbind('mouseleave').mouseleave(function(e){
                var me = $(this);
                var ele = $('#topSearchKey');
                if (window.ActiveXObject || "ActiveXObject" in window) {
                    var x = e.offsetX;
                    var y = e.offsetY;
                    if( x < 0 && y < 0) {//档xy同时小于0时则判断在输入框内
                        return false;
                    }else{
                        if (!me.hasClass('closed')) {
                            me.removeClass('search-typein').addClass('closed');
                            ele.blur();
                        }
                    }
                }else{
                    if (!me.hasClass('closed')) {
                        me.removeClass('search-typein').addClass('closed');
                        ele.blur();
                    }
                }
                //如果搜索框有内容则致绿
                if (ele.val() != '') {
                    $('#searchDiv').addClass('green');
                    $('#goSearchInput').css('color', '#5AB600');
                }
            });
        };

        //左侧搜索列表计算总条数
        var leftTotalPage = function(count,items_per_page){
            var leftEle = $("#leftTotal");
            leftEle.empty();
            if (count == 0) {
                return;
            }
            leftEle.append("共<span>"+count+"</span>条,"+Math.ceil(count/items_per_page)+"页");
        };

        //左侧列表
        var pageLeft;
        var leftNodeList = function(){
            if (pageLeft) {
                pageLeft.reset();
            } else {
                pageLeft =  new Pagination({
                    el:$('#left_per_id',$("#layer")),
                    items_per_page:Constants.PAGE_SIZE,
                    isShowPerPage:true,
                    current_page:1,
                    limited_width: true,
                    callback:function(opt,done){
                        searchKnowlgAjax(opt,done);//列表
                    }
                });
            }
        }

        //ajax获取左侧搜索数据列表
        var searchKnowlgAjax = function (opt, done) {
            var htmlList = '<li class="feedlist-title"><p>业务名称</p></li>';
            opt.regnId = params.regnId;//区域编码
            opt.nodeNmKey = $.trim($('#leftSearchInput').val());
            if (opt && opt.nodeNmKey && opt.nodeNmKey.length > Constants.KEYWORD_MAX_SIZE) {
                opt.nodeNmKey = opt.nodeNmKey.substr(0, Constants.KEYWORD_MAX_SIZE)
            }
            Util.ajax.getJson(Constants.AJAXURL + '/KmBusTree/nodesKeyWord',
                opt, function (result, status) {
                    if (status) {
                        if (result.object.length > 0) {
                            $.each(result.object, function (idx, obj) {
                                htmlList += '<li id="' + obj.catlId + '"><a href="javascript:void(0);"  id="'
                                    + obj.catlPath + '"' + '>' + obj.nodeNmPath + '</a></li>';
                            })
                        } else {
                            htmlList = Constants.EMPTY_HTML;
                        }
                        $('#left_per_id').empty();
                        $("#leftTotal").empty();
                        var leftListEle = $('#leftKmFeedlist');
                        leftListEle.empty();
                        leftListEle.append(htmlList);
                        var count = result.totalCount;
                        leftTotalPage(count, opt.perpage);//总页数
                        done({
                            beans: [{}],
                            totalNum: count
                        });
                        perPageLimit();
                        //注册点击事件
                        $('#leftKmFeedlist').find('li').unbind().click(function () {
                            var me = $(this);
                            if (!me.hasClass('feedlist-title')) {
                                clearRightSearch();//清空右侧知识搜索框
                                //关闭悬浮层
                                $('.layer-close').hide();
                                layerEmpty();
                                pageLeft = null;
                                $('#layer').hide();
                                var catlPath = me.find('a').prop('id');
                                var nodeId = me.prop('id');
                                Util.ajax.getJson(Constants.AJAXURL + '/KmBusTree/treeNodeExpand',
                                    {'catlPath': catlPath, 'regnId': _scope}, function (result, status) {
                                        if (status) {
                                            result.beans.push({
                                                'id': "0", 'name': "业务树图", 'pId': "",
                                                'isParent': "true"
                                            });//添加根节点
                                            treeMethod(result.beans, nodeId);//树展示

                                            params.catlId = nodeId;
                                            initCurrentKnowledge();//右侧知识列表刷新
                                            Util.ajax.postJson(Constants.AJAXURL + '/KmBusTree/secondTreePathOfEs',
                                                {'regnId': _scope, 'catlId': nodeId}, function (resultData, status) {
                                                    if (status) {
                                                        resultData.object = JSON.parse(resultData.object);
                                                        pArr = resultData.object;
                                                        initLocation(pArr);//当前位置刷新
                                                    }
                                                });
                                        } else {

                                        }
                                    });
                                // <editor-fold desc="ngkm_service_tree_search_result 业务树搜索结果">
                                var key_word = $.trim($('#leftSearchInput').val());
                                var key_word_click = me.find('a').text();
                                Util.ajax.getJson(Constants.AJAXURL + "/sensorsdata/getSensorsdata?t=" + +new Date().getTime(), {}, function (data) {
                                    if (data.returnCode == 0 && data.object == "true") {
                                        if (sensorsdata) {
                                            sensorsdata.track("ngkm_service_tree_search_result", {
                                                key_word: key_word,
                                                key_word_click: key_word_click
                                            });
                                        }
                                    }
                                });
                                // </editor-fold>
                            }
                        });
                    }
                });
        };

        //搜索树多级节点生成，展开，定位
        var treeMethod = function(treeData,nodeId){
            zTreeObj = $.fn.zTree.init($("#left-bussiness-tree"), {
                view: {
                    dblClickExpand: false//屏蔽掉双击事件
                },
                hasLine:true,//是否有节点连线
                callback: {
                    onClick: zTreeOnClick,//点击事件
                    onExpand: zTreeOnExpand//获取子节点事件
                },
                data:{
                    keep:{
                        leaf:true
                    },
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId",
                        rootPId: 0
                    }
                }
            }, treeData);   //生成树
            zTreeObj.expandAll(false);//是否展开节点
            var node = zTreeObj.getNodeByParam("id", nodeId, null);//获取所选节点
            zTreeObj.expandNode(node.getParentNode(),true ,false ,false);//展开所选节点至其父节点
            zTreeObj.selectNode(node);//选中节点
            var lev = node.level;
            $('.inner-tab-container').scrollLeft(lev > 3 ? 30 * (lev - 3) : 0);

        };

        //部分源页面传nodeId方法处理
        var paramHtmlMethod = function () {
            Util.ajax.getJson(Constants.AJAXURL + '/KmBusTree/treeNodeExpandId',
                {'nodeId': id, 'regnId': _scope}, function (result, status) {
                    if (status) {
                        if (result.beans.length > 0) {
                            result.beans.push({
                                'id': "0", 'name': "业务树图", 'pId': "",
                                'isParent': "true"
                            });//添加根节点
                            treeMethod(result.beans, id);//树展示
                            params.catlId = id;
                            initCurrentKnowledge();//右侧知识列表刷新
                            Util.ajax.postJson(Constants.AJAXURL + '/KmBusTree/secondTreePathOfEs',
                                {'regnId': _scope, 'catlId': id}, function (resultData, status) {
                                    if (status) {
                                        resultData.object = JSON.parse(resultData.object);
                                        pArr = resultData.object;
                                        initLocation(pArr);//当前位置刷新
                                    }
                                });
                        }else{//如果找不到节点，则刷新树
                            id = 0;//找不到匹配节点，则重刷树
                            getParentData();
                            params.catlId = id;
                            refreshData();

                        }

                    } else {

                    }
                })
        };

        //改layer
        var layerShow = function () {
            var layerHtml = '<ul class="km-feedlist" id="leftKmFeedlist">' +
                '</ul>' +
                '<div class="km-page">' +
                '<div  id="left_per_id" class="fn-fr noword">' +
                '</div>' +
                '<div class="total-pages" id="leftTotal">' +
                '</div>' +
                '</div>';
            $('#layer').html(layerHtml);
        };

        var layerEmpty = function () {
            $('#layer').empty();
        };

        //限制左侧分页条数
        var perPageLimit = function () {
            var selectEle = $('#left_per_id').find('.select_per_page');
            selectEle.empty();
            var optionHtml = '<option value="" hidden=""></option><option value="20">20</option>';
            selectEle.html(optionHtml);
        };


        //左侧搜索框事件
        var leftSearchEvent = function(){
            //左侧搜索点击触发
            $('#left_go').unbind().click(function(){
                //if($('#leftSearchInput').val().trim() != ''){
                $('#layer').show();//菜单树弹出层展示
                layerShow();
                $('.layer-close').show();//关闭按钮展示
                //ajax获取搜索数据列表
                pageLeft = null;
                leftNodeList();
                $('.layer-close').unbind().click(function(){
                    $(this).hide();
                    layerEmpty();
                    pageLeft = null;
                    $('#layer').hide();
                });
            });

            //左侧搜索框回车触发
            $('#leftSearchInput').unbind().keyup(function(event){
                if(event.keyCode == 13){
                    $('#left_go').click();
                }
            });

            //左侧清空
            $("#left_clear").unbind().click(function(){
                var leftEle = $('#leftSearchInput');
                leftEle.val("");
                leftEle.focus();
                $('#left_search_div').attr("class","search-con");
            });

            //左侧搜索框清除图标切换
            $("#leftSearchInput").bind('input propertychange', function() {
                var leftSearchDivJq = $('#left_search_div');
                if($(this).val()==""){
                    leftSearchDivJq.attr("class","search-con");
                }else{
                    leftSearchDivJq.attr("class","search-con search-typein");
                }
            });
        };

        var pageMainMethod = function () {
            //顶部条配置信息
            var config={
                ele:$('.km-toolbar'),
                clickLocation:function(data) {
                    //showCountryAllEle.click();
                    showCountryAllEle.attr("class", "active");
                    showCountryEle.removeClass("active");
                    showProvinceEle.removeClass("active");
                    showVillageEle.removeClass("active");
                    selectedLeve = $("#selectedCity").attr("leve");
                    if (selectedLeve == "1") {
                        params.scope = "2";
                    } else {
                        params.scope = "1";
                    }

                    pId=0;
                    if (isParamHtmlFlag) {
                        params.catlId = id;
                        refreshData();
                        paramHtmlMethod();
                    } else {
                        Util.ajax.getJson(Constants.AJAXURL + '/KmBusTree/treeNodeExpandId',
                            {'nodeId': id, 'regnId': data.scope}, function (result, status) {
                                if (status) {
                                    if (result.beans.length > 0) {
                                        result.beans.push({
                                            'id': "0", 'name': "业务树图", 'pId': "",
                                            'isParent': "true"
                                        });//添加根节点
                                        treeMethod(result.beans, id);//树展示
                                    } else {
                                        id = 0;//找不到匹配节点，则重刷树
                                        getParentData();
                                    }
                                    params.catlId = id;
                                    refreshData();
                                }
                            })
                    }
                    $('#locationInfo').empty();
                    if(selectedLeve=="3")
                    {
                        $("#showVillageText").html("地市");
                    }else{
                        $("#showVillageText").html("地市<i class=\"icon km-xiajiantou-copy\" id=\"xiajiantou\"></i>");
                    }
                },
                afterCreate:function(){
                    //showCountryAllEle.click();
                    showCountryAllEle.attr("class","active");
                    showCountryEle.removeClass("active");
                    showProvinceEle.removeClass("active");
                    showVillageEle.removeClass("active");
                    selectedLeve = $("#selectedCity").attr("leve");
                    if (selectedLeve == "1") {
                        params.scope="2";
                    }else{
                        params.scope="1";
                    }

                    pId=0;
                    //id=0;
                    params.catlId=id;
                    refreshData();
                    if (isParamHtmlFlag) {
                        paramHtmlMethod();
                    } else {
                        getParentData();
                    }
                    $('#locationInfo').empty();
                    if (selectedLeve == "3") {
                        $("#showVillageText").html("地市");
                    }else{
                        $("#showVillageText").html("地市<i class=\"icon km-xiajiantou-copy\" id=\"xiajiantou\"></i>");
                    }
                }
            };
            new SecKmToolbar(config);
        };

        //知识内容默认按点击量进行排序
        var defaultClickSort = function(){
            if (btListColumn == '1') {
                $('.klgNmRuler').css('color', '');
                $('#klgTimeRuler').css('color', '');
                $('#klgHitRuler').css('color', '#56B600');
            } else {
                sortByTimeTag = false;
                sortByVisitTag = true;
                $("#sortByTime").attr("class", "");
                $("#sortByVisit").attr("class", "selected");
                var thisObj = $("#sortByVisit i");
                thisObj.attr("class", "icon km-xjt");
            }
            params.sortingRule = "hits=F";
        };

        var initialize = function() {
            id = getQueryString("nodeId");//获取路径中知识目录id
            if (id == '' || id == undefined) {
                id = 0;//如果从路径中取为空，则默认直接打开第一级
                isParamHtmlFlag = false;
            }
            leftSearchEvent();//左侧新增搜索
            rightSearchEvent();//右侧搜索补充
            pageMainMethod();
            new SecKmMainNav({
                ele:$('.km-header'),
                selectNode:function(node){

                    id = node.id;
                    pId = node.pId;
                    params.catlId=id;
                    refreshData();
                    if (isParamHtmlFlag) {
                        paramHtmlMethod();
                    } else {
                        getParentData();
                    }
                }
            });
            $("#logictree").addClass("nav-active");
            selectedLeve = $("#selectedCity").attr("leve");
            params = {regnId:_scope,scope:'1',sid:sid,leve:_leve,catlId:id,searchKey:"",state:_state,sortingRule:"",subAuthId:"",knowledgeType:_knowledgeType};//初始化参数
            if (selectedLeve == "1") {
                params.scope="2";
            }
            new KMFooter($('.km-footer'));
            //访问渠道记录
            addAccessChnlRecord();
            // <editor-fold desc="神策埋点开关控制">
            if(kmUtil.getOriginType("http://") || kmUtil.getOriginType("https://")){
                Util.ajax.getJson(Constants.AJAXURL + "/sensorsdata/getSensorsdata?t=" + + new Date().getTime(),{},function (data) {
                    if(data.returnCode == 0 && data.object == "true"){
                        sensorsDataInit();
                    }
                });
            }
            // </editor-fold>
        };

        var addAccessChnlRecord = function () {
            if (kmUtil.getUrlParamter("sysCode")) {
                var ChnlCode =  kmUtil.getUrlParamter("sysCode");
                var PageName = "业务树";
                var config = {
                    type: 'post',
                    url: Constants.AJAXURL + '/chnlRecord/addAccessChnlRecord',
                    data: {ChnlCode: ChnlCode,PageName:PageName,_v: new Date().getTime()}, //要传递给url的数据
                    dataType: 'json', //返回值的数据类型
                    async: true,
                    success: function (result) {
                        if(result.returnCode == "0") {

                        }else{

                        }
                    },
                    error: function () {

                    }
                };
                Util.ajax.ajax(config);
            }
        };
        function refreshData(){
            $el = $('body');
            this.$el = $el;
            var selectEle = $("#selectedCity");
            _scope = selectEle.attr("scope");//获取地区编码
            _leve = selectEle.attr("leve");//获取地区类型
            sid = selectEle.attr("sid");
            params.regnId=_scope;
            params.leve=_leve;
            params.sid=sid;
            //getParentData();//与refreshData分开调用
            //getTreeData();//获取pId,需放进getParentData()方法异步回调方法里
            selectedLeve = $("#selectedCity").attr("leve");
            if(selectedLeve == "1"){//全国  省份地市不可点击
                showProvinceEle.addClass("disabled");
                showProvinceEle.unbind("click");
                showVillageEle.addClass("disabled");
                showVillageEle.unbind("click");
            }
            else if(selectedLeve == "3"){//市 市可点击
                $("#xiajiantou").addClass("hide");
                showProvinceEle.removeClass("disabled");
                showVillageEle.removeClass("disabled");
                $("#showVillageText").html("地市");
                showVillageEle.unbind("click").bind("click",function(){
                    showVillageFunction();
                });
                showProvinceEle.bind("click",function(){
                    showProvinceFunction();
                });
            }else{ //省份
                showProvinceEle.removeClass("disabled");
                showVillageEle.removeClass("disabled");
                $("#showVillageText").html("地市<i class=\"icon km-xiajiantou-copy\" id=\"xiajiantou\"></i>");
                showVillageEle.unbind("click").bind("click",function(){
                    initVillage();
                });
                showProvinceEle.bind("click",function(){
                    showProvinceFunction();
                });
            }
            defaultClickSort();
            initCurrentKnowledge();
        }
    });