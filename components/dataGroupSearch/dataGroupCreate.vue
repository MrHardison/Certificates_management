<template>
  <v-modal
    class="createModal"
    header="Create"
    @close="$emit('close')">
    <template slot="body">
      <div class="row">
        <template v-if="dataGroup">
          <template v-for="(element, index) in $orderObject(dataGroup.schema)">
            <div
              v-if="element.field_type === 1"
              :key="index"
              class="col-md-12">
              <template v-if="element.field_type === 1">
                <input-standard
                  :label="element.element_label"
                  :placeholder="element.element_label"
                  :limits="element.hasOwnProperty('limits') && element.limits.hasOwnProperty('char') ? element.limits.char : {}"
                  :computed_value="recordGroup[index]"
                  @update="recordGroup[index] = $event"/>
              </template>
            </div>
          </template>
        </template>
      </div>
    </template>
    <div slot="footer">
      <button-rounded
        class="btn-smoke rounded small mr-2"
        @click.native="$emit('close')">
        Close
      </button-rounded>
      <button-rounded
        class="btn-green rounded small mr-2"
        @click.native="addRecord">
        Create
      </button-rounded>
    </div>
  </v-modal>
</template>

<script>
import VModal from '~/components/vModal'
import ButtonRounded from '~/components/buttonRounded'
import InputStandard from '~/components/inputStandard'
import VDropdown from '../dropdown/dropdown'

export default {
  name: 'DataGroupCreate',
  components: { VDropdown, InputStandard, ButtonRounded, VModal },
  props: {
    dataGroupId: {
      type: Number,
      default: 0
    },
    parentRecordGroupId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      recordGroup: {}
    }
  },
  asyncComputed: {
    dataGroup() {
      if (!this.dataGroupId) {
        return null
      }
      return this.$api()
        .dataGroups.getById(this.dataGroupId)
        .then(res => {
          return res
        })
    },
    recordGroups() {
      if (!this.dataGroup) {
        return []
      }
    }
  },
  methods: {
    addRecord() {
      this.$api()
        .recordGroups.add({
          record_group_id: this.parentRecordGroupId,
          data_list_group_id: this.dataGroupId,
          data: this.recordGroup,
          deleted_at: null
        })
        .then(res => {
          const obj = {
            'child.data': res.data.data.data,
            'child.id': res.data.data.id
          }
          this.$emit('setCustomerData', obj)
          this.$emit('close')
        })
        .catch(err => {})
    }
  }
}
</script>

<style lang="scss">
.createModal {
  .modal-wrapper {
    .modal-container {
      .modal-body {
        overflow-y: auto;
        overflow-x: hidden;
      }
    }
  }
}
</style>
