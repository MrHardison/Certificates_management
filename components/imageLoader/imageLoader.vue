<template>
  <div>
    <div v-if="!image">
      <input
        class="btn"
        type="file"
        accept="image/*"
        style="margin-bottom: 1.25rem;"
        @change="onFileChange">
    </div>
    <div
      v-else
      class="image_isset">
      <img
        :src="image"
        class="img-fluid">
      <button-rounded
        class="btn-smoke rounded bold floated-icon medium clear_signature"
        style="margin: 1.25rem 0;"
        @click.native="removeImage">
        <span class="text">
          Remove
        </span>
        <fa :icon="['fa', 'trash']"/>
      </button-rounded>
    </div>
  </div>
</template>

<script>
import validUrl from 'valid-url'
import ButtonRounded from '@/components/buttonRounded'

export default {
  name: 'ImageLoader',
  components: { ButtonRounded },
  props: {
    parent_image: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      image: validUrl.isUri(this.parent_image)
        ? this.parent_image
        : 'data:image/png;base64,' + this.parent_image
    }
  },
  watch: {
    image: {
      deep: true,
      handler(image) {
        if (image) {
          this.$emit('update', image.split(',')[1])
        } else {
          this.$emit('update', '')
        }
      }
    }
  },
  mounted() {
    if (typeof this.parent_image === 'undefined' || this.parent_image === '') {
      this.image = false
    }
  },
  methods: {
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.createImage(files[0])
    },
    createImage(file) {
      let image = new Image()
      let reader = new FileReader()
      let vm = this

      reader.onload = e => {
        vm.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeImage: function(e) {
      this.image = false
    }
  }
}
</script>

<style lang="scss">
.btn {
  background-color: $white;
}

.image_isset {
  img {
    display: block;
    border: 1px solid #cfd4dd;
  }
}

@include mq($max-width: 425px) {
  .image_isset {
    text-align: center;
  }
}
</style>
