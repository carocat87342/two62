<template>
  <div :class="[{ 'nav-open': $sidebar.showSidebar }, { rtl: $route.meta.rtlActive }]">
    <div class="main-panel" style="height: 50%">
      <notifications></notifications>
      <div :class="{ content: !$route.meta.hideContent }" @click="toggleSidebar" style="padding-right: 0">
        <side-bar :event="eventData"></side-bar>
        <zoom-center-transition :duration="200" mode="out-in">
          <router-view></router-view>
        </zoom-center-transition>
      </div>
    </div>
  </div>
</template>

<script>
import { ZoomCenterTransition } from "vue2-transitions";
import SideBar from "@/components/SidebarPlugin/NewSideBar";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  components: {
    ZoomCenterTransition,
    SideBar,
  },
  data() {
    return {};
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
  computed: {
    ...mapState("event", ["eventData"]),
  },
  mounted() {
    console.log("profile.mounted");
  },
};
</script>

