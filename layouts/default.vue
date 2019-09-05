<template>
  <div>
    <div
      v-if="showPreloader"
      class="preloader">
      <div class="cssload-container">
        <div class="cssload-loading">
          <i/><i/><i/><i/>
        </div>
      </div>
    </div>
    <nav-bar />
    <div
      :class="{closed: isClosed}"
      class="page-content">
      <nuxt/>
    </div>
    <notifications
      group="alerts"/>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { navBar } from '@/components/navBar/'

export default {
  components: { navBar },
  data() {
    return {
      isClose: false,
      showPreloader: false,
      user: {}
    }
  },
  computed: {
    ...mapGetters({ isClosed: 'menu/isClosed', menuPages: 'menu/getMenuPages' })
  },
  mounted() {
    this.showPreloader = true
    if (this.$store.getters['token/getApiToken']) {
      const user = this.$api.user.get().then(res => {
        this.user = res
      })
      const ui = this.$api.menu
        .ui()
        .then(res => {
          const menuArray = _.filter(res, item => {
            // eslint-disable-next-line
            const hidden = item.properties.hasOwnProperty('hidden') ? item.properties.hidden : []
            return !hidden.find(i => i === 'web') && item.properties.route
          })
          this.reload(this.$order(menuArray))
        })
        .catch(err => {
          console.warn('Error detected, please contact the administrator')
        })
      Promise.all([ui, user])
        .then(() => {
          if (this.$sentry) {
            this.$sentry.configureScope(scope => {
              scope.setUser({
                username: this.user.properties.user_full_name || 'username',
                email: this.user.email,
                id: this.user.id,
                company_id: this.user.company.id
              })
            })
          }
        })
        .finally(() => {
          this.showPreloader = false
        })
    } else {
      this.$router.push('/auth/login')
    }
  },
  methods: {
    ...mapMutations({
      toggleMenu: 'menu/toggleMenu',
      reload: 'menu/reload',
      setUserName: 'user/setUserName',
      setEmail: 'user/setEmail',
      setUserId: 'user/setUserId',
      setCompanyId: 'user/setCompanyId'
    })
  }
}
</script>
<style lang="scss">
.preloader {
  background: #fff;
  color: #000;
  font: 100px/100vh sans-serif;
  height: 100vh;
  position: fixed;
  text-align: center;
  width: 100%;
  z-index: 9999;

  .cssload-container {
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 238px;

    i {
      width: 25px;
      height: 25px;
      display: inline-block;
      border-radius: 50%;
      background: linear-gradient(to right, #007fb2 0%, #1aa8e1 100%);

      &:first-child {
        opacity: 0;
        animation: cssload-loading-ani2 0.58s linear infinite;
        transform: translate(-48px);
      }

      &:nth-child(2),
      &:nth-child(3) {
        animation: cssload-loading-ani3 0.58s linear infinite;
      }

      &:last-child {
        animation: cssload-loading-ani1 0.58s linear infinite;
      }
    }

    @keyframes cssload-loading-ani1 {
      100% {
        transform: translate(95px);
        opacity: 0;
      }
    }

    @keyframes cssload-loading-ani2 {
      100% {
        transform: translate(48px);
        opacity: 1;
      }
    }

    @keyframes cssload-loading-ani3 {
      100% {
        transform: translate(48px);
      }
    }
  }
}
.page-content {
  background: $main_bg;
  min-height: 100vh;
  margin-left: 290px;
  padding-top: 95px;
  padding-bottom: 15px;
  transition: margin 0.3s linear;
  &.closed {
    margin-left: 75px;
  }
}
@media (max-width: 768px) {
  .page-content {
    margin-left: 0;
    &.closed {
      margin-left: 0;
    }
  }
}
</style>
