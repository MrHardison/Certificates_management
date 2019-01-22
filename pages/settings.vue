<template>
  <div class="container-fluid">
    <v-tabs v-if="Object.keys(sections).length && user && company">
      <template v-for="(section, key) in sections">
        <v-tab
          :key="key"
          :name="section.label">
          <div class="row">
            <div class="col">
              <div class="card">
                <transition
                  name="table-fade"
                  mode="out-in"
                  appear>
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
                              :computed_value="(getByHolder(element.holder))[element.field_name]"
                              :limits="(element.hasOwnProperty('limits') && element.limits.hasOwnProperty('char')) ? element.limits.char : {}"
                              @update="setByHolder(element.holder, element.field_name, $event)"/>
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
                              :signature="(getByHolder(element.holder))[element.field_name]"
                              :data="element"
                              @update="setByHolder(element.holder, element.field_name, $event)" />
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
                              :parent_image="(getByHolder(element.holder))[element.field_name]"
                              class="big-logo col-lg-4 col-md-6"
                              @update="setByHolder(element.holder, element.field_name, $event)" />
                          </div>
                        </template>
                      </template>
                    </div>

                    <div class="row">
                      <div class="col save">
                        <button-rounded
                          class="btn-md btn-green rounded pull-right bold floated-icon medium"
                          @click.native="updateSettings()">
                          <span class="text">
                            Save
                          </span>
                          <fa :icon="['fa', 'check']"/>
                        </button-rounded>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </v-tab>
      </template>
    </v-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { vTab, vTabs } from '~/components/tabs'
import inputStandard from '~/components/inputStandard'
import canvasSignature from '~/components/canvasSignature'
import imageLoader from '~/components/imageLoader'
import buttonRounded from '~/components/buttonRounded'

export default {
  components: {
    inputStandard,
    vTab,
    vTabs,
    canvasSignature,
    imageLoader,
    buttonRounded
  },
  middleware: 'pages',
  data() {
    return {
      user: null,
      company: null
    }
  },
  computed: {
    ...mapGetters({
      getMenuPage: 'menu/getMenuPage'
    }),
    sections() {
      const settings = this.getMenuPage(this.$route.name)
      if (settings) {
        return settings.properties.sections
      } else {
        return {}
      }
    }
  },
  mounted() {
    this.getUser()
    this.getCompany()
  },
  methods: {
    async getUser() {
      const requestParams = {
        ui_id: 5
      }
      this.user = await this.$api().user.get(requestParams)
    },
    async getCompany() {
      const requestParams = {
        ui_id: 5
      }
      this.company = await this.$api().company.get(requestParams)
    },
    getByHolder(holder) {
      switch (holder) {
        case 'user':
          return this.user
        case 'company':
          return this.company
        default:
          return false
      }
    },
    setByHolder(holder, field, data) {
      if (this.getByHolder(holder)) {
        this[holder][field] = data
      }
      return true
    },
    updateSettings() {
      this.$api().user.update(this.user)
      this.$api().company.update(this.company)
    }
  }
}
</script>

<style lang="scss" scoped>
.big-logo {
  padding: 0 15px 0 0 !important;
  @include mq($max-width: 767px) {
    padding: 0 !important;
  }
}
</style>
