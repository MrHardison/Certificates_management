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
              class="btn-smoke rounded small mr-2"
              @click.native="showModal = true">
              Delete
            </button-rounded>
            <button-rounded
              class="btn-green rounded small mr-2"
              @click.native="updateRole">
              Save
            </button-rounded>
          </div>
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
      updatedRole: {}
    }
  },
  mounted() {
    this.setRole()
  },
  methods: {
    updateRole() {
      this.$api().roles.updateById(this.$route.params.id, this.updatedRole)
    },
    deleteRecord() {
      this.$api()
        .recordGroups.deleteById(this.$route.params.id)
        .then(() => {
          this.$router.push({
            name: 'roles-and-permissions-users'
          })
        })
    },
    async setRole() {
      this.isLoading = true
      return await this.$api()
        .roles.getById(this.$route.params.id)
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
