<template>
  <div class="event-wizard-celebrating">
    <div class="container">
      <div class="title">4/5</div>
      <selected-value
        :value="publicEventData.eventType.name"
        :property="publicEventData.eventType.key"
      ></selected-value>
      <div class="event-basic-info">
        <div class="setting-title mt-70">
          <img :src="`${$iconURL}Onboarding/enter-gray.svg`" class="indicator" />
          What are we celebrating?
        </div>
        <div class="mt-3 types">
          <div
            class="type-card"
            @click="selected = type"
            :class="{ selected: type.value == selected.value }"
            v-for="type in occasions"
            :key="type.value"
          >
            <div>
              <img :src="`${$iconURL}Onboarding/${type.icon}`" />
            </div>
            <div>
              {{ type.name }}
            </div>
            <div>
              <md-checkbox class="md-checkbox-circle md-red" v-model="selected" :value="type"></md-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
    <wizard-status-bar :currentStep="4" @next="goToNext" @skip="skip" @back="back"></wizard-status-bar>
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
    if (this.publicEventData.occasion) {
      this.selected = this.occasions.find((it) => it.value == this.publicEventData.occasion.value);
    }
  },
  methods: {
    ...mapMutations("PublicEventPlanner", ["setEventProperty", "setCurrentStep"]),
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
      this.setEventProperty({ key: "occasion", actualValue: this.selected });
      if (this.selected.value === "holiday") this.$router.push({ path: `/event-wizard-religion` });
      else this.$router.push({ path: `/event-wizard-vibes` });
    },
    skip() {
      this.$router.push({ path: `/event-wizard-vibes` });
    },
    back() {
      this.$router.push({ path: `/event-wizard-type` });
    },
  },
  data() {
    return {
      selected: {},
      occasions: [
        {
          value: "National Day",
          name: "National Day",
          selected: false,
          icon: "ballons-dark.svg",
        },
        {
          value: "Holiday",
          name: "Holiday",
          selected: false,
          icon: "gift-dark.svg",
        },
        {
          value: "Milestone",
          name: "Milestone",
          selected: false,
          icon: "flag-dark.svg",
        },
        {
          value: "Company Day",
          name: "Company Day",
          selected: false,
          icon: "champaign-dark.svg",
        },
        {
          value: "Season",
          name: "Season",
          selected: false,
          icon: "beach.svg",
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
.event-wizard-celebrating {
  .event-basic-info {
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
