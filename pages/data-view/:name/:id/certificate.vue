<template>
  <div
    v-if="isLoading"
    class="content-loading">
    <spinner-loader />
  </div>
  <iframe
    v-else
    :src="pdfUrl"
    frameborder="0"/>
</template>
<script>
import SpinnerLoader from '~/components/spinerLoader'

export default {
  name: 'Certificate',
  components: { SpinnerLoader },
  props: {
    dataViewCertificate: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isLoading: true,
      pdfUrl: null
    }
  },
  mounted() {
    if (this.dataViewCertificate === null) {
      this.$api()
        .dataView.getById(this.$route.params.id)
        .then(res => {
          this.render(res.certificate.id)
        })
    } else {
      this.render(this.dataViewCertificate.id)
    }
  },
  methods: {
    render(id) {
      this.isLoading = true
      this.$api()
        .dataView.render(id)
        .then(res => {
          let blob = new Blob([res.data], { type: 'application/pdf' })
          this.pdfUrl = URL.createObjectURL(blob)
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>

<style>
.content-loading {
  display: block;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
iframe {
  display: block;
  height: 80vh;
  width: 100%;
}
</style>
