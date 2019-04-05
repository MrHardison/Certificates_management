<template>
  <button class="btn">
    <div class="content">
      <slot/>
    </div>
  </button>
</template>

<script>
export default {
  name: 'ButtonRounded'
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
}
</style>
