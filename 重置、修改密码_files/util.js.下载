/*
*	@author: fany
*	@date:2015-09-28
*	@desc:全局公用模块
*		大部分业务模块都会用到，业务模块只需引用此公用模块，无需单个添加。
*		打包工程时，保证公用模块只打包一次，防止重复打包或未打包等情况造成程序出错。例：tableTpl.js
*/
define([
    'ajax',
    'loading',
    'form',
    'hdb',
    'eventTarget',
    'hdbHelper',
    'json2',
    'assets/common/znyd_dialog',
    // 'table' //bootatrap-tabel
], function (ajax, Loading, form, hdb, eventTarget) {
    var loading;
    return {
        ajax: ajax,
        form: form,
        hdb: hdb,
        eventTarget: eventTarget,
        isImg: function (url) {
            /**
             * @function 判断是否是已知的图片类型
             * @param {String} url 图片的url
             * @returns {Boolean}
             */
            var type = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];
            var typeSrt = url.slice(url.lastIndexOf('.') + 1, url.length).toLocaleLowerCase();
            var flag = true;
            if (type.indexOf(typeSrt) < 0) {
                flag = false
            }
            return flag

        },
        unique: function (arr, key) {
            /*
            ** 数组去重， arr传入的数组， 若去除对象数组，则传入去重的key，否则不用传
            */
            var arr = arr;
            if (arr.length === 0) {
                return arr
            }
            var n = arr[0] ? [arr[0]] : [];
            for (var i = 1; i < arr.length; i++) {
                if (key === undefined) {
                    if (n.indexOf(arr[i]) == -1) n.push(arr[i]);
                } else {
                    inner: {
                        var has = false;
                        for (var j = 0; j < n.length; j++) {
                            if (arr[i][key] == n[j][key]) {
                                has = true;
                                break inner;
                            }
                        }
                    }
                    if (!has) {
                        n.push(arr[i]);
                    }
                }
            }
            return n;
        },
        /**
         * 获取运营渠道子集的个数
         */
        getCompayChildLength: function (companyData, operCompanyId) {
            var companyData = companyData || [];
            var length = 0;
            $.each(companyData, function (index, item) {
                if (item.value === operCompanyId) {
                    length = item.children.length
                    return false
                }
            })
            return length
        },
        /**
         * 获取运营渠道数据
         */
        getOperChannelData: function (companyData, operCompanyId, getType) {
            var companyData = companyData || [];
            var newData = []
            if (companyData.length === 0) {
                return newData
            }
            if (companyData.length === 1) {
                newData = companyData[0].children
                return newData
            }
            if (operCompanyId === '696c4ae1a4c049ab9bfb4bb979523251' && getType !== 0) {
                return companyData
            }
            $.each(companyData, function (index, item) {
                if (item.value === operCompanyId) {
                    newData = item.children
                    return false
                }
            })
            return newData

        },
        isJson: function (str) {
            if (typeof str == 'string') {
                try {
                    var obj = JSON.parse(str);
                    if (typeof obj == 'object' && obj) {
                        return true;
                    } else {
                        return false;
                    }

                } catch (e) {
                    // console.log('error：'+str+'!!!'+e);
                    return false;
                }
            }
            console.log('It is not a string!')
        },
        /**
         * 过滤字符串中的<br/>
         */
        filterBrNbsp: function (str) {
            try {
                var str = str || "";
                var newStr = "";
                // newStr = str.replace(/<br\/>/g,"").replace(/ /g,'')
                newStr = str.replace(/\&nbsp;/g, "").replace(/\n/g, "").replace(/\\n/g, "").replace(/\s*/, '');
                return newStr
            } catch (e) {
                return str;
            }
        },
        /**
         * 获取当前月第一天的日期，精确到天
         * type 1-总是返回当月第一天  type 2- 若为1号则返回上个月第一天
         */
        getCurrentMonthFirst: function (type) {
            var date = new Date();
            var myDate = date.getDate();
            date.setDate(1);
            var seperator1 = "-";
            var year = date.getFullYear();
            var month;
            if (myDate == 1 && type == 2) {
                month = date.getMonth();
            } else {
                month = date.getMonth() + 1;
            }
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (month === 0) {
                month = 12;
                --year
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        },
        showLoading: function (tips) {
            var loadingHtml = '<div class="t-popup t-popup-layer hideLayer ZHW" style="z-index: 9999999;">'
                + '<div class="t-popup-overlay">'
                + '</div>'
                + '<div class="loading">'
                + ' <div class="t-loading-cmcc"></div>'
                + '</div>'
                + '</div>';
            $('body').append(loadingHtml);
            $('.ZHW').show();
            $('.ZHW .t-loading-cmcc').html(tips || '请求加载中...');
        },
        hideLoading: function () {
            $('.ZHW').hide();
            $('.ZHW').remove();
        },
        filterArr: function (arr) {
            var myArr = [];
            myArr = arr.filter(function (item, index) {
                return item.length > 0
            })
            myArr = myArr.map(function (item) {
                var str = $.trim(item)
                return str
            })
            return myArr
        },
        filterStr: function (val) {
            /**
             * @function 过滤空格和特殊字符
             * @param {String} val 需要过滤的字符串
             * @returns {string} 输出过滤后的字符串
             */
            var val = $.trim(val),
                val = val.replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;")
                    .replace(/,/g, "")
                    .replace(/\\/g, "")
                    .replace(/script/g, "")
                    .replace(/svg/g, "")
                    .replace(/alert/g, "")
                    .replace(/confirm/g, "")
                    .replace(/prompt/g, "")
                    .replace(/onload/g, "")
                    .replace(/onmouseover/g, "")
                    .replace(/onfocus/g, "")
                    .replace(/onerror/g, "")
                    .replace(/xss/g, "")
                    .replace(/\(/g, "&#40;")
                    .replace(/\)/g, "&#41;");
            return val
        },
        removeStr: function (val) {
            /**
             * @function 过滤空格和特殊字符
             * @param {String} val 需要过滤的字符串
             * @returns {string} 输出过滤后的字符串
             */
            var val = $.trim(val),
                val = val.replace(/</g, "")
                    .replace(/>/g, "")
                    .replace(/"/g, "")
                    .replace(/'/g, "")
                    .replace(/script/g, "");

            return val
        },
        escapeStr: function (val) {
            var val = $.trim(val),
                val = val.replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/script/g, "")

            return val
        },
        throttle: function (fn, wait) {
            /*
             * @param {Function} fn 传入的方法 @param {Number} wait 延迟执行的时间(ms)
             */
            var _fn = fn,
                timer,
                flags = true;
            return function () {
                var args = arguments,
                    self = this;
                if (flags) {
                    _fn.apply(self, args);
                    flags = false;
                    return flags;
                }
                if (timer) return false;
                timer = setTimeout(function () {
                    clearTimeout(timer);
                    timer = null;
                    _fn.apply(self, args);
                }, wait);
            };
        },
        parseStr: function (val) {
            val = val || "";
            val = val.replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, "'")
                .replace(/&#039;/g, "'")
                .replace(/&#40;/g, "(")
                .replace(/&#41;/g, ")");

            return val

        },
        /**
         * 给input添加title
         * @param {*} el
         */
        addInputTitle: function (el) {
            var el = el || 'input';
            $('body').on('input', el, function () {
                var $this = $(this);
                if ($this.hasClass('sn-counterContent')) {
                    return
                }
                var val = $this.val();
                $this.attr('title', val)
            })
        },
        copyText: function (str) {
            var input = document.createElement("input");
            input.value = str;
            document.body.appendChild(input);
            input.select();
            input.setSelectionRange(0, input.value.length), document.execCommand('Copy');
            document.body.removeChild(input);
        },
        createRandomId: function () {
            return (Math.random().toString(36).substr(2));
        },
        tableRowSelected: function (params) {
            var $table = params.el;
            var data = $table.bootstrapTable('getData');
            var seleceId = params.ids || [];
            console.log(seleceId)
            var idType = params.type;
            // isObject
            if (seleceId.length < 0) {
                return
            }
            if (params.isObject) {
                $.each(data, function (index, item) {
                    $.each(seleceId, function (index1, item1) {
                        if (item[idType] === item1[idType]) {
                            $table.bootstrapTable('check', index);
                        }
                    })
                })
            } else {
                $.each(data, function (index, item) {
                    if (seleceId.indexOf(item[idType]) > -1) {
                        $table.bootstrapTable('check', index);
                    }
                })
            }

        },
        autoTextarea: function (elem, extra, maxHeight) {
            /**
             * 文本框根据输入内容自适应高度
             * @param                {HTMLElement}        输入框元素
             * @param                {Number}             设置光标与输入框保持的距离(默认0)
             * @param                {Number}             设置最大高度(可选)
             */
            extra = extra || 0;
            var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
                isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
                addEvent = function (type, callback) {
                    elem.addEventListener ?
                        elem.addEventListener(type, callback, false) :
                        elem.attachEvent('on' + type, callback);
                },
                getStyle = elem.currentStyle ? function (name) {
                    var val = elem.currentStyle[name];

                    if (name === 'height' && val.search(/px/i) !== 1) {
                        var rect = elem.getBoundingClientRect();
                        return rect.bottom - rect.top -
                            parseFloat(getStyle('paddingTop')) -
                            parseFloat(getStyle('paddingBottom')) + 'px';
                    }
                    ;

                    return val;
                } : function (name) {
                    return getComputedStyle(elem, null)[name];
                },
                minHeight = parseFloat(getStyle('height'));

            elem.style.resize = 'none';

            var change = function () {
                var scrollTop, height,
                    padding = 0,
                    style = elem.style;

                if (elem._length === elem.value.length) return;
                elem._length = elem.value.length;

                if (!isFirefox && !isOpera) {
                    padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
                }
                ;
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                elem.style.height = minHeight + 'px';
                if (elem.scrollHeight > minHeight) {
                    if (maxHeight && elem.scrollHeight > maxHeight) {
                        height = maxHeight - padding;
                        style.overflowY = 'auto';
                    } else {
                        height = elem.scrollHeight - padding;
                        style.overflowY = 'hidden';
                    }
                    ;
                    style.height = height + extra + 'px';
                    scrollTop += parseInt(style.height) - elem.currHeight;
                    document.body.scrollTop = scrollTop;
                    document.documentElement.scrollTop = scrollTop;
                    elem.currHeight = parseInt(style.height);
                }
                ;
            };

            addEvent('propertychange', change);
            addEvent('input', change);
            addEvent('focus', change);
            change();
        },

        /**
         * 转义文本中的 HTML 部分实体符号，用在富文本编辑器保存时
         * @param str
         * @returns {*}
         */
        decodeHTMLEntity:function(str) {
            var reg1 = /&lt;a( .*?)&gt;(.*?)&lt;\/a&gt;/g;
            // var str1 = ;
            return str.replace(reg1, '<a$1>$2</a>');
            // var entities = [
            //     { entity: '&amp;', character: '&' },
            //     { entity: '&lt;', character: '<' },
            //     { entity: '&gt;', character: '>' },
            //     { entity: '&nbsp;', character: ' ' },
            //     { entity: '&#39;', character: '\'' },
            //     { entity: '&#quot;', character: '\"' }
            // ];
            // var htmlStr = str || '';
            // entities.forEach(({ entity, character }) => {
            //     var reg = new RegExp(entity, 'g');
            //     htmlStr = htmlStr.replace(reg, character);
            // })
            // return htmlStr;
        },
        transformTime:function(date, isTimeStamp) {
            var time;
            if (!date) {
                return '-';
            }
            try {
                if (isTimeStamp) {
                    time = new Date(Number(date));
                } else {
                    time = new Date(date);
                }
                if (time.toString() === 'Invalid Date') {
                    throw new Error('不合法日期');
                }
            } catch (e) {
                return '-';
            }
            time = time.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            // 有时候格式化出来的年月日和时间之间没有空格，需要在时间和日期之间加空格
            if (!time.includes(' ')) {
                var index = removeYearAndSecond ? 5 : 10;
                time = time.slice(0, index) + ' ' + time.slice(index);
            }
            var dateTime = time.split(' ');
            if (dateTime[1] && dateTime[1].startsWith('24')) {
                dateTime[1] = dateTime[1].replace('24', '00');
                time = dateTime.join(' ');
            }
            return time.replace(/\//g, '-');
        }
    }
}
);
