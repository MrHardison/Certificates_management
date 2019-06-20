<template>
  <div class="col-sm-12 col-md-9 col-lg-9 col-xl-10 responsive">
    <div
      ref="scrollTo"
      class="scroll-to" />
    <div class="card">
      <h3 class="title">{{ formSection.name }}</h3>
      <template v-for="element in $order(formSection.elements)">
        <div
          :key="element.id"
          class="section">
          <template v-if="element.rules.field_type === 1">
            <label class="label">{{ element.rules.description || element.name }}</label>
            <input-standard
              :element-id="element.id"
              :description="element.rules.description"
              :error-text="element.rules.error_message"
              :required="element.rules.required"
              :default-text="element.rules.default_text"
              :computed_value="getCertificateElementData(element.id)"
              :limits="(element.hasOwnProperty('limits') && element.limits.hasOwnProperty('char')) ? element.limits.char : {}"
              :validate="element.rules.validate"
              :cert-id="getCertificateElement(element.id).certificate_section_id"
              @validationError="checkValidationErrors($event)"
              @update="getCertificateElement(element.id).data = $event"/>
          </template>
          <template v-else-if="element.rules.field_type === 2">
            <label class="label">{{ element.rules.description || element.name }}</label>
            <vTextarea
              :element-id="element.id"
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
              @update="getCertificateElement(element.id).data = $event"/>
          </template>
          <template v-else-if="element.rules.field_type === 4">
            <label class="label">{{ element.rules.description || element.name }}</label>
            <lookup-search
              :name="element.name"
              :element-id="element.id"
              :record-groups="recordGroups"
              :message="element.rules.message"
              :required="element.rules.required"
              :el-data-list-default-id="element.data_list_default_id"
              :el-data-list-group-id="element.data_list_group_id"
              :form-section-id="element.form_section_id"
              :form-section-elements="formSection.elements"
              :certificate-elements="certificateSection.elements"
              @validationError="$emit('validationError', $event)"
              @setLookupData="$emit('setLookupData', $event)"
              @updateChildData="$emit('updateChildData', $event)"/>
          </template>
          <template v-else-if="element.rules.field_type === 5">
            <div
              class="item">
              <label
                :for="element.name"
                class="control-label label">{{ element.rules.description || element.name }}</label>
              <canvas-signature
                :key="element.id"
                :id="getSignatureName(element.name)"
                :signature="getCertificateElementData(element.id)"
                :data="element"
                :required="element.rules.required"
                @validationError="$emit('validationError', $event)"
                @update="getCertificateElement(element.id).data = $event"/>
            </div>
          </template>
          <template v-else-if="element.rules.field_type === 6">
            <label class="label">{{ element.rules.description || element.name }}</label>
            <vRadio
              :name="`${element.name}_${element.id}`"
              :element-id="element.id"
              :options="element.rules.options"
              :selected="getCertificateElement(element.id).data"
              :required="element.rules.required"
              @change="getCertificateElement(element.id).data = $event"
              @validationError="$emit('validationError', $event)"/>
          </template>
          <template v-else-if="element.rules.field_type === 7">
            <uiLine />
          </template>
          <template v-else-if="element.rules.field_type === 8">
            <tick-box
              v-if="!currentRecordGroupId"
              :name="element.name"
              @copyData="$emit('copyData', {fromTo: element.rules.from_to, dataListGroupId: element.data_list_group_id, value: $event})"/>
          </template>
          <template v-else-if="element.rules.field_type === 9">
            <uiLabel
              :description="element.rules.description"
              :font-size="getTextFormat(element).font_size"
              :color="getTextFormat(element).color"
              :font-family="getTextFormat(element).font_family"
              :name="element.name"/>
          </template>
          <template v-else-if="element.rules.field_type === 10">
            <div
              class="item">
              <label
                :for="element.name"
                class="control-label label">{{ element.rules.description || element.name }}</label>
              <image-loader
                :key="element.id"
                :element-id="element.id"
                :parent_image="getCertificateElementData(element.id)"
                :required="element.rules.required"
                class="big-logo col-lg-4 col-md-6"
                @validationError="$emit('validationError', $event)"
                @update="getCertificateElement(element.id).data = $event" />
            </div>
          </template>
          <template v-if="element.rules.field_type === 13">
            <data-group-search
              :name="element.name"
              :message="element.rules.message"
              :data-list-group-id="element.data_list_group_id"
              :selected-record-group-id="currentRecordGroupId"
              :selected-record-groups="recordGroups"
              :open-data-group-search="openDataGroupSearch"
              @setDataGroup="setDataGroup($event)"
              @chooseParent="$emit('chooseParent', $event)"
              @closeDataGroupSearch="openDataGroupSearch = false"
              @getRecordGroupParams="recordGroupParams = $event"/>
          </template>
          <template v-if="element.rules.field_type === 15">
            <date-picker
              :name="element.name"
              :element-id="element.id"
              :format="element.rules.formats.browser"
              :type="element.rules.type"
              :required="element.rules.required"
              :new-date="getCertificateElementData(element.id)"
              @validationError="$emit('validationError', $event)"
              @update="getCertificateElement(element.id).data = $event"/>
          </template>
          <template v-if="element.rules.field_type === 16">
            <label class="label">{{ element.rules.description || element.name }}</label>
            <dropdown
              :element-id="element.id"
              :options="element.rules.options"
              :selected-item="getCertificateElement(element.id).data"
              :required="element.rules.required"
              @validationError="$emit('validationError', $event)"
              @update="getCertificateElement(element.id).data = element.rules.options[$event].value"/>
          </template>
          <template v-if="element.rules.field_type === 17">
            <checkbox
              :label="element.rules.description || element.name"
              :selected="element.rules.selected"
              :data="getCertificateElement(element.id).data === 'true' ? true : false"
              :required="element.rules.required"
              @validationError="$emit('validationError', $event)"
              @change="getCertificateElement(element.id).data = $event.toString()"/>
          </template>
          <template v-if="element.rules.field_type === 21">
            <label class="label">{{ element.rules.description || element.name }}</label>
            <multi-lookup-search
              :name="element.name"
              :element-id="element.id"
              :record-groups="recordGroups"
              :message="element.rules.message"
              :description="element.rules.description"
              :el-data-list-default-id="element.data_list_default_id"
              :el-data-list-group-id="element.data_list_group_id"
              :form-section-id="element.form_section_id"
              :form-section-elements="formSection.elements"
              :certificate-elements="certificateSection.elements"
              :required="element.rules.required"
              @setLookupData="$emit('setLookupData', $event)"
              @validationError="$emit('validationError', $event)"
              @updateChildData="$emit('updateChildData', $event)"/>
          </template>
        </div>
      </template>
    </div>
    <certificate-nav
      :sections="allSections"
      :selected-section-id="selectedSectionId"
      :validation-errors="validationErrors"
      @selectedSectionId="$emit('selectedSectionId', $event)" />
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
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
    SpinerLoader,
    canvasSignature,
    imageLoader,
    certificateNav,
    uiLabel
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
    },
    allSections: {
      type: Array,
      default() {
        return []
      }
    },
    allCertSections: {
      type: Array,
      default() {
        return []
      }
    },
    selectedSectionId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      openDataGroupSearch: false,
      recordGroupParams: {},
      validationErrors: []
    }
  },
  computed: {
    ...mapGetters({
      dataListGroups: 'dataListGroups/getdataListGroups'
    }),
    currentRecordGroupId() {
      const find = _.find(this.certificateSection.elements, element => {
        return element.record_group_id
      })
      return find && find.hasOwnProperty('record_group_id')
        ? find.record_group_id
        : null
    }
  },
  mounted() {
    window.onbeforeunload = e => {
      return "Are you sure to leave this page, changes won't save"
    }
    const parentDataListGroup = _.find(this.dataListGroups, {
      id: this.recordGroupParams.dataListGroupId
    })
    if (parentDataListGroup) {
      const parent = _.find(this.recordGroups, {
        data_list_group_id: parentDataListGroup.data_list_group_id
      })
      if (parent) {
        this.recordGroupParams.parentRecordGroupId = parent.record_group_id
      }
    }
  },
  beforeDestroy() {
    this.setRecordGroup()
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
    getTextFormat(element) {
      let text_format = {}
      _.forEach(element.locations, item => {
        if (_.has(item, 'text_format')) {
          text_format = item.text_format
        }
      })
      return text_format
    },
    setDataGroup(data) {
      this.certificateSection.elements = this.certificateSection.elements.map(
        element => {
          element.record_group_id = null
          element.data = ''
          return element
        }
      )
      _.forEach(_.keys(data['child.data']), key => {
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
    },
    toggleDataGroupSearch(element) {
      if (element.data_list_group_id) {
        this.openDataGroupSearch = true
      }
    },
    setRecordGroup() {
      if (this.currentRecordGroupId) {
        this.$api.recordGroups.getById(this.currentRecordGroupId).then(res => {
          const data = res.data
          let difference = 0
          _.forEach(this.formSection.elements, item => {
            if (item.rules.field_name) {
              if (
                data[item.rules.field_name] !==
                this.getCertificateElementData(item.id)
              ) {
                ++difference
                data[item.rules.field_name] = this.getCertificateElementData(
                  item.id
                )
              }
            }
          })
          if (difference > 0) {
            this.$api.recordGroups
              .updateById(this.currentRecordGroupId, { data })
              .then(res => {
                difference = 0
                this.$emit('checkParentSection')
              })
          } else {
            this.$emit('checkParentSection')
          }
        })
      } else if (
        !this.currentRecordGroupId &&
        this.recordGroupParams.dataListGroupId
      ) {
        const createData = {
          data_list_group_id: this.recordGroupParams.dataListGroupId,
          record_group_id: this.getParenRecordGroup(
            this.recordGroupParams.dataListGroupId
          ),
          data: {}
        }
        _.forEach(this.formSection.elements, item => {
          if (item.rules.field_name) {
            createData.data[
              item.rules.field_name
            ] = this.getCertificateElementData(item.id)
          }
        })
        if (_.values(createData.data).join('').length) {
          for (let i = 0; i < _.values(createData.data).length; i++) {
            if (_.values(createData.data)[i].length) {
              this.$api.recordGroups.add(createData).then(res => {
                _.forEach(this.formSection.elements, item => {
                  this.getCertificateElement(item.id).record_group_id = res.id
                })
                this.$emit('showParentSectionError', true)
                this.$emit('checkParentSection')
                // const childRecordGroup = _.find(this.dataListGroups, {
                //   data_list_group_id: this.recordGroupParams.dataListGroupId
                // })
                // if (childRecordGroup) {
                //   this.$emit('resetRecordGroup', childRecordGroup.id)
                // }
              })
              break
            }
          }
        } else {
          this.$emit('checkParentSection')
        }
      } else {
        this.$emit('checkParentSection')
      }
    },
    getParenRecordGroup(data_list_group_id) {
      let recordGroupId = null
      const currentDataListGroup = _.find(this.dataListGroups, {
        id: data_list_group_id
      })
      if (currentDataListGroup.data_list_group_id) {
        const parentFormSection = _.find(this.allSections, {
          elements: [
            {
              data_list_group_id: currentDataListGroup.data_list_group_id
            }
          ]
        })
        if (parentFormSection) {
          for (let i = 0; i < parentFormSection.elements.length; i++) {
            const certElement = this.$getCertificateSectionElementById(
              this.allCertSections,
              parentFormSection.elements[i].id
            )
            if (certElement && certElement.record_group_id) {
              recordGroupId = certElement.record_group_id
              break
            }
          }
        }
      }
      return recordGroupId
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
  padding: 0.75rem 1.25rem;

  .title {
    margin-bottom: 1rem;
  }
}
</style>
