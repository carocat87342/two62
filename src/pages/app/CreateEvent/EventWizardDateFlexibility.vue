<template>
  <div class="">
    <div class="container">
      <div class="title">1/5</div>
      <selected-value :value="formattedDate" property="calendar"></selected-value>
      <div class="event-flexibility event-basic-info">
          <div class="mt-4rem setting-title">Between a camel yoga pose and plywood</div>
          <div class="mt-1 font-size-20">
              How flexible is this date?
          </div>
        <div class="mt-4rem slider-wrapper">
          <img :src="`${$iconURL}Onboarding/block-red.svg`" />
          <range-slider class="slider" min="0" max="10" step="1" v-model="flexibility"> </range-slider>
          <img :src="`${$iconURL}Onboarding/excersie-red.svg`" />
        </div>
      </div>
    </div>
    <wizard-status-bar :currentStep="1" @next="goToNext" @skip="skip" @back="back"></wizard-status-bar>
  </div>
</template>

<script>
import SelectedValue from "./componenets/SelectedValue";
import WizardStatusBar from "./componenets/WizardStatusBar";
import RangeSlider from "vue-range-slider";
import "vue-range-slider/dist/vue-range-slider.css";
import moment from "moment";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  components: {
    SelectedValue,
    WizardStatusBar,
    RangeSlider,
  },
  created() {},
  methods: {
    ...mapMutations("PublicEventPlanner", ["setEventProperty", "setCurrentStep"]),
    goToNext() {
      this.setEventProperty({ key: "flexibleWithDates", actualValue: this.flexibility });
      this.$router.push({ path: `/event-wizard-guests` });
    },
    skip() {
      this.$router.push({ path: `/event-wizard-guests` });
    },
    back() {
      this.$router.push({ path: `/event-wizard-day` });
    },
  },
  data() {
    return {
      flexibility: 5,
    };
  },
  created() {
    if (this.publicEventData.flexibleWithDates) {
      this.flexibility = this.publicEventData.flexibleWithDates;
    }
  },
  computed: {
    ...mapState("PublicEventPlanner", ["publicEventData"]),
    formattedDate() {
      if (!this.publicEventData.eventStartMillis) {
        return "Not Sure";
      } else if (this.publicEventData.eventStartMillis !== this.publicEventData.eventEndMillis) {
        return `${moment(new Date(this.publicEventData.eventStartMillis)).format("MM.DD.YY")} ~ ${moment(
          new Date(this.publicEventData.eventEndMillis),
        ).format("MM.DD.YY")}`;
      } else if (this.publicEventData.eventStartMillis === this.publicEventData.eventEndMillis) {
        return `${moment(new Date(this.publicEventData.eventStartMillis)).format("MM.DD.YY")}`;
      }
    },
  },
};
</script>
<style lang="scss">
</style>
