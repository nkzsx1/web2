
define('lib/requirejs/css.min!components/waterMarks/waterMark',[],function(){});
define('waterMarksNew',['jquery', 'lib/requirejs/css.min!components/waterMarks/waterMark.css'],
    function ($) {
        var VERSION = '1.16.3';
        window.watermarkdivs = [];
        var waterMark = function (container, param) {
            this.elem = container;
            this.options = $.extend({
                docWidth: $(document).width(), //文档宽度
                docHeight: $(document).height(), //文档高度
                fontStyle: "normal 24px 微软雅黑", //字体样式
                rotateAngle: -30 * Math.PI / 180, //旋转角度
                fontColor: "rgba(138,139,140,0.8)", //字体颜色
                htmlOpacity: 1,
                width: 270, //每行水印文字的水平间距
                height: 234, //水印文字的高度间距（低于文字高度会被替代）
                watermark_x: 20, //水印起始位置x轴坐标
                watermark_y: 120, //水印起始位置Y轴坐标
                watermark_rows: 0, //水印行数
                watermark_cols: 0, //水印列数
                watermark_x_space: 100, //水印x轴间隔
                watermark_y_space: 50, //水印y轴间隔
                watermark_alpha: 1, //水印透明度，要求设置在大于等于0.003
                watermark_width: 240, //水印宽度
                watermark_height: 70, //水印长度
                watermark_angle: 30, //水印倾斜度数
            }, param)
            // add by zhanglizhao
            // if (_canvasSupport()) {
            //   // PointerEventsPolyfillSingleton({selector:"#repeat-watermark"})
            //   this._canvas();
            // } else {
            //   this._IE8();
            // }
            //判断是否是ie11以下 note by zhanglizhao
            var userAgent = navigator.userAgent;
            var isIE8 = userAgent.indexOf("MSIE 8.0") > -1;
            var isIE9 = userAgent.indexOf("MSIE 9.0") > -1;
            var isIE10 = userAgent.indexOf("MSIE 10.0") > -1;

            // this._background();
            // return
            if(isIE8) {
                // return;

            }else if (isIE9 || isIE10) {
                this._background();
                // this.opacity(this.elem[0].children,false)
            } else {
                this._background();
                // this._canvas();
            }

        }
        $.extend(waterMark.prototype, {
            version: VERSION,
            _IE8: function () {
                if (arguments.length === 1 && typeof arguments[0] === "object") {
                    var src = arguments[0] || {};
                    for (key in src) {
                        if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key])
                            continue;
                        else if (src[key])
                            defaultSettings[key] = src[key];
                    }
                }

                if (window.watermarkdivs && window.watermarkdivs.length > 0) {
                    this.elem[0].removeChild(document.getElementById("waterMark"));
                    window.watermarkdivs = [];
                }
                var defaultSettings = this.options

                //获取页面最大宽度
                var page_width = Math.max(this.elem[0].scrollWidth, this.elem[0].clientWidth);
                //获取页面最大长度
                var page_height = Math.max(this.elem[0].scrollHeight, this.elem[0].clientHeight);

                // 创建文档碎片
                var oTemp = document.createDocumentFragment();
                //创建水印外壳div
                var otdiv = document.getElementById("waterMark");

                if (!otdiv) {
                    otdiv = document.createElement('div');
                    otdiv.id = "waterMark";
                    otdiv.style.pointerEvents = "none";
                    this.elem[0].appendChild(otdiv);
                }
                var waterBackDrop = document.getElementById("waterBackDrop");

                if (!waterBackDrop) {
                    waterBackDrop = document.createElement('div');
                    waterBackDrop.id = "waterBackDrop";
                    waterBackDrop.style.pointerEvents = "none";
                    this.elem[0].appendChild(waterBackDrop);
                }

                //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
                if (defaultSettings.watermark_cols == 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) > page_width)) {
                    defaultSettings.watermark_cols = parseInt((page_width - defaultSettings.watermark_x + defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space));
                    defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1));
                }
                //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
                if (defaultSettings.watermark_rows == 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {
                    defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
                    var watermarkRow;
                    if (defaultSettings.watermark_rows <= 1) {
                        watermarkRow = defaultSettings.watermark_rows
                    } else {
                        watermarkRow = defaultSettings.watermark_rows - 1;
                    }
                    // defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1));
                    defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (watermarkRow));
                }

                var x;
                var y;
                for (var i = 0; i < defaultSettings.watermark_rows; i++) {
                    y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
                    for (var j = 0; j < defaultSettings.watermark_cols; j++) {
                        x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;

                        var mask_div = document.createElement('div');
                        var oText = document.createTextNode(defaultSettings.texts);
                        mask_div.appendChild(oText);
                        // 设置水印相关属性start
                        mask_div.id = 'mask_div' + i + j;
                        mask_div.onselectstart = "return false";

                        mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";

                        mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                        mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                        mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                        mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                        mask_div.style.visibility = "";
                        mask_div.style.position = "absolute";
                        mask_div.style.left = x + 'px';
                        //ie8兼容top写法
                        if (navigator.userAgent.indexOf("MSIE 8.0") > -1) {
                            mask_div.style.top = y;
                        } else {
                            mask_div.style.top = y + 'px';
                        }
                        // mask_div.style.top = y;
                        mask_div.style.overflow = "hidden";
                        mask_div.style.zIndex = "-9999";
                        mask_div.style.opacity = defaultSettings.watermark_alpha;
                        mask_div.style.font = defaultSettings.fontStyle;
                        mask_div.style.color = defaultSettings.fontColor.indexOf('rgba') > -1 ? '' : defaultSettings.fontColor;
                        mask_div.style.textAlign = "center";
                        mask_div.style.width = defaultSettings.watermark_width + 'px';
                        mask_div.style.height = defaultSettings.watermark_height + 'px';
                        mask_div.style.display = "block";
                        //设置水印div倾斜显示
                        mask_div.style.filter = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=0.96593, M12=0.25882, M21=-0.25882, M22=0.96593)";
                        // mask_div.style.filter = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=0.96593, M12=0.25882, M21=-0.25882, M22=0.96593) progid:DXImageTransform.Microsoft.Alpha(opacity=" + defaultSettings.watermark_alpha * 100 + ")";
                        //逆时针旋转45度：progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=0.70710678118655, M12=0.70710678118655, M21=-0.70710678118655, M22=0.70710678118655);
                        //设置水印相关属性end
                        //附加到文档碎片中
                        otdiv.appendChild(mask_div);
                        otdiv.style.cursor = "default";
                        window.watermarkdivs.push(otdiv); //控制页面大小变化时水印字体
                    };
                };
                //一次性添加到document中
                this.elem[0].appendChild(oTemp);
                opacity.call(this, this.elem[0].children, true);
            },
            _canvas: function () {
                var tpl = '<canvas id = "watermark" ></canvas>' + '<canvas id = "repeat-watermark"></canvas>';
                this.elem.append(tpl);
                _draw.call(this, this.options.docWidth, this.options.docHeight);
                _event.call(this);
            },
            _background: function () {
                // note by zhanglizhao ,ie9 ie10 改成採用svg畫水印
                // var opt = {
                //   canvas: []
                // }
                // $.extend(this.options, opt);
                // var $body = $('body'),
                //   can1 = __createCanvas.call(this, $body),
                //   can2 = __createCanvas.call(this, $body),
                //   canAll = __createCanvas.call(this, $body),
                //   settings = this.options;
                // settings.deg = settings.rotateAngle;
                // if (can1.getContext) {
                //   __calcTextSize.call(this, $body);
                //   var repeatTimes = Math.ceil(screen.width / settings.width);
                //   settings.canvasWidth = settings.canvasWidth * repeatTimes;
                //   var extTxts = [];
                //   while (repeatTimes--) extTxts = extTxts.concat(settings.txts);
                //   settings.txts = extTxts;
                //
                //   var fixH = settings.maxWidth * Math.abs(Math.sin(settings.deg)) + Math.cos(settings.deg) * settings.textHeight;
                //   if (fixH > settings.height) settings.height = fixH;
                //   var ctx1 = __setCanvasStyle.call(this, can1, settings.canvasWidth, settings.height);
                //   var ctx2 = __setCanvasStyle.call(this, can2, settings.canvasWidth, settings.height);
                //   var ctx = __setCanvasStyle.call(this, canAll, settings.canvasWidth, settings.height * 2, true);
                //
                //   __drawText.call(this, ctx1, settings.txts);
                //   __drawText.call(this, ctx2, settings.txts.reverse());
                //
                //   //合并canvas
                //   ctx.drawImage(can1, 0, 0, settings.canvasWidth, settings.height);
                //   ctx.drawImage(can2, 0, settings.height, settings.canvasWidth, settings.height);
                //   var dataURL = canAll.toDataURL("image/png");
                //   $(this.elem).css('backgroundImage', "url(" + dataURL + ")");
                // } else {
                //   this._IE8()
                // }

                //this.__destory();
                var options=this.options;
                var $body = $("body");
                var style = "position: fixed;left: 0;right: 0; bottom: 0;pointer-events:none; top: 85px;z-index: 888;";
                var $s=function(elem){
                    return $(
                        document.createElementNS("http://www.w3.org/2000/svg", elem)
                    );
                };
                if($("svg#repeat-watermark").length){return }
                var $svg = $s("svg");
                $svg.attr({
                    width: "100%",
                    style: style,
                    id:"repeat-watermark",
                    "pointer-events":"none",
                    height: "100%"
                });
                $svg.on(['click', 'dblclick', 'mousedown', 'mouseup'].join(' '),function(e){
                    var origDisplayAttribute = $(this).css('display');
                    $(this).css('display', 'none');

                    var underneathElem = document.elementFromPoint(
                        e.clientX,
                        e.clientY);

                    if (origDisplayAttribute){
                        $(this).css('display', origDisplayAttribute);
                    } else{
                        $(this).css('display', '');
                    }
                    e.target = underneathElem;
                    $(underneathElem).trigger(e);

                    return false;
                });
                var getTextEle = function (option) {
                    var $text = $s("text");
                    var $tspan1 = $s("tspan");
                    var $tspan2 = $s("tspan");
                    $text.attr({
                        x: option.x,
                        y: option.y,
                        fill: "#000",
                        fontStyle:options.fontStyle,
                        "pointer-events":"none",
                        "fill-opacity": "0.2",
                        transform:"rotate(-30 120,40)",
                        "font-size": "14"
                    });
                    $tspan1.attr({
                        x: option.x,
                        y: option.y,
                    });
                    $tspan2.attr({
                        x: option.x,
                        y: option.y + 16,
                    });
                    var text_line_one = option.content.split('\n');
                    
                    $tspan1.append(text_line_one[0]);
                    $tspan2.append(text_line_one[1]);
                    // $text.append(option.content);
                    $text.append($tspan1);
                    $text.append($tspan2);
                    return $text;
                };
                var xNum = Math.ceil(options.docWidth / options.watermark_width)+1;
                var yNum = Math.ceil(options.docHeight / options.watermark_height)+1;
                for (var x = 0; x < xNum; x++) {
                    for (var y = 0; y < yNum; y++) {
                        var curY =(y) * 150;
                        var curX =(x) * 250;
                        var jiaodu= (2*Math.PI / 360) *30;
                        $svg.append(
                            getTextEle({
                                x: curX- Math.sin( jiaodu )*curY,
                                y: curY,
                                content:options.texts,
                            })
                        );
                    }
                }
                $body.append($svg);
            }
        })
        var opacity = function (data, isIE8) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id !== "waterMark" && data[i].id !== "waterBackDrop") {
                    if (isIE8) {
                        data[i].style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + this.options.htmlOpacity * 100 + ')'
                    } else {
                        data[i].style.opacity = this.options.htmlOpacity;
                    }
                    // isIE8?data[i].style.filter= 'progid:DXImageTransform.Microsoft.Alpha(opacity='+this.options.htmlOpacity*100+')':data[i].style.opacity=this.options.htmlOpacity;
                    // if(data[i].children) {
                    //   this.opacity(data[i].children,isIE8)
                    // }
                }
            }
        };
        var _draw = function (docWidth, docHeight) {
            var opt = {
                canvas: []
            }
            $.extend(this.options, opt);
            var cw = $('#watermark')[0],
                crw = $('#repeat-watermark')[0],
                settings = this.options;
            crw.width = docWidth;
            crw.height = docHeight;
            settings.deg = settings.rotateAngle; //js里的正弦余弦用的是弧度
            __calcTextSize.call(this, this.elem);
            var repeatTimes = Math.ceil(screen.width / settings.width);
            settings.canvasWidth = settings.canvasWidth * repeatTimes;
            var extTxts = [];
            while (repeatTimes--) extTxts = extTxts.concat(settings.txts);
            settings.txts = extTxts;
            var fixH = settings.maxWidth * Math.abs(Math.sin(settings.deg)) + Math.cos(settings.deg) * settings.textHeight;
            if (fixH > settings.height) settings.height = fixH;
            var ctx1 = __setCanvasStyle.call(this, cw, settings.canvasWidth, settings.height);
            __drawText.call(this, ctx1, settings.txts);
            var ctxr = crw.getContext("2d");
            ctxr.clearRect(0, 0, crw.width, crw.height);
            var pat = ctxr.createPattern(cw, "repeat");
            ctxr.fillStyle = pat;
            ctxr.fillRect(0, 0, crw.width, crw.height);
        }
        var __createCanvas = function ($container) {
            var _this = this;
            var canvas = document.createElement('canvas');
            $container.append(canvas);
            _this.options.canvas.push(canvas);
            return canvas;
        };
        var __calcTextSize = function ($container) {
            var txts = [],
                maxWidth = 0,
                canvasWidth = 0,
                settings = this.options;
            var text = settings.texts;
            // $.each(settings.texts, function (i, text) {
            var span = $('<span style="font:' + settings.fontStyle + ';visibility: hidden;display: inline-block;"> ' + text + '</span>')
                .appendTo($container);
            var tWidth = span[0].offsetWidth,
                tHeight = span[0].offsetHeight;
            span.remove();
            txts.push({
                txt: text,
                width: tWidth,
                height: tHeight
            });
            maxWidth = Math.max(maxWidth, tWidth);
            settings.textHeight = tHeight;
            var shadow = Math.cos(settings.deg) * tWidth;
            canvasWidth += (settings.width < shadow ? shadow : settings.width) - tHeight * Math.sin(settings.deg);
            // });
            settings.txts = txts;
            settings.maxWidth = maxWidth;
            settings.canvasWidth = canvasWidth;
        };
        var __setCanvasStyle = function (canvas, width, height, notextstyle) {
            canvas.width = width;
            canvas.height = height;
            canvas.style.display = 'none';

            var ctx = canvas.getContext('2d');
            if (!notextstyle) {
                var deg = this.options.deg,
                    absSindeg = Math.abs(Math.sin(deg));
                ctx.rotate(deg);
                //基于视窗的 x、y偏移量
                var offset = absSindeg * this.options.height - this.options.textHeight * absSindeg;
                var nx = -offset * Math.cos(deg),
                    ny = -offset * absSindeg;
                ctx.translate(nx, ny * absSindeg);

                ctx.font = this.options.fontStyle;
                ctx.fillStyle = this.options.fontColor;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'Middle';
            }
            return ctx;
        };
        var __drawText = function (ctx, txts) {
            var settings = this.options;
            $.each(txts, function (i, obj) {

                var wnap = (settings.maxWidth - obj.width) / 2;
                var x = settings.width * Math.cos(settings.deg) * i,
                    y = -x * Math.tan(settings.deg) + settings.height;
                ctx.fillText(obj.txt, x + wnap, y);
            });
        }
        var __destory = function () {
            $.each(this.options.canvas, function (i, canvas) {
                canvas.remove();
                canvas = null;
            });
        }
        var _event = function () {
            var _this = this;
            $(window).resize(function () {
                var w = $(document).width();
                var h = $(document).height();
                _draw.call(_this, w, h);
            })
        }
        var _canvasSupport = function () {
            return !!document.createElement('canvas').getContext;
        }

        return waterMark;

    });

(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})
('#repeat-watermark {\r\n  position: fixed;\r\n  left: 0px;\r\n  top: 0px;\r\n  /* height: 100%; */\r\n  overflow: hidden;\r\n  z-index: 9999;\r\n  pointer-events: none;\r\n  opacity: 1;\r\n  font-size: 15px;\r\n  font-family: 微软雅黑;\r\n  color: white;\r\n  text-align: center;\r\n  display: block;\r\n}\r\n#waterBackDrop {\r\n  position: fixed;\r\n  top: 0;\r\n  bottom: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n  background-color: #fff;\r\n  display: block;\r\n  z-index: -1;\r\n  overflow: hidden;\r\n  opacity: 0.8;\r\n  -khtml-opacity:0.8;\r\n  -moz-opacity:0.8;\r\n  filter:alpha(opacity=80);\r\n  filter:\"alpha(opacity=80)\";\r\n  filter: progid:DXImageTransform.Microsoft.Alpha(opacity=80);\r\n  color: white;\r\n}');
