<template>
  <div class="event_header-image-modal">
    <div class="md-layout">
      <modal v-if="editHeaderModal">
        <template slot="header">
          <div class="md-layout d-flex items-left">
            <h4>Select Header Image</h4>
          </div>
          <md-button class="md-simple md-just-icon md-round modal-default-button" @click="closeModal">
            <md-icon>clear</md-icon>
          </md-button>
        </template>
        <template slot="body" v-if="headerImages">
          <vue-element-loading :active="working" spinner="ring" color="#FF547C" is-full-screen />
          <div class="header-images-list md-layout">
            <div class="header-images-list_item md-layout-item md-size-33" v-for="(image, index) in headerImages">
              <img
                :src="`https://static-maryoku.s3.amazonaws.com/storage/img/page-headers/${image.fullFileName}`"
                :class="{ selected: selectedImage === image.cutFileName }"
                @click="selectImage(image.cutFileName)"
              />
              <md-button class="md-simple md-just-icon md-round" @click="previewImage(image.cutFileName)">
                <md-icon>visibility</md-icon>
                <md-tooltip>Preview</md-tooltip>
              </md-button>
            </div>
          </div>
        </template>
        <template slot="footer">
          <md-button class="md-success move-right" @click="saveHeaderImage" :disabled="working">Save</md-button>
        </template>
      </modal>
    </div>

    <div class="preview-image" v-if="imagePreview">
      <md-button class="md-simple md-just-icon md-round" @click="closePreviewModal">
        <md-icon>clear</md-icon>
      </md-button>
      <img :src="`https://static-maryoku.s3.amazonaws.com/storage/img/page-headers/${imagePreview}`" />
    </div>
  </div>
</template>
<script>
// import auth from '@/auth';
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import CalendarEvent from "@/models/CalendarEvent";
import EventPageHeaderImage from "@/models/EventPageHeaderImage";
import { Modal } from "@/components";
import Calendar from "@/models/Calendar";
import EventComponent from "@/models/EventComponent";

import Swal from "sweetalert2";
import { error } from "util";
import moment from "moment";

export default {
  components: {
    Modal,
  },
  props: {
    event: Object,
  },
  data: () => ({
    // auth: auth,
    working: false,
    headerImages: null,
    selectedImage: null,
    imagePreview: null,
  }),

  created() {
    this.getHeaderImages();
  },
  mounted() {},
  methods: {
    ...mapMutations("EventPlannerVuex", ["setHeaderModal"]),
    closeModal() {
      this.setHeaderModal({ showModal: false });
    },
    getHeaderImages() {
      new EventPageHeaderImage().get().then((headerImages) => {
        // iterate through header images

        this.headerImages = headerImages;
      });
    },
    saveHeaderImage() {
      this.working = true;

      let _calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let editedEvent = new CalendarEvent({ id: this.event.id });

      editedEvent = this.event;
      editedEvent.eventPage.headerImage = this.selectedImage;

      this.closeModal();

      new CalendarEvent({
        id: editedEvent.id,
        eventPage: {
          id: editedEvent.eventPage.id,
          headerImage: this.selectedImage,
        },
      })
        .for(_calendar)
        .save()
        .then((response) => {
          this.working = false;
        })
        .catch((error) => {
          console.log(error);
          this.working = false;
        });
    },
    selectImage(selectedImage) {
      this.selectedImage = selectedImage;
    },
    previewImage(selectedImage) {
      this.imagePreview = selectedImage;
    },
    closePreviewModal() {
      this.imagePreview = null;
    },
  },
  computed: {
    ...mapState("EventPlannerVuex", ["editHeaderModal"]),
  },
};
</script>
<style lang="scss" scope>
.md-datepicker {
  .md-icon.md-date-icon {
    display: none;
    & ~ label {
      left: 0;
    }
  }
  input {
    margin-left: 0 !important;
  }
  &.md-field::before,
  &.md-field::after {
    width: 100%;
  }
}
.md-field > .md-icon ~ .md-input {
  margin: 0;
}
</style>
<style lang="scss">
.modal-z-index {
  z-index: 5;
}
.large-z-index {
  z-index: 6;
  position: relative;
}
.move-center {
  margin: 0 auto !important;
}
.move-left {
  margin-left: 0 !important;
  margin-right: auto !important;
}
.move-right {
  margin-right: 0 !important;
  margin-left: auto !important;
}
.text-center {
  text-align: center;
}
.d-flex {
  display: flex;
}
.items-center-v {
  align-items: center;
}
.items-center-g {
  justify-content: center;
}
.justify-beetwen {
  justify-content: space-between;
}
.md-field .md-error {
  text-align: left;
}
.swal2-container {
  z-index: 10000;
}
</style>
