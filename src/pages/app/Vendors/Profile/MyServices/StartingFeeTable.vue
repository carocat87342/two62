<template>
  <collapse-panel class="starting-fee-table">
    <template slot="header">
      <div class="d-flex align-center">
        <img :src="`${$iconURL}Vendor Signup/Asset 562.svg`" style="width: 25px" class="mr-10" />
        Elements in starting fee
      </div>
    </template>
    <template slot="content">
      <div class="pr-50 pl-50 pb-50 starting-fee-table-content">
        <vendor-starting-fee-item v-for="(fv, fvIndex) in items" :key="fvIndex" :item="fv" theme="purple" />
      </div>
    </template>
  </collapse-panel>
</template>
<style></style>
<script>
import VendorStartingFeeItem from "../../components/VendorStartingFeeItem.vue";
import CollapsePanel from "./CollapsePanel.vue";
export default {
  components: { CollapsePanel, VendorStartingFeeItem },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
<style lang="scss" scoped>
.starting-fee-table {
  .starting-fee-table-content {
    max-width: 900px;
  }
}
</style>