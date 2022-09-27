<template>
  <div class="upload-container">
    <el-upload
      :action="upload_url"
      :limit="2"
      :on-exceed="handle_exceed"
      :headers="upload_headers"
      :on-success="handle_success"
      :on-remove="handle_remove"
      :on-preview="handle_preview"
      :file-list="fileList"
      :show-file-list="showFileList"
      :before-upload="handle_before_upload"
      :accept="accept"
      :data="data"
    >
      <el-button slot="trigger" :size="btnSize" type="primary">
        <i v-if="btn_icon" ref="btn_icon" :class="btn_icon" />{{ btnText }}
      </el-button>
      <el-checkbox v-if="repeatCode !== null" v-model="repeat_code" style="display: inline-block;margin-left: 10px;">
        通码
      </el-checkbox>
      <div v-if="tips" slot="tip" class="el-upload__tip" :style="{ display: tipsDisplay }">{{ tips }}</div>
    </el-upload>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    fileUrl: { type: String, default: '' }, // 传值是记得加上.sync事件
    fileName: { type: String, default: '' }, // 传值是记得加上.sync事件
    showFileList: { type: Boolean, default: true },
    tips: { type: String, default: '' },
    tipsDisplay: { type: String, default: 'inline' },
    uploadUrl: { type: String, default: '/admin/upload' },
    successCallback: {
      type: Function, default: (response, file, fileList) => {
      }
    },
    btnSize: { type: String, default: 'normal' },
    btnText: { type: String, default: '点击上传' },
    repeatCode: { type: Boolean, default: null }, // 上传礼包码时，传入repeat-code参数，显示通码勾选项，要加上.sync事件
    accept: { type: String, default: '*' },
    data: {
      type: Object, default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      upload_url: process.env.VUE_APP_BASE_API + this.uploadUrl,
      btn_icon: ''
    }
  },
  computed: {
    ...mapGetters([
      'csrf_token'
    ]),
    upload_headers() {
      return { 'X-CSRF-TOKEN': this.csrf_token }
    },
    file_url: {
      get: function() {
        return this.fileUrl.indexOf('http') > -1 ? this.fileUrl : process.env.VUE_APP_HOST + this.fileUrl.replace(/^\/?/, '')
      },
      set: function(newValue) {
        this.$emit('update:fileUrl', newValue)
      }
    },
    file_name: {
      get: function() {
        return this.fileName
      },
      set: function(newValue) {
        this.$emit('update:fileName', newValue)
      }
    },
    fileList() {
      if (!this.fileUrl) {
        return []
      }
      let name = this.file_name
      if (!name) {
        const arr = this.fileUrl.split('/')
        name = arr.pop()
      }
      return [{ name: name, url: this.fileUrl }]
    },
    repeat_code: {
      get: function() {
        return this.repeatCode
      },
      set: function(newValue) {
        this.$emit('update:repeatCode', newValue)
      }
    }
  },
  mounted() {
    if (this.fileUrl) {
      this.btn_icon = 'el-icon-check'
    }
  },
  methods: {
    handle_exceed: function(files, fileList) {
      this.$message.warning(`限制上传 1 个文件`)
    },
    handle_success: function(response, file, fileList) {
      if (!response.bool) {
        this.$message.warning('上传失败')
        this.btn_icon = ''
        return false
      }
      this.file_url = response.url
      this.file_name = file.name
      this.btn_icon = 'el-icon-check'
      this.successCallback(response, file, fileList)
    },
    handle_remove: function(file, fileList) {
      this.file_url = ''
      this.file_name = ''
      this.btn_icon = ''
    },
    handle_before_upload: function(file) {
      this.btn_icon = 'el-icon-loading'
    },
    handle_preview: function() {
      window.open(this.file_url)
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-container::v-deep {
  display: inline-block;

  .el-upload {
    text-align: left;
    display: inline;
  }
}
</style>
