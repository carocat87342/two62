<template>
  <div class="rsvp-timeline" v-if="timeline">
    <img class="item-icon" :src="`/static/icons/timeline/${timeline.icon.toLowerCase()}-circle.png`" />
    <div class="rsvp-timeline-content" :style="`border:dashed 2px ${timeline.color}`">
      <div>
        <div class="item-time">
          {{ $dateUtil.formatScheduleTime(Number(timeline.startTime)) }} -
          {{ $dateUtil.formatScheduleTime(Number(timeline.endTime)) }}
        </div>
        <div class="item-title">{{ timeline.title }}</div>
      </div>
      <div class="item-description">
        {{ timeline.description }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    timeline: {
      type: [Object, Array],
      default: () => {},
    },
  },
  created() {
    console.log(this.timeline);
  },
};
</script>

<style lang="scss" scoped>
.rsvp-timeline {
  padding-left: 80px;
  position: relative;
  margin: 40px 0px;
  &:not(:last-child):after {
    content: "";
    position: absolute;
    height: 100%;
    border-left-color: #707070;
    border-left-width: 2px;
    border-left-style: dashed;
    left: 32px;
    top: 77px;
  }
  .item-icon {
    position: absolute;
    left: 0;
    top: 13px;
    font-size: 35px !important;
    width: 64px;
    height: 64px;
    background: #eeeeee;
    color: #bcbcbc !important;
    -webkit-box-shadow: 0px 4px 20px 0 rgba(0, 0, 0, 0.14);
    box-shadow: 0px 4px 20px 0 rgba(0, 0, 0, 0.14);
    border-radius: 50%;
  }
  .item-time {
    color: #000;
    font-weight: 900;
    font-size: 20px;
    border-radius: 100px;
    margin-right: 0.7em;
    font-family: "Manrope-ExtraBold", sans-serif;
  }
  .item-title {
    font-family: "Manrope-ExtraBold", sans-serif;
    font-size: 20px;
    opacity: 0.87;
    color: #818080;
    // border-left: 1px solid #707070;
    // padding-left: 0.7em;
    padding-top: 0.5em;
  }
  .item-description {
    font-size: 14px;
    font-weight: normal;
    line-height: 1em;
    margin-top: 15px;
    font-family: "Manrope-Regular";
    word-break: break-word;
    line-height: 1.5em;
  }
  &-content {
    padding: 30px;
    border-width: 2px;
    border-style: dashed;
  }
}
@media only screen and (max-width: 959px) {
  .rsvp-timeline {
    padding-left: 50px;
    margin: 25px 0px;
    &:not(:last-child):after {
      left: 20px;
      top: 52px;
    }
    .item-icon {
      left: 0;
      top: 13px;
      width: 40px;
      height: 40px;
    }
    .item-time {
      font-size: 16px;
    }
    .item-title {
      font-size: 16px;
    }
    .item-description {
      font-size: 16px;
    }
    &-content {
      padding: 15px;
    }
  }
}
</style>