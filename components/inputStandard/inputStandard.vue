<template>
  <div class="form-group">
    <template v-if="label">
      <label>{{ description || label }}</label>
    </template>
    <div class="control-body">
      <input
        :autofocus="autofocus"
        :type="type"
        :class="{limited:limits && limits.hasOwnProperty('max'), 'is-error': error, 'with-icon': search_icon}"
        :placeholder="placeholder"
        :readonly="disabled"
        :maxlength="limits.max ? parseInt(limits.max) : 50"
        v-model.trim="value"
        class="form-control"
        @blur="errorsCheck">
      <div
        v-if="value.length"
        class="clear">
        <fa
          :icon="['fal', 'times-circle']"
          class="clear-icon"
          @click="clearValue"/>
      </div>
      <template v-if="search_icon">
        <fa
          :icon="['fal', 'search']"
          class="input-icon"/>
      </template>
      <template v-if="limits && limits.hasOwnProperty('max')">
        <div
          :class="{disabled: disabled, moved: value.length}"
          class="limits">
          <span class="current">{{ value != null ? value.length : 0 }}</span>
          <span class="delimiter">/</span>
          <span class="max">{{ limits.max }}</span>
        </div>
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
  name: 'InputStandard',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    defaultText: {
      type: String,
      default: ''
    },
    computed_value: {
      type: String,
      default: ''
    },
    description: {
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
    certId: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    errorText: {
      type: String,
      default: 'Please enter a valid value'
    },
    warningMessage: {
      type: String,
      default: 'This field is required'
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
        if (_.isNull(data)) {
          data = ''
        }
        this.$emit('update', data)
      }
    },
    computed_value: {
      handler(data) {
        this.value = data
        this.validation()
      }
    }
  },
  mounted() {
    this.value = this.computed_value
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
    clearValue() {
      this.value = ''
      this.$emit('clearValue', this.value)
      this.validation()
    }
  }
}
</script>

<style scoped lang="scss">
@import './inputStandard';
</style>
