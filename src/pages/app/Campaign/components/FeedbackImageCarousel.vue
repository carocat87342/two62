<template>
  <div class="feedback-images">
    <carousel
      :items="3"
      :margin="25"
      :dots="false"
      :nav="false"
      class="feedback-carousel"
      :number="2"
      v-if="images.length > 0"
      :key="Math.random()"
    >
      <template slot="prev">
        <md-button class="edit-btn md-round nav-left nav-btn md-raised md-white">
          <md-icon>keyboard_arrow_left</md-icon>
        </md-button>
      </template>
      <div class="carousel-item" v-for="(item, index) in images" :key="index">
        <img :src="item.src" class="carousel-image" @error="setAltImg($event, item)" />
      </div>
      <template slot="next">
        <md-button class="edit-btn md-round nav-right nav-btn md-raised md-white">
          <md-icon>keyboard_arrow_right</md-icon>
        </md-button>
      </template>
    </carousel>
    <div class="upload-button-wrapper">
      <md-button class="md-red maryoku-btn" @click="uploadImage">
        <img :src="`${$iconURL}Campaign/arrow-circle-white.svg`" class="mr-10" />
        Upload Photos from your event
      </md-button>
      <input
        style="display: none"
        id="carousel-file"
        name="attachment"
        type="file"
        multiple="multiple"
        @change="onFileChange"
      />
    </div>
  </div>
</template>
<script>
import carousel from "vue-owl-carousel";
import { getBase64 } from "@/utils/file.util";

export default {
  components: {
    carousel,
  },
  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedIndex: 0,
    };
  },
  methods: {
    uploadImage(index) {
      document.getElementById("carousel-file").click();
    },
    async onFileChange(event) {
      const image = await getBase64(event.target.files[0]);
      this.$emit("addImage", { imageString: image, file: event.target.files[0] });
    },
    setAltImg(event, item) {
      event.target.src = item.imageData;
    },
  },
};
</script>
<style lang="scss" scoped>
.feedback-images {
  position: relative;
  .upload-button-wrapper {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
  }
  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    &.nav-right {
      right: 60px;
    }
    &.nav-left {
      left: 60px;
    }
  }
}
.feedback-carousel {
  .carousel-item {
    width: 100%;
    border-radius: 3px;
    overflow: hidden;
    position: relative;
    padding-top: 75%;

    .carousel-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }

    &:hover {
      .carousel-item-actions {
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        height: max-content;
        width: max-content;
        transform: translate(-50%, -50%);
        .button {
          cursor: pointer;
          img {
            width: 20px;
            display: inline;
          }
        }
      }
      &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0.52;
        background-color: #050505;
        top: 0;
        left: 0;
        z-index: 2;
      }
    }
  }
}
</style>