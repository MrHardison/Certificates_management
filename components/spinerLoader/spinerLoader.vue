<template>
  <div
    :style="{height: height ? `${height}px`:'20rem'}"
    class="spinner-loader">
    <div class="spinner-loader__container">
      <div class="spinner-loader__spinner">
        <div class="spinner-loader__spinner_bounce first"/>
        <div class="spinner-loader__spinner_bounce second"/>
        <div class="spinner-loader__spinner_bounce third"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpinerLoader',
  props: {
    height: {
      type: String,
      default: '20'
    }
  }
}
</script>

<style scoped lang="scss">
.spinner-loader {
  display: flex;
  &__container {
    margin: auto;
  }
  &__spinner {
    width: 70px;
    text-align: center;

    &_bounce {
      width: 18px;
      height: 18px;
      background-color: $main_blue;

      border-radius: 100%;
      display: inline-block;
      animation: sk-bouncedelay 1.4s infinite ease-in-out both;
      &.first {
        animation-delay: -0.32s;
      }
      &.second {
        animation-delay: -0.16s;
      }
      &.third {
      }
    }
  }
}

@keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
