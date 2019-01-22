<template>
  <div>
    <div class="sub-navigation">
      <template v-for="(tab,index) in ableTabs">
        <button
          :class="{active: tab.isActive}"
          :key="index"
          class="btn btn-white rounded small"
          @click="changeTab(tab.name)">
          <div class="content">
            {{ tab.name }}
          </div>
        </button>
      </template>
    </div>
    <slot>
      No data
    </slot>
  </div>
</template>
<script>
export default {
  name: 'VTabs',
  data() {
    return {
      tabs: [],
      activeTab: null
    }
  },
  computed: {
    ableTabs() {
      return this.tabs.filter(tab => !tab.disable)
    }
  },
  watch: {
    activeTab(currentTab, prevTab) {
      if (prevTab) {
        prevTab.isActive = false
      }
      currentTab.isActive = true
    }
  },
  created() {
    this.tabs = this.$children
  },
  mounted() {
    const defaultTab = this.tabs.find(tab => tab.default)
    if (defaultTab) {
      this.changeTab(defaultTab.name)
    } else {
      this.changeTab(this.ableTabs[0].name)
    }
  },
  methods: {
    addTab(tab) {
      this.tabs.push(tab)
      this.activeTab = tab
    },
    changeTab(name) {
      const tab = this.findTabByName(name)
      this.activeTab = tab
    },
    findTabByName(name) {
      return this.tabs.find(tab => tab.name === name)
    }
  }
}
</script>
<style scoped lang="scss">
@import './v-tabs';
</style>
