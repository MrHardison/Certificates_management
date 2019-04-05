<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <template v-if="!isLoading">
            <v-role
              :default-role="role"
              :tree="tree"
              @update="updatedRole = $event"/>
          </template>
          <div
            v-if="isLoading"
            class="loader">
            <spinner-loader />
          </div>

          <div class="card-footer d-flex justify-content-end">
            <button-rounded
              class="btn-green rounded small mr-2"
              @click.native="createRole">
              Create
            </button-rounded>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonRounded from '~/components/buttonRounded'
import SpinnerLoader from '~/components/spinerLoader'
import VRole from '~/blocks/vRole/'

export default {
  name: 'Create',
  components: {
    VRole,
    ButtonRounded,
    SpinnerLoader
  },
  data() {
    return {
      role: {
        name: 'Has no name',
        description: 'Has no description',
        interface_restriction: {
          create: false,
          read: false,
          update: false,
          delete: false
        }
      },
      tree: {},
      data_groups: {},
      showModal: false,
      isLoading: false,
      updatedRole: {}
    }
  },
  mounted() {
    this.setRole()
  },
  methods: {
    createRole() {
      this.$api()
        .roles.create(this.updatedRole)
        .then(res => {
          this.$router.push({
            name: 'roles-and-permissions-roles-:id',
            params: { id: res.data.data.id }
          })
        })
    },
    async setRole() {
      this.isLoading = true
      return await this.$api()
        .roles.getCreate()
        .then(res => {
          this.tree = res.tree
        })
        .catch(err => {
          this.$router.push({ name: 'roles-and-permissions-roles' })
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
