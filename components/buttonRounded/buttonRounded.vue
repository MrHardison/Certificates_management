<template>
  <button class="btn">
    <div class="content">
      <slot/>
      <fa
        v-if="preloading"
        :icon="['far', 'spinner-third']"
        class="loading-icon"/>
    </div>
  </button>
</template>

<script>
export default {
  name: 'ButtonRounded',
  props: {
    preloading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.btn {
  &.disabled {
    cursor: default;
    background: $gray;

    &:hover {
      background: $gray;
    }
  }
  &.preloading-mr0 {
    .loading-icon {
      margin-right: 0;
    }
  }
}
.loading-icon {
  margin: 0 -1rem 0 0.5rem;
  animation: rotate 0.5s infinite;

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(90deg);
    }
    50% {
      transform: rotate(180deg);
    }
    75% {
      transform: rotate(270deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
