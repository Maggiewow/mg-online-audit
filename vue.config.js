/*
 * @Author: your name
 * @Date: 2020-07-24 09:12:36
 * @LastEditTime: 2021-09-08 17:55:47
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath: \sucai-modal\vue.config.js
 */
const path = require('path');
function resolve(dir) {
  return path.resolve(__dirname, dir);
}

var webpack = require('webpack');
// const BASE_URL = process.env.NODE_ENV === 'production' ? '/dist/' : './';

module.exports = {
  // publicPath: BASE_URL,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
  },
  productionSourceMap: false,
  configureWebpack: {
    output: {
      libraryExport: 'default',
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': resolve('src'),
        _c: resolve('src/components'),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        plupload: 'plupload',
      }),
    ],
  },
  devServer: {
    port: 8091,
    hot: true,
    open: 'Google Chrome',
  },
  chainWebpack: (config) => {
    config.module
      .rule('js')
      // .include.add('/packages')
      .include.add(resolve('src'))
      // .add(resolve('public/lib/canvastools'))
      // .add(resolve('public/lib/jwplayer-v6.1.2972'))
      // .add(resolve('public/lib/videojs'))
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap((options) => {
        return options;
      });
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'));
  },
  css: {
    extract: false,
  },
  devServer: {
    proxy: 'https://sucai.shandian8.com/',
    // proxy: "https://shandianyun-sck.iqilu.com/"
  },
};
