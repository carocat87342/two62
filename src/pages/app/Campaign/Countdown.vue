<template>
  <div class="coundown-campaign">
    <div class="p-50">
      <div class="font-size-30 font-bold-extra text-transform-capitalize">send your guests a fun countdown</div>
      <div class="countdown-cover-image mt-50">
        <img :src="coverImage" />
        <div class="countdown-guests d-flex align-center p-20">
          <span class="font-size-30 font-bold-extra mr-10">{{ event.numberOfParticipants | withComma }}</span>
          <span class="font-size-22 font-bold color-dark-gray" v-if="isLaunched">Guests are Attending</span>
          <span class="font-size-22 font-bold color-dark-gray" v-if="!isLaunched">Guests are Invited</span>
          <hide-switch class="ml-20" v-model="campaignData.visibleSettings.showComing" label="coming"></hide-switch>
        </div>
        <div class="d-flex countdown-time-panel align-end justify-content-center">
          <countdown-time :event="event"></countdown-time>
          <hide-switch
            class="ml-20"
            v-model="campaignData.visibleSettings.showCountdown"
            label="countdown"
          ></hide-switch>
        </div>
        <div class="cover-image-button">
          <md-button class="md-button md-red maryoku-btn md-theme-default change-cover-btn" @click="chooseFiles">
            <img :src="`${$iconURL}Campaign/Group 2344.svg`" class="mr-10" style="width: 20px" />Change Cover
          </md-button>
          <input
            style="display: none"
            id="countdown-coverImage"
            name="attachment"
            type="file"
            multiple="multiple"
            @change="onFileChange"
          />
        </div>
      </div>
      <!-- <div class="font-size-50 font-bold-extra text-center line-height-1 mb-60">{{info.conceptName}}</div> -->
      <title-editor
        :defaultValue="campaignTitle"
        @change="changeTitle"
        class="font-size-50 font-bold-extra text-center line-height-1 mb-60"
      ></title-editor>
      <hr />
      <div class="d-flex mt-60">
        <maryoku-textarea
          :placeholder="placeholder"
          class="mr-60 flex-1"
          style="padding: 40px 60px 40px 40px"
          v-model="campaignData.description"
        ></maryoku-textarea>
        <rsvp-event-info-panel class="flex-1" :event="event"></rsvp-event-info-panel>
      </div>
      <div class="mt-60 logo-section d-flex align-center justify-content-center">
        <img :src="campaignData.logoUrl" />
        <hide-switch class="ml-20" v-model="campaignData.visibleSettings.showLogo" label="logo"></hide-switch>
      </div>
    </div>
  </div>
</template>
<script>
import MaryokuTextarea from "@/components/Inputs/MaryokuTextarea";
import CountdownTime from "./components/CountdownTime";
import RsvpEventInfoPanel from "@/pages/app/RSVP/RSVPEventInfoPanel";
import TitleEditor from "./components/TitleEditor";
import HideSwitch from "@/components/HideSwitch";
import { getBase64 } from "@/utils/file.util";
import Swal from "sweetalert2";

export default {
  components: {
    CountdownTime,
    RsvpEventInfoPanel,
    MaryokuTextarea,
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
      isLaunched: false,
      placeholder: `It's now time to get super exited! The event of the year is almost here( and it even rhymes). What to expect? out of this world live shows amazing food refreshing cocktail bar best employee award see u soon`,
      originContent: {},
      editingContent: {
        coverImage: "",
      },
    };
  },
  created() {
    console.log('countDown.created');
    const defaultCoverImage = `https://static-maryoku.s3.amazonaws.com/storage/Campaign+Headers/coming-soon${
      (new Date().getDate() % 4) + 1
    }.png`;
    if (this.$store.state.campaign.COMING_SOON) {
      this.editingContent = this.$store.state.campaign.COMING_SOON;
      this.editingContent.coverImage = this.event.concept ? this.event.concept.images[1].url : defaultCoverImage;
    } else {
      this.editingContent.title = this.info.conceptName;
      this.editingContent.coverImage = this.event.concept ? this.event.concept.images[1].url : defaultCoverImage;
      this.$store.commit("campaign/setCampaign", {
        name: "COMING_SOON",
        data: this.editingContent,
      });
    }
  },
  computed: {
    event() {
      return this.$store.state.event.eventData;
    },
    campaignData() {
      return this.$store.state.campaign.COMING_SOON;
    },
    campaignTitle() {
      return this.$store.state.campaign.COMING_SOON ? this.$store.state.campaign.COMING_SOON.title : "Event Name";
    },
    coverImage() {
      return this.$store.state.campaign.COMING_SOON.coverImage;
    },
    campaignDescription: {
      get() {
          return this.$store.state.campaign.COMING_SOON ? this.$store.state.campaign.COMING_SOON.description : "";
      },
      set(newValue) {
          this.$store.commit("campaign/setAttribute", { name: "COMING_SOON", key: "description", value: newValue });
      },
    },
  },
  methods: {
    saveData() {
      this.$store.commit("campaign/setCampaign", {
        name: "COMING_SOON",
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
        if (result.value) {
          this.editingContent = Object.assign({}, this.originContent);
        }
      });
    },
    changeTitle(newTitle) {
      this.$store.commit("campaign/setAttribute", { name: "SAVING_DATE", key: "title", value: newTitle });
      this.$store.commit("campaign/setAttribute", { name: "RSVP", key: "title", value: newTitle });
      this.$store.commit("campaign/setAttribute", { name: "COMING_SOON", key: "title", value: newTitle });
      this.$store.commit("campaign/setAttribute", { name: "FEEDBACK", key: "title", value: newTitle });
      // this.$store
      //   .dispatch(
      //     "event/saveEventAction",
      //     new CalendarEvent({
      //       id: this.event.id,
      //       title: newTitle,
      //     }),
      //   )
      //   .then((result) => {});
    },
    chooseFiles() {
      document.getElementById("countdown-coverImage").click();
    },
    async onFileChange(event) {
      const imageData = await getBase64(event.target.files[0]);
      this.$store.commit("campaign/setAttribute", { name: "COMING_SOON", key: "coverImage", value: imageData });
    },
  },
};
</script>
<style lang="scss" scoped>
.coundown-campaign {
  .countdown-cover-image {
    position: relative;
    overflow: hidden;
    img {
      max-height: 500px;
      width: 100%;
      border-radius: 30px;
      object-fit: cover;
    }
    .countdown-time-panel {
      margin: auto;
      transform: translate(70px, -50%);
    }
    .cover-image-button {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .countdown-guests {
    position: absolute;
    right: 50px;
    top: 50px;
    background-color: #fff;
    border-radius: 3px;
  }
  .logo-section {
    margin-left: auto;
    margin-right: auto;
    img {
      max-width: 200px;
    }
  }
}
</style>
