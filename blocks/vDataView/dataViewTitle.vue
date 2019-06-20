<template>
  <div class="row align-items-end mb-3">
    <div class="col-md-6">
      <input-standard
        :label="'Certificate name'"
        :placeholder="'Certificate name'"
        :computed_value="certificate.name"
        @update="$emit('setName', $event)"/>
    </div>
    <div class="col-md-6 text-right responsive">
      <button-rounded
        :preloading="preloading.preview"
        :class="{'btn-smoke': validationErrors.length}"
        class="btn-white rounded medium preloading-mr0"
        @click.native="$emit('updateCertificate', true)">
        <fa
          :icon="['fal', 'file']"
          class="mr-2"/>
        Preview
      </button-rounded>
      <button-rounded
        :preloading="preloading.update"
        :class="{'btn-smoke': validationErrors.length}"
        class="btn-green rounded medium preloading-mr0"
        @click.native="$emit('updateCertificate')">
        <fa
          :icon="['fal', 'save']"
          class="mr-2"/>
        Save
      </button-rounded>
    </div>
  </div>
</template>
<script>
import InputStandard from '~/components/inputStandard/inputStandard'
import buttonRounded from '~/components/buttonRounded'

export default {
  name: 'DataViewTitle',
  components: { InputStandard, buttonRounded },
  props: {
    certificate: {
      type: Object,
      default() {
        return {}
      }
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    },
    validationErrors: {
      type: Array,
      default() {
        return []
      }
    },
    preloading: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.responsive {
  @media (max-width: 768px) {
    margin: 1rem 0;
    text-align: center !important;
  }
}
.form-group {
  margin-bottom: 0;
}
</style>
