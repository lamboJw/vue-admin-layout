<template>
  <div class="app-container">
    <el-dialog
      v-loading.fullscreen.lock="loading"
      v-bind="dialog_params"
      :visible.sync="dialog_visible"
      :title="title"
      :width="width"
      :top="top"
      :fullscreen="fullscreen && !sideBar"
      :close-on-click-modal="false"
      :append-to-body="appendToBody"
      :custom-class="sideBarClass"
      :class="sideBarClass"
      @open="open_callback"
      @close="close_callback"
    >
      <div
        class="el-dialog-div"
        :style="{
          'max-height': fullscreen || sideBar ? 'auto' : height,
          'overflow-y': fullscreen || sideBar ? 'hidden' : 'auto',
          'overflow-x': 'hidden',
        }"
      >
        <slot />
      </div>
      <div v-if="showFooter" slot="footer" class="dialog-footer">
        <slot name="other_footer" />
        <el-button @click="close_dialog()">取消</el-button>
        <el-button type="primary" @click="submit()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { loading_common } from '@/layout/mixin/loading_common'

export default {
  name: 'DialogLayout',
  mixins: [loading_common],
  props: {
    visible: { type: Boolean, default: false, required: true },
    open: { type: Function, default: null }, // 打开对话框时需要执行的方法，默认是init
    title: { type: String, default: '' },
    loading: { type: Boolean, default: false, required: true },
    width: { type: String, default: '50%' },
    height: { type: String, default: '50vh' },
    top: { type: String, default: '15vh' },
    fullscreen: { type: Boolean, default: false },
    appendToBody: { type: Boolean, default: false }, // 当前对话框为嵌套时，必须设置为true
    showFooter: { type: Boolean, default: true },
    dialogParams: { // 对话框参数
      type: Object,
      default: function() {
        return {}
      }
    },
    sideBar: { type: Boolean, default: false } // 使弹出框改为从右往左滑出的侧边栏，宽度以width参数为准
  },
  inject: ['close_dialog', 'submit', 'init'],
  computed: {
    dialog_visible: {
      get: function() {
        return this.visible
      },
      set: function() {
        this.close_dialog()
      }
    },
    open_callback: function() {
      if (this.open === null) {
        return this.init
      } else {
        return this.open
      }
    },
    dialog_params: function() {
      const default_params = {}
      return Object.assign(
        default_params,
        this.dialogParams,
        this.loading_props
      )
    },
    sideBarClass: function() {
      return !this.fullscreen && this.sideBar ? 'sideBar' : ''
    }
  },
  methods: {
    close_callback: function() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container::v-deep {
  .el-dialog__wrapper.sideBar {
    overflow-y: auto;
    overflow-x: hidden;
  }

  .el-dialog.sideBar {
    margin-right: 0;
    margin-top: 0 !important;
    margin-bottom: 0;
    min-height: 100vh;
  }

  .dialog-fade-enter-active .el-dialog.sideBar,
  .dialog-fade-enter-active.el-dialog__wrapper.sideBar {
    animation: anim-open 0.5s ease;
  }

  .dialog-fade-leave-active .el-dialog.sideBar,
  .dialog-fade-leave-active.el-dialog__wrapper.sideBar {
    animation: anim-close 0.5s ease;
  }

  @keyframes anim-open {
    0% {
      transform: translate3d(100%, 0, 0);
      opacity: 0;
    }
    100% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
  @keyframes anim-close {
    0% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    100% {
      transform: translate3d(100%, 0, 0);
      opacity: 0;
    }
  }
}
</style>
