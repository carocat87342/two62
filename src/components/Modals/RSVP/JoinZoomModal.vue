<template>
  <modal class="rsvp-modal join-zoom-modal">
    <template slot="header">
      <div class="">
        <img :src="`${$iconURL}RSVP/Group 9565.svg`" class="mr-30 logo" style="margin-top: -10px" />
        <span class="font-size-30 font-bold-extra header-title">CELEBRATE WITH US VIRTUALLY ON ZOOM</span>
      </div>
      <md-button class="md-simple md-just-icon md-round modal-default-button" @click="close">
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <div class="text-left">
        <div class="information-section">
          <div class="mb-20">
            <img :src="`${$iconURL}RSVP/Path+251.svg`" class="mr-10" />
            <span class="font-bold font-size-20">Join Zoom Event</span>
          </div>
          <div>Just fill & approve, We will add event to your calendar & Remind you before</div>
        </div>
        <div class="d-flex user-info">
          <div class="text-left flex-1 input-wrapper mr-10">
            <label class="font-bold">Name</label>
            <maryoku-input
              v-model="name"
              v-validate.initial="validations.name"
              inputStyle="username"
              placeholder="Type your name here..."
            ></maryoku-input>
          </div>
          <div class="text-left flex-1 input-wrapper">
            <label class="font-bold">Email</label>
            <maryoku-input
              v-model="email"
              v-validate.initial="validations.email"
              inputStyle="email"
              placeholder="Type email address here..."
            ></maryoku-input>
          </div>
        </div>
        <div class="d-flex user-info" v-if="isCustomerEvent">
          <div class="text-left flex-1 input-wrapper mr-10">
            <label class="font-bold">Role</label>
            <maryoku-input v-model="role" placeholder="Type your role here..."></maryoku-input>
          </div>
          <div class="text-left flex-1 input-wrapper">
            <label class="font-bold">Company Name</label>
            <maryoku-input v-model="companyName" placeholder="Type company name here..."></maryoku-input>
          </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div class="text-center w-100">
        <md-button class="md-red md-bold" @click="setRsvpToZoom" :disabled="!canSet">RSVP TO ZOOM</md-button>
      </div>
    </template>
  </modal>
</template>
<script>
import { Modal, MaryokuInput } from "@/components";
import CalendarEvent from "@/models/CalendarEvent";
const CLIENT_ID = "1016422269325-8bhm78m73gebu9k38nj61nr2246r1a1h.apps.googleusercontent.com";
const API_KEY = "AIzaSyCuHr_Quojoaxqw9dWHgbPHItxfsZAYKsY";
// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/calendar";
export default {
  props: {
    event: {
      type: Object,
      default: () => {},
    },
    campaign: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    Modal,
    MaryokuInput,
  },
  created() {
    this.api = window.gapi;
    console.log(this.api);
    this.handleClientLoad();
  },
  data() {
    return {
      name: "",
      email: "",
      role: "",
      companyName: "",
      approveAccessCalendar: false,
      calendarType: "outlook",
      validations: {
        name: {
          required: true,
        },
        email: {
          required: true,
          email: true,
        },
      },

      items: undefined,
      api: undefined,
      authorized: false,
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    setRsvpToZoom() {
      const guests = [
        {
          name: this.name,
          email: this.email,
          guestNumber: 1,
          isMainGuest: true,
          event: new CalendarEvent({ id: this.campaign.event.id }),
        },
      ];
      this.$emit("setRsvp", {
        name: this.name,
        responseEmail: this.email,
        guests,
        role: this.role,
        companyName: this.companyName,
      });
    },

    handleClientLoad() {
      this.api.load("client:auth2", this.initClient);
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

    handleAuthClick(event) {
      Promise.resolve(this.api.auth2.getAuthInstance().signIn()).then((_) => {
        this.authorized = true;
      });
    },

    handleSignoutClick(event) {
      Promise.resolve(this.api.auth2.getAuthInstance().signOut()).then((_) => {
        this.authorized = false;
      });
    },

    getData() {
      let vm = this;

      vm.api.client.calendar.events
        .list({
          calendarId: "primary",
          timeMin: new Date().toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: "startTime",
        })
        .then((response) => {
          vm.items = this.syntaxHighlight(response.result.items);
          console.log(vm.items);
        });
    },

    syntaxHighlight(json) {
      if (typeof json != "string") {
        json = JSON.stringify(json, undefined, 2);
      }
      json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        (match) => {
          var cls = "number";
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = "key";
            } else {
              cls = "string";
            }
          } else if (/true|false/.test(match)) {
            cls = "boolean";
          } else if (/null/.test(match)) {
            cls = "null";
          }
          return '<span class="' + cls + '">' + match + "</span>";
        },
      );
    },
  },
  computed: {
    canSet() {
      return this.errors.items.length == 0;
    },
    isCustomerEvent() {
      return this.event.guestType === "Customers" || this.event.guestType === "Business Associates";
    },
  },
};
</script>
<style lang="scss" scoped>
.join-zoom-modal {
}
.user-info {
  padding: 30px 0;
  .input-wrapper {
    width: 50%;
    &:first-child {
      padding-right: 35px;
    }
  }
}
.calendar-type {
  padding-left: 45px;
  img {
    margin-top: -45px;
    margin-right: 20px;
  }
}
@media only screen and (max-width: 959px) {
  .join-zoom-modal {
    .logo {
      width: 70px;
    }
    .header-title {
      display: block;
      font-size: 26px !important;
      line-height: 1.1em;
    }
    .user-info {
      flex-direction: column;
      .input-wrapper {
        width: 100%;
        padding: 0px;
        margin-bottom: 20px;
        label {
          display: none;
        }
      }
    }
  }
}
</style>