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
  setDataListGroups() {
    this.$api.dataGroups.dataListGroups().then(res => {
      this.commit('dataListItems/setDataListGroups', res)
    })
  },
  setDataListDefaults() {
    this.$api.dataListDefaults.getDataListDefaults().then(res => {
      this.commit('dataListItems/setDataListDefaults', res)
    })
  }
}
