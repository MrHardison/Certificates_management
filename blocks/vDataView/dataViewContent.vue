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
              :parent-data="{id: element.form_section_element_id, formId: element.id, form: formSection, cert: certificateSection}"
              :data-list-default-id="element.data_list_default_id"
              :message="element.rules.message"
              :required="element.rules.required"
              :description="element.rules.description"
              @validationError="$emit('validationError', $event)"
              @clearLookup="clearLookup(element.id, element.data_list_default_id, $event)"
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
              :selected="getCertificateElement(element.id).data ? getCertificateElement(element.id).data : ''"
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
            <large-lookup-search
              :parent-data="{id: element.form_section_element_id, formId: element.id, form: formSection, cert: certificateSection}"
              :data-list-default-id="element.data_list_default_id"
              :message="element.rules.message"
              :required="element.rules.required"
              :description="element.rules.description"
              @validationError="$emit('validationError', $event)"
              @clearLookup="clearLookup(element.id, element.data_list_default_id, $event)"
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
import Checkbox from '~/components/vCheckbox'
import InputStandard from '~/components/inputStandard'
import vTextarea from '~/components/vTextarea/vTextarea'
import vRadio from '~/components/vRadio/vRadio'
import ButtonRounded from '~/components/buttonRounded'
import SpinnerLoader from '~/components/spinerLoader'
import DatePicker from '~/components/datePicker'
import canvasSignature from '~/components/canvasSignature'
import DataGroupSearch from '~/components/dataGroupSearch'
import lookupSearch from '~/components/lookupSearch'
import largeLookupSearch from '~/components/largeLookupSearch'
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
    largeLookupSearch,
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
      dataListGroups: 'dataListItems/getDataListGroups',
      dataListDefaults: 'dataListItems/getDataListDefaults',
      getSelectedOptions: 'dataView/getOldLookupSelectedOptions'
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
    ...mapMutations({
      setOldSelectedOptions: 'dataView/setOldLookupSelectedOptions',
      clearOldSelectedOptions: 'dataView/clearOldLookupSelectedOptions'
    }),
    setNewRecordGroup(data) {
      this.certificateSection.elements = this.certificateSection.elements.map(
        element => {
          element.record_group_id = null
          element.data = ''
          element.record_lookups_system = []
          element.record_lookups_custom = []
          return element
        }
      )
      this.certificateSection.record_group = {
        data: { ...data['child.data'] },
        archive: data['child.archive'],
        data_list_group_id: data['child.data_list_group_id'],
        id: data['child.id'],
        record_lookups_system: data.record_lookups_system,
        record_lookups_custom: data.record_lookups_custom
      }
      this.certificateSection.record_group_id = data['child.id']
      this.formSection.elements.forEach(e => {
        if (e.rules.field_name) {
          const certElement = this.certificateSection.elements.find(
            el => el.form_section_element_id === e.id
          )
          if (data['child.data'][e.rules.field_name]) {
            certElement.data = data['child.data'][e.rules.field_name]
          }
          certElement.record_group_id = data['child.id']

          const fillLookupsArray = type => {
            const computedType = `record_lookups_${type}`
            data[computedType].forEach(i => {
              if (e.data_list_default_id === i.data_list_default_id) {
                certElement[computedType].push(i)
                let match = this.certificateSection.record_group[
                  computedType
                ].find(e => e.data_list_default_id === i.data_list_default_id)
                if (match) {
                  match = i
                } else {
                  this.certificateSection.record_group[computedType].push(i)
                }
              }
            })
          }

          fillLookupsArray('system')
          fillLookupsArray('custom')
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
          record_type: data.type[index],
          data_list_default_id: data.dataListDefaultId
        })
      })
      this.resetChildLookup(data)
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
    resetChildLookup({ size, dataListDefaultId, full }) {
      const childDataListElement = this.dataListDefaults.data.find(
        e => e.data_list_default_id === dataListDefaultId
      )

      if (size === 'single') {
        if (childDataListElement) {
          const formSectionElement = this.formSection.elements.find(
            e => e.data_list_default_id === childDataListElement.id
          )
          if (formSectionElement) {
            const certSectionElement = this.$certificateElementById(
              this.certificateSection,
              formSectionElement.id
            )
            certSectionElement.data = ''
            certSectionElement.title = ''
            certSectionElement.record_lookups_system = []
            certSectionElement.record_lookups_custom = []
            this.resetChildLookup({
              size,
              dataListDefaultId: formSectionElement.data_list_default_id
            })
          }
        }
      } else if (size === 'large') {
        const old = {
          system: this.getSelectedOptions.record_lookups_system,
          custom: this.getSelectedOptions.record_lookups_custom
        }
        if (childDataListElement) {
          const childFormElement = this.formSection.elements.find(
            e => e.data_list_default_id === childDataListElement.id
          )
          if (childFormElement) {
            const parentFormElement = this.formSection.elements.find(
              e => childFormElement.form_section_element_id === e.id
            )
            if (parentFormElement && childFormElement) {
              const parentCertElement = this.$certificateElementById(
                this.certificateSection,
                parentFormElement.id
              )
              const childCertElement = this.$certificateElementById(
                this.certificateSection,
                childFormElement.id
              )

              const clearOptions = (deletedOptions, type) => {
                console.log(deletedOptions)
                if (deletedOptions.length) {
                  deletedOptions.forEach(option => {
                    this.$api.recordLookups
                      .getRecordLookups({
                        data_list_default_id:
                          childFormElement.data_list_default_id,
                        page: 1,
                        search_text: '',
                        interval: 1000,
                        record_lookup_id: option.id,
                        record_lookup_type: type
                      })
                      .then(res => {
                        let deleteIds = []
                        res.data.forEach(childLookup => {
                          const el = childCertElement[
                            `record_lookups_${type}`
                          ].filter(e => e.id === childLookup.id)
                          deleteIds = [...deleteIds, ...el]
                        })
                        let childCertElementData = childCertElement.data.split(
                          ', '
                        )
                        deleteIds.forEach(item => {
                          _.remove(
                            childCertElement[`record_lookups_${type}`],
                            i => {
                              return i.id === item.id
                            }
                          )
                          _.remove(childCertElementData, i => {
                            return i === item.data
                          })
                        })
                        childCertElement.data = childCertElementData.join(', ')
                      })
                  })
                }
              }

              if (parentCertElement && childCertElement) {
                const deletedSystemOptions = _.differenceBy(
                  old.system,
                  parentCertElement.record_lookups_system,
                  'id'
                )
                const deletedCustomOptions = _.differenceBy(
                  old.custom,
                  parentCertElement.record_lookups_custom,
                  'id'
                )
                if (full) {
                  childCertElement.data = ''
                  childCertElement.record_lookups_system = []
                  childCertElement.record_lookups_custom = []
                } else {
                  // eslint-disable-next-line
                  clearOptions(deletedSystemOptions, 'system')
                  // eslint-disable-next-line
                  clearOptions(deletedCustomOptions, 'custom')
                }
              }
              // Infinity recursion
              // this.resetChildLookup({
              //   size,
              //   dataListDefaultId: parentFormElement.data_list_default_id
              // })
            }
          }
        }
      }
    },
    clearLookup(id, dataListDefaultId, size) {
      const element = this.getCertificateElement(id)
      element.data = ''
      element.record_lookups_system = []
      element.record_lookups_custom = []
      this.resetChildLookup({
        size,
        dataListDefaultId,
        full: size === 'large' ? true : false
      })
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
