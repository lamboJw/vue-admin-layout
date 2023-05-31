<template>
  <div>
    <div class="table-container">
      <el-table
        :id="tableId"
        ref="data_table"
        v-loading="listLoading"
        :data="show_list"
        element-loading-text="Loading"
        v-bind="table_params"
        :cell-class-name="cell_class"
        @select="table_select"
        @select-all="table_select_all"
        @selection-change="table_selection_change"
        @cell-click="table_cell_click"
        @cell-dblclick="table_cell_dblclick"
        @row-click="table_row_click"
        @row-dblclick="table_row_dblclick"
        @filter-change="table_filter_change"
        @sort-change="table_sort_change"
        @expand-change="table_expand_change"
      >
        <template v-for="(item, index) in show_table_column">
          <table-column-layout :key="`${item.field}${index}`" :item="item" :index="index">
            <template
              v-if="
                tableColumn.filter((v) => {
                  return v.type === 'expand';
                }).length > 0
              "
              v-slot:table_expand="scope"
            >
              <slot name="table_expand" v-bind="scope"></slot>
            </template>
            <template
              v-for="item in show_table_column.filter((v) => {
                return v.template === 'slot';
              })"
              v-slot:[item.slot_name]="scope"
            >
              <slot :name="item.slot_name" v-bind="scope"></slot>
            </template>
          </table-column-layout>
        </template>
        <slot name="table" />
      </el-table>
    </div>
    <div v-if="show_pagination || show_column_select" class="pager-container">
      <el-popover
        v-if="show_column_select"
        class="table_column_checkbox"
        placement="right"
        width="500"
        trigger="click"
      >
        <el-checkbox-group
          v-model="table_column_checked"
          :style="{ display: 'flex', 'flex-wrap': 'wrap' }"
        >
          <el-checkbox
            v-for="(item, index) in table_column_options"
            :key="`${item.field}${index}`"
            :label="item.title"
            :style="{ width: '120px' }"
          />
        </el-checkbox-group>
        <el-button slot="reference" type="primary" style="margin-right: 10px">显示列</el-button>
      </el-popover>
      <el-pagination
        v-if="show_pagination"
        :current-page="form.page"
        :page-sizes="pageSizes"
        :page-size="form.prePage"
        :total="totalCount"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handle_limit_change"
        @current-change="handle_page_change"
        style="float: right"
      />
    </div>
  </div>
</template>

<script>
import { copyToClipboard } from '@/utils/common_function'
import TableColumnLayout from '@/layout/components/TableColumnLayout'
import { MyArray } from '@/utils/myArray'

export default {
  name: 'TableLayout',
  components: {
    TableColumnLayout
  },
  props: {
    form: {
      // 筛选信息
      type: Object,
      default: function() {
        return {}
      }
    },
    list: {
      // 表格数据
      type: Array,
      default: function() {
        return []
      },
      required: true
    },
    listLoading: { type: Boolean, default: false, required: true }, // 是否启用“加载中”动画
    totalCount: { type: Number, default: 0 }, // 表格数据总数
    pageSizes: {
      // 可用分页数量
      type: Array,
      default: function() {
        return [10, 15, 20, 50, 100, 200]
      }
    },
    tableParams: {
      // 表格属性值，不传使用默认值
      type: Object,
      default: function() {
        return {}
      }
    },
    paginationType: { type: String, default: 'server' }, // 表格分页模式，server：服务器分页，local：本地分页
    firstRowSummary: { type: Boolean, default: false }, // 本地分页模式下，数据第一条是否为汇总行，为true时，数据第一条会固定在每页第一行
    /* 传入表格列信息，自动显示数据
     * 设置最小宽度：min_width，默认100px
     * 设置单元格类型：type
     *   selection：多选框
     *   index：行索引
     *   expand：展开按钮，需指定插槽内容
     * 单元格渲染特定模版，添加字段template，取值如下：
     *   字符串映射：str_map，添加字段：
     *      str_map：映射对象
     *      color：非必传，映射颜色对象
     *   下拉框：select，添加字段：
     *      change：修改下拉框值时触发，传参有当前行数据row，当前行在表格中的下标$index
     *   展示图片：img，点击放大
     *   编辑框：input, 添加字段：
     *      change：指明编辑触发的方法
     *   展示系统图标：icon
     *   渲染HTML：html
     *   对值进行处理：function，添加字段：
     *      function：指定对值进行处理的方法
     *   操作按钮：action，添加字段：
     *      show_num：最多显示按钮数
     *      action，按钮的配置信息数组，每个元素为一个对象，包含下列属性
     *        text：按钮文字
     *        color：按钮颜色，预设success,warning,danger,info,normal,primary，也可自定义16位的颜色
     *        v-if：按钮的条件判断方法，传值为el-table-column中的scope，返回一个bool
     *        v-permission：按钮显示权限，可传字符串或字符串数组
     *        click：点击按钮后的回调函数，传值为el-table-column中的scope
     *   动态插槽：slot，添加字段：
     *      slot_name：指定插槽名称，然后添加<template v-slot:插槽名称="{scope}">填写插槽内容
     * 单元格点击复制内容：event: "copy_text"
     */
    tableColumn: {
      type: Array,
      default: function() {
        return []
      },
      required: true
    },
    // 传了tableColumn参数后，该参数不为空时可开启“显示列”功能，传入tableColumn时需要加上.sync修饰符。
    // 如果有多选框，之类的没有标题的列，也需要把标题加上
    tableColumnStorageName: { type: String, default: '' },
    firstReload: { type: Boolean, default: true }, // 挂载完成时是否读取列表
    tableId: { type: String, default: '' }, // 表格id
    showTable: { type: Boolean, default: true }, // 是否显示表格
    fetcher: { type: Function, default: null } // 指定获取列表的方法
  },
  data() {
    return {
      show_table_column: new MyArray(this.tableColumn),
      table_column_options: new MyArray(this.tableColumn),
      show_list: [],
      summary_row: []
    }
  },
  inject: ['fetch_data'],
  computed: {
    show_pagination: function() {
      return typeof this.form.prePage !== 'undefined' && this.form.prePage > 0
    },
    show_column_select: function() {
      return (
        this.table_column_options.length > 0 &&
        this.tableColumnStorageName !== ''
      )
    },
    table_params: function() {
      const default_params = {
        border: true,
        fit: true,
        'highlight-current-row': true,
        'tree-props': {},
        'cell-style': { 'font-size': '14px' },
        'header-cell-style': { 'font-size': '14px' },
        size: 'mini',
        'default-expand-all': false,
        'row-key': 'id'
      }
      return Object.assign(default_params, this.tableParams)
    },
    table_column_checked: {
      get: function() {
        return this.show_table_column.map(function(item) {
          return item.title
        })
      },
      set: function(new_value) {
        const filter_column = this.table_column_options.filter(function(item) {
          if (new_value.includes(item.title)) {
            return item
          }
        })
        if (this.storage_key) {
          localStorage.setItem(this.storage_key, JSON.stringify(new_value))
        }
        this.show_table_column = new MyArray(filter_column)
      }
    },
    copy_columns: function() {
      return this.show_table_column.map(function(item) {
        if (item.event && item.event.indexOf('copy_text') !== -1) {
          return item.field
        }
      })
    },
    storage_key: function() {
      if (!this.tableColumnStorageName) {
        return ''
      }
      return `showColumn:${this.tableColumnStorageName}`
    },
    list_fetcher: function() {
      return this.fetcher !== null ? this.fetcher : this.fetch_data
    }
  },
  watch: {
    list: function(new_value) {
      if (this.paginationType === 'server') {
        this.show_list = new_value
      } else {
        if (this.firstRowSummary) {
          this.summary_row = new_value[0]
        }
        this.local_pagination()
      }
    },
    tableColumn: {
      handler: function(val) {
        this.show_table_column = new MyArray(val)
      },
      deep: true
    }
  },
  created() {
    let history = null
    if (this.storage_key) {
      history = localStorage.getItem(this.storage_key)
    }
    if (history !== null) {
      this.table_column_checked = JSON.parse(history)
    }
  },
  mounted() {
    if (this.firstReload) {
      setTimeout(this.list_fetcher, 100)
    }
    if (this.paginationType === 'server') {
      this.show_list = this.list
    } else {
      if (this.firstRowSummary) {
        this.summary_row = this.list[0]
      }
      this.local_pagination()
    }
  },
  methods: {
    handle_limit_change(val) {
      this.form.prePage = val
      this.paginationType === 'server'
        ? this.list_fetcher()
        : this.local_pagination()
    },
    handle_page_change(val) {
      this.form.page = val
      this.paginationType === 'server'
        ? this.list_fetcher()
        : this.local_pagination()
    },
    local_pagination() {
      let offset = this.show_pagination
        ? (this.form.page - 1) * this.form.prePage
        : 0
      if (this.firstRowSummary) {
        offset += 1
      }
      this.show_list = this.list.slice(
        offset,
        this.show_pagination ? offset + this.form.prePage : undefined
      )
      if (this.firstRowSummary) {
        this.show_list.unshift(this.summary_row)
      }
    },
    table_select(selection, row) {
      this.$emit('select', selection, row)
    },
    table_select_all(selection) {
      this.$emit('select-all', selection)
    },
    table_selection_change(selection) {
      this.$emit('selection-change', selection)
    },
    table_cell_click(row, column, cell, event) {
      if (column.property && this.copy_columns.includes(column.property)) {
        copyToClipboard(row[column.property])
      }
      this.$emit('cell-click', row, column, cell, event)
    },
    table_row_click(row, column, event) {
      this.$emit('row-click', row, column, event)
    },
    table_cell_dblclick(row, column, cell, event) {
      this.$emit('cell-dblclick', row, column, cell, event)
    },
    table_row_dblclick(row, column, cell, event) {
      this.$emit('row-dblclick', row, column, event)
    },
    table_filter_change(filters) {
      this.$emit('filter-change', filters)
    },
    table_sort_change(params) {
      const { column, prop, order } = params
      this.$emit('sort-change', column, prop, order)
    },
    table_expand_change(row, expanded) {
      this.$emit('expand-change', row, expanded)
    },
    cell_class({ column }) {
      const classes = []
      if (column.property && this.copy_columns.includes(column.property)) {
        classes.push('copy-text')
      }
      return classes
    }
  }
}
</script>

<style lang="scss" scoped>
.table-container,
.pager-container {
  margin-top: 10px;
}

.table-container::v-deep {
  /*解决固定列遮盖底部滚定条导致滚动条无法滚动的问题*/
  .el-table__body-wrapper {
    z-index: 2;
  }

  /* 解决右边固定列左边框消失 */
  .el-table__fixed-header-wrapper {
    .el-table__header {
      th:not(.is-hidden):last-child {
        border-left: 1px solid #dfe6ec;
      }
    }
  }

  .el-table__fixed-body-wrapper {
    .el-table__row {
      td:not(.is-hidden):last-child {
        border-left: 1px solid #dfe6ec;
      }
    }
  }

  .table_column_checkbox .el-button {
    margin-bottom: 10px;
  }

  .icon {
    width: auto;
    height: 40px;
  }

  .copy-text {
    cursor: pointer;
  }

  .el-button--mini {
    padding: 5px 10px;
  }
}

.pager-container::v-deep {
  height: 32px;

  .el-pagination {
    margin-right: 0;
  }
}
</style>
