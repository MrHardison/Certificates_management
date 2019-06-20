<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <template v-if="!isLoading && user.properties">
            <div class="row">
              <div class="col-md-6">
                <input-standard
                  key="email"
                  :computed_value="user.email"
                  type="email"
                  label="Email"
                  @update="user.email = $event"/>
              </div>
              <div class="col-md-6">
                <input-standard
                  key="full_name"
                  :computed_value="user.properties.user_full_name"
                  label="Full name"
                  @update="user.properties.user_full_name = $event"/>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <span>Roles</span>
              </div>
              <template
                v-for="role in roles">
                <div
                  :key="role.id"
                  class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                  <checkbox
                    :default-checked="userRoles[role.id]"
                    :label="role.name"
                    @change="userRoles[role.id] = $event"/>
                </div>
              </template>
            </div>
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
              @click.native="updateUser">
              <fa
                :icon="['fas', 'check']"
                class="mr-2" />
              Save
            </button-rounded>
          </div>
          <v-modal
            v-if="showModal"
            header="Are you sure want to delete this item?"
            @close="showModal = false">
            <template slot="body">
              Please confirm the deletion of this user. And all the records that depend on it.
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
import InputStandard from '~/components/inputStandard'
import Checkbox from '~/components/checkbox'

export default {
  name: 'Id',
  components: {
    Checkbox,
    InputStandard,
    VModal,
    ButtonRounded,
    SpinnerLoader
  },
  data() {
    return {
      user: {},
      showModal: false,
      isLoading: false,
      roles: [],
      userRoles: {},
      preloading: false,
      deletePreloading: false
    }
  },
  mounted() {
    this.setUser()
  },
  methods: {
    updateUser() {
      _.forEach(_.keys(this.userRoles), key => {
        if (!this.userRoles[key]) {
          delete this.userRoles[key]
        }
      })
      const req = {
        user: this.user,
        roles: _.keys(this.userRoles)
      }
      if (!this.preloading) {
        this.preloading = true
        this.$api.users.updateById(this.$route.params.id, req).then(res => {
          _.delay(() => {
            this.preloading = false
          }, 1000)
        })
      }
    },
    deleteRecord() {
      if (!this.deletePreloading) {
        this.deletePreloading = true
        this.$api.users.deleteById(this.$route.params.id).then(() => {
          _.delay(() => {
            this.deletePreloading = false
          }, 1000)
          this.$router.push({
            name: 'roles-and-permissions-users'
          })
        })
      }
    },
    setUser() {
      this.isLoading = true
      this.$api.users
        .getById(this.$route.params.id)
        .then(res => {
          this.user = res.user
          this.roles = res.roles
          _.forEach(res.roles, role => {
            this.userRoles[role.id] = !!_.find(res.user.roles, { id: role.id })
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.form-check {
  padding-left: 0.5rem;
  margin-bottom: 10px;
}
</style>
