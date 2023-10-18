<template>
  <modal class="timeline-gap-modal">
    <template slot="header">
      <div>
        <div class="font-size-30 font-bold line-height-1">
          Do you want to save your timeline
          <br />even though you have a time gap?
        </div>
        <div class="mt-20">You have a gap with no activity between {{duration}}</div>
      </div>
      <md-button class="md-simple md-just-icon md-round modal-default-button" @click="close">
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <div class="timeline-gap-modal-body">
        <div class="timeline-gap d-flex">
          <div class="timeline-gap-icon">
            <img :src="`${$iconURL}Timeline-New/timegap.svg`" class="page-icon" />
          </div>
          <div class="timeline-gap-block flex-grow-1 ml-20">
            <div>*{{duration}}</div>
            <div class="font-bold">Window Gap</div>
            <div>Drag A Time Slot To Complete Timeline</div>
          </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <md-button class="md-default md-simple md-black" @click="yesClick">
        <span class="color-black">Yes,save it</span>
      </md-button>
      <md-button class="md-red add-category-btn mr-15" @click="noClick">No, I want to fill that gap</md-button>
    </template>
  </modal>
</template>
<script>
import { Modal } from "@/components";
import moment from "moment";

export default {
  components: {
    Modal,
  },
  props: {
    timelineGap: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    yesClick() {
      this.$emit("yes");
    },
    noClick() {
      this.$emit("close");
    },
    close() {
      this.$emit("close");
    },
  },
  computed: {
    duration() {
      return `${moment(this.timelineGap.startTime).format("hh:mm A")}-${moment(
        this.timelineGap.startTime,
      ).format("hh:mm A")}`;
    },
  },
};
</script>
<style lang="scss" scoped>
.timeline-gap-modal {
  .timeline-gap {
    align-items: center;
    &-icon {
      width: 60px;
      height: 60px;
      border-radius: 50px;
      border: dashed 1px #818080;
      padding: 15px;
    }
    &-block {
      border: dashed 1px #818080;
      flex-grow: 1;
      padding: 20px;
    }
  }
}
</style>