<template>
  <el-select
    ref="select"
    :value="show_value"
    :multiple="true"
    :filterable="filterable"
    :collapse-tags="collapse_tags"
    :multiple-limit="limit"
    :placeholder="placeholder"
    :popper-append-to-body="false"
    :disabled="disabled"
    :clearable="clearable"
    @change="handle_change"
  >
    <el-option v-if="options.length > 0" key="select_all" label="全选" value="select_all" />
    <el-option v-for="item in options" :key="item[optionValue]" :label="item[optionLabel]" :value="item[optionValue]" />
  </el-select>
</template>

<script>
export default {
  name: 'MultiSelect',
  props: {
    options: {
      type: Array, default: function() {
        return []
      }, required: true
    },
    optionLabel: { type: String, default: 'name' },
    optionValue: { type: String, default: 'id' },
    limit: { type: Number, default: 0 },
    value: { // 在传值时，必须加上.sync事件，才能同步已选
      type: Array, default: function() {
        return []
      }
    },
    filterable: { type: Boolean, default: false },
    collapseTags: { type: Boolean, default: false },
    placeholder: { type: String, default: '请选择' },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false }
  },
  data() {
    return {
      all: false, // 全选标记
      collapse_tags: this.collapseTags
    }
  },
  computed: {
    multi_value: {
      // 实际已选值（不包含全选选项）
      get: function() {
        return this.value ? this.value : []
      },
      set: function(new_value) {
        this.$emit('update:value', new_value)
      }
    },
    all_options_value: {
      get: function() {
        return this.options.map(item => {
          return item[this.optionValue]
        })
      }
    },
    show_value: {
      // 用于显示的已选值（包含全选选项）
      get: function() {
        const value_arr = JSON.parse(JSON.stringify(this.multi_value))
        if (value_arr.length > 0) {
          if (this.all === true) {
            value_arr.unshift('select_all')
          } else {
            if (value_arr.includes('select_all')) {
              value_arr.splice(value_arr.indexOf('select_all'), 1)
            }
          }
        }
        return value_arr
      }
    }
  },
  watch: {
    all_options_value: function(new_value) {
      this.all = this.all_options_value.length > 0 && this.multi_value.length === new_value.length
    },
    all: function(new_value) {
      // 根据是否全选，修改选择框高度和下拉框位置
      if (new_value === true) {
        if (this.collapseTags === false) { // 如果设置了不用数字表示多选值
          this.collapse_tags = true // 强制使用数字表示多选值，然后隐藏掉数字
          this.$nextTick(() => {
            const $select = this.$refs.select.$el.getElementsByClassName('el-tag')[1]
            $select.style.display = 'none' // 隐藏掉多选数字
            const $input = this.$refs.select.$el.getElementsByClassName('el-input__inner')[0]
            const height = parseInt($input.style.height.replace('px', '')) - 40 // 计算出下拉框需要减少的高度
            $input.style.height = '40px' // 选择框强制设为40高度
            const $dropdown = this.$refs.select.$el.getElementsByClassName('el-select-dropdown')[0]
            $dropdown.style.top = (parseInt($dropdown.style.top.replace('px', '')) - height) + 'px' // 修改下拉框高度位置
          })
        }
      } else { // 不是全选时，使用回设置的值
        this.collapse_tags = this.collapseTags
      }
    },
    value: function(new_value) { // 当父组件修改了value时，修改all
      this.all = this.all_options_value.length > 0 && this.all_options_value.length === new_value.length
    }
  },
  mounted: function() {
    this.all = this.all_options_value.length > 0 && this.multi_value.length === this.all_options_value.length
  },
  methods: {
    handle_change(new_value) {
      if (this.all) {
        if (new_value.length === this.all_options_value.length && new_value.includes('select_all')) {
          // 全选时，取消非全选的选项
          new_value.splice(new_value.indexOf('select_all'), 1)
          this.multi_value = new_value
        } else if (!new_value.includes('select_all') && this.all_options_value.length === new_value.length) {
          // 全选时，取消全选
          this.multi_value = []
        } else {
          this.multi_value = new_value
        }
        this.all = false
      } else {
        if (new_value.includes('select_all')) {
          // 非全选时，点击了全选
          if (this.limit > 0 && this.all_options_value.length > this.limit) {
            // 全选的选项比限制多选数量大
            this.$message({
              showClose: true,
              type: 'error',
              message: `最多选择${this.limit}个选项`,
              duration: 2000
            })
            return false
          }
          this.multi_value = this.all_options_value
          this.all = true
        } else if (this.all_options_value.length === new_value.length) {
          // 非全选时，把所有选项都选完
          this.multi_value = new_value
          this.all = true
        } else {
          // 非全选时，正常增加选项
          this.multi_value = new_value
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
