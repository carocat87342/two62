<template>
  <div class="rsvp-event-timeline md-layout">
    <div class="md-layout-item md-size-100 md-small-size-100 mb-50 d-flex align-center">
      <span class="text-transform-uppercase font-size-30 font-bold-extra" :class="{ 'color-gray': !isDisplayed }">
        A glimpse at the agenda
      </span>
      <md-switch v-if="canHide" v-model="isDisplayed" class="ml-10 md-switch-rose below-label large-switch">
        <span class="color-black font-regular">{{`${isDisplayed ? 'Show' : 'Hide'} Agenda`}}</span>
      </md-switch>
    </div>
    <template v-if="isDisplayed">
      <div
        v-for="(schedule, index) in scheduledDays"
        :key="index"
        class="md-layout-item md-size-50 md-small-size-100 text-transform-uppercase font-size-30 font-bold-extra mt-20"
      >
        <div class="rsvp-event-timeline-day">
          <!-- <span class="font-size-22 font-bold-extra">Day {{ $helper.numberToWord(index + 1) }}</span> -->
          <span class="font-size-22">{{ $dateUtil.formatScheduleDay(schedule.date) }}</span>
        </div>
        <div>
          <rsvp-timeline-item
            v-for="(timeline, index) in schedule.timelineItems"
            :key="index"
            :timeline="timeline"
          ></rsvp-timeline-item>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import RsvpTimelineItem from "./RSVPTimelineItem";
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import _ from "underscore";
import RsvpInformationModal from "@/components/Modals/RSVP/InformationModal";
import SettingReminderModal from "@/components/Modals/RSVP/SettingReminderModal";
import JoinZoomModal from "@/components/Modals/RSVP/JoinZoomModal";
import SyncCalendarModal from "@/components/Modals/RSVP/SyncCalendarModal";
import RsvpVenueCarousel from "./RSVPVenueCarousel";
import RsvpEventInfoPanel from "@/pages/app/RSVP/RSVPEventInfoPanel";
import { numberToWord } from "@/utils/helperFunction";
export default {
  components: {
    RsvpTimelineItem,
  },
  props: {
    hide: {
      type: Boolean,
      default: false,
    },
    canHide: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isDisplayed: true,
    };
  },
  created() {},
  computed: {
    event() {
      return this.$store.state.event.eventData;
    },
    scheduledDays() {
      var timelines = {};
      return this.event.timelineDates;
    },
  },
  watch: {
    isDisplayed(newValue, oldValue) {
      this.$emit("changeVisibility", newValue);
    },
  },
};
</script>
<style lang="scss" scoped>
.rsvp-event-timeline {
  &-day {
    line-height: 1.5em;
    width: 100%;
    background-color: #3a3838;
    text-align: center;
    color: white;
    border-radius: 2px;
  }
}
</style>
