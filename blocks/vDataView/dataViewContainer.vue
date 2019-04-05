<template>
  <div class="row">
    <data-view-sections
      :sections="formSections"
      :section-elements="certificateSections"
      :opened-section-id="selectedSectionId"
      @openSection="selectedSectionId = $event"/>
    <template v-if="activeFormSection">
      <data-view-content
        :key="activeFormSection.id"
        :form-section="activeFormSection"
        :record-groups="selectedRecordGroups"
        :certificate-section="activeCertificateSection"
        @validationError="$emit('validationError', $event)"
        @chooseParent="chooseParent($event)"
        @setLookupData="$emit('updateCertificateSectionData', $event)"
        @updateChildData="$emit('updateChildData', $event)"
        @copyData="$emit('copyData', $event)"
        @resetRecordGroup="resetRecordGroupChild($event)"/>
    </template>
    <v-modal
      v-if="needToSelectParentModal"
      header="Warning">
      <template slot="body">
        Need to choose "{{ parentFormSection.name }}"
      </template>
      <div
        slot="footer"
        class="d-flex w-100">
        <button-rounded
          class="btn-green rounded small mx-auto"
          @click.native="goToChooseParent">
          OK
        </button-rounded>
      </div>
    </v-modal>
  </div>
</template>
<script>
import dataViewSections from './dataViewSections'
import dataViewContent from './dataViewContent'
import ButtonRounded from '~/components/buttonRounded/buttonRounded'
import VModal from '~/components/vModal/vModal'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'DataViewContainer',
  components: {
    dataViewSections,
    dataViewContent,
    ButtonRounded,
    VModal
  },
  props: {
    dataViewForm: {
      type: Object,
      default() {
        return {}
      }
    },
    dataViewCertificate: {
      type: Object,
      default() {
        return {}
      }
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
      user: null,
      company: null,
      formSections: [],
      certificateSections: [],
      selectedSectionId: 0,
      needToSelectParentModal: false,
      parentFormSection: {}
    }
  },
  computed: {
    ...mapGetters({ getdataListGroups: 'dataListGroups/getdataListGroups' }),
    activeFormSection() {
      return _.find(this.formSections, { id: this.selectedSectionId })
    },
    activeCertificateSection() {
      return _.find(this.certificateSections, {
        form_section_id: this.selectedSectionId
      })
    }
  },
  watch: {
    certificateSections: {
      deep: true,
      handler(data) {
        this.getSectionsStatus()
        const userFormSection = this.findUserFormSections()
        if (userFormSection !== undefined) {
          userFormSection.elements.forEach(element => {
            this.fillCompanyData(
              element.rules.holder.who,
              element.rules.holder.field.length === 1
                ? element.rules.holder.field[0]
                : element.rules.holder.field[1],
              element.id
            )
          })
          this.$emit('setSections', data)
        }
      }
    },
    selectedSectionId: {
      deep: true,
      handler(data) {
        data > 0 && this.getSectionParent()
      }
    }
  },
  mounted() {
    this.getCompany()
    this.getUser()
    const removeInterval = id => {
      clearInterval(id)
    }
    const intervalId = setInterval(() => {
      if (Object.keys(this.dataViewForm).length) {
        this.createSections()
        removeInterval(intervalId)
      }
    }, 500)
  },
  methods: {
    ...mapMutations({ setSectionsStatus: 'dataView/setSectionsStatus' }),
    async getCompany() {
      this.company = await this.$api().company.get()
    },
    async getUser() {
      this.user = await this.$api().user.get()
    },
    getSectionsStatus() {
      let sectionsStatus = []
      _.forEach(this.certificateSections, section => {
        let count = 0
        _.forEach(section.elements, element => {
          if (_.isEmpty(element.data)) {
            ++count
          }
        })
        if (
          count < section.elements.length - 1 ||
          count === section.elements.length - 1
        ) {
          sectionsStatus.push({
            form_section_id: section.form_section_id,
            status: 'filled'
          })
        }
      })
      this.setSectionsStatus(sectionsStatus)
    },
    createSections() {
      this.formSections = this.$order(this.dataViewForm.sections)
      this.formSections.some(section => {
        if (!section.autoload) {
          this.selectedSectionId = section.id
          return true
        }
      })
      this.formSections.forEach(section => {
        // find section and create if failed
        const checkSection = _.find(this.dataViewCertificate.sections, {
          form_section_id: section.id
        })
        let certificateSection = checkSection
          ? checkSection
          : this.createSection(this.dataViewCertificate.id, section.id)
        // find element and create if failed
        section.elements.forEach(element => {
          const checkElement = _.find(certificateSection.elements, {
            form_section_element_id: element.id
          })
          const certificateElement = checkElement
            ? checkElement
            : this.createElement(
                certificateSection.hasOwnProperty('id')
                  ? certificateSection.id
                  : null,
                element.id
              )
          const dublicate = _.find(certificateSection.elements, {
            form_section_element_id: certificateElement.form_section_element_id
          })
          !dublicate ? certificateSection.elements.push(certificateElement) : ''
        })
        this.certificateSections.push(certificateSection)
      })
      this.$emit('setNewCertificateSections', this.certificateSections)
    },
    createCertElements(section) {
      return section
    },
    createSection(certificate_id, form_section_id) {
      return {
        certificate_id,
        form_section_id,
        elements: []
      }
    },
    createElement(certificate_section_id, form_section_element_id) {
      return {
        data: '',
        certificate_section_id,
        form_section_element_id,
        record_group_id: null,
        record_lookups_system: [],
        record_lookups_custom: []
      }
    },
    chooseParent(data_list_group_id) {
      const section = _.find(this.formSections, {
        elements: [{ data_list_group_id }]
      })
      if (section) {
        this.selectedSectionId = section.id
      } else {
        console.log('Error in section find function. DataViewContainer:126')
      }
    },
    findUserFormSections() {
      return _.find(this.formSections, {
        autoload: true
      })
    },
    findUserCertificateSections() {
      return _.find(this.certificateSections, {
        form_section_id: this.findUserFormSections().id
      })
    },
    fillCompanyData(source, item, id) {
      if (item) {
        const formElement = _.find(this.findUserFormSections().elements, { id })
        const certificateElement = _.find(
          this.findUserCertificateSections().elements,
          {
            form_section_element_id: id
          }
        )
        let data = null
        if (this.getByHolder(source) && formElement) {
          data = _.get(this[source], formElement.rules.holder.field)
          if (data) {
            certificateElement.data = data
          }
        }
      }
    },
    getByHolder(source) {
      switch (source) {
        case 'user':
          return this.user
        case 'company':
          return this.company
        default:
          return false
      }
    },
    resetRecordGroupChild(data_list_group_id) {
      const dataListElement = _.find(this.getdataListGroups, {
        data_list_group_id
      })
      if (dataListElement) {
        const fElements = _.find(this.formSections, {
          elements: [
            {
              data_list_group_id: dataListElement.id
            }
          ]
        })
        fElements.elements.forEach(fElement => {
          const cElements = _.find(this.certificateSections, {
            elements: [
              {
                form_section_element_id: fElement.id
              }
            ]
          })
          const cElement = _.find(cElements.elements, {
            form_section_element_id: fElement.id
          })
          cElement.data = ''
          cElement.record_group_id = null
        })
        const childElement = _.find(this.getdataListGroups, {
          data_list_group_id: dataListElement.id
        })
        if (childElement !== undefined) {
          this.resetRecordGroupChild(childElement.data_list_group_id)
        }
      }
    },
    getSectionParent() {
      let parentFormSection = null
      let parentCertificateSection = null
      let selectedDataListGroup = null
      let parentDataListGroup = null
      const selectedFormSection = _.find(this.dataViewForm.sections, {
        id: this.selectedSectionId
      })
      _.forEach(selectedFormSection.elements, element => {
        if (element.data_list_group_id > 0) {
          selectedDataListGroup = element.data_list_group_id
        }
      })
      if (selectedDataListGroup) {
        _.forEach(this.getdataListGroups, item => {
          if (item.id === selectedDataListGroup) {
            parentDataListGroup = _.find(this.getdataListGroups, {
              id: item.data_list_group_id
            })
          }
        })
        if (parentDataListGroup) {
          _.forEach(this.dataViewForm.sections, section => {
            _.forEach(section.elements, element => {
              if (element.data_list_group_id === parentDataListGroup.id) {
                parentFormSection = section
              }
            })
          })
          if (parentFormSection) {
            this.parentFormSection = parentFormSection
            parentCertificateSection = _.find(
              this.dataViewCertificate.sections,
              {
                form_section_id: parentFormSection.id
              }
            )
            let count = 0
            _.forEach(parentCertificateSection.elements, item => {
              if (item.record_group_id !== null) {
                ++count
              }
              if (count === 0) {
                this.needToSelectParentModal = true
              }
            })
          }
        }
      }
    },
    goToChooseParent() {
      this.needToSelectParentModal = false
      _.delay(() => {
        this.selectedSectionId = this.parentFormSection.id
      }, 300)
    }
  }
}
</script>
