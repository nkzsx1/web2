/*
 * 侧边滑出弹层插件
 */
;
(function (window, undefined) {
  function znyd_dialog(options) {
      options.btn === undefined ? options.btn = true : false;
    this.opts = {
      'direction': options.direction || 'left', //弹层方向:left|right|top|bottom
      'distance': options.distance || '60%', //弹层宽度:px|%|auto
      'dom': this.Q(options.dom), //容器dom
      'zIndex': options.zIndex || 2000,
      'time': options.time || "", //自动关闭时间，单位毫秒
      'maskClose': (options.maskClose + '').toString() !== 'true' ? false : true, //点击遮罩关闭弹层
      "onOpen": options.onOpen || '',
      "onClose": options.onClose || '',
      "title":options.title || "提示",
      'onSave': options.onSave || '',
      'btn': (options.btn + '').toString() !== 'true' ? false : true,
    };
    this.rnd = this.rnd();
    this.dom = this.opts.dom[0];
    this.wrap = '';
    this.inner = '';
    this.mask = '';
    this.init();
  }

  znyd_dialog.prototype = {
    Q: function (dom) {
      return document.querySelectorAll(dom);
    },
    isMobile: function () {
      return navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) ? true : false;
    },
    addEvent: function (obj, ev, fn) {
      if (obj.attachEvent) {
        obj.attachEvent("on" + ev, fn);
      } else {
        obj.addEventListener(ev, fn, false);
      }
    },
    rnd: function () {
      return Math.random().toString(36).substr(2, 6);
    },
    /*
     * 初始化
     */
    init: function () {
      var _this = this;
      // 条件判断
      if (!_this.dom) {
        console.log('未正确绑定弹窗容器');
        return;
      }
      // 生成遮罩
      var wrapNode = document.createElement('div');
      var innerNode = document.createElement('div');
      var maskNode = document.createElement('div');
      var titleNode = document.createElement('div');
      var closeNode = document.createElement('span');
      var close ='<a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"></a>';
      // var titleNode = '<div style="height:36px;background-color:#DDE4EC;font-weight:500;text-align:left;text-indent:10px">123</div>';
      closeNode.innerHTML = close;
      titleNode.innerText = _this.opts.title;
      titleNode.id = 'znydDialogTitle';
      titleNode.style.height = '42px';
      titleNode.style.backgroundColor = '#f3f9ff';
      titleNode.style.fontWeight = '500';
      titleNode.style.textAlign = 'left';
      titleNode.style.textIndent = '23px';
      titleNode.style.lineHeight = '42px';
      titleNode.style.fontSize = '13px';
      closeNode.setAttribute('class', 'layui-layer-setwin')
      innerNode.appendChild(titleNode)
      innerNode.appendChild(closeNode)
      wrapNode.setAttribute('class', 'znyd_dialog-main ms-' + _this.rnd);
      innerNode.setAttribute('class', 'znyd_dialog-inner');
      maskNode.setAttribute('class', 'znyd_dialog-mask');
      closeNode.onclick = function() {
          //右上角关闭按钮
          _this.close()
      }
      if(_this.opts.btn) {
          var btnNode = document.createElement('div');
          var btnStr = '<button id="znyd_dialog_save" type="button" class="btn btn-default btn-znyd btn-add">保存</button><button id="znyd_dialog_close" type="button" class="btn btn-default btn-znyd">取消</button>';
          btnNode.innerHTML = btnStr;
          btnNode.setAttribute('style', 'position:fixed;bottom: 0;padding: 15px 20px;')
          innerNode.appendChild(btnNode)
          btnNode.onclick = function(e) {
              if(e.target.id === 'znyd_dialog_close') {
                  _this.close()
              }
              if(e.target.id === 'znyd_dialog_save') {
                  _this.opts.onSave.call(_this)
              }
          }
      }

      _this.Q("body")[0].appendChild(wrapNode);
      _this.Q(".ms-" + _this.rnd)[0].appendChild(innerNode);
      _this.Q(".ms-" + _this.rnd)[0].appendChild(maskNode);

      _this.wrap = _this.Q('.ms-' + _this.rnd)[0];
      _this.inner = _this.Q('.ms-' + _this.rnd + ' .znyd_dialog-inner')[0];
      _this.mask = _this.Q('.ms-' + _this.rnd + ' .znyd_dialog-mask')[0];
      // 嵌入内容
      _this.inner.appendChild(_this.dom);

      // var closeBtn = document.getElementById('znyd_dialog_close');
      //     closeBtn.onclick = function() {
      //         _this.close()
      //     }

      //弹层方向
      switch (_this.opts.direction) {
        case 'top':
          _this.top = '0';
          _this.left = '0';
          _this.width = '100%';
          _this.height = _this.opts.distance;
          _this.translate = '0,-100%,0';
          break;
        case 'bottom':
          _this.bottom = '0';
          _this.left = '0';
          _this.width = '100%';
          _this.height = _this.opts.distance;
          _this.translate = '0,100%,0';
          break;
        case 'right':
          _this.top = '0';
          _this.right = '0';
          _this.width = _this.opts.distance;
          _this.height = document.documentElement.clientHeight + 'px';
          _this.translate = '100%,0,0';
          break;
        default:
          //left
          _this.top = '0';
          _this.left = '0';
          _this.width = _this.opts.distance;
          _this.height = document.documentElement.clientHeight + 'px';
          _this.translate = '-100%,0,0';
      }

      //外部容器样式
      _this.wrap.style.display = 'none';
      _this.wrap.style.position = 'fixed';
      _this.wrap.style.top = '0';
      _this.wrap.style.left = '0';
      _this.wrap.style.width = '100%';
      _this.wrap.style.height = '100%';
      _this.wrap.style.zIndex = _this.opts.zIndex;

      // 内容区样式
      _this.inner.style.position = "absolute";
      _this.inner.style.top = _this.top;
      _this.inner.style.bottom = _this.bottom;
      _this.inner.style.left = _this.left;
      _this.inner.style.right = _this.right;
      _this.inner.style.width = _this.width;
      // _this.inner.style.height = _this.height;
      _this.inner.style.height = '100%';
      _this.inner.style.overflow = 'auto';
      _this.inner.style.backgroundColor = "#fff";
      _this.inner.style.transform = 'translate3d(' + _this.translate + ')';
      _this.inner.style.webkitTransition = "all .2s ease-out";
      _this.inner.style.transition = "all .2s ease-out";
      _this.inner.style.zIndex = _this.opts.zIndex + 1;
      _this.inner.style.boxShadow= '-2px 0 20px #515A61';

      //遮罩处理
      _this.mask.style.width = '100%';
      _this.mask.style.height = '100%';
      _this.mask.style.opacity = '0';
      // _this.mask.style.backgroundColor = 'black'; // 去掉遮罩层
      _this.mask.style.zIndex = _this.opts.zIndex - 1;
      _this.mask.style.webkitTransition = "all .2s ease-out";
      _this.mask.style.transition = "all .2s ease-out";
      _this.mask.style.webkitBackfaceVisibility = 'hidden';
      // 绑定事件
      _this.events();
    },

    /*
     * 打开弹窗
     */
    open: function () {
      var _this = this;
      _this.wrap.style.display = 'block';
      // console.log(_this.opts.dom)
      _this.opts.dom[0].style.display = 'block';
      setTimeout(function () {
        _this.inner.style.transform = 'translate3d(0,0,0)';
        _this.inner.style.webkitTransform = 'translate3d(0,0,0)';
        _this.mask.style.opacity = 0.5;
        _this.opts.onOpen && _this.opts.onOpen();
      }, 30)

      if (_this.opts.time) {
        _this.timer = setTimeout(function () {
          _this.close()
        }, _this.opts.time);
      }
    },

    /*
     * 关闭弹窗
     */
    close: function () {
      var _this = this;
      _this.timer && clearTimeout(_this.timer);
      _this.inner.style.webkitTransform = 'translate3d(' + _this.translate + ')';
      _this.inner.style.transform = 'translate3d(' + _this.translate + ')';
      _this.mask.style.opacity = 0;
      setTimeout(function () {
        _this.wrap.style.display = 'none';
        _this.timer = null;
        _this.opts.onClose && _this.opts.onClose();
      }, 300);
    },
    // 事件
    events: function () {
      var _this = this;
      _this.addEvent(_this.mask, "touchmove", function (e) {
        e.preventDefault();
      })
      _this.addEvent(_this.mask, (_this.isMobile() ? 'touchend' : 'click'), function (e) {
        if (_this.opts.maskClose) {
          _this.close();
        }
      })
    }
  }
  window.znyd_dialog = znyd_dialog;
})(window)
