<template>
  <ul class="breadcrumbs">
    <template v-for="(item, index) in list">
      <nuxt-link
        :to="{name: 'data-groups-:name-:id', params: { name: item.link, id: item.id } }"
        :key="index"
        class="breadcrumbs--item">
        {{ item.text }}
        <fa
          :icon="['far', 'chevron-right']"
          class="breadcrumbs--icon"/>
      </nuxt-link>
    </template>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Breadcrumbs',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    recordGroup: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dataListGroups: []
    }
  },
  computed: {
    ...mapGetters({ ui: 'menu/getMenuPages' }),
    list() {
      let list = []
      _.forEach(this.data, item => {
        let string = ''
        _.forEach(
          _.keys(this.$orderObject(item.data_group.schema)).slice(0, 3),
          key => {
            if (item.data[key]) {
              string = string.length
                ? `${string}, ${item.data[key]}`
                : item.data[key]
            }
          }
        )
        list.push({
          id: item.id,
          link: this.getRoute(item.data_list_group_id),
          text: string
        })
      })
      list.push({
        id: this.$route.params.id,
        link: this.$route.params.name,
        text: _.filter(_.values(this.recordGroup), item => {
          return item !== null && item.length
        })
          .slice(0, 3)
          .join(', ')
      })
      return list
    }
  },
  mounted() {
    this.getRoute()
    this.getDataListDefaults()
  },
  methods: {
    getRoute(dataListGroupId) {
      const match = _.find(this.ui, {
        properties: {
          sub_pages: [
            {
              data_list_group_id: dataListGroupId
            }
          ]
        }
      })
      if (match) {
        const route = _.find(match.properties.sub_pages, {
          data_list_group_id: dataListGroupId
        }).route
        return route
      }
    },
    getDataListDefaults() {
      this.$api.dataGroups.dataListGroups().then(res => {
        this.dataListGroups = res
      })
    }
  }
}
</script>

<style scoped lang="scss">
.breadcrumbs {
  align-items: center;
  background-color: #fff;
  border: 1px solid $gray;
  box-sizing: border-box;
  border-radius: 25px;
  display: inline-flex;
  flex-wrap: wrap;
  font-size: 12px;
  list-style: none;
  line-height: 16px;
  margin: 1rem 1rem 0;
  padding: 0 15px;
  justify-content: flex-start;

  &--item {
    color: $main_blue;
    font-size: 14px;
    margin-right: 5px;
    padding: 0.5rem 20px 0.5rem 5px;
    position: relative;
    transition: background 0.2s ease-in-out, color 0.2s ease-in-out;

    &:last-child {
      color: $gray;
      margin-right: 0;
      padding-right: 0;
      pointer-events: none;

      .breadcrumbs--icon {
        display: none;
      }
    }
  }

  &--icon {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
