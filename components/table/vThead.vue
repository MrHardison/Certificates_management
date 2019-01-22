<template>
  <div class="card-header">
    <template v-if="enableHeader">
      <div class="row">
        <div class="col col-12 col-sm-12 col-md-4 header">
          <slot name="header"/>
        </div>
        <div class="col col-12 col-sm-12 col-md-4 entries">
          <span class="text">
            Show:
          </span>
          <div class="dropdown-wrapper">
            <dropdown
              :options="entries.intervals"
              :default-selected="entries.intervals.indexOf(entries.interval)"
              @update="setInterval($event)"/>
          </div>
          <span class="text">
            entries
          </span>
        </div>
        <div class="col col-12 col-sm-12 col-md-4 search">
          <input-standard
            :computed_value="search_text"
            placeholder="Type the text"
            class="search-input"
            @update="search($event)"/>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Dropdown from '../dropdown/'
import InputStandard from '../inputStandard/'
export default {
  name: 'VThead',
  components: {
    InputStandard,
    Dropdown
  },
  props: {
    enableHeader: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      entries: {
        intervals: [5, 10, 20, 30, 40, 50],
        interval: 10
      },
      search_text: ''
    }
  },
  methods: {
    search(text) {
      this.search_text = text
      this.$emit('search_text', text)
    },
    setInterval(interval) {
      this.entries.interval = interval
      this.$emit('interval', this.entries.intervals[interval])
    }
  }
}
</script>

<style scoped lang="scss">
@import 'vThead';
</style>
