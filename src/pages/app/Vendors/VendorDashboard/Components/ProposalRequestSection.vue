<template>
  <div class="white-card vendor-dashboard-requests" :class="field === 'negotiation' && requests.length ? 'negotiation' : ''">
    <div style="border-bottom: 2px solid #c8c8c8">
      <div class="pt-10 d-flex align-center justify-content-center font-bold">
        <md-button class="md-button md-theme-default md-simple md-just-icon md-black" @click="prev"
          ><md-icon class="font-size-30">chevron_left</md-icon></md-button
        >
        <span class="font-size-30 mr-10 font-bold" v-if="requests.length">
          {{ currentIndex + 1 }}/{{ requests.length }}
        </span>
        <span class="font-size-30 mr-10 font-bold" v-else>0 / 0</span>
        REQUEST FOR PROPOSAL
        <md-button class="md-button md-theme-default md-simple md-just-icon md-black" @click="next">
          <md-icon class="font-size-30">chevron_right</md-icon>
        </md-button>
      </div>
    </div>

    <template v-if="!requests.length">
        <div v-if="field == 'new'" class="d-flex flex-column align-center p-60"
             :style="{minHeight: this.proposalNegotiationRequest.length > 1 ? '298px' : '260px'} ">
            <img class="mb-20" :src="`${$iconURL}vendordashboard/group-17116.png`" />
            <div class="color-vendor font-bold font-size-14">NO REQUEST FOR PROPOSAL</div>
        </div>
        <div v-if="field == 'negotiation'" class="d-flex flex-column align-center p-60"
             :style="{minHeight: this.proposalRequest.length > 1 ? '298px' : '260px'}" >
            <img class="mb-15" :src="`${$iconURL}vendordashboard/group-16558.svg`"/>
            <div class="color-vendor font-bold font-size-14">NO REQUEST FOR CHANGES</div>
        </div>
    </template>

    <div class="d-flex flex-column align-center" v-else>
      <carousel :items="1" :margin="0" :nav="false" :loop="true" class="header-carousel" @changed="changeSlide">
        <template slot="prev">
          <span class="prev handle-btn " ref="prevButton">
            <md-icon>keyboard_arrow_left</md-icon>
          </span>
        </template>
        <div v-for="(p, index) in requests" :key="p.id" class="carousel-item">
          <proposal-request-card
            type="dashboard"
            :proposalRequest="p"
            :size="2"
            :hasNegotiation="field !== 'new'"
            :field="field"
            class="pl-30 pr-30 vendor-dashboard"
            @handle="approveBudget(index)"
          ></proposal-request-card>
        </div>
        <template slot="next">
          <span class="next handle-btn d-none" ref="nextButton">
            <md-icon>keyboard_arrow_right</md-icon>
          </span>
        </template>
      </carousel>
    </div>
    <modal v-if="showProposalDetail" container-class="modal-container-wizard lg">
          <template slot="body">
              <proposal-content :vendorProposal="selectedProposal" @close="selectedProposal = null" />
          </template>
    </modal>
    <modal v-if="showRequestNegotiationModal" container-class="modal-container negotiation bg-white">
       <template slot="header">
              <div class="border-right font-bold-extra text-center pr-10 mr-10">
                  <div
                          v-if="
              selectedProposalRequest && selectedProposalRequest.eventData && selectedProposalRequest.eventData.concept
            "
                  >
                      {{ selectedProposalRequest.eventData.concept.name }}
                  </div>
                  <div
                          v-else-if="
              selectedProposalRequest && selectedProposalRequest.eventData && selectedProposalRequest.eventData.title
            "
                  >
                      {{ selectedProposalRequest.eventData.title }}
                  </div>
                  <div v-else>New Event</div>
              </div>

              <div v-if="selectedProposal.nonMaryoku" class="border-right font-bold-extra text-center pr-10 mr-10">
                  {{ $dateUtil.formatScheduleDay(selectedProposal.eventData.startTime, "MM/DD/YY") }}
              </div>
              <div v-else class="border-right font-bold-extra text-center pr-10 mr-10">
                  {{ $dateUtil.formatScheduleDay(selectedProposalRequest.eventData.eventStartMillis, "MM/DD/YY") }}
              </div>
              <div class="text-center font-bold-extra">
                  $
                  {{ selectedProposal.cost | withComma(Number) }}
              </div>
              <md-button
                      class="position-absolute md-simple ml-auto text-decoration-none cursor-pointer"
                      @click="showRequestNegotiationModal = false"
              ><md-icon>close</md-icon></md-button
              >
          </template>
       <template slot="body">
              <negotiation-request
                      :type="negotiationType"
                      :negotiation="negotiation"
                      :processed="negotiationProcessed"
                      @close="showRequestNegotiationModal = false"
              />
       </template>
       <template slot="footer">
              <template v-if="negotiationType === negotiationTypes.ADD_MORE_TIME">
                  <md-button
                          v-if="negotiationProcessed === 0"
                          class="md-simple md-vendor-text md-black p-0"
                          @click="handleNegotiation(negotiationRequestStatus.decline)"
                  >Decline</md-button
                  >
                  <md-button
                          class="md-simple md-outlined md-vendor ml-auto"
                          @click="handleNegotiation(negotiationRequestStatus.review)"
                  >Review proposal</md-button
                  >
                  <md-button
                          v-if="negotiationProcessed === 0"
                          class="md-vendor ml-10"
                          @click="handleNegotiation(negotiationRequestStatus.approve)"
                  >Approve</md-button>
                  <md-button v-else class="md-vendor ml-10" @click="handleNegotiation(negotiationRequestStatus.done)">Done</md-button>
              </template>
              <template v-else-if="negotiationType === negotiationTypes.EVENT_CHANGE">
                  <md-button
                          class="md-simple md-vendor-text md-black p-0"
                          @click="handleNegotiation(negotiationRequestStatus.cancel_proposal)"
                  >Cancel proposal</md-button
                  >
                  <md-button
                          class="md-simple md-outlined md-vendor ml-auto"
                          @click="handleNegotiation(negotiationRequestStatus.update_proposal)"
                  >Update proposal</md-button
                  >
                  <md-button
                          class="md-vendor ml-10"
                          @click="handleNegotiation(negotiationRequestStatus.acknowledge)"
                  >Acknowledge</md-button>
              </template>
              <template v-else-if="negotiationType === negotiationTypes.PRICE_NEGOTIATION">
                  <md-button
                          class="md-simple md-vendor-text md-black p-0"
                          @click="handleNegotiation(negotiationRequestStatus.decline)"
                  >Decline</md-button>
                  <md-button
                          class="md-simple md-vendor-text md-black p-0 ml-auto"
                          @click="handleNegotiation(negotiationRequestStatus.review)"
                  >Review proposal</md-button>
                  <md-button
                          class="md-vendor ml-10"
                          @click="handleNegotiation(negotiationRequestStatus.approve)"
                  >Approve</md-button>
              </template>
          </template>
    </modal>
  </div>
</template>
<style lang="scss" scoped>
.vendor-dashboard-requests {
  .header-carousel {
    width: 100%;
  }
  /deep/ .owl-stage-outer {
    border-bottom: solid 1px #ffa9a9;
  }
  .proposal-request-card {
    min-height: 260px !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &.negotiation{
    background-color: #ffefff !important;
  }
}
</style>
<script>

import moment from 'moment'
import { PROPOSAL_VERSION_FIELDS } from "@/constants/proposal";
import { NEGOTIATION_REQUEST_STATUS, NEGOTIATION_REQUEST_TYPE, PROPOSAL_STATUS } from "@/constants/status";

import ProposalRequestCard from "@/pages/app/Vendors/components/ProposalRequestCard.vue";

const components = {
    Modal: () => import("@/components/Modal.vue"),
    carousel: () => import("vue-owl-carousel"),
    NegotiationRequest : () => import("@/pages/app/Vendors/components/NegotiationRequest.vue"),
    ProposalContent : () => import("@/pages/app/Vendors/components/ProposalDetail.vue"),
}

export default {
  components: {...components, ProposalRequestCard},
  props:{
    field: {
      type: String,
      default: 'new',
    }
  },
  data() {
    return {
        currentIndex: 0,
        selectedProposalRequest: null,
        negotiationProcessed: NEGOTIATION_REQUEST_STATUS.NONE,
        negotiationType:      NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME,
        negotiationTypes:     NEGOTIATION_REQUEST_TYPE,
        showRequestNegotiationModal: false,
        showProposalDetail: false,
        selectedProposal: null,
        versionFields: PROPOSAL_VERSION_FIELDS,
        negotiationRequestStatus: {
            review: 0,
            approve: 1,
            decline: 2,
            done: 3,
            cancel_proposal: 4,
            update_proposal: 5,
            acknowledge: 6,
        },
    };
  },
  computed: {
    requests() {
      return this.field === 'new' ? this.proposalRequest : this.proposalNegotiationRequest;
    },
    proposalRequest(){
      if (!this.$store.state.vendorDashboard.proposalRequests) return [];

      return this.$store.state.vendorDashboard.proposalRequests.filter(p => {
        return p.proposal ? p.remainingTime > 0 && p.declineMessage !== "decline" && p.proposal.status !== PROPOSAL_STATUS.PENDING
            : p.remainingTime > 0 && p.declineMessage !== "decline";
      });
    },
    proposalNegotiationRequest(){
      if (!this.$store.state.vendorDashboard.proposalRequests) return [];
      return this.$store.state.vendorDashboard.proposalRequests.filter(p => {
            return p.proposal && p.proposal.status === PROPOSAL_STATUS.PENDING && p.proposal.negotiations &&
                p.proposal.negotiations.filter(it => it.status === NEGOTIATION_REQUEST_STATUS.NONE && it.remainingTime > 0).length
        });
    },
    vendorData() {
      return this.$store.state.vendor.profile;
    },
      negotiation(){
          if (!this.selectedProposal || !this.selectedProposal.negotiations.length ) return null;

          if ( this.selectedProposal.negotiations[0].type === NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME ) {
              return new Date(this.selectedProposal.expiredDate).getTime();
          }

          else if ( this.selectedProposal.negotiations[0].type === NEGOTIATION_REQUEST_TYPE.EVENT_CHANGE ) {
              let {startTime, endTime, numberOfParticipants, location, eventType} = this.selectedProposal.eventData
              let { event } = this.selectedProposal.negotiations[0];
              return {
                  originalDate: moment(startTime * 1000).format('DD-MM-YY'),
                  date: moment(event.startTime * 1000).format('DD-MM-YY'),
                  originalStartTime: moment(startTime * 1000).format('hh:mm a'),
                  originalEndTime: moment(endTime * 1000).format('hh:mm a'),
                  startTime: moment(event.startTime * 1000).format('hh:mm a'),
                  endTime: moment(event.endTime * 1000).format('hh:mm a'),
                  originalNumberOfParticipants: numberOfParticipants,
                  numberOfParticipants: event.numberOfParticipants,
                  originalLocation: location,
                  location: event.location,
                  originalEventType: eventType,
                  eventType: event.eventType,
              }
          } else if ( this.selectedProposal.negotiations[0].type === NEGOTIATION_REQUEST_TYPE.PRICE_NEGOTIATION ) {
              console.log('price.negotiation');
              let {numberOfParticipants} = this.selectedProposal.eventData;
              let data = this.selectedProposal.negotiations[0].price;
              let budget = data.rate === '%' ? this.selectedProposal.cost * (1 - data.value / 100) : data.value;

              return {
                  originalBudget: this.selectedProposal.cost,
                  budget,
                  originalBudgetPerGuest: (this.selectedProposal.cost / numberOfParticipants).toFixed(2),
                  budgetPerGuest: (budget / numberOfParticipants).toFixed(2),
              }
          }
      },
  },
  methods: {
    prev() {
      this.$refs.prevButton.click();
    },
    next() {
      this.$refs.nextButton.click();
    },
    changeSlide(event) {
      this.currentIndex = event.page.index;
    },
    openNewTab(link) {
      window.open(link, "_blank");
    },
    approveBudget(index) {
      console.log('approveBudget');
      let proposalRequest = this.requests[index];
      if (this.field !== 'new') {

        this.selectedProposalRequest = proposalRequest;
        this.selectedProposal = proposalRequest.proposal;
        this.negotiationProcessed = NEGOTIATION_REQUEST_STATUS.NONE;
        this.negotiationType = this.selectedProposal.negotiations[0].type

        this.showRequestNegotiationModal = true;
      } else {
          let params = this.requests[index].proposal ? {id: this.requests[index].id, type: 'edit'} : {rfpId: this.requests[index].id}
          let routeData = this.$router.resolve({
              name: this.requests[index].proposal ? 'proposalEdit' : 'VendorProposal',
              params: {...params, vendorId: this.vendorData.id},
          });
          window.open(routeData.href, '_blank');
      }
    },
      async handleNegotiation(status) {
          if ( status === this.negotiationRequestStatus.review ) {

              this.showRequestNegotiationModal = false;
              this.showProposalDetail = true;

          } else if ( status === this.negotiationRequestStatus.approve || status === this.negotiationRequestStatus.decline ) {
              this.loading = true;
              let expiredTime = new Date(this.selectedProposal.expiredDate).getTime() + 2 * 3600 * 24 * 1000;
              let signupUrl = `${location.protocol}//${location.host}/#/guest/signup`;

              let url = this.selectedProposal.nonMaryoku
                  ? `${location.protocol}//${location.host}/#/unregistered/proposals/${this.selectedProposal.id}`
                  : `${location.protocol}//${location.host}/#/events/${this.selectedProposal.proposalRequest.eventData.id}/booking/choose-vendor`;

              let data = {
                  id: this.selectedProposal.negotiations[0].id,
                  status,
                  url,
              }
              if ( status === this.negotiationRequestStatus.approve &&
                  this.selectedProposal.negotiations[0].type === NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME ) data = {...data, expiredTime};
              if ( status === this.negotiationRequestStatus.decline &&
                  this.selectedProposal.negotiations[0].type === NEGOTIATION_REQUEST_TYPE.PRICE_NEGOTIATION ) data = {...data, signupUrl};

              let negotiation = await this.$store.dispatch('vendorDashboard/saveNegotiation', {
                  data,
                  proposal: this.selectedProposal
              })

              if ( this.selectedProposal.negotiations[0].type === NEGOTIATION_REQUEST_TYPE.PRICE_NEGOTIATION ) this.showRequestNegotiationModal = false;
              this.selectedProposal.negotiations[0] = negotiation;

              if (status === this.negotiationRequestStatus.approve && this.selectedProposal.negotiations[0].type === NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME)
                  this.selectedProposal.expiredDate = new Date(expiredTime);

              await this.$store.commit("vendorDashboard/setProposal", this.selectedProposal);

              let proposalRequest = this.selectedProposalRequest ? this.selectedProposalRequest : this.requests.find(p => p.proposal.id === this.selectedProposal.id);
              this.$set(proposalRequest, 'proposal', this.selectedProposal);
              await this.$store.commit("vendorDashboard/setProposalRequest", proposalRequest);

              this.loading = false;
              this.negotiationProcessed = status;

          } else if( status === this.negotiationRequestStatus.acknowledge || status === this.negotiationRequestStatus.cancel_proposal ||
              status === this.negotiationRequestStatus.update_proposal ) {
              this.loading = true;
              let version = {};
              if (status === this.negotiationRequestStatus.update_proposal) {     // get proposal to update event info
                  version = await this.saveVersion(this.selectedProposal);
                  this.selectedProposal.versions.push(version);
              }
              let negotiation = await this.$store.dispatch('vendorDashboard/saveNegotiation', {
                  data: {
                      id: this.selectedProposal.negotiations[0].id,
                      status,
                      loginUrl: `${location.protocol}//${location.host}/#/signin`
                  },
                  proposal: this.selectedProposal
              })

              this.selectedProposal.negotiations[0] = negotiation;
              this.$store.commit("vendorDashboard/setProposal", this.selectedProposal);

              let proposalRequest = this.selectedProposalRequest ? this.selectedProposalRequest : this.requests.find(p => p.proposal.id === this.selectedProposal.id);
              this.$set(proposalRequest, 'proposal', this.selectedProposal);
              await this.$store.commit("vendorDashboard/setProposalRequest", proposalRequest);

              if(status === this.negotiationRequestStatus.cancel_proposal) {
                  let proposals = this.proposals.filter(it => it.id !== this.selectedProposal.id);
                  this.$store.commit("vendorDashboard/setProposals", proposals);
              }

              if (status === this.negotiationRequestStatus.update_proposal ) {
                  let query = {version : version.id};
                  this.editProposal(null, query);
              }
              this.loading = false;
              this.showRequestNegotiationModal = false;
              this.negotiationProcessed = NEGOTIATION_REQUEST_STATUS.NONE;

          } else if (status === this.negotiationRequestStatus.done) {

              this.showRequestNegotiationModal = false;
              this.negotiationProcessed = NEGOTIATION_REQUEST_STATUS.NONE;

          }
      },

      async saveVersion(proposal){
          let data = {};
          this.versionFields.map(key => {
              if (key === 'eventData') {
                  data[key] = {...this.selectedProposal.eventData, ...this.selectedProposal.negotiations[0].event};
              } else if ( key === 'bookedServices') {
                  data[key] = []
              } else {
                  data[key] = proposal[key];
              }
          });

          let versionData = {
              name: `Ver${proposal.versions.length + 1}-${moment().format("DD/MM/YYYY")}`,
              data,
          }
          let version = await this.$store.dispatch("vendorDashboard/saveVersion", {version: versionData, proposal});
          return version;
      },
      editProposal(params = null, query = null){
          let routeData = this.$router.resolve({
              name: this.selectedProposal.nonMaryoku ? "outsideProposalEdit" : "proposalEdit",
              params: params ? params : {
                  vendorId: this.selectedProposal.vendor.id,
                  id: this.selectedProposal.nonMaryoku ? this.selectedProposal.id : this.selectedProposal.proposalRequest.id,
                  type: "edit",
              },
              query: query ? query : null,
          });
          this.openNewTab(routeData.href);
      },
  },

  updated() {
    // remove empty item in proposal-request carousel
    $(".owl-item").each(function (el) {
        if ($(this).text().length === 0) $(this).remove();
    });
  },
};
</script>
