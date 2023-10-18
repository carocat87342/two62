<template>
  <md-card class="md-card-profile">
    <md-card-header class="md-card-header-icon md-card-header-rose">
      <!-- <div class="card-icon" style="padding: 12px;">
          <md-icon>date_range</md-icon>
      </div>-->
      <h4 class="title profile-title title-summary">
        Event Summary
        <md-button class="md-sm md-simple md-just-icon pull-right clear-margins" @click="openEventModal()">
          <md-icon class="company-logo">create</md-icon>
        </md-button>
      </h4>
    </md-card-header>
    <md-card-content v-if="event">
      <div>
        <div class="md-layout event-info-section card-expansion">
          <div class="md-layout-item summary-item">
            <div class="md-layout-item title-text">
              <i class="fa fa-calendar"></i>
            </div>
            <div class="md-layout-item">
              {{ calendarEvent.eventStartMillis | formatDate }},
              {{ calendarEvent.eventStartMillis | formatTime }}
              ({{ calendarEvent.eventStartMillis | formatDuration(calendarEvent.eventEndMillis) }}h)
            </div>
          </div>

          <div class="md-layout-item summary-item">
            <div class="md-layout-item title-text">
              <i class="fa fa-map-marker-alt"></i>
            </div>
            <div class="md-layout-item">{{ calendarEvent.location }}</div>
          </div>
          <div class="md-layout-item summary-item">
            <div class="md-layout-item title-text">
              <i class="fa fa-user"></i>
            </div>
            <div class="md-layout-item">{{ calendarEvent.numberOfParticipants }} {{ inviteeType(calendarEvent) }}</div>
          </div>
          <md-card class="event-extra-info-card">
            <md-card-expand>
              <md-card-expand-content>
                <md-card-content>
                  <div class="md-layout-item summary-item">
                    <div class="md-layout-item title-text">
                      <md-icon>wb_sunny</md-icon>
                    </div>
                    <div class="md-layout-item text-capitalize">{{ calendarEvent.eventDayPart }}</div>
                  </div>
                  <div class="md-layout-item summary-item">
                    <div class="md-layout-item title-text">
                      <md-icon v-if="calendarEvent.eventPlaceNeeded">check</md-icon>
                      <md-icon v-else>close</md-icon>
                    </div>
                    <div class="md-layout-item text-capitalize">Have event place</div>
                  </div>
                  <div class="md-layout-item summary-item">
                    <div class="md-layout-item title-text">
                      <md-icon v-if="calendarEvent.flexibleWithDates">check</md-icon>
                      <md-icon v-else>close</md-icon>
                    </div>
                    <div class="md-layout-item text-capitalize">flexible with dates</div>
                  </div>
                  <div class="md-layout-item summary-item">
                    <div class="md-layout-item title-text">
                      <md-icon v-if="calendarEvent.internalEvent">check</md-icon>
                      <md-icon v-else>close</md-icon>
                    </div>
                    <div class="md-layout-item text-capitalize">Internal company event</div>
                  </div>
                  <div class="md-layout-item summary-item" v-if="calendarEvent.expectedAttendacePercent">
                    <div class="md-layout-item title-text">
                      <i class="fa fa-percent"></i>
                    </div>
                    <div class="md-layout-item text-capitalize">
                      ({{ calendarEvent.expectedAttendacePercent }}) people you're expecting to show up
                    </div>
                  </div>
                  <div class="md-layout-item summary-item" v-if="calendarEvent.eventSongId">
                    <div class="md-layout-item title-text">
                      <md-icon>audiotrack</md-icon>
                    </div>
                    <div class="md-layout-item text-capitalize">{{ calendarEvent.eventSongId }}</div>
                  </div>
                  <div class="md-layout-item summary-item" v-if="calendarEvent.eventMovieId">
                    <div class="md-layout-item title-text">
                      <md-icon>videocam</md-icon>
                    </div>
                    <div class="md-layout-item text-capitalize">{{ calendarEvent.eventMovieId }}</div>
                  </div>
                  <div class="md-layout-item summary-item">
                    <div class="md-layout-item title-text">
                      <md-icon>linear_scale</md-icon>
                    </div>
                    <div class="md-layout-item text-capitalize">Decision Factors</div>
                  </div>
                  <div class="md-layout-item">
                    <ul class="m-0 p-0" style="padding-left: 39px; margin: 0">
                      <template v-if="calendarEvent.eventDecisionFactor1 >= 50">
                        <li>
                          Authenticity & experience
                          <b>({{ calendarEvent.eventDecisionFactor1 }})</b>
                        </li>
                        <li>
                          Convenience & Accessibility
                          <b>({{ 100 - calendarEvent.eventDecisionFactor1 }})</b>
                        </li>
                      </template>
                      <template v-else>
                        <li>
                          Authenticity & experience
                          <b>({{ 100 - calendarEvent.eventDecisionFactor1 }})</b>
                        </li>
                        <li>
                          Convenience & Accessibility
                          <b>({{ calendarEvent.eventDecisionFactor1 }})</b>
                        </li>
                      </template>
                      <template v-if="calendarEvent.eventDecisionFactor2 >= 50">
                        <li>
                          New and edgy
                          <b>({{ calendarEvent.eventDecisionFactor2 }})</b>
                        </li>
                        <li>
                          Familiar & trusted
                          <b>({{ 100 - calendarEvent.eventDecisionFactor2 }})</b>
                        </li>
                      </template>
                      <template v-else>
                        <li>
                          New and edgy
                          <b>({{ 100 - calendarEvent.eventDecisionFactor2 }})</b>
                        </li>
                        <li>
                          Familiar & trusted
                          <b>({{ calendarEvent.eventDecisionFactor2 }})</b>
                        </li>
                      </template>
                      <template v-if="calendarEvent.eventDecisionFactor3 >= 50">
                        <li>
                          Hight Value for Money
                          <b>({{ calendarEvent.eventDecisionFactor3 }})</b>
                        </li>
                        <li>
                          Within budget
                          <b>({{ 100 - calendarEvent.eventDecisionFactor3 }})</b>
                        </li>
                      </template>
                      <template v-else>
                        <li>
                          Hight Value for Money
                          <b>({{ 100 - calendarEvent.eventDecisionFactor3 }})</b>
                        </li>
                        <li>
                          Within budget
                          <b>({{ calendarEvent.eventDecisionFactor3 }})</b>
                        </li>
                      </template>
                      <template v-if="calendarEvent.eventDecisionFactor4 >= 50">
                        <li>
                          Social & Green
                          <b>({{ calendarEvent.eventDecisionFactor4 }})</b>
                        </li>
                        <li>
                          Meets Requirements
                          <b>({{ 100 - calendarEvent.eventDecisionFactor4 }})</b>
                        </li>
                      </template>
                      <template v-else>
                        <li>
                          Social & Green
                          <b>({{ 100 - calendarEvent.eventDecisionFactor4 }})</b>
                        </li>
                        <li>
                          Meets Requirements
                          <b>({{ calendarEvent.eventDecisionFactor4 }})</b>
                        </li>
                      </template>
                    </ul>
                  </div>
                  <div class="md-layout-item summary-item">
                    <div class="md-layout-item title-text">
                      <md-icon>event_note</md-icon>
                    </div>
                    <div class="md-layout-item text-capitalize">Event Needed Services</div>
                  </div>
                  <div class="md-layout-item">
                    <ul class="m-0 p-0" style="padding-left: 39px; margin: 0">
                      <li v-for="(item, i, index) in calendarEvent.eventNeededServices" :key="index">{{ i }}</li>
                    </ul>
                  </div>
                  <!-- NOTE: just hiding it -->
                  <!-- <div class="md-layout-item md-size-100">
                    <md-button class="md-sm md-simple md-red">
                      <md-icon>cached</md-icon>
                      Recurring weekly
                    </md-button>
                  </div>-->
                </md-card-content>
              </md-card-expand-content>
              <md-card-actions md-alignment="space-between">
                <md-card-expand-trigger>
                  <md-button class="md-icon-button md-red md-simple">
                    <md-icon>keyboard_arrow_down</md-icon>
                  </md-button>
                </md-card-expand-trigger>
              </md-card-actions>
            </md-card-expand>
          </md-card>
        </div>

        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <div class="fc-divider"></div>
          </div>
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <h5 class="title-budget-main">Remaining budget</h5>
            <h4 class="title budget">
              <div
                class="title"
                :class="[{ 'title-budget-prise': percentage > 0, 'title-budget-prise-negative': percentage <= 0 }]"
                v-if="calendarEvent.budgetPerPerson * calendarEvent.numberOfParticipants"
              >
                <animated-number
                  ref="totalRemainingBudgetNumber"
                  :value="getTotalRemainingBudget"
                  prefix="$"
                ></animated-number>
                <small class="total-event-budget"> / ${{ getTotalAmountByGuestType | withComma }} </small>
              </div>
            </h4>

            <h5 class="title-budget-main">Per guest</h5>
            <h4 class="title budget">
              <div
                class="title"
                :class="[{ 'title-budget-prise': percentage > 0, 'title-budget-prise-negative': percentage <= 0 }]"
                v-if="calendarEvent.budgetPerPerson * calendarEvent.numberOfParticipants"
              >
                <animated-number
                  ref="totalRemainingBudgetNumber"
                  :value="getRemainingBudgetPerEmployee"
                  prefix="$"
                ></animated-number>
                <small class="total-event-budget">/ ${{ calendarEvent.budgetPerPerson }}</small>
              </div>
            </h4>

            <div class="budget-pie-container">
              <chart-component
                :chart-data="pieChart.data"
                :chart-options="pieChart.options"
                chart-type="Pie"
                style="grid-column: 1; grid-row: 1; color: red"
              />
              <animated-number
                class="percentage"
                ref="percentageNumber"
                :custom-style="true"
                :custom-style-contents="'font-weight:500;font-size:24px;'"
                :value="getPercentage"
                suffix="%"
              />
            </div>
          </div>
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <div class="fc-divider"></div>
          </div>
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <event-paid-total-amounts
              :paid="getPaidAmount"
              :total="getToBePaidAmount"
              :toBePaid="getToBePaidAmount - getPaidAmount"
            ></event-paid-total-amounts>
          </div>
        </div>
      </div>
      <div class="md-layout md-gutter hide">
        <div class="md-layout-item">
          <div>
            <div class="md-caption title-text">Remaining budget per participant</div>
            <!-- TODO Need calculate with components -->
            <div
              class="md-caption title-text"
              :class="[{ 'title-budget-prise': percentage > 0, 'title-budget-prise-negative': percentage <= 0 }]"
            >
              <animated-number
                ref="budgetPerPersonNumber"
                :value="remainingBudgetPerEmployee"
                prefix="$"
              ></animated-number>
            </div>
          </div>
          <div>
            <div class="md-caption title-text">Budget per participant</div>
            <div
              class="md-caption title-text"
              :class="[{ 'title-budget-prise': percentage > 0, 'title-budget-prise-negative': percentage <= 0 }]"
            >
              <animated-number
                ref="budgetPerPersonNumber"
                :value="calendarEvent.budgetPerPerson"
                prefix="$"
              ></animated-number>
            </div>
          </div>
          <div>
            <div class="md-caption title-text">Total budget for the event</div>
            <div class="md-caption title-text title-budget-prise">
              <animated-number
                ref="totalBudgetNumber"
                :value="calendarEvent.budgetPerPerson * calendarEvent.numberOfParticipants"
                prefix="$"
              ></animated-number>
            </div>
          </div>
        </div>
      </div>
    </md-card-content>
  </md-card>
</template>
<script>
import EventModal from "../EventModal/";
import EventPlannerVuexModule from "../EventPlanner.vuex";
import moment from "moment";

import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import Swal from "sweetalert2";
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import EventComponent from "@/models/EventComponent";
import EventComponentVendor from "@/models/EventComponentVendor";
import CalendarEventStatistics from "@/models/CalendarEventStatistics";

// import auth from '@/auth'
import ChartComponent from "@/components/Cards/ChartComponent";
import _ from "underscore";
import { LabelEdit, AnimatedNumber, StatsCard, ChartCard } from "@/components";
import EventSidePanel from "../EventSidePanel.vue";
import EventPaidTotalAmounts from "../components/EventPaidTotalAmounts.vue";

export default {
  name: "event-details-sidebar",
  components: {
    LabelEdit,
    AnimatedNumber,
    StatsCard,
    ChartCard,
    ChartComponent,
    CalendarEventStatistics,
    EventPaidTotalAmounts,
  },
  props: {
    event: {
      type: Object,
      default: () => {
        return { statistics: {} };
      },
    },
  },
  data: () => ({
    calendarEvent: {},
    selectedComponents: [],
    eventId: null,
    percentage: 0,
    totalRemainingBudget: 0,
    remainingBudgetPerEmployee: 0,
    seriesData: [],
    isLoading: false,
    routeName: null,
    budgetPerEmployee: 0,
    acceptedProposals: [],
    paidProposals: [],
    eventInfoCardExpanded: false,
  }),
  methods: {
    ...mapMutations("EventPlannerVuex", [
      "setEventModal",
      "setEditMode",
      "setModalSubmitTitle",
      "setEventModalAndEventData",
      "setNumberOfParticipants",
      "setEventData",
    ]),
    inviteeType(calendarEvent) {
      // "Employees Only","Employees and spouse","Employees and families", "Employees children"
      let typeText = "";
      let participantsType = calendarEvent.participantsType;

      if (participantsType === "Guests and spouse") {
        typeText = "+ spouses";
      } else if (participantsType === "Guests and families") {
        typeText = "+ families";
      } else if (participantsType === "Guests siblings") {
        typeText = "+ siblings";
      } else {
        typeText = participantsType;
      }

      return typeText;
    },
    getEvent() {
      this.$auth.currentUser(this, true, () => {
        if (!this.event) {
          let _calendar = new Calendar({
            id: this.$auth.user.defaultCalendarId,
          });

          _calendar
            .calendarEvents()
            .find(this.$route.params.id)
            .then((event) => {
              // this.event = event
              this.eventId = event.id;
              this.calendarEvent = event;
              this.selectedComponents = event.components;

              this.getCalendarEventStatistics(event);

              this.$root.$emit(
                "set-title",
                this.event,
                this.routeName === "EditBuildingBlocks",
                this.routeName === "InviteesManagement" || this.routeName === "EventInvitees",
              );
            });
        } else {
          this.eventId = this.event.id;
          this.calendarEvent = this.event;
          this.selectedComponents = this.event.components;

          if (this.eventId) {
            this.getCalendarEventStatistics(this.event);
          }

          this.$root.$emit(
            "set-title",
            this.event,
            this.routeName === "EditBuildingBlocks",
            this.routeName === "InviteesManagement" || this.routeName === "EventInvitees",
          );
        }
      });
    },
    getCalendarEventStatistics(evt) {
      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: evt.id });

      if (!evt.id) {
        return;
      }

      new CalendarEventStatistics()
        .for(calendar, event)
        .get()
        .then((resp) => {
          // this.totalRemainingBudget = (evt.budgetPerPerson * evt.numberOfParticipants) - resp[0].totalAllocatedBudget
          this.totalRemainingBudget = evt.totalBudget - resp[0].totalAllocatedBudget;
          this.remainingBudgetPerEmployee = this.totalRemainingBudget / evt.numberOfParticipants; // evt.totalBudget - resp[0].totalAllocatedBudget
          this.percentage =
            100 - ((resp[0].totalAllocatedBudget / (evt.budgetPerPerson * evt.numberOfParticipants)) * 100).toFixed(2);

          if (this.percentage > 0) {
            this.seriesData = [
              {
                value: 100 - this.percentage,
                className: "budget-chart-slice-a-positive",
              },
              {
                value: this.percentage,
                className: "budget-chart-slice-b-positive",
              },
            ];
          } else {
            this.seriesData = [
              { value: 0.01, className: "budget-chart-slice-a-negative" },
              { value: 99.99, className: "budget-chart-slice-b-negative" },
            ];
          }

          this.budgetPerEmployee = evt.budgetPerPerson; // this.totalRemainingBudget / evt.numberOfParticipants
          this.allocatedBudget = resp.totalAllocatedBudget;
          this.event.statistics["allocatedBudget"] = this.allocatedBudget;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    openEventModal() {
      this.$router.push({ path: `/event/` + this.event.id + "/edit" });

      //   window.currentPanel = this.$showPanel({
      //   component: EventSidePanel,
      //   cssClass: 'md-layout-item md-size-40 transition36 ',
      //   openOn: 'right',
      //   disableBgClick: false,
      //   props: {
      //     modalSubmitTitle: 'Save',
      //     editMode: true,
      //     sourceEventData: this.event,
      //     openInPlannerOption: false
      //   }
      // })
      //
      // this.setEventData(this.event)
      // this.setEventModal({showModal: true})
      // this.setModalSubmitTitle('Save')
      // this.setEditMode({editMode: true})
    },
    getAcceptedAndPaidProposals(calendar, event, eventComponents) {
      if (calendar !== null && event !== null && eventComponents !== undefined) {
        eventComponents.forEach((evtComponent) => {
          let selected_block = new EventComponent({ id: evtComponent.id });
          new EventComponentVendor()
            .for(calendar, event, selected_block)
            .get()
            .then((ec) => {
              ec.forEach((e) => {
                e.proposals
                  .filter((item) => item.downPaymentStatus === "paid")
                  .forEach((proposal) => {
                    if (this.paidProposals.filter((p) => p.proposalId === proposal.id).length === 0) {
                      this.paidProposals.push({
                        proposalId: proposal.id,
                        proposalCost: proposal.cost,
                      });
                    }
                  });
                e.proposals
                  .filter((item) => item.accepted === true)
                  .forEach((proposal) => {
                    if (this.acceptedProposals.filter((p) => p.proposalId === proposal.id).length === 0) {
                      this.acceptedProposals.push({
                        proposalId: proposal.id,
                        proposalCost: proposal.cost,
                      });
                    }
                  });
              });
            })
            .catch((error) => {
              console.log("EventComponentVendor error =>", error);
            });
        });
      }
    },
  },
  created() {
    this.$store.registerModule("EventPlannerVuex", EventPlannerVuexModule);

    this.routeName = this.$route.name;
  },
  mounted() {
    let _self = this;
    if (!this.event) {
      this.getEvent();
    }

    this.$root.$on("RefreshStatistics", function () {
      _self.getCalendarEventStatistics(_self.event);
    });

    this.$root.$on("calendar-refresh-events", () => {
      this.getEvent();
    });

    this.getEvent();

    this.getAcceptedAndPaidProposals();
  },
  computed: {
    ...mapGetters({
      components: "event/getComponentsList",
    }),
    getPaidAmount() {
      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: this.event.id });
      let eventComponents = this.event.components;
      let paidAmount = 0;
      this.getAcceptedAndPaidProposals(calendar, event, eventComponents);

      if (this.paidProposals.length > 0) {
        return this.paidProposals.reduce((p, item) => p + item.proposalCost, 0);
      } else {
        return 0;
      }
    },
    getToBePaidAmount() {
      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: this.event.id });
      let eventComponents = this.event.components;
      let toBePaidAmount = 0;
      this.getAcceptedAndPaidProposals(calendar, event, eventComponents);

      if (this.acceptedProposals.length > 0) {
        return this.acceptedProposals.reduce((p, item) => p + item.proposalCost, 0);
      } else {
        return 0;
      }
    },
    getTotalAmountByGuestType() {
      if (this.calendarEvent.participantsType === "Guests and spouse") {
        // return parseInt(this.event.numberOfParticipants * this.event.budgetPerPerson  * 2)
        return parseInt(this.event.totalBudget) * 2;
      } else {
        // return parseInt(this.event.numberOfParticipants * this.event.budgetPerPerson)
        return parseInt(this.event.totalBudget);
      }
    },
    getTotalRemainingBudget() {
      return this.totalRemainingBudget;
    },
    getRemainingBudgetPerEmployee() {
      if (this.event.budgetPerPerson === 0) {
        return 0;
      } else {
        if (this.calendarEvent.participantsType === "Guests and spouse") {
          return this.getTotalRemainingBudget / this.event.numberOfParticipants / 2;
        } else {
          return this.getTotalRemainingBudget / this.event.numberOfParticipants;
        }
      }
    },
    getPercentage() {
      if (this.event.budgetPerPerson === 0) {
        return 0;
      } else {
        return (this.getTotalRemainingBudget / this.getTotalAmountByGuestType) * 100;
      }
    },
    getSeriesData() {
      if (this.getTotalRemainingBudget > 0) {
        return [
          {
            value: 100 - this.getPercentage,
            className: "budget-chart-slice-a-positive",
          },
          {
            value: this.getPercentage,
            className: "budget-chart-slice-b-positive",
          },
        ];
      } else {
        return [
          {
            value: 0.01,
            className: "budget-chart-slice-a-negative",
          },
          {
            value: 99.99,
            className: "budget-chart-slice-b-negative",
          },
        ];
      }
    },
    pieChart() {
      return {
        data: {
          labels: [" ", " "], // should be empty to remove text from chart
          series: this.getSeriesData,
        },
        options: {
          padding: 0,
          height: 156,
          donut: true,
          donutWidth: 8,
        },
      };
    },
  },
  filters: {
    formatDate: function (date) {
      return moment(date).format("MMM Do YYYY");
    },
    formatTime: function (date) {
      return moment(date).format("h:00 A");
    },
    formatDuration: function (startDate, endDate) {
      return moment(endDate).diff(startDate, "hours");
    },
    withComma(amount) {
      return amount ? amount.toLocaleString() : 0;
    },
  },
  watch: {
    event(newVal, oldVal) {
      this.getEvent();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/md/_colors.scss";

.md-layout,
.md-layout-item {
  width: initial;
  padding: 0;
}
.control-main-block {
  .company-control-logo {
    margin-right: 8px;

    &:last-child {
      margin-right: 0;
    }
    i {
      font-size: 24px !important;
    }
  }

  .md-button.selected {
    background-color: #eb3e79 !important;
    border-color: #eb3e79 !important;

    i {
      color: #fff !important;
    }
  }
}

.company-control-logo .md-button {
  border: 2px solid #959595;
}

.percentage {
  padding-bottom: 8px;
  padding-left: 5px;
  grid-column: 1;
  grid-row: 1;
  margin-top: auto;
  margin-bottom: auto;
  font-size: 25px;
  font-weight: normal;
  color: #000000;
}

.logo-block {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0px 15px;
  margin: -20px 0px 20px 0px;

  .event-planer-logo {
    background: #eb3e79;
    width: 100%;
    max-width: 64px;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    margin-right: 10px;

    .company-logo {
      color: white !important;
    }
  }

  .event-title {
    white-space: nowrap;
    font-family: "Roboto";
    font-size: 1.125rem;
    font-weight: 400;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: left;
    color: #000000;
  }
}

.control-main-block {
  display: flex;
  justify-content: center;

  .company-logo-block {
    border: 2px solid #8b8b8b;
    padding: 7px;
    border-radius: 50%;
    margin: 0px 5px;
  }
}

.event-info-section {
  flex-direction: column;
}

.summary-item {
  display: flex;
}

.title-text {
  font-family: "Roboto";
  font-size: 12px;
  font-weight: 400;
  font-style: normal;
  font-stretch: normal;
  line-height: 2.2;
  letter-spacing: normal;
  text-align: left;
  color: #959595;
  flex: 0;

  i {
    color: $purple-500 !important;
    font-size: 12px !important;
    padding-right: 1em;
  }
}

.title-budget-main {
  margin-top: 1.7em;
  font-family: "Roboto";
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: center;
  color: #212121;
}

.title.budget {
  h4 {
    color: $purple-500;
  }
}

.title-budget-prise {
  color: $green !important;
  font-size: 1.25rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 5px;
}

.title-budget-prise-negative {
  color: $pink-262 !important;
  font-size: 1.25rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 5px;
}

.title-budget-prise.title {
  font-size: 1.45rem;
  margin-bottom: 0;
}

.block-flex {
  display: flex;
}

.button-event-creatig .md-ripple {
  background-color: #00bcd4;
}

.footer-link-button .md-ripple {
  color: #89229b;
  background-color: rgba(240, 240, 240, 1);
}

.copyright {
  color: #9c27b0;
}

.copyright-block {
  justify-content: space-between;
}

.total-event-budget {
  color: #000;
  font-weight: 500;
  font-size: 18px;
}

.md-card-header-icon .card-icon .md-icon {
  color: white !important;
}
.md-card-header-rose {
  margin-top: 1.5em;
}
.budget-pie-container {
  display: grid;
  margin: 3em 18px;
}
.fc-divider {
  color: #eeeeee;
  margin: 15px 0;
}
.hide {
  display: none;
}
</style>
