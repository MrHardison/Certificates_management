<template>
  <div class="card">
    <v-thead
      :enable-header="enableHeader"
      @search_text="searchText($event)"
      @interval="updateInterval($event)">
      <template slot="header">
        <slot name="header"/>
      </template>
    </v-thead>
    <div class="position-relative">
      <v-tbody
        :thead="thead"
        :tbody="tbody"
        @order_by="$emit('order_by', $event)"/>
      <v-footer
        :paginator="tfooter"
        @update="$emit('set_page', $event)"/>
      <div
        v-if="isLoading"
        class="loader">
        <spiner-loader/>
      </div>
    </div>
  </div>
</template>

<script>
import VThead from './vThead'
import VTbody from './vTbody'
import VFooter from './vFooter'
import SpinerLoader from '~/components/spinerLoader'
import ButtonRounded from '../buttonRounded/buttonRounded'

export default {
  name: 'VTable',
  components: { ButtonRounded, SpinerLoader, VTbody, VThead, VFooter },
  props: {
    enableHeader: {
      type: Boolean,
      default: false
    },
    thead: {
      type: Array,
      default() {
        return []
      }
    },
    tbody: {
      type: Array,
      default() {
        return []
      }
    },
    tfooter: {
      type: Object,
      default() {
        return {}
      }
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    searchText(text) {
      this.$emit('search_text', text)
      this.$emit('set_page', 1)
    },
    updateInterval(interval) {
      this.$emit('interval', interval)
      this.$emit('set_page', 1)
    }
  }
}
</script>

<style scoped lang="scss">
@import './vTable';
</style>
