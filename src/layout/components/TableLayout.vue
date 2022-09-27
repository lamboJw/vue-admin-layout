<template>
  <div class="app-container">
    <div v-if="show_form" class="form-container">
      <el-form ref="form" :model="form" inline @submit.native.prevent>
        <template v-for="item in formItem">
          <el-form-item :key="item.prop" :prop="item.prop" :required="'required' in item && item.required === true">
            <el-input v-if="!item.type || item.type==='input'" v-model="form[item.prop]" :placeholder="`${item.label}`" :type="item.input_type ? item.input_type : 'text'" clearable suffix-icon="el-icon-search" :disabled="'disabled' in item && item.disabled === true" @change="form_submit" />
            <el-select v-else-if="item.type==='select'" v-model="form[item.prop]" :placeholder="`${item.label}`" clearable :disabled="'disabled' in item && item.disabled === true" @change="form_submit">
              <el-option v-for="option in item.options" :key="option[item.option_value ? item.option_value : 'id']" :label="option[item.option_label ? item.option_label : 'name']" :value="option[item.option_value ? item.option_value : 'id']" />
            </el-select>
            <el-date-picker
              v-else-if="['date','daterange','datetime','datetimerange','month','monthrange','year','yearrange'].includes(item.type)"
              v-model="form[item.prop]"
              :type="item.type"
              :placeholder="'请选择' + item.label"
              range-separator="至"
              :start-placeholder="item.label + '开始'"
              :end-placeholder="item.label + '结束'"
              :value-format="date_picker_format[item.type.replace('range', '')]"
              :format="date_picker_format[item.type.replace('range', '')]"
              :disabled="'disabled' in item && item.disabled === true"
              @change="form_submit"
            />
            <el-time-select v-else-if="item.type==='time'" v-model="form[item.prop]" :placeholder="'选择' + item.label" :disabled="'disabled' in item && item.disabled === true" @change="form_submit" />
            <el-time-picker v-else-if="item.type==='timerange'" v-model="form[item.prop]" is-range placeholder="选择时间范围" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" :disabled="'disabled' in item && item.disabled === true" @change="form_submit" />
            <multi-select
              v-else-if="item.type==='multi_select'"
              :value.sync="form[item.prop]"
              :options="item.options"
              :option-value="item.option_value ? item.option_value : 'id'"
              :option-label="item.option_label ? item.option_label : 'name'"
              :limit="item.limit ? item.limit : 0"
              collapse-tags
              :placeholder="`请选择${item.label}`"
              clearable
              :disabled="'disabled' in item && item.disabled === true"
              @change="form_submit"
            />
            <template v-else-if="item.type === 'number_scope'">
              <el-input v-model="form[item.prop][item.min ? item.min : 'min']" :style="{width:'137px'}" :placeholder="`最小${item.label}`" :disabled="'disabled' in item && item.disabled === true" @change="form_submit" />
              <span class="middle-text" style="width: 7px">-</span>
              <el-input v-model="form[item.prop][item.max ? item.max : 'max']" :style="{width:'138px'}" :placeholder="`最大${item.label}`" :disabled="'disabled' in item && item.disabled === true" @change="form_submit" />
            </template>
            <slot v-else-if="item.type === 'slot'" :name="item.slot_name" :scope="item" />
          </el-form-item>
        </template>
        <slot name="form" />
        <el-form-item v-if="formSubmitBtn">
          <el-button type="primary" native-type="submit" @click="form_submit">查询</el-button>
          <el-button type="normal" style="float: right" @click="form_reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="show_button || (table_column_options.length > 0 && tableColumnStorageName !== '')" class="button-container">
      <el-popover
        v-if="table_column_options.length > 0 && tableColumnStorageName !== ''"
        class="table_column_checkbox"
        placement="right"
        width="500"
        trigger="click"
      >
        <el-checkbox-group v-model="table_column_checked" :style="{display:'flex','flex-wrap':'wrap'}">
          <el-checkbox v-for="item in table_column_options" :key="item.field" :label="item.title" :style="{'width':'120px'}" />
        </el-checkbox-group>
        <el-button slot="reference" type="primary" style="margin-right: 10px">显示列</el-button>
      </el-popover>
      <el-button v-if="batchDelBtn" v-permission="batchDelPermission" type="danger" @click="batch_del">批量删除</el-button>
      <slot name="button" />
    </div>
    <div class="table-container">
      <el-table
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
      >
        <template v-for="(item, index) in tableColumn">
          <template v-if="item.type">
            <el-table-column v-if="item.type==='expand'" :key="index" :type="item.type" :min-width="item.min_width ? item.min_width : '100px'">
              <template slot-scope="{ row, column, $index, store }">
                <slot name="table_expand" :scope="{ row, column, $index, store }" :row="row" />
                <!--要使用展开行插槽时，使用<template v-slot:table_expand="{row}">，即可使用行数据-->
              </template>
            </el-table-column>
            <el-table-column v-else :key="item.type" :type="item.type" :min-width="item.min_width ? item.min_width : '100px'" />
          </template>
          <template v-else>
            <el-table-column
              :key="index"
              :align="item.align ? item.align : 'left'"
              :label="item.title"
              :prop="item.field"
              :min-width="item.min_width ? (typeof item.min_width == 'number' ? item.min_width+'px' : item.min_width) : '100px'"
              :fixed="item.fixed ? item.fixed : false"
              :sortable="item.sort ? item.sort : false"
              :show-overflow-tooltip="'overflow' in item ? item.overflow : true"
            >
              <template slot-scope="{ row, column, $index, store }">
                <template v-if="item.template">
                  <el-select v-if="item.template==='status_select'" v-model="row[item.field]" @change="change_status(row[id_key], row[item.field], $index)">
                    <el-option v-for="(option, status) in status_options" :key="status" :value="status" :label="option" />
                  </el-select>
                  <span v-else-if="item.template==='status_str'" :style="{color:row[item.field] in status_color ? status_color[row[item.field]] : 'black'}">
                    {{ status_options[row[item.field]] }}
                  </span>
                  <el-image v-else-if="item.template==='img'" :src="combineUrl(row[item.field])" :preview-src-list="[combineUrl(row[item.field])]" class="icon" @click.stop="imageClickHandler" />
                  <el-input v-else-if="item.template==='input'" v-model="row[item.field]" @change="(new_value) => item.change(row[id_key], new_value)" />
                  <i v-else-if="item.template==='icon' && row[item.field]" :class="row[item.field]" />
                  <span v-else-if="item.template==='html'" v-html="row[item.field]" />
                  <span v-else-if="item.template === 'function'">{{ item.function(row) }}</span>
                  <template v-else-if="item.template === 'action'">
                    <slot name="other_tools" :scope="{ row, column, $index, store }" :row="row" />
                    <button-set
                      :button-data="item.action"
                      :scope="{ row, column, $index, store }"
                      :show-btn-num="item.hasOwnProperty('show_num') ? item.show_num : 2"
                      :min-width="item.min_width ? (typeof item.min_width == 'number' ? item.min_width : item.min_width.replace('px', '')) : 100"
                    />
                  </template>
                  <slot v-else-if="item.template === 'slot'" :name="item.slot_name" :scope="{ row, column, $index, store }" :row="row" />
                </template>
                <template v-else-if="item.field">
                  {{ row[item.field] }}
                </template>
              </template>
            </el-table-column>
          </template>
        </template>
        <slot name="table" />
      </el-table>
    </div>
    <div v-if="show_pagination" class="pager-container">
      <el-pagination
        :current-page="form.page"
        :page-sizes="pageSizes"
        :page-size="form.prePage"
        :total="totalCount"
        background
        layout="total, sizes, prev, pager, next, jumper"
        style="float: right"
        @size-change="handle_limit_change"
        @current-change="handle_page_change"
      />
    </div>
    <div class="dialog-container">
      <slot name="dialog" />
    </div>
  </div>
</template>

<script>
import { combineUrl, copyToClipboard } from '@/utils/common_function'
import MultiSelect from '@/components/MultiSelect'
import ButtonSet from '@/layout/components/ButtonSet'

export default {
  name: 'TableLayout',
  components: {
    MultiSelect,
    ButtonSet
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
        return [10, 20, 50, 100, 200]
      }
    },
    tableParams: {
      // 表格属性值，不传使用默认值
      type: Object,
      default: function() {
        return {}
      }
    },
    /* 传入筛选表单项，自动显示表单
     * label：表单项标签
     * prop：绑定form中的字段
     * disabled: true：设置禁用
     * type: 表单项类型
     *   input：输入框。额外参数：input_type：输入框类型，默认text，支持原生input类型及el-input类型
     *   select：下拉选择框。额外参数：options：下拉选项；option_value：下拉选项值，默认为id；option_label：下拉选项标签，默认为name
     *   date、daterange、datetime、datetimerange、month、monthrange、year：日期、日期时间、月份、年份选择框。
     *   time、timerange：时间选择框。
     *   multi_select：下拉多选框。额外参数：options：下拉选项；option_value：下拉选项值，默认为id；option_label：下拉选项标签，默认为name
     *   number_scope：数字范围输入框。额外参数：min：最小值对应的key，默认min；max：最大值对应的key，默认max；prop对应的数据必须是包含min和max的对象
     *   slot：自定义插槽，绑定了当前item，添加<template v-slot:slot_name="{item}">填写插槽内容
     */
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
    /* 传入表格列信息，自动显示数据
     * 设置最小宽度：min_width: 100
     * 设置单元格类型：type，selection：多选框；index：行索引；expand：展开按钮，需指定插槽内容
     * 单元格渲染特定模版，添加字段template，取值如下：
     *   显示状态文字：status_str，取值为父组件中的status_options数组
     *   状态下拉修改：status_select，会自动调用父组件中的change_status方法
     *   展示图片：img
     *   编辑框：input, 同时需要添加change字段，指明编辑触发的方法
     *   展示系统图标：icon
     *   渲染HTML：html
     *   对值进行处理：function，添加字段：function，指定对值进行处理的方法
     *   动态插槽：slot，添加字段：slot_name，指定插槽名称，然后添加<template v-slot:slot_name="{scope}">填写插槽内容
     * 单元格点击复制内容：event: "copy_text"
     */
    tableColumn: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 传了tableColumn参数后，该参数不为空时可开启“显示列”功能，传入tableColumn时需要加上.sync修饰符。
    // 如果有多选框，之类的没有标题的列，也需要把标题加上
    tableColumnStorageName: { type: String, default: '' },
    batchDelBtn: { type: Boolean, default: false }, // 是否启用批量删除
    batchDelPermission: { type: String, default: null } // 批量删除的权限管理
  },
  data() {
    return {
      table_column_options: this.tableColumn,
      show_list: [],
      summary_row: [],
      date_picker_placeholder: {
        date: '日期',
        datetime: '日期时间',
        month: '月份',
        year: '年份'
      },
      date_picker_format: {
        date: 'yyyy-MM-dd',
        datetime: 'yyyy-MM-dd HH:mm:ss',
        month: 'yyyy-MM',
        year: 'yyyy'
      }
    }
  },
  provide: function() {
    return {
      reload: this.reload
    }
  },
  inject: [
    'fetch_data',
    'change_status',
    'del',
    'batch_del',
    'open_dialog',
    'id_key',
    'status_key',
    'status_options',
    'status_color'
  ],
  computed: {
    show_form: function() {
      return (
        typeof this.$slots.form !== 'undefined' || this.formItem.length > 0
      )
    },
    show_button: function() {
      return typeof this.$slots.button !== 'undefined'
    },
    show_pagination: function() {
      return typeof this.form.prePage !== 'undefined' && this.form.prePage > 0
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
        return this.tableColumn.map(function(item) {
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
        this.$emit('update:tableColumn', filter_column)
      }
    },
    copy_columns: function() {
      return this.tableColumn.map(function(item) {
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
    }
  },
  mounted() {
    let history = null
    if (this.storage_key) {
      history = localStorage.getItem(this.storage_key)
    }
    if (history !== null) {
      this.table_column_checked = JSON.parse(history)
    }
    setTimeout(this.reload, 100)
  },
  methods: {
    handle_limit_change(val) {
      this.form.prePage = val
      this.paginationType === 'server'
        ? this.reload()
        : this.local_pagination()
    },
    handle_page_change(val) {
      this.form.page = val
      this.paginationType === 'server'
        ? this.reload()
        : this.local_pagination()
    },
    local_pagination() {
      let offset = (this.form.page - 1) * this.form.prePage
      if (this.firstRowSummary) {
        offset += 1
      }
      this.show_list = this.list.slice(offset, offset + this.form.prePage)
      if (this.firstRowSummary) {
        this.show_list.unshift(this.summary_row)
      }
    },
    reload() {
      this.fetch_data()
    },
    form_submit() {
      this.form.page = 1
      this.reload()
    },
    form_reset() {
      this.$refs.form.resetFields()
      this.form.page = 1
      this.reload()
    },
    combineUrl,
    copyToClipboard,
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
    cell_class({ column }) {
      const classes = []
      if (typeof column.property !== 'undefined' && this.copy_columns.includes(column.property)) {
        classes.push('copy-text')
      }
      return classes
    },
    imageClickHandler() {
      this.$nextTick(() => {
        const domImageMask = document.querySelector('.el-image-viewer__mask') // 获取遮罩层dom
        if (!domImageMask) {
          return
        }
        domImageMask.addEventListener('click', () => {
          // 点击遮罩层时调用关闭按钮的 click 事件
          document.querySelector('.el-image-viewer__close').click()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container,
.button-container,
.table-container,
.pager-container {
  margin-top: 10px;
}

.button-container {
  min-height: 40px;
}

.form-container::v-deep {
  form {
    display: flex;
    flex-wrap: wrap;
  }

  .el-input,
  .el-select {
    width: 300px;
  }

  .el-date-editor--daterange,
  .el-date-editor--datetimerange,
  .el-date-editor--monthrange {
    width: 300px;
  }

  .el-divider {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}

.table-container::v-deep {
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
