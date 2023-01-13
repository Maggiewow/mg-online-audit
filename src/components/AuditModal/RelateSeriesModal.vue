<!--
 * @Author: your name
 * @Date: 2020-07-31 15:02:00
 * @LastEditTime: 2023-01-13 11:31:53
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath: \manuscript-pc\src\view\components\manuscripts\wechatDraftModal.vue
-->
<template>
  <div>
    <Modal
      v-model="modalKey"
      title="关联串联单"
      ok-text="确定"
      @on-ok="chooseDraftOk"
      @on-cancel="chooseDraftCancel"
      width="700"
    >
      <div class="modal-dom">
        <Form
          class="filter-form"
          :model="formItem"
          :label-width="100"
        >
          <FormItem
            label="栏目："
            prop="cateId"
          >
            <Select
              v-model="formItem.cateId"
              :style="{ width: '150px' }"
            >
              <Option
                v-for="{ id, name } in cateList"
                :value="id"
                :key="id"
              >{{ name }}</Option>
            </Select>
          </FormItem>
          <FormItem
            label="日期："
            prop="pickDate"
          >
            <DatePicker
              v-model="formItem.pickDate"
              format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              :style="{ width: '180px' }"
            ></DatePicker>
          </FormItem>
        </Form>

        <Table
          ref="selection"
          :columns="columns"
          :data="seriesList"
          @on-selection-change="chooseSeries"
          :loading="tableLoading"
        >
        </Table>
        <div class="pageDom">
          <Page
            :current="page"
            :total="total"
            :page-size="10"
            show-elevator
            show-total
            @on-change="changePage"
          />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getSeriesCates, getAllSeriesList } from '@/api/manu'
import { dateFormat } from './util'
import { debounce, uniq } from 'lodash'
import { Modal, Form, FormItem, Table, Page, DatePicker } from 'view-design'

export default {
  name: 'seriesModal',
  props: {
    chooseModalValue: {
      type: Boolean,
      default: false,
    },
    bindSeriesInfo: {
      type: Array,
      default: [],
    },
  },
  components: {
    Modal,
    Form,
    FormItem,
    Table,
    Page,
    DatePicker,
  },
  data() {
    return {
      modalKey: this.chooseModalValue,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '栏目名称',
          key: 'cate_name',
        },
        {
          title: '播出时间',
          key: 'time',
        },
        {
          title: '状态',
          key: 'status',
          render: (h, { row }) => {
            // status:0 已保存 1 审核中 2 通过 3 驳回 4 已评分
            let statusStrObj = {
              0: '已保存',
              1: '审核中',
              2: '通过',
              3: '驳回',
              4: '已评分',
            }
            let formatStr = statusStrObj[row.status] || '状态值' + row.status
            return h('span', formatStr)
          },
        },
      ],
      seriesList: [],
      cateList: [],
      total: 0,
      page: 1,
      tableLoading: false,
      formItem: { cateId: '0', pickDate: new Date() },
      selectedIds: [], // 之前绑定的 用来回显
      dbFetchList: {},
    }
  },
  watch: {
    chooseModalValue(newValue, oldValue) {
      this.modalKey = newValue
      if (newValue) {
        this.page = 1
        this.getCates()
        this.selectedIds = this.bindSeriesInfo.map((id) => Number(id))
      }
    },
    formItem: {
      handler() {
        if (this.chooseModalValue) {
          this.page = 1
          this.dbFetchList && this.dbFetchList()
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.dbFetchList = debounce(this.getSeriesList, 300, false)
  },
  mounted() {
    // this.getSeriesList();
    // this.getCates();
  },
  methods: {
    getSeriesList() {
      this.tableLoading = true
      const { cateId, pickDate } = this.formItem
      let dateStr = dateFormat(pickDate.getTime(), 'YYYY-MM-DD')
      getAllSeriesList(this.page, cateId, dateStr)
        .then((res) => {
          // series: [{id: 2, cate_id: 2364, cate_name: "金栋测试", time: "2021-04-12", status: 2},…] total: 8
          if (res.status === 200) {
            const { series = [], total = 0 } = res.data.data
            this.seriesList = series.map((ele) => {
              if (this.selectedIds.includes(ele.id)) {
                this.$set(ele, '_checked', true)
              }
              return ele
            })
            this.total = Number(total)
          }
          this.tableLoading = false
        })
        .catch((err) => {
          console.log('err', err)
          this.tableLoading = false
        })
    },
    getCates() {
      getSeriesCates()
        .then((res) => {
          const { articleCate, broadcast } = res.data.data
          this.cateList = [
            ...articleCate.map(({ id, name }) => ({
              id,
              name: '电视-' + name,
            })),
            ...broadcast.map(({ id, name }) => ({ id, name: '广播-' + name })),
          ]
          let list = this.cateList
          if (list && list.length > 0) {
            this.formItem = { cateId: list[0].id, pickDate: new Date() }
          } else {
            this.formItem = { cateId: '0', pickDate: new Date() }
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },

    chooseDraftOk() {
      this.$emit('chooseDraftOk', this.selectedIds)
      this.$nextTick(() => {
        this.selectedIds = []
      })
    },
    chooseDraftCancel() {
      this.$emit('chooseDraftCancel')
      this.$nextTick(() => {
        this.selectedIds = []
      })
    },
    changePage(page) {
      this.page = page
      this.getSeriesList()
    },
    chooseSeries(choosedDraft) {
      let choosedIds = choosedDraft.map(({ id }) => id)
      // 已选择id中 去掉本页的 剩下的和choosedDraft合并
      let curPageIds = this.seriesList.map(({ id }) => id)
      let otherPageIds = this.selectedIds.filter(
        (id) => !curPageIds.includes(id)
      )
      this.selectedIds = uniq(otherPageIds.concat(choosedIds))
    },
  },
}
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
</style>
