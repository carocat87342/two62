<template>
  <div class="">
    <md-card>
      <md-card-header class="md-card-header-text md-card-header-rose">
        <div class="card-text">
          <h6 class="title2">Event Details</h6>
        </div>
      </md-card-header>
      <md-card-content>
        <md-field :class="[{ 'md-error': errors.has('occasion') }]" class="select-with-icon">
          <label>Occasion</label>
          <md-select v-model="form.occasion" data-vv-name="occasion" v-validate="modelValidations.occasion">
            <md-option v-for="option in occasionOptions" :key="option.id" :value="option.value">
              {{ option.value }}
            </md-option>
          </md-select>
          <span class="md-error" v-if="errors.has('occasion')">The event occasion is required</span>
        </md-field>

        <md-field :class="[{ 'md-error': errors.has('eventName') }]">
          <label>Event Title</label>
          <md-input v-model="form.eventName" data-vv-name="eventName" v-validate="modelValidations.eventName" />
          <span class="md-error" v-if="errors.has('eventName')">The event title is required</span>
        </md-field>

        <md-datepicker v-model="form.date" data-vv-name="date" ref="datePicker" v-validate="modelValidations.date">
          <label :class="[{ 'md-error': $refs.datePicker && !$refs.datePicker.$el.classList.contains('md-has-value') }]"
            >Date</label
          >
        </md-datepicker>

        <div class="md-layout">
          <div class="md-layout-item md-size-60 md-small-size-100" style="padding-left: 0">
            <md-field :class="[{ 'md-error': errors.has('time') }]" class="">
              <label>Start Time</label>
              <md-select v-model="form.time" data-vv-name="time" v-validate="modelValidations.time">
                <md-option v-for="hour in hoursArray" :key="hour" :value="hour">
                  {{ hour }}
                </md-option>
              </md-select>
              <span class="md-error" v-if="errors.has('time')">The event time is required</span>
            </md-field>
          </div>

          <div class="md-layout-item md-size-40 md-small-size-100" style="padding: 0">
            <md-field :class="[{ 'md-error': errors.has('duration') }]" class="">
              <label>Duration</label>
              <md-select v-model="form.duration" data-vv-name="duration" v-validate="modelValidations.duration">
                <md-option v-for="hour in durationArray" :key="hour" :value="hour">
                  {{ hour + " hours" }}
                </md-option>
              </md-select>
              <span class="md-error" v-if="errors.has('duration')">The event duration time is required</span>
            </md-field>
          </div>
        </div>

        <div class="md-layout">
          <div class="md-layout-item md-size-40 md-small-size-100 pl-0" style="padding-left: 0">
            <md-field :class="[{ 'md-error': errors.has('participants') }]">
              <label>Number of Participants</label>
              <md-input
                type="text"
                v-model="form.participants"
                data-vv-name="participants"
                v-validate="modelValidations.participants"
              />
              <span class="md-error" v-if="errors.has('participants')"
                >The event participants is required and should be in range of 1 - 10 000</span
              >
            </md-field>
          </div>
          <div class="md-layout-item md-size-60 md-small-size-100" style="padding: 0">
            <md-field :class="[{ 'md-error': errors.has('location') }]">
              <label>Geography</label>
              <md-input
                type="text"
                v-model="form.location"
                data-vv-name="location"
                v-validate="modelValidations.location"
              />
              <span class="md-error" v-if="errors.has('location')">The location is required</span>
            </md-field>
          </div>
        </div>
      </md-card-content>
    </md-card>

    <md-card>
      <md-card-header class="md-card-header-text md-card-header-rose">
        <div class="card-text">
          <h6 class="title2">Budget Control</h6>
        </div>
      </md-card-header>
      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-size-60 md-small-size-100" style="padding-left: 0">
            <md-field :class="[{ 'md-error': errors.has('budget') }]">
              <label>Budget</label>
              <md-input v-model="form.budget" data-vv-name="budget" v-validate="modelValidations.budget" />
              <span class="md-error" v-if="errors.has('budget')"
                >The event budget is required and should be in range of 1 - 1 000 000</span
              >
            </md-field>
          </div>

          <div class="md-layout-item md-size-40 md-small-size-100" style="padding: 0">
            <md-checkbox class="md-info" v-model="form.budgetPerPersonFlag" @change="updateBudgetType($event)"
              >Per Guest</md-checkbox
            >
          </div>
        </div>

        <div class="md-layout">
          <div class="md-layout-item md-size-40 md-small-size-100 pl-0" style="padding-left: 0">
            <div style="width: 100%; height: 100%; margin: 0; padding: 0">
              <chart-component
                class="md-size-100 md-layout-item"
                :chart-data="pieChart.data"
                :chart-options="pieChart.options"
                chart-type="Pie"
              />
            </div>
          </div>
          <div class="md-layout-item md-size-60 md-small-size-100 pl-0" style="padding-left: 0">
            <div style="position: relative; top: 20%">
              <p>
                <i class="fa fa-circle text-success"></i> Remaining Budget (${{
                  (form.budgetPerPersonFlag ? form.budget * form.participants - spentBudget : form.budget - spentBudget)
                    | formatNum
                }})
              </p>
              <p><i class="fa fa-circle text-rose"></i> Spent Budget (${{ spentBudget | formatNum }})</p>
            </div>
          </div>
        </div>
      </md-card-content>
    </md-card>

    <div class="md-layout-item md-size-100" style="display: none">
      <div class="event-form-padding">
        <form class="md-layout">
          <chart-card
            class="md-size-100 md-layout-item"
            :chart-data="pieChart.data"
            :chart-options="pieChart.options"
            chart-type="Pie"
          >
            <!--<template slot="footer">
              <div class="md-layout">
                <div class="md-layout-item">
                  <i class="fa fa-circle text-info"></i> Remaining Budget (${{ form.budget - spentBudget }})
                </div>
                <div class="md-layout-item">
                  <i class="fa fa-circle text-danger"></i> Spent Budget (${{ spentBudget }})
                </div>
                <div class="md-layout-item md-size-100" v-if="spentBudget > form.budget">
                  &lt;!&ndash;<div class="warning text-warning">Budget is exceeded. You should either increase total budget or update costs</div>&ndash;&gt;
                </div>

                <md-field :class="[{'md-error': errors.has('budget')}]" style="margin: 20px 0 10px;">
                  <label>Total Budget</label>
                  <md-input v-model="form.budget"
                            data-vv-name="budget"
                            v-validate= "modelValidations.budget"
                            required/>
                  <span class="md-error" v-if="errors.has('budget')">The event budget is required and should be in range of 1 - 1 000 000</span>
                </md-field>
              </div>
            </template>-->
          </chart-card>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { ChartCard } from "@/components";
import CalendarEvent from "@/models/CalendarEvent";
import CalendarEventImage from "@/models/CalendarEventImage";
import Calendar from "@/models/Calendar";
import moment from "moment";
import ChartComponent from "@/components/Cards/ChartComponent";

export default {
  name: "event-header-form",
  components: {
    ChartComponent,
    ChartCard,
  },
  props: {
    occasionOptions: Array,
    formData: Object,
    shouldUpdate: Boolean,
    event: Object,
  },

  data: () => ({
    hoursArray: [...Array(24).keys()].map((x) => (x < 10 ? `0${x}:00` : `${x}:00`)),
    durationArray: [...Array(12).keys()].map((x) => ++x),
    dateValid: true,
    isModalLoading: false,
    form: {
      eventName: "",
      occasion: "",
      date: null,
      time: "",
      duration: "",
      participants: "",
      status: "draft",
      budget: "",
      location: "",
      budgetPerPersonFlag: false,
    },
    uploadedImages: [],

    modelValidations: {
      eventName: {
        required: true,
      },
      occasion: {
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
      participants: {
        required: true,
        min_value: 1,
        max_value: 10000,
      },
      location: {
        required: true,
      },
      status: {
        required: true,
      },
      budget: {
        required: true,
        min_value: 1,
        max_value: 1000000,
      },
    },
  }),
  watch: {
    formData() {
      this.validateDate();
      this.form = this.formData;
    },
  },
  mounted() {
    if (this.formData) {
      this.form = this.formData;
      this.form.date = moment(this.formData.eventStartInMillis);
      this.formData.date = new Date(this.formData.eventStartInMillis);
    }

    this.$root.$on("statusChange", (newStatus) => {
      this.form.status = newStatus;
    });

    this.$root.$on("submitForm", (images) => {
      this.validateEvent();
      this.uploadedImages = images;
    });
  },
  methods: {
    updateEvent() {
      let _calendar = new Calendar({ id: this.$store.state.calendarId });
      let editedEvent = new CalendarEvent({ id: this.event.id });

      editedEvent.title = this.form.eventName;
      editedEvent.eventStartMillis = this.getEventStartInMillis();
      editedEvent.eventEndMillis = this.getEventEndInMillis();
      editedEvent.location = this.form.location;
      editedEvent.occasion = this.form.occasion;
      editedEvent.numberOfParticipants = this.form.participants;
      editedEvent.totalBudget = this.form.budget;
      editedEvent.status = this.form.status;
      editedEvent.currency = "USD"; // HARDCODED, REMOVE AFTER BACK WILL FIX API
      editedEvent.participantsType = "Test"; // HARDCODED, REMOVE AFTER BACK WILL FIX API,
      editedEvent.components = this.$store.state.eventData.components;
      editedEvent.budgetPerPersonFlag = this.form.budgetPerPersonFlag;

      editedEvent
        .for(_calendar)
        .save()
        .then((response) => {
          this.$parent.isLoading = false;
          this.$router.push({ path: "/events" });
        })
        .catch((error) => {
          console.log(error);
          this.$parent.isLoading = false;
        });
    },
    saveEvent() {
      let _calendar = new Calendar({ id: this.$store.state.calendarId });

      let newEvent = new CalendarEvent({
        calendar: { id: this.$store.state.calendarId },
        title: this.form.eventName,
        eventStartMillis: this.getEventStartInMillis(),
        eventEndMillis: this.getEventEndInMillis(),
        location: this.form.location,
        occasion: this.form.occasion,
        numberOfParticipants: this.form.participants,
        totalBudget: this.form.budget,
        status: this.form.status,
        currency: "USD", // HARDCODED, REMOVE AFTER BACK WILL FIX API
        participantsType: "Test", // HARDCODED, REMOVE AFTER BACK WILL FIX API,
        components: this.$store.state.eventData.components,
        budgetPerPersonFlag: this.form.budgetPerPersonFlag,
      }).for(_calendar);

      newEvent
        .save()
        .then((ev) => {
          let images = this.uploadedImages.map((image) => {
            return new CalendarEventImage({ featuredImageFile: image.src }).for(_calendar, ev).save();
          });
          Promise.all(images)
            .then((values) => {
              this.$parent.isLoading = false;
              this.$router.push({ path: "/events" });
            })
            .catch((error) => {
              console.log(error);
              this.$parent.isLoading = false;
            });
        })
        .catch((error) => {
          console.log(error);
          this.$parent.isLoading = false;
        });
    },
    createEvent() {
      if (this.$store.state.calendarId === null) {
        Calendar.get()
          .then((calendars) => {
            this.$store.state.calendarId = calendars[0].id;
            this.saveEvent();
          })
          .catch((error) => {
            console.log(error);
            this.$parent.isLoading = false;
          });
      } else {
        this.saveEvent();
      }
    },
    validateDate() {
      return this.$refs.datePicker.$el.classList.contains("md-has-value");
    },
    validateEvent() {
      this.$validator.validateAll().then((isValid) => {
        if ((this.dateValid = this.validateDate()) && isValid) {
          this.$parent.isLoading = true;
          this.$props.shouldUpdate ? this.updateEvent() : this.createEvent();
        } else {
          this.showNotify();
        }
      });
    },
    getEventStartInMillis() {
      if (this.form.date && this.form.time) {
        let eventStartTime =
          new Date(this.form.date).getTime() + this.convertHoursToMillis(+this.form.time.substring(0, 2));
        return eventStartTime;
      }
    },
    getEventEndInMillis() {
      if (this.form.date && this.form.time && this.form.duration) {
        let eventEndTime = this.getEventStartInMillis() + this.convertHoursToMillis(this.form.duration);
        return eventEndTime;
      }
      return 0;
    },
    convertHoursToMillis(hours) {
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
    calculateSpent() {
      if (this.spentBudget === 0 || this.spentBudget === NaN) {
        return 0;
      }
      return this.spentBudget;
    },
    calculateRemain() {
      if (this.form.budget === 0 || this.form.budget === NaN || this.form.budget === "") {
        return this.calculateSpent() > 0 ? 0 : 1;
      }
      if (this.form.budgetPerPersonFlag) {
        return this.form.budget * this.form.participants - this.spentBudget;
      }
      if (this.spentBudget > this.form.budget) {
        return 0;
      }
      return this.form.budget - this.spentBudget;
    },
    updateBudgetType(e) {},
  },

  computed: {
    isDateValid() {
      this.form.date && this.validateDate();
    },
    spentBudget() {
      let totalSpent = 0;
      if (this.$store.state.eventData.components) {
        this.$store.state.eventData.components.forEach(function (component) {
          if (component && component.vendors) {
            component.vendors.forEach(function (val) {
              totalSpent += val.cost;
            });
          }
        });
      }

      return totalSpent;
    },
    pieChart() {
      return {
        data: {
          labels: [" ", " "], // should be empty to remove text from chart
          series: [this.calculateRemain(), this.calculateSpent()],
        },
        options: {
          donut: true,
          donutWidth: 15,
        },
      };
    },
  },
  filters: {
    formatNum(value) {
      return `${value.toLocaleString()}`;
    },
  },
};
</script>

<style lang="scss">
.md-custom-error {
  opacity: 1;
  margin-bottom: 6px;
  color: red;
  margin-top: -11px;
  font-size: 12px;
}

.event-form-padding {
  margin-top: 0;

  .padding-card {
    //padding-top: 15px;
    //padding-bottom: 30px;
  }
}
.md-datepicker-dialog {
  height: 330px;
}
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

  &.md-field::after {
    width: 100%;
  }
}
.clickable-button {
  pointer-events: all;
}
.file-input {
  margin-bottom: 15px;
}
.image-container {
  text-align: center;

  img {
    width: auto;
    max-height: 150px;
  }
}

.header-image-wrapper .file-input {
  margin-right: 10px;
}
</style>
