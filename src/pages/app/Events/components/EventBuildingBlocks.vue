<template>
  <div class="md-layout">
    <div class="md-layout-item mx-auto event-building-blocks">
      <md-card>
        <md-card-header class="md-card-header-icon md-card-header-rose">
          <div class="md-layout-item show-cost-switch">
            <h4 class="title profile-title title-summary">Budget Table</h4>
            <label>Show Cost:</label>
            <md-field class="no-border">
              <label></label>
              <md-select class="select-elements-budget" v-model="elementsBudget">
                <md-option value="event">Per Event</md-option>
                <md-option value="guest">Per Guest</md-option>
              </md-select>
            </md-field>
            <md-button class="md-default md-simple add-new-block-btn no-padding" @click="showAddEventElementsModal()">
              <md-icon>add</md-icon>Add New
            </md-button>
          </div>
        </md-card-header>

        <md-card-content class="md-layout">
          <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" />
          <table class="table event-building-blocks_table w-100">
            <thead>
              <tr class="md-warning">
                <th>Element</th>
                <!--                <th>Brief</th>-->
                <th>Budget</th>
                <th>Actual cost</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody v-if="eventBuildingBlocks.length">
              <!-- <template v-for="(block, index) in eventBuildingBlocks"> -->
              <!-- <tr class="parent">
                  <td>{{category.title}}</td>
                  <td></td>
                  <td class="allocated-budget">
                    <div class="md-table-cell-container">
                      <span class="dollar-sign pull-left small">$</span>
                      <span style="display: inline-block; width: 100%; padding-right: 16px;">
                        {{event.elementsBudgetPerGuest ? (category.totalAllocatedBudget / event.numberOfParticipants).toFixed(2) : category.totalAllocatedBudget.toFixed(2)}}
                      </span>
                      <span class="remains-budget badge badge-rose small" style="background-color: #fff;" v-if="category.remainsBudget">-${{parseInt(category.remainsBudget)}}</span>
                    </div>
                  </td>
                  <td class="actual-cost" :class="{disabled : category.totalActualCost==0}">
                    <span class="dollar-sign pull-left small">$</span>
                    {{event.elementsBudgetPerGuest ? (category.totalActualCost / event.numberOfParticipants).toFixed(2) : category.totalActualCost.toFixed(2)}}
                  </td>
                  <td></td>
              </tr>-->
              <tr
                class="text-left"
                v-for="(block, index) in eventBuildingBlocks"
                :key="index"
                @mouseover="setCurrentBlockId(block)"
                @mouseout="setCurrentBlockId(null)"
              >
                <td>
                  <span class="span-element">{{ block.title }}</span>
                  <span class="span-users-count pull-right" v-if="elementsBudget === 'guest'">
                    <i class="fa fa-user"></i>
                    {{ block.numberOfParticipants ? block.numberOfParticipants : event.numberOfParticipants }}
                  </span>
                </td>
                <!--                  <td class="fit-content">-->
                <!--                    <template>-->
                <!--                      <div v-if="block.valuesCount && block.proposalsState != 'get-offers'" class="cursor-pointer">-->
                <!--                        <md-button class="md-simple md-xs requirements-cell-button no-padding"-->
                <!--                                    @click="addRequirements(block)">-->
                <!--                          &lt;!&ndash; {{`${block.valuesCount} selected`}} &ndash;&gt;-->
                <!--                          Edit-->
                <!--                        </md-button>-->
                <!--                      </div>-->
                <!--                      <template v-else>-->
                <!--                        <md-button class="md-info md-xs md-warning btn-add no-padding" @click="addRequirements(block)">-->
                <!--                          Add+-->
                <!--                        </md-button>-->
                <!--                      </template>-->
                <!--                    </template>-->
                <!--                  </td>-->
                <td
                  class="fit-content w-20 allocated-budget"
                  :class="{ required: !block.allocatedBudget || block.allocatedBudget === 0 }"
                >
                  <div class="md-table-cell-container">
                    <label-edit
                      v-if="!event.elementsBudgetPerGuest"
                      :text="block.allocatedBudget"
                      :field-name="block.componentId"
                      :sub-description="elementsBudget"
                      :currency="'$'"
                      :numeric="true"
                      @text-updated-blur="blockBudgetChanged"
                      @text-updated-enter="blockBudgetChanged"
                    ></label-edit>

                    <label-edit
                      v-else-if="block.allocatedBudget && block.numberOfParticipants"
                      :text="
                        block.allocatedBudget
                          ? (block.allocatedBudget / block.numberOfParticipants).toFixed(2).toString()
                          : ''
                      "
                      :field-name="block.componentId"
                      :sub-description="elementsBudget"
                      :currency="'$'"
                      :numeric="true"
                      @text-updated-blur="blockBudgetChanged"
                      @text-updated-enter="blockBudgetChanged"
                    ></label-edit>
                    <label-edit
                      v-else
                      :text="
                        block.allocatedBudget
                          ? (block.allocatedBudget / event.numberOfParticipants).toFixed(2).toString()
                          : ''
                      "
                      :field-name="block.componentId"
                      :sub-description="elementsBudget"
                      :currency="'$'"
                      :numeric="true"
                      @text-updated-blur="blockBudgetChanged"
                      @text-updated-enter="blockBudgetChanged"
                    ></label-edit>
                  </div>
                </td>
                <td class="actual-cost">
                  <template v-if="block.allocatedBudget">
                    <template v-if="block.winningProposalId">
                      <md-button
                        class="md-simple actual-cost md-xs"
                        :class="block.allocatedBudget < block.winingProposal.cost ? `md-danger` : `md-success`"
                      >
                        {{
                          event.elementsBudgetPerGuest
                            ? `$${(block.winingProposal.cost / event.numberOfParticipants).toFixed(2)}`
                            : `$${block.winingProposal.cost.toFixed(2)}`
                        }}
                        <md-icon>open_in_new</md-icon>
                      </md-button>
                    </template>
                  </template>
                  <!-- v-if="block.downPaymentStatus==='accepted'" -->
                  <event-actual-cost-icon-tooltip :icon="'credit_card'" :item="block" :event="event" />
                </td>
                <td class="fit-content text-center">
                  <template>
                    <template v-if="block.winningProposalId">
                      <md-button
                        class="md-success md-sm btn-view-order"
                        @click="reviewProposals(block, block.winningProposalId)"
                        >View Order</md-button
                      >
                    </template>
                    <template
                      v-else-if="
                        block.proposalsState === 'show-proposals' || block.proposalsState === 'waiting-for-proposals'
                      "
                    >
                      <md-button class="md-sm md-danger btn-proposal" @click="reviewProposals(block)">
                        Manage proposals
                        <!-- ({{block.proposalsCount}}) -->
                      </md-button>
                    </template>
                    <template v-else-if="block.proposalsState === 'get-offers'">
                      <md-button class="md-sm md-primary btn-view-order" @click="reviewProposals(block)">
                        Get Proposals
                        <!-- <md-icon>near_me</md-icon> -->
                      </md-button>
                    </template>
                  </template>
                </td>
                <td class="w-5 text-right">
                  <a
                    href="#"
                    class="no-padding pull-right"
                    v-if="currentBlockId === block.id"
                    @click="deleteBlock(block.id)"
                  >
                    <md-icon @click="deleteBlock(block.id)">close</md-icon>
                  </a>
                </td>
              </tr>
              <!-- </template> -->
            </tbody>
          </table>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import Swal from "sweetalert2";
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import EventComponent from "@/models/EventComponent";
import VueElementLoading from "vue-element-loading";
// import auth from '@/auth';
import EventBlocks from "../components/NewEventBlocks";
import AddBuildingBlockModal from "../components/EventBlocks/Modals/AddBuildingBlocks.vue";
import AddEventElementsModal from "../components/EventBlocks/Modals/AddEventElements.vue";
import EventBlockRequirements from "../components/EventBlocks/Modals/EventBlockRequirements.vue";
import EventActualCostIconTooltip from "../components/EventActualCostIconTooltip.vue";
import EventBlockVendors from "./EventBlocks/Modals/EventBlockVendors.vue";
import ViewProposals from "./EventBlocks/Modals/ViewProposals.vue";
import EventComponentVendor from "@/models/EventComponentVendor";
import _ from "underscore";
import { LabelEdit, AnimatedNumber, StatsCard, ChartCard } from "@/components";

export default {
  name: "event-building-blocks",
  components: {
    VueElementLoading,
    EventBlocks,
    AddBuildingBlockModal,
    LabelEdit,
    AnimatedNumber,
    StatsCard,
    ChartCard,
    EventActualCostIconTooltip,
  },
  props: {
    event: {
      type: Object,
      default: () => {
        return { statistics: {} };
      },
    },
    eventComponents: [Array, Function],
  },
  data: () => ({
    // auth: auth,
    isLoading: false,
    allocatedBudget: 0,
    eventBuildingBlocks: [],
    eventBuildingBlocksList: [],
    currentBlockId: null,
    elementsBudget: "event",
  }),
  methods: {
    ...mapMutations("EventPlannerVuex", ["setBuildingBlockModal"]),
    deleteBlock(blockId) {
      Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        showCancelButton: true,
        confirmButtonClass: "md-button md-success",
        cancelButtonClass: "md-button md-danger",
        confirmButtonText: "Yes, delete it!",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.isLoading = true;

          let calendar = new Calendar({
            id: this.$auth.user.defaultCalendarId,
          });
          let event = new CalendarEvent({ id: this.event.id });
          let selected_block = new EventComponent({ id: blockId });

          selected_block
            .for(calendar, event)
            .delete()
            .then((resp) => {
              this.isLoading = false;
              this.event.components.splice(
                _.findIndex(this.eventBuildingBlocks, (b) => {
                  return b.id === selected_block.id;
                }),
                1,
              );
              this.getEventBuildingBlocks();
              this.$root.$emit("RefreshStatistics");
              this.$forceUpdate();

              let allocatedBudget = 0;
              this.eventBuildingBlocks.forEach((item) => {
                allocatedBudget += Number(item.allocatedBudget);
              });

              this.allocatedBudget = allocatedBudget;
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    /**
     * Get Event building blocks
     */
    getEventBuildingBlocks() {
      if (!this.event.id) return;

      this.isLoading = true;

      let res = this.event.components;
      this.$set(this, "eventBuildingBlocks", res);
      setTimeout(() => {
        this.isLoading = false;
      }, 500);

      this.$forceUpdate();
    },
    showAddBuildingBlocksModal() {
      window.currentPanel = this.$showPanel({
        component: AddBuildingBlockModal,
        cssClass: "md-layout-item md-size-35 transition36 bg-grey",
        openOn: "right",
        props: { event: this.event },
      });
      window.currentPanel.promise.then((res) => {
        this.event.components.push(JSON.parse(JSON.stringify(res)));
        this.getEventBuildingBlocks();
      });
    },
    showAddEventElementsModal() {
      window.currentPanel = this.$showPanel({
        component: AddEventElementsModal,
        cssClass: "md-layout-item md-size-35 transition36 bg-grey",
        openOn: "right",
        props: {
          event: this.event,
          eventBuildingBlocks: this.eventBuildingBlocks,
        },
      });
      window.currentPanel.promise.then((res) => {
        if (res.length > 0) {
          res.forEach((item) => {
            this.event.components.push(JSON.parse(JSON.stringify(item)));
          });
        }
        this.getEventBuildingBlocks();
      });
    },
    blockBudgetChanged(val, index) {
      let block = _.find(this.eventBuildingBlocks, function (item) {
        return item.componentId === index;
      });

      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: this.event.id });
      let selected_block = new EventComponent({ id: block.id });

      selected_block.calendarEvent = block.calendarEvent;
      selected_block.componentId = block.componentId;
      selected_block.icon = block.icon;
      selected_block.color = block.color;
      selected_block.todos = block.todos;
      selected_block.values = block.values;
      selected_block.vendors = block.vendors;

      console.log(val);
      if (val) {
        if (val.toString().toLowerCase() === "click to set") {
          selected_block.allocatedBudget = null;
          block.allocatedBudget = null;
        } else {
          if (block.allocatedBudget && block.numberOfParticipants) {
            selected_block.allocatedBudget = !this.event.elementsBudgetPerGuest
              ? val
              : val * block.numberOfParticipants;
            block.allocatedBudget = !this.event.elementsBudgetPerGuest ? val : val * block.numberOfParticipants;
          } else {
            selected_block.allocatedBudget = !this.event.elementsBudgetPerGuest
              ? val
              : val * this.event.numberOfParticipants;
            block.allocatedBudget = !this.event.elementsBudgetPerGuest ? val : val * this.event.numberOfParticipants;
          }
        }
      } else {
        selected_block.allocatedBudget = null;
        block.allocatedBudget = null;
      }

      selected_block
        .for(calendar, event)
        .save()
        .then((resp) => {
          this.isLoading = false;
          this.$root.$emit("RefreshStatistics");
          this.getEventBuildingBlocks();
          this.$forceUpdate();

          let allocatedBudget = 0;
          this.eventBuildingBlocks.forEach((item) => {
            if (item.allocatedBudget) {
              allocatedBudget += Number(item.allocatedBudget);
            }
          });

          this.allocatedBudget = allocatedBudget;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    addRequirements(item) {
      if (item.proposalsCount) {
        Swal.fire({
          text: `You have offers based on these requirements, after changing them you will need to request updated proposal. Would you like to proceed?`,
          showCancelButton: true,
          icon: "warning",
          confirmButtonClass: "md-button md-success confirm-btn-bg ",
          cancelButtonClass: "md-button md-danger cancel-btn-bg",
          confirmButtonText: "Yes!",
          buttonsStyling: false,
        }).then((result) => {
          if (result.value) {
            this.showRequirementsSidepanel(item);
          }
        });
      } else {
        this.showRequirementsSidepanel(item);
      }
    },
    reviewProposals(item, winnerId = null) {
      window.currentPanel = this.$showPanel({
        component: ViewProposals,
        cssClass: "md-layout-item md-size-70 transition36 bg-grey",
        openOn: "right",
        props: {
          event: this.event,
          selectedBlock: item,
          winnerId: winnerId,
          tab: winnerId != null ? 3 : 1,
        },
      });
    },
    reviewVendors(item, categoryTitle) {
      window.currentPanel = this.$showPanel({
        component: EventBlockVendors,
        cssClass: "md-layout-item md-size-65 transition36 bg-white",
        openOn: "right",
        props: {
          event: this.event,
          selectedBlock: item,
          getOffers: true,
          categoryTitle: categoryTitle,
        },
      });
      window.currentPanel.promise.then((res) => {
        let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
        let event = new CalendarEvent({ id: this.event.id });
        new EventComponent()
          .for(calendar, event)
          .find(item.id)
          .then((component) => {
            this.event.components.splice(
              _.findIndex(this.event.components, (b) => {
                return b.id === item.id;
              }),
              1,
            );
            this.event.components.push(JSON.parse(JSON.stringify(component)));
            this.getEventBuildingBlocks();
          });
      });
    },
    showRequirementsSidepanel(item, winnerId = null) {
      const panelResult = this.$showPanel({
        component: ViewProposals,
        cssClass: "md-layout-item md-size-70 transition36 bg-grey",
        openOn: "right",
        props: {
          event: this.event,
          selectedBlock: item,
          winnerId: winnerId,
          tab: 0,
        },
      });

      panelResult.promise.then((res) => {
        this.getEventBuildingBlocks();
      });
    },
    switchingBudgetAndCost() {
      let vm = this;
      vm.event.elementsBudgetPerGuest = !vm.event.elementsBudgetPerGuest;
    },
    setCurrentBlockId: function (currentBlock) {
      if (currentBlock) {
        this.currentBlockId = currentBlock.id;
      } else {
        this.currentBlockId = null;
      }
    },
  },
  created() {},
  mounted() {
    this.getEventBuildingBlocks();

    this.$root.$on("refreshBuildingBlock", () => {
      this.getEventBuildingBlocks();
    });
  },
  watch: {
    event(newVal, oldVal) {
      // Get default event building blocks
      this.getEventBuildingBlocks();
    },
    eventComponents(newVal, oldVal) {
      // Get default event building blocks
      this.getEventBuildingBlocks();
    },
    elementsBudget(val) {
      this.switchingBudgetAndCost();
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/scss/md/_colors.scss";
.requirements-cell-button {
  width: 48px;
  min-width: 48px;
  .md-ripple {
    width: 48px;
    min-width: 48px;
  }
  &.md-icon:hover {
    visibility: hidden;
  }
  &.md-icon:hover {
    visibility: visible;
  }
}
.btn-add {
  border-radius: 3px;
  width: 48px;
  min-width: 48px;
  .md-ripple {
    width: 48px;
    min-width: 48px;
  }
}
.add-new-block-btn {
  .md-ripple {
    padding: 10px 0 !important;
    text-align: left;
    color: #ff4470 !important;
    font-weight: 500 !important;
    font-size: 12px !important;
    .md-button-content {
      i {
        color: #ff4470 !important;
      }
    }
    &:hover {
      color: #999999 !important;
    }
  }
}
.select-elements-budget {
  & > input[type="text"] {
    font-size: 14px !important;
  }
}
.no-border {
  &:before {
    border: 2px solid white;
  }
}
.span-element {
  font-weight: 400;
}
.span-users-count {
  color: #999999;
  font-size: 14px;
}
.w-100 {
  width: 100% !important;
}
.cursor-pointer {
  cursor: pointer !important;
}
</style>
