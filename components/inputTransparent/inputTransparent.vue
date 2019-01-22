<template>
  <div class="form-group">
    <template v-if="label">
      <label>{{ label }}</label>
    </template>
    <div class="control-body">
      <input
        :type="type"
        :placeholder="placeholder"
        v-model="value"
        class="form-control"
        @input="$emit('update', $event.target.value)">
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputTransparent',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  data() {
    return {
      value: ''
    }
  },
  watch: {
    value: {
      deep: true,
      handler(data) {
        if (data == null) {
          data = ''
        }
        this.$emit('update', data.toLowerCase())
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import './inputTransparent';
</style>
