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
    @selection-change="handle_table_selection_change"
  >
    <template v-slot:button>
      <el-button v-permission="'account-add'" type="primary" @click="open_dialog('account_detail')">新增用户</el-button>
      <el-button v-permission="'account-del'" type="danger" @click="accountStatus('禁用')">禁用</el-button>
      <el-button v-permission="'account-del'" type="success" @click="accountStatus('启用')">启用</el-button>
    </template>
    <template v-slot:dialog>
      <account-detail ref="account_detail" />
    </template>
  </form-table-layout>
</template>

<script>
import { index_common } from '@/layout/mixin/index_common'
import { delAccount, enableAccount, getAccount } from '@/api/account'
import AccountDetail from './components/account-detail.vue'
import { common } from '@/const/constant'

export default {
  name: 'AccountIndex',
  components: {
    AccountDetail
  },
  mixins: [index_common],
  data() {
    return {
      form: {
        true_name: '',
        prePage: 15
      },
      form_item: [{ type: 'input', label: '用户姓名', prop: 'name' }],
      table_column: [
        { title: '选择框', type: 'selection' },
        {
          title: '企微关联状态',
          field: 'wechat_user_status',
          template: 'str_map',
          str_map: { 0: '未关联', 1: '正常', 2: '异常', 4: '异常', 5: '已离职' },
          color: { 0: 'danger', 1: 'success', 2: 'warning', 4: 'warning', 5: 'danger' }
        },
        { title: '用户账号', field: 'username' },
        { title: '用户姓名', field: 'name' },
        { title: '所属部门', field: 'department' },
        { title: '所属职责', field: 'position', template: 'str_map', str_map: common.position },
        { title: '邮箱地址', field: 'email' },
        { title: '角色权限', field: 'role' },
        { title: '上次登录', field: 'last_login' },
        {
          title: '操作',
          template: 'action',
          overflow: false,
          min_width: 150,
          show_num: 3,
          action: [
            {
              text: '编辑',
              'v-permission': 'account-edit',
              click: ({ row }) => {
                this.open_dialog('account_detail', row)
              }
            },
            {
              text: '启用',
              color: 'success',
              'v-permission': 'account-del',
              'v-if': ({ row }) => row.status === 0 && row.id.toString() !== common.admin_uid,
              click: ({ row }) => {
                this.accountStatus('启用', row)
              }
            },
            {
              text: '禁用',
              color: 'danger',
              'v-permission': 'account-del',
              'v-if': ({ row }) => row.status === 1 && row.id.toString() !== common.admin_uid,
              click: ({ row }) => {
                this.accountStatus('禁用', row)
              }
            }
          ]
        }
      ]
    }
  },
  methods: {
    fetch_api() {
      const form = Object.assign({}, this.form)
      form.page_size = form.prePage
      delete form.prePage
      return getAccount(form)
    },
    accountStatus(action, row) {
      if (row === null && this.table_selection.length === 0) {
        this.$message.error('至少勾选一个用户')
        return false
      }
      let ids = []
      let text = ''
      if (row) {
        ids = [row.id]
        text = `确认${action} ${row.name} 账号吗?`
      } else {
        ids = this.table_selection
        text = `确认${action}账号吗?`
      }
      this.$confirm(text, '提示', {
        type: 'warning'
      }).then(async() => {
        this.loading = true
        try {
          if (action === '启用') {
            await enableAccount({ ids })
          } else {
            await delAccount({ ids })
          }
          // eslint-disable-next-line no-empty
        } catch (e) {
        } finally {
          await this.fetch_data()
          this.loading = false
        }
      })
    }
  }
}
</script>

<style scoped></style>
