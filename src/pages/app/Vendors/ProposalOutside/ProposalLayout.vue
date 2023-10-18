<template>
  <div class="for-proposals-layout-wrapper">
    <loader :active="isLoading" is_full_screen page="vendor" height="100%"></loader>

    <ProposalHeader v-if="vendor" :vendor="vendor"></ProposalHeader>
    <ProposalVersionsBar v-if="$route.params.id"></ProposalVersionsBar>
    <div class="main-cont">
      <router-view></router-view>
    </div>
    <section class="footer-wrapper">
      <div>
        <md-button v-if="step > 0" class="prev-cont md-simple maryoku-btn md-black" @click="back()">
          <img :src="`${proposalIconsUrl}Group 4770 (2).svg`" /> Back
        </md-button>

        <md-button @click="scrollToTop" class="md-button md-simple md-just-icon md-theme-default scroll-top-button">
          <img :src="`${$iconURL}common/arrow-right-purple.svg`" width="17" />
        </md-button>
      </div>
      <div class="next-cont">
        <a class="discard" @click="discard"> <img :src="`${$iconURL}common/trash-dark.svg`" /> Discard </a>
        <a class="save" @click="calculateStage(proposalStatus.DRAFT)">
          <img :src="`${$iconURL}common/save-purple.svg`" /> Save for later
        </a>
        <a class="next active" @click="gotoNext" :class="[{ active: selectedServices.length > 0 }]" v-if="step < 3">
          Next
        </a>
        <a class="next active" @click="calculateStage(proposalStatus.PENDING)" v-else :disabled="isUpdating">Submit Proposal</a>
      </div>
    </section>

    <modal v-if="openedModal === 'timeIsUp'" class="saved-it-modal" container-class="modal-container sl">
      <template slot="header">
        <div class="saved-it-modal__header">
          <h3><img :src="`${$iconURL}Submit%20Proposal/group-6223%20(non-optimized).png`" /> Time Is Up!</h3>
          <div class="header-description">
            The deadline for submitting this prposal has passed. But no worries! We will be with you soon with the next
            one.
          </div>
        </div>
        <button class="close" @click="hideModal()">
          <img :src="`${proposalIconsUrl}Group 3671 (2).svg`" />
        </button>
      </template>
      <template slot="body">
        <div class="saved-it-modal__body">
          <div class="time-cont">
            <vendor-bid-time-counter :days="0" :hours="0" :minutes="0" :seconds="0" class="bg-purple" />
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="saved-it-modal__footer">
          <md-button class="md-red maryoku-btn" @click="hideModal()">Ok, Thanks</md-button>
        </div>
      </template>
    </modal>
    <modal v-if="showCloseProposalModal" class="saved-it-modal" container-class="modal-container sl">
      <template slot="header">
        <div class="saved-it-modal__header d-flex">
          <img :src="`${$iconURL}NewSubmitPorposal/closeproposal.png`" />
          <div class="ml-20">
            <h3 class="text-left color-black">
              We are sorry, but someone else got there <br />before you and already won this bid.
            </h3>
            <div class="text-left">But no worries! We will be with you soon with the next one</div>
          </div>
        </div>
        <button class="close" @click="showCloseProposalModal = false">
          <img :src="`${$iconURL}NewSubmitPorposal/Group 3671 (2).svg`" />
        </button>
      </template>
      <template slot="body">
        <div class="saved-it-modal__body"></div>
      </template>
      <template slot="footer">
        <div class="saved-it-modal__footer">
          <md-button class="md-red maryoku-btn" @click="showCloseProposalModal = false">Ok, Thanks</md-button>
        </div>
      </template>
    </modal>
    <modal v-if="showMissingModal" container-class="modal-container w-max-800 no-header no-footer">
      <template slot="body">
          <MissingDetail
              :data="missingDetail"
              @send="setProposalLink"
              @close="showMissingModal = false"
          ></MissingDetail>
      </template>
    </modal>
    <SendProposalModal
      v-if="showSendProposalModal"
      @close="showSendProposalModal = false"
      @submit="submitProposal"
      :event="event"
      :link="proposalLink"
    ></SendProposalModal>
    <ProposalSubmitted
      v-if="showSubmittedProposalModal"
      @close="showSubmittedProposalModal = false"
    ></ProposalSubmitted>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import Vendor from "@/models/Vendors";
import Swal from "sweetalert2";
import S3Service from "@/services/s3.service";
import state from "./state";
import { PROPOSAL_STATUS } from "@/constants/status";
import { MISSING_DETAILS } from "@/constants/proposal";

const components = {
    Loader: () => import('@/components/loader/Loader.vue'),
    Modal: () => import('@/components/Modal.vue'),
    MissingDetail: () => import('./Modals/MissingDetail.vue'),
    ProposalVersionsBar: () => import('./ProposalVersionsBar.vue'),
    ProposalSubmitted: () => import('../Proposal/Modals/ProposalSubmitted.vue'),
    SendProposalModal: () => import('./Modals/SendProposal.vue'),
    ProposalHeader: () => import('./ProposalHeader.vue'),
    VendorBidTimeCounter: () => import('@/components/VendorBidTimeCounter/VendorBidTimeCounter.vue'),
}

export default {
  components,
  props: {
    newProposalRequest: Object,
  },
  data() {
    return {
      isLoading: true,
      fullDetailsModal: false,
      proposalIconsUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/NewSubmitPorposal/",
      landingIconsUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/NewLandingPage/",
      selectedServices: [],
      isTimeUp: false,
      proposalRequestRequirements: [],
      proposals: [],
      proposalRequest: null,
      openedModal: "",
      showCloseProposalModal: false,
      isUpdating: false,
      missingDetail: [],
      proposalStatus: PROPOSAL_STATUS,
      option: PROPOSAL_STATUS.PENDING, // 'submit', 'duplicate'
      showSendProposalModal: false,
      showSubmittedProposalModal: false,
      showMissingModal: false,
      proposalLink: "",
    };
  },
  async mounted() {
    console.log("non-maryoku.proposal.created");
    if (this.$store.state.auth.user) {
      await this.$store.dispatch("auth/checkToken", this.$store.state.auth.user.access_token);
    } else {
      this.$router.push({ path: `/vendor/signin` });
    }

    this.$root.$on("send-event-data", (evtData) => {
      this.evtData = evtData;
    });
    this.isLoading = true;
    if (this.$route.params.type && this.$route.params.type == "duplicate") {
      this.option = "duplicate";
    }

    this.fullDetailsModal = false;
    this.isTimeUp = false;

    await this.getVendor(this.$route.params.vendorId);
    if (this.$route.params.id) await this.getProposal(this.$route.params.id);
    if (!this.$store.state.vendorProposal.coverImage.length) {
      this.$store.commit("proposalForNonMaryoku/setValue", {
        key: "coverImage",
        value: this.vendor.images,
      });
    }
    if (this.$route.query.version) {
      let index = this.$store.state.proposalForNonMaryoku.versions.findIndex((v) => v.id === this.$route.query.version);
      this.$store.commit("proposalForNonMaryoku/selectVersion", index);
    }
    setTimeout((_) => {}, 10000);
    this.isLoading = false;
  },

  beforeCreate() {
    if (!this.$store.state.proposalForNonMaryoku) {
      this.$store.registerModule("proposalForNonMaryoku", state);
    } else {
      this.$store.commit("proposalForNonMaryoku/initState");
    }
  },
  methods: {
    ...mapActions("proposalForNonMaryoku", ["getVendor", "getProposal", "saveProposal", "saveVendor", "saveEvent"]),
    async gotoNext() {
      // create event only when the proposal is created
      if (this.step === 0 && !this.$route.params.id) {

        this.isLoading = true;
        await this.createEvent()
        this.step = this.step + 1;
        this.scrollToTop();

        this.isLoading = false;
      } else {
        this.step = this.step + 1;
      }
    },
    hideModal() {
      this.fullDetailsModal = false;
      this.showSubmittedProposalModal = false;
      this.openedModal = "";
    },

    getMissingDetail(field) {
        return MISSING_DETAILS.find(it => it.key === field)
    },

    async calculateStage(type) {
        this.missingDetail = [];
        const proposalForNonMaryoku = this.$store.state.proposalForNonMaryoku;

        let progress = 0;
        if (proposalForNonMaryoku.hasOwnProperty('eventVision') && proposalForNonMaryoku.eventVision) {
            progress += 10;
        } else {
            this.missingDetail.push(this.getMissingDetail('vision'))
        }
        if (proposalForNonMaryoku.costServices[this.vendor.vendorCategory] && proposalForNonMaryoku.costServices[this.vendor.vendorCategory].length) {
            progress += 30;
        } else {
            this.missingDetail.push(this.getMissingDetail('cost'))
        }

        if (proposalForNonMaryoku.includedServices[this.vendor.vendorCategory] && proposalForNonMaryoku.includedServices[this.vendor.vendorCategory].length) {
            progress += 20;
        } else {
            this.missingDetail.push(this.getMissingDetail('include'))
        }
        if (proposalForNonMaryoku.extraServices[this.vendor.vendorCategory] && proposalForNonMaryoku.extraServices[this.vendor.vendorCategory].length) {
            progress += 20;
        } else {
            this.missingDetail.push(this.getMissingDetail('extra'))
        }

        if (proposalForNonMaryoku.inspirationalPhotos.some(p => !!p)) {
            progress += 20;
        } else {
            this.missingDetail.push(this.getMissingDetail('image'))
        }

        // check missing when submit the proposal
        if (progress !== 100 && type === PROPOSAL_STATUS.PENDING) {
            this.showMissingModal = true;
            return;
        }

        // check missing when submit the proposal
        if (progress !== 100 && type === PROPOSAL_STATUS.PENDING) {
            this.showMissingModal = true;
            return;
        }

        if (type === PROPOSAL_STATUS.PENDING) {
            await this.setProposalLink();

        } else {
            await this.uploadProposal(type);

            await Swal.fire({
                title: `You saved the current proposal. You can edit anytime later!`,
                buttonsStyling: false,
                type: "success",
                confirmButtonClass: "md-button md-vendor",
            });
        }


    },

    async uploadCoverImage() {

        const proposalForNonMaryoku = this.$store.state.proposalForNonMaryoku;

        let coverImageUrl = "";

        if (proposalForNonMaryoku.coverImage && proposalForNonMaryoku.coverImage.indexOf("base64") >= 0) {
            const fileObject = S3Service.dataURLtoFile(
                proposalForNonMaryoku.coverImage,
                `${this.event.id}-${proposalForNonMaryoku.vendor.id}`,
            );
            const extenstion = fileObject.type.split("/")[1];
            await S3Service.fileUpload(
                fileObject,
                `${this.event.id}-${proposalForNonMaryoku.vendor.id}`,
                "proposals/cover-images",
            );
            coverImageUrl = `https://maryoku.s3.amazonaws.com/campaigns/cover-images/${this.event.id}-${proposalForNonMaryoku.vendor.id}.${extenstion}`;
        }
    },

    async uploadProposal(type) {
        this.$root.$emit("clear-slide-pos");
        this.scrollToTop();

        await this.uploadCoverImage();

        this.isUpdating = true;
        this.isLoading = true;
        await this.saveVendor(this.vendor);
        const proposal = await this.saveProposal(type);

        this.proposalLink = `${location.protocol}//${location.host}/#/unregistered/proposals/${proposal.id}`;

        this.isUpdating = false;
        this.isLoading = false;
    },

    async createEvent() {
      const userEvent = {
        company: this.event.company,
        date: new Date(this.event.startTime * 1000).toISOString(),
        startTime: new Date(this.event.startTime * 1000).toISOString(),
        endTime: new Date(this.event.endTime * 1000).toISOString(),
        eventType: { id: this.event.eventType.id },
        companyName: this.event.customer.companyName,
        location: this.event.location,
        guests: this.event.numberOfParticipants,
        vendor: new Vendor({ id: this.vendor.id }),
        customer: { id: this.event.customer.id },
      };
      if (this.event.customer) {
        userEvent.customer = { id: this.event.customer.id };
        userEvent.isRegisteredCustomer = true;
      } else {
        userEvent.isRegisteredCustomer = false;
      }
      if (this.event.id) {
        userEvent.id = this.event.id;
      }
      await this.saveEvent(userEvent);
    },
    back() {
      this.step = this.step - 1;
      this.scrollToTop();
    },
    scrollToTop() {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    },
    goToProcessingGuid() {
      this.$router.push({ path: `/completed-bidding` });
    },
    goToVendorProfile() {
      this.$router.push({ path: `/vendor/signin` });
    },
    discard() {
      Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        showCancelButton: true,
        confirmButtonClass: "md-button md-success md-vendor btn-fill",
        cancelButtonClass: "md-button maryoku-btn md-danger btn-fill",
        confirmButtonText: "Yes, discard it!",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.$store.commit("proposalForNonMaryoku/initState");
          this.$router.push(`/vendor/dashboard`);
        }
      });
    },

    async setProposalLink() {

      this.showMissingModal = false;
      await this.uploadProposal(PROPOSAL_STATUS.PENDING)

      this.showSendProposalModal = true;
    },
    async submitProposal() {
      this.showSendProposalModal = false;

      // send email to customer to notify the proposal is created
      let proposal = this.$store.state.proposalForNonMaryoku;
      await this.$http.post(
        `${process.env.SERVER_URL}/1/proposals/${proposal.id}/sendEmail`,
        { type: "created", proposalId: proposal.id },
        { headers: this.$auth.getAuthHeader() },
      );

      // send SMS to customer phone to notify
      this.proposalLink = `${location.protocol}//${location.host}/#/unregistered/proposals/${proposal.id}`;
      let message = `Here is a new proposal for you from ${proposal.vendor.companyName} : ${this.proposalLink}`;
      if (proposal.eventData.customer.phone) {
        let res = await this.$http.post(
          `${process.env.SERVER_URL}/1/proposals/${proposal.id}/sendSMS`,
          { phoneNumber: proposal.eventData.customer.phone, message },
          { headers: this.$auth.getAuthHeader() },
        );
      }

      this.showSubmittedProposalModal = true;
    },
  },

  filters: {
    withComma(amount) {
      return amount ? amount.toLocaleString() : 0;
    },
  },
  computed: {
    getHeaderImage() {
      if (this.event && this.event.concept) {
        return this.event.concept.images[new Date().getTime() % 4].url;
      }
      return "";
    },
    vendor() {
      return this.$store.state.proposalForNonMaryoku.vendor;
    },
    event() {
      return this.$store.state.proposalForNonMaryoku.eventData;
    },

    step: {
      get: function () {
        return this.$store.state.proposalForNonMaryoku.wizardStep;
      },
      set: function (newValue) {
        this.$store.commit("proposalForNonMaryoku/setWizardStep", newValue);
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.for-proposals-layout-wrapper {
  font-family: "Manrope-Regular", sans-serif;
  overflow: hidden;
  background: #f5f5f5;

  .main-cont {
    // margin-top: 263px;
    margin-bottom: 90px;
    width: 100%;

    .back-to-top {
      margin: 0 auto;
      margin-top: 36px;
      text-align: center;

      span {
        display: inline-block;
        color: #818080;
        font-size: 20px;
        font-weight: 800;
        margin-bottom: 22px;
      }
      .row {
        display: inline-block;
        cursor: pointer;
        font-size: 20px;
        font-weight: 800;
        color: #641856;
        i {
          color: #641856;
        }
      }
    }
  }
  section.footer-wrapper {
    padding: 33px 63px 34px 64px;
    background-color: #ffffff;
    border-radius: 3px;
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    width: 100%;
    z-index: 8;
    overflow: hidden;
    position: fixed;
    bottom: 0;
    .prev-cont {
      font-size: 16px;
      font-weight: 800;
      cursor: pointer;
      img {
        width: 20px;
        transform: rotate(180deg);
      }
    }
    .next-cont {
      span {
        font-size: 14px;
        font-weight: normal;
        margin-right: 41px;
      }
      a {
        padding: 18px 49px;
        cursor: pointer;
        border-radius: 3px;
        font-size: 20px;
        font-weight: 800;
        display: inline-block;
        min-width: 250px;
        text-align: center;
        &.discard {
          color: #050505;
          margin-right: 41px;
          min-width: 100px;
          padding: 18px 0px;
          img {
            width: 25px;
            margin-right: 12px;
          }
        }
        &.save {
          border: 1px solid #641856;
          color: #641856;
          margin-right: 41px;
          img {
            width: 25px;
            margin-right: 12px;
          }
        }
        &.next {
          background: #d5d5d5;
          color: #ffffff;

          &:hover {
            color: #ffffff !important;
          }
        }
      }
    }
  }

  .saved-it-modal {
    /deep/ .modal-header {
      background-color: #f3f7fd;
    }
    &__header {
      width: 100%;
      padding: 1rem;
      text-align: center;
      h3 {
        font-size: 30px;
        font-weight: bold;
        color: #641856;

        img {
          width: 55px;
          height: 55px;
          margin-right: 15px;
        }
      }
      .header-description {
        max-width: 550px;
        margin: 0 auto;
        text-align: left;
        font-size: 20px;
        color: #050505;

        &.text-center {
          text-align: center;
        }
      }
      & + .close {
        background: transparent;
        border: none;
        position: absolute;
        top: 61px;
        right: 60px;
        color: #050505;
        cursor: pointer;
        img {
          width: 20px;
        }
      }
    }
    &__body {
      .time-cont {
        max-width: 320px;
        margin: 0 auto;
      }
      .maryoku-btn {
        width: 40%;
      }
    }
    &__footer {
      padding: 1rem;
      margin-top: -2rem;
    }
  }

  .active {
    background-color: #641856 !important;

    i {
      color: #ffffff !important;
    }
  }
  .cool {
    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
    background-color: #641856;
    border-radius: 3px;
    padding: 8px 36px;
    cursor: pointer;
    border: none;
  }
  .hide-full {
    font-size: 16px;
    font-weight: 800;
    color: #641856;
    cursor: pointer;

    i {
      color: #641856;
    }
  }
  .scroll-top-button {
    img {
      height: 20px;
      transform: rotate(-90deg);
    }
  }
}
</style>
