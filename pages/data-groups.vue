<template>
  <section class="container-fluid">
    <div class="row">
      <div
        v-if="dataGroups"
        class="col responsive">
        <template v-for="(dataGroup, index) in dataGroups">
          <button-rounded
            :key="index"
            :class="{active: $route.params.name === dataGroup.route}"
            class="btn btn-white rounded small mr-2 responsive"
            @click.native="$router.push({name: 'data-groups-:name', params: {name: dataGroup.route}})">
            {{ dataGroup.title }}
            <fa
              :icon="['far', dataGroup.icon.name]"
              class="ml-2" />
          </button-rounded>
        </template>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col">
        <nuxt-child
          :key="$route.params.name"
          :data-group="currentDataGroup" />
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonRounded from '../components/buttonRounded/buttonRounded'

export default {
  name: 'Index',
  components: { ButtonRounded },
  middleware: 'pages',
  computed: {
    ...mapGetters({
      getMenuPage: 'menu/getMenuPage'
    }),
    dataGroups() {
      const groups = this.getMenuPage('data-groups')
      if (groups && groups.properties.hasOwnProperty('sub_pages')) {
        return _.filter(groups.properties.sub_pages, tab => {
          return tab.hasOwnProperty('visible') && tab.visible
        })
      }
      return []
    },
    currentDataGroup() {
      return this.dataGroups.find(item => {
        return this.$route.params.name === item.route
      })
    }
  },
  watch: {
    '$route.name': {
      handler() {
        if (
          this.$route.name === 'data-groups' &&
          this.dataGroups &&
          this.dataGroups.length
        ) {
          this.$router.push({
            name: 'data-groups-:name',
            params: { name: this.dataGroups[0].route }
          })
        }
      }
    }
  },
  mounted() {
    if (
      this.$route.name === 'data-groups' &&
      this.dataGroups &&
      this.dataGroups.length
    ) {
      this.$router.push({
        name: 'data-groups-:name',
        params: { name: this.dataGroups[0].route }
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
