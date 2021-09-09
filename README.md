# sucai-modal

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

npm version patch 然后 npm publish

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

修改记录：
淘宝镜像 npm config set registry https://registry.npm.taobao.org
不使用淘宝镜像 npm config set registry "http://registry.npmjs.org/"

"devDependencies": {
"@vue/cli-plugin-babel": "^4.4.0",
"@vue/cli-service": "^4.4.0",
"babel-plugin-import": "^1.13.0",
"less": "^2.7.3",
"less-loader": "^5.0.0",
"node-loader": "^0.6.0",
"node-sass": "^4.14.1",
"sass-loader": "^7.1.0",
"vue-template-compiler": "^2.6.11"
},
09/09 删掉
"devDependencies": {
"@babel/core": "^7.6.0",
"@babel/plugin-transform-runtime": "^7.6.0",
"@babel/preset-env": "^7.15.0",
}

npm run lib
git 提交
npm version patch
npm publish
