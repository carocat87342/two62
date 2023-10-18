<template>
  <div class="photo-inpirational-item">
    <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" />
    <div v-if="!photo" class="empty-item">
      <label class="photo-add-label color-vendor font-bold" @click="handleAddPhoto(index)">
        <md-icon class="color-vendor">add</md-icon>
        <br />
        Add photo
      </label>
    </div>
    <template v-else>
      <div class="active-item">
        <img class="photo-image" :src="photo.url" @click="handleAddPhoto(index)" />
        <md-button class="remove-btn md-icon-button md-raised" @click="removePhoto">
          <img :src="`${$iconURL}common/trash-dark.svg`" style="width: 20px" />
        </md-button>
      </div>
      <div class="photo-caption" v-if="photo.caption">
        {{ photo.caption }}&nbsp;&nbsp;
        <md-button class="edit-btn md-black md-simple" @click="addCaption">
          <u>Edit</u>
        </md-button>
      </div>
      <div class="photo-caption" v-else>
        <md-button class="md-simple edit-btn md-black" @click="addCaption"><u>Add caption</u></md-button>
      </div>
    </template>
    <input
      style="display: none"
      :id="`proposal-inspiration-file-${index}`"
      name="attachment"
      type="file"
      multiple="multiple"
      @change="onFileChange"
    />
  </div>
</template>
<script>
import carousel from "vue-owl-carousel";
import { getBase64 } from "@/utils/file.util";
import Swal from "sweetalert2";
export default {
  components: {
    carousel,
  },
  props: {
    defaultPhoto: {
      type: Object,
      default: () => null,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      photo: null,
      isLoading: false,
    };
  },
  created() {
    this.photo = this.defaultPhoto;
    this.$root.$on("saveCaption", (captionData) => {
      if (this.index == captionData.currentIndex) {
        if (!this.photo) this.photo = {};
        this.$set(this.photo, "caption", captionData.caption);
      }
    });
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
    async onFileChange(event) {
      if (!event.target.files[0]) return;
      console.log(event.target.files[0].size);
      if (event.target.files[0].size > 1024 * 1024 * 5) {
        Swal.fire({
          title: `The size of file that you selected is ${Math.floor(
            event.target.files[0].size / 1024 / 1024,
          )}MB. This file should be under 5MB`,
          showCancelButton: false,
          confirmButtonClass: "md-button md-vendor",
          cancelButtonClass: "md-button md-danger",
          confirmButtonText: "I got it",
          buttonsStyling: false,
        }).then((result) => {
          if (result.value) {
          }
        });
        return;
      }
      const extension = event.target.files[0].type.split("/")[1];
      if (!this.photo) this.photo = {};
      const photoData = await getBase64(event.target.files[0]);
      this.$set(this.photo, "url", photoData);
      this.$root.$emit("update-inspirational-photo", {
        file: event.target.files[0],
        index: this.index,
        link: `proposal/inspirationalPhotos/${this.proposalRequest.id}`,
        fileName: `photo-${timeStamp}`,
      });
    },
    handleAddPhoto() {
      document.getElementById(`proposal-inspiration-file-${this.index}`).click();
    },
    addCaption() {
      this.$emit("addCaption", this.photo);
    },
    removePhoto() {
      this.photo = null;
      this.$root.$emit("remove-inspirational-photo", this.index);
    },
  },
  watch:{
    defaultPhoto(newVal){console.log('defaultPhoto', newVal); this.photo = newVal;}
  }
};
</script>
<style lang="scss" scoped>
.photo-inpirational-item {
  width: 100%;
  min-height: 250px;
  display: inline-block;
  overflow: hidden;
  .empty-item {
    border: dashed #641856 1px;
    width: 100%;
    height: 220px;
    position: relative;
  }
  .active-item {
    width: 100%;
    height: 220px;
    .remove-btn {
      background-color: white !important;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      position: absolute;
      right: 15px;
      top: 15px;
    }
    .photo-image {
      height: 100%;
      width: 100%;
      object-fit: cover;
      border-radius: 3px;
      cursor: pointer;
    }
  }
  .photo-caption {
    margin-top: 10px;
    white-space: normal;
  }

  .photo-add-label {
    cursor: pointer;
    text-align: center;
    display: inline-block;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
