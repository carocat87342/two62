<template>
  <div class="event-header__count">
    <div class="count-item">
      <div class="number">{{days}}</div>
      <div class="count-label">DAYS</div>
    </div>
    <div class="count-item divider">:</div>
    <div class="count-item">
      <div class="number">{{hours}}</div>
      <div class="count-label">HOURS</div>
    </div>
    <div class="count-item divider">:</div>
    <div class="count-item">
      <div class="number">{{mins}}</div>
      <div class="count-label">MINUTES</div>
    </div>
    <div class="count-item with-icon">
      <div class="icon">
        <img :src="`${$iconURL}common/timer-white.svg`" width="20" />
      </div>
      <div class="count-label">To Event</div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "time-counter",
  props: {
    target: {
      type: [Number, Date]
    }
  },
  data() {
    return {
      days: "00",
      hours: "00",
      mins: "00"
    };
  },
  methods: {
    updateTime() {
      if (typeof this.target === "date") {
        const targetNumber = this.target.getTime();
        let diff = (targetNumber - new Date().getTime()) / 1000;
        this.days = diff / (24 * 3600);
        diff = diff - this.days * 24 * 3600;
        this.hours = diff / 3600;
        diff -= this.horus * 3600;
        this.mins = diff / 60;
      } else {
        const diff = moment
          .utc(moment(this.target).diff(new Date().getTime()))
          .format("DD:HH:mm");
        const targetNumber = this.target;
        this.days = diff.split(":")[0];
        this.hours = diff.split(":")[1];
        this.mins = diff.split(":")[2];
        // let diff = (targetNumber - new Date().getTime()) / 1000;
        // this.days = diff / ( 24 * 3600);
        // diff = diff - this.days * 24 * 3600;
        // this.hours = diff / 3600;
        // diff -= this.horus * 3600;
        // this.mins = diff / 60;
      }
    }
  },
  created() {
    this.updateTime();
  },
  mounted() {
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 60000);
  },
  watch: {
    target: function() {
      this.updateTime()
    }
  }

};
</script>
<style lang="scss" scoped>
  .event-header__count {
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    background-color: #ffc001;
    padding: 0.5em 1em;
    width: 323px;
    max-height: 82.1px;
    .count-item {
      text-align: center;
      &.divider {
        color: #fff;
        font-size: 40px;
        padding-top: 13px;
        margin: 0;
      }
      .number {
        text-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
        font-size: 27px;
        color: #ffffff;
        font-weight: 600;
        padding-top: 13px;
        font-family: "Manrope-Bold", sans-serif;
      }
      .icon {
        padding-top: 10px;
        border-radius: 3px 3px 0 0;
      }
      .count-label {
        text-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
        font-size: 12px;
        color: #fff;
        margin-top: 0.4em;
      }
      &.with-icon {
        border-left: 1px solid #fff;
        padding-left: 0.9em;
        text-align: center;
        width: 51px;
        line-height: 12px;
        .count-label {
          font-size: 10px;
        }
      }
    }
  }
</style>