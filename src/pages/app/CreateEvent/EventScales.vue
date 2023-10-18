<template>
  <div class>
    <div class="section-header">
      <h2 class="section-title">Tell us what you care for more in this event</h2>
      <div class="steps-wizard">
        <ul class="steps-wizard-items">
          <li v-for="index in step" :key="index"></li>
        </ul>
      </div>
    </div>
    <div class="container">
      <div class="form-section scales-section">
        <div class="range-item">
          <div class="option left">Convenience & Accessibility</div>
          <div class="option right">Authenticity & experience</div>
          <input type="range" v-model="eventScale1" @change="checkScale1" />
        </div>

        <div class="range-item">
          <div class="option left">Familiar & trusted</div>
          <div class="option right">New and edgy</div>
          <input type="range" v-model="eventScale2" @change="checkScale2" />
        </div>

        <div class="range-item">
          <div class="option left">Within budget</div>
          <div class="option right">Hight Value for Money</div>
          <input type="range" v-model="eventScale3" @change="checkScale3" />
        </div>

        <div class="range-item">
          <div class="option left">Meets Requirements</div>
          <div class="option right">Social & Green</div>
          <input type="range" v-model="eventScale4" @change="checkScale4" />
        </div>

        <div class="form-actions">
          <md-button class="md-rose next-btn custom-btn" @click="goToNext">Next</md-button>
        </div>
      </div>
    </div>

    <go-back navigation="event-movies"></go-back>
  </div>
</template>

<script>
import GoBack from "./componenets/GoBack";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

import VTooltip from "v-tooltip";

export default {
  components: {
    GoBack,
    VTooltip,
  },
  data() {
    return {
      step: 6,
      haveEventPlace: false,
      flexibleWithDates: false,
      eventTime: null,
      eventScale1: null,
      eventScale2: null,
      eventScale3: null,
      eventScale4: null,
      eventData: {},
      modelValidations: {
        totalBudget: {
          required: true,
        },
        budgetPerPerson: {
          required: true,
        },
      },
      buttonLabel: "Skip",
      moviesPostersURL:
        "https://static-maryoku.s3.amazonaws.com/storage/movies/",
      eventMovieId: null,
      boardSound: [],
      currentIndex: null,
      isPaused: false,
    };
  },
  created() {
    this.$set(this, "eventScale1", this.publicEventData.eventDecisionFactor1);
    this.$set(this, "eventScale2", this.publicEventData.eventDecisionFactor2);
    this.$set(this, "eventScale3", this.publicEventData.eventDecisionFactor3);
    this.$set(this, "eventScale4", this.publicEventData.eventDecisionFactor4);
  },

  methods: {
    ...mapMutations("PublicEventPlanner", [
      "setEventProperty",
      "setEventDecisionFactor",
      "setCurrentStep",
    ]),

    goToNext() {
      let vm = this;

      this.cerrors = {};
      this.validating = true;

      this.$validator.validateAll().then((isValid) => {
        let eventMovieId = this.boardSound[this.currentIndex];
        if (isValid) {
          // this.setEventProperty({key: 'eventMovieId', actualValue: eventMovieId});
          this.setCurrentStep({ currentPage: "/event-start-working" });
          this.$router.push({ path: `/event-start-working` });
        } else {
        }
      });
    },
    skip() {},
    checkScale1() {
      this.setEventProperty({
        key: "eventDecisionFactor1",
        actualValue: this.eventScale1,
      });

      this.setEventDecisionFactor({
        key: "eventDecisionFactor1",
        actualValue: this.eventScale1,
      });
    },
    checkScale2() {
      this.setEventProperty({
        key: "eventDecisionFactor2",
        actualValue: this.eventScale2,
      });

      this.setEventDecisionFactor({
        key: "eventDecisionFactor2",
        actualValue: this.eventScale2,
      });
    },
    checkScale3() {
      this.setEventProperty({
        key: "eventDecisionFactor3",
        actualValue: this.eventScale3,
      });

      this.setEventDecisionFactor({
        key: "eventDecisionFactor3",
        actualValue: this.eventScale3,
      });
    },
    checkScale4() {
      this.setEventProperty({
        key: "eventDecisionFactor4",
        actualValue: this.eventScale4,
      });

      this.setEventDecisionFactor({
        key: "eventDecisionFactor4",
        actualValue: this.eventScale4,
      });
    },
  },
  computed: {
    ...mapState("PublicEventPlanner", [
      "publicEventData",
      "eventDecisionFactors",
    ]),
  },
};
</script>
<style lang="scss">
$baseColor: #5c2153;

.form-section.scales-section {
  width: 70%;
  margin: 0 auto;
  padding: 0 2em 5em;
  height: auto;
  min-height: 440px;
  max-width: 800px;

  .divider {
    margin-top: 1em;
  }

  .field-small-note {
    font-size: 15px;
    color: #aaa;
    font-weight: bold;
    text-align: center;
  }
}

.range-item {
  position: relative;
  margin-bottom: 1em;
  .option {
    position: absolute;
    top: 0;
    font-weight: 500;
    font-size: 15px;
    color: #606060;
    &.left {
      left: 0;
    }
    &.right {
      right: 0;
    }
  }
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  margin: 13.8px 0;
  background: none;
  box-shadow: none;
  padding-left: 0;
  padding-right: 0;
}
input[type="range"]:focus {
  outline: none;
}
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 2px;
  cursor: pointer;
  background: #aaaaaa;
  border-radius: 1.3px;
  border: 0.2px solid #010101;
  position: relative;
}
input[type="range"]::-webkit-slider-thumb {
  height: 24px;
  width: 37px;
  border-radius: 100px;
  background: $baseColor;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -12px;
  border: 1px solid #f4f4f4;
}
input[type="range"]:focus::-webkit-slider-runnable-track {
  background: #aaaaaa;
}

input[type="range"]::-moz-range-track {
  width: 100%;
  height: 2px;
  cursor: pointer;
  background: #aaaaaa;
  border-radius: 1.3px;
  position: relative;
}
input[type="range"]::-moz-range-thumb {
  height: 24px;
  width: 37px;
  border-radius: 100px;
  background: $baseColor;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -12px;
  border: 1px solid #f4f4f4;
}

input[type="range"]::-ms-track {
  width: 100%;
  height: 8.4px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type="range"]::-ms-fill-lower {
  background: #aaaaaa;
  border: 0.2px solid #010101;
  border-radius: 2.6px;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
input[type="range"]::-ms-fill-upper {
  background: #aaaaaa;
  border: 0.2px solid #010101;
  border-radius: 2.6px;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
input[type="range"]::-ms-thumb {
  height: 24px;
  width: 37px;
  border-radius: 100px;
  background: $baseColor;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -12px;
  border: 1px solid #f4f4f4;
}
input[type="range"]:focus::-ms-fill-lower {
  background: #aaaaaa;
}
input[type="range"]:focus::-ms-fill-upper {
  background: #aaaaaa;
}
</style>
