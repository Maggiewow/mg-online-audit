<!--
 * @文件描述: 在线审片弹窗
  【腾讯文档】在线审片测试问题 https://docs.qq.com/doc/DREhZZFZuWmFORnZy
 * @公司: 广电信通
 * @作者: 赵婷婷
 * @Date: 2021-05-25 09:42:55
 * @LastEditors: 赵婷婷
 * @LastEditTime: 2021-07-14 15:10:18
-->
<template>
  <div>
    <!-- 在线审片 -->
    <Modal
      id="auditmodal"
      v-model="auditModal"
      width="1200"
      class="modal-con"
      :styles="{ top: '0px' }"
      footer-hide
      title="在线审片"
      :mask-closable="false"
    >
      <div class="modal-inner-mask" v-if="maskShow"></div>
      <div class="title-opr-line">
        <!-- <h2 class="weight-title">{{ playInfo.name || "" }}</h2> -->

        <Form class="set-form" :model="formItem" :label-width="0">
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

            <Poptip trigger="hover">
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
                <Button class="btn" :loading="downloadLoading1" @click="handleDownload(1)"
                  >下载低码视频</Button
                >
                <Button class="btn" :loading="downloadLoading2" @click="handleDownload(2)"
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
      </div>

      <div class="audit-box">
        <div class="left-col">
          <!-- <h2 class="video-title">{{ playInfo.name || "" }}</h2> -->
          <VideoSnapshot ref="videoshot" @get-image-list="handleVideoShot" @allCounts="allCounts" />

          <div class="progress-bar">
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
          <div class="main-article">
            <Tabs v-model="articleKey">
              <TabPane label="文稿" name="1"> </TabPane
              ><TabPane label="串联单文稿" name="2"> </TabPane>
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

        <div class="right-col" ref="rightCol">
          <Tabs v-model="tabKey">
            <TabPane :label="`批注（${hasComment ? imgList.length : '0'}）`" name="1">
              <Form class="com-form" :model="commentItem" :label-width="0">
                <FormItem label="">
                  <Button type="success" size="small" class="per-btn" @click="handleShot"
                    >插入批注</Button
                  >
                </FormItem>
                <!-- order_type sort_type is_resolve -->
                <FormItem label="" prop="type" class="per-sel">
                  <Select v-model="commentItem.order_type">
                    <Option v-for="{ value, label } in typeList" :value="value" :key="value">{{
                      label
                    }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="" prop="status" class="per-sel">
                  <Select v-model="commentItem.is_resolve">
                    <Option v-for="{ value, label } in statusList" :value="value" :key="value">{{
                      label
                    }}</Option>
                  </Select>
                </FormItem>
              </Form>
              <ul class="img-list" ref="imgArr">
                <li class="img-item" v-for="(item, index) in imgList" :key="item.id" :id="item.id">
                  <div class="opr-line">
                    <div class="user">
                      <div class="avatar-img">
                        <img :src="item.user.avatar" alt="" />
                      </div>
                      <p class="over_hide user-name blue-text">
                        {{ item.user.nickname }}
                      </p>
                      <p class="cre-time">
                        {{ item.created_at.split(' ')[1] }}
                      </p>
                    </div>
                    <div class="opr-col">
                      <Button type="info" class="small-opr-btn" ghost @click="goReply(item, index)"
                        >回复</Button
                      >
                      <Button
                        v-if="curUserId === (item.user ? item.user.id : '')"
                        type="error"
                        class="small-opr-btn"
                        ghost
                        @click="goRemove(item, index)"
                        >删除</Button
                      >
                      <Button
                        v-if="
                          item.status === '0' &&
                            curUserId === (basicInfo.user ? basicInfo.user.id : '')
                        "
                        type="success"
                        class="small-opr-btn"
                        ghost
                        @click="goComplete(item, index)"
                        >完成</Button
                      >
                    </div>
                  </div>

                  <div class="audit-info">
                    <div class="shot-line">
                      <el-image
                        :src="item.frame_url"
                        :preview-src-list="ImageList(imgList)"
                        fit="cover"
                        class="audit-pic"
                      ></el-image>
                      <div class="audit-title">
                        （第{{ item.frame_pos }}帧 / 第{{ item.frame_time }}秒）
                      </div>
                    </div>
                    <p class="main-cont">{{ item.content }}</p>
                  </div>
                  <ul
                    class="reply-list"
                    :style="{
                      padding: item.child && item.child.length > 0 ? '10px 6px 10px 30px' : '0px',
                    }"
                  >
                    <li class="rep-item" v-for="(it, ind) in item.child" :key="it.id">
                      <div v-if="!it.replyShow">
                        <div class="rep-line">
                          <div class="user">
                            <div class="avatar-img">
                              <img :src="it.user.avatar" alt="" />
                            </div>
                            <p class="over_hide user-name">
                              {{ it.user.nickname }}
                            </p>
                            <p class="cre-time">
                              {{ it.created_at.split(' ')[1] }}
                            </p>
                          </div>
                          <div class="rep-opr-col">
                            <Button
                              type="info"
                              class="small-opr-btn"
                              ghost
                              @click="goReplyComment(index, it, ind)"
                              >回复</Button
                            >
                            <Button
                              v-if="curUserId === (it.user ? it.user.id : '')"
                              type="error"
                              class="small-opr-btn"
                              ghost
                              @click="goRemoveComment(index, it, ind)"
                              >删除</Button
                            >
                          </div>
                        </div>
                        <div class="rep-main-cont">
                          <span class="blue-text" v-if="it.reply_user"
                            >@{{ it.reply_user.nickname }}</span
                          >
                          {{ it.content }}
                        </div>
                      </div>

                      <div class="input-box" v-if="it.replyShow">
                        <span class="blue-text" v-if="it.reply_user"
                          >@{{ it.reply_user.nickname }}</span
                        >
                        <Input
                          v-model="it.content"
                          :maxlength="200"
                          :rows="4"
                          show-word-limit
                          type="textarea"
                          placeholder="请输入..."
                        />
                        <div class="inp-save">
                          <Button
                            type="info"
                            class="small-opr-btn"
                            ghost
                            @click="cancelComReply(it, ind)"
                            >取消</Button
                          ><Button
                            type="success"
                            class="small-opr-btn"
                            ghost
                            :loading="repLoading"
                            @click="saveComReply(it, ind)"
                            >确定</Button
                          >
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
                <!--infinite-loading这个组件要放在列表的底部，滚动的盒子里面！-->
                <!-- spinner: 'default' | 'bubbles' | 'circles' | 'spiral' | 'waveDots' -->
                <infinite-loading @infinite="infiniteHandler">
                  <span slot="no-more" class="gray-text">{{
                    comLoading ? '加载中...' : '没有更多了'
                  }}</span>
                  <span slot="no-results" class="gray-text">
                    {{
                      comLoading
                        ? '加载中...'
                        : finished && imgList && imgList.length > 0
                        ? '没有更多了'
                        : '暂无批注'
                    }}
                  </span>
                </infinite-loading>
              </ul>
            </TabPane>
            <TabPane label="串联单" name="2">
              <div class="series-list">
                <div class="series-item" v-for="it in seriesList" :key="it.id">
                  <p class="title-text">{{ it.cate_name }}</p>
                  <div class="info-line">
                    <p>责任编辑：{{ it.userData }}</p>
                    &ensp;
                    <p class="time">{{ it.time }}</p>
                  </div>
                </div>
                <p class="gray-text middle" v-if="!seriesList || seriesList.length === 0">
                  没有更多了
                </p>
              </div>
            </TabPane>
            <TabPane label="基本信息" name="3">
              <div class="base-list">
                <div class="base-item title-deep">名称：{{ basicInfo.file_name }}</div>
                <div class="base-item">上传时间：{{ basicInfo.created_at }}</div>
                <div class="base-item">
                  上传人：{{ basicInfo.user ? basicInfo.user.nickname : '' }}
                </div>
                <div class="base-item">原视频大小：{{ calcFileSize(basicInfo.file_size) }}</div>
                <div class="base-item">视频时长：{{ basicInfo.file_duration }}秒</div>
                <div class="base-item">视频格式：{{ basicInfo.file_type }}</div>
                <div class="base-item">关键词：{{ basicInfo.file_keyword }}</div>
                <div class="base-item">描述：{{ basicInfo.file_profile }}</div>
              </div>
            </TabPane>
          </Tabs>
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
      :chooseModalValue="uploadModal"
      @chooseDraftOk="confirmUpdate"
      @chooseDraftCancel="cancelUpdate"
    ></update-version>
  </div>
</template>

<script>
// import VideoSnapshot from "_c/video-snapshot";
import VideoSnapshot from './VideoSnapshot';
import RelateManuModal from './RelateManuModal';
import RelateSeriesModal from './RelateSeriesModal';
import UpdateVersion from './UpdateVersion';
import InfiniteLoading from 'vue-infinite-loading';

import { setBase64toFile, downloadVideo, calcPercent } from './util';
import {
  getSucaiVersionDetail,
  getAuditHistory,
  updateSucaiVersion,
  createVersionComment,
  replayVersionComment,
  removeVersionAudit,
  completeVersionAudit,
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
    InfiniteLoading,
  },
  data() {
    return {
      all_Privs: ['bindSeries', 'bindArticle', 'updateVersion'],
      auditModal: false,
      tabKey: '1',
      allFrames: [], // frame_time percent
      versionList: [],
      // stateList: [
      //   { value: "1", label: "审核中" },
      //   { value: "2", label: "修改中" },
      //   { value: "3", label: "已完成" }
      // ],
      typeList: [
        { value: 'video_timeline', label: '视频时间线' },
        { value: 'audit_timeline', label: '批注时间' },
      ],
      statusList: [
        { value: '999', label: '全部批注' },
        { value: '1', label: '已解决' },
        { value: '0', label: '未解决' },
      ],
      formItem: { version: '0' },
      commentItem: { order_type: 'video_timeline', is_resolve: '999' },
      saveLoading: false,
      repLoading: false,
      manuModal: false,
      seriesModal: false,
      uploadModal: false,
      playInfo: {
        id: null,
        name: '',
        url: '',
      },
      // 批注列表
      page: 1,
      totalPage: 0,
      imgList: [],
      comLoading: false,
      finished: false,
      curIndex: 0, // 当前评论的这一条批注的索引值
      basicInfo: {},
      seriesList: [],
      downloadLoading1: false,
      downloadLoading2: false,
      articleKey: '1',
      displayList: [],
      displayLoading: false,
      durationCount: { duration: '0', frame: '0' },
      isEdit: false,
      modalCallback: null,
      bindArticles: [],
      bindSerieArticles: [],
      bindSeriesInfo: [], // id列表
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
  },
  watch: {
    commentItem: {
      handler() {
        this.resetHistory();
      },
      deep: true,
    },
    imgList: {
      handler() {
        console.log('批注列表更新');
      },
      deep: true,
    },
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
    hasComment() {
      return this.imgList && this.imgList.length > 0;
    },
    maskShow() {
      let state = this.$store.state.user.drawState;
      return state;
    },
    curUserId() {
      return this.userInfo.id || '';
    },
  },
  created() {},
  mounted() {},
  methods: {
    handleVersionChange(val) {
      if (!val) return;

      this.playInfo = {
        id: '',
        name: '',
        url: '',
      };
      this.getDetail();
      this.resetHistory();
    },
    showModal(cb) {
      // 主要用于关闭列表中视频的加载状态
      this.formItem.version = '0';
      this.imgList = [];
      this.displayList = [];
      this.playInfo = {
        id: '',
        name: '',
        url: '',
      };
      this.getArticles();
      this.getDetail(cb);
    },
    calcFileSize(bytesize) {
      let result = '';
      if (bytesize >= 1 * 1024 * 1024) {
        result = (bytesize / (1024 * 1024)).toFixed(2) + 'MB';
      } else {
        result = (bytesize / 1024).toFixed(2) + 'KB';
      }
      return result;
    },
    // 几种情形 1.打开弹窗 2.下拉选择 3.更新版本
    getDetail(callback) {
      let initVersion = this.formItem.version;
      let file_id = this.fileId;

      getSucaiVersionDetail(file_id, initVersion)
        .then((res) => {
          console.log('打开弹窗res.data', res.data);
          if (res.data.msg && res.data.msg.msg && res.data.msg.msg === '登录过期') {
            this.$Message.warning('登录过期，请重试');
            callback && callback();
            return;
          }

          if (res.status === 200 && file_id === this.fileId) {
            let { audits, basic, bindings, url, versions } = res.data.data;
            this.versionList = versions;
            // 竖屏视频 url = "https://stream7-transcode.iqilu.com/1/sucaiku/202104/28/ed24825f209642d789ef2d054459eab4.mp4";
            // created_at file_duration file_name file_size file_type user
            if (!this.formItem.version || this.formItem.version === '0') {
              this.formItem.version = versions.length > 0 ? versions[0].version : '0';
            }

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
            this.getSeriesList();
            this.resetHistory();
            this.allFrames = audits.map(
              // ,frame_pos
              ({ id, frame_time, user: { avatar = '' } }) => {
                let percent = calcPercent(frame_time, basic.file_duration); // "9.69%"
                return { id, frame_time, percent, avatar };
              }
            );
            this.auditModal = true;
            callback && callback();
            console.log('打开弹窗', this.auditModal, this.playInfo);
          }
        })
        .catch((err) => {
          console.log('打开弹窗失败', err);
          callback && callback();
        });
    },
    getArticles() {
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
    getHistory(cb) {
      if (!this.formItem.version || this.formItem.version === '0') return;

      this.comLoading = true;
      const { order_type, is_resolve } = this.commentItem;
      let pageNow = this.page;

      getAuditHistory(this.fileId, this.formItem.version, this.page, order_type, is_resolve)
        .then((res) => {
          if (res.status === 200 && pageNow === this.page) {
            const { last_page, list } = res.data.data;
            if (this.page === 1 && list.length > 0) {
              this.imgList = [];
            }

            let arr = list.map((ele) => {
              if (ele.child && ele.child.length > 0) {
                ele.child.forEach((it) => {
                  it.replyShow = false;
                });
              }

              return ele;
            });
            this.isEdit = false;
            this.imgList = this.imgList.concat(arr);
            this.finished = this.page >= last_page;
            this.totalPage = last_page;
            this.page = pageNow + 1;
          }
        })
        .finally(() => {
          this.comLoading = false;
          cb && cb();
        });
    },
    resetHistory() {
      this.imgList = [];
      this.page = 1;
      this.totalPage = 0;
      this.finished = false;
      this.getHistory();
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
      console.log('批注', imageItem);
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
      this.isEdit = true;
      // unshift ==> push  0 ==> i
      this.imgList.push(formatItem);
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
    infiniteHandler($state) {
      if (this.finished) {
        $state.complete();
        return false;
      }

      this.getHistory(() => {
        this.finished ? $state.complete() : $state.loaded();
      });
    },
    ImageList(imgList) {
      // imgUrl frame_url
      return imgList.map((t) => t.frame_url);
    },
    delMarkImage(index) {
      this.imgList.splice(index, 1);
      this.allFrames.splice(index, 1);
      let bH = document.body.offsetHeight;
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
            this.$set(this.imgList[index], 'id', id);
            this.isEdit = false;
            this.$nextTick(() => {
              this.scrolltoPos(this.imgList[index]);
            });
          } else {
            this.delMarkImage(index);
            this.$Message.warning(res.data.msg || '发布失败');
          }
        })
        .catch((err) => {
          console.log('err', err);
        })
        .finally(() => {
          this.saveLoading = false;
        });
    },
    // 给父级评论
    goReply(data, index) {
      if (this.isEdit) return;

      this.curIndex = index;
      let user = {
        id: this.userInfo.id,
        avatar: this.userInfo.avatar,
        nickname: this.userInfo.nickname,
      };
      let replyItem = {
        id: 'newc',
        pid: data.id,
        content: '',
        created_at: ' 刚刚',
        user,
        reply_user: data.user,
        replyShow: true,
      };
      this.isEdit = true;
      let children = this.imgList[this.curIndex].child || [];
      children.push(replyItem);
      this.$set(this.imgList[this.curIndex], 'child', children);
    },
    goRemove(data, index) {
      this.$Modal.confirm({
        title: '删除',
        content: '<p>确定要删除本条批注吗？</p>',
        loading: true,
        onOk: () => {
          if (data.id === 'new') {
            this.delMarkImage(index);
            this.$Message.info('操作成功');
            this.$Modal.remove();
            return;
          }

          removeVersionAudit(data.id)
            .then((res) => {
              this.delMarkImage(index);
              this.$Message.info(res.data.msg || '操作成功');
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
    goComplete(data, index) {
      if (this.isEdit) return;

      this.$Modal.confirm({
        title: '完成',
        content: '<p>确认本条批注已完成了吗？</p>',
        // okText: "确定",
        // cancelText: "取消",
        loading: true,
        onOk: () => {
          completeVersionAudit(data.id)
            .then((res) => {
              this.$set(this.imgList[index], 'status', '1');
              this.$Message.info(res.data.msg || '操作成功');
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
    goReplyComment(pIndex, data, index) {
      if (this.isEdit) return;

      this.curIndex = pIndex;
      let user = {
        id: this.userInfo.id,
        avatar: this.userInfo.avatar,
        nickname: this.userInfo.nickname,
      };
      console.log('goReply', data, index);
      let replyItem = {
        id: 'newc',
        pid: data.id,
        content: '',
        created_at: ' 刚刚',
        user,
        reply_user: data.user,
        replyShow: true,
      };
      this.isEdit = true;
      this.imgList[this.curIndex].child.push(replyItem);
    },
    delMarkReply(pIndex, index) {
      let repList = this.imgList[pIndex].child;
      repList.splice(index, 1);
      this.$set(this.imgList[pIndex], 'child', repList);
    },
    goRemoveComment(pIndex, data, index) {
      this.$Modal.confirm({
        title: '删除',
        content: '<p>确定要删除本条回复吗？</p>',
        loading: true,
        onOk: () => {
          if (data.id === 'newc') {
            this.delMarkReply(pIndex, index);
            this.$Message.info('操作成功');
            this.$Modal.remove();
            return;
          }

          removeVersionAudit(data.id)
            .then((res) => {
              this.delMarkReply(pIndex, index);
              this.$Message.info(res.data.msg || '操作成功');
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
    saveComReply(item, index) {
      this.repLoading = true;
      replayVersionComment(this.fileId, this.formItem.version, item.content, item.pid)
        .then((res) => {
          const { id = '', created_at } = res.data.data;
          let completeItem = {
            ...item,
            id,
            created_at,
            replyShow: false,
          };
          this.$set(this.imgList[this.curIndex].child, index, completeItem);
          this.isEdit = false;
          this.curIndex = null;
        })
        .catch((err) => {
          console.log('err', err);
        })
        .finally(() => {
          this.repLoading = false;
        });
    },
    // 取消评论
    cancelComReply(data, index) {
      if (!data.replyShow) return;

      this.imgList[this.curIndex].child.splice(index, 1);
      // this.$set(this.imgList[this.curIndex].child[index], "replyShow", false);
      this.curIndex = null;
      this.isEdit = false;
    },
    // 插入批注
    handleShot() {
      this.$refs.videoshot.handleMark();
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
    handleDownload(type = 1) {
      type = Number(type);
      let methodObj = { 1: getVersionTranscodeUrl, 2: getVersionOriginUrl };
      let reqMethod = methodObj[type];
      this[`downloadLoading${type}`] = true;

      reqMethod(this.fileId, this.formItem.version)
        .then((res) => {
          console.log('下载res', res && res.data.data.url, res.data.data);
          // 如果该时段内暂无相关内容 直接res为undefined 全局的297错误码拦截
          if (res && res.data.data.url) {
            downloadVideo(res.data.data.url, this.playInfo.name);
          } else {
            this.$Message.warning(res.data.msg || '获取下载地址失败');
          }
        })
        .catch((err) => {
          this.$Message.error(err.msg || '下载失败');
        })
        .finally(() => {
          setTimeout(() => {
            this[`downloadLoading${type}`] = false;
          }, 500);
        });
    },
    handleUpdateVersion() {
      this.uploadModal = true;
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
    confirmUpdate(file, callback) {
      console.log('确认', file);
      updateSucaiVersion(this.fileId, file.url)
        .then((res) => {
          if (res.status === 200) {
            const { version } = res.data.data;
            this.$Message.success(res.data.msg || '版本更新成功');
            this.uploadModal = false;
            this.formItem.version = version;
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
  },
};
</script>
