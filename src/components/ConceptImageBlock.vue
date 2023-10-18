<template>
  <div class="concept-image-block" ref="content">
    <div
      class="image-background"
      v-for="idx in 4"
      :key="idx"
      :style="`background-color: ${colors[idx - 1].color}; opacity:${colors[idx - 1].opacity}`"
    ></div>
    <div>
      <div :class="`images-list__item ${border}`" v-for="indx in 5" :key="indx">
        <div
          class="image-section d-flex justify-content-center align-center text-center"
          :style="`background-image:url(${images[indx - 1].thumb_url || images[indx - 1].url})`"
          :for="`file-${indx}`"
          v-if="images[indx - 1]"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import jsPDF from "jspdf";
export default {
  data() {
    return {
      imageData: "",
    };
  },
  props: {
    images: {
      type: Array,
      default: [],
    },
    colors: {
      type: Array,
      default: [],
    },
    border: {
      type: String,
      default: "",
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.concept-image-block {
  position: relative;
  height: 382px;
  .image-background {
    background: #ededed;
    position: absolute;
    &:first-child {
      top: 142px;
      left: 0;
      width: calc(249px - 50px);
      height: calc(232px - 50px);
    }
    &:nth-child(2) {
      top: 40px;
      left: 123px;
      width: calc(296px - 50px);
      height: calc(232px - 50px);
    }
    &:nth-child(3) {
      top: 38px;
      left: 445px;
      width: calc(272px - 50px);
      height: calc(325px - 50px);
    }
    &:nth-child(4) {
      top: 74px;
      left: 752px;
      width: calc(182px - 50px);
      height: calc(278px - 50px);
    }
  }
  .images-list__item {
    border: 2px dashed $rose;
    background-color: #fff;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    position: absolute;
    &.no-border {
      border: none;
      border-radius: 3px;
      box-shadow: none;
      overflow: hidden;
    }
    .image-section {
      background-size: cover !important;
      background-position: center center;
    }
    &:first-child {
      top: 70px;
      left: 30px;
      z-index: 15;
      .image-section {
        width: calc(234px - 50px);
        height: calc(234px - 50px);
      }
    }
    &:nth-child(2) {
      top: 172px;
      left: 168px;
      z-index: 14;
      .image-section {
        width: calc(320.8px - 50px);
        height: calc(198px - 50px);
      }
    }
    &:nth-child(3) {
      top: 69px;
      left: 342px;
      z-index: 13;
      .image-section {
        width: calc(311px - 50px);
        height: calc(236px - 50px);
      }
    }
    &:nth-child(4) {
      top: 94px;
      left: 583px;
      z-index: 12;
      .image-section {
        width: calc(242px - 50px);
        height: calc(280px - 50px);
      }
    }
    &:nth-child(5) {
      top: 45px;
      left: 720px;
      z-index: 11;
      .image-section {
        width: calc(287.6px - 50px);
        height: calc(202px - 50px);
      }
    }
  }
}
</style>