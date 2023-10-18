<template>
  <div class="feedback-campaign">
    <div class="p-50">
      <div class="font-size-30 font-bold-extra mb-50 text-transform-capitalize">Say thank you and ask for feedback</div>
      <hr />
      <div class="d-flex mt-70 mb-40">
        <img :src="`${$iconURL}Campaign/group-9380.svg`" class="mr-20" />
        <div class="ml-20">
          <div class="font-size-40 font-bold line-height-1 mb-20">It was great seeing you!</div>
          <div class="font-size-22 line-height-1">{{ campaignData.name }}</div>
          <!-- <title-editor :value="info.conceptName" @change="changeTitle" class="mt-40"></title-editor> -->
        </div>
      </div>
      <maryoku-textarea :placeholder="placeHolder" v-model="campaignData.description"></maryoku-textarea>
    </div>
    <feedback-image-carousel
      class="p-50"
      :images="campaignData.images"
      @addImage="addNewImage"
    ></feedback-image-carousel>
    <div class="p-50">
      <div class="d-flex align-center font-bold">
        Allow guests to upload photos form the event
        <md-switch class="large-switch" v-model="campaignData.visibleSettings.allowUploadPhoto"></md-switch>
      </div>
      <div class="font-size-22 font-bold line-height-2">Download files related to the event</div>
      <div class="mb-20">Like presentation</div>
      <div v-if="campaignData.files && campaignData.files.length > 1">
        <span class="font-bold">{{ campaignData.files[0].name }}</span>
      </div>
      <md-button class="md-simple edit-btn md-red" @click="uploadFile">
        <img :src="`${$iconURL}Campaign/Group 9241.svg`" class="mr-10" />Upload File
      </md-button>
      <input type="file" id="file-uploader" @change="changeUploadFile" class="d-none" />
      <hr class="mt-50 mb-70" />
      <div class="share-panel">
        <div class="d-flex mb-60 align-center">
          <img :src="`${$iconURL}Campaign/group-9386.svg`" class="mr-20" />
          <div>
            <div class="font-size-30 font-bold line-height-2">share event participation</div>
            <div>(Include photos & details of the event)</div>
          </div>
          <hide-switch v-model="campaignData.visibleSettings.showSharingOption" label="sharing option"></hide-switch>
        </div>
        <sharing-button-group
          class="mb-50"
          v-if="campaignData.visibleSettings.showSharingOption"
        ></sharing-button-group>
      </div>
      <hr />
      <div>
        <div class="font-size-30 font-bold line-height-1 d-flex align-center">
          <img :src="`${$iconURL}Campaign/group-7321.svg`" class="mr-20" />
          We'd love to get your feedback
          <hide-switch v-model="campaignData.visibleSettings.showFeedback" label="feedback section"></hide-switch>
        </div>
        <div v-if="campaignData.visibleSettings.showFeedback">
          <feedback-question
            v-for="(question, index) in feedbackQuestions"
            :key="index"
            :feedbackData="question"
            :disabled="true"
          ></feedback-question>
        </div>
      </div>
      <div class="mt-60 d-flex align-center" v-if="isEditingNewQuestion">
        <input v-model="newQuestion" style="width: 40%" />
        <md-button class="md-simple md-red maryoku-btn" @click="addNewQuestion">Add</md-button>
        <md-button class="md-simple md-red maryoku-btn md-outlined" @click="isEditingNewQuestion = false"
          >Cancel</md-button
        >
      </div>
      <div class="mt-60" v-else>
        <md-button class="md-simple edit-btn md-red" @click="editNewQuestion">
          <img :src="`${$iconURL}Campaign/Group 9327.svg`" class="mr-20" />Feel free to add more questions
        </md-button>
      </div>
    </div>
    <hr />
  </div>
</template>
<script>
import MaryokuTextarea from "@/components/Inputs/MaryokuTextarea";
import FeedbackImageCarousel from "./components/FeedbackImageCarousel";
import SharingButtonGroup from "./components/SharingButtonGroup";
import FeedbackQuestion from "./components/FeedbackQuestion";
import TitleEditor from "./components/TitleEditor";
import HideSwitch from "@/components/HideSwitch";
import Swal from "sweetalert2";

export default {
  components: {
    MaryokuTextarea,
    FeedbackImageCarousel,
    SharingButtonGroup,
    FeedbackQuestion,
    TitleEditor,
    HideSwitch,
  },
  props: {
    info: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      placeHolder: "",
      originalContent: {},
      feedbackQuestions: [],
      isEditingNewQuestion: false,
      newQuestion: "",
    };
  },
  created() {
    this.placeHolder = `Thank you so much for attending! We are so glad you could join us.
    Please take a moment to help us improve future events by taking a brief survey.
    Your feedback is extremely valuable to our ongoing effort to offer great ${
      this.event.guestType || "employee"
    } experience.

    If you have photos, documents or other event materials that you want to share, you can upload them here.
    All materials is also available for download from this page.

    We look forward to seeing you again soon!
    `;
    this.placeHolder = this.placeHolder.trim();
    // this.comment = this.placeHolder.trim().replace(/  /g, '');
    this.placeHolder = this.placeHolder.trim().replace(/  /g, "");
    this.feedbackQuestions = [
      {
        question: "What did you like or dislike about this event?",
        showQuestion: true,
        rank: 0,
        icon: "",
      },
    ];
    this.event.components
      .sort((a, b) => {
        return a.order - b.order;
      })
      .forEach((service) => {
        if (service.eventCategory.type == "service") {
          this.feedbackQuestions.push({
            question: `How Was The ${service.eventCategory.fullTitle}?`,
            showQuestion: true,
            rank: 0,
            icon: service.eventCategory.icon,
            label: service.eventCategory.fullTitle,
          });
        }
      });
    this.$store.commit("campaign/setAttribute", {
      name: "FEEDBACK",
      key: "feedbackQuestions",
      value: this.feedbackQuestions,
    });
  },
  computed: {
    event() {
      return this.$store.state.event.eventData;
    },
    campaignData() {
      return this.$store.state.campaign.FEEDBACK;
    },
    campaignTitle() {
      return this.$store.state.campaign.FEEDBACK ? this.$store.state.campaign.FEEDBACK.title : "Event Name";
    },
  },
  methods: {
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
    addNewImage(image) {
      console.log(image);
      const images = this.campaignData.images;
      images.unshift({ src: image.imageString });
      this.$store.commit("campaign/setAttribute", { name: "FEEDBACK", key: "images", value: images });
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
    editNewQuestion() {
      this.isEditingNewQuestion = true;
    },
    addNewQuestion() {
      const newQuestion = {
        icon: "",
        label: this.newQuestion,
        question: this.newQuestion,
        rank: 0,
        showQuestion: true,
      };
      this.feedbackQuestions.push(newQuestion);
      this.newQuestion = "";
      // const feedbackQuestions = [...this.campaignData.feedbackQuestions, newQuestion];
      // console.log(feedbackQuestions);
      // this.$store.commit("campaign/setAttribute", {
      //   name: "FEEDBACK",
      //   key: "feedbackQuestions",
      //   value: feedbackQuestions,
      // });
      this.isEditingNewQuestion = false;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
