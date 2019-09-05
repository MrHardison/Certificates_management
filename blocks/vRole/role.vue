<template>
  <div
    v-if="Object.keys(role).length"
    class="v-role row">
    <div class="col-md-12 mb-4">
      <div class="row">
        <div
          class="col-md-4">
          <input-standard
            :computed_value="role.name"
            label="Name"
            @update="role.name = $event" />
        </div>
        <div
          class="col-md-4">
          <input-standard
            :computed_value="role.description"
            label="Description"
            @update="role.description = $event" />
        </div>
        <div
          class="col-md-4">
          <div class="form-group">
            <h4 class="label">Login:</h4>
            <checkbox
              :data="role.login_app"
              label="APP"
              @change="role.login_app = $event"/>
            <checkbox
              :data="role.login_web"
              label="WEB"
              @change="role.login_web = $event"/>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 mb-4">
      <h4 class="title">Data groups</h4>
      <div class="row">
        <template v-for="(group, index) in tree.data_groups">
          <div
            :key="index"
            class="col-md-2">
            <tree-item
              :opened="true"
              :title="group.name"
              :default-checked="{
                read: checkedDataGroups[group.id].read,
                update: checkedDataGroups[group.id].update,
                create: checkedDataGroups[group.id].create,
                delete: checkedDataGroups[group.id].delete
              }"
              @updateItem="checkedDataGroups[group.id] = $event"/>
          </div>
        </template>
      </div>
    </div>

    <div class="col-12">
      <h4 class="title">Forms</h4>
      <checkbox
        :data="role.own_certificates"
        label="Only self created certificates?"
        @change="role.own_certificates = $event"/>
      <div class="row mt-4">
        <form-tree
          :forms="tree.forms"
          :role-forms="role.forms"
          :form-categories="tree.form_categories"
          :role-form-categories="role.form_categories"
          class="col"
          @updateForms="forms = $event"
          @updateFormCategories="formCategories = $event"/>
      </div>
    </div>

    <roles-and-permissions
      :access="interfaceRestriction"
      class="col-12 my-4"
      @update="role.interface_restriction = $event"/>
  </div>
</template>

<script>
import Checkbox from '~/components/vCheckbox'
import InputStandard from '~/components/inputStandard'
import FormTree from './formTree'
import TreeItem from '~/blocks/vRole/treeItem'
import RolesAndPermissions from './rolesAndPermissions'

export default {
  name: 'VRole',
  components: {
    RolesAndPermissions,
    FormTree,
    TreeItem,
    Checkbox,
    InputStandard
  },
  props: {
    defaultRole: {
      type: Object,
      default() {
        return {}
      }
    },
    tree: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      role: {},
      data_groups: [],
      forms: [],
      formCategories: []
    }
  },
  computed: {
    checkedDataGroups() {
      let res = {}
      if (_.keys(this.tree).length) {
        const dataGroups = this.tree.hasOwnProperty('data_groups')
          ? this.tree.data_groups
          : []
        _.forEach(dataGroups, item => {
          const checked = this.getDefaultGroups(item.id)
          if (checked) {
            res[item.id] = checked
          } else {
            res[item.id] = {
              create: false,
              update: false,
              read: false,
              delete: false
            }
          }
        })
      }
      return res
    },
    interfaceRestriction() {
      return this.role.interface_restriction
        ? this.role.interface_restriction
        : {
            create: false,
            update: false,
            read: false,
            delete: false
          }
    },
    computedRole() {
      return {
        name: this.role.name,
        description: this.role.description,
        login_app: this.role.login_app,
        login_web: this.role.login_web,
        data_groups: this.checkedDataGroups,
        forms: this.forms,
        form_categories: this.formCategories,
        interface_restriction: this.role.interface_restriction,
        own_certificates: this.role.own_certificates
      }
    }
  },
  watch: {
    computedRole: {
      deep: true,
      handler(data) {
        this.$emit('update', data)
      }
    }
  },
  mounted() {
    this.role = this.defaultRole
  },
  methods: {
    getDefaultGroups(id) {
      const original = _.find(this.defaultRole.data_groups, { id: id })
      if (original) {
        const response = {}
        response.create = original.pivot.create
        response.read = original.pivot.read
        response.update = original.pivot.update
        response.delete = original.pivot.delete
        return response
      }
      return null
    }
  }
}
</script>

<style scoped>
h4.label {
  color: #818e9e;
  font-size: 16px;
  font-weight: 500;
  line-height: 26px;
}
h4.title {
  margin-bottom: 20px;
}
.form-check {
  padding-left: 0.5rem;
}
</style>
