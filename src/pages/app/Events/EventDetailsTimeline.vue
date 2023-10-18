<template>
  <div class="md-layout event-details-timeline timeline-section with-progress-bar">
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
      <div class="header-name">
        <div class="font-size-30 font-bold text-transform-capitalize mb-20">
          <img :src="`${newTimeLineIconsURL}timeline-title.svg`" class="page-icon" />
          CREATE TIMELINE
        </div>
        <div class="font-size-16" v-if="isEditMode">
          <b>Things are warming up!</b> It’s time to create your event timeline! <br />We helped you with the basic
          structure
        </div>
        <div class="font-size-16" v-if="!isEditMode">
          Now that you’re making progress with building the timeline- <br />you can <b>assign slots to vendors</b> so
          that your invitees will know what to expect!
        </div>
      </div>
      <header-actions
          @toggleCommentMode="toggleCommentMode"
          @share="share"
          @export="exportToPdf"></header-actions>
    </div>
    <div class="md-layout">
      <div
        class="md-layout-item md-xlarge-size-65 md-large-size-65 md-small-size-50 time-line-section mr-auto mt-20"
        ref="content"
      >
        <button v-scroll-to="'#timeline-edit-card'" ref="scrollBtn" style="display: none">
          Scroll to the editing card
        </button>
        <timeline-edit-panel :isEditMode="isEditMode" :editingMode="editingMode"></timeline-edit-panel>
      </div>
      <md-card
        class="md-card-plain time-line-blocks md-layout-item md-xlarge-size-35 md-large-size-35 md-small-size-40"
        style="margin-top: 16px; padding-right: 3em"
        v-if="isEditMode"
      >
        <md-card-content class="md-layout time-line-blocks_items mb-60">
          <div class="text-center width-100 p-10 font-size-16 mb-10">Drag Time Slots timeline</div>

          <div v-for="(section, index) in blocksList" :key="index" class="md-layout-item md-size-100 mb-30">
            <div v-for="block in section" :key="block.id" class="md-layout-item md-size-100">
              <drag :transfer-data="{ block }" class="time-line-blocks_item" :style="`color :` + block.color">
                <div class="font-size-16 font-bold text-transform-capitalize d-flex align-center">
                  <md-icon>drag_indicator</md-icon>
                  <img :src="`${newTimeLineIconsURL}${block.icon.toLowerCase()}.svg`" class="label-icon mr-10" />
                  {{ block.buildingBlockType }}
                </div>
              </drag>
            </div>
          </div>
        </md-card-content>
      </md-card>
    </div>
    <timeline-gap-modal
      v-if="showTimelineGapModal"
      :timelineGap="timelineGaps[0]"
      @close="showTimelineGapModal = false"
      @yes="finalize"
    ></timeline-gap-modal>

    <planner-event-footer id="footer-panel">
      <template slot="buttons">
        <template v-if="isEditMode">
          <md-button class="md-simple md-button md-black maryoku-btn" @click="revert">
            <span class="font-size-16 text-transform-capitalize">
              <img class="mr-20" :src="`${$iconURL}Campaign/Group 8871.svg`" />Revert to original
            </span>
          </md-button>
          <span class="seperator"></span>
          <md-button class="md-simple md-button md-black maryoku-btn" @click="startFromScratch">
            <span class="font-size-16 text-transform-capitalize">
              <img class="mr-10 label-icon" :src="`${$iconURL}Timeline-New/Trash.svg`" />
              Start from scratch
            </span>
          </md-button>
          <md-button class="md-simple md-button md-red maryoku-btn md-outlined" @click="saveDraft">
            <span class="font-size-16 text-transform-capitalize">
              <img class="mr-20 label-icon" :src="`${$iconURL}Timeline-New/save-red.svg`" />
              Save Draft
            </span>
          </md-button>
          <md-button class="md-button md-red maryoku-btn" @click="finalize" key="finalize-button">
            <span class="font-size-16 text-transform-capitalize">Finalize timeline</span>
          </md-button>
        </template>
        <template v-else>
          <div class="ml-40 mr-40">
            <img :src="`${$iconURL}Campaign/Group 9222.svg`" />
            Timeline Is Finalized.
          </div>
          <span class="seperator" style="margin-top: 0; margin-left: 30px"></span>
          <md-button class="md-button md-red md-simple maryoku-btn" @click="isEditMode = true" key="edit-button">
            <span class="font-size-16 text-transform-capitalize">Edit Timeline</span>
          </md-button>
        </template>
      </template>
    </planner-event-footer>
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="false"
      :paginate-elements-by-height="1400"
      :filename="`timeline-${eventData.id}`"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="700px"
      @progress="onProgress($event)"
      @hasStartedGeneration="hasStartedGeneration()"
      @hasGenerated="hasGenerated($event)"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <!-- PDF Content Here -->
        <timeline-pdf-panel></timeline-pdf-panel>
      </section>
    </vue-html2pdf>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import EventTimelineItem from "@/models/EventTimelineItem";
import moment from "moment";
import { extendMoment } from "moment-range";
import Swal from "sweetalert2";
import { SlideYDownTransition } from "vue2-transitions";
import InputMask from "vue-input-mask";
import { Modal, LabelEdit, LocationInput } from "@/components";

import TimelineTemplateItem from "./components/TimelineTemplateItem";
import TimelineItem from "./components/TimelineItem";
import TimelineEmpty from "./components/TimelineEmpty";

import VueElementLoading from "vue-element-loading";
// import auth from '@/auth';
import EventBlocks from "./components/NewEventBlocks";
import draggable from "vuedraggable";
import { Drag, Drop } from "vue-drag-drop";
import _ from "underscore";

const VueHtml2pdf = () => import("vue-html2pdf");

import HeaderActions from "@/components/HeaderActions";
import CommentEditorPanel from "./components/CommentEditorPanel";
import TimelineEditPanel from "./components/TimelineEditPanel";
import TimelinePdfPanel from "./components/TimelinePdfPanel";
import ProgressSidebar from "./components/progressSidebar";
import PlannerEventFooter from "@/components/Planner/FooterPanel";
import { timelineBlockItems } from "@/constants/event";
import TimelineGapModal from "./Modals/TimelineGapModal";

import { timelineTempates } from "@/constants/event.js";
import {CommentMixins, ShareMixins} from "@/mixins";
import { postReq, getReq } from "@/utils/token";
export default {
  name: "event-details-timeline",
  components: {
    VueElementLoading,
    EventBlocks,
    draggable,
    Drag,
    Drop,
    SlideYDownTransition,
    InputMask,
    ProgressSidebar,
    Modal,
    LocationInput,
    HeaderActions,
    CommentEditorPanel,
    PlannerEventFooter,
    TimelineTemplateItem,
    TimelineItem,
    TimelineEmpty,
    TimelineGapModal,
    TimelineEditPanel,
    VueHtml2pdf,
    TimelinePdfPanel,
  },
  props: {
    // event: Object,
    // eventComponents: [Array, Function]
  },
  mixins: [CommentMixins, ShareMixins],
  data: () => ({
    // auth: auth,
    editingMode: "template",
    calendar: new Calendar(),
    isLoading: true,
    selectedDate: "",
    blocksList: timelineBlockItems,
    originalTimelineItems: [],
    timelineItems: [],
    timelineDates: [],
    hoursArray: [],
    disabledDragging: false,
    timelineAttachment: null,
    timelineIconsURL: "https://static-maryoku.s3.amazonaws.com/storage/icons/timeline/svg/",
    menuIconsURL: "https://static-maryoku.s3.amazonaws.com/storage/icons/menu%20_%20checklist/SVG/",
    event: {},
    showDeleteConfirmModal: false,
    deletingDate: -1,
    newTimeLineIconsURL: "https://static-maryoku.s3.amazonaws.com/storage/icons/Timeline-New/",

    isEditMode: true,
    timeline: [
      {
        date: "20/04/2020",
        items: [],
        itemDay: null,
      },
    ],

    currentAttachments: [],
    showCommentEditorPanel: false,
    showTimelineGapModal: false,
    timelineGaps: [],
  }),
  methods: {
    ...mapMutations("event", ["setEventData"]),

    //pdf handling event
    onProgress() {},
    hasStartedGerneration() {},
    hasGenerated() {},
    download() {
      this.$router.push({
        path: `/events/` + this.eventData.id + `/edit/timeline/export`,
      });
    },
    /**
     * Handle drop block to time line items
     * @param data
     * @param event
     */
    getAddedTimelineItem(index, template, selectedBlock) {
      if (selectedBlock) {
        let block = Object.assign({}, selectedBlock);
        if (template.id) block.id = template.id;
        else block.id = null;
        block.mode = "edit";
        block.startTime = moment(`${template.date} 00:00 am`, "DD/MM/YY hh:mm a").valueOf();
        block.endTime = moment(`${template.date} 00:00 am`, "DD/MM/YY hh:mm a").valueOf();

        if (index == 0) {
          if (this.eventData.eventDayPart == "evening") {
            block.startTime = moment(`${template.date} 07:00 PM`, "DD/MM/YY hh:mm A").valueOf();
            block.endTime = moment(`${template.date} 08:00 PM`, "DD/MM/YY hh:mm A").valueOf();
          } else {
            block.startTime = moment(`${template.date} 08:00 AM`, "DD/MM/YY hh:mm A").valueOf();
            block.endTime = moment(`${template.date} 09:00 AM`, "DD/MM/YY hh:mm A").valueOf();
          }
        } else {
          const prevItem = this.timelineItems[template.date][index - 1];
          if (prevItem.status !== "template") {
            block.startTime = prevItem.endTime;
            block.endTime = prevItem.endTime + 3600 * 1000;
          }
        }

        block.title = selectedBlock.buildingBlockType;
        block.startDuration = "am";
        block.endDuration = "am";
        block.attachmentName = "";
        block.isItemLoading = false;
        block.icon = selectedBlock.icon;
        block.date = template.date;
        block.event = { id: this.eventData.id };
        return block;
      }
      return null;
    },

    removeItem({ index, item }) {
      this.timelineItems[item.date].splice(index, 1);
    },
    modifyItem(item) {
      const index = this.timelineItems.findIndex((it) => it.id === item.id);
      this.$set(this.timelineItems[index], "mode", "edit");
      this.disabledDragging = true;
    },
    previewEvent() {
      this.$router.push({
        name: "EventDetails",
        params: { id: this.eventData.id },
      });
    },
    getTimelineItems() {
      let event = new CalendarEvent({ id: this.eventData.id });
      this.$http.get(`${process.env.SERVER_URL}/1/events/${event.id}/timelineItems`).then((res) => {
        this.timelineItems = Object.assign({}, res.data);
        this.originalTimelineItems = JSON.stringify(res.data);
        this.timelineDates = Object.keys(this.timelineItems).sort();
        this.$root.$emit("timeline-updated", this.timelineItems);
      });
    },
    cancleTimeline({ item, index }) {
      if (!this.timelineItems[item.date][index].id) {
        this.timelineItems[item.date].splice(index, 1);
      }
    },
    saveTimeline({ item, index }) {
      console.log(item);
      item.mode = "saved";
      console.log(this.timelineItems);
      this.timelineItems[item.date][index] = { ...item };
      if (index >= 1) {
        const prevItem = this.timelineItems[item.date][index - 1];
        if (item.startTime - prevItem.endTime > 1000) {
          this.timelineItems[item.date].splice(index, 0, {
            date: item.date,
            status: "timegap",
            timeGap: { start: prevItem.endTime, end: item.startTime },
          });
          this.timelineItems[item.date] = [...this.timelineItems[item.date]];
        }
      }
      // this.timelineItems = { ...this.timelineItems };
    },
    saveTimelineItem(item) {
      this.setItemLoading(item, true, true);
      let event = new CalendarEvent({ id: this.eventData.id });
      // let order = ++index;

      const newTimeline = {
        event: { id: event.id },
        title: item.title,
        buildingBlockType: item.buildingBlockType,
        description: item.description,
        startTime: moment(`${item.date} ${item.startTime}`, "DD/MM/YY hh:mm a").valueOf(),
        endTime: moment(`${item.date} ${item.endTime}`, "DD/MM/YY hh:mm a").valueOf(),
        endDuration: item.endDuration,
        startDuration: item.startDuration,
        // order: order,
        icon: item.icon,
        color: item.color,
        link: item.link,
        location: item.location,
        date: item.date,
        plannedDate: moment(item.date, "DD/MM/YY").valueOf(),
        status: "saved",
      };

      if (item.id) {
        newTimeline.id = item.id;
      }
      new EventTimelineItem(newTimeline)
        .for(this.calendar, event)
        .save()
        .then((res) => {
          this.getTimelineItems();
          this.disabledDragging = false;
          this.$root.$emit("timeline-updated", this.timelineItems);
          this.setItemLoading(item, false, true);
        })
        .catch((error) => {
          this.disabledDragging = false;
          this.$root.$emit("timeline-updated", this.timelineItems);
          this.setItemLoading(item, false, true);
        });
    },
    updateTimelineItem(item) {
      this.setItemLoading(item, true, true);
      if (!item.startTime || !item.endTime || (!item.title && !item.description)) {
        this.$set(item, "isItemLoading", false);
        this.$notify({
          message: "From time, To time and ( Title or Description ) id Required",
          horizontalAlign: "center",
          verticalAlign: "top",
          icon: "warning",
        });

        this.setItemLoading(item, false, true);
        return;
      }

      let event = new CalendarEvent({ id: this.eventData.id });

      let timelineItem = new EventTimelineItem({ id: item.id }).for(this.calendar, event);

      timelineItem.title = item.title;
      timelineItem.description = item.description;
      timelineItem.startTime = item.startTime;
      timelineItem.endTime = item.endTime;
      timelineItem.link = item.link;
      timelineItem.location = item.location;
      timelineItem.attachments = item.attachments;
      if (this.currentAttachments.length > 0) {
        this.uploadAttachment(item.attachment, item.attachmentName, (results) => {
          if (!timelineItem.attachments) {
            timelineItem.attachments = [];
          }
          timelineItem.attachments = timelineItem.attachments.concat(results);
          timelineItem.attachmentName = "";
          timelineItem
            .save()
            .then((res) => {
              this.getTimelineItems();
              this.disabledDragging = false;
              this.$root.$emit("timeline-updated", this.timelineItems);
            })
            .catch((error) => {
              this.disabledDragging = false;
              this.$root.$emit("timeline-updated", this.timelineItems);
            });

          this.currentAttachments = []; //intialized attachmentslist
          item.attachmentName = "";
        });
      } else {
        timelineItem
          .save()
          .then((res) => {
            this.getTimelineItems();
            this.disabledDragging = false;
            this.$root.$emit("timeline-updated", this.timelineItems);
          })
          .catch((error) => {
            console.log(error);
            this.disabledDragging = false;
            this.$root.$emit("timeline-updated", this.timelineItems);
          });
      }
    },
    async uploadAttachment(file, attachmentName, callback) {
      const attachments = [];
      for (let i = 0; i < this.currentAttachments.length; i++) {
        const fileItem = this.currentAttachments[i];
        let formData = new FormData();
        formData.append("file", fileItem);
        formData.append("from", "timeline");
        formData.append("type", "attachment");
        formData.append("name", fileItem.name);
        const result = await this.$http.post(`${process.env.SERVER_URL}/uploadFile`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        attachments.push({
          originalName: fileItem.name,
          url: result.data.upload.path,
          name: result.data.upload.name,
        });
      }
      callback(attachments);
    },
    updateTimelineITemsOrder() {
      this.isLoading = true;
      let event = new CalendarEvent({ id: this.eventData.id });

      let new_order = 1;
      const timelineItemsForUpdate = [];
      this.timelineItems.forEach((item) => {
        item.order = new_order;
        timelineItemsForUpdate.push({ id: item.id, order: new_order });
        new_order += 1;
      });

      let timelineItem = new EventTimelineItem({
        id: "updateMultiple",
        timelineItems: timelineItemsForUpdate,
      }).for(this.calendar, event);
      timelineItem.order = new_order;
      timelineItem
        .save()
        .then((res) => {
          /* this.$notify(
                      {
                        message: "Timeline Items order modified successfully",
                        horizontalAlign: 'center',
                        verticalAlign: 'top',
                        type: 'success'
                      }); */
          this.eventData.timelineItems = this.timelineItems;
          this.isLoading = false;
          this.$root.$emit("timeline-updated", this.timelineItems);
        })
        .catch((error) => {
          this.$root.$emit("timeline-updated", this.timelineItems);
        });
    },
    setItemLoading(item, loading, force) {
      this.$set(item, "isItemLoading", loading);
      if (force) {
        this.$set(item, "mode", "saved");
        this.$set(item, "mode", "edit");
      } else {
        this.$set(item, "mode", "edit");
        this.$set(item, "mode", "saved");
      }
    },
    onFileChange(event) {
      let files = event.target.files || event.dataTransfer.files;
      if (!files.length) return;
      let reader = new FileReader();
      let vm = this;
      if (event.target.name) {
        const itemId = event.target.getAttribute("data-item");
        const timelineIndex = event.target.getAttribute("data-timelineindex");
        const itemIndex = event.target.getAttribute("data-itemIndex");
        let isLargeFile = false;

        for (let i = 0; i < files.length; i++) {
          if (files[i].size > 10 * 1024 * 1024) {
            isLargeFile = true;
          }
        }
        if (isLargeFile) {
          Swal.fire({
            title: "This file is larger than 10MB",
            showCloseButton: true,
            text: "Please choose another file",
            confirmButtonClass: "md-button md-red",
            confirmButtonText: "I got it",
            buttonsStyling: false,
          })
            .then((result) => {})
            .catch((err) => {
              console.log(err);
            });
        } else {
          // vm.timeline[timelineIndex].items[itemIndex].attachmentName = files[0].name
          // vm.timeline[timelineIndex].items[itemIndex].attachment = files[0]
          for (let i = 0; i < files.length; i++) {
            this.currentAttachments.push(files[i]);
          }
        }
      } else {
        this.createImage(files[0]);
      }
    },
    createImage(file, type) {
      let reader = new FileReader();
      let vm = this;

      reader.onload = (e) => {
        if (type === "attachment") {
          vm.timelineAttachment = e.target.result;
          vm.timelineoriginalAttachmentName = file.name;
        } else {
          // vm.imageRegular = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    },
    openAttachment(path) {
      window.open(`https://static-maryoku.s3.amazonaws.com/${path}`, "_blank");
    },
    formatDate(date) {
      if (typeof date == "number") {
        return moment(new Date(date)).format("MM/DD/YY");
      }
      return moment(date).format("MM/DD/YY");
    },
    formatHour(date) {
      return moment(new Date(date)).format("hh:mm A");
    },
    addTimelineItem(index) {
      let timelineLength = this.timeline.length - 1;
      let nextDay = 0;
      if (typeof this.timeline[index].itemDay == "number") nextDay = this.timeline[index].itemDay + 1000 * 60 * 60 * 24;
      else nextDay = this.timeline[index].itemDay.getTime() + 1000 * 60 * 60 * 24;

      if (this.timeline[index + 1] && this.formatDate(this.timeline[index + 1].itemDay) === this.formatDate(nextDay)) {
        return;
      }
      this.timeline.forEach((item, index) => {
        this.timeline[index].isEditable = false;
      });
      this.timeline.splice(index + 1, 0, {
        date: this.formatDate(nextDay),
        items: [],
        itemDay: nextDay,
        isEditable: true,
      });
    },

    onConfirm() {
      this.value = "Agreed";
    },
    onCancel() {
      this.value = "Disagreed";
    },
    editTimeline(index) {
      if (!this.timeline[index]) return;
      const isEdit = this.timeline[index].isEditable;
      this.timeline.forEach((item, index) => {
        this.timeline[index].isEditable = false;
      });
      this.timeline[index].isEditable = !isEdit;
      this.$forceUpdate();
    },
    closeEditTimeline(index) {},

    removeAttachment(timelineItem, attachmentIndex) {
      timelineItem.attachments.splice(attachmentIndex, 1);
    },
    removeSelectedAttachment(index) {
      this.currentAttachments.splice(index, 1);
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    toggleCommentMode(mode) {
      this.showCommentEditorPanel = mode;
    },
    initData(event) {
      // this.setEventData(event);
      this.timeline[0].date = this.formatDate(event.eventStartMillis);
      this.timeline[0].itemDay = event.eventStartMillis;
      // this.getTimelineItems();
    },
    async clearTimeline() {
      await getReq(`/1/events/${this.eventData.id}/timelineDates/clear`);
    },
    async revert() {
      Swal.fire({
        title: "Do you really want to revert all?",
        showCancelButton: true,
        confirmButtonClass: "md-button md-success",
        confirmButtonText: "Ok",
        cancelButtonClass: "md-button md-danger md-simple md-red ",
        cancelButtonText: "Cancel",
        buttonsStyling: false,
      }).then(async (result) => {
        if (result.value === true) {
          await this.clearTimeline();
          this.editingMode = "template";
          const extendedMoment = extendMoment(moment);
          const start = new Date(this.eventData.eventStartMillis);
          const end = new Date(this.eventData.eventEndMillis);
          const range = extendedMoment.range(moment(start), moment(end));

          const dateList = Array.from(range.by("day")).map((m) => m.format("YYYY-MM-DD"));
          const timelineDates = [];
          dateList.forEach((d) => {
            timelineDates.push({
              date: d,
              templates: timelineTempates,
              status: "editing",
            });
          });
          this.$store.dispatch("event/saveEventAction", new CalendarEvent({ id: this.eventData.id, timelineDates }));
        }
      });
    },
    async startFromScratch() {
      Swal.fire({
        title: "Do you really want to start from scratch?",
        showCancelButton: true,
        confirmButtonClass: "md-button md-success",
        confirmButtonText: "Ok",
        cancelButtonClass: "md-button md-danger md-simple md-red ",
        cancelButtonText: "Cancel",
        buttonsStyling: false,
      })
        .then(async (result) => {
          console.log(result);
          if (result.value === true) {
            await this.clearTimeline();
            this.editingMode = "scratch";
            const extendedMoment = extendMoment(moment);
            const start = new Date(this.eventData.eventStartMillis);
            const end = new Date(this.eventData.eventEndMillis);
            const range = extendedMoment.range(moment(start), moment(end));

            const dateList = Array.from(range.by("day")).map((m) => m.format("YYYY-MM-DD"));
            const timelineDates = [];
            dateList.forEach((d) => {
              timelineDates.push({
                date: d,
                templates: [{ name: "slot-1", type: "slot" }],
                status: "editing",
              });
            });
            this.$store.dispatch("event/saveEventAction", new CalendarEvent({ id: this.eventData.id, timelineDates }));
          }
        })
        .catch((err) => {});
    },
    saveDraft() {
      this.$store
        .dispatch("event/saveEventAction", new CalendarEvent({ id: this.eventData.id, timelineProgress: 0 }))
        .then((event) => {
          Swal.fire({
            title: "Good Job! ",
            text: "Your working timeline is saved successfully! You can change it anytime!",
            showCancelButton: false,
            confirmButtonClass: "md-button md-success",
            confirmButtonText: "Ok",
            buttonsStyling: false,
          })
            .then((result) => {
              if (result.value === true) {
                return;
              }
            })
            .catch((err) => {});
        });
    },
    finalize() {
      if (this.checkTimeGap()) {
        this.showTimelineGapModal = false;
        console.log(this.eventData);
        const newEvent = new CalendarEvent({
          id: this.eventData.id,
          // timelineDates: this.eventData.timelineDates,
          timelineProgress: 100,
        });
        this.$store.dispatch("event/saveEventAction", newEvent).then((event) => {
          this.isEditMode = false;
          // Swal.fire({
          //   title: "Good Job! ",
          //   text: "You finalise timeline and your event will be processed according your timelines!",
          //   showCancelButton: false,
          //   confirmButtonClass: "md-button md-success",
          //   confirmButtonText: "Ok",
          //   buttonsStyling: false,
          // })
          //   .then((result) => {
          //     // if (result.value === true) {
          //     //   console.log(this.eventData);
          //     //   const updatedEvent = new CalendarEvent({
          //     //     id: this.eventData.id,
          //     //     calendar: new Calendar({
          //     //       id: this.eventData.calendar.id,
          //     //     }),
          //     //   });
          //     //   this.$store.dispatch("event/saveEventAction", updatedEvent);
          //     //   return;
          //     // }
          //   })
          //   .catch((err) => {});
        });
        // this.$http
        //   .post(`${process.env.SERVER_URL}/1/events/${this.eventData.id}/timelineItems`, this.timelineItems, {
        //     headers: this.$auth.getAuthHeader(),
        //   })
        //   .then((res) => {});
      }
    },
    checkTemplates() {
      const templates = [];
      this.timelineDateKeys.forEach((dateKey) => {
        this.timelineItems[dateKey].forEach((item) => {
          if (item.status === "timegap") {
            templates.push(item);
          }
        });
      });
      if (templates.length > 0) {
        Swal.fire({
          title: "Sorry, there is a still template ",
          showCancelButton: false,
          confirmButtonClass: "md-button md-success",
          confirmButtonText: "Ok, I got it",
          buttonsStyling: false,
        })
          .then((result) => {
            if (result.value === true) {
              return;
            }
          })
          .catch((err) => {});
        return false;
      }
      return true;
    },
    checkTimeGap() {
      // const timeGaps = [];
      // this.timelineDateKeys.forEach((dateKey) => {
      //   this.timelineItems[dateKey].forEach((item) => {
      //     if (item.status === "timegap") {
      //       timeGaps.push(item);
      //     }
      //   });
      // });
      // if (timeGaps.length > 0) {
      //   this.timelineGaps = { ...timeGaps };
      //   this.showTimelineGapModal = true;
      //   return false;
      // }
      return true;
    },
    exportToPdf() {
      this.$refs.html2Pdf.generatePdf();
    },
  },
  created() {
    console.log('timeline.created');
    [...Array(12).keys()].map((x) => (x >= 8 ? this.hoursArray.push(`${x}:00 AM`) : undefined));
    [...Array(12).keys()].map((x) => (x === 0 ? this.hoursArray.push(`12:00 PM`) : this.hoursArray.push(`${x}:00 PM`)));
    [...Array(8).keys()].map((x) => (x === 0 ? this.hoursArray.push(`12:00 AM`) : this.hoursArray.push(`${x}:00 AM`)));
    this.calendar = new Calendar({
      id: this.currentUser.profile.defaultCalendarId,
    });

    this.hoursArray.push();

    if (this.eventData) {
      this.initData(this.eventData);
      if (this.eventData.timelineProgress === 100) {
        this.isEditMode = false;
      }
      this.isLoading = false;
    }
  },
  mounted() {
    this.isLoading = true;
    this.$root.$on("remove-template", ({ item, index }) => {
      this.timelineItems[item.date].splice(index, 1);
    });
    this.$root.$on("add-template", ({ date, block, index }) => {
      const prevItem = this.timelineItems[date][index];
      const nextItem = this.timelineItems[date][index + 1];
      if (
        prevItem &&
        nextItem &&
        prevItem.status !== "template" &&
        nextItem.status !== "template" &&
        nextItem.startTime - prevItem.endTime < 1000
      ) {
        Swal.fire({
          title: "Sorry, there is no time gap! ",
          showCancelButton: false,
          confirmButtonClass: "md-button md-success",
          confirmButtonText: "Ok, I got it",
          buttonsStyling: false,
        })
          .then((result) => {
            if (result.value === true) {
              return;
            }
          })
          .catch((err) => {});
        return;
      }
      const newTimeline = this.getAddedTimelineItem(index + 1, { date: date, action: "edited" }, block);
      console.log("newTimeline", newTimeline);
      if (newTimeline) this.timelineItems[date].splice(index + 1, 0, newTimeline);
    });
  },
  computed: {
    ...mapState("event", ["eventData"]),

    currentUser() {
      return this.$store.state.auth.user;
    },
    dateFormat: {
      get() {
        return this.$material.locale.dateFormat;
      },
      set(val) {
        this.$material.locale.dateFormat = val;
      },
    },
    permission() {
      try {
        return this.$store.state.event.eventData.permit ? this.$store.state.event.eventData.permit : "edit";
      } catch (e) {
        return "edit";
      }
    },
    canComment() {
      return this.permission === "edit" || this.permission === "comment";
    },
    canEdit() {
      return this.permission === "edit";
    },
    timelineDateKeys() {
      return Object.keys(this.timelineItems).sort((a, b) => {
        return moment(a, "DD/MM/YY") > moment(b, "DD/MM/YY") ? 1 : -1;
      });
    },
  },
  watch: {
    eventData(newVal, oldVal) {
      this.$root.$emit("set-title", this.eventData, this.routeName === "EditBuildingBlocks", true);
      this.initData(newVal);
    },
  },
};
</script>
<style scoped lang="scss">
$btn-color: #fff;
.remove-attachment {
  font-size: 10px !important;
  margin-right: -10px !important;
  transform: rotate(0deg) !important;
  cursor: pointer;
}
@import "../../styles/EventDetailsTimeline.scss";
</style>
