/**
 * @Description: 知识库前端主导航条
 * @Date: 10:41 2017/7/27
 * @Author: Liuhenghui
 */
define(['Util','loading','tip',/*'js/knowledgeAppNew/secKmCommon',*/'js/constants/constants',
        'text!modules/knowledgeAppNew/secKmMainNav.tpl','js/constants/kmUtil','js/personalCenter/MyAlert',
        'js/knowledgeAppNew/secKmSearchBar', "upload",'dialog' ],
    function(Util,Loading,Tip,/*KmCommon,*/Constants,tpl,KmUtil,MyAlert,KmSearchBar, Upload, Dialog){
    //var kmCommon = {};
    var global_upload_success_return_data = {};
    var global_uploadImg_text = ''
    var tabName;
    var loadingConfig = {
        //el:'#allDiv',                  //组件要绑定的容器，默认为body（此项可不配置或留空）
        //className:'ke-screen-loading',           //组件外围的className*/
        position:'center',      //提示信息位置，顶部top|默认center中央
        width:'300',      //loading的宽度,非必须，默认300
        height:'auto',      //loading的宽度,非必须，默认auto
        mask:1,                 //是否显示遮罩， 0不显示|默认1显示
        animate:0,              //是否显示动画效果， 0不显示|默认1显示
        mode:'layer',     //展示方式 loadingLine线条方式|默认layer弹层方式
        text:'图片文字智能提取中...',       //提示文字，默认 加载中...
        icon:'dotCycle',  //文字前面的gif动画， 默认dotCycle有点组成的圈|cmcc移动图标|cmccLarge大的移动图标
        // content:'<div>加载中...</div>'     //自定义显示信息,设置后text和icon配置就失效了。    
    }
    var loadings = null;
    var html_loading = {
        hide: function(){
            $("#tab-1").css("display", "none");
            $("#tab-2").css("display", "none");
        },
        show: function(){
            $("#tab-1").css("display", "block");
            $("#tab-2").css("display", "block");
        }
    };
    var global_imageSearchSwitchData = ''
    var key = "NGKM_SEARCHKLG_BYIMAGE";//附件模块
    // 前端埋点神策 SDK 初始化 NGKM2019-522 -begin
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
                scroll_notice_map:'not_collect'
            }
        });

        if(sensorsdata){
            Util.ajax.getJson(Constants.AJAXURL + '/user/session' + "?t=" + new Date().getTime(), {}, function (data, state) {
                if (state) {
                    if (data && data.bean) {
                        //神策用户关联的方法，其中 user_id 为用户的真实 id，字符串或者数值类型都可以。
                        sensorsdata.identify(data.bean.staffCode,true);
                        sensorsdata.registerPage({
                            staff_id: data.bean.staffCode,
                            staff_name: data.bean.staffName,
                            provnce: data.bean.provnce,
                            serviceTypeId: data.bean.ngmttServicetype,
                            first_model: "知识库",
                            page_code: "knwlgHome",
                            page_name: "知识库首页NEW",
                            login_system: "知识库系统" // 登录的业务系统
                        });
                        sensorsdata.setProfile({
                            staff_id: data.bean.staffCode,
                            staff_name: data.bean.staffName,
                            provnce: data.bean.provnce,
                            serviceTypeId:data.bean.ngmttServicetype,
                            login_system: "知识库系统" // 登录的业务系统
                        });
                        var openMode = KmUtil.getOpenMode();
                        sensorsdata.quick("autoTrack", {
                            openMode:openMode
                        });
                    }
                }
            })
        }
    }
    // 前端埋点神策 SDK 初始化 NGKM2019-522 -end

    /**
     * 获取当前系统时间年月日时分秒
     */
    var getCurrentDate = function (date) {
        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var min = date.getMinutes();
        var s = date.getSeconds();
        var str = y + '年' + (m < 10 ? ('0' + m) : m) + '月' + (d < 10 ? ('0' + d) : d) + '日  ' + (h < 10 ? ('0' + h) : h) + ':' + (min < 10 ? ('0' + min) : min) + ':' + (s < 10 ? ('0' + s) : s);
        return str;
    }


    //掉接口查询展示场景
    var initScence = function () {
        var url = Constants.AJAXURL+'/KmBusTree/getSenceList';
        Util.ajax.getJson(url,{},function(data,status){
            if(status){

                var configVal = data && data.bean && data.bean.configVal;
                var items = (configVal+"").split(",");
                var list = Constants.senceList;
                var newArr = [];
                for(var i=0;i<items.length;i++){
                    newArr.push(list[items[i]-1]);
                }
                $("#logictree").nextAll("li").remove();
                for(var i=0;i<newArr.length;i++){
                    var clas = "",acls="";
                    if(window.location.href.indexOf(newArr[i].url) > -1){
                        clas = 'class="nav-active"';
                    }
                    if(window.location.href.indexOf(newArr[i].url) > -1 && KmUtil.getOpenMode() == "2"){
                        acls = ' style="cursor:default;"';
                    }
                    $(".nav-main").append('<li '+clas+'><a id="'+newArr[i].id+'" url="'+newArr[i].url+'" cname="'+newArr[i].name+'" '+acls+' href="javascript:;">'+newArr[i].name+'</a></li>');
                    $("#"+newArr[i].id).click(function () {
                        var me = $(this);
                        //自身页面
                        if(window.location.href.indexOf(me.attr("url")) > -1 && KmUtil.getOpenMode() == "1"){//
                           location.reload();
                           return;
                        }else if(window.location.href.indexOf(me.attr("url")) > -1 && KmUtil.getOpenMode() == "2"){

                            return;
                        }
                        var cname = me.attr("cname");
                        var url = Constants.AJAXURL+me.attr("url");
                        if(cname == "咨询表"){
                            cname = "咨询表查询";
                        }
                        var target_mode = '_self';
                        if (cname == "云手机") {
                            target_mode = '_blank';
                        }
                       KmUtil.openTab(cname,url,{},{target:target_mode,tabName:tabName});//

                        // 神策新增埋点-场景栏点击事件 NGKM2019-522 -begin
                        Util.ajax.getJson(Constants.AJAXURL + "/sensorsdata/getSensorsdata?t=" + +new Date().getTime(), {}, function (data) {
                            if (data.returnCode == 0 && data.object == "true") {
                                if (sensorsdata) {
                                    var clickSenceTime = getCurrentDate();
                                    sensorsdata.track("senceClickEvent", {
                                        clickSenceTime: clickSenceTime,
                                        clickSenceName: cname
                                    });
                                }
                            }
                        });
                        // 神策新增埋点-场景栏点击事件 NGKM2019-522 -end


                    });
                }
                if (document.getElementById('rightInter')) {
                    Util.ajax.postJson(Constants.AJAXURL+"/openMode/getGuideFlag",{},function(json){
                        if(json.returnCode == 0){
                            if (json.object=='0') {
                                // 是否添加权益指引
                                var tipConfig = {
                                    el: document.getElementById('rightInter') || $('#rightInter'),   // 要绑定的对象可以是jquery，也可以是dom对象
                                    align: 'right top', //设置提示框的对齐方式。默认值: "left"。可选："top left" "top" "top right" "right top" "right" "right bottom" "bottom right" "bottom" "bottom left" "left bottom" "left" "left top"。
                                    width: 300, //tip宽度，默认300，范围90 ~ 500
                                    height: 100, //tip高度，默认100，自适应情况下范围28 ~ 100，非自适应情况最大值为屏幕高度
                                    content: '<div style="font-weight: 600;">该场景可查询权益类相关知识</div><div id="guideBox" style="text-align: center;padding-top: 2px;"><span style="color: #5AB600;">\
                                                    <a style="padding-left: 15px;color: #5AB600;background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAA8UlEQVQoka3Sr0tDURjG8c+mOBAMZtfFbDUZxTQsChYVsdhMS1oVi8G2uuAfYFixyBDRf8AfZdoNBmeaHHk3Dpd7i/jA5Xnvc87L95z3Xn9Vbdy3df1bruAA35jHBxq4RL+7Nppg6hlwESd4wC5a4fc4xXJ+uOmsPkQXncLpL/CFPTyWEWdxV3HlPqbyoF6oP+NOq5gLb0Q+U9XYxEIMbAe34bXIm1WNPbQxxDFG4cPIe1WNZxjE53jDTXh6f4/1ifKpJsIVziNfwj62cRTrpcSkVzxjHS/hifZUHHNOTEqbNoubkvK/poy4EdT8Sdk/CT8ucTMOeXah/gAAAABJRU5ErkJggg==) no-repeat; background-position: -1px 2px;" href="javascript:;">我知道了</a>\
                                                    <a style="padding-left: 15px;color: #5AB600;background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAABIElEQVQokZ3SPyjvURjH8ReJUEoGlIEY/Sl/MrhFFvm5d2FQUgyUMpNBdyCrVbrDHZRJdyGDhSxKGSQDKRtW+VOKrk6db530U/JZztPpvJ/n8zzP8V0VBG5styDFa/ATDXjBEfbxmj3YzP1XmAAhXsIZevGEYizjFF1p9qIkXkcjWnGb3C9iGDv4heMUzKEHnXjO0/a/6Ogv2oLtzOpstPQRmkdTjLfwgP604g9MoDbGmepxgD5cYQ/d4czA8pgtTLIjAStQhroIPqIyrXiBZpxgIQH/YCRWDWrBYbaCzP9MnqFMxx0GVWMI2ym4igGM54GDSsPesYa7FLzHIFaivXaUoAqjsYVr/M4ypT/nPO7oBhsx2SUmMYcpvH3i6IvCO1N3N3S5QKSIAAAAAElFTkSuQmCC) no-repeat; background-position: -1px 2px;margin-left:10px;" href="javascript:;">继续查询</a>\
                                            </span></div>', //tip展示的内容
                                    closeMode: 'click', //  关闭模式，可选项：quick、mouseout、click；默认quick点击空白区域关闭，mouseout鼠标滑出关闭，click点击关闭，针对的为el区域
                                    autoSize: true, // 内容自适应，默认为自适应
                                    showClose: false, // 是否显示关闭按钮，默认超过20个字符显示；true为显示，false为不显示
                                    id: "", // 组件id
                                }
                                new Tip(tipConfig);
                                $("#guideBox").parents('div.ui-dialog-content').css('padding', '0');
                                inintTipEvent();
                            }
                        }else{
            
                        }
                    });
                }
            }
        });
    };
    // 指引按钮事件
    var inintTipEvent = function () {
        $("#guideBox").on("click", "a", function () {
            var _this = $(this);
            var flag = _this.text();
            if (flag == '我知道了') {
                $("#guideBox").parents("div.tip").find('div.ui-dialog-close').trigger('click');
                guideCache("1");
                clickEventSen('我知道了');
            } else {
                clickEventSen('继续');
                guideCache("1");
                $("#rightInter").trigger('click');
            }
        })
    }
    var clickEventSen = function (params) {
        // 神策新增埋点-场景栏点击事件 NGKM2019-522 -begin
        Util.ajax.getJson(Constants.AJAXURL + "/sensorsdata/getSensorsdata?t=" + +new Date().getTime(), {}, function (data) {
            if (data.returnCode == 0 && data.object == "true") {
                if (sensorsdata) {
                    var clickSenceTime = getCurrentDate();
                    sensorsdata.track("senceClickEvent", {
                        clickSenceTime: clickSenceTime,
                        clickSenceName: '权益',
                        clickGuideName: params
                    });
                }
            }
        });
        // 神策新增埋点-场景栏点击事件 NGKM2019-522 -end
    }
    // 指引缓存
    var guideCache = function(guideFlag){
        var data = {
            guideFlag:guideFlag
        };
        Util.ajax.postJson(Constants.AJAXURL+"/openMode/getGuideFlag",data,function(json){
            if(json.returnCode == 0){

            }else{

            }
        });
    };
    var initEvent = function () {
        $("#goBackHomeImg").click(function () {
            //kmCommon.reloadTree();
        });
        $("#reloadScence").click(function () {
            initScence();
        });
        $("#goHomeImg").click(function (e) {
            //返回首页
            e.stopPropagation();
            var urlPathName = window.location.pathname;
            if (urlPathName.indexOf("kmSecondHome.html") > -1 || urlPathName.indexOf("kmSecondHomeNew.html") != -1) {
                return;
            }
            var openModel = KmUtil.getOpenMode();
            /*var storage = window.localStorage;
            var zjScope = storage.getItem("zjScope");
            if(zjScope){
                KmUtil.openTab("知识首页New",Constants.PREAJAXURL+Constants.ROOTURL+"/modules/knowledgeAppNew/kmSecondHome.html?openMode="+openModel+"&homeFrom=1&zjScope="+zjScope,{},{target:"_self",tabName:tabName});//
            }else{*/
            if (urlPathName.indexOf("kmSecondMoreNew.html") > -1) {
                KmUtil.openTab("知识库首页",Constants.PREAJAXURL+Constants.ROOTURL+"/modules/knowledgeAppNew/kmSecondHomeNew.html?openMode="+openModel+"&homeFrom=1",{},{target:"_self",tabName:tabName});//
            }else{
                KmUtil.openTab("知识首页New",Constants.PREAJAXURL+Constants.ROOTURL+"/modules/knowledgeAppNew/kmSecondHome.html?openMode="+openModel+"&homeFrom=1",{},{target:"_self",tabName:tabName});//
            }
            //}
        });

        // 判断IE浏览器版本
        function IEVersion() {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            if (userAgent.indexOf("Windows NT 5") != -1) {
                // console.log("这是XP系统");
            } else if (userAgent.indexOf("Windows NT 7") != -1 || userAgent.indexOf("Windows NT 6.1") != -1) {
                platform = 7;
            } else if (userAgent.indexOf("Windows NT 10") != -1) {
                platform = 10;
            }
            if (isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if (fIEVersion == 7) {
                    return 7;
                } else if (fIEVersion == 8) {
                    return 8;
                } else if (fIEVersion == 9) {
                    return 9;
                } else if (fIEVersion == 10) {
                    return 10;
                } else {
                    return 6;//IE版本<=7
                }
            } else if (isEdge) {
                return -2;//edge
            } else if (isIE11) {
                return 11; //IE11
            } else {
                return -1;//不是ie浏览器
            }
        }
        // 上传成功回调函数定义
        var uploadSuccessCallback = function(data,flag){
            var fileObj = data.result.object[0];
            var fileId = fileObj.fileId;
            var fileNm = fileObj.fileName;
            var url = Constants.AJAXURL + '/file/download?fileId=' + fileId + '&key=' + key;
            $(".search-pic-bar").css('background-image', "url('" + url + "')");
            $("#pic-search .files").empty();
            $("#pic-search-upload .files").empty();
            searchKnowledgeByPic(fileId,flag);
        }
        // // 以图搜文
        // // 打开弹出框
        setTimeout(function () {
            var urlPathName = window.location.pathname;
            if (urlPathName.indexOf("kmSecondHomeNew.html") > -1) {
                var filesUpload;
                var config = {
                    el: "#pic-search-upload",
                    dataType: 'json',
                    url: Constants.AJAXURL + '/file/upload'
                };
                if (IEVersion() == 8) {
                    config = {
                        el: "#pic-search",
                        dataType: 'json',
                        url: Constants.AJAXURL + '/file/upload'
                    };
                }
                
                filesUpload = new Upload(config);
                // #f3f8f9
                $("#pic-search .fileInput a").css('background-color','#f3f8f9');
                $(".wrap-inner #pic-search-upload .fileInput").hide();
                var overnum = false;
                var isJpgPng = true;
                filesUpload.on('add', function (e, data) {
                    console.log(data);
                    // debugger
                    // 文件数限制
                    if (data.originalFiles.length > 1) {
                        overnum = true;
                        data.files.splice(0, data.files.length);
                        data.abort();
                        return false;
                    }
                    // 文件类型限制
                    if (data.originalFiles[0]&&!(["image/jpeg","image/jpg","image/png"].includes(data.originalFiles[0].type))) {
                        isJpgPng = false;
                        data.abort();
                        return false;
                    }
                    // 获取base64覆盖
                    var addFile = data.originalFiles[0];
                    var newFileReader = new FileReader();
                    newFileReader.onload = function (e) {
                        console.log(e);
                        $('#dropZone > img').attr('src', e.target.result);
                        var newStyle = {
                            width: '100%', // 设置宽度为100像素
                            height: '100%',  // 设置高度为自动
                            'margin-top':'0px',
                            'object-fit':'contain',
                        };
                        $('#dropZone > img').css(newStyle);
                        $('#pic-search').hide();
                        $('.modal-footer').hide();
                        $('.lk-btn-wrap').show();
                    }
                    newFileReader.readAsDataURL(addFile);
                });
                //上传成功
                filesUpload.on('done', function (e, data) {
                    console.log(data);
                    // debugger
                    var returnCode;
                    if (data && data.result) {
                        returnCode = data.result.returnCode;
                    }
                    if (returnCode == "0") {
                        if (data && data.result && data.result.object && data.result.object[0]) {
                            if (!["image/jpeg","image/jpg","image/png"].includes(data.originalFiles[0].type)) {
                                return
                            }
                            global_upload_success_return_data = data
                            // uploadSuccessCallback(data)
                            // var fileObj = data.result.object[0];
                            // var fileId = fileObj.fileId;
                            // var fileNm = fileObj.fileName;
                            // var url = Constants.AJAXURL + '/file/download?fileId=' + fileId + '&key=' + key;
                            // $(".search-pic-bar").css('background-image', "url('" + url + "')");
                            // $("#pic-search .files").empty();
                            // $("#pic-search-upload .files").empty();
                            // searchKnowledgeByPic(fileId);
                            
                            // 上传图片新接口
                            // loadingConfig.content='智能提取文字中...'
                            // loadings = new Loading(loadingConfig);
                            // loadings.show();
                            if (global_imageSearchSwitchData==1) {
                            html_loading.show();
                            var xhr = new XMLHttpRequest();
                            xhr.open('POST', Constants.AJAXURL + '/questionResult/ocrImage')
                            xhr.onload = function () {
                                if (xhr.status === 200) {
                                    console.log(xhr);
                                    var res = JSON.parse(xhr.response)
                                    if (res.returnCode==0) {
                                        global_uploadImg_text = res.bean
                                        $('#kw').val(res.bean)
                                    }else{
                                        new Dialog({
                                            mode: 'tips',
                                            tipsType: 'error',
                                            content: res.returnMessage
                                        });
                                        $('#kw').val('')
                                        global_uploadImg_text = ''
                                    }
                                    // $('.search-inner a.btn').trigger('click')
                                } else {
                                    global_uploadImg_text = ''
                                    console.error('Request failed.  Returned status of ' + xhr.status);
                                }
                                // loadings&&loadings.hide();
                                // loadings&&loadings.destroy();
                                // loadings=null;
                                html_loading.hide();
                            };
                            var file = data.originalFiles[0];
                            var formData = new FormData();
                            formData.append('image', file);
                            xhr.send(formData);
                            }
                        }
                    } else {
                        new Dialog({
                            mode: 'tips',
                            tipsType: 'error',
                            content: data && data.result && data.result.returnMessage ? data.result.returnMessage : '上传失败'
                        });
                    }
                });
                //上传失败
                filesUpload.on('fail', function (e, data) {
                    $('.files').children('.sn-upload-fail').remove();
                    if (overnum) {
                        overnum = false;
                        new Dialog({
                            mode: 'tips',
                            tipsType: 'error',
                            delayRmove: 3,
                            content: '最多上传一个图片文件!'
                        });
                        return false;
                    }
                    if (!isJpgPng) {
                        isJpgPng = true;
                        new Dialog({
                            mode: 'tips',
                            tipsType: 'error',
                            delayRmove: 3,
                            content: '图片格式仅支持JPG、PNG格式!'
                        });
                        return false;
                    }
                    if (data.result == undefined) {
                        new Dialog({
                            mode: 'tips',
                            tipsType: 'error',
                            content: '请检查文件大小是否超过100M!'
                        });
                    } else {
                        new Dialog({
                            mode: 'tips',
                            tipsType: 'error',
                            content: data && data.result && data.result.returnMessage ? data.result.returnMessage : '上传失败'
                        });
                    }
                });
                filesUpload.on('remove',function(e,data){
                    //e新增自定义remove方法，可根据服务端文件处理结果删除文件列表中的当前行
                    e.remove();
                    console.log('上传的文件被删除！');
                    // 还原
                    $('#dropZone > img').attr('src', '../../assets/img/search-pic/upload@2x.png');
                    var newStyle = {
                        width: '70px', // 设置宽度为100像素
                        height:'auto',
                        'margin-top':'30px',
                        'object-fit':'contain',
                    };
                    $('#dropZone > img').css(newStyle);
                    $('#pic-search').show();
                    $('.modal-footer').show();
                    $('.lk-btn-wrap').hide();
                })
                //提交上传数据
                filesUpload.on('submit', function (e, data) {
                    data.formData = { key: key }; //formData的数据会和二进制数据一起提交到服务端
                });
                if ($('.wrap-inner .search-pic-bar').length > 0) {
                    $('.wrap-inner .search-pic-bar').on('click', function () {
                        $('.wrap-inner .modal-overlay').css('display', 'block');
                    });
                    // 关闭弹出框
                    $('.wrap-inner .modal-overlay').on('click', function (e) {
                        if ($(e.target).hasClass('modal-overlay')) {
                            $('.wrap-inner .modal-overlay').css('display', 'none');
                        }
                    });
                    $('.wrap-inner .close-upload').on('click', function () {
                        // $("#pic-search-upload .files").empty();
                        // $('.wrap-inner .modal-overlay').css('display', 'none');
                        $('#upload-img-cancel').trigger("click");
                    });
                    $('.wrap-inner #dropZone').on('click', function () {
                        if ($("#pic-search-upload .files").find('.template-upload').length > 0) {
                            new Dialog({
                                mode: 'tips',
                                delayRmove: 3,
                                content: '最多上传一个图片文件!'
                            });
                            return;
                        }
                        if ($("#pic-search-upload .fileInput input").length > 0) {
                            $("#pic-search-upload .fileInput input")[0].click();
                        }
                    });
                    $('#upload-img-ok').click(function(event){
                        // 图片开始搜索了-还原
                        // uploadSuccessCallback(global_upload_success_return_data)
                        // 还原
                        $('#dropZone > img').attr('src', '../../assets/img/search-pic/upload@2x.png');
                        var newStyle = {
                            width: '70px', // 设置宽度为100像素
                            height:'auto',
                            'margin-top':'30px',
                            'object-fit':'contain',
                        };
                        $('#dropZone > img').css(newStyle);
                        $('#pic-search').show();
                        $('.modal-footer').show();
                        $('.lk-btn-wrap').hide();
                        uploadSuccessCallback(global_upload_success_return_data,global_imageSearchSwitchData)
                        // Util.ajax.ajax({
                        //     type:"GET",//请求方法
                        //     async:true,//同步
                        //     url:Constants.AJAXURL+'/questionResult/imageSearchSwitch'+'?v='+new Date().getTime(),//路径
                        //     success:function(datas){
                        //        if (datas.returnCode=='0') {
                        //             uploadSuccessCallback(global_upload_success_return_data,datas.object)
                        //             if (datas.object==1) {
                        //                 // 新以图搜索
                        //                 $('.search-inner a.btn').trigger('click')
                        //             }else{
                        //                 // 老的以图搜索-什么都不做
                        //             }
                        //        }else{
                        //             new Dialog({
                        //                 mode: 'tips',
                        //                 tipsType: 'error',
                        //                 content: res.returnMessage
                        //             });
                        //        }
                        //     },
                        //     error:function(res){
                        //         console.error(res);
                        //         throw new Error(res);
                        //         return;
                        //     }
                        // });
                        // $('.search-inner a.btn').trigger('click')
                    })
                    $('#upload-img-cancel').click(function(event){
                        // $('.wrap-inner .close-upload').trigger("click");
                        $("#pic-search-upload .files").empty();
                        $('.wrap-inner .modal-overlay').css('display', 'none');
                        // 还原
                        $('#dropZone > img').attr('src', '../../assets/img/search-pic/upload@2x.png');
                        var newStyle = {
                            width: '70px', // 设置宽度为100像素
                            height:'auto',
                            'margin-top':'30px',
                            'object-fit':'contain',
                        };
                        $('#dropZone > img').css(newStyle);
                        $('#pic-search').show();
                        $('.modal-footer').show();
                        $('.lk-btn-wrap').hide();
                    })
                }
            }
        }, 10)
        

        var dropZone = $('.wrap-inner #dropZone');
        // 阻止浏览器默认打开拖放操作
        dropZone.on('dragenter', function(event) {
          event.preventDefault();
        });
      
        dropZone.on('dragover', function(event) {
          event.preventDefault();
        });

    };
        function searchKnowledgeByPic(fileId,flag) {
            var selectedCity = $("#selectedCity");
            var cname = selectedCity.attr("cname");
            var scope = selectedCity.attr("scope");
            var sid = selectedCity.attr("sid");
            var cid = selectedCity.attr("cid");
            var leve = selectedCity.attr("leve");

            var urlPathName = window.location.pathname;
            var url = Constants.PREAJAXURL + Constants.ROOTURL + "/modules/knowledgeAppNew/secKmSearchListForPic.html?" + "fileId=" + encodeURIComponent(fileId) + "&scope=" + scope + "&cname=" + encodeURIComponent(cname) + "&sid=" + sid + "&cid=" + cid + "&leve=" + leve + "&searchType=" + '' + "&keywordType=" + '' + "&searchTitleType=" + '' + "&clickTypeNm=" + '';
            var thisOpenType;
            if (urlPathName.indexOf("kmSecondHome.html") > -1) {
                thisOpenType = { target: "_self", tabName: "知识首页New" };
            }
            if (flag==1) {
                // 新以图搜索
                $('.search-inner a.btn').trigger('click');
            }else {
                // 老以图搜索
                KmUtil.openTab("知识库-以图搜索列表", url, {}, thisOpenType);
            }
            // $(".search-pic-bar").removeAttr('style');
            // $(".search-pic-bar").attr('style','left:88px;right:unset;');
            // $('.wrap-inner .close-upload').trigger("click");
            $('#upload-img-cancel').trigger("click");
        }
    // 序列化url查询参数
    function searchUrl(url) {
        var result = {};
        var map = url.split("&");
        for(var i = 0, len = map.length; i < len; i++){
            result[map[i].split("=")[0]] = map[i].split("=")[1];
        }

        return result;
    }

    //业务树点击直接触发页面跳转
    var logictreeEvent = function(kmCommonCfg){
        $('#logictree').on('click',function(){
            var openType = {target:"_self",tabName:kmCommonCfg.tabName};
            KmUtil.openTab("知识列表",
                Constants.PREAJAXURL+Constants.ROOTURL+"/modules/knowledgeAppNew/kmKnowledgeSecondListNew.html",
                {},openType);

            // 神策新增埋点-场景栏点击事件 NGKM2019-522 -begin
            Util.ajax.getJson(Constants.AJAXURL + "/sensorsdata/getSensorsdata?t=" + +new Date().getTime(), {}, function (data) {
                if (data.returnCode == 0 && data.object == "true") {
                    if (sensorsdata) {
                        var clickSenceTime = getCurrentDate();
                        sensorsdata.track("senceClickEvent", {
                            clickSenceTime: clickSenceTime,
                            clickSenceName: '业务树'
                        });
                    }
                }
            });
            // 神策新增埋点-场景栏点击事件 NGKM2019-522 -end

        });
    }

    var kmMainNav = function(config){
        config.ele.append($(tpl));
        var kmCommonCfg = {};
        if(config.selectNode){
            kmCommonCfg.selectNode =config.selectNode;
        }
        if(config.tabName){
            tabName =config.tabName;
            kmCommonCfg.tabName = config.tabName;
        }

        // 以图搜文
        if (config.tabName == '知识库-以图搜文搜索列表' || config.tabName == '知识首页New') {
            // setTimeout(function () {
            //     $('.wrap-inner .search-pic-bar').show();
            // }, 10)
            // 以图搜文鉴权
            Util.ajax.getJson(Constants.AJAXURL + "/openMode/getSearchKlgByImgFlage?t=" + +new Date().getTime(), {}, function (data) {
                if (data.object == "1") {
                    $('.wrap-inner .search-pic-bar').show();
                    $('#kw').css({
                        'padding-right':'40px'
                    })
                    $('#topClear').css({
                        'transform': 'translateX(-33px)'
                    })
                    Util.ajax.ajax({
                        type:"GET",//请求方法
                        async:true,//同步
                        url:Constants.AJAXURL+'/questionResult/imageSearchSwitch'+'?v='+new Date().getTime(),//路径
                        success:function(datas){
                           if (datas.returnCode=='0') {
                            global_imageSearchSwitchData = datas.object
                           }else{
                                global_imageSearchSwitchData = ''
                                new Dialog({
                                    mode: 'tips',
                                    tipsType: 'error',
                                    content: res.returnMessage
                                });
                           }
                        },
                        error:function(res){
                            global_imageSearchSwitchData = ''
                            console.error(res);
                            throw new Error(res);
                            return;
                        }
                    });
                }else{
                    $('.wrap-inner .search-pic-bar').hide();
                    $('#kw').css({
                        'padding-right':'0'
                    })
                    $('#topClear').css({
                        'transform': 'translateX(0px)'
                    })
                }
            });
        }
        
        initScence();
        //kmCommon = new KmCommon(kmCommonCfg);
        logictreeEvent(kmCommonCfg);
        initEvent();
        var urlPathName = window.location.pathname;

        if (urlPathName.indexOf("secKmSearchList.html") > -1) {

        } else {
            //初始化搜索框
            var $kmSearchBar = $('.km-header .km-search');
            var _kmSearchBar = new KmSearchBar($('body'));
            $kmSearchBar.empty().append(_kmSearchBar.$el);
            _kmSearchBar.initKmSearchBar("open");
            //实现搜索框功能逻辑
            _kmSearchBar.on('openKmSearchList',function(searchParm){//Constants.PREAJAXURL+

                //保存搜索记录到日志表
                // var srcTypeCd = "2";
                if (config.type!=""&&config.type!=undefined){
                    // srcTypeCd =  config.type;
                }
                if(searchParm && searchParm.kw && searchParm.kw.length > Constants.KEYWORD_MAX_SIZE){
                    if (Constants.judgeSpecialCharacter(kw)) {
                        new MyAlert({
                            type: 'error',
                            text: "请输入有效关键词！",
                            falseShow: false,
                            trueName: "知道了"
                        });
                        return;
                    }
                    searchParm.kw = searchParm.kw.substr(0,Constants.KEYWORD_MAX_SIZE);
                }
                if(config.search){
                    config.search(searchParm);
                    return;
                }
                searchParm.kw = Constants.kmEncodeURl(searchParm.kw);
                searchParm.kw = encodeURIComponent(searchParm.kw);

                searchParm.name = Constants.kmEncodeURl(searchParm.name);
                searchParm.name = encodeURIComponent(searchParm.name);
                // searchParm.searchTitleType = $("#searchTitleType").val();
                searchParm.searchTitleType = $('#searchTitleType').find("li.active").attr('value');
                // KmUtil.openTab(searchParm.kw+" -搜索结果","/src/modules/knowledgeAppNew/secKmSearchList.html",{kw:searchParm.kw,scope:searchParm.scope,cname:searchParm.name,sid:searchParm.sid,cid:searchParm.cid,leve:searchParm.leve,searchType:searchParm.searchType});
                var url=Constants.PREAJAXURL+Constants.ROOTURL+"/modules/knowledgeAppNew/secKmSearchList.html?"+"kw="+encodeURIComponent(searchParm.kw)+"&scope="+searchParm.scope+"&cname="+encodeURIComponent(searchParm.name)+"&sid="+searchParm.sid+"&cid="+searchParm.cid+"&leve="+searchParm.leve+"&searchType="+searchParm.searchType+"&keywordType="+searchParm.keywordType + "&searchTitleType=" + searchParm.searchTitleType + "&clickTypeNm=" + searchParm.clickTypeNm;
                var thisOpenType;
                if (urlPathName.indexOf("kmSecondHome.html") > -1) {
                    thisOpenType = {target:"_self",tabName:"知识首页New"};
                }
                KmUtil.openTab("知识库-搜索列表",url,{},thisOpenType);
            });

            // 以图搜文
            // _kmSearchBar.on('openKmSearchByPic',function(searchParm){
            //     var url=Constants.PREAJAXURL+Constants.ROOTURL+"/modules/knowledgeAppNew/secKmSearchList.html?"+"kw="+searchParm.kw+"&scope="+searchParm.scope+"&cname="+searchParm.name+"&sid="+searchParm.sid+"&cid="+searchParm.cid+"&leve="+searchParm.leve+"&searchType="+searchParm.searchType+"&keywordType="+searchParm.keywordType + "&searchTitleType=" + searchParm.searchTitleType;
            //     var thisOpenType;
            //     if (urlPathName.indexOf("kmSecondHome.html") > -1) {
            //         thisOpenType = {target:"_self",tabName:"知识首页New"};
            //     }
            //     KmUtil.openTab("知识库-搜索列表",url,{},thisOpenType);
            // })

        }
        if(urlPathName.indexOf("kmSecondHome.html") > -1){
            $("#goBackHomeImg").attr("style","cursor:default;");
        }

        // 前端埋点神策 NGKM2019-522 -begin
        if(KmUtil.getOriginType("http://") || KmUtil.getOriginType("https://")){
            Util.ajax.getJson(Constants.AJAXURL + "/sensorsdata/getSensorsdata?t=" + + new Date().getTime(),{},function (data) {
                if(data.returnCode == 0 && data.object == "true"){
                    sensorsDataInit();
                }
            });
        }
        // 前端埋点神策 NGKM2019-522 -end

        // 神策新增埋点 NGKM2019-522 -begin
        getCurrentDate();
        // 神策新增埋点 NGKM2019-522 -end
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

        $.extend(kmMainNav.prototype, Util.eventTarget.prototype,{
            updateKeywordClick:updateKeywordClick
        });

    return kmMainNav;
})