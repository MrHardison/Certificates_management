export const state = () => ({
  api: null
})

export const mutations = {
  setToken(state, data) {
    state.api = data
  }
}

export const getters = {
  getApiToken: state => state.api
}
