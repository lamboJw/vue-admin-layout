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
  >
    <template v-slot:button>
      <el-button type="primary" @click="open_dialog('edit', 0)">
        新增角色
      </el-button>
    </template>
    <template v-slot:dialog>
      <edit ref="edit" />
    </template>
  </form-table-layout>
</template>

<script>
import Edit from '@/views/role/components/edit'
import { index_common } from '@/layout/mixin/index_common'
import { delRole, getRoleList } from '@/api/role'

export default {
  name: 'RoleIndex',
  components: {
    Edit
  },
  mixins: [index_common],
  data() {
    return {
      form: {
        name: ''
      },
      form_item: [{ type: 'input', label: '角色名称', prop: 'name' }],
      table_column: [
        { title: 'ID', field: 'id', min_width: 50 },
        { title: '角色名称', field: 'name' },
        { title: '角色人员', field: 'role_has_users', min_width: 150 },
        { title: '创建人', field: 'created_user_name' },
        { title: '创建时间', field: 'created_at' },
        {
          title: '操作',
          template: 'action',
          overflow: false,
          action: [
            {
              text: '权限设置',
              'v-permission': 'role-set',
              click: ({ row }) => {
                this.open_dialog('edit', row.id)
              }
            },
            {
              text: '删除',
              color: 'danger',
              'v-permission': 'role-del',
              'v-if': ({ row }) => ![1, 8, 10, 11, 36].includes(row.id),
              click: ({ row }) => {
                this.del(row.id)
              }
            }
          ]
        }
      ]
    }
  },
  methods: {
    fetch_api() {
      return getRoleList(this.form)
    },
    del_api(id) {
      return delRole({ id })
    }
  }
}
</script>

<style scoped></style>
