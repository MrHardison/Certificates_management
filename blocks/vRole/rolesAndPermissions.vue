<template>
  <div>
    <h4>Access to roles and permissions tab:</h4>
    <checkbox
      :default-checked="access.read"
      label="Read"
      @change="access.read = $event"/>
    <checkbox
      :default-checked="access.update"
      label="Update"
      @change="access.update = $event"/>
    <checkbox
      :default-checked="access.create"
      label="Create"
      @change="access.create = $event"/>
    <checkbox
      :default-checked="access.delete"
      label="Delete"
      @change="access.delete = $event"/>
  </div>
</template>

<script>
import Checkbox from '~/components/checkbox'

export default {
  name: 'RolesAndPermissions',
  components: {
    Checkbox
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
  watch: {
    access: {
      deep: true,
      handler(data) {
        this.$emit('udate', data)
      }
    }
  }
}
</script>

<style scoped>
</style>
