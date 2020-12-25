/*!
 * yxfe-helper.js v0.0.7
 * (c) 2020-2020 zzzjx <ruyi_zozo@163.com>
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['yxfe-helper'] = {}));
}(this, (function (exports) { 'use strict';

  var pathToRegexp = require('path-to-regexp').pathToRegexp;
  /**
   * 获取目标页面的动态配置
   * @param {*} route 页面的路由
   * @param {*} pages 所有的页面配置
   */
  function getPageSetting(route, pages) {
      var curSetting;
      if (!pages)
          return curSetting;
      for (var i = 0, len = pages.length; i < len; i++) {
          var cur = pages[i];
          var regex = pathToRegexp(cur.path);
          // 使用正则进行匹配，找出该页面的相关配置
          if (regex.exec(route.path)) {
              curSetting = cur;
              break;
          }
      }
      return curSetting;
  }

  var DIRE = "[ visible-yx ] ";
  var VVisible = {
      // 动态设置
      dynamicSetting: undefined,
      install: function (Vue, options) {
          if (!(options === null || options === void 0 ? void 0 : options.store))
              return console.error(DIRE + '指令注册失败：注册指令必须传入`vuex`实例');
          var dynamicSetting = options.store.state[options.dynamicStoreKey || 'dynamicSetting'];
          if (!dynamicSetting)
              return console.error(DIRE + '指令注册失败：未发现存储动态配置的`module`.');
          this.dynamicSetting = dynamicSetting;
          Vue.directive('visible-yx', {
              inserted: this.inserted.bind(this),
          });
      },
      inserted: function (el, binding, vnode) {
          var _a;
          // 页面元素名
          var elementName = binding.arg;
          if (!elementName)
              return;
          // 当前页面的路由
          var route = vnode.context.$route;
          // 当前页面数据
          var setting = getPageSetting(route, (_a = this.dynamicSetting) === null || _a === void 0 ? void 0 : _a.pages);
          // 当前页面无配置？直接退出
          if (!setting)
              return;
          // 从修饰符中获取当前组件类型
          var component = Object.keys(binding.modifiers)[0] || 'default';
          // 预置好的组件处理函数
          var presetCompHandler = {
              table: handleTable,
          };
          var compHandlers = Object.keys(presetCompHandler);
          if (component === 'default') {
              handleDefault(setting, elementName, el);
          }
          else if (component in compHandlers) {
              var compSetting = setting[component];
              if (!compSetting)
                  return;
              // 因为一个页面可能有多个相同的组件，所以这边继续拿指定元素名的组件配置
              var eleSetting = compSetting[elementName];
              if (!eleSetting || !Object.keys(eleSetting).length)
                  return;
              var handler = presetCompHandler[component];
              handler(eleSetting, elementName, el, binding, vnode);
          }
          else {
              console.warn(DIRE + " \u672A\u53D1\u73B0`" + component + "`\u7EC4\u4EF6\u7C7B\u578B\u7684\u5904\u7406\u51FD\u6570\uFF0C\u8BF7\u68C0\u67E5`" + binding.rawName + "`\u6307\u4EE4\u8BED\u6CD5\u662F\u5426\u6B63\u786E");
          }
      },
  };
  // 处理一般的元素，单纯控制元素是否显示或者隐藏
  function handleDefault(setting, elementName, el, binding, vnode) {
      var _a = setting.visible, visible = _a === void 0 ? [] : _a;
      if (!visible.includes(elementName)) {
          (el.parentNode && el.parentNode.removeChild(el)) || (el.style.display = 'none');
      }
  }
  function handleTable(setting, elementName, el, binding, vnode) {
      var vm = vnode.componentInstance;
      var _a = setting.columns, columns = _a === void 0 ? [] : _a, _b = setting.scroll, scroll = _b === void 0 ? {} : _b, _c = setting.visible, visible = _c === void 0 ? true : _c;
      if (!visible) {
          (el.parentNode && el.parentNode.removeChild(el)) || (el.style.display = 'none');
      }
      // 1. 处理需要显示的列
      if (columns.length) {
          var fullColumns = (vm === null || vm === void 0 ? void 0 : vm.columns) || [];
          for (var i = fullColumns.length - 1; i >= 0; i--) {
              var target = fullColumns[i];
              if (!columns.includes(target.dataIndex || target.key)) {
                  fullColumns.splice(i, 1);
              }
          }
      }
      // 2. 处理横向或纵向滚动距离
      Object.assign(vm === null || vm === void 0 ? void 0 : vm.scroll, scroll);
  }

  exports.VVisible = VVisible;
  exports.getPageSetting = getPageSetting;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=yxfe-helper.js.map
