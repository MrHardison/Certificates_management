<template>
  <div class="row">
    <div
      v-if="$route.name === 'data-view-:name-:id'"
      class="col-12">
      <data-view-title
        :certificate-name="certificate.name"
        :validation-errors="validationErrors"
        :preloading="preloading"
        @setName="certificate.name = $event"
        @render="saveCertData($event)"
        @save="saveCertData(false, selectedSectionId)"/>
      <div class="row">
        <data-view-sections
          :selected-section-id="selectedSectionId"
          :form="form"
          :sections-status="sectionsStatus"
          @openSection="changeSection($event)" />
        <template v-if="selectedSectionId">
          <data-view-content
            :key="selectedSectionId"
            :selected-form-section="selectedFormSection"
            :selected-cert-section="getCurrentCertSection()"
            :selected-section-id="selectedSectionId"
            :is-loading="contentLoading"
            :parent-record-group-id="parentCertSection ? parentCertSection.record_group_id : null"
            @chooseParent="chooseParent($event)"
            @updateChildData="$emit('updateChildData', $event)"
            @copyRecordGroupData="copyRecordGroupData($event)"
            @newCertSection="setNewCertSection($event)"
            @validationError="checkValidationErrors($event)"
            @openSection="changeSection($event)" />
        </template>
      </div>
    </div>
    <v-modal
      v-if="needToSelectParentModal"
      header="Warning"
      @close="needToSelectParentModal = false">
      <template slot="body">
        Need to choose "{{ needToSelectParentTitle }}"
      </template>
      <div
        slot="footer"
        class="d-flex w-100">
        <button-rounded
          class="btn-gray rounded small mx-auto"
          @click.native="needToSelectParentModal = false">Close
        </button-rounded>
      </div>
    </v-modal>
    <div
      v-if="$route.name === 'data-view-:name-:id-certificate'"
      class="col-12">
      <nuxt-child
        :key="$route.params.id"
        :data-view-certificate="certificate"
        @showReturnButton="$emit('showReturnButton')"/>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import {
  dataViewTitle,
  dataViewSections,
  dataViewContent
} from '~/blocks/vDataView'
import VModal from '~/components/vModal'
import ButtonRounded from '~/components/buttonRounded'

export default {
  name: 'Id',
  components: {
    dataViewTitle,
    dataViewSections,
    dataViewContent,
    VModal,
    ButtonRounded
  },
  data() {
    return {
      selectedSectionId: 0,
      form: {},
      certificate: {},
      isLoading: false,
      contentLoading: false,
      needToSelectParentModal: false,
      needToSelectParentTitle: '',
      newCertSection: {},
      loaded: false,
      dataListGroupId: null,
      sectionsStatus: [],
      params: {
        data_list_group_id: null,
        record_group_id: null,
        data: {}
      },
      preloading: {
        update: false,
        preview: false
      },
      validationErrors: []
    }
  },
  computed: {
    ...mapGetters({
      getDataListGroups: 'dataListItems/getDataListGroups',
      getDataListDefaults: 'dataListItems/getDataListDefaults',
      getSelectedOptions: 'dataView/getOldLookupSelectedOptions'
    }),
    selectedFormSection() {
      if (this.form.hasOwnProperty('sections')) {
        return this.form.sections.find(s => s.id === this.selectedSectionId)
      }
    },
    selectedCertSection() {
      if (this.certificate.hasOwnProperty('sections')) {
        return this.certificate.sections.find(
          s => s.form_section_id === this.selectedSectionId
        )
      }
    },
    parentFormSection() {
      return (
        this.form.sections.find(
          s => s.id === this.selectedFormSection.data_list_group_section_id
        ) || null
      )
    },
    parentCertSection() {
      if (this.parentFormSection) {
        return this.certificate.sections.find(
          s => s.form_section_id === this.parentFormSection.id
        )
      } else return null
    }
  },
  watch: {
    '$route.name': {
      deep: true,
      handler(data) {
        this.getCertificate()
      }
    },
    certificate: {
      deep: true,
      handler(data) {
        data.sections.forEach(section => {
          const filled = section.elements.filter(e => {
            if (e.data) {
              return e.data.length > 0
            }
          })
          if (filled.length <= section.elements.length && filled.length !== 0) {
            this.sectionsStatus = [
              ...this.sectionsStatus,
              section.form_section_id
            ]
          }
        })
      }
    }
  },
  mounted() {
    this.getCertificate()
    this.setDataListGroups()
    this.setDataListDefaults()
    this.clearOldSelectedOptions()
  },
  methods: {
    ...mapMutations({
      setForm: 'dataView/setForm',
      clearOldSelectedOptions: 'dataView/clearOldLookupSelectedOptions',
      setStorageValidationErrors: 'validation/setErrors'
    }),
    ...mapActions({
      setDataListGroups: 'dataListItems/setDataListGroups',
      setDataListDefaults: 'dataListItems/setDataListDefaults'
    }),
    getCertificate() {
      this.$api.dataView
        .getById(this.$route.params.id)
        .then(res => {
          this.form = res.form
          this.setForm(res.form)
          this.$order(this.form.sections).some(section => {
            if (!section.autoload) {
              this.selectedSectionId = section.id
              return true
            }
          })
          this.modifyCertificate(res.certificate)
        })
        .finally(() => {
          this.loaded = true
          this.isLoading = false
          if (this.selectedFormSection) {
            this.dataListGroupId = this.selectedFormSection.data_list_group_id
          }
        })
    },
    modifyCertificate(certificate) {
      this.form.sections.forEach(section => {
        // find section and create if failed
        const checkedSection = certificate.sections.find(
          s => s.form_section_id === section.id
        )
        const certificateSection = checkedSection
          ? checkedSection
          : {
              certificate_id: certificate.id,
              form_section_id: section.id,
              elements: [],
              record_group_id: null
            }
        // find element and create if failed
        section.elements.forEach(element => {
          const checkedElement = certificateSection.elements.find(
            e => e.form_section_element_id === element.id
          )
          const certificateElement = checkedElement
            ? checkedElement
            : {
                // eslint-disable-next-line prettier/prettier
                data: element.rules.default_text ? element.rules.default_text : '',
                certificate_section_id: certificateSection.id
                  ? certificateSection.id
                  : null,
                form_section_element_id: element.id,
                record_group_id: null,
                record_lookups_system: [],
                record_lookups_custom: []
              }
          if (
            // eslint-disable-next-line
            !certificateSection.elements.find(e => e === certificateElement)
          ) {
            certificateSection.elements.push(certificateElement)
          }
        })
        if (!certificate.sections.find(s => s === certificateSection)) {
          certificate.sections.push(certificateSection)
        }
      })
      this.certificate = certificate
    },
    changeSection(id) {
      if (this.selectedSectionId !== id) {
        window.scroll({
          top: 0,
          left: 0
        })
        if (this.validationErrors.length) {
          return this.$alerts({ text: 'You have validation errors!' })
        } else {
          if (this.selectedFormSection) {
            this.dataListGroupId = this.selectedFormSection.data_list_group_id
          }
          if (this.dataListGroupId) {
            this.updateRecordGroup(id)
          } else {
            if (this.checkParentSection(id)) {
              this.saveCertData(false, id)
            }
          }
        }
      }
    },
    saveCertData(render, id) {
      if (!this.preloading.preview) {
        this.contentLoading = true
        const params = {
          name: this.certificate.name,
          sections: [this.getCurrentCertSection()]
        }
        this.preloading.preview = true
        this.$api.dataView
          .update(this.$route.params.id, params)
          .then(res => {
            this.selectedSectionId = id
            this.modifyCertificate(res)
            if (render) {
              this.$router.push({
                name: `${this.$route.name}-certificate`
              })
            }
          })
          .finally(() => {
            this.contentLoading = false
            this.preloading.preview = false
          })
      }
    },
    updateRecordGroup(id) {
      const selectedCertSection = this.getCurrentCertSection()
      // Edit Record Group
      // eslint-disable-next-line
      if (selectedCertSection.hasOwnProperty('record_group') && selectedCertSection.record_group) {
        const recordGroup = selectedCertSection.record_group
        const params = {
          data: recordGroup.data,
          record_lookups_custom: recordGroup.record_lookups_custom,
          record_lookups_system: recordGroup.record_lookups_system
        }
        let difference = 0
        this.selectedFormSection.elements.forEach(item => {
          const element = this.$getCertificateSectionElementById(
            this.certificate,
            item.id
          )
          if (item.rules.field_name) {
            // eslint-disable-next-line
            if (_.isNull(params.data[item.rules.field_name])) {
              params.data[item.rules.field_name] = ''
            }
            if (
              // eslint-disable-next-line
              params.data[item.rules.field_name] !== element.data
            ) {
              ++difference
              // eslint-disable-next-line
              params.data[item.rules.field_name] = element.data

              const editLookups = type => {
                const computedType = `record_lookups_${type}`
                params[computedType] = params[computedType].filter(
                  e =>
                    e.data_list_default_id !==
                    element[computedType][0].data_list_default_id
                )
                params[computedType].push(element[computedType][0])
              }

              if (element.record_lookups_system.length) {
                editLookups('system')
              } else if (element.record_lookups_custom.length) {
                editLookups('custom')
              }
            }
          }
        })
        if (difference > 0) {
          this.$api.recordGroups
            .updateById(selectedCertSection.record_group_id, params)
            .then(res => {
              difference = 0
              if (this.checkParentSection(id)) {
                this.saveCertData(false, id)
              }
            })
        } else {
          if (this.checkParentSection(id)) {
            this.saveCertData(false, id)
          }
        }
        // Create Record Group
      } else if (!selectedCertSection.record_group_id) {
        const createData = {
          data_list_group_id: this.dataListGroupId,
          record_group_id: this.parentCertSection
            ? this.parentCertSection.record_group_id
            : null,
          data: {},
          record_lookups_custom: [],
          record_lookups_system: []
        }

        _.forEach(this.selectedFormSection.elements, item => {
          if (item.rules.field_name) {
            const certElement = this.$getCertificateSectionElementById(
              this.certificate,
              item.id
            )
            createData.data[item.rules.field_name] = certElement.hasOwnProperty(
              'data'
            )
              ? certElement.data
              : ''
            const fillLookupData = type => {
              const computedType = `record_lookups_${type}`
              if (certElement[computedType].length) {
                certElement[computedType].forEach(i => {
                  createData[computedType].push(i.id)
                })
              }
            }
            fillLookupData('system')
            fillLookupData('custom')
          }
        })
        if (_.values(createData.data).join('').length) {
          for (let i in _.values(createData.data)) {
            if (i.length) {
              this.$api.recordGroups.add(createData).then(res => {
                selectedCertSection.record_group = res
                selectedCertSection.record_group_id = res.id
                _.forEach(this.selectedFormSection.elements, item => {
                  this.$getCertificateSectionElementById(
                    this.certificate,
                    item.id
                  ).record_group_id = res.id
                })
                if (this.checkParentSection(id)) {
                  this.saveCertData(false, id)
                }
              })
              break
            }
          }
        } else {
          if (this.checkParentSection(id)) {
            this.saveCertData(false, id)
          }
        }
        // Change section without any changes
      } else {
        if (this.checkParentSection(id)) {
          this.saveCertData(false, id)
        }
      }
    },
    copyRecordGroupData({ fromTo, status }) {
      Object.keys(fromTo).forEach(fromId => {
        const fromElement = this.$getCertificateSectionElementById(
          this.certificate,
          fromId
        )
        const toElement = this.$getCertificateSectionElementById(
          this.certificate,
          +fromTo[fromId]
        )
        if (fromElement && toElement) {
          toElement.data = status ? fromElement.data : ''
        }
      })
    },
    checkParentSection(id) {
      /*
        Check parent section for selected record group
      */
      const nextSection = this.form.sections.find(s => s.id === id)
      if (nextSection.data_list_group_section_id) {
        // eslint-disable-next-line
        const parentSection = this.form.sections.find(s => s.id === nextSection.data_list_group_section_id)
        // eslint-disable-next-line
        const parentCertSection = this.certificate.sections.find(s => s.form_section_id === parentSection.id)
        if (!parentCertSection.record_group_id) {
          this.needToSelectParentTitle = parentSection.name
          this.needToSelectParentModal = true
          return false
        } else return true
      } else return true
    },
    setNewCertSection(section) {
      const index = this.certificate.sections.findIndex(
        s => s.form_section_id === section.form_section_id
      )
      this.certificate.sections[index] = section
    },
    getCurrentCertSection() {
      if (this.certificate.hasOwnProperty('sections')) {
        return this.certificate.sections.find(
          s => s.form_section_id === this.selectedSectionId
        )
      } else return {}
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
      const [...validationErrors] = this.validationErrors
      this.setStorageValidationErrors(validationErrors)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
