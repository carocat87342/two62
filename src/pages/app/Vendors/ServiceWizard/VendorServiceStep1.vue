<template>
  <div class="vendor-basic-info-form-wrapper">
    <div class="md-layout inside-container">
      <div class="md-layout-item md-size-25 left-side">
        <img :src="`${iconUrl}step-1.svg`" />
        <h4>Hi,{{ vendor.companyName }}</h4>
        <p>Choose the category & upload photos to appear in your fussiness card & future proposals</p>
        <h2>0/4</h2>
        <h3>Only 5 simple steps & you're signed!</h3>
      </div>
      <div class="md-layout-item md-size-75 right-side">
        <h2>
          Before we begin,
          <br />What type of service would you like to sign?
        </h2>
        <div class="card">
          <label>Business Category</label>
          <category-selector
            :value="selectedCategoryName || ''"
            :categories="serviceCategories"
            column="2"
            trackBy="name"
            class="my-10"
            @change="updateCategory"
          ></category-selector>
          <div class="upload-wrapper mt-30">
            <div class="title-cont">
              <span><img :src="`${iconUrl}art (2).svg`" class="page-icon" /> Upload your best images</span>
              <span>(15 photos top, under 5MB)</span>
            </div>
            <div class="carousel">
              <vendor-photos-carousel
                class="service-photos"
                theme="purple"
                :images="service.images"
                @addImage="addVendorImage"
                @setPhoto="updateVendorImage"
                @removeImage="removeVendorImage"
              ></vendor-photos-carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import VSignupEditableField from "@/components/Inputs/VSignupEditableField.vue";
import VSignupCategorySelector from "@/components/Inputs/VSignupCategorySelector.vue";
import CategorySelector from "@/components/Inputs/CategorySelector";
import VendorPhotosCarousel from "../components/VendorPhotosCarousel.vue";
import { VendorCategories } from "@/constants/vendor";
import vue2Dropzone from "vue2-dropzone";

export default {
  name: "vendor-basic-info-form",
  components: {
    vueDropzone: vue2Dropzone,
    VueElementLoading,
    VSignupEditableField,
    VSignupCategorySelector,
    CategorySelector,
    VendorPhotosCarousel,
  },
  data() {
    return {
      iconUrl: `${this.$iconURL}Vendor Signup/`,
      secondUrl: `${this.$iconURL}VendorSignup/`,
    };
  },
  methods: {
    onUpdateFocus(newValue) {},
    saveValue({ field, value }) {
      // this.$root.$emit("update-vendor-value", field, value);
      this.$store.commit("vendorService/setField", { field, value });
    },
    updateCategory(category) {
      console.log(category);
      const categoryData = VendorCategories.find((item) => item.name == category);
      this.$store.commit("vendorService/setField", { field: "vendorCategory", value: categoryData.value });
    },
    addVendorImage(file) {
      this.$store.dispatch("vendorService/uploadImage", { index: this.service.images.length, file });
    },
    removeVendorImage(index) {
      this.$store.commit("vendorService/removeImage", index);
    },
    updateVendorImage({ index, photo }) {
      const fileId = `${new Date().getTime()}_${makeid()}`;
      S3Service.fileUpload(photo, fileId, "vendor/cover-images").then((uploadedName) => {
        console.log("createImage", uploadedName);
        this.$root.$emit("update-vendor-value", "images", {
          index,
          data: `${uploadedName}`,
        });
      });
    },
  },
  watch: {
    vendor(newVal) {},
  },
  computed: {
    serviceCategories() {
      return VendorCategories;
    },
    vendor() {
      return this.$store.state.vendorService.vendor;
    },
    service() {
      return this.$store.state.vendorService.service;
    },
    selectedCategoryName() {
      if (!this.service.vendorCategory) return "";
      return VendorCategories.find((item) => item.value === this.service.vendorCategory).name;
    },
  },
};
</script>
<style lang="scss" scoped>
.vendor-basic-info-form-wrapper {
  font-family: Manrope-Regular, sans-serif;
  .vendor-address-editor {
    input {
      font-size: 16px;
      font-family: "Manrope-Regular";
    }
  }
  .inside-container {
    display: flex;
    color: #050505;

    .left-side {
      img {
        width: 92.5px;
      }
      h4 {
        margin: 36px 0 11px 0;
        font: 800 20px Manrope-Regular, sans-serif;
      }
      p {
        margin: 0;
        padding: 0;
        font: normal 16px Manrope-Regular, sans-serif;
      }
      h2 {
        margin: 30px 0;
        font: 800 40px Manrope-Regular, sans-serif;
      }
      h3 {
        margin: 0;
        color: #641856;
        font: bold 20px Manrope-Regular, sans-serif;
      }
    }
    .right-side {
      h2 {
        margin: 0;
        margin-bottom: 40px;
        font: 800 40px Manrope-Regular, sans-serif;
      }
      .card {
        padding: 30px 60px 60px 60px;
        background-color: #ffffff;
        box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
        .action-cont {
          margin-top: 30px;
          text-align: right;
          a {
            cursor: pointer;
            padding: 8px 24px;
            &.cancel {
              color: #050505;
              font: 800 16px Manrope-Regular, sans-serif;
            }
            &.save {
              color: #ffffff;
              font: 800 16px Manrope-Regular, sans-serif;
              background-color: #f51355;
              &:hover {
                color: #ffffff !important;
              }
            }
          }
        }
      }
    }
  }

  .upload-wrapper {
    .carousel {
      margin: 20px -60px;

      .service-photos {
      }
    }
  }
}
</style>
