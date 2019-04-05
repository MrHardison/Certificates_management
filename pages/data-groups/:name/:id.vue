<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <div class="row">
            <template v-if="dataGroup">
              <template v-for="(element, index) in $orderObject(dataGroup.schema)">
                <div
                  v-if="element.field_type === 1"
                  :key="index"
                  class="col-md-4">
                  <template v-if="element.field_type === 1">
                    <input-standard
                      :label="element.element_label"
                      :placeholder="element.element_label"
                      :limits="element.hasOwnProperty('limits') && element.limits.hasOwnProperty('char') ? element.limits.char : {}"
                      :computed_value="recordGroup[index]"
                      :field-name="element.field_name"
                      :validate="element.validate"
                      :required="element.required"
                      :validation-message="element.validation_message"
                      @validationError="checkValidationErrors($event)"
                      @update="recordGroup[index] = $event"/>
                  </template>
                </div>
              </template>
            </template>
          </div>
          <div
            v-if="isLoading"
            class="loader">
            <spiner-loader/>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-end">
          <button-rounded
            class="btn-smoke rounded small mr-2"
            @click.native="showModal = true">
            Delete
          </button-rounded>
          <button-rounded
            :class="{disabled: validationErrors.length > 0}"
            class="btn-green rounded small mr-2"
            @click.native="updateRecord">
            Save
          </button-rounded>
        </div>
        <v-modal
          v-if="showModal"
          header="Are you sure want to delete this item?"
          @close="showModal = false">
          <template slot="body">
            Please confirm the deletion of this record. And all the records that depend on it.
          </template>
          <div slot="footer">
            <button-rounded
              class="btn-smoke rounded small mr-2"
              @click.native="showModal = false">
              Cancel
            </button-rounded>
            <button-rounded
              class="btn-green rounded small mr-2"
              @click.native="deleteRecord">
              Delete
            </button-rounded>
          </div>
        </v-modal>
      </div>
    </div>
    <template v-if="Object.keys(childTabs).length">
      <v-record-group-tabs
        :tabs="childTabs"
        class="mt-3"/>
    </template>
  </div>
</template>

<script>
import InputStandard from '~/components/inputStandard/inputStandard'
import ButtonRounded from '~/components/buttonRounded/buttonRounded'
import VModal from '~/components/vModal/vModal'
import VTable from '~/components/table/vTable'
import SpinerLoader from '~/components/spinerLoader'
import VRecordGroupTabs from '~/blocks/vRecordGroupTabs/vRecordGroupTabs'
import { mapGetters } from 'vuex'

export default {
  name: 'Id',
  components: {
    VRecordGroupTabs,
    VTable,
    VModal,
    ButtonRounded,
    InputStandard,
    SpinerLoader
  },
  props: {
    dataListGroupId: {
      type: Number,
      default: 0
    },
    childTabs: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dataGroup: {},
      validationErrors: [],
      recordGroup: {},
      showModal: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({ getToken: 'token/getApiToken' })
  },
  mounted() {
    this.getDataGroup()
  },
  methods: {
    getDataGroup() {
      if (this.dataListGroupId === 0 && this.$route.params.id) {
        return
      } else if (this.$route.params.id) {
        this.isLoading = true
        this.$api()
          .recordGroups.getById(this.$route.params.id)
          .then(res => {
            if (_.isPlainObject(res.data)) {
              this.recordGroup = res.data
            }
            if (res.data_list_group_id !== this.dataListGroupId) {
              this.$router.push({
                name: 'error'
              })
            }
          })
        if (this.getToken) {
          this.$api()
            .dataGroups.getById(this.dataListGroupId)
            .then(res => {
              this.dataGroup = res
            })
            .finally(() => {
              this.isLoading = false
            })
        }
      }
    },
    updateRecord() {
      if (this.validationErrors.length === 0) {
        this.$api().recordGroups.updateById(this.$route.params.id, {
          data: this.recordGroup
        })
      }
    },
    deleteRecord() {
      this.$api()
        .recordGroups.deleteById(this.$route.params.id)
        .then(() => {
          this.$router.push({
            name: 'data-groups-:name',
            params: { name: this.$route.params.name }
          })
        })
    },
    checkValidationErrors(error) {
      if (error[1] === false) {
        if (this.validationErrors.indexOf(error[0]) >= 0) {
          this.validationErrors.splice(
            this.validationErrors.indexOf(error[0]),
            1
          )
        }
      } else if (error[1] === true) {
        if (this.validationErrors.indexOf(error[0]) < 0) {
          this.validationErrors.push(error[0])
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
