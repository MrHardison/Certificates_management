<template>
  <div class="create-modal">
    <div
      class="create-body">
      <template
        v-if="!isLoading">
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
      <div
        v-if="isLoading"
        class="content-loading">
        <spinner-loader />
      </div>
    </div>
    <div class="create-footer">
      <button-rounded
        class="btn-smoke rounded small mr-2"
        @click.native="$emit('close')">
        <fa
          :icon="['fas', 'arrow-left']"
          class="mr-2" />
        Return
      </button-rounded>
      <button-rounded
        :preloading="preloading"
        class="btn-green rounded small mr-2 preloading-mr0"
        @click.native="addRecordGroup">
        Create
      </button-rounded>
    </div>
  </div>
</template>

<script>
import ButtonRounded from '~/components/buttonRounded'
import InputStandard from '~/components/inputStandard'
import Dropdown from '~/components/dropdown'
import SpinnerLoader from '~/components/spinerLoader'

export default {
  name: 'DataGroupCreate',
  components: { InputStandard, ButtonRounded, SpinnerLoader, Dropdown },
  props: {
    dataListGroupId: {
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
      isLoading: true,
      recordGroup: {},
      dataGroup: [],
      params: {
        data_list_group_id: null,
        page: 1,
        interval: 10
      },
      preloading: false
    }
  },
  // asyncComputed: {
  //   dataGroup() {
  //     if (!this.dataGroupId) {
  //       return null
  //     }
  //     return this.$api.dataGroups.getById(this.dataGroupId).then(res => {
  //       this.isLoading = false
  //       return res
  //     })
  //   }
  // },
  mounted() {
    this.$api.dataGroups
      .getById(this.dataListGroupId)
      .then(res => {
        this.dataGroup = res
        this.params.data_list_group_id = res.data_list_group_id
      })
      .finally(() => {
        this.isLoading = false
      })
  },
  methods: {
    addRecordGroup(dataListGroupId) {
      if (!this.preloading) {
        this.preloading = true
        this.$api.recordGroups
          .add({
            record_group_id: this.parentRecordGroupId,
            data_list_group_id: this.dataListGroupId,
            data: this.recordGroup,
            deleted_at: null
          })
          .then(res => {
            _.delay(() => {
              this.preloading = false
            }, 1000)
            const obj = {
              'child.data': res.data,
              'child.id': res.id,
              'child.data_list_group_id': res.data_list_group_id
            }
            this.$emit('setRecordGroup', obj)
            this.$emit('close')
          })
      }
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
