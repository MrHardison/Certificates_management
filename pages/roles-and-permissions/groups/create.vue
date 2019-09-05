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

          <div class="card-footer d-flex justify-content-end pr-0">
            <button-rounded
              :preloading="preloading"
              class="btn-green rounded small mr-2"
              @click.native="createGroup">
              Save
              <fa
                :icon="['fal', 'plus']"
                class="ml-2" />
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
import VModal from '~/components/vModal/vModal'

export default {
  name: 'Create',
  components: {
    InputStandard,
    ButtonRounded,
    VModal
  },
  data() {
    return {
      group: {
        name: '',
        description: ''
      },
      inputError: false,
      checkPattern: /^$/,
      preloading: false
    }
  },
  methods: {
    createGroup() {
      if (
        !this.checkPattern.test(this.group.name) &&
        !this.checkPattern.test(this.group.description)
      ) {
        if (!this.preloading) {
          this.preloading = true
          this.$api.groups.create(this.group).then(res => {
            _.delay(() => {
              this.preloading = false
            }, 1000)
            this.$router.push({
              name: 'roles-and-permissions-groups-:id',
              params: { id: res.data.data.id }
            })
          })
        }
      } else {
        this.inputError = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
