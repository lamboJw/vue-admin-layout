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
      v-if="!item.type || item.type === 'input'"
      v-model="form[item.prop]"
      :placeholder="`${item.label}`"
      :type="item.getAttr('input_type', 'text')"
      clearable
      suffix-icon="el-icon-search"
      :disabled="item.isTrue('disabled')"
      :style="{ width: item_width(item) }"
      @change="form_change_submit"
    />
    <el-select
      v-else-if="item.type === 'select'"
      v-model="form[item.prop]"
      :placeholder="`${item.label}`"
      clearable
      filterable
      :disabled="item.isTrue('disabled')"
      :style="{ width: item_width(item) }"
      @change="form_change_submit"
    >
      <el-option
        v-for="option in item.options"
        :key="option[item.getAttr('option_value', 'id')]"
        :label="option[item.getAttr('option_label', 'name')]"
        :value="option[item.getAttr('option_value', 'id')]"
      />
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
      :placeholder="`请选择${item.label}`"
      range-separator="至"
      :start-placeholder="`${item.label}开始`"
      :end-placeholder="`${item.label}结束`"
      :value-format="date_picker_format[item.type.replace('range', '')]"
      :format="date_picker_format[item.type.replace('range', '')]"
      :disabled="item.isTrue('disabled')"
      :style="{ width: item_width(item) }"
      @change="form_change_submit"
    />
    <el-time-select
      v-else-if="item.type === 'time'"
      v-model="form[item.prop]"
      :placeholder="'选择' + item.label"
      :disabled="item.isTrue('disabled')"
      :style="{ width: item_width(item) }"
      @change="form_change_submit"
    />
    <el-time-picker
      v-else-if="item.type === 'timerange'"
      v-model="form[item.prop]"
      is-range
      placeholder="选择时间范围"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      value-format="yyyy-MM-dd HH:mm:ss"
      :disabled="item.isTrue('disabled')"
      :style="{ width: item_width(item) }"
      @change="form_change_submit"
    />
    <multi-select-new
      v-else-if="item.type === 'multi_select'"
      :value.sync="form[item.prop]"
      :options="item.options"
      :option-value="item.getAttr('option_value', 'id')"
      :option-label="item.getAttr('option_label', 'name')"
      :limit="item.getAttr('limit', 0)"
      collapse-tags
      :placeholder="`${item.label}`"
      clearable
      filterable
      :disabled="item.isTrue('disabled')"
      :style="{ width: item_width(item) }"
      @visible-change="
        (show) => {
          if (!show) {
            form_change_submit();
          }
        }
      "
      @remove-tag="form_change_submit"
      @clear="form_change_submit"
    />
    <template v-else-if="item.type === 'number_scope'">
      <el-input
        v-model="form[item.prop][item.getAttr('min', 'min')]"
        :style="{ width: number_scope_width(item) }"
        :placeholder="`最小${item.label}`"
        :disabled="item.isTrue('disabled')"
        @change="form_change_submit"
      />
      <span class="middle-text" style="width: 7px">-</span>
      <el-input
        v-model="form[item.prop][item.getAttr('max', 'max')]"
        :style="{ width: number_scope_width(item) }"
        :placeholder="`最大${item.label}`"
        :disabled="item.isTrue('disabled')"
        @change="form_change_submit"
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
  inject: ['form_submit', 'submitOnChange', 'itemWidth', 'showLabel'],
  methods: {
    form_change_submit() {
      if (this.submitOnChange) {
        this.form_submit()
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
      return item.hasKey('show_label') && item.show_label
        ? getWidth(item.getAttr('label_width', 100))
        : '0'
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
