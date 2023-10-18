<template>
  <div class="">
    <div class="container">
      <div class="title">
        2/5
        <br />
        How many lucky guests are you expecting?
      </div>
      <div class="event-guests event-basic-info">
        <div class="mt-5">
          <maryoku-input
            class="form-input"
            inputStyle="users"
            v-model="numberOfGuests"
            placeholder="Type number…..."
          ></maryoku-input>
        </div>
      </div>
    </div>
    <wizard-status-bar :currentStep="2" @next="goToNext" @skip="skip" @back="back"></wizard-status-bar>
  </div>
</template>

<script>
import GoBack from "./componenets/GoBack";
import SelectedValue from "./componenets/SelectedValue";
import WizardStatusBar from "./componenets/WizardStatusBar";
import { MaryokuInput } from "@/components";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  components: {
    GoBack,
    WizardStatusBar,
    MaryokuInput,
  },
  created() {},
  methods: {
    ...mapMutations("PublicEventPlanner", ["setEventProperty", "setCurrentStep"]),
    validateDate() {
      return this.$refs.datePicker.$el.classList.contains("md-has-value");
    },
    goToNext() {
      this.setEventProperty({
        key: "numberOfParticipants",
        actualValue: this.numberOfGuests ? this.numberOfGuests : 0,
      });
      this.$router.push({ path: `/event-wizard-guests-type` });
    },
    skip() {
      this.setEventProperty({
        key: "numberOfParticipants",
        actualValue: 0,
      });
      this.$router.push({ path: `/event-wizard-guests-type` });
    },
    back() {
      this.$router.push({ path: `/event-wizard-flexibility` });
    },
  },
  data() {
    return {
      numberOfGuests: null,
    };
  },
  created() {
    if (this.publicEventData.numberOfParticipants) {
      this.numberOfGuests = this.publicEventData.numberOfParticipants;
    }
  },
  computed: {
    ...mapState("PublicEventPlanner", ["publicEventData"]),
  },
};
</script>
<style lang="scss">
.event-guests.event-basic-info {
  width: 450px;
  margin: 0 auto;
  padding: 10px;
  min-height: 200px;
  max-width: 100%;
}
.form-input {
  background: white;
}
</style>
