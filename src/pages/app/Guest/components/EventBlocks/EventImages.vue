<template>
  <div class="event-images-list md-layout">
    <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" is-full-screen />
    <md-card v-for="(image, index) in event.eventPage.images" :key="index" class="md-layout-item md-size-25">
      <md-card-media>
        <div
          class="event-images_image-item"
          style="margin: auto"
          :style="`background-image : url(` + `${serverUrl}/1/eventPageImages/${image.id}` + `)`"
          @click="previewImage(image.id)"
        ></div>
        <md-button
          class="md-info md-xs md-just-icon md-round replace-event-image"
          @click="uploadEventImage(index)"
          v-if="!readonly"
        >
          <md-icon>cached</md-icon>
          <md-tooltip>Replace</md-tooltip>
        </md-button>
        <md-button
          class="md-danger md-xs md-just-icon md-round delete-event-image"
          @click="removeEventImage(index)"
          v-if="!readonly"
        >
          <md-icon>delete</md-icon>
          <md-tooltip>Remove</md-tooltip>
        </md-button>
      </md-card-media>
    </md-card>
    <md-card
      v-for="(n, index) in 3 - Math.min(3, event.eventPage.images.length)"
      :key="index + 1000"
      class="md-layout-item md-size-33 default-image-box"
      :style="`cursor: pointer; background: url('https://static-maryoku.s3.amazonaws.com/storage/img/default${
        index + 1
      }.jpg') center center no-repeat; background-size: cover;`"
    >
      <div
        v-if="!readonly"
        class
        @click="uploadEventImage"
        style="color: black; text-shadow: 0 0 3px #fff; font-size: 18px; font-weight: 500"
      >
        <md-icon style="color: black; text-shadow: 0 0 3px #fff; font-size: 24px; font-weight: 500"
          >add_to_photos</md-icon
        >Add image
      </div>
    </md-card>
    <div class="update-banner-form" v-if="!readonly">
      <input
        type="file"
        style="display: none"
        ref="eventFile"
        accept="image/gif, image/jpg, image/png"
        @change="onEventFilePicked"
      />
    </div>
    <div class="preview-image" v-if="imagePreview">
      <md-button class="md-simple md-just-icon md-round" @click="closePreviewModal">
        <md-icon>clear</md-icon>
      </md-button>
      <img :src="`${serverUrl}/1/eventPageImages/${imagePreview}`" class="event-image-item" />
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import EventComponent from "@/models/EventComponent";
import CalendarEventPageImage from "@/models/CalendarEventPageImage";
import VueElementLoading from "vue-element-loading";
// import auth from '@/auth';
import Swal from "sweetalert2";

export default {
  name: "event-images",
  components: {
    VueElementLoading,
  },
  props: {
    event,
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    // auth: auth,
    eventImages: [],
    serverUrl: process.env.SERVER_URL,
    imagePreview: null,
    isLoading: false,
    selectedImage: null,
  }),
  methods: {
    uploadEventImage(imageId = null) {
      this.selectedImage = typeof imageId !== "object" ? imageId : null;
      this.$refs.eventFile.click();
    },

    onEventFilePicked(event) {
      let file = event.target.files || event.dataTransfer.files;
      if (!file.length) {
        return;
      }

      if (file[0].size <= 5000000) {
        // 5mb
        this.createImage(file[0]);
      } else {
        this.alretExceedPictureSize = true;
        this.$notify({
          message: "You've Uploaded an Image that Exceed the allowed size, try small one!",
          horizontalAlign: "center",
          verticalAlign: "top",
          icon: "warning",
        });
      }
    },
    createImage(file, type) {
      let reader = new FileReader();
      let vm = this;

      this.isLoading = true;

      reader.onload = (e) => {
        const calendar = new Calendar({
          id: this.$auth.user.defaultCalendarId,
        });
        const event = new CalendarEvent({
          id: this.event.id,
        });
        if (this.selectedImage != null) {
          this.removeEventImage(this.selectedImage);
          this.selectedImage = null;
        }

        return new CalendarEventPageImage({
          featuredImageFile: e.target.result,
        })
          .for(calendar, event)
          .save()
          .then((result) => {
            vm.event.eventPage.images.push({
              id: result.id,
            });

            vm.isLoading = false;
          })
          .catch((error) => {
            vm.isLoading = false;

            console.log(error);
          });
      };
      reader.readAsDataURL(file);
    },
    removeEventImage(index) {
      const calendar = new Calendar({
        id: this.$auth.user.defaultCalendarId,
      });
      const event = new CalendarEvent({
        id: this.event.id,
      });

      this.isLoading = true;

      return new CalendarEventPageImage({
        id: this.event.eventPage.images[index].id,
      })
        .for(calendar, event)
        .delete()
        .then((result) => {
          this.event.eventPage.images.splice(index, 1);
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    previewImage(image) {
      this.imagePreview = image;
    },
    closePreviewModal() {
      this.imagePreview = null;
    },
  },
  created() {},
  mounted() {},
  computed: {},
};
</script>
