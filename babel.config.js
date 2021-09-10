/*
 * @Author: your name
 * Babel 默认假设它处理的文件是 ES 模块（使用import和export）
 *
 * 其他项目安装mg-online-audit包 引入后报错：Cannot assign to read only property 'exports' of object '#<Object>'
 * 问题是，如果 Babel 认为某个东西是 ES 模块，它会插入import语句。如果您将import语句插入到也使用 CommonJS 之类module.exports的文件中，
 * 则意味着该文件现在将在同一个文件中使用两个模块系统，这是一个大问题，并会导致您看到的错误
 * @Date: 2020-08-12 18:18:35
 * @LastEditTime: 2021-09-10 15:20:53
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath:
 */
module.exports = {
  presets: [
    // '@vue/cli-plugin-babel/preset',
    ['@babel/preset-env', { modules: false, useBuiltIns: 'usage' }],
  ],
  plugins: [],
  // plugins: ['transform-vue-jsx', 'transform-runtime', 'transform-es2015-modules-commonjs'],
  // plugins: [
  //   [
  //     'import',
  //     {
  //       libraryName: 'view-design',
  //       libraryDirectory: 'src/components',
  //     },
  //   ],
  // ],
  // ignore: [/\/core-js/],
  sourceType: 'unambiguous', // 告诉Babel根据import和export猜测类型
};

// module.exports = {
//   presets: [
//     '@vue/cli-plugin-babel/preset',
//     ["@babel/preset-env", { "modules": false }]
//   ],
//   plugins: [
//     [
//       'import',
//       {
//         libraryName: 'view-design',
//         libraryDirectory: 'src/components',
//       },
//     ],
//     [
//       "component",
//       {
//         "libraryName": "element-ui",
//         "styleLibraryName": "theme-chalk"
//       }
//     ]
//   ],
//   sourceType: 'unambiguous',
// };
