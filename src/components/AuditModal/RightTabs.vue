<template>
  <Tabs v-model="tabKey">
    <TabPane :label="`批注（${commentCount}）`" name="1">
      <Form class="com-form" :model="commentItem" :label-width="0">
        <FormItem label="">
          <Button
            type="success"
            size="small"
            class="per-btn"
            :disabled="hideComment"
            @click="handleShot"
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
                  item.status === '0' && curUserId === (basicInfo.user ? basicInfo.user.id : '')
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
                :preview-src-list="shotImageList"
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
                  <span class="blue-text" v-if="it.reply_user">@{{ it.reply_user.nickname }}</span>
                  {{ it.content }}
                </div>
              </div>

              <div class="input-box" v-if="it.replyShow">
                <span class="blue-text" v-if="it.reply_user">@{{ it.reply_user.nickname }}</span>
                <Input
                  v-model="it.content"
                  :maxlength="200"
                  :rows="4"
                  show-word-limit
                  type="textarea"
                  placeholder="请输入..."
                />
                <div class="inp-save">
                  <Button type="info" class="small-opr-btn" ghost @click="cancelComReply(it, ind)"
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
    <TabPane label="串联单" name="2" v-if="!fromSeries">
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
        <div class="base-item">上传人：{{ basicInfo.user ? basicInfo.user.nickname : '' }}</div>
        <div class="base-item">原视频大小：{{ calcFileSize(basicInfo.file_size) }}</div>
        <div class="base-item">视频时长：{{ basicInfo.file_duration }}秒</div>
        <div class="base-item">视频格式：{{ basicInfo.file_type }}</div>
        <div class="base-item">关键词：{{ basicInfo.file_keyword }}</div>
        <div class="base-item">描述：{{ basicInfo.file_profile }}</div>
      </div>
    </TabPane>
  </Tabs>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import { Tabs, TabPane, Button, Form, FormItem, Select, Option, Input } from 'view-design';
import { Image } from 'element-ui';

import {
  getAuditHistory,
  replayVersionComment,
  removeVersionAudit,
  completeVersionAudit,
} from '@/api/audit';

export default {
  name: 'right-tabs',
  props: {
    fileId: {
      type: String,
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
    fromSeries: {
      type: Boolean,
      default: false,
    },
    // formItem.version
    version: {
      type: String | Number,
      default: '',
    },
    seriesList: {
      type: Array,
      default: [],
    },
    basicInfo: {
      type: Object,
      default: {},
    },
    hideComment: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tabKey: '1',
      commentItem: { order_type: 'video_timeline', is_resolve: '999' },
      typeList: [
        { value: 'video_timeline', label: '视频时间线' },
        { value: 'audit_timeline', label: '批注时间' },
      ],
      statusList: [
        { value: '999', label: '全部批注' },
        { value: '1', label: '已解决' },
        { value: '0', label: '未解决' },
      ],
      // 批注列表
      page: 1,
      totalPage: 0,
      imgList: [],
      comLoading: false,
      finished: false,
      isEdit: false,
      curIndex: 0, // 当前评论的这一条批注的索引值
      repLoading: false,
    };
  },
  components: {
    InfiniteLoading,
    Tabs,
    TabPane,
    Button,
    Form,
    FormItem,
    Select,
    Option,
    Input,
    'el-image': Image,
  },
  watch: {
    commentItem: {
      handler() {
        this.resetHistory();
      },
      deep: true,
    },
  },
  computed: {
    commentCount() {
      if (this.imgList && this.imgList.length > 0) {
        return this.imgList.length;
      }

      return '0';
    },
    curUserId() {
      return this.userInfo.id || '';
    },
    shotImageList() {
      // imgUrl frame_url
      return this.imgList.map((t) => t.frame_url);
    },
  },
  methods: {
    calcFileSize(bytesize) {
      let result = '';
      if (bytesize >= 1 * 1024 * 1024) {
        result = (bytesize / (1024 * 1024)).toFixed(2) + 'MB';
      } else {
        result = (bytesize / 1024).toFixed(2) + 'KB';
      }
      return result;
    },
    resetHistory() {
      this.imgList = [];
      this.page = 1;
      this.totalPage = 0;
      this.finished = false;
      this.getHistory();
    },
    getHistory(cb) {
      this.imgList = [];
      this.totalPage = 0;
      this.page = 1;
      if (!this.version || this.version === '0') return;

      this.comLoading = true;
      const { order_type, is_resolve } = this.commentItem;
      let pageNow = this.page;

      getAuditHistory(this.fileId, this.version, this.page, order_type, is_resolve)
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
    infiniteHandler($state) {
      if (this.finished) {
        $state.complete();
        return false;
      }

      this.getHistory(() => {
        this.finished ? $state.complete() : $state.loaded();
      });
    },
    // 通知父组件 插入批注
    handleShot() {
      this.$emit('startMark');
      // this.$refs.videoshot.handleMark();
    },

    /** 有关批注的方法 */

    // 点击保存批注时
    startSaveComment(formatItem) {
      this.isEdit = true;
      this.imgList.push(formatItem);
    },
    // 保存批注之后 callback
    refreshList(res, cb) {
      if (res.status === 200) {
        const { id = '' } = res.data.data;
        this.$set(this.imgList[index], 'id', id);
        this.isEdit = false;
        this.$nextTick(() => {
          cb && cb(this.imgList[index]);
        });
      } else {
        this.delMarkImage(index);
        this.$Message.warning(res.data.msg || '发布失败');
      }
    },

    delMarkImage(index) {
      this.imgList.splice(index, 1);
      this.$emit('removeFrame', index);
      // let bH = document.body.offsetHeight;
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
      replayVersionComment(this.fileId, this.version, item.content, item.pid)
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
  },
};
</script>

<style lang="less" scoped></style>
