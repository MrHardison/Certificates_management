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
        @chooseParent="chooseParent($event)"
        @copyData="$emit('copyData', $event)"/>
    </template>
  </div>
</template>
<script>
import dataViewSections from './dataViewSections'
import dataViewContent from './dataViewContent'

export default {
  name: 'DataViewContainer',
  components: {
    dataViewSections,
    dataViewContent
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
      formSections: [],
      certificateSections: [],
      selectedSectionId: 0
    }
  },
  computed: {
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
        this.$emit('setSections', data)
      }
    }
  },
  mounted() {
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
    createSections() {
      let certificateSections = []
      this.formSections = this.$order(this.dataViewForm.sections)
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
          certificateSection.elements.push(certificateElement)
        })
        certificateSections.push(certificateSection)
      })
      this.certificateSections = certificateSections
      this.selectedSectionId = this.formSections[0].id
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
        certificate_section_id,
        form_section_element_id,
        record_group_id: null,
        record_lookup_id: null,
        record_lookup_type: null,
        data: ''
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
    }
  }
}
</script>
