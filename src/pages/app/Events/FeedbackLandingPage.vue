<template>
  <div class="event-feedback-landingpage">
    <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" />
    <div class="event-feedback-form" v-if="campaign">
      <div class="p-50">
        <!-- <div class="font-size-30 font-bold-extra mb-50 text-transform-capitalize">
          Say thank you and ask for feedback
        </div>
        <hr /> -->
        <div class="d-flex mt-70 mb-40">
          <img :src="`${$iconURL}Campaign/group-9380.svg`" class="mr-20" />
          <div class="ml-20">
            <div class="font-size-40 font-bold line-height-1 mb-20">It was great seeing you!</div>
            <div class="font-size-22 line-height-1">{{ campaign.event.title }}</div>
            <!-- <title-editor :value="info.conceptName" @change="changeTitle" class="mt-40"></title-editor> -->
          </div>
        </div>
        <div>
          {{ campaign.description }}
        </div>
        <div v-if="!campaign.description">
          Thank you so much for attending! We are so glad you could join us.<br />
          Please take a moment to help us improve future events by taking a brief survey. <br />
          Your feedback is extremely valuable to our ongoing effort to offer great experience.<br />
          <br />
          If you have photos, documents or other event materials that you want to share, you can upload them here.<br />
          All materials is also available for download from this page.<br />
          <br />
          We look forward to seeing you again soon!
        </div>
      </div>
      <feedback-image-carousel
        v-if="campaign.visibleSettings.allowUploadPhoto"
        class="p-50"
        :images="images"
        @addImage="addNewImage"
      ></feedback-image-carousel>
      <div class="p-50">
        <div v-if="campaign.attachments && campaign.attachments.length > 1">
          <span class="font-bold">{{ campaign.attachments[0].name }}</span>
        </div>
        <input type="file" id="file-uploader" @change="changeUploadFile" class="d-none" />
        <template v-if="campaign.visibleSettings.showSharingOption">
          <hr class="mt-50 mb-70" />
          <div class="share-panel">
            <div class="d-flex mb-60 align-center">
              <img :src="`${$iconURL}Campaign/group-9386.svg`" class="mr-20" />
              <div>
                <div class="font-size-30 font-bold line-height-2">share event participation</div>
                <div>(Include photos & details of the event)</div>
              </div>
            </div>
            <sharing-button-group class="mb-50"></sharing-button-group>
          </div>
        </template>
        <template v-if="campaign.visibleSettings.showFeedback">
          <hr />
          <div>
            <div class="font-size-30 font-bold line-height-1 d-flex align-center">
              <img :src="`${$iconURL}Campaign/group-7321.svg`" class="mr-20" />
              We'd love to get your feedback
            </div>
            <div>
              <feedback-question
                v-for="(question, index) in availableQuestions"
                :key="index"
                :feedbackData="question"
                :showSwitch="false"
                @change="changeFeedback(index, ...arguments)"
              ></feedback-question>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="feedback-footer">
      <div class="feedback-footer-content">
        <div>
          <md-button @click="scrollToTop" class="md-button md-simple md-just-icon md-theme-default scroll-top-button">
            <img :src="`${$iconURL}Budget+Requirements/Asset+49.svg`" width="17" />
          </md-button>
          <md-button class="md-button md-red md-just-icon md-theme-default scroll-top-button">
            <img :src="`${$iconURL}RSVP/sharing-white.svg`" width="17" />
          </md-button>
        </div>
        <div>
          <md-button class="md-simple md-button md-black maryoku-btn">
            <span class="font-size-20">I will do it later</span>
          </md-button>

          <md-button class="md-button md-red maryoku-btn rsvp-btn" @click="giveFeedback">
            <span class="font-size-20">Give Feedback</span>
          </md-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CalendarEvent from "@/models/CalendarEvent";
import Feedback from "@/models/Feedback";
import Campaign from "@/models/Campaign";

import MaryokuTextarea from "@/components/Inputs/MaryokuTextarea";
import FeedbackImageCarousel from "@/pages/app/Campaign/components/FeedbackImageCarousel";
import SharingButtonGroup from "@/pages/app/Campaign/components/SharingButtonGroup";
import FeedbackQuestion from "@/pages/app/Campaign/components/FeedbackQuestion";
import TitleEditor from "@/pages/app/Campaign/components/TitleEditor";
import HideSwitch from "@/components/HideSwitch";
import Swal from "sweetalert2";
import { mapActions, mapGetters } from "vuex";
import S3Service from "@/services/s3.service";

export default {
  components: {
    MaryokuTextarea,
    FeedbackImageCarousel,
    SharingButtonGroup,
    FeedbackQuestion,
    TitleEditor,
    HideSwitch,
  },

  data() {
    return {
      isLoading: true,
      campaign: null,
      event: null,
      placeHolder: "",
      originalContent: {},
      info: {},
      images: [],
    };
  },
  created() {
    this.placeHolder = `Thank you so much for attending! We are so glad you could join us.
    Please take a moment to help us improve future events by taking a brief survey. 
    Your feedback is extremely valuable to our ongoing effort to offer great experience.

    If you have photos, documents or other event materials that you want to share, you can upload them here.
    All materials is also available for download from this page.

    We look forward to seeing you again soon!
    `;

    const eventId = this.$route.params.eventId;
    const calendarEvent = new CalendarEvent({ id: eventId });

    this.getCampaigns({ event: calendarEvent }).then((campaigns) => {
      this.isLoading = false;
      this.campaign = campaigns["FEEDBACK"];
      this.event = this.campaign.event;
      this.images = this.campaign.images;
    });
  },
  methods: {
    ...mapActions("campaign", ["getCampaigns"]),
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    setDefault() {
      Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this feedback!`,
        showCancelButton: true,
        confirmButtonClass: "md-button md-success btn-fill",
        cancelButtonClass: "md-button md-danger btn-fill",
        confirmButtonText: "Yes, revert it!",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.editingContent = Object.assign({}, this.originalContent);
        }
      });
    },
    addNewImage({ imageString, file }) {
      const fileName = `${this.campaign.id}-${new Date().getTime()}`;
      const extension = file.type.split("/")[1];
      this.images.unshift({
        src: `${process.env.S3_URL}feedback/${this.campaign.id}/${fileName}.${extension}`,
        imageData: imageString,
      });
      S3Service.fileUpload(file, `fileName`, `feedback/${this.campaign.id}`).then((res) => {});
    },
    uploadFile() {
      document.getElementById("file-uploader").click();
    },
    changeUploadFile(event) {
      const fileName = event.target.files[0].name;
      this.editingContent.push({
        name: fileName,
      });
    },
    giveFeedback() {
      const email = this.$route.query.email;
      const feedbackQuestions = [];
      this.campaign.feedbackQuestions.forEach((item) => {
        if (!item.showQuestion) return;
        feedbackQuestions.push({
          question: item.question,
          comment: item.comment,
          rate: item.rank,
          label: item.label || "General",
          event: new CalendarEvent({ id: this.event.id }),
        });
      });
      new Feedback({
        guestName: email,
        guestEmail: email,
        guestComment: "",
        feedbackCampaign: new Campaign({ id: this.campaign.id }),
        feedbackQuestions: feedbackQuestions,
        images: this.images,
      })
        .save()
        .then((res) => {
          Swal.fire({
            title: "",
            text: "Thank you for your feedback!",
            type: "success",
            confirmButtonClass: "md-button md-red maryoku-btn",
            buttonsStyling: false,
          });
        })
        .catch((e) => {
          Swal.fire({
            title: "Invalid information",
            text: "Could you please check if you input all information on given form?",
            type: "error",
            confirmButtonClass: "md-button md-red maryoku-btn",
            buttonsStyling: false,
          });
        });
    },
    changeFeedback(index, value) {
      this.campaign.feedbackQuestions[index] = value;
    },
  },
  computed: {
    availableQuestions() {
      return this.campaign.feedbackQuestions.filter((item) => item.showQuestion);
    },
  },
};
</script>
<style lang="scss" scoped>
.event-feedback-landingpage {
  .event-feedback-form {
    background-color: #fff;
    max-width: 1520px;
    margin: 80px auto 80px;
    border-radius: 20px;
    -webkit-box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
    overflow: hidden;
    background-color: #fff;
  }
  .feedback-footer {
    height: 128px;
    background-color: white;
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
      margin-top: 1rem;
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
}
</style>
