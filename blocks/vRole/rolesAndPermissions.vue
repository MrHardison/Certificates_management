<template>
  <div>
    <tree-item
      :title="'Access to roles and permissions tab:'"
      :opened="true"
      :default-checked="{
        read: access.read,
        update: access.update,
        create: access.create,
        delete: access.delete
      }"
      @updateItem="setItem($event)"/>
  </div>
</template>

<script>
import Checkbox from '~/components/vCheckbox'
import TreeItem from '~/blocks/vRole/treeItem'

export default {
  name: 'RolesAndPermissions',
  components: {
    Checkbox,
    TreeItem
  },
  props: {
    access: {
      type: Object,
      default() {
        return {
          create: false,
          delete: false,
          update: false,
          read: false
        }
      }
    }
  },
  data() {
    return {
      newAccess: {}
    }
  },
  watch: {
    newAccess: {
      deep: true,
      handler(data) {
        this.$emit('update', data)
      }
    }
  },
  methods: {
    setItem(item) {
      this.newAccess = item
    }
  }
}
</script>

<style scoped>
</style>
