<template>
  <div class="md-layout booking-section position-relative">
    <template v-if="showProposals">
        <comment-editor-panel
            v-if="showCommentEditorPanel"
            :commentComponents="commentComponents"
            @saveComment="saveComment"
            @updateComment="updateComment"
            @deleteComment="deleteComment"
            @updateCommentComponent="updateCommentComponent"
        >
        </comment-editor-panel>
      <div class="event-page-header md-layout-item md-size-100">
        <div class="header-title">
          <h3>
            <img
              :src="`${$iconURL}Budget+Elements/${selectedBlock.componentId}.svg`"
              style="width: 30px; margin-right: 0.5em"
            />
            {{ selectedBlock.bookTitle }}
          </h3>
        </div>
        <header-actions @toggleCommentMode="toggleCommentMode"></header-actions>
      </div>
      <template v-if="!showCounterPage">
        <div class="booking-header md-layout-item md-size-100">
          <div class="header-title w-100">
            <div class="font-size-22 mb-20">Hey {{ $store.state.auth.user.name }}</div>
          </div>
          <div class="d-flex justify-content-between">
            <div>
              We found the top {{ proposals.length }} proposals for your event, <br />
              Book now before it’s too late
            </div>
            <div class="header-actions">
              <md-button class="md-simple normal-btn md-red" @click="compareProposal">
                <md-icon>bar_chart</md-icon>
                Compare Proposals
              </md-button>
              <span class="seperator"></span>
              <md-button class="md-simple normal-btn md-red">
                <md-icon>edit</md-icon>
                Change {{ selectedBlock.title }} Requirements
              </md-button>
            </div>
          </div>
        </div>

        <!-- Event Booking Items -->
        <div class="md-layout events-booking-items" v-if="proposals.length">
          <proposal-card
            v-for="(proposal, index) in proposals.slice(0, 3)"
            :key="index"
            :proposal="proposal"
            :component="selectedBlock"
            @goDetail="goDetailPage"
            :probability="getProbability(index)"
          ></proposal-card>
        </div>
        <!-- ./Event Booking Items -->

        <div class="booking-section__actions">
          <md-button class="md-simple md-black normal-btn" @click="showShareVendorModal = true">
            I already have a venue for my event
          </md-button>
          <span class="seperator"></span>
          <md-button class="md-simple md-black normal-btn" @click="showSomethingModal = true">
            I want something different
          </md-button>
        </div>

        <event-change-proposal-modal
          v-if="showSomethingModal"
          @close="showSomethingModal = false"
        ></event-change-proposal-modal>

        <modal v-if="showShareVendorModal" class="add-category-model something-modal">
          <template slot="header">
            <div class="add-category-model__header">
              <h2>Share your vendor info</h2>
              <div class="header-description">Share your vendor info</div>
            </div>
            <md-button
              class="md-simple md-just-icon md-round modal-default-button"
              @click="showShareVendorModal = false"
            >
              <md-icon>clear</md-icon>
            </md-button>
          </template>
          <template slot="body">
            <div class="md-layout">
              <div class="md-layout-item md-size-100">
                <label>Name</label>
                <maryoku-input inputStyle="name" type="text" />
              </div>
              <div class="md-layout-item md-size-100 mt-20">
                <label>Price of the service</label>
                <maryoku-input inputStyle="budget" type="text" />
              </div>
              <div class="md-layout-item md-size-100 mt-20">
                <label>Location</label>
                <maryoku-input inputStyle="location" type="text" />
              </div>
              <div class="md-layout-item md-size-100 mt-20">
                <label>Phone</label>
                <maryoku-input inputStyle="phone" type="text" />
              </div>
              <div class="md-layout-item md-size-100 mt-20">
                <label>Email</label>
                <maryoku-input inputStyle="email" type="text" />
              </div>

              <div class="md-layout-item md-size-100 mt-20">
                <div class="form-group">
                  <label>Attach Proposal</label>
                  <label class="upload-section" for="file">
                    <md-button class="md-rose md-outline md-simple md-sm">Choose file</md-button>
                    <div>Or</div>
                    <div class="note">Drag your file here</div>
                  </label>
                  <input style="display: none" id="file" name="attachment" type="file" @change />
                </div>
              </div>
            </div>
          </template>
          <template slot="footer">
            <md-button class="md-default md-simple cancel-btn" @click="showShareVendorModal = false"
              >Remind Me Later
            </md-button>
            <md-button class="md-rose add-category-btn" :class="{ disabled: !somethingMessage }"
              >Update Vendor
            </md-button>
          </template>
        </modal>
      </template>
      <template v-if="showCounterPage">
        <PendingForVendors :expiredTime="expiredTime"></PendingForVendors>
        <div class="footer-container">
          <md-button class="md-bold add-category-btn md-black md-simple" @click="back">
            <md-icon>arrow_back</md-icon>
            Back
          </md-button>
          <md-button class="md-bold add-category-btn md-black md-simple ml-auto mr-20" @click="updateExpiredTime">
            <img class="mr-10" src="https://s3.amazonaws.com/static.maryoku.com/storage/3Proposals/Group 10912.svg" />
            I need those proposals urgent
          </md-button>
        </div>
      </template>
    </template>
    <template v-if="!showProposals">
      <booking-event-requirement
        v-if="selectedBlock"
        @setRequirements="setRequirements"
        :component="selectedBlock"
      ></booking-event-requirement>
    </template>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import EventComponent from "@/models/EventComponent";
import EventTimelineItem from "@/models/EventTimelineItem";
import moment from "moment";
import Swal from "sweetalert2";
import InputMask from "vue-input-mask";
import BookingEventRequirement from "./BookingEventRequirement.vue";

// import auth from '@/auth';
import EventBlocks from "../components/NewEventBlocks";
import ProposalCard from "./ProposalCard";
import _ from "underscore";
import { Modal, MaryokuInput, Loader } from "@/components";
import Proposal from "@/models/Proposal";
import EventCategoryRequirement from "@/models/EventCategoryRequirement";
import PendingForVendors from "../components/PendingForVendors";

import EventChangeProposalModal from "@/components/Modals/EventChangeProposalModal";
import HeaderActions from "@/components/HeaderActions";
import CommentEditorPanel from "./CommentEditorPanel";
import {CommentMixins, ShareMixins} from "@/mixins";

import { postReq, getReq } from "@/utils/token";
export default {
  name: "event-booking",
  components: {
    Loader,
    EventBlocks,
    InputMask,
    Modal,
    EventChangeProposalModal,
    HeaderActions,
    CommentEditorPanel,
    BookingEventRequirement,
    PendingForVendors,
    ProposalCard,
    MaryokuInput,
  },
  props: {},
  mixins: [CommentMixins, ShareMixins],
  data: () => ({
    // auth: auth,
    calender: null,
    isLoading: true,
    somethingMessage: null,
    event: {},
    iconsURL: "https://static-maryoku.s3.amazonaws.com/storage/icons/Event%20Page/",
    showSomethingModal: false,
    showShareVendorModal: false,
    blockVendors: null,
    allRequirements: null,
    selectedBlock: null,
    proposals: [],
    showCommentEditorPanel: false,
    blockId: "",
    showProposals: false,
    showCounterPage: false,
    currentRequirement: null,
  }),
  methods: {
    ...mapMutations("event", ["setEventData", "setBookingRequirements", "setInitBookingRequirements"]),
    ...mapActions("comment", ["getCommentComponents"]),
    getAllRequirements: async function () {
      this.allRequirements = this.storedRequirements[this.event.id];
      if (!this.allRequirements) {
        this.allRequirements = await this.$http.get(`${process.env.SERVER_URL}/1/vendor/property/${this.event.id}`);
        // set default value by conditionSript
        let event = this.$store.state.event.eventData;

        _.each(this.allRequirements.data, (it) => {
          let requirements = it.requirements;
          _.each(requirements, (requirement) => {
            requirement.map((ms) => {
              if (ms.conditionScript) ms.visible = eval(ms.conditionScript);
              if (ms.conditionScript) ms.isSelected = eval(ms.conditionScript);
              if (ms.defaultQtyScript) ms.defaultQty = Math.ceil(eval(ms.defaultQtyScript));

              if (this.blockId === "giveaways" && (ms.item === "Apparel" || ms.item === "Tech items")) {
                ms.mustHave = false;
              }
            });
          });
        });

        let updatedRequirements = this.storedRequirements;
        updatedRequirements[this.event.id] = this.allRequirements.data;
        this.setBookingRequirements(JSON.parse(JSON.stringify(updatedRequirements)));
        this.setInitBookingRequirements(JSON.parse(JSON.stringify(updatedRequirements)));
      }
    },
    getSelectedBlock() {
      this.selectedBlock = _.findWhere(this.categoryList, {
        id: this.blockId,
      });
      if (this.selectedBlock && this.selectedBlock.vendorRequirements && this.selectedBlock.vendorRequirements[0]) {
        this.showCounterPage = false;
        this.showProposals = false;
      } else {
        this.showCounterPage = false;
        this.showProposals = false;
      }
      this.isLoading = false;
    },
    getRequirements() {
      getReq(`/1/events/${this.event.id}/components/${this.blockId}/requirements`)
        .then((res) => {
          this.currentRequirement = res.data.item;
          this.showProposals = true;
          this.showCounterPage = true;
        })
        .catch((e) => {
          this.showCounterPage = false;
        });
    },
    toggleCommentMode(mode) {
      console.log('toggle.comment', mode);
      this.showCommentEditorPanel = mode;
    },
    fetchData: async function () {
      this.blockId = this.$route.params.blockId;
      this.event = this.$store.state.event.eventData;
      this.getSelectedBlock();
      new Proposal()
        .for(new EventComponent({ id: this.blockId }))
        .get()
        .then((result) => {
          this.proposals = result;
          if (result.length > 0) this.showProposals = true;
        });

      // todo check if commentComponent is used
      // this.getCommentComponents(this.blockId);

      await this.getAllRequirements();

      // this.getRequirements();
    },
    setRequirements(requirementContent) {
      this.currentRequirement = requirementContent;
      this.showCounterPage = true;
      this.showProposals = true;
    },
    back() {
      this.showCounterPage = false;
      this.showProposals = false;
    },
    updateExpiredTime() {
      new EventCategoryRequirement({
        id: this.currentRequirement.id,
        expiredBusinessTime: moment(new Date()).add(2, "days").valueOf(),
      })
        .save()
        .then((res) => {
          this.currentRequirement = Object.assign({}, res.item);
        });
    },
    goDetailPage(proposal) {
      this.$router.push(`/events/${this.event.id}/booking/${this.blockId}/proposals/${proposal.id}`);
    },
    getProbability(index) {
      return 100 - 10 * (index + 1) + Math.round(10 * Math.random());
    },
    compareProposal() {
      this.$router.push(`/events/${this.event.id}/booking/${this.blockId}/proposals/compare`);
    },
  },
  created() {
    console.log("bookingEvent");
    this.isLoading = true;
    this.calendar = new Calendar({
      id: this.$store.state.auth.user.profile.defaultCalendarId,
    });
    this.fetchData();

    this.$root.$on("clearVendorRequirement", (event) => {
      console.log("clearVendorRequirement");
      let requirements = this.storedRequirements;
      if (requirements[event.id]) requirements[event.id] = null;
      this.setBookingRequirements(requirements);
    });
  },
  watch: {
    event(newVal, oldVal) {
      this.$root.$emit("set-title", this.event, this.routeName === "EditBuildingBlocks", true);
    },
    $route: "fetchData",
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
  },
  computed: {
    ...mapGetters({
      storedRequirements: "event/getBookingRequirements",
    }),
    categoryList() {
      return this.$store.state.event.eventData.components;
    },
    expiredTime() {
      return this.currentRequirement.expiredBusinessTime;
    },
  },
};
</script>
<style lang="scss" scoped>
.booking-section {
  .header-actions {
    display: flex;
    height: max-content;
  }
  .seperator {
    border-left: solid 1px #050505;
  }
  .events-booking-items {
    padding: 0 2em;
    margin-bottom: 1em;
    align-items: stretch;
  }
  .booking-section__actions {
    width: 100%;
    text-align: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 25px 1.9em;
    background: white;
  }
  .footer-container {
    position: fixed;
    bottom: 0;
    left: 0;
    padding-left: 500px;
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    background: white;
    font-family: "Manrope-Regular", sans-serif;
  }
}
</style>
