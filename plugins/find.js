export default ({ axios }, inject) => {
  const formSectionElement = (form, id = 0) => {
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
    if (!cert) {
      return {}
    } else {
      const certificateSection = _.find(
        _.has(cert, 'sections') ? cert.sections : cert,
        {
          elements: [{ form_section_element_id }]
        }
      )
      return _.find(certificateSection.elements, {
        form_section_element_id
      })
    }
  }
  inject('getCertificateSectionElementById', certificateSectionElement)
}
