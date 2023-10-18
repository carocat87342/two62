<template>
  <div class="venodr-images-list">
    <span class="prev" @click="prev()" v-show="startIndex > 0">
      <md-icon>keyboard_arrow_left</md-icon>
    </span>
    <div class="cont" :style="{ left: `${imageSlidePos}px` }" ref="imagesCont">
      <img :src="img" v-for="(img, ind) in images" :key="ind" @click="view(ind)" class="image-item" />
    </div>
    <span class="next" @click="next()" v-show="startIndex < images.length - 3">
      <md-icon>keyboard_arrow_right</md-icon>
    </span>
    <LightBox v-if="medias.length" :media="medias" ref="lightbox" :show-light-box="false" />
  </div>
</template>
<script>
import LightBox from "vue-image-lightbox";
export default {
  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      imageSlidePos: 0,
      startIndex: 0,
    };
  },
  components: {
    LightBox,
  },
  methods: {
    view(index) {
      if (this.$refs.lightbox) {
        this.$refs.lightbox.showImage(index);
      }
    },
    prev() {
      const ww = this.images.length * 320;
      const sw = this.$refs.imagesCont.clientWidth;
      if (ww / sw > 2) {
        this.imageSlidePos += 320 * 4;
      } else if (ww / sw > 1) {
        this.imageSlidePos += (ww % sw) + 60;
      } else {
        this.imageSlidePos;
      }
      console.log(document.getElementsByClassName("image-item")[this.startIndex - 1].offsetLeft);
      if (this.startIndex - 1 === 0) {
        this.imageSlidePos = 0;
      } else this.imageSlidePos = -document.getElementsByClassName("image-item")[this.startIndex - 1].offsetLeft;

      this.startIndex -= 1;
    },
    next() {
      const ww = this.images.length * 320;
      const sw = this.$refs.imagesCont.clientWidth;
      if (ww / sw > 2) {
        this.imageSlidePos -= 320 * 4;
      } else if (ww / sw > 1) {
        this.imageSlidePos -= (ww % sw) + 60;
      } else {
        this.imageSlidePos;
      }
      this.imageSlidePos = -document.getElementsByClassName("image-item")[this.startIndex + 1].offsetLeft;
      this.startIndex += 1;
      console.log(document.getElementsByClassName("image-item")[this.startIndex].offsetLeft);
    },
  },
  computed: {
    medias() {
      return this.images.map((item) => {
        return {
          thumb: item,
          src: item,
          caption: "test",
        };
      });
    },
  },
};
</script>
<style scoped lang="scss">
.venodr-images-list {
  display: block;
  overflow: hidden;
  padding: 2rem 0;
  white-space: nowrap;
  position: relative;
  span {
    cursor: pointer;
    position: absolute;
    width: 28px;
    height: 28px;
    background-color: #ffffff;
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
    border-radius: 50%;
    text-align: center;
    font-weight: 800;
    z-index: 99;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    &.prev {
      left: 50px;
    }
    &.next {
      right: 50px;
    }
  }
  .cont {
    position: relative;
    transition: all 0.5s;
    img {
      width: 300px;
      height: 177px;
      margin-right: 2rem;
      border-radius: 5px;
      object-fit: cover;
      cursor: zoom-in;
      &:first-child {
        margin-left: 50px;
      }
      &:last-child {
        margin-right: 50px;
      }
    }
  }
}
</style>