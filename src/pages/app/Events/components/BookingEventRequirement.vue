<template>
  <div v-if="component" class="booking-event-requirement">
      <comment-editor-panel
          v-if="showCommentEditorPanel"
          :commentComponents="commentComponents"
          @saveComment="saveComment"
          @updateComment="updateComment"
          @deleteComment="deleteComment"
          @updateCommentComponent="updateCommentComponent"
      >
      </comment-editor-panel>
    <div class="booking-header md-layout-item md-size-100">
      <div class="d-flex justify-content-between">
        <div>
          <h3>
            <img
              :src="`${$iconURL}Budget+Elements/${component.icon}`"
              style="width: 30px; margin-right: 0.5em"
              v-if="component.componentId"
            />
            Let us know what you are looking for in a {{ component.title }}
          </h3>
          Our job is to bring you the most accurate offers for your event.
          <br />This is what we know about your event so far, let us know if there is anything we missed.
        </div>
        <header-actions @toggleCommentMode="toggleCommentMode" @share="share" hideDownload></header-actions>
      </div>
    </div>

    <!-- Event Booking Items -->
    <div class="md-layout events-booking-items position-relative">
      <loader :active="isLoading" />
      <div class="md-layout-item md-size-100">
        <div v-for="(category, index) in Object.keys(requirementProperties)" :key="index">
          <template v-if="category == 'multi-selection'">
            <vendor-requirement-multiselect-panel
              v-for="(data, id) in requirementProperties[category].filter((it) => it.visible)"
              :key="id"
              :index="id"
              :data="data"
              :currentComponent="component"
              @change="handleMultiSelectChange"
            ></vendor-requirement-multiselect-panel>
          </template>
          <template v-else-if="category == 'radio'">
            <vendor-requirement-singleselect-panel
              v-for="(data, id) in requirementProperties[category].filter((it) => it.visible)"
              :key="id"
              :index="id"
              :data="data"
              :currentComponent="component"
              @change="handleSingleSelectChange"
            ></vendor-requirement-singleselect-panel>
          </template>
          <div v-else-if="category == 'special'">
            <special-requirement-section
              :data="requirementProperties[category]"
              :currentComponent="component"
              :note="anythingElse"
              @change="handleSpecialChange"
            ></special-requirement-section>
          </div>
          <div v-else>
            <event-requirement-section
              :requirements="requirementProperties"
              :category="category"
              :block-id="blockId"
              :note="anythingElse"
              @change="handlePropertyChange"
            ></event-requirement-section>
          </div>
        </div>
      </div>
    </div>
    <!-- ./Event Booking Items -->

    <div class="booking-section__actions">
      <div>
        <md-button class="md-bold add-category-btn md-black md-simple"> <md-icon>arrow_back</md-icon>Back </md-button>
        <md-button class="md-simple md-just-icon md-black">
          <md-icon style="font-size: 40px">expand_less</md-icon>
        </md-button>
      </div>
      <div>
        <md-button class="md-bold add-category-btn md-black md-simple" @click="revertToOriginal">
          Revert To Original
        </md-button>
        <md-button class="md-red md-bold add-category-btn" @click="findVendors">Find my perfect vendor</md-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import moment from "moment";
import InputMask from "vue-input-mask";
import _ from "underscore";
import Multiselect from "vue-multiselect";
import MaryokuInput from "@/components/Inputs/MaryokuInput.vue";
import MaryokuTextarea from "@/components/Inputs/MaryokuTextarea.vue";

import { postReq, getReq } from "@/utils/token";
import { Modal, Loader } from "@/components";
import EventChangeProposalModal from "@/components/Modals/EventChangeProposalModal";
import HeaderActions from "@/components/HeaderActions";
import CommentEditorPanel from "./CommentEditorPanel";
import {CommentMixins, ShareMixins} from "@/mixins";

import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import EventComponent from "@/models/EventComponent";
import VendorRequirementMultiselectPanel from "./VendorRequirementMultiselectPanel";
import VendorRequirementSingleselectPanel from "./VendorRequirementSingleselectPanel";
import SpecialRequirementSection from "./SpecialRequirementSection";
import EventRequirementSection from "./EventRequirementSection";

export default {
  name: "booking-event-requirement",
  components: {
    Loader,
    InputMask,
    Modal,
    EventChangeProposalModal,
    HeaderActions,
    CommentEditorPanel,
    Multiselect,
    MaryokuInput,
    MaryokuTextarea,
    VendorRequirementMultiselectPanel,
    VendorRequirementSingleselectPanel,
    SpecialRequirementSection,
    EventRequirementSection,
  },
  props: {
    component: {
      type: Object,
      default: {},
    },
  },
  mixins: [CommentMixins, ShareMixins],
  data: () => ({
    // auth: auth,
    calendar: null,
    isLoading: false,
    event: {},
    blockVendors: null,
    proposals: [],
    showCommentEditorPanel: false,
    blockId: "",
    value: "",
    requirementProperties: {},
    anythingElse: null,
    editingSpecialRequest: {
      name: "",
      isMandatory: false,
      notes: "",
    },
    specialRequests: [],
  }),
  methods: {
    ...mapMutations("event", ["setEventData"]),
    ...mapMutations("event", ["setBookingRequirements"]),
    ...mapActions("comment", ["getCommentComponents"]),
    ...mapActions("vendor", ["fetchAllProperties"]),
    _checkConditionScript(requirements) {
      let event = this.event;

      for (let cat in requirements) {
        requirements[cat].map((ms) => {
          if (ms.conditionScript) ms.visible = eval(ms.conditionScript);
          if (ms.conditionScript) ms.isSelected = eval(ms.conditionScript);
          if (ms.defaultQtyScript) ms.defaultQty = Math.ceil(eval(ms.defaultQtyScript));

          if (this.blockId === "giveaways" && (ms.item === "Apparel" || ms.item === "Tech items")) {
            ms.mustHave = false;
          }
        });
      }
    },
    _saveRequirementsInStore(event, action = null) {
      let requirements = this.storedRequirements;

      if (action === "clear") {
        let initRequirements = this.$store.state.event.initBookingRequirements;
        requirements[event.id][this.blockId].requirements = JSON.parse(
          JSON.stringify(initRequirements[event.id][this.blockId].requirements),
        );
        requirements[event.id][this.blockId].anythingElse = null;
      } else {
        requirements[event.id][this.blockId].requirements = JSON.parse(JSON.stringify(this.requirementProperties));
        requirements[event.id][this.blockId].anythingElse = this.anythingElse;
      }
      this.setBookingRequirements(requirements);
    },
    addRequirement(category, property) {
      const index = this.requirementProperties[category].findIndex((it) => it.item == property.item);
      this.requirementProperties[category][index].isSelected = true;
      this.requirementProperties = { ...this.requirementProperties };
      this._saveRequirementsInStore(this.event);
    },
    removeRequirement(category, property) {
      const index = this.requirementProperties[category].findIndex((it) => it.item == property.item);
      this.requirementProperties[category][index].isSelected = false;
      this.requirementProperties = { ...this.requirementProperties };
      this._saveRequirementsInStore(this.event);
    },
    handleMultiSelectChange() {
      this.$forceUpdate();
      this._checkConditionScript(this.requirementProperties);
      this._saveRequirementsInStore(this.event);
    },
    handleSingleSelectChange(e) {
      this.requirementProperties["radio"].map((it) => {
        if (it.subCategory == e.subCategory) it = e;
      });

      this._saveRequirementsInStore(this.event);
    },
    handleSpecialChange(e) {
      if (e && e.hasOwnProperty("note")) {
        this.anythingElse = e.note;
      }

      this._saveRequirementsInStore(this.event);
    },
    handlePropertyChange(requirement) {
      this.requirementProperties = requirement;
      this.$forceUpdate();

      // this._checkConditionScript(this.requirementProperties);
      this._saveRequirementsInStore(this.event);
    },
    handleNoteChange(e) {
      this._saveRequirementsInStore(this.event);
    },

    toggleCommentMode(mode) {
      this.showCommentEditorPanel = mode;
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    fetchData: async function () {
      this.requirementProperties = {};
      this.blockId = this.component.componentId; //this.$route.params.blockId
      this.event = this.$store.state.event.eventData;
      if (
        this.storedRequirements[this.event.id] &&
        this.storedRequirements[this.event.id][this.blockId] &&
        this.storedRequirements[this.event.id][this.blockId].requirements
      ) {
        this.requirementProperties = JSON.parse(
          JSON.stringify(this.storedRequirements[this.event.id][this.blockId].requirements),
        );
        this.anythingElse = JSON.parse(
          JSON.stringify(this.storedRequirements[this.event.id][this.blockId].anythingElse),
        );

        this.isLoading = false;
      }
    },
    revertToOriginal: async function () {
      this._saveRequirementsInStore(this.event, "clear");
      await this.fetchData();
      this.scrollToTop();
      this.$root.$emit("revertRequirements");
    },
    findVendors() {
      let component = new EventComponent({ id: this.component.id });

      postReq("/1/setting-requirements", {
        vendorCategory: this.blockId,
        issuedTime: new Date().getTime(),
        expiredBusinessTime: moment(new Date()).add(3, "days").valueOf(),
        settingsJsonData: JSON.stringify(this.requirementProperties),
        note: this.anythingElse,
        eventComponentInstance: new EventComponent({ id: this.component.id }),
        event: new CalendarEvent({ id: this.eventData.id }),
      }).then((res) => {
        this.$emit("setRequirements", res.data.item);
        this.$store.dispatch("event/getEventAction", { eventId: this.eventData.id });
      });
    },
  },
  created() {
    this.calendar = new Calendar({
      id: this.$store.state.auth.user.profile.defaultCalendarId,
    });
  },
  mounted() {
    this.isLoading = true;

    if (this.eventData.id) {
      console.log(this.eventData.id);
      this.fetchData();
    }
  },
  watch: {
    eventData(newVal, oldVal) {
      if (newVal.id) {
        this.fetchData();
      }
    },
    component(newVal, oldVal) {
      if (newVal.componentId) {
        this.fetchData();
      }
    },
    storedRequirements(newVal, oldVal) {
      if (
        newVal[this.event.id] &&
        newVal[this.event.id][this.blockId] &&
        newVal[this.event.id][this.blockId].requirements
      ) {
        this.requirementProperties = JSON.parse(JSON.stringify(newVal[this.event.id][this.blockId].requirements));
        this.anythingElse = JSON.parse(JSON.stringify(newVal[this.event.id][this.blockId].anythingElse));
        this.isLoading = false;
      }
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
  },
  computed: {
    ...mapGetters({
      storedRequirements: "event/getBookingRequirements",
    }),
    ...mapState("event", ["eventData"]),
  },
};
</script>
<style lang="scss">
.booking-event-requirement {
  width: 100%;
  .section-title {
    font-size: 22px;
    font-family: "Manrope-ExtraBold";
  }
  .events-booking-items {
    padding: 0 2em;
  }
  .requirement-item {
    .requirement-action {
      opacity: 0;
    }
    &:hover {
      .requirement-action {
        opacity: 1;
      }
      .condition {
        opacity: 0.4;
      }
    }
  }
  .requirement-section {
    border-radius: 3px;
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
    background-color: #ffffff;
    padding: 60px;
    margin: 20px 0px;
    &-table {
      border-spacing: 0px;
      width: 100%;
      th {
        text-align: left;
      }
      td,
      th {
        padding: 24px 0;
      }
      tbody {
        td {
          border-top: solid 2px #dbdbdb !important;
          border-collapse: collapse;
          vertical-align: top;

          .empty {
            display: flex;
            align-items: center;
            height: 50px;
          }
        }
      }
      .quantity-input {
        height: 47px;
        box-shadow: none;
        border: solid 0.5px #818080;
        font-family: "Manrope-regular";
        font-size: 16px;
        max-width: 120px;
        margin: 0 16px;
      }
    }
  }
  .booking-section__actions {
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 20px 1.9em;
    background: white;
  }
  .additional-request {
    border-top: solid 2px #dbdbdb !important;
    display: flex;
    align-items: flex-start;
    padding-top: 30px;
    &-description {
      min-width: 350px;
    }
    h4 {
      margin-top: 5px;
      margin-bottom: 10px;
      font-family: "Manrope-Bold";
    }
  }

  .additional-request-tag {
    margin-left: 20px;
    margin-bottom: 10px;
    border: solid 1px #f51355;
    height: 50px;
    border-radius: 25px;
    display: inline-block;
    padding: 10px 20px;
    font-size: 16px;
    font-family: "Manrope-Bold";
    color: #f51355 !important;
    cursor: pointer;
    &.selected {
      border: solid 1px #a0a0a0;
      color: #a0a0a0 !important;
      .icon {
        color: #a0a0a0 !important;
        transform: rotate(45deg);
      }
    }
    .icon {
      margin-left: 10px;
      color: #f51355 !important;
      font-size: 30px !important;
    }
  }
  .special-request-header {
    display: flex;
    align-items: center;
    .title {
      margin-left: 20px;
      margin-right: 40px;
    }
  }
  .anything-else-section {
    padding: 30px 0;

    h4 {
      margin-top: 5px;
      margin-bottom: 10px;
      font-family: "Manrope-Bold";
    }
  }
  .checkbox-label-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    img {
      margin-right: 5px;
      max-width: 25px;
      max-height: 25px;
    }
    margin-left: 10px;
    margin-right: 50px;
  }
  textarea {
    width: 100%;
    resize: none;
    padding: 20px;
    border: solid 1px #a0a0a0;
    border-radius: 3px;
  }
  .multiple-selection {
    width: 300px;
    display: inline-block;
    margin-top: 16px;
    height: 50px;
    .multiselect__select {
      top: 15px;
    }
    .multiselect__tags {
      height: 50px;
      .multiselect__single {
        line-height: 30px;
      }
      .multiselect__tags-wrap {
        display: flex;
        overflow: hidden;

        span {
          margin-right: 5px;
          flex-shrink: 0;
          font-size: 16px;
          font-family: "Manrope-regular";
        }
      }
    }
    .multiselect__input {
      height: 30px;
      text-transform: capitalize;
    }
    .multiselect__placeholder {
      line-height: 20px;
    }
  }
}
</style>
