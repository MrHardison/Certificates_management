<template>
  <div class="v-tick-box">
    <checkbox
      :label="name"
      @change="value = $event"/>
  </div>
</template>

<script>
import checkbox from '~/components/checkbox'

export default {
  name: 'TickBox',
  components: { checkbox },
  props: {
    name: {
      type: String,
      default: 'Click to copy'
    }
  },
  data() {
    return {
      value: false
    }
  },
  watch: {
    value: {
      deep: true,
      handler(data) {
        this.$emit('copyData', data)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.v-tick-box {
  margin: 0.75rem 0 0.25rem 0;
}
</style>
