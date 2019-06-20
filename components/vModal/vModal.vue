<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="close">
            <fa
              :icon="['fal', 'times']"
              class="input-icon"
              @click="$emit('close')"/>
          </div>
          <div class="modal-header">
            <h3>
              {{ header }}
            </h3>
          </div>
          <div class="modal-body">
            <slot name="body" />
          </div>
          <div class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
      <div
        class="modal-overlay"
        @click="$emit('close')"/>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'VModal',
  props: {
    header: {
      type: String,
      default: 'No header'
    }
  }
}
</script>

<style scoped lang="scss">
.modal-mask {
  position: fixed;
  z-index: 9997;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;

  &.create-data-group {
    .modal-wrapper {
      .modal-container {
        .modal-footer {
          padding: 0;
          border-top: none;
        }
      }
    }
  }
}

.modal-wrapper {
  margin: auto;
  display: block;
  z-index: 3;
}

.modal-container {
  background-color: #fff;
  border-radius: 10px !important;
  border: 1px solid rgba(0, 0, 0, 0.125);
  transition: all 0.3s ease;
  position: relative;
  width: 550px;

  @media (max-width: 768px) {
    width: 500px;
  }

  @media (max-width: 544px) {
    width: 320px;
  }
}

.modal-header h3 {
  margin: 0 !important;
  font-size: 1.5rem;
}

.modal-body {
  margin: 1rem;
  max-height: 500px;
  padding: 0;

  .modal-list {
    overflow-y: auto;
    overflow-x: hidden;
  }
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.modal-overlay {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}
.close {
  cursor: pointer;
  color: red;
  font-size: 16px;
  opacity: 1;
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.3);
  }
}
</style>
