/* eslint-disable prettier/prettier */
import Vue from 'vue'

export default ({ axios }, inject) => {
  const alerts = args => {
    Vue.notify({text: 'message', group: 'alerts', type: 'error', title: '', duration: 2000, ...args})
  }
  inject('alerts', alerts)
}
