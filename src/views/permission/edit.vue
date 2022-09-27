<template>
  <dialog-layout :visible.sync="visible" title="编辑" :loading="loading">
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
        <el-form-item label="上级id" prop="parent_id">
          <el-input v-model="info.parent_id" placeholder="请输入上级id" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="info.sort" placeholder="请输入排序" />
        </el-form-item>
      </el-form>
    </div>
  </dialog-layout>
</template>

<script>
import { getInfo, save } from '@/api/permission/edit'
import { dialog_common } from '@/layout/mixin/dialog_common'

export default {
  name: 'Edit',
  mixins: [dialog_common],
  data() {
    return {
      info: {
        name: '',
        href: '',
        icon: '',
        parent_id: 0,
        sort: 0
      }
    }
  },
  methods: {
    init_api() {
      return getInfo(this.id)
    },
    submit_api() {
      return save(this.id, this.info)
    }
  }
}
</script>

<style scoped>

</style>
