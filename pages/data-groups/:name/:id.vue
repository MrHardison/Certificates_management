<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="row">
          <div class="col-12 col-sm-12 col-md-12 col-xl-12 col-xl-12">
            <breadcrumbs
              v-if="breadcrumbs.length"
              :data="breadcrumbs"
              :record-group="recordGroup"/>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <template v-if="dataGroup">
              <template v-for="(element, index) in $orderObject(dataGroup.schema)">
                <div
                  v-if="element.field_type === 1"
                  :key="index"
                  class="col-md-4">
                  <template v-if="element.field_type === 1">
                    <input-standard
                      :label="element.element_label"
                      :placeholder="element.element_label"
                      :limits="element.hasOwnProperty('limits') && element.limits.hasOwnProperty('char') ? element.limits.char : {}"
                      :computed_value="recordGroup[index]"
                      :field-name="element.field_name"
                      :validate="element.validate"
                      :required="element.required"
                      :validation-message="element.validation_message"
                      @validationError="checkValidationErrors($event)"
                      @update="recordGroup[index] = $event"/>
                  </template>
                </div>
              </template>
            </template>
          </div>
          <div
            v-if="isLoading"
            class="loader">
            <spiner-loader/>
          </div>
        </div>
        <div
          class="card-footer d-flex justify-content-end">
          <div class="btn-wrapper">
            <button-rounded
              class="btn-smoke rounded small mr-2 responsive preloading-mr0"
              @click.native="showModal = true">
              <fa
                :icon="['fal', 'trash-alt']"
                class="mr-2" />
              Delete
            </button-rounded>
            <button-rounded
              :preloading="preloading"
              :class="{disabled: validationErrors.length > 0}"
              class="btn-green rounded small mr-2 responsive preloading-mr0"
              @click.native="updateRecord">
              <fa
                :icon="['fas', 'check']"
                class="mr-2" />
              Save
            </button-rounded>
          </div>
        </div>
        <v-modal
          v-if="showModal"
          header="Are you sure want to delete this item?"
          @close="showModal = false">
          <template slot="body">
            Please confirm the deletion of this record. And all the records that depend on it.
          </template>
          <div slot="footer">
            <button-rounded
              class="btn-smoke rounded small mr-2"
              @click.native="showModal = false">
              Cancel
            </button-rounded>
            <button-rounded
              :preloading="deletePreloading"
              class="btn-green rounded small mr-2 preloading-mr0"
              @click.native="deleteRecord">
              Delete
            </button-rounded>
          </div>
        </v-modal>
      </div>
    </div>
    <template v-if="Object.keys(childTabs).length">
      <v-record-group-tabs
        :tabs="childTabs"
        class="mt-3"/>
    </template>
  </div>
</template>

<script>
import InputStandard from '~/components/inputStandard/inputStandard'
import ButtonRounded from '~/components/buttonRounded/buttonRounded'
import VModal from '~/components/vModal/vModal'
import VTable from '~/components/table/vTable'
import SpinerLoader from '~/components/spinerLoader'
import VRecordGroupTabs from '~/blocks/vRecordGroupTabs/vRecordGroupTabs'
import Breadcrumbs from '~/components/breadcrumbs'
import { mapGetters } from 'vuex'

export default {
  name: 'Id',
  components: {
    VRecordGroupTabs,
    VTable,
    VModal,
    ButtonRounded,
    InputStandard,
    SpinerLoader,
    Breadcrumbs,
    preloading: false
  },
  props: {
    dataListGroupId: {
      type: Number,
      default: 0
    },
    childTabs: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      breadcrumbs: [],
      dataGroup: {},
      dataListGroups: [],
      validationErrors: [],
      recordGroup: {},
      recordGroups: [],
      showModal: false,
      isLoading: false,
      params: {
        data_list_group_id: this.dataListGroupId,
        page: 1,
        interval: 100,
        search_text: ''
      },
      preloading: false,
      deletePreloading: false
    }
  },
  computed: {
    ...mapGetters({ getToken: 'token/getApiToken' }),
    childDataListElement() {
      return _.find(this.recordGroups, {
        ['child.data_list_group_id']: this.dataListGroupId
      })
    },
    getDataListElementById() {
      const item = _.find(this.dataListGroups, {
        id: this.dataListGroupId
      })
      if (item) {
        return item.data_list_group_id
      } else {
        return 0
      }
    }
  },
  mounted() {
    this.getDataGroup()
    this.getRecordGroups()
    this.getDataListGroups()
  },
  methods: {
    getDataGroup() {
      if (this.dataListGroupId === 0 && this.$route.params.id) {
        return
      } else if (this.$route.params.id) {
        this.isLoading = true
        this.$api.recordGroups.getById(this.$route.params.id).then(res => {
          this.breadcrumbs = res.breadcrumbs
          if (_.isPlainObject(res.data)) {
            this.recordGroup = res.data
          }
          if (res.data_list_group_id !== this.dataListGroupId) {
            this.$router.push({
              name: 'error'
            })
          }
        })
        if (this.getToken) {
          this.$api.dataGroups
            .getById(this.dataListGroupId)
            .then(res => {
              this.dataGroup = res
            })
            .finally(() => {
              this.isLoading = false
            })
        }
      }
    },
    updateRecord() {
      if (this.validationErrors.length === 0) {
        if (!this.preloading) {
          this.preloading = true
          this.$api.recordGroups
            .updateById(this.$route.params.id, {
              data: this.recordGroup
            })
            .then(res => {
              _.delay(() => {
                this.preloading = false
              }, 1000)
            })
        }
      }
    },
    deleteRecord() {
      if (!this.deletePreloading) {
        this.deletePreloading = true
        this.$api.recordGroups.deleteById(this.$route.params.id).then(() => {
          _.delay(() => {
            this.deletePreloading = false
          }, 1000)
          this.$router.push({
            name: 'data-groups-:name',
            params: { name: this.$route.params.name }
          })
        })
      }
    },
    getRecordGroups() {
      this.$api.recordGroups.get(this.params).then(res => {
        _.forEach(res.data, item => {
          this.recordGroups.push(item)
        })
        if (res.next_page_url) {
          ++this.params.page
          this.getRecordGroups()
        } else {
          this.params.page = 1
        }
      })
    },
    getDataListGroups() {
      this.$api.dataGroups.dataListGroups().then(res => {
        this.dataListGroups = res
      })
    },
    checkValidationErrors(error) {
      if (error[1] === false) {
        if (this.validationErrors.indexOf(error[0]) >= 0) {
          this.validationErrors.splice(
            this.validationErrors.indexOf(error[0]),
            1
          )
        }
      } else if (error[1] === true) {
        if (this.validationErrors.indexOf(error[0]) < 0) {
          this.validationErrors.push(error[0])
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
