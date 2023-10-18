<template>
  <modal class="sync-calendar-modal">
    <template slot="header">
      <md-button class="md-simple md-just-icon md-round modal-default-button" @click="close">
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <div>
        <img :src="`${$iconURL}RSVP/Group+7946.svg`" class="mb-30" />
        <div class="font-size-30 font-bold mb-30 header-text">
          SEE YOU THERE <span class="text-transform-uppercase">{{ rsvp.name }}</span
          >!
        </div>
        <div>
          <md-button
            class="md-simple maryoku-btn"
            :class="{ 'md-red': !showZoomLink, 'md-black': showZoomLink }"
            @click="showZoomLink = !showZoomLink"
          >
            Get Link To Zoom Event
            <md-icon v-if="!showZoomLink">keyboard_arrow_right</md-icon>
            <md-icon v-if="showZoomLink">keyboard_arrow_down</md-icon>
          </md-button>
          <div v-if="showZoomLink">
            <maryoku-input
              inputStyle="sharing"
              readonly
              class="sharelink"
              v-model="campaign.additionalData.zoomlink"
            ></maryoku-input>
          </div>
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
      Promise.resolve(this.api.auth2.getAuthInstance().signIn()).then((_) => {
        this.authorized = true;
        const timeZoneName = convertTimezoneName(this.campaign.event.timezone);
        var event = {
          summary: this.campaign.event.title,
          location: this.campaign.event.location,
          description: this.campaign.event.concept ? this.campaign.event.concept.description : "",
          start: {
            dateTime: moment.tz(this.campaign.event.eventStartMillis, timeZoneName).format(),
            timeZone: timeZoneName,
          },
          end: {
            dateTime: moment.tz(this.campaign.event.eventEndMillis, timeZoneName).format(),
            timeZone: timeZoneName,
          },
          recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
          attendees: this.campaign.guestEmails,
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
          // appendPre("Event created: " + event.htmlLink);
          console.log(event.htmlLink);
          Swal.fire({
            title: "Thank you for your attending!",
            text: `See you there!`,
            showCancelButton: false,
            confirmButtonClass: "md-button md-success btn-fill",
            cancelButtonClass: "md-button md-danger btn-fill",
            confirmButtonText: "OK",
            buttonsStyling: false,
          }).then((result) => {
            vm.$emit("scheduled");
          });
        });
      });
    },
    handleMsAuthClick() {
      const timeZoneName = convertTimezoneName(this.campaign.event.timezone);
      let newEvent = {
        subject: this.campaign.event.title,
        start: {
          dateTime: moment.tz(this.campaign.event.eventStartMillis, timeZoneName).format(),
          timeZone: timeZoneName,
        },
        end: {
          dateTime: moment.tz(this.campaign.event.eventEndMillis, timeZoneName).format(),
          timeZone: timeZoneName,
        },
      };

      if (this.campaign.guestEmails) {
        newEvent.attendees = [];

        for (const attendee of this.campaign.guestEmails) {
          newEvent.attendees.push({
            type: "required",
            emailAddress: {
              address: attendee.email,
            },
          });
        }
      }

      if (this.campaign.event.concept) {
        newEvent.body = {
          contentType: "text",
          content: this.campaign.event.concept.description,
        };
      }
      const vm = this;
      addOutlookCalendarEvent(newEvent)
        .then(() => {
          swal({
            title: "Thank you for your attending!",
            text: `See you there!`,
            showCancelButton: false,
            confirmButtonClass: "md-button md-success btn-fill",
            cancelButtonClass: "md-button md-danger btn-fill",
            confirmButtonText: "OK",
            buttonsStyling: false,
          }).then((result) => {
            vm.$emit("scheduled");
          });
        })
        .catch((error) => {
          swal({
            title: "Sorry something is wrong!",
            text: `Please try again.`,
            showCancelButton: false,
            confirmButtonClass: "md-button md-success btn-fill",
            cancelButtonClass: "md-button md-danger btn-fill",
            confirmButtonText: "OK",
            buttonsStyling: false,
          }).then((result) => {
            vm.$emit("scheduled");
          });
        });
      // handle response
    },
    syncCalendar() {
      if (this.emailAccount === "google") {
        this.handleGoogleAuthClick();
      } else if (this.emailAccount === "outlook") {
        this.handleMsAuthClick();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.sync-calendar-modal {
  .header-text {
    line-height: 1.5em;
  }
  .sync_button {
    width: 250px;
    height: 50px;
    border: solid 1px #f51355;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  }
}
</style>