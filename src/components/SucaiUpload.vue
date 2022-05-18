<template>
  <sucai-modal-next
    :modalKey="uploadPop"
    :type="modalType"
    :fileLimitNum="fileLimitNum"
    :baseUrl="baseUrl"
    :websocketUrl="websocketUrl"
    onlyChooseVideo
    videoNeedTranscode
    @handleMaterialModalCancle="handleModalCancle"
    @chooseVideoOk="chooseVideoOk"
    @start_transcode="start_transcode"
  ></sucai-modal-next>
</template>

<script>
import SucaiModalNext from 'sucai-modal-next';

export default {
  name: 'sucai-upload',
  props: {},
  data() {
    return {
      baseUrl: 'https://shandianyun-sck.iqilu.com/',
      websocketUrl: 'wss://shandianyun-sck.iqilu.com/',
      // 视频上传
      uploadPop: false,
      fileLimitNum: 1,
      modalType: 'video',
      transcodeing: false,
      transcodeCover:
        'https://img12.iqilu.com/10339/sucaiku/202008/19/d1fe0b3a210d30c63618e00824adf714.png',
      ws_transcode: null,
      wsInterval_transcode: null,
    };
  },
  components: { SucaiModalNext },
  methods: {
    // 打开视频modal
    uploadVideo() {
      this.uploadPop = true;
    },
    handleModalCancle() {
      this.uploadPop = false;
    },
    chooseVideoOk(list) {
      this.$emit('uploadOk', false, list[0]);
      this.uploadPop = false;
    },

    start_transcode(id) {
      if (!id) {
        return;
      }
      this.initTranscodeWs(id);
      this.transcodeing = true;
      this.$emit('setTranscodeStatus', this.transcodeing, this.transcodeCover);
    },
    initTranscodeWs(id) {
      let _this = this;
      let wsPath = this.websocketUrl + 'socket/video/transcode';
      _this.ws_transcode = new WebSocket(wsPath);

      let ws_transcode = _this.ws_transcode;
      if ('WebSocket' in window) {
        ws_transcode.onopen = function() {
          // 当WebSocket创建成功时，触发onopen事件
          let initItem = {
            type: 'init',
          };
          ws_transcode.send(JSON.stringify(initItem));
          let item = {
            type: 'receive',
            file_id: id,
          };
          ws_transcode.send(JSON.stringify(item)); // 将消息发送到服务端
          _this.wsInterval_transcode = setInterval(() => {
            _this.intervalSend_transcode();
          }, 45000);
        };
        ws_transcode.onmessage = function(e) {
          // 当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
          let data = JSON.parse(e.data);
          switch (data.type) {
            case 'init':
              break;
            case 'reply':
              break;
            case 'push':
              _this.transcodeOk(data.data);
              break;
            case 'un_identify':
              break;
          }
        };
        ws_transcode.onclose = function(e) {
          // 当客户端收到服务端发送的关闭连接请求时，触发onclose事件
          console.log(e);
          console.log('trans_code close');
        };
        ws_transcode.onerror = function(e) {
          // 如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
          console.log(e);
        };
      } else {
        console.log('您的浏览器不支持WebSocket');
      }
    },
    intervalSend_transcode() {
      let item = {
        type: 'ping',
      };
      this.ws_transcode.send(JSON.stringify(item));
    },
    // 转码成功
    transcodeOk(list) {
      console.log('转码成功', list);
      if (list && list.length > 0) {
        this.$emit('uploadOk', true, list[0]);
        this.transcodeing = false;
        this.$emit('setTranscodeStatus', this.transcodeing);
      }
    },
  },
};
</script>

<style lang="less"></style>
