/*
 * @Author: your name
 * @Date: 2020-08-12 18:18:35
 * @LastEditTime: 2021-08-10 18:09:08
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath:
 */
module.exports = {
  presets: [
    [
      '@vue/app',
      // '@vue/cli-plugin-babel/preset',
      // {
      //   useBuiltIns: 'entry',
      //   polyfills: ['es6.promise', 'es6.symbol'],
      // },
    ],
  ],
  plugins: [
    [
      'import',
      {
        libraryName: 'view-design',
        libraryDirectory: 'src/components',
      },
    ],
  ],
  sourceType: 'unambiguous',
};
