<template>
  <div>
    <div class="item">
      <span
        :class="{disabled: opened}"
        class="item-title"
        @click="toogleList">
        {{ title }}
        <fa
          v-if="!opened"
          :icon="['fas', 'chevron-right']"
          :class="{open: isOpen}"
          class="item-icon"/>
      </span>
      <ul
        v-show="isOpen"
        class="list-sriped mt-2">
        <p class="subtitle mb-1">{{ subtitle }}</p>
        <checkbox
          :data="manualChecked.read"
          label="Read"
          @change="changeValue('read', $event)"/>
        <checkbox
          :data="manualChecked.update"
          label="Update"
          @change="changeValue('update', $event)"/>
        <checkbox
          :data="manualChecked.create"
          label="Create"
          @change="changeValue('create', $event)"/>
        <checkbox
          :data="manualChecked.delete"
          label="Full Control"
          @change="changeValue('delete', $event)"/>
      </ul>
    </div>
    <div
      v-show="isOpen"
      class="item-block">
      <slot/>
    </div>
  </div>
</template>
<script>
import Checkbox from '~/components/vCheckbox'
export default {
  name: 'TreeItem',
  components: { Checkbox },
  props: {
    title: {
      type: String,
      default: 'no title'
    },
    subtitle: {
      type: String,
      default: ''
    },
    defaultChecked: {
      type: Object,
      default() {
        return {}
      }
    },
    opened: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: false,
      manualChecked: {
        read: null,
        update: null,
        create: null,
        delete: null
      }
    }
  },
  mounted() {
    this.isOpen = this.opened ? true : false
    // this.opened ? (this.isOpen = true) : false
    this.manualChecked = {
      read: this.defaultChecked.read,
      update: this.defaultChecked.update,
      create: this.defaultChecked.create,
      delete: this.defaultChecked.delete
    }
  },
  methods: {
    changeValue(item, value) {
      if (item === 'delete' && value === true) {
        this.manualChecked = {
          read: true,
          update: true,
          create: true,
          delete: true
        }
      } else if (item === 'delete' && value === false) {
        this.manualChecked[item] = false
      }
      if (item === 'create' && value === true) {
        this.manualChecked.create = true
        this.manualChecked.update = true
        this.manualChecked.read = true
      } else if (item === 'create' && value === false) {
        this.manualChecked.create = false
        this.manualChecked.delete = false
      }
      if (item === 'update' && value === true) {
        this.manualChecked.update = true
        this.manualChecked.read = true
      } else if (item === 'update' && value === false) {
        this.manualChecked.delete = false
        this.manualChecked.create = false
        this.manualChecked.update = false
      }
      if (item === 'read' && value === true) {
        this.manualChecked[item] = true
      } else if (item === 'read' && value === false) {
        this.manualChecked = {
          read: false,
          update: false,
          create: false,
          delete: false
        }
      }
      this.$emit('updateItem', this.manualChecked)
    },
    toogleList() {
      if (this.opened) {
        this.isOpen = true
      } else {
        this.isOpen = !this.isOpen
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.subtitle {
  font-size: 0.75rem;
  text-decoration: underline;
}
.item {
  user-select: none;

  &-title {
    cursor: pointer;

    &.disabled {
      cursor: default;
    }
  }
  &-icon {
    transition: transform 0.2s ease-out;
    margin-left: 10px;

    &.open {
      transform: rotate(90deg);
    }
  }
  &-block {
    padding-top: 0.5rem;
  }

  .list-striped {
    display: block;
    margin-top: 10px;
  }
}
</style>
