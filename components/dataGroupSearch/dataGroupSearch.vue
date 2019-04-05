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
    <v-modal
      v-if="searchRecordGroupsModal"
      class="find-customer-modal"
      header="Select data group"
      @close="searchRecordGroupsModal = false">
      <template slot="body">
        <input-standard
          :computed_value="params.search_text"
          :search_icon="true"
          label="Search in data groups"
          placeholder="Type the text"
          class="search-input"
          @update="params.search_text = $event"/>
        <div class="modal-list">
          <div
            v-if="isLoading"
            class="content-loading">
            <spinner-loader />
          </div>
          <template v-if="recordGroups">
            <template v-if="recordGroupOptions">
              <template v-for="(item, index) in recordGroupOptions">
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
    <v-modal
      v-if="needToSelectParentModal"
      header="Warning">
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
    <data-group-create
      v-if="createRecordGroupModal"
      :key="dataListGroupId"
      :data-group-id="dataListGroupId"
      :parent-record-group-id="parentRecordGroupId"
      @close="createRecordGroupModal = false"
      @setCustomerData="setData($event)"/>
  </div>
</template>

<script>
import VModal from '~/components/vModal/vModal'
import ButtonRounded from '~/components/buttonRounded/buttonRounded'
import VFooter from '~/components/table/vFooter'
import InputStandard from '~/components/inputStandard/inputStandard'
import DataGroupCreate from '~/components/dataGroupSearch/dataGroupCreate'
import { mapGetters } from 'vuex'
import SpinnerLoader from '~/components/spinerLoader'

export default {
  name: 'DataGroupSearch',
  components: {
    DataGroupCreate,
    VModal,
    ButtonRounded,
    VFooter,
    InputStandard,
    SpinnerLoader
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    dataListGroupId: {
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
      dataGroup: {},
      recordGroups: [],
      searchRecordGroupsModal: false,
      createRecordGroupModal: false,
      needToSelectParentModal: false,
      parentRecordGroupId: null,
      isLoading: false,
      params: {
        data_list_group_id: this.dataListGroupId,
        page: 1,
        search_text: '',
        interval: 500
      }
    }
  },
  computed: {
    ...mapGetters({ getToken: 'token/getApiToken' }),
    recordGroupOptions() {
      const filteredRecordGroup = []
      _.filter(this.recordGroups, item => {
        const recordString = this.renderData(item).toLowerCase()
        recordString.indexOf(this.params.search_text.toLowerCase()) > -1 &&
          filteredRecordGroup.push(item)
      })
      return filteredRecordGroup
    }
  },
  watch: {
    searchRecordGroupsModal: {
      deep: true,
      handler(data) {
        if (data) {
          this.recordGroups = []
          this.getRecordGroups()
        }
      }
    }
  },
  mounted() {
    this.getDataGroup()
  },
  methods: {
    getDataGroup() {
      this.$api()
        .dataGroups.getById(this.dataListGroupId)
        .then(res => {
          this.dataGroup = res
        })
    },
    getRecordGroups() {
      if (this.dataListGroupId || this.dataGroup) {
        if (this.dataGroup.data_list_group_id) {
          const parent = _.find(this.selectedRecordGroups, {
            data_list_group_id: this.dataGroup.data_list_group_id
          })
          if (!parent) {
            this.searchRecordGroupsModal = false
            this.needToSelectParentModal = true
          } else {
            this.needToSelectParentModal = false
            this.parentRecordGroupId = parent.record_group_id
            this.params.record_group_id = parent.record_group_id
          }
        }
        if (this.getToken) {
          this.isLoading = true
          this.$api()
            .recordGroups.get(this.params)
            .then(res => {
              res.data.forEach(item => {
                this.recordGroups.push(item)
              })
              if (res.next_page_url !== null) {
                ++this.params.page
                this.getRecordGroups()
              } else {
                this.params.page = 1
              }
            })
            .finally(() => {
              this.isLoading = false
            })
        }
      }
    },
    setData(data) {
      this.searchRecordGroupsModal = false
      this.$emit('setCustomerData', data)
    },
    renderData(recordGroup) {
      const res = []
      _.forEach(Object.keys(this.$orderObject(this.dataGroup.schema)), key => {
        if (
          recordGroup['child.data'].hasOwnProperty(key) &&
          recordGroup['child.data'][key]
        ) {
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
.modal-list-customer {
  border-bottom: 1px solid rgba($gray, 0.3);
  cursor: pointer;
  font-size: 14px;
  padding: 5px 0;

  &:hover {
    text-decoration: underline;
  }
}

.find-customer-modal {
  .modal-wrapper {
    .modal-container {
      .modal-body {
        .modal-list {
          height: 300px;
          overflow-y: auto !important;
          overflow-x: hidden;
          position: relative;
        }
        .content-loading {
          background: #fff;
          box-sizing: border-box;
          height: 100%;
          left: 50%;
          position: absolute;
          top: 0;
          transform: translateX(-50%);
          width: 100%;
          z-index: 2;

          .spinner-loader {
            left: 50%;
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
  }
}
</style>
