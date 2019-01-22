<template>
  <div>
    <template v-if="$route.name === 'data-view-:name'">
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
            @click.native="isCreate = true">
            {{ dataView.button.text }}
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
      <v-modal
        v-if="isCreate"
        header="Please select form"
        class="select-list"
        @close="isCreate = false">
        <template slot="body">
          <template v-if="formCategories">
            <v-multi-dropdown
              :options="formCategories"
              class="dropdown_data-view-create"
              @update="createFormId = $event"/>
          </template>
          <template v-else>
            Please wait
          </template>
        </template>
        <div slot="footer">
          <button-rounded
            class="btn-smoke rounded small mr-2"
            @click.native="isCreate = false">
            Cancel
          </button-rounded>
          <button-rounded
            class="btn-green rounded small mr-2"
            @click.native="createCertificate">
            Create
          </button-rounded>
        </div>
      </v-modal>
    </template>
    <template v-show="$route.name === 'data-view-:name-:id'">
      <nuxt-child
        :key="$route.params.id"
        :is-loading="isLoading"/>
    </template>
  </div>
</template>

<script>
import VTable from '~/components/table/vTable'
import ButtonRounded from '~/components/buttonRounded/buttonRounded'
import VModal from '~/components/vModal/vModal'
import VMultiDropdown from '../../components/multiDropdown/multiDropdown'

export default {
  name: 'Name',
  components: { VMultiDropdown, VModal, ButtonRounded, VTable },
  props: {
    dataView: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isCreate: false,
      createFormId: null,
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
      if (!this.dataView && this.dataView.hasOwnProperty('body_rules')) {
        return []
      }
      return this.dataView.body_rules
    },
    tHead() {
      if (!this.dataView && this.dataView.hasOwnProperty('head_rules')) {
        return []
      }
      return this.dataView.head_rules
    },
    tBody() {
      if (!this.certificates) {
        return []
      }
      let newArr = []
      this.certificates.data.forEach(row => {
        let tr = {
          actions: this.generateActions(row),
          tr: this.generateRow(row)
        }
        newArr.push(tr)
      })
      return newArr
    },
    tFooter() {
      if (!this.certificates) {
        return {}
      }
      return {
        current_page: this.certificates.current_page,
        from: this.certificates.from,
        to: this.certificates.to,
        per_page: this.certificates.per_page,
        total: this.certificates.total,
        last: this.certificates.last_page
      }
    }
  },
  asyncComputed: {
    async certificates() {
      if (this.$route.params.hasOwnProperty('id')) {
        return null
      }
      this.isLoading = true
      return await this.$api()
        .dataView.get({
          page: this.page,
          search_text: this.search_text,
          order_by_column: this.orderBy.orderBy,
          order_by_direction: this.orderBy.sortingDirection,
          interval: this.interval
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    formCategories() {
      return this.$api()
        .dataView.create()
        .then(res => {
          return res.map(item => {
            item.title = item.name
            item.options = item.forms.map(option => {
              option.title = option.name
              return option
            })
            return item
          })
        })
    }
  },
  updated() {
    this.certificates
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
    async deleteRecordGroup(id) {
      if (id) {
        await this.$api()
          .dataView.deleteById(id)
          .then(res => {
            document.location.reload(true)
          })
      }
      this.deleteModal.show = false
      this.deleteModal.id = null
    },
    createCertificate() {
      if (!this.createFormId) {
        alert('Please select a form')
      } else {
        this.$api()
          .dataView.store({ form_id: this.createFormId })
          .then(res => {
            this.$router.push({
              name: 'data-view-:name-:id',
              params: { name: this.$route.params.name, id: res.id }
            })
          })
          .finally(() => {
            this.isCreate = false
          })
      }
    }
  }
}
</script>

<style scoped lang="scss">
// .dropdown_data-view-create {
//   min-height: 38px;
//   height: auto;

//   .content {
//     position: relative;
//     top: 0;
//   }
// }
</style>
