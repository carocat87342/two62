<template>
  <ActionModal class="reminder-time-modal" containerClass="modal-container sm" @close="close" @done="setRemind">
    <template slot="header">
        <div class="title font-bold text-center">Set a reminder</div>
    </template>
    <template slot="body">
      <div class="text-left mb-10">
         Want to come back to this later? We’ll send you a reminder so you never miss a deadline.
      </div>
      <div class="text-left">
        <label>Just select the best time for you: </label>
        <div class="text-left">
          <div><md-radio v-model="remindTimeOption" value="today">Later today</md-radio></div>
          <div><md-radio v-model="remindTimeOption" value="tomorrow">Tomorrow</md-radio></div>
          <div><md-radio v-model="remindTimeOption" value="specific">Specific Time</md-radio></div>
        </div>
        <div class="pl-40 time-selector" v-if="remindTimeOption === 'specific'">
          <div class="text-left mb-20 d-flex">
            <div class="width-50">
              <MaryokuInput
                class="form-input mr-10"
                placeholder="Choose date…"
                inputStyle="date"
                v-model="selectedDate"
              ></MaryokuInput>
            </div>
            <TimePicker v-model="selectedTime"></TimePicker>
          </div>
          <WarningMessage class="mb-50" label="This offer is valid for 4 days"></WarningMessage>
        </div>
      </div>
    </template>
    <template slot="footer">
      <md-button class="md-black md-simple" @click="close"> Cancel </md-button>
      <md-button class="md-red md-bold reminder-button" @click="setRemind" :disabled="!canSetReminder">
        Done
      </md-button>
    </template>
  </ActionModal>
</template>
<script>
import moment from "moment";
import { MaryokuInput } from '@/components';

const components = {
    ActionModal: () => import('@/components/ActionModal.vue'),
    // MaryokuInput: () => import('@/components/inputs/MaryokuInput.vue'),
    TimePicker: () => import('@/components/Inputs/TimePicker.vue'),
    WarningMessage: () => import("@/components/WarningMessage.vue"),
}
export default {
  components: {...components, MaryokuInput},
  props: {},
  data() {
    return {
      remindTimeOption: "today",
      selectedDate: "",
      selectedTime: "",
      days: [
        { id: "1", title: "Tomorrow" },
        { id: "2", title: "2 days later" },
        { id: "3", title: "3 days later" },
        { id: "4", title: "4 days later" },
      ],
    };
  },
  created() {},
  methods: {
    cancel() {
      this.$emit("close");
    },
    close() {
      console.log('close');
      this.$emit("close");
    },
    setRemind() {
      // this.$emit("save");
      let remindingTime = 0;
      if (this.remindTimeOption === "tomorrow") {
        remindingTime = moment(new Date()).add(1, "day").valueOf();
      } else if (this.remindTimeOption === "today") {
        remindingTime = moment(new Date()).add(5, 'hours').valueOf();
        let endOfDay = moment().endOf('day').valueOf();
        if (remindingTime > endOfDay) {
          remindingTime = endOfDay;
        }
      } else if (this.remindTimeOption === "specific") {
        remindingTime = moment(`${this.selectedDate} ${this.selectedTime}`, "DD.MM.YYYY hh:mm a").valueOf();
      }
      this.$emit("save", {remindingTime, option: this.remindTimeOption});
    },
  },
  computed: {
    canSetReminder() {
      return this.remindTimeOption;
    },
  },
};
</script>
<style lang="scss" scoped>
.reminder-time-modal {
  .options-list {
    display: flex;
  }
  .time-selector {
    max-width: 500px;
  }
}
@media only screen and (max-width: 959px) {
  .reminder-time-modal {
    .header-text {
      line-height: 1.2em;
      font-size: 24px !important;
      margin-bottom: 30px;
    }
    .maryoku_input {
      width: 100%;
    }
    .options-list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-around;
      margin-top: 20px;
      .option-card {
        margin: 10px 10px;
        width: 100px;
        height: 100px;
        padding: 10px;
        font-size: 14px;
        img {
          width: 20px !important;
        }
      }
    }
    .reminder-button {
      width: 100%;
    }
  }
}
</style>
