<template>
  <div>
    <label class="label">{{ name }}</label>
    <date-picker
      v-model="date"
      :type="type"
      :format="format"
      :width="290"
      :popup-style="{top: 'left'}"
      :first-day-of-week="1"
      :value-type="'format'"
      :lang="'en'"
      :placeholder="`Select ${type}`"/>
    <div
      v-if="error"
      class="error-message">This field is required</div>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
export default {
  name: 'Datetime',
  components: { DatePicker },
  props: {
    elementId: {
      type: Number,
      default: null
    },
    type: {
      type: String,
      default: 'date'
    },
    format: {
      type: String,
      default: 'DD/MM/YYYY'
    },
    name: {
      type: String,
      default: ''
    },
    newDate: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    date: '',
    error: false
  }),
  watch: {
    date: {
      deep: true,
      handler(data) {
        this.$emit('update', data)
        if (data && this.required) {
          this.errorRequired(false)
        } else if (this.required) {
          this.errorRequired(true)
        }
      }
    }
  },
  mounted() {
    this.date = this.newDate
    if (!this.date.length && this.required) {
      this.errorRequired(true)
    }
  },
  methods: {
    errorRequired(isError) {
      const error = {
        id: this.elementId || this._uid,
        status: isError
      }
      this.error = isError
      this.$emit('validationError', error)
    }
  }
}
</script>

<style scoped lang="scss">
.label {
  display: flex;
}
.error-message {
  color: red;
  font-size: 14px;
}
</style>
