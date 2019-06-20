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
          <div class="card-footer d-flex justify-content-end pr-0">
            <button-rounded
              class="btn-smoke rounded small mr-2"
              @click.native="showModal = true">
              <fa
                :icon="['fal', 'trash-alt']"
                class="mr-2" />
              Delete
            </button-rounded>
            <button-rounded
              :preloading="preloading"
              class="btn-green rounded small preloading-mr0"
              @click.native="updateRole">
              <fa
                :icon="['fas', 'check']"
                class="mr-2" />
              Save
            </button-rounded>
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

          <v-modal
            v-if="showModal"
            header="Are you sure want to delete this item?"
            @close="showModal = false">
            <template slot="body">
              Please confirm the deletion of this record. And all the records that depend on it.
            </template>
            <div slot="footer">
              <button-rounded
                class="btn-smoke rounded small mr-2"
                @click.native="showModal = false">
                Cancel
              </button-rounded>
              <button-rounded
                :preloading="deletePreloading"
                class="btn-green rounded small mr-2"
                @click.native="deleteRecord">
                Delete
              </button-rounded>
            </div>
          </v-modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonRounded from '~/components/buttonRounded'
import VModal from '~/components/vModal/vModal'
import SpinnerLoader from '~/components/spinerLoader'
import VRole from '~/blocks/vRole/'

export default {
  name: 'Id',
  components: {
    VRole,
    VModal,
    ButtonRounded,
    SpinnerLoader
  },
  data() {
    return {
      role: {},
      tree: {},
      data_groups: {},
      showModal: false,
      isLoading: false,
      updatedRole: {},
      inputError: false,
      checkPattern: /^$/,
      preloading: false,
      deletePreloading: false
    }
  },
  mounted() {
    this.setRole()
  },
  methods: {
    updateRole() {
      if (
        !this.checkPattern.test(this.updatedRole.name) &&
        !this.checkPattern.test(this.updatedRole.description)
      ) {
        if (!this.preloading) {
          this.preloading = true
          this.$api.roles
            .updateById(this.$route.params.id, this.updatedRole)
            .then(res => {
              _.delay(() => {
                this.preloading = false
              }, 1000)
            })
        }
      } else {
        this.inputError = true
      }
    },
    deleteRecord() {
      if (!this.deletePreloading) {
        this.deletePreloading = true
        this.$api.roles.deleteById(this.$route.params.id).then(() => {
          _.delay(() => {
            this.deletePreloading = false
          }, 1000)
          this.$router.push({
            name: 'roles-and-permissions-roles'
          })
        })
      }
    },
    setRole() {
      this.isLoading = true
      this.$api.roles
        .getById(this.$route.params.id)
        .then(res => {
          this.role = res.role
          this.tree = res.tree
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
