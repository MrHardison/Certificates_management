<template>
  <div class="empty col-12 p-0">
    <div
      :class="{'justify-content-end': selectedSectionIndex === 0 }"
      class="btns-wrapper">
      <button-rounded
        v-if="selectedSectionIndex > 0"
        :class="{error: errors}"
        class="btn-white rounded medium active"
        @click.native="prev">
        <fa
          :icon="['far', 'arrow-left']"
          class="mr-3"/>
        Prev
      </button-rounded>
      <button-rounded
        v-if="selectedSectionIndex + 1 < filteredSections.length"
        :class="{error: errors}"
        class="btn-white rounded medium active"
        @click.native="next">
        Next
        <fa
          :icon="['far', 'arrow-right']"
          class="ml-3"/>
      </button-rounded>
    </div>
  </div>
</template>

<script>
import buttonRounded from '~/components/buttonRounded'

export default {
  name: 'CertificateNav',
  components: {
    buttonRounded
  },
  props: {
    sections: {
      type: Array,
      default() {
        return []
      }
    },
    selectedSectionId: {
      type: Number,
      default: 0
    },
    validationErrors: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      errors: false
    }
  },
  computed: {
    filteredSections() {
      return _.filter(this.sections, section => {
        return section.autoload === false
      })
    },
    selectedSectionIndex() {
      const selectedSection = _.find(this.filteredSections, {
        id: this.selectedSectionId
      })
      return _.indexOf(this.filteredSections, selectedSection)
    }
  },
  watch: {
    validationErrors: {
      deep: true,
      handler(data) {
        this.errors = data.length ? true : false
      }
    }
  },
  methods: {
    prev() {
      if (!this.errors) {
        this.selectedSectionIndex > 0 &&
          this.$emit(
            'selectedSectionId',
            this.filteredSections[
              this.filteredSections[this.selectedSectionIndex - 1].elements
                .length
                ? this.selectedSectionIndex - 1
                : this.selectedSectionIndex - 2
            ].id
          )
      }
    },
    next() {
      if (!this.errors) {
        this.selectedSectionIndex + 1 < this.filteredSections.length &&
          this.$emit(
            'selectedSectionId',
            this.filteredSections[
              this.filteredSections[this.selectedSectionIndex + 1].elements
                .length
                ? this.selectedSectionIndex + 1
                : this.selectedSectionIndex + 2
            ].id
          )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.empty {
  display: flex;
  justify-content: flex-end;
}
.btns-wrapper {
  align-items: center;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  background: #fff;
  display: flex;
  margin-top: 1rem;
  padding: 0.75rem 1.25rem;
  justify-content: space-between;
  width: 100%;
}
</style>
