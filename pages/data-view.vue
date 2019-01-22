<template>
  <section class="container-fluid">
    <div class="row">
      <div
        v-if="dataViews"
        class="col">
        <template v-for="(dataView, index) in dataViews">
          <button-rounded
            :key="index"
            :class="{active: $route.params.name === dataView.route}"
            class="btn-white rounded small mr-2"
            @click.native="$router.push({name: 'data-view-:name', params: {name: dataView.route}})">
            {{ dataView.title }}
            <fa
              :icon="['far', dataView.icon.name]"
              class="ml-2" />
          </button-rounded>
        </template>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col">
        <nuxt-child
          :key="$route.params.name"
          :data-view="currentDataView" />
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonRounded from '../components/buttonRounded/buttonRounded'

export default {
  name: 'DataView',
  components: { ButtonRounded },
  middleware: 'pages',
  computed: {
    ...mapGetters({
      getMenuPage: 'menu/getMenuPage'
    }),
    dataViews() {
      const groups = this.getMenuPage('data-view')
      if (groups && groups.properties.hasOwnProperty('sub_pages')) {
        return groups.properties.sub_pages
      }
      return []
    },
    currentDataView() {
      return this.dataViews.find(item => {
        return this.$route.params.name === item.route
      })
    }
  },
  watch: {
    '$route.name': {
      handler() {
        if (
          this.$route.name === 'data-view' &&
          this.dataViews &&
          this.dataViews.length
        ) {
          this.$router.push({
            name: 'data-view-:name',
            params: { name: this.dataViews[0].route }
          })
        }
      }
    }
  },
  mounted() {
    if (
      this.$route.name === 'data-view' &&
      this.dataViews &&
      this.dataViews.length
    ) {
      this.$router.push({
        name: 'data-view-:name',
        params: { name: this.dataViews[0].route }
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
