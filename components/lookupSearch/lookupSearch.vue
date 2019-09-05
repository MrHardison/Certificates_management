<template>
  <div>
    <div class="lookup-wrapper">
      <input-lookup
        :prop-value="selectedLookupTitle"
        :class="{filled: selectedLookupTitle.length}"
        @click.native="showLookupModal = true" />
      <fa
        v-if="selectedLookupTitle.length"
        :icon="['fal', 'times-circle']"
        class="clear-lookup"
        @click="clearLookup"/>
    </div>
    <div v-if="error" class="error-message">This field is required</div>
    <v-modal v-if="showLookupModal" header="Select lookup" @close="closeLookupModal">
      <div slot="body">
        <lookup-selector
          :options="recordLookups"
          :is-loading="isLoading"
          :default-selected="selectedLookup"
          @searchText="searchText = $event"
          @deleteCustomLookup="deleteCustomLookup($event)"
          @update="selectItem($event)"
        />
      </div>
      <div
        slot="footer"
        :class="{'justify-content-between': searchText.length > 0, 'justify-content-end': searchText.length === 0}"
        class="d-flex w-100"
      >
        <button-rounded
          v-show="searchText.length > 0"
          :preloading="preloading"
          class="btn-green rounded small preloading-mr0"
          @click.native="createCustomLookup">Create</button-rounded>
      </div>
    </v-modal>
    <v-modal
      v-if="needToSelectParentModal"
      header="Warning"
      @close="needToSelectParentModal = false"
    >
      <div slot="body">Please select {{ parentElement.name }}</div>
      <div slot="footer" class="d-flex w-100">
        <button-rounded
          class="btn-green rounded small mx-auto"
          @click.native="needToSelectParentModal = false"
        >OK</button-rounded>
      </div>
    </v-modal>
    <v-modal v-if="deleteLookupModal" header="Warning" @close="deleteLookupModal = false">
      <template slot="body">Are you sure you want to delete "{{ itemToDelete.data }}"?</template>
      <div slot="footer" class="d-flex w-100 justify-content-between">
        <button-rounded
          :preloading="deletePreloading"
          class="btn-green rounded small mx-auto preloading-mr0"
          @click.native="confirmDelete"
        >Yes</button-rounded>
        <button-rounded
          class="btn-warning rounded small mx-auto"
          @click.native="deleteLookupModal = false"
        >No</button-rounded>
      </div>
    </v-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VModal from '~/components/vModal/vModal'
import ButtonRounded from '~/components/buttonRounded/'
import lookupSelector from './lookupSelector'
import inputLookup from '~/components/inputLookup'

export default {
  name: 'LookupSearch',
  components: {
    lookupSelector,
    VModal,
    ButtonRounded,
    inputLookup
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    selectedValue: {
      type: String,
      default: ''
    },
    parentData: {
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
      selectedLookup: {},
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
        record_lookup_type: 'system',
        record_type: 'custom',
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
      if (this.type === 'creation') {
        title = this.selectedValue
      } else {
        if (!_.isEmpty(this.selectedLookup)) {
          const system = this.selectedLookup.record_lookups_system
          const custom = this.selectedLookup.record_lookups_custom
          if (system.length) {
            title = system[0].title
          } else if (custom.length) {
            title = custom[0].title
          }
        }
      }
      return title
    },
    parentElement() {
      if (this.type === 'creation') {
        const current = this.getDataListDefaults.data.find(
          i => i.id === this.dataListDefaultId
        )
        if (current.data_list_default_id) {
          const parentID = this.getDataListDefaults.data.find(
            i => i.id === current.data_list_default_id
          )
          const parent = this.parentData.allLookups.find(
            i => i.dataListDefaultId === parentID.id
          )
          if (parent) {
            return parent
          } else return { data: '', name: 'parent element' }
        } else return {}
      } else {
        const parentFormElement = this.$getLookupParent(
          this.parentData.form,
          this.parentData.id
        )
        if (_.isEmpty(parentFormElement)) {
          return {}
        } else {
          const parentCertElement = this.$certificateElementById(
            this.parentData.cert,
            parentFormElement.id
          )
          let obj = _.cloneDeep(parentCertElement)
          obj.name = parentFormElement.name
          return obj
        }
      }
    }
  },
  watch: {
    showLookupModal: {
      handler(data) {
        if (data) {
          if (this.parentElement.hasOwnProperty('data')) {
            if (this.parentElement.data && this.parentElement.data.length) {
              if (this.type === 'creation') {
                this.createLookupParams.record_lookup_id = this.parentElement.type[0]
                this.params.record_lookup_id = this.parentElement.id[0]
                this.params.record_lookup_type = this.parentElement.type[0]
              } else {
                // eslint-disable-next-line
                const systemId =
                  this.parentElement.record_lookups_system[0] &&
                  this.parentElement.record_lookups_system[0].id
                // eslint-disable-next-line
                const customId =
                  this.parentElement.record_lookups_custom[0] &&
                  this.parentElement.record_lookups_custom[0].id
                this.createLookupParams.record_lookup_id = systemId || customId
                this.params.record_lookup_id = systemId || customId
                this.params.record_lookup_type = systemId ? 'system' : 'custom'
              }
              this.getRecordLookups()
            } else {
              this.closeLookupModal()
              this.needToSelectParentModal = true
            }
          } else {
            this.getRecordLookups()
          }
        }
      }
    },
    parentData: {
      deep: true,
      handler(data) {
        if (this.type === 'creation') {
          const selected = data.allLookups.find(
            i => i.dataListDefaultId === this.dataListDefaultId
          )
          this.selectedLookup = selected ? selected : this.selectedLookup
        } else {
          this.selectedLookup = this.$certificateElementById(
            data.cert,
            data.formId
          )
        }
      }
    }
  },
  mounted() {
    if (this.type === 'creation') {
      this.selectedLookup = {
        type: 'system'
      }
    } else {
      this.selectedLookup = this.$certificateElementById(
        this.parentData.cert,
        this.parentData.formId
      )
      if (!this.selectedLookup.data) {
        this.errorRequired(true)
      } else {
        this.errorRequired(false)
      }
    }
  },
  methods: {
    getRecordLookups() {
      this.isLoading = true
      this.recordLookups = []
      this.$api.recordLookups
        .getRecordLookups(this.params)
        .then(res => {
          if (res.hasOwnProperty('data')) {
            res.data.forEach(item => {
              this.recordLookups.push(item)
            })
            if (res.next_page_url !== null) {
              ++this.params.page
              this.getRecordLookups()
            } else {
              this.params.page = 1
            }
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
        type: [item.record_type],
        clear: _.isEmpty(this.parentElement) ? true : false,
        dataListDefaultId: this.dataListDefaultId,
        size: 'single'
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
        // console.log(this.createLookupParams)
        this.$api.recordLookups
          .createRecordLookups(this.createLookupParams)
          .then(res => {
            _.delay(() => {
              this.preloading = false
            }, 1000)
            this.recordLookups = []
            this.getRecordLookups()
            this.selectItem({ ...res, record_type: 'custom' })
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
    clearLookup() {
      this.$emit('clearLookup', 'single')
      if (!this.selectedLookup.data) {
        this.errorRequired(true)
      } else {
        this.errorRequired(false)
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
.lookup-wrapper {
  position: relative;

  .clear-lookup {
    color: red;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 0.2s ease-in-out;
    z-index: 2;

    &:hover {
      transform: translateY(-50%) scale(1.3);
    }
  }
}
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 0.5rem;
}
</style>
