<template>
  <div :style="{ 'max-height': '50vh', overflow: 'auto' }">
    <el-divider content-position="left">角色基本信息</el-divider>
    <el-form label-width="100px">
      <el-form-item>
        <span slot="label"><span style="color: red; margin-right: 5px">*</span>角色名称</span>
        <el-input v-model="edit_name" placeholder="请输入角色名称" style="width: 50%" />
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="edit_desc" type="textarea" placeholder="请输入角色描述（选填）" rows="5" style="width: 70%" />
      </el-form-item>
    </el-form>
    <el-divider content-position="left">角色人员分组</el-divider>
    <el-table :data="roleHasUsers" border>
      <el-table-column label="用户账号" prop="username" min-width="180" />
      <el-table-column label="用户名称" prop="name" min-width="180" />
      <el-table-column label="所属部门" prop="department_name" min-width="180" />
      <el-table-column label="所属职责" prop="position" min-width="180">
        <template slot-scope="{ row }">
          {{ position_list.getAttr(row.position.toString(), '未知') }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { common } from '@/const/constant'

export default {
  name: 'RoleInfo',
  props: {
    name: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    roleHasUsers: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      position_list: common.position
    }
  },
  computed: {
    edit_name: {
      get() {
        return this.name
      },
      set(val) {
        this.$emit('update:name', val)
      }
    },
    edit_desc: {
      get() {
        return this.desc
      },
      set(val) {
        this.$emit('update:desc', val)
      }
    }
  }
}
</script>

<style scoped></style>
