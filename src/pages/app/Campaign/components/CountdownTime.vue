<template>
  <div class="countdown-time d-flex">
    <div class="countdown-time-item">
      <div class="countdown-time-value">{{getCountDuration.days}}</div>
      <div
        class="countdown-time-label"
        :style="`background-color: ${getBackColor}; color:${fontColor}`"
      >DAYS</div>
    </div>
    <div class="countdown-time-item">
      <div class="countdown-time-value">{{getCountDuration.hours}}</div>
      <div
        class="countdown-time-label"
        :style="`background-color: ${getBackColor}; color:${fontColor}`"
      >HOURS</div>
    </div>
    <div class="countdown-time-item">
      <div class="countdown-time-value">{{getCountDuration.mins}}</div>
      <div
        class="countdown-time-label"
        :style="`background-color: ${getBackColor}; color:${fontColor}`"
      >MINUTES</div>
    </div>
    <div class="countdown-time-item">
      <div class="countdown-time-value">{{getCountDuration.seconds}}</div>
      <div
        class="countdown-time-label"
        :style="`background-color: ${getBackColor}; color:${fontColor}`"
      >SECONDS</div>
    </div>
  </div>
</template>
<script>
import { duration } from "moment";
import { oppositeColor } from "@/utils/helperFunction";

export default {
  props: {
    event: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      period: 0,
      intervalId: null,
      backColor: "#d9fcf2",
      color: "#050505",
    };
  },
  created() {
    this.period = this.event.eventStartMillis - new Date().getTime();
    if (this.event.concept && this.event.concept[0]) {
      this.color = oppositeColor(this.event.concept.colors[0].color);
      this.backColor = this.event.concept.colors[0].color;
    }
    this.intervalId = setInterval(() => {
      if (this.event)
        this.period = this.event.eventStartMillis - new Date().getTime();
    }, 1000);
  },
  destroyed() {
    clearInterval(this.intervalId);
  },
  computed: {
    getCountDuration() {
      const timeDuration = duration(this.period, "milliseconds");
      return {
        days: ("0" + Math.abs(timeDuration.days())).slice(-2),
        hours: ("0" + Math.abs(timeDuration.hours())).slice(-2),
        mins: ("0" + Math.abs(timeDuration.minutes())).slice(-2),
        seconds: ("0" + Math.abs(timeDuration.seconds())).slice(-2),
      };
    },

    getBackColor() {
      if (this.event.concept) return this.event.concept.colors[0].color;
      else {
        return "#d9fcf2";
      }
    },
    fontColor() {
      console.log(this.getBackColor);
      return oppositeColor(this.getBackColor);
    },
  },
};
</script>
<style lang="scss" scoped>
.countdown-time {
  width: max-content;
  &-item {
    width: 118px;
    height: 161px;
    border-radius: 3px;
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
    background-color: #ffffff;
    margin-right: 28px;
    &:last-child {
      margin-right: 0px;
    }
    display: flex;
    flex-direction: column;
  }
  &-value {
    width: 100%;
    text-align: center;
    line-height: 115px;
    font-size: 40px;
    font-family: "Manrope-ExtraBold";
  }
  &-label {
    width: 100%;
    text-align: center;
    line-height: 40px;
    font-size: 20px;
    flex-grow: 1;
  }
}
</style>