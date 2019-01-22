export const state = () => ({
  api: false
})

export const mutations = {
  set(state, data) {
    state.api = data
  },
  unset(state) {
    state.items = false
  }
}

export const getters = {
  getApiToken: ({ api }) => {
    return api
  }
}
