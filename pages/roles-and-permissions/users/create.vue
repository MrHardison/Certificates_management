<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body">
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
                key="user_full_name"
                :computed_value="user.properties.user_full_name"
                type="text"
                label="Full name"
                @update="user.properties.user_full_name = $event"/>
            </div>
            <div class="col-md-6">
              <input-standard
                key="password"
                :computed_value="user.password"
                type="password"
                label="Password"
                @update="user.password = $event"/>
            </div>
            <div class="col-md-6">
              <input-standard
                key="password_confirmation"
                :computed_value="user.password_confirmation"
                type="password"
                label="Password confirmation"
                @update="user.password_confirmation = $event"/>
            </div>
          </div>
          <div class="card-footer d-flex justify-content-end">
            <button-rounded
              class="btn-green rounded small mr-2"
              @click.native="createUser">
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
import InputStandard from '~/components/inputStandard/inputStandard'

export default {
  name: 'Create',
  components: {
    InputStandard,
    ButtonRounded
  },
  data() {
    return {
      user: {
        email: '',
        properties: {
          user_full_name: ''
        },
        password: '',
        password_confirmation: ''
      }
    }
  },
  methods: {
    createUser() {
      this.$api()
        .users.create(this.user)
        .then(res => {
          this.$router.push({
            name: 'roles-and-permissions-users-:id',
            params: { id: res.data.data.id }
          })
        })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
