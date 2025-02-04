define(['Util', 'js/constants/constants', 'js/constants/kmUtil', 'js/personalCenter/MyAlert', 'dialog', 'checkboxes'],
    function (Util, Constants, KmUtil, MyAlert,Dialog,Checkboxes) {

        var compareData = [];//对比的知识集
        var tmpData = [];//对比的模板集

        //开始对比
        var startCompare = function (ids) {
            KmUtil.openTab("知识对比详情", Constants.PREAJAXURL + Constants.ROOTURL + "/modules/personalCenterNew/contrastDetail.html?ids=" + ids, {});
        };

        //单个知识清除方法
        var clearSingle = function (thisEle) {
            var klgId = thisEle.find('i').attr('id').substr(3);
            $('#c_'+klgId).removeClass('disabled');//给列表对比去掉置灰
            var tmpId = thisEle.find('i').attr('tmpId');
            var rmDomEle = thisEle.parent('li');
            $.each(compareData, function (i, it) {//去知识
                if (it[0] == klgId) {
                    compareData.splice(i, 1);
                    return false;
                }
            });

            $.each(tmpData, function (idx, item) {
                if (item[0] == tmpId) {
                    if (item[2] == 1) {
                        tmpData.splice(idx, 1);
                        rmDomEle = rmDomEle.parent().parent('div');
                        rmDomEle.remove();//去模板dom
                    } else {
                        tmpData[idx][2] = tmpData[idx][2] - 1;
                        var $klgIdEle = $('#sel_' + klgId);
                        var $tmpEle = $klgIdEle.parent('ul');
                        rmDomEle.remove();//去知识dom
                        klgClick($tmpEle,true);
                    }
                    return false;
                }
            });

            var len = $('.con-sec').find('li').length;
            if (len == 0) {//如果全部删除，则关闭悬浮对比匡
                $('.contrast').html('');
                $('.constrast-fixed').addClass('no-conlist');
            }
            var ballEle = $('.contrast-ball').find('em');
            ballEle.text(parseInt(ballEle.text()) - 1);//对比球-1
        }

        //对比按钮
        var compareKlg = function (thisEle) {
            if (thisEle.hasClass('km-btn-green')) {
                var ulEle = thisEle.prev('ul');
                var arr = ulEle.find('input:checkbox[checked="checked"]');
                if($(arr[0]).parent().parent().hasClass('allCheck')){
                    arr.splice(0,1);//排除第一个(全选)
                }
                var arrId = [];
                $.each(arr, function (i, it) {
                    arrId.push($(it).val());
                });
                startCompare(arrId.join(','));
            } else {
                new MyAlert({
                    type: 'error',
                    text: "条件不足，不能对比！",
                    falseShow: false,
                    trueName: "确定"
                });
            }
        }

        //同一模板下知识对比处理
        var sameTmpEvent = function () {
            //清空对比知识
            $('.selected-message').unbind('click').on('click', function () {
                tmpData = [];//模板清空
                compareData = [];//知识清空
                $('.contrast-ball').find('em').text(0);//对比球清0
                $('.contrast').html();
                $('.constrast-fixed').addClass('no-conlist');
                $('.compareCls').removeClass('disabled');//把当前页置灰的对比按钮去掉
            });

            //删去单个知识操作
            $('.clearSingle').unbind('click').on('click', function () {
                clearSingle($(this));
            });

            //对比按钮事件
            $('.con-list').children('a').unbind('click').on('click', function () {
                compareKlg($(this));
            });
        }

        //处理字符,控制最多展示2行，多余用...替代
        var stringHandle = function (str) {
            var len = 0;
            var code = 0;
            for (var i = 0; i < str.length; i++) {
                code = str.charCodeAt(i);
                if (code >= 0 && code <= 127) {
                    len += 1;
                    if (len >= 67) {
                        str = str.substr(0, i) + '...';
                        return str;
                    }
                } else {
                    len += 2;
                    if (len >= 67) {
                        str = str.substr(0, i) + '...';
                        return str;
                    }
                }
            }
            return str;
        }

        //填充对比数据
        var getFillData = function () {
            var dataHtml = '<div class="con-head">' +
                '<b class="con-center">知识对比</b>' +
                '<a class="selected-message">' +
                '<i class="icon select-msg"></i>' +
                '清空知识' +
                '</a></div>';
            dataHtml = dataHtml + '<div class="con-sec">';
            $.each(tmpData, function (idx, item) {
                dataHtml = dataHtml + '<div class="con-list">' +
                    '<ul>' +
                    '<li class="con-list-head" style="height: 26px"  id="tmp' + item[0] + '">' + item[1] + '<div id="all_' + item[0] +'" class="cl-chkall"></div></li>';
                $.each(compareData, function (i, it) {
                    if (it[2] == item[0]) {
                        it[1] = stringHandle(it[1]);
                        dataHtml = dataHtml + '<li id="sel_' + it[0] + '"></li>';
                    }
                });
                dataHtml = dataHtml + '</ul><a class="km-btn km-btn-xs km-btn-grey con-center" href="javascript:void(0)">开始对比</a></div>';
            })
            dataHtml = dataHtml + '</div><span class="prompt">注：必须是同知识模板下可进行知识对比</span>';
            return dataHtml;
        }

        //获取某个模板下勾选知识数量控制对比按钮
        var setCompareBtnByNum = function($tmpEle){
            //获取对应模板下勾选知识数量
            var arrAll = $tmpEle.find('input:checkbox[checked="checked"]');
            if($(arrAll[0]).parent().parent().hasClass('allCheck')){
                arrAll.splice(0,1);//排除第一个(全选)
            }
            if (arrAll.length >= 2) {
                $tmpEle.next('a').removeClass('km-btn-grey').addClass('km-btn-green');
            } else {
                $tmpEle.next('a').addClass('km-btn-grey').removeClass('km-btn-green');
            }
        }

        //生成checkbox组件替代原生样式(全选)
        var initAllCheck = function(item){
            //生成知识标题全选组件
            var tmpEl = '#all_'+ item[0];
            new Checkboxes({
                el: tmpEl ,      //要绑定的容器
                className: 'box',    //组件外围的className,默认横向|all-width纵向
                items: [{
                    className: "allCheck", "label": '全选', "value": item[0]
                }]

            });
            //模拟全选按钮事件
            $(tmpEl).find('li').on('click',function(){
                var $tmpEle = $('#tmp'+item[0]);
                var $btnEle = $tmpEle.parent('ul').next('a');
                var $eachDiv = $tmpEle.siblings().find('li').find('div');
                if($(this).find('div').hasClass('checked')){
                    //取消全选
                    $eachDiv.removeClass('checked');
                    $eachDiv.find('input').attr('checked', false);

                    //对应的对比按钮置灰
                    $btnEle.addClass('km-btn-grey').removeClass('km-btn-green');
                }else{
                    //全选
                    $eachDiv.addClass('checked');
                    $eachDiv.find('input').attr('checked', true);
                    //如果多于2条知识，则启用对比按钮
                    if($tmpEle.siblings().length >= 2){
                        $btnEle.removeClass('km-btn-grey').addClass('km-btn-green');
                    }else{
                        $btnEle.addClass('km-btn-grey').removeClass('km-btn-green');
                    }
                }
            })
        }

        //知识点击事件处理1.全选2.对比按钮
        var klgClick = function($tmpEle,isCheck){
            var $allSelectEle = $tmpEle.find('input');
            var $allsel = $($allSelectEle[0]);
            if (isCheck) {
                for(var i = 1;i<$allSelectEle.length;i++){
                    if(!($($allSelectEle[i]).attr('checked'))){
                        isCheck = false;
                        break;
                    }
                }
                $allsel.attr('checked', isCheck);
                if(isCheck){
                    $allsel.parent().addClass('checked');
                }else{
                    $allsel.parent().removeClass('checked');
                }
            } else {
                $allsel.attr('checked', false);
                $allsel.parent().removeClass('checked');
            }
            setCompareBtnByNum($tmpEle);
        }

        //生成checkbox组件替代原生样式(单条知识)
        var initKlgCheck = function(it){
            it[1] = stringHandle(it[1]);
            var klgEl = '#sel_'+ it[0];
            new Checkboxes({
                el: klgEl ,      //要绑定的容器
                className: 'box',    //组件外围的className,默认横向|all-width纵向
                items: [{className: "klgCheck", "label":it[1], "value":it[0],
                    click: function (e, itemData) {
                        var $tmpEle = $('#sel_'+itemData.value).parent();
                        klgClick($tmpEle,(itemData.checked == '1')?true:false);
                    }
                }]
            });

            $(klgEl).append('<a href="javascript:void(0)" class="clearSingle" style="padding-right: 0px">' +
                '<i class="icon km-guanbi" id="cle' + it[0] + '" tmpId="' + it[2] + '"></i>' +
                '</a>');
        }

        //对比球点击事件
        var vsBallClickEvent = function () {
            $('.contrast-ball').unbind('click').on('click', function () {
                if (tmpData.length > 0) {
                    var constrastEle = $('.constrast-fixed');
                    if (constrastEle.hasClass('no-conlist')) {
                        constrastEle.removeClass('no-conlist');
                        //填充对比数据
                        $('.contrast').html(getFillData());
                        $.each(tmpData, function (idx, item) {
                            initAllCheck(item);//生成checkbox组件替代原生样式(全选)
                        })
                        $.each(compareData, function (i,it) {
                            initKlgCheck(it);//生成checkbox组件替代原生样式(单条知识)
                        });
                        sameTmpEvent();//对比栏事件
                    } else {
                        constrastEle.addClass('no-conlist');
                        $('.contrast').html('');
                    }
                }
            });
        }


        //注册对比按钮点击事件,修复sonar扫描问题
        var assemble = function (rowid) {
            var $rowEle = $("#c_" + rowid);
            $rowEle.addClass('compareCls');//给每列数据加一个统一的属性
            for (var m = 0; m < compareData.length; m++) {
                if (compareData[m][0] == rowid) { //知识重复添加控制
                    $rowEle.addClass('disabled');//给对比置灰
                    break;
                }
            }

            $rowEle.unbind('click').click(function () {
                    var This = $(this);
                    //知识重复添加控制
                    if(This.hasClass('disabled')){
                        reDataAlert();
                        return false;
                    }
                    var fixId = This.attr("id").substr(2);//知识id
                    var name = This.attr("name");//知识名称
                    var tmpId = This.attr("tmpId");//模板id
                    var tmpNm = This.attr("tmpNm");//模板名称
                    name = name.replace(/<span.*?>/g, '').replace(/<\/span>/g, '');//去除span标签
                    //验证权限
                    Util.ajax.postJsonAsync(Constants.PREAJAXURL + "/knowledge/verifyPermission?knwlgId=" + fixId + "&verNo=" + "", {}).then(function (data) {
                        if (data.object) {
                            var index = -1;
                            $.each(tmpData, function (i, it) {
                                if (it[0] == tmpId) {
                                    index = i;
                                    return false;
                                }
                            });
                            if (index > -1) {
                                if (tmpData[index][2] < 4) {//同一模板下知识数量控制
                                    tmpData[index][2] = tmpData[index][2] + 1;//对应的模板下知识数量加1
                                    compareData[compareData.length] = [fixId, name, tmpId];//加入知识对比中
                                    var ballEle = $('.contrast-ball').find('em');
                                    ballEle.text(parseInt(ballEle.text()) + 1);//对比球加1
                                    $rowEle.addClass('disabled');//给对比置灰
                                    //如果对比层已打开，则渲染dom
                                    var constrastEle = $('.constrast-fixed');
                                    if (!constrastEle.hasClass('no-conlist')) {
                                        var someCompareEvent = function () {//注册事件
                                            var $clearSingle = $('#cle' + fixId).parent('.clearSingle');
                                            $clearSingle.on('click', function () {//清除
                                                clearSingle($(this));
                                            });
                                        }

                                        $.each($('.con-list-head'), function (idx, item) {
                                            if ($(item).attr('id').substr(3) == tmpId) {
                                                name = stringHandle(name);
                                                var dataHtml = '<li id="sel_' + fixId + '"></li>';
                                                $(item).parent('ul').append(dataHtml);
                                                initKlgCheck([fixId,name,tmpId]);//生成checkbox组件替代原生样式(单条知识)

                                                //取消全选
                                                var allChEle = $('#all_'+tmpId).find('input');
                                                allChEle.parent('div').removeClass('checked');
                                                allChEle.attr('checked', false);

                                                someCompareEvent();
                                                return false;
                                            }
                                        });
                                    }
                                } else {
                                    kmNumAlert();
                                    return false;
                                }
                            } else {
                                //控制最多加3个模板
                                if (tmpData.length >= 3) {
                                    tmpNumAlert();
                                    return false;
                                }
                                tmpData[tmpData.length] = [tmpId, tmpNm, 1];//新增一个模板
                                compareData[compareData.length] = [fixId, name, tmpId];
                                //对比球加1
                                var ballEle = $('.contrast-ball').find('em');
                                ballEle.text(parseInt(ballEle.text()) + 1);
                                $("#c_" + rowid).addClass('disabled');//给对比置灰
                                //如果对比层已打开，则渲染dom
                                var constrastEle = $('.constrast-fixed');
                                if (!constrastEle.hasClass('no-conlist')) {
                                    name = stringHandle(name);
                                    var dataHtml = '<div class="con-list">' +
                                        '<ul>' +
                                        '<li class="con-list-head" id="tmp' + tmpId + '">' + tmpNm +
                                        '<div id="all_' + tmpId +'" class="cl-chkall"></div></li>' +
                                        '<li id="sel_' + fixId + '"></li>' +
                                        '</ul>' +
                                        '<a class="km-btn km-btn-xs km-btn-grey con-center" href="javascript:void(0)">开始对比</a>' +
                                        '</div>';
                                    $('.con-sec').append(dataHtml);
                                    initAllCheck([tmpId]);//生成checkbox组件替代原生样式(全选)
                                    initKlgCheck([fixId,name,tmpId]);//生成checkbox组件替代原生样式(单条知识)
                                    //注册事件
                                    var $clearSingle = $('#cle' + fixId).parent('.clearSingle');
                                    $clearSingle.on('click', function () {//清除
                                        clearSingle($(this));
                                    });
                                    $('#tmp' + tmpId).parent('ul').next('a').on('click', function () {//对比按钮事件
                                        compareKlg($(this));
                                    });
                                }
                            }
                        } else {
                            new MyAlert({type: 'error', text: "您尚无权限访问！", falseShow: false, trueName: "知道了"});
                            return;
                        }
                    });
                }
            );
        }

        //同一模板知识对比弹框提示
        var tmpNumAlert = function () {
            new MyAlert({
                type: 'error',
                text: "最多只能添加3个模板对比！",
                falseShow: false,
                trueName: "确定"
            });
        }

        //同一模板知识对比弹框提示
        var kmNumAlert = function () {
            new MyAlert({
                type: 'error',
                text: "同一模板下最多只能同时对比4条！",
                falseShow: false,
                trueName: "确定"
            });
        }

        //知识重复添加弹框提示
        var reDataAlert = function () {
            new Dialog({
                mode: 'tips', delayRmove: 2, tipsType: 'error', maxWidth: '226px',
                content: '请勿重复添加！'
            });
        }

        //对比事件
        var initRowEvent = function (data) {
            for (var i = 0; i < data.length; i++) {
                var rowid = data[i].knwlgId;
                //注册对比点击事件
                assemble(rowid);
            }
            vsBallClickEvent();//对比悬浮框dom相关点击事件
        };

        /**
         * 构造方法
         */
        var kmCompare = function (data) {
            initRowEvent(data);
        };
        return kmCompare;
    })

