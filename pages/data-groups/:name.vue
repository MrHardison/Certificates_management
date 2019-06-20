<template>
  <div>
    <template v-if="$route.name === 'data-groups-:name'">
      <v-table
        :enable-header="true"
        :thead="tHead"
        :tbody="tBody"
        :tfooter="tFooter"
        :is-loading="isLoading"
        @set_page="params.page = $event"
        @search_text="debounceSearch($event)"
        @order_by="setOrderBy($event)"
        @interval="params.interval = $event">
        <template slot="header">
          <button-rounded
            class="btn-green rounded responsive"
            @click.native="$router.push({name: 'data-groups-:name-create', params: {name: dataGroup.route }})">
            {{ dataGroup.button.text }}
            <fa
              :icon="['fal', 'plus']"
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
            @click.native="deleteRecordGroup(deleteModal.id)">
            Yes, delete this
          </button-rounded>
        </div>
      </v-modal>
    </template>
    <template v-show="$route.name === 'data-groups-:name-:id'">
      <nuxt-child
        :key="$route.params.id"
        :data-list-group-id="dataGroup.data_list_group_id"
        :child-tabs="dataGroup.tabs"
        :is-loading="isLoading"
        :record-groups="recordGroups"/>
    </template>
  </div>
</template>

<script>
import VTable from '~/components/table/vTable'
import ButtonRounded from '~/components/buttonRounded/buttonRounded'
import VModal from '~/components/vModal/vModal'
import { mapGetters } from 'vuex'

export default {
  name: 'Name',
  components: { VModal, ButtonRounded, VTable },
  props: {
    dataGroup: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      recordGroups: null,
      isLoading: true,
      debounceSearch: _.debounce(text => {
        this.params.search_text = text
      }, 500),
      params: {
        data_list_group_id: this.dataGroup.data_list_group_id,
        page: 1,
        search_text: '',
        order_by_column: null,
        order_by_direction: null,
        interval: 10
      },
      deleteModal: {
        show: false,
        id: null
      }
    }
  },
  computed: {
    ...mapGetters({ getToken: 'token/getApiToken' }),
    tBodyRules() {
      if (!this.dataGroup && this.dataGroup.hasOwnProperty('body_rules')) {
        return []
      }
      return this.dataGroup.body_rules
    },
    tHead() {
      if (!this.dataGroup && this.dataGroup.hasOwnProperty('head_rules')) {
        return []
      }
      return this.dataGroup.head_rules
    },
    tBody() {
      if (!this.recordGroups) {
        return []
      }
      let newArr = []
      this.recordGroups.data.forEach(row => {
        let tr = {
          actions: this.generateActions(row),
          tr: this.generateRow(row)
        }
        newArr.push(tr)
      })
      return newArr
    },
    tFooter() {
      if (!this.recordGroups) {
        return {}
      }
      return {
        current_page: this.recordGroups.current_page,
        from: this.recordGroups.from,
        to: this.recordGroups.to,
        per_page: this.recordGroups.per_page,
        total: this.recordGroups.total,
        last: this.recordGroups.last_page
      }
    }
  },
  watch: {
    params: {
      deep: true,
      handler(data) {
        this.getRecordGroups()
      }
    },
    '$route.name': {
      handler() {
        this.getRecordGroups()
      }
    }
  },
  mounted() {
    this.getRecordGroups()
  },
  methods: {
    getRecordGroups() {
      if (this.$route.params.hasOwnProperty('id')) {
        return null
      }
      if (!this.dataGroup.data_list_group_id) {
        return null
      }
      this.isLoading = true
      if (this.getToken) {
        this.$api.recordGroups
          .get(this.params)
          .then(res => {
            this.recordGroups = this.$timezone(res)
          })
          .finally(() => {
            this.isLoading = false
          })
      }
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
    deleteRecordGroup(id) {
      if (id) {
        this.$api.recordGroups.deleteById(id).then(res => {
          this.getRecordGroups()
        })
      }
      this.deleteModal.show = false
      this.deleteModal.id = null
    },
    setOrderBy(orderBy) {
      this.params.order_by_column = orderBy.orderBy
      this.params.order_by_direction = orderBy.sortingDirection
    }
  }
}
</script>

<style scoped lang="scss">
</style>
