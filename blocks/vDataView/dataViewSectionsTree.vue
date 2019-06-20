<template>
  <li
    :class="{open: isOpen}"
    class="sections-item">
    <div
      :class="{bold: isFolder, active: isOpen}"
      @click="toggle">
      {{ item.name }}
      <fa
        v-if="isFolder"
        :icon="['fas', 'chevron-up']"
        class="arrow"/>
    </div>
    <ul
      v-show="isOpen"
      v-if="isFolder"
      class="child-list">
      <data-view-sections-tree
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
        :active-section-id="activeSectionId"
        :class="{active: activeSectionId === child.id ,filled: checkSectionStatus(child) === 'filled'}"
        class="sections-item"
        @click.native="$emit('openSection', child.id)"/>
    </ul>
  </li>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DataViewSectionsTree',
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    activeSectionId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    ...mapGetters({ getSectionsStatus: 'dataView/getSectionsStatus' }),
    isFolder() {
      return this.item.children && this.item.children.length
    }
  },
  methods: {
    checkSectionStatus(section) {
      const item = _.find(this.getSectionsStatus, {
        form_section_id: section.id
      })
      return item && item.status
    },
    toggle() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen
      }
    },
    makeFolder() {
      if (!this.isFolder) {
        this.$emit('make-folder', this.item)
        this.isOpen = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bold {
  align-items: center;
  display: flex;
  position: relative;
  justify-content: space-between;

  .arrow {
    transform: rotate(90deg);
    transition: transform 0.2s;
  }

  &.active {
    padding: 0 10px;

    .arrow {
      transform: rotate(180deg);
    }
  }
}
.child-list {
  box-sizing: border-box;
  padding-left: 10px;
  margin: 20px 0 10px 0;

  .sections-item {
    background: #fff;
    border-radius: 8px;
    box-sizing: border-box;
    box-shadow: 0 1px 6px -1px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    overflow: hidden;
    position: relative;
    padding: 8px 20px;
    transition: height 0.3s ease-in-out;

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
        background: $blue !important;
      }
    }
    &.active {
      cursor: default;
    }

    &.open {
      .arrow {
        transform: rotate(-90deg);
      }
    }
  }
}
</style>
