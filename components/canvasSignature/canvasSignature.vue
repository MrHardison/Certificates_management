<template>
  <div
    id="signature-pad"
    ref="container"
    class="signature-pad">
    <div
      :class="{required: required && !signature.length}"
      class="signature">
      <div
        v-if="isLoading"
        class="content-loading">
        <spinner-loader />
      </div>
      <div
        v-if="imageError"
        class="error">
        {{ errorText }}
      </div>
      <canvas
        ref="canvas"
        :id="id"
      />
    </div>
    <div
      v-if="required && !signature.length"
      class="error-message">This field is required</div>
    <input
      ref="imageForm"
      type="file"
      style="display:none">
    <button-rounded
      class="btn-smoke rounded bold medium clear_signature responsive"
      @click.native="clearSignature()">
      <span class="text">
        Clear
      </span>
      <fa
        :icon="['fa', 'trash']"
        class="ml-4"/>
    </button-rounded>
  </div>
</template>

<script>
import validUrl from 'valid-url'
import SignaturePad from 'signature_pad'
import Vue from 'vue'
import VueResource from 'vue-resource'
import buttonRounded from '../buttonRounded'
import SpinnerLoader from '~/components/spinerLoader'
Vue.use(VueResource)

export default {
  name: 'Signature',
  components: { buttonRounded, SpinnerLoader },
  props: {
    id: {
      type: String,
      default: ''
    },
    signature: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default() {
        return {
          canvas: null,
          context: null
        }
      }
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      signaturePad: false,
      isLoading: false,
      error: false,
      imageError: false,
      errorText: 'File not found'
    }
  },
  mounted() {
    if (!this.signature) {
      this.errorRequired(true)
    }
    this.canvas = this.$refs.canvas
    this.context = this.canvas.getContext('2d')

    if (document.documentElement.clientWidth <= 544) {
      this.canvas.width = this.$refs.container.clientWidth
      this.canvas.height = this.data.limits.image.height
    } else {
      this.canvas.width = this.data.limits.image.width
      this.canvas.height = this.data.limits.image.height
    }
    this.resizeCanvas()

    let signaturePad = new SignaturePad(this.canvas, {
      onEnd: _.debounce(() => {
        const URI = this.canvas.toDataURL()
        const blob = this.dataURItoBlob(URI)
        const fd = new FormData()
        fd.append('file', blob)
        this.uploadImage(fd)
      }, 500)
    })

    if (this.signature) {
      this.isLoading = true
      this.getImageByUrl(this.signature, true)
    }
    this.signaturePad = signaturePad
    this.$nextTick(function() {
      window.addEventListener('resize', () => {
        this.resizeCanvas()
      })
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCanvas())
  },
  methods: {
    resizeCanvas() {
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      this.canvas.width = this.canvas.offsetWidth * ratio
      this.canvas.height = this.canvas.offsetHeight * ratio
      this.context.scale(ratio, ratio)
    },
    clearSignature() {
      this.signaturePad.clear()
      this.imageError = false
      this.errorRequired(false)
      this.$emit('update', '')
    },
    async uploadImage(img) {
      const res = await this.$api.upload.upload(img)
      if (res.data) {
        this.getImageByUrl(res.data)
      }
    },
    getImageByUrl(url, status) {
      this.$api.upload
        .getImageByUrl(url)
        .then(res => {
          if (status) {
            let reader = new window.FileReader()
            reader.readAsDataURL(res)
            reader.onloadend = () => {
              this.signaturePad.fromDataURL(reader.result)
            }
          }
          this.isLoading = false
          this.$emit('update', url)
          this.errorRequired(false)
        })
        .catch(err => {
          this.isLoading = false
          this.imageError = true
        })
    },
    dataURItoBlob(dataURI) {
      let byteString
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1])
      else byteString = unescape(dataURI.split(',')[1])
      let mimeString = dataURI
        .split(',')[0]
        .split(':')[1]
        .split(';')[0]
      let ia = new Uint8Array(byteString.length)
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ia], { type: mimeString })
    },
    errorRequired(isError) {
      if (this.required) {
        const error = {
          id: this.elementId || this._uid,
          status: isError
        }
        this.error = isError
        this.$emit('validationError', error)
      }
    }
  }
}
</script>

<style lang="scss">
#signature-pad {
  .signature {
    display: inline-flex;
    position: relative;

    .content-loading {
      align-items: center;
      background: #fff;
      display: flex;
      height: calc(100% - 2px);
      left: 1px;
      position: absolute;
      top: 1px;
      justify-content: center;
      width: calc(100% - 2px);
    }
    canvas {
      border: 1px solid $secondary;
      width: 100%;
      height: 100%;
    }
    &.required {
      canvas {
        border-color: red;
      }
    }
  }
  .error {
    align-items: center;
    color: $error;
    display: flex;
    font-size: 18px;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    justify-content: center;
    width: 100%;
    z-index: 2;
  }
  .error-message {
    color: red;
    font-size: 14px;
  }
  .clear_signature {
    background-color: $secondary;
    display: block;
    margin: 10px 0;
  }
  @media (max-width: 544px) {
    .btn {
      width: 100%;
    }
  }
}
</style>
