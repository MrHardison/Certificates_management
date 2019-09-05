/* eslint-disable prettier/prettier */
export const state = () => ({
  form: {},
  oldLookupSelectedOptions: {}
})

export const getters = {
  form: state => state.form,
  formSectionById: state => id => state.form.sections.find(s => s.id === id),

  getOldLookupSelectedOptions(state) {
    return state.oldLookupSelectedOptions
  }
}

export const mutations = {
  setForm(state, data) {
    data.sections = this.$order(data.sections)
    state.form = data
  },

  setOldLookupSelectedOptions(state, data) {
    state.oldLookupSelectedOptions = _.cloneDeep(data)
  },
  clearOldLookupSelectedOptions(state) {
    state.oldLookupSelectedOptions = {}
  }
}

export const actions = {}
