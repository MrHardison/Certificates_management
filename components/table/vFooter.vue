<template>
  <v-paginator
    :paginator="paginator"
    class="card-footer"
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
  }
}
</script>

<style scoped lang="scss">
@import './vFooter';
</style>
