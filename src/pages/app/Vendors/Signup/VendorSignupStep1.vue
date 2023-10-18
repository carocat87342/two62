<template>
  <div class="vendor-signup-step1-wrapper">
    <div class="md-layout inside-container">
      <div class="md-layout-item md-size-25 left-side">
        <img :src="`${iconUrl}Group 5219 (2).svg`" />
        <h2>
          ABOUT YOUR
          <br />COMPANY
        </h2>
        <p>This your chance to Impress! All information will appear on your business page</p>
        <h2>1/5</h2>
      </div>
      <div class="md-layout-item md-size-75 right-side">
        <div class="about-wrapper">
          <div class="title-cont">
            <div class="left">
              <h5><img :src="`${iconUrl}Asset 542.svg`" /> Tell us about your business</h5>
            </div>
          </div>
          <div class="card">
            <div class="field mb-50">
              <div class="title-cont">
                <div class="top d-flex align-center">
                  <h5><img :src="`${iconUrl}Asset 542.svg`" /> Tell us about your business</h5>
                  <div class="position-relative" v-if="categoryDescriptions[vendor.vendorCategory]">
                    <div class="color-purple font-size-14 font-bold-extra ml-20 cursor-pointer" @click="showCompanyText=true">
                      <img :src="`${$iconURL}Vendor Signup/group-5280(1).svg`" /> Get an Idea</div>

                    <tooltip-notification
                            v-if="showCompanyText"
                            :about="getDescription('company')"
                            @copy='handleCopy($event, "company")'
                            @cancel="showCompanyText = false"
                    ></tooltip-notification>
                  </div>

                </div>
                <div class="bottom">
                  <p>Include history & background</p>
                </div>
              </div>
              <div class="main-cont">
                <textarea
                  placeholder="Type 'about your business' here"
                  rows="5"
                  @blur="updateVendor($event, 'about.company')"
                  v-model="vendor.about.company"
                ></textarea>
              </div>
            </div>
            <div class="field mb-50">
              <div class="title-cont">
                <div class="top d-flex align-center">
                  <h5>
                    <img :src="`${getCategoryIconbyValue(vendor.vendorCategory)}`" style="width: 32px"/>
                    about your {{ getCategoryNameByValue(vendor.vendorCategories[0]) }}
                  </h5>
                  <div class="position-relative" v-if="categoryDescriptions[vendor.vendorCategory]">
                    <div class="color-purple font-size-14 font-bold-extra ml-20 cursor-pointer" @click="showServiceText=true">
                      <img :src="`${$iconURL}Vendor Signup/group-5280(1).svg`" /> Get an Idea</div>

                    <tooltip-notification
                            v-if="showServiceText"
                            :about="getDescription('service')"
                            @copy='handleCopy($event, "category")'
                            @cancel="showServiceText = false"
                    ></tooltip-notification>
                  </div>
                </div>
                <div class="bottom">
                  <p>Tell us why your service is the best choice, what makes it special</p>
                </div>
              </div>
              <div class="main-cont">
                <textarea
                  :placeholder="`Type 'About your ${getCategoryNameByValue(vendor.vendorCategories[0])}' here`"
                  rows="5"
                  @blur="updateVendor($event, 'about.category')"
                  v-model="vendor.about.category"
                />
              </div>
            </div>
            <div class="field mb-50">
              <label>Company Services</label>
              <company-service-selector
                :options="companyServices.filter((cs) => cs.name == vendor.vendorCategories[0])[0]"
                :defaultValue="vendor.companyServices"
                @change="updateCompanyServices"
                class="mt-10"
              ></company-service-selector>
            </div>
            <div class="field mb-50">
              <div class="title-cont">
                <div class="top">
                  <h5><img :src="`${iconUrl}Asset 545.svg`" /> capacity</h5>
                </div>
                <div class="bottom">
                  <p>How many guests can you acommodate?</p>
                </div>
              </div>
              <div class="main-cont">
                <div class="suffix">
                  <input
                    type="number"
                    placeholder="100"
                    v-model="vendor.capacity.low"
                    min="100"
                    max="1000"
                    @change="updateVendor($event, 'capacity.low')"
                  />
                </div>
                <div class="arrow">
                  <img :src="`${iconUrl}Group 4585 (2).svg`" />
                </div>
                <div class="suffix">
                  <input
                    type="number"
                    placeholder="1000"
                    v-model="vendor.capacity.high"
                    min="100"
                    max="1000"
                    @change="updateVendor($event, 'capacity.high')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="my-30">
          <div class="title-cont d-flex align-center mb-20">
            <h5 class="my-0">
              <img class="mr-10" :src="`${iconUrl}Asset 542.svg`" width="30" /> Add a Personal message to your clients
            </h5>
            <p class="my-0 pl-20">This paragraph will be added automatically to your proposals</p>
          </div>
          <div class="card">
            <div class="field">
              <div class=" d-flex align-center">
                <h5 class="my-0 pb-10">DEAR PLANNER...</h5>
                <div class="position-relative" v-if="categoryDescriptions[vendor.vendorCategory]">
                  <div class="color-purple font-size-14 font-bold-extra ml-20 pb-10 cursor-pointer" @click="showPersonalMessage=true">
                    <img :src="`${$iconURL}Vendor Signup/group-5280(1).svg`" class="mr-10"/> Get an Idea</div>

                  <tooltip-notification
                          v-if="showPersonalMessage"
                          :about="getDescription('personal')"
                          @copy='handleCopy($event, "personalMessage")'
                          @cancel="showPersonalMessage = false"
                  ></tooltip-notification>
                </div>
              </div>
              <textarea
                placeholder="Type 'about your personal message' here"
                class="width-100"
                rows="5"
                @blur="updateVendor($event, 'personalMessage')"
                v-model="vendor.personalMessage"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="upload-wrapper">
          <div class="title-cont">
            <div class="left">
              <h5><img :src="`${iconUrl}art (2).svg`" /> Upload your best images</h5>
            </div>
            <div class="right">
              <p>(15 photos top, under 5MB)</p>
            </div>
          </div>
          <div class="white-card pt-60 pb-60">
            <vendor-photos-carousel
              :images="vendor.images"
              @addImage="addVendorImage"
              @setPhoto="updateVendorImage"
              @removeImage="removeVendorImage"
            ></vendor-photos-carousel>
          </div>
        </div>
        <div class="signature-wrapper mt-40">
          <div class="title-cont">
            <div class="top">
              <h5>add signature</h5>
            </div>
            <div class="bottom">
              <p>We just need your signature and that's it</p>
            </div>
          </div>
          <template v-if="vendor.signature == null">
            <div class="card red-border">
              <div class="upload-cont">
                <a class @click="uploadVendorSignature"> <img :src="`${iconUrl}Asset 559.svg`" /> Choose File </a>
                <div class="or">Or</div>
                <div class="sign-here">
                  <vueSignature ref="signature" :sigOption="option" :w="'100%'" :h="'100%'" />
                  <button class="save" @click="save">Save</button>
                  <button class="clear" @click="clear">Clear</button>
                </div>
                <input
                  type="file"
                  class="hide"
                  ref="signatureFile"
                  name="vendorSignature"
                  accept="image/gif, image/jpg, image/png"
                  @change="onVendorImageFilePicked"
                />
              </div>
            </div>
          </template>
          <template v-else>
            <div
              class
              :style="`
                background-image: url(${vendor.signature});width: 100%;
                background-position: center;
                background-repeat: no-repeat;
                height: 162px;
                background-size: contain;
              `"
            />
            <!-- <img :src="vendor.signature"/> -->
            <img
              class="remove"
              :src="`${iconUrl}Asset 529.svg`"
              v-if="vendor.signature"
              @click="removeSignature(vendor.signature)"
            />
          </template>
        </div>
        <div class="social-wrapper">
          <div class="title-cont">
            <div class="top">
              <h5>Online Presence</h5>
              <!-- <p>suggested</p> -->
            </div>
            <div class="bottom">
              <p>*Customers tend to better trust brands after viewing them online</p>
            </div>
          </div>
          <div class="card">
            <div class="field">
              <div class="label">
                <img :src="`${iconUrl}Asset 539.svg`" />
                <span>website</span>
              </div>
              <input
                type="text"
                placeholder="Paste link here"
                @change="updateVendor($event, 'social.website')"
                v-model="vendor.social.website"
              />
            </div>
            <div class="field">
              <div class="label">
                <img :src="`${iconUrl}Asset 540.svg`" class="w-16" />
                <span>facebook</span>
              </div>
              <input
                type="text"
                placeholder="Paste link here"
                @change="updateVendor($event, 'social.facebook')"
                v-model="vendor.social.facebook"
              />
            </div>
            <div class="field">
              <div class="label">
                <img :src="`${iconUrl}Group 4569 (2).svg`" />
                <span>instagram</span>
              </div>
              <input
                type="text"
                placeholder="Paste link here"
                @change="updateVendor($event, 'social.instagram')"
                v-model="vendor.social.instagram"
              />
            </div>
            <h5>Other:</h5>
            <div class="social-item" v-for="(s, sIndex) in defSocialMedia" :key="sIndex">
              <div @click="updateSocialMedia(s)">
                <img :src="`${iconUrl}Group 6258.svg`" v-if="socialMedia.includes(s) || vendor.social[s]" />
                <img :src="`${iconUrl}Rectangle 1245.svg`" v-else />
                {{ s }}
                <br />
              </div>
              <input
                type="text"
                placeholder="Paste link here"
                v-model="vendor.social[s]"
                v-if="socialMedia.includes(s) || vendor.social[s]"
                @change="updateVendor($event, `social.${s}`)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import { Drop } from "vue-drag-drop";
import { VendorCategories, categoryDescriptions } from "@/constants/vendor";

//COMPONENTS
import VendorServiceItem from "../components/VendorServiceItem.vue";
import VendorCheckbox from "../components/VendorCheckbox.vue";
import vueSignature from "vue-signature";
import S3Service from "@/services/s3.service";
import { makeid } from "@/utils/helperFunction";
import VendorPhotosCarousel from "../components/VendorPhotosCarousel.vue";
import CompanyServiceSelector from "../components/CompanyServiceSelector.vue";
import { TooltipNotification } from "@/components"
export default {
  name: "vendor-signup-step1",
  components: {
    Drop,
    VueElementLoading,
    VendorCheckbox,
    VendorServiceItem,
    vueSignature,
    VendorPhotosCarousel,
    CompanyServiceSelector,
    TooltipNotification,
  },
  props: {
    categories: Array,
    generalInfos: Array,
    companyServices: Array,
  },
  data() {
    return {
      iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/Vendor Signup/",
      socialMedia: [],
      defSocialMedia: ["youtube", "linkedin", "google", "pinterest", "foursquare", "reddit", "tiktok"],
      reg: /^(ftp|http|https):\/\/[^ "]+$/,
      min: Number,
      max: Number,
      categoryNames: VendorCategories,
      categoryDescriptions: categoryDescriptions,
      isDragOver: false,
      option: {
        penColor: "rgb(0, 0, 0)",
        backgroundColor: "rgb(255,255,255)",
      },
      showCompanyText: false,
      showServiceText: false,
      showPersonalMessage: false,
    };
  },
  methods: {
    handleDrop(data, event) {
      event.preventDefault();
      const files = event.dataTransfer.files;

      // validate upload files
      for (let i = 0; i < files.length; i++) {
        let message = null;
        if (files[i].type !== "image/jpeg" && files[i].type !== "image/png" && files[i].type !== "image/gif") {
          message = "Please update a image (.png, .jpeg, .gif) file!";
        }

        if (files[i].size > 5 * 1024 * 1024) {
          message = "You've Uploaded an Image that Exceed the allowed size, try small one!";
        }

        if (message) {
          console.log(message, files);
          this.$notify({
            message,
            horizontalAlign: "center",
            verticalAlign: "top",
            icon: "warning",
          });
          this.isDragOver = false;
          return;
        }
      }
      this.createImage(files[0]);
      this.isDragOver = false;
    },
    handleDragEnter(e) {
      this.isDragOver = true;
    },
    handleDragLeave(e) {
      this.isDragOver = false;
    },
    updateSocialMedia(item) {
      if (this.socialMedia.includes(item)) {
        this.socialMedia = this.socialMedia.filter((s) => s != item);
      } else {
        this.socialMedia.push(item);
      }
    },
    uploadVendorImage(imageId = null, attachmentType = null) {
      this.$refs.imageFile.click();
    },
    updateCompanyServices(services) {
      this.$root.$emit("update-vendor-value", "companyServices", services);
    },
    uploadVendorSignature(imageId = null, attachmentType = null) {
      this.$refs.signatureFile.click();
    },
    onVendorImageFilePicked(event) {
      let file = event.target.files || event.dataTransfer.files;

      if (!file.length) {
        return;
      }
      if (file[0].size <= 5 * 1024 * 1024) {
        // 5mb
        if (event.target.name == "vendorSignature") {
          this.createImage(file[0], "vendorSignature");
        } else {
          this.createImage(file[0]);
        }
      } else {
        this.$notify({
          message: "You've Uploaded an Image that Exceed the allowed size, try small one!",
          horizontalAlign: "center",
          verticalAlign: "top",
          icon: "warning",
        });
      }
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

    createImage(file, type) {
      let reader = new FileReader();
      let vm = this;

      this.isLoading = true;

      reader.onload = (e) => {
        if (type == "vendorSignature") {
          const fileId = `${new Date().getTime()}_${makeid()}`;
          S3Service.fileUpload(file, fileId, "vendor/signatures").then((uploadedName) => {
            this.$root.$emit(
              "update-vendor-value",
              "signature",
              `${uploadedName}`,
            );
          });
          this.$root.$emit("update-vendor-value", "signature", e.target.result);
        } else {
          const fileId = `${new Date().getTime()}_${makeid()}`;
          const currentIndex = this.vendor.images.length;
          S3Service.fileUpload(file, fileId, "vendor/cover-images").then((uploadedName) => {
            console.log("createImage", uploadedName);
            this.$root.$emit("update-vendor-value", "images", {
              index: currentIndex,
              data: `${uploadedName}`,
            });
          });
          this.$root.$emit("update-vendor-value", "images", {
            index: currentIndex,
            data: e.target.result,
          });
        }
      };
      reader.readAsDataURL(file);
    },
    removeVendorImage(image) {
      console.log("removeVendorImage", image);
      this.$root.$emit("update-vendor-value", "removeImage", image);
    },
    getCategoryNameByValue(value) {
      return this.categoryNames.filter((c) => c.value == value)[0].name;
    },
    getCategoryIconbyValue(value){
      return VendorCategories.find(it => it.value === value).icon;
    },
    updateVendor(event, fieldName) {
      // this.$root.$emit("update-vendor-value", fieldName, event.target.value);
      this.$store.commit("vendorSignup/setField", { field: fieldName, value: event.target.value });
    },
    getDescription(field){
        return this.categoryDescriptions[this.vendor.vendorCategory][field].map(desc => desc.replace('company_name', this.vendor.companyName));
    },
    handleCopy(value, field) {
      this.showCompanyText = false;
      this.showServiceText = false;
      this.showPersonalMessage = false;
      let vendor = JSON.parse(JSON.stringify(this.vendor));
      if ( field === 'company' ) this.$set(vendor.about, field, value);
      if ( field === 'category' ) this.$set(vendor.about, field, value);
      if ( field === 'personalMessage' ) this.$set(vendor, field, value);
      this.$store.commit("vendorSignup/setVendor", vendor);
    },
    save() {
      let _this = this;
      // let png = _this.$refs.signature.save()
      let jpeg = _this.$refs.signature.save("image/jpeg");
      // let svg = _this.$refs.signature.save('image/svg+xml')
      this.$root.$emit("update-vendor-value", "signature", jpeg);
      // console.log(this.vendor);
    },
    clear() {
      let _this = this;
      _this.$refs.signature.clear();
    },
    removeSignature() {
      this.$root.$emit("update-vendor-value", "signature", null);
    },
    addVendorImage(file) {
      this.$store.dispatch("vendorSignup/uploadImage", { index: this.vendor.images.length, file });
    },
    removeVendorImage(index) {
      this.$store.commit("vendorSignup/removeImage", index);
    },
  },
  computed: {
    vendor() {
      return this.$store.state.vendorSignup.vendor;
    },
  },
  filters: {},
  created() {
    console.log('step2.created');
    this.$store.dispatch("vendorSignup/checkImages");
    // refactoring vendor data in vuex
    const vendorData = Object.assign({}, this.vendor);
    try {
      const companyServices = vendorData.services.companyServices;
      if (companyServices) {
        this.$set(vendorData, "companyServices", companyServices.value);
      }
      delete vendorData.services.companyServices;
      delete vendorData.services.companySerivces;
    } catch (e) {}
    this.$store.commit("vendorSignup/setVendor", vendorData);
  },
};
</script>
<style lang="scss" scoped>
.vendor-signup-step1-wrapper {
  font-family: Manrope-Regular, sans-serif;

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
        color: #f51355;
        font: bold 20px Manrope-Regular, sans-serif;
      }
    }
    .right-side {
      flex: 3;

      .card {
        font-family: Manrope-Regular, sans-serif;
        color: #050505;
        background: #ffffff;
        -webkit-box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
        box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
        padding: 60px;
        margin-bottom: 2rem;

        .field {
          font: 800 16px Manrope-Regular, sans-serif;
          margin: 0 0 2rem 0;
          .label {
            margin-bottom: 0.5rem;
            img {
              width: 24px;
              margin-right: 0.5rem;
            }
            span {
              text-transform: capitalize;
            }
          }
          input {
            font-size: 16px;
            padding: 12px 20px;
            min-width: 75%;
            // border: 1px solid #707070;
            // border-radius: 0;
          }
          .main-cont {
            display: flex;
            align-items: center;

            .suffix {
              flex: 2;
              input {
                padding-left: 45%;
                width: 100%;
              }
              &:before {
                position: absolute;
                margin-top: 12px;
                margin-left: 1.5rem;
              }
              &:first-child {
                &:before {
                  content: "Min";
                }
              }
              &:last-child {
                &:before {
                  content: "Max";
                }
              }
            }
            .arrow {
              flex: 1;
              text-align: center;
              img {
                width: 3rem;
              }
            }
          }
        }
        .social-item {
          cursor: pointer;
          font: normal 16px Manrope-Regular, sans-serif;
          text-transform: capitalize;
          margin-bottom: 2rem;

          img {
            width: 27px;
            height: 27px;
            margin-right: 1rem;
          }
          input {
            margin: 1rem 0 0 3rem;
            font-size: 16px;
            // padding: 22px 30px;
            min-width: calc(75% - 3rem);
            // border: 1px solid #707070;
            // border-radius: 0;
          }
        }
        h5 {
          font: 800 16px Manrope-Regular, sans-serif;
        }
        &.red-border {
          border: 2px dashed #f51355;

          .upload-cont {
            text-align: center;
            a {
              display: inline-block;
              font: 800 14px Manrope-Regular, sans-serif;
              border: 1px solid #f51355;
              padding: 0.5rem;
              color: #f51355;
              cursor: pointer;
              margin-bottom: 0.5rem;

              img {
                width: 10px;
                margin-right: 0.5rem;
              }
            }
            span {
              color: #818080;
              font: normal 16px Manrope-Regular, sans-serif;
            }
            .sign-here {
              margin-top: 1rem;
              border: 1.5px dashed #f51355;
              font: normal 50px Manrope-Regular, sans-serif;
              color: #d5d5d5;
            }
          }
        }

        &.drag-over {
          border: 2px dotted #f51355;
          min-height: 210px;

          .drop-cont {
            color: #cfcfcf;
            font-weight: bold;
          }
        }
      }
    }
  }
  .title-cont {
    text-transform: capitalize;
    img {
      width: 24px;
      margin-right: 0.5rem;
    }
    h5 {
      font: 800 16px Manrope-Regular, sans-serif;
      margin: 0;
    }
    p {
      margin: 0;
      font: normal 14px Manrope-Regular, sans-serif;
    }
    .left,
    .right {
      margin: 0;
      display: inline-block;
    }
    .left {
      margin: 0 1rem 2rem 0;
    }
    .top,
    .bottom {
      margin-bottom: 0.5rem;
    }
  }
  .w-16 {
    width: 16px !important;
  }
  .mb-50 {
    margin-bottom: 3rem !important;
  }
  .images-wrapper {
    margin: 0 0 20px 0;
    width: 100%;
    height: 400px;
    display: grid;
    grid-template-columns: repeat(4, 25%);
    grid-template-rows: repeat(2, 200px);
    justify-content: center;
    align-content: end;

    .box {
      margin: 1rem;
      position: relative;
    }

    .item2 {
      .trash {
        cursor: pointer;
        position: absolute;
        right: 1rem;
        bottom: 1rem;
        background-color: white;
        border-radius: 50%;
        padding: 8px 12px;
      }
      img {
        width: 20px;
      }
    }

    .item {
      .trash {
        cursor: pointer;
        position: absolute;
        right: 0.5rem;
        bottom: 0.5rem;
        background-color: white;
        border-radius: 50%;
        padding: 4px 8px;
      }
      img {
        width: 18px;
      }
    }

    .no-image {
      border: dashed 1px #f51355;
      background-color: #ffffff;
    }

    .item2 {
      grid-column: 1 / 3;
      grid-row: 1 / 4;
    }
    .add-more {
      text-align: center;
      padding: 3rem;
      border: dashed 1px #f51355;
      background-color: #ffffff;
      cursor: pointer;
      font: normal 15px Manrope-Regular, sans-serif;
      img {
        width: 28px;
        position: unset;
        padding-bottom: 10px;
      }

      .drop-cont {
        font-weight: bold;
        color: #cfcfcf;
      }

      &.drag-over {
        border: 2px dotted #f51355;
      }
    }
  }
  .signature-wrapper {
    padding-bottom: 2rem;
    position: relative;

    .upload-cont {
      .sign-here {
        .save,
        .clear {
          background-color: #ffffff;
          font: 800 14px Manrope-Regular, sans-serif;
          border: 1px solid #f51355;
          padding: 0.5rem;
          color: #f51355;
          cursor: pointer;
          margin-bottom: 0.5rem;
        }
      }
    }

    img {
      width: 100%;
      max-height: 162px;

      &.remove {
        width: 18px;
        cursor: pointer;
        position: absolute;
        right: 2rem;
        bottom: 3rem;
      }
    }
  }
  textarea {
    resize: none;
    width: 75%;
    padding: 1.5rem 2rem;
    font-size: 16px;
  }
  .hide {
    display: none !important;
  }
  .red-border {
    border: 1px solid #f51355 !important;
  }
}
</style>
