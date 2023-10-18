<template>
  <modal class="rsvp-information-model">
    <template slot="header">
      <div class="maryoku-modal-header">
        <img :src="`${$iconURL}RSVP/Group+8217.svg`" />
        <span class="font-size-30 font-bold-extra">JUST A QUICK FILL OUT & WE’RE DONE!</span>
      </div>
      <md-button class="md-simple md-just-icon md-round modal-default-button" @click="close">
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <div class="d-flex user-info">
        <div class="text-left flex-1 input-wrapper">
          <label class="font-bold">Name</label>
          <maryoku-input v-model="name" inputStyle="username" placeholder="Type your name here..."></maryoku-input>
        </div>
        <div class="text-left flex-1 input-wrapper">
          <label class="font-bold">Email</label>
          <maryoku-input v-model="email" inputStyle="email" placeholder="Type email address here..."></maryoku-input>
        </div>
      </div>
      <div class="d-flex user-info" v-if="isCustomerEvent">
        <div class="text-left flex-1 input-wrapper">
          <label class="font-bold">Role</label>
          <maryoku-input v-model="role" placeholder="Type your role here..."></maryoku-input>
        </div>
        <div class="text-left flex-1 input-wrapper">
          <label class="font-bold">Company Name</label>
          <maryoku-input v-model="companyName" placeholder="Type company name here..."></maryoku-input>
        </div>
      </div>
      <div class="information-section">
        <food-limitation-set @change="setMyFoodLimitation"></food-limitation-set>
      </div>
      <div class="information-section">
        <div class="mb-20">
          <img :src="`${$iconURL}RSVP/Path+1383.svg`" class="mr-10" />
          <span class="font-bold font-size-20">Will anyone join you for the event?</span>
        </div>
        <div class="guestNumber">
          <md-button class="handle-btn md-icon-button md-simple" @click="decreaseGuest">
            <img :src="`${$iconURL}RSVP/Path+3734.svg`" />
          </md-button>
          <input type="text" class="guestNumber-input" v-model="guestNumber" readonly />
          <md-button class="handle-btn md-icon-button md-simple" @click="increaseGeust">
            <img :src="`${$iconURL}RSVP/Group+7913.svg`" />
          </md-button>
        </div>
      </div>
      <div class="information-section" v-for="(guest, index) in joinedGuests" :key="index">
        <div class="width-50">
          <label class="font-bold mb-10" style="display: inline-block">Name of Guest 0{{ index + 1 }}</label>
          <maryoku-input v-model="guest.name" class="mb-20" placeholder="Just Me"></maryoku-input>
        </div>
        <food-limitation-set :type="2" @change="setGuestFoodLimitation(index, ...arguments)"></food-limitation-set>
      </div>
    </template>
    <template slot="footer" v-if="step == 1">
      <div class="text-center w-100">
        <md-button class="md-red md-bold" @click="setRsvp">RSVP Now</md-button>
      </div>
    </template>
  </modal>
</template>
<script>
import CalendarEvent from "@/models/CalendarEvent";
import { Modal, MaryokuInput } from "@/components";
import FoodLimitationSet from "./FoodLimitationSet";
export default {
  components: {
    Modal,
    MaryokuInput,
    FoodLimitationSet,
  },
  props: {
    event: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      textarea: "",
      selected: false,
      name: "",
      email: "",
      role: "",
      companyName: "",
      step: 1,
      foodLimitaion: null,
      suggestedProposals: [
        {
          content: "",
        },
      ],
      guestNumber: "Just Me",
      joinedGuests: [],
    };
  },
  methods: {
    cancel() {
      this.$emit("close");
    },
    close() {
      this.$emit("close");
    },
    increaseGeust() {
      if (this.guestNumber === "Just Me") {
        this.guestNumber = 0;
      }
      this.guestNumber = Number(this.guestNumber) + 1;
      this.joinedGuests.push({});
    },
    decreaseGuest() {
      if (this.guestNumber > 0) {
        this.guestNumber = Number(this.guestNumber) - 1;
        this.joinedGuests.pop();
        if (this.guestNumber === 0) {
          this.guestNumber = "Just Me";
        }
      }
    },
    setRsvp() {
      const guests = [
        {
          name: this.name,
          email: this.email,
          isMainGuest: true,
          ...this.foodLimitaion,
          event: new CalendarEvent({ id: this.event.id }),
        },
      ];
      this.joinedGuests.forEach((guest) => {
        guest.event = new CalendarEvent({ id: this.event.id });
        guests.push(guest);
      });
      this.$root.$emit("setRsvp", {
        guests,
        name: this.name,
        responseEmail: this.email,
        role: this.role,
        companyName: this.companyName,
      });
    },
    setMyFoodLimitation(foodLimitation) {
      this.foodLimitaion = foodLimitation;
      console.log(foodLimitation);
    },
    setGuestFoodLimitation(index, foodLimitation) {
      this.joinedGuests[index] = { ...this.joinedGuests[index], ...foodLimitation };
      console.log(index);
      console.log(foodLimitation);
    },
  },
  computed: {
    isCustomerEvent() {
      return this.event.guestType === "Customers" || this.event.guestType === "Business Associates";
    },
  },
};
</script>
<style lang="scss" scoped>
.rsvp-information-model {
  .user-info {
    padding: 0px 0 50px;
    .input-wrapper {
      width: 50%;
      &:first-child {
        padding-right: 35px;
      }
    }
  }
  .information-section {
    border-top: solid 2px #dbdbdb;
    padding: 30px 0;
    text-align: left;
    .guestNumber {
      display: flex;
      align-items: center;
      margin-top: 10px;
      .handle-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      &-input {
        height: 80px;
        text-align: center;
        border-radius: 3px;
        border: solid 1px #707070;
        font-size: 20px;
        font-family: "Manrope-Regular";
        max-width: 180px;
      }
    }
  }
}
</style>