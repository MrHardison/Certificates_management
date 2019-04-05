export const state = () => ({
  api: false
})

export const mutations = {
  setToken(state, data) {
    state.api = data
  },
  unsetToken(state) {
    state.items = false
  }
}

export const getters = {
  getApiToken(state) {
    return state.api
  }
}
