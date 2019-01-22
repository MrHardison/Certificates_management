<template>
  <div 
    id="signature-pad" 
    class="signature-pad">
    <div class="signature">
      <canvas :id="id"/>
    </div>
    <button-rounded 
      class="btn-smoke rounded bold floated-icon medium clear_signature"
      @click.native="clearSignature()">
      <span class="text">
        Clear
      </span>
      <fa :icon="['fa', 'trash']"/>
    </button-rounded>
  </div>
</template>


<script>
import validUrl from 'valid-url'
import SignaturePad from 'signature_pad'
import Vue from 'vue'
import VueResource from 'vue-resource'
import buttonRounded from '../buttonRounded'

Vue.use(VueResource)

export default {
  name: 'Signature',
  components: { buttonRounded },
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
        return {}
      }
    }
  },
  data() {
    return {
      signaturePad: false
    }
  },
  mounted() {
    let canvas = document.querySelector('#' + this.id)
    let ratio = Math.max(window.devicePixelRatio || 1, 1)
    let w = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    )
    if (w <= 425) {
      canvas.width = canvas.offsetWidth * ratio
      canvas.height =
        ((((this.data.limits.image.width - canvas.offsetWidth) /
          canvas.offsetWidth) *
          100) /
          100) *
        this.data.limits.image.height *
        ratio
    } else {
      canvas.width = this.data.limits.image.width * ratio
      canvas.height = this.data.limits.image.height * ratio
    }
    canvas.getContext('2d').scale(ratio, ratio)

    let signaturePad = new SignaturePad(canvas, {
      onEnd: () => {
        this.$emit(
          'update',
          this.signaturePad.toDataURL('image/png').split(',')[1]
        )
      }
    })

    if (this.signature) {
      if (validUrl.isUri(this.signature)) {
        this.$http
          .get(this.signature, { responseType: 'blob' })
          .then(response => {
            let reader = new window.FileReader()
            reader.readAsDataURL(response.data)
            reader.onloadend = function() {
              signaturePad.fromDataURL(reader.result)
            }
          })
      } else {
        signaturePad.fromDataURL('data:image/png;base64,' + this.signature)
      }
    }
    this.signaturePad = signaturePad
  },
  methods: {
    clearSignature() {
      this.signaturePad.clear()
    }
  }
}
</script>

<style lang="scss">
#signature-pad {
  .signature {
    canvas {
      border: 1px solid $secondary;
    }
  }
  .clear_signature {
    margin: 10px 0;
    background-color: $secondary;
  }
}

@include mq($max-width: 425px) {
  #signature-pad {
    text-align: center;
    .signature {
      canvas {
        width: 100%;
      }
    }
  }
}
</style>
