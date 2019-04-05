<template>
  <div class="form-group">
    <template v-if="label">
      <label>{{ label }}</label>
    </template>
    <div class="control-body">
      <textarea
        :type="type"
        :class="{limited:limits && limits.hasOwnProperty('max'), 'is-error': error, 'is-warning': warning}"
        :placeholder="placeholder"
        :readonly="disabled ? true : false"
        :maxlength="limits.max ? parseInt(limits.max) : 200"
        v-model="value"
        class="form-control"/>
      <template v-if="limits && limits.hasOwnProperty('max')">
        <span class="limits">
          <span class="current">{{ value != null ? value.length : 0 }}</span>
          <span class="delimiter">/</span>
          <span class="max">{{ limits.max }}</span>
        </span>
      </template>
      <template v-if="error">
        <span class="message-error">
          {{ error_message }}
        </span>
      </template>
      <template v-else-if="warning">
        <span class="message-warning">
          {{ warning_message }}
        </span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Textarea',
  //props 'warning_message', 'error_message' contain text alert message,
  // props error, warning are created for test and contain state field
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
    },
    computed_value: {
      type: String,
      default: ''
    },
    limits: {
      type: Object,
      default() {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    warning_message: {
      type: String,
      default: 'Pay attention to this field'
    },
    error_message: {
      type: String,
      default: 'this field is not filled correctly'
    },
    warning: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
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
        this.$emit('update', data)
      }
    },
    computed_value: {
      deep: true,
      handler(data) {
        this.value = data
      }
    }
  },
  mounted() {
    this.value = this.computed_value
  },
  methods: {}
}
</script>

<style scoped lang="scss">
@import './vTextarea';
</style>
