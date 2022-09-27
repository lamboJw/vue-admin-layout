<template>
  <el-upload
    class="avatar-uploader"
    :action="upload_url"
    :limit="2"
    :show-file-list="false"
    :on-exceed="handle_exceed"
    :headers="upload_headers"
    :on-success="handle_img_success"
    :file-list="fileList"
  >
    <div v-if="imgUrl" class="avatar">
      <img :src="img_url" :style="img_style" alt="">
      <label @click.stop="handle_img_remove"><i class="el-icon-close" /></label>
    </div>
    <i v-else slot="default" class="el-icon-plus avatar-uploader-icon" :style="uploader_icon_style" />
    <div v-if="tips!==''" slot="tip" class="el-upload__tip">{{ tips }}</div>
  </el-upload>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    imgUrl: { type: String, default: '' },
    width: { type: String, default: '92px' },
    height: { type: String, default: '' },
    autoHeight: { type: Boolean, default: false },
    tips: { type: String, default: '' }
  },
  data() {
    return {
      upload_url: process.env.VUE_APP_BASE_API + '/admin/upload'
    }
  },
  computed: {
    ...mapGetters([
      'csrf_token'
    ]),
    upload_headers() {
      return { 'X-CSRF-TOKEN': this.csrf_token }
    },
    img_url: {
      get: function() {
        return this.imgUrl.indexOf('data:image/') === 0 ? this.imgUrl : process.env.VUE_APP_HOST.replace(/\/?$/, '') + this.imgUrl
      },
      set: function(newValue) {
        this.$emit('update:imgUrl', newValue)
      }
    },
    fileList() {
      if (!this.imgUrl) {
        return []
      }
      const arr = this.imgUrl.split('/')
      const name = arr.pop()
      return [{ name: name, url: this.imgUrl }]
    },
    img_width() {
      return this.width
    },
    img_height: function() {
      return this.height ? this.height : this.width
    },
    img_style: function() {
      return {
        width: this.img_width,
        height: this.autoHeight ? 'auto' : this.img_height,
        'max-height': this.autoHeight ? '200px' : this.img_height
      }
    },
    uploader_icon_style: function() {
      return {
        width: this.img_width,
        height: this.img_height,
        'line-height': this.img_height,
        'font-size': parseInt(parseFloat(this.img_width.replace('px', '')) / 3.5) + 'px'
      }
    }
  },
  methods: {
    handle_exceed: function(files, fileList) {
      this.$message.warning(`限制上传 1 张图片`)
    },
    handle_img_success: function(response, file, fileList) {
      if (!response.bool) {
        this.$message.warning('上传失败')
        return false
      }
      this.img_url = response.url
      this.$emit('on-success', response, file, fileList)
    },
    handle_img_remove: function(file, fileList) {
      this.img_url = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader::v-deep {

  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    color: #8c939d;
    text-align: center;
  }

  .avatar {
    display: block;
    line-height: 0;

    label {
      position: absolute;
      right: -13px;
      top: -7px;
      width: 32px;
      height: 21px;
      line-height: 30px;
      background: #FF4500;
      text-align: center;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      -webkit-box-shadow: 0 1px 1px #ccc;
      box-shadow: 0 1px 1px #ccc;
      cursor: pointer;

      i {
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
        color: white;
      }
    }
  }
}
</style>
