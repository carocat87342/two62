<template>
  <div class="proposal-request-card white-card p-20" :class="hasNegotiation ? 'negotiation' : ''">
    <div class="d-flex align-center">
      <div class="font-bold py-10" :class="getFontSize('title')" style="min-height: 44px">
        <template v-if="proposalRequest.eventData.concept">{{ proposalRequest.eventData.concept.name }}</template>
        <template v-else-if="proposalRequest.eventData.title">{{ proposalRequest.eventData.title }}</template>
        <template v-else>New Event</template>
      </div>
      <md-button class="md-icon-button md-simple" @click="expanded = !expanded">
        <md-icon class="color-black ml-5">keyboard_arrow_right</md-icon></md-button
      >
      <span class="d-flex align-center ml-auto whitspace-nowrap font-bold-extra" :class="hasNegotiation ? 'color-vendor' : 'color-yellow-dark'" >
        <img :src="`${iconUrl}VendorsProposalPage/Group 6370.svg`" class="mr-10" style="width: 20px" />
        <span :class="getFontSize('expiredDate')">{{`${getLeftDays()} Days Left`}}</span>
      </span>
    </div>
    <div class="d-flex align-center justify-content-start" :class="getFontSize('title')">
      <div class="pr-10 mr-10 font-bold" style="border-right: 1px solid rgba(0, 0, 0, 0.2)">
        {{ $dateUtil.formatScheduleDay(proposalRequest.eventData.eventStartMillis, "MM/DD/YY") }}
      </div>
      $ {{ (proposalRequest.proposal ? proposalRequest.proposal.cost : proposalRequest.componentInstance ? proposalRequest.componentInstance.allocatedBudget : 0) | withComma }}
    </div>
    <div v-if="expanded" :class="getFontSize('subTitle')">
      <div class="d-flex align-center mt-1">
        <div class="width-50 d-flex align-center">
          <img class="mr-10" :src="`${iconUrl}Onboarding/Group%204458.svg`" style="width: 18px" />
          {{ proposalRequest.eventData.dateCreated | date("MM/DD/YY") }}
        </div>
        <div class="width-50 d-flex align-center">
          <img class="mr-10" :src="`${iconUrl}VendorsProposalPage/group-4341.svg`" style="width: 18px" />
          {{ proposalRequest.eventData.location }}
        </div>
      </div>
      <div class="d-flex align-center mt-1 mb-1">
        <div class="width-50 d-flex align-center">
          <img class="mr-10" :src="`${iconUrl}VendorsProposalPage/group-4392.svg`" style="width: 18px" /> 11:00 AM ~
          4:00PM
        </div>
        <div class="width-50 d-flex align-center">
          <img class="mr-10" :src="`${iconUrl}VendorsProposalPage/group-3485.svg`" style="width: 18px" />
          {{ proposalRequest.eventData.numberOfParticipants | withComma(Number) }}
        </div>
      </div>
    </div>
    <div class="d-flex align-end">
      <md-button
        v-if="type == 'proposal' && !hasNegotiation"
        class="md-simple md-vendor md-vendor-text"
        style="margin-left: -15px; width: 20px; height: 30px"
        @click="dismiss(proposalRequest.id)"
      >
        Dismiss
      </md-button>
      <div :class="type == 'proposal' ? 'ml-auto d-flex flex-column align-center' : 'd-flex align-center width-100'">
        <div v-if="proposalRequest.proposal">
        <div v-if="proposalRequest.proposal.status === proposalStatus.DRAFT">
            <span class="font-bold color-vendor">{{ proposalRequest.proposal.progress }} %</span> completed
            <md-progress-bar class="md-thin md-vendor" md-mode="determinate" :md-value="proposalRequest.proposal.progress"></md-progress-bar>
          </div>
          <div
            v-else-if="hasNegotiation"
            class="d-flex align-center justify-content-center font-size-12 color-red"
          >
            <img :src="`${iconUrl}VendorsProposalPage/Group%2014277_2.svg`" class="mr-5" style="width: 15px" />
            {{proposalRequest.proposal.negotiations[0].type === requestType.ADD_MORE_TIME ? 'Additional time request' : 'Negotiation Request'}}
          </div>
        </div>
        <div v-else class="new color-vendor font-size-14" :class="type === 'proposal' ? 'ml-auto': 'medium'">New</div>
        <md-button class="md-vendor" :class="type === 'proposal' ? 'h-30' : 'ml-auto h-40'" @click="gotoProposalRequest">
          {{ actionName }}
        </md-button>
      </div>
    </div>
  </div>
</template>
<script>

import {PROPOSAL_STATUS} from "@/constants/status";

const components = {
    TimelineEmpty: () => import("@/pages/app/Events/components/TimelineEmpty.vue")
}
export default {
  components,
  props: {
    proposalRequest: {
      type: Object,
      default: () => {},
    },
    size: {
      type: Number,
      default: 1,
    },
    type: {
      type: String,
      default: "proposal",
    },
    hasNegotiation:{
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      iconUrl: `${this.$iconURL}`,
      expanded: false,
      proposalStatus: PROPOSAL_STATUS,
      requestType: {
          ADD_MORE_TIME: 0,
          NEGOTIATION: 1,
      }
    };
  },
  computed: {
    actionName() {
      if (!this.proposalRequest.proposal) return "Apply";
      if (this.proposalRequest.proposal.status === PROPOSAL_STATUS.DRAFT) {
        return "Complete";
      } else if (this.hasNegotiation) {
        return "Respond";
      } else {
        return "Make Changes"
      }
    },
  },
  methods: {
    gotoProposalRequest() {
      const tenantId = this.$authService.resolveTenantId();
      this.$emit('handle');
    },
    getLeftDays() {
      let expiredTime = !this.hasNegotiation ? this.proposalRequest.expiredTime : this.proposalRequest.proposal.negotiations[0].expiredTime;
      let diffSeconds = (expiredTime - new Date().getTime()) / 1000;
      const hours = diffSeconds / 3600;
      const days = Math.round(hours / 24);
      return days;
    },
    dismiss(id) {
      this.$emit("dismiss", id);
    },
    getFontSize(type) {
      if (type === "title") {
        return this.size === 1 ? "font-size-14" : "font-size-20";
      } else if (type === "subTitle") {
        return this.size === 1 ? "font-size-12" : "font-size-16";
      } else if (type === "expiredDate") {
        return this.size === 1 ? "font-size-12" : "font-size-16";
      }

    },
  },
  mounted() {
    console.log('proposal.card.mounted', this.proposalRequest);
  },
};
</script>
<style lang="scss" scoped>
.proposal-request-card {
  display: inline-block;
  width: 100%;
  &.vendor-dashboard {
    min-height: 200px;
  }
  &.negotiation{
      background-color: #ffefff!important;
  }
}
.new {
  padding: 0px 10px;
  border: 1px solid rgba(125, 40, 109, 0.62);
  border-radius: 30px;
  background-color: #d7c4d4;
  width: fit-content;

  &.medium{
    padding: 5px 20px!important;
  }
}
.h-30 { height: 30px }
.h-40 { height: 40px }
</style>
