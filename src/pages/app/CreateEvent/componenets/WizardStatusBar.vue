<template>
  <div class="wizard-footer">
    <template v-if="windowWidth > 800">
      <div>
        <md-button @click="back" class="md-black md-maryoku md-simple">
          <md-icon>keyboard_backspace</md-icon>
          Back
        </md-button>
      </div>
      <div class="status-bar">
        <div class="status-step">{{ this.currentStep }} Step of 5</div>
        <md-progress-bar
          class="md-red progress-bar"
          md-mode="determinate"
          :md-value="(this.currentStep / 5) * 100"
        ></md-progress-bar>
        <div v-if="this.currentStep == 1" class="status-description">
          <img :src="`${$iconURL}Onboarding/clover.svg`" />
          Only 5 simple steps to your perfect event
        </div>
        <div v-if="this.currentStep == 2" class="status-description">
          <img :src="`${$iconURL}Onboarding/strength.svg`" />
          You are fantastic! !
        </div>
        <div v-if="this.currentStep == 3" class="status-description">
          <img :src="`${$iconURL}Onboarding/promise.svg`" />
          We promise it will pay off in the end!
        </div>
        <div v-if="this.currentStep == 4" class="status-description">
          <img :src="`${$iconURL}Onboarding/heart.svg`" />
          Sharing is caring!
        </div>
        <div v-if="this.currentStep == 5" class="status-description">
          <img :src="`${$iconURL}Onboarding/quality.svg`" />
          Last one!
        </div>
      </div>
      <div class="footer-actions">
        <md-button
          @click="skip"
          class="md-black md-maryoku md-simple"
          @mouseover="skipToolTip = true"
          @mouseleave="skipToolTip = false"
        >
          Skip
          <md-icon>keyboard_arrow_right</md-icon>
        </md-button>
        <md-button @click="next" class="md-default md-red md-maryoku next-btn" :disabled="!canNext">Next</md-button>
      </div>
      <transition name="fade">
        <div class="tool-tip" v-if="skipToolTip">
          <div class="flex-1">
            <img :src="`${$iconURL}Onboarding/tip-gray.svg`" />
          </div>
          <div>
            We encourage you to answer this question!
            <br />
            This will help us create the perfect event for you!
          </div>
        </div>
      </transition>
    </template>
    <template v-else>
      <div class="status-bar" style="width: 100%">
        <div class="status-step">{{ this.currentStep }} Step of 5</div>
        <md-progress-bar
          class="md-red progress-bar"
          md-mode="determinate"
          :md-value="(this.currentStep / 5) * 100"
        ></md-progress-bar>
        <div v-if="this.currentStep == 1" class="status-description">
          <img :src="`${$iconURL}Onboarding/clover.svg`" />
          Only 5 simple steps & you're signed!
        </div>
        <div v-if="this.currentStep == 2" class="status-description">
          <img :src="`${$iconURL}Onboarding/strength.svg`" />
          You are fantastic! !
        </div>
        <div v-if="this.currentStep == 3" class="status-description">
          <img :src="`${$iconURL}Onboarding/promise.svg`" />
          We promise it will pay off in the end!
        </div>
        <div v-if="this.currentStep == 4" class="status-description">
          <img :src="`${$iconURL}Onboarding/heart.svg`" />
          Sharing is caring!
        </div>
        <div v-if="this.currentStep == 5" class="status-description">
          <img :src="`${$iconURL}Onboarding/quality.svg`" />
          Last one!
        </div>
      </div>

      <div class="d-flex justify-content-between mt-1">
        <div>
          <md-button @click="back" class="md-black md-maryoku md-simple">
            <md-icon>keyboard_backspace</md-icon>
            Back
          </md-button>
        </div>
        <div class="footer-actions">
          <md-button
            @click="skip"
            class="md-black md-maryoku md-simple"
            @mouseover="skipToolTip = true"
            @mouseleave="skipToolTip = false"
          >
            Skip
            <md-icon>keyboard_arrow_right</md-icon>
            <md-tooltip class="tool-tip" v-if="skipToolTip">
              <div class="flex-1">
                <img :src="`${$iconURL}Onboarding/tip-gray.svg`" />
              </div>
              <div>
                We encourage you to answer this question!
                <br />
                This will help us create the perfect event for you!
              </div>
            </md-tooltip>
          </md-button>
          <md-button @click="next" class="md-default md-red md-maryoku next-btn">Next</md-button>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: "WizardFooter",
  props: {
    nextLink: {
      type: String,
      default: "",
    },
    currentStep: {
      type: Number,
      default: "",
    },
    canNext: {
      type: Boolean,
      default: true,
    },
  },
  created() {},
  methods: {
    back() {
      this.$emit("back");
    },
    next() {
      this.$emit("next");
    },
    skip() {
      this.$emit("skip");
    },
  },
  data() {
    return {
      skipToolTip: false,
      windowWidth: 0,
      windowHeight: 0,
    };
  },
};
</script>
<style lang="scss" scoped>
.wizard-footer {
  position: relative;
}
</style>