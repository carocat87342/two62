<template>
  <div
    class="md-layout-item md-size-100 event-details_banner"
    :style="`background-image : url(`+ bannerURL  +`)`"
  >
    <div
      class="update-banner-form"
      v-if="!readonly"
      style="position: absolute; bottom: 1em; left : 1em;"
    >
      <md-button class="md-info" @click="uploadImage">Select Header Image</md-button>
      <input
        type="file"
        style="display: none;"
        ref="inputFile"
        accept="image/gif, image/jpg, image/png"
        @change="onFilePicked"
      />
    </div>

    <event-confirmation
      :user-response.sync="userResponse"
      :user-info.sync="userInfo"
      :event="event"
      v-if="readonly"
      @isGoing="showSignUp()"
      rel="signUpModal"
    ></event-confirmation>

    <edit-header-image v-if="!readonly" :event="event" rel="editHeaderModal"></edit-header-image>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import Calendar from "@/models/Calendar";
import EventComponent from "@/models/EventComponent";
import VueElementLoading from "vue-element-loading";
// import auth from '@/auth';

import EditHeaderImage from "./Modals/EditHeaderImage.vue";
import EventConfirmation from "./EventConfirmation.vue";

export default {
  name: "event-banner",
  components: {
    EditHeaderImage,
    EventConfirmation,
  },
  props: {
    event,
    readonly: {
      type: Boolean,
      default: false,
    },
    userInfo: Object,
    userResponse: Object,
  },
  data: () => ({
    // auth: auth,
    //        bannerURL : this.event.eventPage.headerId ? 'https://static-maryoku.s3.amazonaws.com/storage/img/page-headers/' + this.event.eventPage.headerId : 'https://bit.ly/2TWGILO', // default image for banner
  }),
  methods: {
    ...mapMutations("EventPlannerVuex", [
      "setHeaderModal",
      "setSignUpModal",
      "setDietaryConstraintsModal",
    ]),
    uploadImage() {
      // this.$refs.inputFile.click();
      this.setHeaderModal({ showModal: true });
    },
    onFilePicked(event) {
      let file = event.target.files || event.dataTransfer.files;
      if (!file.length) {
        return;
      }
      if (file[0].size <= 500000) {
        let url = URL.createObjectURL(file[0]);
        this.bannerURL = url;

        const formData = new FormData();
        formData.append("images", file[0], file[0].name); // TODO :: send this object once we have api for userPorfile photo
      } else {
        this.alretExceedPictureSize = true;
      }
    },
    showSignUp() {
      if (this.$auth.user.authenticated) {
        this.setDietaryConstraintsModal({ showModal: true });
      } else {
        this.setSignUpModal({ showModal: true });
      }
    },
  },
  created() {},
  mounted() {},
  computed: {
    bannerURL() {
      return this.event.eventPage.headerImage
        ? "https://static-maryoku.s3.amazonaws.com/storage/img/page-headers/" +
            this.event.eventPage.headerImage
        : "https://bit.ly/2TWGILO";
    },
  },
};
</script>
