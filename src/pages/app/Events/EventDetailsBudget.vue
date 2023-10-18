<template>
  <div>
    <budget-notifications></budget-notifications>
    <!-- todo show event checklist temp-->
    <progress-sidebar :elements="barItems" page="plan"></progress-sidebar>
    <div class="edit-event-details event-details-budget" style="padding: 0 20px 0 420px !important">
        <comment-editor-panel
            v-if="showCommentEditorPanel"
            :commentComponents="commentComponents"
            @saveComment="saveComment"
            @updateComment="updateComment"
            @deleteComment="deleteComment"
            @updateCommentComponent="updateCommentComponent"
        >
        </comment-editor-panel>
      <!-- Event Header -->
      <div class="event-header d-flex justify-content-between">
        <div class="header-title">
          <h3>
            <img :src="`${this.$iconURL}budget+screen/SVG/Asset%2010.svg`" width="15" />
            Budget
          </h3>
        </div>
        <header-actions @toggleCommentMode="toggleCommentMode" @share="share" @export="exportToPdf"></header-actions>
      </div>
      <div class="md-layout justify-content-between">
        <div class="md-layout-item md-size-40">
          <div class="card-section card-overview">
            <div class="section-header">Overview</div>
            <div class="budget-list d-flex justify-content-center">
              <div class="budget-list__item width-66 d-flex align-center" style="border-bottom: 1px solid #b7b7b7">
                <div class="label-title mb-0">Budget</div>
                <div class="budget-value">${{ budgetStatistics.total | withComma }}</div>
                <md-button v-if="canEdit" class="md-rose md-simple md-sm edit-budget" @click="showBudgetModal = true">
                  Edit
                </md-button>
              </div>
            </div>
            <div class="budget-list d-flex justify-content-between">
              <div class="budget-list__item width-50">
                <div class="label-title">Allocated</div>
                <div class="budget-value">${{ budgetStatistics.allocated | withComma }}</div>
                <div class="percent">{{ budgetStatistics.allocatedPercentage }} %</div>
              </div>
              <div class="budget-list__item width-50">
                <div class="label-title">Booked</div>
                <div class="budget-value">${{ budgetStatistics.booked | withComma }}</div>
                <div class="percent">{{ budgetStatistics.bookedPercentage }}%</div>
              </div>
            </div>
          </div>
          <div class="card-section card-overview-saved text-center d-flex justify-center align-center">
            <span>So far you saved :</span>
            <md-icon class="card-overview-saved-icon" style="color: #167c3a" v-if="budgetStatistics.saved >= 0"
              >add_circle_outline</md-icon
            >
            <md-icon class="card-overview-saved-icon color-red" v-else>remove_circle_outline</md-icon>
            <span class="card-overview-saved-amount">$ {{ budgetStatistics.saved | withComma }}</span>
          </div>
          <div class="card-section card-expense">
            <div class="section-header">Expenses</div>
            <div>
              <pie-chart-round :event.sync="$store.state.event.eventData" :items="pieChartData"></pie-chart-round>
            </div>
          </div>
        </div>
        <div class="md-layout-item md-size-60">
          <div class="event-blocks-table">
            <tabs
              :tab-name="[
                `<img src='${$iconURL}budget+screen/png/Asset+26.png'> Total`,
                `<img src='${$iconURL}budget+screen/png/Asset+28.png'> Per Guest`,
              ]"
            >
              <!-- here you can add your content for tab-content -->
              <template slot="tab-pane-1">
                <event-budget-vendors
                  :event.sync="event"
                  :event-components="selectedComponents"
                  type="total"
                  @change="onChangeComponent"
                  @add="onAddMoreBudget"
                ></event-budget-vendors>
              </template>
              <template slot="tab-pane-2">
                <event-budget-vendors
                  :event.sync="event"
                  :event-components="selectedComponents"
                  type="perGuest"
                  @change="onChangeComponent"
                  @add="onAddMoreBudget"
                ></event-budget-vendors>
              </template>
            </tabs>
          </div>
        </div>
      </div>
      <vue-html2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="false"
        :paginate-elements-by-height="1400"
        :filename="`budget-${event.id}`"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="portrait"
        pdf-content-width="800px"
        ref="html2Pdf"
      >
        <section slot="pdf-content">
          <div class="p-20 pdf-content">
            <h3 class="font-bold-extra font-size-30">
              <img :src="`/static/icons/budget/budget.png`" width="15" />
              Budget
            </h3>
            <div class="card-section card-overview" style="border: solid 2px #dbdbdb !important">
              <div class="section-header" style="border-bottom: solid 2px #dbdbdb !important">Overview</div>
              <div class="budget-list d-flex justify-content-between">
                <div class="budget-list__item">
                  <div class="label-title">Budget</div>
                  <div class="budget-value">${{ budgetStatistics.total | withComma(Number) }}</div>
                  <md-button v-if="canEdit" class="md-rose md-simple md-sm edit-budget" @click="showBudgetModal = true"
                    >Edit</md-button
                  >
                </div>
                <div class="budget-list__item">
                  <div class="label-title">Allocated</div>
                  <div class="budget-value">${{ budgetStatistics.allocated | withComma(Number) }}</div>
                  <div class="percent">{{ budgetStatistics.allocatedPercentage }} %</div>
                </div>
                <div class="budget-list__item">
                  <div class="label-title">Booked</div>
                  <div class="budget-value">${{ budgetStatistics.booked | withComma(Number) }}</div>
                  <div class="percent">{{ budgetStatistics.bookedPercentage }}%</div>
                </div>
              </div>
            </div>
            <div class="card-section card-overview-saved text-center">
              <span>So far you saved :</span>
              <md-icon class="card-overview-saved-icon" style="color: #167c3a" v-if="budgetStatistics.saved >= 0"
                >add_circle_outline</md-icon
              >
              <md-icon class="card-overview-saved-icon color-red" v-else>remove_circle_outline</md-icon>
              <span class="card-overview-saved-amount">$ {{ budgetStatistics.saved | withComma(Number) }}</span>
            </div>
            <div class="card-section card-expense" style="border: solid 2px #dbdbdb !important">
              <div class="section-header" style="border-bottom: solid 2px #dbdbdb !important">Expenses</div>
              <div>
                <pie-chart-round :event.sync="event" :items="pieChartData" :showImage="true"></pie-chart-round>
              </div>
            </div>
          </div>
          <div class="html2pdf__page-break"></div>
          <div class="p-20 event-blocks-table">
            <label class="font-size-26 font-bold">Total</label>
            <event-budget-vendors
              :event.sync="event"
              :event-components="selectedComponents"
              :editingMode="false"
              type="total"
              @change="onChangeComponent"
              @add="onAddMoreBudget"
            ></event-budget-vendors>
          </div>
          <div class="html2pdf__page-break"></div>
          <div class="p-20 event-blocks-table">
            <label class="font-size-26 font-bold">Per Guest</label>
            <event-budget-vendors
              :event.sync="event"
              :event-components="selectedComponents"
              :editingMode="false"
              type="perGuest"
              @change="onChangeComponent"
              @add="onAddMoreBudget"
            ></event-budget-vendors>
          </div>
        </section>
      </vue-html2pdf>
      <upload-vendors-modal ref="uploadModal"></upload-vendors-modal>
      <budget-edit-modal
        v-if="showBudgetModal"
        :event="event"
        @cancel="showBudgetModal = false"
        @save="updateTotalBudget"
      ></budget-edit-modal>
      <modal v-if="budgetConfirmationModal" class="add-category-model">
        <template slot="header">
          <div class="add-category-model__header">
            <h2 class="black">Are you sure?</h2>
            <div class="header-description">
              <img :src="`${iconsURL}Asset 150.svg`" width="20" /> Decreasing your budget may cause program changes
            </div>
          </div>
          <md-button
            class="md-simple md-just-icon md-round modal-default-button"
            @click="budgetConfirmationModal = false"
          >
            <md-icon>clear</md-icon>
          </md-button>
        </template>
        <template slot="body"></template>
        <template slot="footer">
          <md-button class="md-rose md-outline md-simple cancel-btn" @click="budgetConfirmationModal = false"
            >Yes I’m sure</md-button
          >
          <md-button class="md-rose add-category-btn" :class="{ disabled: !newBudget }" @click="updateBudget"
            >No, take me back</md-button
          >
        </template>
      </modal>

      <modal v-if="editBudgetElementsModal" class="add-category-model edit-elements-budget-modal">
        <template slot="header">
          <div class="add-category-model__header">
            <h2 class="black">Edit budget per category</h2>
          </div>
          <md-button
            class="md-simple md-just-icon md-round modal-default-button"
            @click="editBudgetElementsModal = false"
          >
            <md-icon>clear</md-icon>
          </md-button>
        </template>
        <template slot="body">
          <div class="event-blocks-table edit-elements-budget-table">
            <tabs
              :tab-name="[
                '<img src=\'https://static-maryoku.s3.amazonaws.com/storage/icons/budget+screen/png/Asset+26.png\'> Total',
                ' <img src=\'https://static-maryoku.s3.amazonaws.com/storage/icons/budget+screen/png/Asset+28.png\'> Per Guest',
              ]"
            >
              <!-- here you can add your content for tab-content -->
              <template slot="tab-pane-1">
                <edit-event-blocks-budget
                  :event.sync="event"
                  :event-components="selectedComponents"
                  type="total"
                ></edit-event-blocks-budget>
              </template>
              <template slot="tab-pane-2">
                <edit-event-blocks-budget
                  :event.sync="event"
                  :event-components="selectedComponents"
                  type="perGuest"
                ></edit-event-blocks-budget>
              </template>
            </tabs>
          </div>
        </template>
        <template slot="footer">
          <md-button class="md-default md-simple cancel-btn" @click="editBudgetElementsModal = false">Cancel</md-button>
          <md-button class="md-rose add-category-btn" @click="updateBudget">Save</md-button>
        </template>
      </modal>
      <BudgetHandleMinusModal value="50" v-if="showHandleMinus"></BudgetHandleMinusModal>
    </div>
  </div>
</template>

<script>
// MAIN MODULES
import { Tabs, Modal } from "@/components";

// import auth from '@/auth';
import moment from "moment";
import Swal from "sweetalert2";

import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import EventComponent from "@/models/EventComponent";
import EventStateMessage from "./components/EventStateMessage";
import { BUDGET_MESSAGES } from "@/constants/messages";
import { mapState, mapMutations, mapGetters } from "vuex";

import EventBudgetVendors from "./components/EventBudgetVendors";
import EditEventBlocksBudget from "./components/EditEventBlocksBudget";
import EventBudgetActivityPanel from "./components/EventBudgetActivityPanel";
import ProgressSidebar from "./components/progressSidebarForEvent";

// COMPONENTS
import UploadVendorsModal from "../Vendors/ImportVendors";
import PieChartRound from "./components/PieChartRound.vue";
import BudgetHandleMinusModal from "../../../components/Modals/BudgetHandleMinusModal";
import HeaderActions from "@/components/HeaderActions";
import CommentEditorPanel from "./components/CommentEditorPanel";
import {CommentMixins, ShareMixins} from "@/mixins";

import BudgetEditModal from "@/components/Modals/BudgetEditModal";
import AddNewCategoryModal from "@/components/Modals/AddNewCategoryModal";
import axios from "axios";
const VueHtml2pdf = () => import("vue-html2pdf");

export default {
  components: {
    ProgressSidebar,
    Tabs,
    EventBudgetVendors,
    UploadVendorsModal,
    PieChartRound,
    Modal,
    EditEventBlocksBudget,
    BudgetHandleMinusModal,
    EventBudgetActivityPanel,
    HeaderActions,
    CommentEditorPanel,
    EventStateMessage,
    BudgetEditModal,
    AddNewCategoryModal,
    VueHtml2pdf,
  },
  mixins: [CommentMixins, ShareMixins],
  data() {
    return {
      // auth: auth,
      event: {},
      calendarEvent: {},
      selectedComponents: [],
      statistics: {
        total: 0,
        allocated: 0,
        booked: 0,
      },
      currentTab: "blocks",
      percentage: 0,
      totalRemainingBudget: 0,
      usedBudget: 0,
      remainingBudgetPerEmployee: 0,
      isLoading: false,
      routeName: null,
      budgetPerEmployee: 0,
      activeTab: 0,
      totalBudget: 0,
      menuIconsURL: `${this.$iconURL}menu%20_%20checklist/SVG/`,
      iconsURL: `${this.$iconURL}Event%20Page/`,
      showBudgetModal: false,
      budgetConfirmationModal: false,
      newBudget: null,
      budgetState: null,
      editBudgetElementsModal: false,
      showHandleMinus: false,
      showCommentEditorPanel: false,
      showMessage: false,
    };
  },
  created() {
    this.routeName = this.$route.name;
  },
  mounted() {
    this.loadEventData("init");
    const tab = this.$route.query.t || 0;
    if (this.$refs.eventPlannerTabs) {
      this.$refs.eventPlannerTabs.$emit("event-planner-nav-switch-panel", tab);
    }

    if (this.components.length === 0) {
      this.$store.dispatch("event/getComponents", this);
      this.$store.dispatch("event/getCategories", {
        data: this.currentUser.profile.defaultCalendarId,
        ctx: this,
      });
      this.$store.dispatch("event/getEventTypes", {
        data: this.currentUser.profile.defaultCalendarId,
        ctx: this,
      });
      this.$store.dispatch("event/getCurrencies", this);
      this.$store.dispatch("event/getEventThemes", this);
    }

    this.$root.$on("calendar-refresh-events", () => {
      this.loadEventData("update");
    });
  },
  methods: {
    ...mapMutations("EventPlannerVuex", [
      "setEventModal",
      "setEditMode",
      "setModalSubmitTitle",
      "setEventModalAndEventData",
      "setNumberOfParticipants",
      "setEventData",
    ]),
    ...mapMutations("event", ["setBudgetNotification"]),
    getCalendar() {
      return new Calendar({ id: this.currentUser.profile.defaultCalendarId });
    },
    getEvent: async function (_calendar) {
      let event = await _calendar.calendarEvents().find(this.$route.params.id);
      this.event = event;
    },
    getEventComponents: async function (_calendar) {
      let event = new CalendarEvent({ id: this.event.id });
      let eventComponent = new EventComponent().for(_calendar, event);
      let components = await eventComponent.get();
      console.log("getEventComponents", components);
      components.sort((a, b) => a.order - b.order);
      // console.log(components);
      this.event.components = components;
      this.selectedComponents = components;
    },
    loadEventData: async function (type = "init") {
      this.isLoading = true;

      axios.defaults.headers.common.Authorization = `Bearer ${this.currentUser.access_token}`;
      let calendar = this.getCalendar();
      await this.getEvent(calendar);
      await this.getEventComponents(calendar);
      console.log(
        "showBudgetNotification",
        this.event.id,
        this.showBudgetNotification,
        this.showBudgetNotification.indexOf(this.event.id) === -1,
      );
      // notify budget states
      if (this.showBudgetNotification.indexOf(this.event.id) === -1) {
        // this.notifyStates();
        this.setBudgetNotification(this.event.id);
      }
      this.calendarEvent = this.event;
      if (this.event.totalBudget)
        this.newBudget = (this.event.totalBudget + "").replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      if (type === "update") {
        this.$root.$emit(
          "set-title",
          this.event,
          this.routeName === "EditBuildingBlocks",
          this.routeName === "InviteesManagement" || this.routeName === "EventInvitees",
        );
      }
    },
    notifyStates() {
      this.budgetStates = [];
      let now = moment();
      let created_at = moment(this.event.dateCreated);
      if (this.event.budgetProgress < 100 && now.diff(created_at, "days") < 15) {
        this.budgetStates.push({ key: "not_approved" });
      } else {
        if (this.event.standardBudget !== 0) {
          if (this.event.standardBudget < this.event.totalBudget) {
            this.budgetStates.push({
              key: "higher_than_average",
              percent: ((this.event.totalBudget - this.event.standardBudget) / this.event.totalBudget).toFixed(2) * 100,
            });
          } else if (this.event.standardBudget > this.event.totalBudget) {
            this.budgetStates.push({ key: "lower_than_average" });
          }
        }

        if (now.diff(created_at, "days") < 15) {
          this.budgetStates.push({ key: "approved_budget_in_two_weeks" });
        }

        if (this.event.unexpected < this.event.totalBudget * 0.1) {
          this.budgetStates.push({ key: "unexpected_budget_less_10" });
        }
      }

      if (this.budgetStates.length) {
        this.budgetStates.map((it) => {
          let message_item = BUDGET_MESSAGES.find((m) => m.key == it.key);
          this.$notify({
            message: {
              title: message_item.title,
              content: message_item.message,
              action: message_item.action,
            },
            icon: `${this.$iconURL}messages/${message_item.icon}`,
            horizontalAlign: "right",
            verticalAlign: "top",
            type: message_item.type,
            timeout: 5000,
          });
        });
      }
    },
    selectServices() {
      this.$refs.eventPlannerTabs.$emit("event-planner-nav-switch-panel", 1);
    },
    selectTimeline() {
      this.$root.$emit("event-planner-nav-switch-panel", 2);
    },
    selectInviteesManagement() {
      this.$root.$emit("event-planner-nav-switch-panel", 3);
    },
    selectEventPage() {
      this.$root.$emit("event-planner-nav-switch-panel", 4);
    },
    selectTab(tab) {
      this.currentTab = tab;
    },
    selectedTab(tab) {
      return this.currentTab === tab;
    },
    resetTab() {
      this.currentTab = null;
    },
    openEventModal() {
      this.setEventData(this.event);
      this.setEventModal({
        showModal: true,
      });
      this.setModalSubmitTitle("Save");
      this.setEditMode({
        editMode: true,
      });
    },
    refreshEvents() {
      this.getCalendarEvents();
    },
    goToComponent(route) {
      this.$router.push({
        path: `/events/` + this.event.id + route,
      });
      location.reload();
    },
    openUploadModal() {
      this.$refs.uploadModal.toggleModal(true);
    },
    updateBudget(eventBudget) {
      let _calendar = new Calendar({
        id: this.currentUser.profile.defaultCalendarId,
      });
      let editedEvent = new CalendarEvent({ id: this.event.id }).for(_calendar);
      const newBudget = eventBudget.totalBudget; //Number(eventBudget.totalBudget.replace(/,/g, ""))
      if (newBudget < this.calendarEvent.totalBudget) {
        this.showBudgetModal = false;
        const arrow = `<i data-v-a76b6a56="" style="color:#050505" class="md-icon md-icon-font md-theme-default">arrow_back</i>`;
        const budgetString = `<div class="font-size-40 font-regular color-red" style="margin:20px 0">$ ${this.newBudget}</div>`;
        const description = `<div class="description">Your edits changed the total budget, do you want to change it?</div>`;
        Swal.fire({
          title: `<div class="text-left">${arrow}${budgetString}<div>Are Your Sure?</div>${description}</div>`,
          showCancelButton: true,
          confirmButtonClass: "md-button md-success",
          cancelButtonClass: "md-button md-danger",
          confirmButtonText: "Yes I'm sure",
          cancelButtonText: "No, take me back",
          buttonsStyling: false,
        }).then((result) => {
          if (result.dismiss != "cancel") {
            editedEvent.totalBudget = newBudget;
            editedEvent.reCalculate = true;

            editedEvent
              .save()
              .then((response) => {
                this.showBudgetModal = false;
                this.loadEventData("update");
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
      } else if (newBudget > this.calendarEvent.totalBudget) {
        editedEvent.totalBudget = newBudget;
        editedEvent.reCalculate = false;
        editedEvent
          .save()
          .then((response) => {
            this.showBudgetModal = false;
            this.loadEventData("update");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.showBudgetModal = false;
      }
    },
    updateTotalBudget(newBudget) {
      const event = new CalendarEvent({
        id: this.event.id,
        totalBudget: newBudget.totalBudget,
        unexpectedBudget: this.event.unexpectedBudget + (newBudget.totalBudget - this.event.totalBudget),
      });
      this.$store.dispatch("event/saveEventAction", event).then((res) => {
        console.log("updateTotalBudget.res", res);
        this.event = res;
        this.checkMessageStatus();
        this.showBudgetModal = false;
      });
    },
    onChangeComponent(event) {
      this.loadEventData("update");
    },
    onAddMoreBudget(value) {
      this.newBudget = `${this.event.totalBudget + value}`.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      this.updateBudget();
    },
    toggleCommentMode(mode) {
      this.showCommentEditorPanel = mode;
    },
    exportToPdf() {
      this.$refs.html2Pdf.generatePdf();
    },
  },
  computed: {
    ...mapState("EventPlannerVuex", ["eventData", "eventModalOpen", "modalTitle", "modalSubmitTitle", "editMode"]),
    ...mapGetters({
      budgetStatistics: "event/budgetStatistics",
      components: "event/getComponentsList",
      showBudgetNotification: "event/showBudgetNotification",
      currentUser: "auth/currentUser",
    }),
    barItems() {
      if (!this.event.checkList) {
        const overview = {
          title: "Create an event to remember",
          status: "completed",
          route: "overview",
          // icon: `${this.$iconURL}Timeline-New/timeline-title.svg`,
          progress: 100,
          componentId: "overview",
          id: "overview-item",
        };
        const concept = {
          title: "Get Inspired",
          status: this.event.concept && this.event.conceptProgress === 100 ? "completed" : "not-complete",
          route: "booking/concept",
          icon: `${this.$iconURL}Timeline-New/timeline-title.svg`,
          progress: this.event.concept ? this.event.conceptProgress : 0,
          componentId: "concept",
          id: "concept-item",
        };
        const budget = {
          title: "Craft Event Budget",
          status: "not-complete",
          route: this.event.budgetProgress == 100 ? "edit/budget" : "booking/budget",
          icon: `${this.$iconURL}budget+screen/SVG/Asset%2010.svg`,
          progress: this.event.budgetProgress,
          componentId: "budget",
          id: "budget-item",
        };
        const timeline = {
          title: "Set The Schedule",
          status: this.event.timelineProgress === 100 ? "completed" : "not-complete",
          route: "booking/timeline",
          icon: `${this.$iconURL}Timeline-New/timeline-title.svg`,
          progress: this.event.timelineProgress,
          componentId: "timeline",
          id: "timeline-item",
        };
        const campaign = {
          title: "Communicate With Guests",
          status: this.event.campaignProgress === 100 ? "completed" : "not-complete",
          route: "booking/campaign",
          icon: `${this.$iconURL}Campaign/Group 8857.svg`,
          progress: this.event.campaignProgress,
          componentId: "campaign",
          id: "campaign-item",
        };
        const planningBoard = {
          title: "Set Requirements",
          status: this.event.requirementProgress === 100 ? "completed" : "not-complete",
          route: "booking/planningboard",
          icon: `${this.$iconURL}Campaign/Group 8857.svg`,
          progress: this.event.requirementProgress,
          componentId: "planningboard",
          id: "planningboard-item",
        };
        const chooseVendor = {
          title: "Booking Vendors",
          status: "not-complete",
          route: "booking/choose-vendor",
          icon: `${this.$iconURL}Campaign/Group 8857.svg`,
          progress: this.event.campaignProgress,
          componentId: "chooseVendor",
          id: "bookingboard-item",
        };
        const elements = [];
        elements.push(overview);
        // if (this.event.eventType.hasConcept) {
        elements.push(concept);
        // }
        elements.push(budget);
        elements.push(timeline);
        elements.push(campaign);
        elements.push(planningBoard);
        if (this.event.processingStatus === "accept-proposal") {
          elements.push(chooseVendor);
        }
        // show when you approve budget
        // if (this.event.budgetProgress == 100) {
        //     this.event.components.sort((a, b) => a.order - b.order);
        //     this.event.components.forEach((item) => {
        //         if (item.componentId !== "unexpected") {
        //             elements.push({
        //                 title: item.bookTitle,
        //                 status: "not-complete",
        //                 route: "booking/" + item.id,
        //                 icon: `${this.$iconURL}Budget+Elements/${item.icon}`,
        //                 progress: item.progress ? item.progress : 0,
        //                 id: item.id,
        //             });
        //         }
        //     });
        // }

        return elements;
      } else {
        return this.event.checkList;
      }
    },
    pieChartData() {
      return this.$store.state.event.eventData.components;
    },
    // check permission
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
    allocatedTotalBudget() {
      return (
        this.calendarEvent.totalBudget -
        this.calendarEvent.unexpectedBudget -
        this.calendarEvent.allocatedTips -
        this.calendarEvent.allocatedFees
      );
    },
  },
  filters: {
    formatDate: function (date) {
      return moment(date).format("MMM Do YYYY ");
    },
    formatTime: function (date) {
      return moment(date).format("h:00 A");
    },
    formatDuration: function (startDate, endDate) {
      return moment(endDate).diff(startDate, "hours");
    },
    withComma(amount) {
      return amount ? amount.toLocaleString() : 0;
    },
    roundNumber(amount) {
      return Math.round(amount / 10) * 10;
    },
  },
  watch: {
    newBudget: function (newValue) {
      const result = newValue.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      this.newBudget = result;
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../styles/EventDetailsBudget.scss";
// .md-layout, .md-layout-item {
//     width: initial;
// }

// .tab-content {
//     background-color: transparent !important;
// }
</style>
