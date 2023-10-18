<template>
  <div class="md-layout get-started">
    <div class="md-layout-item md-size-100 mx-auto">
      <div class="md-layout" style="justify-content: center; top: 25%; position: absolute; width: 95%">
        <div class="md-layout-item md-xsmall-size-100 md-medium-size-30 md-size-25">
          <md-card style="min-height: 440px">
            <md-card-content style="text-align: center">
              <img src="https://static-maryoku.s3.amazonaws.com/storage/img/calendar.png" style="width: 120px" />
              <h4 class="get-started-card-title">Create Your First Event</h4>
              <p class="get-started-card-description">
                Everything you need to produce the best event that invitees would love
              </p>
              <p>&nbsp;</p>
              <md-button class="md-info" @click="openEventModal">Get Started</md-button>
            </md-card-content>
          </md-card>
        </div>

        <div class="md-layout-item md-xsmall-size-100 md-medium-size-30 md-size-25">
          <md-card style="min-height: 440px">
            <md-card-content style="text-align: center">
              <img src="https://static-maryoku.s3.amazonaws.com/storage/img/paperandpen.png" style="width: 120px" />
              <h4 class="get-started-card-title">Plan Your Year</h4>
              <p class="get-started-card-description">Use a robust event calendar to manage yearly budget and events</p>
              <p>&nbsp;</p>
              <md-button class="md-info" @click="openYearPlanner">Open Year Planner</md-button>
            </md-card-content>
          </md-card>
        </div>
        <div class="md-layout-item md-xsmall-size-100 md-medium-size-30 md-size-25">
          <md-card style="min-height: 440px">
            <md-card-content style="text-align: center">
              <img src="https://static-maryoku.s3.amazonaws.com/storage/img/tools.png" style="width: 120px" />
              <h4 class="get-started-card-title">Manage Vendors</h4>
              <p class="get-started-card-description">
                Manage all vendors and proposals in one location and discover new and vetted vendors
              </p>
              <p>&nbsp;</p>
              <md-button class="md-info" @click="openVendorsUpload">Upload Vendors</md-button>
            </md-card-content>
          </md-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Calendar from "@/models/Calendar";
import EventSidePanel from "@/pages/app/Events/EventSidePanel";

export default {
  data() {},
  mounted() {
    this.$auth.currentUser(this, true, () => {
      this.$root.$on("get-started-event-created", (event) => {
        let calendarId = this.$auth.user.defaultCalendarId;
        let calendar = new Calendar({
          id: calendarId,
          annualBudgetPerEmployee: Number(event.numberOfParticipants * event.budgetPerPerson),
        }).save();

        this.$router.push({ name: "EditEvent", params: { id: event.id } });
      });
    });
  },
  methods: {
    openEventModal() {
      /* this.$router.push({ path: `/events` , name  : 'Events', params : { mode : 'create-event'} });
        this.setEventModal({ showModal: true });
        this.setModalSubmitTitle("Save");
        this.setEditMode({ editMode: false }); */

      let now = new Date();
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
    },
    openYearPlanner() {
      this.$router.push({ path: `/planner` });
    },
    openVendorsUpload() {
      this.$router.push({ path: `/vendors` });
    },
  },
};
</script>
<style lang="scss" scoped>
.get-started {
  background-color: #26c6da;
  height: 100vh;
}

.get-started-card-title {
  font-weight: 400 !important;
}

.get-started-card-description {
  min-height: 100px;
  font-size: 16px;
  font-weight: 300;
  color: #777;
}
</style>
