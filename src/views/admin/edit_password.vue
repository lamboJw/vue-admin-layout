<template>
  <dialog-layout :visible.sync="visible" title="修改密码" :loading="loading">
    <div class="form-container">
      <el-form ref="dialog_form" :model="info" label-width="100px">
        <el-form-item label="新密码" prop="password">
          <el-input v-model="info.password" show-password @change="check_same_password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirmation">
          <el-input v-model="info.password_confirmation" show-password @change="check_same_password" />
        </el-form-item>
      </el-form>
    </div>
  </dialog-layout>
</template>

<script>
import { save } from '@/api/admin/edit_password'
import { dialog_common } from '@/layout/mixin/dialog_common'

export default {
  name: 'EditPassword',
  mixins: [dialog_common],
  data() {
    return {
      info: {
        password: '',
        password_confirmation: ''
      }
    }
  },
  methods: {
    init() {},
    check_same_password() {
      if (this.info.password && this.info.password_confirmation && this.info.password !== this.info.password_confirmation) {
        this.$message({
          showClose: true,
          message: '新密码与确认密码不相同',
          type: 'error'
        })
      }
    },
    submit_api() {
      return save(this.id, this.info)
    }
  }
}
</script>

<style scoped>

</style>
