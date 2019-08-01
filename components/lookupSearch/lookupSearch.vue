<template>
  <div>
    <input-standard
      :computed_value="selectedLookupTitle"
      :search_icon="true"
      :clear="false"
      :class="{filled: selectedLookupTitle.length}"
      class="lookup"
      @click.native="showLookupModal = true" />
    <div
      v-if="error"
      class="error-message">This field is required</div>
    <v-modal
      v-if="showLookupModal"
      header="Select lookup"
      @close="closeLookupModal">
      <div slot="body">
        <lookup-selector
          :options="recordLookups"
          :is-loading="isLoading"
          :default-selected="selectedLookup"
          @searchText="searchText = $event"
          @deleteCustomLookup="deleteCustomLookup($event)"
          @update="selectItem($event)" />
      </div>
      <div
        slot="footer"
        :class="{'justify-content-between': searchText.length > 0, 'justify-content-end': searchText.length === 0}"
        class="d-flex w-100">
        <button-rounded
          v-show="searchText.length > 0"
          :preloading="preloading"
          class="btn-green rounded small preloading-mr0"
          @click.native="createCustomLookup">
          Create
        </button-rounded>
      </div>
    </v-modal>
    <v-modal
      v-if="needToSelectParentModal"
      header="Warning"
      @close="needToSelectParentModal = false">
      <template slot="body">
        Please select {{ parentElement.data }}
      </template>
      <div
        slot="footer"
        class="d-flex w-100">
        <button-rounded
          class="btn-green rounded small mx-auto"
          @click.native="needToSelectParentModal = false">
          OK
        </button-rounded>
      </div>
    </v-modal>
    <v-modal
      v-if="deleteLookupModal"
      header="Warning"
      @close="deleteLookupModal = false">
      <template slot="body">
        Are you sure to delete "{{ itemToDelete.data }}"?
      </template>
      <div
        slot="footer"
        class="d-flex w-100 justify-content-between">
        <button-rounded
          :preloading="deletePreloading"
          class="btn-green rounded small mx-auto preloading-mr0"
          @click.native="confirmDelete">
          Yes
        </button-rounded>
        <button-rounded
          class="btn-warning rounded small mx-auto"
          @click.native="deleteLookupModal = false">
          No
        </button-rounded>
      </div>
    </v-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VModal from '~/components/vModal/vModal'
import ButtonRounded from '~/components/buttonRounded/'
import InputStandard from '~/components/inputStandard/'
import lookupSelector from './lookupSelector'

export default {
  name: 'LookupSearch',
  components: {
    lookupSelector,
    InputStandard,
    VModal,
    ButtonRounded
  },
  props: {
    parentElement: {
      type: Object,
      default() {
        return {}
      }
    },
    selectedLookup: {
      type: Object,
      default() {
        return {}
      }
    },
    dataListDefaultId: {
      type: Number,
      default: null
    },
    message: {
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
      searchText: '',
      selectedItem: {
        id: null,
        record_lookup_type: null,
        data: null,
        title: null
      },
      showLookupModal: false,
      needToSelectParentModal: false,
      deleteLookupModal: false,
      itemToDelete: {},
      dropdownOptions: [],
      recordLookups: [],
      params: {
        data_list_default_id: this.dataListDefaultId,
        page: 1,
        last_page: null,
        search_text: '',
        interval: 500,
        record_lookup_id: null,
        record_lookup_type: null
      },
      createLookupParams: {
        data_list_default_id: this.dataListDefaultId,
        record_lookup_id: null,
        record_lookup_type: 'custom',
        data: '',
        title: ''
      },
      isLoading: false,
      preloading: false,
      deletePreloading: false,
      error: false
    }
  },
  computed: {
    ...mapGetters({ getDataListDefaults: 'dataListItems/getDataListDefaults' }),
    selectedLookupTitle() {
      let title = ''
      const system = this.selectedLookup.record_lookups_system
      const custom = this.selectedLookup.record_lookups_custom
      if (system.length) {
        title = system[0].title
      } else if (custom.length) {
        title = custom[0].title
      }
      return title
    }
  },
  watch: {
    showLookupModal: {
      handler(data) {
        if (this.parentElement.hasOwnProperty('id')) {
          if (data) {
            if (this.parentElement.data.length) {
              // eslint-disable-next-line
              const systemId = this.parentElement.record_lookups_system[0] && this.parentElement.record_lookups_system[0].id
              // eslint-disable-next-line
              const customId = this.parentElement.record_lookups_custom[0] && this.parentElement.record_lookups_custom[0].id
              this.createLookupParams.record_lookup_id = systemId || customId
              this.params.record_lookup_id = systemId || customId
              this.params.record_lookup_type = systemId ? 'system' : 'custom'

              this.getRecordLookups()
            } else {
              this.closeLookupModal()
              this.needToSelectParentModal = true
            }
          } else {
            this.recordLookups = []
          }
        }
      }
    }
  },
  mounted() {
    if (!this.parentElement.hasOwnProperty('id')) {
      this.getRecordLookups()
    }
    if (!this.selectedLookup.data.length) {
      this.errorRequired(true)
    } else {
      this.errorRequired(false)
    }
  },
  methods: {
    getRecordLookups() {
      this.isLoading = true
      this.recordLookups = []
      this.$api.recordLookups
        .getRecordLookups(this.params)
        .then(res => {
          res.data.forEach(item => {
            this.recordLookups.push(item)
          })
          if (res.next_page_url !== null) {
            ++this.params.page
            this.getRecordLookups()
          } else {
            this.params.page = 1
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    selectItem(item) {
      this.selectedItem = item
      this.errorRequired(false)
      this.closeLookupModal()

      const data = {
        data: item.data,
        title: item.title,
        id: [item.id],
        type: [item.record_lookup_type]
      }
      this.$emit('setData', data)
    },
    closeLookupModal() {
      this.searchText = ''
      this.itemToDelete = {}
      this.showLookupModal = false
    },
    createCustomLookup() {
      if (!this.preloading) {
        this.preloading = true
        this.createLookupParams.title = this.searchText
        this.createLookupParams.data = this.searchText
        if (this.createLookupParams.record_lookup_id) {
          const custom = this.parentElement.record_lookups_custom
          const system = this.parentElement.record_lookups_system
          if (system.length) {
            this.createLookupParams.record_lookup_type = 'system'
          } else if (custom.length) {
            this.createLookupParams.record_lookup_type = 'custom'
          }
        }
        this.$api.recordLookups
          .createRecordLookups(this.createLookupParams)
          .then(res => {
            _.delay(() => {
              this.preloading = false
            }, 1000)
            this.recordLookups = []
            this.getRecordLookups()
            this.selectItem(res)
          })
      }
    },
    deleteCustomLookup(item) {
      this.itemToDelete = item
      this.deleteLookupModal = true
    },
    confirmDelete() {
      if (!this.deletePreloading) {
        this.deletePreloading = true
        this.$api.recordLookups
          .deleteRecordLookups(this.itemToDelete.id)
          .then(res => {
            _.delay(() => {
              this.deletePreloading = false
            }, 1000)
            this.deleteLookupModal = false
            this.recordLookups = []
            this.getRecordLookups()
          })
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
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 0.5rem;
}
</style>
