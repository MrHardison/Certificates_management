<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
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
                      :field-name="element.field_name"
                      :validate="element.validate"
                      :required="element.required"
                      :computed_value="recordGroup[index]"
                      @error="checkinputErrors($event)"
                      @update="recordGroup[index] = $event"/>
                  </template>
                </div>
              </template>
              <div
                v-if="parentDataListGroup"
                class="col-md-4">
                <label class="label">Parent</label>
                <dropdown
                  :options="options"
                  :show-search="true"
                  @update="selectedOption = $event"/>
              </div>
            </template>
          </div>
          <div
            v-if="isLoading"
            class="loader">
            <spiner-loader/>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-end">
          <button-rounded
            :preloading="preloading"
            class="btn-green rounded small mr-2 preloading-mr0"
            @click.native="addRecord">
            Add
            <fa
              :icon="['fal', 'plus']"
              class="ml-2" />
          </button-rounded>
        </div>
        <v-modal
          v-if="parentError"
          header="Warning"
          @close="parentError = false">
          <template slot="body">
            Need to select parent data group
          </template>
          <div
            slot="footer"
            class="d-flex w-100">
            <button-rounded
              class="btn-green rounded small mx-auto"
              @click.native="parentError = false">
              Close
            </button-rounded>
          </div>
        </v-modal>
      </div>
    </div>
  </div>
</template>

<script>
import InputStandard from '~/components/inputStandard/inputStandard'
import ButtonRounded from '~/components/buttonRounded/buttonRounded'
import VModal from '~/components/vModal/vModal'
import VTable from '~/components/table/vTable'
import Dropdown from '~/components/dropdown'
import SpinerLoader from '~/components/spinerLoader'
import VRecordGroupTabs from '~/blocks/vRecordGroupTabs/vRecordGroupTabs'

export default {
  name: 'Create',
  components: {
    VRecordGroupTabs,
    VTable,
    VModal,
    ButtonRounded,
    InputStandard,
    SpinerLoader,
    Dropdown
  },
  props: {
    dataListGroupId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dataGroup: {},
      recordGroup: {},
      record_group_id: null,
      showModal: false,
      isLoading: false,
      parentDataListGroup: null,
      options: [],
      selectedOption: null,
      page: 1,
      parentError: false,
      parentOptions: [],
      inputErrors: [],
      preloading: false
    }
  },
  mounted() {
    this.$api.dataGroups
      .getById(this.dataListGroupId)
      .then(res => {
        this.dataGroup = res
        this.parentDataListGroup = res.data_list_group_id
      })
      .finally(() => {
        this.isLoading = false
        this.parentDataListGroup ? this.getOptions() : ''
      })
  },
  methods: {
    addRecord() {
      if (this.parentDataListGroup !== 0) {
        if (!this.selectedOption) {
          this.parentError = true
        } else {
          this.addRecordGroup(this.dataListGroupId)
        }
      } else {
        if (this.parentDataListGroup === 0) {
          this.addRecordGroup()
        }
      }
    },
    addRecordGroup(dataListGroupId) {
      if (!this.preloading) {
        this.preloading = true
        this.$api.recordGroups
          .add({
            record_group_id:
              this.parentDataListGroup !== 0
                ? this.getOptionId()
                : this.record_group_id,
            data_list_group_id: this.dataListGroupId,
            data: this.recordGroup,
            deleted_at: null
          })
          .then(res => {
            _.delay(() => {
              this.preloading = false
            }, 1000)
            this.$router.push({
              name: 'data-groups-:name-:id',
              params: {
                name: this.$route.params.name,
                id: res.id
              }
            })
          })
      }
    },
    getOptions() {
      this.$api.recordGroups
        .get({
          data_list_group_id: this.parentDataListGroup,
          page: this.page,
          interval: 10
        })
        .then(res => {
          _.forEach(res.data, item => {
            this.options.push({
              value: Object.values(item['child.data']).join(', '),
              id: item['child.id']
            })
          })
          if (res.next_page_url !== null) {
            ++this.page
            this.getOptions()
          } else {
            this.page = 1
          }
        })
    },
    getOptionId() {
      return this.options[this.options.indexOf(this.selectedOption)].id
    },
    checkinputErrors(item) {
      if (Object.keys(item)[0] === 'add') {
        const isExist = _.find(this.inputErrors, item.add)
        !isExist ? this.inputErrors.push(item.add) : ''
      } else if (Object.keys(item)[0] === 'remove') {
        const index = this.inputErrors.indexOf(item.remove)
        if (index > -1) {
          this.inputErrors.splice(index, 1)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.label {
  color: #818e9e;
  font-size: 16px;
  font-weight: 500;
  line-height: 26px;
}
</style>
