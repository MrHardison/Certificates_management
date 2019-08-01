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
import { dataViewTitle, dataViewContainer } from '~/blocks/vDataView'
import dataViewSections from '~/blocks/vDataView/dataViewSections'
import dataViewContent from '~/blocks/vDataView/dataViewContent'
import VModal from '~/components/vModal/vModal'
import ButtonRounded from '~/components/buttonRounded/buttonRounded'

export default {
  name: 'Id',
  components: {
    dataViewTitle,
    dataViewContainer,
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
                data: '',
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
        const data = selectedCertSection.record_group.data
        let difference = 0
        _.forEach(this.selectedFormSection.elements, item => {
          if (item.rules.field_name) {
            // eslint-disable-next-line
            if (_.isNull(data[item.rules.field_name])) {
              data[item.rules.field_name] = ''
            }
            if (
              // eslint-disable-next-line
              data[item.rules.field_name] !== this.$getCertificateSectionElementById(this.certificate, item.id).data
            ) {
              ++difference
              // eslint-disable-next-line
              data[item.rules.field_name] = this.$getCertificateSectionElementById(this.certificate, item.id).data
            }
          }
        })
        if (difference > 0) {
          this.$api.recordGroups
            .updateById(selectedCertSection.record_group_id, { data })
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
          data: {}
        }

        _.forEach(this.selectedFormSection.elements, item => {
          if (item.rules.field_name) {
            // eslint-disable-next-line
            createData.data[item.rules.field_name] = this.$getCertificateSectionElementById(this.certificate, item.id).hasOwnProperty('data') ? this.$getCertificateSectionElementById(this.certificate, item.id).data : ''
          }
        })
        if (_.values(createData.data).join('').length) {
          for (let i in _.values(createData.data)) {
            if (i.length) {
              this.$api.recordGroups.add(createData).then(res => {
                const currentCertSection = this.getCurrentCertSection()
                currentCertSection.record_group_id = res.id
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
      return this.certificate.sections.find(
        s => s.form_section_id === this.selectedSectionId
      )
    },
    // ---------------------------------------------------------------------------------------------------------

    // saveData({ fromTo, value, dataListGroupId }) {
    //   _.forEach(_.keys(fromTo), fromId => {
    //     const fromElement = this.$getCertificateSectionElementById(
    //       this.certificate.sections,
    //       fromId
    //     )
    //     const toElement = this.$getCertificateSectionElementById(
    //       this.certificate.sections,
    //       fromTo[fromId]
    //     )
    //     if (value) {
    //       toElement.data = fromElement.data
    //     } else {
    //       toElement.data = ''
    //     }
    //     // toElement.record_group_id = fromElement.record_group_id
    //     // const recordGroupName = _.find(this.form.sections, {
    //     //   elements: [
    //     //     {
    //     //       id: toElement.form_section_element_id
    //     //     }
    //     //   ]
    //     // })
    //     // this.prepareData(recordGroupName)
    //     // _.forEach(recordGroupName.elements, element => {
    //     //   if (element.id === toElement.form_section_element_id) {
    //     //     if (fromElement.data.length) {
    //     //       this.params.data[element.rules.field_name] = fromElement.data
    //     //     } else {
    //     //       this.params.data[element.rules.field_name] = null
    //     //     }
    //     //   }
    //     // })
    //     // if (fromElement.record_group_id) {
    //     //   this.params.record_group_id = fromElement.record_group_id
    //     // }
    //   })
    //   // this.params.data_list_group_id = data.dataListGroupId
    //   // this.$api
    //   //   .recordGroups.add(this.params)
    //   //   .then(res => {
    //   //     if (res.status === 200) {
    //   //       this.copyCertificateData(data.fromTo)
    //   //     }
    //   //   })
    // },
    // prepareData(recordGroupName) {
    //   if (this.params.data.length <= 0) {
    //     _.forEach(recordGroupName.elements, element => {
    //       if (
    //         (element.rules && element.rules.field_type !== 8) ||
    //         (element.rules && element.rules.field_type !== 13)
    //       ) {
    //         this.params.data[element.rules.field_name] = null
    //       }
    //     })
    //   } else {
    //     return
    //   }
    // },
    // updateSelectedRecordGroups(certificateSections) {
    //   if (!this.form.sections) {
    //     return []
    //   }
    //   const recordGroups = []
    //   this.form.sections.forEach(FSection => {
    //     const FSElements = _.filter(FSection.elements, element => {
    //       return element.data_list_group_id
    //     })
    //     if (FSElements.length) {
    //       const CSection = _.find(certificateSections, {
    //         form_section_id: FSection.id
    //       })
    //       if (CSection && CSection.elements.length) {
    //         FSElements.forEach(FSElement => {
    //           const CSElement = _.find(CSection.elements, {
    //             form_section_element_id: FSElement.id
    //           })
    //           if (CSElement && CSElement.record_group_id) {
    //             const recordGroup = {
    //               data_list_group_id: FSElement.data_list_group_id,
    //               record_group_id: CSElement.record_group_id,
    //               form_section_id: FSection.id
    //             }
    //             recordGroups.push(recordGroup)
    //           }
    //         })
    //       }
    //     }
    //   })
    //   this.selectedRecordGroups = _.uniqBy(recordGroups, recordGroup =>
    //     [
    //       recordGroup.record_group_id,
    //       recordGroup.data_list_group_id,
    //       recordGroup.form_section_id
    //     ].join()
    //   )
    // },
    // updateCertificateSectionData({ setLookupData, updateChildData }) {
    //   const updatedSection = _.find(this.dataViewCertificate.sections, {
    //     elements: [
    //       {
    //         form_section_element_id: setLookupData.elementId
    //       }
    //     ]
    //   })
    //   const updatedElement = _.find(updatedSection.elements, {
    //     form_section_element_id: setLookupData.elementId
    //   })
    //   updatedElement.record_lookups_system = []
    //   updatedElement.record_lookups_custom = []
    //   updatedElement.data = setLookupData.data
    //   updatedElement.title = setLookupData.title
    //   const dataArray = setLookupData.data.split(', ')
    //   setLookupData.id.forEach((item, index) => {
    //     updatedElement[`record_lookups_${setLookupData.type[index]}`].push({
    //       id: item,
    //       data: dataArray[index],
    //       record_type: setLookupData.type[index]
    //     })
    //   })
    //   this.updateChildData(updateChildData)
    // },
    // updateChildData({ elements, dataListDefaultId, formSectionId }) {
    //   // ______________________update multiLookup child data______________________
    //   if (elements) {
    //     const oldSystemOptions = this.getSelectedOptions.record_lookups_system
    //     const oldCustomOptions = this.getSelectedOptions.record_lookups_custom
    //     const formSection = _.find(this.form.sections, {
    //       id: formSectionId
    //     })
    //     const parentFormElement = _.find(formSection.elements, {
    //       id: elements.elementId
    //     })
    //     const childFormElement = _.find(formSection.elements, {
    //       form_section_element_id: parentFormElement.id
    //     })
    //     const parentCertificateSections = _.find(
    //       this.dataViewCertificate.sections,
    //       {
    //         elements: [
    //           {
    //             form_section_element_id: this.getSelectedOptions
    //               .form_section_element_id
    //           }
    //         ]
    //       }
    //     )
    //     const parentCertificateElement = _.find(
    //       parentCertificateSections.elements,
    //       {
    //         form_section_element_id: this.getSelectedOptions
    //           .form_section_element_id
    //       }
    //     )
    //     if (childFormElement) {
    //       const childCertificateElement = _.find(
    //         parentCertificateSections.elements,
    //         {
    //           form_section_element_id: childFormElement.id
    //         }
    //       )
    //       let lookupParams = {
    //         data_list_default_id: childFormElement.data_list_default_id,
    //         page: 1,
    //         search_text: '',
    //         interval: 1000,
    //         record_lookup_id: null,
    //         record_lookup_type: null
    //       }
    //       const clearOptions = (deletedOptions, type) => {
    //         if (deletedOptions.length > 0) {
    //           _.forEach(deletedOptions, option => {
    //             lookupParams.record_lookup_id = option.id
    //             lookupParams.record_lookup_type = type
    //             this.$api()
    //               .recordLookups.getRecordLookups(lookupParams)
    //               .then(res => {
    //                 let deleteIds = []
    //                 _.forEach(res.data, childLookup => {
    //                   _.forEach(
    //                     childCertificateElement[`record_lookups_${type}`],
    //                     (childItem, index, object) => {
    //                       if (childLookup.id === childItem.id) {
    //                         deleteIds.push({
    //                           id: childItem.id,
    //                           data: childLookup.data
    //                         })
    //                       }
    //                     }
    //                   )
    //                 })
    //                 let childCertificateElementData = childCertificateElement.data.split(
    //                   ', '
    //                 )
    //                 _.forEach(deleteIds, item => {
    //                   _.remove(
    //                     childCertificateElement[`record_lookups_${type}`],
    //                     i => {
    //                       return i.id === item.id
    //                     }
    //                   )
    //                   _.remove(childCertificateElementData, i => {
    //                     return i === item.data
    //                   })
    //                 })
    //                 childCertificateElement.data = childCertificateElementData.join(
    //                   ', '
    //                 )
    //               })
    //           })
    //         }
    //       }
    //       const deletedSystemOptions = _.differenceBy(
    //         oldSystemOptions,
    //         parentCertificateElement.record_lookups_system,
    //         'id'
    //       )
    //       const deletedCustomOptions = _.differenceBy(
    //         oldCustomOptions,
    //         parentCertificateElement.record_lookups_custom,
    //         'id'
    //       )
    //       clearOptions(deletedSystemOptions, 'system')
    //       clearOptions(deletedCustomOptions, 'custom')
    //     }
    //   } else {
    //     // ______________________update singleLookup child data______________________
    //     const childElement = _.find(this.getDataListDefaults.data, {
    //       data_list_default_id: dataListDefaultId
    //     })
    //     if (childElement) {
    //       const formSection = _.find(this.form.sections, {
    //         id: formSectionId
    //       })
    //       const formSectionElement = _.find(formSection.elements, {
    //         data_list_default_id: childElement.id
    //       })
    //       if (formSectionElement) {
    //         const certificateSections = _.find(
    //           this.dataViewCertificate.sections,
    //           {
    //             elements: [
    //               {
    //                 form_section_element_id: formSectionElement.id
    //               }
    //             ]
    //           }
    //         )
    //         const certificateElement = _.find(certificateSections.elements, {
    //           form_section_element_id: formSectionElement.id
    //         })
    //         certificateElement.data = ''
    //         // certificateElement.title = ''
    //         certificateElement.record_lookups_system = []
    //         certificateElement.record_lookups_custom = []
    //         this.updateChildData({
    //           dataListDefaultId: formSectionElement.data_list_group_id,
    //           formSectionId: formSectionId
    //         })
    //       }
    //     }
    //   }
    //   this.clearOldSelectedOptions()
    // },
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
