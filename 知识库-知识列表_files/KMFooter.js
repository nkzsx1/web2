/**
 * @Description: 知识库前台门户底部样式模板
 * @Date:2017/8/8
 * @Author: chenan
 */
define(['text!modules/personalCenter/KMFooter.tpl'],function(tpl){
    //var $el = null;
    var KMFooter = function(p){
    //   $el = $(tpl);
        var winHeight = window.height || window.innerHeight;
        var bodyHeight = $("body").height();

        if(bodyHeight - 70 > winHeight){
            $("body").removeClass("footer-fixed");
        }else{
            $("body").addClass("footer-fixed");
        }
        p.append(tpl);
    };
    return KMFooter;
});
