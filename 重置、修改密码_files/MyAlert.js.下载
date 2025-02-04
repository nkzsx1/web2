/**
 * @Description: 错误提示弹出框
 * @Date:2017/8/2
 * @Author: chenan
 */
define(['text!modules/personalCenter/error.tpl','text!modules/personalCenter/confirm.tpl'],function(errorTpl,confirmTpl){
	var $el = null;
	var MyAlert = function(data){
	    $("#myAlert-box").each(function(){
	        $(this).remove();
	    });

        var bodyEle = $("body");
		if(data['type'] == null){
			$el = $(confirmTpl);
		}else if(data['type'] == 'error'){
			$el = $(errorTpl);
		}else if(data['type'] == 'confirm'){
			$el = $(confirmTpl);
		}else if(data['type'] == 'success'){
			$el = $('<div class="success-alert" id="myAlert-box"><div class="bg"></div><div class="txt"><i class="icon km-zhengque"></i><span>操作成功</span></div></div>');
            bodyEle.append($el);
			if(data['text'] != null) $("#myAlert-box span").html(data['text']);
            if(data['width'] != null ){$("#myAlert-box").css("width",data['width']);}
			if(data["zIndex"]){$("#myAlert-box").css("z-index", data["zIndex"])}
			setTimeout('$("#myAlert-box.success-alert").hide(\'slow\',function(){$("#myAlert-box.success-alert").remove()})',2000);
			return;
		}
		else if(data['type'] == 'intervel'){
            $el = $('<div class="intervel-alert" id="myAlert-box"><div class="bg"></div><div class="txt"><i class="icon km-shibai"></i><span>操作成功</span></div></div>');
            bodyEle.append($el);
            if(data['text'] != null) $("#myAlert-box span").html(data['text']);
            setTimeout('$("#myAlert-box.intervel-alert").hide(\'slow\',function(){$("#myAlert-box.success-alert").remove()})',2000);
            return;
        }
		if(data['paddingLR']){
            $el.find(".popup-content").css("overflowY","hidden");
            $el.find(".popup-content").find("p").css("paddingLeft",data['paddingLR'] + "px").css("paddingRight",data['paddingLR'] + "px")
		}
        bodyEle.append($el);
        if(data["zIndex"]){$("#myAlert-box").css("z-index", data["zIndex"])}
        var boxBtnsGreenEle = $("#myAlert-box .popup-btns .km-btn-green");
		if(data['text'] != null) $("#myAlert-box .popup-content p").html(data['text']);
        if (data['trueName'] != null) boxBtnsGreenEle.html(data['trueName']);
		if(data['falseName'] != null) $("#myAlert-box #myAlert-box-cancel").html(data['falseName']);
        if (data['trueShow'] != null && data['trueShow'] == false) boxBtnsGreenEle.remove();
		if(data['falseShow'] != null && data['falseShow'] == false) $("#myAlert-box #myAlert-box-cancel").remove();
        var myAlertBoxEle = $("#myAlert-box");
        myAlertBoxEle.show();
        boxBtnsGreenEle.on('click', function () {
            myAlertBoxEle.hide("fast", function () {
                myAlertBoxEle.remove();
				if(data['ok'] != null){
					data['ok']();
				} 
			});
		});
		$("#myAlert-box #myAlert-box-cancel").on('click',function(){
            myAlertBoxEle.hide("fast", function () {
                myAlertBoxEle.remove();
				if(data['cancel'] != null){
					data['cancel']();
				} 
			});
		});
	};
	return MyAlert;
});