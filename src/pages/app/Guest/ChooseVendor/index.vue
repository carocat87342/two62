<template>
  <div class="md-layout booking-section position-relative booking-proposals bg-white" style="padding-left: 450px">
    <budget-notifications field="negotiation"></budget-notifications>
    <div class="choose-vendor-board">
      <loader :active="isLoadingProposal" />
      <div class="d-flex justify-content-between align-center">
        <div>
          <resizable-toggle-button
            class="mr-20 mb-10"
            :key="tab"
            :label="getServiceCategoryByKey(tab).title"
            :icon="`${$iconURL}Budget+Elements/${tab}.svg`"
            :selectedIcon="`${$iconURL}Budget+Elements/${tab}-white.svg`"
            :defaultStatus="tab === selectedCategory"
            :disabled="!eventRequirements[tab]"
            :hasBadge="hasBadge(tab)"
            iconStyle="opacity:0.8"
            v-for="tab in tabs"
            @click="selectCategory(tab)"
          ></resizable-toggle-button>
          <button class="add-category-button mb-10" @click="addRequirements"><md-icon>add</md-icon></button>
        </div>
        <progress-radial-bar
          :value="proposals.length"
          :total="3"
          icon="common/checked-calendar-red.svg"
          @click="openCart"
        ></progress-radial-bar>
      </div>
      <div class="booking-proposals">
        <template v-if="proposals.length > 0">
          <div class="font-size-30 font-bold-extra category-title mt-30 mb-30">
            <img :src="`${$iconURL}Budget+Elements/${getServiceCategoryByKey(selectedCategory).icon}`" />
            {{ getServiceCategoryByKey(selectedCategory).title }}
          </div>
          <div class="d-flex justify-content-between">
            <div>We found the top {{ proposals.length }} proposals for your event, Book now before it’s too late</div>
<!--            <div class="header-actions">-->
<!--              <md-button class="md-simple normal-btn md-red" @click="compareProposal">-->
<!--                <md-icon>bar_chart</md-icon>-->
<!--                Compare Proposals-->
<!--              </md-button>-->
<!--              <span class="seperator"></span>-->
<!--              <md-button class="md-simple normal-btn md-red" @click="showDifferentProposals = true">-->
<!--                <md-icon>edit</md-icon>-->
<!--                I Want Something Different-->
<!--              </md-button>-->
<!--            </div>-->
          </div>
          <div>
            <!-- Event Booking Items -->
            <div class="events-booking-items" v-if="proposals.length">
              <proposal-card
                @goDetail="goDetailPage"
                v-for="(proposal, index) in proposals.slice(0, 3)"
                :key="index"
                :proposal="proposal"
                :component="selectedCategory"
                :probability="getProbability(index)"
                :isCollapsed="showDetails"
                :isSelected="selectedProposal && selectedProposal.id === proposal.id"
              >
              </proposal-card>
            </div>
            <template v-if="showDetails">
              <transition name="component-fade" mode="out-in">
                <event-proposal-details
                  class="mt-20"
                  :proposal="selectedProposal"
                  :category="selectedCategory"
                  :key="selectedProposal.id"
                  @favorite="favoriteProposal"
                  @close="closeProposal"
                  @ask="handleAsk"
                ></event-proposal-details>
              </transition>
            </template>
          </div>
        </template>
        <pending-for-vendors v-else :expiredTime="expiredTime"></pending-for-vendors>
      </div>
    </div>
    <div class="proposals-footer white-card">
      <div v-if="proposals.length">
        <md-button class="md-simple maryoku-btn md-black">
          <span class="text-transform-capitalize">I already have a vendor</span>
        </md-button>
        <md-button
          class="md-simple maryoku-btn md-black text-transform-capitalize"
          @click="isOpenedAdditionalModal = true"
        >
          <span class="text-transform-capitalize">Change requirements</span>
        </md-button>
      </div>
      <md-button v-else class="md-simple maryoku-btn md-black ml-auto" @click="updateExpiredTime">
          <span class="text-transform-capitalize">I need those proposals urgent</span>
      </md-button>

      <div v-if="proposals.length">
        <md-button
            class="md-simple md-outlined md-red maryoku-btn"
            :disabled="proposals.length === 0 || !selectedProposal"
            @click="bookVendor"
        >
          Book Now
        </md-button>
        <md-button class="md-red maryoku-btn"
                   :disabled="proposals.length === 0 || !selectedProposal"
                   @click="addToCart">Add To Cart</md-button>
      </div>
    </div>
    <services-cart
        v-if="showCart"
        @close="showCart = false"
    ></services-cart>
    <additional-request-modal
      class="lg"
      v-if="isOpenedAdditionalModal"
      :subCategory="currentRequirement.mainRequirements"
      :selectedCategory="getServiceCategoryByKey(selectedCategory)"
      :defaultData="getRequirementsFormStore(selectedCategory) || {}"
      @save="saveAdditionalRequest"
      @cancel="isOpenedAdditionalModal = false"
      @close="isOpenedAdditionalModal = false"
    ></additional-request-modal>
    <event-change-proposal-modal
      v-if="showDifferentProposals"
      @close="showDifferentProposals = false"
      :proposals="proposals.slice(0, 3)"
    ></event-change-proposal-modal>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "underscore";
import moment from "moment";
import InputMask from "vue-input-mask";

import { postReq, getReq } from "@/utils/token";

import Proposal from "@/models/Proposal";
import EventComponent from "@/models/EventComponent";
import EventCategoryRequirement from "@/models/EventCategoryRequirement";
import ProposalNegotiationRequest from "@/models/ProposalNegotiationRequest";

import { Modal, MaryokuInput, Loader } from "@/components";
import {NEGOTIATION_REQUEST_STATUS} from "@/constants/status";
import ResizableToggleButton from "@/components/Button/ResizableToggleButton.vue";
import EventChangeProposalModal from "@/components/Modals/EventChangeProposalModal";
import ProposalCard from "../components/ProposalCard";
import PendingForVendors from "../components/PendingForVendors.vue";
import EventProposalDetails from "../Proposal/EventProposalDetails.vue";
import ProposalsBar from "./ProposalsBar.vue";
import AdditionalRequestModal from "../PlanningBoard/components/modals/AdditionalRequest.vue";

import ProgressRadialBar from "../PlanningBoard/components/ProgressRadialBar.vue";
import ServicesCart from "./ServicesCart";
import NegotiationNotification from "./components/NegotiationNotification";
import Swal from "sweetalert2";

export default {
  name: "event-booking",
  components: {
    Loader,
    InputMask,
    Modal,
    EventChangeProposalModal,
    NegotiationNotification,
    ProposalCard,
    MaryokuInput,
    ResizableToggleButton,
    PendingForVendors,
    EventProposalDetails,
    ProposalsBar,
    AdditionalRequestModal,
    ProgressRadialBar,
    ServicesCart,
  },
  props: {},
  data: () => ({
    // auth: auth,

    selectedCategory: null,
    calender: null,
    somethingMessage: null,
    iconsURL: "https://static-maryoku.s3.amazonaws.com/storage/icons/Event%20Page/",
    blockVendors: null,
    allRequirements: null,
    selectedBlock: null,
    // proposals: [],
    blockId: "",
    currentRequirement: null,
    proposalsByCategory: {},

    isOpenedAdditionalModal: false,
    isLoading: true,
    isLoadingProposal: false,
    showProposals: false,
    showCounterPage: false,
    showSomethingModal: false,
    showShareVendorModal: false,
    showCommentEditorPanel: false,
    showDetails: false,
    selectedProposal: null,
    showDifferentProposals: false,
    showNegotiationNotification: false,
    showCart: false,
  }),
  methods: {
    ...mapMutations("EventGuestVuex", ["setEventData", "setBookingRequirements"]),
    ...mapActions("comment", ["getCommentComponents"]),
    ...mapActions("planningBoard", ["saveMainRequirements", "getCartItems", "saveTypes", "updateRequirements", "updateCartItem"]),
    ...mapActions("EventGuestVuex", ["getProposals", "getRequirements", "saveRequirement"]),
    selectCategory(category, clicked) {
      this.currentRequirement = this.eventRequirements[category];
      this.selectedCategory = category;
      let proposals = this.$store.state.EventGuestVuex.proposals;
      if (proposals[category]) {
        proposals[category].forEach((proposal, index) => {
          new Proposal({ id: proposal.id, viewed: true }).save().then((res) => {
            this.$set(proposal, "viewed", true);
          });
        });
      }
    },
    getServiceCategoryByKey(key){
        if(!key) return null
        let category = this.serviceCategories.find(cat => cat.key === key);
        return category ? category : null;
    },
    addRequirements() {
      this.$router.push(`/events/${this.event.id}/booking/planningboard`);
    },
    getSelectedBlock() {
      this.selectedBlock = _.findWhere(this.categoryList, {
        id: this.blockId,
      });
      if (this.selectedBlock && this.selectedBlock.vendorRequirements && this.selectedBlock.vendorRequirements[0]) {
        this.showCounterPage = false;
        this.showProposals = false;
      } else {
        this.showCounterPage = false;
        this.showProposals = false;
      }
      this.isLoading = false;
    },
    toggleCommentMode(mode) {
      this.showCommentEditorPanel = mode;
    },
    fetchData: async function () {
      this.blockId = this.$route.params.blockId;
      this.event = this.$store.state.EventGuestVuex.eventData;
      this.getSelectedBlock();
      new Proposal()
        .for(new EventComponent({ id: this.selectedCategory.id }))
        .get()
        .then((result) => {
          this.proposals = result;
          if (result.length > 0) this.showProposals = true;
        });

      await this.getAllRequirements();
    },
    setRequirements(requirementContent) {
      this.currentRequirement = requirementContent;
      this.showCounterPage = true;
      this.showProposals = true;
    },
    back() {
      this.showCounterPage = false;
      this.showProposals = false;
    },
    async updateExpiredTime() {

      let requirement = await this.saveRequirement({
          requirement: {
              id: this.currentRequirement.id,
              expiredBusinessTime: moment(this.currentRequirement.expiredBusinessTime).subtract(1, "days").valueOf(),
          },
          eventId: this.event.id
      });
      console.log('updateExpiredTime', requirement);
      this.currentRequirement = requirement;
    },
    goDetailPage(proposal) {
      this.showDetails = true;
      this.selectedProposal = proposal;
    },
    closeProposal() {
      this.showDetails = false;
      this.selectedProposal = null;
    },
    getProbability(index) {
      return 100 - 10 * (index + 1) + Math.round(10 * Math.random());
    },
    compareProposal() {
      this.$router.push(`/events/${this.event.id}/booking/${this.selectedCategory.id}/proposals/compare`);
    },
    fetchProposals() {
      new Proposal()
        .for(new EventComponent({ id: this.blockId }))
        .get()
        .then((result) => {
          this.proposals = result;
          if (result.length > 0) this.showProposals = true;
        });
    },

    saveAdditionalRequest({ category, requirements }) {
      this.isOpenedAdditionalModal = false;
      requirements.id = this.currentRequirement.id;
      this.saveMainRequirements({ category: this.selectedCategory, event: this.event, requirements });
    },
    getRequirementsFormStore(category) {
      if (!this.$store.state[category]) return {};
      return this.$store.state[category].mainRequirements;
    },
    hasBadge(category) {
      if (!this.proposalsByCategory[category]) return false;
      if (this.proposalsByCategory[category].length === 0) return false;
      const notViewedProposals = this.proposalsByCategory[category].filter((item) => !item.viewed);
      if (notViewedProposals.length === 0) return false;
      console.log(notViewedProposals);
      return true;
    },
    async bookVendor() {
      if(!this.selectedProposal) return;
      await new Proposal({ ...this.selectedProposal }).save();
      this.$router.push({
        name: "CheckoutWithVendor",
        params: {
            proposalId: this.selectedProposal.id,
        },
      });
    },
    async favoriteProposal(isFavorite){
      this.selectedProposal = await this.$store.dispatch('event/updateProposal', {
          proposal: {...this.selectedProposal, isFavorite},
          category: this.selectedCategory
      });
      this.setCategoryCartItem({
          category: this.selectedCategory,
          item: {...this.cart[this.selectedCategory], proposal: {...this.selectedProposal, isFavorite}}
      });
    },
    async handleAsk(ask){
        if (ask === 'expiredDate') {
            let expiredTime = moment().add(2, 'days').unix() * 1000;
            let query = new ProposalNegotiationRequest({
                eventId: this.event.id,
                proposalId: this.selectedProposal.id,
                proposal: new Proposal({id: this.selectedProposal.id}),
                expiredTime,
                url: `${location.protocol}//${location.host}/#/events/${this.event.id}/booking/choose-vendor`
            });

            let res = await query.for(new Proposal({ id: this.selectedProposal.id })).save()
            console.log('ask.result', res);
            this.selectedProposal.negotiations.push(res);
        }
    },
    async addToCart() {
      if(!this.selectedProposal) return;
      this.updateCartItem({
          category: this.selectedCategory,
          event: {id: this.event.id},
          proposalId: this.selectedProposal.id,
      })
      this.$store.dispatch('event/updateProposal', {
         proposal: {...this.selectedProposal, isFavorite: false},
         category: this.selectedProposal.vendor.vendorCategory,
      });
    },
    openCart(){
      this.showCart = true;
    },
    async processNotification(){
      console.log('processNotification');
      let proposals = this.negotiationProposals;
      this.showNegotiationNotification = false;
      Object.keys(proposals).map(key => {
          this.negotiationProposals[key].map(proposal => {
              let { negotiations } = proposal;
              negotiations.map(it => it.status = 3);
              this.$store.dispatch('event/updateProposal', {
                  category: key,
                  proposal: {...proposal, negotiations}
              })
          })
      })
    }
  },
  async created() {
    await this.$store.dispatch('planningBoard/resetCartItems');
    this.isLoadingProposal = true;
    await this.getRequirements(this.event.id);
    await this.getProposals({eventId: this.event.id});
    await this.getCartItems(this.event.id);

    this.isLoadingProposal = false;

    this.selectCategory(Object.keys(this.eventRequirements)[0]);

    let self = this;
    this.$root.$on("clearVendorRequirement", (event) => {
      let requirements = self.storedRequirements;
      if (requirements[event.id]) requirements[event.id] = null;
      self.setBookingRequirements(requirements);
    });
  },
  watch: {
    event(newVal, oldVal) {
      this.$root.$emit("set-title", this.event, this.routeName === "EditBuildingBlocks", true);
    },
    negotiationProposals(newVal){
      console.log('negotiationProposals', newVal);
      if(Object.keys(newVal).length) {
          this.$notify({
              message: {
                  title: 'Great News!',
                  content: 'The vendor has accepted your request to extend the validity of the offer. You have an extra 4 days to decide',
                  close: this.processNotification
              },
              icon: `${this.$iconURL}messages/group-21013.svg`,
              horizontalAlign: "right",
              verticalAlign: "top",
              timeout: 5000,
          });
      }
    },
    proposals(newVal){},
    expiredTime(){},
    eventRequirements(newVal){},
    $route: "fetchData",
  },
  filters: {
    formatDate: function (date) {
      return moment(date).format("MMM Do YYYY ");
    },
    formatTime: function (date) {
      return moment(date).format("h:00 A");
    },
    formatDuration: function (startDate, endDate) {
      return moment(endDate).diff(startDate, "hours");
    },
    withComma(amount) {
      return amount ? amount.toLocaleString() : 0;
    },
  },
  computed: {
    ...mapGetters({
      storedRequirements: "event/getBookingRequirements",
    }),
    ...mapState({
      eventRequirements: (state) => state.EventGuestVuex.requirements || {},
    }),
    serviceCategories(){
      return this.$store.state.common.serviceCategories;
    },
    categoryList() {
      return this.$store.state.EventGuestVuex.eventData.components;
    },
    expiredTime() {
      console.log('expiredTime', this.currentRequirement);
      if (this.currentRequirement) return this.currentRequirement.expiredBusinessTime;
      return 0;
    },
    tabs(){
      if(!this.eventRequirements || !Object.keys(this.eventRequirements).length) return []
      return Object.keys(this.eventRequirements).sort((a, b) => {
          let a_service = this.serviceCategories.find(s => s.key === a);
          let b_service = this.serviceCategories.find(s => s.key === b);
          return a_service.order - b_service.order;
      })
    },
    event() {
        return this.$store.state.EventGuestVuex.eventData;
    },
    cart(){
      return this.$store.state.EventGuestVuex.cart;
    },
    proposals() {
      let proposals = this.$store.state.EventGuestVuex.proposals;
      if (!this.selectedCategory || !proposals.hasOwnProperty(this.selectedCategory)) return [];
      return proposals[this.selectedCategory];
    },
    negotiationProposals(){
      let proposals = this.$store.state.EventGuestVuex.proposals;
      if(!Object.keys(proposals).length) return {}
      let negotiationProposals = {};
      Object.keys(proposals).map(key => {
          let subProposals = [];
          proposals[key].map(p => {
              let negotiations = p.negotiations.filter(n =>
                  n.status === NEGOTIATION_REQUEST_STATUS.APPROVED || n.status === NEGOTIATION_REQUEST_STATUS.DECLINE);
              if(negotiations.length) {
                  subProposals.push(p);
              }
          })
          if(subProposals.length) negotiationProposals[key] = subProposals;
      })
      return negotiationProposals;
    },
  },
};
</script>
<style lang="scss" scoped>
.booking-section.booking-proposals {
  .choose-vendor-board {
    width: 100%;
    padding: 3rem;
    padding-bottom: 150px;
  }
  .category-title {
    img {
      width: 30px;
    }
  }
  .header {
    max-height: max-content;
  }
  .header-actions {
    display: flex;
    height: max-content;
  }
  .seperator {
    border-left: solid 1px #050505;
  }
  .events-booking-items {
    padding: 0 0em;
    margin-bottom: 1em;
    align-items: stretch;
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }
  .booking-section__actions {
    width: 100%;
    text-align: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 25px 1.9em;
    background: white;
  }
  .footer-container {
    position: fixed;
    bottom: 0;
    left: 0;
    padding-left: 500px;
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    background: white;
    font-family: "Manrope-Regular", sans-serif;
  }
  .proposals-footer {
    position: fixed;
    bottom: 0;
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    width: calc(100% - 450px);
    z-index: 10;
  }
  .add-category-button {
    border: none;
    width: 60px;
    height: 60px;
    display: inline-block;
    border-radius: 50%;
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
    background-color: #ffffff;
    cursor: pointer;
    i {
      font-size: 40px !important;
    }
  }
  .component-fade-enter-active,
  .component-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
</style>
