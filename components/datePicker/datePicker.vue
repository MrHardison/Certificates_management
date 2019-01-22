<template>
  <div>
    <label class="label">{{ name }}</label>
    <date-pick
      v-model="date"
      :format="format" 
      :pick-time="time"
      class="form-control datetime"                                                   
      placeholder="Select date"               
      name="date"
      @input="$emit('date', $event)"/>  
  </div>
</template>
<script>
import DatePick from 'vue-date-pick'
import 'vue-date-pick/dist/vueDatePick.css'

export default {
  name: 'DatePicker',
  components: { DatePick },
  props: {
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    time: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    newDate: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      date: ''
    }
  },
  watch: {
    newDate: {
      deep: true,
      handler(data) {
        this.date = this.newDate
      }
    }
  },
  mounted() {
    this.date = this.newDate
  }
}
</script>
<style lang="scss">
.form-control {
  &.datetime {
    padding: 0;

    & > input {
      border: 0;
      font-size: 16px;
      height: 100%;
      padding: 0.375rem 0.75rem;
      width: 100%;
    }
  }
}
.label {
  color: $gray;
  font-size: 16px;
  font-weight: 500;
  line-height: 26px;
}
</style>
