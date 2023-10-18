<template>
  <div class="card-section align-center">
    <input type="hidden" :value="month" />
    <input type="hidden" :value="year" />
    <div class="left">
      <img class="mr-30" :src="section.img_src" />
      <div class="mr-30" style="width: 30%">
        <h3 class="title">{{ section.title }}</h3>

        <p class="content" v-if="section.started_at && section.started_at !== section.ended_at">
          {{ section.started_at | formatDate }} ~ {{ section.ended_at | formatDate }}
        </p>
        <p class="content" v-if="section.started_at && section.started_at === section.ended_at">
          {{ section.started_at | formatDate }}
        </p>

        <div v-if="isEdit && section.warning" class="warning">
          <img class="mr-10" :src="`${iconsUrl}Group 1175 (9).svg`" width="20" />
          {{ section.warning }}
        </div>
      </div>

      <div v-if="isEdit && section.hasOwnProperty('started_at') && section.hasOwnProperty('ended_at')" class="value">
        <div class="picker-panel">
          <functional-calendar
            ref="Calendar"
            :is-date-range="true"
            :change-month-function="true"
            :change-year-function="true"
            :markedDateRange="markedDates"
            @dayClicked="changeDate($event)"
            @changedMonth="changeMonth($event)"
            @changedYear="changeYear($event)"
            v-model="dateData"
          >
          </functional-calendar>
          <md-checkbox v-model="section.more_one_day" value="more_one_day"> More than one day event </md-checkbox>
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
import { FunctionalCalendar } from "vue-functional-calendar";
import moment from "moment";
import { extendMoment } from "moment-range";

export default {
  name: "event-overview-date",
  components: {
    FunctionalCalendar,
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
      markedDates: {
        start: null,
        end: null,
      },
      dateData: {
        currentDate: null,
        dateRange: {
          start: {
            date:  moment(this.section.started_at).format("D/M/YYYY"),
            // date: null,
            dateTime: false,
            hour: "00",
            mintue: "00",
          },
          end: {
            date:  moment(this.section.ended_at).format("D/M/YYYY"),
            // date: null,
            dateTime: false,
            hour: "00",
            mintue: "00",
          },
        },
        selectedDate: null,
        selectedDatesItem: "",
        selectedHour: "00",
        selectedMinute: "00",
        selectedDates: [],
      },
      dateRange: {},
      started_at: null,
      dateClick: false,
      day: null,
      ended_at: null,
      month: moment(Date.now()).month(),
      year: moment(Date.now()).year(),
    };
  },
  methods: {
    changeMonth(e) {
      this.month = moment(e).month();
      this.year = moment(e).year();
      this.markedDates = {start: null, end: null}
    },
    changeYear(e) {
      this.month = moment(e).month();
      this.year = moment(e).year();
    },
    changeDate(e) {
      console.log("changeDate", e, this.dateData);
      this.dateClick = !this.dateClick;

      if (this.dateClick) {
        this.started_at = moment(e.date, "D/M/YYYY").format("YYYY-MM-DD");
        this.day = e.day;
        return;
      }

      if (!this.dateClick) {
        this.ended_at = moment(e.date, "D/M/YYYY").format("YYYY-MM-DD");
        if (this.day > e.day) {
          this.ended_at = this.started_at;
          this.started_at = moment(e.date, "D/M/YYYY").format("YYYY-MM-DD");
        }

        const extendedMoment = extendMoment(moment);
        const start = new Date(this.started_at);
        const end = new Date(this.ended_at);
        const range = extendedMoment.range(moment(start), moment(end));

        const dateList = Array.from(range.by("day")).map((m) => m.format("YYYY-MM-DD"));
        const currentTimelineDates = this.section.timelineDates;
        const newTimelineDates = currentTimelineDates.map((item, index) => {
          if (dateList[index]) item.date = dateList[index];
          return item;
        });

        this.$emit("change", {
          dateData: {
            started_at: this.started_at,
            ended_at: this.ended_at,
          },
          timeline: {
            dateList: dateList,
            mode: "template", // default
            status: "editing",
          },
          timelineDates: newTimelineDates,
        });
      }
    },
    init: function () {
    },
  },
  filters: {
    formatDate: function (date) {
      return moment(date).format("MMMM DD, YYYY");
    },
  },
  mounted() {
    this.init();
  },
  updated() {
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
