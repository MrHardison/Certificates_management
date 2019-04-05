export const state = () => ({
  items: [],
  isClosed: false
})

export const mutations = {
  reload(state, data) {
    state.items = data
  },
  toggleMenu(state) {
    state.isClosed = !state.isClosed
  }
}

export const getters = {
  getMenuPage: state => route => {
    return _.find(state.items, { properties: { route } })
  },
  getMenuPages(state) {
    return state.items
  },
  isClosed(state) {
    return state.isClosed
  }
}
