<template>
  <section class="container-fluid">
    <div class="row">
      <div
        v-if="dataViews"
        class="col responsive">
        <button-rounded
          v-if="showBackButton"
          class="btn-white rounded small mr-2 responsive"
          @click.native="backToCertificate">
          <fa
            :icon="['fas', 'arrow-left']"
            class="mr-2" />
          Edit Certificate
        </button-rounded>
        <template v-for="(dataView, index) in dataViews">
          <button-rounded
            :key="index"
            :class="{active: $route.params.name === dataView.route}"
            class="btn-white rounded small mr-2 responsive"
            @click.native="moveTo(dataView)">
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
          :data-view="currentDataView"
          @showReturnButton="showBackButton = true"/>
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
  data() {
    return {
      showBackButton: false,
      routeName: null,
      routeId: null
    }
  },
  computed: {
    ...mapGetters({
      getMenuPage: 'menu/getMenuPage'
    }),
    dataViews() {
      const groups = this.getMenuPage('data-view')
      if (groups && _.has(groups.properties, 'sub_pages')) {
        return _.filter(groups.properties.sub_pages, tab => {
          return _.has(tab, 'visible') && tab.visible
        })
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
  },
  methods: {
    backToCertificate() {
      this.showBackButton = false
      this.$router.push({
        name: 'data-view-:name-:id',
        params: {
          name: this.$route.params.name,
          id: this.$route.params.id
        }
      })
    },
    moveTo(dataView) {
      this.showBackButton = false
      this.$router.push({
        name: 'data-view-:name',
        params: { name: dataView.route }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.responsive {
  @media (max-width: 544px) {
    .btn {
      margin: 0 0 1rem 0 !important;
      width: 100%;

      &:last-child {
        margin-bottom: 0 !important;
      }
    }
  }
}
</style>
