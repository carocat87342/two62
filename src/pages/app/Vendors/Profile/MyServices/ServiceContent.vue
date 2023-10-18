<template>
  <div class="service-content">
    <div class="service-header">
      <img class="service-image" :src="coverImage" />
      <md-button class="md-vendor md-maryoku btn-change-cover" @click="openFileBrowser">Change Image</md-button>
      <input type="file" @change="changeCoverImage" class="d-none" id="coverImageFile" />
    </div>
    <div class="p-50">
      <div class="font-size-16 font-bold d-flex justify-content-between align-center">
        <div>
          <img :src="`${$iconURL}Budget Elements/${serviceCategory.icon}`" class="page-icon mr-10" />
          About Our {{ serviceCategory.title }}
        </div>
        <md-button class="md-vendor maryoku-btn" @click="gotoEditingService">Edit Service</md-button>
      </div>
      <div class="mt-20 about-service">{{ vendorData.about.category }}</div>
    </div>
    <div class="pr-50 pl-50">
      <label>Attachments</label>
      <attachment-item
        v-for="attachment in attachments"
        :key="attachment.name"
        :attachment="attachment"
        :vendor="vendorData"
        theme="purple"
        class="attachment"
        @uploaded="setAttachment"
        @remove="removeAttachment"
      >
      </attachment-item>
    </div>
    <!-- <vendor-images-list :images="serviceData.images"></vendor-images-list> -->
    <vendor-photos-carousel
      class="service-photos mt-40"
      theme="purple"
      :images="images"
      @addImage="addServiceImage"
      @setPhoto="updateServiceImage"
      @removeImage="removeServiceImage"
    ></vendor-photos-carousel>
    <starting-fee-table class="mt-30" :items="startingFeeItems"></starting-fee-table>
    <extra-pay-table :serviceCategory="serviceData.vendorCategory" :items="extraPayItems"></extra-pay-table>
    <policy :serviceCategory="serviceData.vendorCategory" :serviceData="serviceData"></policy>
    <price-policy :serviceCategory="serviceData.vendorCategory" :serviceData="serviceData"></price-policy>
  </div>
</template>
<script>
import AttachmentItem from "../../components/AttachmentItem.vue";
import VendorImagesList from "../../components/VendorImagesList.vue";
import StartingFeeTable from "./StartingFeeTable.vue";
import ExtraPayTable from "./ExtraPayTable.vue";
import Policy from "./Policy.vue";
import PricePolicy from "./PricePolicy.vue";
import VendorPhotosCarousel from "../../components/VendorPhotosCarousel.vue";
import S3Service from "@/services/s3.service";
import { makeid } from "@/utils/helperFunction";
import { getBase64 } from "@/utils/file.util";
import Vendors from "@/models/Vendors";
import _ from "underscore";
export default {
  components: {
    StartingFeeTable,
    ExtraPayTable,
    Policy,
    PricePolicy,
    AttachmentItem,
    VendorImagesList,
    VendorPhotosCarousel,
  },
  props: {
    serviceCategory: {
      type: Object,
      default: () => {},
    },
  },
  computed: {

    vendorData() {
      return this.$store.state.vendor.profile;
    },
    serviceData() {
      if (this.serviceCategory.key === this.vendorData.vendorCategory) {
        return this.vendorData;
      } else {
        return this.vendorData.secondaryServices.find((service) => service.vendorCategory === this.serviceCategory.key);
      }
    },
    isMainService() {
      return this.serviceCategory.key === this.vendorData.vendorCategory;
    },
    startingFeeItems() {
      let startingFeeItems = [];
      console.log(this.serviceData.services);
      _.each(this.serviceData.services, (item) => {
        if (item.checked && item.hasOwnProperty("included") && item.included) {
          startingFeeItems.push(item);
        }
      });
      return startingFeeItems;
    },
    extraPayItems() {
      let extraPayItems = [];
      _.each(this.serviceData.services, (item) => {
        if (item.checked && item.hasOwnProperty("included") && !item.included) {
          item.value = Number(item.value);
          extraPayItems.push(item);
        }
      });
      return extraPayItems;
    },
    attachments() {
      if (this.serviceData.attachments && this.serviceData.attachments.length > 0) return this.serviceData.attachments;
      if (this.vendorData.eventCategory.legalDocuments) {
        return this.vendorData.eventCategory.legalDocuments.map((legal) => {
          return {
            name: legal,
            isRequired:
              this.vendorData.eventCategory.mandatoryLegalDocs &&
              this.vendorData.eventCategory.mandatoryLegalDocs.findIndex((item) => item === legal) >= 0,
            fileName: "",
          };
        });
      }
      return [];
    },
  },
  data() {
    return {
      images: [],
      coverImage: null,
    };
  },
  created() {
    this.images = [...this.serviceData.images];
    this.coverImage = this.serviceData.coverImage
  },
  methods: {
    setAttachment(attachment) {
      const defaultAttachments = this.attachments;
      const currentIndex = defaultAttachments.findIndex((a) => a.name === attachment.name);
      defaultAttachments[currentIndex] = attachment;
      let updateData = { attachments: defaultAttachments, id: this.vendorData.id };
      this.$store.dispatch("vendor/updateProfile", updateData);
    },
    removeAttachment(attachment) {
      const defaultAttachments = this.attachments;
      const currentIndex = defaultAttachments.findIndex((a) => a.name === attachment.name);
      defaultAttachments[currentIndex].fileName = "";
      defaultAttachments[currentIndex].url = "";
      let updateData = { attachments: defaultAttachments, id: this.vendorData.id };
      this.$store.dispatch("vendor/updateProfile", updateData);
    },
    gotoEditingService() {
      if (this.serviceCategory.key === this.vendorData.vendorCategory) {
        this.$router.push(`/vendor/edit/${this.vendorData.id}`);
      } else {
        this.$router.push(`/vendor/${this.vendorData.id}/service/edit/${this.serviceData.id}`);
      }
    },
    isAllImageUploaded: () => {
      return !this.images.some((img) => img.indexOf("base64") >= 0);
    },
    async addServiceImage(file) {
      const data = { vendorId: this.vendorData.id, file, images: this.images };
      if (!this.isMainService) {
        data["serviceId"] = this.serviceData.id;
      }
      this.$store.dispatch("vendor/addServiceImage", data).then((images) => {
        this.images = images;
      });

      const imageData = await getBase64(file);
      this.images.push(imageData);
    },
    async updateServiceImage({ index, photo }) {
      const data = { vendorId: this.vendorData.id, index, file: photo, images: this.images };
      if (!this.isMainService) {
        data["serviceId"] = this.serviceData.id;
      }
      this.$store.dispatch("vendor/updateServiceImage", data).then((images) => {
        this.images = images;
      });
      const imageData = await getBase64(photo);
      this.images.splice(index, 1, imageData);
    },
    removeServiceImage(index) {
      const data = { vendorId: this.vendorData.id, index, images: this.images };
      if (!this.isMainService) {
        data["serviceId"] = this.serviceData.id;
      }
      this.$store.dispatch("vendor/removeServiceImage", data).then((images) => {});

      // this.images.splice(index, 1);
    },
    openFileBrowser() {
      document.getElementById("coverImageFile").click();
    },
    async changeCoverImage(e) {
      const data = { vendorId: this.vendorData.id, file: e.target.files[0], images: this.images };
      if (!this.isMainService) {
        data["serviceId"] = this.serviceData.id;
      }
      this.$store.dispatch("vendor/updateCoverImage", data).then((images) => {});

      this.coverImage = await getBase64(e.target.files[0]);
    },
  },
};
</script>
<style lang="scss" scoped>
.service-content {
  overflow: hidden;
  .service-header {
    position: relative;
    .btn-change-cover {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .service-image {
    max-height: 360px;
    object-fit: cover;
    width: 100%;
  }
  .about-service {
    max-width: 650px;
  }
  .attachment:not(:last-child) {
    border-bottom: solid 2px #dbdbdb;
  }
  .service-photos {
    margin-left: -10px;
  }
}
</style>