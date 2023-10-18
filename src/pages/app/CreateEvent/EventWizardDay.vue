<template>
  <div class>
    <div class="container">
      <div class="title">
        <span class="">1/5</span>
        <br />WHEN IS THE BIG DAY?
      </div>
      <div class="event-date event-basic-info">
        <md-checkbox v-model="multiple">More than one day event</md-checkbox>
        <div class="date-picker picker-panel bg-white">
          <div class="d-flex pl-10 justify-content-center">
            <img :src="`${$iconURL}Event Page/calendar-dark.svg`" width="21px" />
            <span class="date-string">{{ getFormattedDate }}</span>
          </div>
          <div>
            <calendar
                :multiple="multiple"
                @select="selectDay"
            ></calendar>
          </div>
        </div>
      </div>
    </div>
    <wizard-status-bar class="mt-10" :currentStep="1" @next="goToNext" @skip="skip" @back="back"></wizard-status-bar>
  </div>
</template>

<script>
import WizardStatusBar from "./componenets/WizardStatusBar";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

import moment from "moment";
import { extendMoment } from "moment-range";
import { timelineTempates } from "@/constants/event.js";
import { Calendar } from "@/components";
export default {
  components: {
    WizardStatusBar,
    Calendar,
  },
  data() {
    return {
        multiple: false,
        dateData: {selectedDate: moment().format('YYYY-M-D')},
    };
  },
  methods: {
    ...mapMutations("PublicEventPlanner", ["setEventProperty", "setCurrentStep"]),
    goToNext() {
      if (!this.dateData || !Object.keys(this.dateData).length) return "";
      if (this.multiple) {
          this.setEventProperty({
              key: "eventStartMillis",
              actualValue: new Date(this.dateData.dateRange.start.date).getTime(),
          });
          this.setEventProperty({
              key: "eventEndMillis",
              actualValue: new Date(this.dateData.dateRange.end.date).getTime(),
          });
      } else {
          this.setEventProperty({
              key: "eventStartMillis",
              actualValue: new Date(this.dateData.selectedDate).getTime(),
          });
          this.setEventProperty({
              key: "eventEndMillis",
              actualValue: new Date(this.dateData.selectedDate).getTime(),
          });
      }
        const extendedMoment = extendMoment(moment);
        const start = this.multiple ? new Date(this.dateData.dateRange.start.date) : new Date(this.dateData.selectedDate);
        const end = this.multiple ?new Date(this.dateData.dateRange.end.date) : new Date(this.dateData.selectedDate);
        const range = extendedMoment.range(moment(start), moment(end));

        const dateList = Array.from(range.by("day")).map((m) => m.format("YYYY-MM-DD"));
        const timelineDates = [];
        dateList.forEach((d, index) => {
          timelineDates.push({
            date: d,
            templates: timelineTempates,
            status: "editing",
            dateIndex: index,
          });
        });
        this.setEventProperty({
          key: "timeline",
          actualValue: {
            dateList: dateList,
            mode: "template", // default
            status: "editing",
          },
        });
        this.setEventProperty({
          key: "timelineDates",
          actualValue: timelineDates,
        });
        this.setEventProperty({ key: "dateData", actualValue: this.dateData });
        this.$router.push({ path: `/event-wizard-flexibility` });

    },
    skip() {
      this.setEventProperty({
        key: "eventStartMillis",
        actualValue: 0,
      });
      this.setEventProperty({
        key: "eventEndMillis",
        actualValue: 0,
      });
      this.$router.push({ path: `/event-wizard-flexibility` });
    },
    selectDay(e){
      this.dateData = e;
    },
    back() {
      this.$router.push({ path: `/create-event-wizard` });
    },
  },

  created() {

    // if (this.publicEventData.eventStartMillis) {
    //   this.dateData.selectedDate =  new Date(this.publicEventData.eventStartMillis)
    // }

  },
  computed: {
    ...mapState("PublicEventPlanner", ["publicEventData"]),
    getFormattedDate() {
      return moment().format("dddd, MMM DD, YYYY");
    },
  },
  watch: {
    dateData(newValue, oldValue) {
    },
    multiple(newVal, oldVal){
      this.dateData = null;
    }
  },
};
</script>
<style lang="scss">
.event-date.event-basic-info {
  width: 450px;
  max-width: 100%;
  margin: 20px auto 10px;
  padding: 0;
  min-height: 500px;
  position: relative;

  .vfc-calendar .vfc-content {
    width: 330px;
    margin: auto;
  }
  .picker-panel {
    display: block;
    position: relative;
    padding: 40px 10px;
    border: solid 1px #bec0c2;
    border-radius: 3px;
    margin: auto;
    height: max-content;

    &.time-picker {
      img {
        width: 23px;
        margin-right: 25px;
      }
      .time-select-fields {
        flex-grow: 1;
      }

    }
  }
  .title {
    font-family: "Manrope-Bold";
    font-size: 40px;
    text-align: center;
    line-height: 1.2em;
    margin: 20px;
  }
  .date-string {
    padding-left: 10px;
    white-space: break-spaces;
  }
  .vfc-main-container {
    margin: auto;
  }
}
</style>
