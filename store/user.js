export const state = () => ({
  username: null,
  email: null,
  id: null,
  company_id: null
})

export const mutations = {
  setUserName(state, data) {
    state.username = data
  },
  setEmail(state, data) {
    state.email = data
  },
  setUserId(state, data) {
    state.id = data
  },
  setCompanyId(state, data) {
    state.company_id = data
  }
}

export const getters = {
  getUserName(state) {
    return state.username
  },
  getEmail(state) {
    return state.email
  },
  getUserId(state) {
    return state.id
  },
  getCompanyId(state) {
    return state.company_id
  }
}
