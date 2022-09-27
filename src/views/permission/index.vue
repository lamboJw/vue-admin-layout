<template>
  <table-layout ref="indexTable" :form="form" :form-item="form_item" :list="filter_list" :list-loading="list_loading" :table-params="table_params" :form-submit-btn="false" :table-column="table_column" :table-column-btn="false">
    <template v-slot:dialog>
      <edit ref="edit" />
      <add ref="add" />
    </template>
  </table-layout>
</template>

<script>
import { getPermission, del } from '@/api/permission'
import Edit from '@/views/permission/edit'
import Add from '@/views/permission/add'
import { index_common } from '@/layout/mixin/index_common'

export default {
  name: 'Index',
  components: {
    Edit,
    Add
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
        'default-expand-all': true
      },
      table_column: [
        { field: 'name', title: '名称', min_width: '250px', align: 'left' },
        { field: 'id', title: 'id' },
        { field: 'parent_id', title: 'pid' },
        { field: 'href', title: 'href', min_width: '150px' },
        { field: 'icon', title: 'icon', template: 'icon' },
        { field: 'sort', title: '排序' },
        {
          title: '操作', template: 'action', action: [
            {
              text: '添加',
              color: this.constants.color.primary,
              click: ({ row }) => this.open_dialog('add', row.id)
            },
            {
              text: '编辑',
              color: this.constants.color.primary,
              click: ({ row }) => this.open_dialog('edit', row.id)
            },
            {
              text: '删除',
              color: this.constants.color.danger,
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
    fetch_data() {
      this.list_loading = true
      getPermission().then(result => {
        this.list_loading = false
        this.list = result
      }).catch(err => {
        console.log(err.message)
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
