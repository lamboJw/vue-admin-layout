<template>
  <dialog-layout :visible.sync="visible" :title="dialog_title" :loading="loading">
    <div class="form-container">
      <form-layout
        ref="dialog_form"
        :show-item-num="-1"
        :form="info"
        :show-label="true"
        :submit-on-change="false"
        :form-item="form_item"
        :label-width="100"
        :item-width="300"
        :inline="false"
        :form-submit-btn="false"
        :rules="rules"
      />
    </div>
  </dialog-layout>
</template>

<script>
import { info, save } from '@/api/permission'
import { dialog_common } from '@/layout/mixin/dialog_common'
import FormLayout from '@/layout/components/FormLayout'

export default {
  name: 'Edit',
  components: {
    FormLayout
  },
  mixins: [dialog_common],
  data() {
    return {
      info: {
        name: '',
        path: '',
        icon: '',
        tag: '',
        parent_id: 0,
        sort: 0
      },
      form_item: [
        { label: '名称', prop: 'name', suffix: false },
        { label: '路径', prop: 'path', suffix: false },
        { label: '权限', prop: 'tag', suffix: false },
        { label: '图标', prop: 'icon', suffix: false },
        { label: '上级id', prop: 'parent_id', suffix: false },
        { label: '排序', prop: 'sort', input_type: 'number', suffix: false }
      ],
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: ['blur', 'change'] }],
        tag: [{ required: true, message: '请填写权限', trigger: ['blur', 'change'] }]
      }
    }
  },
  methods: {
    open_dialog_callback(id, parent_id = null) {
      this.id = id
      this.info.parent_id = parent_id
      this.visible = true
    },
    init_api() {
      return info(this.id)
    },
    submit_api() {
      return save(this.id, Object.assign({ id: this.id }, this.info))
    }
  }
}
</script>

<style scoped>

</style>
