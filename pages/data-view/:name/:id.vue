<template>
  <div class="row">
    <div class="col-12">
      <div v-if="loaded">
        <data-view-title
          :certificate="getCertificate"
          :form="getForm"
          @setName="certificate.name = $event"
          @updateCertificate="updateCertificate()"/>
        <data-view-container
          :data-view-form="dataViewForm"
          :data-view-certificate="dataViewCertificate"
          :selected-record-groups="selectedRecordGroups"
          @setSections="setSectionsToCertificate($event)"
          @copyData="copyCertificateElementsData($event)"/>
      </div>
    </div>
  </div>
</template>

<script>
import { dataViewTitle, dataViewContainer } from '~/blocks/vDataView'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Id',
  components: {
    dataViewTitle,
    dataViewContainer
  },
  data() {
    return {
      certificate: {
        name: '',
        sections: []
      },
      date: '',
      isLoading: false,
      selectedRecordGroups: [],
      loaded: false,
      dataViewForm: null,
      dataViewCertificate: null
    }
  },
  computed: {
    ...mapGetters({
      getCertificate: 'dataView/certificate',
      getForm: 'dataView/form'
    })
  },
  mounted() {
    this.$api()
      .dataView.getById(this.$route.params.id)
      .then(res => {
        this.setCertificate(res.certificate)
        this.setForm(res.form)
        this.dataViewCertificate = res.certificate
        this.dataViewForm = res.form
      })
      .finally(() => {
        this.loaded = true
        this.isLoading = false
      })
  },
  methods: {
    ...mapMutations({
      setCertificate: 'dataView/setCertificate',
      setForm: 'dataView/setForm'
    }),
    copyCertificateElementsData(fromTo) {
      Object.keys(fromTo).forEach(fromId => {
        const fromElement = this.findCertificateElementByFormElementId(fromId)
        const toElement = this.findCertificateElementByFormElementId(
          fromTo[fromId]
        )
        if (fromElement && toElement) {
          toElement.data = fromElement.data
        }
      })
    },
    findCertificateElementByFormElementId(form_section_element_id) {
      form_section_element_id = parseInt(form_section_element_id)
      const section = _.find(this.certificate.sections, {
        elements: [
          {
            form_section_element_id
          }
        ]
      })
      if (section) {
        const element = _.find(section.elements, {
          form_section_element_id
        })
        if (element) {
          return element
        }
      }
      return null
    },
    updateCertificate() {
      const params = {
        name: this.certificate.name,
        sections: this.certificate.sections
      }
      this.$api()
        .dataView.update(this.$route.params.id, params)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    setSectionsToCertificate(sections) {
      this.updateSelectedRecordGroups(sections)
      this.certificate.sections = sections
    },
    updateSelectedRecordGroups(certificateSections) {
      if (!this.getForm) {
        return []
      }
      const recordGroups = []
      this.getForm.sections.forEach(FSection => {
        const FSElements = _.filter(FSection.elements, element => {
          return element.data_list_group_id
        })
        if (FSElements.length) {
          const CSection = _.find(certificateSections, {
            form_section_id: FSection.id
          })
          if (CSection && CSection.elements.length) {
            FSElements.forEach(FSElement => {
              const CSElement = _.find(CSection.elements, {
                form_section_element_id: FSElement.id
              })
              if (CSElement && CSElement.record_group_id) {
                const recordGroup = {
                  data_list_group_id: FSElement.data_list_group_id,
                  record_group_id: CSElement.record_group_id,
                  form_section_id: FSection.id
                }
                recordGroups.push(recordGroup)
              }
            })
          }
        }
      })
      this.selectedRecordGroups = _.uniqBy(recordGroups, recordGroup =>
        [
          recordGroup.record_group_id,
          recordGroup.data_list_group_id,
          recordGroup.form_section_id
        ].join()
      )
    }
  }
}
</script>

<style scoped lang="scss">
</style>
