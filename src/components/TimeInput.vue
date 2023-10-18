<template>
  <div class="time-select-fields">
    <input type="time" v-model="time" class="without_ampm" @change="updateTime" />
    <select v-model="ampm">
      <option value="am">AM</option>
      <option value="pm">PM</option>
    </select>
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
    },
  },
  created() {
    if (typeof this.value === "string") {
      this.ampm = new Date(this.value).getHours() >= 12 ? "pm" : "am";
      this.time = moment(new Date(this.value)).format("HH:mm");
    }
  },
  methods: {
    updateTime(e) {
      console.log(e.target.value);
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
      ampm: new Date(this.value).getHours() >= 12 ? "pm" : "am",
      time: moment(new Date(this.value)).format("HH:mm"),
    };
  },
  watch: {
    value: function () {
      this.ampm = new Date(this.value).getHours() >= 12 ? "pm" : "am";
      this.time = moment(new Date(this.value)).format("HH:mm");
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

  .without_ampm::-webkit-datetime-edit-ampm-field,
  .without_ampm::-moz-datetime-edit-ampm-field {
    display: none;
  }

  input[type="time"] {
    width: 90%;
    font-family: "Manrope-Regular", sans-serif;
    color: #050505;
  }

  input[type="time"]::-webkit-clear-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    -o-appearance: none;
    -ms-appearance: none;
    appearance: none;
    margin: -10px;
  }

  input,
  select {
    min-height: 52px;
    border-radius: 3px;
    border: solid 1px #bcbcbc;
    background: #ffffff;
    padding: 0 12px;
    height: 52px;
    font-size: 14px;
    min-width: 55px;
    text-align: center;
    color: #050505;
  }
  select {
    margin-left: 1em;
  }
  span {
    display: inline-block;
    margin: 0 0.5em;
    font-size: 18px;
    font-family: "Manrope-ExtraBold", sans-serif;
    color: #050505;
  }
}
</style>