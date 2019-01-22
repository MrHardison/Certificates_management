<template>
  <ul class="breadcrumb">
    <template v-for="(item, index) in items">
      <li
        :key="index"
        :class="{active: item.route}"
        class="breadcrumb__item">
        <nuxt-link :to="{'name':item.route}">
          <fa
            :icon="['fal', item.icon]"
            class="icon"/>
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
  props: {
    items: {
      type: Array,
      default() {
        return [
          {
            title: 'Customers',
            icon: 'user',
            route: {
              name: 'data-groups-:name',
              params: {
                name: 'customers',
                id: '951'
              }
            }
          }
        ]
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
  padding: 4px 15px 4px 10px;
  vertical-align: middle;

  &__item {
    cursor: default;
    display: inline-block;
    margin-right: 10px;
    vertical-align: middle;

    &.active {
      a {
        cursor: pointer;

        &:hover {
          .text {
            text-decoration: underline;
          }
        }

        .text {
          color: $main_blue;
        }
      }
    }
    &:last-child {
      a {
        svg {
          display: inline-block;
        }
      }
      svg {
        display: none;
      }
    }
    svg {
      margin-left: 5px;
      vertical-align: middle;
    }
    a {
      cursor: default;

      &:hover {
        text-decoration: none;
      }

      svg {
        margin: 0 5px 0 0;
      }
      .text {
        color: #636c72;
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
  }
}
@media (max-width: 575px) {
  .breadcrumb {
    margin: 0 15px 20px 15px;
  }
}
</style>
