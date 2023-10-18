<template>
  <div
    class="timeline-template-container"
    :class="{ group: template.type === 'group', slot: template.type === 'slot' }"
  >
    <template v-if="hasTemplate">
      <template v-if="groupedItems.length > 0">
        <timeline-item
          v-for="(item, index) in groupedItems"
          :key="index"
          :item="item"
          :index="index"
          :timelineDate="timelineDate"
          class="mt-10 mb-10"
          @remove="removeItem"
          @cancel="cancelItem"
          @save="saveItem"
        ></timeline-item>
      </template>

      <drop
        v-if="template.type === 'group'"
        style="height: 100%; min-height: 50px"
        class="empty-template"
        @drop="handleDrop(groupedItems.length, ...arguments)"
        @dragenter="hadleDragEnter"
        @dragleave="handleDragLeave"
        :class="{ dropping: isHover }"
      >
        <div
          class="empty-template-icon"
          :style="hoverStyle"
          :class="{ hovering: isHover }"
          v-if="groupedItems.length == 0"
        >
          <img :src="`${$iconURL}Timeline-New/templates/${template.name.split('-')[0]}.svg`" />
        </div>

        <div class="empty-template-panel" :class="{ adding: groupedItems.length > 0 }" :style="hoverStyle">
          <span v-if="isEmpty">{{ template.name }}</span>
          <span v-else><md-icon>add</md-icon>{{ template.name }}</span>
        </div></drop
      >
    </template>
    <md-button
      class="md-icon-button md-simple close-btn"
      @click="remove(template)"
      v-if="template.type === 'group' && groupedItems.length == 0"
    >
      <md-icon class="close-icon">close</md-icon>
    </md-button>
  </div>
</template>
<script>
import TimelineItem from "./TimelineItem";
import TimelineEmpty from "./TimelineEmpty";
import TimelineTemplateItem from "./TimelineTemplateItem";
import { Drag, Drop } from "vue-drag-drop";
import { hexToRgbA } from "@/utils/helperFunction";
import moment from "moment";
import CalendarEvent from "@/models/CalendarEvent";
import EventTimelineItem from "@/models/EventTimelineItem";
import EventTimelineDate from "@/models/EventTimelineDate";
export default {
  components: {
    TimelineItem,
    TimelineTemplateItem,
    TimelineEmpty,
    Drop,
  },
  data() {
    return {
      isHover: false,
    };
  },
  props: {
    timelines: {
      type: Array,
      default: () => [],
    },
    template: [Object],
    groupIndex: [Number],
    timelineDate: [Object],
  },
  computed: {
    event() {
      return this.$store.state.event.eventData;
    },
    hasTemplate() {
      return this.event.timeline && this.event.timeline.mode === "template";
    },
    hoverStyle() {
      if (!this.isHover) {
        return "";
      }
      return `border: solid 2px ${this.droppingBlock.color}; background-color: ${hexToRgbA(
        this.droppingBlock.color,
        0.25,
      )}`;
    },
    timelineDates() {
      if (this.event) {
        return this.event.timelineDates;
      }
      return [];
    },
    timelineItems() {
      return this.timelineDates[this.timelineDate.dateIndex].timelineItems;
    },
    groupedItems() {
      return this.timelineItems.filter((item) => item && item.groupNumber == this.groupIndex);
    },
    isEmpty() {
      return this.groupedItems.length === 0;
    },
  },
  methods: {
    removeItem(removeItemData) {
      const itemIndex = this.timelineItems.findIndex((item) => item.id == removeItemData.item.id);
      new EventTimelineItem(removeItemData.item)
        .for(new EventTimelineDate({ id: this.timelineDate.id }))
        .delete()
        .then((res) => {
          this.timelineItems.splice(itemIndex, 1);
        });
    },
    saveItem() {
      this.$store.dispatch("event/getTimelineDates", this.event.id);
    },
    cancelItem(itemData) {
      if (!itemData.item.id || itemData.item.id === undefined) {
        this.timelineItems.splice(itemData.index, 1);
      }
    },
    remove() {
      this.$emit("remove");
    },
    hadleDragEnter(data) {
      console.log(data);
      console.log("started");
      this.droppingBlock = data.block;
      this.isHover = true;
    },
    handleDragLeave(data) {
      this.isHover = false;
    },
    handleDrop(index, droppedData) {
      let block = Object.assign({}, droppedData.block);
      block.mode = "edit";
      if (index == 0) {
        if (this.groupIndex == 0) {
            if (this.event.eventDayPart == "evening") {
                block.startTime = moment(`${this.timelineDate.date} 07:00 PM`, "YYYY-MM-DD hh:mm A").valueOf();
                block.endTime = moment(`${this.timelineDate.date} 08:00 PM`, "YYYY-MM-DD hh:mm A").valueOf();
            } else {
                block.startTime = moment(`${this.timelineDate.date} 08:00 AM`, "YYYY-MM-DD hh:mm A").valueOf();
                block.endTime = moment(`${this.timelineDate.date} 09:00 AM`, "YYYY-MM-DD hh:mm A").valueOf();
            }
        } else {
            let lastGroupItems = this.timelineItems.filter((item) => item && item.groupNumber == (this.groupIndex - 1));
            let lastItem = lastGroupItems[lastGroupItems.length - 1];
            block.startTime = Number(lastItem.endTime);
            block.endTime = Number(lastItem.endTime) + 3600 * 1000;
        }
      } else {
        const prevItem = this.groupedItems[index - 1];
        block.startTime = Number(prevItem.endTime);
        block.endTime = Number(prevItem.endTime) + 3600 * 1000;
      }

      block.title = droppedData.block.buildingBlockType;
      block.startDuration = "am";
      block.endDuration = "am";
      block.attachmentName = "";
      block.isItemLoading = false;
      block.icon = droppedData.block.icon;
      block.date = this.timelineDate.date;
      block.groupNumber = this.groupIndex;
      block.event = new CalendarEvent({ id: this.event.id });
      block.timelineDate = new EventTimelineDate({ id: this.timelineDate.id });
      this.isHover = false;
      delete block.id;
      this.timelineItems.push(block);
    },
  },
};
</script>
<style lang="scss" scoped>
.timeline-template-container {
  position: relative;
  .adding-slot {
    height: 100%;
    min-height: 50px;
    margin-left: 70px;
    text-align: center;
    color: #818080;
    text-transform: capitalize;
    font-weight: bold;
  }
  .empty-template {
    width: 100%;
    position: relative;
    .empty-template-icon {
      width: 60px;
      height: 60px;
      border: dashed 1px #908f8f;
      background-color: #f5f5f5;
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .empty-template-panel {
      width: calc(100% - 70px);
      margin-left: 70px;
      padding: 30px;
      text-transform: capitalize;
      color: #818080;
      &.adding {
        text-align: center;
        padding: 10px;
      }
    }
    // &::before {
    //   border-left: dashed 1px #908f8f;
    //   height: 100%;
    //   position: absolute;
    //   top: 0px;
    //   content: "";
    // }
  }
  &.group::before {
    content: "";
    border: dashed 1px #908f8f;
    position: absolute;
    width: calc(100% - 70px);
    height: 100%;
    margin-left: 70px;
  }
  .close-btn {
    position: absolute;
    right: 10px;
    top: 30px;
    .close-icon {
      font-size: 30px !important;
    }
  }
  .close-btn {
    display: none;
  }
  &:hover {
    .close-btn {
      display: block;
    }
  }
}
</style>
