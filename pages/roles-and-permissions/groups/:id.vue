<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <template v-if="!isLoading">
            <div class="row">
              <div class="col-md-6">
                <input-standard
                  key="name"
                  :computed_value="group.name"
                  label="Name"
                  @update="group.name = $event"/>
              </div>
              <div class="col-md-6">
                <input-standard
                  key="description"
                  :computed_value="group.description"
                  label="Description"
                  @update="group.description = $event"/>
              </div>
            </div>
            <div class="row my-4">
              <div class="col-md-6">
                <span>Roles</span>
                <div class="row">
                  <template
                    v-for="role in roles">
                    <div
                      :key="role.id"
                      class="col-12">
                      <checkbox
                        :default-checked="groupRoles[role.id]"
                        :label="role.name"
                        @change="groupRoles[role.id] = $event"/>
                    </div>
                  </template>
                </div>
              </div>
              <div class="col-md-6">
                <span>Users</span>
                <div class="row">
                  <template
                    v-for="user in users">
                    <div
                      :key="user.id"
                      class="col-12">
                      <checkbox
                        :default-checked="groupUsers[user.id]"
                        :label="user.email"
                        @change="groupUsers[user.id] = $event"/>
                    </div>
                  </template>
                </div>
              </div>
            </div>
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
              @click.native="updateGroup">
              Save
            </button-rounded>
          </div>
          <v-modal
            v-if="showModal"
            header="Are you sure want to delete this item?"
            @close="showModal = false">
            <template slot="body">
              Please confirm the deletion of this group. And all the records that depend on it.
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
      group: {
        name: '',
        description: ''
      },
      showModal: false,
      isLoading: false,
      roles: [],
      groupRoles: {},
      users: [],
      groupUsers: {}
    }
  },
  mounted() {
    this.setGroup()
  },
  methods: {
    updateGroup() {
      Object.keys(this.groupRoles).forEach(key => {
        if (!this.groupRoles[key]) {
          delete this.groupRoles[key]
        }
      })
      Object.keys(this.groupUsers).forEach(key => {
        if (!this.groupUsers[key]) {
          delete this.groupUsers[key]
        }
      })
      const req = {
        group: this.group,
        roles: Object.keys(this.groupRoles),
        users: Object.keys(this.groupUsers)
      }
      this.$api().groups.updateById(this.$route.params.id, req)
    },
    deleteRecord() {
      this.$api()
        .groups.deleteById(this.$route.params.id)
        .then(() => {
          this.$router.push({
            name: 'roles-and-permissions-groups'
          })
        })
    },
    async setGroup() {
      this.isLoading = true
      return await this.$api()
        .groups.getById(this.$route.params.id)
        .then(res => {
          this.group.name = res.group.name
          this.group.description = res.group.description
          this.roles = res.roles
          this.users = res.users
          this.roles.forEach(role => {
            this.groupRoles[role.id] = !!_.find(res.group.roles, {
              id: role.id
            })
          })
          this.users.forEach(user => {
            this.groupUsers[user.id] = !!_.find(res.group.users, {
              id: user.id
            })
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
