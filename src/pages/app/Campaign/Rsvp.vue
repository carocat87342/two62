<template>
  <div>
    <div class="rsvp-campaign white-card">
      <div class="p-50">
        <div class="font-size-30 font-bold-extra mb-50" v-if="campaignData.campaignStatus != 'STARTED'">
          Get everyone to RSVP
        </div>
        <div class="cover-preview">
          <img :src="campaignData.coverImage || campaignData.defaultCoverImage" class="mr-10" />
          <label for="cover">
            <md-button class="md-button md-red maryoku-btn md-theme-default change-cover-btn" @click="chooseFiles">
              <img :src="`${$iconURL}Campaign/Group 2344.svg`" class="mr-10" style="width: 20px" />
              Change Cover(Size 1200 * 400)
            </md-button>
          </label>
          <input
            style="display: none"
            id="coverImage"
            name="attachment"
            type="file"
            multiple="multiple"
            @change="onFileChange"
          />
        </div>
        <div class="preview-logo p-40 d-flex align-center" v-if="campaignData.logoUrl">
          <img :src="campaignData.logoUrl" style="max-width: 200px" />
          <md-switch class="large-switch below-label" v-model="showLogo">Hide logo</md-switch>
        </div>
        <div class="font-size-30 font-bold mt-20 d-flex align-center">
          <title-editor
            :defaultValue="campaignData.additionalData.greetingWords"
            :key="campaignData.additionalData.greetingWords"
            @change="handleChangeAddtionalData('greetingWords', ...arguments)"
            class="mt-40 mb-30 font-bold-extra"
          ></title-editor>
        </div>
        <div class="font-size-20 mt-50">
          <title-editor
            :defaultValue="campaignData.additionalData.prefixEvent"
            @change="handleChangeAddtionalData('prefixEvent', ...arguments)"
          ></title-editor>
        </div>
        <title-editor
          :defaultValue="campaignTitle"
          :key="campaignTitle"
          @change="changeTitle"
          class="mt-40 mb-30 font-size-60 font-bold-extra"
        ></title-editor>

        <maryoku-textarea
          v-model="campaignData.description"
          :fontSize="18"
          :placeholder="`Hey, you've been invited to ${event.title} on ${$dateUtil.formatScheduleDay(
            event.eventStartMillis,
            'dddd, MMMM D, YYYY',
          )} at ${event.location}. I can hardly wait to see you, please RSVP  by ${$dateUtil.formatScheduleDay(
            event.eventStartMillis,
            'dddd, MMMM D, YYYY',
          )}, so I'll know you feel the same way :)`"
        ></maryoku-textarea>
        <rsvp-event-info-panel class="mt-60" :event="event" :startTime="eventStartTime"></rsvp-event-info-panel>
        <div>
          <title-editor
            :defaultValue="campaignData.additionalData.carouselTitle"
            @change="handleChangeAddtionalData('carouselTitle', ...arguments)"
            class="font-size-20 mb-20"
          ></title-editor>
          <div>
            <rsvp-venue-carousel :defaultImages="images" :event="event" @change="changeImage"></rsvp-venue-carousel>
          </div>
        </div>
      </div>
      <div class="p-40 position-relative">
        <div
          class="rsvp-event-guid-background"
          v-if="event.concept && event.concept.colors[0]"
          :style="`background-color:${event.concept.colors[0].color}`"
        ></div>
        <div v-else class="rsvp-event-guid-background" :style="`background-color:#D5FCF3;opacity:1;`"></div>
        <div class="rsvp-event-guid md-layout">
          <div class="md-layout-item md-size-50 md-small-size-50">
            <div class="font-size-30 font-bold-extra mb-30 d-flex" v-if="!isEditingWearing" style="height: 52px">
              <img
                :src="
                  campaignData.visibleSettings && campaignData.visibleSettings.showWearingGuide
                    ? `${$iconURL}RSVP/wear.svg`
                    : `${$iconURL}RSVP/wear-gray.svg`
                "
                style="height: 43px; z-index: 1"
              />
              <span
                class="text-transform-uppercase font-size-26 p-10 text-ellipse"
                :class="{
                  'color-gray': !campaignData.visibleSettings || !campaignData.visibleSettings.showWearingGuide,
                }"
                style="z-index: 1"
              >
                {{ campaignData.additionalData.wearingGuideTitle }}
              </span>
              <div>
                <md-button
                  class="edit-btn md-red md-simple"
                  @click="isEditingWearing = true"
                  :disabled="!campaignData.visibleSettings.showWearingGuide"
                  >Edit</md-button
                >
              </div>
              <hide-switch
                class="ml-10"
                v-model="campaignData.visibleSettings.showWearingGuide"
                label=" "
              ></hide-switch>
            </div>
            <div class="mb-30 d-flex" style="height: 52px" v-else>
              <maryoku-input class="flex-1" v-model="wearingTitleContent"></maryoku-input>
              <md-button class="md-simple md-red maryoku-btn" @click="isEditingWearing = false">Cancel</md-button>
              <md-button class="md-red maryoku-btn" @click="saveTitle('wearing')">Save</md-button>
            </div>
            <maryoku-textarea
              placeholder="Give your guests details about the expected dress code"
              v-model="campaignData.additionalData.wearingGuide"
              :disabled="!campaignData.visibleSettings.showWearingGuide"
            ></maryoku-textarea>
          </div>
          <div class="md-layout-item md-size-50 md-small-size-50">
            <div class="font-size-30 font-bold-extra mb-30 d-flex" v-if="!isEditingKnowledge" style="height: 52px">
              <img
                :src="
                  campaignData.visibleSettings.showKnowledge
                    ? `${$iconURL}RSVP/lamp.svg`
                    : `${$iconURL}RSVP/lamp-gray.svg`
                "
                style="height: 43px; z-index: 1"
              />
              <span
                class="text-transform-uppercase font-size-26 p-10 text-ellipse"
                :class="{
                  'color-gray': !campaignData.visibleSettings.showKnowledge,
                }"
                style="z-index: 1"
              >
                {{ campaignData.additionalData.knowledgeTitle }}
              </span>
              <div>
                <md-button
                  class="edit-btn md-red md-simple"
                  @click="isEditingKnowledge = true"
                  :disabled="!campaignData.visibleSettings.showKnowledge"
                  >Edit</md-button
                >
              </div>
              <hide-switch class="ml-10" v-model="campaignData.visibleSettings.showKnowledge" label=" "></hide-switch>
            </div>
            <div class="mb-30 d-flex" style="height: 52px" v-else>
              <maryoku-input class="flex-1" v-model="knowledgeTitleContent"></maryoku-input>
              <md-button class="md-simple md-red maryoku-btn" @click="isEditingKnowledge = false">Cancel</md-button>
              <md-button class="md-red maryoku-btn" @click="saveTitle('knowledge')">Save</md-button>
            </div>
            <maryoku-textarea
              placeholder="Give your guests any information you find relevant"
              v-model="campaignData.additionalData.knowledge"
              :disabled="!campaignData.visibleSettings.showKnowledge"
            ></maryoku-textarea>
          </div>
        </div>
      </div>
      <rsvp-timeline-panel
        class="p-50"
        :canHide="true"
        :visible="campaignData.visibleSettings.showTimeline"
        @changeVisibility="setVisibleTimeline"
      ></rsvp-timeline-panel>
    </div>
    <div class="p-50 pt-0 mt-40 white-card">
      <div class="font-size-30 font-bold-extra mb-30">
        <img :src="`${$iconURL}Campaign/Group+9235.svg`" class="mr-10" />
        Digital Participation
      </div>
      <md-checkbox v-model="campaignData.allowOnline">
        <span class="font-bold">Allow digital participation</span>
      </md-checkbox>
      <br />
      <div class="d-flex align-start" v-if="campaignData.allowOnline">
        <img class="ml-10 mr-20" style="margin-top: -10px" :src="`${$iconURL}Campaign/enter-gray.svg`" />
        <div class="width-50">
          <div class="font-bold">Paste link to video communication</div>
          <maryoku-input
            v-model="campaignData.additionalData.zoomlink"
            placeholder="Paste Zoom link here..."
            fieldName="link"
          ></maryoku-input>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MaryokuTextarea from "@/components/Inputs/MaryokuTextarea";
import { MaryokuInput } from "@/components";
import RsvpVenueCarousel from "@/pages/app/RSVP/RSVPVenueCarousel.vue";
import RsvpEventInfoPanel from "@/pages/app/RSVP/RSVPEventInfoPanel.vue";
import TitleEditor from "./components/TitleEditor";
import RsvpTimelinePanel from "@/pages/app/RSVP/RSVPTimelinePanel.vue";
import HideSwitch from "@/components/HideSwitch";
import { getBase64 } from "@/utils/file.util";
import Swal from "sweetalert2";
import CalendarEvent from "@/models/CalendarEvent";
export default {
  components: {
    MaryokuTextarea,
    MaryokuInput,
    RsvpVenueCarousel,
    RsvpEventInfoPanel,
    TitleEditor,
    RsvpTimelinePanel,
    HideSwitch,
  },
  props: {
    info: {
      type: Object,
      default: {},
    },
    defaultData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      coverImage: "",
      logoImage: "https://static-maryoku.s3.amazonaws.com/storage/icons/RSVP/ms-icon.png",
      showLogo: true,
      content: "",
      originContent: {},
      isEditingKnowledge: false,
      isEditingWearing: false,
      wearingTitleContent: "WHAT SHOULD I WEAR?",
      knowledgeTitleContent: "WHAT SHOULD I KNOW?",
      editingContent: {
        title: "",
        description: "",
        coverImage: "",
        campaignStatus: "EDITING",
        allowOnline: false,
        visibleSettings: {
          showWearingGuide: true,
          showKnowledge: true,
          showTimeline: true,
        },
        additionalData: {
          greetingWords: "",
          wearingGuide: "",
          wearingGuideTitle: "WHAT SHOULD I WEAR?",
          knowledge: "",
          knowledgeTitle: "WHAT SHOULD I KNOW?",
          zoomlink: "",
        },
      },
    };
  },
  created() {
    if (this.$store.state.campaign.RSVP) {
      this.editingContent = this.$store.state.campaign.RSVP;
      if (!this.editingContent.additionalData.greetingWords) {
        const greetingWords = `Hello ${this.user.companyName ? this.user.companyName : this.user.currentTenant} ${
          this.event.guestType || "Employee"
        }`;
        this.$store.commit("campaign/setAttribute", {
          name: "RSVP",
          key: "additionalData",
          value: { ...this.editingContent.additionalData, greetingWords },
        });
      }
      if (!this.editingContent.additionalData.prefixEvent) {
        const prefixEvent = `YOU ARE INVITED TO`;
        this.$store.commit("campaign/setAttribute", {
          name: "RSVP",
          key: "additionalData",
          value: { ...this.editingContent.additionalData, prefixEvent },
        });
      }
      if (!this.editingContent.additionalData.carouselTitle) {
        const carouselTitle = `ADD YOUR TITLE HERE`;
        this.$store.commit("campaign/setAttribute", {
          name: "RSVP",
          key: "additionalData",
          value: { ...this.editingContent.additionalData, carouselTitle },
        });
      }
      let coverImage = this.editingContent.coverImage;
      if (!coverImage && this.event.concept) {
        coverImage = this.event.concept.images[0].url;
        this.$store.commit("campaign/setAttribute", {
          name: "RSVP",
          key: "coverImage",
          value: coverImage,
        });
      }
    } else {
      this.editingContent.title = this.info.conceptName;
      this.editingContent.coverImage = this.event.concept
        ? this.event.concept.images[0].url
        : `${this.$storageURL}Campaign Images/RSVP2-middle.png`;
      this.editingContent.additionalData.greetingWords = `Hello ${
        user.companyName ? user.companyName : user.currentTenant
      }} ${event.guestType || "Employee"}`;
      this.$store.commit("campaign/setCampaign", {
        name: "RSVP",
        data: this.editingContent,
      });
    }
    this.$store.commit("campaign/setAttribute", {
      name: "RSVP",
      key: "companyName",
      value: this.user.companyName ? this.user.companyName : this.user.currentTenant,
    });
    this.originContent = Object.assign({}, this.editingContent);
  },
  computed: {
    event() {
      return this.$store.state.event.eventData;
    },
    user() {
      return this.$store.state.auth.user;
    },
    campaignData() {
      return this.$store.state.campaign.RSVP;
    },
    campaignTitle() {
      return this.$store.state.campaign.RSVP ? this.$store.state.campaign.RSVP.title : "Event Name";
    },
    campaignDescription: {
      get() {
        return this.$store.state.campaign.RSVP ? this.$store.state.campaign.RSVP.description : "";
      },
      set(newValue) {
        this.$store.commit("campaign/setAttribute", { name: "RSVP", key: "description", value: newValue });
      },
    },
    images: {
      get() {
        return this.$store.state.campaign.RSVP.images;
      },
    },
    timelineDates() {
      var timelines = {};
      return this.event.timelineDates;
    },
    eventStartTime() {
      if (this.timelineDates[0]) {
        return Number(this.timelineDates[0].timelineItems[0] ? this.timelineDates[0].timelineItems[0].startTime : 0);
      }
      return 0;
    },
  },
  methods: {
    saveTitle(type) {
      if (type === "knowledge") {
        this.campaignData.additionalData.knowledgeTitle = this.knowledgeTitleContent;
        this.isEditingKnowledge = false;
      } else if (type === "wearing") {
        this.campaignData.additionalData.wearingGuideTitle = this.wearingTitleContent;
        this.isEditingWearing = false;
      }
    },
    saveData() {
      this.$store.commit("campaign/setCampaign", {
        name: "RSVP",
        data: this.editingContent,
      });
    },
    setDefault() {
      Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        showCancelButton: true,
        confirmButtonClass: "md-button md-success btn-fill",
        cancelButtonClass: "md-button md-danger btn-fill",
        confirmButtonText: "Yes, revert it!",
        buttonsStyling: false,
      }).then((result) => {
        this.$store.dispatch("campaign/revertCampaign", "RSVP");
      });
    },
    chooseFiles() {
      document.getElementById("coverImage").click();
    },
    async onFileChange(event) {
      const coverImageData = await getBase64(event.target.files[0]);
      this.$store.commit("campaign/setAttribute", { name: "RSVP", key: "coverImage", value: coverImageData });
    },
    // changeTitle(newTitle) {
    //   this.$store.commit("campaign/setAttribute", { name: "RSVP", key: "title", value: newTitle });

    // },
    changeTitle(newTitle) {
      this.$store.commit("campaign/setAttribute", { name: "SAVING_DATE", key: "title", value: newTitle });
      this.$store.commit("campaign/setAttribute", { name: "RSVP", key: "title", value: newTitle });
      this.$store.commit("campaign/setAttribute", { name: "COMING_SOON", key: "title", value: newTitle });
      this.$store.commit("campaign/setAttribute", { name: "FEEDBACK", key: "title", value: newTitle });
      this.$store
        .dispatch(
          "event/saveEventAction",
          new CalendarEvent({
            id: this.event.id,
            title: newTitle,
          }),
        )
        .then((result) => {});
    },
    handleChangeAddtionalData(key, value) {
      this.$store.commit("campaign/setAddtionalData", {
        name: "RSVP",
        key,
        value,
      });
    },
    setVisibleTimeline(visibility) {
      this.editingContent.visibleSettings.showTimeline = visibility;
    },
    changeImage(images) {
      this.$store.commit("campaign/setAttribute", { name: "RSVP", key: "images", value: images });
    },
  },
};
</script>
<style lang="scss" scoped>
.rsvp-campaign {
  .cover-preview {
    width: 100%;
    height: 350px;
    position: relative;
    overflow: hidden;
    border-radius: 30px;
    &:hover {
      .cover-preview::before {
        content: "";
        width: 100%;
        height: 100%;
        opacity: 0.52;
        background: #050505;
      }
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .change-cover-btn {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .md-switch {
    .md-switch-label {
      display: block;
      padding: 0;
    }
  }
  .edit-btn {
    margin-top: 1em !important;
  }
  .rsvp-event-guid-background {
    position: absolute;
    opacity: 0.2;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
}
</style>
