<template>
  <div>
    <input-standard
      :computed_value="selectedLookupTitle"
      :search_icon="true"
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
        <multi-lookup-selector
          :options="recordLookups"
          :is-loading="isLoading"
          :default-selected="selectedItems"
          @searchText="searchText = $event"
          @selectedParentItem="selectedParentItem = $event"
          @deleteCustomLookup="deleteCustomLookup($event)"
          @update="selectedItems = $event"/>
      </div>
      <div
        slot="footer"
        :class="{'justify-content-between': searchText.length > 0, 'justify-content-end': searchText.length === 0}"
        class="d-flex w-100">
        <button-rounded
          v-show="searchText.length > 0"
          :preloading="preloading"
          :class="{disabled: !selectedParentItem}"
          class="btn-green rounded small preloading-mr0"
          @click.native="createCustomLookup">
          Create
        </button-rounded>
        <button-rounded
          class="btn-green rounded small"
          @click.native="selectItems">
          Select
        </button-rounded>
      </div>
    </v-modal>
    <v-modal
      v-if="needToSelectParentModal"
      header="Warning">
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
      header="Warning">
      <template slot="body">
        Are you sure to delete "{{ itemToDelete.data }}"?
      </template>
      <div
        slot="footer"
        class="d-flex w-100 justify-content-between">
        <button-rounded
          :preloading="deletePreloading"
          class="btn-green rounded small mx-auto"
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
import { mapMutations, mapGetters } from 'vuex'
import VModal from '~/components/vModal/vModal'
import ButtonRounded from '~/components/buttonRounded/'
import InputStandard from '~/components/inputStandard/'
import multiLookupSelector from './multiLookupSelector'

export default {
  name: 'MultiLookupSearch',
  components: {
    multiLookupSelector,
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
      selectedItems: [],
      showLookupModal: false,
      needToSelectParentModal: false,
      deleteLookupModal: false,
      itemToDelete: {},
      recordLookups: [],
      childRecordLookupIds: [],
      selectedChildRecordLookupid: 0,
      selectedParentItem: null,
      isLoading: false,
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
        record_lookup_type: 'system',
        data: '',
        title: ''
      },
      preloading: false,
      deletePreloading: false,
      error: false
    }
  },
  computed: {
    selectedLookupTitle() {
      let title = ''
      let titles = []
      const selectedLookups = [
        ...this.selectedLookup.record_lookups_system,
        ...this.selectedLookup.record_lookups_custom
      ]
      selectedLookups.forEach(i => {
        titles.push(i.title)
      })
      if (titles.length) {
        title = titles.join(', ')
      }
      return title
    },
    getLookupItems() {
      let items = []
      const selectedLookups = [
        ...this.selectedLookup.record_lookups_custom,
        ...this.selectedLookup.record_lookups_system
      ]
      if (selectedLookups.length > 0) {
        items = _.intersectionBy(this.recordLookups, selectedLookups, 'id')
      }
      return items
    }
  },
  watch: {
    showLookupModal: {
      handler(data) {
        if (this.parentElement.hasOwnProperty('id')) {
          if (data) {
            if (this.parentElement.data.length) {
              this.childRecordLookupIds = [
                // eslint-disable-next-line
                ...parentElement.record_lookups_custom.map(e => e,record_type = 'custom'),
                // eslint-disable-next-line
                ...parentElement.record_lookups_custom.map(e => e,record_type = 'system')
              ]
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
    console.log(this.selectedLookup)
    // if (!this.computedValue.length) {
    //   this.errorRequired(true)
    // } else {
    //   this.errorRequired(false)
    // }
  },
  methods: {
    ...mapGetters({ getDataListDefaults: 'dataListItems/getDataListDefaults' }),
    ...mapMutations({
      setOldSelectedOptions: 'dataView/setOldLookupSelectedOptions',
      clearOldSelectedOptions: 'dataView/clearOldLookupSelectedOptions'
    }),
    getRecordLookups() {
      this.isLoading = true
      this.recordLookups = []
      if (this.childRecordLookupIds.length > 0) {
        if (this.params.page === 1) {
          this.params.record_lookup_id = this.childRecordLookupIds[
            this.selectedChildRecordLookupid
          ].id
          this.params.record_lookup_type = this.childRecordLookupIds[
            this.selectedChildRecordLookupid
          ].record_type
        }
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
              if (
                this.selectedChildRecordLookupid <
                this.childRecordLookupIds.length - 1
              ) {
                ++this.selectedChildRecordLookupid
                this.params.page = 1
                this.getRecordLookups()
              } else {
                this.selectedChildRecordLookupid = 0
              }
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      } else {
        this.$api.recordLookups
          .getRecordLookups(this.params)
          .then(res => {
            res.data.forEach(item => {
              this.recordLookups.push(item)
            })
            if (res.next_page_url !== null) {
              ++this.params.page
              this.getRecordLookups()
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    },
    selectItems() {
      this.errorRequired(false)
      this.closeLookupModal()
      const data = {
        data: '',
        title: '',
        id: [],
        type: []
      }
      this.selectedItems.forEach((item, index) => {
        data.data = index === 0 ? `${item.data}` : `${data.data}, ${item.data}`
        data.title =
          index === 0 ? `${item.title}` : `${data.title}, ${item.title}`
        data.id.push(item.id)
        data.type.push(item.record_type)
      })
      this.setOldSelectedOptions(this.selectedLookup)
      this.$emit('setData', data)
    },
    closeLookupModal() {
      this.showLookupModal = false
      this.searchText = ''
      this.itemToDelete = {}
    },
    createCustomLookup() {
      return console.log('create')
      if (!this.preloading) {
        this.preloading = true
        if (this.selectedParentItem) {
          this.createLookupParams.record_lookup_id = null
          this.createLookupParams.data = this.searchText
          if (this.selectedParentItem !== true) {
            this.createLookupParams.record_lookup_id = this.selectedParentItem
            const parentSystemLookup = _.find(
              this.getCertificateParentElement.record_lookups_system,
              {
                id: this.selectedParentItem
              }
            )
            const parentCustomLookup = _.find(
              this.getCertificateParentElement.record_lookups_custom,
              {
                id: this.selectedParentItem
              }
            )
            if (parentSystemLookup) {
              this.createLookupParams.record_lookup_type = 'system'
            } else if (parentCustomLookup) {
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
            })
        }
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

<style lang="scss" scoped>
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 0.5rem;
}
</style>
