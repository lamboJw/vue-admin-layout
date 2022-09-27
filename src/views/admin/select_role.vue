<template>
  <dialog-layout :visible.sync="visible" title="角色选择" :loading="loading">
    <div class="form-container">
      <el-form ref="dialog_form" :model="info" label-width="100px">
        <el-form-item label="角色" prop="arr">
          <multi-select :value.sync="info.arr" :options="all_role" collapse-tags :limit="10" />
        </el-form-item>
        <el-form-item label="游戏" prop="games">
          <multi-select :value.sync="info.games" :options="game_list" collapse-tags />
        </el-form-item>
        <el-form-item label="渠道" prop="channels">
          <multi-select :value.sync="info.channels" :options="channel_list" collapse-tags />
        </el-form-item>

      </el-form>
    </div>
  </dialog-layout>
</template>

<script>
import * as select_role from '@/api/admin/select_role'
import multiSelect from '@/components/MultiSelect'
import { dialog_common } from '@/layout/mixin/dialog_common'

export default {
  name: 'SelectRole',
  components: {
    multiSelect
  },
  mixins: [dialog_common],
  data() {
    return {
      info: {
        arr: [],
        games: [],
        channels: []
      },
      all_role: [],
      game_list: [],
      channel_list: []
    }
  },
  watch: {
    'info.arr': function(new_list, old_list) {
      select_role.getRoleGames(new_list.join(',')).then(result => {
        this.game_list = result
      })
      select_role.getRoleChannels(new_list.join(',')).then(result => {
        this.channel_list = result
      })
    },
    game_list: function(new_list, old_list) {
      const arr = new_list.map(item => {
        return item.id
      })
      this.info.games = this.info.games.filter(item => {
        if (arr.indexOf(item) !== -1) {
          return item
        }
      })
    },
    channel_list: function(new_list, old_list) {
      const arr = new_list.map(item => {
        return item.id
      })
      this.info.channels = this.info.channels.filter(item => {
        if (arr.indexOf(item) !== -1) {
          return item
        }
      })
    }
  },
  methods: {
    init() {
      this.loading = true
      select_role.getAllRole().then(result => {
        this.all_role = result.data.filter((item) => {
          return { id: item.id, name: item.name }
        })
      })
      select_role.getUserRole(this.id).then(result => {
        this.info.arr = result.data
        select_role.getUserGames(this.id).then(result => {
          this.info.games = result.data.map(item => {
            return parseInt(item)
          })
        })
        select_role.getUserChannels(this.id).then(result => {
          this.info.channels = result.data.map(item => {
            return parseInt(item)
          })
          this.loading = false
        })
      })
    },
    submit_api() {
      return select_role.save(this.id, this.info)
    }
  }
}
</script>

<style scoped>
  .el-select {
    width: 300px;
  }
</style>
