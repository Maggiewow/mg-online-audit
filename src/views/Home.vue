<!--
 * @Author: your name
 * @Date: 2020-07-23 09:48:43
 * @LastEditTime: 2022-05-18 09:59:53
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath: \sucai-modal\src\views\Home.vue
-->
<template>
  <div class="comps">
    <!-- 613  4842525  8255683 -->
    <Button type="primary" :loading="loading1" @click="handleOpenVideo('111')">打开弹窗</Button>
    <audit-modal
      ref="auditDom"
      :fileId="fileId"
      :userInfo="userInfo"
      :privList="privList"
      :fromSeries="true"
    >
      <template #toolbar>
        <Button type="info" size="small" class="per-btn" @click="handleChangeFile">上一条</Button>
        <Button type="info" size="small" class="per-btn" @click="handleChangeFile">下一条</Button>
        <Button type="success" size="small" class="per-btn" @click="handleNewVersion"
          >更新版本</Button
        >
        <Button type="success" size="small" class="per-btn">通过</Button>
        <Button type="error" size="small" class="per-btn">修改驳回</Button>
      </template>
    </audit-modal>
  </div>
</template>

<script>
// @ is an alias to /src
import AuditModal from '@/components/AuditModal';
import { Button } from 'view-design';
export default {
  name: 'Home',
  components: {
    AuditModal,
    Button,
  },
  data() {
    return {
      loading1: false,
      noCommentAccess: false,
      fileId: '',
      userInfo: {
        id: '1000053',
        avatar: 'https://img12.iqilu.com//1/2019/09/03/d263847adf8b4835acb1dee6c057f32f.jpg',
        nickname: '赵婷婷',
      },
      privList: [], // ['bindSeries', 'bindArticle', 'updateVersion']
    };
  },
  mounted() {},
  methods: {
    // 音视频打开弹窗需要等待接口返回
    handleOpenVideo(id) {
      this.fileId = id;
      this.loading1 = true;
      this.$nextTick(() => {
        this.$refs.auditDom.showModal(() => {
          this.loading1 = false;
        });
      });
    },
    // 111 108
    handleChangeFile() {
      this.fileId = '108';
      this.$refs.auditDom.fileChange();
    },
    handleNewVersion() {
      this.$refs.auditDom.handleUpdateVersion();
    },
  },
};
</script>

<style scoped>
@import url('../assets/css/common.css');

.comps {
  padding: 50px 200px;
  display: flex;
}
</style>
