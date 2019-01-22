<template>
  <div class="v-tick-box">
    <button-rounded @click.native="addJobAdress">
      {{ name }}
    </button-rounded>
  </div>
</template>

<script>
import ButtonRounded from '~/components/buttonRounded'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'TickBox',
  components: { ButtonRounded },
  props: {
    name: {
      type: String,
      default: 'Click to copy'
    },
    formSection: {
      type: Object,
      default() {
        return {}
      }
    },
    certificateSection: {
      type: Object,
      default() {
        return {}
      }
    },
    copyData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      getCertificate: 'dataView/certificate',
      getForm: 'dataView/form'
    })
  },
  methods: {
    addJobAdress() {
      console.log(this.formSection)
      this.$emit('copyData', this.copyData)
    },
    getData() {
      const params = {}
      searchElement.elements.forEach((element, index) => {
        if (element.rules.field_type === 1) {
          params[element.rules.field_name] = 1
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
