/*
对话框公用数据和方法，配合layout/dialog_template.vue使用，复制该文件到指定views下文件夹，修改即刻
一般只需要实现init_api、submit_api即可，如需更细致的自定义，可以实现对应的方法
注意！尽量不要修改open_dialog_callback和close_dialog方法，如传入的数据不只是id，则可以修改open_dialog_callback方法
可以嵌套使用TableLayout，实现对话框内显示表格
 */

import dialogLayout from '@/layout/components/DialogLayout'
import { objectHasKey } from '@/utils/common_function'
import { throttle } from '@/utils/decorator'

export const dialog_common = {
  components: {
    dialogLayout
  },
  data() {
    return {
      info: {},
      id: 0,
      visible: false,
      loading: false,
      need_reload: false,
      form_ref: 'dialog_form'
    }
  },
  provide: function() {
    return {
      close_dialog: this.close_dialog,
      submit: this.submit,
      init: this.init
    }
  },
  inject: ['reload'],
  computed: {
    dialog_title: function() {
      return this.id === 0 ? '新增' : '编辑'
    },
    true_form_ref: function() {
      if (!this.form_ref) return null
      let form_ref = [this.form_ref]
      if (this.form_ref.indexOf('.') !== -1) {
        // 适配多层级组件
        form_ref = this.form_ref.split('.')
      }
      let ref = this
      for (let i = 0; i < form_ref.length; i++) {
        if (typeof ref.$refs[form_ref[i]] !== 'undefined') {
          ref = ref.$refs[form_ref[i]]
        } else {
          ref = null
          break
        }
      }
      return ref
    }
  },
  methods: {
    reset_form_fields() {
      // 重置表单
      if (this.true_form_ref) {
        if (this.true_form_ref.$vnode.tag.indexOf('FormLayout') !== -1) {
          this.true_form_ref.reset_fields()
        } else {
          this.true_form_ref.resetFields()
        }
      }
    },
    before_close() {},
    close_dialog(reload = null) {
      this.reset_form_fields()
      this.before_close()
      this.id = 0
      this.visible = false
      this.loading = false
      if (reload || (reload === null && this.need_reload)) {
        this.reload()
      }
    },
    open_dialog_callback(id) {
      this.id = id
      this.visible = true
    },
    init_api() {
      return new Promise((resolve, reject) => {
        reject(new Error('未定义查询接口'))
      })
    },
    init_callback(result) {
      for (const i in this.info) {
        if (objectHasKey(result, i)) {
          this.info[i] = result[i]
        }
      }
    },
    after_init() {},
    init() {
      this.loading = true
      this.init_api()
        .then((ret) => {
          this.init_callback(ret.result)
          this.after_init(ret.result)
        })
        .finally(() => {
          this.loading = false
        })
    },
    submit_api() {
      return new Promise((resolve, reject) => {
        reject(new Error('未定义提交接口'))
      })
    },
    submit_callback() {
      this.$message({
        showClose: true,
        message: '提交成功',
        type: 'success'
      })
    },
    @throttle(2000)
    submit() {
      if (this.true_form_ref?.validate) {
        this.true_form_ref.validate((valid) => {
          if (valid) {
            this.do_submit()
          } else {
            console.log('表单验证失败')
          }
        })
      } else {
        this.do_submit()
      }
    },
    do_submit() {
      this.loading = true
      this.submit_api()
        .then((result) => {
          this.submit_callback(result.result)
          this.close_dialog(true)
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    }
  }
}
