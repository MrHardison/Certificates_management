import Vue from 'vue'

export default ({ $axios, redirect, store }) => {
  $axios.setHeader('Applicationtype', 'web')
  $axios.setHeader('Applicationversion', 'Browser v3.2')

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
    messages(error.response)
    return error
  })

  const messages = response => {
    if (response && response.data.meta) {
      let alert = {
        group: 'alerts',
        type: 'success',
        text: response.data.meta.message
      }
      if (response.data.meta.code === 10) {
        alert.type = 'error'
        Object.values(response.data.meta.message).forEach(error => {
          error.forEach(item => {
            alert.text = item
            Vue.notify(alert)
          })
        })
        return response.data.meta.message
      }
      switch (response.data.meta.code) {
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
