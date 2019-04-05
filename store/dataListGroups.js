export const state = () => ({
  dataListGroups: {}
})

export const mutations = {
  setdataListGroups(state, data) {
    state.dataListGroups = data
  }
}

export const getters = {
  getdataListGroups(state) {
    return state.dataListGroups
  }
}
