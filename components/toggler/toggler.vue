<template>
  <div>
    <slot/>
  </div>
</template>

<script>
import bus from './bus.js'

export default {
  name: 'Toggler',
  data() {
    return {
      tabs: []
    }
  },
  created() {
    this.tabs = this.$children
    bus.$on('toggle', this.handlerToggle)
  },
  mounted() {
    this.tabs[0].show = true
  },
  methods: {
    handlerToggle(tab) {
      this.tabs.forEach(item => {
        item.show = !item.show
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
