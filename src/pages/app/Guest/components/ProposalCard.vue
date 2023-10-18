<template>
  <div class="booking-item" style="position: relative">
    <template v-if="remainingTime < 0">
          <div class="d-flex flex-column justify-content-start align-center"
               style="position: absolute;left: 0;right:0;top:0;bottom:0;width:100%;height: 100%;background:rgba(0,0,0,.7);z-index: 1">
              <timer-panel
                  class="time-counter mt-100"
                  :target="targetTime"
                  section="card"
                  @updateExpireDate="updateExpireDate"

              ></timer-panel>
              <md-button
                  class="maryoku-btn md-simple md-outlined md-red mt-30"
                  style="background: white!important;width: 300px;max-width: 90%"
                  @click="updateExpireDate"
              >
                  Ask vendor for more time</md-button>
              <p class="color-white mt-20">Show me an alternative offer</p>
          </div>
    </template>
    <div
      class="event-image p-relative"
      :style="`background: url(${backgroundImage}) center center no-repeat`"
      :class="{ isCollapsed, isSelected }"
    >
      <div class="bundle-offer" v-if="proposal.additionalServices.length">
        <img :src="`${$iconURL}common/bell-white.svg`" />
        Bundle Offer
        <md-tooltip md-direction="top" class="p-30 color-black">
          <div class="font-size-20 font-bold mb-10">{{ getBundleToolTipText(Object.keys(proposal.pricesByCategory)) }}</div>
          <div class="font-size-16" v-if="proposal.bundleDiscount && proposal.bundleDiscount.isApplied">
              {{ proposal.bundleDiscount.percentage }}% Off for the whole package</div>
        </md-tooltip>
      </div>
      <div v-if="isCollapsed" class="proposal-summary" @click="proposalDetails">
        <div class="proposal-summary-content">
          <span class="font-size-30 font-bold-extra">${{ proposal.cost | withComma }}</span>
          <h4 class="font-size-30 mt-20" :class="{ 'font-bold-extra': isSelected }">
            {{ proposal.vendor.companyName }}
          </h4>
        </div>
      </div>
    </div>
    <transition name="slide">
      <div v-if="!isCollapsed">
        <div class="card-content">
          <div class="mt-20 d-flex" v-show="proposal.suggestionDate">
            <img :src="`${$iconURL}Event Page/warning-circle-gray.svg`" class="label-icon mr-5" />
            <span v-if="getDiffDaysFromOriginal() < 0" class="whitspace-nowrap">
              This proposal is {{ -getDiffDaysFromOriginal() }}days before your original date
            </span>
            <span v-else class="whitspace-nowrap">
              This proposal is {{ getDiffDaysFromOriginal() }}days later your original date
            </span>
          </div>
          <div class="price">
            <span class="price-value">${{ proposal.cost | withComma }}</span>
            <small>{{ period }}</small>
          </div>
          <div
            class="font-size-14 color-dark-gray mb-10"
            :class="{ invisible: component.allocatedBudget >= proposal.cost }"
          >
            <img :src="`${$iconURL}Event Page/warning-circle-gray.svg`" class="label-icon" />
            ${{ (proposal.cost - component.allocatedBudget) | withComma }}
            more than budget
          </div>
          <template v-if="proposal.vendor">
            <h4 class="event-title">{{ proposal.vendor.companyName }}</h4>
            <ul class="event-info">
              <li class="event-info__item">{{ proposal.vendor.vendorAddresses[0] }}</li>
              <li class="event-info__item">{{ proposal.vendor.vendorCity }}</li>
            </ul>
            <div class="probability">Complies with requirements {{ probability }}%</div>
          </template>
          <!-- <p class="event-desc">{{ proposal.vendor.about ? proposal.vendor.about.company : "" }}</p> -->
          <div class="item-actions text-right mt-30">
            <md-button class="md-red maryoku-btn" @click="proposalDetails">Details & Booking </md-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import moment from "moment";
import Timer from "@/components/Timer.vue";
import ProposalNegotiationRequest from "@/models/ProposalNegotiationRequest"
import Proposal from "@/models/Proposal"
import TimerPanel from "./TimerPanel";
import Swal from "sweetalert2";
import {NEGOTIATION_REQUEST_STATUS, NEGOTIATION_REQUEST_TYPE} from "@/constants/status";

export default {
  components: { Timer, TimerPanel },
  props: {
    proposal: {
      type: Object,
      default: () => {},
    },
    probability: {
      type: Number,
      default: 0,
    },
    component: {
      type: String,
      default: () => {},
    },
    isCollapsed: {
      type: Boolean,
      default: false,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getCategory(key) {
      return this.categories.find((item) => item.key === key);
    },
    getBundleToolTipText(bundleServices) {
      const serviceNames = bundleServices.map((service) => {
        return this.getCategory(service).title;
      });
      return serviceNames.join(" + ");
    },
    proposalDetails() {
      this.$emit("goDetail", this.proposal);
    },
    getDiffDaysFromOriginal() {
      const suggestionDate = this.proposal.suggestionDate;
      if (!this.eventData) return "-";

      let orignStartDate = moment(new Date(this.eventData.eventStartMillis));
      if (suggestionDate && suggestionDate.length > 0) {
        let suggestedDate = moment(suggestionDate[0].date, "DD/MM/YYYY");
        return suggestedDate.diff(orignStartDate, "days");
      }
      return 0;
    },
    updateExpireDate(){
        let expiredTime = 0;
        if (this.proposal.expiredDate) {
            expiredTime = new Date(this.proposal.expiredDate).getTime() + 2 * 3600 * 24 * 1000;
        } else {
            expiredTime = new Date(this.proposal.dateCreated).getTime() + 9 * 3600 * 24 * 1000;
        }

        new ProposalNegotiationRequest({
            eventId: this.eventData.id,
            proposalId: this.proposal.id,
            proposal: new Proposal({ id: this.proposal.id }),
            proposalRequestId: this.proposal.proposalRequestId,
            expiredTime,
            type: NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME
        })
            .for(new Proposal({ id: this.proposal.id }))
            .save()
            .then((res) => {
                Swal.fire({
                    title: "We received your request!",
                    text: `Vendor will contact you!`,
                    showCancelButton: false,
                    confirmButtonClass: "md-button md-success btn-fill",
                    cancelButtonClass: "md-button md-danger btn-fill",
                    confirmButtonText: "OK",
                    buttonsStyling: false,
                }).then((result) => {});
            });

    }
  },
  computed: {
    backgroundImage() {
        if (this.proposal.coverImage && this.proposal.coverImage[0])
            return this.proposal.coverImage[0];
        if (this.proposal.inspirationalPhotos && this.proposal.inspirationalPhotos[0])
            return this.proposal.inspirationalPhotos[0].url;
        if (this.proposal.vendor.images && this.proposal.vendor.images[0])
            return this.proposal.vendor.images[0];
        if (this.proposal.vendor.vendorImages && this.proposal.vendor.vendorImages[0])
            return this.proposal.vendor.vendorImages[0];

        return "";
    },
    categories() {
      return this.$store.state.common.serviceCategories;
    },
    eventData() {
      return this.$store.state.EventGuestVuex.eventData;
    },
    period() {
      try {
        const requirement = this.$store.state.EventGuestVuex.requirements[this.proposal.vendor.vendorCategories[0]];
        const period = requirement.period;
        if (requirement.isEntireEvent) {
          return "For Whole Event";
        }
        if (!period) return "";

        var startTime = moment(parseInt(period.startTime));
        var endTime = moment(parseInt(period.endTime));

        // calculate total duration
        var duration = moment.duration(endTime.diff(startTime));

        // duration in hours
        var hours = parseInt(duration.asHours());

        // duration in minutes
        var minutes = parseInt(duration.asMinutes()) % 60;
        if (minutes) {
          return `For ${hours} hours and ${minutes} minutes.`;
        }
        return `For ${hours} hours`;
      } catch (e) {
        console.error(e);
        return "";
      }
    },
    targetTime() {
      if (this.proposal.expiredDate) {
          return new Date(this.proposal.expiredDate);
      }
      return new Date(this.proposal.dateCreated);
    },
    remainingTime(){
      let today = new Date()
      let expiredDate = new Date(this.proposal.expiredDate ? this.proposal.expiredDate : this.proposal.dateCreated);
      return expiredDate - today
    },
    negotiationProcessed(){
      // return !!this.vendorProposal.negotiations.length && this.vendorProposal.negotiations.every(it =>
      //     it.status === NEGOTIATION_REQUEST_STATUS.PROCESSED && it.type === NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME)
      return false
    },
    negotiationPending(){
      console.log('negotiationPending', this.proposal.id);
      return !!this.proposal.negotiations.length && this.proposal.negotiations.some(it =>
          it.status === NEGOTIATION_REQUEST_STATUS.NONE && it.type === NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME)
    },
  },
};
</script>
<style lang="scss" scoped>
.booking-item {
  border-radius: 3px;
  box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
  transition: ease-out all 0.5s;
  .event-image {
    background-size: cover !important;
    height: 250px;
    position: relative;
    transition: ease-out all 0.5s;
    &.isCollapsed {
      height: 160px;
      color: white;
      .proposal-summary {
        color: white;
        position: relative;
        z-index: 1;
        height: 100%;
        cursor: pointer;
        &::before {
          content: "";
          background-color: rgba(0, 0, 0, 0.5);
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
        }
        .proposal-summary-content {
          padding: 30px;
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
        }
      }
    }
    &.isSelected {
      border-bottom: solid 3px #f51355;
    }
    .bundle-offer {
      width: 40%;
      background-color: #ffc001;
      color: white;
      font-weight: bold;
      padding: 5px;
      text-align: center;
      position: absolute;
      left: 0;
      bottom: 0;
      cursor: pointer;
      img {
        width: 16px;
        margin-right: 5px;
      }
    }
    .event-labels {
      padding: 0;
      margin: 0;
      list-style: none;
      position: absolute;
      left: 0;
      bottom: 0;

      .label-item {
        background: #fff;
        padding: 6px 17px;
        font-size: 12px;
        font-weight: bold;
        color: #050505;
        width: auto;
        float: left;
        clear: both;

        &.rose-label {
          color: #f51355;
        }

        &.special-offer {
          background: #ffc001;
          color: #fff;
        }
      }
    }
  }
  .card-content {
    padding: 1.5em;
    box-sizing: border-box;
  }

  .price {
    margin: 2em 0 0.8em;

    small {
      font-size: 14px;
      color: #050505;
    }
  }
  .price-value {
    font-size: 30px;
    font-weight: bold;
    color: #050505;
    margin-right: 0.2em;
  }

  .event-title {
    font-size: 20px;
    font-weight: 800;
    color: #050505;
    margin: 0;
    height: 52px;
  }

  .probability {
    font-size: 16px;
    font-weight: 800;
    color: #0fac4c;
    margin: 0.5em 0 1em;
  }

  .event-info {
    list-style: none;
    padding: 0;
    margin: 0;

    &__item {
      font-size: 14px;
      color: #818080;
    }
  }
  .event-desc {
    font-size: 14px;
    color: #050505;
    height: 100px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .details-btn {
    .md-ripple {
      // background-color: #f51355;
      text-transform: capitalize;
      font-weight: bold;
      letter-spacing: 1px;
    }
  }
  .slide-enter-active {
    -moz-transition-duration: 0.8s;
    -webkit-transition-duration: 0.8s;
    -o-transition-duration: 0.8s;
    transition-duration: 0.8s;
    -moz-transition-timing-function: ease-in;
    -webkit-transition-timing-function: ease-in;
    -o-transition-timing-function: ease-in;
    transition-timing-function: ease-in;
    box-sizing: border-box;
  }

  .slide-leave-active {
    -moz-transition-duration: 0.8s;
    -webkit-transition-duration: 0.8s;
    -o-transition-duration: 0.8s;
    transition-duration: 0.8s;
    -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
    -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
    -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
    transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
    box-sizing: border-box;
  }

  .slide-enter-to,
  .slide-leave {
    max-height: 100px;
    overflow: hidden;
    box-sizing: border-box;
  }

  .slide-enter,
  .slide-leave-to {
    box-sizing: border-box;
    overflow: hidden;
    max-height: 0;
  }
}
</style>
