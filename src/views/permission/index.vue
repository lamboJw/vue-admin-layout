<template>
  <form-table-layout
    ref="indexTable"
    :form="form"
    :form-item="form_item"
    :list="filter_list"
    :list-loading="list_loading"
    :table-params="table_params"
    :form-submit-btn="false"
    :table-column="table_column"
    :table-column-btn="false"
  >
    <template v-slot:dialog>
      <edit ref="edit" />
    </template>
  </form-table-layout>
</template>

<script>
import { list, del } from '@/api/permission'
import Edit from '@/views/permission/components/edit'
import { index_common } from '@/layout/mixin/index_common'

export default {
  name: 'Index',
  components: {
    Edit
  },
  mixins: [index_common],
  data() {
    return {
      form: { filter_text: '', limit: 0 },
      form_item: [
        { label: '关键词', prop: 'filter_text', type: 'input' }
      ],
      table_params: {
        'tree-props': { children: 'children' },
        'expand-row-keys': ['0']
      },
      table_column: [
        { field: 'name', title: '名称', min_width: '250px', align: 'left' },
        { field: 'id', title: 'ID' },
        { field: 'parent_id', title: '上级ID' },
        { field: 'path', title: '路径', min_width: '150px' },
        { field: 'icon', title: 'icon', template: 'icon' },
        { field: 'sort', title: '排序' },
        {
          title: '操作', template: 'action', action: [
            {
              text: '添加',
              'v-permission': 'permission-add',
              click: ({ row }) => this.open_dialog('edit', 0, row.id)
            },
            {
              text: '编辑',
              'v-permission': 'permission-edit',
              color: 'primary',
              click: ({ row }) => this.open_dialog('edit', row.id)
            },
            {
              text: '删除',
              'v-permission': 'permission-del',
              color: 'danger',
              click: ({ row }) => this.del(row.id)
            }
          ],
          overflow: false, min_width: '200px'
        }
      ]
    }
  },
  computed: {
    filter_list: function() {
      if (this.form.filter_text === '') {
        return this.list
      } else {
        const new_list = this.filter_handle(JSON.parse(JSON.stringify(this.list[0])))
        if (!new_list) {
          return []
        } else {
          return [new_list]
        }
      }
    },
    reg: function() {
      return new RegExp(`.*${this.form.filter_text}.*`)
    }
  },
  methods: {
    fetch_api() {
      return list()
    },
    fetch_callback(result) {
      this.list = [{ id: 0, parent_id: 0, path: '', name: '全部', icon: '', sort: 0, children: result }]
      this.list[0].children.map(item => {
        this.table_params['expand-row-keys'].push(item.id.toString())
      })
    },
    filter_handle(item) {
      const children = []
      if (typeof item.children !== 'undefined' && item.children.length > 0) {
        for (const i in item.children) {
          const child = this.filter_handle(item.children[i])
          if (child) {
            children.push(child)
          }
        }
      }
      if (children.length > 0) {
        item.children = children
        return item
      } else if (this.reg.test(item.name)) {
        return item
      } else {
        return null
      }
    },
    del_api(id) {
      return del(id)
    }
  }
}
</script>

<style scoped>

</style>
