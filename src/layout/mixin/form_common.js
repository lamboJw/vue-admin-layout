import { objectHasKey } from '@/utils/common_function'

export const form_common = {
  computed: {
    form_prop_index: function() {
      const index_list = {}
      this.form_item.map((item, index) => {
        index_list[objectHasKey(item, 'prop') ? item.prop : ''] = index
      })
      return index_list
    }
  },
  methods: {
    set_form_item_options(prop, options, key = 'options') {
      const index = objectHasKey(this.form_prop_index, prop)
        ? this.form_prop_index[prop]
        : null
      if (index !== null && objectHasKey(this.form_item[index], key)) {
        this.form_item[index][key] = options
      }
    }
  }
}
