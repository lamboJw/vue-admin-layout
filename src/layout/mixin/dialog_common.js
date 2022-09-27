/*
对话框公用数据和方法，配合layout/dialog_template.vue使用，复制该文件到指定views下文件夹，修改即刻
一般只需要实现init_api、submit_api即可，如需更细致的自定义，可以实现对应的方法
注意！尽量不要修改open_dialog_callback和close_dialog方法，如传入的数据不只是id，则可以修改open_dialog_callback方法
可以嵌套使用TableLayout，实现对话框内显示表格
 */

import dialogLayout from '@/layout/components/DialogLayout'

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
      status_options: ['下线', '上线', '待上线'],
      ueditor_config: {
        autoHeightEnabled: false,
        autoFloatEnabled: true,
        initialFrameWidth: 800,
        initialFrameHeight: 300,
        UEDITOR_HOME_URL: process.env.VUE_APP_BASE_API + '/js/ueditor/'
      },
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
    }
  },
  methods: {
    close_dialog(reload = false) {
      if (typeof this.$refs[this.form_ref] !== 'undefined') {
        this.$refs[this.form_ref].resetFields()
      }
      this.visible = false
      this.loading = false
      this.id = 0
      if (reload) {
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
        // eslint-disable-next-line no-prototype-builtins
        if (result.hasOwnProperty(i)) {
          this.info[i] = result[i]
        }
      }
    },
    after_init(result) {},
    init() {
      this.loading = true
      this.init_api()
        .then((ret) => {
          this.loading = false
          this.init_callback(ret.result)
          this.after_init(ret.result)
        })
        .catch(() => {
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
    submit(reload = true) {
      if (typeof this.$refs[this.form_ref] !== 'undefined') {
        this.$refs[this.form_ref].validate((valid) => {
          if (valid) {
            this.submit_api()
              .then((result) => {
                this.submit_callback(result.result)
                this.close_dialog(reload)
              })
              .catch((err) => {
                console.log(err)
              })
          } else {
            console.log('表单验证失败')
          }
        })
      } else {
        this.submit_api()
          .then((result) => {
            this.submit_callback(result.result)
            this.close_dialog(reload)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }
}
