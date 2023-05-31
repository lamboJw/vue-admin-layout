<template>
  <div class="app-container">
    <div v-if="show_form" class="form-container">
      <form-layout
        ref="form_layout"
        :form="form"
        :form-item="formItem"
        :form-submit-btn="formSubmitBtn"
        :submit-on-change="submitOnChange"
        :show-item-num="showItemNum"
        :item-storage-name="formItemStorageName"
        :item-sort-start-times="itemSortStartTimes"
        :inline="true"
        :rules="rules"
      >
        <template v-for="item in formItem.filter((v) => v.type === 'slot')" v-slot:[item.slot_name]="scope">
          <slot :name="item.slot_name" v-bind="scope" />
        </template>
      </form-layout>
    </div>
    <div v-if="show_button" class="button-container">
      <slot name="button" />
    </div>
    <table-layout
      v-if="show_table"
      ref="table_layout"
      :list-loading="listLoading"
      :list="list"
      :fetcher="table_list_fetcher"
      :form="form"
      :table-column="tableColumn"
      :show-table="showTable"
      :page-sizes="pageSizes"
      :pagination-type="paginationType"
      :first-row-summary="firstRowSummary"
      :table-column-storage-name="tableColumnStorageName"
      :first-reload="firstReload"
      :table-params="tableParams"
      :table-id="tableId"
      :total-count="totalCount"
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
      <template v-if="tableColumn.filter((v) => v.type === 'expand').length > 0" v-slot:table_expand="scope">
        <slot name="table_expand" v-bind="scope" />
      </template>
      <template v-for="item in tableColumn.filter((v) => v.template === 'slot')" v-slot:[item.slot_name]="scope">
        <slot :name="item.slot_name" v-bind="scope" />
      </template>
    </table-layout>
    <div class="dialog-container">
      <slot name="dialog" />
    </div>
  </div>
</template>

<script>
import TableLayout from '@/layout/components/TableLayout'
import FormLayout from '@/layout/components/FormLayout'

export default {
  name: 'FormTableLayout',
  components: {
    TableLayout,
    FormLayout
  },
  props: {
    form: {
      // 筛选信息
      type: Object,
      default: function() {
        return { prePage: 10, page: 1 }
      },
      required: true
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
    tableListFetcher: {
      // 表格数据获取方法
      type: Function,
      default: null
    },
    formItem: {
      // 表单项
      type: Array,
      default: function() {
        return []
      }
    },
    paginationType: { type: String, default: 'server' }, // 表格分页模式，server：服务器分页，local：本地分页
    firstRowSummary: { type: Boolean, default: false }, // 本地分页模式下，数据第一条是否为汇总行，为true时，数据第一条会固定在每页第一行
    formSubmitBtn: { type: Boolean, default: true }, // 是否显示筛选表单中的查询按钮
    submitOnChange: { type: Boolean, default: true }, // 改变表单时自动提交
    tableColumn: {
      // 列表配置
      type: Array,
      default: function() {
        return []
      }
    },
    // 传了tableColumn参数后，该参数不为空时可开启“显示列”功能，传入tableColumn时需要加上.sync修饰符。
    // 如果有多选框，之类的没有标题的列，也需要把标题加上
    tableColumnStorageName: { type: String, default: '' },
    firstReload: { type: Boolean, default: true }, // 挂载完成时是否读取列表
    tableId: { type: String, default: '' }, // 表格id
    showTable: { type: Boolean, default: true }, // 是否显示表格
    showItemNum: { type: Number, default: 9 }, // 显示筛选框个数，超出的在弹出框中显示
    formItemStorageName: { type: String, default: '' }, // 筛选框排序存储名
    itemSortStartTimes: { type: Number, default: 10 }, // 应用排序的起始使用次数
    rules: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  provide: function() {
    return {
      reload: this.reload
    }
  },
  inject: ['fetch_data'],
  computed: {
    show_form: function() {
      return this.formItem.length > 0
    },
    show_button: function() {
      return typeof this.$slots.button !== 'undefined'
    },
    show_table: function() {
      return this.showTable
    },
    table_list_fetcher: function() {
      return this.tableListFetcher !== null
        ? this.tableListFetcher
        : this.fetch_data
    }
  },
  methods: {
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
    table_sort_change(column, prop, order) {
      this.$emit('sort-change', column, prop, order)
    },
    table_expand_change(row, expanded) {
      this.$emit('expand-change', row, expanded)
    },
    reload() {
      // 解决弹出框嵌套表单表格使用时，dialog_common注入了fetch_data，index_common又定义了fetch_data，造成报错
      // 换个名字，这样dialog_common注入reload，与index_common的fetch_data不冲突，弹出框也可以调用上层的fetch_data
      this.table_list_fetcher()
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container,
.button-container {
  margin-top: 10px;
}

.button-container {
  min-height: 40px;
}
</style>
