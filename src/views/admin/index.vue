<template>
  <table-layout ref="indexTable" :form="form" :form-item="form_item" :total-count="total_count" :page-sizes="page_sizes" :list="list" :list-loading="list_loading" :table-column="table_column" :table-column-btn="false">
    <template v-slot:button>
      <el-button type="primary" @click="open_dialog('edit', 0)">新增</el-button>
    </template>
    <template v-slot:dialog>
      <edit ref="edit" />
      <select-role ref="select_role" />
      <edit-password ref="edit_password" />
    </template>
  </table-layout>
</template>

<script>
import { getList, del } from '@/api/admin'
import edit from '@/views/admin/edit'
import SelectRole from '@/views/admin/select_role'
import EditPassword from '@/views/admin/edit_password'
import { index_common } from '@/layout/mixin/index_common'

export default {
  name: 'Index',
  components: {
    EditPassword,
    SelectRole,
    edit
  },
  mixins: [index_common],
  data() {
    return {
      form: {
        name: '',
        mobile: ''
      },
      status_options: ['禁止', '启用'],
      form_item: [
        { type: 'input', prop: 'name', label: '名称' },
        { type: 'input', prop: 'mobile', label: '手机号码' }
      ],
      table_column: [
        { field: 'id', title: 'ID' },
        { field: 'name', title: '用户名' },
        { field: 'icon', title: '头像', template: 'img' },
        { field: 'mobile', title: '手机号码' },
        { field: 'status', title: '状态', template: 'status_str' },
        { field: 'created_at', title: '创建时间' },
        { field: 'updated_at', title: '修改时间' },
        {
          title: '操作', template: 'action', action: [
            {
              text: '角色选择',
              click: ({ row }) => this.open_dialog('select_role', row.id)
            },
            {
              text: '修改密码',
              color: this.constants.color.warning,
              click: ({ row }) => this.open_dialog('edit_password', row.id)
            }
          ]
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
