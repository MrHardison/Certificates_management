<template>
  <div>
    <v-table
      :thead="$order(tab.head_rules)"
      :tbody="tBody"
      :tfooter="tFooter"
      :is-loading="isLoading"
      @set_page="page = $event"
      @search_text="search_text = $event"
      @order_by="orderBy = $event"
      @interval="interval = $event"/>
  </div>
</template>

<script>
import VTable from '~/components/table'

export default {
  name: 'VRecordGroupTab',
  components: { VTable },
  props: {
    tab: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isLoading: false,
      page: 1,
      orderBy: {},
      interval: 10
    }
  },
  computed: {
    tBody() {
      if (!this.modelData) {
        return []
      }
      let newArr = []
      this.modelData.data.forEach(row => {
        let tr = {
          actions: this.generateActions(row),
          tr: this.generateRow(row)
        }
        newArr.push(tr)
      })
      return newArr
    },
    tFooter() {
      if (!this.modelData) {
        return {}
      }
      return {
        current_page: this.modelData.current_page,
        from: this.modelData.from,
        to: this.modelData.to,
        per_page: this.modelData.per_page,
        total: this.modelData.total,
        last: this.modelData.last_page
      }
    }
  },
  asyncComputed: {
    modelData() {
      this.isLoading = true
      if (!this.tab) {
        this.isLoading = false
        return {}
      }
      const params = {
        data_list_group_id: this.tab.data_list_group_id,
        page: this.page,
        order_by_column: this.orderBy.orderBy,
        order_by_direction: this.orderBy.sortingDirection,
        interval: this.interval,
        record_group_id: this.$route.params.id
      }
      if (this.tab.model === 'certificates') {
        return this.$api()
          .recordGroups.getCertificatesById(this.$route.params.id, params)
          .then(res => {
            return res
          })
          .finally(() => {
            this.isLoading = false
          })
      } else if (this.tab.model === 'record_groups') {
        return this.$api()
          .recordGroups.get(params)
          .then(res => {
            return res
          })
          .finally(() => {
            this.isLoading = false
          })
      }
      this.isLoading = false
      return {}
    }
  },
  methods: {
    generateActions(row) {
      let actions = []
      this.$order(this.tab.body_rules.actions).forEach(item => {
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
        }
      })
      return actions
    },
    generateRow(item) {
      let columns = []
      this.$order(this.tab.body_rules.columns).forEach(row => {
        const col = _.get(item, row.column)
        columns.push(col)
      })
      return columns
    }
  }
}
</script>

<style scoped>
</style>
