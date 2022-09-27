/*
首页公用的数据、方法，配合layout/index_template.vue使用，复制到views下文件夹修改即刻
包含列表数据获取、修改状态、删除记录
一般只需要实现fetch_api、del_api、change_status_api即可，也可以实现其他方法来自定义
 */

import tableLayout from '@/layout/components/TableLayout'

export const index_common = {
  components: {
    tableLayout
  },
  data() {
    return {
      form: {
        page: 1,
        prePage: 20
      },
      list: [],
      list_loading: true,
      form_item: [],
      table_column: [],
      total_count: 0,
      page_sizes: [10, 15, 20, 50, 100, 200],
      status_options: ['下线', '上线', '待上线'], // 状态值对象，不要使用异步方法来修改该值，否则tableLayout组件获取不到新值
      status_color: ['#f78989', '#85ce61', '#ebb563'], // 状态值对应颜色数组，用于显示状态文字，不要使用异步方法来修改该值，否则tableLayout组件获取不到新值
      old_status_list: {}, // 记录列表中旧状态值
      status_key: 'status', // 数据列表中代表状态的键名
      id_key: 'id', // 数据列表中代表id的键名
      table_selection: [] // 记录表格多选记录，记录的是每行的id_key对应的字段
    }
  },
  provide: function() {
    return {
      fetch_data: this.fetch_data,
      change_status: this.change_status,
      del: this.del,
      batch_del: this.batch_del,
      open_dialog: this.open_dialog,
      status_options: this.status_options,
      status_color: this.status_color,
      id_key: this.id_key,
      status_key: this.status_key
    }
  },
  methods: {
    fetch_api() {
      this.$message.error('未定义查询接口')
      return Promise.reject()
    },
    fetch_callback(result) {
      this.total_count = result.total
      this.list = result.data
      if (this.list.length > 0 && this.status_key in this.list[0]) {
        this.list.map((item, index) => {
          this.old_status_list[index] = item[this.status_key]
        })
      } else {
        this.old_status_list = {}
      }
    },
    fetch_after(result) {},
    fetch_data() {
      this.list_loading = true
      this.fetch_api()
        .then((result) => {
          this.list_loading = false
          this.fetch_callback(result)
          this.fetch_after(result)
        })
        .catch(() => {
          this.list_loading = false
        })
    },
    open_dialog() {
      let command = `this.$refs[arguments[0]].open_dialog_callback(`
      for (let i = 1; i < arguments.length; i++) {
        command += `arguments[${i}]`
        if (i < arguments.length - 1) {
          command += ','
        }
      }
      command += ');'
      // eslint-disable-next-line no-eval
      eval(command)
    },
    del_api(id) {
      this.$message.error('未定义删除接口')
      return Promise.reject()
    },
    del_callback() {
      this.$message({
        type: 'success',
        message: '删除成功'
      })
    },
    del(id) {
      this.$confirm('确定要进行删除操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.list_loading = true
          this.del_api(id)
            .then((result) => {
              this.del_callback(result)
              this.list_loading = false
              this.fetch_data()
            })
            .catch(() => {
              this.list_loading = false
            })
        })
        .catch(() => {})
    },
    batch_del_api(selection) {
      this.$message.error('未定义批量删除接口')
      return Promise.reject()
    },
    batch_del() {
      if (this.table_selection.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return false
      }
      this.$confirm('确定要批量删除选中的记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.list_loading = true
          this.batch_del_api(this.table_selection)
            .then((result) => {
              this.del_callback(result)
              this.list_loading = false
              this.fetch_data()
            })
            .catch(() => {
              this.list_loading = false
            })
        })
        .catch(() => {})
    },
    change_status_api(id, status) {
      this.$message.error('未定义修改状态接口')
      return Promise.reject()
    },
    change_status_callback(result) {
      this.$message({
        type: 'success',
        message: '修改成功'
      })
    },
    change_status(id, status, index) {
      this.$confirm('确定要修改状态吗？', '提醒')
        .then(() => {
          this.change_status_api(id, status)
            .then((result) => {
              this.change_status_callback(result)
              this.old_status_list[index] = status
            })
            .catch(() => {
              this.list[index][this.status_key] = this.old_status_list[index]
            })
        })
        .catch(() => {
          this.list[index][this.status_key] = this.old_status_list[index]
        })
    },
    export_excel(url, data) {
      let param = ['outputExcel=1']
      for (const key in data) {
        param.push(key + '=' + data[key])
      }
      param = param.join('&')
      window.open(process.env.VUE_APP_BASE_API + url + '?' + param)
    },
    handle_table_selection_change(selection) {
      // 处理表格多选事件
      const _this = this
      this.table_selection = selection.map(function(item) {
        return item[_this.id_key]
      })
    }
  }
}
