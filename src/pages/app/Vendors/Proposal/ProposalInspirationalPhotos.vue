<template>
  <div class="proposal-inpirational-photos">
    <carousel :items="3" :margin="20" :dots="false" :nav="false" class="photos-carousel" :number="3">
      <template slot="prev">
        <md-button class="md-simple md-black handle-btn prev-btn md-icon-button edit-btn">
          <md-icon class="font-bold">keyboard_arrow_left</md-icon>
        </md-button>
      </template>
      <proposal-inspirational-photos-item
        class="photo-item"
        v-for="(photo, index) in inspirationalPhotos"
        :key="`photo-${index}`"
        :index="index"
        :defaultPhoto="photo"
        @change="setPhoto(index, ...arguments)"
        @addCaption="addCaption(index, ...arguments)"
      >
      </proposal-inspirational-photos-item>
      <template slot="next">
        <md-button class="md-simple md-black handle-btn next-btn md-icon-button edit-btn">
          <md-icon class="font-bold">keyboard_arrow_right</md-icon>
        </md-button>
      </template>
    </carousel>
    <modal class="add-caption-modal" v-if="captionModal.isOpen">
      <template slot="header">
        <div class="maryoku-modal-header">
          <h2>Add caption</h2>
        </div>
        <md-button class="md-simple md-just-icon md-round modal-default-button" @click="captionModal.isOpen = false">
          <md-icon>clear</md-icon>
        </md-button>
      </template>
      <template slot="body">
        <div class="md-layout">
          <div class="md-layout-item md-size-60">
            <img :src="captionModal.photoUrl" />
          </div>
          <div class="md-layout-item md-size-40" style="text-align: left; padding-right: 0px; padding-left: 20px">
            <div class="font-bold">Add caption</div>
            <textarea
              v-model="captionModal.caption"
              placeholder="Write a brief description of the photo."
              rows="6"
            ></textarea>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div>
          <md-button class="md-simple md-black maryoku-btn" @click="captionModal.isOpen = false">Cancel</md-button>
          <md-button class="md-vendor maryoku-btn" @click="saveCaption">Save</md-button>
        </div>
      </template>
    </modal>
  </div>
</template>
<script>
import { Modal, MaryokuInput, LocationInput } from "@/components";
import carousel from "vue-owl-carousel";
import S3Service from "@/services/s3.service";
import ProposalInspirationalPhotosItem from "./ProposalInspirationalPhotosItem.vue";
export default {
  components: {
    carousel,
    ProposalInspirationalPhotosItem,
    Modal,
  },
  data() {
    return {
      photos: new Array(15),
      currentPhotoIndex: -1,
      captionModal: {
        isOpen: false,
        photoUrl: "",
        caption: "",
        currentIndex: -1,
      },
    };
  },
  computed: {
    proposalRequest() {
      return this.$store.state.vendorProposal.proposalRequest;
    },
    inspirationalPhotos: {
      get() {
        return this.$store.state.vendorProposal.inspirationalPhotos;
      },
      set(value) {
        this.$store.commit("vendorProposal/setValue", { key: "inspirationalPhotos", value });
      },
    },
  },
  methods: {
    setPhoto(index, photoData) {
      this.inspirationalPhotos[index] = photoData;
      this.$store.commit("vendorProposal/setInspirationalPhoto", { index, photo: photoData });
    },
    addCaption(index, photoData) {
      this.captionModal.isOpen = true;
      this.captionModal.photoUrl = photoData.url;
      this.captionModal.caption = photoData.caption;
      this.captionModal.currentIndex = index;
    },
    saveCaption() {
      this.$root.$emit("saveCaption", this.captionModal);
      this.$store.commit("vendorProposal/setInspirationalPhoto", {
        index: this.captionModal.currentIndex,
        photo: {
          url: this.captionModal.photoUrl,
          caption: this.captionModal.caption,
        },
      });
      this.captionModal.isOpen = false;
    },
  },
  watch: {
    inspirationalPhotos(newVal){console.log('inspirationalPhotos', newVal);}
  },
};
</script>
<style lang="scss" scoped>
.proposal-inpirational-photos {
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  position: relative;
  .handle-btn {
    background-color: white !important;
    height: 25px;
    width: 25px;
    border-radius: 50%;
    position: absolute;
    top: 120px;
    transform: translateY(-50%);
    &.next-btn {
      right: 1px;
    }
    &.prev-btn {
      left: 1px;
    }
  }
  /deep/ .modal-container {
    max-width: 1200px !important;
  }
}
</style>
