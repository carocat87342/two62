<template>
  <div class="event-plan">
    <progress-sidebar :elements="barItems" page="plan" @change="changeCheckList"></progress-sidebar>
    <router-view></router-view>
  </div>
</template>
<script>
import ProgressSidebar from "./components/progressSidebarForEvent";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";

export default {
  components: {
    ProgressSidebar,
  },
  data() {
    return {
      eventElements: [],
      pageId: "",
      resevedPages: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    ...mapState("event", {
      eventData: (state) => state.eventData,
    }),
    event() {
      return this.$store.state.event.eventData;
    },
    user(){
      return this.$store.state.auth.user;
    },
    barItems() {
      // if (!this.event.checkList) {
      const overview = {
        title: "Create an event to remember",
        status: "completed",
        route: "overview",
        // icon: `${this.$iconURL}Timeline-New/timeline-title.svg`,
        progress: 100,
        componentId: "overview",
        id: "overview-item",
      };
      const concept = {
        title: "Get Inspired",
        status: this.event.concept && this.event.conceptProgress === 100 ? "completed" : "not-complete",
        route: "booking/concept",
        icon: `${this.$iconURL}Timeline-New/timeline-title.svg`,
        progress: this.event.concept ? this.event.conceptProgress : 0,
        componentId: "concept",
        id: "concept-item",
      };
      const budget = {
        title: "Craft Event Budget",
        status: "not-complete",
        route: this.event.budgetProgress == 100 ? "edit/budget" : "booking/budget",
        icon: `${this.$iconURL}budget+screen/SVG/Asset%2010.svg`,
        progress: this.event.budgetProgress,
        componentId: "budget",
        id: "budget-item",
      };
      const timeline = {
        title: "Set The Schedule",
        status: this.event.timelineProgress === 100 ? "completed" : "not-complete",
        route: "booking/timeline",
        icon: `${this.$iconURL}Timeline-New/timeline-title.svg`,
        progress: this.event.timelineProgress,
        componentId: "timeline",
        id: "timeline-item",
      };
      const campaign = {
        title: "Communicate With Guests",
        status: this.event.campaignProgress === 100 ? "completed" : "not-complete",
        route: "booking/campaign",
        icon: `${this.$iconURL}Campaign/Group 8857.svg`,
        progress: this.event.campaignProgress,
        componentId: "campaign",
        id: "campaign-item",
      };
      const planningBoard = {
        title: "Set Requirements",
        status: this.event.requirementProgresss === 100 ? "completed" : "not-complete",
        route: "booking/planningboard",
        icon: `${this.$iconURL}Campaign/Group 8857.svg`,
        progress: this.event.requirementProgress,
        componentId: "planningboard",
        id: "planningboard-item",
      };
      const chooseVendor = {
        title: "Booking Vendors",
        status: "not-complete",
        route: "booking/choose-vendor",
        icon: `${this.$iconURL}Campaign/Group 8857.svg`,
        progress: this.event.campaignProgress,
        componentId: "chooseVendor",
        id: "bookingboard-item",
      };
      const elements = [];

      console.log('user', this.user);
      if (this.user.currentUserType === 'planner') {
          elements.push(overview);
          elements.push(concept);
          elements.push(budget);
          elements.push(timeline);
          elements.push(campaign);
          elements.push(planningBoard);
          if (this.event.processingStatus === "accept-proposal") {
              elements.push(chooseVendor);
          }
      } else if(this.user.currentUserType === 'guest') {
          elements.push(overview);
          elements.push(planningBoard);
          elements.push(chooseVendor);
      }


      // show when you approve budget
      // if (this.event.budgetProgress == 100) {
      //   this.event.components.sort((a, b) => a.order - b.order);
      //   this.event.components.forEach((item) => {
      //     if (item.componentId !== "unexpected") {
      //       elements.push({
      //         title: item.bookTitle,
      //         status: "not-complete",
      //         route: "booking/" + item.id,
      //         icon: `${this.$iconURL}Budget+Elements/${item.icon}`,
      //         progress: item.progress ? item.progress : 0,
      //         id: item.id,
      //       });
      //     }
      //   });
      // }

      console.log("elemetes", elements);
      return elements;
      // } else {
      //   return this.event.checkList;
      // }
    },
  },
  methods: {
    setConstantStates(event) {
      console.log("setConstantStates");
      const overviewIndex = this.eventElements.findIndex((item) => item.componentId === "overview");
      const conceptIndex = this.eventElements.findIndex((item) => item.componentId === "concept");
      const budgetIndex = this.eventElements.findIndex((item) => item.componentId === "budget");
      const timelineIndex = this.eventElements.findIndex((item) => item.componentId === "timeline");
      const campaignIndex = this.eventElements.findIndex((item) => item.componentId === "campaign");

      if (overviewIndex >= 0) {
        // this.eventElements[conceptIndex].progress = event.conceptProgress;
        // this.eventElements[conceptIndex].status =
        //         event.conceptProgress == 100 ? "completed" : "not-complete";
      }
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
    fetchData() {
      this.pageId = this.$route.params.blockId ? this.$route.params.blockId : "timeline";
      console.log('eventPlan', this.event);
    },
    changeCheckList(e) {
      console.log("changeCheckList", e);
      const updatedEvent = new CalendarEvent({
        id: this.event.id,
        calendar: new Calendar({
          id: this.event.calendar.id,
        }),
        checkList: e,
        reSchedule: false,
        reCalculate: false,
      });
      this.$store.dispatch("event/saveEventAction", updatedEvent).then((res) => {
        console.log("plan.updateEvent", res);
      });
    },
  },
  created() {},
  watch: {
    $route: "fetchData",
    event(newValue) {
      console.log("event");
      this.setConstantStates(newValue);
    },
    eventData(newValue) {
      console.log("eventData");
      this.setConstantStates(newValue);
    },
  },
};
</script>
<style lang="scss">
@import "../../styles/EventPlan.scss";
</style>
