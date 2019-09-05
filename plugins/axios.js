import Vue from 'vue'

export default ({ app, $axios, redirect, store, route }) => {
  $axios.setHeader('Applicationtype', 'web')
  $axios.setHeader('Applicationversion', 'Browser v3.2')

  $axios.onRequest(config => {
    const token = store.getters['token/getApiToken']
    if (token) {
      config.headers.common.Authorization = `Bearer ${token}`
    }
  })

  const domain = app.context.env.domains.hasOwnProperty(window.location.origin)
    ? app.context.env.domains[window.location.origin]
    : app.context.env.domains.default

  $axios.defaults.baseURL = domain

  $axios.onResponse(response => {
    if (response.data && response.config.headers.Accept === 'application/pdf') {
      return
    }
    if (response.status === 204) {
      return response
    }
    messages(response)
    return response
  })

  $axios.onResponseError(error => {
    if (error.response.status === 401 && route.name !== 'auth-login') {
      store.commit('token/setToken', '')
      messages(error.response)
      redirect('/auth/login')
    } else {
      messages(error.response)
      return error
    }
  })

  const messages = response => {
    if (response && response.data.meta) {
      const meta = response.data.meta
      let alert = {
        group: 'alerts',
        type: 'success',
        text: meta.message
      }
      if (meta.code === 10) {
        alert.type = 'error'
        Object.values(meta.message).forEach(error => {
          error.message
            ? error.message
            : error.forEach(message => {
                alert.text = message
                Vue.notify(alert)
              })
        })
        return meta.message
      }

      switch (meta.code) {
        case 1:
          alert.type = 'success'
          break
        case 2:
          alert.type = 'warn'
          break
        case 3:
          alert.type = 'error'
          break
        default:
          return false
      }
      Vue.notify(alert)
    }
  }
}
