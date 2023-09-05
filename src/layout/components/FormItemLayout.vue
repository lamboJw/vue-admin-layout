<template>
  <el-form-item
    v-show="!item.hasKey('show') || item.show === true"
    :key="item.prop"
    :prop="item.prop"
    :required="item.isTrue('required')"
    :label="
      item.isTrue('show_label') || (!item.hasKey('show_label') && showLabel)
        ? item.label
        : ''
    "
    :label-width="label_width(item)"
  >
    <el-input
      v-if="item.getAttr('type', 'input') === 'input'"
      v-model="form[item.prop]"
      :placeholder="placeholder(item)"
      :type="item.getAttr('input_type', 'text')"
      clearable
      :suffix-icon="item.getAttr('suffix', true) ? 'el-icon-search' : ''"
      :disabled="item.isTrue('disabled')"
      :style="{ width: item_width(item) }"
      @change="(val) => {form_change_submit(item,val)}"
    />
    <el-select
      v-else-if="item.type === 'select'"
      v-model="form[item.prop]"
      :placeholder="placeholder(item)"
      clearable
      filterable
      :disabled="item.isTrue('disabled')"
      :style="{ width: item_width(item) }"
      :remote="item.getAttr('remote', false)"
      :remote-method="item.getAttr('remote_method')"
      :loading="item.getAttr('loading', false)"
      @change="(val) => {form_change_submit(item,val)}"
    >
      <el-option
        v-for="option in item.options"
        :key="option[item.getAttr('option_value', 'id')]"
        :label="option[item.getAttr('option_label', 'name')]"
        :value="option[item.getAttr('option_value', 'id')]"
      >
        <div v-if="option.slot" v-html="option.slot" />
      </el-option>
    </el-select>
    <el-date-picker
      v-else-if="
        [
          'date',
          'daterange',
          'datetime',
          'datetimerange',
          'month',
          'monthrange',
          'year',
          'yearrange',
        ].includes(item.type)
      "
      v-model="form[item.prop]"
      :type="item.type"
      :placeholder="placeholder(item)"
      range-separator="至"
      :start-placeholder="`${item.label}开始`"
      :end-placeholder="`${item.label}结束`"
      :value-format="date_picker_format[item.type.replace('range', '')]"
      :format="date_picker_format[item.type.replace('range', '')]"
      :disabled="item.isTrue('disabled')"
      :style="{ width: item_width(item) }"
      @change="(val) => {form_change_submit(item,val)}"
    />
    <el-time-select
      v-else-if="item.type === 'time'"
      v-model="form[item.prop]"
      :placeholder="placeholder(item)"
      :disabled="item.isTrue('disabled')"
      :style="{ width: item_width(item) }"
      @change="(val) => {form_change_submit(item,val)}"
    />
    <el-time-picker
      v-else-if="item.type === 'timerange'"
      v-model="form[item.prop]"
      is-range
      :placeholder="item.getAttr('placeholder', `请选择${item.label}`)"
      range-separator="至"
      :start-placeholder="`${item.label}开始`"
      :end-placeholder="`${item.label}结束`"
      :disabled="item.isTrue('disabled')"
      :style="{ width: item_width(item) }"
      @change="(val) => {form_change_submit(item,val)}"
    />
    <multi-select-new
      v-else-if="item.type === 'multi_select'"
      :value.sync="form[item.prop]"
      :options="item.options"
      :option-value="item.getAttr('option_value', 'id')"
      :option-label="item.getAttr('option_label', 'name')"
      :limit="item.getAttr('limit', 0)"
      collapse-tags
      :placeholder="placeholder(item)"
      clearable
      filterable
      :disabled="item.isTrue('disabled')"
      :style="{ width: item_width(item) }"
      @visible-change="
        (show) => {
          if (!show) {
            form_change_submit(item);
          }
        }
      "
      @remove-tag="form_change_submit(item)"
      @clear="form_change_submit(item)"
    />
    <template v-else-if="item.type === 'number_scope'">
      <el-input
        v-model="form[item.prop][item.getAttr('min', 'min')]"
        :style="{ width: number_scope_width(item) }"
        :placeholder="`最小${item.label}`"
        :disabled="item.isTrue('disabled')"
        @change="(val) => {form_change_submit(item,val)}"
      />
      <span class="middle-text" style="width: 7px">-</span>
      <el-input
        v-model="form[item.prop][item.getAttr('max', 'max')]"
        :style="{ width: number_scope_width(item) }"
        :placeholder="`最大${item.label}`"
        :disabled="item.isTrue('disabled')"
        @change="(val) => {form_change_submit(item,val)}"
      />
    </template>
    <template v-else-if="item.type === 'text'">
      <span class="middle-text form-text" :style="{ width: item_width(item) }">
        {{ form[item.prop] }}
      </span>
    </template>
    <template v-else-if="item.type === 'radio'">
      <el-radio-group
        v-model="form[item.prop]"
        :style="{ width: item_width(item) }"
        :disabled="item.isTrue('disabled')"
      >
        <el-radio
          v-for="option in item.options"
          :key="option[item.getAttr('option_value', 'id')]"
          :label="option[item.getAttr('option_value', 'id')]"
          :disabled="is_true(option, 'disabled')"
        >
          {{ option[item.getAttr("option_label", "name")] }}
        </el-radio>
      </el-radio-group>
    </template>
    <slot
      v-else-if="item.type === 'slot'"
      :name="item.slot_name"
      :scope="item"
    />
  </el-form-item>
</template>

<script>
import MultiSelectNew from '@/components/MultiSelectNew'
import { getWidth } from '@/utils/common_function'
import { MyObject } from '@/utils/myObject'

export default {
  name: 'FormItemLayout',
  components: {
    MultiSelectNew
  },
  props: {
    item: {
      type: MyObject,
      default: function() {
        return {}
      }
    },
    form: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      date_picker_format: {
        date: 'yyyy-MM-dd',
        datetime: 'yyyy-MM-dd HH:mm:ss',
        month: 'yyyy-MM',
        year: 'yyyy'
      }
    }
  },
  inject: ['form_submit', 'submitOnChange', 'itemWidth', 'showLabel', 'labelWidth'],
  methods: {
    test() {
      console.log(arguments)
    },
    form_change_submit(item, val) {
      if (this.submitOnChange) {
        this.form_submit()
      } else if (item.hasKey('change') && typeof item.change === 'function') {
        item.change(val)
      }
    },
    item_width(item) {
      const total_width = item.hasKey('width')
        ? item.width
        : this.itemWidth > 0
          ? this.itemWidth
          : 300
      return total_width + 'px'
    },
    number_scope_width(item) {
      const total_width = item.hasKey('width')
        ? item.width
        : this.itemWidth
          ? this.itemWidth
          : 300
      const input_width = total_width / 2 - 12.5
      return input_width + 'px'
    },
    is_true(item, key) {
      return item.hasKey(item) && item[key]
    },
    label_width(item) {
      if (item.hasKey('show_label') && !item.show_label) return '0'
      return this.showLabel || item.isTrue('show_label')
        ? item.hasKey('label_width')
          ? getWidth(item.getAttr('label_width', 100))
          : item.labelWidth
        : '0'
    },
    placeholder(item) {
      if (item.hasKey('placeholder')) {
        return item.placeholder
      }
      if (item.getAttr('show_label', this.showLabel)) {
        const type = item.getAttr('type', 'input')
        if (['multi_select', 'select', 'time', 'date', 'datetime', 'month', 'year'].includes(type)) {
          return `请选择${item.label}`
        } else if (type === 'input') {
          return `请填写${item.label}`
        }
      } else {
        return item.label
      }
    }
  }
}
</script>

<style scoped>
.middle-text {
  padding-left: 0;
  padding-right: 0;
}
</style>
