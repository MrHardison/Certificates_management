<template>
  <div>
    <input-standard
      :disabled="true"
      :computed_value="getCertificateElementData"
      :search_icon="true"
      class="left-icon"
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
          :default-selected="getLookupItem"
          @searchText="searchText = $event"
          @getLookupData="getDataListDefaults"
          @deleteCustomLookup="deleteCustomLookup($event)"
          @update="selectItem($event)"/>
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
        Please select {{ dataListDefaultName }}
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
import VModal from '~/components/vModal/vModal'
import ButtonRounded from '~/components/buttonRounded/'
import InputStandard from '~/components/inputStandard/'
import lookupSelector from '~/components/lookupSelector'

export default {
  name: 'LookupSearch',
  components: {
    lookupSelector,
    InputStandard,
    VModal,
    ButtonRounded
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    elementId: {
      type: Number,
      default: null
    },
    elDataListDefaultId: {
      type: Number,
      default: null
    },
    elDataListGroupId: {
      type: Number,
      default: null
    },
    formSectionId: {
      type: Number,
      default: null
    },
    message: {
      type: String,
      default: ''
    },
    formSectionElements: {
      type: Array,
      default() {
        return []
      }
    },
    certificateElements: {
      type: Array,
      default() {
        return []
      }
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchText: '',
      selectedItemId: null,
      selectedItemType: null,
      selectedItemData: null,
      showLookupModal: false,
      needToSelectParentModal: false,
      deleteLookupModal: false,
      itemToDelete: {},
      dataListDefaultName: null,
      dropdownOptions: [],
      dataListDefaults: null,
      recordLookups: [],
      params: {
        data_list_default_id: this.elDataListDefaultId,
        page: 1,
        last_page: null,
        search_text: '',
        interval: 500,
        record_lookup_id: null,
        record_lookup_type: null
      },
      createLookupParams: {
        data_list_default_id: this.elDataListDefaultId,
        record_lookup_id: null,
        record_lookup_type: 'system',
        data: ''
      },
      isLoading: false,
      preloading: false,
      deletePreloading: false,
      error: false
    }
  },
  computed: {
    getCertificateElementData() {
      const element = _.find(this.certificateElements, {
        form_section_element_id: this.elementId
      })
      return element.data
    },
    getLookupItem() {
      return _.find(this.recordLookups, {
        data: this.getCertificateElementData
      })
    },
    getCertificateParentElement() {
      const formElement = _.find(this.formSectionElements, {
        id: this.elementId
      })
      if (formElement.form_section_element_id !== 0) {
        const parentFormElement = _.find(this.formSectionElements, {
          id: formElement.form_section_element_id
        })
        const parentCertificateElement = _.find(this.certificateElements, {
          form_section_element_id: parentFormElement.id
        })
        return parentCertificateElement
      }
    },
    getListItem() {
      if (this.selectedItem !== null) {
        return _.find(this.recordLookups.data, {
          data: this.dropdownOptions[this.selectedItem]
        })
      }
    }
  },
  mounted() {
    if (!this.getCertificateElementData.length) {
      this.errorRequired(true)
    } else {
      this.errorRequired(false)
    }
  },
  methods: {
    getDataListDefaults() {
      this.isLoading = true
      this.recordLookups = []
      this.$api.dataListDefaults
        .getDataListDefaults()
        .then(res => {
          this.dataListDefaults = res
        })
        .finally(() => {
          this.prepareData()
        })
    },
    prepareData() {
      const fElement = _.find(this.formSectionElements, {
        id: this.elementId
      })
      if (
        fElement.form_section_element_id === 0 ||
        fElement.form_section_element_id === null
      ) {
        this.getRecordLookups()
      } else {
        const parentFormElement = _.find(this.formSectionElements, {
          id: fElement.form_section_element_id
        })
        const parentCertificateElement = _.find(this.certificateElements, {
          form_section_element_id: parentFormElement.id
        })
        this.dataListDefaultName = parentFormElement.name
        if (parentCertificateElement.data) {
          let systemId = null
          let customId = null
          parentCertificateElement.record_lookups_custom.forEach(item => {
            customId = item.id
          })
          parentCertificateElement.record_lookups_system.forEach(item => {
            systemId = item.id
          })
          this.createLookupParams.record_lookup_id = systemId || customId
          this.params.record_lookup_id = systemId || customId
          this.params.record_lookup_type = systemId ? 'system' : 'custom'
          this.getRecordLookups()
        } else {
          this.needToSelectParentModal = true
          this.closeLookupModal()
        }
      }
    },
    getRecordLookups() {
      this.isLoading = true
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
    getParentElementData(id) {
      const parentElement = _.find(this.formSectionElements, {
        data_list_default_id: id
      })
      return _.find(this.certificateElements, {
        form_section_element_id: parentElement.id
      })
    },
    selectItem(item) {
      this.selectedItemId = item.id
      this.selectedItemType = item.record_lookup_type
      this.selectedItemData = item.data
      this.setData()
      this.errorRequired(false)
    },
    setData() {
      this.closeLookupModal()
      const childData = {
        dataListDefaultId: this.elDataListDefaultId,
        formSectionId: this.formSectionId
      }
      const data = {
        elementId: this.elementId,
        data: this.selectedItemData,
        id: [this.selectedItemId],
        type: [this.selectedItemType]
      }
      this.$emit('setLookupData', {
        setLookupData: data,
        updateChildData: childData
      })
    },
    closeLookupModal() {
      this.searchText = ''
      this.itemToDelete = {}
      this.showLookupModal = false
    },
    createCustomLookup() {
      if (!this.preloading) {
        this.preloading = true
        this.createLookupParams.data = this.searchText
        if (this.createLookupParams.record_lookup_id) {
          const parentSystemLookup = _.find(
            this.getCertificateParentElement.record_lookups_system,
            {}
          )
          const parentCustomLookup = _.find(
            this.getCertificateParentElement.record_lookups_custom,
            {}
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
