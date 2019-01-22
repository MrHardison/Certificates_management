export const state = () => ({
  certificate: {},
  form: {}
})

export const mutations = {
  setCertificate(state, data) {
    state.certificate = data
  },
  setForm(state, data) {
    state.form = data
  }
}

export const getters = {
  certificate: ({ certificate }) => {
    return certificate
  },
  form: ({ form }) => {
    return form
  }
}
