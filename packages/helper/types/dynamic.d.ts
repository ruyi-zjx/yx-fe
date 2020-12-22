// 这里的动态配置设想应该是一个全局的，比如接口请求地址等等，但是这里重点是页面的动态化
// 所以只提出一个 `pages` 字段
interface DynamicSetting {
  pages: PageSetting[];
}

/**
 * 具体的字段说明
 *	path      - 页面的路径，这里应该同vue路由中配置的页面路径一致，实现方可以
 *							通过 `path-to-regexp` 进行正则匹配，然后提取出当前页面的配置。
 *	title     - 该页面的标题。
 *	visible	  - 哪些元素可见（这里针对的是一些普通的元素显示或者隐藏）。
 * table		  - 同`visible`属性不同的是，这个table其实是对应<Table/>组件，
 * 						因为表单项中有一些列是不可见的，那么就需要针对<Table/>组件做一些配置。
 *							同理，如果以后有需求，可能还会添加针对其它组件的配置。
 */
interface PageSetting {
  path: string;
  title: string;
  visible: string[];
  table: TableSetting[];
  [key: string]: any;
}

/**
 * <Table/> 组件配置说明
 *
 *	visible     - 组件是否可见，默认可见
 *	columns     - 哪一些列可见
 */
type TableSetting = {
  visible: boolean;
  columns: string[];
  scroll: {
    x?: number;
    y?: number;
  };
};
