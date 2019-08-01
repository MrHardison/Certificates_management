<template>
  <div class="col-sm-12 col-md-9 col-lg-9 col-xl-10 responsive">
    <div class="card">
      <div v-if="isLoading" class="spinner-wrapper">
        <spinner-loader />
      </div>
      <h3 class="title">{{ formSection.name }}</h3>
      <template v-for="element in $order(formSection.elements)">
        <div :key="element.id" class="section">
          <!-- Input -->
          <template v-if="element.rules.field_type === 1">
            <uiLabel
              :description="element.rules.description || element.name"
              :name="element.name" />
            <input-standard
              :element-id="element.id"
              :field-name="element.name"
              :description="element.rules.description"
              :error-text="element.rules.error_message"
              :required="element.rules.required"
              :default-text="element.rules.default_text"
              :computed_value="getCertificateElementData(element.id)"
              :limits="(element.hasOwnProperty('limits') && element.limits.hasOwnProperty('char')) ? element.limits.char : {}"
              :validate="element.rules.validate"
              :cert-id="getCertificateElement(element.id).certificate_section_id"
              @validationError="checkValidationErrors($event)"
              @update="getCertificateElement(element.id).data = $event" />
          </template>
          <!-- Textarea -->
          <template v-else-if="element.rules.field_type === 2">
            <uiLabel
              :description="element.rules.description || element.name"
              :name="element.name" />
            <vTextarea
              :element-id="element.id"
              :field-name="element.name"
              :disabled="element.data_list_group_id ? true : false"
              :computed_value="getCertificateElementData(element.id)"
              :default-text="element.rules.default_text"
              :description="element.rules.description"
              :validate="element.rules.validate"
              :required="element.rules.required"
              :error-text="element.rules.error_message"
              :cert-id="getCertificateElement(element.id).certificate_section_id"
              :limits="(element.hasOwnProperty('limits') && element.limits.hasOwnProperty('char')) ? element.limits.char : {}"
              @validationError="checkValidationErrors($event)"
              @update="getCertificateElement(element.id).data = $event"
            />
          </template>
          <!-- Lookup -->
          <template v-else-if="element.rules.field_type === 4">
            <uiLabel
              :description="element.rules.description || element.name"
              :name="element.name" />
            <lookup-search
              :message="element.rules.message"
              :required="element.rules.required"
              :description="element.rules.description"
              :selected-lookup="getCertificateElement(element.id)"
              :parent-element="getLookupParent(element.form_section_element_id)"
              :data-list-default-id="element.data_list_default_id"
              @validationError="$emit('validationError', $event)"
              @setData="setLookup(element.id, $event)" />
          </template>
          <!-- Canvas -->
          <template v-else-if="element.rules.field_type === 5">
            <uiLabel
              :description="element.rules.description || element.name"
              :name="element.name" />
            <canvas-signature
              :key="element.id"
              :id="getSignatureName(element.name)"
              :signature="getCertificateElementData(element.id)"
              :data="element"
              :required="element.rules.required"
              @validationError="$emit('validationError', $event)"
              @update="getCertificateElement(element.id).data = $event" />
          </template>
          <!-- Radio -->
          <template v-else-if="element.rules.field_type === 6">
            <uiLabel
              :description="element.rules.description || element.name"
              :name="element.name" />
            <vRadio
              :name="`${element.name}_${element.id}`"
              :element-id="element.id"
              :options="element.rules.options"
              :selected="getCertificateElement(element.id).data"
              :required="element.rules.required"
              @change="getCertificateElement(element.id).data = $event"
              @validationError="$emit('validationError', $event)" />
          </template>
          <!-- Line -->
          <template v-else-if="element.rules.field_type === 7">
            <uiLine />
          </template>
          <!-- Tickbox -->
          <template v-else-if="element.rules.field_type === 8">
            <tick-box
              v-if="!currentRecordGroupId"
              :name="element.name"
              @copyData="$emit('copyRecordGroupData', {fromTo: element.rules.from_to, status: $event })" />
          </template>
          <!-- Label -->
          <template v-else-if="element.rules.field_type === 9">
            <uiLabel
              :description="element.rules.description"
              :font-size="getTextFormat(element).font_size"
              :color="getTextFormat(element).color"
              :font-family="getTextFormat(element).font_family"
              :name="element.name"
            />
          </template>
          <!-- Image -->
          <template v-else-if="element.rules.field_type === 10">
            <uiLabel
              :description="element.rules.description || element.name"
              :name="element.name" />
            <image-loader
              :key="element.id"
              :element-id="element.id"
              :parent_image="getCertificateElementData(element.id)"
              :required="element.rules.required"
              :size="element.limits.image"
              @validationError="$emit('validationError', $event)"
              @update="getCertificateElement(element.id).data = $event"
            />
          </template>
          <!-- Data group search -->
          <template v-if="element.rules.field_type === 13">
            <data-group-search
              :name="element.name"
              :data-list-group-id="element.data_list_group_id"
              :data-group="formSection.data_list_group"
              :selected-record-group-id="currentRecordGroupId"
              :open-data-group-search="openDataGroupSearch"
              :parent-record-group-id="parentRecordGroupId"
              @setNewRecordGroup="setNewRecordGroup($event)"
              @chooseParent="$emit('chooseParent', $event)"
              @closeDataGroupSearch="openDataGroupSearch = false"
              @getRecordGroupParams="recordGroupParams = $event"
              @updateChildData="$emit('updateChildData', $event)"
            />
          </template>
          <!-- Date picker -->
          <template v-if="element.rules.field_type === 15">
            <date-picker
              :name="element.name"
              :element-id="element.id"
              :format="element.rules.formats.browser"
              :type="element.rules.type"
              :required="element.rules.required"
              :new-date="getCertificateElementData(element.id)"
              @validationError="$emit('validationError', $event)"
              @update="getCertificateElement(element.id).data = $event"
            />
          </template>
          <!-- Dropdown -->
          <template v-if="element.rules.field_type === 16">
            <uiLabel
              :description="element.rules.description || element.name"
              :name="element.name" />
            <dropdown
              :element-id="element.id"
              :options="element.rules.options"
              :selected-item="getCertificateElement(element.id).data"
              :required="element.rules.required"
              @validationError="$emit('validationError', $event)"
              @update="getCertificateElement(element.id).data = element.rules.options[$event].value"
            />
          </template>
          <!-- Checkbox -->
          <template v-if="element.rules.field_type === 17">
            <uiLabel
              :description="element.rules.description || element.name"
              :name="element.name" />
            <checkbox
              :selected="element.rules.selected"
              :data="getCertificateElement(element.id).data === 'true' ? true : false"
              :required="element.rules.required"
              @validationError="$emit('validationError', $event)"
              @change="getCertificateElement(element.id).data = $event.toString()"
            />
          </template>
          <!-- Large lookup -->
          <template v-if="element.rules.field_type === 21">
            <uiLabel
              :description="element.rules.description || element.name"
              :name="element.name" />
            <multi-lookup-search
              :message="element.rules.message"
              :required="element.rules.required"
              :description="element.rules.description"
              :selected-lookup="getCertificateElement(element.id)"
              :parent-element="getLookupParent(element.form_section_element_id)"
              :data-list-default-id="element.data_list_default_id"
              @validationError="$emit('validationError', $event)"
              @setData="setLookup(element.id, $event)" />
          </template>
        </div>
      </template>
    </div>
    <certificate-nav
      :selected-section-id="selectedSectionId"
      :validation-errors="validationErrors"
      @selectedSectionId="$emit('openSection', $event)" />
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import Checkbox from '~/components/checkbox/checkbox'
import InputStandard from '~/components/inputStandard/inputStandard'
import vTextarea from '~/components/vTextarea/vTextarea'
import vRadio from '~/components/vRadio/vRadio'
import ButtonRounded from '~/components/buttonRounded/buttonRounded'
import SpinnerLoader from '~/components/spinerLoader'
import DatePicker from '~/components/datePicker'
import canvasSignature from '~/components/canvasSignature'
import DataGroupSearch from '~/components/dataGroupSearch'
import lookupSearch from '~/components/lookupSearch'
import multiLookupSearch from '~/components/multiLookupSearch'
import TickBox from '~/components/tickBox'
import Dropdown from '~/components/dropdown'
import imageLoader from '~/components/imageLoader'
import uiLine from '~/components/uiLine'
import certificateNav from '~/components/certificateNav'
import uiLabel from '~/components/label'

export default {
  name: 'DataViewContent',
  components: {
    TickBox,
    Dropdown,
    DataGroupSearch,
    lookupSearch,
    multiLookupSearch,
    Checkbox,
    ButtonRounded,
    InputStandard,
    vTextarea,
    vRadio,
    DatePicker,
    uiLine,
    SpinnerLoader,
    canvasSignature,
    imageLoader,
    certificateNav,
    uiLabel
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    selectedSectionId: {
      type: Number,
      default: null
    },
    selectedFormSection: {
      type: Object,
      default() {
        return {}
      }
    },
    selectedCertSection: {
      type: Object,
      default() {
        return {}
      }
    },
    parentRecordGroupId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      formSection: {},
      certificateSection: {},
      openDataGroupSearch: false,
      recordGroupParams: {},
      validationErrors: []
    }
  },
  computed: {
    ...mapGetters({
      dataListGroups: 'dataListItems/getDataListGroups'
    }),
    currentRecordGroupId() {
      return this.certificateSection.record_group_id
    }
  },
  watch: {
    certificateSection: {
      deep: true,
      handler(data) {
        this.$emit('newCertSection', data)
      }
    },
    selectedCertSection: {
      deep: true,
      handler(data) {
        this.certificateSection = _.cloneDeep(data)
      }
    }
  },
  mounted() {
    this.formSection = _.cloneDeep(this.selectedFormSection)
    this.certificateSection = _.cloneDeep(this.selectedCertSection)
    // window.onbeforeunload = e => {
    //   return "Are you sure to leave this page, changes won't save"
    // }
  },
  methods: {
    getLookupParent(id) {
      const parentFormElement = this.$getLookupParent(
        this.selectedFormSection,
        id
      )
      if (!parentFormElement) {
        return {}
      } else {
        const parentCertElement = this.$certificateElementById(
          this.selectedCertSection,
          parentFormElement.id
        )
        return parentCertElement
      }
    },
    setNewRecordGroup(data) {
      this.certificateSection.elements = this.certificateSection.elements.map(
        element => {
          element.record_group_id = null
          element.data = ''
          return element
        }
      )
      this.certificateSection.record_group_id = data['child.id']
      this.formSection.elements.forEach(e => {
        if (e.rules.field_name) {
          const certElement = this.certificateSection.elements.find(
            el => el.form_section_element_id === e.id
          )
          certElement.data = data['child.data'][e.rules.field_name]
          certElement.record_group_id = data['child.id']
        }
      })
    },
    setLookup(elementId, data) {
      this.getCertificateElement(elementId).record_lookups_system = []
      this.getCertificateElement(elementId).record_lookups_custom = []
      this.getCertificateElement(elementId).data = data.data
      const dataArray = data.data.split(', ')
      const titleArray = data.title.split(', ')
      data.id.forEach((item, index) => {
        this.getCertificateElement(elementId)[
          `record_lookups_${data.type[index]}`
        ].push({
          id: item,
          data: dataArray[index],
          title: titleArray[index],
          record_type: data.type[index]
        })
      })
    },
    getCertificateElement(form_section_id) {
      return this.$certificateElementById(
        this.certificateSection,
        form_section_id
      )
    },
    getCertificateElementData(id) {
      if (this.getCertificateElement(id)) {
        return this.getCertificateElement(id).data
      }
    },
    getTextFormat(element) {
      let text_format = {}
      _.forEach(element.locations, item => {
        if (_.has(item, 'text_format')) {
          text_format = item.text_format
        }
      })
      return text_format
    },
    getSignatureName(name) {
      return name.replace(/\W/g, '').toLowerCase()
    },
    toggleDataGroupSearch(element) {
      if (element.data_list_group_id) {
        this.openDataGroupSearch = true
      }
    },
    checkValidationErrors(error) {
      if (!error.status) {
        if (this.validationErrors.indexOf(error.id) >= 0) {
          this.validationErrors.splice(
            this.validationErrors.indexOf(error.id),
            1
          )
        }
      } else if (error.status) {
        if (this.validationErrors.indexOf(error.id) < 0) {
          this.validationErrors.push(error.id)
        }
      }
      this.$emit('validationError', error)
    }
  }
}
</script>
<style lang="scss" scoped>
.spinner-wrapper {
  background: #fff;
  border-radius: 10px !important;
  left: 50%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  z-index: 2;
}
.spinner-loader {
  left: 50%;
  position: absolute;
  top: 30%;
  transform: translateX(-50%);
}
.responsive {
  @media (max-width: 767px) {
    margin-top: 30px;
  }
}
.section {
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
}
.card {
  position: relative;
  min-height: 200px;
  padding: 0.75rem 1.25rem;

  .title {
    margin-bottom: 1rem;
  }
}
</style>
