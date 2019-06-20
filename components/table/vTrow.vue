<template>
  <tr>
    <td
      class="actions text-center align-middle">
      <template v-if="actions.length">
        <fa
          v-click-outside="hideActions"
          :icon="['fa', 'bars']"
          class="icon"
          @click="isActionsOpen = !isActionsOpen"/>
        <ul
          v-if="isActionsOpen"
          :class="{open: isActionsOpen}"
          class="items list-unstyled text-left">
          <template v-for="(action, index) in actions">
            <li
              :key="index"
              class="item"
              @click="action.action">
              {{ action.title }}
            </li>
          </template>
        </ul>
      </template>
    </td>
    <template v-for="(td, column) in tr">
      <td
        :key="column"
        class="align-middle">{{ td }}</td>
    </template>
  </tr>
</template>

<script>
export default {
  name: 'VTrow',
  props: {
    tr: {
      type: Array,
      default() {
        return []
      }
    },
    actions: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isActionsOpen: false
    }
  },
  methods: {
    hideActions() {
      this.isActionsOpen = false
    }
  }
}
</script>

<style scoped lang="scss">
@import 'vTrow';
</style>
