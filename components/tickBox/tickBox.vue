<template>
  <div class="v-tick-box">
    <button-rounded @click.native="$emit('copyData', copyData)">
      {{ name }}
    </button-rounded>
  </div>
</template>

<script>
import ButtonRounded from '~/components/buttonRounded'
export default {
  name: 'TickBox',
  components: { ButtonRounded },
  props: {
    name: {
      type: String,
      default: 'Click to copy'
    },
    copyData: {
      type: Object,
      default() {
        return {}
      }
    },
    formSectionElements: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>
</style>
