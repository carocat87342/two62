<template>
  <collapse-panel class="pricing-policy">
    <template slot="header">
      <div class="d-flex align-center">
        <img :src="`${$iconURL}Vendor Signup/Asset 560.svg`" style="width: 25px" class="mr-10" />
        OUR PRICING POLICY
      </div>
    </template>
    <template slot="content">
      <pricing-policy-section
        class="pl-50 pr-50 pb-50 pricing-policy-content"
        :serviceData="serviceData"
      ></pricing-policy-section>
    </template>
  </collapse-panel>
</template>
<style></style>
<script>
import PricingPolicySection from "./PricingPolicySection.vue";
import CollapsePanel from "./CollapsePanel.vue";
export default {
  components: { CollapsePanel, PricingPolicySection },
  props: {
    serviceData: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
<style lang="scss" scoped>
.pricing-policy {
  .pricing-policy-content {
    max-width: 900px;
  }
}
</style>