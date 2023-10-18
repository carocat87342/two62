<template>
  <div class="vendor-signup-wrapper">
    <VendorBasicInfoForm v-if="step == 0" :vendor="vendor" />
    <VendorSignupStep1
      :categories="businessCategories"
      :generalInfos="generalInfos"
      :companyServices="companyServices"
      :icon="`${iconUrl}`"
      :vendor="vendor"
      v-if="step == 1"
    />
    <VendorSignupStep2 :categories="businessCategories" :icon="`${iconUrl}`" :vendor="vendor" v-if="step == 2" />
    <VendorSignupStep3 :categories="businessCategories" :icon="`${iconUrl}`" :vendor="vendor" v-if="step == 3" />
    <VendorSignupStep4 :categories="businessCategories" :icon="`${iconUrl}`" :vendor="vendor" v-if="step == 4" />

    <VendorSignupStep5 :categories="businessCategories" :icon="`${iconUrl}`" :vendor="vendor" v-if="step == 5" />
    <VendorSignupFinalForm :categories="businessCategories" :icon="`${iconUrl}`" :vendor="vendor" v-if="step == 6" />
    <div v-if="isCompletedWizard" class="final-section">Thank you for your signup!</div>
  </div>
</template>

<script>

import Vendors from "@/models/Vendors";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { businessCategories, generalInfos, companyServices } from "@/constants/vendor";

const components = {
    VSignupEditableField: () => import("@/components/Inputs/VSignupEditableField.vue"),
    VendorBasicInfoForm: () => import("./VendorBasicInfoForm.vue"),
    VendorSignupStep1: () => import("./VendorSignupStep1.vue"),
    VendorSignupStep2: () => import("./VendorSignupStep2.vue"),
    VendorSignupStep3: () => import("./VendorSignupStep3.vue"),
    VendorSignupStep4: () => import("./VendorSignupStep4.vue"),
    VendorSignupStep5: () => import("./VendorSignupStep5.vue"),
    VendorSignupFinalForm: () => import("./VendorSignupFinalForm.vue"),
}

export default {
  components,
  data() {
    return {
      // selected_vendor: {
      //   type: Object,
      //   default: {}
      // },
      isApproved: false,
      isCompletedWizard: false,
      businessCategories: businessCategories,
      generalInfos: generalInfos,
      companyServices: companyServices,
      iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/Vendor Signup/",
    };
  },
  mounted() {
    //if this is edit page
    if (this.$route.params.id) {
      this.$store.dispatch("vendorSignup/getVendor", this.$route.params.id);
    }
    this.$root.$on("approve-vendor-basic-info", (vendor) => {
      if (vendor) this.vendor = { ...this.vendor, ...vendor };
      console.log("vendor", this.vendor);
      console.log("*** Save vendor - done: ");
      this.isApproved = true;

      this.step = 1;
    });

    this.$root.$on("go-to-signup-step", (step) => {
      if (step < 1) {
        this.isApproved = false;
      }
      this.setStep(step);
    });
    this.$root.$on("update-vendor-value", (field, value) => {
      let vendor = JSON.parse(JSON.stringify(this.vendor));
      if (field == "images") {
        if (!Object.keys(vendor[field]).includes(`${value.index}`)) {
          console.log("!update.vendor.image", value);
          vendor[field].push(value.data);
        } else {
          console.log("update.vendor.image", value);
          vendor[field][value.index] = value.data;
        }
      } else if (field == "removeImage") {
        let images = vendor.images.filter((i) => i != value);
        this.$set(vendor, "images", images);
      } else if (field == "vendorCategories") {
        this.$set(vendor, this.camelize(field), value);
        this.$set(vendor, "vendorCategory", value[0]);
        this.$set(vendor, "yesRules", []);
        this.$set(vendor, "noRules", []);
        this.$set(vendor, "notAllowed", []);
        this.$set(vendor, "exDonts", []);
        this.$set(vendor, "pricingPolicies", []);
        this.$set(vendor, "policies", []);
        this.$set(vendor, "yesPolicies", []);
        this.$set(vendor, "noPolicies", []);
        this.$set(vendor, "selectedWeekdays", []);
        this.$set(vendor, "dontWorkDays", []);
        this.$set(vendor, "dontWorkTime", null);
        this.$set(vendor, "services", {});
      } else if (field.indexOf(".") > -1) {
        this.$set(vendor[field.split(".")[0]], field.split(".")[1], value);
      } else {
        this.$set(vendor, this.camelize(field), value);
      }
      this.setVendor(vendor);
    });
  },
  methods: {
    ...mapMutations("vendorSignup", ["setVendor", "setStep", "setEditing"]),
    camelize(str) {
      let temp = str.replace(/\W+(.)/g, function (match, chr) {
        return chr.toUpperCase();
      });
      return temp.charAt(0).toLowerCase() + temp.slice(1);
    },
  },
  computed: {
    ...mapGetters({
      vendor: "vendorSignup/getVendor",
      step: "vendorSignup/getStep",
    }),
  },
  filters: {},
};
</script>
<style lang="scss" scoped>
.vendor-signup-wrapper {
  padding: 84px 124px;
  font-family: Manrope-Regular, sans-serif;
  background: #f3f7fd;
  .final-section {
    min-height: 400px;
    text-align: center;
    font-weight: bold;
    font-size: 30px;
  }
}
</style>
