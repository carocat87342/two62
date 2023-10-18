<template>
  <collapse-panel :defaultStatus="false" class="checkout-price-table">
    <template slot="header">
      <div class="price-header">
        <div class="d-flex align-center">
          <img :src="`${$iconURL}Budget+Elements/${vendorCategory.icon}`" class="mr-10" />
          {{ vendorCategory.fullTitle }}
        </div>
        <div class="ml-auto">
          <div class="element-price">${{ totalPrice | withComma }}</div>
          <div class="discount-details font-size-16 font-regular" v-if="discount.percentage">
            ({{ discount.percentage }}% off)
            <span class="crosslinedText">${{ priceOfCostservices | withComma }}</span>
          </div>
        </div>
      </div>
    </template>
    <template slot="content">
      <div class="price-table-content">
        <div
          v-for="service in costServices"
          class="d-flex justify-content-between price-item"
          :key="service.requirementTitle"
        >
          <span>
            {{ service.requirementTitle }}
            <span class="pl-20">X{{ service.requirementValue }}</span>
          </span>
          <span>${{ (service.price * service.requirementValue) | withComma }}</span>
        </div>
      </div>
    </template>
  </collapse-panel>
</template>
<script>
import CollapsePanel from "@/components/CollapsePanel.vue";
export default {
  components: { CollapsePanel },
  props: {
    proposal: {
      type: Object,
      default: () => {},
    },
    serviceCategory: {
      type: String,
      default: "",
    },
  },
  computed: {
    categories() {
      return this.$store.state.common.serviceCategories;
    },
    vendorCategory() {
      return this.categories.find((item) => item.key === this.serviceCategory) || {};
    },
    discount() {
      if (!this.proposal.discounts) return { percentage: 0, price: 0 };
      let discount = { ...this.proposal.discounts["total"] };
      if (!discount) {
        discount = { price: 0, percentage: 0 };
      }
      discount.price = (this.priceOfCostservices * discount.percentage) / 100 || 0;
      return discount;
    },
    tax() {
      if (!this.proposal.taxes) return { percentage: 0, price: 0 };
      let tax = { ...this.proposal.taxes["total"] };
      if (!tax) {
        tax = { price: 0, percentage: 0 };
      }
      tax.price = Math.round(((this.priceOfCostservices - this.discount.price) * tax.percentage) / 100) || 0;
      return tax;
    },
    costServices() {
      return this.proposal.costServices[this.serviceCategory] || [];
    },
    includedServices() {
      return this.proposal.includedServices[this.serviceCategory] || [];
    },

    priceOfCostservices() {
      if (!this.costServices || this.costServices.length === 0) return 0;
      return this.costServices.reduce((s, item) => {
        return item.isComplimentary ? s : s + item.requirementValue * item.price;
      }, 0);
    },
    priceBeforeDiscount() {
      return this.priceOfCostservices - (this.priceOfCostservices * this.tax.percentage) / 100;
    },
    totalPrice() {
      return this.priceOfCostservices - this.discount.price + this.tax.price;
    },
  },
};
</script>
<style lang="scss" scoped>
.checkout-price-table {
  .price-header {
    padding: 30px;
    font-weight: 900;
    font-size: 22px;
    display: flex;
    align-items: center;
    padding-right: 100px;
    img {
      width: 30px;
    }
    .element-price {
      text-align: left;
      width: 120px;
    }
  }
  .price-table-content {
    padding: 0 30px;
    .price-item {
      padding: 30px 100px 30px 0;
      border-top: solid 2px #e0e0e0;
    }
  }
  .element-price {
    text-align: right;
  }
}
</style>
