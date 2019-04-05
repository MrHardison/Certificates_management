<template>
  <div class="row align-items-end mb-3">
    <div class="col-md-6">
      <input-standard
        :label="'Certificate name'"
        :placeholder="'Certificate name'"
        :computed_value="certificate.name"
        @update="$emit('setName', $event)"/>
    </div>
    <div class="col-md-6 text-right">
      <button
        class="form-link"
        @click.prevent="$emit('openPdf')">
        <fa :icon="['fal', 'file']"/>
        Preview
      </button>
      <button
        :class="{disabled: validationErrors.length > 0}"
        class="form-link save"
        @click="$emit('updateCertificate')">
        <fa :icon="['fal', 'save']"/>
        Update
      </button>
    </div>
  </div>
</template>
<script>
import InputStandard from '~/components/inputStandard/inputStandard'

export default {
  name: 'DataViewTitle',
  components: { InputStandard },
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
    }
  }
}
</script>
<style lang="scss" scoped>
.form-link {
  align-items: center;
  background: #ffffff;
  border: 1px solid #d4d9e1;
  border-radius: 40px;
  color: #007fb2;
  cursor: pointer;
  display: inline-flex;
  font-size: 1rem;
  line-height: 1.5;
  height: calc(2.25rem + 2px);
  transition: all 0.4s;
  text-decoration: none;
  margin: 0;
  padding: 0 15px;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  svg {
    margin-right: 10px;
  }
  &.save {
    background: #90ca2a;
    color: #fff;

    &:hover {
      background: #7fb325;
    }
  }

  &.disabled {
    cursor: default;
    background: $gray;

    &:hover {
      background: $gray;
    }
  }
}
.form-group {
  margin-bottom: 0;
}
</style>
