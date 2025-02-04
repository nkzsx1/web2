// 接入插码
var _cmosq = _cmosq || [];
// _cmosq.push(['dataType', 'knowledge']);
_cmosq.push(['sid', 'ngkm']);
// 开发本地环境无法调测，故屏蔽
var _root = window.location.host;
var _isTest = true; //本地true，测试、生产false
if (_root != "localhost:18080" && _root != "192.168.100.36:8843" && _root != "ngkmcrm.cs.cmos" && _root != "172.20.118.15:10010") {
    _isTest = false;
}
//测试与生产环境分离
var loctionHref = window.location.href; //浏览器地址栏地址
var serverHref = 'ngkm.cs.cmos'; //服务器地址
if (loctionHref.indexOf(serverHref) >= '0') {
    _cmosq.push(['dataType', 'knowledge']);
} else {
    _cmosq.push(['dataType', 'knowledgetest']);
}
var guidword;
// 同步获取用户信息，设置省份内容
// var userInfo = {};
if (!_isTest) {
    /*$.ajax({
        url: "/ngkm/kmConfig/getUserInfo",dataType:'json', async: true, success: function (data) {
            userInfo = data.bean;
            var prov = userInfo.ctiProvnce;
            //设置省份信息
            _cmosq.push(['prov', prov]);
        }
    });*/
    var prov = window.localStorage.getItem("prov");
    _cmosq.push(['prov', prov]);
}
// 调用插码主函数
(function () {
    if (!_isTest) {
        var ma = document.createElement('script');
        ma.type = 'text/javascript';
        ma.async = true;
        //ma.src = ('https:' == document.location.protocol ? 'https://ngans.cs.cmos/ngans/' : 'http://ngans.cs.cmos/ngans/') + 'ngans.js';
        ma.src = window.location.protocol + "//" + window.location.host + '/ngkm/src/assets/common/ngans.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ma, s);
    }
})();
define([
        'Util',
        'dialog',
        'text!modules/knowledgeAppNew/secKmSearchBar.tpl','js/constants/constants','js/personalCenter/MyAlert','js/constants/kmUtil','js/errCode','Log','crossAPI'
    ],
    function(Util,Dialog,tpl,Constants,MyAlert,kmUtil,errCode,logs,CrossAPI){
        var $el = $(tpl);
        var oper = null;//open:打开新页面  local:本地页面刷新
        var keywordType="1"; //搜索关键词类型
        var sceneType = 1;//引导词应用场景
        var _searchCfg;//搜索优化配置标识
        kmUtil.setLogConfig();
        var timeout;


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
                            var modelUrl = window.location.href;
                            var model_name = '';
                            if (modelUrl.indexOf('kmSecondHome.html') != -1) {
                                model_name = '首页';
                            } else if (modelUrl.indexOf('kmBusinessHallNEW.html') != -1) {
                                model_name = '营业厅';
                            }
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
                                call_id: call_id,
                                call_mobile: call_mobile,
                                dispose_mobile: dispose_mobile,
                                belong_city: belong_city,
                                first_model: "知识库",
                                model_name: model_name,
                                is_call: is_call
                            });
                            sensorsdata.setProfile({
                                staff_id: data.bean.staffCode,
                                staff_name: data.bean.staffName,
                                provnce: data.bean.provnce,
                                serviceTypeId:data.bean.ngmttServicetype,
                                login_system: "知识库系统" // 登录的业务系统
                            });
                            sensorsdata.quick("autoTrack");
                        }
                    }
                })
            }
        }
        //</editor-fold>

        //组装参数
        var getParams = function () {
            var params=new Object();
            params.page = "1";
            params.size = "10";
            var scope = $("#selectedCity").attr("scope");
            params.scope = scope;
            params.timeFrame = "4";
            return params;
        };

        //热门词搜索
        var searchHotKeywords = function(e, kw) {
            $(".guide-info").hide();
            $("#hotsearch").parent().addClass("actives");
            $("#guidword").parent().removeClass("actives");
            $("#historysearch").parent().removeClass("actives");
            keywordType="1";
            var html = "";
            $("#navsearch").show();
            var url = Constants.AJAXURL+'/srchKeyword/searchHotKeywords';
            var param = {
                param: JSON.stringify(getParams())
            };
            Util.ajax.postJson(url,param,function(json,status){
                var hotKeys = $('#hotKeys');
                $('#guess-you-want-search-hotKeys').html("");
                $('.guess-you-want-search-p').hide();
                $('#guess-you-want-search-hotKeys').hide();
                // guess_hotKeys.empty();
                if (status){
                    hotKeys.html("");
                    var oject1 = $.parseJSON(json.object);
                    var flag = oject1.object.hasOwnProperty("keywords");
                    if (flag) {
                        var keywordsObj = oject1 && oject1.object && oject1.object.keywords;
                        if(keywordsObj.length > 0) {
                            for (var i = 0; i <=keywordsObj.length - 1; i++) {
                                var keyName = keywordsObj[i].keyword;
                                html = html +"<li class='item' title='"+keyName+"'><a href='javascript:void(0);'>"+keyName+"</a></li>";
                            }
                            hotKeys.html(html);
                        }
                    } else {
                        hotKeys.html("");
                        $('.search-ho').text("暂无数据");
                    }

                }else{
                    hotKeys.empty();
                    logs.log(errCode.type22,"搜索热词加载失败");

                }
            });
        };

        //提示词搜索
        var searchSuggestionWords = function(e, kw) {
            $("#navsearch").hide();
            $("#guidword").parent().removeClass("actives");

            var startTime = new Date().getTime();

            var html = "";
            //提示词查询
            var url = Constants.AJAXURL+'/srchKeyword/searchSuggestionWords';
            var param = {
                keyword: kw
            };
            Util.ajax.postJson(url,param,function(json,status){
                var searchHotword = $('.km-header .search-hotwords p');
                if (status){
                    var hotKeys = $('#hotKeys');
                    searchHotword.hide();
                    if(json.returnCode!=0){
                        hotKeys.html("");
                        // $('.km-header .search-hotwords').hide();
                        return;
                    }
                    var oject1 = $.parseJSON(json.object);
                    var objCp = oject1 && oject1.object;
                    var flag = objCp.hasOwnProperty("suggestionWords");
                    if (flag) {
                        searchHotword.show();
                        var suggestionWordsObj = oject1.object.suggestionWords;
                        // if(suggestionWordsObj.length > 0) {
                        //     hotKeys.html("");
                        //     for (var i = 0; i <= suggestionWordsObj.length - 1; i++) {
                        //         var keyName = suggestionWordsObj[i].keyword;
                        //         html = html +"<li class='item'><a href='javascript:void(0);'>"+keyName+"</a></li>";
                        //     }
                        //     hotKeys.html(html);
                        // }
                        var endTime = new Date().getTime();

                    } else{
                        hotKeys.html("");
                        // $('.km-header .search-hotwords').hide();
                    }
                    // 模拟请求接口
                    var guess_hotKeys = $('#guess-you-want-search-hotKeys');
                    var guess_p = $('.guess-you-want-search-p');
                    var guess_html = "";
                    Util.ajax.ajax({
                        type: "POST",
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8;'
                        },
                        dataType: 'json',
                        url: Constants.AJAXURL+'/keyword/getKeyWordByQuestion',
                        async: true,
                        data: JSON.stringify({
                            question:param.keyword
                        }),
                        // data: param,
                        success: function (data,textStatus,jqXHR) {
                            if (data.returnCode!=0) {
                                guess_hotKeys.html("");
                                if (json.returnCode!=0) {
                                    $('.km-header .search-hotwords').hide();
                                }
                                return
                            }
                            if (data.returnCode == 0) {
                                console.log(data);
                                guess_hotKeys.html("");
                                if (data.beans.length > 0) {
                                    for (var i = 0; i <= data.beans.length - 1; i++) {
                                        var guess_keyName = data.beans[i].similar_question;
                                        guess_html = guess_html +"<li class='item'><a href='javascript:void(0);'>"+guess_keyName+"</a></li>";
                                    }
                                    guess_hotKeys.html(guess_html);
                                    guess_p.show();
                                    guess_hotKeys.show();
                                    // 原本接口返回控制5条
                                    if (flag) {
                                        if(suggestionWordsObj.length > 0) {
                                            hotKeys.html("");
                                            for (var i = 0; i <= suggestionWordsObj.slice(0,5).length - 1; i++) {
                                                var keyName = suggestionWordsObj[i].keyword;
                                                html = html +"<li class='item'><a href='javascript:void(0);'>"+keyName+"</a></li>";
                                            }
                                            hotKeys.html(html);
                                        }
                                    }
                                }else{
                                    guess_hotKeys.html("");
                                    guess_p.hide();
                                    guess_hotKeys.hide();
                                    // guess_hotKeys.empty();
                                    $('.guess-you-want-search-search-ho').text("暂无数据");
                                    if (!flag) {
                                        $('.km-header .search-hotwords').hide();
                                    }else{
                                        if(suggestionWordsObj.length > 0) {
                                            hotKeys.html("");
                                            for (var i = 0; i <= suggestionWordsObj.length - 1; i++) {
                                                var keyName = suggestionWordsObj[i].keyword;
                                                html = html +"<li class='item'><a href='javascript:void(0);'>"+keyName+"</a></li>";
                                            }
                                            hotKeys.html(html);
                                        }
                                    }
                                }
                            } else {
                                if (data.returnMessage == "No message available") {
                                    new Dialog({
                                        mode: 'tips',
                                        tipsType: 'error',
                                        content: data.returnCode
                                    });
                                } else {
                                    new Dialog({
                                        mode: 'tips',
                                        tipsType: 'error',
                                        content: data.returnMessage
                                    });
                                }
                            }
                        },
                        error: function (data,status,xhr) {
                            console.log(data,status,xhr);
                            throw new Error(JSON.stringify(data));
                        }
                    });
                }else{
                    logs.log(errCode.type21,"搜索提示词加载失败");
                    searchHotword.show();

                }
            });
        };

        var params_chama = {
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
        //拼接参数串
        var getParams_chama = function (name) {
            params_chama.common.ts = new Date().getTime();//每条数据添加时间戳
            params_chama.eve.ce = 'knowledge';
            var args = '';
            for (var i in name) {
                if ( i !="ts" && i != "rf" && i!="cl") {
                    args += '|';
                }
                args += name[i];
            }
            return args;
        }

        var eventInit = function(){
        //获取引导词
        $(document,this.$el).on('click','#guidword',function(e) {
            var html = "";
               $(".guide-info").hide();
               $("#guidword").parent().addClass("actives");
               $("#hotsearch").parent().removeClass("actives");
               $("#historysearch").parent().removeClass("actives");
               hotTag=2;
               var url = Constants.AJAXURL+"/guideword/getGuideWordTpl";
               Util.ajax.getJson(url,{sceneType: sceneType},function(data,status){
                   if(status){
                       var list = data.beans || [];
                       if(list.length==0)
                       {
                           $("#hotKeys").empty();
                           $('.search-ho').text("暂无数据");
                       }else{
                           for (var i = 0; i <list.length; i++) {
                               var guideNm = list[i].guideNm;
                               html = html +"<li class='item' title='"+guideNm+"'><a href='javascript:void(0);' guideId='"+list[i].guideId+"'>"+guideNm+"</a></li>";

                           }
                           $('#hotKeys').html(html);
                       }
                   }else{

                       $("#hotKeys").empty();
                   }

               });
           });
            //点击热门搜索
            $(document,this.$el).on('click','#hotsearch',function(e) {
                e =e || window.event;
                e.stopPropagation();
                var kw = $.trim($(e.currentTarget).val());
                if(kw=="" || guidword  == kw){
                    $(".search-inner .keyword").html("");
                    $(this).removeClass("gray").val('');
                    kw="";
                    $('#topClear').css("visibility","hidden");
                    searchHotKeywords(e,kw);
                }else{
                    $('#topClear').css("visibility","visible");
                    kw = kw.replace(/</g, "&lt;");
                    kw = kw.replace(/>/g, "&gt;");
                    searchSuggestionWords(e,kw);
                }
                num=0;
                $("#hotKeys").scrollTop(num);
            });

            //历史搜索
            var searchHistory = function(e, kw) {
                $(".guide-info").hide();
                $("#hotsearch").parent().removeClass("actives");
                $("#guidword").parent().removeClass("actives");
                $("#historysearch").parent().addClass("actives");
                var html = "";
                $("#navsearch").show();
                var param = {
                    param: JSON.stringify(getParams())
                };

                Util.ajax.postJsonAsync( Constants.AJAXURL+'/historysearch/getHistorySearch',param,{encrypt: true})
                .done(function(json, statusObj){
                   var hotKeys = $('#hotKeys');
                   hotKeys.html("");
                   if(statusObj){
                        if (json.beans && json.beans.length > 0) {
                           for (var i = 0; i <= json.beans.length - 1; i++) {
                               var keyName = json.beans[i];
                               var newName = keyName;
                               if(keyName.length > 20){
                                    newName = keyName.substr(0,20)+'...';
                               }
                               html = html +"<li class='item' title='"+keyName+"'><a href='javascript:void(0);'>"+newName+"</a></li>";
                           }
                           hotKeys.html(html);
                       } else {
                           hotKeys.html("");
                           $('.search-ho').text("暂无数据");
                       }
                   }else{
                        hotKeys.empty();
                        logs.log(errCode.type22,"搜索热词加载失败");

                   }
                }).fail(function(data, statusObj){
                    var hotKeys = $('#hotKeys');
                    hotKeys.empty();
                    logs.log(errCode.type22,"搜索热词加载失败");

                });

            }
             //点击历史搜索
            $(document,this.$el).on('click',"#historysearch",function(e) {
                e =e || window.event;
                e.stopPropagation();
                var kw = $.trim($(e.currentTarget).val());
                if(kw=="" || guidword  == kw){
                    $(".search-inner .keyword").html("");
                    $(this).removeClass("gray").val('');
                    kw="";
                    $('#topClear').css("visibility","hidden");
                    searchHistory(e,kw);
                }else{
                    $('#topClear').css("visibility","visible");
                    kw = kw.replace(/</g, "&lt;");
                    kw = kw.replace(/>/g, "&gt;");
                    searchHistory(e,kw);
                }
                num=0;
                $("#hotKeys").scrollTop(num);
            });
            var num = 0;
            var movePrev = function() {
                $("#kw").blur();
                $(".km-header .search-hotwords").show();
                var index = $(".addbg").prevAll().length;
                if(index == 0) {
                } else {
                    $(".item").removeClass('addbg');
                    $(".item").eq(index - 1).addClass('addbg');
                    num-=27;
                    $("#hotKeys").scrollTop(num);
                }
            }
            var moveNext = function() {
                var index = $(".addbg").prevAll().length;
                var item = $(".item");
                if(index == item.length - 1) {
                    item.removeClass('addbg');
                    item.eq(0).addClass('addbg');
                    $("#hotKeys").scrollTop(0);
                    num=0;
                } else {
                    item.removeClass('addbg');
                    item.eq(index + 1).addClass('addbg');
                    num+=26;
                    $("#hotKeys").scrollTop(num);
                }
            };
            //div获取焦点
            $(document,this.$el).on('click','#guidinfo',function(e) {
                 e =e || window.event;
                 e.stopPropagation();
                 // var kw = $.trim($(e.currentTarget).val());
                 var inner = $(".search-inner .keyword");
                 inner.val('');
                 inner.attr('title','');
                 $(".guide-info").hide();
                var flag = $('li.nav-active >a').text();
                if (typeof(flag)=='undefined' ||( flag!="套餐" && flag!="营业厅" && flag!='优惠活动')){
                    $('.km-header .search-hotwords',this.$el).show();
                }
                 // searchHotKeywords(e,kw);
                 $("#kw").focus();
            });
            // //input点击事件
            // $(document,this.$el).on('click','#kw',function(e) {
            //     e =e || window.event;
            //     e.stopPropagation();
            //     // var kw = $.trim($(e.currentTarget).val());
            //     var inner = $(".search-inner .keyword");
            //     inner.val('');
            //     inner.attr('title','');
            //     $(".guide-info").hide();
            //     $('.search-hotwords',this.$el).show();
            //     // searchHotKeywords(e,kw);
            //     $("#kw").focus();
            // });
            //搜索框获取焦点
            $(document,this.$el).on("focus","#kw",function(e){
                var flag = $('li.nav-active >a').text();
                if (typeof(flag)!='undefined' && ( flag=="套餐" || flag=="营业厅"||flag=='优惠活动')){
                    return;
                }

                e =e || window.event;
                e.stopPropagation();
                var kw = $.trim($(e.currentTarget).val());
                if(kw=="" || guidword  == kw){
                    $(".search-inner .keyword").html("");
                    $(this).removeClass("gray").val('');
                    kw="";
                    $('#topClear').css("visibility","hidden");
                    searchHotKeywords(e,kw);
                }else{
                    $('#topClear').css("visibility","visible");
                    kw = kw.replace(/</g, "&lt;");
                    kw = kw.replace(/>/g, "&gt;");
                    searchSuggestionWords(e,kw);
                }
                num=0;
                $("#hotKeys").scrollTop(num);
            });
            //搜索框失去焦点
            $(document,this.$el).on("blur","#kw",function(e){
                if($('#topClear').css("visibility") == "hidden"){
                    $(".guide-info").show();
                }
                var guidinfo = $("#guidinfo");
                var searchInner = $(".search-inner .keyword");
                var input = searchInner.val();


                input = input.replace(/</g, "&lt;");
                input = input.replace(/>/g, "&gt;");
                if(input ==""){
                var url = Constants.AJAXURL+"/guideword/getGuideWord";
                Util.ajax.getJson(url,{sceneType: sceneType},function(data,status){
                      if(status){
                          var list = data.bean;
                          if(list=="")
                          {
                              guidinfo.html("");
                              guidinfo.attr('title','');
                              searchInner.val('');
                              searchInner.attr('title','');
                              searchInner.addClass("gray");
                          }else{
                              guidinfo.html(list);
                              guidinfo.attr('title',list);
                              searchInner.val(list);
                              searchInner.attr('title',list);
                              searchInner.addClass("gray");
                          }
                      }else{
                          guidinfo.html("");
                          guidinfo.attr('title','');
                          searchInner.val('');
                          searchInner.attr('title','');
                          searchInner.addClass("gray");
                      }
                  });
                    guidinfo.html("");
                    guidinfo.attr('title','');
                    searchInner.val('');
                    searchInner.attr('title','');
                    searchInner.addClass("gray");
                }

                guidinfo.html(input);
                guidinfo.attr('title',input);
                searchInner.val(input);
                searchInner.attr('title',input);
                searchInner.addClass("gray");
                timeout = null;
//                $('#topClear').css("visibility","hidden");
            });
            //搜索框点击事件
            $(document,this.$el).on("click","#kw",function(e){
                e =e || window.event;
                e.stopPropagation();
                // var kw = $.trim($(e.currentTarget).val());
                // var inner = $(".search-inner .keyword");
                // inner.val('');
                // inner.attr('title','');
                $(".guide-info").hide();
                var flag = $('li.nav-active >a').text();
                if (typeof(flag)=='undefined' ||( flag!="套餐" && flag!="营业厅" && flag!='优惠活动')){
                    $('.km-header .search-hotwords',this.$el).show();
                }

                // searchHotKeywords(e,kw);
                $("#kw").focus();
                //updateKeywordClick(kw);
            });
            // 清除录入框事件
            $(document,this.$el).on("click","#topClear",function(e){
                e =e || window.event;
                e.stopPropagation();
                var guidinfo = $("#guidinfo");
                guidinfo.html("");
                guidinfo.attr('title','');
                var inner = $(".search-inner .keyword");
                inner.val('');
                inner.attr('title','');
                $('#topClear').css("visibility","hidden");
                searchHotKeywords(e,"");
                $("#kw").focus() ;
            });

            //搜索框回车事件
            $(document,this.$el).on("keypress","#kw", $.proxy(function(e){
                e =e || window.event;
                var keycode = e.which ? e.which : e.keyCode;
                if(keycode == "13"){
                    var kw = $.trim($(e.currentTarget).val());
                    if (Constants.judgeSpecialCharacter(kw)) {
                        new MyAlert({
                            type: 'error',
                            text: "请输入有效关键词！",
                            falseShow: false,
                            trueName: "知道了"
                        });
                        return;
                    }
                    if(kw!=""){
                        var guide = $(".guide-info");
                        kw = kw.replace(/</g, "&lt;");
                        kw = kw.replace(/>/g, "&gt;");
                        guide.html(kw);
                        guide.attr('title',kw);
                        $(".km-header .search-hotwords").hide();
                        var selectedCity = $("#selectedCity");
                        var cname = selectedCity.attr("cname");
                        var scope = selectedCity.attr("scope");
                        var sid =   selectedCity.attr("sid");
                        var cid =   selectedCity.attr("cid");
                        var leve =  selectedCity.attr("leve");
                        var searchType = getRealTitleType();
                        if ("#"==sid) {
                            sid = "";
                        }
                        if ("#"==cid) {
                            cid = "";
                        }
                        updateGuideWordTotal("",kw);
                        // 接入插码开始
                        Util.ajax.getJson(
                            Constants.AJAXURL + "/chama/getSwitch?t=" + +new Date().getTime(),
                            {},
                            function(data){
                                if(data&&data.object){
                                    params_chama.sign.dt = "knowledge";
                                    params_chama.sign.sid = "ngkm";
                                    params_chama.sign.pr = window.localStorage.getItem("prov");
                                    params_chama.eve.ec = window.localStorage.getItem("channelCode");
                                    params_chama.eve.ea = kw;
                                    params_chama.eve.ev = "search";
                                    params_chama.common.tl = "知识库";
                                    params_chama.common.ul = decodeURI(window.location.href);
                                    var callInfo = window.localStorage.getItem("callKey")||"||";
                                    var str = getParams_chama(params_chama.common)+"|"+getParams_chama(params_chama.eve);
                                    var chama = params_chama.sign.dt + '|' + params_chama.sign.sid + '|' + params_chama.sign.pr + '|' + callInfo + "|" + str;
                                    Util.ajax.postJson(
                                        Constants.AJAXURL + "/chama/send?t=" + +new Date().getTime(),
                                        {"chama":chama},
                                        function (data) {

                                        }
                                    );
                                }/*else{
                                    var chnlId = window.localStorage.getItem("channelCode");
                                    if (!_isTest) {
                                        $('.logClick').on('click', function () {
                                            try{
                                                Log.trackEvent([chnlId, kw, 'search'], this);

                                            }catch(e){

                                            }
                                        });
                                        $('.logClick').click();
                                    }
                                }*/
                            }
                        );
                        // 插码结束
                        if(oper=="open"){
                            this.trigger("openKmSearchList",{kw:kw,scope:scope,name:cname,sid:sid,cid:cid,leve:leve,searchType:searchType,keywordType:keywordType});
                        }else{
                            this.trigger("searchKmListClick",{kw:kw,scope:scope,name:cname,sid:sid,cid:cid,leve:leve,searchType:searchType,keywordType:keywordType});
                        }
                        //updateKeywordClick(kw);
                        // $("#search-btn").trigger('click');
                    }else{
                        new MyAlert({
                            type:'error',
                            text:"请输入关键字！",
                            falseShow:false,
                            trueName:"知道了"
                        });
                        return;
                    }
                }

            },this));
            $(document,this.$el).on('mouseleave','.km-search',function(e) {
                $('.km-header .search-hotwords',this.$el).hide();
                $("#hotKeys").empty();
            });
            $(document,this.$el).on('keydown',$.proxy(function(e) {
                e = e || window.event;
                var keycode = e.which ? e.which : e.keyCode;

                if(keycode == 38) {
                    e.preventDefault();
                    if($.trim($("#hotKeys").html()) == "") {
                        return;
                    }
                    setTimeout(function(){
                        movePrev();
                    },1);
                } else if(keycode == 40) {
                    e.preventDefault();
                    if($.trim($("#hotKeys").html()) == "") {
                        return;
                    }
                    $("#kw").blur();
                    $(".km-header .search-hotwords").show();
                    if($(".item").hasClass("addbg")) {
                        setTimeout(function(){
                            moveNext();
                        },1);
                    } else {
                        $(".item").removeClass('addbg').eq(0).addClass('addbg');
                    }
                } else if(keycode == 13) {
                    var text = $(".addbg").text();
                    if(text!=""){
                        $('#topClear').css("visibility","visible");
                        $(".search-inner .keyword").val(text);
                        $(".km-header .search-hotwords").hide();
                        var selectedCity = $("#selectedCity");
                        var cname = selectedCity.attr("cname");
                        var scope = selectedCity.attr("scope");
                        var sid =   selectedCity.attr("sid");
                        var cid =   selectedCity.attr("cid");
                        var leve =  selectedCity.attr("leve");
                        var searchType = getRealTitleType();
                        if ("#"==sid) {
                            sid = "";
                        }
                        if ("#"==cid) {
                            cid = "";
                        }
                        // updateGuideWordTotal("",text);
                        // 接入插码开始
                        Util.ajax.getJson(
                            Constants.AJAXURL + "/chama/getSwitch?t=" + +new Date().getTime(),
                            {},
                            function(data){
                                if(data&&data.object){
                                    params_chama.sign.dt = "knowledge";
                                    params_chama.sign.sid = "ngkm";
                                    params_chama.sign.pr = window.localStorage.getItem("prov");
                                    params_chama.eve.ec = window.localStorage.getItem("channelCode");
                                    params_chama.eve.ea = text;
                                    params_chama.eve.ev = "search";
                                    params_chama.common.tl = "知识库";
                                    params_chama.common.ul = decodeURI(window.location.href);
                                    var callInfo = window.localStorage.getItem("callKey")||"||";
                                    var str = getParams_chama(params_chama.common)+"|"+getParams_chama(params_chama.eve);
                                    var chama = params_chama.sign.dt + '|' + params_chama.sign.sid + '|' + params_chama.sign.pr + '|' + callInfo + "|" + str;
                                    Util.ajax.postJson(
                                        Constants.AJAXURL + "/chama/send?t=" + +new Date().getTime(),
                                        {"chama":chama},
                                        function (data) {

                                        }
                                    );
                                }/*else{
                                    var chnlId = window.localStorage.getItem("channelCode");
                                    if (!_isTest) {
                                        $('.logClick').on('click', function () {
                                            try{
                                                Log.trackEvent([chnlId, text, 'search'], this);

                                            }catch(e){

                                            }
                                        });
                                        $('.logClick').click();
                                    }
                                }*/
                            }
                        );
                        // 插码结束
                        if(oper=="open"){
                            this.trigger("openKmSearchList",{kw:text,scope:scope,name:cname,sid:sid,cid:cid,leve:leve,searchType:searchType,keywordType:keywordType});
                        }else{
                            this.trigger("searchKmListClick",{kw:text,scope:scope,name:cname,sid:sid,cid:cid,leve:leve,searchType:searchType,keywordType:keywordType});
                        }

                    }
                }else if(keycode==8){
                    var kw = $("#kw").val();
                    if(kw=="") {
                        // $('#hotKeys').html("");
                        // $(".search-inner .keyword").val('');
                        // searchHotKeywords(e, kw);
                        $(".search-inner .keyword").val('');
                        $('#topClear').css("visibility","hidden");
                        searchHotKeywords(e,"");
                    }
                }
            },this));
            // 搜索关键字 click
            $(document,this.$el).on('mousedown', '.search-ho a', $.proxy(function(e){
                $(".km-header .search-hotwords").hide();
                var $item = $(e.currentTarget);
                var text= $.trim($item.parent().attr("title")) || $.trim($item.text());
                if (Constants.judgeSpecialCharacter(text)) {
                    new MyAlert({
                        type: 'error',
                        text: "请输入有效关键词！",
                        falseShow: false,
                        trueName: "知道了"
                    });
                    return;
                }
                var guide = $(".guide-info");
                guide.html(text);
                guide.attr('title',text);
                var inner = $(".search-inner .keyword");
                inner.val(text);
                inner.removeClass("gray");
                var is_guide_word = false;
                var is_history_word = false;
                var is_hot_word = false;
                var clickTypeNm = '';
                //add by yaolu
                if($("#guidword").parent().hasClass("actives")){
                    keywordType="2";

                    var id=$item.attr("guideid");
                    updateGuideWordTotal(id,text);
                    // is_guide_word -begin
                    is_guide_word = true;
                    is_history_word = false;
                    is_hot_word = false;
                    // is_guide_word -end
                }
                //end
                // is_hot_word -begin
                if($("#hotsearch").parent().hasClass("actives")){
                    is_guide_word = false;
                    is_history_word = false;
                    is_hot_word = true;
                }
                // is_hot_word -end

                // is_history_word -begin
                if($("#historysearch").parent().hasClass("actives")){
                    is_guide_word = false;
                    is_history_word = true;
                    is_hot_word = false;
                }

                if(is_history_word){
                    clickTypeNm = 'is_history_word'
                }else if(is_hot_word){
                    clickTypeNm = 'is_hot_word'
                }else if(is_guide_word){
                    clickTypeNm = 'is_guide_word'
                }

                // is_history_word -end

                if(text!=""){
                    inner.attr('title',text);
                    searchSuggestionWords(e,text);
                    $('#topClear').css("visibility","visible");

                }
                var selectedCity = $("#selectedCity");
                var cname = selectedCity.attr("cname");
                var scope = selectedCity.attr("scope");
                var sid =   selectedCity.attr("sid");
                var cid =   selectedCity.attr("cid");
                var leve =  selectedCity.attr("leve");
                var searchType = getRealTitleType();
                if ("#"==sid) {
                    sid = "";
                }
                if ("#"==cid) {
                    cid = "";
                }

                // 接入插码开始
                Util.ajax.getJson(
                    Constants.AJAXURL + "/chama/getSwitch?t=" + +new Date().getTime(),
                    {},
                    function(data){
                        if(data&&data.object){
                            params_chama.sign.dt = "knowledge";
                            params_chama.sign.sid = "ngkm";
                            params_chama.sign.pr = window.localStorage.getItem("prov");
                            params_chama.eve.ec = window.localStorage.getItem("channelCode");
                            params_chama.eve.ea = text;
                            params_chama.eve.ev = "search";
                            params_chama.common.tl = "知识库";
                            params_chama.common.ul = decodeURI(window.location.href);
                            var callInfo = window.localStorage.getItem("callKey")||"||";
                            var str = getParams_chama(params_chama.common)+"|"+getParams_chama(params_chama.eve);
                            var chama = params_chama.sign.dt + '|' + params_chama.sign.sid + '|' + params_chama.sign.pr + '|' + callInfo + "|" + str;
                            Util.ajax.postJson(
                                Constants.AJAXURL + "/chama/send?t=" + +new Date().getTime(),
                                {"chama":chama},
                                function (data) {

                                }
                            );
                        }/*else{
                            var chnlId = window.localStorage.getItem("channelCode");
                            if (!_isTest) {
                                $('.logClick').on('click', function () {
                                    try{
                                        Log.trackEvent([chnlId, text, 'search'], this);

                                    }catch(e){

                                    }
                                });
                                $('.logClick').click();
                            }
                        }*/
                    }
                );
                // 插码结束

                if(oper=="open"){
                    this.trigger("openKmSearchList",{kw:text,scope:scope,name:cname,sid:sid,cid:cid,leve:leve,searchType:searchType,keywordType:keywordType,clickTypeNm:clickTypeNm});
                }else{
                    this.trigger("searchKmListClick",{kw:text,scope:scope,name:cname,sid:sid,cid:cid,leve:leve,searchType:searchType,keywordType:keywordType,clickTypeNm:clickTypeNm});
                }

                e =e || window.event;
                e.stopPropagation();
                // $("#search-btn").trigger('click');
            },this));

            //获取搜索类型参数
            var getRealTitleType = function(){
                if(_searchCfg == '0'){
                    return '2';
                }else{
                    // return $('#searchTitleType').val();
                    return $('#searchTitleType').find("li.active").attr('value');
                }
            }

            //确定按钮
            $(document,this.$el).on('click', '.search-inner .btn', $.proxy(function(e){
                var guideInfo = $(".guide-info");
                guideInfo.hide();
                $(".km-header .search-hotwords").hide();
                var text= $.trim($('#kw').val());
                if (Constants.judgeSpecialCharacter(text)) {
                    new MyAlert({
                        type: 'error',
                        text: "请输入有效关键词！",
                        falseShow: false,
                        trueName: "知道了"
                    });
                    return;
                }
                guideInfo.html(text);
                guideInfo.attr('title',text);
                var inner = $(".search-inner .keyword");
                // $('#topClear').css("visibility","visible");
                inner.val(text);
                inner.attr('title',text);
                inner.addClass("gray");
                if(text==""||text==undefined){
                    new MyAlert({
                        type:'error',
                        text:"请输入关键字！",
                        falseShow:false,
                        trueName:"知道了"
                    });
                    return;
                }
                var selectedCity = $("#selectedCity");
                var cname = selectedCity.attr("cname");
                var scope = selectedCity.attr("scope");
                var sid =   selectedCity.attr("sid");
                var cid =   selectedCity.attr("cid");
                var leve =  selectedCity.attr("leve");
                var searchType = getRealTitleType();

                if ("#"==sid) {
                    sid = "";
                }
                if ("#"==cid) {
                    cid = "";
                }
                //获取当前点击按钮dom元素id
                var test = this;
                var curDomId = e.currentTarget.getAttribute("id");
                if(curDomId && curDomId == "autorefresh-btn") { //如果当前点击按钮为自动刷新按钮，则跳过日志记录
                    if(oper=="open"){
                        test.trigger("openKmSearchList",{kw:text,scope:scope,name:cname,sid:sid,cid:cid,leve:leve,searchType:searchType,keywordType:keywordType,searchBtnId:"autorefresh-btn"});
                    }else{
                        test.trigger("searchKmListClick",{kw:text,scope:scope,name:cname,sid:sid,cid:cid,leve:leve,searchType:searchType,keywordType:keywordType,searchBtnId:"autorefresh-btn",search_Type:'2'});
                    }
                } else {
                    updateGuideWordTotal("",text);

                    // 接入插码开始
                    Util.ajax.getJson(
                        Constants.AJAXURL + "/chama/getSwitch?t=" + +new Date().getTime(),
                        {},
                        function(data){
                            if(data&&data.object){
                                params_chama.sign.dt = "knowledge";
                                params_chama.sign.sid = "ngkm";
                                params_chama.sign.pr = window.localStorage.getItem("prov");
                                params_chama.eve.ec = window.localStorage.getItem("channelCode");
                                params_chama.eve.ea = text;
                                params_chama.eve.ev = "search";
                                params_chama.common.tl = "知识库";
                                params_chama.common.ul = decodeURI(window.location.href);
                                var callInfo = window.localStorage.getItem("callKey")||"||";
                                var str = getParams_chama(params_chama.common)+"|"+getParams_chama(params_chama.eve);
                                var chama = params_chama.sign.dt + '|' + params_chama.sign.sid + '|' + params_chama.sign.pr + '|' + callInfo + "|" + str;
                                Util.ajax.postJson(
                                    Constants.AJAXURL + "/chama/send?t=" + +new Date().getTime(),
                                    {"chama":chama},
                                    function (data) {

                                    }
                                );
                            }/*else{
                                var chnlId = window.localStorage.getItem("channelCode");
                                if (!_isTest) {
                                    $('.logClick').on('click', function () {
                                        try{
                                            Log.trackEvent([chnlId, text, 'search'], this);

                                        }catch(e){

                                        }
                                    });
                                    $('.logClick').click();
                                    //updateKeywordClick(text);
                                }
                            }*/
                        }
                    );
                    // 插码结束

                    // ngkm_click_search_button自定义埋点事件 -begin
                    Util.ajax.getJson(Constants.AJAXURL + "/sensorsdata/getSensorsdata?t=" + +new Date().getTime(), {}, function (data) {
                        if (data.returnCode == 0 && data.object == "true") {
                            if (sensorsdata) {
                                var $url = window.location.href;
                                var model_name = '';
                                if ($url.indexOf('kmSecondHome.html') != -1) {
                                    model_name = '首页';
                                } else if ($url.indexOf('kmBusinessHallNEW.html') != -1) {
                                    model_name = '营业厅';
                                }
                                sensorsdata.track("ngkm_click_search_button", {
                                    $url: $url,
                                    model_name: model_name
                                });
                            }
                        }
                        if(oper=="open"){
                            test.trigger("openKmSearchList",{kw:text,scope:scope,name:cname,sid:sid,cid:cid,leve:leve,searchType:searchType,keywordType:keywordType});
                        }else{
                            test.trigger("searchKmListClick",{kw:text,scope:scope,name:cname,sid:sid,cid:cid,leve:leve,searchType:searchType,keywordType:keywordType});
                        }
                    });
                    // ngkm_click_search_button自定义埋点事件 -end
                }

                e =e || window.event ;
                e.stopPropagation();
            },this));



            function updateGuideWordTotal(id,text) {
                Util.ajax.postJson(Constants.AJAXURL+'/record/updateGuideClickQut',{guideId:id,keyword:text,sceneType:sceneType},function(json,status){
                    if(status){

                    }else{

                    }
                });
            }
        };

        var updateKeywordClick = function(keyWord,hasResult){
            var data = {
                keyWord:keyWord,
                hasResult:hasResult
            };
            Util.ajax.postJson(Constants.AJAXURL+"/record/saveKeywordTotal",data,function(json){
                if(json.returnCode == 0){

                }else{

                }
            });
        };


        var toolBar = function(option){
            this.$el = $el;
            // 增加事件处理，可以和外部交互
            Util.eventTarget.call(this);
            //
            eventInit.call(this);
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

        $.extend(toolBar.prototype, Util.eventTarget.prototype,{
            updateKeywordClick:updateKeywordClick
        });

        // 序列化url查询参数
        function searchUrl(url) {
            var result = {};
            var map = url.split("&");
            for(var i = 0, len = map.length; i < len; i++){
                result[map[i].split("=")[0]] = map[i].split("=")[1];
            }
            return result;
        }

        var kwEvent = function(){
            var searchSuggest = function(e){
                var keycode = e.which ? e.which : e.keyCode;
                if(keycode != "13"){
                    $('.km-header .search-hotwords',this.$el).show();
                    e =e || window.event;
                    var tChangeMenu;
                    $(this).css("color","black");
                    clearTimeout(tChangeMenu);
                    var tChangeMenu = setTimeout(function(){
                        var kw = $.trim($("#kw").val());
                        kw = kw.replace(/</g, "&lt;");
                        kw = kw.replace(/>/g, "&gt;");
                        if(kw!=""){
                            $(".search-inner .keyword").attr('title',kw);
                            $('#topClear').css("visibility","visible");
                            searchSuggestionWords(e,kw);
                        }else{
                            $('#topClear').css("visibility","hidden");
                            $('#hotKeys').html("");
                            searchHotKeywords(e,kw)
                        }
                        num=0;
                        $("#hotKeys").scrollTop(num);
                        clearTimeout(tChangeMenu);
                        tChangeMenu = null;
                    },0);
                    e =e || window.event;
                    e.stopPropagation();
                }
            };
            
            var doSearch = function(e){
                if(timeout){
                    window.clearTimeout(timeout);
                    timeout == null;
                }
                timeout = window.setTimeout(function(){
                    if(timeout){
                        searchSuggest(e);
                    }
                }, 1000);
            };
            
            if(window.addEventListener){
                if (document.getElementById('kw')) {
                    var doing = false;
                    document.getElementById('kw').addEventListener('compositionstart', function (e) {
                        doing = true;
                    }, false);
                    document.getElementById('kw').addEventListener('input', function (e) {
                        if (!doing) {
                            doSearch(e);
                        }
                    }, false);

                    document.getElementById('kw').addEventListener('compositionend', function (e) {
                        doing = false;
                        doSearch(e);
                    }, false);
                }
            }else{
                $(document,this.$el).on('keyup','#kw',function(e) {
                    doSearch(e);
                });
            }
            initSearchTypeEvent();
        };
        var initSearchTypeEvent = function () {
            $("#searchTitleType ul").on("click", 'li', function () {
                var $this = $(this);
                if (!$this.hasClass('active')) {
                    $this.siblings('li').removeClass('active');
                    $this.addClass('active');
                }
            })
        }
        // 序列化url查询参数
        function serilizeUrl(url) {
            var result = {};
            var map = url.split("&");
            for (var i = 0, len = map.length; i < len; i++) {
                result[map[i].split("=")[0]] = map[i].split("=")[1];
            }

            return result;
        }
        $.extend(toolBar.prototype, Util.eventTarget.prototype,{
            initKmSearchBar:function(operation){
                oper = operation;

                //var kw;
                var urlPathName = window.location.pathname;
                if (urlPathName.indexOf("secKmSearchList.html") > -1){//查询结果页
                           // 路径查询参数部分
                          var  searchURL = decodeURI(window.location.href);
                          var begin = searchURL.indexOf("?");
                          searchURL = searchURL.substr(begin+1);
                          // 参数序列化
                          var searchData = searchUrl(decodeURI(searchURL));

                          //kw =  Constants.kmDecodeURl(searchData.kw);

                }else{
                    if(urlPathName.indexOf("kmBusinessHallNEW.html") > -1){
                        sceneType = 2;
                    }else if(urlPathName.indexOf("KmScenario.html") > -1){
                        sceneType = 3;
                    }else if(urlPathName.indexOf("KmActivitis.html") > -1){
                        sceneType = 4;
                    }
                    var url = Constants.AJAXURL+"/guideword/getGuideWord";
                    Util.ajax.getJson(url,{sceneType: sceneType},function(data,status){
                        var guideInfo = $(".guide-info");
                        var inner = $(".search-inner .keyword");
                        if(status){
                            var list = data.bean;
                            guidword = list;
                            if(list=="")
                            {  guideInfo.html("");
                                guideInfo.attr('title','');
                                inner.val('');
                                inner.addClass("gray");
                            }else{
                                // 路径查询参数部分
                                var searchURL = decodeURI(window.location.href);
                                var begin = searchURL.indexOf("?");
                                searchURL = searchURL.substr(begin + 1);
                                // 参数序列化
                                var searchData = serilizeUrl(decodeURI(searchURL));
                                kw = Constants.kmDecodeURl(decodeURIComponent(searchData.kw));
                                // if ((urlPathName.indexOf("secKmSearchListForPic.html") > -1) && (kw==undefined || kw=='')) {
                                    guideInfo.html(list);
                                    guideInfo.attr('title',list);
                                    inner.val(list);
                                    inner.attr('title',list);
                                    // 搜索框获取焦点
                                    inner.addClass("gray");
                                // }
                            }
                        }else{
                            guideInfo.html("");
                            guideInfo.attr('title','');
                            inner.val('');
                            inner.addClass("gray");
                        }
                    });

                }
                //搜索标题配置初始化
                Util.ajax.ajax({
                    type:"GET",
                    async:true,
                    url:Constants.AJAXURL+'/KmBusTree/getTitleCfg?v='+new Date().getTime(),success:function(datas){
                        var searchTitleTypeEle = $('#searchTitleType');
                        var $searchTitleTypePdom = searchTitleTypeEle.parent().parent();
                        if(urlPathName.indexOf("favoritesKnowlg.html") != -1){
                            //收藏页面  隐藏搜索方式选择框
                            $searchTitleTypePdom.addClass('km-search-no-select');
                            searchTitleTypeEle.find("li[value='1']").addClass("active").siblings('li').removeClass('active');
                            // searchTitleTypeEle.val("1");
                            //调整默认搜索方式
                            _searchCfg = '1';
                        }else{
                            if(datas.bean && datas.bean.searchCfg == '0'){
                                $searchTitleTypePdom.addClass('km-search-no-select');
                                _searchCfg = '0';
                            }else {
                                _searchCfg = '1';
                                //如果未配置简化搜索，则展示全文/类型选择项
                                $searchTitleTypePdom.removeClass('km-search-no-select');
                                var searchTitleType = kmUtil.getUrlParamter("searchTitleType");
                                if(searchTitleType){
                                    // searchTitleTypeEle.val(searchTitleType);
                                    searchTitleTypeEle.find("li[value='" + searchTitleType + "']").addClass("active").siblings('li').removeClass('active');
                                }else{
                                    // datas.bean.personTitleCfg ? searchTitleTypeEle.val(datas.bean.personTitleCfg) : searchTitleTypeEle.val("1");
                                    datas.bean.personTitleCfg ? searchTitleTypeEle.find("li[value='" + datas.bean.personTitleCfg + "']").addClass("active").siblings('li').removeClass('active') : searchTitleTypeEle.find("li[value='1']").addClass("active").siblings('li').removeClass('active');
                                }
                            }
                        }
                        kwEvent();
                    },error:function(datas){
                        kwEvent();
                        return;
                    }
                });
            }
        });
        return toolBar;
    });