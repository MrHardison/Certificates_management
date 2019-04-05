<template>
  <dropdown
    :options="dropdownOptions"
    :default-selected="selected"
    @update="$emit('update', options[$event].value)"/>
</template>

<script>
import Dropdown from '~/components/dropdown'
export default {
  name: 'Timezone',
  components: {
    Dropdown
  },
  props: {
    options: {
      type: Array,
      default() {
        return []
      }
    },
    defaultValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dropdownOptions: [],
      selected: null
    }
  },
  beforeMount() {
    if (this.options.length > 0) {
      this.options.forEach((item, index) => {
        if (this.defaultValue.length > 0) {
          if (item.value === this.defaultValue) {
            this.selected = index
          }
        } else {
          if (item.selected) {
            this.selected = index
          }
        }
        this.dropdownOptions.push(item.label)
      })
    }
  },
  mounted() {
    this.$emit('update', this.options[this.selected].value)
  }
}
</script>

<style>
</style>
