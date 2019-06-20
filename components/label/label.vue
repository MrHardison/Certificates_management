<template>
  <label
    :style="{fontSize: `${fontSize}px`, color: `#${color}`}"
    class="label label-fieldtype">
    {{ description || name }}
  </label>
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
  }
}
</script>

<style scoped lang="scss">
.label {
  color: $gray;
  font-size: 16px;
  font-weight: 500;
  line-height: 26px;
}
</style>
