<template>
  <div class="create-modal">
    <div
      class="create-body">
      <div class="row">
        <template v-if="dataGroup">
          <template v-for="(element, index) in $orderObject(dataGroup.schema)">
            <div
              :key="index"
              class="col-md-12 mb-3">
              <template v-if="element.field_type === 1">
                <label class="label">{{ element.description || element.element_label || element.field_name }}</label>
                <input-standard
                  :placeholder="element.element_label"
                  :limits="element.hasOwnProperty('limits') && element.limits.hasOwnProperty('char') ? element.limits.char : {}"
                  :computed_value="customRecordGroup[index]"
                  @update="customRecordGroup[index] = $event"/>
              </template>
              <!-- <template v-else-if="element.field_type === 4">
                <label class="label">{{ element.description || element.element_label || element.field_name }}</label>
                <lookup-search
                  :name="element.field_name"
                  :record-groups="singleLookupParams.recordGroups"
                  :computed-value="customRecordGroup[index]"
                  :required="element.required"
                  :el-data-list-default-id="+element.data_list_default"
                  :form-section-id="singleLookupParams.formSectionId"
                  :form-section-elements="singleLookupParams.formSectionElements"
                  :certificate-elements="singleLookupParams.certificateElements"
                  @validationError="$emit('validationError', $event)"
                  @setLookupData="setData(index, $event)"
                  @updateChildData="$emit('updateChildData', $event)"/>
              </template> -->
              <template v-else-if="element.field_type === 6">
                <label class="label">{{ element.description || element.element_label }}</label>
                <vRadio
                  :name="`${element.field_name}_${element.element_label}`"
                  :options="element.options"
                  :required="element.required"
                  @change="customRecordGroup[index] = $event"
                  @validationError="$emit('validationError', $event)"/>
              </template>
            </div>
          </template>
        </template>
      </div>
    </div>
    <div class="create-footer">
      <button-rounded
        class="btn-smoke rounded small mr-2"
        @click.native="$emit('close')">
        <fa
          :icon="['fas', 'arrow-left']"
          class="mr-2" />
        Return
      </button-rounded>
      <button-rounded
        :preloading="preloading"
        class="btn-green rounded small mr-2 preloading-mr0"
        @click.native="addRecordGroup">
        Create
      </button-rounded>
    </div>
  </div>
</template>

<script>
import ButtonRounded from '~/components/buttonRounded'
import InputStandard from '~/components/inputStandard'
import Dropdown from '~/components/dropdown'
import lookupSearch from '~/components/lookupSearch'
import vRadio from '~/components/vRadio/vRadio'

export default {
  name: 'DataGroupCreate',
  components: {
    InputStandard,
    ButtonRounded,
    Dropdown,
    vRadio,
    lookupSearch
  },
  props: {
    dataListGroupId: {
      type: Number,
      default: 0
    },
    parentRecordGroupId: {
      type: Number,
      default: null
    },
    singleLookupParams: {
      type: Object,
      default() {
        return {}
      }
    },
    dataGroup: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      customRecordGroup: {},
      params: {
        data_list_group_id: null,
        page: 1,
        interval: 10
      },
      preloading: false
    }
  },
  mounted() {
    _.forEach(_.keys(this.dataGroup.schema), item => {
      this.customRecordGroup[item] = ''
    })
  },
  methods: {
    addRecordGroup(dataListGroupId) {
      if (!this.preloading) {
        this.preloading = true
        this.$api.recordGroups
          .add({
            record_group_id: this.parentRecordGroupId,
            data_list_group_id: this.dataListGroupId,
            data: this.customRecordGroup,
            deleted_at: null
          })
          .then(res => {
            _.delay(() => {
              this.preloading = false
            }, 1000)
            const obj = {
              'child.data': res.data,
              'child.id': res.id,
              'child.data_list_group_id': res.data_list_group_id
            }
            this.$emit('setRecordGroup', obj)
            this.$emit('close')
          })
      }
    }
  }
}
</script>

<style lang="scss">
.create-modal {
  .create-body {
    overflow-y: auto;
    overflow-x: hidden;
    height: 432px;
    margin-bottom: 15px;
    position: relative;
  }
  .create-footer {
    box-sizing: border-box;
    display: flex;
    padding: 15px 0;
    position: relative;
    justify-content: space-between;

    &::before {
      background: #e9ecef;
      content: '';
      height: 1px;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 550px;
    }

    @media (max-width: 768px) {
      &::before {
        width: 500px;
      }
    }
    @media (max-width: 544px) {
      &::before {
        width: 320px;
      }
    }
  }
}
</style>
