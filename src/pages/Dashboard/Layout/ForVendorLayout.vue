<template>
  <div class="for-vendors-layout-wrapper">
    <Loader :active="isLoading" :isFullScreen="true" page="vendor" />

    <div v-if="!isLoading">
      <section class="header-wrapper">
        <div class="vendors-header">
          <ul>
            <li class="logo">
              <a href="https://www.maryoku.com">
                <img src="https://www.maryoku.com/img/maryoku-logo.png" />
              </a>
            </li>
            <li>
              <a href="https://www.maryoku.com">ABOUT US</a>
            </li>
          </ul>
        </div>
        <p>
          <a href="https://www.maryoku.com/for-vendors" target="_blank">Get you the best jobs</a>
        </p>
        <div class="pull-top-right">
          <vendor-bid-time-counter
                  :key="getRemainingTime.seconds"
                  :days="getRemainingTime.days"
                  :hours="getRemainingTime.hours"
                  :minutes="getRemainingTime.mins"
                  :seconds="getRemainingTime.seconds"
                  class="bg-yellow"
                  :bottom-content="'To send your bid'"
          />
        </div>
      </section>
      <div class="banner" :style="`background-image: url('${backgroundImage}');`">
        <div class="banner-content">
          <h3>Congratulations!</h3>
          <h3>{{ vendor.companyName }}</h3>
          <p>
            We found you could fit perfectly for our event with your
            <strong v-if="vendor">{{ vendor.eventCategory.fullTitle }}</strong> services.
          </p>
          <button type="submit" class="submit" @click="goToForm()">Submit Now</button>
        </div>
      </div>
      <router-view></router-view>
      <section class="footer-wrapper">
        <div class="vendors-footer">
          <ul>
            <li class="logo">
              <a href="https://www.maryoku.com">
                <img src="https://www.maryoku.com/img/maryoku-logo.png" />
              </a>
            </li>
            <li>
              <p>Who are we and why are we great?</p>
            </li>
            <li>
              <a href="https://www.maryoku.com" target="_blank">
                <img :src="`${iconsUrl}Asset 273.svg`" />
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>

    <signup-request-modal :vendor="vendor" v-if="showSignup"></signup-request-modal>
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
          <md-button class="md-vendor maryoku-btn" @click="showCloseProposalModal = false">Ok, Thanks</md-button>
        </div>
      </template>
    </modal>
    <modal v-if="openedModal == 'timeIsUp'" class="saved-it-modal" container-class="modal-container sl">
      <template slot="header">
        <div class="saved-it-modal__header">
            <h3><img :src="`${$iconURL}Submit%20Proposal/group-6223%20(non-optimized).png`" /> Time Is Up!</h3>
          <div class="header-description">
            The deadline for submitting this prposal has passed. But no worries! We will be with you soon with the next
            one.
          </div>
        </div>
        <button class="close" @click="hideModal()">
          <img :src="`${$iconURL}NewSubmitPorposal/Group 3671 (2).svg`" />
        </button>
      </template>
      <template slot="body">
        <div class="saved-it-modal__body">
          <div class="time-cont">
            <vendor-bid-time-counter class="bg-purple p-10" :days="0" :hours="0" :minutes="0" :seconds="0" />
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="saved-it-modal__footer">
          <md-button class="md-vendor maryoku-btn" @click="hideModal()">Ok, Thanks</md-button>
        </div>
      </template>
    </modal>
  </div>
</template>
<script>
import { mapActions } from "vuex";

import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import MobileMenu from "./Extra/MobileMenu.vue";
import UserMenu from "./Extra/UserMenu.vue";
import ForVendors from "@/pages/app/Vendors/ForVendors.vue";
import VendorBidTimeCounter from "@/components/VendorBidTimeCounter/VendorBidTimeCounter";
import SignupRequestModal from "@/components/Modals/VendorProposal/SignupRequestModal.vue";
import { Modal, Loader } from "@/components";

export default {
  components: {
    TopNavbar,
    ContentFooter,
    MobileMenu,
    VendorBidTimeCounter,
    UserMenu,
    SignupRequestModal,
    Modal,
    Loader,
  },
  data() {
    return {
      iconsUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/Vendor%20Landing%20Page/",
      vendor: {
        eventCategory: {},
      },
      isLoading: true,
      event: null,
      proposalRequest: null,
      showSignup: false,
      isTimeUp: false,
      openedModal: "",
      showCloseProposalModal: false,
    };
  },
  async mounted() {

    this.vendor = await this.getVendor(this.$route.params.vendorId)

    if (this.vendor.isEditing) {
      this.showSignup = true;
    }
    this.proposalRequest = await this.getProposalRequest(this.$route.params.rfpId)

    this.event = this.proposalRequest.eventData;
    if (this.proposalRequest.componentInstance && this.proposalRequest.componentInstance.proposalAccepted) {
      this.showCloseProposalModal = true;
    }
    this.isLoading = false;
  },
  methods: {
    ...mapActions("vendorProposal", ["getVendor", "getProposalRequest"]),
    goToForm() {
      this.$root.$emit("go-to-proposal-form");
    },
    hideModal() {
      this.openedModal = "";
    },
  },

  computed: {
    backgroundImage() {
      const defaultImage = "https://maryoku.s3.amazonaws.com/proposal/background-default.jpg";
      try {
        if (this.event && this.event.concept) {
          return this.event.concept.images[new Date().getTime() % this.event.concept.images.length].url || defaultImage;
        }
      } catch (e) {}
      return defaultImage;
    },
    getRemainingTime() {
      if (!this.proposalRequest || !this.proposalRequest.expiredTime) {
        return { days: 0, hours: 0, mins: 0, seconds: 0 };
      }
      console.log(this.proposalRequest.expiredTime);
      console.log(new Date().getTime());
      let remainingMs = this.proposalRequest.expiredTime - new Date().getTime();
      if (remainingMs < 0) {
        this.isTimeUp = true;
        this.openedModal = "timeIsUp";
        return { days: 0, hours: 0, mins: 0, seconds: 0 };
      }
      const days = Math.floor(remainingMs / 24 / 3600 / 1000);
      remainingMs = remainingMs - days * 24 * 3600 * 1000;
      const hours = Math.floor(remainingMs / 3600 / 1000);
      remainingMs = remainingMs - hours * 3600 * 1000;
      const mins = Math.floor(remainingMs / 60 / 1000);
      remainingMs = remainingMs - mins * 60 * 1000;
      const seconds = Math.floor(remainingMs / 1000);
      return { days, hours, mins, seconds };
    },
  },
};
</script>
<style lang="scss" scoped>
.for-vendors-layout-wrapper {
  margin-top: -20px;
  font-family: "Manrope-Regular", sans-serif;
  background-color: #f5f5f5;
  overflow: hidden;

  section.header-wrapper {
    color: #ffffff;
    position: absolute;
    padding: 54.5px 64px;
    width: 100%;
    z-index: 1;
    ul {
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0;

      li {
        font-size: 22px;
        font-weight: 800;
        padding-left: 2rem;

        &.logo {
          padding-left: 0;
          padding-right: 2rem;
          border-right: 3px solid #ffffff;
        }
        a {
          color: #ffffff;
          &:hover {
            color: #707070;
          }
        }
      }
    }
    p {
      font-size: 20px;
      a {
        color: #ffffff;
        &:hover {
          color: #707070;
        }
      }
    }
    .pull-top-right {
      position: absolute;
      right: 117.6px;
      top: 1em;
    }
  }
  section.footer-wrapper {
    z-index: 9999;
    position: absolute;
    width: 100%;
    overflow: hidden;
    background-color: #404040;
    min-height: 110px;

    .vendors-footer {
      ul {
        list-style: none;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        padding: 0;
        margin: 0;
        top: 30px;
        left: 2.5rem;

        li {
          padding-right: 20px;
          p {
            font-size: 16px;
            color: #ffffff;
          }
          span.lt {
            padding: 8px 12px;
            color: #641856;
            width: 37px;
            height: 37px;
            font-weight: 900;
            background-color: #ffffff;
            border-radius: 50%;
          }
          &:last-child {
            img {
              width: 37px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  .banner {
    background-image: url("https://static-maryoku.s3.amazonaws.com/storage/img/lock.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    text-align: center;
    min-height: 600px;
    color: #ffffff;
    position: relative;
    &-content {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background-color: black;
      opacity: 0.2;
    }
    h3 {
      font-family: "Manrope-Regular", sans-serif;
      font-size: 60px;
      font-weight: bold;
    }
    p {
      font-family: "Manrope-Regular", sans-serif;
      font-size: 22px;
      font-weight: 500;
      line-height: 1.95;
      max-width: 566px;
      margin: 0 auto;

      strong {
        text-transform: capitalize;
        font-size: 26px;
        font-weight: 800;
      }
    }
    .submit {
      font-family: "Manrope-Regular", sans-serif;
      margin-top: 1rem;
      background-color: #641856;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
      border: none;
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
      min-width: 382px;
      padding: 20px 0;
      cursor: pointer;
      border-radius: 3px;
    }
  }
  .saved-it-modal {
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
    }
    &__footer {
      padding: 1rem;
      margin-top: -2rem;
    }
  }
}
</style>
