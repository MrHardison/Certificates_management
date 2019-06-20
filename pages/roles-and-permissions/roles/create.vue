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

          <v-modal
            v-if="inputError"
            header="Warning">
            <template slot="body">
              Name and description must be filled!
            </template>
            <div
              slot="footer"
              class="d-flex w-100">
              <button-rounded
                class="btn-green rounded small mx-auto"
                @click.native="inputError = false">
                OK
              </button-rounded>
            </div>
          </v-modal>

          <div class="card-footer d-flex justify-content-end">
            <button-rounded
              :preloading="preloading"
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
import VModal from '~/components/vModal/vModal'

export default {
  name: 'Create',
  components: {
    VRole,
    ButtonRounded,
    VModal,
    SpinnerLoader
  },
  data() {
    return {
      role: {
        name: '',
        description: '',
        interface_restriction: {
          create: false,
          read: false,
          update: false,
          delete: false
        }
      },
      tree: {},
      data_groups: {},
      isLoading: false,
      updatedRole: {},
      inputError: false,
      checkPattern: /^$/,
      preloading: false
    }
  },
  mounted() {
    this.setRole()
  },
  methods: {
    createRole() {
      if (
        !this.checkPattern.test(this.role.name) &&
        !this.checkPattern.test(this.role.description)
      ) {
        if (!this.preloading) {
          this.preloading = true
          this.$api.roles.create(this.updatedRole).then(res => {
            _.delay(() => {
              this.preloading = false
            }, 1000)
            this.$router.push({
              name: 'roles-and-permissions-roles-:id',
              params: { id: res.data.data.id }
            })
          })
        }
      } else {
        this.inputError = true
      }
    },
    setRole() {
      this.isLoading = true
      this.$api.roles
        .getCreate()
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
