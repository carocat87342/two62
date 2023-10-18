<template>
  <div class="timeline-items-list">
    <div class="timeline-items-list__item" v-for="(scheduleDate, dateIndex) in timelineDates" :key="scheduleDate.date">
      <div class="item-header mb-20">
        <div class="header-title font-size-14 color-gray text-transform-capitalize">
          <div class="time-line-edit d-flex justify-content-center align-center">
            <label style="white-space: nowrap; padding-right: 10px">Day {{ numberToWord(dateIndex + 1) }}</label>
            <div>
              {{ $dateUtil.formatScheduleDay(scheduleDate.date, "MM/DD/YY") }}
            </div>
          </div>
        </div>
        <div class="header-actions" v-if="isEditMode">
          <md-button
            class="md-default md-icon-button md-simple md-just-icon md-wrapper edit-btn"
            style="font-size: 26px !important"
            @click="addNewDateAfterCurrent(scheduleDate.date)"
          >
            <md-icon>add_circle</md-icon>
          </md-button>
          <md-button
            class="md-default md-simple md-just-icon md-wrapper edit-btn"
            style="font-size: 26px !important"
            @click="askRemoveTimelineItem(scheduleDate.date)"
          >
            <md-icon>delete_outline</md-icon>
          </md-button>
        </div>
      </div>
      <template v-if="isEditMode">
        <div
          v-for="(template, templateIndex) in scheduleDate.templates"
          :key="`${template.name}-${templateIndex}`"
          class="timeline-group-wrapper time-line-item"
        >
          <timeline-empty
            :index="templateIndex"
            :date="scheduleDate"
            v-if="templateIndex == 0"
            @addSlot="addSlot(dateIndex, templateIndex + 1, ...arguments)"
          ></timeline-empty>
          <timeline-template-container
            :template="template"
            :groupIndex="templateIndex"
            :timelineDate="{ dateIndex: dateIndex, ...scheduleDate }"
            @remove="removeTemplate(dateIndex, templateIndex, template)"
          ></timeline-template-container>
          <timeline-empty
            :index="templateIndex"
            :date="scheduleDate"
            @addSlot="addSlot(dateIndex, templateIndex + 1, ...arguments)"
          ></timeline-empty>
        </div>
      </template>
      <template v-else>
        <timeline-item
          v-for="(timelineItem, index) in scheduleDate.timelineItems"
          :key="`timelineItem-${index}`"
          :item="timelineItem"
          :index="index"
          :timelineDate="scheduleDate"
          class="mt-10 mb-10 timeline-group-wrapper"
          @remove="removeItem"
          :editMode="false"
        ></timeline-item>
      </template>
    </div>
    <!-- Confirm Modal-->
    <modal v-if="showDeleteConfirmModal" class="delete-timeline-model">
      <template slot="header">
        <div class="maryoku-modal-header delete-timeline-model__header">
          <h2>
            Are you sure you want to say
            <br />goodbye to your changes?
          </h2>
          <div class="header-description">Your changes will be deleted after that</div>
          <md-button
            class="md-simple md-just-icon md-round modal-default-button modal-close-button"
            @click="showDeleteConfirmModal = false"
          >
            <md-icon>clear</md-icon>
          </md-button>
        </div>
      </template>
      <template slot="footer">
        <md-button class="md-default md-simple cancel-btn" @click="showDeleteConfirmModal = false">Cancel</md-button>
        <md-button class="md-red add-category-btn" @click="removeTimelineItem">Yes,I'm sure</md-button>
      </template>
    </modal>
  </div>
</template>
<script>
import { numberToWord } from "@/utils/helperFunction";
import { Drag, Drop } from "vue-drag-drop";
import TimelineTemplateItem from "./TimelineTemplateItem";
import TimelineItem from "./TimelineItem";
import TimelineEmpty from "./TimelineEmpty";
import TimelineTemplateContainer from "./TimelineTemplateContainer";
import TimelineGapModal from "../Modals/TimelineGapModal";
import EventTimelineDate from "@/models/EventTimelineDate";
import CalendarEvent from "@/models/CalendarEvent";
import moment from "moment";
import { Modal } from "@/components";
import { timelineTempates } from "@/constants/event.js";
export default {
  name: "event-details-timeline",
  components: {
    Drop,
    TimelineTemplateItem,
    TimelineItem,
    TimelineEmpty,
    TimelineGapModal,
    TimelineTemplateContainer,
    Modal,
  },
  created() {
    this.$store.dispatch("event/getTimelineDates", this.event.id);
  },
  computed: {
    event() {
      return this.$store.state.event.eventData;
    },
    timelineDates() {
      if (this.event) {
        return this.event.timelineDates;
      }
      return [];
    },
  },
  data() {
    return {
      showDeleteConfirmModal: false,
    };
  },
  props: {
    isEditMode: {
      type: Boolean,
      default: true,
    },
    editingMode: {
      type: String,
      default: "template",
    },
  },
  mounted() {
    console.log('timeline.edit.panel', this.timelineDates);
  },
    methods: {
    formatDate() {},
    numberToWord(num) {
      return numberToWord(num);
    },
    getDisabledDates(index) {
      const vm = this;
      const checkDate = function (date) {
        if (index == 0) {
          return false;
        }
        if (!vm.timeline[index + 1]) return date.getTime() <= new Date(this.timelineDates[index - 1]).getTime();
        return (
          date.getTime() <= new Date(this.timelineDates[index - 1]).getTime() ||
          date.getTime() >= new Date(this.timelineDates[index + 1]).getTime()
        );
      };
      return checkDate;
    },
    closeEditTimeline(index) {},
    addNewDateAfterCurrent(scheduleDate) {
      const currentDate = new moment(scheduleDate, "YYYY-MM-DD");
      const newDate = moment(currentDate).add(1, "d");
      if (this.timelineDates.findIndex((item) => item.date === newDate.format("YYYY-MM-DD")) >= 0) {
        Swal.fire({
          title: `Sorry you have timelins on ${newDate.format("DD/MM/YY")}`,
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
          .catch((err) => {
            return;
          });
      } else {
        new EventTimelineDate({
          date: newDate.format("YYYY-MM-DD"),
          templates: timelineTempates,
          status: "editing",
          event: new CalendarEvent({ id: this.event.id }),
        })
          .for(new CalendarEvent({ id: this.event.id }))
          .save()
          .then((res) => {
            this.timelineDates.push(res);
          });
      }
    },
    askRemoveTimelineItem(scheduleDate) {
      this.deletingDate = scheduleDate;
      this.showDeleteConfirmModal = true;
    },
    removeItem() {
      alert();
    },
    removeTimelineItem() {
      // alert();
      const deletingDateIndedx = this.timelineDates.indexOf(this.deletingDate);
      this.timelineDates.splice(deletingDateIndedx, 1);
      this.showDeleteConfirmModal = false;
    },
    addSlot(dateIndex, templateIndex, slotData) {
      const newTimelineItem = this.gettingSlotData(slotData, this.timelineDates[dateIndex].date);
      newTimelineItem.groupNumber = templateIndex;
      this.timelineDates[dateIndex].timelineItems.push(newTimelineItem);
      this.timelineDates[dateIndex].templates.splice(templateIndex, 0, { name: "test", type: "slot" });
      console.log(this.timelineDates);
    },
    gettingSlotData(data, scheduleDate) {
      let block = Object.assign({}, data.block);
      block.mode = "edit";

      if (this.event.eventDayPart == "evening") {
        block.startTime = moment(`${scheduleDate} 07:00 PM`, "YYYY-MM-DD hh:mm A").valueOf();
        block.endTime = moment(`${scheduleDate} 08:00 PM`, "YYYY-MM-DD hh:mm A").valueOf();
      } else {
        block.startTime = moment(`${scheduleDate} 08:00 AM`, "YYYY-MM-DD hh:mm A").valueOf();
        block.endTime = moment(`${scheduleDate} 09:00 AM`, "YYYY-MM-DD hh:mm A").valueOf();
      }

      block.title = data.block.buildingBlockType;
      block.startDuration = "am";
      block.endDuration = "am";
      block.attachmentName = "";
      block.isItemLoading = false;
      block.icon = data.block.icon;
      block.date = this.scheduleDate;
      block.groupNumber = this.groupIndex;
      block.event = new CalendarEvent({ id: this.event.id });
      this.isHover = false;
      delete block.id;
      console.log(block);
      return block;
    },
    removeTemplate(dateIndex, templateIndex, template) {
      this.timelineDates[dateIndex].templates.splice(templateIndex, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.timeline-items-list {
  .timeline-group-wrapper {
    position: relative;
    &:not(:last-child)::before {
      content: "";
      position: absolute;
      border-left: dashed 1px #908f8f;
      height: 100%;
      top: 75px;
      left: 30px;
    }
  }
  margin-top: 1em;
  height: 100%;
  &__item {
    padding-bottom: 1em;
    .item-header {
      position: relative;
      text-align: center;
      min-height: 30px;
      &:before {
        content: " ";
        position: absolute;
        top: 16px;
        border: 0.5px solid #a0a0a0;
        left: 0px;
        width: 100%;
      }

      .header-title {
        position: absolute;
        left: 50%;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        top: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10px;
        background-color: #f5f5f5;
      }
      .header-actions {
        position: absolute;
        right: -5px;
        top: 5px;
        background-color: #f5f5f5;
        padding-left: 10px;
        .md-button {
          margin: 0;
          width: auto;
          height: auto;
          min-width: auto;
          .md-ripple {
            padding: 0 !important;
            .md-icon {
              font-size: 22px !important;
            }
          }
        }
      }
    }
    .time-line-edit {
      max-width: 180px;
      margin: auto;
      background: #f5f5f5;
      font-size: 16px;
      font-family: "Manrope-ExtraBold";
      .md-input {
        font-size: 14px;
        padding: 0;
        padding-left: 10px;
        margin: 0;
        font-weight: 800;
        -webkit-text-fill-color: #a0a0a0 !important;
        color: #a0a0a0 !important;
        border: none;
      }
      .md-icon,
      .md-icon-button {
        display: none;
      }
      .md-datepicker {
        margin-left: -180px !important;
        opacity: 0;
        &:before,
        &:after {
          width: calc(100% - 0px);
          margin-left: 0;
          display: none;
        }
      }
      .md-field {
        margin: 0px;
        padding: 0;
      }
    }
  }
}
</style>
