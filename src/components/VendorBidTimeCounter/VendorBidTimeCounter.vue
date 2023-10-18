<template>
  <div class="vendor-bid-time-counter-wrapper event" :class="customClass">
    <div v-if="topContent" class="action-cont border-bottom">{{ topContent }}</div>
    <div class="time-cont">
      <ul>
        <li class="fix-digit">{{ d | attachZero }}<br /><span>Days</span></li>
        <li>:</li>
        <li class="fix-digit">{{ h | attachZero }}<br /><span>Hours</span></li>
        <li>:</li>
        <li class="fix-digit">{{ m | attachZero }}<br /><span>Min</span></li>
        <li>:</li>
        <li class="fix-digit">{{ s | attachZero }}<br /><span>Sec</span></li>
      </ul>
    </div>
    <div v-if="bottomContent" class="action-cont border-top">{{ bottomContent }}</div>
  </div>
</template>
<script>
export default {
  name: "vendor-bit-time-counter",
  components: {},
  props: {
    days: Number,
    hours: Number,
    minutes: Number,
    seconds: Number,
    topContent: String,
    bottomContent: String,
    customClass: String,
  },
  data() {
    return {
      totalTime: 0,
      d: 0,
      h: 0,
      m: 0,
      s: 0,
    };
  },
  methods: {
    timerCount: function () {
      this.totalTime -= 1000;
      this.calcTime(this.totalTime);
    },
    calcTime: function (totalTime) {
      this.d = Math.floor(totalTime / (1000 * 60 * 60 * 24));
      this.h = Math.floor((totalTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.m = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
      this.s = Math.floor((totalTime % (1000 * 60)) / 1000);
    },
  },
  created() {},
  mounted() {
    this.totalTime =
      this.days * 24 * 60 * 60 * 1000 + this.hours * 60 * 60 * 1000 + this.minutes * 60 * 1000 + this.seconds * 1000;
    if (this.totalTime != 0) {
      this.timerCount();
      this.interval = setInterval(() => {
        this.timerCount();
      }, 1000);
    }
  },
  computed: {},
  watch: {},
  filters: {
    attachZero(number) {
      return number > 9 ? number : "0" + number.toString();
    },
  },
};
</script>
<style lang="scss" scoped>
.vendor-bid-time-counter-wrapper {
  font-family: "Manrope-Regular", sans-serif;
  text-align: center;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  color: #ffffff;

  .time-cont {
    padding: 18px 34px 9px 34px;
    font-size: 30px;
    font-weight: bold;

    ul {
      padding: 0;
      margin: 0;
      list-style: none;
      display: flex;
      justify-content: center;
      li {
        margin-right: 16px;

        span {
          font-size: 14px;
          font-weight: normal;
        }

        &.fix-digit {
          width: 36px;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .action-cont {
    font-size: 14px;
    font-weight: bold;
    padding: 12px 0;
  }
  .border-top{border-top: 2px solid rgba(255, 255, 255, 0.64);}
  .border-bottom{border-bottom: 2px solid rgba(255, 255, 255, 0.64);}
}
</style>
