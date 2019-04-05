<template>
  <div class="navigation">
    <div
      :class="{open: isClosed}"
      class="header">
      <div class="header_container">
        <div class="logo">
          <img src="/wwt-black.png">
        </div>
        <div class="header__wrap">
          <div
            :class="{active: !isClosed}"
            class="hamburger"
            @click="toggleMenu">
            <div class="hamburger-box">
              <div class="hamburger-inner"/>
            </div>
          </div>
          <slot/>
        </div>
        <div class="buttons">
          <button
            class="btn"
            @click="logout">
            <fa
              :icon="['far', 'power-off']"
              class="icon"/>LOG OUT
          </button>
          <a
            class="btn"
            target="_blank"
            href="https://weworktogethersoftware.com/contact-us">
            <fa
              :icon="['far', 'question-circle']"
              class="icon"/>HELP AND SUPPORT
          </a>
        </div>
      </div>
    </div>
    <div
      :class="{closed: isClosed}"
      class="sidebar">
      <div class="block">
        <nuxt-link
          :to="{name: 'index'}"
          class="logo m-b-50 m-t-20"
          tag="div"
          exact>
          <div class="image">
            <img src="/icon.png">
          </div>
          <transition name="fade">
            <div
              v-show="!isClosed"
              class="text">
              <img src="/wwt.png">
            </div>
          </transition>
        </nuxt-link>
        <div class="nav">
          <template v-for="(page, key) in ui">
            <nuxt-link
              :to="{name: page.properties.route}"
              :key="key"
              :ref="`menu-item-${key}`"
              active-class="active"
              class="nav-item"
              @click.native="sidebarItem"
              @mouseover.native="hover(key)"
              @mouseleave.native="leave(key)">
              <fa
                :icon="['fal', page.properties.icon.name]"
                class="icon"/>
              <transition name="fade">
                <span v-show="!isClosed">{{ page.name }}</span>
              </transition>
            </nuxt-link>
          </template>
        </div>
        <ul class="service_nav nav">
          <li
            :class="{closed: isClosed}"
            class="nav-item">
            <fa
              :icon="['far', 'power-off']"
              class="icon"/>
            <span>LOG OUT</span>
          </li>
          <li
            :class="{closed: isClosed}"
            class="nav-item">
            <fa
              :icon="['far', 'question-circle']"
              class="icon"/>
            <a
              target="_blank"
              href="https://weworktogethersoftware.com/contact-us">HELP AND SUPPORT</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'NavBar',
  computed: {
    ...mapGetters({ isClosed: 'menu/isClosed', ui: 'menu/getMenuPages' })
  },
  methods: {
    ...mapMutations({
      toggleMenu: 'menu/toggleMenu',
      setToken: 'token/setToken'
    }),

    logout() {
      this.setToken(false)
      this.$api()
        .auth.logout()
        .then(res => {
          this.$router.push('/auth/login')
        })
        .catch(err => {})
    },
    sidebarItem() {
      if (window.innerWidth <= 768) {
        this.toggleMenu()
      }
    },
    hover(key) {
      const parentNode = this.$refs[`menu-item-${key}`][0].$el
      const parentNodeWidth = parentNode.clientWidth - 90
      const text = parentNode.children[1]
      if (text.clientWidth > 150) {
        text.style.textIndent = '-25%'
      }
    },
    leave(key) {
      const parentNode = this.$refs[`menu-item-${key}`][0].$el
      const parentNodeWidth = parentNode.clientWidth - 90
      const text = parentNode.children[1]
      if (text.clientWidth > 150) {
        text.style.textIndent = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './sidebar';
@import './header';
</style>
