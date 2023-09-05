<template>
  <el-menu
    :default-active="cur_top_route"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#2b2f3a"
    text-color="#fff"
    active-text-color="#409EFF"
    @select="handleSelect"
  >
    <el-menu-item v-for="item in top_routes" :key="item.name" :index="item.name">{{ item.title }}</el-menu-item>
  </el-menu>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'TopMenu',
  computed: {
    ...mapGetters(['top_routes', 'cur_top_route'])
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$store.dispatch('permission/selectTopRoute', key)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
