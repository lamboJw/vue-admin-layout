<template>
  <el-select
    ref="multiSelect"
    v-model="multi_value"
    :multiple="true"
    :filterable="filterable"
    :collapse-tags="collapseTags"
    :multiple-limit="limit"
    :placeholder="placeholder"
    :popper-append-to-body="false"
    :disabled="disabled"
    :clearable="clearable"
    :filter-method="filterSearch"
    :reserve-keyword="reserveKeyword"
    @change="handle_change"
    @focus="handle_blur"
    @visible-change="(is_show) => $emit('visible-change', is_show)"
    @remove-tag="(tag) => $emit('remove-tag', tag)"
    @clear="$emit('clear')"
    @blur="(event) => $emit('blur', event)"
  >
    <div v-if="options.length > 0" class="tools-bar">
      <el-button
        type="text"
        class="button"
        @mousedown="(e) => e.preventDefault()"
        @click="selectAll"
      >
        全选
      </el-button>
      <el-button
        type="text"
        class="button"
        @mousedown="(e) => e.preventDefault()"
        @click="selectInverse"
      >
        反选
      </el-button>
    </div>
    <el-option
      v-for="item in allOptions"
      :key="item[optionValue]"
      :label="item[optionLabel]"
      :value="item[optionValue]"
    />
  </el-select>
</template>

<script>
export default {
  name: 'MultiSelectNew',
  props: {
    options: {
      type: Array,
      default: function() {
        return []
      },
      required: true
    },
    optionLabel: { type: String, default: 'name' },
    optionValue: { type: String, default: 'id' },
    limit: { type: Number, default: 0 },
    value: {
      // 在传值时，必须加上.sync事件，才能同步已选
      type: Array,
      default: function() {
        return []
      }
    },
    filterable: { type: Boolean, default: false },
    collapseTags: { type: Boolean, default: false },
    placeholder: { type: String, default: '请选择' },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    reserveKeyword: { type: Boolean, default: false }
  },
  data() {
    return {
      allOptions: [],
      sourceOptions: []
    }
  },
  computed: {
    multi_value: {
      get: function() {
        return this.value ? this.value : []
      },
      set: function(new_value) {
        this.$emit('update:value', new_value)
      }
    },
    all_options_value: {
      get: function() {
        return this.options.map((item) => {
          return item[this.optionValue]
        })
      }
    }
  },
  watch: {
    options: function(new_value) {
      this.allOptions = new_value
      this.sourceOptions = new_value
      if (new_value.length === 0) {
        this.multi_value = []
      } else {
        const cur_values = new Set(this.multi_value)
        const new_values = new Set(
          new_value.map((item) => {
            return item[this.optionValue]
          })
        )
        this.multi_value = Array.from(
          new Set([...cur_values].filter((x) => new_values.has(x)))
        )
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      setTimeout(() => {
        this.allOptions = this.options
        this.sourceOptions = this.options
      }, 300)
    },
    handle_change(new_value) {
      this.$emit('change', new_value)
    },
    handle_blur(event) {
      this.$refs['multiSelect'].$refs.input.blur = () => {
        this.allOptions = JSON.parse(JSON.stringify(this.sourceOptions))
        this.$emit('blur', this.multi_value)
      }
      this.$emit('focus', event)
    },
    selectAll() {
      const arr = []
      this.allOptions.map((item) => {
        arr.push(item[this.optionValue])
      })
      this.multi_value = arr
    },
    selectInverse() {
      const arr = []
      this.allOptions.map((item) => {
        arr.push(item[this.optionValue])
      })
      for (let j = 0; j < this.multi_value.length; j++) {
        for (let i = 0; i < arr.length; i++) {
          if (this.multi_value[j] === arr[i]) {
            arr.splice(i, 1)
            break
          }
        }
      }
      this.multi_value = arr
    },
    filterSearch(value) {
      if (value) {
        this.allOptions = this.sourceOptions.filter((item) => {
          return item[this.optionLabel].toLowerCase().indexOf(value.toLowerCase()) >= 0
        })
      } else {
        this.allOptions = JSON.parse(JSON.stringify(this.sourceOptions))
      }
    }
  }
}
</script>

<style scoped>
.tools-bar {
  display: flex;
  padding: 0 12px 5px;
}
.tools-bar .button {
  font-size: 14px;
}
</style>
