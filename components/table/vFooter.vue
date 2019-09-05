<template>
  <v-paginator
    :paginator="paginator"
    :class="{'card-footer': cardFooter()}"
    @changePage="$emit('update', $event)"/>
</template>

<script>
import VPaginator from '~/components/vPaginator'
export default {
  name: 'VFooter',
  components: { VPaginator },
  props: {
    paginator: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    cardFooter() {
      return _.isEmpty(this.paginator) ? false : true
    }
  }
}
</script>

<style scoped lang="scss">
@import './vFooter';
</style>
