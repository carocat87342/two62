<template>
  <div class="rsvp-container">
    <div class="rsvp-event">
      <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" />
      <div class="rsvp-event-overview">
        <md-button
          v-if="isMobile"
          class="md-button md-red md-just-icon md-theme-default share-button"
          @click="showSharingModal = true"
        >
          <img :src="`${$iconURL}RSVP/sharing-white.svg`" width="17" />
        </md-button>
        <div class="concept-color-bar" :style="`background-image:${backgroundImage}`"></div>
        <div class="rsvp-event-header" :style="`background-image: url('${headerImage}');`"></div>
        <div class="rsvp-event-overview-content">
          <div class="md-layout">
            <div class="rsvp-event-overview-content-customer md-layout-item md-size-100">
              <img v-if="campaign.logoUrl" :src="`${campaign.logoUrl}`" class="mb-40 logo-image" />
              <div class="greeting-word">
                <!-- Hello {{ campaign.companyName }} {{ event.guestType || "Employee" }}! -->
                {{ campaign.additionalData.greetingWords }}
              </div>
            </div>
            <div class="md-layout-item md-size-100">
              <div class="mb-20">{{ campaign.additionalData.prefixEvent }}</div>
              <div class="font-bold-extra mb-30 campaign-title">{{ campaign.title }}</div>
            </div>
            <div class="md-layout-item md-size-50 md-small-size-100">
              <div class="word-break mb-30 font-size-20 campaign-description">
                {{ campaign.description }}
              </div>
            </div>
            <div class="md-layout-item md-size-50 md-small-size-100">
              <rsvp-event-info-panel
                :event="event"
                :editable="false"
                :zoomLink="campaign.additionalData.zoomlink"
                :startTime="eventStartTime"
                v-if="!isLoading"
              ></rsvp-event-info-panel>
            </div>
          </div>
          <div>
            <div class="font-size-22 font-bold mb-30 mt-30">{{ campaign.additionalData.carouselTitle }}</div>
            <rsvp-venue-carousel
              v-if="campaign.images"
              :editable="false"
              :event="event"
              :defaultImages="campaign.images"
            ></rsvp-venue-carousel>
          </div>
        </div>
      </div>
      <div class="p-20" v-if="isMobile">
        <div style="color: #818080; font-size: 13px; margin-bottom: 20px">More Info</div>
        <more-info-item class="mb-20" v-if="campaign.visibleSettings && campaign.visibleSettings.showWearingGuide">
          <template slot="header">
            <img :src="`${$iconURL}RSVP/Path 3728.svg`" class="label-icon" />
            <span style="padding-top: 10px; margin-left: 20px; line-height: 1.2em" class="font-bold">
              {{ campaign.additionalData.wearingGuideTitle }}
            </span>
          </template>
          <template slot="content">{{ campaign.additionalData.wearingGuide }}</template>
        </more-info-item>
        <more-info-item class="mb-20" v-if="campaign.visibleSettings && campaign.visibleSettings.showKnowledge">
          <template slot="header">
            <img :src="`${$iconURL}RSVP/Path 2369.svg`" class="label-icon" />
            <span style="padding-top: 10px; margin-left: 20px; line-height: 1.2em" class="font-bold">
              {{ campaign.additionalData.knowledgeTitle }}
            </span>
          </template>
          <template slot="content">{{ campaign.additionalData.knowledge }}</template>
        </more-info-item>
        <more-info-item class="mb-20" v-if="campaign.visibleSettings && campaign.visibleSettings.showTimeline">
          <template slot="header">
            <img :src="`${$iconURL}Timeline-New/timeline-title.svg`" class="label-icon" />
            <span style="padding-top: 10px; margin-left: 20px; line-height: 1.2em" class="font-bold"> AGENDA </span>
          </template>
          <template slot="content">
            <div
              v-for="(schedule, index) in timelineDates"
              :key="index"
              class="md-layout-item md-size-50 md-small-size-100 text-transform-uppercase font-size-30 font-bold-extra mt-20"
              style="padding: 0"
            >
              <div class="rsvp-event-timeline-day">
                <!-- <span class="font-size-22 font-bold-extra">Day {{ $helper.numberToWord(index + 1) }}</span> -->
                <span class="font-size-16">{{ $dateUtil.formatScheduleDay(schedule.date) }}</span>
              </div>
              <div>
                <rsvp-timeline-item
                  v-for="(timeline, index) in schedule.timelineItems"
                  :key="index"
                  :timeline="timeline"
                ></rsvp-timeline-item>
              </div>
            </div>
          </template>
        </more-info-item>
        <div style="color: #818080; font-size: 13px; margin: 40px 0 20px">Can't make it?</div>
        <md-button class="md-simple md-red maryoku-btn edit-btn" @click="reject"> <u>I Can't Make It</u></md-button
        ><br /><br />
        <md-button class="md-simple md-red maryoku-btn edit-btn" @click="thinkLater">
          <u>I Need To Think About It</u></md-button
        >
        <hr style="margin-top: 40px" />
        <div class="text-center mb-50 mt-30 logo" @click="gotoWeb">
          Powered by &nbsp;
          <img :src="`${$iconURL}RSVP/maryoku - logo dark@2x.png`" />
          <span style="text-transform: uppercase">&#169;</span>
        </div>
      </div>
      <template v-else>
        <div class="rsvp-event-guid md-layout">
          <div
            class="rsvp-event-guid-background"
            v-if="event.concept && event.concept.colors[0]"
            :style="`background-color:${event.concept.colors[0].color}`"
          ></div>
          <div
            class="md-layout-item md-size-50 md-small-size-100"
            v-if="campaign.visibleSettings && campaign.visibleSettings.showWearingGuide"
          >
            <div class="font-size-30 font-bold-extra mb-30 d-flex">
              <img :src="`${$iconURL}RSVP/Path 3728.svg`" />
              <span class="text-transform-uppercase" style="padding-top: 10px; margin-left: 20px; line-height: 1.2em">{{
                campaign.additionalData.wearingGuideTitle
              }}</span>
            </div>
            <div>
              {{ campaign.additionalData.wearingGuide }}
            </div>
          </div>
          <div
            class="md-layout-item md-size-50 md-small-size-100"
            v-if="campaign.visibleSettings && campaign.visibleSettings.showKnowledge"
          >
            <div class="font-size-30 font-bold-extra mb-30 d-flex">
              <img :src="`${$iconURL}RSVP/Path 2369.svg`" />
              <span class="text-transform-uppercase" style="padding-top: 10px; margin-left: 20px; line-height: 1.2em">{{
                campaign.additionalData.knowledgeTitle
              }}</span>
            </div>
            <div>
              {{ campaign.additionalData.knowledge }}
            </div>
          </div>
        </div>
        <div
          class="rsvp-event-timeline md-layout"
          v-if="campaign.visibleSettings && campaign.visibleSettings.showTimeline"
        >
          <div
            class="md-layout-item md-size-100 md-small-size-100 text-transform-uppercase font-size-30 font-bold-extra mb-50"
          >
            A glimpse at the agenda
          </div>
          <div
            v-for="(schedule, index) in timelineDates"
            :key="index"
            class="md-layout-item md-size-50 md-small-size-100 text-transform-uppercase font-size-30 font-bold-extra mt-20"
          >
            <div class="rsvp-event-timeline-day">
              <span class="font-size-22 font-bold-extra">{{ $dateUtil.formatScheduleDay(schedule.date) }}</span>
            </div>
            <div>
              <rsvp-timeline-item
                v-for="(timeline, index) in schedule.timelineItems"
                :key="index"
                :timeline="timeline"
              ></rsvp-timeline-item>
            </div>
          </div>
        </div>
        <div class="text-center mb-50 mt-30 logo" @click="gotoWeb">
          Powered by &nbsp;
          <img :src="`${$iconURL}RSVP/maryoku - logo dark@2x.png`" />
        </div>
      </template>
    </div>

    <div v-if="isMobile" class="d-flex rsvp-footer">
      <template v-if="isVirtualEvent">
        <md-button class="md-red maryoku-btn flex-1" @click="showZoomModal = true"> RSVP Now</md-button>
      </template>
      <template v-else>
        <md-button class="md-simple md-outlined md-red maryoku-btn flex-1" @click="showZoomModal = true">
          Virutal Event
        </md-button>
        <md-button class="md-red maryoku-btn flex-1" @click="showRsvpModal = true"> RSVP Now</md-button>
      </template>
    </div>
    <div v-else class="rsvp-footer white-card">
      <div class="rsvp-footer-content">
        <div>
          <md-button @click="scrollToTop" class="md-button md-simple md-just-icon md-theme-default scroll-top-button">
            <img :src="`${$iconURL}Budget+Requirements/Asset+49.svg`" width="17" />
          </md-button>
          <md-button
            class="md-button md-red md-just-icon md-theme-default scroll-top-button"
            @click="showSharingModal = true"
          >
            <img :src="`${$iconURL}RSVP/sharing-white.svg`" width="17" />
          </md-button>
        </div>
        <div class="d-flex align-center btn-group">
          <md-button class="md-simple md-button md-black maryoku-btn" @click="reject">
            <span class="font-size-20">I Can't make it</span>
          </md-button>
          <span class="seperator"></span>
          <md-button class="md-simple md-button md-black maryoku-btn" @click="thinkLater">
            <span class="font-size-20">I Need To Think About It</span>
          </md-button>

          <template v-if="isVirtualEvent">
            <md-button v-if="!isSentRsvp" @click="showZoomModal = true" class="md-button md-red maryoku-btn rsvp-btn">
              <span class="font-size-20">RSVP Now</span>
            </md-button>
          </template>
          <template v-else>
            <md-button
              @click="showZoomModal = true"
              v-if="campaign.allowOnline"
              class="md-simple md-button md-black maryoku-btn virtual-btn"
            >
              <span class="font-size-20">Virtual Participation</span>
            </md-button>
            <md-button v-if="!isSentRsvp" @click="showRsvpModal = true" class="md-button md-red maryoku-btn rsvp-btn">
              <span class="font-size-20">RSVP Now</span>
            </md-button>
            <div v-else class="font-size-20 ml-20">
              <img :src="`${$iconURL}Campaign/Group 9222.svg`" />
              Sent Already
            </div>
          </template>
        </div>
      </div>
    </div>
    <md-button
      v-if="isMobile"
      @click="scrollToTop"
      class="md-button md-simple md-just-icon md-theme-default scroll-top-button"
    >
      <img :src="`${$iconURL}Budget+Requirements/Asset+49.svg`" width="17" />
    </md-button>
    <rsvp-information-modal
      v-if="showRsvpModal"
      :event="event"
      @close="showRsvpModal = false"
      @setRsvp="setRsvp"
    ></rsvp-information-modal>
    <join-zoom-modal
      v-if="showZoomModal"
      :event="event"
      @close="showZoomModal = false"
      @setRsvp="setZoomRsvp"
      :campaign="campaign"
    ></join-zoom-modal>
    <sync-calendar-event-modal
      v-if="showSyncCalendarModal"
      @close="showSyncCalendarModal = false"
      :campaign="campaign"
      :rsvp="rsvpData"
    ></sync-calendar-event-modal>
    <setting-reminder-modal
      v-if="showReminderModal"
      @close="showReminderModal = false"
      @setRemind="onSetReminder"
      :rsvpRequest="rsvpRequest"
      :campaign="campaign"
    ></setting-reminder-modal>

    <sync-calendar-modal
      v-if="showSyncCalendarForZoom"
      @close="showSyncCalendarForZoom = false"
      @scheduled="showSyncCalendarForZoom = false"
      :campaign="campaign"
      :rsvp="rsvpData"
      class="rsvp-modal"
    ></sync-calendar-modal>
    <social-sharing-modal
      v-if="showSharingModal"
      @cancel="showSharingModal = false"
      class="rsvp-modal"
      :defaultSharingData="{
        mediaUrl: headerImage,
      }"
    ></social-sharing-modal>
    <modal v-if="showRejectConformModal" class="rsvp-modal reject-modal">
      <template slot="header">
        <md-button class="md-simple md-just-icon md-round modal-default-button" @click="showRejectConformModal = false">
          <md-icon>clear</md-icon>
        </md-button>
      </template>
      <template slot="body">
        <img :src="`${$iconURL}RSVP/reject-icon.svg`" />
        <div class="font-size-30 mt-40 font-bold-extra text-transform-uppercase">You’ll be missed</div>
        <div class="mt-30 font-size-20">We’re sorry you can’t make it. If anything changes please let us know</div>
      </template>
    </modal>
  </div>
</template>
<script>
import RsvpTimelineItem from "./RSVPTimelineItem";
import Calendar from "@/models/Calendar";
import Rsvp from "@/models/Rsvp";
import RsvpRequest from "@/models/RsvpRequest";
import Campaign from "@/models/Campaign";
import CalendarEvent from "@/models/CalendarEvent";
import EventTimelineDate from "@/models/EventTimelineDate";
import _ from "underscore";
import RsvpInformationModal from "@/components/Modals/RSVP/InformationModal";
import SettingReminderModal from "@/components/Modals/RSVP/SettingReminderModal";
import JoinZoomModal from "@/components/Modals/RSVP/JoinZoomModal";
import SyncCalendarModal from "@/components/Modals/RSVP/SyncCalendarModal";
import SyncCalendarEventModal from "@/components/Modals/RSVP/SyncCalendarEventModal";
import RsvpVenueCarousel from "./RSVPVenueCarousel";
import RsvpEventInfoPanel from "@/pages/app/RSVP/RSVPEventInfoPanel.vue";
import SocialSharingModal from "@/components/Modals/SocialSharingModal";
import { mapActions, mapGetters } from "vuex";
import Modal from "../../../components/Modal.vue";
import MoreInfoItem from "./mobile/MoreInfoItem.vue";
import { Model } from "vue-api-query";
export default {
  components: {
    RsvpTimelineItem,
    RsvpInformationModal,
    SettingReminderModal,
    JoinZoomModal,
    SyncCalendarModal,
    RsvpVenueCarousel,
    RsvpEventInfoPanel,
    SocialSharingModal,
    SyncCalendarEventModal,
    Modal,
    MoreInfoItem,
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      images: [
        {
          src: `${this.$iconURL}RSVP/Image+81.jpg`,
        },
        {
          src: `${this.$iconURL}RSVP/Image+82.jpg`,
        },
        {
          src: `${this.$iconURL}RSVP/Image+83.jpg`,
        },
        {
          src: `${this.$iconURL}RSVP/Image+84.jpg`,
        },
      ],
      event: {},

      isLoading: true,
      showRsvpModal: false,
      showReminderModal: false,
      showZoomModal: false,
      showSyncCalendarForZoom: false,
      showSyncCalendarModal: false,
      campaign: {
        additionalData: {},
      },
      rsvpRequest: null,
      showSharingModal: false,
      isSentRsvp: false,
      showRejectConformModal: false,
      rsvpData: null,
      timelineDates: [],
    };
  },
  created() {
    const rsvpRequestId = this.$route.params.rsvpRequestId;
    const tenantId = this.$route.params.tenantId;

    Model.$http.defaults.headers.common["gorm-tenantid"] = tenantId;
    Model.$http.defaults.headers.common.gorm_tenantid = tenantId;

    const rsvpRequest = new RsvpRequest({ id: rsvpRequest });

    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });

    this.isLoading = true;
    console.log("isMobile", this.isMobile);
    RsvpRequest.find(rsvpRequestId)
      .then((rsvpRequest) => {
        console.log(rsvpRequest);
        this.rsvpRequest = rsvpRequest;
        this.event = rsvpRequest.event;
        this.campaign = rsvpRequest.campaign;
        this.isLoading = false;
        if (!this.rsvpRequest.isOpened) {
          new RsvpRequest({ id: rsvpRequest.id, isOpened: true }).save();
        }

        new EventTimelineDate()
          .for(new CalendarEvent({ id: this.event.id }))
          .get()
          .then((timelineData) => {
            this.timelineDates = timelineData;
          });
      })
      .catch((e) => {
        console.log(e);
      });
    this.$root.$on("setRsvp", (rsvpData) => {
      this.isLoading = true;
      rsvpData.attendingOption = "PERSON";
      rsvpData.rsvpStatus = "ACCEPTED";
      rsvpData.invitedEmail = this.rsvpRequest.email;
      rsvpData.rsvpRequest = new RsvpRequest({ id: this.rsvpRequest.id });
      rsvpData.event = new CalendarEvent({ id: this.event.id });
      rsvpData.guests = rsvpData.guests.filter((item) => item.name);
      new Rsvp(rsvpData).save().then((requestedRSVP) => {
        this.isLoading = false;
        console.log(requestedRSVP);
        this.showSyncCalendarModal = true;
        this.rsvpData = requestedRSVP;
        this.showRsvpModal = false;
        this.isSentRsvp = true;
      });
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  computed: {
    isMobile() {
      return this.windowWidth < 960;
    },
    backgroundImage() {
      if (this.event.concept) {
        const color1 = this.event.concept.colors[0].color;
        const color2 = this.event.concept.colors[1].color;
        const color3 = this.event.concept.colors[2].color;
        const color4 = this.event.concept.colors[3].color;
        console.log(
          `linear-gradient(${color1} 25%, ${color2} 25%, ${color2} 50%, ${color3} 50%, ${color3} 75%, ${color4} 75%, ${color4} 100%);`,
        );
        return `linear-gradient(${color1} 25%, ${color2} 25%, ${color2} 50%, ${color3} 50%, ${color3} 75%, ${color4} 75%, ${color4} 100%);`;
      } else {
        return "";
      }
    },
    headerImage() {
      console.log(this.event.concept);
      if (this.campaign) {
        return this.campaign.coverImage || this.campaign.defaultCoverImage;
      }
      return "";
    },
    scheduledDays() {
      return this.event.timelineDates;
    },
    eventStartTime() {
      if (this.timelineDates[0]) {
        return Number(this.timelineDates[0].timelineItems[0] ? this.timelineDates[0].timelineItems[0].startTime : 0);
      }
      return 0;
    },
    isVirtualEvent() {
      return this.event.places && this.event.places.length === 1 && this.event.places[0] === "VIRTUAL";
    },
    conceptColor() {
      if (!this.event.concept || !this.event.concept.colors[0]) {
        return "rgba(87, 242, 195, 0.23)";
      }
      return this.event.concept.colors[0].color;
    },
  },
  methods: {
    ...mapActions("campaign", ["getCampaigns"]),
    gotoWeb() {
      window.open("https://www.maryoku.com", "_blank");
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    setRsvp() {
      this.showRsvpModal = false;
      // this.showReminderModal = true;
    },
    setZoomRsvp(rsvpData) {
      this.isLoading = true;
      rsvpData.attendingOption = "VIRTUAL";
      rsvpData.rsvpStatus = "ACCEPTED";
      rsvpData.invitedEmail = this.rsvpRequest.email;
      rsvpData.rsvpRequest = new RsvpRequest({ id: this.rsvpRequest.id });
      rsvpData.event = new CalendarEvent({ id: this.event.id });
      new Rsvp(rsvpData).save().then((requestedRSVP) => {
        this.rsvpData = requestedRSVP;
      });
      new RsvpRequest({ id: this.rsvpRequest.id, status: "VIRTUAL" }).save().then((res) => {
        this.showZoomModal = false;
        this.showSyncCalendarForZoom = true;
        this.isLoading = false;
      });
    },
    reject() {
      new RsvpRequest({ id: this.rsvpRequest.id, status: "REJECTED" }).save().then((res) => {
        // Swal.fire({
        //   title: `Sorry to hear that. Hope to see you on next event! `,
        //   buttonsStyling: false,
        //   confirmButtonClass: "md-button md-success",
        // });
        this.showRejectConformModal = true;
      });
    },
    thinkLater() {
      this.showReminderModal = true;
    },
    onSetReminder() {
      new RsvpRequest({ id: this.rsvpRequest.id, status: "CONSIDERED" }).save().then((res) => {});
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
  },
};
</script>
<style lang="scss" scoped>
.rsvp-container {
  padding-bottom: 100px;
  .rsvp-event {
    background-color: #fff;
    max-width: 1520px;
    margin: 80px auto 80px;
    border-radius: 20px;
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
    overflow: hidden;
    background-color: #fff;
    .logo-image {
      max-width: 150px;
      max-height: 150px;
    }
    .campaign-description {
      font-size: 17px;
      width: 90%;
    }
    .rsvp-event-header {
      height: 430px;
      background-repeat: no-repeat;
      background-position: center 60%;
      background-size: cover;
    }
    &-overview {
      // background-color: #fff;
      // @include gradientBackgroundRSVP(#ff48b2, #71ecf8, #fff500, #57f2c3);
      position: relative;
      .concept-color-bar {
        width: 30px;
        height: calc(100% - 430px);
        bottom: 0;
        position: absolute;
      }
      &-content {
        background-color: white;
        margin-left: 27px;
        padding: 60px 120px;
        .greeting-word {
          margin-bottom: 100px;
          line-height: 1em;
          font-size: 40px;
        }
        .campaign-title {
          font-size: 60px;
          line-height: 1.2em;
        }
      }
      .event-info {
        .event-info-item {
          margin-bottom: 50px;
          display: flex;
          align-items: center;
          &-icon {
            width: 42px;
            height: 42px;
            background-color: #d9fcf2;
            border-radius: 21px;
            padding: 8px;
          }
          &-title {
            width: 150px;
            padding: 10px 24px;
          }
        }
      }
    }
    &-guid {
      // background-color: rgba(#57f2c3, 0.23);
      padding: 60px 135px;
      position: relative;
      .rsvp-event-guid-background {
        position: absolute;
        opacity: 0.2;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
      }
    }
    &-timeline {
      padding: 60px 135px;
      &-day {
        line-height: 1.5em;
        width: 100%;
        background-color: #3a3838;
        text-align: center;
        color: white;
        border-radius: 2px;
      }
    }

    .owl-carousel {
      .owl-item {
        .item {
          width: 340px;
          height: 200px;
        }
      }
    }
  }
  .rsvp-footer {
    padding: 30px 10px;
    background-color: white;
    position: fixed;
    bottom: 0px;
    width: 100%;
    z-index: 999;
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
    }
    .rsvp-btn {
      min-width: 280px;
      margin-left: 30px;
    }

    .virtual-btn {
      border: solid 1px #f51355;
      margin-left: 30px;
    }
  }
  .logo {
    cursor: pointer;
  }
}
@media only screen and (max-width: 959px) {
  .rsvp-container {
    padding-bottom: 0px;
    .scroll-top-button {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 999;

      background-color: white !important;
    }
    .rsvp-event {
      margin: 0 auto 0px;
      border-radius: 0px;
      .rsvp-event-header {
        height: 210px;
      }
      .campaign-description {
        font-size: 16px;
        width: 100%;
      }
      &-overview {
        .share-button {
          position: absolute;
          left: 30px;
          top: 30px;
          border-radius: 50%;
        }
        .concept-color-bar {
          height: 100%;
          width: 10px;
        }
        &-content {
          margin-left: 12px;
          padding: 30px 20px;
          .greeting-word {
            margin-bottom: 50px;
            font-size: 16px;
          }
          .campaign-title {
            font-size: 26px;
          }
        }
        .event-info {
          .event-info-item {
            margin-bottom: 50px;
            display: flex;
            align-items: center;
            &-icon {
              width: 42px;
              height: 42px;
              background-color: #d9fcf2;
              border-radius: 21px;
              padding: 8px;
            }
            &-title {
              width: 150px;
              padding: 10px 24px;
            }
          }
        }
      }
      &-guid {
        padding: 20px;
      }
      &-timeline {
        padding: 20px;
      }
      .owl-carousel {
        .owl-item {
          .item {
            width: 340px;
            height: 200px;
          }
        }
      }
    }
    .rsvp-footer {
      padding: 0;
      button {
        border-radius: 0px;
      }
    }
    .reject-modal {
      img {
        width: 100px;
      }
      .font-size-30 {
        font-size: 24px !important;
      }
      .font-size-20 {
        line-height: 1.5em;
      }
    }
  }
}
</style>
