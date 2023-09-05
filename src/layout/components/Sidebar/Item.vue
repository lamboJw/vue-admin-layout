<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon} />)
      }
    }

    if (title) {
      const title_node = h('span', {
        attrs: {
          slot: 'title',
          class: icon ? '' : 'title-without-icon'
        }
      }, title)
      vnodes.push(title_node)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
  margin-left: 10px;
  margin-right: 16px;
}
.title-without-icon {
  margin-left: calc(1em + 30px)
}
</style>
