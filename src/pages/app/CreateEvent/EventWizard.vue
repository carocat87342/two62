<template>
  <div class>
    <div class="container">
      <div class="form-section event-basic-info">
        <div class="form-group">
          <div class="maryoku-field with-icon" :class="{'has-value' : eventData.location}">
            <md-icon>
              <img
                src="https://static-maryoku.s3.amazonaws.com/storage/wizard-icons/icon%20location@2x.png"
              />
            </md-icon>
            <v-select
              v-model="eventData.location"
              :options="locationsList"
              :class="{'has-value' : eventData.location}"
              data-vv-name="location"
              v-validate="modelValidations.location"
            ></v-select>
            <label>Event Location (City)</label>
            <span class="md-error" v-if="errors.has('location')">This field is required</span>
          </div>
          <md-checkbox v-model="eventData.eventPlaceNeeded">I have event place</md-checkbox>
        </div>

        <div class="maryoku-field with-icon" :class="{'has-value' : eventData.eventType}">
          <md-icon>grade</md-icon>
          <v-select
            v-model="eventData.eventType"
            :options="eventTypes"
            :class="{'has-value' : eventData.eventType}"
            data-vv-name="location"
            v-validate="modelValidations.eventType"
          ></v-select>
          <label>Event Type</label>
          <span class="md-error" v-if="errors.has('eventType')">This field is required</span>
        </div>

        <div class="form-group">
          <md-datepicker
            class="purple-field with-icon datepicker-field"
            v-model="eventData.date"
            v-validate="modelValidations.date"
            md-immediately
            :class="[{'md-error': errors.has('date')}]"
          >
            <label>Event Date</label>
            <md-icon class="custom-icon">
              <img
                src="https://static-maryoku.s3.amazonaws.com/storage/wizard-icons/icon date@2x.png"
              />
            </md-icon>
            <span class="md-error" v-if="errors.has('date')">This field is required</span>
          </md-datepicker>

          <md-checkbox v-model="eventData.flexibleWithDates">I'm flexible with dates</md-checkbox>
        </div>

        <div class="event-time">
          <md-radio v-model="eventData.eventDayPart" value="day" class="with-border">Day event</md-radio>
          <md-radio v-model="eventData.eventDayPart" value="night" class="with-border">Night event</md-radio>
          <md-radio v-model="eventData.eventDayPart" value="all" class="with-border">All day</md-radio>
        </div>

        <div class="form-actions">
          <md-button
            class="md-rose next-btn custom-btn"
            @click="goToNext"
            :class="[{'disabled': !eventData.location || !eventData.eventType || !eventData.date}]"
          >Next</md-button>
        </div>
      </div>
    </div>

    <go-back navigation="https://www.maryoku.com/home.html" :home="true"></go-back>
  </div>
</template>

<script>
import GoBack from "./componenets/GoBack";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

import Vue from "vue";
import vSelect from "vue-select";

Vue.component("v-select", vSelect);

export default {
  components: {
    GoBack,
  },
  created() {
    this.$set(this.eventData, "location", this.publicEventData.location);
    this.$set(this.eventData, "eventType", this.publicEventData.eventType);
    this.$set(this.eventData, "date", this.publicEventData.date);
    this.$set(
      this.eventData,
      "eventDayPart",
      this.publicEventData.eventDayPart,
    );
    this.$set(
      this.eventData,
      "eventPlaceNeeded",
      this.publicEventData.eventPlaceNeeded,
    );
    this.$set(
      this.eventData,
      "flexibleWithDates",
      this.publicEventData.flexibleWithDates,
    );
  },
  methods: {
    ...mapMutations("PublicEventPlanner", [
      "setEventProperty",
      "setCurrentStep",
    ]),
    goToNext() {
      let vm = this;

      this.cerrors = {};
      this.validating = true;

      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          this.setEventProperty({
            key: "location",
            actualValue: this.eventData.location,
          });
          this.setEventProperty({
            key: "eventType",
            actualValue: this.eventData.eventType,
          });
          this.setEventProperty({
            key: "eventStartMillis",
            actualValue: this.eventData.date.getTime(),
          });
          this.setEventProperty({
            key: "eventDayPart",
            actualValue: this.eventData.eventDayPart,
          });
          this.setEventProperty({
            key: "eventPlaceNeeded",
            actualValue: this.eventData.eventPlaceNeeded,
          });
          this.setEventProperty({
            key: "flexibleWithDates",
            actualValue: this.eventData.flexibleWithDates,
          });
          this.setCurrentStep({ currentPage: "/about-invited" });
          this.$router.push({ path: `/about-invited` });
        } else {
          this.showNotify();
        }
      });
    },
    validateDate() {
      return this.$refs.datePicker.$el.classList.contains("md-has-value");
    },
    validateAndSubmit() {
      // this.$emit('goToNextPage');
      //  return;
      let vm = this;

      this.cerrors = {};
      this.validating = true;

      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          // this.$parent.isLoading = true;

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
        // this.$emit('goToNextPage');
      }
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
  },
  data() {
    return {
      selectedCountry: null,
      selectedEmployee: null,
      countries: [
        "Algeria",
        "Argentina",
        "Brazil",
        "Canada",
        "Italy",
        "Japan",
        "United Kingdom",
        "United States",
      ],
      step: 1,
      haveEventPlace: false,
      flexibleWithDates: false,
      eventTime: null,
      eventDate: null,
      eventData: {
        location: null,
      },
      modelValidations: {
        location: {
          required: true,
        },
        date: {
          required: true,
        },
        eventType: {
          required: true,
        },
      },
      locationsList: [
        "San Francisco, California",
        "Los Angeles, California",
        "Jacksonville, Florida",
        "Miami, Florida",
        "NYC, New York",
        "Austin, Texas",
        "Huston, Texas",
      ],
      eventTypes: [
        "Reception",
        "Establishment / Activity day",
        "Offsite meeting",
        "Hackathon",
        "Networking Incentive meeting",
        "Fundraising",
        "Partner/Customer meeting",
        "Board meeting",
        "Product launch",
        "Awards / Recognition",
        "Other",
      ],
      options: ["ameed", "ahmad"],
    };
  },
  computed: {
    ...mapState("PublicEventPlanner", ["publicEventData"]),
  },
};
</script>
<style lang="scss">
.form-section.event-basic-info {
  width: 450px;
  margin: 0 auto;
  padding: 0;
  min-height: 440px;
}

.event-time {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;

  .md-radio {
    margin-right: 0;
    width: 31% !important;

    &.with-border {
      padding: 1em 0 1em 0.4em;
    }
  }
}

.datepicker-field {
  .md-icon {
    &.custom-icon {
      position: absolute;
      left: 10px;
      top: 6px;
      display: inherit;
    }
    &:not(.custom-icon) {
      display: none;
    }
  }
  &.md-has-value {
    .md-input {
      padding: 0 0 0 37px !important;
    }
  }
}

.md-datepicker .md-icon.md-date-icon ~ label {
  left: 43px !important;
}
</style>
