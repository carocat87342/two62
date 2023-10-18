<template>
  <div>
    <zoom-center-transition :duration="200" mode="out-in">
      <router-view></router-view>
    </zoom-center-transition>
    <div class="text-center">Provided By <img :src="`${$iconURL}RSVP/maryoku - logo dark@2x.png`" /></div>
  </div>
</template>
<script>
import { ZoomCenterTransition } from "vue2-transitions";
export default {
  components: {
    ZoomCenterTransition,
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    },
  },
};
</script>
<style lang="scss" scoped>
</style>