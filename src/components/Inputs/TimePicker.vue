<template>
  <div class="time-picker-component">
    <vue-timepicker
      manual-input
      input-class="time-class"
      hide-dropdown
      format="hh:mm"
      v-model="startTime"
      hide-clear-button
      @change="changeTime"
    />
    <div class="am-field" @click="updateStartA()">
      <input type="text" v-model="ampm" readonly />
    </div>
  </div>
</template>
<script>
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
export default {
  components: {
    VueTimepicker,
  },
  props: {
    value: {
      type: String,
      default: "00:00 AM",
    },
  },
  data() {
    return {
      ampm: "AM",
      startTime: {
        hh: "12",
        mm: "00",
      },
    };
  },
  methods: {
    updateStartA() {
      if (this.ampm == "AM") {
        this.ampm = "PM";
      } else {
        this.ampm = "AM";
      }
      this.$emit("input", `${this.startTime.hh}:${this.startTime.mm} ${this.ampm}`);
      this.$emit("change", `${this.startTime.hh}:${this.startTime.mm} ${this.ampm}`);
    },
    changeTime(event) {
      this.startTime.hh = event.data.hh;
      this.startTime.mm = event.data.mm;
      this.$emit("input", `${this.startTime.hh}:${this.startTime.mm} ${this.ampm}`);
      this.$emit("change", `${this.startTime.hh}:${this.startTime.mm} ${this.ampm}`);
    },
  },
};
</script>
<style lang="scss" scoped>
.time-picker-component {
  display: flex;
  /deep/ .time-picker {
    margin-right: 5px;
    width: 60%;
    input {
      text-align: center;
      width: 100%;
      border-radius: 3px;
      font: normal 18px Manrope-Regular, sans-serif;
      border: 1px solid #707070;
      height: 55px;
      color: #050505;
    }
  }
  .am-field {
    position: relative;
    width: 33%;
    &::before {
      position: absolute;
      content: ">";
      -webkit-transform: translateX(50%) translateY(calc(100% + 1.8rem)) rotate(90deg);
      transform: translateX(50%) translateY(calc(100% + 1.8rem)) rotate(90deg);
      left: 30%;
      font-size: 30px;
      font-weight: 800;
      color: #a0a0a0;
    }
    input {
      width: 100%;
      height: 55px;
      text-align: center;
      font-size: 18px;
      color: #050505;
    }
  }
}
</style>
