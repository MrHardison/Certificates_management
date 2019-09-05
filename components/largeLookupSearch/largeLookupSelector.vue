<template>
  <div
    class="item-selector">
    <label class="label">
      Search in lookups
    </label>
    <div class="input">
      <fa
        :icon="['fal', 'search']"
        class="input-icon"/>
      <input
        v-model="inputText"
        type="text"
        class="form-control form-control-sm"
        @input="$emit('searchText', inputText)">
    </div>
    <div
      v-if="inputText.length > 0 && Object.keys(parentElement).length"
      class="parent-wrapper my-3">
      <ul class="parent-list">
        <template v-for="(option, index) in parentOptions">
          <li
            :key="index"
            :class="{active: selectedParentItem ? selectedParentItem === option.id : ''}"
            class="parent-item"
            @click="selectParentItem(option.id)">{{ option.title }}</li>
        </template>
      </ul>
    </div>
    <div
      class="content">
      <div
        v-if="isLoading"
        class="content-loading">
        <spinner-loader />
      </div>
      <ul
        class="options">
        <template v-for="(option, index) in lookupOptions">
          <li
            :key="index"
            :class="{active: selectedOption(option)}"
            class="option d-flex justify-content-between">
            <div
              class="option-container"
              @click="selectOption(option)">
              {{ getOptionView(option) }}
            </div>
            <div
              v-if="option.record_type === 'custom' && !selectedOption(option, true)"
              class="delete-lookup"
              @click="deleteCustomLookup(option)">
              <fa
                :icon="['fas', 'times-circle']"
                class="input-icon"/>
            </div>
          </li>
        </template>
        <li
          v-if="lookupOptions.length === 0"
          class="option active empty">
          <div class="option-container">
            Not found
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import SpinnerLoader from '~/components/spinerLoader'

export default {
  name: 'LargeLookupSelector',
  components: {
    SpinnerLoader
  },
  props: {
    options: {
      type: Array,
      default() {
        return []
      }
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    defaultSelected: {
      type: Object,
      default() {
        return {}
      }
    },
    parentElement: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      inputText: '',
      selectedItems: [],
      selectedParentItem: null
    }
  },
  computed: {
    lookupOptions() {
      return _.orderBy(
        _.filter(this.options, item => {
          return (
            item.data.toLowerCase().indexOf(this.inputText.toLowerCase()) > -1
          )
        }),
        'data'
      )
    },
    parentOptions() {
      return [
        ...this.parentElement.record_lookups_system,
        ...this.parentElement.record_lookups_custom
      ].slice()
    }
  },
  watch: {
    options: {
      deep: true,
      handler(data) {
        let arr = []
        const rebuildSelected = (arr, type) => {
          if (arr.length) {
            const cloneArray = _.cloneDeep(arr)
            return cloneArray.map(item => {
              return (item = {
                ...item,
                record_type: type
              })
            })
          } else {
            return arr
          }
        }
        this.selectedItems = [
          ...rebuildSelected(
            this.defaultSelected.record_lookups_system,
            'system'
          ),
          ...rebuildSelected(
            this.defaultSelected.record_lookups_custom,
            'custom'
          )
        ]
      }
    }
  },
  mounted() {
    if (Object.keys(this.parentElement).length === 0) {
      this.$emit('selectedParentItem', true)
    }
    this.$emit('getLookupData')
  },
  methods: {
    selectedOption(item, deleted) {
      return this.selectedItems.find(i => i.id === item.id) ? true : false
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
      const selectedOption = this.selectedItems.find(
        item => item.id === option.id && item.record_type === option.record_type
      )
      if (selectedOption) {
        this.selectedItems = this.selectedItems.filter(
          item => item.id !== selectedOption.id
        )
      } else {
        this.selectedItems.push(option)
      }
      this.$emit('update', this.selectedItems)
    },
    deleteCustomLookup(item) {
      this.$emit('deleteCustomLookup', item)
    },
    selectParentItem(id) {
      this.selectedParentItem = id
      this.$emit('selectedParentItem', id)
    }
  }
}
</script>

<style scoped lang="scss">
@import './largeLookupSelector.scss';
</style>
