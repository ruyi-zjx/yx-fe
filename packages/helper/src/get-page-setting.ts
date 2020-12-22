import { Route } from 'vue-router';
const { pathToRegexp } = require('path-to-regexp');

/**
 * 获取目标页面的动态配置
 * @param {*} route 页面的路由
 * @param {*} pages 所有的页面配置
 */
export default function getPageSetting(
  route: Route,
  pages?: DynamicSetting['pages'],
): PageSetting | undefined {
  let curSetting;
  if (!pages) return curSetting;
  for (let i = 0, len = pages.length; i < len; i++) {
    const cur = pages[i];
    const regex = pathToRegexp(cur.path);
    // 使用正则进行匹配，找出该页面的相关配置
    if (regex.exec(route.path)) {
      curSetting = cur;
      break;
    }
  }
  return curSetting;
}
