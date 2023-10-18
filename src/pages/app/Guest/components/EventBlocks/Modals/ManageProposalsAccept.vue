<template>
  <div class="manage-proposals-panel">
    <div class="md-layout" style="max-height: 50vh">
      <div class="md-layout-item md-size-5" style="padding: 0; margin: 0">
        <h4 class="md-title">
          <md-button @click="closePanel" class="md-button md-theme-default md-simple md-just-icon">
            <md-icon>arrow_back</md-icon>
          </md-button>
        </h4>
      </div>
      <div class="md-layout-item md-size-95" style="max-height: 50vh">
        <h4 class="md-title" style="margin-bottom: 0; line-height: 51px; text-transform: capitalize">
          Accept Proposal <small></small>
        </h4>
        <div class="tabs-section">
          <tabs
            :tab-name="[
              '<span><i class=\'md-icon md-icon-font md-theme-default\'>check</i></span> Accept',
              '<span><i class=\'md-icon md-icon-font md-theme-default\'>attach_money</i></span> Pay',
            ]"
            color-button="default"
          >
            <template slot="tab-pane-1" style="width: 100%">
              <md-card class="text-left acceptance-section">
                <md-card-header class="acceptance-section-header">
                  <div class="header-title">
                    <div class="md-title">{{ proposal.vendor.vendorDisplayName }}</div>
                    <div class="star-rating">
                      <label
                        class="star-rating__star"
                        v-for="(rating, rIndex) in ratings"
                        :value="rating"
                        :key="rIndex"
                        :class="{ 'is-selected': proposal.vendor.rank >= rating && proposal.vendor.rank != null }"
                      >
                        <input class="star-rating star-rating__checkbox" type="radio" />★</label
                      >
                    </div>
                  </div>
                  <div class="header-actions">
                    <md-button class="md-danger" @click="acceptProposal(false)" v-if="proposalAccepted"
                      >UNDO ACCEPT THIS PROPOSAL</md-button
                    >
                    <md-button class="md-primary" @click="acceptProposal(true)" v-if="!proposalAccepted"
                      >I ACCEPT THIS PROPOSAL</md-button
                    >
                  </div>
                </md-card-header>
                <md-card-content>
                  <div class="md-layout">
                    <div class="md-layout-item md-size-50">
                      <md-card class="proposal-message">
                        <md-card-content class="proposal-payments">
                          <ul class="proposal-payments-details">
                            <li>
                              <div class="details-label">Provided Service</div>
                              <div class="details-desc">{{ selectedBlock.category }}</div>
                            </li>
                            <li>
                              <div class="details-label">Event</div>
                              <div class="details-desc">{{ event.title }}, {{ event.eventEndMillis }}</div>
                            </li>
                            <li>
                              <div class="details-label">Payment Method</div>
                              <div class="details-desc">Wiretransfer</div>
                            </li>
                            <li>
                              <div class="details-label">Cancellation Policy</div>
                              <div class="details-desc">
                                {{ proposal.candellationPolicy }}
                                <md-button class="md-rose md-sm md-simple no-uppercase">(Learn more)</md-button>
                              </div>
                            </li>
                          </ul>
                        </md-card-content>
                      </md-card>
                    </div>
                    <div class="md-layout-item md-size-50">
                      <md-card class="cost-pros-cons-section">
                        <md-card-content>
                          <div class="cost-info">
                            <div class="cost-info_desc full-width">
                              <div class="cost-label">Subtotal</div>
                              <div class="cost-value">${{ (proposal.cost - proposal.cost * 0.1).toFixed(2) }}</div>
                            </div>
                          </div>
                          <div class="payment-details">
                            <ul class="payment-details_list-items" v-if="proposal.costBreakdown">
                              <li v-for="(item, index) in proposal.costBreakdown" :key="index">
                                <div class="details-title">{{ item.service }}</div>
                                <div class="details-cost">${{ item.cost.toFixed(2) }}</div>
                              </li>
                              <li>
                                <div class="details-title">Down payment (10%)</div>
                                <div class="details-cost">${{ (proposal.cost * 0.1).toFixed(2) }}</div>
                              </li>
                            </ul>
                          </div>
                        </md-card-content>
                      </md-card>
                      <div class="payment-policy">
                        By accepting the proposal, you agree to its terms and cancellation policy. Not sure what’s
                        included in this proposal?
                        <md-button class="md-rose md-sm md-simple no-uppercase">Learn more</md-button>
                      </div>
                    </div>
                  </div>
                </md-card-content>
              </md-card>
            </template>
            <template slot="tab-pane-2" style="width: 50%">
              <proposal-payment
                :event="event"
                :selectedBlock="selectedBlock"
                :proposal="proposal"
                :winner-id="winnerId"
              ></proposal-payment>
            </template>
          </tabs>
        </div>
      </div>
    </div>
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
import ProposalPayment from "./ProposalPayment";

export default {
  components: {
    VueElementLoading,
    Tabs,
    EventBlockRequirements,
    ProposalPayment,
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
    EventComponentProposal.find(this.proposal.id)
      .then((resp) => {
        this.proposal.accepted = resp.accepted;
      })
      .catch((error) => {
        console.log(" error here   -->>>  ", error);
      });

    this.proposalAccepted = this.proposal.accepted;
  },
  methods: {
    closePanel() {
      this.$emit("closePanel");
    },
    getDate(eventStartMillis) {
      let x = new Date(eventStartMillis);
      return moment(x).format("MMMM D, YYYY");
    },
    acceptProposal(boolean) {
      let proposal = new EventComponentProposal({
        id: this.proposal.id,
      });

      proposal.accepted = boolean;
      this.proposalAccepted = boolean;

      proposal
        .save()
        .then((resp) => {
          console.log(resp);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: {},
};
</script>
