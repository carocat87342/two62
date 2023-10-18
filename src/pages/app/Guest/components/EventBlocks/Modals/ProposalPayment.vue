<template>
  <div class="proposal-payment">
    <md-card class="text-left acceptance-section bank-account-details">
      <md-card-header class="acceptance-section-header">
        <div class="header-title">
          <div class="md-title">Payment</div>
        </div>
        <div class="header-actions">
          <md-button class="md-primary" @click="submitPayment"
            >PAY NOW (${{ (proposal.cost - proposal.cost * 0.1).toFixed(2) }})</md-button
          >
        </div>
      </md-card-header>
      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-size-100">
            <md-card class="cost-pros-cons-section">
              <md-card-content>
                <div class="cost-info">
                  <div class="cost-info_desc full-width">
                    <div class="cost-label">Subtotal</div>
                    <div class="cost-value">${{ proposal.cost.toFixed(2) }}</div>
                  </div>
                </div>

                <div class="payment-details">
                  <ul class="payment-details_list-items fee-tax-items">
                    <li class="fee-tax">
                      <div class="details-title">Downpayment (10%)</div>
                      <div class="details-cost">${{ (proposal.cost * 0.1).toFixed(2) }}</div>
                    </li>
                  </ul>

                  <div class="form-section">
                    <div class="md-layout">
                      <div class="md-layout-item md-size-100">
                        <h4 class="section-title">Bank Details</h4>
                      </div>
                      <div class="md-layout-item md-size-50">
                        <md-field>
                          <label>Name</label>
                          <md-input id="name" type="text"></md-input>
                        </md-field>
                      </div>
                      <div class="md-layout-item md-size-50">
                        <md-field>
                          <label>Email</label>
                          <md-input id="email" type="text"></md-input>
                        </md-field>
                      </div>
                      <div class="md-layout-item md-size-50">
                        <md-field>
                          <label>Swift / BIC</label>
                          <md-input type="text"></md-input>
                        </md-field>
                      </div>
                      <div class="md-layout-item md-size-50">
                        <md-field>
                          <label>Bank Name</label>
                          <md-input type="text"></md-input>
                        </md-field>
                      </div>
                      <div class="md-layout-item md-size-100">
                        <md-field>
                          <label>Address</label>
                          <md-input type="text"></md-input>
                        </md-field>
                      </div>
                      <div class="md-layout-item md-size-33">
                        <md-field>
                          <label>City</label>
                          <md-input type="text"></md-input>
                        </md-field>
                      </div>
                      <div class="md-layout-item md-size-33">
                        <md-field>
                          <label>State</label>
                          <md-input type="text"></md-input>
                        </md-field>
                      </div>
                      <div class="md-layout-item md-size-33">
                        <md-field>
                          <label>Country</label>
                          <md-input type="text"></md-input>
                        </md-field>
                      </div>
                    </div>
                  </div>

                  <div class="form-section">
                    <div class="md-layout">
                      <div class="md-layout-item md-size-100">
                        <h4 class="section-title">Your Details</h4>
                      </div>
                      <div class="md-layout-item md-size-50">
                        <md-field>
                          <label>Landline number</label>
                          <md-input type="text"></md-input>
                        </md-field>
                      </div>
                      <div class="md-layout-item md-size-50">
                        <md-field>
                          <label>Mobile number</label>
                          <md-input type="text"></md-input>
                        </md-field>
                      </div>

                      <div class="md-layout-item md-size-100">
                        <div ref="card"></div>
                      </div>

                      <div class="md-layout-item md-size-100">
                        <div id="error-message" role="alert"></div>
                      </div>

                      <div class="md-layout-item md-size-100">
                        <md-checkbox class="md-info">Remember details for future payments</md-checkbox>
                      </div>
                    </div>
                  </div>
                </div>
              </md-card-content>
            </md-card>

            <div class="payment-policy">
              By clicking pay now, you agree to pay the total amount shown, which includes tax and service Fee.
            </div>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
// import auth from '@/auth';
import Vue from "vue";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import CalendarEvent from "@/models/CalendarEvent";
import Calendar from "@/models/Calendar";
import EventComponent from "@/models/EventComponent";
import { Tabs } from "@/components";

import Swal from "sweetalert2";
import { error } from "util";
import moment from "moment";
import VueElementLoading from "vue-element-loading";
import _ from "underscore";
import ViewProposal from "./ViewProposal.vue";
import EventBlockRequirements from "../Modals/EventBlockRequirements.vue";
import EventComponentProposal from "@/models/EventComponentProposal";

// var stripe = Stripe('pk_test_Pf5EtcXWfAPTNuKeJ6IDqQPu00zkS2tASs');

// Create an instance of Elements.
// var elements = stripe.elements();

var card = undefined;

export default {
  components: {
    VueElementLoading,
    Tabs,
    EventBlockRequirements,
  },
  props: {
    event: Object,
    selectedBlock: Object,
    proposal: Object,
    winnerId: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    // auth: auth,
    isLoaded: false,
    proposalsToDisplay: 1,
    ratings: [1, 2, 3, 4, 5],
    feedbackRating: 3,
    proposalAccepted: false,
    image: "https://i.imgur.com/HhqxVCW.jpg",
    name: "Shut up and take my money!",
    description: "Cats are the best dog!",
    currency: "PHP",
    amount: 99999,
  }),

  created() {},
  mounted() {
    setTimeout(() => {
      // Custom styling can be passed to options when creating an Element.
      // (Note that this demo uses a wider set of styles than the guide below.)
      var style = {
        base: {
          color: "#32325d",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#aab7c4",
          },
          ":-webkit-autofill": {
            color: "#32325d",
          },
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a",
          ":-webkit-autofill": {
            color: "#fa755a",
          },
        },
      };

      // card = elements.create('card');
      // card.mount(this.$refs.card);

      // console.log('elements => ', elements);
    }, 100);
  },
  methods: {
    submitPayment(event) {
      let self = this;

      /* stripe.createToken(card).then(function(result) {
                    console.log(result);
                    if (result.error) {
                        self.hasCardErrors = true;
                        self.$forceUpdate(); // Forcing the DOM to update so the Stripe Element can update.
                        return;
                    }

                }); */
    },
  },
  computed: {},
};
</script>
