<template>
  <div>
    <span
      class="label"
      @click="toggle">
      <i
        :class="[ show ? 'fa-minus-square ' : 'fa-plus-square' ]"
        class="fas collapse-tree-icon"/>
      {{ label }}
    </span>
    <transition name="collapse">
      <div
        v-show="show"
        class="container-content">
        <slot/>
      </div>
    </transition>
  </div>
</template>

<script>
import bus from './bus.js'

export default {
  name: 'TogglerTab',
  props: {
    label: {
      type: String,
      default: 'Not set'
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    toggle() {
      bus.$emit('toggle', this)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../sass/ui_colors';

.container-content {
  overflow: hidden;
}

.collapse-enter-active,
.collapse-leave-active {
  transition-property: height, max-height, opacity, margin;
  transition-duration: 1s;
  transition-timing-function: ease;
}

.collapse-enter,
.collapse-leave-to {
  border: none;
  max-height: 0;
  height: 0;
  opacity: 0;
  margin: 0;
}

.collapse-tree-icon {
  margin-right: 0.5rem;
}

.label {
  color: $gray;
  font-size: 16px;
  font-weight: 500;
  line-height: 26px;
  margin-left: 0.25rem;
  display: block;
  margin-top: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}
</style>
