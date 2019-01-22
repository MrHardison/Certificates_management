<template>
  <div>
    <div class="item">
      <span
        class="item-title"
        @click="toogleList">
        {{ title }}
        <fa
          :icon="['fas', 'chevron-right']"
          :class="{open: isOpen}"
          class="item-icon"/>
      </span>
      
    </div>  
    <div
      v-show="isOpen"
      class="item-block">
      <slot/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TreeItem',
  props: {
    title: {
      type: String,
      default: 'no title'
    }
  },
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    toogleList() {
      this.isOpen = !this.isOpen
    }
  }
}
</script>
<style lang="scss" scoped>
.item {
  &-title {
    cursor: pointer;
  }
  &-icon {
    transition: transform 0.2s ease-out;
    margin-left: 10px;

    &.open {
      transform: rotate(90deg);
    }
  }
  &-block {
    padding-top: 0.5rem;
  }
}
</style>
