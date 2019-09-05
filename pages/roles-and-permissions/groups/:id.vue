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
            <div class="row my-2">
              <div class="col-md-12">
                <span>Roles</span>
                <div class="row mt-3">
                  <template
                    v-for="role in roles">
                    <div
                      :key="role.id"
                      class="col-3">
                      <checkbox
                        :data="groupRoles[role.id]"
                        :label="role.name"
                        @change="groupRoles[role.id] = $event"/>
                    </div>
                  </template>
                </div>
              </div>
              <div class="col-md-12 mt-4">
                <button-rounded
                  class="btn-green rounded small"
                  @click.native="userActions.modal = true">
                  Add user
                  <fa
                    :icon="['fal', 'plus']"
                    class="ml-2" />
                </button-rounded>
              </div>
              <div class="col-md-12 mt-3">
                <v-table
                  :header-title="'Users'"
                  :enable-header="false"
                  :thead="table.head"
                  :tbody="table.body"
                  :tfooter="table.footer"
                />
              </div>
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
              Delete group
            </button-rounded>
            <button-rounded
              :preloading="preloading"
              class="btn-green rounded small preloading-mr0"
              @click.native="updateGroup">
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
              Please confirm the deletion of this group. And all the records that depend on it.
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

          <v-modal
            v-if="userActions.modal"
            header="Add user to group"
            @close="userActions.modal = false">
            <template slot="body">
              <template v-if="userActions.availableUsers.length">
                <div class="form-group">
                  <label>Search user</label>
                  <input v-model="userActions.username" type="text" class="form-control" placeholder="Enter username or e-mail">
                </div>
                <div class="list-wrapper">
                  <ul class="user-list">
                    <template v-for="user in availableUsers">
                      <li
                        :key="user.id"
                        :class="{active: userActions.selectedUsers.find(i => i === user.id)}"
                        class="user-list-item"
                        @click="selectUser(user.id)">
                        <span class="user-list-text">{{ user.properties.user_full_name }}</span>
                        <span class="user-list-text">{{ user.email }}</span>
                      </li>
                    </template>
                  </ul>
                </div>
              </template>
              <template v-else>
                <div class="user-list-empty">All users selected</div>
              </template>
            </template>
            <div slot="footer">
              <button-rounded
                class="btn-smoke rounded small mr-2"
                @click.native="userActions.modal = false">
                Cancel
                <fa
                  :icon="['far', 'ban']"
                  class="ml-2" />
              </button-rounded>
              <template v-if="userActions.availableUsers.length && userActions.selectedUsers.length">
                <button-rounded
                  class="btn-green rounded small mr-2"
                  @click.native="addUser">
                  Add
                  <fa
                    :icon="['far', 'plus']"
                    class="ml-2" />
                </button-rounded>
              </template>
            </div>
          </v-modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import ButtonRounded from '~/components/buttonRounded'
import VModal from '~/components/vModal/vModal'
import SpinnerLoader from '~/components/spinerLoader'
import InputStandard from '~/components/inputStandard'
import Checkbox from '~/components/vCheckbox'
import VTable from '~/components/table/vTable'

export default {
  name: 'Id',
  components: {
    Checkbox,
    InputStandard,
    VModal,
    ButtonRounded,
    SpinnerLoader,
    VTable
  },
  data() {
    return {
      group: {
        name: '',
        description: ''
      },
      table: {
        head: [
          { title: 'Name', width: 20 },
          { title: 'Email', width: 20 },
          { title: 'Registration date', width: 20 },
          { title: 'Last Login', width: 20 }
        ],
        body: [],
        footer: {}
      },
      showModal: false,
      userActions: {
        modal: false,
        availableUsers: [],
        selectedUsers: [],
        username: ''
      },
      isLoading: false,
      roles: [],
      groupRoles: {},
      users: [],
      groupUsers: {},
      inputError: false,
      checkPattern: /^$/,
      preloading: false,
      deletePreloading: false
    }
  },
  computed: {
    availableUsers() {
      if (this.userActions.availableUsers.length) {
        return this.userActions.availableUsers.filter(
          i =>
            i.properties.user_full_name
              .toLowerCase()
              .indexOf(this.userActions.username.toLowerCase()) > -1 ||
            i.email
              .toLowerCase()
              .indexOf(this.userActions.username.toLowerCase()) > -1
        )
      } else return []
    }
  },
  mounted() {
    this.setGroup()
  },
  methods: {
    updateGroup() {
      _.forEach(_.keys(this.groupRoles), key => {
        if (!this.groupRoles[key]) {
          delete this.groupRoles[key]
        }
      })
      _.forEach(_.keys(this.groupUsers), key => {
        if (!this.groupUsers[key]) {
          delete this.groupUsers[key]
        }
      })
      const req = {
        group: this.group,
        roles: _.keys(this.groupRoles),
        users: _.keys(this.groupUsers)
      }
      if (
        !this.checkPattern.test(req.group.name) &&
        !this.checkPattern.test(req.group.description)
      ) {
        if (!this.preloading) {
          this.preloading = true
          this.$api.groups.updateById(this.$route.params.id, req).then(res => {
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
        this.$api.groups.deleteById(this.$route.params.id).then(() => {
          _.delay(() => {
            this.deletePreloading = false
          }, 1000)
          this.$router.push({
            name: 'roles-and-permissions-groups'
          })
        })
      }
    },
    setGroup() {
      this.isLoading = true
      this.$api.groups
        .getById(this.$route.params.id)
        .then(res => {
          this.group.name = res.group.name
          this.group.description = res.group.description
          this.roles = res.roles
          this.users = res.users
          this.roles.forEach(role => {
            this.groupRoles[role.id] = !!res.group.roles.find(
              e => e.id === role.id
            )
          })
          this.users.forEach(user => {
            this.groupUsers[user.id] = !!res.group.users.find(
              e => e.id === user.id
            )
          })
          this.setAvailableUsers()
          this.setTable()
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    selectUser(id) {
      this.userActions.selectedUsers = this.userActions.selectedUsers.find(
        i => i === id
      )
        ? this.userActions.selectedUsers.filter(i => i !== id)
        : [...this.userActions.selectedUsers, id]
    },
    addUser() {
      this.userActions.selectedUsers.forEach(i => {
        this.groupUsers[i] = true
      })

      this.userActions.modal = false
      this.userActions.selectedUsers = []
      this.userActions.availableUsers = []
      this.userActions.username = ''

      this.setAvailableUsers()
      this.setTable()
    },
    removeUser(id) {
      this.groupUsers = { ...this.groupUsers, [id]: false }
      this.setAvailableUsers()
      this.setTable()
    },
    setAvailableUsers() {
      this.userActions.availableUsers = this.users.filter(i => {
        if (!this.groupUsers[i.id]) {
          return i
        }
      })
    },
    setTable() {
      let usersId = []
      Object.keys(this.groupUsers).forEach(key => {
        if (this.groupUsers[key]) {
          usersId.push(+key)
        }
      })
      this.table.body = this.users
        .map(u => {
          return {
            tr: [
              u.properties.user_full_name,
              u.email,
              u.created_at,
              u.lastlogin
            ],
            actions: [
              {
                title: 'Remove user',
                action: () => this.removeUser(u.id)
              }
            ],
            id: u.id
          }
        })
        .filter(i => {
          const item = usersId.find(el => el === i.id)
          if (item) {
            return i
          }
        })
    }
  }
}
</script>

<style scoped lang="scss">
.list-wrapper {
  border: 1px solid rgba($gray, 0.5);
  border-radius: 5px;
  height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
}
.user-list {
  &-item {
    border-bottom: 1px solid rgba($gray, 0.5);
    cursor: pointer;
    display: flex;
    padding: 5px 10px;
    justify-content: space-between;

    &:hover,
    &.active {
      background: rgba($gray, 0.5);
    }

    &:last-child {
      border-bottom: none;
    }
  }

  &-empty {
    padding: 5px 10px;
  }
}
</style>
