<template>
  <div class="col-md-2">
    <nav class="sections-list">
      <ul>
        <template v-for="(section, index) in sectionsToShow">
          <li
            :key="index"
            :class="{ active: section.id === activeSectionId}"
            class="sections-item"
            @click="openSection(section.id)">{{ section.name }}</li>
        </template>
        <li
          v-show="showReturnBtn"
          class="sections-item"
          @click="backSections">Return</li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'DataViewSections',
  props: {
    sections: {
      type: Array,
      default() {
        return []
      }
    },
    openedSectionId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      parentSectionId: null,
      activeSectionId: 0
    }
  },
  computed: {
    sectionsToShow() {
      return _.filter(this.sections, {
        form_section_id: this.parentSectionId
      })
    },
    showReturnBtn() {
      const current = _.find(this.sections, { id: this.activeSectionId })
      if (!current) {
        return false
      }
      if (current.form_section_id) {
        return true
      }
      const possibleChild = _.filter(this.sections, {
        form_section_id: current.id
      })
      return possibleChild.length
    }
  },
  watch: {
    openedSectionId() {
      this.activeSectionId = this.openedSectionId
    }
  },
  methods: {
    backSections() {
      const parent = _.find(this.sections, { id: this.parentSectionId })
      if (parent && parent.form_section_id) {
        this.parentSectionId = parent.form_section_id
      } else {
        this.parentSectionId = null
      }
    },
    openSection(id) {
      this.activeSectionId = id
      this.$emit('openSection', id)
      const current = _.find(this.sections, { id })
      if (current) {
        const hasChild = _.filter(this.sections, { form_section_id: id })
        if (hasChild.length) {
          this.parentSectionId = id
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sections-list {
  .sections-item {
    background: #fff;
    border-radius: 8px;
    box-sizing: border-box;
    box-shadow: 0 1px 6px -1px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    margin-bottom: 10px;
    overflow: hidden;
    position: relative;
    padding: 8px 20px;

    &::before {
      content: '';
      background: #f00f00;
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 8px;
    }

    &.filled {
      &::before {
        background: #00c200;
      }
    }

    &.unfilled {
      &::before {
        background: #fcac01;
      }
    }

    &:hover,
    &.active {
      &::before {
        background: #0092bf !important;
      }
    }
    &.active {
      cursor: default;
    }
  }
}
</style>
