<template>
  <dialog-layout :visible.sync="visible" title="新增" :loading="loading">
    <div class="form-container">
      <el-form ref="dialog_form" :model="info" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="info.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="链接" prop="href">
          <el-input v-model="info.href" placeholder="请输入链接" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="info.icon" placeholder="请输入图标" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="info.sort" placeholder="请输入排序" />
        </el-form-item>
      </el-form>
    </div>
  </dialog-layout>
</template>

<script>
import { save } from '@/api/permission/edit'
import { dialog_common } from '@/layout/mixin/dialog_common'

export default {
  name: 'Add',
  mixins: [dialog_common],
  data() {
    return {
      info: {
        name: '',
        href: '',
        icon: '',
        sort: 0
      }
    }
  },
  methods: {
    init() {
    },
    submit_api() {
      const data = Object.assign({ parent_id: this.id }, this.info)
      return save(0, data)
    }
  }
}
</script>

<style scoped>

</style>
