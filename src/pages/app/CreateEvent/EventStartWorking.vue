<template>
  <div class>
    <div class="section-header">
      <h2 class="section-title">Great Job! we have everything we need to start working!</h2>
      <div class="steps-wizard">
        <ul class="steps-wizard-items">
          <li v-for="index in step" :key="index"></li>
        </ul>
      </div>
    </div>
    <div class="container no-padding-mobile">
      <div class="form-section start-working">
        <div class="start-working-item" v-for="(item,index) in startWorkingList" :key="index">
          <md-checkbox v-model="item.selected">
            <div class="image-cont">
              <img
                :src="`https://static-maryoku.s3.amazonaws.com/storage/wizard-icons/${item.img}`"
              />
            </div>
            <span>{{item.title}}</span>
            <small>{{item.desc}}</small>
          </md-checkbox>
        </div>

        <div class="form-actions">
          <md-button class="md-rose next-btn custom-btn" @click="goToNext">Let's go</md-button>
        </div>
      </div>
    </div>

    <go-back navigation="event-scales"></go-back>
  </div>
</template>

<script>
import GoBack from "./componenets/GoBack";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

import VTooltip from "v-tooltip";
import _ from "underscore";

export default {
  components: {
    GoBack,
    VTooltip,
  },
  data() {
    return {
      step: 7,
      haveEventPlace: false,
      flexibleWithDates: false,
      eventTime: null,
      concept: false,
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
      startWorkingList: [
        {
          title: "Concept and ideas",
          desc: "Inspired by top creative directors",
          img: "Component 50 – 1@2x.png",
          selected: true,
        },
        {
          title: "Detailed Budget Table",
          desc: "Crafted brilliantly to get snap approval",
          img: "Component 52 – 4@2x.png",
          selected: true,
        },
        {
          title: "Event Timeline",
          desc: "Tailored for your event to ensure success",
          img: "Component 49 – 4@2x.png",
          selected: true,
        },
        {
          title: "Vendors proposals",
          desc: "Available vendors that match your budget",
          img: "Component 51 – 4@2x.png",
          selected: true,
        },
        {
          title: "RSVP",
          desc: "From event campaign to registration",
          img: "Component 48 – 8@2x.png",
          selected: true,
        },
        {
          title: "On day coordination",
          desc: "By top coordinators familiar with your event",
          img: "Component 51 – 4@2x.png",
          selected: false,
        },
      ],
    };
  },
  created() {
    // this.$set(this,'eventMovieId' ,this.publicEventData.eventMovieId);
    // if ( this.publicEventData.eventNeededServices ) {
    //     this.$set(this,'startWorkingList' ,this.publicEventData.eventNeededServices);
    //
    // }
  },

  methods: {
    ...mapMutations("PublicEventPlanner", [
      "setEventProperty",
      "setSingupModal",
      "setCurrentStep",
    ]),

    goToNext() {
      let vm = this;

      this.cerrors = {};
      this.validating = true;

      // open the modal

      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          let eventNeededServices = {};

          _.each(this.startWorkingList, (item) => {
            eventNeededServices[item.title] = item.selected;
          });

          this.setCurrentStep({ currentPage: "/event-summery" });

          this.setEventProperty({
            key: "eventNeededServices",
            actualValue: eventNeededServices,
          });

          if (this.$auth.user.authenticated) {
            this.$router.push({ path: `/event-summery` });
          } else {
            this.setSingupModal({ showModal: true });
          }
        } else {
        }
      });
    },
    skip() {},
  },
  computed: {
    ...mapState("PublicEventPlanner", ["publicEventData", "shoWSignupModal"]),
  },
};
</script>
<style lang="scss">
$baseColor: #5c2153;

.form-section.start-working {
  width: 60%;
  margin: 0 auto;
  padding: 0 2em 5em;
  height: auto;
  min-height: 440px;
}

.start-working {
  &-item {
    width: 48%;
    display: inline-block;
    font-family: "Open Sans";

    .md-checkbox {
      display: flex;
      flex-direction: row-reverse;
      border: 1px solid #aaa;
      border-radius: 12px;
      height: 72px;
      justify-content: space-between;
      align-items: center;
      padding: 0 1em;
      margin-bottom: 0;

      .image-cont {
        position: absolute;
        left: 0;
        width: 50px;
        text-align: center;
      }

      img {
        filter: gray; /* IE6-9 */
        -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */
        filter: grayscale(1); /* Microsoft Edge and Firefox 35+ */
        opacity: 0.6;
        width: 37px;
      }

      label {
        position: relative !important;
        padding-left: 64px;
        height: auto !important;

        img {
        }
        small {
          display: block;
          font-size: 11px;
          color: #606060;
          font-weight: bold;
        }
      }

      &.md-checked {
        border: 1px solid $baseColor;

        label {
          img {
            -webkit-filter: grayscale(0);
            filter: none;
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
