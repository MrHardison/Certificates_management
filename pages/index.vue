<template>
  <div class="dashboard">
    <div class="dashboard__block">
      <a
        href="/settings"
        class="dashboard__block__image">
        <img
          src="/error.png"
          class="img-fluid">
      </a>
      <div class="dashboard__block__text text-center">
        <h1>Welcome</h1>
        <p>
          Please click on one of the menu items on the left to get started.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'pages'
}
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  justify-content: center;
  height: 100vh;
  margin-top: -15px;
  &__block {
    background: #fff;
    box-sizing: border-box;
    box-shadow: 0 0 80px rgba(0, 0, 0, 0.25);
    border: none;
    border-radius: 20px;
    margin: auto;
    max-width: 430px;
    padding: 80px 2rem 1.25rem 2rem;
    position: relative;

    &__image {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -50px;
      width: 165px;
    }
  }
}
@include mq($max-width: 500px) {
  .dashboard {
    background: #eef1f5;
    .dashboard__block {
      box-shadow: 0 0 80px rgb(238, 241, 245);
      max-width: 90vw;
    }
  }
}
</style>
