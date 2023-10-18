<template>
  <div>
    <div class="authentification">
      <h2>VueJS + Google Calendar Example</h2>
      Authentification
      <button v-if="!authorized" @click="handleAuthClick">Sign In</button>
      <button v-if="authorized" @click="handleSignoutClick">Sign Out</button>
    </div>
    <hr />
    <button v-if="authorized" @click="getData">Get Data</button>
    <div class="item-container" v-if="authorized && items">
      <pre v-html="items"></pre>
    </div>
  </div>
</template>
<script>
// Client ID and API key from the Developer Console
const CLIENT_ID = "1016422269325-8bhm78m73gebu9k38nj61nr2246r1a1h.apps.googleusercontent.com";
const API_KEY = "AIzaSyCuHr_Quojoaxqw9dWHgbPHItxfsZAYKsY";

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/calendar";

export default {
  data() {
    return {
      items: undefined,
      api: undefined,
      authorized: false,
    };
  },

  created() {
    this.api = gapi;
    this.handleClientLoad();
  },

  methods: {
    /**
     *  On load, called to load the auth2 library and API client library.
     */
    handleClientLoad() {
      this.api.load("client:auth2", this.initClient);
    },

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
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

    /**
     *  Sign in the user upon button click.
     */
    handleAuthClick(event) {
      let vm = this;
      Promise.resolve(this.api.auth2.getAuthInstance().signIn()).then((_) => {
        this.authorized = true;
        var event = {
          summary: "Google I/O 2015",
          location: "800 Howard St., San Francisco, CA 94103",
          description: "A chance to hear more about Google's developer products.",
          start: {
            dateTime: "2021-01-28T09:00:00-07:00",
            timeZone: "America/Los_Angeles",
          },
          end: {
            dateTime: "2021-01-28T10:00:00-07:00",
            timeZone: "America/Los_Angeles",
          },
          recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
          attendees: [{ email: "lpage@example.com" }, { email: "sbrin@example.com" }],
          reminders: {
            useDefault: false,
            overrides: [
              { method: "email", minutes: 24 * 60 },
              { method: "popup", minutes: 10 },
            ],
          },
        };

        var request = vm.api.client.calendar.events.insert({
          calendarId: "primary",
          resource: event,
        });

        request.execute(function (event) {
          console.log("event", event);
          // appendPre("Event created: " + event.htmlLink);
        });
      });
    },

    /**
     *  Sign out the user upon button click.
     */
    handleSignoutClick(event) {
      Promise.resolve(this.api.auth2.getAuthInstance().signOut()).then((_) => {
        this.authorized = false;
      });
    },

    /**
     * Print the summary and start datetime/date of the next ten events in
     * the authorized user's calendar. If no events are found an
     * appropriate message is printed.
     */
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
};
</script>