<template>
  <div
    v-click-outside="hideDropdown"
    :class="{open: open}"
    class="dropdown">
    <div
      class="header"
      @click="open = !open">
      <template v-if="!options.length">
        <span class="title">No data</span>
      </template>
      <template v-else-if="!selected">
        <div class="title">No items selected</div>
      </template>
      <template v-else>
        <div class="title">{{ selected }}</div>
      </template>
    </div>
    <div
      :class="{open: open}"
      class="content">
      <input
        v-if="showSearch"
        v-model="searchText"
        type="text"
        placeholder="Search"
        class="form-control form-control-sm border-0"
        @keyup="debounceSearch">
      <ul
        class="options">
        <template v-for="(option, index) in filteredOptions">
          <li
            :key="index"
            :class="{active: option === selected}"
            class="option"
            @click="selectOption(option)">
            {{ getOptionView(option) }}
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VDropdown',
  props: {
    options: {
      type: Array,
      default() {
        return []
      }
    },
    defaultSelected: {
      type: Number,
      default: -1
    },
    showSearch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      open: false,
      selected: null,
      searchText: '',
      debounceSearch: null
    }
  },
  computed: {
    filteredOptions() {
      if (this.showSearch) {
        return _.filter(this.options, option => {
          return (
            option.title.toLowerCase().indexOf(this.searchText.toLowerCase()) >
            -1
          )
        })
      } else {
        return this.options
      }
    }
  },
  created() {
    this.debounceSearch = _.debounce(() => {
      this.$emit('filter', this.searchText)
    }, 1000)
  },
  mounted() {
    if (this.defaultSelected >= 0 && this.options.length) {
      this.selected = this.options[this.defaultSelected]
    }
  },
  methods: {
    hideDropdown() {
      this.open = false
    },
    // handleScroll(e) {
    //   if (!this.enablePagination) {
    //     return
    //   }
    //   const target = e.target
    //   if (target.scrollHeight - target.clientHeight - target.scrollTop < 5) {
    //     this.debounceScroll()
    //   }
    // },
    getOptionView(option) {
      if (typeof option === 'string' || typeof option === 'number') {
        return option
      } else if (typeof option === 'object' && option.hasOwnProperty('title')) {
        return option.title
      } else if (
        typeof option === 'object' &&
        !option.hasOwnProperty('title')
      ) {
        return `Empty title - ${this.options.indexOf(option)}`
      }
    },
    selectOption(option) {
      this.hideDropdown()

      this.selected = this.getOptionView(option)
      if (typeof option === 'string' || typeof option === 'number') {
        return this.$emit('update', this.options.indexOf(option))
      } else if (typeof option === 'object' && option.hasOwnProperty('id')) {
        return this.$emit('update', option)
      } else if (typeof option === 'object' && !option.hasOwnProperty('id')) {
        return this.$emit('update', this.options.indexOf(option))
      }
      this.$emit('update', this.options.indexOf(option))
    }
  }
}
</script>

<style scoped lang="scss">
@import './dropdown';
</style>
