<template>
  <table-layout
    ref="indexTable"
    :form="form"
    :form-item="form_item"
    :total-count="total_count"
    :page-sizes="page_sizes"
    :list="list"
    :list-loading="list_loading"
    :table-column.sync="table_column"
  >
    <template v-slot:button>
      <el-button type="primary" @click="open_dialog('order_detail', 0)">
        新增
      </el-button>
    </template>
    <template v-slot:dialog>
      <order-detail ref="order_detail" />
    </template>
  </table-layout>
</template>

<script>
import OrderDetail from '@/views/order-prepare/order_detail'
import { index_common } from '@/layout/mixin/index_common'
import { getList, del, changeStatus } from '@/api/index_template'

export default {
  name: 'IndexTemplate',
  components: {
    OrderDetail
  },
  mixins: [index_common],
  data() {
    return {
      form: {},
      form_item: [{ type: 'input', label: '名称', prop: 'name' }],
      table_column: [{ title: '操作', template: 'action', overflow: false }]
    }
  },
  methods: {
    fetch_api() {
      return getList(this.form)
    },
    del_api(id) {
      return del(id)
    },
    changeStatus(id, status) {
      return changeStatus(id, status)
    }
  }
}
</script>

<style scoped></style>
