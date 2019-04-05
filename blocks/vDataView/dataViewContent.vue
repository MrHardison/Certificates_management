<template>
  <div class="col-md-10">
    <div class="card">
      <h3>{{ formSection.name }}</h3>
      <template v-for="element in $order(formSection.elements)">
        <div
          :key="element.id"
          class="section">
          <template v-if="element.rules.field_type === 1">
            <!-- :key="getCertificateElementData(element.id)" -->
            <input-standard
              :label="element.name"
              :class="{default: element.data_list_group_id}"
              :disabled="element.data_list_group_id ? true : false"
              :computed_value="getCertificateElementData(element.id)"
              :limits="(element.hasOwnProperty('limits') && element.limits.hasOwnProperty('char')) ? element.limits.char : {}"
              :validate="element.rules.validate"
              :element-id="element.id"
              @validationError="$emit('validationError', $event)"
              @update="getCertificateElement(element.id).data = $event"/>
          </template>
          <template v-else-if="element.rules.field_type === 2">
            <vTextarea
              :label="element.name"
              :disabled="element.data_list_group_id ? true : false"
              :computed_value="getCertificateElementData(element.id)"
              :limits="(element.hasOwnProperty('limits') && element.limits.hasOwnProperty('char')) ? element.limits.char : {}"
              @update="getCertificateElement(element.id).data = $event"/>
          </template>
          <template v-else-if="element.rules.field_type === 4">
            <lookup-search
              :name="element.name"
              :element-id="element.id"
              :record-groups="recordGroups"
              :message="element.rules.message"
              :el-data-list-default-id="element.data_list_default_id"
              :el-data-list-group-id="element.data_list_group_id"
              :form-section-id="element.form_section_id"
              :form-section-elements="formSection.elements"
              :certificate-elements="certificateSection.elements"
              @setLookupData="$emit('setLookupData', $event)"
              @updateChildData="$emit('updateChildData', $event)"/>
          </template>
          <template v-else-if="element.rules.field_type === 5">
            <div
              class="item">
              <label
                :for="element.name"
                class="control-label label">{{ element.name }}</label>
              <canvas-signature
                :key="element.id"
                :id="getSignatureName(element.name)"
                :signature="getCertificateElementData(element.id)"
                :data="element"
                @update="getCertificateElement(element.id).data = $event"/>
            </div>
          </template>
          <template v-else-if="element.rules.field_type === 6">
            <label class="label">{{ element.name }}</label>
            <vRadio
              :selected="getCertificateElement(element.id).data"
              :name="element.name"
              :options="element.rules.options"
              @change="getCertificateElement(element.id).data = $event"/>
          </template>
          <template v-else-if="element.rules.field_type === 8">
            <tick-box
              :name="element.name"
              :form-section="formSection"
              :certificate-section="certificateSection"
              :copy-data="element.rules.from_to"
              @copyData="$emit('copyData', element.rules.from_to)"/>
          </template>
          <template v-else-if="element.field_type === 10">
            <div
              class="item">
              <label
                :for="element.field_name"
                class="control-label label">{{ element.element_label }}</label>
              <image-loader
                :key="element.id"
                :parent_image="getCertificateElementData(element.id)"
                class="big-logo col-lg-4 col-md-6"
                @update="getCertificateElement(element.id).data = $event" />
            </div>
          </template>
          <template v-if="element.rules.field_type === 13">
            <data-group-search
              :name="element.name"
              :message="element.rules.message"
              :data-list-group-id="element.data_list_group_id"
              :record-groups="recordGroups"
              :selected-record-group-id="currentRecordGroupId"
              :selected-record-groups="recordGroups"
              @setCustomerData="setCustomerData($event)"
              @chooseParent="$emit('chooseParent', $event)"/>
          </template>
          <template v-if="element.rules.field_type === 15">
            <date-picker
              :name="element.name"
              :format="element.rules.formats.browser"
              :new-date="getCertificateElementData(element.id)"
              @date="getCertificateElement(element.id).data = $event"/>
          </template>
          <template v-if="element.rules.field_type === 21">
            <multi-lookup-search
              :name="element.name"
              :element-id="element.id"
              :record-groups="recordGroups"
              :message="element.rules.message"
              :el-data-list-default-id="element.data_list_default_id"
              :el-data-list-group-id="element.data_list_group_id"
              :form-section-id="element.form_section_id"
              :form-section-elements="formSection.elements"
              :certificate-elements="certificateSection.elements"
              @setLookupData="$emit('setLookupData', $event)"
              @updateChildData="$emit('updateChildData', $event)"/>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import Checkbox from '~/components/checkbox/checkbox'
import InputStandard from '~/components/inputStandard/inputStandard'
import vTextarea from '~/components/vTextarea/vTextarea'
import vRadio from '~/components/vRadio/vRadio'
import ButtonRounded from '~/components/buttonRounded/buttonRounded'
import SpinerLoader from '~/components/spinerLoader'
import DatePicker from '~/components/datePicker'
import canvasSignature from '~/components/canvasSignature'
import DataGroupSearch from '~/components/dataGroupSearch'
import lookupSearch from '~/components/lookupSearch'
import multiLookupSearch from '~/components/multiLookupSearch'
import TickBox from '~/components/tickBox'

export default {
  name: 'DataViewContent',
  components: {
    TickBox,
    DataGroupSearch,
    lookupSearch,
    multiLookupSearch,
    Checkbox,
    ButtonRounded,
    InputStandard,
    vTextarea,
    vRadio,
    DatePicker,
    SpinerLoader,
    canvasSignature
  },
  props: {
    formSection: {
      type: Object,
      default() {
        return {}
      }
    },
    certificateSection: {
      type: Object,
      default() {
        return {}
      }
    },
    recordGroups: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    currentRecordGroupId() {
      const find = _.find(this.certificateSection.elements, element => {
        return element.record_group_id
      })
      return find && find.hasOwnProperty('record_group_id')
        ? find.record_group_id
        : null
    }
  },
  methods: {
    getCertificateElement(form_section_element_id) {
      return _.find(this.certificateSection.elements, {
        form_section_element_id
      })
    },
    getCertificateElementData(id) {
      if (this.getCertificateElement(id)) {
        return this.getCertificateElement(id).data
      }
    },
    setCustomerData(data) {
      this.certificateSection.elements = this.certificateSection.elements.map(
        element => {
          element.record_group_id = null
          element.data = ''
          return element
        }
      )
      Object.keys(data['child.data']).forEach(key => {
        const fElement = _.find(this.formSection.elements, {
          rules: { field_name: key }
        })
        if (fElement) {
          const cElement = this.getCertificateElement(fElement.id)
          cElement.data = data['child.data'][key]
          cElement.record_group_id = data['child.id']
        }
      })
      this.$emit('resetRecordGroup', data['child.data_list_group_id'])
    },
    getSignatureName(name) {
      return name.replace(/\W/g, '').toLowerCase()
    }
  }
}
</script>
<style lang="scss" scoped>
.section {
  margin-bottom: 1rem;
}
.card {
  padding: 0.75rem 1.25rem;
}
.label {
  color: $gray;
  font-size: 16px;
  font-weight: 500;
  line-height: 26px;
}
</style>
