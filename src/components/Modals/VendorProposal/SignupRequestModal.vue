<template>
  <modal class="signup-request-model">
    <template slot="header">
      <div class="add-category-model__header text-center">Before we move on...</div>
    </template>
    <template slot="body">
      <div class="md-layout">
        <div class="md-layout-item md-size-100"><img :src="`${$iconURL}NewSubmitPorposal/signup-logo.png`" /></div>
        <div class="md-layout-item md-size-100 font-size-40 font-bold mt-40">SIGN UP & LET’S BEGIN</div>
        <div class="md-layout-item md-size-60 md-offset mt-40">
          <div class="mt-50">
            Before getting to your proposal, please sign up with 5 simple steps - we promise it will save you a lot of
            time in the future!
          </div>
        </div>
        <div class="md-layout-item md-size-100 font-size-40 font-bold mt-100 mb-50">
          <md-button class="md-red maryoku-btn" @click="gotoVendorSignup()">
            <span class="font-size-20" style="padding: 10px 40px">Let's Sign Up </span>
          </md-button>
        </div>
      </div>
    </template>
    <template slot="footer">
      <div style="width: 100%" class="text-center">
        <img style="width: 100px" :src="`${$iconURL}Onboarding/maryoku-logo-dark%402x%403x.png`" />
      </div>
    </template>
  </modal>
</template>
<script>
import { Modal } from "@/components";
import MaryokuInput from "@/components/Inputs/MaryokuInput.vue";
import EventComponent from "@/models/EventComponent";

export default {
  components: {
    Modal,
    MaryokuInput,
  },
  props: {
    event: {
      type: Object,
      default: {},
    },
    components: {
      type: Array,
      default: [],
    },
    vendor: {
      type: Object,
      default: [],
    },
  },
  created() {
    EventComponent.get()
      .then((components) => {
        const availableComponents = [];
        components.forEach((item) => {
          const index = this.components.findIndex((comp) => item.key == comp.componentId);
          if (index < 0) {
            availableComponents.push(item);
          }
        });
        this.filteredEventBlocks = availableComponents;
      })
      .catch((error) => {
        console.log("Error ", error);
      });
  },
  data() {
    return {
      filteredEventBlocks: null,
      newBuildingBlock: {
        category: "",
        name: "",
        budget: "",
      },
    };
  },
  methods: {
    close() {
      this.$emit("cancel");
    },
    addNewCategory() {
      console.log(this.newBuildingBlock);
      this.$emit("save", this.newBuildingBlock);
    },
    addMoreMoney() {},
    gotoVendorSignup() {
      if (this.vendor) {
        this.$router.push({
          path: `/vendor-signup/edit/${this.vendor.id}?proposalRequest=${this.$route.params.rfpId}`,
        });
      }
    },
  },
  computed: {
    remainedBudget() {
      let allocatedBudget = this.components.reduce((s, item) => {
        return s + item.allocatedBudget;
      }, 0);
      // allocatedBudget = allocatedBudget + this.event.allocatedFees + this.event.allocatedTips;
      return Math.round((this.event.totalBudget - allocatedBudget) / 10) * 10;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>