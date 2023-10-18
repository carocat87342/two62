<template>
  <modal class="rsvp-modal setting-reminder-modal">
    <template slot="header">
      <!-- <div class="max-resolution: modal;header" v-if="screen == 2">
        <md-button class="md-simple md-black normal-btn" @click="screen = screen - 1">
          <img class="mr-10" :src="`${$iconURL}RSVP/Group+3593.svg`" />
          Back
        </md-button>
      </div> -->
      <div class="maryoku-modal-header" v-if="screen == 3">
        <md-button class="md-simple md-black normal-btn" @click="screen = screen - 1">
          <img class="mr-10" :src="`${$iconURL}RSVP/Group+3593.svg`" />
          Change my mind
        </md-button>
      </div>
      <md-button class="md-simple md-just-icon md-round modal-default-button" @click="close">
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <div v-if="screen == 2" class="text-left">
        <div class="font-size-30 font-bold mb-50 mt-30 header-text">TAKE YOUR TIME, WE’LL REMIND YOU LATER</div>
        <div class="text-left">
          <div><md-radio v-model="remindTool" value="sms">Remind me by Sms</md-radio></div>
          <maryoku-input
            placeholder="Type phone number here..."
            class="mb-20 width-50"
            inputStyle="phone"
            type="text"
            v-model="remindingPhone"
            key="phone-input"
            v-if="remindTool == 'sms'"
          ></maryoku-input>
          <div><md-radio v-model="remindTool" value="email">Remind me by email</md-radio></div>
          <maryoku-input
            placeholder="Type email address here..."
            class="mb-20 width-50"
            inputStyle="email"
            type="email"
            v-model="remindingEmail"
            v-if="remindTool == 'email'"
            key="email-input"
          ></maryoku-input>
        </div>

        <div class="text-left d-flex">
          <img class="mr-30" :src="`${$iconURL}RSVP/ring.svg`" />
          <div class="font-size-20 font-bold time-question">When Do You Want Your Reminder?</div>
        </div>
        <div class="options-list">
          <option-card
            icon="Group+4311.svg"
            label="Remind Me Tonight"
            :selected="remindTime == 'tonight'"
            @select="remindTime = 'tonight'"
          ></option-card>
          <option-card
            icon="Group+8441.svg"
            label="Remind Me Tomorrow"
            :selected="remindTime == 'tomorrow'"
            @select="remindTime = 'tomorrow'"
          ></option-card>
          <option-card
            icon="Group+4458.svg"
            label="Remind Me In A Week"
            :selected="remindTime == 'week'"
            @select="remindTime = 'week'"
          ></option-card>
        </div>
      </div>
      <div v-if="screen == 3">
        <img :src="`${$iconURL}RSVP/Group 8005.svg`" class="mt-20" />
        <div class="font-size-30 mb-30 mt-30 font-bold" style="line-height: 1.5em">
          WE WILL SEND YOU A REMINDER {{ remindTime === "week" ? "WITHIN A WEEK" : remindTime.toUpperCase() }}
        </div>
        <div class>{{ remindTool === "email" ? `By email` : `By SMS` }}</div>
      </div>
    </template>
    <template slot="footer">
      <md-button
        v-if="screen == 2"
        class="md-red md-bold reminder-button"
        @click="setRemind"
        :disabled="!canSetReminder"
      >
        Set A Reminder
      </md-button>
    </template>
  </modal>
</template>
<script>
import { Modal, MaryokuInput } from "@/components";
import OptionCard from "./OptionCard";
import moment from "moment";
import Reminder from "@/models/Reminder";
export default {
  components: {
    Modal,
    MaryokuInput,
    OptionCard,
  },
  props: {
    rsvpRequest: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      screen: 2,
      remindingEmail: "",
      remindingPhone: "",
      remindTool: "email",
      remindTime: "tomorrow",
    };
  },
  created() {
    this.remindingEmail = this.rsvpRequest.email;
  },
  methods: {
    cancel() {
      this.$emit("close");
    },
    close() {
      this.$emit("close");
    },
    setRemind() {
      let remindingTime = 0;
      if (this.remindTime === "week") {
        remindingTime = moment(new Date()).add(1, "week").valueOf();
      } else if (this.remindTime === "tomorrow") {
        remindingTime = moment(new Date()).add(1, "day").valueOf();
      } else if (this.remindTime === "tonight") {
        remindingTime = moment(new Date()).hours(21).valueOf();
        if (remindingTime < new Date().getTime()) {
          remindingTime = moment(new Date()).add(1, "hour").valueOf();
        }
      }
      const remindingData = {
        reminder: this.remindTool,
        phoneNumber: this.remindingPhone,
        email: this.remindingEmail,
        remindingTime: remindingTime,
        type: "rsvp",
        emailParams: {
          guestName: this.remindingEmail,
          eventDate: this.$dateUtil.formatScheduleDay(this.rsvpRequest.event.eventStartMillis, "MMM DD, YYYY"),
          plannerName: this.rsvpRequest.event.owner.display,
        },
        emailTransactionId: this.rsvpRequest.emailTransactionId,
        phoneTransactionId: this.rsvpRequest.phoneTransactionId,
      };
      new Reminder(remindingData).save().then((res) => {
        this.$emit("setRemind", res);
        this.screen = 3;
      });
    },
  },
  computed: {
    canSetReminder() {
      return (this.remindTool === "email" && this.remindingEmail) || (this.remindTool === "sms" && this.remindingPhone);
    },
  },
};
</script>
<style lang="scss" scoped>
.setting-reminder-modal {
  .options-list {
    display: flex;
  }
}
@media only screen and (max-width: 959px) {
  .setting-reminder-modal {
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