<template>
  <div class="form-group">
    <template v-if="label">
      <label>{{ description || label }}</label>
    </template>
    <div class="control-body">
      <textarea
        :type="type"
        :class="{limited:limits && limits.hasOwnProperty('max'), 'is-error': error}"
        :placeholder="placeholder"
        :readonly="disabled ? true : false"
        :maxlength="limits.max ? parseInt(limits.max) : 200"
        v-model="value"
        class="form-control"
        @blur="errorsCheck" />
      <template v-if="limits && limits.hasOwnProperty('max')">
        <span class="limits">
          <span class="current">{{ value != null ? value.length : 0 }}</span>
          <span class="delimiter">/</span>
          <span class="max">{{ limits.max }}</span>
        </span>
      </template>
      <template v-if="error">
        <span class="message-error">
          {{ required ? warningMessage : errorText }}
        </span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Textarea',
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
    description: {
      type: String,
      default: ''
    },
    defaultText: {
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
    validate: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    elementId: {
      type: Number,
      default: null
    },
    fieldName: {
      type: String,
      default: ''
    },
    certId: {
      type: Number,
      default: null
    },
    warningMessage: {
      type: String,
      default: 'This field is required'
    },
    errorText: {
      type: String,
      default: 'Please enter a valid value'
    },
    warning: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      error: false,
      value: '',
      pattern: {
        email: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
        string: /./,
        numeric: /^-?\d*(\.\d+)?$/,
        float: /^-?(0\.\d+|[1-9]+[0-9]*\.\d+)$/,
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
        this.$emit('update', data)
      }
    },
    computed_value: {
      deep: true,
      handler(data) {
        if (data.length) {
          this.value = data
        }
      }
    }
  },
  mounted() {
    if (!this.defaultText) {
      this.value = this.computed_value
    }
    if (this.certId) {
      if (this.computed_value === this.defaultText) {
        this.value = ''
      } else {
        this.value = this.computed_value
      }
    } else if (!this.certId && this.defaultText.length) {
      if (this.computed_value.length) {
        this.value = this.computed_value
      } else {
        this.value = this.defaultText
      }
    }
    this.validation()
  },
  methods: {
    errorsCheck() {
      this.validation()
      setTimeout(() => {
        if (this.error) {
          this.$alerts({
            group: 'alerts',
            type: 'error',
            title: this.fieldName,
            text: this.required ? this.warningMessage : this.errorText,
            duration: 1000
          })
        }
      }, 0)
    },
    validation() {
      const error = {
        id: this.elementId !== null ? this.elementId : this._uid,
        status: false
      }
      if (!_.isNull(this.value)) {
        if (!this.value.trim() && this.required) {
          this.errorRequired(true)
        } else {
          this.error = false
          this.$emit('validationError', error)
        }
        if (this.value.length && this.validate && this.pattern[this.validate]) {
          const result = this.pattern[this.validate].test(this.value)
          if (!result) {
            if (this.error === false) {
              this.error = true
              error.status = true
              this.$emit('validationError', error)
            }
          } else {
            this.error = false
            this.$emit('validationError', error)
          }
        }
      }
    },
    errorRequired(isError) {
      if (this.required) {
        const error = {
          id: this.elementId || this._uid,
          status: isError
        }
        this.error = isError
        this.$emit('validationError', error)
      }
    },
    getValidationError() {
      const error = {
        id: this.elementId !== null ? this.elementId : this._uid,
        status: false
      }
      if (!this.value.length) {
        this.error = true
        error.status = true
        this.$emit('validationError', error)
      } else {
        this.error = false
        error.status = false
        this.$emit('validationError', error)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import './vTextarea';
</style>
