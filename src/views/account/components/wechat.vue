<template>
  <div>
    <el-dialog
      title="绑定企业微信账号"
      :visible.sync="visible"
      width="30%"
      @close="$emit('close')"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="企业部门" prop="did">
          <template>
            <el-select v-model="form.did" filterable placeholder="请选择部门" @change="getUsers">
              <el-option v-for="(item, index) in arr" :key="index" :value="item.id" :label="item.name" />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="关联人员" prop="uid">
          <template>
            <el-select v-model="form.uid" filterable placeholder="请选择人员">
              <el-option v-for="(item, index) in users" :key="index" :value="item.userid" :label="item.name" />
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getWXdepartment, getWXusers, addWXusers } from '@/api/account'

export default {
  components: {},
  inject: [],
  props: {
    id: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      visible: true,
      form: {
        did: '',
        uid: ''
      },
      arr: [],
      users: []
    }
  },
  computed: {
    rules() {
      return {
        did: [{ required: true, message: '请选择部门', trigger: ['blur', 'change'] }],
        uid: [{ required: true, message: '请选择人员', trigger: ['blur', 'change'] }]
      }
    }
  },
  watch: {},
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    submit() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return false
        this.loading = true
        try {
          const param = {
            uid: this.id,
            wc_uid: this.form.uid
          }
          this.users.forEach((v) => {
            if (v.userid === this.form.uid) {
              param.wc_username = v.name
            }
          })
          await addWXusers(param)
          this.$message.success('关联成功')
          this.$emit('close')
          this.$emit('success')
        } catch (error) {
          this.loading = false
        }
        this.loading = false
      })
    },
    async getUsers() {
      const res = await getWXusers({ department_id: this.form.did })
      this.users = res.result
      this.form.uid = ''
    },
    async init() {
      const rec = await getWXdepartment()
      this.arr = rec.result
    }
  }
}
</script>

<style scoped lang="scss">
.el-select {
  width: 100%
}
</style>
