<template>
  <div class="radio-wrapper">
    <template v-for="(item, index) in options">
      <div
        :key="index"
        class="form-check">
        <label
          class="form-check-label radio">
          <input
            v-model="model"
            :value="item.value"
            :name="name + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)"
            class="form-radio-input"
            type="radio">
          <div class="radio__text">
            {{ item.label }}
          </div>
        </label>
      </div>
    </template>
    <div
      v-if="error"
      class="error-text">This field is required</div>
  </div>
</template>

<script>
export default {
  name: 'Radio',
  props: {
    elementId: {
      type: Number,
      default: null
    },
    options: {
      type: Array,
      default() {
        return []
      }
    },
    name: {
      type: String,
      default: ''
    },
    selected: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      model: '',
      error: false
    }
  },
  watch: {
    model: {
      deep: true,
      handler(data) {
        if (!data) {
          this.errorRequired(true)
        } else {
          this.errorRequired(false)
        }
        this.$emit('change', this.model)
      }
    },
    selected: {
      deep: true,
      handler(data) {
        this.model = data
      }
    }
  },
  mounted() {
    this.options.forEach(item => {
      if (item.selected && item.selected === true) {
        this.model = item.value
      }
    })
    if (this.selected.length > 0) {
      this.model = this.selected
    }
    if (!this.model.length) {
      this.errorRequired(true)
    }
    this.$emit('change', this.model)
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
.radio {
  user-select: none;

  input {
    margin: 10px 0 0 20px;
    opacity: 0;
    position: absolute;
    z-index: -1;
  }

  &__text {
    cursor: pointer;
    padding-left: 25px;
    position: relative;

    &::before {
      border: 1px solid $blue;
      background: #fff;
      border-radius: 50%;
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
.radio input:checked + .radio__text::after {
  background: #fff;
  border-radius: 50%;
  content: '';
  font-weight: normal;
  left: 4px;
  height: 6px;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  width: 6px;
}
.radio input:checked + .radio__text::before {
  background: $blue;
}
.error-text {
  color: red;
  font-size: 14px;
}
</style>
