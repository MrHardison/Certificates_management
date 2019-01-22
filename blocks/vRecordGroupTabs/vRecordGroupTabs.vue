<template>
  <div class="col-12 d-flex">
    <v-tabs class="w-100">
      <template v-for="(tab, index) in tabs">
        <v-tab
          :key="index"
          :name="tab.title">
          <v-record-group-tab
            :tab="tab"/>
        </v-tab>
      </template>
    </v-tabs>
  </div>
</template>

<script>
import { vTab, vTabs } from '~/components/tabs'
import VRecordGroupTab from './vRecordGroupTab'

export default {
  name: 'VRecordGroupTabs',
  components: {
    VRecordGroupTab,
    vTab,
    vTabs
  },
  props: {
    tabs: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style scoped>
</style>
