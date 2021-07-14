<!--
 * @Author: your name
 * @Date: 2020-07-23 09:48:43
 * @LastEditTime: 2021-07-14 15:00:06
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath: \sucai-modal\src\views\Home.vue
-->
<template>
  <div class="comps">
    <Button type="primary" :loading="loading" @click="handleOpenVideo('5', null)">打开弹窗</Button>
    <audit-modal
      ref="auditDom"
      :fileId="fileId"
      :userInfo="userInfo"
      :privList="privList"
    ></audit-modal>
  </div>
</template>

<script>
// @ is an alias to /src
import AuditModal from '@/components/AuditModal';

export default {
  name: 'Home',
  components: {
    AuditModal,
  },
  data() {
    return {
      loading: false,
      fileId: '',
      userInfo: {
        id: '1000053',
        avatar: 'https://img12.iqilu.com//1/2019/09/03/d263847adf8b4835acb1dee6c057f32f.jpg',
        nickname: '赵婷婷',
      },
      privList: ['bindSeries'], // ['bindSeries', 'bindArticle', 'updateVersion']
    };
  },
  mounted() {},
  methods: {
    // 音视频打开弹窗需要等待接口返回
    handleOpenVideo(id) {
      this.fileId = id;
      this.loading = true;
      this.$nextTick(() => {
        this.$refs.auditDom.showModal(() => {
          this.loading = false;
        });
      });
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
