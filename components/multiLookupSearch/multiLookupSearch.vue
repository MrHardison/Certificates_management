<template>
  <div>
    <input-standard
      :label="name"
      :disabled="true"
      :computed_value="getCertificateElement.data"
      :search_icon="true"
      class="left-icon"
      @click.native="showLookupModal = true"/>
    <v-modal
      v-if="showLookupModal"
      header="Select lookup"
      @close="closeLookupModal">
      <div slot="body">
        <multi-lookup-selector
          :options="recordLookups"
          :is-loading="isLoading"
          :default-selected="getLookupItems"
          :parent-element="getCertificateParentElement"
          @searchText="searchText = $event"
          @selectedParentItem="selectedParentItem = $event"
          @getLookupData="getDataListDefaults"
          @deleteCustomLookup="deleteCustomLookup($event)"
          @update="selectedItems = $event"/>
      </div>
      <div
        slot="footer"
        :class="{'justify-content-between': searchText.length > 0, 'justify-content-end': searchText.length === 0}"
        class="d-flex w-100">
        <button-rounded
          v-show="searchText.length > 0"
          :class="{disabled: !selectedParentItem}"
          class="btn-green rounded small"
          @click.native="createCustomLookup">
          Create
        </button-rounded>
        <button-rounded
          class="btn-green rounded small"
          @click.native="setData">
          Select
        </button-rounded>
      </div>
    </v-modal>
    <v-modal
      v-if="needToSelectParentModal"
      header="Warning">
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
      header="Warning">
      <template slot="body">
        Are you sure to delete "{{ itemToDelete.data }}"?
      </template>
      <div
        slot="footer"
        class="d-flex w-100 justify-content-between">
        <button-rounded
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
import VModal from '~/components/vModal/vModal'
import ButtonRounded from '~/components/buttonRounded/'
import InputStandard from '~/components/inputStandard/'
import multiLookupSelector from '~/components/multiLookupSelector'
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'MultiLookupSearch',
  components: {
    multiLookupSelector,
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
      dataListDefaultName: null,
      dataListDefaults: null,
      recordLookups: [],
      childRecordLookupIds: [],
      selectedChildRecordLookupid: 0,
      selectedParentItem: null,
      isLoading: false,
      params: {
        data_list_default_id: this.elDataListDefaultId,
        page: 1,
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
      }
    }
  },
  computed: {
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
    getCertificateElement() {
      return _.find(this.certificateElements, {
        form_section_element_id: this.elementId
      })
    },
    getLookupItems() {
      let items = []
      const selectedCerfiticateItems = [
        ...this.getCertificateElement.record_lookups_custom,
        ...this.getCertificateElement.record_lookups_system
      ]
      if (selectedCerfiticateItems.length > 0) {
        items = _.intersectionBy(
          this.recordLookups,
          selectedCerfiticateItems,
          'id'
        )
      }
      return items
    }
  },
  watch: {
    getLookupItems: {
      deep: true,
      handler(data) {
        if (this.selectedItems.length === 0) {
          this.selectedItems = data
        }
      }
    }
  },
  methods: {
    ...mapMutations({
      setOldSelectedOptions: 'dataView/setOldLookupSelectedOptions',
      clearOldSelectedOptions: 'dataView/clearOldLookupSelectedOptions'
    }),
    getDataListDefaults() {
      this.isLoading = true
      this.recordLookups = []
      this.$api()
        .dataListDefaults.getDataListDefaults()
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
          this.childRecordLookupIds = [
            ...parentCertificateElement.record_lookups_custom,
            ...parentCertificateElement.record_lookups_system
          ]
          this.params.record_lookup_type = 'system'
          this.getRecordLookups()
        } else {
          this.needToSelectParentModal = true
          this.closeLookupModal()
        }
      }
    },
    getRecordLookups() {
      this.isLoading = true
      if (this.childRecordLookupIds.length > 0) {
        if (this.params.page === 1) {
          this.params.record_lookup_id = this.childRecordLookupIds[
            this.selectedChildRecordLookupid
          ].id
        }
        this.$api()
          .recordLookups.getRecordLookups(this.params)
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
        this.$api()
          .recordLookups.getRecordLookups(this.params)
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
    getParentElementData(id) {
      const parentElement = _.find(this.formSectionElements, {
        data_list_default_id: id
      })
      return _.find(this.certificateElements, {
        form_section_element_id: parentElement.id
      })
    },
    setData() {
      this.closeLookupModal()
      const data = {
        elementId: this.elementId,
        data: '',
        id: [],
        type: []
      }
      const childData = {
        dataListDefaultId: this.elDataListDefaultId,
        formSectionId: this.formSectionId,
        elements: data
      }
      this.selectedItems.forEach((item, index) => {
        data.data = index === 0 ? `${item.data}` : `${data.data}, ${item.data}`
        data.id.push(item.id)
        data.type.push(item.record_type)
      })
      this.getOldSelectedItems()
      this.$emit('setLookupData', {
        setLookupData: data,
        updateChildData: childData
      })
    },
    closeLookupModal() {
      this.showLookupModal = false
      this.searchText = ''
      this.itemToDelete = {}
      this.selectedParentItem = null
    },
    createCustomLookup() {
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
        this.$api()
          .recordLookups.createRecordLookups(this.createLookupParams)
          .then(res => {
            this.recordLookups = []
            this.getRecordLookups()
          })
      }
    },
    deleteCustomLookup(item) {
      this.itemToDelete = item
      this.deleteLookupModal = true
    },
    confirmDelete() {
      this.$api()
        .recordLookups.deleteRecordLookups(this.itemToDelete.id)
        .then(res => {
          this.deleteLookupModal = false
          this.recordLookups = []
          this.getRecordLookups()
        })
    },
    getOldSelectedItems() {
      const selectedFormElement = _.find(this.formSectionElements, {
        id: this.elementId
      })
      const selectedCertificateElement = _.find(this.certificateElements, {
        form_section_element_id: selectedFormElement.id
      })
      this.setOldSelectedOptions(selectedCertificateElement)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
