<template>
  <div class="vendor-proposal-board p-40">
    <loader :active="loading" :isFullScreen="true" page="vendor" />
    <div class="font-size-22 font-bold d-flex align-center">
      <img src="/static/icons/vendor/proposal-active.svg" class="mr-10" alt=""/> Proposals Board
      <md-button class="ml-auto md-vendor md-maryoku mr-15" @click="createNewProposal">Create New Proposal</md-button>
    </div>
    <div class="font-bold text-uppercase mt-30 mb-15">Opportunities</div>
    <carousel
      :items="4"
      :margin="25"
      :dots="false"
      :number="2"
      :nav="false"
      class="proposal-requests"
    >
      <template slot="prev">
        <button class="nav-left nav-btn">
          <span><md-icon class="color-vendor">arrow_back</md-icon></span>
        </button>
      </template>
      <ProposalRequestCard
        class="carousel-item"
        v-for="(proposalRequest, idx) in proposalRequests"
        :key="proposalRequest.id"
        :proposalRequest="proposalRequest"
        :hasNegotiation="
          !!(
            proposalRequest.proposal &&
            proposalRequest.proposal.negotiations &&
            proposalRequest.proposal.negotiations.filter((it) => it.status === 0).length
          )
        "
        @handle="handleRequestCard(idx)"
        @dismiss="dismiss"
      >
      </ProposalRequestCard>
      <EmptyRequestCard v-if="proposalRequests.length < 1" ></EmptyRequestCard>

      <template slot="next">
        <button class="nav-right nav-btn">
          <md-icon class="color-vendor">arrow_forward</md-icon>
        </button>
      </template>
    </carousel>
    <hr class="my-40 color-vendor" />
    <div class="proposals-table">
      <div class="font-bold">All proposals:</div>
      <div class="filter-bar mt-30">
        <md-button
          v-for="tab in proposalTabs"
          :key="tab.key"
          class="md-round md-white-shadow md-white maryoku-btn filter-button mr-20"
          @click="selectTab(tab.value)"
        >
          <div class="d-flex align-center px-20 py-10 font-size-16" :class="tab.class">
            <img
              class="mr-10"
              :src="`/static/icons/vendor/proposalBoard/${tab.icon}`"
              alt=""
              style="width: 20px; height: 20px"
            />
            {{ tab.title }}
            <span v-if="tab.key === 'all'" class="ml-5" :class="tab.class">({{ pagination.total }})</span>
            <span v-else class="ml-5" :class="tab.class">({{ pagination[tab.key] }})</span>
          </div>
        </md-button>
      </div>
      <div class="mt-30">
        <span class="font-size-16 font-bold" :class="!proposals.length ? 'color-minus' : 'color-won'">
          {{ pagination.total }} Proposals:</span
        >
      </div>
      <div class="md-layout mt-10">
        <div class="md-layout-item md-size-75 p-0 d-flex flex-column" style="background: rgba(255, 255, 255, 0.46)">
          <div class="sort-bar px-40" style="background: #f3f7fd">
            <span
              v-for="it in proposalHeaders"
              class="sort-item"
              :class="{ selected: it.key && sortFields['sort'] === it.key, 'text-center': it.key === 'update' }"
              @click="selectSort(it.key)"
            >
              {{ it.title }}
              <md-icon v-if="it.key && it.key !== 'update' && sortFields['sort'] === it.key" class="color-black">
                {{ sortFields["order"] === "asc" ? "keyboard_arrow_up" : "keyboard_arrow_down" }}</md-icon
              >
              <md-icon v-if="it.key && it.key !== 'update' && sortFields['sort'] !== it.key" class="color-black-middle">
                keyboard_arrow_down
              </md-icon>
            </span>
          </div>
          <div v-if="!loading" class="propsoals-list">
            <div class="white-card md-20 proposal-list">
              <ProposalListItem
                v-for="proposal in proposals"
                :proposal="proposal"
                :hasNegotiation="
                  !!(!proposal.accepted && proposal.negotiations && proposal.negotiations.filter((it) => it.status === 0).length)
                "
                :key="proposal.id"
                class="row"
                @action="handleProposal"
              ></ProposalListItem>
            </div>
          </div>
          <div v-if="this.proposals.length < 4" class="my-auto d-flex flex-column align-center">
            <img class="mb-0" :src="`${iconUrl}vendordashboard/group-17116.png`" alt=""/>
            <p class="text-transform-uppercase font-size-14">No More Proposal To Show</p>
            <md-button class="md-vendor" @click="createNewProposal">Create New Proposal</md-button>
          </div>
        </div>
        <div class="md-layout-item md-size-25 mt-50">
          <insight v-if="!loading" :total="pagination.total" :won="pagination.won" @insight="showInsightModal = true"></insight>
        </div>
      </div>
      <div class="md-layout">
        <div class="md-layout-item md-size-75">
          <div class="text-center">
            <TablePagination
              v-if="pagination.pageCount"
              class="mt-30"
              :pageCount="pagination.pageCount"
              :clickHandler="gotoPage"
            ></TablePagination>
          </div>
        </div>
        <div class="md-layout-item md-size-25"></div>
      </div>
    </div>
    <modal v-if="showProposalDetail" container-class="modal-container-wizard lg">
      <template slot="body">
        <ProposalContent :vendorProposal="selectedProposal" @close="showProposalDetail = false" />
      </template>
    </modal>
    <modal v-if="showRequestNegotiationModal" container-class="modal-container negotiation bg-white">
      <template slot="header">
        <div class="border-right font-bold-extra text-left pr-10 mr-10">
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
    <modal v-if="showInsightModal" container-class="modal-container bg-white">
      <template slot="header">
        <md-button
            class="position-absolute md-simple ml-auto text-decoration-none cursor-pointer"
            @click="showInsightModal = false"
        ><md-icon>close</md-icon></md-button
      ></template>
      <template slot="body">
          <InsightDetail/>
      </template>
      <template slot="footer">
          <md-button class="md-simple ml-auto md-outlined md-vendor p-0">Update Your Prices</md-button>
          <md-button class="md-vendor ml-20" @click="showInsightModal=false">Close</md-button>
      </template>
    </modal>
    <ShareProposal
      v-if="showShareProposalModal"
      :link="proposalLink"
      @close="showShareProposalModal = false"
    ></ShareProposal>
    <ResendProposalResult
      v-if="showResendProposalModal"
      :to="selectedProposal.nonMaryoku ? selectedProposal.eventData.customer.email :
       selectedProposal.proposalRequest.eventData.owner.email"
      @close="showResendProposalModal = false"
      @submit="showResendProposalModal = false"
    > </ResendProposalResult>
  </div>
</template>
<script>
import moment from 'moment'
import _ from "underscore";
import carousel from "vue-owl-carousel"
import ProposalRequestCard from "@/pages/app/Vendors/components/ProposalRequestCard.vue";
import EmptyRequestCard from "@/pages/app/Vendors/components/EmptyRequestCard.vue";
import ProposalRequest from "@/models/ProposalRequest";
import { socialMediaBlocks } from "@/constants/vendor";
import { NEGOTIATION_REQUEST_STATUS, NEGOTIATION_REQUEST_TYPE, PROPOSAL_STATUS } from "@/constants/status";
import { PROPOSAL_PAGE_TABS, PROPOSAL_TABLE_HEADERS } from "@/constants/list";
import { PROPOSAL_VERSION_FIELDS } from "@/constants/proposal";
import { PROPOSAL_PAGE_PAGINATION } from "@/constants/pagination";

const components = {
    Loader: () => import("@/components/loader/Loader.vue"),
    Modal: () => import("@/components/Modal.vue"),
    carousel: () => import("vue-owl-carousel"),
    // ProposalRequestCard: () => import("@/pages/app/Vendors/components/ProposalRequestCard.vue"),
    NegotiationRequest : () => import("@/pages/app/Vendors/components/NegotiationRequest.vue"),
    ProposalContent : () => import("@/pages/app/Vendors/components/ProposalDetail.vue"),
    ProposalListItem : () => import("@/pages/app/Vendors/components/ProposalListItem.vue"),
    // EmptyRequestCard : () => import("@/pages/app/Vendors/components/EmptyRequestCard.vue"),
    InsightDetail : () => import("@/pages/app/Vendors/components/InsightDetail.vue"),
    TablePagination: () => import("@/components/TablePagination.vue"),
    Insight : () => import("@/pages/app/Vendors/ProposalBoard/insight.vue"),
    ShareProposal : () => import("@/pages/app/Vendors/ProposalBoard/ShareProposal.vue"),
    ResendProposalResult : () => import("@/pages/app/Vendors/ProposalBoard/ResendProposalResult.vue"),
}

export default {
  components: {...components, ProposalRequestCard, EmptyRequestCard},
  data() {
    return {
      loading: true,
      iconUrl: `${this.$iconURL}`,
      proposalTabs: PROPOSAL_PAGE_TABS,
      proposalHeaders: PROPOSAL_TABLE_HEADERS,
      tab: "all",
      showProposalDetail: false,
      showShareProposalModal: false,
      selectedProposal: null,
      selectedEventData: null,
      selectedProposalRequest: null,
      showRequestNegotiationModal: false,
      showResendProposalModal: false,
      showInsightModal: false,
      negotiationRequestStatus: {
        review: 0,
        approve: 1,
        decline: 2,
        done: 3,
        cancel_proposal: 4,
        update_proposal: 5,
        acknowledge: 6,
      },
      proposalStatus: {
        show: 0,
        edit: 1,
        download: 2,
        delete: 3,
        share: 4,
        negotiation: 5,
        resend: 7,
        cancel: 8
      },
      negotiationProcessed: NEGOTIATION_REQUEST_STATUS.NONE,
      negotiationType:      NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME,
      negotiationTypes:     NEGOTIATION_REQUEST_TYPE,
      socialMediaBlocks,
      pagination: PROPOSAL_PAGE_PAGINATION,
      sortFields: { sort: "cost", order: "desc" },
      versionFields: PROPOSAL_VERSION_FIELDS,
    };
  },
  async mounted() {
    this.$root.$emit("proposalTab");

    await this.init();
  },
  methods: {
    async getProposal() {
      const { pagination } = this;
      const params = { status: this.tab, ...this.sortFields };
      const data = await this.$store.dispatch("vendorDashboard/getProposals", {
        vendorId: this.vendorData.id,
        pagination,
        params,
      });

      this.pagination.total = data.total;
      this.proposalTabs.map((t) => {
        if (data.hasOwnProperty(t.key)) this.pagination[t.key] = data[t.key];
      });
      this.pagination.pageCount = Math.ceil(data.total / this.pagination.limit);
    },
    gotoPage(selectedPage) {
      this.pagination.page = selectedPage;
      this.getProposal();
    },
    async selectTab(tab) {
      this.loading = true;
      this.tab = tab;
      await this.getProposal();
      this.loading = false;
    },
    async selectSort(sortField) {
      if (!sortField || sortField === "update") return;
      this.loading = true;
      if (this.sortFields.sort !== sortField) {
        this.$set(this.sortFields, "sort", sortField);
        this.$set(this.sortFields, "order", "asc");
      } else {
        this.sortFields["order"] = this.sortFields["order"] === "desc" ? "asc" : "desc";
      }
      await this.getProposal();
      this.loading = false;
    },
    async dismiss(id) {
      this.loading = true;
      await new ProposalRequest({
        id,
        declineMessage: "decline",
      }).save();
      let proposalRequests = this.proposalRequests.filter((p) => {
        return p.id !== id;
      });
      await this.$store.commit("vendorDashboard/setProposalRequests", proposalRequests);
      this.loading = false;
    },
    async handleProposal(action, id) {
      this.selectedProposal = this.proposals.find((it) => it.id === id);

      if ( action === this.proposalStatus.show ) {

        this.showProposalDetail = true;

      } else if ( action === this.proposalStatus.edit ) {

        this.editProposal();

      } else if ( action === this.proposalStatus.delete ) {

        this.loading = true;

        await this.$store.dispatch('vendorDashboard/removeProposal', id);
        await this.getProposal();

        this.loading = false;

      } else if ( action === this.proposalStatus.download ) {

        this.openNewTab(`${process.env.SERVER_URL}/1/proposal/${this.selectedProposal.id}/download`);

      } else if ( action === this.proposalStatus.share ) {

        this.showShareProposalModal = true;

      } else if ( action === this.proposalStatus.negotiation ) {

        this.showRequestNegotiationModal = true;
        this.negotiationProcessed = NEGOTIATION_REQUEST_STATUS.NONE;
        this.negotiationType = this.selectedProposal.negotiations[0].type

      } else if ( action === this.proposalStatus.resend ) {
        let url = this.selectedProposal.nonMaryoku
                ? `${location.protocol}//${location.host}/#/unregistered/proposals/${this.selectedProposal.id}`
                : `${location.protocol}//${location.host}/#/signin`;

        let eventName = this.selectedProposal.nonMaryoku ? this.selectedProposal.eventData.customer.company :
                this.selectedProposal.proposalRequest.eventData.title ? this.selectedProposal.proposalRequest.eventData.title : 'New event';

        await this.sendEmail({type: "again", proposalId: this.selectedProposal.id, url, eventName});
        this.showResendProposalModal = true;

      } else if ( action === this.proposalStatus.cancel ) {

        this.loading = true;

        let url = `${location.protocol}//${location.host}/#/signin`;
        await this.$store.dispatch('vendorDashboard/updateProposal', {
          data: {...this.selectedProposal, status: PROPOSAL_STATUS.INACTIVE},
          vendorId: this.selectedProposal.vendor.id,
        });
        await this.sendEmail({type: "inactive", url, proposalId: this.selectedProposal.id})
        this.loading = false;
      }
    },
    handleRequestCard(idx) {
      let proposalRequest = this.proposalRequests[idx];
      if (
        proposalRequest.proposal &&
        proposalRequest.proposal.negotiations &&
        proposalRequest.proposal.negotiations.length
      ) {
        this.selectedProposalRequest = proposalRequest;
        this.selectedProposal = proposalRequest.proposal;
        this.showRequestNegotiationModal = true;
        this.negotiationProcessed = NEGOTIATION_REQUEST_STATUS.NONE;
        this.negotiationType = this.selectedProposal.negotiations[0].type
      } else {
        let params = proposalRequest.proposal
          ? { id: proposalRequest.id, type: "edit" }
          : { rfpId: proposalRequest.id };
        let routeData = this.$router.resolve({
          name: proposalRequest.proposal ? "proposalEdit" : "VendorProposal",
          params: { ...params, vendorId: this.vendorData.id },
        });
        this.openNewTab(routeData.href);
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
          : `${location.protocol}//${location.host}/#/signin`;

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

          if ( this.selectedProposal.negotiations[0].type === NEGOTIATION_REQUEST_TYPE.PRICE_NEGOTIATION ) {
              this.showRequestNegotiationModal = false;
              const version = await this.saveVersion(this.selectedProposal);
              this.selectedProposal.versions.push(version);
          }
          this.selectedProposal.negotiations[0] = negotiation;

          if ( status === this.negotiationRequestStatus.approve && this.selectedProposal.negotiations[0].type === NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME )
              this.selectedProposal.expiredDate = new Date(expiredTime);

          await this.$store.commit("vendorDashboard/setProposal", this.selectedProposal);

          let proposalRequest = this.selectedProposalRequest ? this.selectedProposalRequest : this.proposalRequests.find(p => p.proposal.id === this.selectedProposal.id);
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
          const negotiation = await this.$store.dispatch('vendorDashboard/saveNegotiation', {
              data: {
                  id: this.selectedProposal.negotiations[0].id,
                  status,
                  loginUrl: `${location.protocol}//${location.host}/#/signin`
              },
              proposal: this.selectedProposal
          })

          this.selectedProposal.negotiations[0] = negotiation;
          this.$store.commit("vendorDashboard/setProposal", this.selectedProposal);

          let proposalRequest = this.selectedProposalRequest ? this.selectedProposalRequest : this.proposalRequests.find(p => p.proposal.id === this.selectedProposal.id);
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
              data[key] = {...proposal.eventData, ...proposal.negotiations[0].event};
            } else if ( key === 'bookedServices' ) {
              data[key] = [];
            } else if ( key === 'negotiationDiscount' && proposal.negotiations[0].type === NEGOTIATION_REQUEST_TYPE.PRICE_NEGOTIATION) {
              data.negotiationDiscount = {
                  isApplied: true,
                  percentage: proposal.negotiations[0].price.rate === '%' ? proposal.negotiations[0].price.value :
                      (proposal.negotiations[0].price.value / proposal.cost * 100).toFixed(2),
                  price: proposal.negotiations[0].price.rate === '$' ? proposal.negotiations[0].price.value :
                      (proposal.negotiations[0].price.value / 100 * proposal.cost).toFixed(2),
              }
            } else {
              data[key] = proposal[key];
            }
        });

        let versionData = {
            name: `Ver${proposal.versions.length + 1}-${moment().format("DD/MM/YYYY")}`,
            data,
        }
        const version = await this.$store.dispatch("vendorDashboard/saveVersion", {version: versionData, proposal});
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
    async sendEmail(params) {
      await this.$http.post(
              `${process.env.SERVER_URL}/1/proposals/${this.selectedProposal.id}/sendEmail`,
              {...params},
              {headers: this.$auth.getAuthHeader()})
    },
    createNewProposal() {
      let routeData = this.$router.resolve({
        name: "outsideProposalCreate",
        params: {
          vendorId: this.vendorData.id,
        },
      });

      this.openNewTab(routeData.href);
    },
    openNewTab(link) {
      window.open(link, "_blank");
    },
    eventDate() {
      let suggestionDate = this.selectedProposal.suggestionDate || [];
      if (!this.selectedEventData) return "-";

      let startDate = new Date(this.selectedEventData.eventStartMillis);
      let endDate = new Date(this.selectedEventData.eventEndMillis);
      if (suggestionDate && suggestionDate.length > 0) {
        return `${moment(suggestionDate[0].date, "DD/MM/YYYY").format("MMM D, YYYY")} - ${moment(
          suggestionDate[suggestionDate.length - 1].date,
          "DD/MM/YYYY",
        ).format("MMM D, YYYY")}`;
      }
      return `${moment(startDate).format("MMM D, YYYY")} - ${moment(endDate).format("MMM D, YYYY")}`;
    },
    isSocial() {
      let isBlank = true;
      _.each(this.selectedProposal.vendor.social, (s) => {
        isBlank &= s === null;
      });

      return !isBlank;
    },
    headerBackgroundImage() {
      if (!this.selectedProposal) return "";
      if (this.selectedProposal.inspirationalPhotos && this.selectedProposal.inspirationalPhotos[0])
        return this.selectedProposal.inspirationalPhotos[0].url;
      if (this.selectedProposal.vendor.images && this.selectedProposal.vendor.images[0])
        return this.selectedProposal.vendor.images[0];
      if (this.selectedProposal.vendor.vendorImages && this.selectedProposal.vendor.vendorImages[0])
        return this.selectedProposal.vendor.vendorImages[0];

      return "";
    },
    async init() {
      await this.$store.dispatch("vendorDashboard/getProposalRequests", this.vendorData.id);
      await this.getProposal();
      this.loading = false;
    },
  },
  computed: {
    vendorData() {
      return this.$store.state.vendor.profile;
    },
    proposalLink() {
      if (!this.selectedProposal) return null;
      return this.selectedProposal.nonMaryoku
        ? `${location.protocol}//${location.host}/#/unregistered/proposals/${this.selectedProposal.id}`
        : `${location.protocol}//${location.host}/#/vendors/${this.selectedProposal.vendor.id}/proposal-request/${this.selectedProposal.proposalRequestId}/form/edit`;
    },
    proposalRequests() {
      let proposalRequests = this.$store.state.vendorDashboard.proposalRequests;
      return proposalRequests.filter((p) => {
        return p.proposal
          ? (p.declineMessage !== "decline" && p.proposal.status === PROPOSAL_STATUS.DRAFT && p.remainingTime > 0) ||
              (!p.proposal.accepted &&
                p.proposal.negotiations &&
                p.proposal.negotiations.filter(
                  (it) => it.status === NEGOTIATION_REQUEST_STATUS.NONE && it.remainingTime > 0,
                ).length)
          : p.remainingTime > 0 && p.declineMessage !== "decline";
      });
    },
    proposals() {
      return this.$store.state.vendorDashboard.proposals.filter(p => p.status !== PROPOSAL_STATUS.INACTIVE);
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

          let {numberOfParticipants} = this.selectedProposal.eventData;
          let data = this.selectedProposal.negotiations[0].price;
          let budget = data.rate === '%' ? this.selectedProposal.cost * (1 - data.value / 100) : this.selectedProposal.cost - data.value;

          return {
              originalBudget: this.selectedProposal.cost,
              budget,
              originalBudgetPerGuest: (this.selectedProposal.cost / numberOfParticipants).toFixed(2),
              budgetPerGuest: (budget / numberOfParticipants).toFixed(2),
          }
      }
    },
  },
  watch: {
    proposalRequests(newVal) {
      console.log("proposalRequests.watch", newVal);
    },
  },
  updated() {
    // remove empty item in proposal-request carousel
    $(".owl-item").each(function () {
      if ($(this).text().length === 0) $(this).remove();
    });
  },
};
</script>
<style lang="scss" scoped>
.vendor-proposal-board {
  .proposal-requests {
    display: flex;
    position: relative;
    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      z-index: 10;
      width: 33px;
      height: 33px;
      background-color: white;
      border: none;
      border-radius: 50%;
      box-shadow: 0 3px 25px 0 rgba(0, 0, 0, 0.16);
      cursor: pointer;
      &.nav-left {
        left: 10px;
      }
      &.nav-right {
        right: 10px;
      }
    }
  }
  .proposal-list {
    .proposal-list-item:not(:last-child) {
      border-bottom: solid 1px #dbdbdb;
    }
  }
  .sort-bar {
    height: 50px;
    display: grid;
    align-items: center;
    grid-template-columns: 5% 20% 10% 15% 10% 10% 10% 15% 5%;
    .sort-item {
      cursor: pointer;
      color: #707070;
      font-size: 14px;
      &.selected {
        color: #050505;
        font-weight: bold;
      }
    }
  }
  .tips {
    img {
      height: 20px;
    }
  }
  .border-right {
    border-right: 1px solid #050505;
  }
}
</style>
