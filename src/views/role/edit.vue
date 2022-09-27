<template>
  <dialog-layout :visible.sync="visible" :title="dialog_title" :loading="loading">
    <div class="form-container">
      <el-form ref="dialog_form" :model="info" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="info.name" placeholder="请输入名称" />
        </el-form-item>

      </el-form>
    </div>
  </dialog-layout>
</template>

<script>
import { dialog_common } from '@/layout/mixin/dialog_common'
import { getInfo, save } from '@/api/role/edit'

export default {
  name: 'Edit',
  mixins: [dialog_common],
  data() {
    return {
      info: {
        name: ''
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
