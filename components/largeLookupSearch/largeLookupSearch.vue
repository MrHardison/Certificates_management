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
        @click="clearLookup" />
    </div>
    <div
      v-if="error"
      class="error-message">This field is required</div>
    <v-modal
      v-if="showLookupModal"
      header="Select lookup"
      @close="closeLookupModal">
      <div slot="body">
        <large-lookup-selector
          :parent-element="parentElement"
          :options="recordLookups"
          :is-loading="isLoading"
          :default-selected="selectedLookup"
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
        Please select {{ parentElement.name }}
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
import inputLookup from '~/components/inputLookup'
import largeLookupSelector from './largeLookupSelector'

export default {
  name: 'LargeLookupSearch',
  components: {
    largeLookupSelector,
    VModal,
    ButtonRounded,
    inputLookup
  },
  props: {
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
      selectedItems: [],
      selectedLookup: {},
      showLookupModal: false,
      needToSelectParentModal: false,
      deleteLookupModal: false,
      itemToDelete: {},
      recordLookups: [],
      childRecordLookupIds: [],
      selectedChildRecordLookupid: 0,
      selectedParentItem: null,
      selectedLookupTitle: '',
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
    },
    parentElement() {
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
  },
  watch: {
    showLookupModal: {
      deep: true,
      handler(data) {
        if (data) {
          this.recordLookups = []
          if (this.parentElement.hasOwnProperty('data')) {
            if (this.parentElement.data && this.parentElement.data.length) {
              this.childRecordLookupIds = [
                // eslint-disable-next-line
                ...this.parentElement.record_lookups_custom.map(i => ({ ...i, record_type: 'custom' })),
                // eslint-disable-next-line
                ...this.parentElement.record_lookups_system.map(i => ({ ...i, record_type: 'system' }))
              ]
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
        this.selectedLookup = this.$certificateElementById(
          data.cert,
          data.formId
        )
        this.setLookupTitle()
      }
    }
  },
  mounted() {
    this.selectedLookup = this.$certificateElementById(
      this.parentData.cert,
      this.parentData.formId
    )
    this.setLookupTitle()
    if (!this.selectedLookup.data) {
      this.errorRequired(true)
    } else {
      this.errorRequired(false)
    }
  },
  methods: {
    ...mapGetters({ getDataListDefaults: 'dataListItems/getDataListDefaults' }),
    ...mapMutations({
      setOldSelectedOptions: 'dataView/setOldLookupSelectedOptions',
      clearOldSelectedOptions: 'dataView/clearOldLookupSelectedOptions'
    }),
    getRecordLookups() {
      this.isLoading = true
      if (this.childRecordLookupIds.length) {
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
            if (res.hasOwnProperty('data')) {
              this.recordLookups = [...this.recordLookups, ...res.data]
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
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      } else {
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
        type: [],
        clear: _.isEmpty(this.parentElement) ? true : false,
        dataListDefaultId: this.dataListDefaultId,
        size: 'large'
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
      if (this.selectedParentItem) {
        if (!this.preloading) {
          this.preloading = true
          this.createLookupParams.record_lookup_id = null
          this.createLookupParams.data = this.searchText
          this.createLookupParams.title = this.searchText
          if (this.selectedParentItem !== true) {
            this.createLookupParams.record_lookup_id = this.selectedParentItem
            if (this.parentElement.record_lookups_system.length) {
              this.createLookupParams.record_lookup_type = 'system'
            } else if (this.parentElement.record_lookups_custom.length) {
              this.createLookupParams.record_lookup_type = 'custom'
            }
          }
          this.$api.recordLookups
            .createRecordLookups(this.createLookupParams)
            .then(res => {
              _.delay(() => {
                this.preloading = false
              }, 1000)
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
            this.getRecordLookups()
          })
      }
    },
    setLookupTitle() {
      let titles = []
      if (!_.isEmpty(this.selectedLookup)) {
        const titlesArray = array => {
          titles = [...titles, ...array]
        }
        titlesArray(this.selectedLookup.record_lookups_system)
        titlesArray(this.selectedLookup.record_lookups_custom)
        titles = titles.map(t => t.title)
        if (titles.length) {
          this.selectedLookupTitle = titles.join(', ')
        } else {
          this.selectedLookupTitle = ''
        }
      }
    },
    clearLookup() {
      this.$emit('clearLookup', 'large')
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

<style lang="scss" scoped>
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
