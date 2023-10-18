<template>
  <div class="adding-building-blocks-panel" style="min-height: 240px; background: white; border-radius: 5px">
    <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" background-color="#eee" />
    <template v-if="!isLoading && acceptedBlockVendors.length">
      <div class="manage-proposals_proposals-list" v-for="(list, index) in acceptedBlockVendors" :key="index">
        <template v-if="list.list.length">
          <div class="md-toolbar-section-start acceptance-list">
            <div class="proposals-name">{{ list.title }} ({{ list.list.length }})</div>
          </div>
          <div class="proposals-list_items">
            <div class="proposals-list_item" v-for="(item, indx) in list.list" :key="indx">
              <div class="vendor-avatar">
                <md-avatar class="md-avatar-icon">
                  <md-icon>people</md-icon>
                </md-avatar>
              </div>
              <div class="proposal-info text-left" style="width: 70% !important">
                <div class="proposal-title-reviews" @click="showVendorDetail(item.vendor)">
                  {{ item.vendor ? item.vendor.vendorDisplayName : "No Vendor Title" }}
                  <div class="star-rating">
                    <label
                      class="star-rating__star"
                      v-for="(rating, rIndex) in ratings"
                      :key="rIndex"
                      :class="{
                        'is-selected': item.vendor.rank >= rating && item.vendor.rank != null,
                      }"
                    >
                      <input class="star-rating star-rating__checkbox" type="radio" />★</label
                    >
                  </div>
                </div>
                <div class="proposal-property-list">
                  <ul class="list-items">
                    <li>
                      <md-icon>check</md-icon>
                      Insurance
                    </li>
                  </ul>
                </div>
                <div class="proposal-benefits-list" v-if="item.proposals && item.proposals[0]">
                  <ul class="list-items">
                    <li v-for="(pro, pIndex) in item.proposals[0].pros" :key="pIndex">
                      {{ pro }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="proposal-actions text-right">
                <template v-if="item.proposals && item.proposals[0]">
                  <div class="cost">${{ item.proposals[0].cost }}</div>
                  <md-button class="md-rose md-sm md-simple" @click="viewProposal(item.proposals[0])"
                    >view contract</md-button
                  >
                  <md-button
                    class="md-rose md-sm"
                    @click="manageProposalsAccept(item.proposals[0])"
                    v-if="item.proposals[0].downPaymentStatus !== 'paid'"
                    >Pay</md-button
                  >
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
    <md-card class="md-card-plain" v-if="!filteredBlockVendors.length && !isLoading">
      <md-card-content>
        <div class="text-center">
          <h4>Accept proposals to see them here</h4>
        </div>
      </md-card-content>
    </md-card>
    <manage-proposals-vendors :building-block.sync="selectedBlock" :event.sync="event"></manage-proposals-vendors>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import EventComponent from "@/models/EventComponent";
import Vendors from "@/models/Vendors";
import EventComponentVendor from "@/models/EventComponentVendor";
import VueElementLoading from "vue-element-loading";
import { Pagination, Tabs } from "@/components";
import _ from "underscore";
import moment from "moment";
import numeral from "numeral";

// import auth from '@/auth';

import UploadVendorsModal from "../../../../Vendors/ImportVendors";
import ManageBlockVendors from "./ManageBlockVendors.vue";
import ViewProposals from "./ViewProposals.vue";
import MdCardContent from "../../../../../../../node_modules/vue-material/src/components/MdCard/MdCardContent/MdCardContent.vue";
import MdCardHeader from "../../../../../../../node_modules/vue-material/src/components/MdCard/MdCardHeader/MdCardHeader.vue";
import VendorsTable from "@/pages/app/Vendors/Table/vendorsList";
import VendorsPoolPanel from "@/pages/app/Vendors/VendorsPoolPanel";
import companyForm from "@/pages/app/Vendors/Form/companyForm";
import ManageProposalsAccept from "../Modals/ManageProposalsAccept.vue";
import ManageProposalsVendors from "./ManageProposalsVendors";
import ViewProposal from "./ViewProposal.vue";

export default {
  name: "event-block-acceptance",
  components: {
    MdCardHeader,
    MdCardContent,
    VueElementLoading,
    UploadVendorsModal,
    ManageBlockVendors,
    ViewProposals,
    VendorsTable,
    Pagination,
    ManageProposalsAccept,
    ManageProposalsVendors,
    companyForm,
    Tabs,
  },
  props: {
    selectedBlock: Object,
    event: Object,
    // blockVendors : Array,
  },
  data: () => ({
    // auth: auth,
    isLoading: true,
    sendingRfp: false,
    searchQuery: "",
    ratings: [1, 2, 3, 4, 5],
    filteredBlockVendors: [],
    blockVendors: null,
    vendors: [],
    proposals: [],
    acceptedBlockVendors: [],
  }),
  methods: {
    getBlockVendors() {
      if (true) {
        let calendar = new Calendar({
          id: this.$auth.user.defaultCalendarId,
        });
        let event = new CalendarEvent({
          id: this.event.id,
        });
        let selected_block = new EventComponent({
          id: this.selectedBlock.id,
        });

        new EventComponentVendor()
          .for(calendar, event, selected_block)
          .get()
          .then((resp) => {
            this.isLoading = false;
            this.selectedBlock.vendors = resp;
            this.selectedBlock.vendorsCount = resp.length;
            this.blockVendors = resp;

            let vendorsWithProposals = _.filter(this.blockVendors, function (item) {
              return item.proposals && item.proposals.length;
            });

            let proposals = [];
            let downPaymentPaid = [];
            let fullyPaid = [];

            _.each(vendorsWithProposals, (v) => {
              let downPaymentStatus = v.proposals[0].downPaymentStatus;
              let accepted = v.proposals[0].accepted;

              if (accepted) {
                if (downPaymentStatus === null || downPaymentStatus === "pending") {
                  downPaymentPaid.push(v);
                } else if (downPaymentStatus === "paid") {
                  fullyPaid.push(v);
                }

                proposals.push(v);
              }
            });

            this.acceptedBlockVendors = [
              {
                title: "Downpayment paid",
                list: downPaymentPaid,
              },
              {
                title: "fully paid",
                list: fullyPaid,
              },
            ];
          })
          .catch((error) => {
            this.isLoading = false;
          });
      } else {
        this.blockVendors = this.selectedBlock.vendors;

        // console.log('blockVendors => ',this.blockVendors);
        let vendorsWithProposals = _.filter(this.blockVendors, function (item) {
          return item.proposals && item.proposals.length;
        });
        let vendorsWithSentStatus = _.filter(this.blockVendors, function (item) {
          return item.proposals && !item.proposals.length;
        });
        let vendorsWithNoStatus = _.filter(this.blockVendors, function (item) {
          return !item.proposals;
        });

        this.filteredBlockVendors = _.union(vendorsWithProposals, vendorsWithSentStatus, vendorsWithNoStatus);
        this.isLoading = false;
      }

      // this.isLoading = this.filteredBlockVendors.length <= 0;
    },
    sendVendor(item) {
      // this.isLoading = true;

      let calendar = new Calendar({
        id: this.$auth.user.defaultCalendarId,
      });
      let event = new CalendarEvent({
        id: this.event.id,
      });
      let selected_block = new EventComponent({
        id: this.selectedBlock.id,
      });

      let vendor = new EventComponentVendor(item);

      vendor.id = item.id;
      vendor.cost = item.cost;
      vendor.vendor = item.vendor;
      vendor.vendorId = item.vendorId;
      vendor.rfpStatus = "Sent";

      vendor
        .for(calendar, event, selected_block)
        .save()
        .then((resp) => {
          this.getBlockVendors();

          this.$forceUpdate();
        })
        .catch((error) => {
          // this.isLoading = false;
          console.log("EventComponentVendor error =>", error);

          this.$notify({
            message: "Error while trying to add vendor, try again!",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "danger",
          });
        });
    },
    filterVendors() {
      let vendorsWithProposals = _.filter(this.blockVendors, function (item) {
        return item.proposals && item.proposals.length;
      });
      let vendorsWithSentStatus = _.filter(this.blockVendors, function (item) {
        return item.proposals && !item.proposals.length;
      });
      let vendorsWithNoStatus = _.filter(this.blockVendors, function (item) {
        return !item.proposals;
      });

      let mergedArr = _.union(vendorsWithProposals, vendorsWithSentStatus, vendorsWithNoStatus);

      this.filteredBlockVendors = _.filter(mergedArr, (v) => {
        return v.vendor.vendorDisplayName.toString().toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1;
      });
    },
    viewProposal(proposal) {
      window.currentPanel = this.$showPanel({
        component: ViewProposal,
        cssClass: "md-layout-item md-size-65 transition36 bg-white",
        openOn: "right",
        props: {
          event: this.event,
          proposal: proposal,
          selectedBlock: this.selectedBlock,
        },
      });
    },
    manageProposalsAccept(proposal) {
      window.currentPanel = this.$showPanel({
        component: ManageProposalsAccept,
        cssClass: "md-layout-item md-size-65 transition36 bg-grey",
        openOn: "right",
        props: {
          event: this.event,
          proposal: proposal,
          selectedBlock: this.selectedBlock,
        },
      });
    },
    getProposalDate(eventStartMillis) {
      let x = new Date(eventStartMillis);
      return moment(x).fromNow();
    },
    showVendorDetail(vendor) {
      window.currentPanel = this.$showPanel({
        component: companyForm,
        cssClass: "md-layout-item md-size-60 transition36 ",
        openOn: "right",
        disableBgClick: false,
        props: {
          categories: this.buildingBlocksList,
          selected_vendor: vendor,
          creation_mode: false,
        },
      });
    },
    addToCompare(proposalId) {
      /* if ( this.selectedBlock.proposalComparison.length < 3 ) {
        this.selectedBlock.proposalComparison.push(proposalId);
      } else {
        this.selectedBlock.proposalComparison.splice(0,1);
        this.selectedBlock.proposalComparison.push(proposalId);
      } */
      if (!this.selectedBlock.proposalComparison1) {
        this.selectedBlock.proposalComparison1 = proposalId;
      } else if (!this.selectedBlock.proposalComparison2) {
        this.selectedBlock.proposalComparison2 = proposalId;
      } else if (!this.selectedBlock.proposalComparison3) {
        this.selectedBlock.proposalComparison3 = proposalId;
      } else {
        this.selectedBlock.proposalComparison1 = this.selectedBlock.proposalComparison2;
        this.selectedBlock.proposalComparison2 = this.selectedBlock.proposalComparison3;
        this.selectedBlock.proposalComparison3 = proposalId;
      }
      this.updateEventComponent();
    },
    removeFromCompare(proposalId) {
      /* let i = _.indexOf( this.selectedBlock.proposalComparison, proposalId );

      if ( i !== -1 ) {
        this.selectedBlock.proposalComparison.splice( i, 1 );
      } */

      if (this.selectedBlock.proposalComparison1 === proposalId) {
        this.selectedBlock.proposalComparison1 = null;
      } else if (this.selectedBlock.proposalComparison2 === proposalId) {
        this.selectedBlock.proposalComparison2 = null;
      } else if (this.selectedBlock.proposalComparison3 === proposalId) {
        this.selectedBlock.proposalComparison3 = null;
      }

      let count = 0;
      if (this.selectedBlock.proposalComparison1) {
        count++;
      }
      if (this.selectedBlock.proposalComparison2) {
        count++;
      }
      if (this.selectedBlock.proposalComparison3) {
        count++;
      }

      this.updateEventComponent();
      this.$emit("update-comparison", count);
    },
    manageVendors() {
      // this.$router.push({ path: `/vendors-pool`});
      window.currentPanel = this.$showPanel({
        component: VendorsPoolPanel,
        cssClass: "md-layout-item md-size-85 transition36 bg-grey",
        openOn: "right",
        props: {},
      });

      let slideoutPanelBg = document.getElementsByClassName("slideout-panel-bg");
      if (slideoutPanelBg && slideoutPanelBg.length > 0) {
        slideoutPanelBg[0].style = "z-index: 101";
      }
      window.currentPanel.promise.then((res) => {
        if (slideoutPanelBg && slideoutPanelBg.length > 0) {
          slideoutPanelBg[0].style = "z-index: 100";
        }
      });
    },
    addedToCompare(proposalId) {
      // let isExists = _.indexOf( this.selectedBlock.proposalComparison, proposalId ) !== -1;
      let count = 0;
      if (this.selectedBlock.proposalComparison1) {
        count++;
      }
      if (this.selectedBlock.proposalComparison2) {
        count++;
      }
      if (this.selectedBlock.proposalComparison3) {
        count++;
      }

      this.$emit("update-comparison", count);

      // this.updateEventComponent();
      if (this.selectedBlock.proposalComparison1 === proposalId) {
        return true;
      } else if (this.selectedBlock.proposalComparison2 === proposalId) {
        return true;
      } else if (this.selectedBlock.proposalComparison3 === proposalId) {
        return true;
      }

      return false;
    },
    updateEventComponent() {
      let calendar = new Calendar({
        id: this.$auth.user.defaultCalendarId,
      });
      let event = new CalendarEvent({
        id: this.event.id,
      });
      let selected_block = new EventComponent({
        id: this.selectedBlock.id,
      });

      selected_block.proposalComparison1 = this.selectedBlock.proposalComparison1;
      selected_block.proposalComparison2 = this.selectedBlock.proposalComparison2;
      selected_block.proposalComparison3 = this.selectedBlock.proposalComparison3;
      selected_block
        .for(calendar, event)
        .save()
        .then((resp) => {})
        .catch((error) => {
          console.log("EventComponentVendor error =>", error);
        });
    },
  },
  created() {},
  mounted() {
    this.getBlockVendors();
  },
  computed: {},
  watch: {
    searchQuery(newVal, oldVal) {
      this.filterVendors();
    },
    blockVendors(newVal, oldVal) {
      // this.getBlockVendors();
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.md-tooltip {
  z-index: 9999 !important;
  background: $purple-500 !important;
  color: white !important;

  &[x-placement="top"]:after {
    border-bottom-color: $purple-500 !important;
  }

  &[x-placement="bottom"]:after {
    border-bottom-color: $purple-500 !important;
  }

  &[x-placement="right"]:after {
    border-bottom-color: $purple-500 !important;
  }

  &[x-placement="left"]:after {
    border-bottom-color: $purple-500 !important;
  }
}
</style>
