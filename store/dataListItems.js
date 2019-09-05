export const state = () => ({
  dataListGroups: null,
  dataListDefaults: null
})

export const mutations = {
  setDataListGroups(state, data) {
    state.dataListGroups = data
  },
  setDataListDefaults(state, data) {
    state.dataListDefaults = data
  }
}

export const getters = {
  getDataListGroups: state => state.dataListGroups,
  getDataListDefaults: state => state.dataListDefaults
}

export const actions = {
  async setDataListGroups() {
    const res = await this.$api.dataGroups.dataListGroups()
    this.commit('dataListItems/setDataListGroups', res)
  },
  async setDataListDefaults() {
    const res = await this.$api.dataListDefaults.getDataListDefaults()
    this.commit('dataListItems/setDataListDefaults', res)
  }
}
