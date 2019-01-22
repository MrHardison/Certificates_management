<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
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
}

.modal-wrapper {
  margin: auto;
  display: block;
  z-index: 3;
}

.modal-container {
  border-radius: 10px !important;
  border: 1px solid rgba(0, 0, 0, 0.125);
  width: 550px;
  background-color: #fff;
  transition: all 0.3s ease;
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
</style>
