<template>
  <collapse-panel class="policy">
    <template slot="header">
      <div class="d-flex align-center">
        <img :src="`${$iconURL}Vendor Signup/Asset 560.svg`" style="width: 25px" class="mr-10" />
        OUR POLICY
      </div>
    </template>
    <template slot="content">
      <policy-section
        class="pr-50 pl-50 pb-40 policy-content"
        :vendor="vendorData"
        :service="serviceData"
      ></policy-section>
    </template>
  </collapse-panel>
</template>
<style></style>
<script>
import PolicySection from "./PolicySection.vue";
import CollapsePanel from "./CollapsePanel.vue";
export default {
  props: {
    serviceCategory: {
      type: String,
      default: "",
    },
  },
  components: { CollapsePanel, PolicySection },
  computed: {
    vendorData() {
      return this.$store.state.vendor.profile;
    },
    serviceData() {
      if (this.serviceCategory === this.vendorData.vendorCategory) {
        return this.vendorData;
      } else {
        return this.vendorData.secondaryServices.find((service) => service.vendorCategory === this.serviceCategory);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.policy {
  .policy-content {
    max-width: 900px;
  }
}
</style>