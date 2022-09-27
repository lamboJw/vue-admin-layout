<template>
  <dialog-layout :visible.sync="visible" title="特殊" :loading="loading">
    <el-tabs v-model="tabs_name" type="border-card">
      <el-tab-pane label="游戏" name="game">
        <el-transfer
          v-model="game_selected"
          filterable
          :filter-method="filter_handler"
          filter-placeholder="请输入游戏名称"
          :data="game_data"
          :titles="['未关联', '已关联']"
          @change="change_game"
        />
      </el-tab-pane>
      <el-tab-pane label="渠道" name="channel">
        <el-transfer
          v-model="channel_selected"
          filterable
          :filter-method="filter_handler"
          filter-placeholder="请输入渠道名称"
          :data="channel_data"
          :titles="['未关联', '已关联']"
          @change="change_channel"
        />
      </el-tab-pane>
      <el-tab-pane label="访问IP控制" name="ip">
        <el-form label-width="100px">
          <el-form-item label="限制外网IP">
            <el-switch
              v-model="check_ip"
              active-text="开"
              inactive-text="关"
              :active-value="1"
              :inactive-value="0"
              @change="change_check_ip"
            />
          </el-form-item>
          <el-form-item label="可访问外网IP">
            <el-table :data="ip_data" height="250" size="mini">
              <el-table-column
                type="index"
                :index="index_num"
              />
              <el-table-column prop="ip" label="IP" width="110" />
              <el-table-column label="操作" width="350">
                <!--eslint-disable-next-line vue/no-unused-vars-->
                <template slot="header" slot-scope="{row}">
                  <el-row :gutter="10">
                    <el-col :span="6">
                      <el-button size="mini" type="success" @click="add_ip">添加</el-button>
                    </el-col>
                    <el-col :span="12">
                      <el-input v-model="action_ip" placeholder="添加IP地址" size="mini" />
                    </el-col>
                  </el-row>
                </template>
                <template slot-scope="{row}">
                  <el-button size="mini" type="danger" @click="del_ip(row.key)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </dialog-layout>
</template>

<script>
import { dialog_common } from '@/layout/mixin/dialog_common'
import * as api from '@/api/role/special'

export default {
  name: 'Special',
  mixins: [dialog_common],
  data() {
    return {
      tabs_name: 'game',
      game: [],
      game_selected: [],
      channel: [],
      channel_selected: [],
      check_ip: 0,
      ip_list: [],
      action_ip: ''
    }
  },
  computed: {
    game_data: function() {
      return this.game.map(function(item) {
        return { label: item.title, key: item.value }
      })
    },
    channel_data: function() {
      return this.channel.map(function(item) {
        return { label: item.title, key: item.value }
      })
    },
    ip_data: function() {
      return this.ip_list.map(function(item, index) {
        return { key: index, ip: item }
      })
    }
  },
  methods: {
    init_api() {
      return api.getInfo(this.id)
    },
    filter_handler(query, item) {
      return item.label.indexOf(query) > -1
    },
    change_game(keys, type, value) {
      this.loading = true
      api.saveGame(this.id, { arr: keys }).then(result => {
        this.$message({
          type: 'success',
          message: result.message
        })
        this.loading = false
      }).catch(err => { console.log(err.message) })
    },
    change_channel(keys, type, value) {
      this.loading = true
      api.saveChannel(this.id, { arr: keys }).then(result => {
        this.$message({
          type: 'success',
          message: result.message
        })
        this.loading = false
      }).catch(err => { console.log(err.message) })
    },
    add_ip() {
      if (this.action_ip === '') {
        this.$message({
          type: 'warning',
          message: '请输入要添加的IP地址'
        })
        return false
      }
      api.saveIp(this.id, this.action_ip, 'add').then(result => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.ip_list.push(this.action_ip)
        this.action_ip = ''
      }).catch(err => { console.log(err.message) })
    },
    del_ip(key) {
      this.$confirm('确定要删除该IP？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.saveIp(this.id, this.ip_list[key], 'del').then(result => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.ip_list.splice(key, 1)
        }).catch(err => { console.log(err.message) })
      })
    },
    change_check_ip(value) {
      api.checkIp(this.id, value ? 1 : 0).then(result => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      }).catch(err => { console.log(err.message) })
    },
    index_num(index) {
      return index + 1
    }
  }
}
</script>

<style scoped>

</style>
