<template>
  <dialog-layout :visible.sync="visible" :title="dialog_title" :loading="loading">
    <div class="form-container">
      <el-form ref="dialog_form" :model="info" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="info.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="头像" prop="icon">
          <single-img-upload :img-url.sync="info.icon" />
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="info.mobile" placeholder="手机号码" />
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-switch
            v-model="info.status"
            active-text="启用"
            inactive-text="禁用"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item v-show="!id" label="密码" prop="password">
          <el-input v-model="info.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item v-show="!id" label="密码确认" prop="password_confirmation">
          <el-input v-model="info.password_confirmation" placeholder="请输入密码确认" />
        </el-form-item>
      </el-form>
    </div>
  </dialog-layout>
</template>

<script>
import { getInfo, save } from '@/api/admin/edit'
import SingleImgUpload from '@/components/SingleImgUpload'
import { dialog_common } from '@/layout/mixin/dialog_common'

export default {
  components: {
    SingleImgUpload
  },
  mixins: [dialog_common],
  data() {
    return {
      info: {
        name: '',
        icon: '',
        mobile: '',
        status: 0,
        password: '',
        password_confirmation: '',
        test: false
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
