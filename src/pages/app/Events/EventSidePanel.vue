<template>
  <div class="md-layout" style="max-height: 100vh">
    <vue-element-loading :active="working" spinner="ring" color="#FF547C" />
    <div class="md-layout-item md-size-5" style="padding: 0; margin: 0">
      <h4 class="md-title">
        <md-button @click="closePanel" class="md-button md-theme-default md-simple md-just-icon">
          <md-icon>arrow_back</md-icon>
        </md-button>
      </h4>
    </div>
    <div class="md-layout-item md-size-95" style="max-height: 90vh">
      <h4 class="md-title" style="margin-bottom: 0; line-height: 51px">
        {{ this.editMode ? "Edit Event" : "Create Event" }}
      </h4>
      <div class="md-layout" style="overflow: auto; max-height: 90vh; margin-top: 24px">
        <div class="md-layout-item mx-auto">
          <form>
            <div class="md-layout mb16">
              <div class="md-layout-item md-size-100">
                <md-field :class="[{ 'md-error': errors.has('title') }]">
                  <label>Event title</label>
                  <md-input
                    v-model="eventData.title"
                    data-vv-name="title"
                    v-validate="modelValidations.title"
                    required
                    v-focus
                    v-select-all
                  />
                  <span class="md-error" v-if="errors.has('title')">The event title is required</span>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100">
                <md-autocomplete
                  v-model="eventData.occasion"
                  data-vv-name="occasion"
                  :md-options="occasionsList"
                  @md-opened="mdOpened"
                  class="change-icon-order select-with-icon mb16"
                  :class="[{ 'md-error': errors.has('occasion') }]"
                  value=""
                >
                  <label>Occasion</label>
                  <span class="md-error" v-if="errors.has('occasion')">This field is required</span>
                </md-autocomplete>
              </div>
              <div class="md-layout-item md-small-size-100">
                <md-field :class="[{ 'md-error': errors.has('eventType') }]" class="select-with-icon">
                  <label>Event Type</label>
                  <md-select
                    v-model="eventData.eventType"
                    data-vv-name="eventType"
                    v-validate="modelValidations.eventType"
                    required
                  >
                    <md-option v-for="option in eventTypes" :key="option.item" :value="option.item">
                      {{ option.item }}
                    </md-option>
                  </md-select>
                  <span class="md-error" v-if="errors.has('eventType')">The event eventType is required</span>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100">
                <md-field :class="[{ 'md-error': errors.has('participantsType') }]" class="select-with-icon">
                  <label>Invitee Type</label>
                  <md-select
                    v-model="eventData.participantsType"
                    data-vv-name="participantsType"
                    v-validate="modelValidations.participantsType"
                    required
                  >
                    <md-option v-for="(option, index) in InviteeTypes" :key="index" :value="option">
                      {{ option }}
                    </md-option>
                  </md-select>
                  <span class="md-error" v-if="errors.has('participantsType')">The event Invitee Type is required</span>
                </md-field>
              </div>
              <!--<div class="md-layout-item md-small-size-100">-->
              <!--<md-field :class="[{'md-error': errors.has('category')}]" class="select-with-icon">-->
              <!--<label>Category</label>-->
              <!--<md-select v-model="category"-->
              <!--data-vv-name="category"-->
              <!--v-validate= "modelValidations.category"-->
              <!--required>-->
              <!--<md-option v-for="option in categories"-->
              <!--:key="option.id"-->
              <!--:value="option.item">-->
              <!--{{ option.item }}-->
              <!--</md-option>-->
              <!--</md-select>-->
              <!--<span class="md-error" v-if="errors.has('category')">The event category is required</span>-->
              <!--</md-field>-->
              <!--</div>-->
            </div>
            <div class="md-layout mb16">
              <div class="md-layout-item md-size-100 md-small-size-100">
                <md-datepicker
                  v-model="eventData.date"
                  data-vv-name="date"
                  ref="datePicker"
                  v-validate="modelValidations.date"
                  required
                >
                  <label
                    :class="[
                      { 'md-error': $refs.datePicker && !$refs.datePicker.$el.classList.contains('md-has-value') },
                    ]"
                    >Date</label
                  >
                </md-datepicker>
              </div>
            </div>
            <div class="md-layout mb16">
              <div class="md-layout-item md-size-50 md-small-size-100">
                <md-field :class="[{ 'md-error': errors.has('time') }]" class="">
                  <label>Start Time</label>
                  <md-select v-model="eventData.time" data-vv-name="time" v-validate="modelValidations.time" required>
                    <md-option v-for="hour in hoursArray" :key="hour" :value="hour">
                      {{ hour }}
                    </md-option>
                  </md-select>
                  <span class="md-error" v-if="errors.has('time')">The event time is required</span>
                </md-field>
              </div>
              <div class="md-layout-item md-size-50 md-small-size-100">
                <md-field :class="[{ 'md-error': errors.has('duration') }]" class="">
                  <label>Duration</label>
                  <md-select
                    v-model="eventData.duration"
                    data-vv-name="duration"
                    v-validate="modelValidations.duration"
                    required
                  >
                    <md-option v-for="hour in durationArray" :key="hour" :value="hour">
                      {{ hour + " hours" }}
                    </md-option>
                  </md-select>
                  <span class="md-error" v-if="errors.has('duration')">The event duration time is required</span>
                </md-field>
              </div>
            </div>
            <div class="md-layout mb16">
              <div class="md-layout-item md-small-size-100">
                <md-field :class="[{ 'md-error': errors.has('numberOfParticipants') }]">
                  <label>Number of Participants</label>
                  <md-input
                    type="text"
                    v-model="eventData.numberOfParticipants"
                    data-vv-name="numberOfParticipants"
                    v-validate="modelValidations.numberOfParticipants"
                    required
                  />
                  <span class="md-error" v-if="errors.has('numberOfParticipants')"
                    >The event participants is required and should be in range of 1 - 10 000</span
                  >
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label>Budget (Per Participant)</label>
                  <span class="md-prefix">$</span>
                  <md-input
                    v-model="eventData.budgetPerPerson"
                    data-vv-name="budgetPerPerson"
                    v-validate="modelValidations.budgetPerPerson"
                    required
                  />
                </md-field>
              </div>
              <div class="md-layout-item md-size-100" style="margin-top: 24px">
                <md-button v-if="editMode && openInPlannerOption" @click="openEventPlanner" class="md-simple md-info">
                  &lt; Open in Event Planner
                </md-button>
                <div class="pull-right">
                  <md-button class="md-success create-new-event-panel-submit-button" @click="validateEvent">
                    {{ modalSubmitTitle }}
                  </md-button>
                  <md-button v-if="this.editMode" class="md-danger md-just-icon" @click="showDeleteAlert">
                    <md-icon class="md-theme-warning" style="font-size: 1.5rem !important">delete </md-icon>
                  </md-button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import auth from '@/auth';
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import CalendarEvent from "@/models/CalendarEvent";
import Calendar from "@/models/Calendar";
import Occasion from "@/models/Occasion";
import Swal from "sweetalert2";
import moment from "moment";
import _ from "underscore";
import VueElementLoading from "vue-element-loading";

export default {
  components: {
    VueElementLoading,
  },
  props: {
    year: Number,
    month: Number,
    occasionsOptions: Array,
    currentEvent: {
      type: Object,
      default: null,
    },
    modalSubmitTitle: String,
    editMode: Boolean,
    modalTitle: String,
    sourceEventData: Object,
    openInPlannerOption: Boolean,
  },
  data: () => ({
    working: false,
    eventData: {},
    occasionsList: [],
    occasionsForCategory: [],
    // auth: auth,
    hoursArray: [],
    durationArray: [...Array(12).keys()].map((x) => ++x),
    dateValid: true,
    editTitle: false,
    InviteeTypes: ["Guests Only", "Guests and spouse", "Guests and families", "Guests siblings"],
    modelValidations: {
      title: {
        required: true,
      },
      date: {
        required: true,
      },
      time: {
        required: true,
      },
      duration: {
        required: true,
      },
      numberOfParticipants: {
        required: true,
        min_value: 1,
        max_value: 10000,
      },
      status: {
        required: false,
      },
      currency: {
        required: false,
      },
      eventType: {
        required: true,
      },
      participantsType: {
        required: true,
      },
      category: {
        required: false,
      },
    },
  }),

  created() {
    if (this.editMode) {
      this.eventData = {
        id: this.sourceEventData.id,
        title: this.sourceEventData.title,
        occasion: this.sourceEventData.occasion || "",
        date: new Date(this.sourceEventData.eventStartMillis),
        numberOfParticipants: this.sourceEventData.numberOfParticipants,
        budgetPerPerson: this.sourceEventData.budgetPerPerson,
        status: this.sourceEventData.status,
        currency: this.sourceEventData.currency,
        eventType: this.sourceEventData.eventType,
        participantsType: this.sourceEventData.participantsType,
        category: this.sourceEventData.category,
      };

      if (this.sourceEventData.eventStartMillis) {
        this.eventData.date = new Date(this.sourceEventData.eventStartMillis);
        this.eventData.time = moment(new Date(this.sourceEventData.eventStartMillis).getTime()).format("H:mm A");
      }

      if (this.sourceEventData.eventStartMillis && this.sourceEventData.eventEndMillis) {
        this.eventData.duration =
          (this.sourceEventData.eventEndMillis - this.sourceEventData.eventStartMillis) / 1000 / 60 / 60;
      }
    } else {
      this.eventData = {
        title: this.sourceEventData.title,
        occasion: this.sourceEventData.occasion || "",
        date: new Date(this.sourceEventData.eventStartMillis),
        numberOfParticipants: this.sourceEventData.numberOfParticipants,
        budgetPerPerson: this.sourceEventData.budgetPerPerson,
        status: this.sourceEventData.status,
        currency: this.sourceEventData.currency,
        eventType: this.sourceEventData.eventType,
        participantsType: this.sourceEventData.participantsType,
        category: this.sourceEventData.category,
      };
    }

    this.$store.registerModule("AnnualPlannerVuex", AnnualPlannerVuexModule);

    [...Array(12).keys()].map((x) => (x >= 8 ? this.hoursArray.push(`${x}:00 AM`) : undefined));
    [...Array(12).keys()].map((x) => (x === 0 ? this.hoursArray.push(`12:00 PM`) : this.hoursArray.push(`${x}:00 PM`)));
    [...Array(8).keys()].map((x) => (x === 0 ? this.hoursArray.push(`12:00 AM`) : this.hoursArray.push(`${x}:00 AM`)));

    this.hoursArray.push();
  },
  computed: {
    ...mapState("AnnualPlannerVuex", ["eventModalOpen"]),
    ...mapGetters({
      categories: "event/getCategoriesList",
      currencies: "event/getCurrenciesList",
      eventTypes: "event/getEventTypesList",
    }),
  },
  mounted() {
    this.getOccasionList();
    this.$store.dispatch("event/getEventTypes", { data: this.$auth.user.defaultCalendarId, ctx: this });

    this.$root.$on("statusChange", (newStatus) => {
      this.status = newStatus;
    });

    this.$root.$on("submitForm", () => {
      this.validateEvent();
    });

    console.log(this.$auth.user.defaultCalendarId);
  },
  methods: {
    ...mapMutations("AnnualPlannerVuex", ["resetForm", "setEventModal", "setEventProperty"]),
    toogleTitle() {
      this.editTitle = !this.editTitle;
    },
    clearForm() {
      this.eventData = {
        id: null,
        occasion: "",
        title: "New Event",
        date: null,
        time: "",
        duration: "",
        numberOfParticipants: 0,
        status: "draft",
        currency: "USD",
        eventType: "Party",
        participantsType: "Guests Only",
        category: "CompanyDays",
      };
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validateDate() {
      return this.$refs.datePicker.$el.classList.contains("md-has-value");
    },
    validateTitle() {
      if (!this.title) {
        this.editTitle = true;
      }
    },
    updateEvent() {
      // this.$parent.isLoading = true;
      this.working = true;

      this.$nextTick(() => {
        this.working = true;
        let _calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
        let editedEvent = new CalendarEvent(this.eventData);
        editedEvent.eventStartMillis = this.getEventStartInMillis();
        editedEvent.eventEndMillis = this.getEventEndInMillis();

        let catObject = _.find(this.occasionsForCategory, (el) => el.value === editedEvent.occasion) || {
          category: "CompanyDays",
        };
        this.eventData.category = catObject.category;
        editedEvent.category = catObject.category;
        // editedEvent.participantsType = 'Test'; // HARDCODED, REMOVE AFTER BACK WILL FIX API,
        editedEvent
          .for(_calendar)
          .save()
          .then((response) => {
            // this.$parent.isLoading = false;
            this.closePanel();
            this.working = false;
            this.$root.$emit("calendar-refresh-events");
          })
          .catch((error) => {
            console.log(error);
            this.working = false;
            // this.$parent.isLoading = false;
          });
      });
    },
    validateEvent() {
      this.working = true;
      this.validateTitle();
      this.$validator.validateAll().then((isValid) => {
        if ((this.dateValid = this.validateDate()) && isValid) {
          // this.$parent.isLoading = true;
          this.working = true;
          this.setEventModal(false);
          this.editMode ? this.updateEvent() : this.createEvent();
        } else {
          this.showNotify();
        }
        this.working = false;
      });
    },
    showDeleteAlert(e, ev) {
      const _this = this;
      e.stopPropagation();
      Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        showCancelButton: true,
        confirmButtonClass: "md-button md-success",
        cancelButtonClass: "md-button md-danger",
        confirmButtonText: "Yes, delete it!",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          // this.$parent.isLoading = true;
          this.working = true;
          let _calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
          let event = new CalendarEvent({ id: this.eventData.id });

          event
            .for(_calendar)
            .delete()
            .then((result) => {
              // this.$parent.isLoading = false;
              this.closePanel();
              this.$root.$emit("calendar-refresh-events");
            })
            .catch(() => {
              // this.$parent.isLoading = false;
              this.working = false;
            });
        }
      });
    },
    createEvent() {
      this.working = true;
      setTimeout(() => {
        this.working = true;
        let calendarId = this.$auth.user.defaultCalendarId;
        let _calendar = new Calendar({ id: calendarId });
        let catObject = _.find(this.occasionsForCategory, (el) => el.value === this.eventData.occasion) || {
          category: "CompanyDays",
        };
        this.category = catObject.category;

        let newEvent = new CalendarEvent({
          calendar: { id: calendarId },
          title: this.eventData.title,
          occasion: this.eventData.occasion,
          eventStartMillis: this.getEventStartInMillis(),
          eventEndMillis: this.getEventEndInMillis(),
          numberOfParticipants: this.eventData.numberOfParticipants,
          budgetPerPerson: this.eventData.budgetPerPerson,
          status: "draft",
          currency: this.eventData.currency,
          eventType: this.eventData.eventType,
          participantsType: this.eventData.participantsType,
          category: catObject.category, //! this.eventData.editable ? 'Holidays' : 'CompanyDays',
          editable: true,
          //  participantsType: 'Test', // HARDCODED, REMOVE AFTER BACK WILL FIX API,
        })
          .for(_calendar)
          .save()
          .then((response) => {
            console.log("new event => ", response);
            // this.$parent.isLoading = false;
            this.closePanel();
            this.working = false;
            this.$root.$emit("calendar-refresh-events");
            this.$root.$emit("get-started-event-created", response);
          })
          .catch((error) => {
            console.log(error);
            this.working = false;
            // this.$parent.isLoading = false;
          });
      }, 100);
    },
    getEventStartInMillis() {
      if (this.eventData.date && this.eventData.time) {
        let eventStartTime =
          new Date(this.eventData.date).getTime() +
          this.convertHoursToMillis(moment(this.eventData.time, "HH:mm a").format("H"));
        return eventStartTime;
      }
    },
    getEventEndInMillis() {
      if (this.eventData.date && this.eventData.time && this.eventData.duration) {
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
    showNotify() {
      this.$notify({
        message: "Please, check all required fields",
        icon: "warning",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger",
      });
    },
    mdOpened: function () {
      this.eventData.occasion += " ";
      this.eventData.occasion = this.eventData.occasion.substring(0, this.eventData.occasion.length - 1);
    },
    openEventPlanner() {
      this.$router.push({ name: "EditBuildingBlocks", params: { id: this.eventData.id } });
    },
    closePanel() {
      this.setEventModal(false);
      this.editTitle = false;
      this.clearForm();
      this.$emit("closePanel");
    },
    getOccasionList() {
      if (this.$auth.user.defaultCalendarId) {
        let _calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });

        new Occasion()
          .for(_calendar)
          .get()
          .then((resp) => {
            this.occasionsList = resp.map((val) => val.title);
            this.occasionsForCategory = resp.map((val) => {
              return { value: val.title, category: val.category };
            });
          })
          .catch((error) => {
            console.log("error =>> ", error);
          });
      }
    },
  },
  watch: {
    value(newValue, oldValue) {
      this.initAnimation(newValue, oldValue);
    },
  },
};
</script>
<style lang="scss" scope>
.md-datepicker {
  .md-icon.md-date-icon {
    display: none;
    & ~ label {
      left: 0;
    }
  }
  input {
    margin-left: 0 !important;
  }
  &.md-field::before,
  &.md-field::after {
    width: 100%;
  }
}

.md-field > .md-icon ~ .md-input {
  margin: 0;
}

/*.modal-container {*/
  /*max-width: 570px;*/
/*}*/
</style>
<style lang="scss">
.modal-z-index {
  z-index: 5;
}

.large-z-index {
  z-index: 6;
  position: relative;
}

.move-center {
  margin: 0 auto !important;
}

.move-left {
  margin-left: 0 !important;
  margin-right: auto !important;
}

.move-right {
  margin-right: 0 !important;
  margin-left: auto !important;
}

.text-center {
  text-align: center;
}

.d-flex {
  display: flex;
}

.items-center-v {
  align-items: center;
}

.items-center-g {
  justify-content: center;
}

.justify-beetwen {
  justify-content: space-between;
}

.md-field .md-error {
  text-align: left;
}

.swal2-container {
  z-index: 10000;
}
</style>

<!--<script>-->

<!--import {LabelEdit} from '@/components';-->
