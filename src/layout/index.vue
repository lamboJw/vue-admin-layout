<template>
  <div :class="classObj" class="app-wrapper">
    <!-- <div v-if="sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
    <sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div v-if="!classObj.mobile" :class="{ 'fixed-header': fixedHeader }">
        <navbar @showMessBox="showMessBox" @showFilesBox="showFilesBox" @showChgPwd="showChgPwd" />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
    </div>

    <message-box v-if="messBoxVisible" @close="messBoxVisible=false" />
    <files-box v-if="filesBoxVisible" @close="filesBoxVisible=false" />

    <el-dialog
      title="修改密码"
      :visible.sync="pwdVisible"
      width="30%"
      @close="pwdVisible=false"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="新密码" prop="pwd">
          <el-input v-model="ruleForm.pwd" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="pwdT">
          <el-input v-model="ruleForm.pwdT" placeholder="请输入密码" show-password />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="pwdVisible=false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm('ruleForm')">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { AppMain, Navbar, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapGetters, mapState } from 'vuex'
import { removeToken } from '@/utils/auth'
import { updateAccount } from '@/api/account'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    const chkPwd = (rule, value, cb) => {
      if (this.ruleForm.pwd !== this.ruleForm.pwdT) {
        cb('两次密码不一致')
      } else {
        cb()
      }
    }
    return {
      messBoxVisible: false,
      filesBoxVisible: false,
      pwdVisible: false,
      beforeUnloadTime: 0,
      ruleForm: { pwd: '', pwdT: '' },
      rules: {
        pwd: [{ required: true, message: '请输入新密码', trigger: ['blur', 'change'] }],
        pwdT: [{ required: true, validator: chkPwd, trigger: ['blur', 'change'] }]
      },
      loading: false
    }
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader
    }),
    ...mapGetters([
      'uid'
    ]),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.addEventListener('unload', e => this.unloadHandler(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.removeEventListener('unload', e => this.unloadHandler(e))
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    showMessBox() {
      this.messBoxVisible = true
    },
    showFilesBox() {
      this.filesBoxVisible = true
    },
    showChgPwd() {
      this.pwdVisible = true
    },
    async submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        this.loading = true
        if (valid) {
          updateAccount({ id: this.uid, password: this.ruleForm.pwd })
          this.$store.dispatch('user/logout')
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        }
        this.loading = false
      })
    },
    /* 关闭页面清空登录 */
    beforeunloadHandler() {
      this.beforeUnloadTime = new Date().getTime()
    },
    unloadHandler() {
      const subTime = new Date().getTime() - this.beforeUnloadTime
      if (subTime <= 5) {
        removeToken()
      }
    }
  }
}

</script>

<style lang="scss" scoped>
@import "../styles/sidebar.scss";
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.sidebar-container {
  transition: width 0.28s;
  width: 210px;
  background-color: #fff;
  height: 100%;
  // position: fixed;
  font-size: 14px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  overflow: hidden;
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
