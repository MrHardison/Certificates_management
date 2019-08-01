<template>
  <div class="image-loader-wrapper">
    <div>
      <div
        ref="imageLoader"
        :class="{unbordered: image}"
        :style="{width: windowWidth > 840 ? size.width + 'px' : '', height: windowWidth > 840 ? size.height + 'px': ''}"
        class="image-loader">
        <div
          v-if="isLoading"
          class="content-loading">
          <spinner-loader />
        </div>
        <img
          v-if="image"
          :src="imageUrl"
          class="img-fluid">
      </div>
      <input
        ref="imageForm"
        class="fileInput"
        type="file"
        @change="createImage">
    </div>
    <div
      v-if="error && required"
      class="error-message">This field is required</div>
    <button-rounded
      v-if="!image"
      class="btn-md btn-green rounded bold medium"
      @click.native="$refs.imageForm.click()">
      <span class="text">
        Upload image
      </span>
      <fa
        :icon="['fa', 'trash']"
        class="ml-2"/>
    </button-rounded>
    <div
      v-else
      class="image_isset">
      <button-rounded
        class="btn-smoke rounded bold medium clear_signature responsive"
        @click.native="removeImage">
        <span class="text">
          Remove
        </span>
        <fa
          :icon="['fa', 'trash']"
          class="ml-4" />
      </button-rounded>
    </div>
    <v-modal
      v-if="crop"
      header="Crop image"
      @close="crop = false">
      <template slot="body">
        <vue-cropper
          ref="cropper"
          :guides="true"
          :src="cropImageUrl"
          :background="true"
          :auto-crop-area="2"
          :aspect-ratio="aspectRatio"
          drag-mode="crop"
          alt="Source Image"/>
      </template>
      <div
        slot="footer"
        class="d-flex w-100">
        <button-rounded
          class="btn-green rounded small mx-auto"
          @click.native="cropImage">
          Crop
        </button-rounded>
      </div>
    </v-modal>
  </div>
</template>

<script>
import validUrl from 'valid-url'
import VModal from '~/components/vModal/vModal'
import ButtonRounded from '~/components/buttonRounded'
import SpinnerLoader from '~/components/spinerLoader'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

export default {
  name: 'ImageLoader',
  components: { ButtonRounded, SpinnerLoader, VueCropper, VModal },
  props: {
    elementId: {
      type: Number,
      default: null
    },
    parent_image: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    size: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      imageUrl: '',
      cropImageUrl: '',
      crop: false,
      image: false,
      width: 200,
      height: 240,
      windowWidth: null,
      isLoading: false,
      error: false
    }
  },
  computed: {
    aspectRatio() {
      if (_.has(this.size, 'width') && _.has(this.size, 'height')) {
        return this.size.width / this.size.height
      } else return 1
    }
  },
  watch: {
    crop: {
      handler(data) {
        if (!data) {
          this.isLoading = false
          if (!this.image) {
            this.removeImage()
          }
        }
      }
    }
  },
  mounted() {
    window.addEventListener('resize', function() {
      this.windowWidth = window.innerWidth
    })
    if (!this.size.width && !this.size.height) {
      this.height = 'auto'
      this.width = 'auto'
    }
    this.windowWidth = window.innerWidth
    if (this.parent_image && this.parent_image.length) {
      this.isLoading = true
      this.image = true
      this.getImageByUrl(this.parent_image)
    } else if (!this.parent_image) {
      this.errorRequired(true)
    }
  },
  destroyed() {
    window.removeEventListener('resize', function() {
      this.windowWidth = window.innerWidth
    })
  },
  methods: {
    createImage(event) {
      this.cropImageUrl = URL.createObjectURL(event.target.files[0])
      if (event.target.files && event.target.files[0]) {
        let fd = new FormData()
        fd.append('file', event.target.files[0], event.target.files[0].name)
        if (this.size.height && this.size.width) {
          this.crop = true
        } else {
          this.uploadImage(fd)
        }
      }
    },
    uploadImage(img) {
      this.isLoading = true
      this.$api.upload.upload(img).then(res => {
        if (res.data) {
          this.getImageByUrl(res.data)
        }
      })
    },
    getImageByUrl(url) {
      this.$api.upload.getImageByUrl(url).then(res => {
        this.imageUrl = URL.createObjectURL(res)
        this.isLoading = false
        this.image = true
        this.$emit('update', url)
        this.errorRequired(false)
      })
    },
    cropImage() {
      this.crop = false
      this.$refs.cropper.getCroppedCanvas().toBlob(blob => {
        let fd = new FormData()
        fd.append('file', blob)
        this.uploadImage(fd)
      })
    },
    removeImage() {
      this.$refs.imageForm.value = ''
      this.image = false
      this.imageUrl = ''
      this.$emit('update', this.imageUrl)
      this.errorRequired(true)
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

<style lang="scss" scoped>
.image-loader-wrapper {
  &.big-logo {
    .image-loader {
      width: auto;
      height: auto;
    }
  }
}
.image-loader {
  margin-bottom: 1.5rem;
  min-height: 200px;
  outline: 1px solid #cfd4dd;
  position: relative;
  width: 248px;

  &.unbordered {
    outline: none;
  }

  .content-loading {
    align-items: center;
    background: #fff;
    height: 100%;
    display: flex;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    justify-content: center;
    width: 100%;
  }

  img {
    display: block;
    height: 100%;
    max-width: 100%;
  }
}

.fileInput {
  display: none;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-bottom: 0.5rem;
}
@media (max-width: 544px) {
  .image-loader {
    min-height: 130px;
  }
  .image_isset {
    .btn {
      width: 100%;
    }
  }
  .image {
    text-align: center;
  }
}
</style>
