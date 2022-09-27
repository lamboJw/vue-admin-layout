<template>
  <dialog-layout :visible.sync="visible" title="授权" :loading="loading">
    <div class="form-container">
      <el-form inline label-width="100px">
        <el-form-item label="关键词">
          <el-input v-model="filter_text" style="{width: 100px;}" />
        </el-form-item>
      </el-form>
    </div>
    <div class="tree-container">
      <el-tree
        ref="tree"
        :data="list"
        show-checkbox
        node-key="id"
        default-expand-all
        :props="defaultProps"
        :default-checked-keys="checked_node"
        :filter-node-method="filter_node"
        @check="check_handle"
      />
    </div>
  </dialog-layout>
</template>

<script>
import { getInfo, save } from '@/api/role/impower'
import { dialog_common } from '@/layout/mixin/dialog_common'

export default {
  name: 'Impower',
  mixins: [dialog_common],
  data() {
    return {
      list: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selected: [],
      checked_node: [],
      filter_text: ''
    }
  },
  watch: {
    filter_text(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    init_api() {
      return getInfo(this.id)
    },
    init_callback(result) {
      const { data } = result
      this.list = data
      if (this.list.length > 0) {
        this.get_checked_node(this.list[0])
      }
      this.$nextTick(function() {
        this.selected = this.$refs.tree.getCheckedNodes(false, true).map(item => {
          return item.id
        })
      })
    },
    submit_api() {
      return save(this.id, { data: this.selected })
    },
    check_handle(nodeObj, SelectedObj) {
      this.selected = SelectedObj.checkedKeys.concat(SelectedObj.halfCheckedKeys)
    },
    get_checked_node(node) {
      if (node.checked === true) {
        this.checked_node.push(node.id)
      }
      const that = this
      if (typeof node.children !== 'undefined' && node.children.length > 0) {
        node.children.forEach(item => {
          that.get_checked_node(item)
        })
      }
    },
    filter_node(value, data, node) {
      if (!value) return true
      let parentNode = node.parent; let labels = [node.data.name]; let level = 1
      while (level < node.level) {
        labels = [...labels, parentNode.data.name]
        parentNode = parentNode.parent
        level++
      }
      return labels.some(label => label.indexOf(value) !== -1)
    }
  }
}
</script>

<style scoped>
.tree-container {
  overflow: auto;
  max-height: 380px;
  margin-bottom: 10px;
}
</style>
