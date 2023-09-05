/*
首页公用的数据、方法，配合layout/index_template.vue使用，复制到views下文件夹修改即刻
包含列表数据获取、修改状态、删除记录
一般只需要实现fetch_api、del_api、change_status_api即可，也可以实现其他方法来自定义
 */

import formTableLayout from '@/layout/components/FormTableLayout'
import { objectArrayFindIndex, objectHasKey } from '@/utils/common_function'
import { utils as xlsx$utils, write as xlsx$write } from 'xlsx'
import FileSaver from 'file-saver'
import { MyArray } from '@/utils/myArray'
import { MyObject } from '@/utils/myObject'
import { confirm_msg } from '@/utils/decorator'
import { form_common } from '@/layout/mixin/form_common'
import { common } from '@/const/constant'

export const index_common = {
  components: {
    formTableLayout
  },
  mixins: [form_common],
  data() {
    return {
      form: {
        [common.pager.page_name]: 1,
        [common.pager.page_size_name]: common.pager.default_page_size
      },
      list: [],
      list_loading: true,
      form_item: [],
      table_column: [],
      total_count: 0,
      page_sizes: common.pager.page_sizes,
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
      open_dialog: this.open_dialog,
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
      const _this = this
      const map = {}
      const sets = {}
      this.table_column.map((item, index) => {
        if (objectHasKey(item, 'filters')) {
          map[item.field] = index
          sets[index] = new Set()
        }
      })
      if (
        this.list.length > 0 &&
        (objectHasKey(this.list[0], this.status_key) ||
          Object.keys(map).length > 0)
      ) {
        this.list.map((item, index) => {
          if (this.status_key in this.list[0]) {
            this.old_status_list[index] = item[this.status_key]
          }
          for (const key in item) {
            if (objectHasKey(map, key)) {
              sets[map[key]].add(
                JSON.stringify({ text: item[key], value: item[key] })
              )
            }
          }
        })
        for (const key in sets) {
          _this.table_column[key].filters = []
          sets[key].forEach((value) => {
            _this.table_column[key].filters.push(JSON.parse(value))
          })
        }
      } else {
        this.old_status_list = {}
        for (const key in sets) {
          _this.table_column[key].filters = []
        }
      }
    },
    fetch_after() {},
    fetch_data() {
      this.list_loading = true
      this.fetch_api()
        .then((result) => {
          this.list_loading = false
          this.fetch_callback(result.result)
          this.fetch_after(result.result)
        })
        .catch(() => {
          this.list_loading = false
        })
    },
    open_dialog(ref, ...params) {
      this.$refs[ref].open_dialog_callback(...params)
    },
    // eslint-disable-next-line no-unused-vars
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
    @confirm_msg('确定要进行删除操作？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    del(id) {
      this.list_loading = true
      this.del_api(id)
        .then((result) => {
          this.del_callback(result.result)
          this.list_loading = false
          this.fetch_data()
        })
        .catch(() => {
          this.list_loading = false
        })
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
    change_status(row, status, index) {
      this.$confirm('确定要修改状态吗？', '提醒')
        .then(() => {
          this.change_status_api(row[this.id_key], status)
            .then((result) => {
              this.change_status_callback(result.result)
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
    // 定义导出Excel表格事件
    export_excel(table_id, filename) {
      var xlsxParam = { raw: true }
      /* 从表生成工作簿对象 */
      var wb = xlsx$utils.table_to_book(
        document.querySelector(`#${table_id}`),
        xlsxParam
      )
      /* 获取二进制字符串作为输出 */
      var wbout = xlsx$write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          // Blob 对象表示一个不可变、原始数据的类文件对象。
          // Blob 表示的不一定是JavaScript原生格式的数据。
          // File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          // 返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: 'application/octet-stream' }),
          // 设置导出文件名称
          `${filename}.xlsx`
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    handle_table_selection_change(selection) {
      // 处理表格多选事件
      const _this = this
      this.table_selection = selection.map(function(item) {
        return item[_this.id_key]
      })
    },
    filterHandler(value, row, column) {
      return row[column.property] === value
    },
    set_table_column_prop(table_column, field, key, val) {
      const index = objectArrayFindIndex(table_column, 'field', field)
      if (index !== null && objectHasKey(table_column[index], key)) {
        table_column[index][key] =
          typeof val === 'object'
            ? val instanceof Array
              ? new MyArray(val)
              : new MyObject(val)
            : val
      }
    },
    get_show_columns(table_ref = 'indexTable') {
      let ref
      if (typeof this.$refs[table_ref] === 'undefined') {
        this.$message.error('未找到表格组件')
        return false
      }
      ref = this.$refs[table_ref]
      if (ref.$vnode.tag.indexOf('FormTableLayout') !== -1) {
        ref = ref.$refs.table_layout
      }
      if (ref.$vnode.tag.indexOf('TableLayout') === -1) {
        this.$message.error('指定表格组件不是TableLayout')
        return false
      }
      return ref.table_column_checked
    }
  }
}
