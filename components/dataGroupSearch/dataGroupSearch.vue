<template>
  <div>
    <button-rounded
      class="btn-green rounded small mr-2 responsive-text"
      @click.native="searchRecordGroupsModal = true">
      <fa
        :icon="['fal', 'search']"
        class="mr-2" />
      {{ name }}
    </button-rounded>
    <v-modal
      v-if="searchRecordGroupsModal"
      :header="modalTitle()"
      :class="{'create-data-group': createRecordGroup}"
      class="find-datagroup-modal"
      @close="closeRecordGroupModal">
      <template
        v-if="!createRecordGroup"
        slot="body">
        <input-standard
          :computed_value="params.search_text"
          :search_icon="true"
          :label="`Search in ${dataGroup.name}`"
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
                  class="modal-list-datagroup">
                  <div
                    class="modal-list-datagroup-item"
                    @click="setData(item)">
                    {{ renderData(item) }}
                  </div>
                  <fa
                    v-if="selectedRecordGroupId !== item['child.id']"
                    :icon="['fas', 'times-circle']"
                    class="delete-datagroup"
                    @click="deleteRecordGroup(item)"/>
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
      <template
        v-if="createRecordGroup"
        slot="body">
        <data-group-create
          :key="dataListGroupId"
          :data-list-group-id="dataListGroupId"
          :parent-record-group-id="parentRecordGroupId"
          @setRecordGroup="setData($event)"
          @close="updateList"/>
      </template>
      <div
        v-if="!createRecordGroup"
        slot="footer">
        <button-rounded
          class="btn-smoke rounded small mr-2"
          @click.native="searchRecordGroupsModal = false">
          Close
        </button-rounded>
        <button-rounded
          class="btn-green rounded small mr-2"
          @click.native="createRecordGroup = true">
          Create New Record
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
    <v-modal
      v-if="confirmDelete"
      header="Warning"
      @close="confirmDelete = false">
      <template slot="body">
        Are you sure that you want to delete this item?
      </template>
      <div
        slot="footer"
        class="d-flex w-100 justify-content-between">
        <button-rounded
          class="btn-smoke rounded small"
          @click.native="confirmDelete = false">
          Close
        </button-rounded>
        <button-rounded
          class="btn-green rounded small"
          @click.native="deleteRecordGroup(false)">
          Delete
        </button-rounded>
      </div>
    </v-modal>
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
    openDataGroupSearch: {
      type: Boolean,
      default: false
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
      createRecordGroup: false,
      needToSelectParentModal: false,
      confirmDelete: false,
      deleteItem: null,
      parentRecordGroupId: null,
      isLoading: false,
      params: {
        data_list_group_id: this.dataListGroupId,
        page: 1,
        search_text: '',
        interval: 500,
        record_group_id: null
      },
      preloading: false
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
    },
    openDataGroupSearch: {
      deep: true,
      handler(data) {
        if (data) {
          this.searchRecordGroupsModal = true
        }
        this.$emit('closeDataGroupSearch')
      }
    }
  },
  created() {
    const data = {
      dataListGroupId: this.dataListGroupId,
      parentRecordGroupId: this.parentRecordGroupId
    }
    this.$emit('getRecordGroupParams', data)
  },
  mounted() {
    this.getDataGroup()
  },
  methods: {
    getDataGroup() {
      this.$api.dataGroups.getById(this.dataListGroupId).then(res => {
        this.dataGroup = res
      })
    },
    getRecordGroups() {
      if (this.dataListGroupId || this.dataGroup) {
        const parent = _.find(this.selectedRecordGroups, {
          data_list_group_id: this.dataGroup.data_list_group_id
        })
        if (parent) {
          this.parentRecordGroupId = parent.record_group_id
          this.params.record_group_id = parent.record_group_id
        }
        if (this.getToken) {
          this.isLoading = true
          this.$api.recordGroups
            .get(this.params)
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
      this.$emit('setDataGroup', data)
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
    },
    modalTitle() {
      if (!this.createRecordGroup) {
        return `Select ${this.dataGroup.name}`
      } else if (this.createRecordGroup) {
        return 'Create'
      }
    },
    updateList() {
      this.recordGroups = []
      this.getRecordGroups()
      this.createRecordGroup = false
    },
    deleteRecordGroup(item) {
      if (item) {
        this.deleteItem = item
        this.confirmDelete = true
      } else if (this.deleteItem) {
        if (!this.preloading) {
          this.preloading = true
          this.confirmDelete = false
          this.$api.recordGroups
            .deleteById(this.deleteItem['child.id'])
            .then(res => {
              this.deleteItem = null
              _.delay(() => {
                this.preloading = false
              })
              this.recordGroups = []
              this.getRecordGroups()
            })
        }
      }
    },
    closeRecordGroupModal() {
      this.searchRecordGroupsModal = false
      this.createRecordGroup = false
    }
  }
}
</script>

<style lang="scss">
.modal-list-datagroup {
  align-items: center;
  border-bottom: 1px solid rgba($gray, 0.3);
  display: flex;
  font-size: 14px;
  padding: 5px 0;
  justify-content: space-between;

  &-item {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
  .delete-datagroup {
    cursor: pointer;
    color: red;
    margin: 0 10px;
    transition: transform 0.1s ease-in-out;

    &:hover {
      transform: scale(1.5);
    }
  }
}

.find-datagroup-modal {
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
