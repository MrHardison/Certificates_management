<template>
  <div
    class="item-selector">
    <label class="label">
      Type below to search or create to a new record
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
      class="content">
      <div
        v-if="isLoading"
        class="content-loading">
        <spinner-loader />
      </div>
      <ul
        ref="options"
        class="options">
        <template v-for="(option, index) in lookupOptions">
          <li
            :key="index"
            :class="{active: option.id === selectedItemId && option.record_lookup_type === selectedItemType}"
            class="option d-flex justify-content-between">
            <div
              class="option-container"
              @click="selectOption(option)">
              {{ getOptionView(option) }}
            </div>
            <div
              v-if="option.record_type === 'custom' && option.id !== defaultSelected.id"
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
          class="option active">
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
  name: 'LookupSelector',
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
    }
  },
  data() {
    return {
      inputText: '',
      selectedItemId: null,
      selectedItemType: null
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
    }
  },
  mounted() {
    this.$emit('getLookupData')
    this.selectedItemId = this.defaultSelected.id
    this.selectedItemType = this.defaultSelected.record_lookup_type
  },
  methods: {
    getOptionView(option) {
      if (typeof option === 'string' || typeof option === 'number') {
        return option
      } else if (typeof option === 'object' && option.hasOwnProperty('data')) {
        return option.data
      } else if (typeof option === 'object' && !option.hasOwnProperty('data')) {
        return `Empty title - ${this.options.indexOf(option)}`
      }
    },
    selectOption(option) {
      if (option) {
        this.selectedItemId = option.id
        this.selectedItemType = option.record_lookup_type
        this.$emit('update', option)
      } else {
        this.selectedItemId = null
        this.selectedItemType = null
      }
    },
    deleteCustomLookup(item) {
      this.$emit('deleteCustomLookup', item)
    }
  }
}
</script>

<style scoped lang="scss">
@import './lookupSelector';
</style>
