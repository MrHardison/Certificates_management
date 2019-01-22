<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body">
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

          <div class="card-footer d-flex justify-content-end">
            <button-rounded
              class="btn-green rounded small mr-2"
              @click.native="createGroup">
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
      group: {
        name: '',
        description: ''
      }
    }
  },
  methods: {
    createGroup() {
      this.$api()
        .groups.create(this.group)
        .then(res => {
          this.$router.push({
            name: 'roles-and-permissions-groups-:id',
            params: { id: res.data.data.id }
          })
        })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
