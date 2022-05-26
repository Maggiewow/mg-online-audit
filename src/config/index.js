/*
 * @Author: your name
 * @Date: 2020-05-11 10:57:35
 * @LastEditTime: 2022-05-26 10:48:59
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath: \files\src\config\index.js
 */
export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '在线审片',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  PAGE_SIZE: 10,
  useI18n: true,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: '',
    pro: '',
  },
  sucaiUrl: {
    dev: 'https://sucai.shandian8.com',
    pro: 'https://shandianyun-sck.iqilu.com',
  },
  articleUrl: {
    dev: 'https://article.shandian8.com',
    pro: 'https://shandianyun-article.iqilu.com',
  },
  seriesUrl: {
    dev: 'https://series.shandian8.com',
    pro: 'https://shandianyun-series.iqilu.com',
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: false, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true, // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    },
  },
  // goBackUrl: 'http://backpack.shandian.design',
  goBackUrl: 'https://user.shandian8.com',
};
