<template>
  <fade-transition>
    <md-card class="position-absolute notification-card">
      <md-card-content class="py-20 px-50">
        <div class="message-arrow"></div>
        <h5 class="font-size-16 font-bold-extra">Example of a text that can work well:</h5>
        <carousel :items="1"
                  :margin="0"
                  :dots="false"
                  :nav="false"
                  class="header-carousel"
                  @changed="changed"
        >
          <template slot="prev">
            <span class="prev handle-btn" ref="prevButton"><md-icon>keyboard_arrow_left</md-icon></span>
          </template>
          <p v-for="text in about">
            {{ text }}
          </p>
          <template slot="next">
            <span class="next handle-btn" ref="nextButton"> <md-icon>keyboard_arrow_right</md-icon></span>
          </template>
        </carousel>
        <div class="d-flex align-center">
          <md-button class="md-simple md-black ml-auto" @click="$emit('cancel')">Cancel</md-button>
          <md-button class="md-vendor" @click="$emit('copy', about[index])">Copy Text</md-button>
        </div>
      </md-card-content>
    </md-card>
  </fade-transition>
</template>

<script>
import { FadeTransition } from "vue2-transitions";
import carousel from "vue-owl-carousel";
export default {
  components: {
    FadeTransition,
    carousel
  },
  props: {
    about: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      index: 0,
    }
  },
  methods: {
    changed(e){
      console.log('changed', e);
      this.index = e.item.index;
    }
  }
}
</script>

<style lang="scss" scoped>
  .notification-card{
    top: 20px;
    left: -110px;
    width: 600px;
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.26)
  }

  .header-carousel {

    .handle-btn {
      background-color: white !important;
      height: 25px;
      width: 25px;
      border-radius: 50%;
      position: absolute;
      top: 46%;
      transform: translateY(-50%);
      z-index: 2;
      cursor: pointer;
      i {
        color: #050505;
      }
      &.next {
        right: 20px;
      }
      &.prev {
        left: 20px;
      }
    }
  }

  .message-arrow{
    position: absolute;
    top: -18px;
    left: 132px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 18px solid white;
    /*box-shadow: 0 1px 4px 0 rgba(0,0,0,,.3);*/
  }
</style>