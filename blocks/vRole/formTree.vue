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
                :title="category.name"
                :subtitle="'Permissions for all forms within this category'"
                :default-checked="{
                  read: getFormCategoryChecks(category.id).read,
                  update: getFormCategoryChecks(category.id).update,
                  create: getFormCategoryChecks(category.id).create,
                  delete: getFormCategoryChecks(category.id).delete
                }"
                @updateItem="setFormCategoryChecks(category.id, $event)">
                <ul
                  class="list-striped">
                  <p class="description">Permissions for individual forms</p>
                  <template v-for="form in category.forms">
                    <li
                      :key="form.id"
                      class="list-striped--item">
                      <tree-item
                        :title="form.name"
                        :default-checked="{
                          read: getFormChecks(form.id).read,
                          update: getFormChecks(form.id).update,
                          create: getFormChecks(form.id).create,
                          delete: getFormChecks(form.id).delete
                        }"
                        @updateItem="setFormChecks(form.id, $event)"/>
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
import Checkbox from '~/components/vCheckbox'
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
    setFormCategoryChecks(id, item) {
      this.checkedFormCategories[id] = item
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
    setFormChecks(id, item) {
      this.checkedForms[id] = item
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
    padding: 0.5rem 1.5rem;
    position: relative;
  }
}
.description {
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
  text-decoration: underline;
  padding-left: 1.5rem;
}
</style>
