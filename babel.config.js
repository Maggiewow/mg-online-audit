/*
 * @Author: your name
 * @Date: 2020-08-12 18:18:35
 * @LastEditTime: 2021-09-09 14:28:22
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath:
 */
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'import',
      {
        libraryName: 'view-design',
        libraryDirectory: 'src/components',
      },
    ],
  ],
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
