<template>
  <div class="event-plan">
    <progress-sidebar :elements="barItems" page="plan" @change="changeCheckList"></progress-sidebar>
    <router-view></router-view>
  </div>
</template>
<script>
import ProgressSidebar from "./components/progressSidebarForEvent";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

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
    ...mapState("EventGuestVuex", {
      eventData: (state) => state.eventData,
    }),
    event() {
      return this.$store.state.EventGuestVuex.eventData;
    },
    user(){
      return this.$store.state.auth.user;
    },
    barItems() {
      // if (!this.event.checkList) {
      const overview = {
        title: "Your Event",
        status: "not-completed",
        route: "booking/overview",
        progress: 0,
        componentId: "overview",
        icon: `${this.$iconURL}customer icons/flag.svg`,
        id: "overview-item",
      };

      const planningBoard = {
        title: "Event Requirements",
        status: this.event.requirementProgresss === 100 ? "completed" : "not-complete",
        route: "booking/planningboard",
        icon: `${this.$iconURL}customer icons/Path 12479.svg`,
        progress: 0,
        componentId: "planningboard",
        id: "planningboard-item",
      };
      const chooseVendor = {
        title: "Proposals & Booking",
        status: "not-complete",
        route: "booking/choose-vendor",
        icon: `${this.$iconURL}customer icons/Group 21326.svg`,
        progress: 0,
        componentId: "chooseVendor",
        id: "bookingboard-item",
      };
      const inbox = {
        title: "Inbox",
        status: "not-complete",
        route: "booking/index",
        icon: `${this.$iconURL}customer icons/Group 21436.svg`,
        progress: 0,
        componentId: "inbox",
        id: "bookingboard-item",
      };
      const elements = [];

      console.log('user', this.user);

      elements.push(overview);
      elements.push(planningBoard);
      elements.push(chooseVendor);
      elements.push(inbox);

      console.log("elemetes", elements);
      return elements;
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

</style>
