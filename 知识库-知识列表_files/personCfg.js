/**
 * add by liuhenghui
 * 20180427
 */
define([ 'Util','js/constants/constants','dialog'],
    function(Util,Constants,Dialog){
    // var scene_obj_type='NGKM.SCENE.SEARCH.TYPE'; //场景
    // var default_obj_type='NGKM.URTFS.SEARCH.TYPE';//页签
    // var searchtitle_obj_type='NGKM.SRCHTITLE.SEARCH.TYPE';//搜索范围
    // var pplword_obj_type="NGKM.PPLWORD.SEARCH.TYPE";//搜索分词
    // var highlight_obj_type="NGKM.HIGHLIGHT.SEARCH.TYPE";//结果高亮
    //var sceneHtml = '';
    var defaultHtml ='';
    var searchtitleHtml='';
    var pplwordHtml = '';
    //var lightHtml = '';
    var numberHtml = '';
    var btListColumnHtml = '';
    var searchKnwlgHtml = "";
    var _searchCfg;
    //掉接口查询展示场景
    /*var initScence = function () {
        $("#reloadScence").click();
    };*/
    /**
     * 渲染个性化设置
     */
    var personalSet = function(callbk) {
        var covData = {
            url:Constants.AJAXURL+'/kmConfig/getDataByCodetype?v=' + new Date().getTime(),
            async: true,
            success:function(data){
                if(data && data.object ){
                    /*if(data.object.scene != undefined && data.object.scene.length != 0){
                        sceneFunction(data.object.scene);
                    }*/
                    if(data.object.urts != undefined && data.object.urts.length != 0){
                        defaultFunction(data.object.urts);
                    }
                    if(data.object.number != undefined && data.object.number.length != 0){
                        defaultNumberFunction(data.object.number);
                    }
                    _searchCfg = data.object.searchCfg;
                    if (data.object.sechtitle != undefined && data.object.sechtitle.length != 0 && _searchCfg != '0') {//如果没有配置优化搜索，则默认展示该配置选项
                        sachTitleFunction(data.object.sechtitle);
                    }
                    if (data.object.word != undefined && data.object.word.length != 0 && _searchCfg != '0') {//如果没有配置优化搜索，则默认展示该配置选项
                        pplwordFunction(data.object.word);
                    }
                    if(data.object.btListColumn != undefined && data.object.btListColumn.length != 0){
                        btListColumnFunction(data.object.btListColumn);
                    }
                    if(data.object.searchKnwlgType && data.object.searchKnwlgType.length > 0){
                        searchKnwlgConfig(data.object.searchKnwlgType);
                    }
                }
                typeFunction(callbk);
            },
            dataType:'json', //返回值的数据类型
            timeout:30000,  //超时时间
            type:'get'  //请求类型
        };
        Util.ajax.ajax(covData);
    }

    /**
     * 个性化设置点击保存
     * @constructor
     */
    var PersonalOk = function() {
        $('#okBtn').on('click', function(){
            $("#okBtn").off('click');
            //var sceneConfigVal = [];
            var urtsConfigVal = [];
            var defaultNumberVal =[];//默认列表条数
            //var highlightVal =[];
            var btListColumnVal = [];
            $("input[name='urts']:checked").each(function(){
                urtsConfigVal.push(this.value);
            });
            $("input[name='number']:checked").each(function(){
                defaultNumberVal.push(this.value);
            });
            $("input[name='btListColumn']:checked").each(function(){
                btListColumnVal.push(this.value);
            });
            urtsConfigVal = urtsConfigVal.join(",");
            defaultNumberVal = defaultNumberVal.join(",");
            btListColumnVal = btListColumnVal.join(",");
            var configCodeList = 'urts,number,btListColumn,searchKnwlgType';
            var condition = {
                urtsConfigVal : urtsConfigVal,
                defaultNumberVal:defaultNumberVal,
                btListColumnVal:btListColumnVal,
                configCodeList : configCodeList,
                searchKnwlgType : $("#searchKnwlgType").find("input:checked").val()
            };
            if (_searchCfg != '0') {//如果没有配置优化搜索，则默认展示该配置选项
                var sachtitleVal = [];
                var wordtitleVal = [];
                $("input[name='sechtitle']:checked").each(function () {
                    sachtitleVal.push(this.value);
                });
                $("input[name='wordTitle']:checked").each(function () {
                    wordtitleVal.push(this.value);
                });
                sachtitleVal = sachtitleVal.join(",");
                wordtitleVal = wordtitleVal.join(",");
                configCodeList = configCodeList + ',title,word';
                condition.sachtitleVal = sachtitleVal;
                condition.wordtitleVal = wordtitleVal;
                condition.configCodeList = configCodeList;
            }
            Util.ajax.postJson(Constants.AJAXURL+'/personal/saveTKmPersonalCfg',condition, function(json, status){
                if (status) {
                    new Dialog({
                        mode: 'tips',
                        delayRmove: 3,
                        content:'保存成功!'
                    });
                    //initScence();
                    if (_searchCfg == '0') {//如果配置优化搜索，则默认为'全文'搜索
                        //如果未配置简化搜索，则展示全文/类型选择项
                        var $searchTitleType = $('#searchTitleType');
                        $searchTitleType.parent().parent().addClass('km-search-no-select');
                    } else {
                        getSrchTitleCfg();
                    }

                } else {
                    new Dialog({
                        mode: 'tips',
                        delayRmove: 3,
                        content:'保存失败!'
                    });;
                }
            });
            $(".km-scene-setting.show").removeClass('show');
            $(".km-scene-setting").hide();
        });
    }
    //搜索标题配置初始化
    function getSrchTitleCfg() {
        Util.ajax.ajax({
            type:"GET",
            async:true,
            url:Constants.AJAXURL+'/KmBusTree/getTitleState?v='+new Date().getTime(),success:function(datas){
                if("1"==datas.bean.configVal){
                    $('#searchTitleType').val("1");
                }else if("2"==datas.bean.configVal){
                    $('#searchTitleType').val("2");
                }

                if(datas.bean.configVal != "4"){
                    //取消搜索结果列表的选中状态
                    $("#new-search-btn").removeClass("lk-b-active").addClass("lk-b");
                }
            },error:function(datas){ return;}
        });
    }
    var getcovData = function(data){
        var result = [];
        for(var i=0;i<data.length;i++){
            if(data[i].value != null && data[i].name != null){
                var checkoxJson={};
                checkoxJson.label=data[i].name;
                checkoxJson.value=data[i].value;
                checkoxJson.click =function(e,itemData){ };
                result[i]=checkoxJson;
            }
        }
        return result;
    };
    var typeFunction = function(callbk){
        var html = '<div class="km-scene-setting show" id="sceneSetting">'+
            '<div class="scene-setting-inner">'+
            //'<div class="setting-list new-scene-set" id="scene"><h3>场景</h3>'+ sceneHtml +
            '<div class="setting-list new-scene-set" id="urtsTabs"><h3>列表默认状态</h3>'+ defaultHtml +
            '</div> <div class="setting-list new-scene-set" id="number"><h3>默认列表条数</h3>' + numberHtml;
        if (_searchCfg != '0') {//如果没有配置优化搜索，则默认展示该配置选项
            html = html + '</div> <div class="setting-list new-scene-set" id="sachTitle"><h3>默认搜索类型</h3>' + searchtitleHtml +
                '</div> <div class="setting-list new-scene-set" id="wordTitle"><h3>默认搜索分词</h3>' + pplwordHtml;
        }

        if(searchKnwlgHtml){
            html += '</div><div class="setting-list new-scene-set" id="searchKnwlgType"><h3>搜索结果筛选项</h3>'+ searchKnwlgHtml;
        }

        html = html +
            '</div><div class="setting-list new-scene-set" id="btListColumn"><h3>业务树列表布局</h3>'+ btListColumnHtml;

        html += '</div><div class="btm-btns"> <a href="javascript:void(0)" class="km-btn km-btn-green" id="okBtn">保存</a>'+
        '<a href="javascript:void(0)" class="km-btn" id="cancelBtn" >取消</a></div> </div></div>';

        $("#sceneSetting").remove();
        $('.user-handle').append(html);
        $("#sceneSetting").click(function (e) {
            e.stopPropagation();
        });
        Util.ajax.getJson(Constants.AJAXURL+'/personal/getTKmPersonalCfgList?v=' + new Date().getTime(),{}, function(json, status){
            if (status) {
                var data = json.beans;
                if(data.length > 0) {
                    checkedUrts(data);
                    checkedListNumber(data);
                    if (_searchCfg != '0') {//如果没有配置优化搜索，则默认展示该配置选项
                        checkedSachTitle(data);
                        checkedWord(data);
                    }
                    checkedtListColumn(data);
                    checkSearchKnwlgType(data);
                } else {
                    checkedSceneDefault();
                }
            }
            if(callbk){
                callbk();
            }
        });
    }
    //场景显示
    /*var sceneFunction = function(data) {
        var htmlArray = getcovData(data);
        var  html = '';
        for (var i = 0 ; i < htmlArray.length; i++) {
            html += '<label for="aa1" class="lin-block"><input type="checkbox" name="sceneType" value="'+htmlArray[i].value+'">'+htmlArray[i].label +'</label>'
        }
        sceneHtml = html;
    }*/

    //默认场景选项
    var checkedSceneDefault = function() {
        var sceneArray = $(".km-scene-setting").find('input[name="sceneType"]');
        for (var k = 0; k < sceneArray.length; k++){
            $(sceneArray[k]).attr("checked", true);
        }
    }

    //选定所保存的场景选项
   /* var checkedScene = function(data) {
        if (data[0]) {
            var valueArray = [];
            var sceneArray = $(".km-scene-setting").find('input[name="sceneType"]');
            valueArray = data[0].configVal.split(",");
            if (data[0].configCode == "scene") {
                for (var j =0; j < valueArray.length; j++) {
                    for (var k = 0; k < sceneArray.length; k++){
                        if (sceneArray[k].value == valueArray[j]) {
                            $(sceneArray[k]).attr("checked", true);
                        }
                    }
                }
            }
        } else {
            checkedSceneDefault();
        }
    }*/

    //选定所保存的页签选项
    var checkedUrts = function(data) {
        if (data[0]) {
            var valueArray = [];
            var sceneArray = $(".km-scene-setting").find('input[name="urts"]');
            valueArray = data[0].configVal.split(",");
            if (data[0].configCode == "urts") {
                for (var j =0; j < valueArray.length; j++) {
                    for (var k = 0; k < sceneArray.length; k++){
                        if (sceneArray[k].value == valueArray[j]) {
                            $(sceneArray[k]).attr("checked", true);
                        }
                    }
                }
            }
        }
    }
     //默认条数配置
        var checkedListNumber = function (data) {
            var valueArray = [];
            var sceneArray = $(".km-scene-setting").find('input[name="number"]');
            if(data[3] != "" && data[3] != null){
                valueArray = data[3].configVal.split(",");
                if (data[3].configCode == "number") {
                    for (var j =0; j < valueArray.length; j++) {
                        for (var k = 0; k < sceneArray.length; k++){
                            if (sceneArray[k].value == valueArray[j]) {
                                $(sceneArray[k]).attr("checked", true);
                            }
                        }
                    }
                }
            }
        }
    //搜索范围配置
    var checkedSachTitle = function(data) {
        if (data[1]) {
            var valueArray = [];
            var sceneArray = $(".km-scene-setting").find('input[name="sechtitle"]');
            valueArray = data[1].configVal.split(",");
            if (data[1].configCode == "title") {
                for (var j =0; j < valueArray.length; j++) {
                    for (var k = 0; k < sceneArray.length; k++){
                        if (sceneArray[k].value == valueArray[j]) {
                            $(sceneArray[k]).attr("checked", true);
                        }
                    }
                }
            }
        }
    }
    //搜索分词配置
    var checkedWord = function(data) {
        if (data[2]) {
            var valueArray = [];
            var sceneArray = $(".km-scene-setting").find('input[name="wordTitle"]');
            valueArray = data[2].configVal.split(",");
            if (data[2].configCode == "word") {
                for (var j =0; j < valueArray.length; j++) {
                    for (var k = 0; k < sceneArray.length; k++){
                        if (sceneArray[k].value == valueArray[j]) {
                            $(sceneArray[k]).attr("checked", true);
                        }
                    }
                }
            }
        }
    }
    /*var checkedLight = function (data) {
        var valueArray = [];
        var sceneArray = $(".km-scene-setting").find('input[name="lightTitle"]');
        if(data[4] != "" && data[4] != null){
            valueArray = data[4].configVal.split(",");
            if (data[4].configCode == "light") {
                for (var j =0; j < valueArray.length; j++) {
                    for (var k = 0; k < sceneArray.length; k++){
                        if (sceneArray[k].value == valueArray[j]) {
                            $(sceneArray[k]).attr("checked", true);
                        }
                    }
                }
            }
        }
    }*/

    //业务树个人配置加载
    var checkedtListColumn = function(data){
        var valueArray = [];
        var sceneArray = $(".km-scene-setting").find('input[name="btListColumn"]');
        for(var i = 0; i < data.length; i ++){
            if(data[i].configCode == "btListColumn"){
                valueArray = data[i].configVal.split(",");
                for (var j =0; j < valueArray.length; j++) {
                    for (var k = 0; k < sceneArray.length; k++){
                        if (sceneArray[k].value == valueArray[j]) {
                            $(sceneArray[k]).attr("checked", true);
                        }
                    }
                }
            }
        }
    };

    var checkSearchKnwlgType = function(data){
        for(var i = 0; i < data.length; i ++){
            if(data[i].configCode == "searchKnwlgType"){
                $("#searchKnwlgType").find("input[value=" + data[i].configVal + "]").attr("checked", true);
            }
        }
    };

    //默认页签显示
    var defaultFunction = function(data) {
        var  html = '';
        var htmlArray = getcovData(data);
        for (var i = 0 ; i < htmlArray.length; i++) {
            var html2;
            if (htmlArray[i].label == '正常+未上线') {
                html2 = '<label for="aa1"><input type="radio" checked name="urts" value="'+htmlArray[i].value+'">'+htmlArray[i].label +'</label>';
            }else{
                html2 = '<label for="aa1"><input type="radio" name="urts" value="'+htmlArray[i].value+'">'+htmlArray[i].label +'</label>';
            }
            html += html2;
        }
        defaultHtml = html;
    }
    //默认搜索title设置
    var sachTitleFunction = function(data) {
        var  html = '';
        var htmlArray = getcovData(data);
        for (var i = 0 ; i < htmlArray.length; i++) {
            var html2;
            if (htmlArray[i].label == '全文') {
                html2 = '<label for="aa1"><input type="radio" checked name="sechtitle" value="'+htmlArray[i].value+'">'+htmlArray[i].label +'</label>';
            }else{
                html2 = '<label for="aa1"><input type="radio" name="sechtitle" value="'+htmlArray[i].value+'">'+htmlArray[i].label +'</label>';
            }
            html += html2;
        }
        searchtitleHtml = html;
    };
    //默认列表条数显示
        var defaultNumberFunction = function(data) {
            var  html = '';
            var htmlArray = getcovData(data);
            for (var i = 0 ; i < htmlArray.length; i++) {
                var html2;
                if (htmlArray[i].label == '10') {
                    html2 = '<label for="aa1"><input type="radio" checked name="number" value="'+htmlArray[i].value+'">'+htmlArray[i].label +'</label>';
                }else if (htmlArray[i].label == '20') {
                    html2 = '<label for="aa1"><input type="radio" name="number" value="'+htmlArray[i].value+'">'+htmlArray[i].label +'</label>';
                }else if (htmlArray[i].label == '30') {
                    html2 = '<label for="aa1"><input type="radio" name="number" value="'+htmlArray[i].value+'">'+htmlArray[i].label +'</label>';
                }else if (htmlArray[i].label == '50') {
                    html2 = '<label for="aa1"><input type="radio" name="number" value="'+htmlArray[i].value+'">'+htmlArray[i].label +'</label>';
                }else {
                    html2 = '<label for="aa1"><input type="radio" name="number" value="'+htmlArray[i].value+'">'+htmlArray[i].label +'</label>';
                }
                html += html2;
            }
            numberHtml = html;
        }
    //默认搜索分词设置
    var pplwordFunction = function(data) {
        var  html = '';
        var htmlArray = getcovData(data);
        for (var i = 0 ; i < htmlArray.length; i++) {
            var html2;
            if (htmlArray[i].label == '最大分词') {
                html2 = '<label for="aa1"><input type="radio" checked name="wordTitle" value="'+htmlArray[i].value+'">'+htmlArray[i].label +'</label>';
            }else{
                html2 = '<label for="aa1"><input type="radio" name="wordTitle" value="'+htmlArray[i].value+'">'+htmlArray[i].label +'</label>';
            }
            html += html2;
        }
        pplwordHtml = html;
    };
    //检索结果高亮配置
    /*var highlightFunction = function(data) {
        var  html = '';
        var htmlArray = getcovData(data);
        for (var i = 0 ; i < htmlArray.length; i++) {
            var html2;
            if (htmlArray[i].label == '自动高亮') {
                html2 = '<label for="aa1"><input type="radio" checked name="lightTitle" value="'+htmlArray[i].value+'">'+htmlArray[i].label +'</label>';
            }else{
                html2 = '<label for="aa1"><input type="radio" name="lightTitle" value="'+htmlArray[i].value+'">'+htmlArray[i].label +'</label>';
            }
            html += html2;
        }
        lightHtml = html;
    };*/
    //业务树知识列表布局配置
    var btListColumnFunction = function(data) {
        var  html = '';
        var htmlArray = getcovData(data);
        for (var i = 0 ; i < htmlArray.length; i++) {
            var html2;
            if (htmlArray[i].label == '单列') {
                html2 = '<label for="aa1"><input type="radio" checked name="btListColumn" value="'+htmlArray[i].value+'">'+htmlArray[i].label +'</label>';
            }else{
                html2 = '<label for="aa1"><input type="radio" name="btListColumn" value="'+htmlArray[i].value+'">'+htmlArray[i].label +'</label>';
            }
            html += html2;
        }
        btListColumnHtml = html;
    };

    var searchKnwlgConfig = function(data){
        var html = "";
        var htmlArray = getcovData(data);
        for(var i = 0; i < htmlArray.length; i++){
            html += "<label></label><input type='radio'" + (htmlArray[i].label == '主业务' ? "checked" : "")
                + " name='searchKnwlgType' value='" + htmlArray[i].value + "'>" + htmlArray[i].label;
        }
        searchKnwlgHtml = html;
    };

    return {
        initFun:function () {
            personalSet(function(){
                //保存按钮
                PersonalOk();
                $('#cancelBtn').on('click', function(){
                    $("#cancelBtn").off('click');
                    $(".km-scene-setting.show").removeClass('show');
                    $(".km-scene-setting").hide();
                });
            });
        }
    };
});