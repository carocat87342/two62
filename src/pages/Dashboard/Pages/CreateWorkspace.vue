<template>
  <div class="md-layout" style="text-align: center">
    <h2 class="title text-center" style="text-align: center; width: 100%">Welcome, lets create your workspace</h2>
    <div class="md-layout-item md-size-50 mx-auto">
      <signup-card>
        <div
          class="md-layout-item md-size-100 md-medium-size-100 md-small-size-100 mr-auto"
          slot="content-right"
          style="padding: 24px"
        >
          <vue-element-loading :active="loading" spinner="ring" color="#FF547C" />
          <div>&nbsp;</div>
          <md-field
            :class="[
              { 'md-valid': !errors.has('workspace') && touched.workspace },
              { 'md-error': errors.has('workspace') },
              { 'extra-margin': error },
            ]"
          >
            <label>Workspace Name</label>
            <span class="md-prefix">https://</span>
            <md-input
              v-focus
              v-model="workspace"
              type="text"
              data-vv-name="workspace"
              required
              @keyup="checkWorkspace"
            ></md-input>
            <span class="md-suffix">.maryoku.com</span>
            <div
              class="md-error"
              v-if="!workspaceValid"
              style="text-align: center; width: 100%; font-size: 0.9rem; padding-top: 18px"
            >
              {{ error }}
            </div>
          </md-field>

          <div class="button-container">
            <md-button
              @click="createWorkSpace"
              class="md-default md-red md-maryoku mt-4"
              slot="footer"
              :disabled="!workspaceValid"
              >Continue</md-button
            >
          </div>
        </div>
      </signup-card>
    </div>
  </div>
</template>
<script>
import { SignupCard } from "@/components";
// import auth from '@/auth';
import VueElementLoading from "vue-element-loading";
import Tenant from "@/models/Tenant";
import CalendarEvent from "@/models/CalendarEvent";
import Calendar from "@/models/Calendar";
import eventService from "@/services/event.service";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "underscore";
import AuthService from "@/services/auth.service";

export default {
  components: {
    SignupCard,
    VueElementLoading,
  },
  data() {
    return {
      error: "",
      workspace: "",
      loading: false,
      t: null,
      workspaceValid: true,
      serverURL: process.env.SERVER_URL,
      // auth: auth,
      touched: {
        workspace: false,
      },
      modelValidations: {
        workspace: {
          required: true,
          min: 4,
          max: 12,
        },
      },
      tenantUser: {},
      defaultCalendar: null,
    };
  },
  computed: {
    ...mapState("PublicEventPlanner", ["publicEventData"]),
  },
  methods: {
    createWorkSpace() {
      this.loading = true;
      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          let tenantIdExt = this.$authService.resolveStaging();
          tenantIdExt = tenantIdExt ? `.${tenantIdExt}` : "";
          new Tenant({ id: this.workspace })
            .save()
            .then((res) => {
              this.loading = true;
              if (res.status === true) {
                this.defaultCalendar = new Calendar({ id: res.defaultCalendar });
                AuthService.setTenant(this.workspace);
                let callback = this.$route.query.callback;
                const action = this.$route.query.action;
                let eventData = JSON.parse(localStorage.getItem('event'));
                if (action === this.$queryEventActions.planner) {
                  eventService
                    .saveEvent(eventData)
                    .then((event) => {
                      callback = btoa(`events/${event.id}/booking/concept`);
                      document.location.href = `${document.location.protocol}//${this.workspace}${tenantIdExt}.maryoku.com:${document.location.port}/#/signedin?token=${res.token}&userType=planner&redirectURL=${callback}`;
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } else if (action === "register") {
                  document.location.href = `${document.location.protocol}//${this.workspace}${tenantIdExt}.maryoku.com:${document.location.port}/#/signedin?token=${res.token}&userType=planner&redirectURL=${callback}`;
                } else {
                  eventService
                    .saveEvent(eventData)
                    .then((event) => {
                      callback = btoa(`events/${event.id}/booking/concept`);
                      document.location.href = `${document.location.protocol}//${this.workspace}${tenantIdExt}.maryoku.com:${document.location.port}/#/signedin?token=${res.token}&userType=planner&redirectURL=${callback}`;
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }

                // const signedInLink = btoa(`${document.location.protocol}//${this.workspace}${tenantIdExt}.maryoku.com:${document.location.port}/#/signedin?token=${res.token}`);
                // this.$router.push({path: `${redirectionURL}?callback=${signedInLink}`})

                //document.location.href = `${document.location.protocol}//${this.workspace}${tenantIdExt}.maryoku.com:${document.location.port}/#/signedin?token=${res.token}&redirectURL=${callback}`;
                // if (refer === 'signup') {
                //   const redirectionURL = btoa('/create-event-wizard')
                //   document.location.href = `${document.location.protocol}//${this.workspace}${tenantIdExt}.maryoku.com:${document.location.port}/#/signedin?token=${res.token}&redirectURL=${redirectionURL}`;
                // } else {
                //   this.createEvent().then(event=>{
                //     console.log(event)
                //     document.location.href = `${document.location.protocol}//${this.workspace}${tenantIdExt}.maryoku.com:${document.location.port}/#/signedin?token=${res.token}&firstEvent=${event.id}`;
                //   })
                //   .catch(error=>{
                //     console.error(error)
                //     this.loading = false
                //     document.location.href = `${document.location.protocol}//${this.workspace}${tenantIdExt}.maryoku.com:${document.location.port}/#/signedin?token=${res.token}`;
                //   })
                // }
              } else {
                this.loading = false;
                this.workspaceValid = false;
                if (res.message) {
                  this.error = "This workspace already exists.  Please try to use different name.";
                } else {
                  this.error = "Something is woring. Please try again later";
                }
              }
            })
            .catch((e) => {
              this.loading = false;
            });
        } else {
          this.loading = false;
        }
      });
    },
    createEvent() {
      let vm = this;
      return new Promise((resolve, reject) => {
        this.tenantId = this.workspace;
        let catObject = _.find(this.occasionsForCategory, (el) => el.value === this.eventData.occasion) || {
          category: "CompanyDays",
        };
        this.category = catObject.category;
        const editingEvent = JSON.parse(localStorage.getItem("event"));
        let newEvent = new CalendarEvent({
          calendar: this.defaultCalendar,
          title: editingEvent.title,
          occasion: editingEvent.occasion ? editingEvent.occasion.name : "",
          eventStartMillis: editingEvent.eventStartMillis,
          eventEndMillis: editingEvent.eventEndMillis,
          numberOfParticipants: editingEvent.numberOfParticipants,
          budgetPerPerson: 0,
          totalBudget: 0,
          status: "draft",
          currency: "USD",
          eventType: editingEvent.eventType,
          category: catObject.category, //! editingEvent.editable ? 'Holidays' : 'CompanyDays',
          editable: true,
          location: editingEvent.location,
        })
          .for(this.defaultCalendar)
          .save()
          .then((response) => {
            resolve(response.item);
          })
          .catch((error) => {
            console.log(error);
            this.working = false;
            reject(error);
            // this.$parent.isLoading = false
          });
      });
    },
    checkWorkspace() {
      this.workspace = this.workspace.toLowerCase();
      if (
        this.workspace.length < 4 ||
        this.workspace.length > 18 ||
        this.workspace.replace(/[A-Za-z0-9_-]/g, "").length > 0 ||
        this.workspace.startsWith("-") ||
        this.workspace.startsWith("_") ||
        this.workspace.endsWith("-") ||
        this.workspace.endsWith("_")
      ) {
        this.workspaceValid = false;
        this.error =
          "Should have 4-18 characters, start and end with a letter or digit and can include digits, letters, - (dash) and _ (underscore)";
      } else {
        this.workspaceValid = true;
        this.error = null;
        // if (this.t) {
        //   clearTimeout(this.t);
        //   this.t = null;
        // }
        // this.t = setTimeout(
        //   function () {
        //     new Tenant().find(this.workspace).then((res) => {
        //       if (res.status) {
        //         this.workspaceValid = false;
        //         this.error = "This workspace is already taken, try another name";
        //       } else {
        //         this.workspaceValid = true;
        //         this.error = null;
        //       }
        //       this.loading = false;
        //     });
        //   }.bind(this),
        //   1000,
        // );
      }
    },
    generateWorkspaceName(company) {
      if (!company) {
        return "";
      }
      return company.replace(/ /g, "-").toLowerCase();
    },
  },
  created() {
    this.workspace = this.generateWorkspaceName(this.$store.state.auth.user.companyName);
  },
  watch: {
    email() {
      this.touched.email = true;
    },
    password() {
      this.touched.password = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.workspace-container {
  width: 100%;
  .title {
    max-width: 100%;
  }
}
p.description {
  font-size: 16px;
}

h4.info-title {
  font-size: 18px;
  font-weight: 400;
}

.extra-margin {
  margin-bottom: 64px !important;
}
.title {
  font-family: "Manrope-ExtraBold";
  color: #050505;
}
</style>

