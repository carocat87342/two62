<template>
  <div class="vendor-profile-invoices">
    <div class="font-size-22 p-40" v-if="invoices.length === 0">No invoice</div>
    <template v-else>
      <div class="invoice-item-header">
        <div>Event</div>
        <div>Client</div>
        <div>Date</div>
        <div class="font-size-16 color-black font-bold">Download All Invoices</div>
      </div>
      <div class="invoice-item" v-for="(invoice, index) in invoices" :key="index">
        <div>{{ invoice.name }}</div>
        <div>{{ invoice.client }}</div>
        <div>{{ invoice.data }}</div>
        <div class="font-size-20 font-bold d-flex align-center justify-content-between">
          ${{ invoice.price }}
          <md-button class="md-simple md-just-icon download-button">
            <img :src="`${$iconURL}common/download-dark.svg`" />
          </md-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      invoices: [
        // { name: "March Madness ", client: "Microsoft", data: "Oct 24 2020", price: "5654.3" },
        // { name: "March Madness ", client: "Microsoft", data: "Oct 24 2020", price: "5654.3" },
        // { name: "March Madness ", client: "Microsoft", data: "Oct 24 2020", price: "5654.3" },
        // { name: "March Madness ", client: "Microsoft", data: "Oct 24 2020", price: "5654.3" },
        // { name: "March Madness ", client: "Microsoft", data: "Oct 24 2020", price: "5654.3" },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.vendor-profile-invoices {
  max-width: 900px;
  .invoice-item-header {
    display: grid;
    grid-template-columns: repeat(4, 25%);
    text-align: left;
    padding: 40px 0;
    color: #707070;
  }
  .invoice-item {
    display: grid;
    grid-template-columns: repeat(4, 25%);
    text-align: left;
    font-size: 16px;
    padding: 40px 0;
    border-top: solid 1px #dbdbdb;
    align-items: center;
    .download-button {
      box-shadow: 0 3px 17px 0 rgba(0, 0, 0, 0.15);
      border-radius: 50%;
    }
  }
}
</style>