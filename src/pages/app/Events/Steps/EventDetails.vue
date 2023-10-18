<template>
  <div class="md-layout">
    <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" is-full-screen />
    <div class="md-card">
      <div class="md-card-content">
        <div class="md-layout">
          <div class="md-layout-item md-size-55">
            <md-field class="required" :class="[{ 'md-error': errors.has('title') }]">
              <label>Event Title</label>
              <md-input
                v-model="eventData.title"
                data-vv-name="title"
                v-validate="modelValidations.title"
                required
              ></md-input>
              <span class="md-error" v-if="errors.has('title')">The event title is required</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-15">
            <md-field class="required" :class="[{ 'md-error': errors.has('numberOfParticipants') }]">
              <label>Guest Count</label>
              <md-input
                v-model="eventData.numberOfParticipants"
                data-vv-name="numberOfParticipants"
                v-validate="modelValidations.numberOfParticipants"
                required
                type="number"
                @change="calculateBudgetPerGuest()"
              ></md-input>
              <span class="md-error" v-if="errors.has('numberOfParticipants')"
                >The Guest Count is required and should be a number</span
              >
            </md-field>
          </div>
          <div class="md-layout-item md-size-15">
            <md-field class="required" :class="[{ 'md-error': errors.has('budget') }]">
              <label>Budget</label>
              <md-input
                v-model="eventData.totalBudget"
                data-vv-name="budget"
                v-validate="modelValidations.totalBudget"
                required
                type="number"
                @change="calculateBudgetPerGuest()"
              ></md-input>
              <span class="md-error" v-if="errors.has('budget')">The Budget is required and should be a number</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-15">
            <md-field class="disabled">
              <label>Per Guest</label>
              <md-input v-model="eventData.budgetPerPerson" type="text" disabled="disabled"></md-input>
            </md-field>
          </div>
        </div>
        <!-- Event Types list-->
        <div class="md-layout event-types-list mt-1">
          <div class="md-layout-item md-size-40 required" :class="{ 'has-error': !eventType && validating }">
            <label class="bold">Select Event Type</label>
            <br />
            <span class="md-error" v-if="!eventType && validating">The Event Type Is Required</span>
            <div class="list-container">
              <md-field class="mt-0 mb-2">
                <md-select v-model="eventType">
                  <md-option v-for="(type, index) in eventTypes" :key="index" :value="type.id">{{
                    type.name
                  }}</md-option>
                </md-select>
              </md-field>
            </div>
          </div>
        </div>
        <!-- ./Event Types list-->

        <!-- Event fields section -->
        <div class="md-layout">
          <div class="md-layout-item md-size-25">
            <md-autocomplete
              v-model="eventData.occasion"
              data-vv-name="occasion"
              :md-options="occasionsList"
              @md-opened="mdOpened"
              class="change-icon-order select-with-icon mb16"
              :class="[{ 'md-error': errors.has('occasion') }]"
              value
            >
              <label>Occasion</label>
              <span class="md-error" v-if="errors.has('occasion')">This field is required</span>
            </md-autocomplete>
          </div>
          <div class="md-layout-item md-size-25">
            <md-field>
              <label>City</label>
              <md-input v-model="eventData.location"></md-input>
            </md-field>
          </div>
        </div>
        <div class="md-layout">
          <div class="md-layout-item md-size-50 required">
            <md-datepicker
              :class="[
                {
                  'md-error':
                    eventData.date && $refs.datePicker && !$refs.datePicker.$el.classList.contains('md-has-value'),
                },
              ]"
              v-model="eventData.date"
              data-vv-name="date"
              ref="datePicker"
              v-validate="modelValidations.date"
              required
            >
              <label>Date</label>
            </md-datepicker>
            <md-checkbox v-model="flexibleDate" @change="switchDateRequired"
              >I'm flexible around the selected date</md-checkbox
            >
          </div>
        </div>
        <div class="md-layout hide">
          <div class="md-layout-item md-size-25">
            <md-field class="required" :class="[{ 'md-error': errors.has('time') }]">
              <label>Start Time</label>
              <md-select v-model="eventData.time" v-validate="modelValidations.time" data-vv-name="time" required>
                <md-option v-for="hour in hoursArray" :key="hour" :value="hour">{{ hour }}</md-option>
              </md-select>
              <span class="md-error" v-if="errors.has('time')">The start time is required</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-25">
            <md-field class="required" :class="[{ 'md-error': errors.has('duration') }]">
              <label>Duration</label>
              <md-select
                v-model="eventData.duration"
                v-validate="modelValidations.duration"
                data-vv-name="duration"
                required
              >
                <md-option v-for="hour in durationArray" :key="hour" :value="hour">{{ hour + " hours" }}</md-option>
              </md-select>
              <span class="md-error" v-if="errors.has('duration')">The duration is required</span>
            </md-field>
          </div>
        </div>
        <!-- ./Event fields section -->
        <div class="md-layout">
          <div class="md-layout-item md-size-100 text-right">
            <br />
            <md-button class="md-default" @click="cancel">Cancel</md-button>
            <md-button class="md-primary" @click="validateAndSubmit">{{ submitButtonLabel }}</md-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import EventComponent from "@/models/EventComponent";
import CalendarEvent from "@/models/CalendarEvent";
import Calendar from "@/models/Calendar";
import CalendarEventStatistics from "@/models/CalendarEventStatistics";
import VueElementLoading from "vue-element-loading";
import Occasion from "@/models/Occasion";
import moment from "moment";
import numeral from "numeral";
import _ from "underscore";
import Swal from "sweetalert2";

export default {
  name: "get-started-step",
  props: ["newEventData"],
  components: {
    VueElementLoading,
  },
  methods: {
    ...mapMutations("AnnualPlannerVuex", ["resetForm", "setEventModal", "setEventProperty"]),
    calculateBudgetPerGuest() {
      if (this.eventData.totalBudget && this.eventData.numberOfParticipants) {
        this.eventData.budgetPerPerson = (
          parseInt(this.eventData.totalBudget) / this.eventData.numberOfParticipants
        ).toFixed(2);
      }
    },
    validateDate() {
      return this.$refs.datePicker.$el.classList.contains("md-has-value");
    },
    validateAndSubmit() {
      // this.$emit('goToNextPage')
      // return
      let vm = this;

      this.cerrors = {};
      this.validating = true;

      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          // this.$parent.isLoading = true
          if (this.eventId) {
            vm.updateEvent();
          } else {
            vm.createEvent();
          }
        } else {
          this.showNotify();
        }
      });

      if (!this.eventType) {
      } else {
        // this.$emit('goToNextPage')
      }
    },
    getOccasionList() {
      if (this.$auth.user.defaultCalendarId) {
        let _calendar = new Calendar({
          id: this.$auth.user.defaultCalendarId,
        });

        new Occasion()
          .for(_calendar)
          .get()
          .then((resp) => {
            this.occasionsList = resp.map((val) => val.title);
            this.occasionsForCategory = resp.map((val) => {
              return {
                value: val.title,
                category: val.category,
              };
            });
          })
          .catch((error) => {
            console.log("error => ", error);
          });
      }
    },
    mdOpened: function () {
      this.eventData.occasion += " ";
      this.eventData.occasion = this.eventData.occasion.substring(0, this.eventData.occasion.length - 1);
    },
    showNotify() {
      this.$notify({
        message: "Please, check all required fields",
        icon: "warning",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger",
      });
    },
    getEventStartInMillis() {
      if (this.eventData.date) {
        if (!this.eventData.time) {
          this.eventData.time = "8:00 AM";
        }
        let eventStartTime =
          new Date(this.eventData.date).getTime() +
          this.convertHoursToMillis(moment(this.eventData.time, "HH:mm a").format("H"));
        return eventStartTime;
      }
    },
    getEventEndInMillis() {
      if (this.eventData.date && this.eventData.time) {
        if (!this.eventData.duration) {
          this.eventData.duration = 1;
        }
        let eventEndTime = this.getEventStartInMillis() + this.convertDurationToMillis(this.eventData.duration);
        return eventEndTime;
      }
    },
    convertHoursToMillis(hours) {
      return hours * 60 * 60 * 1000;
    },
    convertDurationToMillis(hours) {
      return hours * 60 * 60 * 1000;
    },
    createEvent() {
      let vm = this;

      this.$auth.currentUser(this, true, () => {
        // Code  here
        let calendarId = this.$auth.user.defaultCalendarId;
        let _calendar = new Calendar({
          id: calendarId,
        });

        let catObject = _.find(this.occasionsForCategory, (el) => el.value === this.eventData.occasion) || {
          category: "CompanyDays",
        };
        this.category = catObject.category;

        let newEvent = new CalendarEvent({
          calendar: {
            id: calendarId,
          },
          title: this.eventData.title,
          occasion: this.eventData.occasion,
          eventStartMillis: this.getEventStartInMillis(),
          eventEndMillis: this.getEventEndInMillis(),
          numberOfParticipants: this.eventData.numberOfParticipants,
          budgetPerPerson: this.eventData.budgetPerPerson,
          totalBudget: this.eventData.totalBudget,
          status: "draft",
          currency: "USD",
          eventType: this.eventType,
          category: catObject.category, //! this.eventData.editable ? 'Holidays' : 'CompanyDays',
          editable: true,
          location: this.eventData.location,
          //  participantsType: 'Test', // HARDCODED, REMOVE AFTER BACK WILL FIX API,
        })
          .for(_calendar)
          .save()
          .then((response) => {
            // this.$parent.isLoading = false
            // vm.$emit('goToNextPage', response)
            // vm.newEvent = response
            // vm.$router.push({ path: `/events/` + response.item.id + '/edit/details' })
            vm.$router.push({
              path: `/events/${response.item.id}/booking/concept`,
            });
            // vm.$router.push({ path: `/events/${response.item.id}/edit/concept`})
          })
          .catch((error) => {
            console.log(error);
            this.working = false;
            // this.$parent.isLoading = false
          });
      });
    },
    updateEvent() {
      // this.$parent.isLoading = true
      let vm = this;

      this.$nextTick(() => {
        let _calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });

        let eventData = {
          id: this.eventData.id,
          title: this.eventData.title,
          occasion: this.eventData.occasion || "",
          date: new Date(this.eventData.eventStartMillis),
          numberOfParticipants: this.eventData.numberOfParticipants,
          budgetPerPerson: this.eventData.budgetPerPerson,
          status: this.eventData.status,
          currency: this.eventData.currency,
          eventType: this.eventData.eventType,
          participantsType: this.eventData.participantsType,
          category: this.eventData.category,
          location: this.eventData.location,
          totalBudget: this.eventData.totalBudget,
        };

        let editedEvent = new CalendarEvent(eventData);
        editedEvent.eventStartMillis = this.getEventStartInMillis();
        editedEvent.eventEndMillis = this.getEventEndInMillis();
        let catObject = _.find(this.occasionsForCategory, (el) => el.value === editedEvent.occasion) || {
          category: "CompanyDays",
        };

        this.eventData.category = catObject.category;
        editedEvent.category = catObject.category;
        // editedEvent.participantsType = 'Test' // HARDCODED, REMOVE AFTER BACK WILL FIX API,
        editedEvent
          .for(_calendar)
          .save()
          .then((response) => {
            // this.$parent.isLoading = false
            // vm.$emit('goToNextPage', response)
            // vm.newEvent = vm.eventData
            vm.$router.push({
              path: `/events/` + vm.event.id + "/edit/details",
            });
          })
          .catch((error) => {
            console.log(error);
            this.working = false;
            // this.$parent.isLoading = false
          });
      });
    },
    switchDateRequired() {
      this.modelValidations.date.required = !this.flexibleDate;
    },
    getEvent() {
      this.$auth.currentUser(this, true, () => {
        let _calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });

        _calendar
          .calendarEvents()
          .find(this.$route.params.id)
          .then((event) => {
            console.log("Event =>", event);

            this.$set(this, "eventData", event);
            this.$set(this, "eventType", event.eventType);
            // this.$set(this,'guestType',event.participantsType)

            this.eventData.date = new Date(event.eventStartMillis);
            this.eventData.time = moment(new Date(event.eventStartMillis).getTime()).format("H:mm A");
            this.eventData.duration = (event.eventEndMillis - event.eventStartMillis) / 1000 / 60 / 60;

            this.eventId = event.id;
            this.event = event;
            this.selectedComponents = event.components;

            this.getCalendarEventStatistics(event);
          });
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
          // this.totalRemainingBudget = (evt.budgetPerPerson * evt.numberOfParticipants) - resp[0].totalAllocatedBudget//evt.totalBudget - resp[0].totalAllocatedBudget
          // this.remainingBudgetPerEmployee = this.totalRemainingBudget / evt.numberOfParticipants//evt.totalBudget - resp[0].totalAllocatedBudget
          // this.percentage = 100 - ((resp[0].totalAllocatedBudget / (evt.budgetPerPerson * evt.numberOfParticipants)) * 100).toFixed(2)
          //
          // if (this.percentage > 0) {
          //     this.seriesData = [{value: (100-this.percentage), className:"budget-chart-slice-a-positive"}, {value: this.percentage, className:"budget-chart-slice-b-positive"}]
          // } else {
          //     this.seriesData =  [{value: 0.01, className: "budget-chart-slice-a-negative"},{value: 99.99, className: "budget-chart-slice-b-negative"}]
          // }
          //
          // this.budgetPerEmployee = evt.budgetPerPerson//this.totalRemainingBudget / evt.numberOfParticipants
          // this.allocatedBudget = resp.totalAllocatedBudget
          // this.event.statistics['allocatedBudget'] = this.allocatedBudget
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancel() {
      window.history.back();
    },
  },
  data() {
    return {
      isLoading: true,
      eventData: {
        budgetPerPerson: 0,
      },
      event: null,
      eventId: null,
      calendar: null,
      eventType: null,
      category: "",
      InviteeTypes: ["Guests Only", "Guests and spouse", "Guests and families", "Guests siblings"],
      InviteeTypes2: [
        {
          title: "Corporate Guests",
          icon: "https://static-maryoku.s3.amazonaws.com/storage/img/guest_type_corporate.png",
        },
        {
          title: "Children",
          icon: "https://static-maryoku.s3.amazonaws.com/storage/img/guest_type_children.png",
        },
        {
          title: "Social Event Invitees",
          icon: "https://static-maryoku.s3.amazonaws.com/storage/img/guest_type_social.png",
        },
      ],
      guestType: null,
      hoursArray: [],
      durationArray: [...Array(12).keys()].map((x) => ++x),
      flexibleDate: false,
      modelValidations: {
        title: {
          required: true,
        },
        date: {
          required: true,
        },
        time: {
          required: false,
        },
        duration: {
          required: false,
        },
        numberOfParticipants: {
          required: true,
          min_value: 1,
          max_value: 10000000,
        },
        status: {
          required: true,
        },
        currency: {
          required: true,
        },
        eventType: {
          required: true,
        },
        category: {
          required: true,
        },
        totalBudget: {
          required: true,
          min_value: 1,
          max_value: 100000000,
        },
        guestType: {
          required: false,
        },
      },
      occasionsList: [],
      occasionsForCategory: [],
      dateValid: true,
      validating: false,
      selectedComponents: null,
      submitButtonLabel: "Create",
    };
  },
  created() {
    let vm = this;

    this.$store.registerModule("AnnualPlannerVuex", AnnualPlannerVuexModule);
    this.getOccasionList();
    this.$store.dispatch("event/getEventTypes", {
      data: this.$auth.user.defaultCalendarId,
      ctx: this,
    });

    [...Array(12).keys()].map((x) => (x >= 8 ? this.hoursArray.push(`${x}:00 AM`) : undefined));
    [...Array(12).keys()].map((x) => (x === 0 ? this.hoursArray.push(`12:00 PM`) : this.hoursArray.push(`${x}:00 PM`)));
    [...Array(8).keys()].map((x) => (x === 0 ? this.hoursArray.push(`12:00 AM`) : this.hoursArray.push(`${x}:00 AM`)));

    this.hoursArray.push();

    console.log(this.hoursArray);

    if (this.$route.params.id) {
      this.getEvent();
      this.submitButtonLabel = "Update";
    }
    if (this.newEventData) {
    }
  },
  mounted() {
    this.isLoading = false;
    let vm = this;
    // vm.$auth.currentUser(vm, true, ()=> {
    //
    //     Promise.all([
    //         CalendarEvent.find(vm.$route.params.id),
    //         EventComponent.get()
    //     ]).then(([event, components]) => {
    //         vm.calendar = new Calendar({id: vm.$auth.user.defaultCalendarId})
    //         vm.event = event.for(vm.calendar)
    //
    //         vm.isLoading = false
    //     })
    // })
  },
  computed: {
    ...mapGetters({
      eventTypes: "event/getEventTypesList",
    }),
    ...mapMutations("EventPlannerVuex", ["setEventData"]),
    dateFormat: {
      get() {
        return this.$material.locale.dateFormat;
      },
      set(val) {
        this.$material.locale.dateFormat = val;
      },
    },
    title: {
      get() {
        return this.eventData.title;
      },
      set(value) {
        this.setEventProperty({
          key: "title",
          actualValue: value,
        });
      },
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/md/_variables.scss";
.list-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 15px;
  margin-bottom: 20px;
  flex-direction: row;
  .list-item {
    border-radius: 4px;
    cursor: pointer;
    width: 120px;
    text-align: center;
    margin-right: 10px;
    position: relative;
    &.active {
      .list-item--icon {
        background: $brand-primary;
        border-color: $brand-primary;
        .md-icon-font {
          color: white;
          content: "check";
        }
        .checked-item {
          position: absolute;
          right: 5px;
          top: 5px;
        }
      }
    }
  }
  .list-item--title {
    margin-top: 5px;
  }
  .list-item--icon {
    width: 120px;
    height: 120px;
    border: 1px solid #e0e0e0;
    text-align: center;
    border-radius: 2px;
    img {
      width: 50%;
      margin-top: 30px;
    }
  }
}
.hide {
  display: none;
}
.mt-0 {
  margin-top: 0;
}
.mt-1 {
  margin-top: 1em;
}
.mb-2 {
  margin-bottom: 2em;
}
</style>
