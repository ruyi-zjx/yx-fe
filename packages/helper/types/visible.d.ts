import { PluginFunction, DirectiveFunction, DirectiveOptions } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { Store } from 'vuex';

interface ExtDirectiveBinding extends DirectiveBinding {
  rawName?: string;
}

interface ExtDirectiveFunction {
  (el: HTMLElement, binding: ExtDirectiveBinding, vnode: VNode, oldVnode: VNode): void;
}

interface PluginOptions {
  store: Store;
  [key: string]: any;
}

interface IVVisibleYx {
  install: PluginFunction<PluginOptions>;
  inserted: ExtDirectiveFunction;
  dynamicSetting?: DynamicSetting;
}
