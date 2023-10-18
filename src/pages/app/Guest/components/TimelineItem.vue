<template>
  <timeline-template-item
    v-if="editingContent.status == 'template' || editingContent.status == 'timegap'"
    :item="item"
    :index="index"
    @applyTemplate="applyToTemplate"
  ></timeline-template-item>
  <div class="timeline-item d-flex" :class="size === 'large' ? '' : 'align-center'"  v-else>
    <div :class="size === 'large' ? 'time-line-icon-large mt-20' : 'time-line-icon-medium'" :style="`background-color:${editingContent.color}`">
      <img
        :src="`${this.$resourceURL}storage/icons/Timeline-New/${editingContent.icon.toLowerCase()}-circle.svg`"
        v-if="editingContent.icon"
      />
    </div>
    <md-card
      class="block-form"
      v-if="editingContent.mode === 'edit'"
      :style="`border-left : 5px solid ` + editingContent.color"
      ref="timeline-edit-card"
      id="timeline-edit-card"
    >
      <vue-element-loading :active.sync="editingContent.isItemLoading" spinner="ring" color="#FF547C" />
      <md-card-content class="md-layout">
        <div class="md-layout-item md-size-100 mb-20">
          <span
            class="font-size-20 font-bold text-trans text-transform-capitalize"
            :style="`color:${editingContent.color};`"
            >{{ editingContent.buildingBlockType }}</span
          >
          <img :src="`${$iconURL}Timeline-New/tip.svg`" class="label-icon" style="margin-left: 50px" />
          <span>70% of events like yours timed 30 minuets to this slot</span>
        </div>

        <div class="md-layout-item md-size-100 mb-10">
          <div class="form-group">
            <label class="font-size-16 font-bold pb-10">Name</label>
            <maryoku-input type="text" class="mt-10" v-model="editingContent.title" />
          </div>
        </div>
        <div class="md-layout-item md-size-100 mt-20">
          <md-button class="md-simple edit-btn" @click="showDescription = !showDescription">
            <img :src="`${$iconURL}Timeline-New/circle-plus.svg`" class="label-icon mr-10" />
            <span class="color-red">Add Description</span>
            <span class="color-black font-size-14 pl-5">(Optional)</span>
          </md-button>
          <div class="form-group mt-30" v-if="showDescription">
            <label class="font-size-16 font-bold">Description</label>
            <maryoku-textarea size="small" class="mt-10" v-model="editingContent.description"></maryoku-textarea>
          </div>
        </div>
        <div class="md-layout-item md-size-100 mt-50 d-flex">
          <div class="form-group">
            <label class="font-size-16 font-bold pb-10">
              <img :src="`${$iconURL}Timeline-New/clock.svg`" class="label-icon mr-10" />Start At
            </label>
            <time-input
              v-model="editingContent.startTime"
              :h24="false"
              class="mt-10"
              displayFormat="hh:mm"
              size="normal"
            ></time-input>
          </div>
          <div class="divider"></div>
          <div class="form-group">
            <label class="font-size-16 font-bold pb-10">
              <img :src="`${$iconURL}Timeline-New/clock.svg`" class="label-icon mr-10" />Finishes At
            </label>
            <time-input
              v-model="editingContent.endTime"
              :h24="false"
              displayFormat="hh:mm"
              class="mt-10"
              size="normal"
            ></time-input>
          </div>
        </div>
        <!-- <div class="md-layout-item md-size-100 mt-50">
          <div class="form-group">
            <label class="font-size-16 font-bold pb-10">Assign vendor to slot</label>
            <multiselect
              v-model="vendor"
              :options="serviceCategories"
              :close-on-select="true"
              :clear-on-select="true"
              tag-placeholder="Add this as new tag"
              placeholder="Please select vendors"
              class="multiple-selection small-selector mt-10"
              label="title"
              track-by="key"
            ></multiselect>
          </div>
        </div> -->
      </md-card-content>
      <md-card-actions md-alignment="right" style="border: none" class="edit-timeline-footer">
        <md-button
          name="event-planner-tab-timeline-item-save"
          class="maryoku-btn md-default md-simple"
          @click="cancelTimelineItem"
          >Cancel</md-button
        >
        <md-button
          :disabled="!saveAvailable"
          name="event-planner-tab-timeline-item-save"
          class="maryoku-btn md-red"
          v-if="!editingContent.dateCreated"
          @click="saveTimelineItem"
          >Save</md-button
        >
        <md-button
          :disabled="editingContent.isItemLoading"
          name="event-planner-tab-timeline-item-edit"
          class="event-planner-tab-timeline-item-edit maryoku-btn md-red"
          v-else
          @click="updateTimelineItem"
          >Save</md-button
        >
      </md-card-actions>
    </md-card>
    <md-card class="block-form" :class="size === 'large' ? 'p-20 m-20' : 'my-10 ml-30 p-10 w-min-500'" :style="getBorderStyle(editingContent.color)" v-else>
      <vue-element-loading :active.sync="editingContent.isItemLoading" spinner="ring" color="#FF547C" />
      <md-card-content>
        <div class="timeline-actions" v-if="editMode">
          <md-button class="md-icon-button md-simple" @click="editTimeline">
            <img :src="`${$iconURL}common/edit-dark.svg`" class="label-icon" style="height: 30px" />
          </md-button>
          <md-button class="md-icon-button md-simple" @click="removeItem">
            <img :src="`${$iconURL}common/trash-dark.svg`" class="label-icon" style="height: 30px" />
          </md-button>
        </div>
        <div class="item-title-and-time" :class="size === 'large' ? '' : 'd-flex align-center'">
          <span class="item-time color-dark-gray" :class="size === 'large' ? 'font-size-20' : 'font-size-16 pr-20 border-right'"
            >{{ formatHour(editingContent.startTime) }} - {{ formatHour(editingContent.endTime) }}</span
          >

          <p :class="size === 'large' ? 'my-15' : 'ml-20 my-0'">
            <span class="font-bold-extra font-size-20 mr-20 color-black-heavy" v-if="editingContent.title">{{
              editingContent.title
            }}</span>
            <md-button
              class="md-button edit-btn md-red md-simple"
              @click="showDescription = !showDescription"
              style="margin: 3px !important"
              v-if="editingContent.description && size === 'large'"
            >
              <span v-if="!showDescription" class="color-red font-regular">
                Read More
                <md-icon class="color-red">keyboard_arrow_down</md-icon>
              </span>
              <span v-if="showDescription" class="color-black font-regular">
                Read Less
                <md-icon class="color-black" style="color: #050505 !important">keyboard_arrow_up</md-icon>
              </span>
            </md-button>
          </p>

          <p class="item-desc" v-if="showDescription">
            {{ editingContent.description }}
          </p>
        </div>
      </md-card-content>
    </md-card>
  </div>
</template>
<script>
// import TimelineTemplateItem from "./TimelineTemplateItem";
import TimeInput from "@/components/Inputs/TimeInput";
import MaryokuInput from "@/components/Inputs/MaryokuInput";
import MaryokuTextarea from "@/components/Inputs/MaryokuTextarea";
import moment from "moment";
import Multiselect from "vue-multiselect";
import Swal from "sweetalert2";
import EventTimelineItem from "@/models/EventTimelineItem";
import EventTimelineDate from "@/models/EventTimelineDate";

export default {
  components: {
    TimeInput,
    // TimelineTemplateItem,
    MaryokuInput,
    MaryokuTextarea,
  },
  props: {
    editMode: {
      type: Boolean,
      default: true,
    },
    item: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: 0,
    },
    timelineItems: {
      type: Array,
      default: () => [],
    },
    timelineDate: {
      type: Object,
      default: () => {},
    },
    cardStyle: {
      type: String,
      default: "white",
    },
    size: {
      type: String,
      default: "large",
    }
  },
  data() {
    return {
      showDescription: false,
      editingContent: {},
      vendors: [],
      vendor: "",
    };
  },
  mounted() {
    console.log('timeline-item.mounted', this.size);
    this.editingContent = { ...this.item };
    this.vendor = this.serviceCategories.find(
      (item) => this.editingContent.eventCategory && item.key == this.editingContent.eventCategory[0],
    );
    // this.$root.$on("apply-template", ({ item, block, index }) => {
    //   // this.timelineItems[item.date][index] = {};
    //   this.applyToTemplate(index, { ...item, action: "edited" }, block);
    // });
  },
  computed: {
    saveAvailable() {
      return this.editingContent.startTime && this.editingContent.endTime;
    },
    event() {
      return this.$store.state.event.eventData;
    },
    serviceCategories() {
      return this.$store.state.common.serviceCategories;
    },
  },
  methods: {
    getBorderStyle(color) {
      if (this.cardStyle === "outlined") return `border : 2px dashed ${color}`;
      else return `border-left : 5px solid ${color}`;
    },
    saveTimelineItem() {
      this.$set(this.editingContent, "mode", "saved");
      this.$set(this.editingContent, "eventCategory", [this.vendor.key]);
      new EventTimelineItem(this.editingContent)
        .for(new EventTimelineDate({ id: this.timelineDate.id }))
        .save()
        .then((res) => {
          this.editingContent = res;
          this.$emit("save", { item: this.editingContent, index: this.index });
        });
    },
    updateTimelineItem() {
      this.$set(this.editingContent, "mode", "saved");
      this.$set(this.editingContent, "eventCategory", [this.vendor.key]);
      new EventTimelineItem(this.editingContent)
        .for(new EventTimelineDate({ id: this.timelineDate.id }))
        .save()
        .then((res) => {
          this.editingContent = res;
          this.$emit("save", { item: this.editingContent, index: this.index });
        });
    },
    cancelTimelineItem() {
      this.editingContent = { ...this.item };
      this.$set(this.editingContent, "mode", "saved");
      this.$emit("cancel", { item: this.editingContent, index: this.index });
    },
    formatDate(date) {
      if (typeof date == "number") {
        return moment(new Date(date)).format("MM/DD/YY");
      }
      return moment(date).format("MM/DD/YY");
    },
    formatHour(date) {
      return moment(new Date(Number(date))).format("hh:mm A");
    },
    applyToTemplate({ item: template, block: selectedBlock, index }) {
      if (selectedBlock) {
        let block = Object.assign({}, selectedBlock);
        block.id = template.id;
        block.mode = "edit";
        let startDate = new Date(template.date);
        let endDate = new Date(template.date);

        block.startTime = moment(`${template.date} 00:00 am`, "DD/MM/YY hh:mm a").valueOf();
        block.endTime = moment(`${template.date} 00:00 am`, "DD/MM/YY hh:mm a").valueOf();

        if (index == 0) {
          if (this.event.eventDayPart == "evening") {
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
        block.event = template.event;
        this.editingContent = { ...block };
      }
      // setTimeout(() => {
      //   const scrollBtn = this.$refs.scrollBtn;
      //   if (scrollBtn) {
      //     scrollBtn.click();
      //   }
      // }, 100);
    },
    editTimeline() {
      this.$set(this.editingContent, "mode", "edit");
    },
    removeItem() {
      Swal.fire({
        title: "Are you sure want to delete this item?",
        showCancelButton: true,
        cancelButtonClass: "md-button md-danger",
        confirmButtonClass: "md-button md-success",
        confirmButtonText: "Yes I'm sure",
        buttonsStyling: false,
      })
        .then((result) => {
          if (result.value === true) {
            this.$emit("remove", { index: this.index, item: this.editingContent });
          }
        })
        .catch((err) => {
          this.$root.$emit("timeline-updated", this.timelineItems);
        });
    },
  },
  watch: {
    size(newVal) {
        console.log('timelineItem.watch.size');
    }
  }
};
</script>
<style lang="scss" scoped>
.timeline-item {
  .block-form {
  }
  .time-line-icon-large {
    min-width: 60px;
    height: 60px;
    border-radius: 50%;
    img {
        width: 60px;
        height: 60px;
    }
  }
  .time-line-icon-medium {
    min-width: 60px;
    height: 60px;
    border-radius: 50%;
      img {
          width: 60px;
          height: 60px;
      }
  }
  .divider {
    width: 20px;
    height: 1px;
    background: #b1abab;
    top: 0;
    left: 22px;
    bottom: 0;
    margin: auto 5px;
  }
  .item-desc {
    word-break: break-all;
    margin: 0;
  }
  .block-form {
    .timeline-actions {
      position: absolute;
      right: 10px;
      top: 10px;
      display: none;
    }
    &:hover {
      .timeline-actions {
        display: block;
      }
    }
  }
  .border-right{
     border-right: 2px solid #818080;
  }
}
</style>
