<template>
  <div class="down-timer" :class="`${size}`">
    <div class="count-item">
      <div class="number">{{ $stringUtil.getTwoDigits(days) }}</div>
      <div class="count-label">Days</div>
    </div>
    <div class="count-item divider">:</div>
    <div class="count-item">
      <div class="number">{{ $stringUtil.getTwoDigits(hours) }}</div>
      <div class="count-label">Hours</div>
    </div>
    <div class="count-item divider">:</div>
    <div class="count-item">
      <div class="number">{{ $stringUtil.getTwoDigits(mins) }}</div>
      <div class="count-label">Min</div>
    </div>
    <div class="count-item divider">:</div>
    <div class="count-item">
      <div class="number">{{ $stringUtil.getTwoDigits(secs) }}</div>
      <div class="count-label">Sec</div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "time-counter",
  props: {
    target: {
      type: [Number, Date],
    },
    size: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      days: "00",
      hours: "00",
      mins: "00",
      secs: "00",
      intervalId: null,
    };
  },
  methods: {
    updateTime() {
      if (typeof this.target === "object") {
        const targetNumber = this.target.getTime();
        let diff = (targetNumber - new Date().getTime()) / 1000;
        if (diff < 0) return;
        this.days = Math.floor(diff / (24 * 3600));
        diff = diff - this.days * 24 * 3600;
        this.hours = Math.floor(diff / 3600);
        diff = diff - this.hours * 3600;
        this.mins = Math.floor(diff / 60);
        diff -= this.mins * 60;
        this.secs = `${Math.floor(diff)}`;
      } else {
        const diff = moment.utc(moment(this.target).diff(new Date().getTime())).format("DD:HH:mm:ss");
        const targetNumber = this.target;
        this.days = diff.split(":")[0];
        this.hours = diff.split(":")[1];
        this.mins = diff.split(":")[2];
        this.secs = diff.split(":")[3];
        // let diff = (targetNumber - new Date().getTime()) / 1000;
        // this.days = diff / ( 24 * 3600);
        // diff = diff - this.days * 24 * 3600;
        // this.hours = diff / 3600;
        // diff -= this.horus * 3600;
        // this.mins = diff / 60;
      }
    },
  },
  created() {
    this.updateTime();
    this.intervalId = setInterval(() => {
      this.updateTime();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  watch: {
    target: function () {
      this.updateTime();
    },
  },
};
</script>
<style lang="scss" scoped>
.down-timer {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.5em 1em;
  max-height: 82.1px;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);

  .count-item {
    text-align: center;
    &.divider {
      font-size: 14px;
      margin: 0;
    }
    .number {
      font-size: 14px;
      font-weight: 600;
      font-family: "Manrope-Bold", sans-serif;
      &.big {
        font-size: 30px;
      }
    }
    .count-label {
      font-size: 9px;
    }
  }
  &.big {
    .count-item {
      &.divider {
        font-size: 30px;
        margin: 0 0.2em;
      }
      .number {
        font-size: 30px;
      }
      .count-label {
        font-size: 14px;
      }
    }
  }
}
</style>