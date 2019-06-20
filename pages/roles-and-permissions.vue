<template>
  <section class="container-fluid">
    <div class="row">
      <div
        v-if="pages"
        class="col responsive">
        <button-rounded
          :class="{active: isActiveRoles}"
          class="btn btn-white rounded small mr-2 responsive"
          @click.native="$router.push({name: 'roles-and-permissions-roles'})">
          Roles
          <fa
            :icon="['far', 'key']"
            class="ml-2" />
        </button-rounded>
        <button-rounded
          :class="{active: isActiveGroups}"
          class="btn btn-white rounded small mr-2 responsive"
          @click.native="$router.push({name: 'roles-and-permissions-groups'})">
          Groups
          <fa
            :icon="['far', 'users']"
            class="ml-2" />
        </button-rounded>
        <button-rounded
          :class="{active: isActiveUsers}"
          class="btn btn-white rounded small mr-2 responsive"
          @click.native="$router.push({name: 'roles-and-permissions-users'})">
          Users
          <fa
            :icon="['far', 'user-tie']"
            class="ml-2" />
        </button-rounded>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col">
        <nuxt-child
          :key="$route.name"
          :rules="currentPage" />
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
    pages() {
      const pages = this.getMenuPage('roles-and-permissions')
      if (pages && pages.properties.hasOwnProperty('sub_pages')) {
        return _.filter(pages.properties.sub_pages, tab => {
          return tab.hasOwnProperty('visible') && tab.visible
        })
      }
      return []
    },
    currentPage() {
      return this.pages.find(item => {
        return this.$route.name === item.route
      })
    },
    isActiveRoles() {
      return (
        this.$route.name === 'roles-and-permissions-roles' ||
        this.$route.name === 'roles-and-permissions-roles-create' ||
        this.$route.name === 'roles-and-permissions-roles-:id'
      )
    },
    isActiveUsers() {
      return (
        this.$route.name === 'roles-and-permissions-users' ||
        this.$route.name === 'roles-and-permissions-users-create' ||
        this.$route.name === 'roles-and-permissions-users-:id'
      )
    },
    isActiveGroups() {
      return (
        this.$route.name === 'roles-and-permissions-groups' ||
        this.$route.name === 'roles-and-permissions-groups-create' ||
        this.$route.name === 'roles-and-permissions-groups-:id'
      )
    }
  },
  watch: {
    '$route.name': {
      handler() {
        if (
          this.$route.name === 'roles-and-permissions' &&
          this.pages &&
          this.pages.length
        ) {
          this.$router.push({
            name: 'roles-and-permissions-roles'
          })
        }
      }
    }
  },
  mounted() {
    if (
      this.$route.name === 'roles-and-permissions' &&
      this.pages &&
      this.pages.length
    ) {
      this.$router.push({
        name: 'roles-and-permissions-roles'
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
