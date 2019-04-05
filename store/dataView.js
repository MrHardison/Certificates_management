export const state = () => ({
  certificate: {},
  form: {},
  sectionsStatus: [],
  oldLookupSelectedOptions: {}
})

export const mutations = {
  setCertificate(state, data) {
    state.certificate = data
  },
  setForm(state, data) {
    state.form = data
  },
  setSectionsStatus(state, data) {
    state.sectionsStatus = data
  },
  setOldLookupSelectedOptions(state, data) {
    _.assign(state.oldLookupSelectedOptions, data)
  },
  clearOldLookupSelectedOptions(state) {
    state.oldLookupSelectedOptions = {}
  }
}

export const getters = {
  certificate(state) {
    return state.certificate
  },
  form(state) {
    return state.form
  },
  getSectionsStatus(state) {
    return state.sectionsStatus
  },
  getOldLookupSelectedOptions(state) {
    return state.oldLookupSelectedOptions
  }
}
