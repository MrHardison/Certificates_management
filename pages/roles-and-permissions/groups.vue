<template>
  <div>
    <template v-if="$route.name === 'roles-and-permissions-groups'">
      <v-table
        :enable-header="true"
        :thead="tHead"
        :tbody="tBody"
        :tfooter="tFooter"
        :is-loading="isLoading"
        @set_page="page = $event"
        @search_text="search_text = $event"
        @order_by="orderBy = $event"
        @interval="interval = $event">
        <template slot="header">
          <button-rounded
            class="btn-green rounded"
            @click.native="$router.push({name: rules.button.route})">
            {{ rules.button.text }}
            <fa
              :icon="['fal', rules.button.icon.name]"
              class="ml-2" />
          </button-rounded>
        </template>
      </v-table>

      <v-modal
        v-if="deleteModal.show"
        header="Are you sure want to delete this item?"
        @close="deleteModal.show = false">
        <template slot="body">
          Please confirm the deletion of this record. And all the records that depend on it.
        </template>
        <div slot="footer">
          <button-rounded
            class="btn-smoke rounded small mr-2"
            @click.native="deleteModal.show = false">
            Cancel
          </button-rounded>
          <button-rounded
            class="btn-green rounded small mr-2"
            @click.native="deleteRole(deleteModal.id)">
            Yes, delete this
          </button-rounded>
        </div>
      </v-modal>
    </template>
    <template v-show="$route.name === 'groups-and-permissions-groups-:id'">
      <nuxt-child
        :key="$route.params.id"/>
    </template>
  </div>
</template>

<script>
import VTable from '~/components/table/vTable'
import ButtonRounded from '~/components/buttonRounded/buttonRounded'
import VModal from '~/components/vModal/vModal'

export default {
  name: 'Groups',
  components: { VModal, ButtonRounded, VTable },
  props: {
    rules: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      search_text: '',
      orderBy: {},
      page: 1,
      isLoading: true,
      interval: 10,
      deleteModal: {
        show: false,
        id: null
      }
    }
  },
  computed: {
    tBodyRules() {
      if (!this.rules && this.rules.hasOwnProperty('body_rules')) {
        return []
      }
      return this.rules.body_rules
    },
    tHead() {
      if (!this.rules && this.rules.hasOwnProperty('head_rules')) {
        return []
      }
      return this.rules.head_rules
    },
    tBody() {
      if (!this.groups) {
        return []
      }
      let newArr = []
      this.groups.data.forEach(row => {
        let tr = {
          actions: this.generateActions(row),
          tr: this.generateRow(row)
        }
        newArr.push(tr)
      })
      return newArr
    },
    tFooter() {
      if (!this.groups) {
        return {}
      }
      return {
        current_page: this.groups.current_page,
        from: this.groups.from,
        to: this.groups.to,
        per_page: this.groups.per_page,
        total: this.groups.total,
        last: this.groups.last_page
      }
    }
  },
  asyncComputed: {
    async groups() {
      this.isLoading = true
      return await this.$api()
        .groups.get({
          page: this.page,
          search_text: this.search_text,
          order_by_column: this.orderBy.orderBy,
          order_by_direction: this.orderBy.sortingDirection,
          interval: this.interval
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  },
  methods: {
    generateActions(row) {
      let actions = []
      this.$order(this.tBodyRules.actions).forEach(item => {
        if (item.action.module === 'link') {
          const act = {
            title: item.title,
            action: () => {
              this.$router.push({
                name: item.action.route,
                params: {
                  name: item.action.name,
                  id: _.get(row, item.action.param)
                }
              })
            }
          }
          actions.push(act)
        } else if (item.action.module === 'delete') {
          const act = {
            title: item.title,
            action: () => {
              this.deleteModal.show = true
              this.deleteModal.id = _.get(row, item.action.param)
            }
          }
          actions.push(act)
        }
      })
      return actions
    },
    generateRow(item) {
      let columns = []
      this.$order(this.tBodyRules.columns).forEach(row => {
        const col = _.get(item, row.column)
        columns.push(col)
      })
      return columns
    },
    async deleteRole(id) {
      if (id) {
        await this.$api()
          .groups.deleteById(id)
          .then(res => {
            document.location.reload(true)
          })
      }
      this.deleteModal.show = false
      this.deleteModal.id = null
    }
  }
}
</script>

<style scoped lang="scss">
</style>
