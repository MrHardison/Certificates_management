<template>
  <div class="create-modal">
    <div class="create-body">
      <div class="row">
        <template v-if="dataGroup">
          <template v-for="(element, index) in $orderObject(dataGroup.schema)">
            <div :key="index" class="col-md-12 mb-3">
              <template v-if="element.field_type === 1">
                <uiLabel
                  :description="element.field_name"
                  :name="element.name"
                />
                <input-standard
                  :placeholder="element.element_label"
                  :limits="element.hasOwnProperty('limits') && element.limits.hasOwnProperty('char') ? element.limits.char : {}"
                  :computed_value="customRecordGroup[index]"
                  @update="customRecordGroup[index] = $event"
                />
              </template>
              <template v-else-if="element.field_type === 4">
                <uiLabel :description="element.field_name" :name="element.field_name" />
                <lookup-search
                  :selected-value="customRecordGroup[index]"
                  :type="'creation'"
                  :parent-data="{allLookups: lookups}"
                  :data-list-default-id="+element.data_list_default"
                  :message="''"
                  :required="element.required"
                  :description="''"
                  @validationError="$emit('validationError', $event)"
                  @clearLookup="clearLookup(index, +element.data_list_default)"
                  @setData="setLookup($event, index)"
                />
              </template>
              <template v-else-if="element.field_type === 6">
                <label class="label">{{ element.description || element.element_label }}</label>
                <vRadio
                  :name="`${element.field_name}_${element.element_label}`"
                  :options="element.options"
                  :required="element.required"
                  @change="customRecordGroup[index] = $event"
                  @validationError="$emit('validationError', $event)"
                />
              </template>
            </div>
          </template>
        </template>
      </div>
    </div>
    <div class="create-footer">
      <button-rounded class="btn-smoke rounded small mr-2" @click.native="$emit('close')">
        <fa :icon="['fas', 'arrow-left']" class="mr-2" />Return
      </button-rounded>
      <button-rounded
        :preloading="preloading"
        class="btn-green rounded small mr-2 preloading-mr0"
        @click.native="addRecordGroup">
        Save</button-rounded>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonRounded from '~/components/buttonRounded'
import InputStandard from '~/components/inputStandard'
import Dropdown from '~/components/dropdown'
import lookupSearch from '~/components/lookupSearch'
import vRadio from '~/components/vRadio/vRadio'
import uiLabel from '~/components/label'

export default {
  name: 'DataGroupCreate',
  components: {
    InputStandard,
    ButtonRounded,
    Dropdown,
    vRadio,
    lookupSearch,
    uiLabel
  },
  props: {
    dataListGroupId: {
      type: Number,
      default: 0
    },
    parentRecordGroupId: {
      type: Number,
      default: null
    },
    singleLookupParams: {
      type: Object,
      default() {
        return {}
      }
    },
    dataGroup: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      customRecordGroup: {},
      lookups: [],
      params: {
        data_list_group_id: null,
        page: 1,
        interval: 10
      },
      preloading: false
    }
  },
  computed: {
    ...mapGetters({ getDataListDefaults: 'dataListItems/getDataListDefaults' })
  },
  mounted() {
    _.forEach(_.keys(this.dataGroup.schema), item => {
      this.customRecordGroup[item] = ''
    })
  },
  methods: {
    setLookup(data, ident) {
      const selectedLookup = this.lookups.find(
        i => i.dataListDefaultId === data.dataListDefaultId
      )
      if (selectedLookup) {
        this.lookups = this.lookups.map(i => {
          if (i.dataListDefaultId === selectedLookup.dataListDefaultId) {
            i = data
          }
          return i
        })
      } else {
        this.lookups.push(data)
      }
      this.customRecordGroup[ident] = data.title
      this.resetLookup(data, ident)
    },
    resetLookup(data) {
      const childDataListDefault = this.getDataListDefaults.data.find(
        i => i.data_list_default_id === data.dataListDefaultId
      )
      if (childDataListDefault) {
        const child = this.lookups.find(
          l => l.dataListDefaultId === childDataListDefault.id
        )
        if (child) {
          Object.keys(this.customRecordGroup).forEach(i => {
            if (this.customRecordGroup[i] === child.title) {
              this.customRecordGroup[i] = ''
            }
          })
          this.lookups = this.lookups.filter(
            l => l.dataListDefaultId !== child.dataListDefaultId
          )
          // this.refreshLookup(child)
        }
      }
    },
    addRecordGroup(dataListGroupId) {
      if (!this.preloading) {
        this.preloading = true
        let recordLookups = {
          system: [],
          custom: []
        }
        this.lookups.forEach(l => {
          recordLookups[l.type[0]].push(l.id[0])
        })
        this.$api.recordGroups
          .add({
            record_group_id: this.parentRecordGroupId,
            data_list_group_id: this.dataListGroupId,
            data: this.customRecordGroup,
            deleted_at: null,
            record_lookups_system: recordLookups.system,
            record_lookups_custom: recordLookups.custom
          })
          .then(res => {
            _.delay(() => {
              this.preloading = false
            }, 1000)
            const obj = {
              'child.data': res.data,
              'child.id': res.id,
              'child.data_list_group_id': res.data_list_group_id,
              record_lookups_system: res.record_lookups_system,
              record_lookups_custom: res.record_lookups_custom
            }
            this.$emit('setRecordGroup', obj)
            this.$emit('close')
          })
      }
    },
    clearLookup(index, dataListDefaultId) {
      this.customRecordGroup[index] = ''
      this.lookups = this.lookups.filter(
        i => i.dataListDefaultId !== dataListDefaultId
      )
      this.resetLookup({ dataListDefaultId })
    }
  }
}
</script>

<style lang="scss">
.create-modal {
  .create-body {
    overflow-y: auto;
    overflow-x: hidden;
    height: 432px;
    margin-bottom: 15px;
    position: relative;
  }
  .create-footer {
    box-sizing: border-box;
    display: flex;
    padding: 15px 0;
    position: relative;
    justify-content: space-between;

    &::before {
      background: #e9ecef;
      content: '';
      height: 1px;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 550px;
    }

    @media (max-width: 768px) {
      &::before {
        width: 500px;
      }
    }
    @media (max-width: 544px) {
      &::before {
        width: 320px;
      }
    }
  }
}
</style>
