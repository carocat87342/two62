<template>
  <div class="md-layout event-campaign-section booking-section">
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
          <img class="mr-10" :src="`${$iconURL}Campaign/Group 8857.svg`" />
          your event's brilliant campaign
        </div>
        <p class="font-size-16">Get your guests super exited by giving them a taste of what's waiting for them</p>
      </div>
      <header-actions @toggleCommentMode="toggleCommentMode" @share="share"></header-actions>
    </div>
    <div class="campaign-content md-layout-item md-size-100 mt-30">
      <loader :active="isLoading"/>
      <div class="campaign-content-tab d-flex mb-40">
        <div
          class="campaign-content-tab-item flex-1 font-size-22 font-bold-extra text-center"
          :class="{ selected: selectedTab === 1 }"
          @click="selectTab(1)"
        >
          <img :src="`${$iconURL}Campaign/Group 9222.svg`" v-if="campaignIssued['SAVING_DATE']" />
          <span :class="{ completedCampaign: campaignIssued['SAVING_DATE'] }">Save The Date</span>
          <span>
            <img class="ml-20" :src="`${$iconURL}Campaign/Group 9087.svg`" />
            <md-tooltip class="w-max-350">
              <div class="font-size-14 tab-tooltip">
                  <p>{{ campaignTabs[1].tooltip }}</p>
              </div>
            </md-tooltip>
          </span>
        </div>
        <div
          class="campaign-content-tab-item flex-1 font-size-22 font-bold-extra text-center"
          :class="{ selected: selectedTab === 2 }"
          @click="selectTab(2)"
        >
          <img :src="`${$iconURL}Campaign/Group 9222.svg`" v-if="campaignIssued['RSVP']" />
          <span :class="{ completedCampaign: campaignIssued['RSVP'] }">RSVP</span>
          <span>
            <img class="ml-20" :src="`${$iconURL}Campaign/Group 9087.svg`" />
            <md-tooltip class="w-max-350">
              <div class="font-size-14 tab-tooltip">
                  <p>{{ campaignTabs[2].tooltip }}</p>
              </div>
            </md-tooltip>
          </span>
        </div>
        <div
          class="campaign-content-tab-item flex-1 font-size-22 font-bold-extra text-center"
          :class="{ selected: selectedTab === 3 }"
          @click="selectTab(3)"
        >
          <img :src="`${$iconURL}Campaign/Group 9222.svg`" v-if="campaignIssued['COMING_SOON']" />
          <span :class="{ completedCampaign: campaignIssued['COMING_SOON'] }">Coming Soon</span>
          <span>
            <img class="ml-20" :src="`${$iconURL}Campaign/Group 9087.svg`" />
            <md-tooltip class="w-max-350">
              <div class="font-size-14 tab-tooltip">
                  <p>{{ campaignTabs[3].tooltip }}</p>
              </div>
            </md-tooltip>
          </span>
        </div>
        <div
          class="campaign-content-tab-item flex-1 font-size-22 font-bold-extra text-center"
          :class="{ selected: selectedTab === 4 }"
          @click="selectTab(4)"
        >
          <img :src="`${$iconURL}Campaign/Group 9222.svg`" v-if="campaignIssued['FEEDBACK']" />
          <span :class="{ completedCampaign: campaignIssued['FEEDBACK'] }">Feedback</span>
          <span>
            <img class="ml-20" :src="`${$iconURL}Campaign/Group 9087.svg`" />
            <md-tooltip class="w-max-350">
              <div class="font-size-14 tab-tooltip">
                  <p>{{ campaignTabs[4].tooltip }}</p>
              </div>
            </md-tooltip>
          </span>
        </div>
      </div>
      <savedate-analytics v-if="selectedTab == 1 && campaignIssued['SAVING_DATE']"></savedate-analytics>
      <rsvp-analytics v-if="selectedTab == 2 && campaignIssued['RSVP']"></rsvp-analytics>
      <comingsoon-analytics v-if="selectedTab == 3 && campaignIssued['COMING_SOON']"></comingsoon-analytics>
      <feedback-analytics v-if="selectedTab == 4 && campaignIssued['FEEDBACK']"></feedback-analytics>

      <!-- Save the date -->
      <template v-if="selectedTab == 1">
        <collapse-panel class="white-card" v-if="campaignIssued['SAVING_DATE']" :defaultStatus="false">
          <template slot="header">
            <div class="d-flex align-center p-50 font-size-30 font-bold">Open ‘Save The Date’ Campaign</div>
          </template>
          <template slot="content">
            <save-date :info="{ ...campaignTabs[1], ...campaignInfo }" @changeInfo="changeInfo"></save-date>
          </template>
        </collapse-panel>
        <save-date
          v-else
          :info="{ ...campaignTabs[1], ...campaignInfo }"
          @changeInfo="changeInfo"
          ref="savedateCampaign"
          class="white-card"
        ></save-date>
      </template>

      <template v-if="selectedTab == 2">
        <collapse-panel v-if="campaignIssued['RSVP']" class="white-card" :defaultStatus="false">
          <template slot="header">
            <div class="d-flex align-center p-50 font-size-30 font-bold">Open ‘RSVP’ Campaign</div>
          </template>
          <template slot="content">
            <rsvp :info="{ ...campaignTabs[2], ...campaignInfo }" ref="rsvp"></rsvp>
          </template>
        </collapse-panel>
        <rsvp v-else :info="{ ...campaignTabs[2], ...campaignInfo }" ref="rsvp"></rsvp>
      </template>

      <template v-if="selectedTab == 3">
        <collapse-panel v-if="campaignIssued['COMING_SOON']" class="white-card" :defaultStatus="false">
          <template slot="header">
            <div class="d-flex align-center p-50 font-size-30 font-bold">Open ‘Cooming Soon’ Campaign</div>
          </template>
          <template slot="content">
            <countdown :info="{ ...campaignTabs[3], ...campaignInfo }" ref="countdown"></countdown>
          </template>
        </collapse-panel>
        <countdown
          v-else
          :info="{ ...campaignTabs[3], ...campaignInfo }"
          ref="countdown"
          class="white-card"
        ></countdown>
      </template>

      <template v-if="selectedTab == 4">
        <collapse-panel v-if="campaignIssued['FEEDBACK']" class="white-card" :defaultStatus="false">
          <template slot="header">
            <div class="d-flex align-center p-50 font-size-30 font-bold">Open ‘Feedback’ Campaign</div>
          </template>
          <template slot="content">
            <feedback :info="{ ...campaignTabs[4], ...campaignInfo }" ref="feedback"></feedback>
          </template>
        </collapse-panel>
        <feedback v-else :info="{ ...campaignTabs[4], ...campaignInfo }" ref="feedback" class="white-card"></feedback>
      </template>

      <delivery-settings
        :defaultSettings="deliverySettings"
        @change="changeSettings"
        :campaign="campaignTabs[selectedTab]"
      ></delivery-settings>
      <template v-if="selectedTab == 4">
        <div class="mt-50 font-size-22 font-bold">Feedback from guests:</div>
        <feedback-list class="mt-20" v-if="campaignIssued['FEEDBACK']"> </feedback-list>
      </template>
    </div>
    <div class="campaign-footer white-card">
      <div class="campaign-footer-content d-flex">
        <div>
          <md-button @click="scrollToTop" class="md-button md-simple md-just-icon md-theme-default scroll-top-button">
            <img :src="`${$iconURL}Budget+Requirements/Asset+49.svg`" width="17" />
          </md-button>
        </div>
        <div class="d-flex align-center" v-if="!campaignIssued[campaignTabs[selectedTab].name]">
          <md-button class="md-simple md-button md-black maryoku-btn" @click="sendPreviewEmail">
            <span class="font-size-16 text-transform-capitalize">
              <img class="mr-20" :src="`${$iconURL}Campaign/Group 1855.svg`" />
              Send Me A Preview
            </span>
          </md-button>
          <span class="seperator"></span>
          <md-button class="md-simple md-button md-black maryoku-btn" @click="revertSetting" v-if="!isScheduled">
            <span class="font-size-16 text-transform-capitalize">
              <img class="mr-20" :src="`${$iconURL}Campaign/Group 8871.svg`" />Revert to original
            </span>
          </md-button>
          <md-button class="md-simple md-button md-black maryoku-btn" @click="startCampaign" v-else>
            <span class="font-size-16 text-transform-capitalize">
              <img :src="`${$iconURL}Campaign/group-2428.svg`" class="mr-10" style="width: 20px; height: 20px" />
              Send Now
            </span>
          </md-button>
          <div class="schedule-btn d-flex" v-if="!isScheduled">
            <md-button class="md-button md-red maryoku-btn schedule-campaign-btn" @click="showScheduleModal = true">
              <span class="font-size-16 text-transform-capitalize">
                <img class="mr-20" :src="`${$iconURL}Campaign/Path 4377.svg`" />
                Schedule Campaign
              </span>
            </md-button>
            <md-menu md-size="medium" md-align-trigger md-direction="top-end" class="schedule-menu">
              <md-button md-menu-trigger class="md-icon-button schedule-menu-btn">
                <md-icon class="schedule-menu-btn-icon">keyboard_arrow_down</md-icon>
              </md-button>
              <md-menu-content>
                <md-menu-item class="text-center" @click="saveDraftCampaign">
                  <span class="font-size-16 font-bold-extra">
                    <img
                      :src="`${$iconURL}Campaign/Group 1908.svg`"
                      class="mr-10"
                      style="width: 20px; height: 20px"
                    />Save Draft
                  </span>
                </md-menu-item>
                <md-menu-item class="text-center" @click="startCampaign">
                  <span class="font-size-16 font-bold-extra">
                    <img
                      :src="`${$iconURL}Campaign/group-2428.svg`"
                      class="mr-10"
                      style="width: 20px; height: 20px"
                    />Send Now
                  </span>
                </md-menu-item>
              </md-menu-content>
            </md-menu>
          </div>
          <template v-else>
            <span class="seperator"></span>
            <img class="mr-20 label-icon-25 ml-30" :src="`${$iconURL}Campaign/clock-gray.svg`" />
            Scheduled Send:
            {{ $dateUtil.formatScheduleDay(currentCampaign.scheduleSettings.scheduleTime, "DD.MM.YY  |  hh:mm A") }}
            <md-button class="maryoku-btn md-simple md-red" @click="cancelSchedule">Cancel</md-button>
          </template>
        </div>
        <div class="d-flex align-center" v-else>
          <md-button class="md-simple md-button md-black maryoku-btn" @click="sendToAddtionalGuests">
            <span class="font-size-16 text-transform-capitalize">
              <img class="mr-20" :src="`${$iconURL}Campaign/Group 8871.svg`" />Send To Additional Guests
            </span>
          </md-button>
          <span class="seperator" style="margin-top: 0"></span>
          <md-button class="md-simple md-button md-black maryoku-btn" @click="sendPreviewEmail">
            <span class="font-size-16 text-transform-capitalize">
              <img class="mr-20" :src="`${$iconURL}Campaign/Group 1855.svg`" />
              Send Me A Preview
            </span>
          </md-button>
          <span class="seperator" style="margin-top: 0; margin-right: 30px"></span>
          <div class="ml-40" v-if="!canSchedule">
            <img :src="`${$iconURL}Campaign/Group 9222.svg`" />
            Campaign Sent
          </div>
          <div class="schedule-btn d-flex" v-else>
            <md-button class="md-button md-red maryoku-btn schedule-campaign-btn" @click="showScheduleModal = true">
              <span class="font-size-16 text-transform-capitalize">
                <img class="mr-20" :src="`${$iconURL}Campaign/Path 4377.svg`" />
                Schedule Campaign
              </span>
            </md-button>
            <md-menu md-size="medium" md-align-trigger md-direction="top-end" class="schedule-menu">
              <md-button md-menu-trigger class="md-icon-button schedule-menu-btn">
                <md-icon class="schedule-menu-btn-icon">keyboard_arrow_down</md-icon>
              </md-button>
              <md-menu-content>
                <md-menu-item class="text-center" @click="saveDraftCampaign">
                  <span class="font-size-16 font-bold-extra">
                    <img
                      :src="`${$iconURL}Campaign/Group 1908.svg`"
                      class="mr-10"
                      style="width: 20px; height: 20px"
                    />Save Draft
                  </span>
                </md-menu-item>
                <md-menu-item class="text-center" @click="startCampaign">
                  <span class="font-size-16 font-bold-extra">
                    <img
                      :src="`${$iconURL}Campaign/group-2428.svg`"
                      class="mr-10"
                      style="width: 20px; height: 20px"
                    />Send Now
                  </span>
                </md-menu-item>
              </md-menu-content>
            </md-menu>
          </div>
        </div>
      </div>
    </div>
    <campaign-schedule-modal
      v-if="showScheduleModal"
      :campaigns="campaignTabs"
      :currentCampaign="campaignTabs[selectedTab]"
      :currentCampaignIndex="selectedTab"
      @changeTime="saveScheduleTime"
      @cancel="showScheduleModal = false"
    ></campaign-schedule-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { Tabs, Modal } from "@/components";
import HeaderActions from "@/components/HeaderActions";
import CommentEditorPanel from "@/pages/app/Events/components/CommentEditorPanel";
import {CommentMixins, ShareMixins} from "@/mixins";
const SaveDate = () => import("./SaveDate");
const Rsvp = () => import("./Rsvp");
const Countdown = () => import("./Countdown");
const Feedback = () => import("./Feedback");
// import SaveDate from "./SaveDate";
// import Rsvp from "./Rsvp";
// import Countdown from "./Countdown";
// import Feedback from "./Feedback";
import DeliverySettings from "./DeliverySettings";
import CampaignScheduleModal from "@/components/Modals/Campaign/ScheduleModal";
import Campaign from "@/models/Campaign";
import CalendarEvent from "@/models/CalendarEvent";
import Swal from "sweetalert2";
import S3Service from "@/services/s3.service";
import CollapsePanel from "./CollapsePanel";

import RsvpAnalytics from "./components/RSVPAnalytics";
import SavedateAnalytics from "./components/SavedateAnalytics";
import ComingsoonAnalytics from "./components/ComingSoonAnalytics";
import FeedbackAnalytics from "./components/FeedbackAnalytics";
import FeedbackList from "./components/FeedbackList";
import VueElementLoading from "vue-element-loading";
import {Loader} from "@/components";
const defaultSettings = {
  phone: {
    selected: false,
    numberString: "",
    numberArray: [],
    excelFileName: "",
    excelFilePath: "",
    smsOrWhatsapp: "",
    sentTime: new Date().getTime(),
  },
  email: {
    selected: false,
    subject: "",
    from: "",
    addressString: "",
    addressArray: [],
    excelFileName: "",
    excelFilePath: "",
    sentTime: new Date().getTime(),
  },
};
export default {
  components: {
    Loader,
    VueElementLoading,
    Tabs,
    HeaderActions,
    CommentEditorPanel,
    SaveDate,
    Rsvp,
    Countdown,
    Feedback,
    DeliverySettings,
    CampaignScheduleModal,
    SavedateAnalytics,
    RsvpAnalytics,
    CollapsePanel,
    ComingsoonAnalytics,
    FeedbackAnalytics,
    FeedbackList,
  },
  mixins: [CommentMixins, ShareMixins],
  data() {
    return {
      isLoading: false,
      campaignInfo: {
        conceptName: "",
        logo: "",
      },
      deliverySettings: this.defaultSettings,
      showCommentEditorPanel: false,
      selectedTab: 1,
      showScheduleModal: false,
      campaignTabs: {
        1: {
          completed: false,
          name: "SAVING_DATE",
          tooltip:
            "Give guests enough time to clear their schedules, make travel arrangements and generally increase the chances of them atteding",
        },
        2: {
          completed: false,
          name: "RSVP",
          tooltip: "Try sending your RSVP's a month in advance,  so you'll get the most accurate results",
        },
        3: {
          completed: false,
          name: "COMING_SOON",
          tooltip:
            "A friendly reminder helps prepare attendees for your upcoming event. Aside from reminding them of the date and time, we also use this email to answer last-minute questions",
        },
        4: {
          completed: false,
          name: "FEEDBACK",
          tooltip:
            "This touchpoint provides a valuable opportunity to promote other upcoming events, collect attendee feedback, and guide attendees towards the next step you want them to take.",
        },
      },
      campaigns: {},
    };
  },
  methods: {
    ...mapActions("campaign", ["getCampaigns", "saveCampaign"]),
    toggleCommentMode(mode) {
      this.showCommentEditorPanel = mode;
    },
    selectTab(tabIndex) {
      this.selectedTab = tabIndex;
      this.setDefaultSettings();
    },
    setDefaultSettings() {
      const currentCampaignType = this.campaignTabs[this.selectedTab].name;
      const currentCampaign = this.$store.state.campaign[currentCampaignType];
      if (currentCampaign && currentCampaign.settings) {
        this.deliverySettings = {
          ...currentCampaign.settings,
        };
      } else {
        this.deliverySettings = { ...this.defaultSettings };
      }
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    startCampaign() {
      const campaignData = this.$store.state.campaign[this.campaignTabs[this.selectedTab].name];
      if (!campaignData || (!this.deliverySettings.email.selected && !this.deliverySettings.phone.selected)) {
        Swal.fire({
          title: `Please select email or phone or both.`,
          buttonsStyling: false,
          icon: "warning",
          confirmButtonClass: "md-button md-success",
        });
        return;
      }

      this.callSaveCampaign(this.campaignTabs[this.selectedTab].name, "STARTED");
    },
    saveDraftCampaign() {
      this.callSaveCampaign(this.campaignTabs[this.selectedTab].name, "SAVED");
    },
    cancelSchedule() {
      this.$store.commit("campaign/setAttribute", {
        name: this.campaignTabs[this.selectedTab].name,
        key: "scheduleSettings",
        value: null,
      });
      this.callSaveCampaign(this.campaignTabs[this.selectedTab].name, "SAVED");
    },
    scheduleCampaign() {
      this.callSaveCampaign(this.campaignTabs[this.selectedTab].name, "SCHEDULED");
    },
    changeInfo(data) {
      this.campaignInfo[data.field] = data.value;
    },
    changeSettings(data) {
      this.deliverySettings = data;
    },
    async callSaveCampaign(campaignType, campaignStatus, isPreview = false) {
      this.isLoading = true;
      const campaignData = this.$store.state.campaign[campaignType];
      let coverImage = campaignData.coverImage;
      if (coverImage && coverImage.indexOf("base64") >= 0) {
        const fileObject = S3Service.dataURLtoFile(coverImage, `${this.event.id}-${campaignType}`);
        const extenstion = fileObject.type.split("/")[1];
        let fileUpload = await S3Service.fileUpload(fileObject, `${this.event.id}-${campaignType}`, "campaigns/cover-images");
        coverImage = fileUpload;
      }
      let referenceUrl = "";
      if (campaignType === "RSVP") {
        referenceUrl = `${document.location.origin}/#/rsvp/${this.event.id}`;
      }
      if (campaignType === "FEEDBACK") {
        referenceUrl = `${document.location.origin}/#/feedback/${this.event.id}`;
      }

      if (this.deliverySettings.email.selected) {
        this.deliverySettings.email.status = "sent";
      }
      if (this.deliverySettings.phone.selected) {
        this.deliverySettings.phone.status = "sent";
      }
      const newCampaign = new Campaign({
        campaignType,
        ...campaignData,
        campaignStatus,
        referenceUrl,
        event: new CalendarEvent({ id: this.event.id }),
        scheduleTime: new Date().getTime(),
        settings: this.deliverySettings,
        coverImage,
        isPreview,
      });
      return new Promise((resolve, reject) => {
        this.saveCampaign(newCampaign)
          .then((res) => {
            this.$store.commit("event/setEventData", res.item.event);
            this.isLoading = false;
            resolve();
          })
          .catch(() => {
            this.isLoading = false;
            reject();
          });
      });
    },
    saveScheduleTime(data) {
      const { currentCampaignIndex, scheduleTime, scheduleSettings, selectedOption } = data;
      const scheduleSettingsData = {
        timeZone: "EST",
        scheduleTime: scheduleTime,
        scheduleOption: selectedOption,
        scheduleOptionValue: scheduleSettings[selectedOption].value,
      };
      this.$store.commit("campaign/setAttribute", {
        name: this.campaignTabs[currentCampaignIndex].name,
        key: "scheduleSettings",
        value: scheduleSettingsData,
      });

      const campaign = this.$store.state.campaign[this.campaignTabs[this.selectedTab].name];
      this.scheduleCampaign();
    },
    revertSetting() {
      this.deliverySettings = Object.assign({}, this.defaultSettings);
      if (this.selectedTab == 1) {
        this.$refs.savedateCampaign.setDefault();
      } else if (this.selectedTab == 2) {
        this.$refs.rsvp.setDefault();
      } else if (this.selectedTab == 3) {
        this.$refs.countdown.setDefault();
      } else if (this.selectedTab == 4) {
        this.$refs.feedback.setDefault();
      }
    },
    sendPreviewEmail() {
      const campaignData = this.$store.state.campaign[this.campaignTabs[this.selectedTab].name];
      console.log(campaignData.campaignStatus);
      this.callSaveCampaign(
        this.campaignTabs[this.selectedTab].name,
        campaignData.campaignStatus || "TESTING",
        true,
      ).then((res) => {});
      Swal.fire({
        title: `You will receive a preview campaign email soon!`,
        buttonsStyling: false,
        type: "success",
        confirmButtonClass: "md-button md-success",
      });
    },
    sendToAddtionalGuests() {
      this.$store.commit("campaign/setAttribute", {
        name: this.campaignTabs[this.selectedTab].name,
        key: "campaignStatus",
        value: "EDITING",
      });
    },
  },
  computed: {
    ...mapGetters("campaign", ["campaignIssued", "defaultSettings"]),
    event() {
      return this.$store.state.event.eventData;
    },
    user() {
      return this.$store.state.auth.user;
    },
    currentCampaign() {
      return this.$store.state.campaign[this.campaignTabs[this.selectedTab].name];
    },
    canSchedule() {
      if (this.currentCampaign.settings.email.selected && this.currentCampaign.settings.email.status !== "sent") {
        return true;
      }
      if (this.currentCampaign.settings.phone.selected && this.currentCampaign.settings.phone.status !== "sent") {
        return true;
      }
      return false;
    },
    isScheduled() {
      if (!this.currentCampaign) return false;
      return this.currentCampaign.campaignStatus === "SCHEDULED";
    },
  },
  created() {
    this.campaignInfo.conceptName = this.event.concept ? this.event.concept.name : "Event Name";
    this.getCampaigns({ event: this.event }).then((campaigns) => {
      this.campaigns = campaigns;
      this.setDefaultSettings();
    });
  },
  watch: {
    currentCampaign(newValue, oldValue) {
      this.setDefaultSettings();
    },
    event(newValue, oldValue) {
      this.campaignInfo.conceptName = this.event.concept ? this.event.concept.name : "Event Name";
    },
  },
};
</script>

<style lang="scss" scoped>
.campaign-content {
  padding: 0 3em;
  margin-bottom: 150px;
  &-tab {
    height: 140px;
    line-height: 140px;
    background-color: white;
    border-radius: 3px;
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
    &-item {
      cursor: pointer;
      width: 25%;
      &:not(:last-child) {
        border-right: solid 1px #aeaeae;
      }
      &.selected {
        color: #f52355;
        border-bottom: solid 3px #f51355;
      }
    }
    .completedCampaign {
      text-decoration: line-through;
      font-family: "Manrope-Regular";
    }
  }
}

.event-campaign-section {
  .campaign-footer {
    height: 100px;
    background-color: white;
    margin-top: 100px;
    padding: 0px 50px;
    width: calc(100% - 480px);
    position: fixed;
    bottom: 0;
    z-index: 100;
    &-content {
      max-width: 1520px;
      margin: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
    }
    .seperator {
      display: inline-block;
      border-left: solid 1px #050505;
      height: 2rem;
      // margin-top: 1rem;
    }
    .schedule-campaign-btn {
      &::after {
        content: "";
        height: 50px;
        width: 54px;
        background: #ff4f7e;
      }
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      margin: 0;
    }
    .schedule-menu-btn {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      background-color: #f74374 !important;
      border-left: solid #f97d9f 1px;
      &-icon {
        height: 49px;
        font-size: 2em;
      }
    }

    .virtual-btn {
      border: solid 1px #f51355;
      margin-left: 30px;
    }
  }
  .expanding-icon {
    width: 6px;
    height: 6px;
    border: solid 2px #818080;
    &.expanded {
      transform: rotate(-45deg);
    }
  }
  .schedule-btn {
    height: 50px;
    button,
    .schedule-menu {
      height: 100%;
    }
  }
}
</style>
