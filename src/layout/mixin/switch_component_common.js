/*
  同一页面内切换不同子组件，在子组件混入这个文件，点击按钮时调用switch_component方法，传入要切换的子组件名称，名称采用'a-b'形式。
  父组件请复制views/switch_component_template.vue来修改
 */

export const switch_component_common = {
  props: {
    showComponent: { type: String, default: '' }
  },
  methods: {
    switch_component(component_name) {
      this.$emit('update:showComponent', component_name)
    }
  }
}
