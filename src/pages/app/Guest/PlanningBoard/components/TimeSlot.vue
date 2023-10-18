<template>
  <div class="time-slot d-flex">
    <div class="">
      <p class="mb-5 text-left font-bold">
        <img :src="`${$iconURL}Vendor Signup/Asset 522.svg`" class="mr-10" width="23" />Start At
      </p>
      <div class="event-time d-flex align-center mt-10">
        <vue-timepicker
          manual-input
          input-class="time-class red"
          class="time-class red"
          hide-dropdown
          format="hh:mm"
          v-model="startTime"
          hide-clear-button
          @open="openDropDown"
          @change="updateTime"
        />
        <div class="am-field" @click="updateStartA()">
          <input type="text" v-model="amPack.start" readonly />
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="">
      <p class="mb-5 text-left font-bold">
        <img class="mr-10" :src="`${$iconURL}Vendor Signup/Asset 522.svg`" width="23" />Finish At
      </p>
      <div class="event-time d-flex align-center mt-10">
        <vue-timepicker
          manual-input
          input-class="time-class red"
          class="time-class red"
          hide-dropdown
          format="hh:mm"
          v-model="endTime"
          hide-clear-button
          @open="openDropDown"
          @change="updateTime"
        />
        <div class="am-field" @click="updateEndA()">
          <input type="text" v-model="amPack.end" readonly />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";

export default {
  components: {
    VueTimepicker,
  },
  data() {
    return {
      startTime: {
        hh: "12",
        mm: "00",
      },
      endTime: {
        hh: "12",
        mm: "00",
      },
      amPack: {
        start: "AM",
        end: "AM",
      },
    };
  },
  methods: {
    updateStartA() {
      if (this.amPack.start == "AM") {
        this.amPack.start = "PM";
      } else {
        this.amPack.start = "AM";
      }
      this.updateTime();
    },
    updateEndA() {
      if (this.amPack.end == "AM") {
        this.amPack.end = "PM";
      } else {
        this.amPack.end = "AM";
      }
      this.updateTime();
    },
    updateTime() {
      const time = {
        startTime: { time: this.startTime, ampm: this.amPack.start },
        endTime: { time: this.endTime, ampm: this.amPack.end },
      };
      this.$emit("change", time);
    },
    openDropDown() {
      // moving of timepicker overflay for closing
      var modalWrapper = document.getElementsByClassName("modal-wrapper")[0];
      if (modalWrapper) {
        setTimeout(() => {
          const timePicker = document.querySelector(".time-picker-overlay");
          timePicker.style.top = `${modalWrapper.scrollTop}px`;
          timePicker.style.height = "100vh";
        }, 500);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.time-slot {
  /deep/ .time-class {
    text-align: center !important;
  }
  .am-field {
    margin-left: 10px;
    position: relative;
    input {
      width: 70px;
      height: 50px;
    }
    &::after {
      content: ">";
      position: absolute;
      transform: translateX(-50%) translateY(calc(100% + 1.2rem)) rotate(90deg);
      left: 50%;
      font-size: 20px;
      font-weight: 800;
    }
  }
  .line {
    width: 100px;
    position: relative;
    &:before {
      content: "";
      width: 40%;
      left: 30%;
      bottom: 30px;
      border-bottom: solid 1px #707070;
      position: absolute;
    }
  }
}
</style>