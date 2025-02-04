/**
 * 前台界面的常量定义
 */
define(function(){
    String.prototype.replaceAll = function(s1,s2){
        return this.replace(new RegExp(s1,"gm"),s2);
    };

    var baseUrl = "/src";
    if(window.location.host.indexOf("ngkm.cs.cmos") != -1){
        if(window.location.port != "8080"){
            baseUrl = "/src";
        }
    }

    return{
        //ccacs的url常量
        ROOTURL:baseUrl,   //请各位注意  提交时不要把修改的此文件提交
        PREAJAXURL:"/ngkm",
        AJAXURL : "/ngkm",
        EMPTY_HTML:'<div class="km-norecord"><img src="../../assets/img/km-norecord@2x.png" alt=""><p>暂无数据</p></div>',
        BADREQ_HTML:'<div class="km-norecord"><img src="../../assets/img/km-norecord@2x.png" alt=""><p>获取数据失败</p></div>',
        PAGE_SIZE:10,
        KEYWORD_MAX_SIZE:50,//关键字字符长度限制
        MESSAGE_TYPE:1006,//短信发送的smsTypeCd
        COUNTRY_CODE:"000",//全国地域编号
        NGKM_QA_TMPLT_ID: '44',
        NGKM_QA_TMPLT_GROUP_NM: 'Q&A',
        NGKM_TEMPLET_CHNL:"NGKM.TEMPLET.CHNL",
        NGKM_ATOM_PARAM_TYPE:"NGKM.ATOM.PARAM.TYPE",//知识原子数据类型数据字典
        NGKM_ATOM_PARAM_PRICEORTIMETYPE_WKUNIT:"NGKM.ATOM.PARAM.PRICEORTIMETYPE.WKUNIT",//知识原子数据字典：价格/时间类型单位
        NGKM_ATOM_PARAM_RAMTYPE_WKUNIT:"NGKM.ATOM.PARAM.RAMTYPE.WKUNIT",//知识原子数据字典：内存类型单位
        NGKM_ATOM_PARAM_TIMES_WKUNIT:"NGKM.ATOM.PARAM.TIMES.WKUNIT",//知识原子数据字典：时间类型单位
        NGKM_INDEX_EXTEND_FIELD_STORE:"NGKM.INDEX.EXTEND.FIELD.STORE",//知识索引模板配置字段名称
        NGKM_KNWLG_INDEX_FIELD_TYPE:"NGKM.KNWLG.INDEX.FIELD.TYPE",// 知识索引模板配置字段类型编码
        NGKM_CM_PHONE_REGEX: /^1((3[5-9]|4[78]|5[012789]|65|7[28]|8[23478]|9[58])\d{8}|(34[0-8]|70[356])\d{7})$/,
        //知识库环境参数
        NGKM_ENVIROMENT_DEV:"develop",
        NGKM_ENVIROMENT_TEST:"test",
        NGKM_ENVIROMENT_PRODUCT:"product",
        NGKM_NTBK_DIAMOND_CARD_GROUP_CODE_TEST: "000245992000005", // 测试环境洛阳资源池页见钻卡工作组编码
        NGKM_NTBK_DIAMOND_CARD_GROUP_CODE_PRODUCT: "000245992000004",// 生产环境洛阳资源池页见钻卡工作组编码
        //二阶段知识库用到的数据类型
        NGKM_ATOM_DATA_TYPE_CHAR:"1",//字符串
        NGKM_ATOM_DATA_TYPE_RADIO:"2",//单选
        NGKM_ATOM_DATA_TYPE_CHECK:"3",//多选
        NGKM_ATOM_DATA_TYPE_RICH:"4",//富文本
        NGKM_ATOM_DATA_TYPE_TIME:"5",//时间
        NGKM_ATOM_DATA_TYPE_DATE:"6",//日期
        NGKM_ATOM_DATA_TYPE_DATETIME:"7",//日期时间
        NGKM_ATOM_DATA_TYPE_KNLWG:"8",//关联知识
        NGKM_ATOM_DATA_TYPE_MEMORY:"9",//内存
        NGKM_ATOM_DATA_TYPE_FILE:"10",//附件
        NGKM_ATOM_DATA_TYPE_DATAUNIT:"11",//数据单元
        NGKM_ATOM_DATA_TYPE_PRICE:"12",//价格/时间类型
        NGKM_ATOM_DATA_TYPE_PIC:"13",//图片
        NGKM_ATOM_DATA_TYPE_LLT:"14",//经纬度
        NGKM_ATOM_DATA_TYPE_KNLWG_LIST:"15",//关系系列
        NGKM_ATOM_DATA_TYPE_REGN:"16",//地区
        NGKM_ATOM_DATA_TYPE_CARD:"22",//卡片
        XJH_SERVICE_TYPEID:"xjhytck",
        SCENE_GOABROAD: "180409165332000002",//国家地区场景id
        WEBSITE_KNWLG_TMPLTID:"58",//网点信息模板id
        ROAM_CUSTOMIZE: ["180409172030000014", "180409172515000016", "180409172619000017", "180409172736000018", "180409181831000040", "180409182008000042"],//国际漫游场景定制原子
        IDD_CUSTOMIZE: ["180409174529000023", "180409174719000024", "180409182252000046", "180409182324000047"],//国际长途场景定制原子
        senceList:[{name:'营业厅',value:'1',id:'kmBusinessHall',url:baseUrl + '/modules/knowledgeAppNew/kmBusinessHallNEW.html'},
            {name:'套餐',value:'2',id:'KmScenario',url:baseUrl + '/modules/knowledgeAppNew/KmScenario.html'},
            {name:'国家或地区',value:'3',id:'kmGoabroad',url:baseUrl + '/modules/knowledgeAppNew/kmGoabroad.html'},
            {name:'优惠活动',value:'4',id:'activitis',url:baseUrl + '/modules/knowledgeAppNew/KmActivitis.html'},
            {name:'咨询表',value:'5',id:'consultQuery',url:baseUrl + '/modules/knowledgeAppNew/kmOpenConsultQuery.html'},
            {name:'权益',value:'6',id:'rightInter',url:baseUrl + '/modules/knowledgeAppNew/kmRightsAndInterests.html'},
            {name:'云手机',value:'7',id:'yunPhone',url:baseUrl + '/modules/knowledgeAppNew/kmCouldPhone.html'}],
        /**
         * 知识报送
         */
        NGKM_SUBMIT_STS_CD:"NGKM_SUBMIT_STS_CD", // 报送状态
        NGKM_SUBMIT_OP_CD:"NGKM_SUBMIT_OP_CD", // 报送操作状态
        NGKM_SUBMIT_TYPE:"NGKM_SUBMIT_TYPE", // 报送类型
        NGKM_SUBMIT_CONTENT_TYPE:"NGKM_SUBMIT_CONTENT_TYPE", // 报送内容类型
        NGKM_SUBMIT_URGET_LEVEL:"NGKM_SUBMIT_URGET_LEVEL", // 紧急程度
        NGKM_SUBMIT_IS_APPROVE:"NGKM_SUBMIT_IS_APPROVE", // 是否审核
        //h5渠道
        NGKM_SYSCHANNELCODE:"esoph5",
        //crossAPI敏感接口接入码、鉴权码
        PARAMJSONCHECK:{
            "accessCode":"ngkmcipherCheck",//接入码
            "authenticationCode":"e89769d92a6bb7364d5aebcc92c1346d"//鉴权码
        },
        PARAMJSONCHECKPLUS:{
            "accessCode":"ngkmcipherCheckPlus",//接入码
            "authenticationCode":"539719021cf49b39cecc6438ce915e78"//鉴权码
        },
        PARAMJSONAGENT:{
            "accessCode":"ngkmgetAgentState",//接入码
            "authenticationCode":"8fcdd70bf6eaff164c51669c153faaca"//鉴权码
        },
        PARAMJSONINDEX:{
            "accessCode":"ngkmgetIndexInfo",//接入码
            "authenticationCode":"3a251bff3428e2f05a1274ddf5a50454"//鉴权码
        },
        PARAMJSONBUSINFO:{
            "accessCode":"ngkmgetClientBusiInfo",//接入码
            "authenticationCode":"da25073df56cca2da6f2797c49e560d8"//鉴权码
        },
        PARAMJSONCALL:{
            "accessCode":"ngkmgetCallingInfo",//接入码
            "authenticationCode":"da47a759a4908192278fc837d4648b71"//鉴权码
        },

        kmEncodeURl:function(url){
            var tempUrl="" ;
            tempUrl = url.replaceAll("%","_314159261_");
            tempUrl = tempUrl.replaceAll("&","_314159262_");
            tempUrl = tempUrl.replaceAll("<","_314159263_");
            tempUrl = tempUrl.replaceAll(">","_314159264_");
            tempUrl = tempUrl.replaceAll("=","_314159265_");
            return tempUrl;
        },
        kmDecodeURl:function(url){
            var tempUrl="" ;
            tempUrl = url.replaceAll("_314159261_","%");
            tempUrl = tempUrl.replaceAll("_314159262_","&");
            tempUrl = tempUrl.replaceAll("_314159263_","<");
            tempUrl = tempUrl.replaceAll("_314159264_",">");
            tempUrl = tempUrl.replaceAll("_314159265_","=");
            return tempUrl;
        },
        judgeSpecialCharacter: function (str) {
            // 输入的纯字符
            // var reg = /[+-.@&_#]/g;
            // var newstr = str.replace(reg, '');
            // if (newstr.match(/^\s*$/)) {
            //     return true;
            // } else {
            //     return false;
            // }
            var reg = /[a-zA-Z0-9\u4e00-\u9fa5]/g;//汉字 字母 数字
            if (reg.test(str)) {
                return false;
            } else {
                return true;
            }
        },
        /*getEnvment: function(){
            var host = window.location.host;
            if(host.indexOf("ngkm.cs.cmos:8080") != -1 || host.indexOf("172.20.127.233") != -1 || host.indexOf("ngkm-crm.cs.cmos:8080") != -1){
                return this.NGKM_ENVIROMENT_TEST;
            }else if(host.indexOf("192.168.0.1") != -1 || host.indexOf("localhost") != -1 || host.indexOf("127.0.0.1") != -1){
                return this.NGKM_ENVIROMENT_DEV;
            }else {
                return this.NGKM_ENVIROMENT_PRODUCT;
            }
        },*/
        getEnvment: function(){

            var envFlag = window.localStorage.getItem("envFlag");

            //默认生产
            if (envFlag == null) {
                return this.NGKM_ENVIROMENT_PRODUCT;
            }

            if('test' == envFlag){
                return this.NGKM_ENVIROMENT_TEST;
            }else if('develop' == envFlag){
                return this.NGKM_ENVIROMENT_DEV;
            }else {
                return this.NGKM_ENVIROMENT_PRODUCT;
            }
        },
        // 神策测试环境数据接收地址
        getSensorsTestEnvReceiveUrl:function () {
            var httpType = window.location.protocol;
            if ('https:' == httpType) {
                return 'https://sensors.ipaas.cmos:20443/sa?project=production';
            } else {
                return 'http://172.22.244.9:8106/sa?project=production';
            }

        }
    }

});