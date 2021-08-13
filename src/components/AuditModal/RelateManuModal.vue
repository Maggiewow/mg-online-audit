<!--
 * @Author: your name
 * @Date: 2020-07-31 15:02:00
 * @LastEditTime: 2021-07-14 11:27:06
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath: \manuscript-pc\src\view\components\manuscripts\wechatDraftModal.vue
-->
<template>
  <div>
    <Modal
      v-model="modalKey"
      title="关联文稿"
      ok-text="确定"
      @on-ok="chooseDraftOk"
      @on-cancel="chooseDraftCancel"
      width="700"
    >
      <div class="modal-dom">
        <Tabs v-model="tabKey">
          <TabPane label="文稿" name="1">
            <Table
              ref="selection"
              :columns="columns"
              :data="manuList"
              @on-selection-change="chooseData"
              :loading="tableLoading"
            ></Table>
            <div class="pageDom">
              <Page
                :current="page"
                :total="total"
                show-elevator
                show-total
                @on-change="changePage"
              />
            </div>
          </TabPane>
          <TabPane label="串联单文稿" name="2">
            <Form class="filter-form" :model="formItem" :label-width="100">
              <FormItem label="栏目：" prop="cateId">
                <Select v-model="formItem.cateId" :style="{ width: '150px' }">
                  <Option v-for="{ id, name } in cateList" :value="id" :key="id">{{ name }}</Option>
                </Select>
              </FormItem>
              <FormItem label="日期：" prop="pickDate">
                <DatePicker
                  v-model="formItem.pickDate"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                  :style="{ width: '180px' }"
                ></DatePicker>
              </FormItem>
            </Form>

            <!-- <Table
              ref="selection"
              :columns="serColumns"
              :data="serList"
              @on-selection-change="chooseData"
              :loading="serLoading"
            ></Table> -->
            <div class="tree-table-dom demo-spin-article">
              <zk-table
                ref="treeTable"
                sum-text="sum"
                index-text="#"
                :data="serList"
                :columns="serColumns"
                :stripe="zkprops.stripe"
                :border="zkprops.border"
                :show-header="zkprops.showHeader"
                :show-summary="zkprops.showSummary"
                :show-row-hover="zkprops.showRowHover"
                :show-index="zkprops.showIndex"
                :tree-type="zkprops.treeType"
                :is-fold="zkprops.isFold"
                :expand-type="zkprops.expandType"
                :selection-type="zkprops.selectionType"
              >
                <!-- cate_name title  scope:row, rowIndex, column, columnIndex -->
                <template slot="titleCol" slot-scope="{ row }">
                  <p v-if="row.cate_name">{{ row.cate_name }}</p>
                  <p class="chil-title" v-if="row.title">{{ row.title }}</p>
                </template>
              </zk-table>
              <Spin size="large" fix v-if="serLoading"></Spin>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getStatusArticleList, getAllRelatedSeriesList, getSeriesCates } from '@/api/manu';
import { dateFormat } from './util';
import { debounce, uniq } from 'lodash';
import { Modal,  Tabs, TabPane, Form, FormItem, Select, Option, Icon, Page, Spin, DatePicker} from 'view-design'
export default {
  name: 'wechatDraftModal',
  props: {
    chooseModalValue: {
      type: Boolean,
      default: false,
    },
    bindArticles: {
      type: Array,
      default: [],
    },
    bindSerieArticles: {
      type: Array,
      default: [],
    },
  },
  components: {
    Modal, Tabs, TabPane, Form, FormItem, Select, Option, Icon, Page, Spin, DatePicker
  },
  data() {
    return {
      modalKey: this.chooseModalValue,
      tabKey: '1',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '文稿名称',
          key: 'title',
          align: 'center',
        },
        {
          title: '作者',
          key: 'nickname',
          align: 'center',
          width: 140,
        },
      ],
      serColumns: [
        {
          type: 'selection',
          // width: 40
        },
        {
          label: '栏目/标题',
          prop: 'id',
          type: 'template',
          template: 'titleCol',
          width: 530,
        },
      ],
      manuList: [],
      total: 0,
      page: 1,
      serList: [],
      serTotal: 0,
      serPage: 1,
      tableLoading: false,
      serLoading: true,
      cateList: [],
      formItem: { cateId: '0', pickDate: new Date() },
      zkprops: {
        stripe: false,
        border: false,
        showHeader: true,
        showSummary: false,
        showRowHover: true,
        showIndex: false,
        treeType: true,
        isFold: false,
        expandType: false,
        selectionType: true, // 是否为多选类型表格
        rowKey: (row) => {
          console.log('row', row);
          return row.id;
        },
        dbFetchList: {},
      },
      artSelected: [],
      serSelected: [],
    };
  },
  watch: {
    chooseModalValue(newValue, oldValue) {
      this.modalKey = newValue;

      if (newValue) {
        this.page = 1;
        this.getCates(); // this.getSeriesList();
        this.getArticleList();
        this.artSelected = this.bindArticles;
        this.serSelected = this.bindSerieArticles;
      }
    },
    formItem: {
      handler() {
        if (this.chooseModalValue) {
          this.dbFetchList && this.dbFetchList();
        }
      },
      deep: true,
      immediate: true,
    },
    // bindArticles: {
    //   handler(arr) {
    //     this.artSelected = arr.map(id => Number(id));
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // bindSerieArticles: {
    //   handler(arr) {
    //     this.serSelected = arr || [];
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  created() {
    this.dbFetchList = debounce(this.getSeriesList, 300, false);
  },
  mounted() {},
  methods: {
    getArticleList() {
      this.tableLoading = true;
      let item = {
        status: '2',
        page: this.page,
        per_page: 10,
      };
      getStatusArticleList(item)
        .then((res) => {
          this.tableLoading = false;
          if (res.data.success == true) {
            let { data = [] } = res.data.data;
            this.manuList = data.map((ele) => {
              if (this.artSelected.includes(ele.id)) {
                this.$set(ele, '_checked', true);
              }
              return ele;
            });
            this.total = parseInt(res.data.data.meta.pagination.total);
          }
        })
        .catch((err) => {
          this.tableLoading = false;
          console.log(err);
        });
    },
    getCates() {
      getSeriesCates()
        .then((res) => {
          // 拼接 电视 广播
          const { articleCate, broadcast } = res.data.data;
          this.cateList = [
            ...articleCate.map(({ id, name }) => ({
              id,
              name: '电视-' + name,
            })),
            ...broadcast.map(({ id, name }) => ({ id, name: '广播-' + name })),
          ];
          let list = this.cateList;
          if (list && list.length > 0) {
            this.formItem = { cateId: list[0].id, pickDate: new Date() };
          } else {
            this.formItem = { cateId: '0', pickDate: new Date() };
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    },
    getSeriesList() {
      this.serLoading = true;
      const { cateId, pickDate } = this.formItem; // (2364, "2021-04-12")
      let dateStr = dateFormat(pickDate.getTime(), 'YYYY-MM-DD');
      this.indexIdObj = {};
      let i = 0;

      getAllRelatedSeriesList(cateId, dateStr)
        .then((res) => {
          if (res.status === 200) {
            this.serList = res.data.data.map((ele) => {
              this.indexIdObj[i++] = {
                series_id: ele.id,
                source_id: null,
                remote_item_id: null,
              };
              if (ele.items && ele.items.length > 0) {
                ele.children = ele.items.map(({ id, title, remote_id }) => {
                  this.indexIdObj[i++] = {
                    series_id: ele.id,
                    source_id: id,
                    remote_item_id: remote_id,
                  };

                  let it = { id, title };
                  if (this.serSelected.includes(id)) {
                    this.$set(it, '_isChecked', true);
                  }
                  return it;
                });
              } else {
                ele.children = [];
              }

              const { id, cate_name, children } = ele;
              return { id, cate_name, children };
            });
            // console.log("this.serList", this.serList);
          }
        })
        .finally(() => {
          this.serLoading = false;
        });
    },
    chooseDraftOk() {
      let choosedIds = [];
      if (this.tabKey === '1') {
        this.$emit('chooseArticleOk', this.artSelected);
      } else if (this.tabKey === '2') {
        let choosedIndexs = this.$refs.treeTable.getCheckedProp();
        choosedIndexs.forEach((index) => {
          const { series_id, source_id, remote_item_id } = this.indexIdObj[index] || {};
          source_id &&
            choosedIds.push({
              series_id,
              items: [{ source_id, remote_item_id }],
            });
        });
        console.log('属性列表选择的id===>', choosedIndexs, choosedIds);
        this.$emit('chooseSeriesOk', choosedIds);
      }

      this.$nextTick(() => {
        this.artSelected = [];
        this.serSelected = [];
      });
    },
    chooseDraftCancel() {
      this.$emit('chooseDraftCancel');
      this.$nextTick(() => {
        this.artSelected = [];
        this.serSelected = [];
      });
    },
    changePage(page) {
      this.page = page;
      this.getArticleList();
    },
    chooseData(choosedDraft) {
      let choosedIds = choosedDraft.map(({ id }) => id);
      // 已选择id中 去掉本页的 剩下的和choosedDraft合并
      let curPageIds = this.manuList.map(({ id }) => id);
      let otherPageIds = this.artSelected.filter((id) => !curPageIds.includes(id));
      this.artSelected = uniq(otherPageIds.concat(choosedIds));

      console.log(choosedDraft, this.artSelected);
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-dom {
  min-height: 500px;
}
.pageDom {
  text-align: center;
  margin-top: 15px;
}
.filter-form {
  width: 100%;
  display: flex;
  align-items: center;
}

.chil-title {
  padding-left: 2em;
}
.tree-table-dom {
  min-height: 250px;
}
.demo-spin-article {
  position: relative;
}
</style>
