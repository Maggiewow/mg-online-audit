<!--
 * @文件描述: 在线审片弹窗
  加入串联单审片功能之后 组件间耦合度变高
  1. 创建者更新版本后 转码未完成：不可批注；如果mxf，不能播放；
  2. 审核人 点开审核，如果转码未完成：不可批注
 * @公司: 广电信通
 * @作者: 赵婷婷
 * @Date: 2021-05-25 09:42:55
 * @LastEditors: 赵婷婷
 * @LastEditTime: 2022-05-26 10:52:08
-->
<template>
  <div>
    <Modal
      id="auditmodal"
      v-model="auditModal"
      width="1200"
      class="modal-con"
      :styles="{ top: '0px' }"
      footer-hide
      title="在线审片"
      :z-index="1002"
      :mask-closable="false"
    >
      <div class="modal-inner-mask" v-if="maskShow"></div>
      <div class="title-opr-line">
        <Form class="set-form" :model="formItem" :label-width="0">
          <FormItem label="">
            <!-- 串联单 插槽 -->
            <slot name="toolbar"></slot>
          </FormItem>
          <FormItem label="" prop="version" class="per-sel">
            <Select v-model="formItem.version" @on-change="handleVersionChange">
              <Option v-for="{ version } in versionList" :value="version" :key="version"
                >v{{ version }}</Option
              >
            </Select>
          </FormItem>
          <!-- <FormItem label="" prop="state" class="per-sel">
          <Select v-model="formItem.state">
            <Option
              v-for="{ value, label } in stateList"
              :value="value"
              :key="value"
              >{{ label }}</Option
            >
          </Select>
        </FormItem> -->
          <FormItem label="">
            <Button
              v-if="
                curUserId === (basicInfo.user ? basicInfo.user.id : '') &&
                  privList.includes('updateVersion')
              "
              type="success"
              size="small"
              class="per-btn"
              @click="handleUpdateVersion"
              >更新版本</Button
            >

            <Poptip trigger="hover" v-if="!fromSeries">
              <Button type="success" size="small" class="per-btn">
                更多&nbsp;<Icon type="ios-more" />
              </Button>
              <div class="other-btns" slot="content">
                <p v-if="privList.includes('bindArticle')" class="btn" @click="handleChooseManu">
                  关联文稿
                </p>
                <p v-if="privList.includes('bindSeries')" class="btn" @click="handleChooseSeries">
                  关联串联单
                </p>
                <Button class="btn" :loading="lowcodeLoading" @click="handleDownload('lowcode')"
                  >下载低码视频</Button
                >
                <Button class="btn" :loading="originLoading" @click="handleDownload('origin')"
                  >下载原视频</Button
                >
                <!-- 当前视频的发布者 v-if="" -->
                <p
                  class="btn"
                  v-if="curUserId === (basicInfo.user ? basicInfo.user.id : '')"
                  @click="handleDeleteVersion"
                >
                  删除
                </p>
              </div>
            </Poptip>
          </FormItem>
        </Form>

        <h2 class="weight-title over_hide_2" :title="playInfo.name">
          &nbsp;{{ playInfo.name || '' }}
        </h2>
      </div>

      <div class="audit-box">
        <div class="left-col">
          <!-- <h2 class="video-title">{{ playInfo.name || "" }}</h2> -->
          <VideoSnapshot
            v-show="!isMXFUrl"
            ref="videoshot"
            :hideComment="noCommentAccess || !isTranscodeUrl"
            @get-image-list="handleVideoShot"
            @allCounts="allCounts"
          />
          <img
            v-if="!isTranscodeUrl && isMXFUrl"
            class="default-img"
            :src="transcodeCover"
            alt=""
          />
          <!-- 显示批注节点的进度条 未转码视频不能批注 所以不展示 -->
          <div class="progress-bar" v-if="isTranscodeUrl">
            <p class="time-show">0帧 / 00:00</p>
            <div class="slider-line">
              <el-slider :value="100" disabled></el-slider>
              <div class="all-dots">
                <div
                  v-show="allFrames && allFrames.length > 0"
                  v-for="(it, i) in allFrames"
                  :key="i"
                >
                  <el-tooltip placement="top" popper-class="circle-border">
                    <div slot="content">
                      <div class="person-img">
                        <img :src="it.avatar" alt="" />
                      </div>
                    </div>
                    <div
                      class="dot-label"
                      :style="{ left: it.percent }"
                      @click="scrolltoPos(it)"
                    ></div>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <p class="time-show">{{ durationCount.frame }}帧 / {{ durationCount.duration }}</p>
          </div>

          <div class="main-article" v-if="fromSeries">
            <div class="red-tips" v-if="transcodeing">*视频转码中，请稍后...</div>
            <div class="red-tips" v-else-if="!isTranscodeUrl">
              <span>*视频转码中，请稍后刷新重试&ensp;</span>
              <Button :loading="isLoading" size="small" @click="() => getDetail()">刷新</Button>
            </div>
            <!-- 文稿内容 -->
            <Tabs><TabPane label="文稿" name="1"></TabPane></Tabs>
            <div class="content-text" v-html="seriesArticleContent"></div>
          </div>
          <div class="main-article" v-else>
            <Tabs v-model="articleKey">
              <TabPane label="文稿" name="1"></TabPane>
              <TabPane label="串联单文稿" name="2"></TabPane>
            </Tabs>
            <ul>
              <li class="article-col" v-for="(item, index) in displayList" :key="item.id">
                <div class="art-title-line">
                  <p class="big-text">{{ item.title }}</p>
                  <Button type="primary" v-if="item.isFold" @click="handleOpen(index)"
                    >展开全部</Button
                  >
                  <Button v-else @click="handleClose(index)">收起内容</Button>
                </div>

                <div v-if="item.series_info && item.series_info.length > 0">
                  <div
                    class="grey-line"
                    v-for="{ id, time, cate_name, order } in item.series_info"
                    :key="id"
                  >
                    <p class="time">{{ time }}</p>
                    <p>
                      {{ cate_name }}
                      <span v-if="order">第{{ order }}条</span>
                    </p>
                  </div>
                </div>
                <div
                  :class="item.isFold ? 'content-text hide-content' : 'content-text'"
                  v-html="item.content"
                ></div>
              </li>
              <p class="no-content" v-if="!displayList || displayList.length === 0">
                {{ displayLoading ? '加载中...' : '暂无关联文稿' }}
              </p>
            </ul>
          </div>
        </div>

        <div class="right-col">
          <right-tabs
            ref="rightDom"
            :fileId="fileId"
            :userInfo="userInfo"
            :fromSeries="fromSeries"
            :version="formItem.version"
            :seriesList="seriesList"
            :basicInfo="basicInfo"
            :hideComment="noCommentAccess || !isTranscodeUrl"
            @startMark="handleShot"
            @removeFrame="handleRemoveFrame"
          />
        </div>
      </div>
    </Modal>
    <relate-manu-modal
      :bindArticles="bindArticles"
      :bindSerieArticles="bindSerieArticles"
      :chooseModalValue="manuModal"
      @chooseArticleOk="chooseManuOk"
      @chooseSeriesOk="chooseSerManuOk"
      @chooseDraftCancel="chooseManuCancel"
    ></relate-manu-modal>
    <relate-series-modal
      :bindSeriesInfo="bindSeriesInfo"
      :chooseModalValue="seriesModal"
      @chooseDraftOk="chooseSeriesOk"
      @chooseDraftCancel="chooseSeriesCancel"
    ></relate-series-modal>
    <update-version
      ref="upVersion"
      :chooseModalValue="uploadModal"
      @chooseDraftOk="confirmUpdate"
      @chooseDraftCancel="cancelUpdate"
    ></update-version>
    <!-- 重新用一个上传组件 调用转码 审片用的是转码视频，通过之后是原视频 -->
    <!-- 创建人-更新版本-上传 没有批注功能；审核人-批注 没有更新版本功能 -->
    <sucai-upload ref="uploadDom" @setTranscodeStatus="setTranscode" @uploadOk="setVideoUrl" />
  </div>
</template>

<script>
// import '@/assets/js/lib/videojs/video.js';
// import '@/assets/js/lib/videojs/videojs.framebyframe.js';
import '@/assets/js/lib/videojs/video-js.css';

// import '@/assets/js/lib/canvastools/canvastools.min.js';
import '@/assets/js/lib/canvastools/canvastools.min.css';

// import VideoSnapshot from "_c/video-snapshot";
import VideoSnapshot from './VideoSnapshot';
import RelateManuModal from './RelateManuModal';
import RelateSeriesModal from './RelateSeriesModal';
import UpdateVersion from './UpdateVersion';
import RightTabs from './RightTabs';
import SucaiUpload from '@/components/SucaiUpload';
import InfiniteLoading from 'vue-infinite-loading';
// downloadVideo
import { setBase64toFile, downloadFile, calcPercent } from './util';
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
import { Slider, Tooltip } from 'element-ui';
import {
  getSucaiVersionDetail,
  updateSucaiVersion,
  createVersionComment,
  getVersionTranscodeUrl,
  getVersionOriginUrl,
  bindArticle,
  bindSeriesArticle,
  bindSeries,
  getRelatedArticles,
  getRelatedSerieArticles,
  removeVideoVersion,
} from '@/api/audit';
import { getRelatedSeries } from '@/api/manu';
import $ from 'jquery';
import './index.scss';

export default {
  name: 'material_video',
  components: {
    VideoSnapshot,
    RelateManuModal,
    RelateSeriesModal,
    UpdateVersion,
    RightTabs,
    SucaiUpload,
    InfiniteLoading,
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
    'el-slider': Slider,
    'el-tooltip': Tooltip,
  },
  data() {
    return {
      all_Privs: ['bindSeries', 'bindArticle', 'updateVersion'],
      auditModal: false,
      allFrames: [], // frame_time percent
      versionList: [],
      // stateList: [
      //   { value: "1", label: "审核中" },
      //   { value: "2", label: "修改中" },
      //   { value: "3", label: "已完成" }
      // ],
      formItem: { version: '0' },
      saveLoading: false,
      manuModal: false,
      seriesModal: false,
      uploadModal: false,
      isLoading: false,
      playInfo: {
        id: null,
        name: '',
        url: '',
      },
      basicInfo: {},
      seriesList: [],
      lowcodeLoading: false,
      originLoading: false,
      articleKey: '1',
      displayList: [],
      displayLoading: false,
      durationCount: { duration: '0', frame: '0' },
      modalCallback: null,
      bindArticles: [],
      bindSerieArticles: [],
      bindSeriesInfo: [], // id列表
      transcodeing: false,
      transcodeCover:
        'https://img12.iqilu.com/10339/sucaiku/202008/19/d1fe0b3a210d30c63618e00824adf714.png',
      urlNotAvailable: false, // 视频地址不可用 转码中图片
      seriesUpdateCallback: null, // 串联单模块 更新版本的回调函数
    };
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
    // 是否来自串联单的审片
    fromSeries: {
      type: Boolean,
      default: false,
    },
    // 串联单审片：传入稿件内容
    seriesArticleContent: {
      type: String,
      default: '',
    },
    // 串联单：稿件创建人只能更新版本 没有批注权限
    noCommentAccess: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    auditModal(bool) {
      if (!bool) {
        this.$refs.videoshot.pauseVideo();
      }
    },
    articleKey() {
      this.getArticles();
    },
  },
  computed: {
    maskShow() {
      let state = this.$store.state.user.drawState;
      return state;
    },
    curUserId() {
      return this.userInfo.id || '';
    },
    isTranscodeUrl() {
      // https://stream7.shandian8.com/1/sucaiku/202205/17/011311e6f6064e849b1167ed9f9b13c1.mp4
      // https://stream7-transcode.iqilu.com/1/sucaiku/202105/06/96d08ad6a4874193b3c57a3ca009b26b.mp4
      return this.playInfo.url.startsWith('https://stream7-transcode.iqilu.com');
    },
    // 无法播放的视频格式 只能用转码封面替代视频标签展示
    isMXFUrl() {
      return this.playInfo.url.endsWith('.mxf');
    },
  },
  methods: {
    fileChange(version = '0') {
      // 全局loading？
      setTimeout(() => {
        this.formItem.version = version;
        this.showModal();
      }, 200);
    },
    handleVersionChange(val) {
      if (!val) return;

      this.playInfo = {
        id: '',
        name: '',
        url: '',
      };
      this.getDetail();
      // this.$refs.rightDom.resetHistory();
    },
    showModal(cb) {
      // 主要用于关闭列表中视频的加载状态
      this.formItem.version = '0';
      this.$refs.rightDom.imgList = [];
      this.displayList = [];
      this.playInfo = {
        id: '',
        name: '',
        url: '',
      };
      this.getArticles();
      this.getDetail(cb);
    },
    // 几种情形 1.打开弹窗 2.下拉选择 3.更新版本
    getDetail(callback) {
      this.isLoading = true;
      let initVersion = String(this.formItem.version);
      let file_id = this.fileId;
      if (!file_id) {
        this.$Message.warning('素材为空');
        return;
      }

      getSucaiVersionDetail(file_id, initVersion)
        .then((res) => {
          if (res.data.msg && res.data.msg.msg && res.data.msg.msg === '登录过期') {
            this.$Message.warning('登录过期，请重试');

            return;
          }

          if (res.status === 200 && file_id === this.fileId) {
            let { audits, basic, bindings, url, versions } = res.data.data;
            this.versionList = versions;
            this.formItem.version = initVersion;

            // 竖屏视频 url = 'https://stream7-transcode.iqilu.com/1/sucaiku/202104/28/ed24825f209642d789ef2d054459eab4.mp4';
            // created_at file_duration file_name file_size file_type user
            if (!initVersion || initVersion === '0') {
              let lastestVersion = versions.length > 0 ? versions[0].version : '0';
              this.$set(this.formItem, 'version', lastestVersion);
              this.formItem.version = lastestVersion;
            }

            setTimeout(() => {
              this.$refs.rightDom.resetHistory();
            }, 500);

            this.basicInfo = basic;
            this.playInfo = {
              id: this.fileId,
              name: basic.file_name,
              url,
            };
            this.$refs.videoshot.setSource(this.playInfo);

            const { article = [], series_item = [], series = [] } = bindings;
            // 文稿 article: [{source_id: "3220"}] series: [{source_id: "45"}]
            // 串联单文稿 series_item: [{source_id: "12", series_id: "3", remote_item_id: ""},…]
            this.bindArticles = article.map(({ source_id }) => Number(source_id)) || [];
            this.bindSerieArticles = series_item.map(({ source_id }) => Number(source_id)) || [];

            this.bindSeriesInfo = series.map(({ source_id }) => source_id) || []; // 整个串联单
            !this.fromSeries && this.getSeriesList();
            this.allFrames = audits.map(
              // ,frame_pos
              ({ id, frame_time, user: { avatar = '' } }) => {
                let percent = calcPercent(frame_time, basic.file_duration); // "9.69%"
                return { id, frame_time, percent, avatar };
              }
            );
            this.auditModal = true;
          }
        })
        .catch((err) => {
          console.log('打开弹窗失败', err);
        })
        .finally(() => {
          callback && callback();
          this.isLoading = false;
        });
    },
    getArticles() {
      if (this.fromSeries) return;

      this.displayList = [];
      this.displayLoading = true;
      if (this.articleKey === '2') {
        getRelatedSerieArticles(this.fileId)
          .then((res) => {
            if (res.status === 200) {
              const { data } = res.data;
              this.displayList = data.map((ele) => ({ ...ele, isFold: true }));
            }
          })
          .finally(() => {
            this.displayLoading = false;
          });
      } else {
        getRelatedArticles(this.fileId)
          .then((res) => {
            if (res.status === 200) {
              const { data } = res.data;
              this.displayList = data.map((ele) => ({ ...ele, isFold: true }));
            }
          })
          .finally(() => {
            this.displayLoading = false;
          });
      }
    },
    handleOpen(i) {
      this.$set(this.displayList[i], 'isFold', false);
    },
    handleClose(i) {
      this.$set(this.displayList[i], 'isFold', true);
    },
    getSeriesList() {
      if (!this.bindSeriesInfo || this.bindSeriesInfo.length === 0) return;

      getRelatedSeries(this.bindSeriesInfo).then((res) => {
        if (res.status === 200) {
          const { series } = res.data.data;
          this.seriesList = series; // cate_name: "广播测试栏目" id: 31 time: "2021-05-31" userData: "丁照轩"
        }
      });
    },
    allCounts(duration, frame) {
      this.durationCount = { duration, frame };
    },
    handleVideoShot(imageItem) {
      let user = {
        id: this.userInfo.id,
        avatar: this.userInfo.avatar,
        nickname: this.userInfo.nickname,
      };

      const { currentPosition, currentFrame, imgUrl, percent, content } = imageItem;
      let frame_time = parseInt(currentPosition);
      let formatItem = {
        id: 'new',
        status: '0',
        content,
        created_at: ' 刚刚',
        frame_time,
        frame_pos: currentFrame,
        frame_url: imgUrl,
        user,
      };

      this.$refs.rightDom.startSaveComment(formatItem);
      // 知道多少帧 知道截图 操作人的头像名称
      this.allFrames.push({
        id: 'new',
        frame_time,
        percent,
        avatar: user.avatar,
      });
      let i = this.allFrames.length - 1;
      this.saveComment(formatItem, i);
    },
    saveComment(data, index) {
      this.saveLoading = true;
      const { frame_url, content, frame_time, frame_pos } = data;
      let file = setBase64toFile(frame_url, frame_time + 's', 'image/jpeg');
      createVersionComment(this.fileId, this.formItem.version, content, frame_time, frame_pos, file)
        .then((res) => {
          if (res.status === 200) {
            const { id = '' } = res.data.data;
            this.$set(this.allFrames[index], 'id', id);
          }

          this.$refs.rightDom.refreshList(res, (item) => {
            this.scrolltoPos(item);
          });
        })
        .catch((err) => {
          console.log('err', err);
        })
        .finally(() => {
          this.saveLoading = false;
        });
    },

    // 插入批注
    handleShot() {
      this.$refs.videoshot.handleMark();
    },
    handleRemoveFrame(index) {
      this.allFrames.splice(index, 1);
    },
    scrolltoPos(it) {
      let domList = this.$refs.imgArr ? this.$refs.imgArr.children : [];
      for (var i = 0; i < domList.length; i++) {
        if (String(domList[i].id) === String(it.id)) {
          // 为了固定住modal弹窗不滚动
          let modalDom = $('#auditmodal .ivu-modal-wrap');
          modalDom.css('overflow', 'visible');
          domList[i].scrollIntoView();
          console.log('滚动', i, domList[i], domList[i].id);

          setTimeout(() => {
            modalDom.css('overflow', 'auto');
          }, 200);
        }
      }
    },
    // type: 'lowcode'|'origin'
    handleDownload(type = 'lowcode') {
      let methodObj = { lowcode: getVersionTranscodeUrl, origin: getVersionOriginUrl };
      let reqMethod = methodObj[type];
      this[`${type}Loading`] = true;

      reqMethod(this.fileId, this.formItem.version)
        .then((res) => {
          // 如果该时段内暂无相关内容 直接res为undefined 全局的297错误码拦截
          if (res && res.data.data.url) {
            // downloadVideo(res.data.data.url, this.playInfo.name);
            let src = res.data.data.url + '?filename=' + this.playInfo.name;
            console.log('downloadFile', src);
            downloadFile(src);
          } else {
            this.$Message.warning(res.data.msg || '获取下载地址失败');
          }
        })
        .catch((err) => {
          this.$Message.error(err.msg || '下载失败');
        })
        .finally(() => {
          setTimeout(() => {
            this[`${type}Loading`] = false;
          }, 500);
        });
    },
    // 关联文稿
    handleChooseManu() {
      this.manuModal = true;
    },
    // 选择已有文章modal事件
    chooseManuCancel() {
      this.manuModal = false;
    },
    chooseManuOk(ids) {
      bindArticle(this.fileId, ids).then((res) => {
        if (res.status === 200) {
          this.$Message.success(res.data.msg || '关联成功');
          this.manuModal = false;
          this.getDetail();
          this.getArticles();
        } else {
          this.$Message.error(res.data.msg || '关联失败');
        }
      });
    },
    chooseSerManuOk(ids) {
      bindSeriesArticle(this.fileId, ids).then((res) => {
        if (res.status === 200) {
          this.$Message.success(res.data.msg || '关联成功');
          this.manuModal = false;
          this.getDetail();
          this.getArticles();
        } else {
          this.$Message.error(res.data.msg || '关联失败');
        }
      });
    },
    // 关联串联单
    handleChooseSeries() {
      this.seriesModal = true;
    },
    // 选择已有文章modal事件
    chooseSeriesCancel() {
      this.seriesModal = false;
    },
    chooseSeriesOk(ids) {
      // series_id, source_id, remote_item_id
      bindSeries(this.fileId, ids).then((res) => {
        if (res.status === 200) {
          this.$Message.success(res.data.msg || '关联成功');
          this.seriesModal = false;
          this.getDetail();
        } else {
          this.$Message.error(res.data.msg || '关联失败');
        }
      });
    },
    handleDeleteVersion() {
      this.$Modal.confirm({
        title: '删除',
        content: '<p>确认要删除当前版本吗？</p>',
        loading: true,
        onOk: () => {
          removeVideoVersion(this.fileId, this.formItem.version)
            .then((res) => {
              this.$Message.info(res.data.msg || '操作成功');
              // 刷新页面
              let removeInd = null;
              this.versionList.forEach(({ version }, i) => {
                if (this.formItem.version === version) {
                  removeInd = i;
                }
              });

              if (removeInd >= 0) {
                this.versionList.splice(removeInd, 1);
                if (this.versionList.length > 0) {
                  this.formItem.version = this.versionList[0].version;
                  this.getDetail();
                }
              }
            })
            .catch((err) => {
              console.log('err', err);
            })
            .finally(() => {
              this.$Modal.remove();
            });
        },
      });
    },
    handleUpdateVersion(cb) {
      if (this.fromSeries) {
        this.seriesUpdateCallback = cb;
        this.$refs.uploadDom.uploadVideo();
      } else {
        this.seriesUpdateCallback = null;
        this.uploadModal = true;
        this.$refs.upVersion.openModal();
      }
    },
    setTranscode(status) {
      this.transcodeing = status;
    },
    setVideoUrl(transcodeOk, file) {
      // console.log('视频地址', transcodeOk, file);

      if (!transcodeOk) {
        // 原地址 更新版本
        this.confirmUpdate(file);
      } else {
        this.playInfo.url = file.url;
        this.$refs.videoshot.setSource(this.playInfo);
      }
    },
    confirmUpdate(file, callback) {
      updateSucaiVersion(this.fileId, file.url)
        .then((res) => {
          if (res.status === 200) {
            const { version, id } = res.data.data;
            this.$Message.success(res.data.msg || '版本更新成功');
            this.formItem.version = String(version);
            this.seriesUpdateCallback && this.seriesUpdateCallback(version, id);
            this.getDetail();
          } else {
            this.$Message.error(res.data.msg || '版本更新失败');
          }
        })
        .finally(() => {
          callback && callback();
        });
    },
    cancelUpdate() {
      this.uploadModal = false;
    },
  },
};
</script>
