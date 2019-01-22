<template>
  <div
    v-if="isActive"
    class="tab">
    <slot />
  </div>
</template>
<script>
export default {
  name: 'VTab',
  props: {
    name: {
      type: String,
      default: 'No Name'
    },
    disable: {
      type: Boolean,
      default: false
    },
    default: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: this.name,
      isActive: false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
