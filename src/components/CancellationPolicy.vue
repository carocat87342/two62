<template>
  <div class="cancellation-policy">
    <div class="policy" v-for="(policy, yIndex) in cancellationData" :key="yIndex">
      <div class="item">
        <span class="font-bold-extra">If</span> {{ policy.notice }}
        <span class="font-bold-extra">Then</span>
        {{ policy.vendorPayout }} <span class="font-bold-extra">and</span> {{ policy.cancellationFee }}
      </div>
    </div>
  </div>
</template>
<script>
import { cancellationPolicyData } from "@/constants/vendor";
export default {
  name: 'cancellation-policy',
  data() {
    return {
      cancellationData: cancellationPolicyData,
    };
  },
};
</script>
<style lang="scss" scoped>
.cancellation-policy {
  .policy {
    padding: 20px 0;
  }
}
</style>
