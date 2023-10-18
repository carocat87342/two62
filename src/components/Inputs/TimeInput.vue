<template>
  <div class="time-select-fields">
    <!-- <input type="time" v-model="time" class="without_ampm" @change="updateTime" /> -->
    <div class="time-wrapper" :class="size">
      <input type="number" v-model="timeObject.hh" maxlength="2" />
      :
      <input type="number" v-model="timeObject.mm" maxlength="2" />
    </div>
    <drop-down class="ampm">
      <md-button slot="title" class="md-button edit-btn md-simple" data-toggle="dropdown">
        <span :class="size == 'normal' ? 'font-size-16 font-regular' : 'font-size-30 '">{{ timeObject.ampm }}</span>
      </md-button>
      <ul class="dropdown-menu dropdown-menu-left">
        <li @click="timeObject.ampm = 'AM'">
          <a class="font-size-22">AM</a>
        </li>
        <li @click="timeObject.ampm = 'PM'">
          <a class="font-size-22">PM</a>
        </li>
      </ul>
      <span class="arrow-button" data-toggle="dropdown"></span>
    </drop-down>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "time-input",
  props: {
    /**
     * Data binding
     * @model
     */
    value: {
      type: [String, Date, Number],
      default: "00:00 AM",
    },
    size: {
      type: String,
      default: "large",
    },
  },
  created() {
    if (typeof this.value === "string" && !this.isNumeric(this.value)) {
      this.timeObject.ampm = this.value.split(" ")[1] ? this.value.split(" ")[1].trim() : "AM";
      const time = this.value.split(" ")[0];
      this.timeObject.hh = time.split(":")[0] ? time.split(":")[0].trim() : "00";
      this.timeObject.mm = time.split(":")[1] ? time.split(":")[1].trim() : "00";
    } else if (typeof this.value === "number" || this.isNumeric(this.value)) {
      const date = new Date(Number(this.value));
      this.timeObject.ampm = moment(date).format("A");
      this.timeObject.mm = moment(date).format("mm");
      this.timeObject.hh = moment(date).format("hh");
      this.date = moment(date).format("DD/MM/YY");
    }
  },
  methods: {
    updateTime(e) {
      let hours = Number(e.target.value.split(":")[0]);
      let mins = Number(e.target.value.split(":")[1]);
      const time = new Date(this.value);
      time.setHours(hours);
      time.setMinutes(mins);
      // this.time = moment(new Date(this.value)).format("hh:mm")
      this.$emit("input", time.toString());
    },
    isNumeric(str) {
      if (typeof str != "string") return false; // we only process strings!
      return (
        !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str))
      ); // ...and ensure strings of whitespace fail
    },
  },
  data() {
    return {
      timeObject: {
        hh: "00",
        mm: "00",
        ampm: new Date(this.value).getHours() >= 12 ? "PM" : "AM",
      },
      date: "",
    };
  },
  watch: {
    timeObject: {
      handler(newValue) {
        if (typeof this.value === "string" && !this.isNumeric(this.value)) {
          this.$emit("input", `${newValue.hh}:${newValue.mm} ${newValue.ampm}`);
        } else if (typeof this.value === "number" || this.isNumeric(this.value)) {
          const timeStamp = moment(
            `${this.date} ${newValue.hh}:${newValue.mm} ${newValue.ampm}`,
            "DD/MM/YY hh:mm A",
          ).valueOf();
          this.$emit("input", timeStamp);
        }
      },
      deep: true,
    },
  },
};
</script>
<style scoped lang="scss">
.time-select-fields {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: max-content;
  position: relative;
  .arrow-button {
    content: "";
    border-top: solid 3px #969696;
    border-left: solid 3px #969696;
    width: 13px;
    height: 13px;
    border-radius: 1px;
    -webkit-transform: rotate(-135deg);
    transform: rotate(-135deg);
    position: absolute;
    bottom: -13px;
    right: 40px;
  }
  .time-wrapper {
    border-radius: 3px;
    border: solid 1px #bcbcbc;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    font-weight: bold;
    font-family: "Manrope-Regular", sans-serif;
    color: #050505;
    input {
      width: 30px;
      border: none;
      box-shadow: none;
      margin: 16px 12px 16px 16px;
      padding: 0px;
      text-align: center;
      min-height: 1em;
      height: 1em;
    }
    &.normal {
      font-size: 16px;
      font-weight: normal;
      font-family: "Manrope-Regular", sans-serif;
      color: #050505;
      input,
      select {
        font-size: 16px;
        min-width: 30px;
      }
    }
  }
  .ampm {
    text-align: center;
    width: 90px;
    border-radius: 3px;
    border: solid 1px #bcbcbc;
    -webkit-appearance: none;
    -moz-appearance: none;
    -o-appearance: none;
    -ms-appearance: none;
    appearance: none;
    padding: 11px 20px;
    margin-left: 5px;
    .dropdown-menu {
      li {
        width: 100%;
      }
    }
  }
  input,
  select {
    background: #ffffff;
    padding: 0 12px;
    font-size: 14px;
    min-width: 55px;
    text-align: center;
    color: #050505;
    font-size: 30px;
    line-height: 1em;
  }
  select {
    margin-left: 13px;
    width: 35%;
  }
  span {
    display: inline-block;
    font-size: 18px;
    text-transform: uppercase;
    color: #050505;
  }
  .dropdown-menu {
    min-width: 100%;
  }
}
</style>