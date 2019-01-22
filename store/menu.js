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
  getMenuPage: ({ items }) => route => {
    return _.find(items, { properties: { route } })
  },
  getMenuPages: state => {
    return state.items
  },
  isClosed: state => {
    return state.isClosed
  }
}
