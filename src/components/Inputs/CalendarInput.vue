<template>
  <div class="maryoku_input" ref="root">
    <input
      v-model="content"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :class="inputClass"
      :readonly="readonly"
      :disabled="disabled"
      @click="onClickEvent"
      @input="handleInput"

    />
    <div ref="datePicker" v-if="showDatePicker">
      <div class="date-picker picker-panel text-center p-10" ref="timePickerPanel" style="z-index: 200 !important" v-click-outside="closeDatePicker">
        <md-checkbox class="ml-auto md-vendor" v-model="multipleDates">More than one day event</md-checkbox>
        <div class="d-flex justify-content-center align-center p-10">
          <img v-if="getFormattedDate" :src="`${$iconURL}Event Page/calendar-dark.svg`" width="23px" />
          <span class="ml-5">{{ getFormattedDate }}</span>
        </div>
        <div class="vendor-calendar mt-20">
          <calendar
                  :multiple="multipleDates"
                  :initDate="dateData"
                  @select="setDate"
          ></calendar>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Popup from "@/components/Popup";
import { FunctionalCalendar } from "vue-functional-calendar";
import Calendar from "../Calendar";
import moment from "moment";
import ClickOutside from "vue-click-outside";

export default {
  name: "maryoku-input",
  components: {
    Popup,
    FunctionalCalendar,
    Calendar,
    ClickOutside,
  },
  props: {
    value: [String, Array],
    name: String,
    type: String,
    placeholder: String,
    inputStyle: String,
    readonly: Boolean,
    size: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "red",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputClass: `${this.inputStyle} ${this.size}`,
      showDatePicker: false,
      multipleDates: this.multiple,
      dateData: {
        currentDate: null,
        dateRange: {
          start: { date: false, dateTime: false, hour: "00", mintue: "00" },
          end: { date: false, dateTime: false, hour: "00", mintue: "00" },
        },
        selectedDate: moment().format('YYYY-MM-DD'),
        selectedDatesItem: "",
        selectedHour: "00",
        selectedMinute: "00",
        selectedDates: [],
      },
    };
  },
  created(){
    this.init()
  },
  methods: {
    init(){
      if (!this.value[0] || !this.value[1]) return;

      let startDate = moment(this.value[0]).format('YYYY-MM-DD');
      let endDate = moment(this.value[1]).format('YYYY-MM-DD');

      console.log('calendarInput.init', this.value, startDate, endDate);

      if (startDate === endDate) {
        this.dateData.currentDate = new Date(startDate);
        this.dateData.selectedDate = startDate

      } else {
        this.dateData.dateRange = {
            start: {
              date: startDate
            },
            end: {
              date: endDate
            }
        }

        this.multipleDates = true;
      }

    },
    closeDatePicker(){this.showDatePicker = false},
    handleInput(e) {
      this.dateData = e;
      this.$emit("change", this.content);
    },
    onClickEvent() {
      this.showDatePicker = true;
    },
    setDate(e) {
      this.dateData = e;
      // this.showDatePicker = false;
      setTimeout(_ => {
        this.$emit("input", {multiple: this.multipleDates, date: e});
      }, 10)

    },
  },
  computed: {
    getFormattedDate() {
      if (!this.dateData.selectedDate) return "";
      return this.multipleDates ? `${moment(new Date(this.dateData.dateRange.start.date)).format("MMM DD, YYYY")} ~ ${moment(new Date(this.dateData.dateRange.end.date)).format("MMM DD, YYYY")}` :
          moment(new Date(this.dateData.selectedDate)).format("dddd, MMM DD, YYYY");
    },
    content() {
      if (!this.dateData) return "";
      return this.multipleDates ? [moment(new Date(this.dateData.dateRange.start.date)).format("DD.MM.YYYY"), moment(new Date(this.dateData.dateRange.end.date)).format("DD.MM.YYYY")] :
          moment(new Date(this.dateData.selectedDate)).format("DD.MM.YYYY");
    }
  },
  watch: {
    inputStyle(newVal) {this.inputClass = `${newVal} ${this.size}`},
    content(){},
  },

};
</script>
<style lang="scss">
.input-default {
  border: none;
  padding: 15px;
  width: 100%;
  border-bottom: 1px solid #e4e4e4;
}
</style>
