<!--
 * @Author: your name
 * @Date: 2020-07-31 15:02:00
 * @LastEditTime: 2021-07-07 11:53:07
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath: \manuscript-pc\src\view\components\manuscripts\wechatDraftModal.vue
-->
<template>
  <div>
    <Modal v-model="modalKey" title="更新版本" width="700">
      <div>
        <vue-uploader
          v-if="modalKey"
          url="/upload/chunk-resume/process"
          @error="uploadOnError"
          @success="uploadOnSuccess"
          @remove="uploadOnRemove"
          @uploadError="uploadError"
          :accept="accept"
          :formData="{ force_re_upload: 1 }"
          ref="vueUploader"
        ></vue-uploader>
      </div>
      <div slot="footer">
        <Button type="info" size="large" @click="chooseDraftCancel"
          >取消</Button
        >
        <Button
          type="primary"
          size="large"
          :loading="isloading"
          @click="chooseDraftOk"
          >确定</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import VueUploader from "_c/vueuploader";

export default {
  name: "wechatDraftModal",
  data() {
    return {
      modalKey: null,
      accept: "video",
      attachment: [],
      isloading: false
    };
  },
  props: {
    chooseModalValue: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    chooseModalValue: {
      handler(newValue, oldValue) {
        this.modalKey = newValue;
      },
      immediate: true
    }
  },
  components: {
    VueUploader
  },
  mounted() {},
  methods: {
    uploadOnSuccess(file, response) {
      if (response.headers.state_code == 200) {
        let data = {
          name: file.name,
          url: response.data.data.url,
          file_type: response.data.data.file_type
        };
        console.log("上传成功", data);
        this.attachment.push(data);
      } else {
        this.$Notice.error({
          title: response.msg
        });
      }
    },
    uploadOnRemove(file, index) {
      console.log(file, index);
      // delete this.attachment[file.id]
      // console.log(this.attachment)
      this.attachment.splice(index, 1);
    },
    uploadOnError(errorMessage) {
      this.$Notice.error({
        title: errorMessage
      });
    },
    uploadError(file, reason) {
      console.log(reason);
      this.$emit("uploadError", file, reason);
    },
    chooseDraftOk() {
      console.log("确认===>", this.attachment);
      if (!this.attachment || this.attachment.length === 0) {
        this.$Message.warning("请先上传视频");
        return;
      }
      if (this.attachment && this.attachment.length > 1) {
        this.$Message.warning("仅支持单条视频保存");
        return;
      }

      this.isloading = true;
      let info = this.attachment[0];
      this.$emit("chooseDraftOk", info, () => {
        this.isloading = false;
        this.attachment = [];
      });
      console.log("确认保存===>", info);
    },
    chooseDraftCancel() {
      this.attachment = [];
      this.$emit("chooseDraftCancel");
      console.log("取消保存===>", this.attachment);
    }
  }
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
