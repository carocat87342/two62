<template>
  <div>
    <div class="event-calendar" v-if="!isLoading">
      <div class="calendar__header">
        <a href="javascript:;" class="arrow-btn btn-prevmonth" @click.prevent="changeMonth(false)">Prev</a>
        <div class="calendar__title" @click.prevent="backToToday()">
          <span class="caption-month">{{ convertMonthName }}</span>
          <span class="caption-year">{{ current.year }}</span>
        </div>
        <a href="javascript:;" class="arrow-btn btn-nextmonth" @click.prevent="changeMonth(true)">Next</a>
      </div>
      <div class="calendar__body">
        <ul class="calendar__heading">
          <li v-for="item in heading" @click="clickDate(item)">
            <div class="calendar__item">{{ item }}</div>
          </li>
        </ul>
        <ul class="calendar__content">
          <li v-for="item in buildCalendar" @click="clickDate(item)">
            <popper trigger="hover" :options="{ placement: 'right' }" v-if="eventsForDate[Number(item.number)]">
              <div class="popper-content white-card">
                <div class="font-size-22 popper-header"></div>
                <div>
                  <div v-for="(event, index) in eventsForDate[Number(item.number)]">
                    <div class="color-gray">
                      {{ $dateUtil.formatScheduleDay(event.startTime, "HH:mm") }} -
                      {{ $dateUtil.formatScheduleDay(event.endTime, "HH:mm") }}
                    </div>
                    <div>
                      <template v-if="event.customerName">
                        <span class="font-bold">{{ event.customerName }} </span> |
                      </template>
                      {{ event.companyName }}
                    </div>
                    <hr v-if="index < eventsForDate[Number(item.number)].length - 1" />
                  </div>
                </div>
              </div>
              <a
                href="javascript:;"
                class="calendar__item"
                :class="{
                  'is-today': item.today === true,
                  current: eventsForDate[Number(item.number)],
                  'has-event': eventsForDate[Number(item.number)],
                  'is-blackout': isBlackoutDay(item),
                }"
                @click.prevent="getDateData(item)"
                slot="reference"
              >
                {{ item.number }}
                <div
                  class="event-add-badge"
                  v-if="eventsForDate[Number(item.number)] && eventsForDate[Number(item.number)].length > 1"
                >
                  <span class=""><md-icon>add</md-icon></span>
                </div>
              </a>
            </popper>
            <a
              href="javascript:;"
              class="calendar__item"
              :class="{
                'is-today': item.today === true,
                current: eventsForDate[Number(item.number)],
                'has-event': eventsForDate[Number(item.number)],
                'is-blackout': isBlackoutDay(item),
              }"
              @click.prevent="getDateData(item)"
              slot="reference"
              v-else
            >
              {{ item.number }}
              <div
                class="event-add-badge"
                v-if="eventsForDate[Number(item.number)] && eventsForDate[Number(item.number)].length > 1"
              >
                <span class=""><md-icon>add</md-icon></span>
              </div>
            </a>
            <!-- 
            </popper> -->
          </li>
        </ul>
      </div>
    </div>
    <div class="d-flex align-center">
      <md-switch class="md-switch-vendor large-switch" v-model="showBlackoutDays">
        <span class="color-black font-size-14px">Blackout Days</span>
      </md-switch>
      <md-button class="md-simple ml-auto md-vendor" @click="showSyncModal = true"> Sync With Calendar</md-button>
    </div>
    <sync-calendar-modal
      v-if="showSyncModal"
      :events="eventsForThisMonth"
      @close="showSyncModal = false"
    ></sync-calendar-modal>
  </div>
</template>
<script>
import moment from "moment";
import SyncCalendarModal from "./Modals/SyncCalendar";
import Popper from "vue-popperjs";
import "vue-popperjs/dist/vue-popper.css";

export default {
  components: {
    SyncCalendarModal,
    Popper,
  },
  data() {
    return {
      isLoading: false,
      current: {
        year: 0,
        month: 0,
        date: 0,
      },
      today: {
        year: 0,
        month: 0,
        date: 0,
      },
      heading: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      showBlackoutDays: false,
      showSyncModal: false,
    };
  },
  methods: {
    isBlackoutDay(item) {
      return (
        this.showBlackoutDays &&
        this.blackoutDays[`${item.years}-${this.$stringUtil.getTwoDigits(item.month)}-${item.number}`]
      );
    },
    changeMonth(isNext) {
      let month = this.current.month;
      isNext === true ? (month = month + 1) : (month = month - 1);
      if (month <= 0) {
        month = 12;
        this.current.year = this.current.year - 1;
      }
      if (month > 12) {
        month = 1;
        this.current.year = this.current.year + 1;
      }
      this.current.month = month;
      this.current.date = 1;
      this.getEventsForThisMonth();
    },
    getDateData(data) {
      if (data.none === true) {
        return false;
      } else {
        if (data.years === this.current.year && data.month === this.current.month && data.date === this.current.date) {
          return false;
        } else {
          this.current.year = data.years;
          this.current.month = data.month;
          this.current.date = data.date;
        }
      }
    },
    backToToday() {
      this.current.year = this.today.year;
      this.current.month = this.today.month;
      this.current.date = this.today.date;
    },
    getToday() {
      this.today.year = moment().year();
      this.today.month = moment().month() + 1;
      this.today.date = moment().date();
    },
    getEventsForThisMonth() {
      return this.$store.dispatch("vendorDashboard/getCalendarEvents", this.currentMonth);
    },
    getEventsForDate(date) {
      const events = this.eventsForThisMonth.filter((event) => {
        return new Date(event.startTime).getDate() === Number(date);
      });
      return events;
    },
    clickDate(day) {
      console.log('clickDate', day, this.eventsForDate[Number(day.number)])
      if (this.eventsForDate[Number(day.number)].length) {
        this.$emit("clickDate", {event: this.eventsForDate[Number(day.number)][0]});
      } else {
        this.$emit("clickDate", {date: day} );
      }
    },
  },
  computed: {
    currentMonth() {
      return `${this.current.year}-${this.convertTwoDigits}`;
    },
    eventsForThisMonth() {
      return this.$store.state.vendorDashboard.calendarEvents[this.currentMonth] || [];
    },
    eventsForDate() {
      const events = {};
      this.eventsForThisMonth.forEach((event) => {
        const date = new Date(event.startTime).getDate();
        if (!events[date]) events[date] = [];
        events[date].push(event);
      });
      return events;
    },
    buildCalendar() {
      let myYears = this.current.year;
      let myMonth = this.current.month;
      let myDate = this.current.date;

      let monthText = "";
      myMonth < 10 ? (monthText = `0${myMonth}`) : (monthText = myMonth.toString());

      let dateArray = [];
      let patchNum = 0;
      let totalDate = moment(`${myYears}-${monthText}`).daysInMonth();
      let week = moment(`${myYears}-${monthText}`).format("d");

      for (let i = 0; i < totalDate; i++) {
        let dateNum = i + 1;
        let isToday = false;
        let isCurrent = false;
        let dateText = "";

        if (myYears === this.today.year && myMonth === this.today.month && dateNum === this.today.date) {
          isToday = true;
        }

        if (dateNum === myDate) {
          isCurrent = true;
        }

        dateNum < 10 ? (dateText = `0${dateNum}`) : (dateText = dateNum.toString());

        let obj = {
          years: myYears,
          month: myMonth,
          date: dateNum,
          number: dateText,
          today: isToday,
          current: isCurrent,
        };
        dateArray.push(obj);
      }

      //
      for (let i = 0; i < week; i++) {
        let obj = {
          number: "",
          none: true,
        };
        dateArray.splice(i, 0, obj);
      }

      //
      dateArray.length % 7 === 0 ? (patchNum = 0) : (patchNum = 7 - (dateArray.length % 7));

      for (let i = 0; i < patchNum; i++) {
        let obj = {
          number: "",
          none: true,
        };
        dateArray.splice(dateArray.length, 0, obj);
      }
      return dateArray;
    },
    convertTwoDigits() {
      let text = "";
      this.current.month < 10 ? (text = `0${this.current.month}`) : (text = this.current.month);
      return text;
    },
    convertMonthName() {
      return moment(this.convertTwoDigits, "MM").format("MMMM");
    },
    profile() {
      console.log(this.$store.state.vendor);
      return this.$store.state.vendor.profile;
    },
    blackoutDays() {
      const data = {};
      if (this.profile && this.profile.exDonts) {
        for (const d of this.profile.exDonts) {
          data[d.date] = d;
        }
      }
      return data;
    },
  },

  created() {
    this.getToday();
    this.backToToday();
    this.isLoading = true;
    this.getEventsForThisMonth().then(() => {
      this.isLoading = false;
    });
    this.$root.$on("addNewEvent", (newEvent) => {
      this.getEventsForThisMonth();
    });
  },
  beforeMount() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
$color-black: #641856;
$color-white: #ffffff;
$color-gray: #f2f2f2;
$color-gray-default: #e5e5e5;
$color-gray-dark: #929292;
.event-calendar {
  ul {
    list-style: none;
  }

  a {
    text-decoration: none;
  }

  p {
    margin-bottom: 1em;
  }

  h1 {
    font-size: 2rem;
    font-weight: bold;
    line-height: 1.2em;
    margin: 1rem 0px;
    color: $color-white;
    text-align: center;
  }

  /* Wrap */
  .wrap {
    width: calc(100% - 20px);
    max-width: 420px;
    margin: auto;
  }

  /* Calendar */
  .calendar {
    margin: 1rem 0px;
    overflow: hidden;
    border-radius: 7px;
  }

  .calendar__body {
    border-bottom: solid 1px #d5d5d5;
  }
  .calendar__heading,
  .calendar__content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    > li {
      width: 14.285%;
      text-align: center;
      min-height: 50px;
    }
  }

  .calendar__item {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 10px 0px;
    border-radius: 3px;
    transition: all 0.3s;
    color: $color-black;
    display: inline-block;
    border-radius: 50%;
    width: 46.3px;
    height: 46.3px;
    margin: 5px;
    &.current {
      background-color: #d5d5d5;
      font-weight: bold;
    }
    &.is-today {
      font-weight: bold;
      font-family: "Manrope-ExtraBold";
      background-color: rgba(100, 24, 86, 0.25);
    }
    &.is-blackout {
      background-color: $color-black;
      color: $color-white;
    }
    &.has-event {
      width: 46.3px;
      height: 46.3px;
      box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.42);
      background-color: #ffffff;
      border-radius: 50%;
      position: relative;
      font-weight: bolder;
      font-weight: bold;
      .event-add-badge {
        width: 22px;
        height: 22px;
        background-color: #641856;
        border-radius: 50%;
        color: white;
        font-size: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1em;
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(30%, -30%);
        padding: 5px;
        i {
          color: white !important;
          font-size: 1rem !important;
        }
      }
    }
  }

  .calendar__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 50px;
    // background-color: $color-gray-default;
    .arrow-btn {
      display: flex;
      font-size: 0rem;
      &::before {
        content: "";
        display: block;
        width: 0;
        height: 0;
        border-style: solid;
      }
      &.btn-prevmonth::before {
        border-width: 4px 0 0 4px;
        width: 15px;
        height: 15px;
        border-color: $color-black;
        border-radius: 3px;
        transform: rotate(-45deg) translateY(50%);
      }
      &.btn-nextmonth::before {
        border-width: 4px 4px 0 0;
        width: 15px;
        height: 15px;
        border-color: $color-black;
        border-radius: 3px;
        transform: rotate(45deg) translateY(50%);
      }
    }
  }

  .calendar__title {
    text-align: center;
    font-size: 1.3rem;
    cursor: pointer;
    font-weight: bold;
  }

  .calendar__heading {
    padding: 0px 5px;
    // background-color: $color-gray;
    border-bottom: solid 1px #d5d5d5;
    .calendar__item {
      color: $color-black;
    }
  }

  .calendar__content {
    padding: 5px;
    position: relative;
    background-color: $color-white;
    .calendar__item {
      font-size: 16px;
      cursor: pointer;
    }
  }

  /* Todolist */
  .todolist {
    margin: 1rem 0px;
    overflow: hidden;
    border-radius: 7px;
    background-color: $color-white;
  }

  .todolist__header {
    font-size: 1.5rem;
    padding: 10px 15px;
  }

  /* Animation */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .popper-content {
    min-width: 250px;
    padding: 20px;
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.26);
    text-align: left;
    z-index: 20;
    border-radius: 5px;
  }
}
</style>