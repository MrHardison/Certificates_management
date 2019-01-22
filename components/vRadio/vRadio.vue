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
            :name="name"
            class="form-radio-input"
            type="radio">
          <div class="radio__text">
            {{ item.label }}
          </div>
        </label>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Radio',
  props: {
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
    }
  },
  data() {
    return {
      model: ''
    }
  },
  watch: {
    model: {
      deep: true,
      handler(data) {
        this.$emit('change', this.model)
      }
    }
  },
  mounted() {
    let count = 0
    this.options.forEach(item => {
      if (item.selected && item.selected === true) {
        this.model = item.value
      } else if (item.selected !== false) {
        ++count
      }
    })
    if (count > 0) {
      this.model = this.selected
    }
    this.$emit('change', this.model)
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
      background: #000;
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
.radio input:checked + .radio__text:after {
  background: #fff;
  border-radius: 50%;
  content: '';
  font-weight: normal;
  left: 3px;
  height: 8px;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  width: 8px;
}
</style>
