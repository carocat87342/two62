<template>
  <div class="event-wizard-type">
    <div class="container">
      <div class="title">4/5</div>
      <div class="event-type event-basic-info">
        <div class="setting-title mt-3">What type of event are you planning on?</div>
        <div class="mt-3 types">
          <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" />
          <div
            class="type-card"
            @click="selectedType = type"
            :class="{ selected: selectedType && selectedType.key == type.key }"
            v-for="type in eventTypes"
            :key="type.value"
          >
            <div>
              <img :src="`${$iconURL}Onboarding/${type.key}.svg`" />
            </div>
            <div>
              {{ type.name }}
            </div>
            <div>
              <md-checkbox class="md-checkbox-circle md-red" v-model="selectedType" :value="type"></md-checkbox>
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
    this.$store
      .dispatch("event/getEventTypes", {
        data: this.$auth.user.defaultCalendarId,
        ctx: this,
      })
      .then((res) => {
        this.isLoading = false;
      });
    if (this.publicEventData.eventType) {
      this.selectedType = this.eventTypes.find((it) => it.key == this.publicEventData.eventType.key);
    } else {
      this.selectedType = {};
    }
  },
  methods: {
    ...mapMutations("PublicEventPlanner", ["setEventProperty", "setCurrentStep"]),
    validateDate() {
      return this.$refs.datePicker.$el.classList.contains("md-has-value");
    },
    validateAndSubmit() {
      if (!this.selectedType) {
      }
    },
    goToNext() {
      if (this.selectedType) {
        this.setEventProperty({ key: "eventType", actualValue: this.selectedType });
        if (this.selectedType.key === "reception" || this.selectedType.key === "establishment-activity-day")
          this.$router.push({ path: `/event-wizard-celebrating` });
        else this.$router.push({ path: `/event-wizard-vibes` });
      }
    },
    skip() {
      this.$router.push({ path: `/event-wizard-vibes` });
    },
    back() {
      this.$router.push({ path: `/event-wizard-building` });
    },
  },
  data() {
    return {
      selectedType: {},
      isLoading: true,
    };
  },
  computed: {
    ...mapState("PublicEventPlanner", ["publicEventData"]),
    ...mapGetters({
      eventTypes: "event/getEventTypesList",
    }),
  },
};
</script>
<style lang="scss">
.event-wizard-type {
  .event-type.event-basic-info {
    width: 100%;
    margin: 0 auto;
    padding: 0;
    min-height: 440px;
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
  .event-type {
    .types {
      flex-wrap: wrap;
      width: 80%;
      margin: 30px auto;
      max-width: 1200px;
    }
  }
}
</style>
