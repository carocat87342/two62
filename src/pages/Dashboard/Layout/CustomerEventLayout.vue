<template>
  <div>
    <div class="main-panel">
        <Loader :active="loading" :isFullScreen="true"></Loader>
        <!-- your content here -->
        <div v-if="!loading">
            <zoom-center-transition :duration="200" mode="out-in">
                <router-view></router-view>
            </zoom-center-transition>
        </div>

    </div>
  </div>
</template>
<script>
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { Loader } from "@/components";
import EventGuestVuexModule from "../../app/Guest/EventGuest.vuex";
import { ZoomCenterTransition, FadeTransition } from "vue2-transitions";

export default {
  components: {
    Loader,
    ZoomCenterTransition,
    FadeTransition,
  },
  data() {
    return {
      // auth: auth,
      event: null,
      loading: true,
    };
  },
  methods: {
    ...mapMutations("EventGuestVuex", [
    ]),
    ...mapActions("event", ["getEventAction"]),

    async initData() {
      const id = this.$route.params.id;
        console.log('initData', id);
      await this.$store.dispatch("EventGuestVuex/getUserEvent", {id});
      await this.$store.dispatch("common/fetchAllCategories");
      // await this.$store.dispatch("common/getEventTypes");
    },
  },
  created() {
    this.$store.registerModule("EventGuestVuex", EventGuestVuexModule);
  },
  async mounted() {
    try{
        await this.$store.dispatch("auth/checkToken", this.loggedInUser.access_token)
        await this.initData();
        this.loading = false;
    }catch (e) {
        this.$router.push({ path: `/signin` });
    }
  },
  computed: {
    ...mapState("event", ["eventData"]),
    loggedInUser(){
       return this.$store.state.auth.user;
    }
  },
};
</script>
<style lang="scss">

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
