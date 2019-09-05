<template>
  <div>
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
    <div
      v-if="error && required"
      class="error-message">This field is required</div>
  </div>
</template>

<script>
export default {
  name: 'VDropdown',
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
    defaultSelected: {
      type: Number,
      default: -1
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    selectedItem: {
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
      open: false,
      selected: null,
      searchText: '',
      debounceSearch: null,
      error: false
    }
  },
  computed: {
    filteredOptions() {
      if (this.showSearch) {
        return _.filter(this.options, option => {
          return (
            option.value.toLowerCase().indexOf(this.searchText.toLowerCase()) >
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
    if (!this.selectedItem.length) {
      this.errorRequired(true)
    }
    if (this.selectedItem.length) {
      this.getSelectedOption()
    } else {
      const selectedOption = _.find(this.options, {
        selected: true
      })
      if (this.defaultSelected >= 0 && this.options.length) {
        this.selectOption(this.options[this.defaultSelected])
      } else if (selectedOption) {
        this.selectOption(selectedOption)
      }
    }
  },
  methods: {
    hideDropdown() {
      this.open = false
    },
    getOptionView(option) {
      if (typeof option === 'string' || typeof option === 'number') {
        return option
      } else if (typeof option === 'object' && option.hasOwnProperty('label')) {
        return option.label
      } else if (typeof option === 'object' && option.hasOwnProperty('value')) {
        return option.value
      } else if (
        typeof option === 'object' &&
        !option.hasOwnProperty('label')
      ) {
        return `Empty title - ${this.options.indexOf(option)}`
      }
    },
    selectOption(option) {
      this.hideDropdown()
      this.errorRequired(false)

      this.selected = this.getOptionView(option)
      if (typeof option === 'string' || typeof option === 'number') {
        return this.$emit('update', this.options.indexOf(option))
      } else if (typeof option === 'object' && option.hasOwnProperty('id')) {
        return this.$emit('update', option)
      } else if (typeof option === 'object' && !option.hasOwnProperty('id')) {
        return this.$emit('update', this.options.indexOf(option))
      }
      this.$emit('update', this.options.indexOf(option))
    },
    getSelectedOption() {
      const selectedOption = _.find(this.options, {
        value: this.selectedItem
      })
      if (selectedOption) {
        this.selected = selectedOption.label
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
    }
  }
}
</script>

<style scoped lang="scss">
@import './dropdown';
</style>
