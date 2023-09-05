<template>
  <dialog-layout
    :visible.sync="visible"
    :title="dialog_title"
    :loading="loading"
    width="40%"
  >
    <div class="form-container">
      <form-layout
        ref="dialog_form"
        :form-item="form_item"
        :form="info"
        :form-submit-btn="false"
        :submit-on-change="false"
        :inline="false"
        :show-label="true"
        :show-item-num="-1"
        :rules="rules"
      />
    </div>
  </dialog-layout>
</template>

<script>
import { validEmail } from '@/utils/validate'
import { addAccount, updateAccount, getWXusers } from '@/api/account'
import { getDepartment } from '@/api/department'
import { getRoleAll } from '@/api/role'
import { dialog_common } from '@/layout/mixin/dialog_common'
import { form_common } from '@/layout/mixin/form_common'
import { common } from '@/const/constant'
import FormLayout from '@/layout/components/FormLayout'

export default {
  components: { FormLayout },
  mixins: [dialog_common, form_common],
  data() {
    return {
      form_ref: 'dialog_form',
      info: {
        username: '',
        password: '',
        name: '',
        email: '',
        department_id: '',
        position: '',
        role_id: '',
        wc_uid: ''
      },
      form_item: [
        { label: '所属部门', prop: 'department_id', type: 'select', options: [], change: this.selDepartment },
        { label: '用户姓名', prop: 'name', type: 'select', options: [], option_value: 'name', change: this.selUser },
        { label: '用户帐号', prop: 'username', type: 'input' },
        { label: '所属职责', prop: 'position', type: 'select', options: common.position.toArray() },
        { label: '用户密码', prop: 'password', type: 'input', placeholder: '留空代表不作修改', required: false },
        { label: '邮箱地址', prop: 'email', type: 'input' },
        { label: '角色权限', prop: 'role_id', type: 'select', options: [] }
      ],
      rules: {
        department_id: [{ required: true, message: '请选择所属部门', trigger: 'blur' }],
        name: [{ required: true, message: '请选择用户姓名', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        position: [{ required: true, message: '请选择所属职责', trigger: 'blur' }],
        role_id: [{ required: true, message: '请选择角色权限', trigger: 'blur' }],
        email: [{ required: true, validator: this.email, trigger: 'blur' }],
        password: [
          {
            validator: (rule, value, cb) => {
              if (this.form_item[this.form_prop_index['password']].required && value === '') {
                cb('请输入密码')
              } else {
                cb()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      roleArr: [],
      userArr: [],
      departmentArr: [],
      dataArr: [],
      source: {}
    }
  },
  methods: {
    open_dialog_callback(info) {
      if (info) {
        this.source = info
        this.set_form_item_options('password', '留空代表不作修改', 'placeholder')
        this.set_form_item_options('password', false, 'required')
        this.id = info.id
      } else {
        this.source = {}
        this.set_form_item_options('password', '用户密码', 'placeholder')
        this.set_form_item_options('password', true, 'required')
      }
      this.visible = true
    },
    submit_api() {
      const info = Object.assign({}, this.info)
      if (this.id !== 0) {
        if (info.password === '') {
          delete info.password
        }
        return updateAccount({ id: this.id, ...info })
      } else {
        return addAccount({ ...info })
      }
    },
    init() {
      for (const key in this.info) {
        this.info[key] = typeof this.source[key] !== 'undefined' ? this.source[key] : ''
      }
      if (this.info.position) {
        this.info.position = this.info.position.toString()
      }
      if (this.info.department_id) {
        this.selDepartment()
      }
      if (this.departmentArr.length === 0) {
        getDepartment({ page_size: 50 }).then((rec) => {
          this.departmentArr = rec.result.data
          this.set_form_item_options('department_id', this.departmentArr)
        })
      }
      if (this.roleArr.length === 0) {
        getRoleAll().then((res) => {
          this.roleArr = res.result
          this.set_form_item_options('role_id', this.roleArr)
        })
      }
    },
    async selDepartment() {
      const res = await getWXusers({ department_id: this.info.department_id })
      this.userArr = res.result
      // this.info.name = "";
      // this.info.wc_uid = "";
      this.set_form_item_options('name', this.userArr)
      this.selUser()
    },
    selUser() {
      if (this.info.name !== '') {
        this.userArr.forEach((v) => {
          if (v.name === this.info.name) {
            this.info.username = v.userid
            this.info.wc_uid = v.userid
          }
        })
      }
    },
    email(rule, value, cb) {
      if (!validEmail(value)) {
        cb('请输入正确邮箱')
      } else {
        cb()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-select {
  width: 100%
}
</style>
