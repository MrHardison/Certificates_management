<template>
  <div class="error-wrap">
    <div class="error-page">
      <a
        href="/settings"
        class="error-image">
        <img
          src="/error.png"
          class="img-fluid">
      </a>
      <div class="error_text">
        <h2 class="text-center">Oops!</h2>
        <p class="error-text">
          It looks like something went wrong. Sorry if this causes issues for you. Navigate to our home page or send our support team an
          <a href="mailto:support@softwareworksforyou.co.uk">email</a>. Thanks!
        </p>
        <p class="text-center">
          <a
            href="/"
            class="btn">
            <div class="content">Home</div>
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error',
  props: {
    error: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  layout: 'minimal'
}
</script>

<style scoped lang="scss">
.error-wrap {
  display: flex;
  justify-content: center;
  height: 100vh;

  .error-page {
    background: #fff;
    box-sizing: border-box;
    box-shadow: 0 0 80px rgba(0, 0, 0, 0.25);
    border: none;
    border-radius: 20px;
    margin: auto;
    max-width: 430px;
    padding: 80px 2rem 1.25rem 2rem;
    position: relative;

    .error-image {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -50px;
      width: 165px;
    }
  }
}
@media (max-width: 500px) {
  .error-wrap {
    background: #eef1f5;
    .error-page {
      box-shadow: 0 0 80px rgb(238, 241, 245);
      max-width: 90vw;
    }
  }
}
</style>
