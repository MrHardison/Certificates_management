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
                      :computed_value="recordGroup[index]"
                      @update="recordGroup[index] = $event"/>
                  </template>
                </div>
              </template>
              <div
                v-if="data_list_group_id"
                class="col-md-4">
                <label class="label">Parent</label>
                <dropdown
                  :options="options"
                  :enable-pagination="true"
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
          <!-- <button-rounded
            class="btn-smoke rounded small mr-2"
            @click.native="showModal = true">
            Cancel
          </button-rounded> -->
          <button-rounded
            class="btn-green rounded small mr-2"
            @click.native="addRecord">
            Add
          </button-rounded>
        </div>
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
      data_list_group_id: null,
      options: [],
      selectedOption: null,
      page: 1,
      parentOptions: []
    }
  },
  mounted() {
    this.$api()
      .dataGroups.getById(this.dataListGroupId)
      .then(res => {
        this.dataGroup = res
        this.data_list_group_id = res.data_list_group_id
      })
      .finally(() => {
        this.isLoading = false
        this.data_list_group_id ? this.getOptions() : ''
      })
  },
  methods: {
    addRecord() {
      this.$api()
        .recordGroups.add({
          record_group_id:
            this.data_list_group_id === 0
              ? this.record_group_id
              : this.optionId(),
          data_list_group_id: this.dataListGroupId,
          data: this.recordGroup,
          deleted_at: null
        })
        .then(res => {
          this.$router.push({
            name: 'data-groups-:name-:id',
            params: {
              name: this.$route.params.name,
              id: res.data.data.id
            }
          })
        })
        .catch(err => {})
    },
    getOptions() {
      this.$api()
        .recordGroups.get({
          data_list_group_id: this.data_list_group_id,
          page: this.page,
          interval: 10
        })
        .then(res => {
          res.data.forEach(item => {
            this.options.push({
              title: Object.values(item['child.data']).join(', '),
              id: item['child.id']
            })
          })
          for (let i = 2; i <= res.last_page; i++) {
            this.$api()
              .recordGroups.get({
                data_list_group_id: this.data_list_group_id,
                page: i,
                interval: 10
              })
              .then(res => {
                res.data.forEach(item => {
                  this.options.push({
                    title: Object.values(item['child.data']).join(', '),
                    id: item['child.id']
                  })
                })
              })
          }
        })
    },
    optionId() {
      return this.selectedOption > -1
        ? this.options[this.selectedOption].id
        : null
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
