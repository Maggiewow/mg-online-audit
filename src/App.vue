<!--
 * @Author: your name
 * @Date: 2020-07-23 09:48:43
 * @LastEditTime: 2021-07-14 15:14:14
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath: \sucai-modal\src\App.vue
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
  font-size: 14px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .size;
  /deep/ .ivu-table {
    font-size: 14px;
  }
  .showDiv {
    padding: 6px 16px 26px;
  }
  .pageDom {
    margin-top: 40px;
    text-align: center;
  }
  /deep/ .ivu-input {
    font-size: 14px !important;
  }
  /deep/ .ivu-checkbox-wrapper {
    font-size: 14px;
  }
  /deep/ .ivu-tree ul {
    font-size: 14px;
  }
  /deep/ .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
    font-size: 14px;
  }
  /deep/ .ivu-select-item {
    font-size: 14px !important;
  }
  /deep/ .ivu-form .ivu-form-item-label {
    font-size: 14px !important;
  }
  /deep/ .ivu-form-item-content {
    font-size: 14px;
  }
  ::v-deep .ivu-btn-small {
    font-size: 12px;
  }
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.over_hide {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.over_hide_2 {
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
