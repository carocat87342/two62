<template>
  <div class="manage-proposals-panel">
    <div class="md-layout maxh-50vh">
      <!-- <div class="md-layout-item md-size-5" style="padding: 0; margin: 0;">
        <h4 class="md-title">
          <md-button @click="closePanel" class="md-button md-theme-default md-simple md-just-icon">
            <md-icon>arrow_back</md-icon>
          </md-button>
        </h4>
      </div> -->
      <div class="md-layout-item md-size-100 maxh-50vh">
        <h4 class="md-title">
          {{ selectedBlock.title }}
        </h4>
        <div class="tabs-section">
          <tabs
            :tab-name="[
              '<span>1</span> Brief (' + requirementsLength + ')',
              '<span>2</span> Manage Proposals (' + proposalsNumber + ')',
              '<span>3</span> Compare (' + comparisonsNumber + ')',
              '<span>4</span> Accepted (' + acceptedNumber + ')',
            ]"
            color-button="danger"
            ref="proposalsTabs"
            :activeTab="1"
          >
            <template slot="tab-pane-1" class="w-100p">
              <event-block-requirements
                :event.sync="event"
                :selectedBlock.sync="selectedBlock"
                :predefinedRequirements="selectedBlock.predefinedRequirements"
              >
              </event-block-requirements>
            </template>
            <template slot="tab-pane-2" class="w-100p">
              <event-block-proposal-vendors
                :event="event"
                :selectedBlock.sync="selectedBlock"
                @update-comparison="updateComparison"
              ></event-block-proposal-vendors>
            </template>
            <template slot="tab-pane-3" class="w-100p">
              <div class="pl-6">
                <event-block-comparison
                  :event.sync="event"
                  :selectedBlock.sync="selectedBlock"
                  :blockVendors.sync="blockVendors"
                ></event-block-comparison>
              </div>
            </template>
            <template slot="tab-pane-4" class="w-100p">
              <div>
                <event-block-acceptance
                  :event="event"
                  :selectedBlock.sync="selectedBlock"
                  @update-comparison="updateComparison"
                ></event-block-acceptance>
              </div>
            </template>
          </tabs>
          <md-card class="allocated-budget">
            <md-card-content>
              <span class="small">Allocated Budget</span>
              <div class="budget">${{ selectedBlock.allocatedBudget ? selectedBlock.allocatedBudget : "0.0" }}</div>
            </md-card-content>
          </md-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import auth from '@/auth';
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import CalendarEvent from "@/models/CalendarEvent";
import Calendar from "@/models/Calendar";
import EventComponent from "@/models/EventComponent";
import EventComponentVendor from "@/models/EventComponentVendor";
import { Tabs } from "@/components";

import Swal from "sweetalert2";
import { error } from "util";
import moment from "moment";
import VueElementLoading from "vue-element-loading";
import _ from "underscore";
import EventBlockRequirements from "../Modals/EventBlockRequirements.vue";
import EventBlockProposalVendors from "../Modals/EventBlockProposalVendors.vue";
import EventBlockComparison from "../Modals/EventBlockComparison";
import EventBlockAcceptance from "../Modals/EventBlockAcceptance";

export default {
  components: {
    VueElementLoading,
    Tabs,
    EventBlockRequirements,
    EventBlockProposalVendors,
    EventBlockComparison,
    EventBlockAcceptance,
  },
  props: {
    event: Object,
    vendor: Object,
    selectedBlock: Object,
    winnerId: {
      type: String,
      default: null,
    },
    tab: Number,
  },
  data: () => ({
    // auth: auth,
    isLoading: false,
    proposalsToDisplay: 1,
    requirementsLength: 0,
    comparisonsNumber: 0,
    acceptedNumber: 0,
    blockVendors: null,
  }),

  created() {
    console.log("selectedBlock => ", this.selectedBlock);

    this.$root.$on("requirement-saved", (requirement) => {
      this.updateBlockStatus();
    });
  },
  mounted() {
    this.requirementsLength = this.selectedBlock.valuesCount;

    this.$nextTick(() => {
      if (this.$refs.proposalsTabs) {
        this.$refs.proposalsTabs.$emit("event-planner-nav-switch-panel", this.tab);
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
        this.updateComparison(count);
      }
    });
    this.getBlockVendors();
  },
  methods: {
    closePanel() {
      this.$emit("closePanel", { a: "b" });
    },
    setAsWining(item) {
      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: this.event.id });
      let selected_block = new EventComponent({ id: this.selectedBlock.id });

      selected_block.calendarEvent = this.selectedBlock.calendarEvent;
      selected_block.componentId = this.selectedBlock.componentId;

      selected_block.winningProposalId = item.id;

      selected_block
        .for(calendar, event)
        .save()
        .then((resp) => {
          this.isLoading = false;
          this.$notify({
            message: "Budget modified successfully!",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "success",
          });

          this.$root.$emit("RefreshStatistics");
          this.$root.$emit("refreshBuildingBlock");
          this.closePanel();

          this.$forceUpdate();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateBlockStatus() {
      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: this.event.id });
      let selected_block = new EventComponent({ id: this.selectedBlock.id });

      selected_block.calendarEvent = this.selectedBlock.calendarEvent;
      selected_block.componentId = this.selectedBlock.componentId;

      selected_block.proposalsState = "requirements-entered";

      selected_block
        .for(calendar, event)
        .save()
        .then((resp) => {
          console.log(resp);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    viewAllProposals() {
      this.proposalsToDisplay = this.selectedBlock.vendors.length;
    },
    isThereProposals() {
      return this.selectedBlock.proposals && this.selectedBlock.proposals.length;
    },
    updateComparison(item) {
      this.comparisonsNumber = item;
      this.$forceUpdate();
    },
    getBlockVendors() {
      this.isLoading = true;

      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: this.event.id });
      let selected_block = new EventComponent({ id: this.selectedBlock.id });

      new EventComponentVendor()
        .for(calendar, event, selected_block)
        .get()
        .then((resp) => {
          this.isLoading = false;
          this.blockVendors = resp;

          let vendorsWithProposals = _.filter(this.blockVendors, function (item) {
            return item.proposals && item.proposals.length;
          });

          let acceptedProposals = 0;

          _.each(vendorsWithProposals, (v) => {
            let accepted = v.proposals[0].accepted;

            if (accepted) {
              acceptedProposals += 1;
            }
          });

          this.acceptedNumber = acceptedProposals;
        })
        .catch((error) => {
          this.isLoading = false;
          console.log("EventComponentVendor error =>", error);
        });
    },
  },
  computed: {
    proposalsNumber() {
      return this.selectedBlock.proposalsCount;
    },
  },
};
</script>

<style lang="scss" scoped>
.allocated-budget {
  display: none;
  height: 45px !important;
  .md-card-content {
    border: 2px solid black;
    .small {
      margin-top: -35px;
      margin-bottom: 12.5px;
    }
  }
}
.w-100p {
  width: 100%;
}
.maxh-50vh {
  max-height: 50vh;
}
.md-title {
  margin-bottom: 0;
  line-height: 51px;
  text-transform: capitalize;
}
.pl-6 {
  padding-left: 6px;
}
</style>
