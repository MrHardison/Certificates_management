<template>
  <div>
    <template v-if="$route.name === 'roles-and-permissions-users'">
      <v-table
        :enable-header="true"
        :thead="tHead"
        :tbody="tBody"
        :tfooter="tFooter"
        :is-loading="isLoading"
        @set_page="params.page = $event"
        @search_text="debounceSearch($event)"
        @order_by="setOrder($event)"
        @interval="params.interval = $event">
        <template slot="header">
          <button-rounded
            class="btn-green rounded responsive"
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
            @click.native="deleteUser(deleteModal.id)">
            Yes, delete this
          </button-rounded>
        </div>
      </v-modal>
    </template>
    <template v-show="$route.name === 'users-and-permissions-users-:id'">
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
  name: 'Name',
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
      params: {
        search_text: '',
        page: 1,
        interval: 10,
        order_by_column: null,
        order_by_direction: null
      },
      debounceSearch: _.debounce(text => {
        this.params.search_text = text
      }, 500),
      users: null,
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
      if (!this.users) {
        return []
      }
      let newArr = []
      if (this.users) {
        _.forEach(this.users.data, row => {
          let tr = {
            actions: this.generateActions(row),
            tr: this.generateRow(row)
          }
          newArr.push(tr)
        })
      }
      return newArr
    },
    tFooter() {
      if (!this.users) {
        return {}
      }
      return {
        current_page: this.users.current_page,
        from: this.users.from,
        to: this.users.to,
        per_page: this.users.per_page,
        total: this.users.total,
        last: this.users.last_page
      }
    }
  },
  watch: {
    params: {
      deep: true,
      handler(data) {
        this.getUsers()
      }
    }
  },
  beforeMount() {
    this.getUsers()
  },
  methods: {
    getUsers() {
      this.$api.users
        .get(this.params)
        .then(res => {
          this.users = this.$timezone(res)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
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
    deleteUser(id) {
      if (id) {
        this.$api.users.deleteById(id).then(res => {
          this.getUsers()
        })
      }
      this.deleteModal.show = false
      this.deleteModal.id = null
    },
    setOrder(order) {
      this.params.order_by_column = order.orderBy
      this.params.order_by_direction = order.sortingDirection
    }
  }
}
</script>

<style scoped lang="scss">
</style>
