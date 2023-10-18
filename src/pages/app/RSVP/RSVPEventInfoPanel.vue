<template>
  <div class="rsvp-event-info">
    <div class="event-info-item">
      <div class="event-info-item-title font-size-22 font-bold-extra">
        <color-button
          v-model="iconColors.timeColor"
          class="event-info-item-icon"
          :size="42"
          :icon="`${$iconURL}RSVP/Path+251.svg`"
          @closed="updateEvent"
        >
        </color-button>
        <span :class="{ underline: !editable }">WHEN?</span>
      </div>
      <div class="event-info-item-content">
        <span>
          {{ $dateUtil.formatScheduleDay(startTime || event.eventStartMillis, "MMM DD, YYYY hh:mm A ") }}
        </span>
        <div class="timezone-wrapper" v-if="!editingTimezone">
          <span>({{ timezone }})</span>
          <md-button class="edit-btn md-simple md-red" @click="editingTimezone = true" v-if="editable">Edit</md-button>
        </div>
        <div class="timezone-wrapper" v-if="editingTimezone">
          <v-select class="timezone-selector" v-model="timezone" :options="timezoneList"></v-select>
          <md-button class="maryoku-btn md-simple md-red" @click="editingTimezone = false">Cancel</md-button>
          <md-button class="maryoku-btn md-red" @click="updateEvent">Save</md-button>
        </div>
      </div>
    </div>
    <div class="event-info-item" v-if="!isVirtualEvent">
      <div class="event-info-item-title font-size-22 font-bold-extra">
        <color-button
          v-model="iconColors.locationColor"
          class="event-info-item-icon"
          :size="42"
          :icon="`${$iconURL}Event%20Page/location-dark.svg`"
          @closed="updateEvent"
        >
        </color-button>
        <span :class="{ underline: !editable }">WHERE?</span>
      </div>
      <div class="event-info-item-content">
        <span>{{ event.location }}</span>
      </div>
    </div>
    <div class="event-info-item" v-else>
      <div class="event-info-item-title font-size-22 font-bold-extra">
        <color-button
          v-model="iconColors.locationColor"
          class="event-info-item-icon"
          :size="42"
          :icon="`${$iconURL}Event%20Page/location-dark.svg`"
          @closed="updateEvent"
        >
        </color-button>
        <span :class="{ underline: !editable }">WHERE?</span>
      </div>
      <div class="event-info-item-content"><span>Zoom</span></div>
    </div>
    <div class="event-info-item" v-if="!isVirtualEvent">
      <div class="event-info-item-title font-size-22 font-bold-extra">
        <color-button
          v-model="iconColors.soloColor"
          class="event-info-item-icon"
          :size="42"
          :icon="`${$iconURL}RSVP/Path+1383.svg`"
          @closed="updateEvent"
        >
        </color-button>
        <span :class="{ underline: !editable }">SOLO OR PLUS 1?</span>
      </div>
      <div class="event-info-item-content d-flex align-center" v-if="!editingPlusOne">
        <span>{{ isPluseOne ? "+1" : "Solo" }} &emsp;</span>
        <md-button class="md-simple edit-btn md-red" v-if="editable" @click="editingPlusOne = !editingPlusOne">
          Edit
        </md-button>
      </div>
      <div class="event-info-item-content d-flex align-center" v-else>
        <md-checkbox v-model="isPluseOne" :value="false">Solo</md-checkbox>
        <md-checkbox v-model="isPluseOne" :value="true">+1</md-checkbox>
        <md-button class="md-simple md-black maryoku-btn" @click="editingPlusOne = !editingPlusOne">Cancel</md-button>
        <md-button class="md-red maryoku-btn" @click="updateEvent">Save</md-button>
      </div>
    </div>
    <div class="event-info-item">
      <div class="event-info-item-title font-size-22 font-bold-extra">
        <color-button
          v-model="iconColors.arrivalColor"
          class="event-info-item-icon"
          :size="42"
          :icon="`${$iconURL}RSVP/Group+1279.svg`"
          @closed="updateEvent"
        >
        </color-button>
        <span :class="{ underline: !editable }">ARRIVAL?</span>
      </div>

      <div class="event-info-item-content" v-if="!editingArrival">
        <span>
          {{ event.arrival || "-" }}&emsp;
          <md-button class="md-simple edit-btn md-red" v-if="editable" @click="editingArrival = !editingArrival">
            Edit</md-button
          >
        </span>
      </div>
      <div class="event-info-item-content d-flex align-center font-size-20" v-else>
        <input type="text" v-model="eventArrival" />
        <md-button class="md-simple md-black maryoku-btn" @click="editingArrival = !editingArrival">Cancel</md-button>
        <md-button class="md-red maryoku-btn" @click="updateEvent">Save</md-button>
      </div>
    </div>
  </div>
</template>
<script>
import CalendarEvent from "@/models/CalendarEvent";
import Calendar from "@/models/Calendar";
import { firstLetters } from "@/utils/helperFunction";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import ColorButton from "@/components/ColorButton";
export default {
  components: {
    vSelect,
    ColorButton,
  },
  props: {
    event: {
      type: Object,
      default: {},
    },
    editable: {
      type: Boolean,
      default: true,
    },
    zoomLink: {
      type: String,
      default: "",
    },
    startTime: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isPluseOne: this.isPlusOne,
      eventArrival: this.event.arrival || "-",
      timezone: "",
      editingPlusOne: false,
      editingArrival: false,
      editingTimezone: false,
      timezoneList: ["EST", "PST", "CST", "MST", "EDT", "HST"],
      iconColors: {},
    };
  },
  created() {
    if (this.event.locationId && !this.event.timezone) {
      this.$dateUtil.getTimeZoneNameFromPlaceId(this.event.locationId).then((timezone) => {
        const phrases = timezone.timeZoneName.split(" ");
        const result = phrases.reduce((s, phrase) => {
          return `${s}${phrase.substr(0, 1).toUpperCase()}`;
        }, "");
        this.timezone = result;
      });
    } else {
      this.timezone = this.event.timezone;
    }
    if (this.event.additionalData && this.event.additionalData.iconColors) {
      this.iconColors = this.event.additionalData.iconColors;
    } else {
      this.$set(this.iconColors, "timeColor", this.event.concept ? this.event.concept.colors[0] : {});
      this.$set(this.iconColors, "locationColor", this.event.concept ? this.event.concept.colors[0] : {});
      this.$set(this.iconColors, "soloColor", this.event.concept ? this.event.concept.colors[0] : {});
      this.$set(this.iconColors, "arrivalColor", this.event.concept ? this.event.concept.colors[0] : {});
    }
    console.log("iconColors", this.iconColors);
  },
  methods: {
    updateEvent() {
      let additionalData = this.event.additionalData;
      if (!additionalData) {
        additionalData = {};
      }
      additionalData.iconColors = this.iconColors;
      this.$store.dispatch(
        "event/saveEventAction",
        new CalendarEvent({
          id: this.event.id,
          calendar: new Calendar({ id: this.event.calendar.id }),
          isPluseOne: this.isPluseOne,
          arrival: this.eventArrival,
          timezone: this.timezone,
          additionalData,
        }),
      );
      this.editingPlusOne = false;
      this.editingArrival = false;
      this.editingTimezone = false;
    },
  },
  computed: {
    concept() {
      return this.event.concept ? this.event.concept : {};
    },
    backgroundColor() {
      return this.event.concept ? this.event.concept.colors[0].color : "#d9fcf2";
    },
    isPlusOne() {
      if ("isPlusOne" in this.event) {
        return this.event.isPlusOne;
      }
      return this.event.guestType === "employees-spouses" || this.event.guestType === "families";
    },
    isVirtualEvent() {
      return this.event.places && this.event.places.length === 1 && this.event.places[0] === "VIRTUAL";
    },
  },
  watch: {
    event(newValue, oldValue) {
      if (!newValue.timezone) {
        console.log(newValue);
        this.$dateUtil.getTimeZoneNameFromPlaceId(newValue.locationId).then((timezone) => {
          const phrases = timezone.timeZoneName.split(" ");
          const result = phrases.reduce((s, phrase) => {
            return `${s}${phrase.substr(0, 1).toUpperCase()}`;
          }, "");
          this.timezone = result;
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.rsvp-event-info {
  .event-info-item {
    margin-bottom: 50px;
    display: flex;
    align-items: stretch;
    // flex-flow: wrap;
    .timezone-selector {
      min-width: 120px;
    }
    &-icon {
      position: relative;
      display: inline-block;
      margin-right: 20px;
      &-background {
        width: 42px;
        height: 42px;
        position: absolute;
        left: 0px;
        top: 0px;
        cursor: pointer;
        // opacity: 0.32;÷
      }
      img {
        width: 42px;
        height: 42px;
        position: absolute;
        left: 0px;
        top: 0px;
        padding: 8px;
        cursor: pointer;
        background-color: #ff7600;
      }
    }
    &-title {
      min-width: 250px;
      display: flex;
      align-items: center;
      // padding: 10px 24px;
      span.underline {
        border-bottom: solid 2px #ff7600;
        vertical-align: middle;
      }
    }
    &-content {
      font-size: 20px;
      padding-left: 10px;
      word-break: break-all;
      display: flex;
      align-items: center;
      max-height: 40px;
      .maryoku-btn {
        margin: 0;
      }
    }
  }
  .timezone-wrapper {
    margin-left: 20px;
    display: flex;
  }
}
@media only screen and (max-width: 959px) {
  .rsvp-event-info {
    .event-info-item {
      margin-bottom: 20px;
      &-icon {
        width: 25px;
        height: 25px;
        border-radius: 21px;
        padding: 8px;
        margin-right: 5px;
        &-background {
          width: 25px;
          height: 25px;
          left: 0px;
          top: 0px;
        }
        img {
          width: 60%;
          height: 25px;
          left: 5px;
          top: 0px;
        }
      }
      &-title {
        min-width: 110px;

        span.underline {
          border-bottom: solid 2px #ff7600;
          vertical-align: middle;
          font-size: 16px;
        }
      }
      &-content {
        font-size: 14px;
      }
    }
  }
}
</style>
