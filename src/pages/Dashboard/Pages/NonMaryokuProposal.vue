<template>
  <div class="non-maryoku-proposal">
    <loader :active="loading" :isFullScreen="true" page="vendor"></loader>
    <template v-if="proposal">
        <div class="proposal-header md-layout md-alignment-center " :class="isMobile ? 'pt-20' : 'p-30 bg-pale-grey'">
            <img v-if="isMobile && !showOffer" :src="headerBackgroundImage" class="position-absolute" style="left: 0;right: 0;top: 0;bottom: 0;width: 100%;height: 200px"/>
            <div class="md-layout-item md-large-size-50 md-small-size-80 d-flex" :class="isMobile ?'justify-content-center':''">
                <img class="md-small-hide" :src="`${$iconURL}Budget+Elements/${proposal.vendor.eventCategory.icon}`" />
                <b class="font-size-30 ml-10 md-small-hide">{{ proposal.vendor.eventCategory.fullTitle }}</b>

                <div v-if="isMobile && vendor.vendorLogoImage">
                    <img class="ml-10" :src="`${vendor.vendorLogoImage}`">
                </div>

                <div :class="isMobile ? 'font-size-16 ml-10' : 'font-size-30 ml-10'">{{ proposal.vendor.companyName }}</div>
            </div>

            <div class="md-layout-item md-large-size-50 md-small-size-20 d-flex">
                <HeaderActions
                    className="ml-auto"
                    page="proposal"
                    @toggleCommentMode="toggleCommentMode"
                    @share="shareWithAuth"
                    @export="downProposal"
                ></HeaderActions>
            </div>

            <div v-if="isMobile" class="md-layout-item md-small-size-100">
                <md-card v-if="!showOffer" class="d-flex flex-column text-center border-radius-none py-20 my-10">
                    <div v-if="vendor.vendorLogoImage">
                        <img :src="`${vendor.vendorLogoImage}`">
                    </div>
                    <h2 v-if="vendor.companyName" class="font-size-24 font-bold-extra text-uppercase my-10">{{
                            `${vendor.companyName} proposal`
                        }}</h2>
                    <p class="text-center font-bold-extra m-0 px-10">You have received an offer for the</p>
                    <span class="text-center font-bold-extra m-0 px-10">
                        <b class="font-size-16 font-bold-extra text-capitalize">{{` ${proposal.eventData.customer.companyName}` }}</b> event. Let's start..</span>
                </md-card>
            </div>
        </div>
        <div class="proposal-container" :class="isMobile ? 'mt-10' : 'mt-40'">
            <EventProposalDetails
                :proposal="proposal"
                :landingPage="true"
                :nonMaryoku="true"
                :showOffer="showOffer"
                v-if="proposal"
                @updateProposal="handleUpdate"
                @ask="handleAsk"
                @favorite="handleFavorite"
            >
                <template slot="timer">
                    <TimerPanel
                        v-if="!isMobile || isMobile && !showOffer"
                        :class="!isMobile ? 'time-counter' : 'time-counter-mobile'"
                        :target="targetTime"
                        :pending="negotiationPending"
                        :declined="negotiationDeclined"
                        :approved="negotiationProcessed"
                        @updateExpireDate="handleAsk('expiredDate')"
                        :theme="isMobile ? 'mobile red' : 'red'"
                    ></TimerPanel>
                </template>
            </EventProposalDetails>
        </div>

        <div class="text-center logo-area" :class="isMobile ? 'font-size-12 py-10' : 'font-size-18 p-40 mt-40'">
            Provided By
            <img class="ml-10" :src="`${$iconURL}RSVP/maryoku - logo dark@2x.png`" />
            <p class="m-0 align-baseline text-underline">Who are we and why are we great?</p>
        </div>

        <a v-if="isMobile && !showOffer"
           class="d-flex align-center font-size-16 font-bold-extra justify-content-center bg-red color-white py-20"
           @click="showOffer = true"
        >
            View the details of the offer
        </a>
        <div v-if="!isMobile" class="proposal-footer d-flex justify-content-between align-center px-30">

                <md-menu md-size="medium" md-align-trigger md-direction="top-end" class="schedule-menu">
                    <md-button md-menu-trigger class="md-simple md-black maryoku-btn">
                        More Actions
                        <md-icon>expand_less</md-icon>
                    </md-button>
                    <md-menu-content>
                        <md-menu-item class="text-center" @click="showModal('NEGOTIATION')">
                        <span class="font-size-16 font-bold-extra pl-20">
                          <img
                              :src="`${$iconURL}budget+screen/SVG/Asset%2010.svg`"
                              class="mr-10"
                              style="width: 20px; height: 28px"
                          />
                          Negotiate Rate
                        </span>
                        </md-menu-item>
                        <md-menu-item class="text-center" @click="showModal('REMINDER')">
                        <span class="font-size-16 font-bold-extra pl-20">
                          <img :src="`${$iconURL}Vendor Signup/Asset 522.svg`" class="mr-10"
                               style="width: 20px; height: 20px"/>
                          Remind me later
                        </span>
                        </md-menu-item>
                        <md-menu-item class="text-center" @click="showModal('EVENT_CHANGE')">
                        <span class="font-size-16 font-bold-extra pl-20">
                          <img :src="`${$iconURL}common/calendar-dark.svg`" class="mr-10" style="width: 20px; height: 20px" />
                          Change event details
                        </span>
                        </md-menu-item>
                    </md-menu-content>
                </md-menu>

                <md-button class="md-simple md-red md-outlined maryoku-btn ml-auto" @click="declineProposal">Decline Proposal</md-button>
                <md-button class="md-red maryoku-btn ml-10" @click="bookProposal">Book Now</md-button>

        </div>

        <div v-if="showOffer" class="md-layout mobile-show">
            <a class="md-layout-item md-size-50 color-red md-outlined text-center py-15 text-decoration-none" @click="showModal('MORE_ACTIONS')">More actions</a>
            <a class="md-layout-item md-size-50 bg-red color-white text-center py-15 text-decoration-none">Book now</a>
        </div>

    </template>
    <CommentEditorPanel
      v-if="showCommentEditorPanel"
      :commentComponents="commentComponents"
      @saveComment="saveCommentWithAuth"
      @updateComment="updateCommentWithAuth"
      @deleteComment="deleteCommentWithAuth"
      @updateCommentComponent="updateCommentComponentWithAuth"
    >
    </CommentEditorPanel>

    <GuestSignUpModal
      v-if="showGuestSignupModal"
      :onlyAuth="onlyAuth"
      @signIn="signIn"
      @signUp="signUp"
      @save="saveGuestComment"
      @authenticate="auth"
      @cancel="showGuestSignupModal = false"
    >
    </GuestSignUpModal>
  </div>
</template>
<script>
import moment from "moment";
import Swal from "sweetalert2";
import Proposal from "@/models/Proposal";
import Vendor from "@/models/Vendors";
import Reminder from "@/models/Reminder";
import ProposalRequest from "@/models/ProposalRequest";
import ProposalNegotiationRequest from "@/models/ProposalNegotiationRequest";

import { CommentMixins, ShareMixins, MobileMixins, TimerMixins } from "@/mixins";
import { mapActions, mapMutations } from "vuex";
import { PROPOSAL_STATUS, NEGOTIATION_REQUEST_TYPE } from "@/constants/status";

const components = {
    EventProposalDetails: () => import('@/pages/app/Events/Proposal/EventProposalDetails.vue'),
    TimerPanel: () => import("@/pages/app/Events/components/TimerPanel.vue"),
    CommentEditorPanel: () => import('@/pages/app/Events/components/CommentEditorPanel'),
    GuestSignUpModal: () => import('@/components/Modals/VendorProposal/GuestSignUpModal.vue'),
    HeaderActions: () => import('@/components/HeaderActions.vue'),

    Loader: () => import('@/components/loader/Loader.vue'),
    Modal: () => import('@/components/Modal.vue'),
    ActionModal: () => import('@/components/ActionModal.vue'),
    SignInContent: () => import('@/components/SignInContent/index.vue'),
    CollapsePanel: () => import("@/components/CollapsePanel.vue"),
    RemindingTimeModal: () => import('@/components/Modals/VendorProposal/RemindingTimeModal.vue'),
    NegotiationRequestModal: () => import('@/components/Modals/VendorProposal/NegotiationRequestModal.vue'),
}

export default {
  components,
  mixins: [CommentMixins, ShareMixins, MobileMixins, TimerMixins],
  data() {
    return {
      page: "signin",
      loading: true,
      proposal: null,
      onlyAuth: false,
      showOffer: false,
      showDetailModal: false,
      showUpdateSuccessModal: false,
      showCommentEditorPanel: false,
      showGuestSignupModal: false,
      showRemindingTimeModal: false,
      showNegotiationRequestModal: false,
    };
  },
  async created() {

    let tenantUser = null;
    if (this.loggedInUser) {
      tenantUser = await this.$store.dispatch("auth/checkToken", this.loggedInUser.access_token);
    }
    const givenToken = this.$route.query.token;

    const proposalId = this.$route.params.proposalId;
    await this.$store.dispatch("common/getEventTypes");
    this.proposal = await Proposal.find(proposalId);

    if (this.proposal.selectedVersion > -1)
      this.proposal = this.getUpdatedProposal(this.proposal, this.proposal.versions[this.proposal.selectedVersion].data);

    if (!this.proposal.inspirationalPhotos) this.proposal.inspirationalPhotos = [];
    if (!this.proposal.bundleDiscount.services) this.proposal.bundleDiscount.services = [];

    if (givenToken) {
      tenantUser = await this.$store.dispatch("auth/checkToken", givenToken);
      this.loading = false;
      this.handleAction();
    } else {
      this.loading = false;
    }

  },
  methods: {
    ...mapMutations("comment", ["setGuestName"]),
    ...mapMutations("modal", ["setOpen", "setProposal", "setProposalRequest"]),
    async bookProposal() {
      await this.saveProposal(this.proposal);
      window.open(`/#/checkout/proposal/${this.proposal.id}/customer`, "_blank");
    },
    async handleAsk(ask) {
      console.log('handleAsk', ask);
      let expiredTime = moment().add(2, "days").unix() * 1000;
      if (ask === "expiredDate") {
        if (this.loggedInUser) {
          await this.saveNegotiation({ expiredTime, type: NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME });
        } else {
          localStorage.setItem(
            "nonMaryokuAction",
            JSON.stringify({
              action: "saveNegotiation",
              params: { expiredTime, type: NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME },
            }),
          );
          this.onlyAuth = true;
          this.showGuestSignupModal = true;
        }
      }

    },
    async saveNegotiation(params) {
      this.loading = true;
      if (!this.proposal.proposalRequestId) await this.saveProposalRequest();

      let query = new ProposalNegotiationRequest({
        proposalId: this.proposal.id,
        proposal: new Proposal({ id: this.proposal.id }),
        url: `${location.protocol}//${location.host}/#/unregistered/proposals/${this.proposal.id}`,
        ...params,
      });
      let res = await query.for(new Proposal({ id: this.proposal.id })).save();
      this.loading = false;
      this.proposal.negotiations.push(res);
    },
    async shareWithAuth(args) {
      if (this.loggedInUser) {
        await this.share(args);
      } else {
        localStorage.setItem(
          "nonMaryokuAction",
          JSON.stringify({
            action: "saveShare",
            ...args,
          }),
        );
        this.onlyAuth = true;
        this.showGuestSignupModal = true;
      }
    },
    async handleUpdate(proposal){
      this.proposal = {...this.proposal, ...proposal};
    },
    async handleFavorite(isFavorite){

      await this.saveProposal({...this.proposal, isFavorite, status: isFavorite ? PROPOSAL_STATUS.TOP3 : PROPOSAL_STATUS.PENDING});

    },
    async declineProposal() {
      if (this.proposal.score > 0) return;
      await this.saveProposal({...this.proposal, status: PROPOSAL_STATUS.LOST});

      let url = `${location.protocol}//${location.host}/#/signin`;
      let eventName = this.proposal.nonMaryoku ? this.proposal.eventData.customer.companyName :
              this.selectedProposalRequest.eventData.title ? this.selectedProposalRequest.eventData.title : 'New event';

      // send email to vendor to notify the customer decline the proposal.
      await this.$http.post(
          `${process.env.SERVER_URL}/1/proposals/${this.proposal.id}/sendEmail`,
          { type: "lost", proposalId: this.proposal.id, eventName, url },
          { headers: this.$auth.getAuthHeader() },
      );
      this.$store.commit('modal/setProposal', this.proposal)
      this.setOpen('DECLINE')
    },
    async saveProposal(proposal){
        this.loading = true;
        let query = new Proposal(proposal);
        let res = await query.save();
        this.proposal = res;
        this.loading = false;
    },
    downProposal() {
      this.openNewTab(`${process.env.SERVER_URL}/1/proposal/${this.proposal.id}/download`);
    },
    toggleCommentMode(mode) {
      this.showCommentEditorPanel = mode;
    },
    showModal(name){
        console.log('show.modal', name);
        this.setProposal(this.proposal)
        this.setProposalRequest(this.proposalre)
        this.setOpen(name)
    },
    openNewTab(link) {
      window.open(link, "_blank");
    },
    saveGuestComment(name) {
      this.showGuestSignupModal = false;
      this.setGuestName(name);
      let data = JSON.parse(localStorage.getItem("nonMaryokuAction"));

      if (data.action === "saveComment")
        this.saveComment({ index: data.index, comment: data.comment, component: data.component });
      if (data.action === "updateComment") this.updateComment({ comment: data.comment, component: data.component });
      if (data.action === "deleteComment") this.deleteComment({ index: data.index, comment: data.comment });
      if (data.action === "updateCommentComponent") this.saveComment({ component: data.component });
      this.showCommentEditorPanel = true;
    },
    async signIn({ email, password }) {
      await this.$store.dispatch("auth/login", {
        email,
        password,
      });
      this.showGuestSignupModal = false;
      this.handleAction();
    },
    async signUp({ email, password, name, company }) {
      await this.$store.dispatch("auth/register", {
        email,
        password,
        name,
        company,
        role: "administrator",
      });
      this.showGuestSignupModal = false;
      await this.$store.dispatch("auth/login", { email, password });
      this.handleAction();
    },
    auth(provider) {
      console.log("auth", provider);
      let tenantId = this.$authService.resolveTenantId();

      let callback = btoa(`${document.location.href}?token=`);
      document.location.href = `${process.env.SERVER_URL}/oauth/authenticate/${provider}?tenantId=${tenantId}&callback=${callback}`;
    },
    handleAction() {
      let data = JSON.parse(localStorage.getItem("nonMaryokuAction"));
      if (data) {
        if (data.action === "saveComment") this.saveComment(data);
        if (data.action === "updateComment") this.updateComment(data);
        if (data.action === "deleteComment") this.deleteComment(data);
        if (data.action === "updateCommentComponent") this.saveComment(data);
        if (data.action === "saveNegotiation") this.saveNegotiation(data.params);
        if (data.action === "saveShare") this.share(data);

        localStorage.removeItem("nonMaryokuAction");
      }
    },
    saveCommentWithAuth(params) {
      console.log("saveComment");
      if (this.loggedInUser || this.guestName) {
        this.saveComment(params);
      } else {
        localStorage.setItem(
          "nonMaryokuAction",
          JSON.stringify({
            action: "saveComment",
            ...params,
          }),
        );
        this.showCommentEditorPanel = false;
        this.showGuestSignupModal = true;
      }
    },
    updateCommentWithAuth(params) {
      console.log("updateCommentWithAuth", params);
      if (this.loggedInUser || this.guestName) {
        this.updateComment(params);
      } else {
        localStorage.setItem(
          "nonMaryokuAction",
          JSON.stringify({
            action: "updateComment",
            ...params,
          }),
        );
        this.showCommentEditorPanel = false;
        this.showGuestSignupModal = true;
      }
    },
    deleteCommentWithAuth(params) {
      console.log("deleteComment");
      if (this.loggedInUser || this.guestName) {
        this.deleteComment(params);
      } else {
        localStorage.setItem(
          "nonMaryokuAction",
          JSON.stringify({
            action: "deleteComment",
            ...params,
          }),
        );
        this.showCommentEditorPanel = false;
        this.showGuestSignupModal = true;
      }
    },
    updateCommentComponentWithAuth(component) {
      console.log("updateCommentComponent");
      if (this.loggedInUser || this.guestName) {
        this.updateCommentComponent(component);
      } else {
        localStorage.setItem(
          "nonMaryokuAction",
          JSON.stringify({
            action: "updateCommentComponent",
            component: component,
          }),
        );
        this.showCommentEditorPanel = false;
        this.showGuestSignupModal = true;
      }
    },
    async saveProposalRequest(){
      console.log('savePropsalRequest');
        let query = new ProposalRequest({
           vendorId: this.proposal.vendor.id,
           requestedTime: new Date().getTime(),
           expiredTime: moment(new Date()).add(3, "days").valueOf(),
        });
        let res = await query.for(new Vendor({ id: this.proposal.vendor.id })).save();
        console.log('res', res);

        await this.saveProposal({...this.proposal, proposalRequestId: res.id});
    },
    async sendNegotiationRequest(params) {
      this.showNegotiationRequestModal = false;

      if (!this.proposal.proposalRequestId) await this.saveProposalRequest();

      let expiredTime = moment().add(2, 'days').unix() * 1000;
      let query = new ProposalNegotiationRequest({
        proposalId: this.proposal.id,
        proposal: new Proposal({ id: this.proposal.id }),
        expiredTime,
        type: NEGOTIATION_REQUEST_TYPE.PRICE_NEGOTIATION,
        ...params,
      });
      let res = await query.for(new Proposal({ id: this.proposal.id })).save();
      this.proposal.negotiations.push(res);

      Swal.fire({
        title: "Negotiation Sent successfully",
        text: `Negotiation request has been successfully sent to the vendor and he will respond as soon as possible`,
        showCancelButton: false,
        confirmButtonClass: "md-button md-success btn-fill",
        cancelButtonClass: "md-button md-danger btn-fill",
        confirmButtonText: "Done",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
        }
      });
    },
    saveRemindingTime({remindingTime, option}) {

      const remindingData = {
        reminder: "email",
        phoneNumber: "",
        email: this.proposal.eventData.customer.email,
        name: this.proposal.eventData.customer.name,
        remindingTime: remindingTime,
        type: "proposal",
        emailParams: {
            expiredTime: moment(new Date(this.proposal.expiredDate)).valueOf(),
        },
        emailTransactionId: "",
        phoneTransactionId: "",
      };
      new Reminder(remindingData).save().then((res) => {
        Swal.fire({
          title: "Reminder set successfully",
          text: `You will receive the reminder in your email`,
          showCancelButton: false,
          confirmButtonClass: "md-button md-success btn-fill",
          cancelButtonClass: "md-button md-danger btn-fill",
          confirmButtonText: "Done",
          buttonsStyling: false,
        }).then((result) => {});
      });

      this.showRemindingTimeModal = false;
    },
    getUpdatedProposal(proposal, data) {
      Object.keys(data).map(key => {
        this.$set(proposal, key, data[key]);
      });
      return proposal
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.state.auth.user;
    },
    customer() {
      return this.$store.state.comment.customer;
    },
    guestName() {
      return this.$store.state.comment.guestName;
    },
    vendor(){
      return this.proposal.vendor
    },
      headerBackgroundImage() {
          if (this.proposal.coverImage && this.proposal.coverImage[0]) return this.proposal.coverImage[0];
          if (this.proposal.inspirationalPhotos && this.proposal.inspirationalPhotos[0])
              return this.proposal.inspirationalPhotos[0].url;
          if (this.proposal.vendor.images && this.proposal.vendor.images[0])
              return this.proposal.vendor.images[0];
          if (this.proposal.vendor.vendorImages && this.proposal.vendor.vendorImages[0])
              return this.proposal.vendor.vendorImages[0];

          return "";
      },
  },
};
</script>
<style lang="scss" scoped>
.non-maryoku-proposal {
  background-color: white;
  .proposal-header {
    position: relative;
    img {
      width: 30px;
    }
  }
  .proposal-container {
    max-width: 1280px;
    margin: auto;
  }
  .logo-area {
    color: #a0a0a0;
    background-color: #f5f5f5;
  }
  .proposal-footer {
    height: 80px;
    width: 100%;
    background: white;
  }
}
.condition-tooltip {
  background-color: #ffe5ec;
  padding: 18px 15px 18px 15px;
  color: #050505;
  font-size: 14px;

  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 4px;
    left: 70px;
    box-sizing: border-box;

    border: 12px solid black;
    border-color: transparent transparent #ffe5ec #ffe5ec;

    transform-origin: 0 0;
    transform: rotate(135deg);
  }
}
</style>
