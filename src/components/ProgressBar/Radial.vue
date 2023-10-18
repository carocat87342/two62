<template>
  <div class="maryoku-radial-progress">
    <radial-progress-bar
      :startColor="color"
      :stopColor="color"
      innerStrokeColor="#C4C1C1"
      :strokeWidth="30"
      :diameter="212"
      isClockwise="true"
      :completed-steps="percentage"
      :total-steps="100"
    >
      <animated-number
        ref="totalRemainingBudgetNumber"
        :value="Number(percentage)"
        class="percentage font-size-22 font-bold-extra"
        suffix="%"
        :customStyle="true"
        :customStyleContents="`color: ${color}`"
      ></animated-number>
    </radial-progress-bar>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import RadialProgressBar from "vue-radial-progress";

import { AnimatedNumber } from "@/components";
export default {
  components: {
    RadialProgressBar,
    AnimatedNumber,
  },
  props: {
    percentage: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: "#00B4CE",
    },
  },
};
</script>