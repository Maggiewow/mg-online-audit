<template>
  <div>
    <div id="filePicker">选择文件</div>
    <div class="file-panel">
      <h2>文件列表</h2>
      <div class="file-list">
        <ul
          class="file-item"
          :class="`file-${file.id}`"
          v-for="file in fileList"
          :key="file.id"
        >
          <li
            class="file-type"
            :icon="fileCategory(file.ext)"
          ></li>
          <li
            class="file-name"
            @click="editName(file)"
          >
            <span>{{ file.name }}</span>
            <!-- <Tooltip :content="file.name">{{ substr(file.name) }}</Tooltip> -->
            <!-- <Input v-model="file.name" placeholder="请输入修改的文件名" style="width: 300px"/>
						<Icon type="md-checkmark"/>-->
          </li>
          <li class="file-size">{{ fileSize(file.size) }}</li>
          <li class="file-status">上传中...</li>
          <li class="file-operate">
            <!-- <a title="开始" @click="resume(file)"><Icon type="ios-play" /></i></a>
						<a title="暂停" @click="stop(file)"><Icon type="ios-pause" /></i></a> -->
            <a
              title="移除"
              @click="remove(file)"
            >
              <Icon type="md-close" />
            </a>
          </li>
          <li class="progress"></li>
        </ul>
        <div
          class="no-file"
          v-if="!fileList.length"
        >
          <i class="iconfont icon-empty-file"></i> 暂无待上传文件
        </div>
      </div>
    </div>
    <web-upload
      ref="uploader"
      uploadButton="#filePicker"
      multiple
      :accept="accept"
      :fileNumLimit="fileNumLimit"
      :fileSingleSizeLimit="fileSingleSizeLimit"
      :formData="formData"
      :keyGenerator="keyGenerator"
      :url="url"
      @fileChange="fileChange"
      @getMd5="getMd5"
      @progress="onProgress"
      @success="onSuccess"
      @complete="onComplete"
      @error="onError"
      @uploadError="uploadError"
      @getMd5Before="getMd5Before"
      @getMd5Done="getMd5Done"
    ></web-upload>
  </div>
</template>

<script>
import WebUpload from '_c/webuploader'
import '_c/webuploader/style.scss'
import WebUploader from '@/assets/js/webupload.js'
import { Icon } from 'view-design'

export default {
  name: 'VueUploader',
  props: {
    accept: {
      type: String,
      default: null,
    },
    // 上传地址
    url: {
      type: String,
      default: '',
    },
    // 上传最大数量 默认为100
    fileNumLimit: {
      type: Number,
      default: 100,
    },
    // 大小限制 默认2M
    fileSingleSizeLimit: {
      type: Number,
      default: 2048000,
    },
    // 上传时传给后端的参数，一般为token，key等
    formData: {
      type: Object,
      default: null,
    },
    // 生成formData中文件的key，下面只是个例子，具体哪种形式和后端商议
    keyGenerator: {
      type: Function,
      default(file) {
        const currentTime = new Date().getTime()
        const key = `${currentTime}`
        return key
      },
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    // 上传按钮ID
    uploadButton: {
      type: String,
      default: '',
    },
  },
  components: {
    WebUpload,
    Icon,
  },
  data() {
    return {
      fileList: [],
      percent: {},
    }
  },
  computed: {
    uploader() {
      return this.$refs.uploader
    },
  },
  watch: {
    percent(val) {
      console.log(val)
    },
    formData(obj) {
      console.log('监听上传参数', obj)
    },
  },
  methods: {
    fileSize: (size) => WebUploader.Base.formatSize(size),
    substr: (name) => (name.length > 10 ? name.substring(0, 10) + '...' : name),
    editName(file) {
      console.log(file)
    },
    fileChange(file) {
      if (!file.size) return
      this.fileList.push(file)
    },
    getMd5(file) {
      $(`.file-${file.id} .file-status`).html('文件校验中')
    },
    onProgress(file, percent) {
      $(`.file-${file.id} .progress`).css('width', percent * 100 + '%')
      $(`.file-${file.id} .file-status`).html((percent * 100).toFixed(2) + '%')
      if ((percent * 100).toFixed(2) == 100.0) {
        $(`.file-${file.id} .file-status`).html('服务器校验中')
      }
      this.$emit('progress', file, percent)
    },
    onSuccess(file, response) {
      if (response.headers.state_code != 200) {
        $(`.file-${file.id} .progress`).css('background', '#ffd4d4')
        $(`.file-${file.id} .file-status`).html('上传失败')
      } else {
        $(`.file-${file.id} .progress`).css('background', '#f2f2f2')
        $(`.file-${file.id} .file-status`).html('上传成功')
      }

      this.$emit('success', file, response)
    },
    onComplete(file, response) {
      this.$emit('complete', response)
    },
    onError(errorMessage) {
      this.$emit('error', errorMessage)
    },
    uploadError(file, reason) {
      $(`.file-${file.id} .progress`).css('background', '#ff9900')

      $(`.file-${file.id} .file-status`).html('上传失败')
      this.$emit('uploadError', file, reason)
    },
    getMd5Before(file) {
      $(`.file-${file.id} .file-status`).html('文件校验中')
    },
    getMd5Done(md5, file) {},
    resume(file) {
      this.uploader.upload(file)
    },
    stop(file) {
      this.uploader.stop(file)
    },
    remove(file) {
      // 取消并中断文件上传
      this.uploader.cancelFile(file)
      // 在队列中移除文件
      this.uploader.removeFile(file, true)
      // 在ui上移除
      let index = this.fileList.findIndex((ele) => ele.id === file.id)
      this.fileList.splice(index, 1)

      this.$emit('remove', file, index)
    },

    destroy() {
      this.uploader.destroy()
    },
    fileCategory(ext) {
      let type = ''
      const typeMap = {
        image: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'],
        video: [
          'mp4',
          'm3u8',
          'rmvb',
          'avi',
          'swf',
          '3gp',
          'mkv',
          'flv',
          'mxf',
        ],
        text: [
          'doc',
          'txt',
          'docx',
          'pages',
          'epub',
          'pdf',
          'numbers',
          'csv',
          'xls',
          'xlsx',
          'keynote',
          'ppt',
          'pptx',
        ],
        audio: ['wav', 'mp3'],
      }
      Object.keys(typeMap).forEach((_type) => {
        const extensions = typeMap[_type]
        if (extensions.indexOf(ext) > -1) {
          type = _type
        }
      })
      return type
    },
  },
}
</script>

<style lang="scss"></style>
