<template>
  <el-table-column
    v-if="item.getAttr('type') === 'expand'"
    :key="`${item.type}${index}`"
    :type="item.type"
    :min-width="item.getAttr('min_width', '100px')"
  >
    <template slot-scope="{ row, column, $index, store }">
      <slot
        name="table_expand"
        :scope="{ row, column, $index, store }"
        :row="row"
      />
      <!--要使用展开行插槽时，使用<template v-slot:table_expand="{row}">，即可使用行数据-->
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="item.hasKey('type') && item.type !== 'expand'"
    :key="`${item.type}${index}`"
    :type="item.type"
    :min-width="item.getAttr('min_width', '100px')"
  />
  <el-table-column
    v-else
    :key="`${item.field}${index}`"
    :align="item.getAttr('align', 'left')"
    :label="item.title"
    :prop="item.field"
    :min-width="item.min_width ? getWidth(item.min_width) : '100px'"
    :fixed="item.getAttr('fixed', false)"
    :sortable="item.getAttr('sort', false)"
    :show-overflow-tooltip="item.getAttr('overflow', true)"
    :filters="item.getAttr('filters', null)"
    :filter-method="item.getAttr('filter_method', null)"
    :class-name="item.getAttr('class_name', null)"
  >
    <template slot="header" slot-scope="{ row, column, $index, store }">
      <template v-if="item.hasKey('header')">
        <slot
          :name="item.header"
          :scope="{ row, column, $index, store }"
          :row="row"
        />
      </template>
      <span v-else>{{ item.title }}</span>
    </template>
    <template slot-scope="{ row, column, $index, store }">
      <template v-if="item.template">
        <el-select
          v-if="item.template === 'select'"
          v-model="row[item.field]"
          @change="(new_value) => item.change(row, new_value)"
        >
          <el-option
            v-for="option in item.options"
            :key="option[item.getAttr('option_value', 'id')]"
            :label="option[item.getAttr('option_label', 'name')]"
            :value="option[item.getAttr('option_value', 'id')]"
          />
        </el-select>
        <span
          v-else-if="item.template === 'str_map'"
          :style="{
            color: item.hasKey('color')
              ? item.color.getAttr(row[item.field], '#666')
              : '#666',
          }"
        >
          {{ item.hasKey("str_map") ? item.str_map.getAttr(row[item.field], "") : "" }}
        </span>
        <el-image
          v-else-if="item.template === 'img'"
          :src="combineUrl(row[item.field])"
          :preview-src-list="[combineUrl(row[item.field])]"
          class="icon"
          @click.stop="imageClickHandler"
        />
        <el-input
          v-else-if="item.template === 'input'"
          v-model="row[item.field]"
          @change="(new_value) => item.change(row, new_value)"
        />
        <i
          v-else-if="item.template === 'icon' && row[item.field]"
          :class="row[item.field]"
        />
        <span v-else-if="item.template === 'html'" v-html="row[item.field]" />
        <span v-else-if="item.template === 'function'">
          {{ item.function(row) }}
        </span>
        <template v-else-if="item.template === 'action'">
          <button-set
            :button-data="item.action"
            :scope="{ row, column, $index, store }"
            :show-btn-num="item.getAttr('show_num', 2)"
          >
            <template v-slot>
              <slot
                name="other_tools"
                :scope="{ row, column, $index, store }"
                :row="row"
              />
            </template>
          </button-set>
        </template>
        <slot
          v-else-if="item.template === 'slot'"
          :name="item.slot_name"
          :scope="{ row, column, $index, store }"
          :row="row"
        />
      </template>
      <template v-else-if="item.field">
        {{ row[item.field] }}{{ row[item.field] ? item.getAttr("unit", "") : "" }}
      </template>
    </template>
  </el-table-column>
</template>

<script>
import { combineUrl, getWidth } from "@/utils/common_function";
import ButtonSet from "@/layout/components/ButtonSet";

export default {
  name: "TableColumnLayout",
  components: { ButtonSet },
  props: {
    item: {
      type: Object,
      default: function () {
        return {};
      },
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    combineUrl,
    getWidth,
    imageClickHandler() {
      this.$nextTick(() => {
        const domImageMask = document.querySelector(".el-image-viewer__mask"); // 获取遮罩层dom
        if (!domImageMask) {
          return;
        }
        domImageMask.addEventListener("click", () => {
          // 点击遮罩层时调用关闭按钮的 click 事件
          document.querySelector(".el-image-viewer__close").click();
        });
      });
    },
  },
};
</script>

<style scoped></style>
