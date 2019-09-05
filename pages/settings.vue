<template>
  <div class="container-fluid">
    <v-tabs v-if="sectionsParams">
      <template v-for="(section, key) in sections">
        <v-tab
          :key="key"
          :name="section.label">
          <div class="row">
            <div class="col">
              <div class="card">
                <div class="card-block">
                  <div class="row">
                    <template v-for="(element, index) in $order(section.elements)">
                      <template v-if="element.field_type == 1">
                        <div
                          :key="index"
                          class="col-md-6 col-lg-4">
                          <input-standard
                            :key="index"
                            :label="element.element_label"
                            :computed_value="getByHolder(element.holder)"
                            :limits="(element.hasOwnProperty('limits') && element.limits.hasOwnProperty('char')) ? element.limits.char : {}"
                            @update="setByHolder(element.holder, $event)"/>
                        </div>
                      </template>
                      <template v-else-if="element.field_type == 5">
                        <div
                          :key="index"
                          class="col-md-12">
                          <label
                            :for="element.field_name"
                            class="control-label">{{ element.element_label }}</label>
                          <canvas-signature
                            :key="index"
                            :id="element.field_name"
                            :signature="getByHolder(element.holder)"
                            :data="element"
                            @update="setByHolder(element.holder, $event)" />
                        </div>
                      </template>
                      <template v-else-if="element.field_type == 10">
                        <div
                          :key="index"
                          class="col-md-12">
                          <label
                            :for="element.field_name"
                            class="control-label">{{ element.element_label }}</label>
                          <image-loader
                            :key="index"
                            :parent_image="getByHolder(element.holder)"
                            class="big-logo col-lg-12 col-md-12"
                            @update="setByHolder(element.holder, $event)" />
                        </div>
                      </template>
                      <template v-if="false">
                        <div
                          :key="index"
                          class="col-md-12 my-3">
                          <label
                            :for="element.field_name"
                            class="control-label">{{ element.element_label }}</label>
                          <timezone
                            :options="$order(element.options)"
                            :default-value="getByHolder(element.holder)"
                            @update="setByHolder(element.holder, $event)"/>
                        </div>
                      </template>
                    </template>
                  </div>
                  <div class="row">
                    <div class="col save-wrap responsive">
                      <button-rounded
                        :preloading="preloading"
                        class="btn btn-md btn-green rounded bold medium responsive"
                        @click.native="updateSettings">
                        <span class="text">
                          Save
                        </span>
                        <fa
                          :icon="['fa', 'check']"
                          class="ml-2"/>
                      </button-rounded>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-tab>
      </template>
    </v-tabs>
    <v-modal
      v-if="passwordMatchError"
      header="Warning">
      <template slot="body">
        New password field does not match
      </template>
      <div
        slot="footer"
        class="d-flex w-100">
        <button-rounded
          class="btn-green rounded small mx-auto"
          @click.native="passwordMatchError = false">
          OK
        </button-rounded>
      </div>
    </v-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { vTab, vTabs } from '~/components/tabs'
import inputStandard from '~/components/inputStandard'
import canvasSignature from '~/components/canvasSignature'
import imageLoader from '~/components/imageLoader'
import buttonRounded from '~/components/buttonRounded'
import timezone from '~/components/timezone'
import VModal from '~/components/vModal/vModal'

export default {
  components: {
    inputStandard,
    vTab,
    vTabs,
    canvasSignature,
    imageLoader,
    buttonRounded,
    timezone,
    VModal
  },
  middleware: 'pages',
  data() {
    return {
      user: null,
      company: null,
      passwordMatchError: false,
      preloading: false
    }
  },
  computed: {
    ...mapGetters({
      getMenuPage: 'menu/getMenuPage'
    }),
    sections() {
      const settings = this.getMenuPage(this.$route.name)
      if (settings && settings.properties.sections) {
        return settings.properties.sections
      } else {
        return {}
      }
    },
    sectionsParams() {
      return Object.keys(this.sections).length && this.user && this.company
    }
  },
  mounted() {
    this.getUser()
    this.getCompany()
  },
  methods: {
    getUser() {
      this.$api.user.get().then(res => (this.user = res))
    },
    getCompany() {
      this.$api.company.get().then(res => (this.company = res))
    },
    getByHolder(params) {
      return _.get(this[params.who], params.field)
    },
    setByHolder(params, data) {
      if (this[params.who]) {
        _.set(this[params.who], params.field, data)
      }
      return true
    },
    updateSettings() {
      if (this.user.password && this.user.password_confirmation) {
        if (this.user.password !== this.user.password_confirmation) {
          return (this.passwordMatchError = true)
        }
      }
      const deleteEmpty = holder => {
        _.forEach(_.keys(this[holder].properties), key => {
          if (
            this[holder].properties[key] === null ||
            this[holder].properties[key].length === 0
          ) {
            delete this[holder].properties[key]
          }
        })
      }
      deleteEmpty('user')
      deleteEmpty('company')

      this.user = _.assign(this.user, this.user.properties)
      this.company = _.assign(this.company, this.company.properties)
      if (!this.preloading) {
        this.preloading = true
        Promise.all([
          this.$api.user.update(this.user),
          this.$api.company.update(this.company)
        ])
          .then(() => {
            _.delay(() => {
              this.preloading = false
            }, 1000)
          })
          .finally(() => {
            this.preloading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.big-logo {
  padding: 0 15px 0 0 !important;

  @media (max-width: 767px) {
    padding: 0 !important;
  }
}
.save-wrap {
  display: flex;
  justify-content: flex-end;
}
@media (max-width: 544px) {
  .save-wrap {
    margin-top: 30px;
    justify-content: center;

    .btn {
      width: 100%;
    }
  }
}
</style>
