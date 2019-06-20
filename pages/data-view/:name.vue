<template>
  <div>
    <template v-if="$route.name === 'data-view-:name'">
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
            @click.native="deleteItem(deleteModal.id)">
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
            <div
              class="item-selector">
              <input-standard
                :label="'Search form'"
                :search_icon="true"
                :autofocus="true"
                @update="searchText = $event"/>
              <div
                class="content">
                <ul
                  class="parent-options">
                  <template v-for="(option, index) in filteredOptions">
                    <template v-if="typeof option === 'object' && option.hasOwnProperty('options')">
                      <li
                        :key="index"
                        class="option">
                        <b> {{ option.title }} </b>
                        <template v-if="option.hasOwnProperty('options')">
                          <ul
                            class="options">
                            <template v-for="(child, c_index) in option.options">
                              <li
                                :key="c_index"
                                class="option"
                                @click="createCertificate(child.id)">
                                {{ child.name }}
                              </li>
                            </template>
                          </ul>
                        </template>
                      </li>
                    </template>
                  </template>
                </ul>
              </div>
            </div>
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
        </div>
      </v-modal>
    </template>
    <template v-show="$route.name === 'data-view-:name-:id'">
      <nuxt-child
        :key="$route.params.id"
        :is-loading="isLoading"
        @showReturnButton="$emit('showReturnButton')"/>
    </template>
  </div>
</template>

<script>
import VTable from '~/components/table/vTable'
import ButtonRounded from '~/components/buttonRounded/buttonRounded'
import VModal from '~/components/vModal/vModal'
import InputStandard from '~/components/inputStandard/'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Name',
  components: { VModal, ButtonRounded, VTable, InputStandard },
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
      searchText: '',
      certificates: null,
      isCreate: false,
      isLoading: true,
      dateChange: false,
      formCategories: [],
      debounceSearch: _.debounce(text => {
        this.params.search_text = text
      }, 500),
      params: {
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
    ...mapGetters({
      getToken: 'token/getApiToken'
    }),
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
    },
    filteredOptions() {
      const base = _.cloneDeep(this.formCategories)
      const modified = _.map(base, option => {
        option.options = _.filter(this.$order(option.options), innerOption => {
          return (
            innerOption.name
              .toLowerCase()
              .indexOf(this.searchText.toLowerCase()) > -1
          )
        }).slice()
        return option
      })
      return _.filter(modified, topOption => {
        return topOption.options.length
      })
    }
  },
  watch: {
    params: {
      deep: true,
      handler(data) {
        this.getCertificates()
      }
    },
    '$route.name': {
      handler() {
        this.getCertificates()
        this.getFormCategories()
      }
    }
  },
  mounted() {
    this.getCertificates()
    this.getFormCategories()
  },
  methods: {
    getFormCategories() {
      if (this.getToken) {
        this.$api.dataView.create().then(res => {
          const modifiedResponse = res
            .map(item => {
              item.title = item.name
              item.options = item.forms.map(option => {
                option.title = option.name
                return option
              })
              return item
            })
            .slice()
          this.formCategories = modifiedResponse
        })
      }
    },
    getCertificates() {
      if (this.$route.params.hasOwnProperty('id')) {
        return null
      }
      this.isLoading = true
      this.$api.dataView
        .get(this.params)
        .then(res => {
          this.certificates = this.$timezone(res)
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
    deleteItem(id) {
      if (id) {
        this.$api.dataView.deleteById(id).then(res => {
          this.getCertificates()
        })
      }
      this.deleteModal.show = false
      this.deleteModal.id = null
    },
    createCertificate(createFormId) {
      this.$api.dataView
        .store({ form_id: createFormId })
        .then(res => {
          this.$router.push({
            name: 'data-view-:name-:id',
            params: { name: this.$route.params.name, id: res.id }
          })
        })
        .finally(() => {
          this.isCreate = false
        })
    },
    setOrderBy(orderBy) {
      this.params.order_by_column = orderBy.orderBy
      this.params.order_by_direction = orderBy.sortingDirection
    }
  }
}
</script>

<style scoped lang="scss">
.parent-options {
  height: 350px;
  overflow-y: auto;
  overflow-x: hidden;

  .options {
    .option {
      box-sizing: border-box;
      cursor: pointer;
      padding: 5px 10px;

      &:hover {
        background: $secondary;
      }
      &.active {
        background: $secondary;
        cursor: default;
      }
    }
  }
}
</style>
