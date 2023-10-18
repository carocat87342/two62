<template>
  <div class="event-budget-vendors">
    <table class="event-blocks__table">
      <thead>
        <tr>
          <th width="40%">Vendor</th>
          <th width="25%">Planned</th>
          <th width="15%">Booked</th>
          <th width="10%">Status</th>
          <th></th>
        </tr>
      </thead>
    </table>

    <!-- Event Blocks -->
    <!-- <draggable :list="eventBuildingBlocks"> -->
    <event-budget-vendors-item
      v-for="block in eventCategoryList"
      :event="event"
      :eventCategoryItem="block"
      :key="block.id"
      :type="type"
      :editingMode="editingMode"
      @update="updateCategoryBudget"
      @delete="deleteCategory"
      @addVendor="addMyVendor"
    ></event-budget-vendors-item>

    <table
      class="event-blocks__table event-block-table"
      :style="editingMode ? `border-left: 10px solid #80B93D;color:#80B93D` : `border: 2px solid #80B93D;color:#80B93D`"
    >
      <tbody>
        <tr class="unexpected-budget">
          <td width="40%" class="event-block-element unexpected">
            <img
              :src="editingMode ? `${$iconURL}Budget Elements/unexpected.svg` : `/static/icons/budget/unexpected.png`"
            />
            Unexpected
          </td>
          <td width="20%" class="planned unexpected">$ {{ event.unexpectedBudget | withComma(Number) }}</td>
          <td width="15%" class="actual red-label"></td>
          <td width="15%" class="status"></td>
          <td class="expand"></td>
        </tr>
      </tbody>
    </table>
    <table
      class="event-blocks__table event-block-table"
      :style="editingMode ? `border-left: 10px solid #818080;color:#818080` : `border: 2px solid #818080;color:#80B93D`"
    >
      <tbody>
        <tr class="extra">
          <td width="40%" class="event-block-element extra">
            <img
              :src="editingMode ? `${$iconURL}budget screen/SVG/extra-gray.svg` : `/static/icons/budget/extra-gray.png`"
            />
            Extras
          </td>
          <td width="20%" class="planned">$ {{ (event.allocatedTips + event.allocatedFees) | withComma(Number) }}</td>
          <td width="15%" class="actual red-label"></td>
          <td width="15%" class="status"></td>
          <td class="expand">
            <div @click="showTips = !showTips" class="text-right">
              <img :src="`${$iconURL}budget+screen/SVG/Asset+23.svg`" :class="{ expanded: showTips }" />
            </div>
          </td>
        </tr>
        <template v-if="showTips">
          <tr class="extra">
            <td width="40%" class="event-block-element extra">
              <img
                :src="editingMode ? `${$iconURL}budget screen/SVG/tips-gray.png` : `/static/icons/budget/tips-gray.png`"
              />

              Tips 12%
            </td>
            <td width="20%" class="planned">
              $ {{ event.allocatedTips | withComma(Number) }}
              <md-button class="md-rose md-sm md-simple edit-btn" @click="showEditElementBudget()" v-if="!editTips"
                >Edit</md-button
              >
              <img
                :src="`${$iconURL}Event Page/arrow-left-gray.svg`"
                v-else
                style="width: 25px; float: right; margin: 3px 0px"
              />
            </td>
            <template v-if="!editTips">
              <td width="15%" class="actual red-label"></td>
              <td width="15%" class="status"></td>
              <td class="expand"></td>
            </template>
            <template v-if="editTips">
              <td colspan="3" align="right" style="white-space: nowrap">
                <!-- <input class="inline-input" v-model="newAllocatedTips" /> -->
                <maryoku-input
                  v-model="newAllocatedTips"
                  inputStyle="budget"
                  size="small"
                  style="width: 150px; display: inline-block"
                  @focus="$event.target.select()"
                ></maryoku-input>
                <md-button class="md-simple md-black normal-btn" @click="editTips = false" style="height: 50px"
                  >cancel</md-button
                >
                <md-button class="md-red normal-btn" @click="updateTips()" style="height: 50px">save</md-button>
              </td>
            </template>
          </tr>
          <tr class="extra">
            <td colspan="5">
              <hr />
            </td>
          </tr>
          <tr class="extra">
            <td width="40%" class="event-block-element extra">
              <img
                :src="editingMode ? `${$iconURL}budget screen/SVG/fees-gray.svg` : `/static/icons/budget/fees-gray.png`"
              />

              Fees 3%
            </td>
            <td width="20%" class="planned">$ {{ event.allocatedFees | withComma(Number) }}</td>
            <td width="15%" class="actual red-label"></td>
            <td width="15%" class="status"></td>
            <td class="expand"></td>
          </tr>
        </template>
      </tbody>
    </table>
    <table
      class="event-blocks__table event-block-table"
      :style="editingMode ? `border-left: 10px solid #0047cc` : `border: 1px solid #0047cc`"
    >
      <tbody>
        <tr class="unused-budget">
          <td width="40%" class="event-block-element unused-budget">
            <img
              :src="editingMode ? `${$iconURL}budget+screen/SVG/Asset+487.svg` : `/static/icons/budget/unused.png`"
            />
            Unused
          </td>
          <td width="20%" class="planned">$ {{ unusedBudget | withComma(Number) }}</td>
          <td width="15%" class="actual red-label"></td>
          <td width="15%" class="status"></td>
          <td class="expand"></td>
        </tr>
      </tbody>
    </table>
    <!-- </draggable> -->

    <table class="event-blocks__table actions-table">
      <tbody>
        <tr class="total">
          <td class="total-title" width="40%">Total</td>
          <td width="20%" class="total-value">${{ Math.round(event.totalBudget) | roundNumber | withComma(Number) }}</td>
          <td width="15%" class="total-value">${{ bookedTotal | withComma(Number) }}</td>
          <td colspan="2"></td>
        </tr>
        <tr class="add-category" v-if="canEdit && editingMode">
          <td colspan="5">
            <md-button class="md-simple add-category-btn" @click="showCategoryModal = true">
              <img src="https://static-maryoku.s3.amazonaws.com/storage/icons/budget+screen/SVG/Asset%2019.svg" />
              Add new category
            </md-button>
          </td>
        </tr>
      </tbody>
    </table>

    <add-new-category-modal
      v-if="showCategoryModal"
      :event="event"
      :components="filteredEventBlocks"
      @cancel="showCategoryModal = false"
      @save="addBuildingBlock"
    ></add-new-category-modal>

    <budget-handle-minus-modal
      v-if="showMinusHandleModal"
      :value="overAddedValue"
      @select="handleMinusBudget"
    ></budget-handle-minus-modal>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import Multiselect from "vue-multiselect";
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import EventComponent from "@/models/EventComponent";
import EventCategory from "@/models/EventCategory";
import EventComponentTodo from "@/models/EventComponentTodo";
import EventComponentValue from "@/models/EventComponentValue";
import Occasion from "@/models/Occasion";
import { Modal, LabelEdit } from "@/components";
import Popup from "@/components/Popup";
// import auth from '@/auth';
import AddBuildingBlockModal from "../components/EventBlocks/Modals/AddBuildingBlocks.vue";
import AddEventElementsModal from "../components/EventBlocks/Modals/AddEventElements.vue";
import EventActualCostIconTooltip from "../components/EventActualCostIconTooltip.vue";
import EventBlockVendors from "./EventBlocks/Modals/EventBlockVendors.vue";
import ViewProposals from "./EventBlocks/Modals/ViewProposals.vue";
import _ from "underscore";
import draggable from "vuedraggable";
import BudgetHandleMinusModal from "@/components/Modals/BudgetHandleMinusModal";
import BudgetResizeModal from "@/components/Modals/BudgetResizeModal";
import AddMyVendorModal from "@/components/Modals/AddMyVendorModal";
import MaryokuInput from "@/components/Inputs/MaryokuInput.vue";
import EventComponentVendorItem from "./EventComponentVendorItem";
import AddNewCategoryModal from "@/components/Modals/AddNewCategoryModal";
import Swal from "sweetalert2";
import EventBudgetVendorsItem from "./EventBudgetVendorsItem";
export default {
  name: "event-budget-vendors",
  components: {
    LabelEdit,
    EventActualCostIconTooltip,
    Modal,
    draggable,
    BudgetHandleMinusModal,
    Multiselect,
    AddMyVendorModal,
    EventComponentVendorItem,
    Popup,
    MaryokuInput,
    AddNewCategoryModal,
    BudgetResizeModal,
    EventBudgetVendorsItem,
  },
  props: {
    eventComponents: [Array, Function],
    type: {
      type: String,
      default: "total",
    },
    editingMode: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    // auth: auth,
    isLoading: false,
    allocatedBudget: 0,
    remainingBudget: 0,
    eventBuildingBlocks: [],
    eventBuildingBlocksList: [],
    currentBlockId: null,
    elementsBudget: "event",
    show: false,
    totalBudget: 0,
    totalActual: 0,
    totalBudgetTaxes: 0,
    showCategoryModal: false,
    timelineIconsURL: "https://static-maryoku.s3.amazonaws.com/storage/icons/timeline/svg/",
    iconsURL: "https://static-maryoku.s3.amazonaws.com/storage/icons/Event%20Page/",
    menuIconsURL: "https://static-maryoku.s3.amazonaws.com/storage/icons/menu%20_%20checklist/SVG/",
    locationsList: [
      "San Francisco, California",
      "Los Angeles, California",
      "Jacksonville, Florida",
      "Miami, Florida",
      "NYC, New York",
      "Austin, Texas",
      "Huston, Texas",
    ],
    categoryBuildingBlocks: null,
    filteredEventBlocks: null,
    newBuildingBlock: {
      category: "",
      name: "",
      budget: "",
    },
    showMinusHandleModal: false,
    showResizeModal: false,
    overAddedValue: 0,
    showAddMyVendor: false,
    selectedComponent: null,
    showTips: false,
    editTips: false,
    newAllocatedTips: 0,
    calendar: null,
  }),
  computed: {
    ...mapGetters({
      components: "event/getComponentsList",
    }),
    event() {
      return this.$store.state.event.eventData;
    },
    permission() {
      try {
        return this.$store.state.event.eventData.permit;
      } catch (e) {
        return "edit";
      }
    },
    canComment() {
      return this.permission === "edit" || this.permission === "comment";
    },
    canEdit() {
      return !this.permission || this.permission === "edit";
    },
    bookedTotal() {
      const addedBudget = this.eventBuildingBlocks.reduce((sum, item) => {
        return sum + item.bookedBudget;
      }, 0);
      return addedBudget; //+ this.event.allocatedTips + this.event.allocatedFees;
    },
    unusedBudget() {
      // console.log("allocatedBUdgtet", this.bookedTotal);
      return this.event.totalBudget - this.bookedTotal;
    },
    eventCategoryList() {
      // console.log("eventCategoryList", this.event.components);
      return this.event.components;
    },
  },
  methods: {
    ...mapMutations("EventPlannerVuex", ["setBuildingBlockModal"]),
    ...mapActions("event", ["getComponents"]),
    expandBlock(item) {
      if (item.expanded) {
        item.expanded = false;
      } else {
        this.eventBuildingBlocks.forEach((g) => {
          g.expanded = false;
        });
        item.expanded = true;
      }
      this.$forceUpdate();
    },
    showEditElementBudget(item) {
      if (item) {
        this.editTips = false;
        if (item.editBudget) {
          item.editBudget = false;
        } else {
          this.eventBuildingBlocks.forEach((g) => {
            g.editBudget = false;
          });
          item.editBudget = true;
        }

        if (item.allocatedBudget) {
          item.newBudget = item.allocatedBudget;
        } else {
          item.newBudget = 0;
        }
      } else {
        this.eventBuildingBlocks.forEach((g) => {
          g.editBudget = false;
        });
        this.editTips = true;
      }

      this.$forceUpdate();
      setTimeout(() => {
        let input = document.querySelector(".inline-input");
        if (input) {
          input.focus();
        }
      }, 100);
    },
    deleteCategory(changedMoney) {
      const event = new CalendarEvent({
        id: this.event.id,
        allocatedBudget: this.event.allocatedBudget - changedMoney.offset,
      });
      if (changedMoney.selectedOption === "total") {
        event.totalBudget = this.event.totalBudget - changedMoney.offset;
      } else if (changedMoney.selectedOption === "unexpected") {
        event.unexpectedBudget = this.event.unexpectedBudget + changedMoney.offset;
      }
      this.$store.dispatch("event/saveEventAction", event).then((res) => {});
    },
    getRemainingBudget() {
      if (!this.event) return;
      if (!this.event.components) return;
      const allocatedBudget = this.event.components.reduce((s, item) => {
        return s + item.allocatedBudget;
      }, 0);
      this.allocatedBudget = allocatedBudget + this.event.allocatedFees + this.event.allocatedTips;
      this.newAllocatedTips = this.event.allocatedTips;
      this.remainingBudget = Math.round((this.event.totalBudget - this.allocatedBudget) / 10) * 10;
    },
    /**
     * Get Event building blocks
     */
    getEventBuildingBlocks() {
      if (!this.event.id) return;

      let vm = this;

      this.isLoading = true;

      vm.totalBudget = 0;
      vm.totalBudgetTaxes = 0;

      let res = this.event.components;
      res.sort((a, b) => a.order - b.order);
      this.$set(this, "eventBuildingBlocks", res);

      setTimeout(() => {
        this.isLoading = false;
      }, 500);

      this.eventBuildingBlocks.forEach((item) => {
        if (item.allocatedBudget && vm.type === "total") {
          vm.totalBudget += parseInt(item.allocatedBudget);
          vm.totalBudgetTaxes += parseInt(item.allocatedBudget) * 0.12;
        } else if (item.allocatedBudget) {
          vm.totalBudget += item.numberOfParticipants
            ? parseInt(item.allocatedBudget) / parseInt(item.numberOfParticipants)
            : parseInt(item.allocatedBudget) / parseInt(vm.event.numberOfParticipants);
          vm.totalBudgetTaxes += item.numberOfParticipants
            ? (parseInt(item.allocatedBudget) / parseInt(item.numberOfParticipants)) * 0.12
            : (parseInt(item.allocatedBudget) / parseInt(vm.event.numberOfParticipants)) * 0.12;
        }

        // if (item.allocatedBudget) {
        //     vm.totalBudget += parseInt(item.allocatedBudget);
        //     vm.totalBudgetTaxes  += parseInt(item.allocatedBudget) * .12;
        // }
      });

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

    updateCategoryBudget(changedMoney) {
      const event = new CalendarEvent({
        id: this.event.id,
        allocatedBudget: this.event.allocatedBudget + changedMoney.offset,
      });
      if (changedMoney.selectedOption === "total") {
        event.totalBudget = this.event.totalBudget + changedMoney.offset;
      } else if (changedMoney.selectedOption === "unexpected") {
        event.unexpectedBudget = this.event.unexpectedBudget - changedMoney.offset;
      }
      this.$store.dispatch("event/saveEventAction", event).then((res) => {
          this.$emit("change");
      });
    },

    blockBudgetChanged(val, index) {
      let block = _.find(this.eventBuildingBlocks, function (item) {
        return item.componentId === index;
      });

      let event = new CalendarEvent({ id: this.event.id });
      let selectedBlock = new EventComponent({ id: block.id });

      selectedBlock.calendarEvent = block.calendarEvent;
      selectedBlock.componentId = block.componentId;
      selectedBlock.icon = block.icon;
      selectedBlock.color = block.color;
      selectedBlock.todos = block.todos;
      selectedBlock.values = block.values;
      selectedBlock.vendors = block.vendors;

      if (val) {
        if (val.toString().toLowerCase() === "click to set") {
          selectedBlock.allocatedBudget = null;
          block.allocatedBudget = null;
        } else {
          if (block.allocatedBudget && block.numberOfParticipants) {
            selectedBlock.allocatedBudget = this.type === "total" ? val : val * block.numberOfParticipants;
            block.allocatedBudget = this.type === "total" ? val : val * block.numberOfParticipants;
          } else {
            selectedBlock.allocatedBudget = this.type === "total" ? val : val * this.event.numberOfParticipants;
            block.allocatedBudget = this.type === "total" ? val : val * this.event.numberOfParticipants;
          }
        }
      } else {
        selectedBlock.allocatedBudget = null;
        block.allocatedBudget = null;
      }

      selectedBlock
        .for(this.calendar, event)
        .save()
        .then((resp) => {
          this.isLoading = false;
          this.$root.$emit("RefreshStatistics");
          this.getEventBuildingBlocks();
          this.$root.$emit("event-building-block-budget-changed", this.event.components);
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
        let event = new CalendarEvent({ id: this.event.id });
        new EventComponent()
          .for(this.calendar, event)
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

    addBuildingBlock() {
      this.showCategoryModal = false;
      console.log('addBuildingBlock')
      this.$root.$emit('clearVendorRequirement', this.event);
      this.$emit("change");
    },
    getCategoryBlocks() {
      EventComponent.get()
        .then((res) => {
          this.categoryBuildingBlocks = res;
          this.filteredEventBlocks = this.categoryBuildingBlocks.filter((item) => item.title !== "Unexpected");
        })
        .catch((error) => {
          console.log("Error ", error);
        });
    },
    addbudget() {
      const arrow = `<i data-v-a76b6a56="" style="color:#050505" class="md-icon md-icon-font md-theme-default">arrow_back</i>`;
      const budgetString = `<div class="font-size-40 font-regular color-red" style="margin:20px 0">$ ${this.newBudget}</div>`;
      const description = `<div class="description">Your edits changed the total budget, do you want to change it?</div>`;
      Swal.fire({
        title: `<div class="text-left">${arrow}${budgetString}<div>Are You Sure?</div>${description}</div>`,
        showCancelButton: true,
        confirmButtonClass: "md-button md-success",
        cancelButtonClass: "md-button md-danger",
        confirmButtonText: "Yes I'm sure",
        cancelButtonText: "No, take me back",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          // alert(result.value);
        }
      });
    },
    handleMinusBudget(selectedOption, value) {
      const formattedValue = `${value}`.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      switch (selectedOption) {
        case "keep":
          this.showMinusHandleModal = false;
          break;
        case "take":
          const unexpectedComponent = this.eventBuildingBlocks.findIndex((item) => item.componentId === "unexpected");
          // if (unexpectedComponent) {
          //   unexpectedComponent.allocatedBudget = unexpectedComponent.allocatedBudget
          // }
          this.eventBuildingBlocks[unexpectedComponent].newBudget =
            this.eventBuildingBlocks[unexpectedComponent].allocatedBudget - value;
          this.updateCategoryBudget(this.eventBuildingBlocks[unexpectedComponent]);
          break;
        case "add":
          const budgetString = `<div class="font-size-40 font-regular color-red" style="margin-bottom:20px">+$${formattedValue}</div>`;
          const description = `<div class="description">Your edits changed the total budget, do you want to change it?</div>`;
          Swal.fire({
            title: `<div class="text-left">${budgetString}<div>Would you like to add extra $${formattedValue} to your budget?</div>${description}</div>`,
            showCancelButton: true,
            confirmButtonClass: "md-button md-success",
            cancelButtonClass: "md-button md-danger",
            confirmButtonText: "Yes I'm sure",
            cancelButtonText: "No, take me back",
            buttonsStyling: false,
          }).then((result) => {
            if (result.value) {
              if (result.value) {
                this.$emit("add", value);
              }
            }
          });
          break;
      }
      this.showMinusHandleModal = false;
    },
    async addMyVendor(myVendor) {
      let event = new CalendarEvent({
        id: this.event.id,
        bookedBudget: this.event.bookedBudget + myVendor.cost,
      });
      this.$store.dispatch("event/saveEventAction", event);
      this.$emit("change");
    },
    updateTips() {
      let event = new CalendarEvent({
        id: this.event.id,
        allocatedTips: this.newAllocatedTips,
      });
      event
        .for(this.calendar)
        .save()
        .then((res) => {
          this.editTips = false;
          this.$forceUpdate();
          this.$emit("change");
        });
    },
    deleteTips() {
      this.newAllocatedTips = 0;
      this.$refs.popup.hide();
      this.updateTips();
    },
  },
  mounted() {
    this.calendar = new Calendar({
      id: this.$store.state.auth.user.profile.defaultCalendarId,
    });
    this.getEventBuildingBlocks();
    this.getRemainingBudget();
    this.getCategoryBlocks();
    this.$on("refreshBuildingBlock", () => {
      this.getEventBuildingBlocks();
    });
  },
  watch: {
    event(newVal, oldVal) {
      // Get default event building blocks
      this.getEventBuildingBlocks();
      this.getRemainingBudget();
    },
    eventComponents(newVal, oldVal) {
      // Get default event building blocks
      this.getEventBuildingBlocks();
      this.getRemainingBudget();
    },
    elementsBudget(val) {
      this.switchingBudgetAndCost();
    },
  },
  filters: {
    roundNumber(amount) {
      return Math.round(amount / 10) * 10;
    },
  },
};
</script>
<style lang="scss">
.event-budget-vendors {
  .add-category-model {
    .modal-container {
      max-width: 900px;
      .modal-header {
        padding: 60px 60px 0px;
      }
      .modal-body {
        padding: 0px 60px 0px;
      }
    }
  }
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
  .expand {
    img {
      transform: rotate(-90deg);
      transition: transform 0.1s;
      &.expanded {
        transform: rotate(0deg);
      }
    }
  }
  .multiselect__tags {
    border: solid 0.5px #bcbcbc;
  }
  input.budget {
    font-size: 20px !important;
  }
  .booked {
    background-color: rgba(56, 256, 126, 0.19) !important;
  }
}
</style>
