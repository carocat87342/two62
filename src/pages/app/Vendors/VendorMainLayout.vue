<template>
  <div :class="[{ 'nav-open': $sidebar.showSidebar }, { rtl: $route.meta.rtlActive }]">
    <div class="main-panel" style="height: 50%">
      <notifications></notifications>
      <div :class="{ content: !$route.meta.hideContent }" @click="toggleSidebar" style="padding-right: 0">
        <side-bar :event="eventData"></side-bar>
        <loader :active="loading" page="vendor"></loader>
        <zoom-center-transition v-if="!loading" :duration="200" mode="out-in">
          <router-view></router-view>
        </zoom-center-transition>
      </div>
    </div>
  </div>
</template>

<script>
import { ZoomCenterTransition } from "vue2-transitions";
import SideBar from "@/components/SidebarPlugin/VendorSideBar";
import Loader from "@/components/loader/Loader.vue";
import { mapState } from "vuex";
import state from "./VendorDashboard/state";

export default {
  components: {
    ZoomCenterTransition,
    SideBar,
    Loader,
  },
  data() {
    return {
      loading : true
    };
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
  beforeCreate() {
    if(this.$store.state.auth.user){
      this.$store.dispatch('auth/checkToken', this.$store.state.auth.user.access_token).then(user => {

      }).catch(err => this.$router.push({ path: `/vendor/signin`}));
    } else {
      this.$router.push({ path: `/vendor/signin`});
    }

    if (!this.$store.state.vendorDashboard) {
      this.$store.registerModule("vendorDashboard", state);
    }
  },
  async mounted() {

    this.loading = true;
    let vendor = await this.$store.dispatch("vendor/getProfile");
    await this.$store.dispatch("vendorDashboard/getProposalRequests", vendor.id);
    this.loading = false;
  },
};
</script>

