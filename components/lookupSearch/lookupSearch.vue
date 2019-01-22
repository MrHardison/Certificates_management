<template>
  <div>
    <button-rounded
      class="btn-green rounded small mr-2"
      @click.native="getDataListDefaults">
      <fa
        :icon="['fal', 'search']"
        class="mr-2" />
      {{ name }}
    </button-rounded>

    <input-standard
      :disabled="true"
      :computed_value="lookupName"
      class="mt-4"
      @update="''"/>

    <!-- Modal for setup record group to certificate -->
    <v-modal
      v-if="searchRecordLookupModal"
      class="findCustomerModal"
      header="Find"
      @close="searchRecordLookupModal = false">
      <template slot="body">
        <input-standard
          :computed_value="searchText"
          label="Search in record lookups"
          placeholder="Type the text"
          class="search-input"
          @update="searchText = $event"/>
        <div class="modal-list">
          <template v-if="recordLookups">
            <template v-if="recordLookups.data.length !== 0">
              <template v-for="(item, index) in recordLookups.data">
                <div
                  :key="index"
                  class="modal-list-customer"
                  @click="setData(item.id, item.data, item.record_type)">
                  {{ item.data }}
                </div>
              </template>
            </template>
          </template>
          <template v-else>
            Nothing to show
          </template>
        </div>
        <v-paginator
          :paginator="pagination"
          class="inmodal-paginator"
          @changePage="page = $event"/>
      </template>
      <div slot="footer">
        <button-rounded
          class="btn-smoke rounded small mr-2"
          @click.native="searchRecordLookupModal = false">
          Close
        </button-rounded>
        <button-rounded
          class="btn-green rounded small mr-2"
          @click.native="createRecordLookupModal = true">
          Create
        </button-rounded>
      </div>
    </v-modal>
    <!-- End modal for setup record group to certificate -->

    <!-- Modal for accept changing record group -->
    <v-modal
      v-if="acceptModal"
      header="warning"
      @close="''">
      <template slot="body">
        {{ message }}
      </template>
      <div slot="footer">
        <button-rounded
          class="btn-smoke rounded small mr-2"
          @click.native="''">
          Close
        </button-rounded>
        <button-rounded
          class="btn-green rounded small mr-2"
          @click.native="''">
          Accept
        </button-rounded>
      </div>
    </v-modal>
    <!-- End modal for accept changing record group -->

    <!-- Modal for parent choosing -->
    <v-modal
      v-if="needToSelectParentModal"
      header="Warning"
      @close="''">
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
    <!-- End modal for parent choosing -->

    <!-- Modal for create record group -->
    <lookup-create
      v-if="createRecordLookupModal"
      :key="data_list_default_id"
      :data-group-id="data_list_default_id"
      :parent-record-group-id="parent_record_group_id"
      @close="createRecordLookupModal = false"
      @setCustomerData="setData($event)"/>
      <!-- End modal for create record group -->
  </div>
</template>

<script>
import VModal from '~/components/vModal/vModal'
import ButtonRounded from '~/components/buttonRounded/buttonRounded'
import VFooter from '~/components/table/vFooter'
import InputStandard from '~/components/inputStandard/inputStandard'
import VPaginator from '~/components/vPaginator'
import LookupCreate from './lookupCreate'

export default {
  name: 'LookupSearch',
  components: {
    LookupCreate,
    VPaginator,
    VModal,
    ButtonRounded,
    VFooter,
    InputStandard
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    data_list_default_id: {
      type: Number,
      default: null
    },
    data_list_group_id: {
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
      searchRecordLookupModal: false,
      createRecordLookupModal: false,
      page: 1,
      acceptModal: false,
      needToSelectParentModal: false,
      dataListDefaultName: null,
      parent_record_group_id: null,
      dataListDefaults: null,
      recordLookups: null,
      pagination: {},
      lookupName: ''
    }
  },
  methods: {
    getDataListDefaults() {
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
      const dataListDefaultId = _.find(this.dataListDefaults.data, {
        id: this.data_list_default_id
      })
      if (dataListDefaultId.hasOwnProperty('data_list_default_id')) {
        if (dataListDefaultId.data_list_default_id === null) {
          this.getRecordLookups(null, null)
        } else if (dataListDefaultId.data_list_default_id !== 0) {
          const newDataListDefaultId = _.find(this.dataListDefaults.data, {
            id: dataListDefaultId.data_list_default_id
          })
          this.dataListDefaultName = newDataListDefaultId.name
          this.needToSelectParentModal = true
        }
      }
    },
    getRecordLookups(record_lookup_id, record_lookup_type) {
      const params = {
        data_list_default_id: this.data_list_default_id,
        page: 1,
        search_text: this.searchText,
        interval: 10,
        record_lookup_id,
        record_lookup_type
      }
      this.$api()
        .recordLookups.getRecordLookups(params)
        .then(res => {
          this.recordLookups = res
          this.pagination = {
            current_page: res.current_page,
            from: res.from,
            to: res.to,
            per_page: parseInt(res.per_page),
            total: res.total,
            last: res.last_page
          }
        })
        .finally(() => {
          this.searchRecordLookupModal = true
        })
    },
    setData(id, data, type) {
      this.lookupName = data
      const args = {
        data,
        id,
        type
      }
      this.$emit('setLookupData', args)
      this.searchRecordLookupModal = false
    }
    // renderData(recordLookup) {
    //   const res = []
    //   Object.keys(this.$orderObject(this.dataGroup.schema)).forEach(key => {
    //     if (recordLookup['child.data'].hasOwnProperty(key)) {
    //       res.push(recordLookup['child.data'][key])
    //     }
    //   })
    //   return res.length ? res.join(', ') : 'Empty record'
    // }
  }
}
</script>

<style lang="scss">
.inmodal-paginator {
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}
.modal-list-customer {
  border-bottom: 1px solid rgba($gray, 0.3);
  cursor: pointer;
  font-size: 14px;
  padding: 5px 0;

  &:hover {
    text-decoration: underline;
  }
}

.findCustomerModal {
  .modal-wrapper {
    .modal-container {
      .modal-body {
        .modal-list {
          overflow-y: auto !important;
          overflow-x: hidden;
          max-height: 300px;
        }
      }
    }
  }
}
</style>
