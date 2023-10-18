<template>
  <div class="event-vendor-checkout">
    <vue-element-loading :active="loading" spinner="ring" color="#FF547C" />
    <div class="checkout-content md-layout" v-if="!loading">
      <vue-element-loading :active="loadingPayment" spinner="ring" color="#FF547C" />
      <div class="md-layout-item md-size-45 left-panel">
        <div
          class="background-section"
          :style="`background-image: url(https://static-maryoku.s3.amazonaws.com/storage/shutterstock_1801541476.jpg) `"
        ></div>
        <div class="content p-50">
          <div class="font-size-30">
            <span class="font-bold" v-if="pageType === 0">
              <img
                :src="`${$iconURL}Budget+Elements/${vendor.eventCategory.icon}`"
                style="width: 30px; margin-right: 0.5em"
              />
              Book {{ vendor.eventCategory.fullTitle }}
            </span>
            <span v-else class="font-bold">Book VENDORS</span>
            CHECKOUT
          </div>
          <div class="mt-20" v-if="pageType === 0">{{ vendor.companyName }}</div>
          <div class="white-card p-40 font-size-22 font-bold mt-50 d-flex justify-content-between">
            <span v-if="pageType === 0">What does this proposal include?</span>
            <span v-else>What Do We Include In This Proposals?</span>
            <md-icon>keyboard_arrow_right</md-icon>
          </div>
        </div>
      </div>
      <div class="md-layout-item md-size-55 right-panel">
        <div class="white-card">
          <template v-if="pageType === 0">
            <div v-if="proposal.additionalServices.length">
              <checkout-price-table
                class="price-table"
                v-for="service in proposal.bookedServices"
                :proposal="proposal"
                :serviceCategory="service"
                :key="`secondary-${service}-section`"
              ></checkout-price-table>
            </div>
            <checkout-price-table
              v-else
              class="price-table"
              :proposal="proposal"
              :serviceCategory="proposal.vendor.vendorCategory"
              :key="`${proposal.vendor.vendorCategory}-section`"
            ></checkout-price-table>

            <div class="p-30" v-if="this.proposal.extraServices[this.vendor.eventCategory.key]">
              <div>Would you like to upgrade & add one of those?</div>
              <div class="mb-30" v-if="proposal.serviceCategory">
                You have $ {{ (proposal.serviceCategory.allocatedBudget - proposal.cost) | withComma }} left over from
                your original defined budget.
              </div>
              <div class="mt-10 mb-10">
                Simply select anything that you would like to add. Please note that any item or service you choose here
                will be added to the overall vendor cost.
              </div>
              <div
                class="pt-10 pb-10"
                v-for="service in this.proposal.extraServices[this.vendor.eventCategory.key].filter(
                  (item) => !item.added && item.price,
                )"
                :key="service.subCategory"
              >
                <div class="d-flex align-center">
                  <div class="d-flex align-center">
                    <md-checkbox class="m-0 mr-10" v-model="service.addedOnProposal"></md-checkbox>
                    <span>{{ service.requirementTitle }}</span>
                  </div>
                  <div class="ml-auto pr-100">
                    <div class="element-price">${{ service.price | withComma }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <checkout-proposal-table
              v-for="(item, key) in cart"
              :proposal="item.proposal"
              :category="item.category"
              :key="key"
            >
            </checkout-proposal-table>
          </template>
        </div>
        <collapse-panel :defaultStatus="false" class="checkout-additional white-card mt-20">
          <template slot="header">
            <div class="d-flex align-center">
              <md-checkbox class="m-0 mr-10" v-model="onDayCordinator"></md-checkbox>
              <img :src="`${$iconURL}PaymentPage/Group 9556.svg`" class="mr-10 ml-10" />
              On Day Coordinator($1,000 Per Day)
            </div>
          </template>
          <template slot="content">
            <div class="price-table-content mt-1">
              Make sure everything goes smoothly on the day with a professional Maryoku event coordinator, who will be
              fully briefed to ensure your event is a success. Fixed price service.
            </div>
          </template>
        </collapse-panel>
        <collapse-panel :defaultStatus="false" class="checkout-additional white-card mt-20">
          <template slot="header">
            <div class="d-flex align-center disabled">
              <md-checkbox class="m-0 mr-10" :disabeld="true"></md-checkbox>
              Event Insurance (Coming Soon)
            </div>
          </template>
          <template slot="content">
            <div class="price-table-content"></div>
          </template>
        </collapse-panel>
        <collapse-panel :defaultStatus="false" class="checkout-additional white-card mt-20">
          <template slot="header">
            <div class="d-flex align-center">
              <md-checkbox class="m-0 mr-10" v-model="checkedGiveBack"></md-checkbox>
              <img :src="`${$iconURL}PaymentPage/Group 9791.svg`" class="mr-10 ml-10" />
              Give Back
            </div>
          </template>
          <template slot="content">
            <div class="price-table-content give-back-seciont">
              <div class="mb-20 mt-20">
                Support sustainability and eco-friendly initiatives with a donation to an organization committed to
                environmental responsibility. Every donation will be matched by Maryoku.
              </div>
              <md-button class="md-simple edit-btn md-red color-red mt-20">
                Read More <md-icon>keyboard_arrow_right</md-icon>
              </md-button>
              <hr class="mt-20 mb-20" />
              <div>
                <md-checkbox class="md-red md-simple" v-model="isCheckedFoodDonate">
                  Donate your food leftovers
                </md-checkbox>
              </div>
              <div class="mb-20 d-flex">
                <img :src="`${$iconURL}PaymentPage/Image 211.png`" />
                <div class="ml-10">
                  Don’t let your leftover food go to waste! Maryoku collaborates with food rescue organizations that
                  would really appreciate your contribution, helping the community and the environment.
                </div>
              </div>
              <hr class="mt-20 mb-20" />
              <div>
                <md-checkbox class="md-red md-simple" v-model="cachMaryokuPoints">
                  Cash in Your Maryoku Points
                </md-checkbox>
              </div>
              <div class="mb-20 d-flex">
                <div class="ml-10">
                  If you’ve collected enough Maryoku reward points, why not exchange them for exclusive vendor perks?
                  Simply print out the voucher and enjoy the results!
                </div>
              </div>
              <md-button class="md-simple md-red edit-btn mt-20">
                Read more about this organisation
                <md-icon>keyboard_arrow_right</md-icon>
              </md-button>
            </div>
          </template>
        </collapse-panel>
        <collapse-panel :defaultStatus="false" class="checkout-additional white-card mt-20">
          <template slot="header">
            <div class="d-flex align-center disabled">
              <md-checkbox class="m-0 mr-10"></md-checkbox>
              <img :src="`${$iconURL}common/reward.svg`" class="mr-10 ml-10" />
              Use your rewards with this event (Coming Soon)
            </div>
          </template>
          <template slot="content">
            <div class="price-table-content">123123</div>
          </template>
        </collapse-panel>
        <div class="total-price-panel mt-20 white-card" v-if="pageType === 0">
          <template v-if="discount(this.proposal).percentage">
            <div class="discount-row">
              <span class="font-bold">Discount </span>
              <span class="font-bold">-{{ discount(this.proposal).percentage }}%</span>
              <span class="text-right">-${{ discount(this.proposal).price | withComma }}</span>
            </div>
            <hr />
          </template>
          <div class="discount-row">
            <span class="font-bold">Tax </span>
            <span class="font-bold">{{ tax(this.proposal).percentage }}%</span>
            <span class="text-right">${{ tax(this.proposal).price | withComma }}</span>
          </div>
          <hr />
          <div class="discount-row">
            <span class="font-bold">Fee </span>
            <span class="font-bold">{{ feePercentail }}%</span>
            <span class="text-right">${{ feePrice(this.proposal) | withComma }}</span>
          </div>
          <div class="total-price-row">
            <div class="font-size-22 font-bold d-flex justify-content-between">
              <span>TOTAL TO PAY</span>
              <span>${{ finalPrice | withComma }}</span>
            </div>
          </div>
        </div>
        <div class="total-price-panel mt-20 white-card" v-else>
          <div class="total-price-row">
            <div class="font-size-22 font-bold d-flex justify-content-between">
              <span>TOTAL TO PAY</span>
              <span>${{ finalPrice | withComma }}</span>
            </div>
          </div>
        </div>
        <div class="mt-40">
          <md-checkbox class="m-0" v-model="agreedCancellationPolicy">
            <span class="font-regular">I agree to the</span>
            <a href="#" class="font-bold color-black text-underline">Cancellation policy</a>
          </md-checkbox>
          <!-- <div class="d-flex align-center payment-methods">
            <md-button
              class="md-simple payment-method"
              @click="paymentMethod = 'payoneer'"
              :class="{ selected: paymentMethod === 'payoneer' }"
            >
              <img :src="`${$iconURL}PaymentPage/payoneer.png`" />
            </md-button>
            <md-button
              class="md-simple payment-method"
              @click="paymentMethod = 'paypal'"
              :class="{ selected: paymentMethod === 'paypal' }"
            >
              <img :src="`${$iconURL}PaymentPage/pay pal.png`" />
            </md-button>
            <md-button
              class="md-simple payment-method"
              @click="paymentMethod = 'stripe'"
              :class="{ selected: paymentMethod === 'stripe' }"
            >
              <img :src="`${$iconURL}PaymentPage/Stripe.png`" />
            </md-button>
          </div> -->
          <stripe-checkout
            v-if="showStripeCheckout"
            :items="stripePriceData"
            :proposal="proposal"
            :successURL="successURL"
          ></stripe-checkout>
          <!-- <div>You will be transferred to a secured {{ paymentMethod }} payment</div> -->
        </div>
      </div>
    </div>
    <div class="checkout-footer white-card p-30 mt-30 d-flex justify-content-between">
      <md-button class="maryoku-btn md-simple md-black" @click="back">Back</md-button>
      <md-button class="maryoku-btn md-red" :disabled="!agreedCancellationPolicy" @click="pay"
        >Submit Payment
      </md-button>
    </div>
    <success-modal v-if="showSuccessModal"></success-modal>
  </div>
</template>
<script>
import Proposal from "@/models/Proposal";
import CheckoutPriceTable from "./CheckoutPriceTable.vue";
import CollapsePanel from "@/components/CollapsePanel.vue";
import StripeCheckout from "./StripeCheckout.vue";
import SuccessModal from "./SuccessModal.vue";
import CheckoutProposalTable from "./CheckoutProposalTable";
import { mapActions } from "vuex";

// checkout page type
const VENDOR = 0;
const CART = 1;

export default {
  components: { CheckoutPriceTable, CollapsePanel, StripeCheckout, SuccessModal, CheckoutProposalTable },
  data() {
    return {
      vendor: null,
      proposal: null,
      cart: {},
      loading: true,
      agreedCancellationPolicy: false,
      paymentMethod: "",
      checkedGiveBack: false,
      isCheckedFoodDonate: false,
      cachMaryokuPoints: false,
      stripePriceData: null,
      showStripeCheckout: false,
      loadingPayment: false,
      showSuccessModal: false,
      showCancelModal: false,
      onDayCordinator: false,
      feePercentail: 3.2,
      pageType: VENDOR,
      proposalType: null,
      successURL: null,
    };
  },
  async created() {
    if (this.$route.params.hasOwnProperty("proposalId")) {
      const proposalId = this.$route.params.proposalId;
      this.proposal = await Proposal.find(proposalId);
      this.vendor = this.proposal.vendor;
      this.pageType = VENDOR;

      this.successURL = this.proposal.nonMaryoku
        ? `${document.location.protocol}//${document.location.hostname}:${document.location.port}/#/vendor/offer/${this.proposal.id}`
        : `${window.location.href}?checkout=success`;
    } else if (this.$route.params.hasOwnProperty("eventId")) {
      const eventId = this.$route.params.eventId;
      this.cart = await this.getCartItems(eventId);
      this.pageType = CART;
    }

    this.loading = false;

    if (this.$route.query.checkout === "success") {

    }
  },
  computed: {
    event() {
      return this.$store.state.event.eventData;
    },
    categories() {
      return this.$store.state.common.serviceCategories;
    },
    finalPrice() {
      console.log("finalPrice");
      if (this.pageType === VENDOR) {
        console.log("finalPrice", this.discounedAndTaxedPrice(this.proposal));
        return this.discounedAndTaxedPrice(this.proposal) + this.feePrice(this.proposal);
      } else if (this.pageType === CART) {
        let sum = 0;
        Object.keys(this.cart).map((key) => {
          sum += this.discounedAndTaxedPrice(this.cart[key].proposal) + this.feePrice(this.cart[key].proposal);
        });
        return sum;
      }
    },
  },
  methods: {
    ...mapActions("planningBoard", ["getCartItems"]),
    tax(proposal) {
      if (!proposal.taxes) return { percentage: 0, price: 0 };
      let tax = proposal.taxes["total"];
      if (!tax) {
        tax = { price: 0, percentage: 0 };
      }
      return tax;
    },
    discount(proposal) {
      if (!proposal.discounts) return { percentage: 0, price: 0 };
      let discount = proposal.discounts["total"];
      if (!discount) {
        discount = { price: 0, percentage: 0 };
      }
      return discount;
    },
    bundledDiscountPrice(proposal) {
      let bundledServicePrice = 0;
      if (
        !proposal.bundleDiscount.services ||
        !proposal.bundleDiscount.services.length ||
        !proposal.bookedServices.length ||
        !proposal.bundleDiscount.services.every((it) => proposal.bookedServices.includes(it))
      )
        return 0;
      proposal.bundleDiscount.services.forEach((serviceCategory) => {
        const sumOfService = proposal.costServices[serviceCategory].reduce((s, service) => {
          return service.isComplimentary ? s : s + service.requirementValue * service.price;
        }, 0);
        bundledServicePrice += sumOfService;
      });
      return (bundledServicePrice * proposal.bundleDiscount.percentage) / 100 || 0;
    },

    totalPriceOfProposal(proposal) {
      let totalPrice = 0;
      let services = proposal.additionalServices.length ? proposal.bookedServices : Object.keys(proposal.costServices);
      services.map((serviceCategory) => {
        const sumOfService = proposal.costServices[serviceCategory].reduce((s, service) => {
          return service.isComplimentary ? s : s + service.requirementValue * service.price;
        }, 0);
        totalPrice += sumOfService;
      });

      const addedPrice = proposal.extraServices[proposal.vendor.eventCategory.key].reduce((s, service) => {
        if (!service.addedOnProposal) return s;
        return s + service.requirementValue * service.price;
      }, 0);

      console.log("totalPrice", totalPrice);
      return totalPrice + (addedPrice || 0);
    },
    discounedAndTaxedPrice(proposal) {
      console.log("bundledDiscount", this.bundledDiscountPrice(proposal));
      const eventDays = 1;
      let totalPriceOfProposal = this.totalPriceOfProposal(proposal);
      const discounted =
        totalPriceOfProposal -
        (totalPriceOfProposal * (this.discount(proposal).percentage || 0)) / 100 -
        this.bundledDiscountPrice(proposal);
      let price = discounted + (discounted * (this.tax(proposal).percentage || 0)) / 100;
      if (this.onDayCordinator) {
        price += eventDays * 1000;
      }
      return price;
    },

    feePrice(proposal) {
      return (this.discounedAndTaxedPrice(proposal) * this.feePercentail) / 100;
    },

    pay() {
      this.loadingPayment = true;
      const promises = [];
      for (const serviceCategory in this.proposal.pricesByCategory) {
        promises.push(
          this.$http.post(
            `${process.env.SERVER_URL}/stripe/v1/customer/products`,
            {
              name: this.$store.state.common.serviceCategoriesMap[serviceCategory].title,
              price: Math.floor(this.proposal.pricesByCategory[serviceCategory] * 100),
              proposalId: this.proposal.id,
              vendorId: this.proposal.vendor.id,
              eventId: this.proposal.vendor.id, ///proposal.event.id,  //not defined yet for the non maryoku
              serviceCategory,
            },
            { headers: this.$auth.getAuthHeader() },
          ),
        );
      }
      promises.push(
        this.$http.post(
          `${process.env.SERVER_URL}/stripe/v1/customer/products`,
          {
            name: "Service Fee",
            price: Math.floor(this.feePrice(this.proposal) * 100),
            proposalId: this.proposal.id,
            vendorId: this.proposal.vendor.id,
            eventId: this.proposal.vendor.id, ///proposal.event.id,  //not defined yet for the non maryoku
            serviceCategory: "serviceFee",
          },
          { headers: this.$auth.getAuthHeader() },
        ),
      );
      Promise.all(promises).then((responses) => {
        console.log(responses);

        const priceData = responses;
        this.showStripeCheckout = true;
        this.stripePriceData = responses.map((res) => res.data);
      });
    },
    back() {
      this.$router.push(`/events/${this.event.id}/booking/choose-vendor`);
    },
  },
};
</script>
<style lang="scss" scoped>
.event-vendor-checkout {
  .disabled {
    opacity: 0.5;
  }
  .checkout-content {
    margin: auto;
    max-width: 1600px;
    margin-top: 50px;
    .left-panel {
      height: 950px;
      max-width: 710px;
      position: relative;
      overflow: hidden;
      .background-section {
        width: 100%;
        height: 100%;
        position: absolute;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 50%;
        &::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: white;
          opacity: 0.6;
        }
      }
      .content {
        width: 100%;
        height: 100%;
        position: absolute;
      }
    }
    .right-panel {
      .price-table:not(:last-child) {
        border-bottom: solid 2px #d4d4d4;
      }
      .checkout-additional {
        padding: 30px;
      }
      .total-price-panel {
        hr {
          margin: 0 30px;
        }
        .discount-row {
          margin: 0 30px;
          padding: 20px 0;
          display: grid;
          grid-template-columns: 100px 100px auto;
        }
        .total-price-row {
          color: white;
          font-weight: bolder;
          background-color: #404040;
          padding: 30px;
        }
      }
    }
  }
  .payment-methods {
    .payment-method {
      padding: 10px;
      height: 60px;
      &.selected {
        background-color: #ddd !important;
      }
    }
  }
}
.element-price {
  font-weight: 900;
  font-size: 18px;
  text-align: left;
  color: #999999;
  width: 80px;
}
</style>
