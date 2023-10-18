<template>
  <div class>
    <div class="section-header">
      <h2 class="section-title">Let’s make sure we understand the vibe you’re looking for</h2>
      <div class="steps-wizard">
        <ul class="steps-wizard-items">
          <li v-for="index in step" :key="index"></li>
        </ul>
      </div>
    </div>
    <div class="container no-padding-mobile">
      <div class="form-section vibe-section">
        <div class="vibes-list">
          <div class="vibe-item" v-for="(tone,index) in ringtonesList" :key="index">
            <!--                        <md-icon>pause_circle_filled</md-icon>-->
            <span v-if="currentIndex !== index" @click.prevent="playSong(index)">
              <md-icon class="play-icon">play_circle_filled</md-icon>
            </span>
            <span v-else-if="currentIndex === index" @click.prevent="pauseSong(index)">
              <md-icon class="pause-icon">pause_circle_filled</md-icon>
            </span>
            <md-radio v-model="eventSongId" :value="tone.name" class="with-border">
              <small>{{tone.author}}</small>
              <br />
              {{tone.name}}
            </md-radio>
          </div>
        </div>

        <div class="form-actions two-btns">
          <md-button
            class="md-default next-btn custom-btn"
            :class="[{'opacity-btn' : buttonLabel === 'Skip'}]"
            @mouseover="buttonLabel='I don\'t know'"
            @mouseleave="buttonLabel='Skip'"
          >{{buttonLabel}}</md-button>
          <md-button
            class="md-rose next-btn custom-btn"
            @click="goToNext"
            :class="[{'disabled': !eventSongId }]"
          >Next</md-button>
        </div>
      </div>
    </div>

    <go-back navigation="event-budget"></go-back>
  </div>
</template>

<script>
import GoBack from "./componenets/GoBack";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  components: {
    GoBack,
  },
  data() {
    return {
      step: 4,
      haveEventPlace: false,
      flexibleWithDates: false,
      eventTime: null,
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
      ringtonesURL:
        "https://static-maryoku.s3.amazonaws.com/storage/ringtones/",
      ringtonesList: [
        {
          name: "9 to 5",
          author: "Dolly Parton",
        },
        {
          name: "Money Money Money",
          author: "Abba",
        },
        {
          name: "Don't worry be happy",
          author: "bobby McFerrin",
        },
        {
          name: "We've Only Just Begun",
          author: "the Carpenters",
        },
        {
          name: "We Are The Champions",
          author: "Queen",
        },
        {
          name: "A Change Would Do You Good",
          author: "Sheryl Crow",
        },
        {
          name: "Eight days a week",
          author: "The Beatles",
        },
        {
          name: "We Are Family",
          author: "Sister Sledge",
        },
      ],
      eventSongId: null,
      boardSound: [],
      currentIndex: null,
      isPaused: false,
    };
  },
  created() {
    this.boardSound = [
      new Audio(
        "https://static-maryoku.s3.amazonaws.com/storage/ringtones/9_to_5_1605.mp3",
      ),
      new Audio(
        "https://static-maryoku.s3.amazonaws.com/storage/ringtones/abba_money_money_money_ringtone.mp3",
      ),
      new Audio(
        "https://static-maryoku.s3.amazonaws.com/storage/ringtones/bobby_mcferrin_dont_worry_be_happy.mp3",
      ),
      new Audio(
        "https://static-maryoku.s3.amazonaws.com/storage/ringtones/carpenters_weve_only_just_begun.mp3",
      ),
      new Audio(
        "https://static-maryoku.s3.amazonaws.com/storage/ringtones/queen_we_are_the_champions_ringtone.mp3",
      ),
      new Audio(
        "https://static-maryoku.s3.amazonaws.com/storage/ringtones/sheryl_crow_a_change_would_do_you_good_b_w_music_video.mp3",
      ),
      new Audio(
        "https://static-maryoku.s3.amazonaws.com/storage/ringtones/the_beatles_eight_days_a_week.mp3",
      ),
      new Audio(
        "https://static-maryoku.s3.amazonaws.com/storage/ringtones/we_are_family_v2_53802.mp3",
      ),
    ];

    console.log(this.publicEventData.eventSongId);

    this.$set(this, "eventSongId", this.publicEventData.eventSongId);
  },

  methods: {
    ...mapMutations("PublicEventPlanner", [
      "setEventProperty",
      "setCurrentStep",
    ]),

    goToNext() {
      let vm = this;

      this.cerrors = {};
      this.validating = true;

      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          this.setEventProperty({
            key: "eventSongId",
            actualValue: this.eventSongId,
          });
          this.setCurrentStep({ currentPage: "/event-movies" });
          this.$router.push({ path: `/event-movies` });
        } else {
        }
      });
    },
    skip() {
      this.$router.push({ path: `/event-movies` });
      this.setCurrentStep({ currentPage: "/event-movies" });
    },
    songName(name) {
      console.log(name);

      var newStr = name.replace(/_/g, " ");
      return newStr.replace(".mp3", "");
    },

    pauseSong(index) {
      this.boardSound[index].pause();
      this.currentIndex = null;
    },
    playSong(index) {
      console.log(index);

      // if ( this.currentIndex ) {
      //     this.boardSound[this.currentIndex].pause();
      // }

      for (let i = 0; i < this.boardSound.length; i++) {
        this.boardSound[i].pause();
      }

      this.boardSound[index].play();

      this.currentIndex = index;
    },
  },
  computed: {
    ...mapState("PublicEventPlanner", ["publicEventData"]),
  },
};
</script>
<style lang="scss">
$baseColor: #5c2153;

.form-section.vibe-section {
  width: 65%;
  margin: 0 auto;
  padding: 0 2em;
  min-height: 440px;

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

.vibe-item {
  width: 50%;
  display: flex;
  float: left;
  margin-bottom: 1em;
  flex: 1;
  justify-content: center;
  align-items: center;

  .md-icon {
    font-size: 3rem !important;
    color: #aaaaaa !important;

    &:hover {
      color: $baseColor !important;
    }

    &.pause-icon {
      color: #f51355 !important;
    }
  }

  .md-radio.md-checked .md-radio-container {
    //border: 1px solid $baseColor !important;

    &:after {
      //background-color : $baseColor !important;
    }
  }

  .md-radio.with-border {
    // border: 1px solid #aaaaaa;

    height: 52px;
    padding: 4px;
    width: 81%;
    margin: 0 auto;

    &:hover {
      border-color: $baseColor;
    }

    label {
      font-size: 15px;
      line-height: 17px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: 87%;
      height: 35px;

      small {
        font-size: 11px;
      }
    }

    .md-radio-container {
      position: absolute;
      right: 1em;
      top: 0.8em;
    }

    &:hover {
      .md-radio-container {
        &:after {
          background-color: $baseColor !important;
          opacity: 0.7;
          transform: scale3D(1, 1, 1);
        }
      }
    }

    &.md-checked {
      //border: 1px solid $baseColor;
      background: #fff;

      .md-radio-label {
        //color : $baseColor;
      }
    }
  }

  @media screen and (max-width: 500px) {
    .form-actions.two-btns {
      margin-top: 2em;
      float: left;
      width: 100%;
    }
  }
}
</style>
