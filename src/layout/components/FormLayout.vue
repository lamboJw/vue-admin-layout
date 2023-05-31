<template>
  <el-form
    ref="show_form"
    :model="form"
    :inline="inline"
    :class="inline ? 'inline-form' : ''"
    :label-width="`${labelWidth}px`"
    :rules="rules"
    @submit.native.prevent
  >
    <template v-for="(item, index) in form_item.show_item">
      <form-item-layout :key="index" :item="new MyObject(item)" :form="form">
        <template v-if="item.type === 'slot'" v-slot:[item.slot_name]="scope">
          <slot :name="item.slot_name" v-bind="scope" />
        </template>
      </form-item-layout>
    </template>
    <slot name="form" />
    <el-form-item>
      <el-popover
        v-if="this.form_item.hide_item.length > 0 || this.show_num_storage_name !== ''"
        placement="bottom"
        :width="popover_width"
        trigger="click"
      >
        <el-button slot="reference" type="normal">高级筛选</el-button>
        <el-form
          v-if="form_item.hide_item.length > 0"
          ref="hide_form"
          :model="form"
          :inline="inline"
          :class="inline ? 'inline-form' : ''"
          :label-width="`${labelWidth}px`"
          :rules="rules"
          @submit.native.prevent
        >
          <template v-for="(item, index) in form_item.hide_item">
            <form-item-layout :key="index" :item="new MyObject(item)" :form="form">
              <template v-if="item.type === 'slot'" v-slot:[item.slot_name]="scope">
                <slot :name="item.slot_name" v-bind="scope" />
              </template>
            </form-item-layout>
          </template>
        </el-form>
        <el-form v-if="show_num_storage_name !== ''">
          <el-row>
            <el-form-item>
              <el-input v-model="show_num" :style="{width: `${item_max_width}px`}" @change="change_show_num">
                <template slot="prepend">直接显示</template>
                <template slot="append">个条件</template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-tag type="info" :style="{width: `${item_max_width}px`}" class="tag">提示：筛选条件会根据使用频率自动排序</el-tag>
            </el-form-item>
          </el-row>
        </el-form>

      </el-popover>
    </el-form-item>
    <el-form-item v-if="formSubmitBtn">
      <el-button type="primary" native-type="submit" @click="form_submit">查询</el-button>
      <el-button type="normal" style="float: right" @click="form_reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import FormItemLayout from '@/layout/components/FormItemLayout'
import { MyObject } from '@/utils/myObject'

export default {
  name: 'FormLayout',
  components: {
    FormItemLayout
  },
  props: {
    form: {
      // 筛选信息
      type: Object,
      default: function() {
        return { prePage: 15, page: 1 }
      },
      required: true
    },
    /* 传入筛选表单项，自动显示表单
     * label：表单项标签
     * prop：绑定form中的字段
     * required：true：设置必填
     * disabled：true：设置禁用
     * show_label：true: 显示标签，默认不显示
     * label_width：标签宽度，默认100px
     * show：是否显示该项
     * width: 筛选框宽度，默认300px
     * slot_name：当type等于slot时，需要制定插槽名
     * type: 表单项类型
     *   input：输入框。额外参数：input_type：输入框类型，默认text，支持原生input类型及el-input类型
     *   select：下拉选择框。额外参数：options：下拉选项；option_value：下拉选项值，默认为id；option_label：下拉选项标签，默认为name
     *   date、daterange、datetime、datetimerange、month、monthrange、year：日期、日期时间、月份、年份选择框。
     *   time、timerange：时间选择框。
     *   multi_select：下拉多选框。额外参数：options：下拉选项；option_value：下拉选项值，默认为id；option_label：下拉选项标签，默认为name
     *   number_scope：数字范围输入框。额外参数：min：最小值对应的key，默认min；max：最大值对应的key，默认max；prop对应的数据必须是包含min和max的对象
     *   slot：自定义插槽，绑定了当前item，添加<template v-slot:slot_name="{item}">填写插槽内容
     *   text：显示文字
     *   radio：单选框。额外参数：options：可选项；option_value：选项值，默认为id；label：选项标签，默认为name；options中的选项可增加disabled，控制是否可选。
     */
    formItem: {
      // 表单项
      type: Array,
      required: true,
      default: function() {
        return []
      }
    },
    formSubmitBtn: { type: Boolean, default: true }, // 是否显示筛选表单中的查询按钮
    submitOnChange: { type: Boolean, default: true }, // 改变表单时自动提交
    inline: { type: Boolean, default: true }, // 表单是否横向排列
    showLabel: { type: Boolean, default: false }, // 总体是否显示标签
    labelWidth: { type: Number, default: 100 }, // 总体标签宽度
    itemWidth: { type: Number, default: 300 },
    showItemNum: { type: Number, default: 9 },
    itemStorageName: { type: String, default: '' },
    itemSortStartTimes: { type: Number, default: 10 },
    rules: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  inject: ['reload'],
  provide: function() {
    return {
      form_submit: this.form_submit,
      submitOnChange: this.submitOnChange,
      itemWidth: this.itemWidth,
      showLabel: this.showLabel
    }
  },
  data() {
    return {
      show_num: this.showItemNum
    }
  },
  computed: {
    form_item: function() {
      let sorted_item = []
      const other_item = []
      let sort = new MyObject()
      if (this.storage_name !== '') {
        const storage = localStorage.getItem(this.storage_name)
        if (typeof storage !== 'undefined' && storage !== null) {
          sort = new MyObject(JSON.parse(storage))
        }
      }
      this.formItem.forEach((item) => {
        if (
          sort.hasKey(item.prop) &&
          sort[item.prop] > this.itemSortStartTimes
        ) {
          item.sort = sort[item.prop]
          sorted_item.push(new MyObject(item))
        } else {
          other_item.push(new MyObject(item))
        }
      })
      sorted_item = sorted_item.sort(this.compare_sort)
      const show_item = []
      const hide_item = []
      sorted_item.forEach((item) => {
        if (this.show_num === -1 || show_item.length < this.show_num) {
          show_item.push(item)
        } else {
          hide_item.push(item)
        }
      })
      other_item.forEach((item) => {
        if (this.show_num === -1 || show_item.length < this.show_num) {
          show_item.push(item)
        } else {
          hide_item.push(item)
        }
      })
      return { show_item, hide_item }
    },
    item_max_width: function() {
      let max_width = 0
      if (this.form_item.hide_item.length === 0) {
        max_width = (this.showLabel ? this.labelWidth : 0) + this.itemWidth
      } else {
        this.form_item.hide_item.forEach((item) => {
          const width =
            (item.show_label
              ? parseInt(item.label_width.replace('px', ''))
              : this.showLabel
                ? this.labelWidth
                : 0) +
            (item.hasKey('width')
              ? parseInt(item.width.replace('px', ''))
              : this.itemWidth)
          if (width > max_width) {
            max_width = width
          }
        })
      }
      return max_width
    },
    popover_width: function() {
      return this.form_item.hide_item.length > 1
        ? this.item_max_width * 2 + 20
        : this.item_max_width
    },
    storage_name: function() {
      if (!this.itemStorageName) {
        return ''
      }
      return `showFormItem:${this.itemStorageName}`
    },
    show_num_storage_name: function() {
      if (!this.itemStorageName) {
        return ''
      }
      return `showFormItemNum:${this.itemStorageName}`
    },
    all_prop: function() {
      return this.formItem.map((item) => {
        return item.prop
      })
    }
  },
  created() {
    if (this.show_num_storage_name) {
      const num = localStorage.getItem(this.show_num_storage_name)
      if (typeof num !== 'undefined' && num !== null) {
        this.show_num = parseInt(num)
      }
    }
  },
  methods: {
    MyObject,
    form_submit() {
      if (this.storage_name !== '') {
        let sort = new MyObject()
        const storage = localStorage.getItem(this.storage_name)
        if (typeof storage !== 'undefined' && storage !== null) {
          sort = new MyObject(JSON.parse(storage))
        }
        this.all_prop.forEach((key) => {
          const val = this.form[key]
          let add_num = 0
          if (typeof val !== 'object' && val) {
            add_num = 1
          } else if (
            typeof val === 'object' &&
            val !== null &&
            val.length > 0
          ) {
            add_num = 1
          }
          if (sort.hasKey(key)) {
            sort[key] += add_num
          } else {
            sort[key] = add_num
          }
        })
        localStorage.setItem(this.storage_name, JSON.stringify(sort))
      }
      this.form.page = 1
      this.reload()
    },
    reset_fields() {
      this.$refs.show_form.resetFields()
      if (typeof this.$refs.hide_form !== 'undefined') {
        this.$refs.hide_form.resetFields()
      }
    },
    form_reset() {
      this.reset_fields()
      this.form.page = 1
      this.reload()
    },
    compare_sort(obj1, obj2) {
      if (obj1.sort < obj2.sort) {
        return 1
      } else if (obj1.sort > obj2.sort) {
        return -1
      } else {
        return 0
      }
    },
    change_show_num(val) {
      if (this.show_num_storage_name) {
        localStorage.setItem(this.show_num_storage_name, val)
      }
    },
    validate(callback) {
      this.$refs.show_form.validate((valid) => {
        if (valid && this.form_item.hide_item.length > 0) {
          this.$refs.hide_form.validate((valid) => {
            callback(valid)
          })
        } else {
          console.log(valid)
          callback(valid)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form::v-deep {
  .el-input,
  .el-select,
  .middle-text,
  .el-date-editor--daterange,
  .el-date-editor--datetimerange,
  .el-date-editor--monthrange {
    width: 100%;
  }
}

.inline-form::v-deep {
  display: flex;
  flex-wrap: wrap;
}

.form-text.middle-text {
  padding-left: 0;
  padding-right: 0;
}

.el-divider {
  margin-top: 20px;
  margin-bottom: 20px;
}

.tag {
  line-height: 32px;
  height: 32px;
  font-size: 14px;
}
</style>
