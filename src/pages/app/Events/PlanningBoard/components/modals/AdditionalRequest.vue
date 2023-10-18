<template>
  <modal class="planning-board-additioal-modal" :containerClass="`modal-container xl`">
    <template slot="header">
      <div class="maryoku-modal-header text-left">
        <img :src="`${$iconURL}Budget+Elements/${selectedCategory.icon}`" style="width: 30px; margin-right: 0.5em" />
        <div class="font-size-30 font-bold color-black">{{ selectedCategory.fullTitle }}</div>
      </div>
      <md-button class="md-just-icon md-simple" @click="close">
        <md-icon>close</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <div v-if="selectedCategory.key === 'venuerental'" class="text-left mt-20 mb-20">
        <div class="font-bold font-size-22">Any Additional Requests?</div>
        <div class="mt-20">Would you like to add one of those items?</div>
        <div class="tags mt-30">
          <TagItem
            @click="selectTag(tag)"
            :tagLabel="tag.subCategory"
            :key="tag.subCategory"
            :isSelected="tag.isSelected"
            v-for="tag in specialTags"
            theme="red"
            class="mr-10"
          ></TagItem>
        </div>
      </div>
      <div class="text-left p-20" style="background-color: #f3f7fd;">
        <div class="d-flex align-center">
          <div class="font-size-20 font-bold">
            <img :src="`${$iconURL}Vendor Signup/Asset 522.svg`" class="mr-10" width="28" />
            Time Slot</div>
          <md-switch v-if="page === 'planner'" class="md-switch-rose large-switch ml-100" v-model="isEntire">
            <span class="color-black font-bold font-size-16">Entire Event</span>
          </md-switch>
        </div>
        <template v-if="!isEntire">
            <div v-if="page === 'planner'" class="checks-cont my-20 ml-50" :class="!timeslots.length ? 'disabled' : ''">
                <div class="check-item" @click="checkTimeline(true)">
                    <img :src="`${$iconURL}Vendor Signup/Group 5479 (2).svg`" v-if="assignTimeline" />
                    <span class="unchecked" v-else></span>
                    <span>Assign to one of those timeline events</span>
                </div>
                <div class="check-item" @click="checkTimeline(false)">
                    <img :src="`${$iconURL}Vendor Signup/Group 5479 (2).svg`" v-if="!assignTimeline" />
                    <span class="unchecked" v-else></span>
                    <span>Specific Time Slot</span>
                </div>
            </div>
            <template v-if="assignTimeline">

                <div class="d-flex align-center ml-50" v-for="(timelineItem, index) in timeslots" :key="`timelineItem-${index}`">
                    <md-checkbox v-model="timeSlotIdx" class="mr-40" :value="index"></md-checkbox>
                    <TimelineItem
                        :item="timelineItem"
                        :index="index"
                        class="my-10 timeline-group-wrapper"
                        :editMode="false"
                        size="medium"
                    ></TimelineItem>
                </div>

            </template>
            <time-slot v-else class="ml-50 mt-40 time-slot-wrapper" @change="setTime"></time-slot>
        </template>
      </div>
      <div>
        <div
          v-for="section in subCategorySections.filter((s) => isVisibleSection(selectedCategory.key, s))"
          :key="section"
          class="text-left sub-category"
        >
            <div class="font-bold-extra">{{ section }}</div>
            <div class="md-layout text-left">
                <!-- {{ subCategory.requirements[section] }} -->
            <div
                v-for="item in subCategory[section].filter((item) => item.type !== 'single-selection' && item.visible)"
                :key="item.item"
                class="md-layout-item md-size-33">
                <div class="d-flex align-center">
                    <md-checkbox v-if="item.type !== 'single-selection'" v-model="item.selected">
                        <span class="text-transform-capitalize">{{ item.item }}</span>
                    </md-checkbox>
                    <MaryokuInput
                        v-if="item.qtyEnabled"
                        placeholder="QTY"
                        class="w-max-80 ml-auto"
                        v-model="item.defaultQty">
                    </MaryokuInput>
                </div>
            </div>
            <div v-if="subCategory[section].filter((item) => item.type === 'single-selection' && item.visible)">
                <div
                    v-for="item in subCategory[section].filter((item) => item.type === 'single-selection' && item.visible)"
                    class="requirement-item-tags  mt-10"
                    :key="item.item"
                >
                    <div class="mb-10">{{ item.item }}:</div>
                    <TagItem
                        @click="tag.selected = !tag.selected"
                        :tagLabel="tag.name"
                        :key="tag.name"
                        :isSelected="tag.selected"
                        :theme="`red`"
                        v-for="tag in item.options"
                        class="mr-10"
                    ></TagItem>
                </div>
            </div>
          </div>
        </div>
        <div
          v-for="specialSection in specialTags"
          :key="specialSection.subCategory"
          class="text-left sub-category"
          :id="specialSection.subCategory"
        >
          <div class="font-bold-extra">{{ specialSection.subCategory }}</div>
          <div class="md-layout text-left" v-if="specialSection.subCategory !== 'Sitting arrangement'">
            <!-- {{ subCategory.requirements[section] }} -->
            <div v-for="item in specialSection.options" class="md-layout-item md-size-33" :key="item.name">
              <md-checkbox v-model="item.selected">
                <div class="checkbox-label-wrapper">
                  <img class="special-icon" :src="getIcon(specialSection.subCategory, item.name)" />
                  {{ item.name }}
                </div>
              </md-checkbox>
            </div>
          </div>
          <template v-else>
            <div class="special-request-section-options">
              <div class="md-layout">
                <div
                  class="md-layout-item md-size-50 md-small-size-100 pt-20 pl-0"
                  v-for="(option, index) in specialSection.options"
                  :key="index"
                >
                  <div>
                    <md-checkbox class="md-simple md-red" v-model="option.selected">
                      <span class="text-transform-capitalize">{{ option.item }}</span>
                    </md-checkbox>
                    <div class="ml-30">
                      <span class="font-bold">Popular for:</span>
                      {{ option.popular }}
                      <div>
                        <img :src="`${$iconURL}Requirements/${option.icon}`" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="md-layout-item md-size-50 md-small-size-100 pt-50 pl-0">
                  <div class="d-flex">
                    <md-checkbox class="md-simple md-red" v-model="specialSection.hasOtherOption">
                      <span class="font-bold">Other:</span>
                    </md-checkbox>
                    <MaryokuInput class="flex-1" v-model="specialSection.otherOptionContent"></MaryokuInput>
                  </div>
                </div>
              </div>
            </div>
            <div class="special-request-section-description mt-20">
              <div class="font-size-20 font-bold">Is there going to be group work at the event?</div>
              <div class="mt-10">Which will require dedicated tables?</div>
              <div>
                <md-checkbox class="md-checkbox-circle md-red" v-model="isGroup" :value="true">Yes</md-checkbox>
                <md-checkbox class="md-checkbox-circle md-red" v-model="isGroup" :value="false">No</md-checkbox>
              </div>
              <div v-if="isGroup" class="d-flex align-start mt-20">
                <img :src="`${$iconURL}Requirements/enter-gray.svg`" style="margin-top: -10px" />
                <div>
                  <div class="font-size-20 font-bold">Around what size of groups?</div>
                  <div class="d-flex justify-content-between mt-10">
                    <md-radio
                      v-for="(size, idx) in specialSection.groupSizes"
                      v-model="groupSize"
                      :key="idx"
                      :value="size.item"
                      @change="sizeChange"
                    >
                      {{ `${size.item} people` }}</md-radio
                    >
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="anything-else-section text-left mt-50 mb-20">
        <div class="d-flex align-center mb-20" style="min-width: 300px">
          <img :src="`${$iconURL}Requirements/special-request-red.svg`" class="mr-20" />
          <div class="title">
            <div class="font-size-22 font-bold">Special Requests</div>
            <div class="mt-10">Would you like to add one of those items?</div>
          </div>
        </div>
        <label class="font-bold">Get me a pink unicorn please</label>
        <div class="mt-10">We love a good challenge! Tell us whatever you need, and we’ll add it to your proposal.</div>
        <div class="anything-else-section-options mt-10">
          <textarea
            placeholder="Type name of element here..."
            rows="5"
            v-model="anythingElse"
            @input="handleNoteChange"
          ></textarea>
        </div>
      </div>
    </template>
    <template slot="footer">
      <md-button class="md-button md-black md-simple add-category-btn" @click="onCancel()">
        No, Skip
        <md-icon>keyboard_arrow_right</md-icon>
      </md-button>
      <md-button class="md-red md-bold add-category-btn" @click="save">Save & Finish</md-button>
    </template>
  </modal>
</template>
<script>
import Vue from 'vue'
import moment from "moment";

const components = {
    Modal: () => import("@/components/Modal.vue"),
    MaryokuInput: () => import("@/components/Inputs/MaryokuInput.vue"),
    TagItem: () => import("../TagItem.vue"),
    TimeSlot: () => import("../TimeSlot.vue"),
    TimelineItem: () =>  import("@/pages/app/Events/components/TimelineItem.vue")
}

export default {
  name: "AdditionalRequestModal",
  components,
  props: {
    subCategory: {
        type: Object,
        default: () => {},
    },
    selectedCategory: {
        type: Object,
        default: () => {},
    },
    defaultData: {
        type: Object,
        default: () => {},
    },
    selectedTypes: {
        type: Array,
        default: () => [],
    },
    proposal: {
        type: Object,
        default: null,
    },
    page: {
        type: String,
        default: 'planner',
    }
  },
  data() {
    return {
      isEntire: false,
      specialTags: [],
      selectedTags: [],
      subCategorySections: [],
      isGroup: false,
      groupSize: null,
      anythingElse: "",
      period: [],
      assignTimeline: false,
      timeSlotsByServiceType: {
        'venuerental' : ['setup', 'activity', 'Show', 'Speaker / Keynote', 'Discussion', 'Break', 'Relaxation', 'meal'],
        'transportation' : ['transportation'],
        'entertainment' : ['activity', 'Show', 'Speaker / Keynote', 'Discussion'],
        'administration' : ['setup', 'activity', 'Show', 'Speaker / Keynote', 'meal'],
        'foodandbeverage' : ['break', 'Relaxation', 'meal'],
      },
      timeSlotIdx: [],
    };
  },
  created() {
    this.subCategorySections = Object.keys(this.subCategory);
    this.subCategorySections = this.subCategorySections.filter(
      (item) => item !== "multi-selection" && item !== "special",
    );
    if (this.subCategory["special"]) {
      this.specialTags = this.subCategory["special"].map((item) => {
        return { ...item };
      });
    } else {
      this.specialTags = [];
    }
    console.log('additionalRequests.created', this.specialTags);
    console.log('additionalRequests.created', this.subCategorySections);
    this.specialTags = this.specialTags.filter(
      (item) => item.subCategory !== "Inclusion" && item.subCategory !== "Sustainability",
    );
    this.anythingElse = this.defaultData.mainRequirement ? this.defaultData.mainRequirement.additionalRequest : null;
  },
  methods: {
    setTimeSlot(){

      if(this.assignTimeline && this.timeslots.length && this.defaultData.period && this.defaultData.period.length) {
        this.timeslots.map((timeslot, idx) => {
          if(this.defaultData.period.find(it => it.startTime == timeslot.startTime && it.endTime == timeslot.endTime)) {
            this.timeSlotIdx.push(idx);
          }

        })
      }
    },
    close: function () {
      this.$emit("close");
    },
    onCancel: function (e) {
      this.$emit("cancel");
    },
    checkTimeline(value) {
      console.log('checkTimeline', this.timeslots);
      if (!this.timeslots.length) return;
      this.assignTimeline = value;
      this.setTimeSlot();
    },
    getPeriod(timeslots, idxs) {
      console.log('getPeriod', timeslots);
      let duration = [];

      // timeslots.map(timeslot => {
      //     let startTime = moment(new Date(Number(timeslot.startTime)));
      //     let endTime = moment(new Date(Number(timeslot.endTime)));
      //     duration.push({
      //         startTime: {
      //             ampm: startTime.format('A'),
      //             time: {
      //                 hh: startTime.format('hh'),
      //                 mm: startTime.format('mm'),
      //             }
      //         },
      //         endTime: {
      //             ampm: endTime.format('A'),
      //             time: {
      //                 hh: endTime.format('hh'),
      //                 mm: endTime.format('mm'),
      //             }
      //         }
      //     })
      // })

      return duration;
    },
    save: function () {
      const requirements = { ...this.subCategory };

      if (this.assignTimeline) {
        // this.period = this.getPeriod(this.timeslots, this.timeSlotIdx)
          this.period = this.timeSlotIdx.map(idx => {
              return {
                  startTime: this.timeslots[idx].startTime,
                  endTime: this.timeslots[idx].endTime
              }
          })
      }
      requirements.special = [];
      for (let item of this.specialTags) {
        requirements.special.push(item);
      }
      console.log('save', this.period);
      this.$emit("save", {
        category: this.selectedCategory.key,
        requirements: {
          mainRequirements: requirements,
          isEntireEvent: this.isEntire,
          period: this.period,
          period1: this.period,
          additionalDescription: this.anythingElse,
        },
      });
    },
    selectItem(item){
      console.log('selectItem', item.selected);
      item.selected = !item.selected;
      this.$forceUpdate();
    },
    selectTag(tag) {
      tag.isSelected = !tag.isSelected;
      setTimeout(() => {
        this.goToSelectedTag(tag.subCategory);
      }, 100);
    },
    goToSelectedTag(item) {
      const theElement = document.getElementById(item);
      if (!theElement) return;
      const y = theElement.getBoundingClientRect().top + window.pageYOffset;
      const yOffset = -50;
      const modalWrapper = document.getElementsByClassName("modal-wrapper")[0];
      if (modalWrapper) {
        modalWrapper.scrollTo({
          top: y + yOffset,
          behavior: "smooth",
        });
      }
    },
    addTag(tag) {
      const tagIndex = this.selectedTags.findIndex((item) => item === tag);
      if (tagIndex < 0) {
        this.selectedTags.push(tag);
      } else {
        this.selectedTags.splice(tagIndex, 1);
      }
    },
    handleNoteChange(e) {
      // this._saveRequirementsInStore(this.event);
    },
    //for decor
    isVisibleSection(category, section) {
      if (
        category === "decor" &&
        section.toLowerCase() === "amenities" &&
        this.selectedTypes.indexOf("Interior Design") < 0
      ) {
        return false;
      }
      return true;
    },
    getIcon(subCategory, name) {
      let icon = null;
      if (name === "All Indoor") {
        icon = "All indoor";
      } else if (name === "Pregnant women") {
        icon = "pregnant-women-dark";
      } else if (name === "All Outdoor") {
        icon = "All outdoor";
      } else if (name === "Accessible Bathrooms") {
        icon = "Accessible bathroom";
      } else if (name === "Accessibility for people with disabilities") {
        icon = "Accessible for people with disabilities";
      } else if (name === "Hotel accommodations within walking distance") {
        icon = "Hotel";
      } else if (name === "Shopping centers") {
        icon = "Shopping center";
      } else if (name === "Dining options within walking distance") {
        icon = "Food2";
      } else if (name === "Water saving protocols") {
        icon = "Water saving";
      } else if (name === "Green power and energy efficient") {
        icon = "Green power";
      } else if (name === "Waste recycle procedures") {
        icon = "Waste recycle";
      } else if (name === "Non toxic products") {
        icon = "Non toxic";
      } else if (name === "Prioritizing diversity and inclution") {
        icon = "Diversity";
      } else if (name === "Women on senior staff") {
        icon = "Women on senior";
      } else if (name === "Strict sexual harrasment policy") {
        icon = "sexual harassment";
      } else if (name === "Acknowledge all religious and cultural holidays") {
        icon = "All religious";
      } else {
        icon = `${name}`;
      }
      if (subCategory === "Accessibility") {
        return `${this.$iconURL}Requirements/${icon}.svg`;
      } else if (subCategory === "Around the space" && name === "Dining options within walking distance") {
        return `${this.$iconURL}Requirements/${icon}.svg`;
      } else {
        return `${this.$secondIconURL}Requirements/Accessibility+Sustainability+and+Inclusion/${icon}.svg`;
      }
    },
    getTimeStampFromFormat(time, format){
      return moment(time, format).unix() * 1000;
    },
    setTime(time) {
      this.period = [];
      let eventDate = moment(this.page === 'customer' ? this.proposal.eventData.startTime * 1000 : this.event.eventStartMillis).format('YYYY-MM-DD');
      if(this.page === 'planner') console.log('setTime.eventData', this.event.eventStartMillis,  eventDate);
      if(this.page === 'customer') console.log('setTime.eventData', this.proposal.eventData.startTime,  eventDate);
      Vue.set(this.period, 0, {
          startTime: this.getTimeStampFromFormat (`${eventDate} ${time.startTime.time.hh}:${time.startTime.time.mm} ${time.startTime.ampm}`, 'YYYY-MM-DD hh:mm A').toString(),
          endTime: this.getTimeStampFromFormat(`${eventDate} ${time.endTime.time.hh}:${time.endTime.time.mm} ${time.endTime.ampm}`, 'YYYY-MM-DD hh:mm A').toString(),
      })
      console.log('setTime', this.period);
    },
  },
  computed: {
    event() {
      return this.$store.state.event.eventData;
    },
    timeslots(){
      let slots = [];
      // classify and get timeslots by service type
      this.$store.state.event.eventData.timelineDates.map(date => {
        date.timelineItems.map(item => {
          if ((this.selectedCategory.key === 'venuerental' || this.selectedCategory.key === 'decor' ||
            this.selectedCategory.key === 'equipmentrentals') && this.timeSlotsByServiceType.venuerental.includes(item.buildingBlockType)) {
            slots.push(item);
          } else if (this.selectedCategory.key === 'transportation' && this.timeSlotsByServiceType.transportation.includes(item.buildingBlockType)) {
            slots.push(item);
          } else if ((this.selectedCategory.key === 'entertainment' || this.selectedCategory.key === 'videographyandphotography' ||
            this.selectedCategory.key === 'audiovisualstagingservices') && this.timeSlotsByServiceType.entertainment.includes(item.buildingBlockType)) {
            slots.push(item)
          } else if (this.selectedCategory.key === 'administration' && this.timeSlotsByServiceType.entertainment.includes(item.buildingBlockType)) {
            slots.push(item);
          } else if (this.selectedCategory.key === 'foodandbeverage'&& this.timeSlotsByServiceType.foodandbeverage.includes(item.buildingBlockType)) {
            slots.push(item);
          }
        })
      })
      return slots;
    }
  }
};
</script>
<style lang="scss" scoped>
.planning-board-additioal-modal {
  /deep/ .modal-header {
    button {
      position: absolute;
    }
    .maryoku-modal-header {
      display: flex;
      align-items: center;
      width: 100%;
    }
  }

  .sub-category {
    border-top: solid 1px #dbdbdb;
    margin-top: 30px;
    padding-top: 30px;
  }
  .checkbox-label-wrapper {
    display: flex;
    align-items: center;
    height: 100%;
    img {
      width: 25px;
      margin: 0 5px;
    }
  }
  .time-slot-wrapper {
    margin-top: 16px;
  }
  .checks-cont {
    display: flex;
    justify-content: flex-start;
    .check-item {
        display: flex;
        align-items: center;
        margin-right: 5rem;
        cursor: pointer;

        img {
            width: 30px;
            height: 30px;
            margin-right: 14px;
        }
    }
    span {
        &.unchecked {
            display: inline-block;
            width: 30px;
            height: 30px;
            border: 1px solid #707070;
            border-radius: 50%;
            background: #ffffff;
            margin-right: 14px;
        }
    }
    &.disabled{

      span{
        color: #d0d0d0;
        &.unchecked{
            border: 1px solid #d0d0d0;
        }
      }
    }
  }
}
</style>
