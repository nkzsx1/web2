/*
*   @author:zhangbz
*   @date：2016-01-13
*   @desc: 按钮权限校验
        模块类型：函数
        权限模块实现思路：
            传入一个jquery类型的dom对象，程序会遍历该容器内所有属性为mo的元素，取出mo、id属性，
            并将它们传到服务端进行验证，并根据验证结果来显示这些元素
        参数：
            $el  要设定权限的按钮所属容器
*/
define(['jquery','Util'],function($,Util) {
    //$el 为根dom，下面所有的遍历将控制在这个范围内
    //比如 $el内有按钮元素 <input type="button" value="button1" id="btn1" mo="998" /> 其中id和mo属性必须存在
    var btnAuthority = function($el,callbk,klgId, searchCb){
        // svMap.add('btnAuthority', '../../../data/btnAuthority.json','')
        var $ = jQuery;
        //获取带有mo属性的按钮
        var mos = $el.find('[mo]');
        if (mos.length){
            var params = [];
            mos.each(function(){
                var _this = $(this);
                var tempVal = {
                    'mo':_this.attr('mo'),
                    'btnId':_this.attr('id')
                };
                params.push(tempVal);
            })
            if (params.length) {
                params = JSON.stringify(params);
                if (window.localStorage) {
                    var authData = localStorage.getItem('auth_old_data');
                    if (authData) {
                        $.each(JSON.parse(params), function (index, item) {
                            var btn_param = item['mo'] + item['btnId'];
                            var mo_flag = localStorage.getItem(btn_param);
                            if (mo_flag) {
                                if (mo_flag == '1') {
                                    if(item['mo']=="000245005013"&&klgId){
                                        if("none"==$("#messageSendTop").css("display")){
                                            $('#messageSendTop', $el).show();
                                        }
                                    }else if(item['mo']=="000245005014"&&klgId){
                                        if("none"==$("#messageSendTopNew").css("display")&&"none"==$("#messageSendTop").css("display")){
                                            //查询知识是否是国家和地址的
                                            getKnwlgType(klgId,item['btnId'], $el);
                                        }
                                    }else {
                                        if(item['mo']=="000245011001001" || item['mo']=="000245011002001"){
                                            $('#' + item['btnId'], $el).css("display","inline-block")
                                        }else {
                                            $('#' + item['btnId'], $el).show();
                                        }

                                    }
                                } else {
                                    $('#' + item['btnId'], $el).hide();
                                }
                                searchCb && searchCb();
                            } else {
                                Util.ajax.getJson('/ngkm/user/getBtnAuth', { 'datas': params }, function (json, status) {
                                    if (status) {
                                        for (var i in json.beans) {
                                            //mo：1：有权限，0：无权限
                                            var bean = json.beans[i];
                                            if (bean) {
                                                if (bean['flag'] == '1') {
                                                    if(bean['btnId']=="messageSendTopNew"&&klgId){
                                                        if("none"==$("#messageSendTop").css("display")){
                                                            $('#messageSendTop', $el).show();
                                                        }
                                                    }else if(bean['btnId']=="messageSendTopRenew"&&klgId){
                                                        //查询知识是否是国家和地址的
                                                        getKnwlgType(klgId,bean['btnId'], $el);
                                                    } else{
                                                        if(bean['btnId']=="forcedUnlockBtn" || bean['btnId']=="forcedUnlockCheckInfoByIds"){
                                                            $('#' + bean['btnId'], $el).css("display","inline-block")
                                                        }else {
                                                            $('#' + bean['btnId'], $el).show();
                                                        }

                                                    }
                                                } else {
                                                    $('#' + bean['btnId'], $el).hide();
                                                }
                                            }
                                            var p = JSON.parse(params);
                                            var moKey = p[i]['mo'];
                                            var btnIdKey = p[i]['btnId'];
                                            // 本地存储权限数据
                                            var old_auth_data = localStorage.getItem('auth_old_data');
                                            if (old_auth_data) {
                                                localStorage.setItem('auth_old_data', old_auth_data + ',' + moKey + btnIdKey);
                                            } else {
                                                localStorage.setItem('auth_old_data', moKey + btnIdKey);
                                            }
                                            localStorage.setItem(moKey + btnIdKey, bean['flag']);//
                                        }
                                    }
                                    searchCb && searchCb();
                                })
                            }
                        })

                        if (typeof callbk == 'function') {
                            callbk();
                        }
                    } else {
                        Util.ajax.getJson('/ngkm/user/getBtnAuth', { 'datas': params }, function (json, status) {
                            if (status) {
                                for (var i in json.beans) {
                                    //mo：1：有权限，0：无权限
                                    var bean = json.beans[i];
                                    if (bean) {
                                        if (bean['flag'] == '1') {
                                            if(bean['btnId']=="messageSendTopNew"&&klgId){
                                                if("none"==$("#messageSendTop").css("display")){
                                                    $('#messageSendTop', $el).show();
                                                }
                                            }else if(bean['btnId']=="messageSendTopRenew"&&klgId){
                                                //查询知识是否是国家和地址的
                                                getKnwlgType(klgId,bean['btnId'], $el);
                                            }else if(bean['btnId']=="forcedUnlockBtn" || bean['btnId']=="forcedUnlockCheckInfoByIds"){
                                                $('#' + bean['btnId'], $el).css("display","inline-block")
                                            } else{
                                                $('#' + bean['btnId'], $el).show();
                                            }
                                        } else {
                                            $('#' + bean['btnId'], $el).hide();
                                        }
                                    }
                                    var p = JSON.parse(params);
                                    var moKey = p[i]['mo'];
                                    var btnIdKey = p[i]['btnId'];
                                    // 本地存储权限数据
                                    var old_auth_data = localStorage.getItem('auth_old_data');
                                    if (old_auth_data) {
                                        localStorage.setItem('auth_old_data', old_auth_data + ',' + moKey + btnIdKey);
                                    } else {
                                        localStorage.setItem('auth_old_data', moKey + btnIdKey);
                                    }
                                    localStorage.setItem(moKey + btnIdKey, bean['flag']);//
                                }
                            }
                            if (typeof callbk == 'function') {
                                callbk();
                            }
                            searchCb && searchCb();
                        })
                    }
                } else {
                    Util.ajax.getJson('/ngkm/user/getBtnAuth', { 'datas': params }, function (json, status) {
                        if (status) {
                            for (var i in json.beans) {
                                //mo：1：有权限，0：无权限
                                var bean = json.beans[i];
                                if (bean) {
                                    if (bean['flag'] == '1') {
                                        if(bean['btnId']=="messageSendTopNew"&&klgId){
                                            if("none"==$("#messageSendTop").css("display")){
                                                $('#messageSendTop', $el).show();
                                            }
                                        }else if(bean['btnId']=="messageSendTopRenew"&&klgId){
                                            //查询知识是否是国家和地址的
                                            getKnwlgType(klgId,bean['btnId'], $el);
                                        } else if(bean['btnId']=="forcedUnlockBtn" || bean['btnId']=="forcedUnlockCheckInfoByIds"){
                                            $('#' + bean['btnId'], $el).css("display","inline-block")
                                        }else{
                                            $('#' + bean['btnId'], $el).show();
                                        }
                                    } else {
                                        $('#' + bean['btnId'], $el).hide();
                                    }
                                }

                            }
                        }
                        if (typeof callbk == 'function') {
                            callbk();
                        }
                        searchCb && searchCb();
                    })
                }
            };
        }
        
    }

    function getKnwlgType(klgId,btn,$el) {
        Util.ajax.postJson('/ngkm/knowledge/getCountryOrRegion', { knwldgeId:klgId }, function (data) {
            if (data.returnCode=="0") {
                if(data.object&&data.object==true){
                    $('#messageSendTop', $el).show();
                }

            }
        })
    }
    getKnwlgType("2308101410310106619","");
    return btnAuthority;
});
