<template>
  <div class="event-overview-item card-section" :class="{ 'align-center': !isEdit }">
    <div class="left" :class="{ 'align-center': !isEdit }">
      <img class="mr-30" :src="section.img_src" />
      <div class="mr-30 flex-1">
        <div class="text-left">
          <span class="title font-size-26 mr-30">{{ section.title }}</span>
          <span class="content" v-if="!isEdit && section.startTime">{{ section.startTime * 1000 | formatDate }}</span>
          <span class="content" v-if="!isEdit && section.location">{{ section.location }}</span>
          <span v-if="!isEdit && section.numberOfParticipants" class="content">
            {{ section.numberOfParticipants | formatQty }} Guests
          </span>
          <span v-if="!isEdit && section.eventType" class="content">{{ section.eventType }}</span>
        </div>

        <div class="row">
          <maryoku-input
            v-if="isEdit && section.key === 'date'"
            :value="eventDate"
            class="form-input w-max-400"
            placeholder="Choose date…"
            inputStyle="date"
            v-model="eventDate"
            @input="changeDate"
          ></maryoku-input>
        </div>
        <location-input
          v-if="isEdit && section.key === 'location'"
          v-model="section.location"
          placeholder="Type city / region or specific address here…"
          class="my-10 w-max-450"
          @change="changeLocation"
        >
        </location-input>

        <maryoku-input
          v-if="isEdit && section.key === 'number_of_guest'"
          class="form-input w-max-250 my-10"
          placeholder="Type number…..."
          inputStyle="users"
          @change="guestNumberChange"
          :value="section.numberOfParticipants.toString()"
        ></maryoku-input>

        <category-selector
          v-if="isEdit && section.key === 'event_type'"
          :value="section.eventType"
          :categories="eventTypes"
          trackBy="name"
          class="my-10 w-max-450"
          @change="eventTypeChange"
        ></category-selector>

        <div v-if="isEdit && section.warning" class="warning d-flex">
          <img class="mr-10" :src="`${iconsUrl}Group 1175 (9).svg`" width="20" />
          <div>{{ section.warning }}</div>
        </div>
      </div>

      <div v-if="isEdit && section.key === 'date'" class="value">
          <div class="md-layout">
              <div class="md-layout-item md-size-50 p-0">
                  <p class="title font-size-20 my-5">From</p>
                  <div class="event-time d-flex align-center">
                      <vue-timepicker
                          manual-input
                          input-class="time-class"
                          hide-dropdown
                          format="hh:mm"
                          v-model="startTime"
                          hide-clear-button
                          @change="changeDate"
                      />
                      <div class="am-field" @click="changeDate('start')">
                          <input type="text" v-model="amPack.start" readonly />
                      </div>
                  </div>
              </div>
              <div class="md-layout-item md-size-50 p-0">
                  <p class="title font-size-20 my-5">To</p>
                  <div class="event-time d-flex align-center">
                      <vue-timepicker
                          manual-input
                          input-class="time-class"
                          hide-dropdown
                          format="hh:mm"
                          v-model="endTime"
                          hide-clear-button
                          @change="changeDate"
                      />
                      <div class="am-field" @click="changeDate('end')">
                          <input type="text" v-model="amPack.end" readonly />
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
    <div class="right">
      <md-button class="md-simple" @click="isEdit = !isEdit">
        <md-icon style="font-size: 40px !important">
          {{ isEdit ? "keyboard_arrow_down" : "keyboard_arrow_right" }}
        </md-icon>
      </md-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import Multiselect from "vue-multiselect";
import HeaderActions from "@/components/HeaderActions";
import { MaryokuInput, LocationInput, HolidayInput } from "@/components";
import { FunctionalCalendar } from "vue-functional-calendar";
import moment from "moment";
import { mapState } from "vuex";
import CategorySelector from "@/components/Inputs/CategorySelector";
import EventOverviewDate from "./EventOverviewDate";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import TimePicker from "@/components/Inputs/TimePicker.vue";

export default {
  name: "event-overview-section",
  components: {
    Multiselect,
    HeaderActions,
    FunctionalCalendar,
    MaryokuInput,
    LocationInput,
    HolidayInput,
    CategorySelector,
    EventOverviewDate,
    VueTimepicker,
    TimePicker,
  },
  props: {
    section: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isEdit: false,
      iconsUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/NewLandingPage/",
      additional: true,
      startTime: { hh: "12", mm: "00" },
      endTime: { hh: "12", mm: "00" },
      eventDate: null,
      amPack:{ start: "am", end: "am" },
      location: null,
      eventType: null,
      eventTypes: [],
    };
  },
  methods: {
    getIconUrl(name) {
      if (name === "outdoors") {
        return `${this.$secondIconURL}Event%20Page/botanical%20(1).svg`;
      } else if (name === "indoors") {
        return `${this.$iconURL}Requirements/All%20indoor.svg`;
      } else if (name === "guestType") {
        return `${this.$secondIconURL}Event%20Page/Path%204858.svg`;
      } else if (name === "occasion") {
        return `${this.$secondIconURL}Event%20Page/Path%204856.svg`;
      } else if (name === "virtual") {
        return `${this.$secondIconURL}Creation/group-11232.svg`;
      }
    },
    changeLocation(loc) {
      // console.log("change.location", loc);
      if (!loc) return;
      this.$emit("change", { location: loc });
    },
    guestNumberChange(e) {
      console.log('guestNumberChange', e);
      this.$emit("change", { numberOfParticipants: parseInt(e) });
    },
    eventTypeChange(e) {
      console.log('eventTypeChange', e);
      this.$emit("change", { eventType: e });
    },
    changeDate(field = null){
        console.log('changeDate', this.eventDate, this.startTime, this.endTime, this.amPack);
        if(field == 'start') this.amPack.start = this.amPack.start === 'am' ? 'pm' : 'am'
        if(field == 'end') this.amPack.end = this.amPack.end === 'am' ? 'pm' : 'am'
        this.$emit('change', {dateData: {
            startTime: this.getTimeFromFormat(this.eventDate, this.startTime, this.amPack.start, "DD.MM.YYYY hh:mm a"),
            endTime: this.getTimeFromFormat(this.eventDate, this.endTime, this.amPack.start, "DD.MM.YYYY hh:mm a"),
        }})
    },
    getTimeFromFormat(date, time, a, format) {
      return moment(`${date} ${time.hh}:${time.mm} ${a}`, format).unix();
    },
    init: async function () {

      this.eventTypes = this.eventTypesList.map((it) => {
        return { name: it.name, value: it.name, icon: `${this.$iconURL}Onboarding/${it.key}.svg` };
      });

      this.eventDate = moment(this.section.startTime * 1000).format("DD.MM.YYYY")
      this.startTime = {
          hh: moment(this.section.startTime * 1000).format("hh"),
          mm: moment(this.section.startTime * 1000).format("mm"),
      }
      this.endTime = {
          hh: moment(this.section.endTime * 1000).format("hh"),
          mm: moment(this.section.endTime * 1000).format("mm"),
      }

    },
  },
  filters: {
    formatDate: function (date) {
      return moment(date).format("MMMM DD, YYYY");
    },
  },
  computed: {
    eventTypesList() {
      return this.$store.state.common.eventTypes;
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    section: {
      handler(newVal) {
        if (newVal) this.init();
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.event-overview-item {
  position: relative;
  border-radius: 0px;
  background-color: #ffffff;
  padding: 40px 0;
  display: flex;
  box-shadow: none;
  border-bottom: solid 1px #818080;
  text-align: left;
  .left {
    width: 100%;
    img {
      max-width: 70px;
      max-height: 70px;
    }

    display: flex;

    .title {
      margin: 0;
      font: 500 24px Manrope-Regular, sans-serif;
      text-align: left;
    }

    .content {
      font-size: 20px;
      margin: 10px 0;
    }

    .warning {
      text-align: left;
    }

    .value {
      font-size: 18px;
      min-width: 40%;
      max-width: 50%;
      text-align: left;
      h3 {
        font: 800 24px Manrope-Regular, sans-serif;
        margin: 0 0 12px;
      }

      img {
        margin-right: 10px;
        max-width: 25px;
        max-height: 25px;
      }

      .picker-panel {
        padding: 10px 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .md-checkbox {
        display: flex !important;
      }
      &.sub-info {
      }
    }

    .checkbox-label-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
      img {
        margin-right: 5px;
        max-width: 25px;
        max-height: 25px;
      }
      margin-left: 10px;
      margin-right: 50px;
    }
  }
  .event-time {
    /deep/ .time-picker {
        width: unset;
        input {
            text-align: center;
            width: 110px;
            height: 55px;
            border-radius: 3px;
            font: normal 18px Manrope-Regular, sans-serif;
            border: solid 0.5px #bcbcbc !important;
        }
        .dropdown ul li:not([disabled]).active,
        .dropdown ul li:not([disabled]).active:hover,
        .dropdown ul li:not([disabled]).active:focus {
            background: #f51355;
            color: #fff;
        }
    }
  }
  .am-field {
    position: relative;
    cursor: pointer;

    &:before {
        position: absolute;
        content: ">";
        transform: translateX(50%) translateY(calc(100% + 1.8rem)) rotate(90deg);
        left: 40%;
        font-size: 28px;
        font-weight: 800;
    }
    input {
        width: 80px;
        height: 55px;
        cursor: pointer;
        border-radius: 3px;
        font: normal 18px Manrope-Regular, sans-serif;
        margin-left: 0.5rem;
        border: solid 0.5px #bcbcbc !important;
        text-align: center;
    }
  }
}
</style>
