<template>
  <div class="event-wizard-building">
    <div class="container">
      <div class="title">3/5</div>
      <selected-value :value="publicEventData.location || 'Not Sure'" property="location"></selected-value>
      <div class="event-building event-basic-info">
        <div class="setting-title mt-70">
          <img :src="`${$iconURL}Onboarding/enter-gray.svg`" class="indicator" />
          Staying in or in need of some fresh air?
        </div>
        <div class="text-center mt-2">Is it an indoor or outdoor event?</div>
        <div class="mt-3 types">
          <div
            class="type-card"
            @click="addType(type.value)"
            :class="{ selected: isSelected(type.value) }"
            v-for="type in types"
            :key="type.value"
          >
            <div>
              <img :src="getIconUrl(type.value)" />
            </div>
            <div>
              {{ type.name }}
            </div>
            <div>
              <md-checkbox class="md-checkbox-circle md-red" v-model="selectedTypes" :value="type.value"></md-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
    <wizard-status-bar :currentStep="3" @next="goToNext" @skip="skip" @back="back"></wizard-status-bar>
  </div>
</template>

<script>
import GoBack from "./componenets/GoBack";
import SelectedValue from "./componenets/SelectedValue";
import WizardStatusBar from "./componenets/WizardStatusBar";
import { MaryokuInput } from "@/components";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  components: {
    GoBack,
    SelectedValue,
    WizardStatusBar,
    MaryokuInput,
  },
  created() {
    if (this.publicEventData.places) {
      this.selectedTypes = this.publicEventData.places;
    }
  },
  methods: {
    ...mapMutations("PublicEventPlanner", ["setEventProperty", "setCurrentStep"]),
    addType(value) {
      if (this.isSelected(value)) {
        this.selectedTypes.splice(this.selectedTypes.indexOf(value), 1);
      } else {
        this.selectedTypes.push(value);
      }
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
    goToNext() {
      this.setEventProperty({ key: "places", actualValue: this.selectedTypes });
      this.$router.push({ path: `/event-wizard-type` });
    },
    skip() {
      this.$router.push({ path: `/event-wizard-type` });
    },
    back() {
      this.$router.push({ path: `/event-wizard-location` });
    },
    getIconUrl(value) {
      if (value === "INDOORS" || value === "OUTDOORS") {
        return `${this.$iconURL}Onboarding/${value.toLowerCase()}-dark.svg`;
      } else if (value === "VIRTUAL") {
        return `${this.$secondIconURL}Creation/group-11232.svg`;
      }
    },
    isSelected(value) {
      return this.selectedTypes.indexOf(value) > -1;
    },
  },
  data() {
    return {
      buildings: [],
      selectedTypes: [],
      types: [
        {
          value: "INDOORS",
          name: "Indoor Event",
          selected: false,
        },
        {
          value: "OUTDOORS",
          name: "Outdoor Event",
          selected: false,
        },
        {
          value: "VIRTUAL",
          name: "Virtual Event",
          selected: false,
        },
      ],
    };
  },
  computed: {
    ...mapState("PublicEventPlanner", ["publicEventData"]),
  },
};
</script>
<style lang="scss">
.event-wizard-building {
  .event-building.event-basic-info {
    width: 100%;
    margin: 0 auto;
    padding: 0;
  }

  .md-checkbox-circle {
    margin: 0px;
  }
  .input-name {
    width: 80%;
    text-align: right;
    .form-input {
      width: 280px;
      margin: 0 0 0 auto;
      display: inline-block;
    }
  }
  .indicator-reverse {
    transform: scaleX(-1);
    margin-left: 20px;
  }
}
</style>
