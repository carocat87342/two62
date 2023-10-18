<template>
  <div class="discount-form">
    <div class="service-item" v-if="!isDiscountEditing">
      <div class="flex-1">
        <img :src="`${$iconURL}NewSubmitPorposal/Asset 612.svg`" style="width: 20px" class="mr-10" />
        <span>Discount</span>
      </div>
      <div class="text-right">{{ discount.percentage }}%</div>
      <div class="text-right">-${{ discount.price || calcedDiscont | withComma }}</div>
      <div class="text-right">
        <md-button class="md-simple edit-btn" @click="toggleEditMode('discount')">
          <img :src="`${$iconURL}common/edit-dark.svg`" style="width: 20px; height: 20px" />
        </md-button>
      </div>
    </div>
    <div class="service-item is-edit" v-else>
      <div class="flex-1">
        <img :src="`${$iconURL}NewSubmitPorposal/Asset 612.svg`" style="width: 20px" class="mr-10" />
        <span>Discount</span>
      </div>
      <money
        v-model="editingDiscount.percentage"
        v-bind="{
          decimal: '.',
          thousands: ',',
          prefix: '',
          suffix: ' %',
          precision: 2,
          masked: false,
        }"
        class="bundle-discount-input mr-10"
        @keyup.native="setPercentRange(editingDiscount.percentage, 'discount')"
      />
      <money
        v-model="editingDiscount.price"
        v-bind="{
          decimal: '.',
          thousands: ',',
          prefix: '$ ',
          suffix: '',
          precision: 2,
          masked: false,
        }"
        class="bundle-discount-input"
        @keyup.native="setPriceRange(editingDiscount.price, 'discount')"
      />
    </div>
    <div class="text-right mb-10" v-if="isDiscountEditing">
      <md-button class="md-simple normal-btn md-vendor" @click="cancel('discount')">Cancel</md-button>
      <md-button class="normal-btn md-vendor" @click="saveDiscount">Save</md-button>
    </div>
      <div class="service-item" v-if="!isDiscountEditing">
          <div class="flex-1">
              <img :src="`${$iconURL}NewSubmitPorposal/Asset 612.svg`" style="width: 20px" class="mr-10" />
              <span>Discount</span>
          </div>
          <div class="text-right">{{ discount.percentage }}%</div>
          <div class="text-right">-${{ discount.price || calcedDiscont | withComma }}</div>
          <div class="text-right">
              <md-button class="md-simple edit-btn" @click="toggleEditMode('discount')">
                  <img :src="`${$iconURL}common/edit-dark.svg`" style="width: 20px; height: 20px" />
              </md-button>
          </div>
      </div>
      <div class="service-item is-edit" v-else>
          <div class="flex-1">
              <img :src="`${$iconURL}NewSubmitPorposal/Asset 612.svg`" style="width: 20px" class="mr-10" />
              <span>Discount</span>
          </div>
          <money
              v-model="editingDiscount.percentage"
              v-bind="{
          decimal: '.',
          thousands: ',',
          prefix: '',
          suffix: ' %',
          precision: 2,
          masked: false,
        }"
              class="bundle-discount-input mr-10"
              @keyup.native="setPercentRange(editingDiscount.percentage, 'discount')"
          />
          <money
              v-model="editingDiscount.price"
              v-bind="{
          decimal: '.',
          thousands: ',',
          prefix: '$ ',
          suffix: '',
          precision: 2,
          masked: false,
        }"
              class="bundle-discount-input"
              @keyup.native="setPriceRange(editingDiscount.price, 'discount')"
          />
      </div>
      <div class="text-right mb-10" v-if="isDiscountEditing">
          <md-button class="md-simple normal-btn md-vendor" @click="cancel('discount')">Cancel</md-button>
          <md-button class="normal-btn md-vendor" @click="saveDiscount">Save</md-button>
      </div>
    <div class="service-item" v-if="!isTaxEditing">
      <div class="flex-1">
        <img :src="`${$iconURL}NewSubmitPorposal/Asset 613.svg`" style="width: 20px" class="mr-10" />
        <span>Taxes</span>
      </div>
      <div class="text-right">
        <span>{{ tax.percentage }}%</span>
      </div>
      <div class="text-right">${{ calcedTax | withComma }}</div>
      <div class="text-right">
        <md-button class="md-simple edit-btn" @click="toggleEditMode('tax')">
          <img :src="`${$iconURL}common/edit-dark.svg`" style="width: 20px; height: 20px" />
        </md-button>
      </div>
    </div>
    <div class="service-item is-edit" v-else>
      <div class="flex-1">
        <img :src="`${$iconURL}NewSubmitPorposal/Asset 613.svg`" style="width: 20px" class="mr-10" />
        <span>Taxes</span>
      </div>
      <money
        v-model="editingTax.percentage"
        v-bind="{
          decimal: '.',
          thousands: ',',
          prefix: '',
          suffix: ' %',
          precision: 2,
          masked: false,
        }"
        class="bundle-discount-input mr-10"
        @keyup.native="setPercentRange(editingTax.percentage, 'tax')"
      />
      <money
        v-model="editingTax.price"
        v-bind="{
          decimal: '.',
          thousands: ',',
          prefix: '$ ',
          suffix: '',
          precision: 2,
          masked: false,
        }"
        class="bundle-discount-input"
        @keyup.native="setPriceRange(editingTax.price, 'tax')"
      />
    </div>
    <div class="text-right mb-10" v-if="isTaxEditing">
      <md-button class="md-simple normal-btn md-vendor" @click="cancel('tax')">Cancel</md-button>
      <md-button class="normal-btn md-vendor" @click="saveTax">Save</md-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: {
    defaultDiscount: {
      type: Object,
      default: () => {},
    },
    defaultTax: {
      type: Object,
      default: () => {},
    },
    negotiationDiscount: {
      type: Object,
      default: () => {},
    },
    nonMaryoku:{
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      tax: {
        percentage: 0,
        price: 0,
      },
      discount: {
        percentage: 0,
        price: 0,
      },
      editingTax: {
        percentage: 0,
        price: 0,
      },
      editingDiscount: {
        percentage: 0,
        price: 0,
      },
      isTaxEditing: false,
      isDiscountEditing: false,
    };
  },
  created() {
    if (this.defaultTax) this.tax = this.defaultTax;
    if (this.defaultDiscount) this.discount = this.defaultDiscount;
  },
  methods: {
    toggleEditMode(type) {
      if (type === "discount") {
        this.isDiscountEditing = true;
        this.editingDiscount = { ...this.discount };
      } else {
        this.isTaxEditing = true;
        this.editingTax = { ...this.tax };
      }
    },
    cancel(type) {
      if (type === "discount") {
        this.isDiscountEditing = false;
        this.editingDiscount = { ...this.discount };
      } else {
        this.editingTax = { ...this.tax };
        this.isTaxEditing = false;
      }
    },
    saveDiscount() {
      this.$emit("saveDiscount", this.editingDiscount);
      this.isDiscountEditing = false;
      this.discount = { ...this.editingDiscount };
    },
    saveTax() {
      this.$emit("saveTax", this.editingTax);
      this.tax = { ...this.editingTax };
      this.isTaxEditing = false;
    },
    setPercentRange(value, type) {
      if (value > 100) value = 100;
      if (value < 0) value = 0;
      if (type === "discount") {
        this.editingDiscount.percentage = value;
        this.editingDiscount.price = (this.sumOfPrices * (value / 100)).toFixed(2);
      } else if (type === "tax") {
        this.editingTax.percentage = value;
        this.editingTax.price = ((this.sumOfPrices - this.editingDiscount.price) * (value / 100)).toFixed(2);
      }
    },
    setPriceRange(val, type) {
      if (type === "discount") {
        console.log("value", val);
        console.log("sumOfPrices", this.sumOfPrices);
        this.editingDiscount.percentage = ((val / this.sumOfPrices) * 100).toFixed(2);
      } else if (type === "tax") {
        this.editingTax.percentage = ((val / (this.sumOfPrices - this.editingDiscount.price)) * 100).toFixed(2);
      }
    },
    setRange(value, type) {
      let val = value;
      if (type == "discount_percentage") {
        if (value > 100) {
          val = 100;
        }
        if (value < 0) {
          val = 0;
        }
      }
      if (type == "tax") {
        this.tax = val;
        this.discount_by_amount = 0;
      } else if (type == "discount_by_amount") {
        this.discount.percentage = ((val / this.sumOfPrices) * 100).toFixed(2);
      } else {
        this.discount.price = ((this.sumOfPrices * val) / 100).toFixed(0);
      }
    },
  },
  watch: {
    defaultTax(newValue, oldValue) {
      this.tax = newValue;
    },
    defaultDiscount(newValue, oldValue) {
      this.discount = newValue;
    },
    sumOfPrices(newValue, oldValue) {
      console.log(newValue);
      console.log(oldValue);
      if (newValue !== oldValue) {
        this.discount.price = (newValue * this.discount.percentage) / 100;
        this.tax.price = ((newValue - this.discount.price) * this.tax.percentage) / 100;
      }
    },
  },
  computed: {
    // ...mapGetters("vendorProposal", ["sumOfPrices"]),
    calcedTax() {
      this.tax.price = Math.round(((this.sumOfPrices - this.calcedDiscont) * this.tax.percentage) / 100);
      return this.tax.price;
    },
    calcedDiscont() {
      this.discount.price = Math.round((this.sumOfPrices * this.discount.percentage) / 100);
      return this.discount.price;
    },
    sumOfPrices(){
      return this.nonMaryoku ? this.$store.getters["proposalForNonMaryoku/sumOfPrices"]:
        this.$store.getters["vendorProposal/sumOfPrices"]
    }
  },
};
</script>
<style lang="scss" scoped>
.discount-form {
  .service-item {
    color: #818080;
    border-top: solid 1px #d3d3d3;
    padding: 20px 0;
    display: grid;
    grid-template-columns: 30% 30% 30% 10%;
    font-weight: bold;
    align-items: center;
    &.is-edit {
      grid-template-columns: 40% 30% 30%;
    }
    input {
      font-size: 16px;
    }
  }
}
</style>
