<template>
  <div class="container-list-striped">
    <ul class="list-striped">
      <template v-for="(category, index) in tree">
        <template v-if="category.forms.length">
          <div
            :key="index" 
            class="list">
            <li
              class="list-striped--item outher">
              <tree-item
                :title="category.name">
                <ul
                  class="list-sriped">
                  <checkbox
                    :default-checked="getFormCategoryChecks(category.id).read"
                    label="Read"
                    @change="setFormCategoryChecks(category.id, 'read', $event)"/>
                  <checkbox
                    :default-checked="getFormCategoryChecks(category.id).update"
                    label="Update"
                    @change="setFormCategoryChecks(category.id, 'update', $event)"/>
                  <checkbox
                    :default-checked="getFormCategoryChecks(category.id).create"
                    label="Create"
                    @change="setFormCategoryChecks(category.id, 'create', $event)"/>
                  <checkbox
                    :default-checked="getFormCategoryChecks(category.id).delete"
                    label="Delete"
                    @change="setFormCategoryChecks(category.id, 'delete', $event)"/>
                </ul>
                <ul
                  class="list-striped">
                  <template v-for="form in category.forms">
                    <li
                      :key="form.id"
                      class="list-striped--item">
                      <tree-item
                        :title="form.name">
                        <div
                          class="list-striped">
                          <checkbox
                            :default-checked="getFormChecks(form.id).read"
                            label="Read"
                            @change="setFormChecks(form.id, 'read', $event)"/>
                          <checkbox
                            :default-checked="getFormChecks(form.id).update"
                            label="Update"
                            @change="setFormChecks(form.id, 'update', $event)"/>
                          <checkbox
                            :default-checked="getFormChecks(form.id).create"
                            label="Create"
                            @change="setFormChecks(form.id, 'create', $event)"/>
                          <checkbox
                            :default-checked="getFormChecks(form.id).delete"
                            label="Delete"
                            @change="setFormChecks(form.id, 'delete', $event)"/>
                        </div>
                      </tree-item>
                    </li>
                  </template>
                </ul>
              </tree-item>
            </li>
          </div>
        </template>
      </template>
    </ul>
  </div>
</template>

<script>
import Checkbox from '~/components/checkbox/checkbox'
import TreeItem from '~/blocks/vRole/treeItem'
export default {
  name: 'FormTree',
  components: { Checkbox, TreeItem },
  props: {
    forms: {
      type: Array,
      default() {
        return []
      }
    },
    roleForms: {
      type: Array,
      default() {
        return []
      }
    },
    formCategories: {
      type: Array,
      default() {
        return []
      }
    },
    roleFormCategories: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      checkedForms: {},
      checkedFormCategories: {}
    }
  },
  computed: {
    tree() {
      return this.formCategories.map(category => {
        category.forms = this.forms.filter(form => {
          return form.form_category_id === category.id
        })
        return category
      })
    }
  },
  methods: {
    getFormCategoryChecks(id) {
      const find = this.checkedFormCategories[id]
      const checked = this.roleFormCategories.find(value => {
        return value.id === id
      })
      if (checked) {
        return {
          create: checked.pivot.create,
          read: checked.pivot.read,
          update: checked.pivot.update,
          delete: checked.pivot.delete
        }
      }

      if (!find) {
        return {
          create: false,
          read: false,
          update: false,
          delete: false
        }
      }
      return find
    },
    setFormCategoryChecks(id, check, value) {
      const find = this.checkedFormCategories[id]
      if (!find) {
        const newCheck = {
          create: false,
          read: false,
          update: false,
          delete: false
        }
        this.checkedFormCategories[id] = newCheck
      }
      Object.keys(this.checkedFormCategories).forEach(item => {
        if (parseInt(item) === parseInt(id)) {
          this.checkedFormCategories[id][check] = value
        }
      })
      this.$emit('updateFormCategories', this.checkedFormCategories)
    },
    getFormChecks(id) {
      const find = this.checkedForms[id]
      const checked = this.roleForms.find(value => {
        return value.id === id
      })
      if (checked) {
        return {
          create: checked.pivot.create,
          read: checked.pivot.read,
          update: checked.pivot.update,
          delete: checked.pivot.delete
        }
      }

      if (!find) {
        return {
          create: false,
          read: false,
          update: false,
          delete: false
        }
      }
      return find
    },
    setFormChecks(id, check, value) {
      const find = this.checkedForms[id]
      if (!find) {
        const newCheck = {
          create: false,
          read: false,
          update: false,
          delete: false
        }
        this.checkedForms[id] = newCheck
      }
      Object.keys(this.checkedForms).forEach(item => {
        if (parseInt(item) === parseInt(id)) {
          this.checkedForms[id][check] = value
        }
      })
      this.$emit('updateForms', this.checkedForms)
    }
  }
}
</script>

<style scoped lang="scss">
.list {
  border-bottom: 1px solid #eceeef;

  &:last-child {
    border-bottom: 0;
  }
}
.list-striped {
  &--item {
    padding: 0.5rem 0.75rem;
    position: relative;
  }
}
</style>
