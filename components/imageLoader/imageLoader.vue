<template>
  <div>
    <div>
      <div
        v-if="image"
        class="image-loader">
        <div
          v-if="isLoading"
          class="content-loading">
          <spinner-loader />
        </div>
        <img
          :src="imageUrl"
          class="img-fluid">
      </div>
      <input
        ref="imageForm"
        class="fileInput"
        type="file"
        @change="createImage">
    </div>
    <button-rounded
      v-if="!image"
      class="btn-md btn-green rounded bold medium"
      @click.native="$refs.imageForm.click()">
      <span class="text">
        Upload image
      </span>
      <fa
        :icon="['fa', 'trash']"
        class="ml-4"/>
    </button-rounded>
    <div
      v-else
      class="image_isset">
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
import ButtonRounded from '~/components/buttonRounded'
import SpinnerLoader from '~/components/spinerLoader'

export default {
  name: 'ImageLoader',
  components: { ButtonRounded, SpinnerLoader },
  props: {
    parent_image: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageUrl: '',
      image: false,
      isLoading: true
    }
  },
  mounted() {
    if (this.parent_image && this.parent_image.length > 0) {
      this.isLoading = true
      this.image = true
      this.getImageByUrl(this.parent_image)
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
      this.$api()
        .upload.upload(img)
        .then(res => {
          if (res.data) {
            this.getImageByUrl(res.data)
          }
        })
    },
    getImageByUrl(url) {
      this.$api()
        .upload.getImageByUrl(url)
        .then(res => {
          this.imageUrl = URL.createObjectURL(res)
          this.$emit('update', url)
          this.isLoading = false
        })
    },
    removeImage() {
      this.image = false
      this.imageUrl = ''
      this.$emit('update', this.imageUrl)
    }
  }
}
</script>

<style lang="scss">
.image-loader {
  min-height: 210px;
  border: 1px solid #cfd4dd;
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

@include mq($max-width: 425px) {
  .image {
    text-align: center;
  }
}
</style>
