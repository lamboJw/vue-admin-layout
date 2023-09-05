<template>
  <div :style="{ 'max-height': '50vh', overflow: 'auto' }">
    <el-divider content-position="left">角色功能权限设置</el-divider>
    <el-tree
      ref="tree"
      :data="permissionList"
      :show-checkbox="true"
      node-key="id"
      :default-checked-keys="permissionIds"
      :props="defaultProps"
      :default-expand-all="true"
      :render-content="renderContent"
      @check="check"
    />
  </div>
</template>

<script>
export default {
  name: 'FunctionPermission',
  props: {
    permissionList: {
      type: Array,
      default: function() {
        return []
      }
    },
    permissionIds: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    permissionList: function() {
      setTimeout(function() {
        const classDomList = document.getElementsByClassName('especially')
        for (let i = 0; i < classDomList.length; i++) {
          classDomList[i].parentNode.style.cssText = 'float: left'
          classDomList[i].parentNode.className = 'el-tree-node__content option-wrapper'
          classDomList[i].parentNode.parentNode.parentNode.style.marginLeft = '40px'
        }
      }, 1000)
    }
  },
  methods: {
    renderContent(h, { node, data }) {
      let className = ''
      if (!data.children || (data.children && data.children.length === 0)) {
        className = 'especially'
      }
      return <div class={className}>{node.label}</div>
    },
    check(data, { checkedKeys }) {
      this.$emit('update:permissionIds', checkedKeys)
    }
  }
}
</script>

<style scoped></style>
