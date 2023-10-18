<template>
  <div class="event-component-vedor-item">
    <div class="vendor-title">{{ vendor.vendor.vendorDisplayName }}</div>
    <div class="vendor-actions">
      <md-button class="md-button md-red md-simple md-theme-default edit-btn-1" @click="viewContract(vendor)"
        >View Contract</md-button
      >
      <div style="position: relative">
        <md-button class="md-button md-black md-simple md-theme-default edit-btn-1">Request Changes</md-button>
        <span class="divider"></span>
        <md-button class="md-button md-black md-simple md-theme-default edit-btn-1" @click="cancelModalOpened = true"
          >Cancel Vendor</md-button
        >
      </div>
    </div>
    <vendor-cancel-modal
      v-if="cancelModalOpened"
      :categoryItem="categoryItem"
      :vendor="vendor"
      @cancel="cancelModalOpened = false"
      @deleteVendor="deleteVendor"
    ></vendor-cancel-modal>
  </div>
</template>
<script>
import VendorCancelModal from "@/components/Modals/VendorCancelModal";

export default {
  name: "event-component-vendor-item",
  components: {
    VendorCancelModal,
  },
  props: {
    vendor: Object,
    categoryItem: Object,
  },
  data() {
    return {
      cancelModalOpened: false,
    };
  },
  methods: {
    viewContract(vendor) {
      console.log(vendor);
      window.open(`https://static-maryoku.s3.amazonaws.com/${vendor.attachments[0].url}`, "_blank");
    },
    deleteVendor(vendor) {},
  },
};
</script>
<style lang="scss" scoped>
.event-component-vedor-item {
  padding: 0 10px;
  .vendor-title {
    font-family: "Manrope-Regular" !important;
    font-size: 20px !important;
    color: #818080 !important;
  }
  .vendor-actions {
    padding: 10px 0px;
    display: flex;
    justify-content: space-between;
  }
}
.divider {
  display: inline-block;
  padding: 0 5px;
  &:after {
    border-left: solid 2px #dbdbdb;
    height: 1em;
    content: " ";
    position: absolute;
    top: 0.5em;
    padding: 14px;
  }
}
</style>