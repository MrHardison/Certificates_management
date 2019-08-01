<template>
  <label
    :style="{fontSize: `${fontSize}px`, color: `#${color}`}"
    class="label label-fieldtype"
    v-html="fixedDescription || description || name"/>
</template>

<script>
export default {
  name: 'Label',
  props: {
    name: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '000'
    },
    fontSize: {
      type: String,
      default: '16'
    }
  },
  computed: {
    fixedDescription() {
      if (this.description && this.description.includes('\n')) {
        return this.description.replace(/(?:\r\n|\r|\n)/g, '<br>')
      } else {
        return null
      }
    }
  }
}
</script>

<style scoped lang="scss">
.label {
  color: $gray;
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
}
</style>
