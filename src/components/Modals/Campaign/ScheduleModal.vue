<template>
  <modal class="campaign-schedule-modal">
    <template slot="header">
      <div v-if="!showCalendar" class="add-category-model__header p-15">
        <div class="font-size-30 font-bold">
          <img :src="`${$iconURL}Campaign/clock-dark.svg`" style="width: 25px" class="mr-10" />
          When should we send this campaign?
        </div>
        <div class="font-size-22 mt-20">
          EventDate {{ $dateUtil.formatScheduleDay(event.eventStartMillis, "MM.DD.YY") }}
          <span class="font-size-16 color-dark-gray ml-10">{{ timezone.timeZoneName }}</span>
        </div>
      </div>
      <div v-if="showCalendar" class="p-15" style="padding-bottom: 0">
        <img :src="`${$iconURL}Campaign/arrow-left-dark.svg`" @click="showCalendar = false" />
      </div>
      <md-button class="md-simple md-just-icon md-round modal-default-button" @click="close">
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <div v-if="!showCalendar">
        <div class="md-layout justify-content-center width-100">
          <div
            class="md-layout-item md-size-100 margin-bottom d-flex justify-content-between font-size-22 align-center mt-10"
            :class="{ 'font-bold': selectedOption == 'tomorrow' }"
          >
            <div class="d-flex align-center">
              <md-checkbox class="md-checkbox-circle" v-model="selectedOption" value="tomorrow"></md-checkbox>
              <span class="font-size-22">Tomorrow morning</span>
            </div>
            <div>
              {{ $dateUtil.formatScheduleDay(scheduleSettings.tomorrow.calcTime, "MMM D, h:mm A") }}
              <img :src="`${$iconURL}Campaign/Group 9087.svg`" class="ml-20" />
            </div>
          </div>
          <div
            v-if="currentCampaign.name != 'SAVING_DATE'"
            class="md-layout-item md-size-100 margin-bottom d-flex justify-content-between font-size-22 align-center mt-30"
            :class="{ 'font-bold': selectedOption == 'previousCampaign' }"
            style="position: relative"
          >
            <div class="d-flex align-center">
              <md-checkbox class="md-checkbox-circle" v-model="selectedOption" value="previousCampaign"></md-checkbox>
              <input
                v-model="scheduleSettings.previousCampaign.value"
                type="number"
                min="0"
                class="text-center mr-20"
                style="width: 128px"
              />Weeks after the previous campaign
            </div>
            <!-- <div v-if="scheduleSettings.previousCampaign.calcTime">
              {{ $dateUtil.formatScheduleDay(scheduleSettings.previousCampaign.calcTime, "MMM D, h:mm A") }}
              <img :src="`${$iconURL}Campaign/Group 9087.svg`" class="ml-20" />
            </div> -->
            <div>
              <span :class="{ 'color-red': !isValideDate && selectedOption == 'previousCampaign' }">{{
                $dateUtil.formatScheduleDay(scheduleSettings.previousCampaign.calcTime, "MMM D, h:mm A")
              }}</span>
              <span v-if="!isValideDate && selectedOption == 'previousCampaign'" class="ml-20 mt-10">
                <img :src="`${$iconURL}Campaign/Group 9087.svg`" />
                <div class="font-size-14 input-tooltip invalid-notification">
                  Unless we're counting backwards, there are only {{ remainingDate }} days between now and the event...
                </div>
              </span>
              <span v-if="isValideDate" class="ml-20 mt-10 transparent">
                <img :src="`${$iconURL}Campaign/Group 9087.svg`" />
              </span>
            </div>
          </div>
          <div
            class="md-layout-item md-size-100 margin-bottom d-flex justify-content-between font-size-22 align-center mt-30 mb-40"
            :class="{ 'font-bold': selectedOption == 'beforeEvent' }"
            style="position: relative"
          >
            <div class="d-flex align-center">
              <md-checkbox class="md-checkbox-circle" v-model="selectedOption" value="beforeEvent"></md-checkbox>
              <input
                v-model="scheduleSettings.beforeEvent.value"
                min="0"
                class="text-center mr-20"
                type="number"
                style="width: 128px"
              />Days before the event
            </div>
            <div>
              <span :class="{ 'color-red': !isValideDate && selectedOption == 'beforeEvent' }">{{
                $dateUtil.formatScheduleDay(scheduleSettings.beforeEvent.calcTime, "MMM D, h:mm A")
              }}</span>
              <span v-if="!isValideDate && selectedOption == 'beforeEvent'" class="ml-20 mt-10">
                <img :src="`${$iconURL}Campaign/Group 9087.svg`" />
                <div class="font-size-14 input-tooltip invalid-notification">
                  Unless we're counting backwards, there are only {{ remainingDate }} days between now and the event...
                </div>
              </span>
              <span v-if="isValideDate" class="ml-20 mt-10 transparent">
                <img :src="`${$iconURL}Campaign/Group 9087.svg`" />
              </span>
            </div>
          </div>
        </div>
        <hr class="mr-15 ml-15" />
        <div
          class="md-layout-item md-size-100 margin-bottom d-flex justify-content-between font-size-22 align-center mt-30 mb-40"
        >
          <div class="d-flex align-center">
            <md-button class="md-simple md-dark edit-btn" @click="showCalendar = true">
              <img :src="`${$iconURL}Campaign/calendar-gray.svg`" style="width: 22px" class="mr-20 normal-btn" />
              <span class="color-black">Pick Date & Time</span>
              <md-icon style="color: #050505 !important">keyboard_arrow_right</md-icon>
            </md-button>
          </div>
          <div :class="{ 'font-bold': selectedOption == 'calendar' }" v-if="scheduleSettings.calendar.calcTime > 0">
            {{ $dateUtil.formatScheduleDay(scheduleSettings.calendar.calcTime, "MMMM DD, YYYY hh:mm A") }}
          </div>
        </div>
      </div>
      <div v-else class="text-left">
        <div class="font-size-30 font-bold-extra p-15">Pick Date & Time</div>
        <div class="font-size-16 color-dark-gray p-15">{{ timezone.timeZoneName }}</div>
        <div class="d-flex">
          <div class="flex-1">
            <functional-calendar
              :limits="{
                min: $dateUtil.formatScheduleDay(new Date(), 'YYYY-MM-DD'),
                max: $dateUtil.formatScheduleDay(new Date().getTime() + 24 * 3600 * 60 * 1000, 'YYYY-MM-DD'),
              }"
              :is-date-picker="true"
              :change-month-function="true"
              :change-year-function="true"
              dateFormat="yyyy-mm-dd"
              v-model="dateData"
            ></functional-calendar>
          </div>
          <div class="flex-1" style="padding-left: 80px; border-left: solid 1px #aeaeae">
            <!-- <time-input v-model="startTime" :h24="false" displayFormat="hh:mm" class="mt-100"></time-input> -->
            <time-picker class="mt-100" style="width: 70%" @change="setTimeFromCalendar"></time-picker>
          </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div v-if="showCalendar" class="font-size-16 schedule-date ml-15">
        <img :src="`${$iconURL}Campaign/clock-dark.svg`" style="width: 25px" />
        {{ $dateUtil.formatScheduleDay(dateData.selectedDate, "dddd, MMMM D, YYYY") }}
      </div>
      <div class="spacer flex-1"></div>
      <md-button class="md-default md-simple md-black" @click="close">
        <span class="color-black">Cancel</span>
      </md-button>
      <md-button class="md-red add-category-btn mr-15" @click="saveSchedule" :disabled="!canSave">Save</md-button>
    </template>
  </modal>
</template>
<script>
import { Modal } from "@/components";
import { FunctionalCalendar } from "vue-functional-calendar";
import TimeInput from "@/components/Inputs/TimeInput";
import TimePicker from "@/components/Inputs/TimePicker";
import moment from "moment";
export default {
  components: {
    Modal,
    FunctionalCalendar,
    TimeInput,
    TimePicker,
  },
  props: {
    currentCampaign: {
      type: Object,
      default: () => ({}),
    },
    campaigns: {
      type: Object,
      default: () => ({}),
    },
    currentCampaignIndex: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      showCalendar: false,
      dateData: {},
      startTime: "",
      daysBeforeEvent: 1,
      calendarTime: "",
      timezone: {},
      selectedOption: "",
      scheduleSettings: {
        tomorrow: {
          calcTime: moment(new Date()).add(1, "days").hours(9).minutes(0).valueOf(),
          value: 0,
        },
        previousCampaign: { value: 1, calcTime: "" },
        beforeEvent: { value: 1, calcTime: "" },
        calendar: { value: 0, calcTime: 0 },
      },
    };
  },
  created() {
    //set previous settings
    const currentCampaignData = this.$store.state.campaign[this.currentCampaign.name];
    if (currentCampaignData.scheduleSettings) {
      const scheduleSettings = currentCampaignData.scheduleSettings;
      console.log(scheduleSettings);
      this.scheduleSettings[scheduleSettings.scheduleOption].value = scheduleSettings.scheduleOptionValue;
      this.scheduleSettings[scheduleSettings.scheduleOption].calcTime = scheduleSettings.scheduleTime;
      this.selectedOption = scheduleSettings.scheduleOption;
    } else {
      // set before event
      this.scheduleSettings.beforeEvent.calcTime = moment(this.event.eventStartMillis)
        .add(this.scheduleSettings.beforeEvent, "days")
        .hours(9)
        .minutes(0)
        .valueOf();

      // set after previous campaign
      const previouseCampaignTime = this.campaigns[this.currentCampaignIndex - 1];
      console.log(previouseCampaignTime);
      if (previouseCampaignTime && previouseCampaignTime.scheduleTime) {
        this.scheduleSettings.previousCampaign.calcTime = moment(previouseCampaignTime.scheduleTime)
          .add(1, "weeks")
          .hours(9)
          .minutes(0)
          .valueOf();
      }
    }

    this.$dateUtil.getTimeZoneNameFromPlaceId(this.event.locationId).then((timezone) => {
      this.timezone = timezone;
    });
  },

  methods: {
    close() {
      this.$emit("cancel");
    },
    setTimeFromCalendar(time) {
      this.startTime = time;
    },
    saveSchedule() {
      if (this.showCalendar) {
        console.log(`${this.dateData.selectedDate} ${this.startTime}`);
        this.scheduleSettings.calendar.calcTime = moment(
          `${this.dateData.selectedDate} ${this.startTime}`,
          "YYYY-M-DD hh:mm A",
        ).valueOf();
        this.showCalendar = false;
        this.selectedOption = "calendar";
      } else {
        this.$emit("changeTime", {
          currentCampaignIndex: this.currentCampaignIndex,
          scheduleTime: this.scheduleSettings[this.selectedOption].calcTime,
          scheduleSettings: this.scheduleSettings,
          selectedOption: this.selectedOption,
        });
        this.close();
      }
    },
  },
  watch: {
    scheduleSettings: {
      handler(newSettings) {
        newSettings.beforeEvent.calcTime = moment(this.event.eventStartMillis)
          .subtract(newSettings.beforeEvent.value, "days")
          .hours(9)
          .minutes(0)
          .valueOf();
        const previouseCampaignTime = this.campaigns[this.currentCampaignIndex - 1];
        console.log("previouseCampaignTime", previouseCampaignTime);
        if (previouseCampaignTime) {
          console.log(previouseCampaignTime);
          console.log(this.campaigns[previouseCampaignTime.name]);
          console.log(this.campaigns);
          newSettings.previousCampaign.calcTime = moment(
            new Date(this.campaignData[previouseCampaignTime.name].scheduleTime),
          )
            .add(newSettings.previousCampaign.value, "weeks")
            .hours(9)
            .minutes(0)
            .valueOf();
        }
      },
      deep: true,
    },
  },
  computed: {
    event() {
      return this.$store.state.event.eventData;
    },
    campaignData() {
      return this.$store.state.campaign;
    },
    remainingDate() {
      return Math.round((this.event.eventStartMillis - new Date().getTime()) / 1000 / 24 / 3600);
    },
    canSave() {
      if (this.showCalendar) {
        if (!this.dateData.selectedDate || !this.startTime) {
          return false;
        }
        return true;
      } else if (this.selectedOption) {
        if (this.scheduleSettings[this.selectedOption].calcTime < new Date().getTime()) {
          return false;
        }
        return true;
      }
    },
    isValideDate() {
      if (this.selectedOption) {
        return this.scheduleSettings[this.selectedOption].calcTime > new Date().getTime();
      }
      return true;
    },
  },
};
</script>
<style lang="scss" scoped>
.vfc-popover-container {
  .vfc-main-container {
    width: max-content;
    box-shadow: none;
  }
}
.schedule-date {
  padding: 12px 36px;
  background-color: #ededed;
  border-radius: 3px;
  float: left;
}
.campaign-schedule-modal {
  .invalid-notification {
    position: absolute;
    background: #ffe5ec;
    padding: 5px;
    border-radius: 3px;
    width: 400px;
    right: 0;
    margin-top: 10px;
    z-index: 1;
    &:before {
      content: "";
      width: 10px;
      height: 10px;
      background: #ffe5ec;
      transform: rotate(45deg);
      position: absolute;
      right: 24px;
      top: -5px;
    }
  }
}
</style>