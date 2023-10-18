<template>
  <div :class="[{ 'nav-open': $sidebar.showSidebar }, { rtl: $route.meta.rtlActive }]">
    <div class="main-panel" style="height: 50%">
      <div
        :class="{ content: !$route.meta.hideContent }"
        @click="toggleSidebar"
        style="padding-right: 0"
        v-if="renderChild"
      >
        <!-- your content here -->
        <side-bar :event="eventData"></side-bar>
        <zoom-center-transition :duration="200" mode="out-in">
          <router-view></router-view>
        </zoom-center-transition>
      </div>
      <div class="error-page" v-else>
        <span v-if="showError">We cannot get your event. Please check your link or try again later.</span>
      </div>
      <!--<content-footer v-if="!$route.meta.hideFooter"></content-footer>-->
    </div>
    <v-tour name="invite" :steps="steps.invite" :callbacks="tourCallback">
      <template slot-scope="tour">
        <fade-transition>
          <v-step
            v-if="tour.steps[tour.currentStep]"
            :key="tour.currentStep"
            :step="tour.steps[tour.currentStep]"
            :next-step="tour.nextStep"
            :stop="tour.stop"
            :is-first="tour.isFirst"
            :is-last="tour.isLast"
            :labels="tour.labels"
            :finish="tour.finish"
          >
            <div
              slot="header"
              class="d-flex align-center font-bold-extra justify-content-between"
              style="padding: 10px 20px"
            >
              {{ tour.steps[tour.currentStep].header.title }}
              <md-button class="md-simple md-icon-button" @click="stopTour"
                ><md-icon style="color: white !important">close</md-icon></md-button
              >
            </div>
            <div slot="actions" class="d-flex justify-content-between tour-actions">
              <!-- <button @click="tour.previousStep" class="btn btn-primary">Previous step</button> -->
              <span class="step-label">{{ tour.currentStep + 1 }}&nbsp;/&nbsp;{{ tour.steps.length }}</span>
              <md-button
                v-if="tour.isLast"
                @click="tour.finish"
                class="md-simple md-red maryoku-btn"
                style="background-color: white !important"
                >Got it</md-button
              >
              <md-button
                v-else
                @click="tour.nextStep"
                class="md-simple md-red maryoku-btn"
                style="background-color: white !important"
                >Keep going</md-button
              >
            </div>
          </v-step>
        </fade-transition>
      </template>
    </v-tour>
    <v-tour name="comment" :steps="steps.comment" :callbacks="tourCallback">
      <template slot-scope="tour">
        <fade-transition>
          <v-step
            v-if="tour.steps[tour.currentStep]"
            :key="tour.currentStep"
            :step="tour.steps[tour.currentStep]"
            :next-step="tour.nextStep"
            :stop="tour.stop"
            :is-first="tour.isFirst"
            :is-last="tour.isLast"
            :labels="tour.labels"
            :finish="tour.finish"
          >
            <div
              slot="header"
              class="d-flex align-center font-bold-extra justify-content-between"
              style="padding: 10px 20px"
            >
              {{ tour.steps[tour.currentStep].header.title }}
              <md-button class="md-simple md-icon-button" @click="stopTour"
                ><md-icon style="color: white !important">close</md-icon></md-button
              >
            </div>
            <div slot="actions" class="d-flex justify-content-between tour-actions">
              <!-- <button @click="tour.previousStep" class="btn btn-primary">Previous step</button> -->
              <span class="step-label">{{ tour.currentStep + 1 }}&nbsp;/&nbsp;{{ tour.steps.length }}</span>
              <md-button
                v-if="tour.isLast"
                @click="tour.finish"
                class="md-simple md-red maryoku-btn"
                style="background-color: white !important"
                >Got it</md-button
              >
              <md-button
                v-else
                @click="tour.nextStep"
                class="md-simple md-red maryoku-btn"
                style="background-color: white !important"
                >Keep going</md-button
              >
            </div>
          </v-step>
        </fade-transition>
      </template>
    </v-tour>
    <v-tour name="download" :steps="steps.download" :callbacks="tourCallback">
      <template slot-scope="tour">
        <fade-transition>
          <v-step
            v-if="tour.steps[tour.currentStep]"
            :key="tour.currentStep"
            :step="tour.steps[tour.currentStep]"
            :next-step="tour.nextStep"
            :stop="tour.stop"
            :is-first="tour.isFirst"
            :is-last="tour.isLast"
            :labels="tour.labels"
            :finish="tour.finish"
          >
            <div
              slot="header"
              class="d-flex align-center font-bold-extra justify-content-between"
              style="padding: 10px 20px"
            >
              {{ tour.steps[tour.currentStep].header.title }}
              <md-button class="md-simple md-icon-button" @click="stopTour"
                ><md-icon style="color: white !important">close</md-icon></md-button
              >
            </div>
            <div slot="actions" class="d-flex justify-content-between tour-actions">
              <!-- <button @click="tour.previousStep" class="btn btn-primary">Previous step</button> -->
              <span class="step-label">{{ tour.currentStep + 1 }}&nbsp;/&nbsp;{{ tour.steps.length }}</span>

              <md-button
                v-if="tour.isLast"
                @click="tour.finish"
                class="md-simple md-red maryoku-btn"
                style="background-color: white !important"
                >Got it</md-button
              >
              <md-button
                v-else
                @click="tour.nextStep"
                class="md-simple md-red maryoku-btn"
                style="background-color: white !important"
                >Keep going</md-button
              >
            </div>
          </v-step>
        </fade-transition>
      </template>
    </v-tour>
    <v-tour name="controlPanel" :steps="steps.controlPanel" :callbacks="tourCallback">
      <template slot-scope="tour">
        <fade-transition>
          <v-step
            v-if="tour.steps[tour.currentStep]"
            :key="tour.currentStep"
            :step="tour.steps[tour.currentStep]"
            :next-step="tour.nextStep"
            :stop="tour.stop"
            :is-first="tour.isFirst"
            :is-last="tour.isLast"
            :labels="tour.labels"
            :finish="tour.finish"
            class="dark"
          >
            <div
              slot="header"
              class="d-flex align-center font-bold-extra justify-content-between"
              style="padding: 10px 20px"
            >
              {{ tour.steps[tour.currentStep].header.title }}
              <md-button class="md-simple md-icon-button" @click="stopTour"
                ><md-icon style="color: white !important">close</md-icon></md-button
              >
            </div>
            <div slot="actions" class="d-flex justify-content-between tour-actions">
              <!-- <button @click="tour.previousStep" class="btn btn-primary">Previous step</button> -->
              <span class="step-label dark">{{ tour.currentStep + 1 }}&nbsp;/&nbsp;{{ tour.steps.length }}</span>
              <md-button v-if="tour.isLast" @click="tour.finish" class="md-red maryoku-btn">Got it</md-button>
              <md-button v-else @click="tour.nextStep" class="md-red maryoku-btn">Keep going</md-button>
            </div>
          </v-step>
        </fade-transition>
      </template>
    </v-tour>
    <v-tour name="footerPanel" :steps="steps.footerPanel" :callbacks="tourCallback">
      <template slot-scope="tour">
        <fade-transition>
          <v-step
            v-if="tour.steps[tour.currentStep]"
            :key="tour.currentStep"
            :step="tour.steps[tour.currentStep]"
            :next-step="tour.nextStep"
            :stop="tour.stop"
            :is-first="tour.isFirst"
            :is-last="tour.isLast"
            :labels="tour.labels"
            :finish="tour.finish"
            class="dark"
          >
            <div
              slot="header"
              class="d-flex align-center font-bold-extra justify-content-between"
              style="padding: 10px 20px"
            >
              {{ tour.steps[tour.currentStep].header.title }}
              <md-button class="md-simple md-icon-button" @click="stopTour"
                ><md-icon style="color: white !important">close</md-icon></md-button
              >
            </div>
            <div slot="actions" class="d-flex justify-content-between tour-actions">
              <!-- <button @click="tour.previousStep" class="btn btn-primary">Previous step</button> -->
              <span class="step-label dark">{{ tour.currentStep + 1 }}&nbsp;/&nbsp;{{ tour.steps.length }}</span>
              <md-button v-if="tour.isLast" @click="tour.finish" class="md-red maryoku-btn">Got it</md-button>
              <md-button v-else @click="tour.nextStep" class="md-red maryoku-btn">Keep going</md-button>
            </div>
          </v-step>
        </fade-transition>
      </template>
    </v-tour>
  </div>
</template>
<script>
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import Calendar from "@/models/Calendar";
import EventPlannerVuexModule from "../../app/Events/EventPlanner.vuex";
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import MobileMenu from "./Extra/MobileMenu.vue";
import UserMenu from "./Extra/UserMenu.vue";
import { ZoomCenterTransition, FadeTransition } from "vue2-transitions";
import SideBar from "@/components/SidebarPlugin/NewSideBar";
// import auth from "src/auth";
import EventSidePanel from "@/pages/app/Events/EventSidePanel";

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

export default {
  components: {
    TopNavbar,
    ContentFooter,
    MobileMenu,
    UserMenu,
    ZoomCenterTransition,
    FadeTransition,
    SideBar,
  },
  data() {
    return {
      // auth: auth,
      event: null,
      createEventModalOpen: false,
      renderChild: false,
      showError: false,
      tourOptions: {
        useKeyboardNavigation: false,
        labels: {
          buttonSkip: "Skip tour",
          buttonPrevious: "Previous",
          buttonNext: "Keep going",
          buttonStop: "Got it",
        },
        enabledButtons: {
          buttonSkip: false,
          buttonPrevious: true,
          buttonNext: true,
          buttonStop: true,
        },
      },
      currentTourIndex: 0,
      tourCallback: {
        onFinish: this.nextTour,
      },
      steps: {
        invite: [
          {
            target: "#invite-button", // We're using document.querySelector() under the hood
            header: {
              title: "Invite",
            },
            content:
              "Share your success! Use this feature to set different roles for a specific event and invite people to co-produce and review this event.",
          },
          {
            header: {
              title: "How can you use it?",
            },
            target: "#invite-button",
            content:
              "By sending out a link to the event or using an email, Each invitee, will be able to take actions based on the role you decide to grant him or her. Oh, and don’t worry,every action is reversible, so feel free to change your mind at any time",
          },
        ],
        comment: [
          {
            target: "#comment-button", // We're using document.querySelector() under the hood
            header: {
              title: "Comment Mode",
            },
            content:
              "Want to comment on something in the page? Want to see comments made to you? Simply click on this icon to see all the comments directed for you, and reply either to a specific person or to all the people you invited.",
          },
          {
            header: {
              title: "How can you use it?",
            },
            target: "#comment-button",
            content:
              "When a red dot appears next to this icon, you’ll know that there are comments waiting for you to read. Use @ to direct a reply or start a new comment to a specific person. That person will also get a notification to his or her email.",
          },
        ],
        download: [
          {
            target: "#download-button", // We're using document.querySelector() under the hood
            header: {
              title: "Download",
            },
            content:
              "Get other people’s take on the event without having to invite them! simply click on this icon, download current page to pdf and send it by email. E-a-s-y",
          },
          {
            header: {
              title: "How can you use it?",
            },
            target: "#download-button",
            content:
              "If the download icon doesn't appear, then downloading is not applicable. Missing other types of download? Let us know by sending us feedback here",
          },
        ],
        controlPanel: [
          {
            target: "#control-panel", // We're using document.querySelector() under the hood
            header: {
              title: "Control Panel",
            },
            content:
              "Meet the only checklist you'll ever need! Our control panel is built automatically(!!) based on your event. items turn green when you start to advance and are crossed over when you’re done with the task",
            params: {
              placement: "right", // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
            },
          },
          {
            header: {
              title: "How can you use it?",
            },
            target: "#control-panel",
            content:
              "The items sequence is designed based on best practices and its goal is to direct your attention to the most important thing that needs to be done right now. However, you can play with the sequence – move items up and down. The item you now need to handle, will get all the focus whenever you open the system.",
            params: {
              placement: "right", // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
            },
          },
        ],
        footerPanel: [
          {
            target: "#footer-panel", // We're using document.querySelector() under the hood
            header: {
              title: "Action Panel",
            },
            content: "Every page has its unique footer stripe that contains the actions available to you.",
          },
          {
            header: {
              title: "How can you use it?",
            },
            target: "#footer-panel",
            content:
              "Revert to original button– will delete changes you’ve made and take you back to default values Back button – in case of multi steps actions, you can always go back to the previous page Action Button - from save to finding you vendors, This button will put in motion your next action",
          },
        ],
      },
    };
  },
  methods: {
    ...mapMutations("EventPlannerVuex", [
      "setEventModal",
      "setEditMode",
      "setModalSubmitTitle",
      "setEventModalAndEventData",
      "setNumberOfParticipants",
    ]),
    ...mapActions("event", ["getEventAction"]),
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    openEventModal() {
      this.setModalSubmitTitle("Create");
      let now = new Date();
      this.createEventModalOpen = true;
      window.currentPanel = this.$showPanel({
        component: EventSidePanel,
        cssClass: "md-layout-item md-size-40 transition36 ",
        openOn: "right",
        disableBgClick: false,
        props: {
          modalSubmitTitle: "Save",
          editMode: false,
          sourceEventData: {
            eventStartMillis: new Date().getTime(),
            numberOfParticipants: this.$auth.user.customer.numberOfEmployees,
          },
          refreshEvents: null,
          year: now.getFullYear(),
          month: now.getMonth(),
          occasionsOptions: this.occasionsArray,
          openInPlannerOption: false,
        },
      });

      window.currentPanel.promise.then((res) => {
        this.createEventModalOpen = false;
      });
    },
    initData() {
      const calendar = new Calendar({ id: this.$store.state.auth.user.profile.defaultCalendarId });
      const eventId = this.$route.params.id;
      if (!eventId) {
        this.renderChild = true;
        return;
      }
      if (eventId !== this.eventData.id) {
        // format campaign data
        this.$store.commit("campaign/setInitialized", false);
      }
      this.getEventAction({ eventId, calendar })
        .then((event) => {
          this.renderChild = true;
        })
        .catch((error) => {
          this.showError = true;
          console.error(error);
        });
    },
    nextTour() {
      const tourName = Object.keys(this.steps)[this.currentTourIndex + 1];
      this.currentTourIndex += 1;
      if (tourName) this.$tours[tourName].start();
      else {
        this.$router.push(`/events/${this.$route.params.id}/booking/overview`);
      }
    },
    stopTour() {
      const tourName = Object.keys(this.steps)[this.currentTourIndex];
      this.$tours[tourName].stop();
    },
    checkTour() {
      if (this.$route.query.walkWithMe) {
        this.currentTourIndex = 0;
        this.$tours["invite"].start();
      }
    },
  },
  created() {
    this.$store.registerModule("EventPlannerVuex", EventPlannerVuexModule);
  },
  mounted() {
    if (this.$route.query.walkWithMe) {
      setTimeout(() => {
        this.$tours["invite"].start();
      }, 1000);
    }

    this.$store
      .dispatch("auth/checkToken")
      .then(() => {
        this.initData();
      })
      .catch(() => {
        this.$router.push({ path: `/signin` });
        return;
      });
  },
  computed: {
    ...mapState("event", ["eventData"]),
  },
  watch: {
    $route: "checkTour",
  },
};
</script>
<style lang="scss">
.menu-divider {
  height: 1px;
  margin-top: 10px;
  background-color: rgba(0, 0, 0, 0.12);
}
.tour-actions {
  padding: 0 20px;
}
.step-label {
  display: inline-block;
  background-color: #ff4f7e;
  padding: 10px 20px;
  margin: 5px 0;
  border-radius: 4px;
  &.dark {
    background-color: #696969;
  }
}
$scaleSize: 0.95;
@keyframes zoomIn95 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  to {
    opacity: 1;
  }
}

.main-panel .zoomIn {
  animation-name: zoomIn95;
}

@keyframes zoomOut95 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}

.main-panel .zoomOut {
  animation-name: zoomOut95;
}
.error-page {
  font-size: 30px;
  margin: auto;
  padding: 200px;
  text-align: center;
}
</style>
