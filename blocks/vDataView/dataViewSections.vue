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
            :class="{active: section.id === activeSectionId, filled: checkSectionStatus(section), error: validationErrorSection(section) === 'error'}"
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
    selectedSectionId: {
      type: Number,
      default: null
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    },
    sectionsStatus: {
      type: Array,
      default() {
        return []
      }
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
      storageValidationErrors: 'validation/getErrors'
    }),
    transformToTree() {
      const sections = this.$order(_.cloneDeep(this.form.sections))
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
    selectedSectionId: {
      handler(data) {
        if (data) {
          this.activeSectionId = data
        }
      }
    }
  },
  methods: {
    checkSectionStatus(section) {
      const item = this.sectionsStatus.find(id => section.id === id)
      return item && true
    },
    makeFolder(item) {
      Vue.set(item, 'children', [])
      this.addItem(item)
    },
    openSection(id) {
      this.$emit('openSection', id)
      const current = this.form.sections.find(s => id === id)
      if (current) {
        const hasChild = this.form.sections.filter(
          s => s.form_section_id === id
        )
        if (hasChild.length) {
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
    user-select: none;

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

    &.folder {
      padding: 0;

      &.open {
        padding: 0 10px;
      }
    }
  }
}
</style>
