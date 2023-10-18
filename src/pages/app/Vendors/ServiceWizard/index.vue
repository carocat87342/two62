<template>
  <div class="vendor-signup-wrapper">
    <template v-if="!isLoading">
      <vendor-service-step1 v-if="step == 1" />
      <vendor-service-step2 :categories="businessCategories" :icon="`${iconUrl}`" v-if="step == 2" />
      <vendor-service-step3 :categories="businessCategories" :icon="`${iconUrl}`" v-if="step == 3" />
      <vendor-service-step4 :categories="businessCategories" :icon="`${iconUrl}`" v-if="step == 4" />

      <vendor-service-step5 :categories="businessCategories" :icon="`${iconUrl}`" v-if="step == 5" />
      <div v-if="isCompletedWizard" class="final-section">Thank you for your signup!</div>
    </template>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import Vendors from "@/models/Vendors";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

//COMPONENTS
import VServiceEditableField from "@/components/Inputs/VSignupEditableField.vue";
import VendorServiceStep1 from "./VendorServiceStep1.vue";
import VendorServiceStep2 from "./VendorServiceStep2.vue";
import VendorServiceStep3 from "./VendorServiceStep3.vue";
import VendorServiceStep4 from "./VendorServiceStep4.vue";
import VendorServiceStep5 from "./VendorServiceStep5.vue";
import VendorServiceFinalForm from "./VendorServiceFinalForm.vue";

import { businessCategories, generalInfos, companyServices } from "@/constants/vendor";

export default {
  components: {
    VueElementLoading,
    VServiceEditableField,
    VendorServiceStep1,
    VendorServiceStep2,
    VendorServiceStep3,
    VendorServiceStep4,
    VendorServiceStep5,
    VendorServiceFinalForm,
  },
  data() {
    return {
      // selected_vendor: {
      //   type: Object,
      //   default: {}
      // },
      isLoading: false,
      isApproved: false,
      isCompletedWizard: false,
      businessCategories: businessCategories,
      generalInfos: generalInfos,
      companyServices: companyServices,
      iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/Vendor Signup/",
    };
  },
  created() {
    if (this.step === 6) {
      this.$store.commit("vendorService/setStep", 1);
    }
  },
  mounted() {
    //if this is edit page
    if (this.$route.params.id) {
      Vendors.find(this.$route.params.id).then((vendor) => {
        if (!vendor.about) this.$set(vendor, "about", {});
        if (!vendor.capacity) this.$set(vendor, "capacity", {});
        if (!vendor.social) this.$set(vendor, "social", {});
        if (!vendor.images) this.$set(vendor, "images", new Array(15));
        if (!vendor.hasOwnProperty("yesRules")) this.$set(vendor, "yesRules", []);
        if (!vendor.hasOwnProperty("noRules")) this.$set(vendor, "noRules", []);
        if (!vendor.hasOwnProperty("notAllowed")) this.$set(vendor, "notAllowed", []);
        if (!vendor.hasOwnProperty("exDonts")) this.$set(vendor, "exDonts", []);
        if (!vendor.hasOwnProperty("pricingPolicies")) this.$set(vendor, "pricingPolicies", []);
        if (!vendor.hasOwnProperty("policies")) this.$set(vendor, "policies", []);
        if (!vendor.hasOwnProperty("yesPolicies")) this.$set(vendor, "yesPolicies", []);
        if (!vendor.hasOwnProperty("noPolicies")) this.$set(vendor, "noPolicies", []);
        if (!vendor.hasOwnProperty("selectedWeekdays")) this.$set(vendor, "selectedWeekdays", []);
        if (!vendor.hasOwnProperty("dontWorkDays")) this.$set(vendor, "dontWorkDays", []);
        if (!vendor.hasOwnProperty("dontWorkTime")) this.$set(vendor, "dontWorkTime", null);
        if (!vendor.hasOwnProperty("services")) this.$set(vendor, "services", {});
        this.setVendor(vendor);
        if (this.$route.params.serviceId) {
          this.setService(vendor.secondaryServices.find((service) => service.id === this.$route.params.serviceId));
        }
        this.setEditing(true);
        // check if image is uploaded to S3
      });
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
      console.log("update-vendor-value", field, value);
      let service = JSON.parse(JSON.stringify(this.service));
      if (field == "images") {
        if (!Object.keys(service[field]).includes(`${value.index}`)) {
          console.log("!update.service.image", value);
          service[field].push(value.data);
        } else {
          console.log("update.service.image", value);
          service[field][value.index] = value.data;
        }
      } else if (field == "removeImage") {
        let images = service.images.filter((i) => i != value);
        this.$set(service, "images", images);
      } else if (field == "serviceCategories") {
        this.$set(service, this.camelize(field), value);
        // this.$set(service, "serviceCategory", value[0]);
        this.$set(service, "vendorCategory", value[0]);
        this.$set(service, "yesRules", []);
        this.$set(service, "noRules", []);
        this.$set(service, "notAllowed", []);
        this.$set(service, "exDonts", []);
        this.$set(service, "pricingPolicies", []);
        this.$set(service, "policies", []);
        this.$set(service, "yesPolicies", []);
        this.$set(service, "noPolicies", []);
        this.$set(service, "selectedWeekdays", []);
        this.$set(service, "dontWorkDays", []);
        this.$set(service, "dontWorkTime", null);
        this.$set(service, "services", {});
      } else if (field.indexOf(".") > -1) {
        const serviceField = field.split(".")[0];
        if (!service[serviceField]) this.$set(service, serviceField, {});
        console.log(service[serviceField]);
        this.$set(service[serviceField], field.split(".")[1], value);
      } else {
        this.$set(service, this.camelize(field), value);
      }
      console.log(service);
      this.setService(service);
    });
  },
  methods: {
    ...mapMutations("vendorService", ["setVendor", "setStep", "setEditing", "setService"]),
    camelize(str) {
      let temp = str.replace(/\W+(.)/g, function (match, chr) {
        return chr.toUpperCase();
      });
      return temp.charAt(0).toLowerCase() + temp.slice(1);
    },
  },
  computed: {
    ...mapGetters({
      vendor: "vendorService/getVendor",
      step: "vendorService/getStep",
    }),
    service() {
      return this.$store.state.vendorService.service;
    },
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
