<template>
  <div class="form-check">
    <label
      class="form-check-label checkbox">
      <input
        v-model="model"
        class="form-check-input"
        type="checkbox">
      <div class="checkbox__text">
        {{ label }}
      </div>
    </label>
    <div
      v-if="error"
      class="error-message">This field is required</div>
  </div>
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
    label: {
      type: String,
      default: 'No label'
    },
    data: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      model: false,
      error: false
    }
  },
  watch: {
    model: {
      deep: true,
      handler(data) {
        if (data) {
          this.errorRequired(false)
        } else {
          this.errorRequired(true)
        }
        this.$emit('change', data)
      }
    },
    data: {
      handler(data) {
        this.model = data
      }
    }
  },
  mounted() {
    this.model = this.data
    if (this.selected) {
      this.model = this.selected
    }
    if (!this.model) {
      this.errorRequired(true)
    }
  },
  methods: {
    errorRequired(isError) {
      if (this.required) {
        const error = {
          id: this.elementId || this._uid,
          status: isError
        }
        this.error = isError
        this.$emit('validationError', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox {
  user-select: none;

  input {
    margin: 10px 0 0 20px;
    opacity: 0;
    position: absolute;
    z-index: -1;
  }

  &__text {
    cursor: pointer;
    position: relative;
    padding-left: 25px;

    &::before {
      background: #000;
      border-radius: 3px;
      box-sizing: border-box;
      content: '';
      height: 14px;
      left: 0;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 14px;
    }
  }
}
.checkbox input:checked + .checkbox__text:after {
  background: url('/ok-icon.svg') center no-repeat;
  color: #fff;
  content: '';
  font-weight: normal;
  left: 2px;
  height: 10px;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  width: 10px;
}
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 0.5rem;
}
</style>
