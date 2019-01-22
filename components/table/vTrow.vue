<template>
  <tr>
    <td
      class="actions text-center align-middle">
      <template v-if="actions.length">
        <fa
          :icon="['fa', 'bars']"
          class="icon"
          @click="toggleActions"/>
        <ul
          v-click-outside="hideActions"
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
      <td :key="column">{{ td }}</td>
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
    toggleActions() {
      this.isActionsOpen = !this.isActionsOpen
    },
    hideActions() {
      this.isActionsOpen = false
    }
  }
}
</script>

<style scoped lang="scss">
@import 'vTrow';
</style>
