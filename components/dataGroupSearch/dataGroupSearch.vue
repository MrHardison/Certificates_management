<template>
  <div>
    <button-rounded
      class="btn-green rounded small mr-2"
      @click.native="searchRecordGroupsModal = true">
      <fa
        :icon="['fal', 'search']"
        class="mr-2" />
      {{ name }}
    </button-rounded>

    <!-- Modal for setup record group to certificate -->
    <v-modal
      v-if="searchRecordGroupsModal"
      class="findCustomerModal"
      header="Find"
      @close="searchRecordGroupsModal = false">
      <template slot="body">
        <input-standard
          :computed_value="searchText"
          label="Search in data groups"
          placeholder="Type the text"
          class="search-input"
          @update="searchText = $event"/>
        <div class="modal-list">
          <template v-if="recordGroups">
            <template v-if="recordGroups.data.length">
              <template v-for="(item, index) in recordGroups.data">
                <div
                  :key="index"
                  class="modal-list-customer"
                  @click="setData(item)">
                  {{ renderData(item) }}
                </div>
              </template>
            </template>
            <template v-else>
              Nothing to show
            </template>
          </template>
          <template v-else>
            Please wait
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
          @click.native="searchRecordGroupsModal = false">
          Close
        </button-rounded>
        <button-rounded
          class="btn-green rounded small mr-2"
          @click.native="createRecordGroupModal = true">
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
        Need to chose parent data group
      </template>
      <div
        slot="footer"
        class="d-flex w-100">
        <button-rounded
          class="btn-green rounded small mx-auto"
          @click.native="goToChooseParent">
          Choose
        </button-rounded>
      </div>
    </v-modal>
    <!-- End modal for parent choosing -->

    <!-- Modal for create record group -->
    <data-group-create
      v-if="createRecordGroupModal"
      :key="data_list_group_id"
      :data-group-id="data_list_group_id"
      :parent-record-group-id="parent_record_group_id"
      @close="createRecordGroupModal = false"
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
import DataGroupCreate from './dataGroupCreate'

export default {
  name: 'DataGroupSearch',
  components: {
    DataGroupCreate,
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
    data_list_group_id: {
      type: Number,
      default: null
    },
    message: {
      type: String,
      default: ''
    },
    selectedRecordGroupId: {
      type: Number,
      default: null
    },
    selectedRecordGroups: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      searchText: '',
      searchRecordGroupsModal: false,
      createRecordGroupModal: false,
      page: 1,
      acceptModal: false,
      needToSelectParentModal: false,
      parent_record_group_id: null
    }
  },
  computed: {
    pagination() {
      if (!this.recordGroups) {
        return {}
      }
      return {
        current_page: this.recordGroups.current_page,
        from: this.recordGroups.from,
        to: this.recordGroups.to,
        per_page: this.recordGroups.per_page,
        total: this.recordGroups.total,
        last: this.recordGroups.last_page
      }
    }
  },
  asyncComputed: {
    recordGroups() {
      if (!this.data_list_group_id || !this.dataGroup) {
        return false
      }
      const params = {
        data_list_group_id: this.data_list_group_id,
        page: this.page,
        search_text: this.searchText,
        interval: 10
      }
      if (this.dataGroup.data_list_group_id) {
        const parent = _.find(this.selectedRecordGroups, {
          data_list_group_id: this.dataGroup.data_list_group_id
        })
        if (!parent) {
          this.needToSelectParentModal = true
          return
        } else {
          this.parent_record_group_id = parent.record_group_id
          params.record_group_id = parent.record_group_id
        }
      }
      return this.$api()
        .recordGroups.get(params)
        .then(res => {
          return res
        })
    },
    dataGroup() {
      return this.$api().dataGroups.getById(this.data_list_group_id)
    }
  },
  methods: {
    setData(data) {
      this.searchRecordGroupsModal = false
      this.$emit('setCustomerData', data)
    },
    renderData(recordGroup) {
      const res = []
      Object.keys(this.$orderObject(this.dataGroup.schema)).forEach(key => {
        if (recordGroup['child.data'].hasOwnProperty(key)) {
          res.push(recordGroup['child.data'][key])
        }
      })
      return res.length ? res.join(', ') : 'Empty record'
    },
    goToChooseParent() {
      this.$emit('chooseParent', this.dataGroup.data_list_group_id)
    }
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
