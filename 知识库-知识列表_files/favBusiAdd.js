define(['Util', 'knowledgeTree', 'text!modules/personalCenterNew/favBusiAdd.tpl', 'js/personalCenter/MyAlert', 'js/constants/constants'
], function (Util, KnowledgeTree, tpl, MyAlert, Constants) {

    var KnowledgeTree = KnowledgeTree;

    var $el = null;
    var selectCatl = function(title,favrtKnwlgId,targetObj){
        $el = $("body");
        var zTreeObj;
        var target;
        var selectedCatlId="1";
        var isCreate=true;

        //修复ie8下不支持trim()
        String.prototype.trim = function () {
            return this .replace(/^\s\s*/, '' ).replace(/\s\s*$/, '' );
        }

        //设置下拉框的显示位置
        var setTreePortion = function(p){
            target = p;
            //下拉框的高度
            var selectHeight = target.height();
            //我的收藏夹距浏览器底部距离
            var buttom = $(window).height() - ($("#default-catalog").offset().top-$(document).scrollTop());
            if (buttom > selectHeight){
                $(".addff-pos-ads").each(function(){
                    $(this).removeClass("facing-up");
                });
            }else{
                $(".addff-pos-ads").each(function(){
                    $(this).addClass("facing-up");
                });
            }
        }

        //设置收藏夹显示位置(不考虑左右位置)
        function setFarPortion(){
            var favoriteAdd = $(".km-favorite-add");
            var docEle = $(document);
            //获取收藏夹弹框的高度
            var farHeight = favoriteAdd.height();
            //点击元素距浏览器底部距离
            var buttom = $(window).height() - (targetObj.offset().top + targetObj.height() - docEle.scrollTop());

            if(buttom > farHeight){
                //底部高度可以可以放下收藏夹
                favoriteAdd.css("top", targetObj.offset().top + targetObj.height() - docEle.scrollTop());
                favoriteAdd.css("left", targetObj.offset().left + targetObj.width() / 2 - favoriteAdd.width() + 26 - docEle.scrollLeft());
            }else{
                favoriteAdd.addClass("arrow-bottom");
                favoriteAdd.css("top", targetObj.offset().top - favoriteAdd.height() - docEle.scrollTop());
                favoriteAdd.css("left", targetObj.offset().left + targetObj.width() / 2 - favoriteAdd.width() + 26 - docEle.scrollLeft());
            }
        }

        //关闭滚动条
        function closeScroll(){
            var docmEle = $(document);
            var top = docmEle.scrollTop();
            docmEle.on('scroll.unable', function () {
                docmEle.scrollTop(top);
            });
        }

        //开启滚动条
        function openScroll(){
            $(document).unbind("scroll.unable");
        }

        //用于监听收藏夹
        var listenCatl = function(event){
            var targetEle = $(event.target);
            if (targetEle.parents(".addff-pos-ads").length > 0
                || targetEle.hasClass("addff-pos-ads")
                || targetEle.parents("#default-catalog").length > 0
                || targetEle.attr("id") == "default-catalog") {
                return;
            }
            $("#first-location-catalog").append($("#catalog-tree").detach());
            $(".addff-selsct-filer").hide();
            $(".addff-pos-ads-display").hide();
        }

        //选择目录
        function select_catalog(event, treeId, treeNode){
            selectedCatlId = treeNode.catlId;
            $("#selected-catalog").html(treeNode.catlNm);
            $(".addff-pos-ads-display").hide();
        }

        //收藏夹上取消按钮
        $(".addff-btn .cancel-favorite").click(function(){
            if(zTreeObj!=null){
                zTreeObj.destroy();
            }
            //$el.unbind("click",addFavorites);
            var favAdd = $(".km-favorite-add");
            favAdd.unbind("click",listenCatl);
            favAdd.remove();
            openScroll($el);
        });

        //新增目录
        function save_catalog(event,treeId,treeNode){
            var name = treeNode.catlNm.trim();
            var createCatalogEle = $("#create-catalog");
            if(name.length>=255){
                zTreeObj.removeNode(treeNode);
                zTreeObj.selectNode(treeNode.getParentNode());
                new MyAlert({
                    type: 'error',
                    text:'保存失败，目录名称过长',
                    falseShow:false,
                    trueName:'确定'
                });
                createCatalogEle.bind("click", createCatalog);
                return;
            }
            if(name.indexOf("<")>=0 || name.indexOf(">")>=0){
                zTreeObj.removeNode(treeNode);
                zTreeObj.selectNode(treeNode.getParentNode());
                new MyAlert({
                    type: 'error',
                    text:'目录名字不能包含"<"、">"',
                    falseShow:false,
                    trueName:'确定'
                });
                createCatalogEle.bind("click", createCatalog);
                return;
            }
            if(name.length==0){
                zTreeObj.removeNode(treeNode);
                zTreeObj.selectNode(treeNode.getParentNode());
                new MyAlert({
                    type: 'error',
                    text:'目录名字不能为空',
                    falseShow:false,
                    trueName:'确定'
                });
                createCatalogEle.bind("click", createCatalog);
                return;
            }
            var pId = treeNode.getParentNode().catlId;
            var  params={'catlNm':name,'suprCatlId':pId};
            var  requestUrl=Constants.AJAXURL+"/klgFavrtCatal/saveBusiCatal?v="+new Date().getTime();
            Util.ajax.ajax({url:requestUrl,type:"GET",data:params,async:true,success:function(json){
                    $(".submitting-box").remove();
                    if(json.returnCode=="0"){
                        treeNode.catlId = json.bean;
                        treeNode.catlNm = name;
                        $("#"+treeNode.tId+"_a").attr("title",name);
                        $("#"+treeNode.tId+"_span").html(name);
                        createCatalogEle.bind("click", createCatalog);
                    }else{

                        zTreeObj.selectNode(treeNode.getParentNode());
                        zTreeObj.removeNode(treeNode);
                        setTreePortion(target);
                        new MyAlert({
                            type: 'error',
                            text:json.returnMessage,
                            falseShow:false,
                            trueName:'确定'
                        });
                        createCatalogEle.bind("click", createCatalog);
                    }
                }
            });
        }

        //将模板注入页面中并隐藏
        $el.append(tpl);
        setFarPortion();
        $("#favorite-knowledge-name").attr("readonly",true);
        $("#favorite-knowledge-name").val(title);
        //点击展开收藏目录
        $("#default-catalog").click(function(){
            var addffDisplayEle = $(".addff-pos-ads-display");
            if(!isCreate){
                addffDisplayEle.show();
                $(".addff-selsct-filer").hide();
                return;
            }
            var treeConfig = {
                hasLine:true,//是否有节点连线
                view: {
                    showTitle: true
                },
                callback:{
                    onClick:select_catalog,
                    onRename:save_catalog
                },
                data:{
                    key:{
                        name: "catlNm",
                        id: "catlId",
                        pId: "suprCatlId"
                    },
                    simpleData: {
                        enable: true,
                        idKey: "catlId",
                        pIdKey: "suprCatlId",
                        rootPId: "0"
                    }
                }
            };
            Util.ajax.ajax({
                type: "GET",
                url: Constants.AJAXURL + "/klgFavrtCatal/getAllBusiFavCatls?v="+new Date().getTime(),
                async: true,
                success: function (data) {
                    var treeData = data.beans;
                    treeData.push({catlNm: "我的收藏", catlId: "0","open":true, suprCatlId: ""});
                    zTreeObj = $.fn.zTree.init($('#catalog-tree'),treeConfig,treeData);
                    var node = zTreeObj.getNodesByParam("catlId","1",null)[0];
                    zTreeObj.selectNode(node);
                    isCreate=false;
                    setTreePortion(addffDisplayEle);
                    addffDisplayEle.show();
                    $(".addff-selsct-filer").hide();
                },
                error: function () {
                    return false;
                }
            });
        });
        //新建文件夹
        function createCatalog(){
            var node = [{catlNm: "新建文件夹"}];
            var treeNode = zTreeObj.getSelectedNodes()[0];
            if(treeNode==undefined){
                zTreeObj.destroy();
                $(".km-favorite-add").remove();
                openScroll($el);
                new MyAlert({
                    type:'error',
                    text:'没有选中目录节点，需重新加载',
                    falseShow:false,
                    trueName:'确定'
                });
            }
            if(treeNode.catlId==1){
                new MyAlert({
                    type:'error',
                    text:'“前台展示下不能新建目录”',
                    falseShow:false,
                    trueName:'确定'
                });
                return;
            }
            if(treeNode != null && treeNode.level >= 4){
                zTreeObj.selectNode(treeNode);
                setTreePortion(target);
                new MyAlert({
                    type:'error',
                    text:'不能再建更深层级的目录了',
                    falseShow:false,
                    trueName:'确定'
                });
                return;
            }
            if(!jQuery.isEmptyObject(treeNode)){
                if(treeNode.isParent){
                    zTreeObj.expandNode(treeNode,true,false,true,true);
                }
            }else{
                return false;
            }
            var lz = zTreeObj.addNodes(treeNode,node);
            zTreeObj.editName(lz[0]);
            setTreePortion(target);
            $("#create-catalog").unbind();
        }
        //点击“选择其他文件夹”
        $("#addff-pos-u").click(function(){
            $("#second-location-catalog").append($("#catalog-tree").detach());
            var addSelFilter = $(".addff-selsct-filer");
            setTreePortion(addSelFilter);
            addSelFilter.show();
            $(".addff-pos-ads-display").hide();
        });
        //新建文件夹按钮点击事件
        $("#create-catalog").bind("click",createCatalog);
        //设置监听事件
        $(".km-favorite-add").bind("click",listenCatl);

        //取消焦点事件(取消按钮)
        $("#catlConcel").mouseover(function(){
            $(".rename").off("blur");
        });
        //取消焦点事件(确定按钮)
        $(".submit-favorite").mouseover(function(){
            $(".rename").off("blur");
        });

        //新建目录div上取消
        $("#catlConcel").click(function(){
            var treeNode = zTreeObj.getSelectedNodes()[0];
            if(treeNode!=undefined){
                zTreeObj.removeNode(treeNode);
                zTreeObj.selectNode(treeNode.getParentNode());
                $("#first-location-catalog").append($("#catalog-tree").detach());
                $(".addff-selsct-filer").hide();
                $(".addff-pos-ads-display").hide();
                isCreate = true;
            }else{
                if(zTreeObj!=null){
                    zTreeObj.destroy();
                }
                //$el.unbind("click",addFavorites);
                var favAdd = $(".km-favorite-add");
                favAdd.unbind("click",listenCatl);
                favAdd.remove();
                openScroll($el);
            }
        });

        //收藏夹上取消按钮
        $(".addff-btn .cancel-favorite").click(function(){
            if(zTreeObj!=null){
                zTreeObj.destroy();
            }
            $(".km-favorite-add").unbind("click",listenCatl);
            $(".km-favorite-add").remove();
            openScroll($el);
        });
        //选完目录后确定
        $(".submit-favorite").click(function(){
            var fkname = $("#favorite-knowledge-name").val().trim();
            if(fkname.length==0){
                new MyAlert({
                    type: 'error',
                    text:'收藏标题不能为空',
                    falseShow:false,
                    trueName:'确定'
                });
                return;
            }
            if($("#catalog-tree ul li span input").length>0){  //如果是新建文件夹后点“确定”
                var treeNode = zTreeObj.getSelectedNodes()[0];
                // var parentNode = zTreeObj.getSelectedNodes()[0].getParentNode();
                // var pId = parentNode.catlId;
                // var nodeNm = zTreeObj.getSelectedNodes()[0].catlNm();
                //到后台去查看当前父节点下是否有同名节点后保存
                var name = $(".rename").val().trim();
                if(name.length>=255){
                    zTreeObj.removeNode(treeNode);
                    zTreeObj.selectNode(treeNode.getParentNode());
                    new MyAlert({
                        type: 'error',
                        text:'保存失败，目录名称过长',
                        falseShow:false,
                        trueName:'确定'
                    });
                    return;
                }
                if(name.indexOf("<")>=0 || name.indexOf(">")>=0){
                    zTreeObj.removeNode(treeNode);
                    zTreeObj.selectNode(treeNode.getParentNode());
                    new MyAlert({
                        type: 'error',
                        text:'目录名字不能包含"<"、">"',
                        falseShow:false,
                        trueName:'确定'
                    });
                    return;
                }
                if(name.length==0){
                    zTreeObj.removeNode(treeNode);
                    zTreeObj.selectNode(treeNode.getParentNode());
                    new MyAlert({
                        type: 'error',
                        text:'目录名字不能为空',
                        falseShow:false,
                        trueName:'确定'
                    });
                    return;
                }
                var parentCatlId = treeNode.getParentNode().catlId;
                var data = {'favrtBizNm':fkname,'favrtBizId':favrtKnwlgId,'catlNm':name,'suprCatlId':parentCatlId};
                Util.ajax.postJson(Constants.AJAXURL+"/klgFavrtInfo/saveBusiInfoAddByNode",data,function(json){
                    if(json.returnCode == 0){
                        $(".km-favorite-add").hide();
                        new MyAlert({
                            type: 'success',
                            text:'收藏成功'
                        });
                        if(zTreeObj != null){
                            zTreeObj.destroy();
                        }
                        $(".km-favorite-add").remove();
                        openScroll($el);
                    }else{
                        new MyAlert({
                            type: 'error',
                            text:json.returnMessage,
                            falseShow:false,
                            trueName:'确定'
                        });
                        zTreeObj.removeNode(treeNode);
                        zTreeObj.selectNode(treeNode.getParentNode());
                        return;
                    }
                    targetObj.trigger("favrtResult",json.returnCode);
                });
            }else{
                $(".km-favorite-add").hide();
                if(zTreeObj!=undefined){
                    selectedCatlId = zTreeObj.getSelectedNodes()[0].catlId;
                }
                var data={'favrtBizNm':fkname,'favrtBizId':favrtKnwlgId,'favrtCatlId':selectedCatlId};
                Util.ajax.postJson(Constants.AJAXURL+"/klgFavrtInfo/saveFavBusiInfoByCatlId",data,function(json){
                    if(json.returnCode == 0){
                        new MyAlert({
                            type: 'success',
                            text:'收藏成功'
                        });
                    }else{
                        new MyAlert({
                            type: 'error',
                            text:json.returnMessage,
                            falseShow:false,
                            trueName:'确定'
                        });
                    }
                    targetObj.trigger("favrtResult",json.returnCode);
                });
                if(zTreeObj != null){
                    zTreeObj.destroy();
                }
                $(".km-favorite-add").remove();
                openScroll($el);
            }

        });

    }

    return selectCatl;
});
