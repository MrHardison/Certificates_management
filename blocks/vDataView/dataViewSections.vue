<template>
  <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
    <nav class="sections-list">
      <ul>
        <template v-for="(section, index) in transformToTree">
          <data-view-sections-tree
            v-if="!section.autoload && section.form_section_id === null"
            :key="index"
            :item="section"
            :active-section-id="activeSectionId"
            :class="{active: section.id === activeSectionId, filled: checkSectionStatus(section) === 'filled', error: validationErrorSection(section) === 'error'}"
            @make-folder="makeFolder"
            @openSection="openSection($event)"
            @click.native="section.children.length === 0 && openSection(section.id)"/>
        </template>
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dataViewSectionsTree from './dataViewSectionsTree'

export default {
  name: 'DataViewSections',
  components: { dataViewSectionsTree },
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
    ...mapGetters({
      getSectionsStatus: 'dataView/getSectionsStatus',
      storageValidationErrors: 'validation/getErrors'
    }),
    transformToTree() {
      const sections = _.cloneDeep(this.sections)
      let nodes = {}
      return _.filter(sections, obj => {
        let id = obj.id
        let parentId = obj.form_section_id

        nodes[id] = _.defaults(obj, nodes[id], { children: [] })
        parentId &&
          (nodes[parentId] = nodes[parentId] || { children: [] })[
            'children'
          ].push(obj)

        return nodes
      })
    }
  },
  watch: {
    openedSectionId: {
      deep: true,
      handler(data) {
        this.activeSectionId = this.openedSectionId
        window.scroll({
          top: 0,
          left: 0
        })
      }
    }
  },
  methods: {
    checkSectionStatus(section) {
      const item = _.find(this.getSectionsStatus, {
        form_section_id: section.id
      })
      return item && item.status
    },
    subSections(id) {
      const sub = []
      _.forEach(this.sections, section => {
        if (section.form_section_id === id) {
          sub.push(section)
        }
      })
      return sub
    },
    makeFolder(item) {
      Vue.set(item, 'children', [])
      this.addItem(item)
    },
    openSection(id) {
      this.activeSectionId = id
      this.$emit('openSection', id)
      const current = _.find(this.sections, { id })
      if (current) {
        const hasChild = _.filter(this.sections, { form_section_id: id })
        if (hasChild.length > 0) {
          this.parentSectionId = id
        }
      }
    },
    validationErrorSection(section) {
      for (let i = 0; i < this.storageValidationErrors.length; i++) {
        const errorElement = _.find(section.elements, {
          id: this.storageValidationErrors[i]
        })
        if (errorElement) {
          return 'error'
          break
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
    overflow: hidden;
    position: relative;
    padding: 8px 20px;

    & ~ .sections-item {
      margin-top: 10px;
    }

    &::before {
      content: '';
      background: $gray;
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 8px;
    }

    &.filled {
      &::before {
        background: $green_light;
      }
    }

    &:hover,
    &.active {
      &::before {
        background: $blue;
      }
    }
    &.active {
      cursor: default;
    }

    &.open {
      padding: 8px 10px;

      &::before {
        background: $blue;
      }
    }
    &.error {
      &::before {
        background: red;
      }
    }
  }
}
</style>
