<template>
  <div class="md-layout">
    <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" is-full-screen />
    <div class="md-layout-item md-size-100" v-if="user">
      <div class="pull-right">
        <drop-down direction="down" :hover="true">
          <md-button name="user-top-menu" slot="title" class="md-purple md-sm" data-toggle="dropdown">
            <md-icon>person</md-icon>
            {{ user ? user.displayName : "" }}
          </md-button>
          <ul class="dropdown-menu dropdown-menu-right">
            <li>
              <a
                href="javascript: void(null);"
                name="user-top-menu-my-profile"
                class="user-top-menu-my-profile"
                @click="openMyProfile"
                >My Profile</a
              >
            </li>
            <li>
              <a
                href="javascript: void(null);"
                name="user-top-menu-my-profile"
                class="user-top-menu-my-profile"
                @click="openMyEvents"
                >My Events</a
              >
            </li>
            <li class="divider"></li>
            <li>
              <router-link name="user-top-menu-sign-out" class="user-top-menu-sign-out" :to="{ path: '/signout' }"
                >Sign Out</router-link
              >
            </li>
          </ul>
        </drop-down>
      </div>
    </div>
    <div v-if="!user">&nbsp;</div>
    <div class="md-layout-item md-size-100">
      <md-card class="event-details">
        <md-card-content class="md-layout event-details_content" v-if="calendarEvent.id">
          <!-- Event Banner -->
          <event-banner
            :user-response.sync="userResponse"
            :user-info.sync="user"
            :event.sync="calendarEvent"
            :readonly.sync="readonly"
          ></event-banner>
          <!-- ./Event Banner -->

          <!-- Event Info -->
          <div class="md-layout-item md-size-50 md-small-size-100">
            <div class="event-title-date">
              <h4>{{ calendarEvent.title }}</h4>

              <div class="event-date">{{ getEventDate(calendarEvent.eventStartMillis) }}</div>

              <div class="number-of-users">12 people accepted</div>
            </div>

            <event-tabs :event="calendarEvent" :readonly="readonly" v-if="!isMobile"></event-tabs>

            <event-images :event="calendarEvent" :readonly="readonly" v-if="!isMobile"></event-images>

            <event-questions-answers
              :event="calendarEvent"
              :readonly="readonly"
              v-if="!isMobile"
            ></event-questions-answers>
          </div>
          <!-- ./Event Info -->

          <!-- Event TimeLine -->
          <div class="md-layout-item md-size-50 md-small-size-100" v-if="!isMobile">
            <event-time-line-items :event="calendarEvent" :readonly="readonly"></event-time-line-items>
          </div>
          <!-- ./Event Timeline -->

          <!-- Mobile Tabs -->
          <div class="md-layout-item md-size-100 event-details-tabs" v-if="isMobile">
            <tabs :tab-name="['DETAILS', 'IMAGES', 'TIMELINE']" color-button="warning">
              <!-- here you can add your content for tab-content -->
              <template slot="tab-pane-1">
                <event-tabs :event="calendarEvent" :readonly="readonly"></event-tabs>

                <event-questions-answers :event="calendarEvent" :readonly="readonly"></event-questions-answers>
              </template>
              <template slot="tab-pane-2">
                <event-images :event="calendarEvent" :readonly="readonly"></event-images>
              </template>
              <template slot="tab-pane-3">
                <event-time-line-items :event="calendarEvent" :readonly="readonly"></event-time-line-items>
              </template>
            </tabs>
          </div>
          <!-- ./Mobile Tabs -->
        </md-card-content>
      </md-card>
    </div>

    <!-- Sign up Modal -->
    <!--<sign-up-modal v-if="calendarEvent" :event="calendarEvent" :sign-up-modal.sync="shoWSignup" :isGoing="is_going_to_event"></sign-up-modal>-->
    <!-- ./Sign up Modal -->

    <!-- Dietary Constraints Modal -->
    <!--<dietary-constraints-modal v-if="calendarEvent" :event="calendarEvent" :isGoing="is_going_to_event"></dietary-constraints-modal>-->
    <!-- ./Dietary Constraints Modal -->
  </div>
</template>

<script>
// MAIN MODULES
import ChartComponent from "@/components/Cards/ChartComponent";

import ProfileSettings from "@/pages/app/Profile/ProfileSettings";
import MyEventsPanel from "@/pages/app/Profile/MyEventsPanel";

import moment from "moment";
import VueElementLoading from "vue-element-loading";
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import EventInvitee from "@/models/EventInvitee";

// COMPONENTS
import { AnimatedNumber } from "@/components";
import Icon from "@/components/Icon/Icon.vue";
import { Tabs } from "@/components";
import { Collapse } from "@/components";

// EVENT COMPONENTs
import EventBanner from "./components/EventBlocks/EventBanner.vue";
import EventTabs from "./components/EventBlocks/EventTabs.vue";
import EventImages from "./components/EventBlocks/EventImages.vue";
import EventQuestionsAnswers from "./components/EventBlocks/EventQuestionsAnswers.vue";
import EventTimeLineItems from "./components/EventBlocks/EventTimelineItems.vue";
import EventConfirmation from "./components/EventBlocks/EventConfirmation.vue";
import SignInSignUpPanel from "./SignInSignUpPanel.vue";
import DietaryConstraintsModal from "./components/EventBlocks/Modals/DietaryConstraintsModal.vue";
import EventInviteeResponse from "../../../models/EventInviteeResponse";

export default {
  components: {
    VueElementLoading,
    ChartComponent,
    AnimatedNumber,
    Icon,
    Collapse,
    Tabs,
    EventBanner,
    EventTabs,
    EventImages,
    EventQuestionsAnswers,
    EventTimeLineItems,
    EventConfirmation,
    SignInSignUpPanel,
    DietaryConstraintsModal,
    MyEventsPanel,
  },

  data() {
    return {
      user: null,
      userResponse: null,
      calendarEvent: {},
      isLoading: false,
      readonly: true,
      shoWSignup: false,
      isMobile: window.innerWidth <= 500,
      avatar: "https://static-maryoku.s3.amazonaws.com/storage/img/placeholder.jpg",
      invitee: {},
      pendingResponse: null,
    };
  },
  created() {
    const givenToken = this.$route.query.token;
    if (givenToken) {
      this.$auth.setToken(givenToken);
      this.$auth.setHeaders(this);
    }

    this.$root.$on("event-confirmation", (isGoing) => {
      if (this.user) {
        let inviteeResponse = {
          invitee: { id: this.invitee.id },
          attending: isGoing,
        };
        if (this.userResponse) {
          Object.assign(inviteeResponse, this.userResponse);
          inviteeResponse.attending = isGoing;
          new EventInviteeResponse(inviteeResponse)
            .for(new Calendar({ id: this.calendarEvent.calendar.id }), new CalendarEvent(this.calendarEvent))
            .save()
            .then((res) => {
              this.userResponse = res.item;
            });
        } else {
          new EventInviteeResponse({
            attending: isGoing,
            invitee: { id: this.invitee.id },
          })
            .for(new Calendar({ id: this.calendarEvent.calendar.id }), new CalendarEvent(this.calendarEvent))
            .save()
            .then((res) => {
              this.userResponse = res.item;
            });
        }
      } else {
        this.pendingResponse = { attending: isGoing };
        this.showSignupPanel(isGoing);
      }
    });

    this.$root.$on("signed-in", (token) => {
      this.isLoading = true;
      this.$auth.currentUser(this, false, () => {
        this.user = this.$auth.user;
        this.avatar = this.user.avatar || "https://static-maryoku.s3.amazonaws.com/storage/img/placeholder.jpg";
        this.getEvent();
        this.isLoading = false;
      });
    });
  },
  mounted() {
    this.$auth.currentUser(this, false, () => {
      if (this.$auth.user.authenticated) {
        this.user = this.$auth.user;
        this.avatar = this.user.avatar || "https://static-maryoku.s3.amazonaws.com/storage/img/placeholder.jpg";
      }
      this.getEvent();
    });

    this.$root.$on("refreshEvent", () => {
      this.getEvent();
    });
  },
  methods: {
    openMyProfile() {
      window.currentPanel = this.$showPanel({
        component: ProfileSettings,
        cssClass: "md-layout-item md-small-size-100 md-medium-size-65 md-size-50 transition36 bg-grey",
        openOn: "right",
        props: {},
      });
    },
    openMyEvents() {
      window.currentPanel = this.$showPanel({
        component: MyEventsPanel,
        cssClass: "md-layout-item md-small-size-100 md-medium-size-50 md-size-35 transition36  bg-grey",
        openOn: "right",
        props: {},
      });
    },
    showSignupPanel(isGoing) {
      window.currentPanel = this.$showPanel({
        component: SignInSignUpPanel,
        cssClass: "md-layout-item md-small-size-100 md-medium-size-50 md-size-30 transition36 ",
        openOn: "right",
        disableBgClick: false,
        props: {
          eventId: this.calendarEvent.id,
        },
      });
    },
    getEvent() {
      this.isLoading = true;
      new CalendarEvent().find(this.$route.params.id).then((event) => {
        this.calendarEvent = event.for(new Calendar({ id: event.calendar.id }));
        this.totalRemainingBudget = event.totalBudget - event.allocatedBudget;
        this.percentage = 100 - ((event.allocatedBudget / event.totalBudget) * 100).toFixed(2);
        this.seriesData = [100 - this.percentage, this.percentage];

        if (event.eventPage === null) {
          this.setEventPageData();
        }

        if (this.user) {
          new EventInvitee()
            .for(new Calendar({ id: event.calendar.id }), this.calendarEvent)
            .params({ personId: this.user.id })
            .get()
            .then((res) => {
              this.invitee = res[0];
              this.userResponse = res[0].inviteeResponse;

              if (this.pendingResponse) {
                this.pendingResponse.invitee = this.invitee;
                new EventInviteeResponse(this.pendingResponse)
                  .for(new Calendar({ id: this.calendarEvent.calendar.id }), new CalendarEvent(this.calendarEvent))
                  .save()
                  .then((res) => {
                    this.userResponse = res.item;
                    this.isLoading = false;
                  });
              } else {
                this.isLoading = false;
              }
            })
            .catch((res) => {
              if (res.response.data.status === 406) {
                this.$router.push({ path: "/signout" });
              }
            });
        } else {
          this.isLoading = false;
        }
      });
    },
    getEventDate(eventStartMillis) {
      let x = new Date(eventStartMillis);

      return x.getDate() + "-" + x.getMonth() + "-" + x.getFullYear();
    },
    setEventPageData() {
      let editedEvent = new CalendarEvent({ id: this.calendarEvent.id });

      editedEvent = this.calendarEvent;
      editedEvent.eventPage = this.eventPage;

      editedEvent
        .save()
        .then((response) => {})
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: {
    pieChart() {
      return {
        data: {
          labels: [" ", " "], // should be empty to remove text from chart
          series: this.seriesData,
        },
        options: {
          padding: 0,
          height: 120,
          donut: true,
          donutWidth: 12,
        },
      };
    },
    date: {
      get() {
        return this.calendarEvent.eventStartMillis ? new Date(this.calendarEvent.eventStartMillis) : null;
      },
      set(value) {
        let eventStartTime = new Date(value).getTime();
        this.$set(this, "newEventStartTime", eventStartTime);
      },
    },
  },
  filters: {
    formatDate: function (date) {
      return moment(date).format("Do, MMM");
    },
    formatTime: function (date) {
      return moment(date).format("h:00 A");
    },
    formatDuration: function (startDate, endDate) {
      return moment(endDate).diff(startDate, "hours");
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/md/_variables.scss";
@import "@/assets/scss/md/_colors.scss";
@import "@/assets/scss/md/_shadows.scss";
.photo {
  width: 28px;
  height: 28px;
  border-radius: 50%;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
