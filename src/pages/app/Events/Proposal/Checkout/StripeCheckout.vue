<template>
  <div>
    <stripe-checkout
      ref="checkoutRef"
      mode="payment"
      :pk="publishableKey"
      :line-items="lineItems"
      :success-url="successURL"
      :cancel-url="cancelURL"
      @loading="(v) => (loading = v)"
    />
  </div>
</template>

<script>
import { StripeCheckout } from "@vue-stripe/vue-stripe";
export default {
  components: {
    StripeCheckout,
  },
  props: {
    proposal: {
      type: Object,
      required: true,
    },
    items: {
      type: Array,
      default: () => [],
    },
    successURL: {
      type: String,
      default: false,
    },
  },
  mounted() {
    this.$refs.checkoutRef.redirectToCheckout();
  },
  data() {
    this.publishableKey = process.env.STRIPE_PK;

    return {
      loading: false,
      lineItems: this.items.map((it) => {
        return {
          price: it.id,
          quantity: 1,
        };
      }),
      cancelURL: `${window.location.href}?checkout=cancel`,
    };
  },
  methods: {
    submit() {
      // You will be redirected to Stripe's secure checkout page
      this.$refs.checkoutRef.redirectToCheckout();
    },
  },
};
</script>
