<!--
 * @Author: your name
 * @Date: 2020-07-31 15:02:00
 * @LastEditTime: 2022-07-06 15:41:40
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath: \manuscript-pc\src\view\components\manuscripts\wechatDraftModal.vue
-->
<template>
  <div>
    <Modal v-model="modalKey" title="更新版本" width="700">
      <div>
        <!-- <vue-uploader
          v-if="modalKey"
          url="/upload/chunk-resume/process"
          @error="uploadOnError"
          @success="uploadOnSuccess"
          @remove="uploadOnRemove"
          @uploadError="uploadError"
          :accept="accept"
          :formData="{ force_re_upload: 1 }"
          :fileNumLimit="1"
          ref="vueUploader"
        ></vue-uploader> -->

        <js-uploader
          v-if="modalKey"
          ref="vueUploader"
          :env="env"
          :accept="accept"
          :fileNumLimit="1"
          :modalKey="modalKey"
          @error="uploadOnError"
          @success="uploadOnSuccess"
          @remove="uploadOnRemove"
        ></js-uploader>
      </div>
      <div slot="footer">
        <Button type="info" size="large" @click="chooseDraftCancel">取消</Button>
        <Button type="primary" size="large" :loading="isloading" @click="chooseDraftOk"
          >确定</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import VueUploader from '_c/vueuploader';
import JsUploader from '_c/jsuploader';
import { Modal, Button, Dropdown, DropdownItem, DropdownMenu } from 'view-design';

export default {
  name: 'wechatDraftModal',
  data() {
    return {
      modalKey: null,
      accept: 'video',
      attachment: [],
      isloading: false,
    };
  },
  props: {
    chooseModalValue: {
      type: Boolean,
      Dropdown,
      DropdownItem,
      DropdownMenu,
      default: false,
    },
  },
  watch: {
    chooseModalValue: {
      handler(newValue, oldValue) {
        this.modalKey = newValue;
      },
      immediate: true,
    },
  },
  components: {
    VueUploader,
    JsUploader,
    Modal,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
  },
  computed: {
    env() {
      if (window.location.origin.includes('https://shandianyun-sck.iqilu.com')) {
        return 'prod';
      } else if (window.location.origin.includes('https://sucai.shandian8.com')) {
        return 'test';
      }

      return 'test';
    },
  },
  mounted() {},
  methods: {
    openModal() {
      this.modalKey = true;
    },
    uploadOnSuccess(file, extra) {
      if (extra) {
        if (!extra.url) {
          this.$Message.error('上传失败！');
          return;
        }

        let data = {
          name: file.name,
          url: extra.url,
          file_type: extra.file_type,
        };
        console.log('data', data, file, extra);
        this.attachment.push(data);
      }
    },
    uploadOnError(errorMessage) {
      this.$Message.error({
        content: errorMessage,
        duration: 7,
      });
    },
    uploadOnRemove(file, index) {
      console.log(file, index);
      this.attachment.splice(index, 1);
    },
    // uploadError(file, reason) {
    //   console.log(reason);
    //   this.$emit('uploadError', file, reason);
    // },
    chooseDraftOk() {
      if (!this.attachment || this.attachment.length === 0) {
        this.$Message.warning('请先上传视频');
        return;
      }
      if (this.attachment && this.attachment.length > 1) {
        this.$Message.warning('仅支持单条视频保存');
        return;
      }

      this.isloading = true;
      let info = this.attachment[0];
      this.$emit('chooseDraftOk', info, () => {
        this.isloading = false;
        this.attachment = [];
      });
    },
    chooseDraftCancel() {
      this.attachment = [];
      this.$emit('chooseDraftCancel');
    },
  },
};
</script>

<style lang="scss" scoped>
.pageDom {
  text-align: center;
  margin-top: 15px;
}
.filter-form {
  width: 100%;
  display: flex;
  align-items: center;
}
</style>
