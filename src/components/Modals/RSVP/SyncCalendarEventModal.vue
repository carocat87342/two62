<template>
  <modal>
    <template slot="header">
      <md-button class="md-simple md-just-icon md-round modal-default-button" @click="close">
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <div>
        <img :src="`${$iconURL}RSVP/Group+7946.svg`" class="mb-30" />
        <div class="font-size-30 font-bold mb-30">
          SEE YOU THERE
          <span class="text-transform-uppercase"> {{ rsvp.name }} </span>!
        </div>
        <div>
          <md-button
            class="md-simple maryoku-btn"
            :class="{ 'md-red': !showCalendar, 'md-black': showCalendar }"
            @click="showCalendar = !showCalendar"
          >
            Sync Your Calendar
            <md-icon v-if="!showCalendar">keyboard_arrow_right</md-icon>
            <md-icon v-if="showCalendar">keyboard_arrow_down</md-icon>
          </md-button>
          <div v-if="showCalendar">
            <div>Choose your email account:</div>
            <div class="mt-30">
              <md-radio v-model="emailAccount" class="mr-60" value="google">
                <img :src="`${$iconURL}common/google.svg`" style="margin-top: -10px; width: 40px" />
              </md-radio>
              <md-radio v-model="emailAccount" value="outlook">
                <img :src="`${$iconURL}common/outlook.svg`" style="margin-top: -10px; width: 40px" />
              </md-radio>
            </div>
            <md-button class="md-outlined md-simple md-red mt-20 sync_button" @click="syncCalendar">Sync</md-button>
          </div>
        </div>
      </div>
    </template>
    <template slot="footer"> </template>
  </modal>
</template>
<script>
import { Modal, MaryokuInput } from "@/components";
// Client ID and API key from the Developer Console
const CLIENT_ID = "1016422269325-8bhm78m73gebu9k38nj61nr2246r1a1h.apps.googleusercontent.com";
const API_KEY = "AIzaSyCuHr_Quojoaxqw9dWHgbPHItxfsZAYKsY";
// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

export default {
  components: {
    Modal,
    MaryokuInput,
  },
  props: {
    screen: {
      type: Number,
      default: 1,
    },
    campaign: {
      type: Object,
      default: () => {},
    },
    rsvp: [Object],
  },
  created() {
    console.log(this.campaign);
    this.api = gapi;
    this.initClient();
  },
  data() {
    return {
      showZoomLink: false,
      showCalendar: false,
      emailAccount: "outlook",
      authorized: false,
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    setRsvpToZoom() {
      this.$emit("setRSVP");
    },
    initClient() {},

    handleAuthClick() {
      Promise.resolve(this.api.auth2.getAuthInstance().signIn()).then((_) => {
        this.authorized = true;
      });
    },
    syncCalendar() {
      if (this.emailAccount === "google") {
        this.handleAuthClick();
        // this.$gapi._load().then((gapi) => {
        //   console.log("gapi object :", gapi);

        // });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.sync_button {
  width: 250px;
  height: 50px;
  border: solid 1px #f51355;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
}
</style>