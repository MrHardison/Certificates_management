export default ({ axios }, inject) => {
  const formSectionElement = (form, id = 0) => {
    id = +id
    if (!form) {
      return {}
    } else {
      const formSection = _.find(
        _.has(form, 'sections') ? form.sections : form,
        {
          elements: [{ id }]
        }
      )
      return _.find(formSection.elements, { id })
    }
  }
  inject('getFormSectionElementById', formSectionElement)
  const certificateSectionElement = (cert, form_section_element_id = 0) => {
    form_section_element_id = +form_section_element_id
    if (!cert) {
      return {}
    } else {
      const certificateSection = _.find(
        _.has(cert, 'sections') ? cert.sections : cert,
        {
          elements: [{ form_section_element_id }]
        }
      )
      if (certificateSection) {
        return _.find(certificateSection.elements, {
          form_section_element_id
        })
      } else {
        return {}
      }
    }
  }
  inject('getCertificateSectionElementById', certificateSectionElement)
  const certificateElementById = (section, form_section_element_id = 0) => {
    const element = _.find(section.elements, { form_section_element_id })
    if (element) {
      return element
    } else return {}
  }
  inject('certificateElementById', certificateElementById)

  const getLookupParent = (section, id = 0) => {
    const element = _.find(section.elements, { id })
    if (element) {
      return element
    } else return {}
  }
  inject('getLookupParent', getLookupParent)
}
