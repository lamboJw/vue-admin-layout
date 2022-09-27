<template>
  <table-layout ref="indexTable" :form="form" :form-item="form_item" :total-count="total_count" :page-sizes="page_sizes" :list="list" :list-loading="list_loading" :table-column="table_column" :table-column-btn="false">
    <template v-slot:button>
      <el-button type="primary" @click="open_dialog('edit', 0)">新增</el-button>
    </template>
    <template v-slot:dialog>
      <edit ref="edit" />
      <impower ref="impower" />
      <special ref="special" />
    </template>
  </table-layout>
</template>

<script>
import edit from '@/views/role/edit'
import impower from '@/views/role/impower'
import special from '@/views/role/special'
import { getList, del } from '@/api/role'
import { index_common } from '@/layout/mixin/index_common'

export default {
  name: 'Index',
  components: {
    edit,
    impower,
    special
  },
  mixins: [index_common],
  data() {
    return {
      form: {
        name: ''
      },
      form_item: [
        { type: 'input', prop: 'name', label: '名称' }
      ],
      table_column: [
        { field: 'id', title: 'ID' },
        { field: 'name', title: '角色' },
        { field: 'created_at', title: '创建时间' },
        { field: 'updated_at', title: '修改时间' },
        {
          title: '操作', template: 'action', action: [
            {
              text: '授权',
              color: this.constants.color.warning,
              click: ({ row }) => this.open_dialog('impower', row.id)
            },
            {
              text: '特殊',
              color: this.constants.color.primary,
              click: ({ row }) => this.open_dialog('special', row.id)
            }
          ], overflow: false, min_width: '120px'
        }
      ]
    }
  },
  methods: {
    fetch_api() {
      return getList(this.form)
    },
    del_api(id) {
      return del(id)
    }
  }
}
</script>

<style scoped>

</style>
