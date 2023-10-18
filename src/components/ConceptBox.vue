<template>
  <div class="concept-box">
    <div class="concept-box-header">
      <div class="concept-name">{{ concept.name }}</div>
      <ul class="tag-list">
        <li class="tag-list__item" v-for="tag in concept.tags" :key="tag.name">
          {{ tag.name }}
        </li>
      </ul>
    </div>
    <div>{{ concept.description }}</div>
    <div class="images-box" :style="`transform:scale(${scale});transform-origin:left`">
      <div class="image-backgrounds">
        <div
          class="image-background"
          v-for="(bg, bgIndex) in concept.colors"
          :key="bgIndex"
          :style="`background:${bg.color}; opacity:${bg.opacity}`"
        ></div>
      </div>
      <div>
        <div :class="`images-list__item`" v-for="(image, imageIndex) in concept.images" :key="imageIndex">
          <img
            class="image-section"
            :src="`${image.url}`"
            @error="imageUrlAlt(concept.imageData[imageIndex], $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    concept: {
      type: Object,
      default: () => {},
    },
    scale: {
      type: Number,
      default: 1,
    },
  },
};
</script>
<style lang="scss" scoped>
.concept-box {
  .concept-box-header {
    display: flex;
    .concept-name {
      margin-top: 5px;
      text-transform: capitalize;
      font-size: 25px;
      white-space: nowrap;
      width: max-content;
    }
    .tag-list {
      margin: 0px;
      li {
        margin: 5px;
        display: inline-block;
        border-radius: 100px;
        border: solid 1px #a0a0a0;
        font-size: 12px;
        color: #050505;
        padding: 0 1em;
        text-transform: capitalize;
      }
    }
  }
  .images-box {
    position: relative;
    height: 350px;
    width: 900px;
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
      border: 2px dashed #f51355;
      background: #fff;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
      position: absolute;
      .image-section {
        object-fit: cover;
        background-size: cover;
        .md-button {
          .md-button-content {
            flex-direction: column;

            img {
              width: 16px;
            }
            label {
              font-size: 12px;
              color: #050505;
              text-transform: capitalize;

              img {
                margin-right: 0.5em;
              }
            }
          }
        }
      }
      &:first-child {
        top: 70px;
        left: 30px;
        z-index: 12;
        .image-section {
          width: calc(234px - 50px);
          height: calc(234px - 50px);
        }
      }
      &:nth-child(2) {
        top: 172px;
        left: 168px;
        z-index: 11;
        .image-section {
          width: calc(320.8px - 50px);
          height: calc(198px - 50px);
        }
      }
      &:nth-child(3) {
        top: 69px;
        left: 342px;
        z-index: 10;
        .image-section {
          width: calc(311px - 50px);
          height: calc(236px - 50px);
        }
      }
      &:nth-child(4) {
        top: 94px;
        left: 583px;
        z-index: 9;
        .image-section {
          width: calc(242px - 50px);
          height: calc(280px - 50px);
        }
      }
      &:nth-child(5) {
        top: 45px;
        left: 720px;
        z-index: 8;
        .image-section {
          width: calc(287.6px - 50px);
          height: calc(202px - 50px);
        }
      }
    }
  }
}
</style>