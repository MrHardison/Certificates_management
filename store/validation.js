export const state = () => ({
  errors: []
})

export const mutations = {
  setErrors(state, data) {
    state.errors = data
  }
}

export const getters = {
  getErrors(state) {
    return state.errors
  }
}
