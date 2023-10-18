<template>
  <div class="pricing-policy-section" id="pricingPolicySection">
    <div class="rules">
      <div class="rule" v-for="(policy, yIndex) in validPricingPolicy" :key="yIndex">
        <div class="item">{{ policy.name }}</div>
        <div class="item" v-if="policy.type === 'MultiSelection'">
          <span class="mr-10" v-for="(v, vIndex) in policy.value">{{
            `${v}${vIndex == policy.value.length - 1 ? "" : ","}`
          }}</span>
        </div>
        <div class="item" v-else-if="policy.type === 'Including'">
          <span class="mr-10" v-if="policy.value"> Yes </span>
          <span class="mr-10" v-if="!policy.value && policy.cost"> {{ `$ ${policy.cost | withComma}` }} </span>
        </div>
        <div class="item" v-else-if="policy.type === 'Boolean' && policy.value && policy.discount">
          <span class="mr-10" v-if="policy.hasOwnProperty('unit') && policy.unit === '$'"> $ </span>
          <span class="mr-10" v-if="policy.discount"> {{ policy.discount }} </span>
          <span class="mr-10" v-if="policy.hasOwnProperty('unit') && policy.unit === '%'"> % </span>
        </div>
        <div class="item" v-else>
          <span v-if="!policy.isPercentage">$</span>
          <span v-if="policy.value === true">Yes</span>
          <span v-else>{{ Number(policy.value) | withComma }}</span>
          <span v-if="policy.isPercentage">%</span>
          <span class="ml-50" v-if="policy.hasOwnProperty('attendees')"> {{ policy.attendees }} attendees </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    serviceData: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    vendor() {
      return this.$store.state.vendor.profile;
    },
    validPricingPolicy() {
      if (this.serviceData.pricingPolicies)
        return this.serviceData.pricingPolicies.filter(
          (item) => item.value || (item.type === "Including" && item.cost),
        );
      return null;
    },
  },
};
</script>
<style lang="scss" scoped>
.pricing-policy-section {
  .rules {
    font-size: 18px;
    .rule {
      padding: 2rem 2rem 2rem 0;
      border-bottom: 1px solid #dddddd;
      display: flex;
      align-items: center;

      .item {
        flex: 1;

        img {
          width: 30px;
        }
      }
      &:first-child {
        border-top: 1px solid #dddddd;
      }
    }
  }
}
</style>
