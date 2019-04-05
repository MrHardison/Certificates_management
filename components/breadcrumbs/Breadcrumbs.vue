<template>
  <ul class="breadcrumb">
    <template v-for="(item, index) in items">
      <li
        :key="index"
        class="breadcrumb__item active">
        <nuxt-link :to="{name: item.name}">
          <!-- <fa
            :icon="['fal', item.icon]"
            class="icon"/> -->
          <span class="text">
            {{ item.title }}
          </span>
        </nuxt-link>
        <fa
          :icon="['far', 'chevron-right']"
          class="icon"/>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  name: 'Breadcrumbs',
  data() {
    return {}
  },
  computed: {
    items() {
      let items = []
      if (this.$route.matched) {
        this.$route.matched.forEach((link, index) => {
          items.push(
            Object.assign(
              {
                title: this.getItemTitle(index)
              },
              link
            )
          )
        })
      }
      if (items.length === 0) {
        items.push({ path: '/', title: 'index' })
      }
      return items
    }
  },
  methods: {
    getItemTitle(index) {
      if (this.$route.hasOwnProperty('fullPath')) {
        const title = this.$route.fullPath.split('/')[index + 1]
        return title.length > 0
          ? `${title.charAt(0).toUpperCase()}${title.slice(1)}`
          : 'Home'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.breadcrumb {
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid #f9f9f9;
  border-radius: 25px;
  display: inline-block;
  font-size: 12px;
  list-style: none;
  line-height: 16px;
  margin: 0 0 0 15px;
  padding: 4px 15px 4px 15px;
  vertical-align: middle;

  &__item {
    color: $main_blue;
    display: inline-block;
    margin-right: 10px;
    vertical-align: middle;

    a {
      cursor: default;

      &:hover {
        .text {
          text-decoration: underline;
        }
      }

      svg {
        margin: 0 5px 0 0;
      }
      .text {
        cursor: pointer;
        color: $main_blue;
        display: inline-block;
        font-size: 14px;
        max-width: 130px;
        min-width: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
        white-space: nowrap;
      }
    }
    &:last-child {
      margin-right: 0;
      a {
        &:hover {
          .text {
            text-decoration: none;
          }
        }
        svg {
          display: inline-block;
        }
        .text {
          color: #636c72;
          cursor: default;
        }
      }
      svg {
        display: none;
      }
    }
    svg {
      margin-left: 10px;
      vertical-align: middle;
    }
  }
}
@media (max-width: 575px) {
  .breadcrumb {
    margin: 0 15px 20px 15px;
  }
}
</style>
