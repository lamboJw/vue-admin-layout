<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb v-if="menuType === 'left'" id="breadcrumb-container" class="breadcrumb-container" />
    <top-menu v-else />

    <div class="right-menu">
      <div v-permission="'settle-file-download'" class="avatar-container right-menu-item hover-effect">
        <div class="avatar-wrapper" @click="filesBox">
          <i class="el-icon-folder-opened" style="margin-right: 3px" />文件盒子
        </div>
      </div>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
        placement="bottom"
      >
        <div class="avatar-wrapper">
          <i class="el-icon-user" />
          {{ name }}<i class="el-icon-arrow-down el-icon--right" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided @click.native="chgPWD">
            <span>修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { menuType } from '@/settings'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      websocket: null,
      menuType: menuType
    }
  },
  created() {
    this.$store.dispatch('websocket/WebSocketInit', this.uid)
  },
  computed: {
    ...mapGetters(['sidebar', 'uid', 'name'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      await this.$store.dispatch('websocket/Close')
      await this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    /* 文件盒子*/
    filesBox() {
      this.$emit('showFilesBox', 11) // 返回父组件触发
    },
    /* 修改密码*/
    chgPWD() {
      this.$emit('showChgPwd', 11) // 返回父组件触发
    }

  },
  beforeRouteLeave() {
    console.log('退出')
    this.$store.dispatch('websocket/Close')
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background: #2b2f3a;

  .hamburger-container {
    line-height: 56px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 20px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        font-size: 14px;
        color: #fff;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.el-popper[x-placement^="bottom"] {
  margin: 0;
}
.el-dropdown-menu__item--divided {
  border-top: 0;
}
</style>
