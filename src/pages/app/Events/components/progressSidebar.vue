<template>
  <div class="progress-sidebar">
    <div class="summer-party">
      <md-button class="md-default md-sm md-simple expand-sidebar">
        <img :src="`${$iconURL}Timeline-New/expand.svg`" />
      </md-button>
      <div class="title-label">
        summer party
        <small>checklist</small>
      </div>
      <div class="completion-progress">
        <div class="progress-done"></div>
      </div>
      <div class="percentage">
        <ul>
          <li class="green-label">56%</li>
          <li class>17 of 26</li>
        </ul>
      </div>
      <div class="small-label">Things are warming up!</div>
      <transition name="slide">
        <event-note-panel v-if="isOpenNote"></event-note-panel>
      </transition>

      <div class="my-notes">
        <md-button v-if="!isOpenNote" class="md-red" @click="isOpenNote = true">
          <img :src="`${$iconURL}Event Page/note-light.svg`" width="20" style="margin: 0 3px" />
          On my plate
          <md-icon style="font-size: 30px !important; margin-left: 5px">keyboard_arrow_down</md-icon>
        </md-button>
        <md-button v-if="isOpenNote" class="md-red" @click="isOpenNote = false">
          <img :src="`${$iconURL}Event Page/note-light.svg`" width="20" style="margin: 0 3px" />
          Close
          <md-icon style="font-size: 30px !important; margin-left: 5px">keyboard_arrow_up</md-icon>
        </md-button>
      </div>
    </div>
    <div class="progress-sidebar-content">
      <!-- Event Elements -->
      <div class="event-elements">
        <draggable :list="eventElements">
          <div
            class="event-elements__item"
            @click="goToRoute(item, index)"
            :class="{
              current: isActiveRoute(item),
              progress_100: item.progress === 100,
              progress_25: item.progress === 25,
              progress_30: item.progress === 30,
              progress_50: item.progress === 50,
              progress_75: item.progress === 75,
            }"
            v-for="(item, index) in eventElements"
            :id="item.id"
            :key="index"
          >
            <div class="item-title">
              <img
                v-if="item.status === 'completed' || item.progress === 100"
                :src="`${$iconURL}budget+screen/SVG/Asset%2032.svg`"
                width="25"
              />
              <img :src="item.icon" v-if="isActiveRoute(item)" width="25" style="max-width: 25px; max-height: 25px" />
              {{ item.title }}
            </div>
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

import moment from "moment";
import Swal from "sweetalert2";
import { SlideYDownTransition } from "vue2-transitions";
import InputMask from "vue-input-mask";
import VueElementLoading from "vue-element-loading";
import draggable from "vuedraggable";
import { Drag, Drop } from "vue-drag-drop";
import _ from "underscore";

import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import EventComponent from "@/models/EventComponent";
import EventTimelineItem from "@/models/EventTimelineItem";
import { SideBar, SidebarItem } from "@/components";

import EventBlocks from "../components/NewEventBlocks";
import EventNotePanel from "../components/EventNotePanel";

export default {
  name: "progress-sidebar",
  components: {
    VueElementLoading,
    EventBlocks,
    draggable,
    Drag,
    Drop,
    SlideYDownTransition,
    InputMask,
    SideBar,
    SidebarItem,
    EventNotePanel,
  },
  props: {
    // event: Object,
    // eventComponents: [Array, Function]
  },
  data: () => ({
    isLoading: true,
    isOpenNote: false,
    eventElements: [],
    currentUrl: "",
    calendar: null,
    // event: {}
  }),
  computed: {
    ...mapState("event", {
      eventData: (state) => state.eventData,
    }),
  },
  methods: {
    ...mapActions("event", ["getEventAction"]),
    isActiveRoute(item) {
      if (this.currentUrl.indexOf(item.route) > -1) {
        return "current";
      }
      return "";
    },
    goToRoute(item, index) {
      let vm = this;
      this.$router.push(`/events/${this.event.id}/${item.route}`);
    },
    generatedItems(event) {
      console.log(event.concept, "event.concept");
      const concept = {
        title: "Choose Concept",
        status: event.conceptProgress === 100 && event.concept ? "completed" : "not-complete",
        route: "booking/concept",
        icon: `${this.$iconURL}Timeline-New/timeline-title.svg`,
        progress: event.concept ? event.conceptProgress : 0,
        componentId: "concept",
        id: "control-panel",
      };
      const budget = {
        title: this.event.budgetProgress <= 50 ? "Create Budget" : "Approve Budget",
        status: "not-complete",
        route: this.event.budgetProgress == 100 ? "edit/budget" : "booking/budget",
        icon: `${this.$iconURL}budget+screen/SVG/Asset%2010.svg`,
        progress: this.event.budgetProgress,
        componentId: "budget",
        id: "budget-panel",
      };
      const timeline = {
        title: "Generate timeline",
        status: event.timelineProgress === 100 ? "completed" : "not-complete",
        route: "booking/timeline",
        icon: `${this.$iconURL}Timeline-New/timeline-title.svg`,
        progress: event.timelineProgress,
        componentId: "timeline",
        id: "timeline-panel",
      };
      const campaign = {
        title: "Create Campaigns",
        status: "current",
        route: "booking/campaign",
        icon: `${this.$iconURL}Campaign/Group 8857.svg`,
        progress: 0,
        componentId: "campaign",
      };
      const elements = [];
      if (this.event.eventType.hasConcept) {
        elements.push(concept);
      }
      elements.push(budget);
      elements.push(timeline);
      elements.push(campaign);

      const vm = this;
      new EventComponent()
        .for(this.calendar, event)
        .get()
        .then((resp) => {
          // resp.sort((a, b) => a.order - b.order);
          resp.forEach((item) => {
            if (item.componentId !== "unexpected") {
              elements.push({
                title: item.bookTitle,
                status: "not-complete",
                route: "booking/" + item.id,
                icon: `https://static-maryoku.s3.amazonaws.com/storage/icons/Budget+Elements/${item.componentId}.svg`,
              });
            }
          });
          vm.eventElements = elements;
        });
    },
    setConstantStates(event) {
      const conceptIndex = this.eventElements.findIndex((item) => item.componentId === "concept");
      const budgetIndex = this.eventElements.findIndex((item) => item.componentId === "budget");
      const timelineIndex = this.eventElements.findIndex((item) => item.componentId === "timeline");
      const campaignIndex = this.eventElements.findIndex((item) => item.componentId === "campaign");

      if (conceptIndex >= 0) {
        this.eventElements[conceptIndex].progress = event.conceptProgress;
        this.eventElements[conceptIndex].status = event.conceptProgress == 100 ? "completed" : "not-complete";
      }
      if (budgetIndex >= 0) {
        this.eventElements[budgetIndex].progress = event.budgetProgress;
        this.eventElements[budgetIndex].status = event.budgetProgress == 100 ? "completed" : "not-complete";
      }
      if (timelineIndex >= 0) {
        this.eventElements[timelineIndex].progress = event.timelineProgress;
        this.eventElements[timelineIndex].status = event.timelineProgress == 100 ? "completed" : "not-complete";
      }
      if (campaignIndex >= 0) {
        this.eventElements[campaignIndex].progress = event.timelineProgress;
        this.eventElements[campaignIndex].status = event.timelineProgress == 100 ? "completed" : "not-complete";
      }
    },
    fetchUrl() {
      this.currentUrl = this.$router.history.current.path;
    },
  },
  created() {
    this.fetchUrl();
    const currentUser = this.$store.state.auth.user;
    this.calendar = new Calendar({ id: currentUser.profile.defaultCalendarId });
    this.event = this.$store.state.event.eventData;
    this.generatedItems(this.event);
  },
  mounted() {},
  watch: {
    $route: "fetchUrl",
    event(newValue) {
      this.setConstantStates(newValue);
    },
    eventData(newValue) {
      this.setConstantStates(newValue);
    },
  },
};
</script>
<style lang="scss">
</style>
