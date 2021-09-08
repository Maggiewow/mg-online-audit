<!--
 * @文件描述: 在线审片弹窗
  【腾讯文档】在线审片测试问题 https://docs.qq.com/doc/DREhZZFZuWmFORnZy
 * @公司: 广电信通
 * @作者: 赵婷婷
 * @Date: 2021-05-25 09:42:55
 * @LastEditors: 赵婷婷
 * @LastEditTime: 2021-09-08 16:15:09
-->
<template>
  <div>在线审片的弹窗组件 显示了吗</div>
</template>

<script>
import '@/assets/js/lib/videojs/video.js';
import '@/assets/js/lib/videojs/videojs.framebyframe.js';
import '@/assets/js/lib/videojs/video-js.css';

import '@/assets/js/lib/canvastools/canvastools.min.js';
import '@/assets/js/lib/canvastools/canvastools.min.css';

import {
  Modal,
  Tabs,
  TabPane,
  Button,
  Form,
  FormItem,
  Select,
  Option,
  Poptip,
  Icon,
} from 'view-design';
import { Slider } from 'element-ui';

export default {
  name: 'material_video',
  components: {
    Modal,
    Tabs,
    TabPane,
    Button,
    Form,
    FormItem,
    Select,
    Option,
    Poptip,
    Icon,
    Slider,
  },
  data() {
    return {};
  },
  props: {
    fileId: {
      required: true,
      default: '',
    },
    userInfo: {
      required: true,
      default: {
        id: '',
        avatar: '',
        nickname: '',
      },
    },
    privList: {
      required: true,
      default: [],
    },
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    setTimeout(() => {
      this.$Message.info('素材库--弹窗');
    }, 400);
  },
  methods: {},
};
</script>
