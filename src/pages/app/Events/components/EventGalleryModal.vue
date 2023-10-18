<template>
  <div class="md-layout">
    <modal v-if="modalOpen" @close="noticeModalHide" class="gallery-modal">
      <template slot="header">
        <h4 class="modal-title">Image Gallery</h4>
        <md-button
          class="md-simple md-just-icon md-round modal-default-button"
          @click="noticeModalHide"
        >
          <md-icon>clear</md-icon>
        </md-button>
      </template>
      <template slot="body">
        <vue-element-loading :active="isModalLoading" spinner="ring" color="#FF547C" />

        <div class="header-image-wrapper">
          <div
            class="file-input order-2"
            v-for="(imageItem, index) in uploadedImages"
            :key="'image-'+index"
          >
            <div class="image-container" @click="openGallery(index)">
              <img :src="imageItem.src" />
            </div>
            <div class="button-container" v-if="removeImage">
              <md-button class="md-danger md-round" @click="removeImage(index, imageItem.id)">
                <i class="fa fa-times"></i>Remove
              </md-button>
            </div>
          </div>

          <div class="file-input order-1" v-if="removeImage">
            <div class="image-container">
              <img :src="regularImg" title />
            </div>

            <div class="button-container">
              <md-button class="md-success md-round md-fileinput">
                <template>Add image</template>
                <input type="file" @change="onFileChange($event)" />
              </md-button>
            </div>
          </div>
        </div>
        <LightBox :images="uploadedImages" ref="lightbox" :show-light-box="false"></LightBox>
      </template>
    </modal>
  </div>
</template>
<script>
import { Modal, ProductCard } from "@/components";
import CalendarEventImage from "@/models/CalendarEventImage";
import CalendarEvent from "@/models/CalendarEvent";
import Calendar from "@/models/Calendar";
import VueElementLoading from "vue-element-loading";
import LightBox from "vue-image-lightbox";

export default {
  name: "event-gallery-modal",
  components: {
    Modal,
    ProductCard,
    VueElementLoading,
    LightBox,
  },
  props: {
    uploadedImages: Array,
    onFileChange: Function,
    removeImage: Function,
    isModalLoading: Boolean,
  },
  data() {
    return {
      modalOpen: false,
      regularImg:
        "https://static-maryoku.s3.amazonaws.com/storage/img/image_placeholder.jpg",
    };
  },
  methods: {
    noticeModalHide: function () {
      this.modalOpen = false;
    },
    toggleModal(show) {
      this.modalOpen = show;
    },
    openGallery(index) {
      this.$refs.lightbox.showImage(index);
    },
  },
};
</script>
<style lang="scss">
@import "vue-image-lightbox/dist/vue-image-lightbox.min.css";

.gallery-modal {
  .header-image-wrapper {
    text-align: left;
    display: flex;
    align-items: flex-end;
    flex-flow: row wrap;
    max-height: 85vh;
    overflow: auto;

    .order-1 {
      order: 1;
    }
    .order-2 {
      order: 2;
    }
  }
}
</style>
