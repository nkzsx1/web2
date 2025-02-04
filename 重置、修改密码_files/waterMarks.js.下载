
(function (root, factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.WaterMark = factory();
  }
}(this, function () {
  var VERSION = '${{version}}';
  window.watermarkdivs = [];

  if (typeof Object.assign != 'function') {
    Object.assign = function (target) {
      'use strict';
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      target = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source != null) {
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
      }
      return target;
    };
  }

  if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (className, element) {
      var children = (element || document).getElementsByTagName("*");
      var elements = [];
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        var classNames = child.className.split(" ");
        for (var j = 0; j < classNames.length; j++) {
          var cls = classNames[j];
          if (cls == className) {
            elements.push(child);
            break;
          }
        }
      }
      return elements;
    }
  }

  function isDom(item) {
    var isdom = true;
    if (typeof HTMLElement === 'function') {
      isdom = item instanceof HTMLElement;
    } else {
      isdom = (item && (typeof item === 'object') && (item.nodeType === 1) && (typeof item.nodeName === 'string'));
    }
    return isdom;
  }

  var waterMark = function (container, param) {
    if (!isDom(container)) {
      console.error('请传入正确的DOM节点~~');
      return;
    }
    this.elem = container;
    var dww = this.elem.scrollWidth;
    var www = document.body.clientWidth;
    var ww = (dww > 5000) ? www : dww;
    // 获取节点位置
    var elemPos = this.elem.getBoundingClientRect();
    // 默认配置项
    var config = {
      docLeft: elemPos.left,
      docTop: elemPos.top,
      docWidth: ww, //文档宽度
      docHeight: this.elem.scrollHeight, //文档高度
      fontStyle: "normal 24px 黑体",           //字体样式
      rotateAngle: -30 * Math.PI / 180,  //旋转角度
      fontColor: "rgba(153,153,153,0.8)",  //字体颜色
      htmlOpacity: 1,
      width: 110, //每行水印文字的水平宽度，canvas使用
      height: 234, //水印文字的高度，canvas使用
      initX: 20,//水印起始位置x轴坐标，目前只有ie8使用
      initY: 120,//水印起始位置Y轴坐标，目前只有ie8使用
      rows: 0,//水印行数，目前只有ie8使用，若设置则必须大于0
      cols: 0,//水印列数，目前只有ie8使用，若设置则必须大于0
      spaceX: 100,//水印x轴间隔
      spaceY: 50,//水印y轴间隔
      alpha: 1,//水印透明度，要求设置在大于等于0.003
      textsWidth: 110,//水印宽度，目前只有ie8使用
      textsHeight: 234,//水印高度，目前只有ie8使用
      textSpace: 20,// 水印多行文本间隔
      textBreakLine: false, // 水印文本是否折行，默认不折行，不折行宽度则无效
      texts: '', // 水印文本，扩充功能，可传入数组，数组中为多行文本
      angle: 30,//水印倾斜度数，目前只有ie8使用
      zIndex: 9999,// canvas水印的默认层级
      showType: 'fixed'// 水印展示形式， 可选项：fixed（水印和容器大小一致，浏览器绝对定位-不随滚动条移动）、absolute（水印和容器大小一致，节点绝对定位-随滚动条移动）、visibleFixed（水印大小为容器在浏览器可视区域的大小，浏览器可视区域绝对定位-不随滚动条移动）、areaFixed（区域定位-容器左上角到浏览器右下角区域浏览器定位-不随滚动条移动），只适用于canvas实现，即不适用于ie11以下浏览器
      // watermark_x: 20,//水印起始位置x轴坐标
      // watermark_y: 120,//水印起始位置Y轴坐标
      // watermark_rows: 0,//水印行数
      // watermark_cols: 0,//水印列数
      // watermark_x_space: 100,//水印x轴间隔
      // watermark_y_space: 50,//水印y轴间隔
      // watermark_alpha: 1,//水印透明度，要求设置在大于等于0.003
      // watermark_width: 240,//水印宽度
      // watermark_height: 70,//水印长度
      // watermark_angle: 30,//水印倾斜度数
      // watermark_zindex: 9999, // canvas水印的默认层级
      // watermark_position: 'fixed', // 水印布局， 可选项：fixed，absolute，只适用于canvas实现，即不适用于ie11以下浏览器
      // watermark_area: false, // 容器中水印固定在屏幕可视区域中，不适用于ie11以下浏览器
    };

    // 兼容之前配置项处理
    var relation = {
      "watermark_x": "initX",
      "watermark_y": "initY",
      "watermark_rows": "rows",
      "watermark_cols": "cols",
      "watermark_x_space": "spaceX",
      "watermark_y_space": "spaceY",
      "watermark_alpha": "alpha",
      "watermark_width": "textsWidth",
      "watermark_height": "textsHeight",
      "watermark_angle": "angle",
      "watermark_zindex": "zIndex",
      "watermark_position": "showType",
      "watermark_area": "showType"
    };

    for (var k in relation) {
      var v = param[k];
      if (v !== undefined) {
        // 特殊处理 watermark_area
        if (k == "watermark_area") {
          param[relation[k]] = "visibleFixed";
        } else {
          param[relation[k]] = v;
        }
      }
    }

    this.options = Object.assign(config, param);


    //判断是否是ie11以下
    var userAgent = navigator.userAgent;
    var isIE8 = userAgent.indexOf("MSIE 8.0") > -1;
    var isIE9 = userAgent.indexOf("MSIE 9.0") > -1;
    var isIE10 = userAgent.indexOf("MSIE 10.0") > -1;
    if (isIE8) {
      // return;
      this._IE8();
      this.options.flag = 'ie8';
    } else if (isIE9 || isIE10) {
      this._background();
      this.options.flag = 'ie910';
      // this.opacity(this.elem[0].children,false)
    } else {
      this._canvas();
      this.options.flag = 'other';
    }

  }

  Object.assign(waterMark.prototype, {
    version: VERSION,
    _IE8: function () {
      if (arguments.length === 1 && typeof arguments[0] === "object") {
        var src = arguments[0] || {};
        for (var key in src) {
          if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key])
            continue;
          else if (src[key])
            defaultSettings[key] = src[key];
        }
      }

      var defaultSettings = this.options
      var txts = [];
      // 单行文本，多行文本，texts扩充功能，可以传入数组多行文本
      if (typeof defaultSettings.texts == 'string') {
        // 添加是否自动折行的配置
        if (defaultSettings.textBreakLine) {
          // 自动折行，则宽度为设定宽度
        } else {
          // 不折行，则宽度为实际文本的最大宽度
          var span = document.createElement('span');
          span.style.font = defaultSettings.fontStyle;
          span.style.visibility = 'hidden';
          span.style.display = 'inline-block';
          span.style.whiteSpace = 'nowrap';
          span.innerText = defaultSettings.texts;
          this.elem.appendChild(span);
          var tWidth = span.offsetWidth, // 水印文本的宽度
            tHeight = span.offsetHeight; // 水印文本的高度
          this.elem.removeChild(span);
          defaultSettings.textsWidth = tWidth;
          defaultSettings.textsHeight = tHeight + defaultSettings.textSpace;
        }
        txts.push(defaultSettings.texts);
      } else if (typeof defaultSettings.texts == "object" && Object.prototype.toString.call(defaultSettings.texts) == "[object Array]") {
        // 添加是否自动折行的配置
        if (defaultSettings.textBreakLine) {
          // 自动折行，则宽度为设定宽度
        } else {
          // 不折行，则宽度为实际文本的最大宽度
          var maxWidth = defaultSettings.textsWidth;
          var textsHeight = 0;
          for (var j = 0; j < defaultSettings.texts.length; j++) {
            var txt = defaultSettings.texts[j];
            var span = document.createElement('span');
            span.style.font = defaultSettings.fontStyle;
            span.style.visibility = 'hidden';
            span.style.display = 'inline-block';
            span.style.whiteSpace = 'nowrap';
            span.innerText = txt;
            this.elem.appendChild(span);
            var tWidth = span.offsetWidth, // 水印文本的宽度
              tHeight = span.offsetHeight; // 水印文本的高度
            this.elem.removeChild(span);
            maxWidth = Math.max(maxWidth, tWidth);
            textsHeight += tHeight;
          }
          defaultSettings.textsWidth = maxWidth;
          defaultSettings.textsHeight = textsHeight + (defaultSettings.texts.length - 1) * defaultSettings.textSpace;
        }
        txts = defaultSettings.texts;
      } else {
        // 数据格式错误
        console.error('请传入正确的文本参数格式');
        return;
      }

      // if (window.watermarkdivs && window.watermarkdivs.length > 0) {
      var d = document.getElementsByClassName("waterMark", this.elem)[0];
      if (d) {
        this.elem.removeChild(d);
      }
      //   window.watermarkdivs = [];
      // }

      //获取页面最大宽度
      var page_width = Math.max(this.elem.scrollWidth, this.elem.clientWidth);
      //获取页面最大长度
      var page_height = Math.max(this.elem.scrollHeight, this.elem.clientHeight);

      // 创建文档碎片
      var oTemp = document.createDocumentFragment();
      //创建水印外壳div
      var otdiv = document.getElementsByClassName("waterMark", this.elem)[0];

      if (!otdiv) {
        otdiv = document.createElement('div');
        // otdiv.id = "waterMark";
        otdiv.setAttribute("class", "waterMark");
        otdiv.style.pointerEvents = "none";
        this.elem.appendChild(otdiv);
      }
      // ie8的遮罩层，只需一个放到body中
      var waterBackDrop = document.getElementsByClassName("waterBackDrop")[0];

      if (!waterBackDrop) {
        waterBackDrop = document.createElement('div');
        // waterBackDrop.id = "waterBackDrop";
        waterBackDrop.setAttribute("class", "waterBackDrop");
        waterBackDrop.setAttribute("style", "position: fixed;top: 0px;bottom: 0;width: 100%;height: 100%;background-color: #fff;display: block;z-index: -1;overflow: hidden;opacity: 0.8;-khtml-opacity:0.8;-moz-opacity:0.8;filter:alpha(opacity=80);filter:'alpha(opacity=80)';filter: progid:DXImageTransform.Microsoft.Alpha(opacity=80);color: white;pointerEvents: none;");
        // waterBackDrop.style. = "none";
        document.body.appendChild(waterBackDrop);
      }

      //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
      // 将此逻辑进行调整，每一次都重新计算有多少列，主要用于容器高宽更改重新刷新水印

      // 如果ie8设定了显示的行数和列数，如果行数或者列数超过了区域则需要重新计算列数和行数
      // 计算的可显示的水印列数
      var waterMarkSpaceX = defaultSettings.spaceX;
      var waterMarkCols = parseInt((page_width - defaultSettings.initX) / (defaultSettings.textsWidth + waterMarkSpaceX));
      if(defaultSettings.cols){
        // 如果设置了水印列数
        if(waterMarkCols > defaultSettings.cols){
          waterMarkCols = defaultSettings.cols;
          // 如果列数正好为1，则避免之前除数为0的问题，则进行判断
          if(waterMarkCols > 1){
            // 如果列数大于1则重新计算x轴间距，设置spaceX无效
            waterMarkSpaceX = parseInt((page_width - defaultSettings.initX - defaultSettings.textsWidth * waterMarkCols) / (waterMarkCols - 1));
          } else {
            waterMarkCols = 1;
          }
        }
      }
      var waterMarkSpaceY = defaultSettings.spaceY;
      var waterMarkRows = parseInt((page_height - defaultSettings.initY) / (defaultSettings.textsHeight + waterMarkSpaceY));
      if(defaultSettings.rows){
        // 如果设置了水印行数
        if(waterMarkRows > defaultSettings.rows){
          waterMarkRows = defaultSettings.rows;
          // 如果行数正好为1，则避免之前除数为0的问题，则进行判断
          if(waterMarkRows > 1){
            // 如果行数大于1则重新计算x轴间距，设置spaceX无效
            waterMarkSpaceY = parseInt((page_height - defaultSettings.initY - defaultSettings.textsHeight * waterMarkRows) / (waterMarkRows - 1));
          } else {
            waterMarkRows = 1;
          }
        }
      }
      // if (defaultSettings.cols == 0 || (parseInt(defaultSettings.initX + defaultSettings.textsWidth * defaultSettings.cols + defaultSettings.spaceX * (defaultSettings.cols - 1)) > page_width)) {
      // defaultSettings.cols = parseInt((page_width - defaultSettings.initX) / (defaultSettings.textsWidth + defaultSettings.spaceX));
      // defaultSettings.cols = parseInt((page_width - defaultSettings.initX + defaultSettings.spaceX) / (defaultSettings.textsWidth + defaultSettings.spaceX));
      // if (defaultSettings.cols != 1) {
      //   defaultSettings.spaceX = parseInt((page_width - defaultSettings.initX - defaultSettings.textsWidth * defaultSettings.cols) / (defaultSettings.cols - 1));
      // }
      // }
      //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
      // 将此逻辑进行调整，每一次都重新计算有多少列，主要用于容器高宽更改重新刷新水印
      // if (defaultSettings.rows == 0 || (parseInt(defaultSettings.initY + defaultSettings.textsHeight * defaultSettings.rows + defaultSettings.spaceY * (defaultSettings.rows - 1)) > page_height)) {
      // defaultSettings.rows = parseInt((page_height - defaultSettings.initY) / (defaultSettings.textsHeight + defaultSettings.spaceY));
      // defaultSettings.rows = parseInt((defaultSettings.spaceY + page_height - defaultSettings.initY) / (defaultSettings.textsHeight + defaultSettings.spaceY));
      var watermarkRow;
      if (defaultSettings.rows <= 1) {
        watermarkRow = defaultSettings.rows
      } else {
        watermarkRow = defaultSettings.rows - 1;
      }
      // defaultSettings.spaceY = parseInt(((page_height - defaultSettings.initY) - defaultSettings.textsHeight * defaultSettings.rows) / (defaultSettings.rows - 1));
      // defaultSettings.spaceY = parseInt(((page_height - defaultSettings.initY) - defaultSettings.textsHeight * defaultSettings.rows) / (watermarkRow));
      // }

      var x;
      var y;
      for (var i = 0; i < waterMarkRows; i++) {
        // y添加节点的top值
        y = this.options.docTop + defaultSettings.initY + (waterMarkSpaceY + defaultSettings.textsHeight) * i;
        for (var j = 0; j < waterMarkCols; j++) {
          x = this.options.docLeft + defaultSettings.initX + (defaultSettings.textsWidth + waterMarkSpaceX) * j;

          var mask_div = document.createElement('div');
          for (var k = 0; k < txts.length; k++) {
            var t = txts[k];
            var txt_div = document.createElement('div');
            txt_div.innerHTML = t;
            if (k != txts.length - 1) {
              txt_div.style.marginBottom = defaultSettings.textSpace + 'px';
            }
            mask_div.appendChild(txt_div);
          }
          // var oText = document.createTextNode(defaultSettings.texts);
          // mask_div.appendChild(oText);
          // 设置水印相关属性start
          // mask_div.id = 'mask_div' + i + j;
          mask_div.onselectstart = "return false";

          mask_div.style.webkitTransform = "rotate(-" + defaultSettings.angle + "deg)";

          mask_div.style.MozTransform = "rotate(-" + defaultSettings.angle + "deg)";
          mask_div.style.msTransform = "rotate(-" + defaultSettings.angle + "deg)";
          mask_div.style.OTransform = "rotate(-" + defaultSettings.angle + "deg)";
          mask_div.style.transform = "rotate(-" + defaultSettings.angle + "deg)";
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
          mask_div.style.opacity = defaultSettings.alpha;
          mask_div.style.font = defaultSettings.fontStyle;
          mask_div.style.color = defaultSettings.fontColor.indexOf('rgba') > -1 ? '' : defaultSettings.fontColor;
          // mask_div.style.textAlign = "center";
          mask_div.style.width = defaultSettings.textsWidth + 'px';
          mask_div.style.height = defaultSettings.textsHeight + 'px';
          mask_div.style.display = "block";
          //设置水印div倾斜显示
          mask_div.style.filter = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=0.96593, M12=0.25882, M21=-0.25882, M22=0.96593)";
          // mask_div.style.filter = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=0.96593, M12=0.25882, M21=-0.25882, M22=0.96593) progid:DXImageTransform.Microsoft.Alpha(opacity=" + defaultSettings.watermark_alpha * 100 + ")";
          //逆时针旋转45度：progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=0.70710678118655, M12=0.70710678118655, M21=-0.70710678118655, M22=0.70710678118655);
          //设置水印相关属性end
          //附加到文档碎片中
          otdiv.appendChild(mask_div);
          otdiv.style.cursor = "default";
          // window.watermarkdivs.push(otdiv); //控制页面大小变化时水印字体
        };
      };
      //一次性添加到document中
      this.elem.appendChild(oTemp);
      opacity.call(this, this.elem.children, true);
    },
    _canvas: function () {
      // 创建两个canvas节点，此节点隐藏
      var canvas1 = document.createElement("canvas");
      // canvas1.id = "watermark";
      canvas1.setAttribute("class", "watermark");
      // 此canvas真正的显示水印效果
      var canvas2 = document.createElement("canvas");
      // canvas2.id = "repeat-watermark";
      canvas2.setAttribute("class", "repeat-watermark");
      // 容器中水印固定在屏幕可视范围内
      if (this.options.showType == 'visibleFixed' || this.options.showType == 'areaFixed') {
        canvas2.setAttribute("style", "position: fixed;top: " + this.options.docTop + "px;left: " + this.options.docLeft + "px;overflow: hidden;z-index: " + this.options.zIndex + ";pointer-events: none;opacity: 1;font-size: 15px;font-family: 微软雅黑;color: white;text-align: center;display: block;");
      } else {
        canvas2.setAttribute("style", "position: " + this.options.showType + ";top: " + this.options.docTop + "px;left: " + this.options.docLeft + "px;overflow: hidden;z-index: " + this.options.zIndex + ";pointer-events: none;opacity: 1;font-size: 15px;font-family: 微软雅黑;color: white;text-align: center;display: block;");
      }
      this.elem.appendChild(canvas1);
      this.elem.appendChild(canvas2);
      // 容器中水印固定在屏幕可视范围内
      if (this.options.showType == 'visibleFixed') {
        var cwidth = (this.options.docWidth > (document.documentElement.clientWidth - this.options.docLeft)) ? document.documentElement.clientWidth - this.options.docLeft : this.options.docWidth;
        var cheight = (this.options.docHeight > (document.documentElement.clientHeight - this.options.docTop)) ? document.documentElement.clientHeight - this.options.docTop : this.options.docHeight;
        _draw.call(this, cwidth, cheight);
      } else if (this.options.showType == 'areaFixed') {
        _draw.call(this, document.documentElement.clientWidth - this.options.docLeft, document.documentElement.clientHeight - this.options.docTop);
      } else {
        _draw.call(this, this.options.docWidth, this.options.docHeight);
      }
      _event.call(this);
    },
    _background: function () {
      var opt = {
        canvas: []
      }
      Object.assign(this.options, opt);
      var jbody = this.elem,
        can1 = __createCanvas.call(this, jbody), // 创建canvas节点
        can2 = __createCanvas.call(this, jbody),
        canAll = __createCanvas.call(this, jbody),
        settings = this.options;
      // 旋转角度
      settings.deg = settings.rotateAngle;
      // 如果可以获取canvas绘画环境
      if (can1.getContext) {
        // 设置can1的样式
        __setCanvasStyle.call(this, can1);
        // 获取文本信息
        __calcTextSize.call(this, jbody, can1);
        // maxWidth为计算后的最大宽度
        var repeatTimes = Math.ceil(window.screen.width / (settings.maxWidth + settings.spaceX));
        settings.canvasWidth = (settings.canvasWidth + settings.spaceX) * repeatTimes;
        var extTxts = [];
        while (repeatTimes--) extTxts.push(settings.txts);
        settings.txts = extTxts;
        // 获取高度
        // var fixH = settings.maxWidth * Math.abs(Math.sin(settings.deg)) + Math.cos(settings.deg) * settings.textHeight;
        var fixH = settings.maxWidth * Math.abs(Math.cos(settings.deg)) + Math.abs(Math.sin(settings.deg)) * settings.textHeight;
        if (fixH > settings.height) settings.height = fixH;
        // 设置高宽之后设置样式
        can1.height = settings.height + settings.spaceY;
        can1.width = settings.canvasWidth;
        var ctx1 = __setCanvasStyle.call(this, can1);

        can2.height = settings.height + settings.spaceY;
        can2.width = settings.canvasWidth;
        var ctx2 = __setCanvasStyle.call(this, can2);

        canAll.width = settings.canvasWidth;
        canAll.height = (settings.height + settings.spaceY) * 2
        var ctx = __setCanvasStyle.call(this, canAll, true);

        __drawText.call(this, ctx1, settings.txts);
        __drawText.call(this, ctx2, settings.txts.reverse());

        //合并canvas
        ctx.drawImage(can1, 0, 0, settings.canvasWidth, settings.height + settings.spaceY);
        ctx.drawImage(can2, 0, settings.height + settings.spaceY, settings.canvasWidth, settings.height + settings.spaceY);
        var dataURL = canAll.toDataURL("image/png");
        // this.elem.css('backgroundImage', "url(" + dataURL + ")");
        this.elem.style.backgroundImage = "url(" + dataURL + ")";
      } else {
        this._IE8()
      }
    },

    refresh: function () {
      var dw = this.elem.scrollWidth;
      var ww = document.body.clientWidth;
      var w = (dw > 5000) ? ww : dw;
      var h = document.body.scrollHeight;
      switch (this.options.flag) {
        case 'ie8':
          this._IE8();
          break;
        case 'ie910':
          this._background();
          break;
        case 'other':
          _draw.call(this, w, h);
          break;
        default:
          break;
      }
    },
    destroy: function () {
      switch (this.options.flag) {
        case 'ie8':
          var cw = document.getElementsByClassName('waterMark', this.elem)[0];
          this.elem.removeChild(cw);
          // 外层遮罩
          var cws = document.getElementsByClassName('waterMark');
          if (cws.length == 0) {
            var drop = document.getElementsByClassName('waterBackDrop')[0];
            document.body.removeChild(drop);
          }
          break;
        case 'ie910':
          this.elem.style.backgroundImage = '';
          break;
        case 'other':
          var cw = this.elem.getElementsByClassName('watermark')[0],
            crw = this.elem.getElementsByClassName('repeat-watermark')[0];
          this.elem.removeChild(cw);
          this.elem.removeChild(crw);
          break;
        default:
          break;
      }
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
      }
    }
  };
  /**
   * 绘制canvas水印
   * @param {number} docWidth canvas宽度
   * @param {number} docHeight canvas高度
   */
  var _draw = function (docWidth, docHeight) {
    var opt = {
      canvas: []
    }
    Object.assign(this.options, opt);
    var cw = this.elem.getElementsByClassName('watermark')[0],
      crw = this.elem.getElementsByClassName('repeat-watermark')[0],
      settings = this.options;
    // 设定canvas高宽
    crw.width = docWidth;
    crw.height = docHeight;
    // 旋转角度
    settings.deg = settings.rotateAngle; //js里的正弦余弦用的是弧度

    // 设置canvas的样式，确定获取的文本宽度正确
    __setCanvasStyle.call(this, cw);
    // 获取文本相关信息
    __calcTextSize.call(this, this.elem, cw);
    // 画一屏文本只有一行
    var repeatTimes = Math.ceil(window.screen.width / (settings.maxWidth + settings.spaceX));
    settings.canvasWidth = (settings.spaceX + settings.canvasWidth) * repeatTimes;
    var extTxts = [];
    while (repeatTimes--) extTxts.push(settings.txts);
    settings.txts = extTxts;
    // 文本旋转后的高度
    var fixH = settings.maxWidth * Math.abs(Math.cos(settings.deg)) + Math.abs(Math.sin(settings.deg)) * settings.textHeight;
    if (fixH > settings.height) settings.height = fixH;
    // 设置示例canvas的宽度
    cw.width = settings.canvasWidth;
    cw.height = settings.height + settings.spaceY;
    var ctx1 = __setCanvasStyle.call(this, cw);
    // 画一个范例，可以进行复制
    __drawText.call(this, ctx1, settings.txts);
    // 复制示例画图
    var ctxr = crw.getContext("2d");
    ctxr.clearRect(0, 0, crw.width, crw.height);
    var pat = ctxr.createPattern(cw, "repeat");
    ctxr.fillStyle = pat;
    ctxr.fillRect(0, 0, crw.width, crw.height);
  }
  /**
   * 创建canvas节点
   * @param {document} $container 节点容器
   */
  var __createCanvas = function ($container) {
    var _this = this;
    var canvas = document.createElement('canvas');
    $container.appendChild(canvas);
    _this.options.canvas.push(canvas);
    return canvas;
  };
  /**
   * 获取文本相关信息
   * @param {element} container 水印容器
   * @param {canvas} cv canvas节点
   */
  var __calcTextSize = function (container, cv) {
    var settings = this.options;
    var txts = [],
      maxWidth = settings.width,
      canvasWidth = 0;
    var text = settings.texts;
    var cvx = cv.getContext("2d");

    // 判断传入的水印文本的格式，字符串还是数组
    if (typeof text == 'string') {
      // 单行文本
      var span = document.createElement('span');
      span.style.font = settings.fontStyle;
      span.style.visibility = 'hidden';
      span.style.display = 'inline-block';
      span.style.whiteSpace = 'nowrap';
      span.innerText = text;
      container.appendChild(span);
      var tWidth = span.offsetWidth, // 水印文本的宽度
        tHeight = span.offsetHeight; // 水印文本的高度
      container.removeChild(span);
      // 设置为自动折行
      if (settings.textBreakLine) {
        // 文本宽度大于水印宽度，则折行
        if (tWidth > settings.width) {
          // 需要手动折行
          var lineWidth = 0;
          var lastSubStrIndex = 0;
          for (var k = 0; k < text.length; k++) {
            lineWidth += cvx.measureText(text[k]).width;
            if (lineWidth >= settings.width) {
              txts.push({
                txt: text.substring(lastSubStrIndex, k),
                width: lineWidth,
                height: tHeight
              });
              maxWidth = Math.max(maxWidth, lineWidth);
              lineWidth = 0;
              lastSubStrIndex = k;
            }
            if (k == text.length - 1) {
              txts.push({
                txt: text.substring(lastSubStrIndex, k + 1),
                width: lineWidth,
                height: tHeight
              });
              maxWidth = Math.max(maxWidth, lineWidth);
            }
          }
          tWidth = maxWidth;
          // 折行后所有文本的高度（包括折行间隔高度）
          settings.textHeight = tHeight * txts.length + settings.textSpace * (txts.length - 1);
        } else {
          txts.push({
            txt: text,
            width: tWidth,
            height: tHeight
          });
          maxWidth = Math.max(maxWidth, tWidth);
          settings.textHeight = tHeight;
        }
      } else {
        txts.push({
          txt: text,
          width: tWidth,
          height: tHeight
        });
        maxWidth = Math.max(maxWidth, tWidth);
        settings.textHeight = tHeight;
      }
      // 根据旋转角度，获取文本水平宽度
      var shadow = Math.cos(settings.deg) * tWidth;
      canvasWidth += shadow - tHeight * Math.sin(settings.deg);
      settings.txts = txts;
      settings.maxWidth = maxWidth;
      settings.canvasWidth = canvasWidth;
    } else if (typeof text == "object" && Object.prototype.toString.call(text) == "[object Array]") {
      // 多行文本
      var txtHeight = 0;
      for (var i = 0; i < text.length; i++) {
        var txt = text[i];
        var span = document.createElement('span');
        span.style.font = settings.fontStyle;
        span.style.visibility = 'hidden';
        span.style.display = 'inline-block';
        span.style.whiteSpace = 'nowrap';
        span.innerText = txt;
        container.appendChild(span);
        var tWidth = span.offsetWidth, // 水印文本的宽度
          tHeight = span.offsetHeight; // 水印文本的高度
        container.removeChild(span);
        if (settings.textBreakLine) {
          // 自动折行
          // 文本宽度大于水印宽度，则折行
          if (tWidth > settings.width) {
            // 需要手动折行
            var lineWidth = 0;
            var lastSubStrIndex = 0;
            for (var k = 0; k < txt.length; k++) {
              lineWidth += cvx.measureText(txt[k]).width;
              if (lineWidth >= settings.width) {
                txts.push({
                  txt: txt.substring(lastSubStrIndex, k),
                  width: lineWidth,
                  height: tHeight
                });
                maxWidth = Math.max(maxWidth, lineWidth);
                lineWidth = 0;
                lastSubStrIndex = k;
                txtHeight += tHeight;
              }
              if (k == txt.length - 1) {
                txts.push({
                  txt: txt.substring(lastSubStrIndex, k + 1),
                  width: lineWidth,
                  height: tHeight
                });
                maxWidth = Math.max(maxWidth, lineWidth);
                txtHeight += tHeight;
              }
            }
          } else {
            txts.push({
              txt: txt,
              width: tWidth,
              height: tHeight
            });
            maxWidth = Math.max(maxWidth, tWidth);
            txtHeight += tHeight;
          }
        } else {
          // 不折行
          txts.push({
            txt: txt,
            width: tWidth,
            height: tHeight
          });
          maxWidth = Math.max(maxWidth, tWidth);
          txtHeight += tHeight;
        }
      }
      tWidth = maxWidth;
      // 所有文本的高度（包括折行间隔高度）
      settings.textHeight = txtHeight + settings.textSpace * (txts.length - 1);
      var shadow = Math.cos(settings.deg) * tWidth;
      canvasWidth += shadow - tHeight * Math.sin(settings.deg);
      settings.txts = txts;
      settings.maxWidth = maxWidth;
      settings.canvasWidth = canvasWidth;
    } else {
      console.error('请传入正确格式的水印文本');
    }
  };
  /**
   * 设置canvas样式
   * @param {canvas} canvas canvas节点 
   * @param {boolean} notextstyle 是否设置canvas样式
   */
  var __setCanvasStyle = function (canvas, notextstyle) {
    canvas.style.display = 'none';

    var ctx = canvas.getContext('2d');
    if (!notextstyle) {
      var deg = this.options.deg,
        absSindeg = Math.abs(Math.sin(deg));
      ctx.rotate(deg);
      //基于视窗的 x、y偏移量
      var offset = absSindeg * this.options.height - this.options.textHeight * absSindeg;
      var nx = - offset * Math.cos(deg),
        ny = - offset * absSindeg;
      ctx.translate(nx, ny * absSindeg);

      ctx.font = this.options.fontStyle;
      ctx.fillStyle = this.options.fontColor;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'Middle';
    }
    return ctx;
  };
  /**
   * 画文本
   * @param {canvas} ctx canvas获取的content
   * @param {object[][]}} txts 文本信息数组
   */
  var __drawText = function (ctx, txts) {
    var settings = this.options;
    var deg = settings.deg;
    for (var i = 0; i < txts.length; i++) {
      for (var j = 0; j < txts[i].length; j++) {
        var obj = txts[i][j];
        var x = Math.abs(Math.sin(deg)) * obj.height + (settings.maxWidth + settings.spaceX) * i * Math.cos(deg),
          y = - x * Math.tan(deg) + (Math.abs(Math.cos(deg)) * settings.maxWidth + Math.abs(Math.cos(deg)) * (obj.height + settings.textSpace) * j);
        ctx.fillText(obj.txt, x, y);
      }
    }
  }
  var __destory = function () {
    for (var j = 0; j < this.options.canvas.length; j++) {
      var canvas = this.options.canvas[j];
      canvas.remove();
      canvas = null;

    }
  }
  var _event = function () {
    var _this = this;
    window.onresize = function () {
      var dw = _this.elem.scrollWidth;
      var ww = document.body.clientWidth;
      var w = (dw > 5000) ? ww : dw;
      var h = _this.elem.scrollHeight;
      _draw.call(_this, w, h);
    }
  }
  // window.WaterMark = waterMark;
  window.console = window.console || (function () {
    var c = {};
    c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () { };
    return c;
  })();
  return waterMark;
}));
