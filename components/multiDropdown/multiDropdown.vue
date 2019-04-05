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
        class="form-control form-control-sm border-0">
      <ul
        class="options">
        <template v-for="(option, index) in filteredOptions">
          <template v-if="typeof option === 'object' && option.hasOwnProperty('options')">
            <li
              :key="index"
              :class="{active: option === selected}"
              class="multi-option">
              <b> {{ getOptionView(option) }} </b>
              <template v-if="option.hasOwnProperty('options')">
                <ul
                  class="options">
                  <template v-for="(child, c_index) in option.options">
                    <li
                      :key="c_index"
                      :class="{active: option === selected}"
                      class="option"
                      @click="selectOption(child)">
                      {{ getOptionView(child) }}
                    </li>
                  </template>
                </ul>
              </template>
            </li>
          </template>
          <template v-else>
            <li
              :key="index"
              :class="{active: option === selected}"
              class="option"
              @click="selectOption(option)">
              {{ getOptionView(option) }}
            </li>
          </template>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VMultiDropdown',
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
      return _.filter(this.options, option => {
        let arr = []
        _.forEach(option.options, item => {
          if (
            item.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1
          ) {
            arr.push(item)
          }
        })
        return arr
      })
    }
  },
  created() {
    this.debounceSearch = _.debounce(() => {
      this.$emit('filter', this.inputText)
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
      if (typeof option === 'string' || typeof option === 'number') {
        this.$emit('update', this.options.indexOf(option))
      } else if (typeof option === 'object' && option.hasOwnProperty('id')) {
        this.$emit('update', option.id)
      } else if (typeof option === 'object' && !option.hasOwnProperty('id')) {
        this.$emit('update', this.options.indexOf(option))
      }
      this.selected = this.getOptionView(option)
    }
  }
}
</script>

<style scoped lang="scss">
@import './dropdown';
</style>
