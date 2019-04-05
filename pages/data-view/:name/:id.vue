<template>
  <div class="row">
    <div
      v-if="$route.name === 'data-view-:name-:id'"
      class="col-12">
      <div v-if="loaded">
        <data-view-title
          :certificate="dataViewCertificate"
          :form="dataViewForm"
          :validation-errors="validationErrors"
          @setName="certificate.name = $event"
          @updateCertificate="updateCertificate()"
          @openPdf="render()"/>
        <data-view-container
          :data-view-form="dataViewForm"
          :data-view-certificate="dataViewCertificate"
          :selected-record-groups="selectedRecordGroups"
          @validationError="checkValidationErrors($event)"
          @setSections="setSectionsToCertificate($event)"
          @setNewCertificateSections="setNewCertificateSections($event)"
          @updateCertificateSectionData="updateCertificateSectionData($event)"
          @updateChildData="updateChildData($event)"
          @copyData="saveData($event)"/>
      </div>
    </div>
    <div
      v-if="$route.name === 'data-view-:name-:id-certificate'"
      class="col-12">
      <nuxt-child
        :key="$route.params.id"
        :data-view-certificate="dataViewCertificate"/>
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
      dataListDefaults: null,
      isLoading: false,
      validationErrors: [],
      selectedRecordGroups: [],
      loaded: false,
      dataViewForm: null,
      dataViewCertificate: null,
      params: {
        data_list_group_id: 2,
        record_group_id: null,
        data: {}
      }
    }
  },
  computed: {
    ...mapGetters({
      getSelectedOptions: 'dataView/getOldLookupSelectedOptions'
    })
  },
  mounted() {
    this.$api()
      .dataView.getById(this.$route.params.id)
      .then(res => {
        this.dataViewCertificate = res.certificate
        this.dataViewForm = res.form
      })
      .finally(() => {
        this.loaded = true
        this.isLoading = false
      })
    this.$api()
      .dataGroups.dataListGroups()
      .then(res => {
        this.setdataListGroups(res)
      })
    this.clearOldSelectedOptions()
  },
  methods: {
    ...mapMutations({
      setdataListGroups: 'dataListGroups/setdataListGroups',
      clearOldSelectedOptions: 'dataView/clearOldLookupSelectedOptions'
    }),
    setNewCertificateSections(data) {
      this.dataViewCertificate.sections = data
    },
    saveData(fromTo) {
      Object.keys(fromTo).forEach(fromId => {
        const fromElement = this.findCertificateElementByFormElementId(fromId)
        const toElement = this.findCertificateElementByFormElementId(
          fromTo[fromId]
        )
        toElement.record_group_id = fromElement.record_group_id
        const recordGroupName = _.find(this.dataViewForm.sections, {
          elements: [
            {
              id: toElement.form_section_element_id
            }
          ]
        })
        this.prepareData(recordGroupName)
        recordGroupName.elements.forEach(element => {
          if (element.id === toElement.form_section_element_id) {
            if (fromElement.data.length > 0) {
              this.params.data[element.rules.field_name] = fromElement.data
            } else {
              this.params.data[element.rules.field_name] = null
            }
          }
        })
        if (fromElement.record_group_id) {
          this.params.record_group_id = fromElement.record_group_id
        }
      })
      this.$api()
        .recordGroups.add(this.params)
        .then(res => {
          if (res.status === 200) {
            this.copyCertificateData(fromTo)
          }
        })
    },
    prepareData(recordGroupName) {
      if (this.params.data.length <= 0) {
        recordGroupName.elements.forEach(element => {
          if (
            (element.rules && element.rules.field_type !== 8) ||
            (element.rules && element.rules.field_type !== 13)
          ) {
            this.params.data[element.rules.field_name] = null
          }
        })
      } else {
        return
      }
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
    copyCertificateData(fromTo) {
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
    updateCertificate() {
      if (this.validationErrors.length === 0) {
        const params = {
          name: this.dataViewCertificate.name,
          sections: this.dataViewCertificate.sections
        }
        this.$api().dataView.update(this.$route.params.id, params)
      }
    },
    render() {
      this.$router.push({
        name: `${this.$route.name}-certificate`
      })
    },
    setSectionsToCertificate(sections) {
      this.updateSelectedRecordGroups(sections)
      this.certificate.sections = sections
    },
    updateSelectedRecordGroups(certificateSections) {
      if (!this.dataViewForm.sections) {
        return []
      }
      const recordGroups = []
      this.dataViewForm.sections.forEach(FSection => {
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
    },
    updateCertificateSectionData(data) {
      const updatedSection = _.find(this.dataViewCertificate.sections, {
        elements: [
          {
            form_section_element_id: data.setLookupData.elementId
          }
        ]
      })
      const updatedElement = _.find(updatedSection.elements, {
        form_section_element_id: data.setLookupData.elementId
      })
      updatedElement.record_lookups_system = []
      updatedElement.record_lookups_custom = []
      updatedElement.data = data.setLookupData.data
      const dataArray = data.setLookupData.data.split(', ')
      data.setLookupData.id.forEach((item, index) => {
        updatedElement[`record_lookups_${data.setLookupData.type[index]}`].push(
          {
            id: item,
            data: dataArray[index]
          }
        )
      })
      this.updateChildData(data.updateChildData)
    },
    updateChildData(data) {
      this.$api()
        .dataListDefaults.getDataListDefaults()
        .then(res => {
          this.dataListDefaults = res
        })
        .finally(() => {
          // ______________________update multiLookup child data______________________
          if (data.elements) {
            const oldSystemOptions = this.getSelectedOptions
              .record_lookups_system
            const oldCustomOptions = this.getSelectedOptions
              .record_lookups_custom
            const formSection = _.find(this.dataViewForm.sections, {
              id: data.formSectionId
            })
            const parentFormElement = _.find(formSection.elements, {
              id: data.elements.elementId
            })
            const childFormElement = _.find(formSection.elements, {
              form_section_element_id: parentFormElement.id
            })
            const parentCertificateSections = _.find(
              this.dataViewCertificate.sections,
              {
                elements: [
                  {
                    form_section_element_id: this.getSelectedOptions
                      .form_section_element_id
                  }
                ]
              }
            )
            const parentCertificateElement = _.find(
              parentCertificateSections.elements,
              {
                form_section_element_id: this.getSelectedOptions
                  .form_section_element_id
              }
            )
            const childCertificateElement = _.find(
              parentCertificateSections.elements,
              {
                form_section_element_id: childFormElement.id
              }
            )
            const deletedSystemOptions = _.differenceBy(
              oldSystemOptions,
              parentCertificateElement.record_lookups_system,
              'id'
            )
            const deletedCustomOptions = _.differenceBy(
              oldCustomOptions,
              parentCertificateElement.record_lookups_custom,
              'id'
            )
            let lookupParams = {
              data_list_default_id: childFormElement.data_list_default_id,
              page: 1,
              search_text: '',
              interval: 1000,
              record_lookup_id: null,
              record_lookup_type: null
            }
            const clearOptions = (deletedOptions, type) => {
              if (deletedOptions.length > 0) {
                _.forEach(deletedOptions, option => {
                  lookupParams.record_lookup_id = option.id
                  lookupParams.record_lookup_type = type
                  this.$api()
                    .recordLookups.getRecordLookups(lookupParams)
                    .then(res => {
                      let deleteIds = []
                      _.forEach(res.data, childLookup => {
                        _.forEach(
                          childCertificateElement[`record_lookups_${type}`],
                          (childItem, index, object) => {
                            if (childLookup.id === childItem.id) {
                              deleteIds.push({
                                id: childItem.id,
                                data: childLookup.data
                              })
                            }
                          }
                        )
                      })
                      let childCertificateElementData = childCertificateElement.data.split(
                        ', '
                      )
                      _.forEach(deleteIds, item => {
                        _.remove(
                          childCertificateElement[`record_lookups_${type}`],
                          i => {
                            return i.id === item.id
                          }
                        )
                        _.remove(childCertificateElementData, i => {
                          return i === item.data
                        })
                      })
                      childCertificateElement.data = childCertificateElementData.join(
                        ', '
                      )
                    })
                })
              }
            }
            clearOptions(deletedSystemOptions, 'system')
            clearOptions(deletedCustomOptions, 'custom')
          } else {
            // ______________________update singleLookup child data______________________
            const childElement = _.find(this.dataListDefaults.data, {
              data_list_default_id: data.dataListDefaultId
            })
            if (childElement) {
              const formSection = _.find(this.dataViewForm.sections, {
                id: data.formSectionId
              })
              const formSectionElement = _.find(formSection.elements, {
                data_list_default_id: childElement.id
              })
              if (formSectionElement) {
                const certificateSections = _.find(
                  this.dataViewCertificate.sections,
                  {
                    elements: [
                      {
                        form_section_element_id: formSectionElement.id
                      }
                    ]
                  }
                )
                const certificateElement = _.find(
                  certificateSections.elements,
                  {
                    form_section_element_id: formSectionElement.id
                  }
                )
                certificateElement.data = ''
                certificateElement.record_lookups_system = []
                certificateElement.record_lookups_custom = []
                this.updateChildData({
                  dataListDefaultId: formSectionElement.data_list_group_id,
                  formSectionId: data.formSectionId
                })
              }
            }
          }
          this.clearOldSelectedOptions()
        })
    },
    checkValidationErrors(error) {
      if (error[1] === false) {
        if (this.validationErrors.indexOf(error[0]) >= 0) {
          this.validationErrors.splice(
            this.validationErrors.indexOf(error[0]),
            1
          )
        }
      } else if (error[1] === true) {
        if (this.validationErrors.indexOf(error[0]) < 0) {
          this.validationErrors.push(error[0])
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
