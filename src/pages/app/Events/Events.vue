<template>
  <div class="md-layout events-list">
    <loader :active="isLoading" />
    <div class="md-layout-item md-size-100">
      <md-card v-if="upcomingEvents.length">
        <md-card-header class="md-card-header-icon md-card-header-rose">
          <div class="card-icon">
            <md-icon>assignment</md-icon>
          </div>
          <h4 class="title">Upcoming Events</h4>
        </md-card-header>
        <md-card-content>
          <md-table
            v-model="upcomingEvents"
            table-header-color="rose"
            @click="forceRerender()"
            class="table-striped table-hover right-align-actions"
          >
            <md-table-row
              slot="md-table-row"
              slot-scope="{ item }"
              class="hover-row"
              @click="routeToEvent(item, $event)"
            >
              <md-table-cell md-label="Event Name">{{ item.title }}</md-table-cell>
              <!--<md-table-cell md-label="Occasion">{{ item.occasion }}</md-table-cell>-->
              <md-table-cell md-label="Event Type">{{
                item.eventType ? item.eventType.name : item.eventType
              }}</md-table-cell>
              <md-table-cell md-label="Date">{{ item.eventStartMillis | moment }}</md-table-cell>
              <md-table-cell md-label="Customer Name">{{ item.owner ? item.owner.department : null }}</md-table-cell>
              <md-table-cell
                md-label="Created By"
                style="text-transform: capitalize"
                v-if="item.owner && item.owner.id !== $auth.user.id"
              >
                {{ item.owner.displayName }}
                <span class="small text-primary" style="display: block">{{ item.owner.emailAddress }}</span>
              </md-table-cell>
              <md-table-cell md-label="Created By" v-else>
                You
                <span class="small text-primary" style="display: block">{{
                  item.owner ? item.owner.emailAddress : null
                }}</span>
              </md-table-cell>
              <md-table-cell md-label="# Participants">{{ item.numberOfParticipants }}</md-table-cell>
              <md-table-cell md-label="Budget Per Participant">$ {{ item.budgetPerPerson }}</md-table-cell>
              <md-table-cell md-label="Location">{{ item.location }}</md-table-cell>
              <md-table-cell md-label="Actions" style="white-space: nowrap">
                <!--<md-button @click="viewEvent(item)" class="md-raised md-info md-icon-button">
                  <md-icon>visibility</md-icon>
                </md-button>-->
                <!-- <md-button @click="editEvent($event, item)" class="md-info md-just-icon md-round">
                  <md-icon>edit</md-icon>
                </md-button>-->
                <md-button @click="showDeleteAlert($event, item)" class="md-danger md-just-icon md-round">
                  <md-icon>delete</md-icon>
                </md-button>

                <!-- <div class="float-right"><md-icon>share</md-icon></div>-->
              </md-table-cell>
            </md-table-row>
          </md-table>
          <!--<div class="empty-table text-danger text-center" v-else>
            No events yet,
            <span class="text-link" @click="routeToNewEvent()">
              create one now
            </span>
          </div>-->
        </md-card-content>
      </md-card>
      <md-card class="md-card-plain" v-if="!upcomingEvents.length && !isLoading">
        <md-card-content>
          <div class="text-center mt-5">
            <!-- <img src="https://static-maryoku.s3.amazonaws.com/storage/img/calendar.png" style="width: 120px;" /> -->
            <h3>You do not have any events planned yet</h3>
            <div class="mt-4rem">
              <md-button class="md-info md-red normal-btn" @click="routeToNewEvent">Create New Event</md-button>
              <md-button class="md-red md-simple normal-btn" @click="chooseWorkspace">Choose Workspace</md-button>
            </div>
          </div>
        </md-card-content>
      </md-card>
    </div>

    <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" v-if="recentEvents.length">
      <div class="header text-center">
        <h4 class="title">Recent Events</h4>
      </div>
    </div>

    <div
      class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33 card-link"
      v-for="event in recentEvents"
      :key="event.id"
      @click="routeToEvent(event)"
    >
      <product-card header-animation="true">
        <img class="img" slot="imageHeader" :src="imageHref(event.coverImage)" />

        <h4 slot="title" class="title">
          <a @click="routeToEvent(event)">{{ event.title }}</a>
        </h4>
        <div slot="description" class="card-description">
          {{ event.eventStartMillis | moment }}
        </div>
        <template slot="footer">
          <div class="price">
            <h4>{{ event.numberOfParticipants }} Guests &middot; {{ duration(event) }} hours</h4>
          </div>
          <div class="stats">
            <p class="category">
              <md-icon>place</md-icon>
              {{ event.location }}
            </p>
          </div>
        </template>
      </product-card>
    </div>
  </div>
</template>

<script>
// import auth from '@/auth';
import Vue from "vue";
import { Tabs, ProductCard } from "@/components";

import EventSidePanel from "@/pages/app/Events/EventSidePanel";

import EventModal from "./EventModal/";
import { mapMutations, mapGetters } from "vuex";
import EventPlannerVuexModule from "./EventPlanner.vuex";
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import moment from "moment";
import VueElementLoading from "vue-element-loading";
import Swal from "sweetalert2";
import TeamMember from "@/models/TeamMember";
import _ from "underscore";
import { backgroundImages, quotes } from "@/constants/loadingBackgrounds";
import eventService from "@/services/event.service";
import axios from "axios";
import Loader from "../../../components/loader/Loader";

const imageIndex = new Date().getTime() % backgroundImages.length;
const quoteIndex = new Date().getTime() % quotes.length;
const quote = quotes[quoteIndex];

export default {
  components: {
    Loader,
    Tabs,
    ProductCard,
    VueElementLoading,
    EventModal,
  },
  created() {
    const currentUser = this.$store.state.auth.user;
    if (!currentUser) {
      this.$store.dispatch("auth/logout");
      this.$router.push("/signin");
    } else {
      axios.defaults.headers.common.Authorization = `Bearer ${currentUser.access_token}`;
      let m = new CalendarEvent().get();
      m.then((allEvents) => {
        this.upcomingEvents = allEvents;
        this.isLoading = false;
      }).catch((e) => {
        console.log(e);
      });
    }
    // if (currentUser.currentTenant) {
    // } else {
    //   this.$router.push({ path: "/choose-workspace" });
    // }
  },
  data() {
    return {
      // auth: auth,
      product3: "https://static-maryoku.s3.amazonaws.com/storage/img/shutterstock_289440710.png",
      recentEvents: [],
      upcomingEvents: [],
      isLoading: true,
      imageIndex,
      quoteIndex,
      quote,
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
    openEventModal() {
      this.setModalSubmitTitle("Save");
      this.setEditMode({ editMode: false });

      window.currentPanel = this.$showPanel({
        component: EventModal,
        cssClass: "md-layout-item md-size-45 transition36 bg-grey",
        openOn: "right",
        props: {},
      });
    },

    showDeleteAlert(e, ev) {
      const _this = this;
      e.stopPropagation();
      Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        showCancelButton: true,
        icon: "warning",
        showCancelButton: true,
        confirmButtonClass: "md-button md-success confirm-btn-bg ",
        cancelButtonClass: "md-button md-danger cancel-btn-bg",
        confirmButtonText: "Yes, delete it!",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          _this.isLoading = true;
          let event = _this.upcomingEvents.find((e) => {
            return e.id === ev.id;
          });
          ev.delete()
            .then((result) => {
              _this.upcomingEvents.splice(this.upcomingEvents.indexOf(event), 1);
              _this.isLoading = false;
            })
            .catch(() => {
              _this.isLoading = false;
            });
        }
      });
    },
    editEvent(ev, event) {
      if (ev.target.tagName === "I") {
        ev.stopPropagation();
        this.$router.push({ name: "EditEvent", params: { id: event.id } });
      }
    },
    viewEvent(event) {
      this.$router.push(`/events/${event.id}`);
    },
    imageHref(image) {
      return image && image.href ? `${process.env.SERVER_URL}${image.href}` : this.product3;
    },
    duration(event) {
      return (event.eventEndMillis - event.eventStartMillis) / 3600000;
    },
    routeToEvent(event) {
      const gotoLink = eventService.getFirstTaskLink(event);
      this.$router.push({ path: gotoLink });
    },
    chooseWorkspace() {
      this.$router.push({ path: "/choose-workspace" });
    },
    refreshEvents() {
      this.getCalendarEvents();
    },
    openEventSidePanel(options) {
      window.currentPanel = this.$showPanel({
        component: EventSidePanel,
        cssClass: "md-layout-item md-size-40 transition36 ",
        openOn: "right",
        disableBgClick: false,
        props: {
          modalSubmitTitle: options.modalSubmitTitle,
          editMode: options.editMode,
          sourceEventData: options.eventData,
          refreshEvents: this.refreshEvents,
          year: this.year,
          month: this.month,
          occasionsOptions: this.occasionsArray,
          openInPlannerOption: options.editMode,
        },
      });
    },
    openEditEventModal: function (item) {
      if (!item.editable) {
        item.occasion = item.title;
      }
      debugger;
      this.setEventModalAndEventData({ eventData: item });
      this.setModalSubmitTitle("Save");
      this.openEventSidePanel({
        modalSubmitTitle: "Save",
        editMode: true,
        eventData: item,
      });
    },
    routeToNewEvent() {
      this.$router.push(`/create-event-wizard`);
      // window.currentPanel = this.$showPanel({
      //   component: EventSidePanel,
      //   cssClass: 'md-layout-item md-size-40 transition36 ',
      //   openOn: 'right',
      //   disableBgClick: false,
      //   props: {
      //     modalSubmitTitle: 'Save',
      //     editMode: false,
      //     sourceEventData: {
      //       eventStartMillis: new Date().getTime(),
      //       numberOfParticipants: currentUser.customer.numberOfEmployees
      //     },
      //     refreshEvents: null,
      //     occasionsOptions: null,
      //     openInPlannerOption: false
      //   }
      // })
    },
    getExtraFields(allEvents) {
      allEvents.forEach((item) => {
        if (item.owner) {
          TeamMember.find(item.owner.id).then((owner) => {
            Vue.set(item, "customerName", owner.customer.name);
            Vue.set(item, "plannerEmail", owner.emailAddress);
          });
        }
      });
      return allEvents;
    },
  },

  filters: {
    moment: function (date) {
      return moment(date).format("MMMM Do, GGGG");
    },
  },
  watch: {
    upcomingEvents(newVal, oldVal) {
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss">
.loading-background {
  background-size: cover;
  width: 100vw;
  height: 100vh;
  position: static;
  left: 0;
}
.button-event-creatig .md-ripple {
  background-color: #00bcd4;
}
.card-link .md-card {
  cursor: pointer;
}

.float-right {
  float: right;
}

.hover-row:hover {
  cursor: pointer;
}
.right-align-actions {
  .md-table-cell:last-child,
  .md-table-head:last-child {
    text-align: right;
  }
}

.text-link {
  text-decoration: underline;
  cursor: pointer;
}
</style>
