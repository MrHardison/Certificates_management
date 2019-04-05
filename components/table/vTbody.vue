<template>
  <div class="card-body">
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th
              :style="{ width: '3%' }"
              scope="col"
              class="text-center">#</th>
            <template v-for="(item, index) in $order(thead)">
              <th
                :key="index"
                :style="{ width: item.width + '%' }"
                scope="col"
                @click="checkOrderBy(item)">
                <div class="d-flex justify-content-between">
                  <span class="d-flex">
                    {{ item.title }}
                  </span>
                  <template v-if="item.order_by === orderBy">
                    <template v-if="sortingDirection === 'asc'">
                      <fa
                        :icon="['fa', 'sort-up']"
                        class="sortable-icon d-flex my-auto"/>
                    </template>
                    <template v-else-if="sortingDirection === 'desc'">
                      <fa
                        :icon="['fa', 'sort-down']"
                        class="sortable-icon d-flex my-auto"/>
                    </template>
                  </template>
                  <template v-else>
                    <fa
                      :icon="['fa', 'sort']"
                      class="sortable-icon d-flex my-auto"/>
                  </template>
                </div>
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template v-for="(row, index) in tbody">
            <v-trow
              :key="index"
              :tr="row.tr"
              :actions="row.actions"/>
          </template>
        </tbody>
      </table>
      <template v-if="tbody.length === 0">
        <div class="col-12 text-center py-5">
          <h4 class="text-center">Nothing to show</h4>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import VTrow from './vTrow'
import ButtonRounded from '../buttonRounded'
export default {
  name: 'VTbody',
  components: { VTrow, ButtonRounded },
  props: {
    emptyMessage: {
      type: Boolean,
      default() {
        return false
      }
    },
    tbody: {
      type: Array,
      default() {
        return []
      }
    },
    thead: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      sortingDirection: 'asc',
      checkSortType: 1,
      orderBy: ''
    }
  },
  methods: {
    checkOrderBy(item) {
      this.orderBy = item.hasOwnProperty('order_by') ? item.order_by : ''
      this.sortingDirection = this.sortingDirection === 'asc' ? 'desc' : 'asc'
      this.$emit('order_by', {
        orderBy: this.orderBy,
        sortingDirection: this.sortingDirection
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import 'vTbody';
</style>
