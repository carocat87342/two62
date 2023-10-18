<template>
  <div :class="[{ 'nav-open': $sidebar.showSidebar }, { rtl: $route.meta.rtlActive }]">
    <notifications></notifications>
    <side-bar :event="eventData"></side-bar>
    <div class="main-panel" style="height: 50%">
      <!-- <top-navbar></top-navbar> -->

      <div :class="{ content: !$route.meta.hideContent }" @click="toggleSidebar">
        <zoom-center-transition :duration="200" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </zoom-center-transition>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-new */
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";

import EventModal from "../../app/Events/EventModal/";
import EventPlannerVuexModule from "../../app/Events/EventPlanner.vuex";

import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import MobileMenu from "./Extra/MobileMenu.vue";
import UserMenu from "./Extra/UserMenu.vue";
import { ZoomCenterTransition } from "vue2-transitions";
// import auth from "src/auth";
import EventSidePanel from "@/pages/app/Events/EventSidePanel";
import SideBar from "@/components/SidebarPlugin/NewSideBar";

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
    SideBar,
  },
  data() {
    return {
      // auth: auth,
      event: null,
      createEventModalOpen: false,
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
  },
  created() {
    this.$store.registerModule("EventPlannerVuex", EventPlannerVuexModule);
  },
  mounted() {
    /*  NEET CODE REVIEW !!!!!!!!!!!!!!!!!!!! */
    // this.$auth.currentUser(this, true, function(){
    //   let docClasses = document.body.classList;
    //   let isWindows = navigator.platform.startsWith("Win");
    //   if (isWindows) {
    //     // if we are on windows OS we activate the perfectScrollbar function
    //     initScrollbar("sidebar");
    //     initScrollbar("sidebar-wrapper");
    //     initScrollbar("main-panel");
    //     docClasses.add("perfect-scrollbar-on");
    //   } else {
    //     docClasses.add("perfect-scrollbar-off");
    //   }
    // });
  },
  computed: {
      ...mapState("event", ["eventData"]),
  },
};
</script>
<style lang="scss" scoped>
.menu-divider {
  height: 1px;
  margin-top: 10px;
  background-color: rgba(0, 0, 0, 0.12);
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
</style>
