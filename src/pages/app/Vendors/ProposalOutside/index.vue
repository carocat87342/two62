<template>
  <div class="for-proposal-wrapper">
    <div class="md-layout justify-content-between">
      <div class="md-layout-item md-size-70">
        <proposal-steps v-if="vendor" :eventCategory="vendor.eventCategory" :step="step" :vendor="vendor" />
        <div class="step-wrapper" v-if="step === 0">
          <ProposalWizardStep0 class="mt-20"></ProposalWizardStep0>
        </div>
        <div class="step-wrapper" v-if="step === 1">
          <ProposalEventVision :event="event"></ProposalEventVision>
        </div>
        <div class="step-wrapper" v-if="step === 2">
          <ProposalWizardStep2></ProposalWizardStep2>
        </div>
        <div class="step-wrapper" v-if="step === 3">
          <ProposalWizardStep3 :title="`Event Information & Details`" :isEdit="false" :iconUrl="iconUrl" />
        </div>
      </div>
      <div class="md-layout-item md-size-30 pos-relative">
        <ProposalBudgetSummary
          :bundleDiscount="true"
          :warning="true"
          :additional="true"
          :isEdit="true"
          :step="step"
          :services="services"
          :taxes="taxes"
          v-if="step >= 1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import S3Service from "@/services/s3.service";
import { businessCategories, categoryNameWithIcons } from "@/constants/vendor";

//COMPONENTS

const components = {
    Loader: () => import("@/components/loader/Loader.vue"),
    MaryokuTextarea: () => import("@/components/Inputs/MaryokuTextarea.vue"),
    ProposalBudgetSummary: () => import("./ProposalBudgetSummary.vue"),
    ProposalSteps: () => import("./ProposalSteps.vue"),
    ProposalEventVision: () => import("./ProposalEventVision.vue"),
    ProposalWizardStep0: () => import("./ProposalWizardStep0.vue"),
    ProposalWizardStep2: () => import("./ProposalWizardStep2.vue"),
    ProposalWizardStep3: () => import("./ProposalWizardStep3.vue"),
}

export default {
  components,
  data() {
    return {
      iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/NewSubmitPorposal/",
      services: null,
      taxes: [],
      iconsWithCategory: null,
      isLoading: false,
      markedDates: [],
    };
  },
  created() {},
  async mounted() {
    this.services = Object.assign([], businessCategories);

    this.iconsWithCategory = Object.assign([], categoryNameWithIcons);
    await this.$store.dispatch("common/fetchAllCategories");
    await this.$store.dispatch('common/getTaxes');

    // handling uploading photo backhand process
      this.$root.$on("update-inspirational-photo", async ({ file, index, link, fileName}) => {
          const currentPhoto = this.inspirationalPhotos[index];


          const url = await S3Service.fileUpload(file, fileName, link)
          this.$store.commit("proposalForNonMaryoku/setInspirationalPhoto", { index, photo: { ...currentPhoto, url }});

      });
      this.$root.$on("remove-inspirational-photo", async (index) => {
          if ( this.version !== -1 ) await S3Service.deleteFile(this.inspirationalPhotos[index].url);
          this.$store.commit("proposalForNonMaryoku/setInspirationalPhoto", { index, photo: null });
      })
  },
  methods: {
    selectSecondCategory(serviceCategory) {
      this.$store.commit("proposalForNonMaryoku/setValue", { key: "currentSecondaryService", value: serviceCategory });
    },
    flatDeep(arr, d = 1) {
      return d > 0
        ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? this.flatDeep(val, d - 1) : val), [])
        : arr.slice();
    },
    servicesByCategory(category) {
      const services = this.services.filter((s) => s.name == category);

      if (services.length > 0) {
        return this.flatDeep(
          services[0].categories.map((s) => s.subCategories.map((sc) => sc.items.map((dd) => dd.name))),
          Infinity,
        );
      } else {
        return [];
      }
    },
  },
  filters: {},
  computed: {
    extraServices() {
      return this.event.components.filter(
        (item) => item.componentId !== this.vendor.vendorCategory && item.componentId !== "unexpected",
      );
    },
    personalMessage: {
      get() {
        return this.$store.state.proposalForNonMaryoku.personalMessage;
      },
      set(value) {
        this.$store.commit("proposalForNonMaryoku/setValue", { key: "personalMessage", value });
      },
    },
    vendor() {
      return this.$store.state.proposalForNonMaryoku.vendor;
    },
    proposalRequest() {
      return this.$store.state.proposalForNonMaryoku.proposalRequest;
    },
    event() {
      if (!this.proposalRequest) return {};
      return this.proposalRequest.eventData;
    },
    step() {
      return this.$store.state.proposalForNonMaryoku.wizardStep;
    },
    inspirationalPhotos(){
      return this.$store.state.proposalForNonMaryoku.inspirationalPhotos;
    },
    version(){
      return this.$store.state.proposalForNonMaryoku.currentVersion;
    }
  },
  watch: {
      taxes(newVal){console.log('taxes', newVal)}
  }
};
</script>
<style lang="scss" scoped>
.for-proposal-wrapper {
  background-color: #f5f5f5;
  padding: 64px 45px;
  color: #050505;

  .step-wrapper {
    .proposal-add-personal-message-wrapper {
      border-radius: 3px;
      box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
      background-color: #ffffff;
      margin-top: 20px;
      padding: 40px 40px 40px 34px;
      font-family: "Manrope-Regular", sans-serif;
      color: #050505;

      h3 {
        font-weight: 800;
        font-size: 30px;
        margin: 0 0 35px 0 !important;

        img {
          width: 26px;
          margin-right: 15px;
        }
      }

      h4 {
        font-size: 16px;
        font-weight: 800;
        margin: 0;
        margin-bottom: 12px;
      }

      textarea {
        width: 100%;
        resize: none;
        font-size: 16px;
        border-radius: 3px;
        border: solid 0.5px #707070;
        padding: 21px 18px;
        margin-bottom: 15px;
      }
      span {
        font-size: 14px;
      }
      p {
        font-size: 14px;
        font-weight: 800;
        text-decoration: underline;
        margin: 0;
      }
    }
    h3 {
      font-size: 30px;
      font-weight: 800;
      margin-top: 2em;
      margin-bottom: 0.5em;
    }
    p {
      font-size: 14px;
      font-weight: normal;
      margin: 0;

      img {
        width: 27px;
        margin-right: 15px;
      }
    }
  }
  .pos-relative {
    position: relative;
  }
  .requirements-panel {
    margin-bottom: 20px;
  }
}
</style>
