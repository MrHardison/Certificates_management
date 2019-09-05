<template>
  <div class="lookup">
    <fa
      :icon="['fal', 'search']"
      class="input-icon"/>
    <input
      v-model="value"
      disabled="true">
  </div>
</template>

<script>
export default {
  name: 'InputLookup',
  props: {
    propValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      value: ''
    }
  },
  watch: {
    propValue: {
      handler(data) {
        this.value = data
      }
    }
  },
  mounted() {
    this.value = this.propValue
  }
}
</script>
<style lang="scss" scoped>
@import './inputLookup.scss';
</style>
