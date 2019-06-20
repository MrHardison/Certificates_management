<template>
  <div>
    <div>
      <div
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
        style="margin: 1.25rem 0;"
        @click.native="removeImage">
        <span class="text">
          Remove
        </span>
        <fa
          :icon="['fa', 'trash']"
          class="ml-4" />
      </button-rounded>
    </div>
  </div>
</template>

<script>
import validUrl from 'valid-url'
import ButtonRounded from '~/components/buttonRounded'
import SpinnerLoader from '~/components/spinerLoader'

export default {
  name: 'ImageLoader',
  components: { ButtonRounded, SpinnerLoader },
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
    }
  },
  data() {
    return {
      imageUrl: '',
      image: false,
      isLoading: false,
      error: false
    }
  },
  mounted() {
    if (this.parent_image && this.parent_image.length) {
      this.isLoading = true
      this.image = true
      this.getImageByUrl(this.parent_image)
    } else if (!this.parent_image) {
      this.errorRequired(true)
    }
  },
  methods: {
    createImage(event) {
      let fd = new FormData()
      if (event.target.files && event.target.files[0]) {
        fd.append('file', event.target.files[0], event.target.files[0].name)
        this.uploadImage(fd)
      }
    },
    uploadImage(img) {
      this.image = true
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
        this.$emit('update', url)
        this.isLoading = false
        this.errorRequired(false)
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
.image-loader {
  border: 1px solid #cfd4dd;
  margin-bottom: 1rem;
  min-height: 210px;
  position: relative;

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
    border: 1px solid #cfd4dd;
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
