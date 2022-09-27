<template>
  <div class="app-container">
    <el-form
      v-loading.fullscreen.lock="loading"
      v-bind="loading_props"
      label-width="100px"
    >
      <el-form-item label="本地IP">
        <span class="middle-text">{{ local_ip }}</span>
      </el-form-item>
      <el-form-item label="白名单">
        <el-table :data="ip_data" height="550" size="mini">
          <el-table-column
            type="index"
            :index="index_num"
          />
          <el-table-column prop="ip" label="IP" width="130" />
          <el-table-column prop="remark" label="备注" width="130" />
          <el-table-column label="操作" width="400">
            <!--eslint-disable-next-line vue/no-unused-vars-->
            <template slot="header" slot-scope="{row}">
              <el-row :gutter="5">
                <el-col :span="6">
                  <el-button size="mini" type="success" @click="add_ip">添加</el-button>
                </el-col>
                <el-col :span="9">
                  <el-input v-model="action_ip" size="mini" placeholder="添加IP地址" />
                </el-col>
                <el-col :span="9">
                  <el-input v-model="remark" size="mini" placeholder="IP地址备注" />
                </el-col>
              </el-row>
            </template>
            <template slot-scope="{row}">
              <el-button size="mini" type="danger" @click="del_ip(row.ip)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as api from '@/api/white_ip/index'
import { loading_common } from '@/layout/mixin/loading_common'

export default {
  name: 'WhiteIp',
  mixins: [loading_common],
  data() {
    return {
      local_ip: '',
      ip_list: [],
      action_ip: '',
      remark: '',
      loading: false
    }
  },
  computed: {
    ip_data: function() {
      const table_data = []
      for (const ip in this.ip_list) {
        table_data.push({ ip: ip, remark: this.ip_list[ip] })
      }
      return table_data
    }
  },
  mounted() {
    this.loading = true
    api.getInfo().then(result => {
      this.local_ip = result.ip
      this.ip_list = result.ip_list
      this.loading = false
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    add_ip() {
      if (this.action_ip === '') {
        this.$message({
          type: 'warning',
          message: '请输入要添加的IP地址'
        })
        return false
      }
      this.loading = true
      api.addIp(this.action_ip, this.remark).then(result => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.$set(this.ip_list, this.action_ip, this.remark)
        this.action_ip = ''
        this.remark = ''
        this.loading = false
      }).catch(err => { console.log(err.message) })
    },
    del_ip(ip) {
      this.$confirm('确定要删除该IP？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        api.delIp(ip).then(result => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.$delete(this.ip_list, ip)
          this.loading = false
        }).catch(err => { console.log(err.message) })
      })
    },
    index_num(index) {
      return index + 1
    }
  }
}
</script>

<style scoped>

</style>
