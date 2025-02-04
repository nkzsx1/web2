/**
 * add by liuhenghui
 */
define([], function(){

    var serviceTypeId={
        xjh:"xjhytck"//新交互
    };

    //转换CrossAPI的数据 内嵌
    var converCrossAPIData =  function(clientBusiInfo,indexInfo){
        var data = {};
        var cbusBean = clientBusiInfo && clientBusiInfo.bean;
        var userInfo = indexInfo && indexInfo.userInfo;

        //新交互数据逻辑转换
        if(indexInfo.userInfo.serviceTypeId == serviceTypeId.xjh){
            data = {msisdn:cbusBean.msisdn, //手机号
                numAssignmentCode:cbusBean.cityCode, //归属地
                provinceId:cbusBean.xjhProvinceId,  //省份编号
                serviceTypeId:userInfo.serviceTypeId,//系统编号
                blendServiceTypeId:cbusBean.serviceTypeId,//融合系统编号
                provinceIdType:"3",
                callingNum: cbusBean.callingNum,
                callerNum: cbusBean.callerNo
            };
            if(data.provinceId == "999"){
                data.provinceId = "000";
            }
        }else{//融合坐席数据逻辑转换
            data = {msisdn:cbusBean.msisdn, //手机号
                numAssignmentCode:cbusBean.numAssignmentCode, //归属地
                provinceId:"",  //省份编号
                serialNo:cbusBean.serialNo,  //接触流水号
                serviceTypeId:userInfo.serviceTypeId,//系统编号
                blendServiceTypeId:cbusBean.serviceTypeId,//融合系统编号
                provinceIdType:"0",
                callingNum: cbusBean.callingNum,
                callerNum: cbusBean.callerNo
            };
        }
        localStorage.setItem("ngkm_sysTypeId",indexInfo.userInfo.serviceTypeId);
        return data;
    };

    //转换postMessage的数据 open
    var converPostMessageData = function (origData) {
        var newData={};
        //新交互数据逻辑转换
        if(origData.serviceTypeId == serviceTypeId.xjh){
            newData = {msisdn:origData.msisdn, //手机号
                numAssignmentCode:origData.cityCode || "", //归属地
                provinceId:origData.xjhProvinceId || "",  //省份编号
                serviceTypeId:origData.serviceTypeId,//系统编号
                provinceIdType:"3"
            };
            if(newData.provinceId == "999"){
                newData.provinceId = "000";
            }
        }else{//融合坐席数据逻辑转换
            newData = {msisdn:origData.msisdn, //手机号
                numAssignmentCode:origData.numAssignmentCode || "", //归属地
                provinceId:"",  //省份编号
                serviceTypeId:origData.serviceTypeId,//系统编号
                serialNo:origData.serialNo,  //接触流水号
                provinceIdType:"0"
            };
        }
        localStorage.setItem("ngkm_sysTypeId",origData.serviceTypeId);
        return newData;
    };


    return {
        //转换CrossAPI的数据 内嵌
        converCrossAPIData:function (clientBusiInfo,indexInfo) {
            return converCrossAPIData(clientBusiInfo,indexInfo);
        },
        //转换postMessage的数据 open
        converPostMessageData:function (origData) {
            return converPostMessageData(origData);
        }
    };
});