<template>
  <div class="form-group">
    <template v-if="label">
      <label>{{ label }}</label>
    </template>
    <div class="control-body">
      <input
        :type="type"
        :class="{limited:limits && limits.hasOwnProperty('max'), 'is-error': error, 'is-warning': required && value.length === 0, 'with-icon': search_icon}"
        :placeholder="placeholder"
        :readonly="disabled"
        :maxlength="limits.max ? parseInt(limits.max) : 50"
        v-model="value"
        class="form-control"
        @blur="validation">
      <template v-if="search_icon">
        <fa
          :icon="['fal', 'search']"
          class="input-icon"/>
      </template>
      <template v-if="limits && limits.hasOwnProperty('max')">
        <span
          :class="{disabled: disabled}"
          class="limits">
          <span class="current">{{ value != null ? value.length : 0 }}</span>
          <span class="delimiter">/</span>
          <span class="max">{{ limits.max }}</span>
        </span>
      </template>
      <template v-if="error">
        <span class="message-error">
          {{ validationMessage }}
        </span>
      </template>
      <template v-else-if="required && value.length === 0">
        <span class="message-warning">
          {{ warningMessage }}
        </span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputStandard',
  //props 'warningMessage', 'error_message' contain text alert message,
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
    search_icon: {
      type: Boolean,
      default: false
    },
    validate: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    fieldName: {
      type: String,
      default: ''
    },
    elementId: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    warningMessage: {
      type: String,
      default: 'This field is required'
    },
    validationMessage: {
      type: String,
      default: 'this field is not filled correctly'
    }
  },
  data() {
    return {
      error: false,
      valueLength: null,
      value: '',
      pattern: {
        email: /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
        string: /./,
        numeric: /^\d+$/,
        integer: /^\d+$/,
        ip: /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/,
        ipv4: /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/,
        ipv6: /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/
      }
    }
  },
  watch: {
    value: {
      deep: true,
      handler(data) {
        if (data === null) {
          data = ''
        }
        // this.getValidationError(data)
        if (this.validate === 'integer') {
          data = data.replace(/[^0-9]/g, '')
          this.value = data
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
    this.validation()
    // this.getValidationError(this.value)
  },
  methods: {
    validation() {
      if (this.value !== null) {
        if (this.value.length === 0) {
          this.error = false
          this.$emit('validationError', [
            this.elementId !== null ? this.elementId : this._uid,
            false
          ])
          return
        }
      }
      if (this.validate) {
        const result = this.pattern[this.validate].test(this.value.toString())
        if (!result) {
          if (this.error === false) {
            this.error = true
            this.$emit('validationError', [
              this.elementId !== null ? this.elementId : this._uid,
              true
            ])
          }
        } else {
          this.error = false
          this.$emit('validationError', [
            this.elementId !== null ? this.elementId : this._uid,
            false
          ])
        }
      }
    }
    // getValidationError(data) {
    //   if (data.length === 0 && this.required) {
    //     this.$emit('error', { add: this.fieldName })
    //   } else {
    //     this.$emit('error', { remove: this.fieldName })
    //   }
    // }
  }
}
</script>

<style scoped lang="scss">
@import './inputStandard';
</style>
