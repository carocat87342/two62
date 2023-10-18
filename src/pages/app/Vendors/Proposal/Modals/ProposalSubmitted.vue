
<template>
  <modal class="send-proposal-modal">
    <template slot="header">
      <md-button class="md-simple md-just-icon md-round modal-default-button" @click="close">
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <div>
        <img :src="`${$iconURL}NewSubmitPorposal/Group 17403.svg`" />
        <div class="font-size-30 font-bold mt-20 color-purple">Hooray! your proposal sent successfully</div>
        <div class="mt-20">To:mayaetti@gmail.com</div>
        <div class="mt-40">A copy will be sent to your email</div>
        <div class="mt-20">
          <md-button class="md-vendor maryoku-btn" @click="goToDashboard">Cool, Back To Dashboard</md-button>
        </div>
      </div>
    </template>
    <template slot="footer"> </template>
  </modal>
</template>
<script>
import { Modal, MaryokuInput } from "@/components";
import { convertTimezoneName } from "@/utils/helperFunction";
import moment from "moment-timezone";
import { addOutlookCalendarEvent } from "@/auth/msAuth.js";

// Client ID and API key from the Developer Console
const CLIENT_ID = "1016422269325-8bhm78m73gebu9k38nj61nr2246r1a1h.apps.googleusercontent.com";
const API_KEY = "AIzaSyCuHr_Quojoaxqw9dWHgbPHItxfsZAYKsY";
// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events";

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
    events: [Array],
  },
  created() {
    this.api = gapi;
    this.api.load("client:auth2", this.initClient);
  },
  data() {
    return {
      showZoomLink: false,
      showCalendar: false,
      sender: "outlook",
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
    initClient() {
      let vm = this;

      vm.api.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then((_) => {
          // Listen for sign-in state changes.
          vm.api.auth2.getAuthInstance().isSignedIn.listen(vm.authorized);
        });
    },

    handleGoogleAuthClick() {
      var zone_name = moment.tz.guess();
      var timezone = moment.tz(zone_name).zoneAbbr();
      const timeZoneName = convertTimezoneName(timezone);
      console.log(timeZoneName);

      Promise.resolve(this.api.auth2.getAuthInstance().signIn()).then((_) => {
        this.authorized = true;
        this.events.forEach((e) => {
          var event = {
            summary: e.customer.name,
            location: e.location,
            description: "",
            start: {
              dateTime: moment(e.startTime).toDate(),
              timeZone: timeZoneName,
            },
            end: {
              dateTime: moment(e.endTime).toDate(),
              timeZone: timeZoneName,
            },
            recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
            reminders: {
              useDefault: false,
              overrides: [
                { method: "email", minutes: 24 * 60 },
                { method: "popup", minutes: 10 },
              ],
            },
          };

          var request = gapi.client.calendar.events.insert({
            calendarId: "primary",
            resource: event,
          });

          const vm = this;
          request.execute(function (event) {
            console.log(event.htmlLink);
          });
        });
      });
    },
    handleMsAuthClick() {
      this.events.forEach((e) => {
        let newEvent = {
          subject: e.customer.name,
          start: {
            dateTime: moment(e.startTime).toDate(),
            timeZone: "GMT",
          },
          end: {
            dateTime: moment(e.startTime).toDate(),
            timeZone: "GMT",
          },
        };
        const vm = this;
        addOutlookCalendarEvent(newEvent)
          .then(() => {})
          .catch((error) => {});
      });
    },
    syncCalendar() {
      if (this.sender === "google") {
        this.handleGoogleAuthClick();
      } else if (this.sender === "outlook") {
        this.handleMsAuthClick();
      }
    },
    goToDashboard() {
      this.close();
      this.$router.push(`/vendor/dashboard`);
    },
  },
};
</script>
<style lang="scss" scoped>
.send-proposal-modal {
  .header-text {
    line-height: 1.5em;
  }
  .sync_button {
    width: 250px;
    height: 50px;
    border: solid 1px #641856;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  }
  .tips {
    max-width: 500px;
  }
  .calendar-selector {
    background-color: #f3f7fd;
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    cursor: pointer;
    &.active {
      background-color: #641856;
      color: white;
    }
  }
}
</style>
