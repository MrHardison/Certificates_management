<template>
  <div>
    <v-table
      :thead="$order(tab.head_rules)"
      :tbody="tBody"
      :tfooter="tFooter"
      :is-loading="isLoading"
      @set_page="params.page = $event"
      @order_by="setOrderBy($event)"
      @interval="params.interval = $event"/>
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
      params: {
        data_list_group_id: this.tab.data_list_group_id,
        page: 1,
        order_by_column: null,
        order_by_direction: null,
        interval: 10,
        record_group_id: this.$route.params.id
      },
      orderBy: {},
      modelData: {},
      tBody: []
    }
  },
  computed: {
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
  watch: {
    params: {
      deep: true,
      handler(data) {
        this.getModelData()
      }
    }
  },
  mounted() {
    this.getModelData()
  },
  methods: {
    getModelData() {
      this.isLoading = true
      if (this.tab) {
        if (this.tab.model === 'certificates') {
          this.$api.recordGroups
            .getCertificatesById(this.$route.params.id, this.params)
            .then(res => {
              this.modelData = res
              this.generateTBody()
            })
            .finally(() => {
              this.isLoading = false
            })
        } else if (this.tab.model === 'record_groups') {
          this.$api.recordGroups
            .get(this.params)
            .then(res => {
              this.modelData = res
              this.generateTBody()
            })
            .finally(() => {
              this.isLoading = false
            })
        }
      }
    },
    generateTBody() {
      let newArr = []
      this.modelData.data.forEach(row => {
        let tr = {
          actions: this.generateActions(row),
          tr: this.generateRow(row)
        }
        newArr.push(tr)
      })
      this.tBody = newArr
    },
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
    },
    setOrderBy(orderBy) {
      this.params.order_by_column = orderBy.orderBy
      this.params.order_by_direction = orderBy.sortingDirection
    }
  }
}
</script>

<style scoped>
</style>
