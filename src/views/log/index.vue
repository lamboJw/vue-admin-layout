<template>
  <form-table-layout
    ref="indexTable"
    :form="form"
    :form-item="form_item"
    :total-count="total_count"
    :page-sizes="page_sizes"
    :list="list"
    :list-loading="list_loading"
    :table-column.sync="table_column"
  />
</template>

<script>
import { index_common } from '@/layout/mixin/index_common'
import { getLog } from '@/api/user'

export default {
  name: 'Log',
  mixins: [index_common],
  data() {
    return {
      form: {
        op: '',
        name: '',
        created_at: []
      },
      form_item: [
        { type: 'input', label: '操作内容', prop: 'op' },
        { type: 'input', label: '操作人员', prop: 'name' },
        { type: 'datetimerange', label: '操作时间', prop: 'created_at' }
      ],
      table_column: [
        { title: '操作内容', field: 'op', min_width: 300 },
        { title: '操作状态', field: 'status', template: 'str_map', str_map: { 1: '操作成功', 0: '操作失败' }},
        { title: '操作人员', field: 'name' },
        { title: '操作时间', field: 'created_at', min_width: 120 }
      ]
    }
  },
  methods: {
    fetch_api() {
      return getLog(this.form)
    }
  }
}
</script>

<style scoped></style>
