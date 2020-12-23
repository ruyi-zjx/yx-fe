import { VNode } from 'vue'
import { DirectiveBinding } from 'vue/types/options'
import { IVVisibleYx } from '../../types/visible'
import getPageSetting from '../get-page-setting'

const DIRE = `[ visible-yx ] `

const VVisible: IVVisibleYx = {
  // 动态设置
  dynamicSetting: undefined,

  install: function (Vue, options) {
    if (!options?.store) return console.error(DIRE + '指令注册失败：注册指令必须传入`vuex`实例')
    const dynamicSetting = options.store.state[options.dynamicStoreKey || 'dynamicSetting']
    if (!dynamicSetting) return console.error(DIRE + '指令注册失败：未发现存储动态配置的`module`.')
    this.dynamicSetting = dynamicSetting
    Vue.directive('visible-yx', {
      inserted: this.inserted.bind(this),
    })
  },

  inserted: function (el, binding, vnode) {
    // 页面元素名
    const elementName = binding.arg
    if (!elementName) return
    // 当前页面的路由
    const route = vnode.context.$route
    // 当前页面数据
    const setting = getPageSetting(route, this.dynamicSetting?.pages)
    // 当前页面无配置？直接退出
    if (!setting) return
    // 从修饰符中获取当前组件类型
    const component = Object.keys(binding.modifiers)[0] || 'default'
    // 预置好的组件处理函数
    const presetCompHandler = {
      table: handleTable,
    }
    if (component === 'default') {
      handleDefault(setting, elementName, el, binding, vnode)
    } else if (Object.keys(presetCompHandler).includes(component)) {
      const compSetting = setting[component]
      if (!compSetting) return
      // 因为一个页面可能有多个相同的组件，所以这边继续拿指定元素名的组件配置
      const eleSetting = compSetting[elementName]
      if (!eleSetting || !Object.keys(eleSetting).length) return
      const handler = setting[component]
      handler(eleSetting, elementName, el, binding, vnode)
    } else {
      console.warn(`${DIRE} 未发现\`${component}\`组件类型的处理函数，请检查\`${binding.rawName}\`指令语法是否正确`)
    }
  },
}

// 处理一般的元素，单纯控制元素是否显示或者隐藏
function handleDefault(
  setting: PageSetting,
  elementName: string,
  el: HTMLElement,
  binding: DirectiveBinding,
  vnode: VNode
) {
  const { visible = [] } = setting
  if (!visible.includes(elementName)) {
    ;(el.parentNode && el.parentNode.removeChild(el)) || (el.style.display = 'none')
  }
}

function handleTable(
  setting: TableSetting,
  elementName: string,
  el: HTMLElement,
  binding: DirectiveBinding,
  vnode: VNode
) {
  const vm = vnode.componentInstance
  const { columns = [], scroll = {}, visible = true } = setting
  if (!visible) {
    ;(el.parentNode && el.parentNode.removeChild(el)) || (el.style.display = 'none')
  }
  // 1. 处理需要显示的列
  if (columns.length) {
    const fullColumns = vm?.columns || []
    for (let i = fullColumns.length - 1; i >= 0; i--) {
      const target = fullColumns[i]
      if (!columns.includes(target.dataIndex || target.key)) {
        fullColumns.splice(i, 1)
      }
    }
  }
  // 2. 处理横向或纵向滚动距离
  Object.assign(vm?.scroll, scroll)
}

export default VVisible
