<template>
  <div class="vendor-details">
    <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" />
    <div class="md-layout">
      <div class="md-layout-item image-list-container no-padding">
        <div
          class="img-cont big-img-cont"
          :style="`
            background-image: url(${bgImages[0]});
            background-size: cover;
            background-size: 100% 100%;`"
        ></div>
        <div class="img-cont thumb-img-cont">
          <img :src="bgImages[1]" />
          <img :src="bgImages[2]" />
          <img :src="bgImages[3]" />
          <img :src="bgImages[4]" />
        </div>
        <md-button class="md-default btn-photos" @click="view()">
          <md-icon>photo</md-icon>
          <span v-if="getGalleryImages.length > 0">view photos</span>
          <span v-else>no vendor image</span>
        </md-button>
        <LightBox
          v-if="getGalleryImages.length > 0"
          :images="getGalleryImages"
          ref="lightbox"
          :show-light-box="false"
        ></LightBox>
      </div>
    </div>
    <div class="md-layout bg-white">
      <div class="md-layout-item">
        <div class="title-cont">
          <div class="title-child">
            <img v-if="isVendorLogo" :src="isVendorLogo" />
            <div v-else class="default-text-logo">{{ logoText }}</div>
          </div>
          <div class="title-child mt-4">
            <div class="md-layout-item">
              <md-field
                :class="[
                  { 'md-valid': !errors.has('vendorDisplayName') && vendor.vendorDisplayName },
                  { 'md-error': errors.has('vendorDisplayName') },
                ]"
              >
                <label>Display Name</label>
                <md-input
                  v-model="vendor.vendorDisplayName"
                  required
                  data-vv-name="vendorDisplayName"
                  name="vendorDisplayName"
                  v-validate="modelValidations.vendorDisplayName"
                />
                <slide-y-down-transition>
                  <md-icon class="error" v-show="errors.has('vendorDisplayName')">close</md-icon>
                </slide-y-down-transition>
                <slide-y-down-transition>
                  <md-icon class="success" v-show="!errors.has('vendorDisplayName') && vendor.vendorDisplayName"
                    >done</md-icon
                  >
                </slide-y-down-transition>
              </md-field>
            </div>
          </div>
          <div class="title-child mt-4">
            <div class="md-layout-item">
              <md-field
                :class="[
                  { 'md-valid': !errors.has('vendorDisplayName') && vendor.vendorDisplayName },
                  { 'md-error': errors.has('vendorDisplayName') },
                ]"
              >
                <label> <i class="fa fa-map-marker-alt"></i> Address </label>
                <md-input v-model="vendor.vendorAddressLine1"></md-input>
                <slide-y-down-transition>
                  <md-icon class="error" v-show="errors.has('vendorAddressLine1')">close</md-icon>
                </slide-y-down-transition>
                <slide-y-down-transition>
                  <md-icon class="success" v-show="!errors.has('vendorAddressLine1') && vendor.vendorAddressLine1"
                    >done</md-icon
                  >
                </slide-y-down-transition>
              </md-field>
            </div>
          </div>
          <div class="title-child mt-4">
            <div class="md-layout-item">
              <md-field class="auto-width">
                <label>Avg Score</label>
                <md-input v-model="vendor.avgScore" type="number" min="0" @keyup="validateScore()"></md-input>
              </md-field>
            </div>
          </div>
        </div>
      </div>
      <div class="md-layout-item button-group text-right">
        <div class="title-child mt-2">
          <div class="md-layout-item">
            <label>Rating</label>
            <label
              class="star-rating__star"
              v-for="(rating, ratingIndex) in ratings"
              :key="ratingIndex"
              @click="setRating(ratingIndex)"
              :class="{ 'is-selected': vendor.rank >= rating && vendor.rank != null }"
              >★</label
            >
            <md-button v-if="creation_mode" class="md-purple md-lg md-save" @click="addVendor">Create</md-button>
            <md-button v-else class="md-purple md-lg md-save" @click="updateVendor">Save</md-button>
          </div>
        </div>
      </div>
    </div>
    <div class="md-layout bg-white">
      <div class="md-layout-item display-flex">
        <div class="md-layout-item">
          <md-field
            :class="[
              { 'md-valid': !errors.has('vendorMainEmail') && vendor.vendorMainEmail },
              { 'md-error': errors.has('vendorMainEmail') },
            ]"
          >
            <label>Email</label>
            <md-input
              v-model="vendor.vendorMainEmail"
              type="email"
              required
              data-vv-name="vendorMainEmail"
              name="vendorMainEmail"
              v-validate="modelValidations.vendorMainEmail"
            />
            <slide-y-down-transition>
              <md-icon class="error" v-show="errors.has('vendorMainEmail')">close</md-icon>
            </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon class="success" v-show="!errors.has('vendorMainEmail') && vendor.vendorMainEmail">done</md-icon>
            </slide-y-down-transition>
          </md-field>
        </div>
        <div class="md-layout-item">
          <md-field
            :class="[
              { 'md-valid': !errors.has('vendorMainPhoneNumber') && vendor.vendorMainPhoneNumber },
              { 'md-error': errors.has('vendorMainPhoneNumber') },
            ]"
          >
            <label>Phone Number</label>
            <md-input
              v-model="vendor.vendorMainPhoneNumber"
              type="text"
              @keydown="onlyNumber"
              required
              data-vv-name="vendorMainPhoneNumber"
              name="vendorMainPhoneNumber"
              v-validate="modelValidations.vendorMainPhoneNumber"
            ></md-input>
            <slide-y-down-transition>
              <md-icon class="error" v-show="errors.has('vendorMainPhoneNumber')">close</md-icon>
            </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon class="success" v-show="!errors.has('vendorMainPhoneNumber') && vendor.vendorMainPhoneNumber"
                >done</md-icon
              >
            </slide-y-down-transition>
          </md-field>
        </div>
      </div>
      <div class="md-layout-item display-flex">
        <div class="md-layout-item">
          <md-field
            :class="[
              { 'md-valid': !errors.has('vendorWebsite') && vendor.vendorWebsite },
              { 'md-error': errors.has('vendorWebsite') },
            ]"
          >
            <label>Website</label>
            <md-input
              v-model="vendor.vendorWebsite"
              type="url"
              data-vv-name="vendorWebsite"
              name="vendorWebsite"
              v-validate="modelValidations.vendorWebsite"
            />
            <slide-y-down-transition>
              <md-icon class="error" v-show="errors.has('vendorWebsite')">close</md-icon>
            </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon class="success" v-show="!errors.has('vendorWebsite') && vendor.vendorWebsite">done</md-icon>
            </slide-y-down-transition>
          </md-field>
        </div>
      </div>
    </div>
    <div class="md-layout bg-white">
      <div class="md-layout-item">
        <div class="banner-description">
          <div class="banner-description-title">
            <md-icon>view_list</md-icon>
            <h4>Description</h4>
          </div>
          <div class="banner-description-body">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </p>
          </div>
        </div>
        <div class="description"></div>
        <div class="text-group">
          <div class>
            <span>Past Events With the Vendor: {{ vendor.voters }}</span>
          </div>
          <div class>
            <span>Past Proposals Sent by the Vendor: {{ vendor.rank }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-container">
      <div
        class="tab-item"
        :class="[{ visited: currentTab > 1 }, { active: currentTab === 1 }]"
        v-on:click="currentTab = 1"
      >
        <template>
          <md-field :class="[{ 'md-error': errors.has('vendorCategory') }]" class="select-with-icon">
            <label for="category">Category</label>
            <md-select
              v-model="vendor.vendorCategory"
              name="vendorCategory"
              data-vv-name="vendorCategory"
              @md-selected="onChangeCategory()"
              required
            >
              <md-option v-for="(option, index) in categories" :key="index" :value="option.id">{{
                option.value
              }}</md-option>
            </md-select>
            <span class="md-error" v-if="errors.has('vendorCategory')">The Vendor Category is required</span>
          </md-field>
        </template>
      </div>
      <!-- <div class="tab-item" :class="[{'visited': currentTab > 2}, {'active': currentTab===2}]" v-on:click="currentTab = 2">
        Venue
      </div>-->
    </div>

    <!-- Tab contents -->
    <div class="md-layout tab-wrapper bg-white">
      <div class="md-layout-item">
        <div class="tab-content">
          <div v-if="currentTab === 1">
            <div class="tab-item-content">
              <div class="tab-item-content-title">
                <md-icon>apartment</md-icon>
                <h4>Capacity</h4>
              </div>
              <div class="tab-item-content-body">
                <template v-if="vendorCapacities.length > 0">
                  <div class="icon-text-vertical" v-for="(item, index) in vendorCapacities" :value="item" :key="index">
                    <md-icon>airline_seat_recline_extra</md-icon>
                    <h5>{{ item.defaultValue }}</h5>
                    <span>{{ item.name }}</span>
                  </div>
                </template>
                <template v-else>No Capacity Info</template>
              </div>
            </div>
            <md-divider></md-divider>
            <div class="tab-item-content">
              <div class="tab-item-content-title">
                <md-icon>check_circle</md-icon>
                <h4>Services Offered by This Vendor</h4>
              </div>
              <div class="tab-item-content-body">
                <template v-if="vendorServicesList.length > 0 || vendorRestrictions.length > 0">
                  <ul class="check-list">
                    <li>
                      <md-icon>restaurant</md-icon>
                      <strong class="capitalize">{{ vendor.vendorCategory }}</strong>
                    </li>
                    <li>
                      <br />
                    </li>
                    <li class="normal" v-for="(item, i) of vendorServicesList" :key="'S' + i" :value="item">
                      <md-icon>check</md-icon>
                      {{ item.name }}
                    </li>
                    <li class="disabled" v-for="(item, i) of vendorRestrictions" :key="'R' + i" :value="item">
                      <md-icon></md-icon>
                      <span>{{ item.name }}</span>
                    </li>
                  </ul>
                </template>
                <template v-else>No Service Data</template>
                <div class="notes" v-if="attachments.length > 0">
                  <div class="notes-title">
                    <h4>Attachment</h4>
                  </div>
                  <div class="notes-body">
                    <div class="note-item" v-for="(item, index) in attachments" :key="index" :value="item">
                      <a
                        v-if="item.vendorsFileContentType === 'application/pdf'"
                        target="_blank"
                        :href="`${serverUrl}/1/proposal-requests/${item.proposalRequst.id}/files/${item.id}`"
                      >
                        <md-icon>picture_as_pdf</md-icon>
                        Attachment {{ index + 1 }}
                      </a>
                      <a
                        v-else
                        target="_blank"
                        :href="`${serverUrl}/1/proposal-requests/${item.proposalRequst.id}/files/${item.id}`"
                      >
                        <md-icon>image</md-icon>
                        Attachment {{ index + 1 }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <md-divider></md-divider>
            <div class="tab-item-content">
              <div class="tab-item-content-title">
                <md-icon>menu_book</md-icon>
                <h4>Pricing and Rules</h4>
              </div>
              <div class="tab-item-content-body">
                <template v-if="vendorPricesAndRules.length > 0">
                  <div class="text-vertical" v-for="(item, index) of vendorPricesAndRules" :key="index" :value="item">
                    <h5>${{ item.defaultValue === null ? 0 : item.defaultValue }}</h5>
                    <span>{{ item.name }}</span>
                  </div>
                </template>
                <template v-else>No Price Data</template>
                <div class="notes">
                  <div class="notes-title">
                    <h4>Notes</h4>
                  </div>
                  <div class="notes-body">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                      nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <md-divider></md-divider>
            <div class="tab-item-content" v-if="proposals.length > 0">
              <div class="tab-item-content-title">
                <md-icon>dehaze</md-icon>
                <h4>Similar Proposals Made by Vendor</h4>
              </div>
              <div class="tab-item-content-body">
                <vendor-similar-proposals :proposals="proposals" :ratings="ratings"></vendor-similar-proposals>
              </div>
            </div>
            <md-divider></md-divider>
            <div class="tab-item-content">
              <div class="tab-item-content-title">
                <md-icon>edit</md-icon>
                <h4>
                  Feedbacks
                  <label
                    class="star-rating__star"
                    v-for="(rating, ratingIndex) in ratings"
                    :key="ratingIndex"
                    :class="{ 'is-selected': true }"
                    >★</label
                  >
                </h4>
              </div>
              <div class="tab-item-content-body">
                <vendor-feedbacks :feedbacks="feedbacks" :ratings="ratings"></vendor-feedbacks>
              </div>
            </div>
            <md-divider></md-divider>
            <div class="tab-item-content">
              <div class="tab-item-content-title">
                <md-icon>credit_card</md-icon>
                <h4>Payment Terms</h4>
              </div>
              <div class="tab-item-content-body">
                <p>
                  A 50% deposit will be due on or before 18/1/20. The remaining balance will b collected a week prior to
                  the event. We accept all major credit cards and checks.
                </p>
              </div>
            </div>
            <md-divider></md-divider>
            <div class="tab-item-content">
              <div class="tab-item-content-title">
                <md-icon>warning</md-icon>
                <h4>Cancellations Policy - Strict</h4>
              </div>
              <div class="tab-item-content-body">
                <p>
                  Be due on or before 18/1/20. The remaining balance will be collected a week prior to the vent. We
                  accept...
                  <a class="more">Read more</a>
                </p>
              </div>
            </div>
            <md-divider></md-divider>
            <div class="tab-item-content">
              <div class="tab-item-content-title">
                <md-icon>flip_to_back</md-icon>
                <h4>Similar Vendors</h4>
              </div>
              <div class="tab-item-content-body">
                <vendor-similar-item :similarItems="similarItems" :ratings="ratings"></vendor-similar-item>
              </div>
            </div>
          </div>
          <div v-if="currentTab === 2">Venue</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import VueElementLoading from "vue-element-loading";
import Vendors from "@/models/Vendors";

// COMPONENTS
import Icon from "@/components/Icon/Icon.vue";
import VendorSimilarProposals from "./components/VendorSimilarProposals.vue";
import VendorFeedbacks from "./components/VendorFeedbacks.vue";
import VendorSimilarItem from "./components/VendorSimilarItem.vue";
import LightBox from "vue-image-lightbox";
import { SlideYDownTransition } from "vue2-transitions";

export default {
  components: {
    VueElementLoading,
    VendorSimilarProposals,
    VendorSimilarItem,
    VendorFeedbacks,
    Icon,
    SlideYDownTransition,
    LightBox,
  },
  data() {
    return {
      isLoading: true,
      creation_mode: false,
      vendor: { statistics: {} },
      isVendorLogo: null,
      serverUrl: process.env.SERVER_URL,
      attachments: [],
      proposals: [],
      bgImages: [],
      defaultImg: "https://static-maryoku.s3.amazonaws.com/storage/img/lock.jpg",
      pricesAndRules: [],
      checkListItems: [],
      feedbacks: [
        {
          image: "https://static-maryoku.s3.amazonaws.com/storage/img/shutterstock_289440710.png",
          username: "Jane Bloom, Facebook",
          date: "2017/12/29",
          score: "5",
          message: "A 50% deposit will be due on or before 18/1/20.",
        },
        {
          image: "https://static-maryoku.s3.amazonaws.com/storage/img/shutterstock_289440710.png",
          username: "Leonard Parker",
          date: "2017/12/29",
          score: "4",
          message: "A 50% deposit will be due on or before 18/1/20.",
        },
        {
          image: "https://static-maryoku.s3.amazonaws.com/storage/img/shutterstock_289440710.png",
          username: "Alex Marlon",
          date: "2017/12/29",
          score: "3",
          message: "A 50% deposit will be due on or before 18/1/20.",
        },
      ],
      similarItems: [
        {
          image: "https://static-maryoku.s3.amazonaws.com/storage/img/shutterstock_289440710.png",
          thumbnail: "thumbnail",
          score: "5",
          title: "title",
        },
        {
          image: "https://static-maryoku.s3.amazonaws.com/storage/img/shutterstock_289440710.png",
          thumbnail: "thumbnail",
          score: "5",
          title: "title",
        },
      ],
      modelValidations: {
        vendorDisplayName: {
          required: true,
          min: 5,
        },
        vendorMainEmail: {
          required: true,
          email: true,
        },
        vendorMainPhoneNumber: {
          required: true,
          min: 5,
        },
        vendorCategory: {
          required: true,
          min: 5,
        },
        vendorWebsite: {
          url: { require_protocol: true },
          regex: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,=.]+$/gm,
          min: 10, // http://x.x
        },
      },
      ratings: [1, 2, 3, 4, 5],
      currentTab: 1,
      selectedField: null,
      categories: [],
      isDropped: false,
      routeName: null,
    };
  },
  created() {
    this.routeName = this.$route.name;
    Vendors.find("categories").then(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.log(error);
      },
    );
  },
  mounted() {
    let _self = this;
    this.isLoading = false;

    if (this.$route.params.id) {
      this.getVendor();
      this.getVendorProposals(this.$route.params.id);
    } else {
      this.creation_mode = true;
      this.fillImages();
    }
  },
  methods: {
    getVendor() {
      this.$auth.currentUser(
        this,
        true,
        function () {
          Vendors.find(this.$route.params.id).then((vendor) => {
            this.vendor = vendor;
            this.isLoading = false;
          });
        }.bind(this),
      );
    },
    getVendorProposals(id) {
      this.isLoading = true;
      new Vendors({ id })
        .proposalRequests()
        .first()
        .then((proposals) => {
          this.proposals = proposals.vendorProposals.filter((proposal) => proposal.bidRange != null);
          this.proposals.forEach((proposal) => {
            proposal.attachments.forEach((attachment) => {
              this.attachments.push(attachment);

              const fullPath = `${this.serverUrl}/1/proposal-requests/${attachment.proposalRequst.id}/files/${attachment.id}`;

              if (attachment.vendorsFileContentType != "application/pdf") {
                this.bgImages.push(fullPath);
              }
            });
          });
          this.fillImages();
          this.isLoading = false;
        });
    },
    view() {
      if (this.$refs.lightbox) {
        this.$refs.lightbox.showImage(0);
      }
    },
    onChangeCategory() {
      // if (this.isDropped) {
      //   this.updateVendor()
      // }
      this.isDropped = !this.isDropped;
    },
    setRating(ratingIndex) {
      this.vendor.rank = parseInt(ratingIndex) + 1;
    },
    validateScore() {
      this.vendor.avgScore = this.vendor.avgScore > 100 ? (this.vendor.avgScore = 100) : this.vendor.avgScore;
    },
    onlyNumber(event) {
      const key = event.keyCode ? event.keyCode : event.which;
      if (
        !(
          event.ctrlKey ||
          event.altKey ||
          (key > 47 && key < 58 && event.shiftKey === false) ||
          (key > 95 && key < 106) ||
          key === 8 ||
          key === 9 ||
          (key > 34 && key < 41) ||
          key === 46
        )
      ) {
        // 46 is dot
        event.preventDefault();
      }
    },
    fillImages() {
      const start = this.bgImages.length;
      const diff = 5 - this.bgImages.length;
      if (this.bgImages.length < 5) {
        for (let i = 0; i < diff; i++) {
          this.bgImages.push(this.defaultImg);
        }
      }
    },
    async addVendor() {
      this.$validator.validateAll().then((res) => {
        if (res) {
          let newVendor = new Vendors({});

          newVendor.attach(this.vendor).then((res) => {
            this.$emit("vendorCreated");
            this.$emit("selectVendor", res.data.item);
            this.$notify({
              message: "Vendor created successfully!",
              horizontalAlign: "center",
              verticalAlign: "top",
              type: "success",
            });
          });
        } else {
          this.$emit("on-validated", res);
          return res;
        }
      });
    },
    async updateVendor() {
      let newVendor = await Vendors.find(this.vendor.id);

      newVendor.vendorDisplayName = this.vendor.vendorDisplayName;
      newVendor.vendorAddressLine1 = this.vendor.vendorAddressLine1;
      newVendor.vendorCategory = this.vendor.vendorCategory;
      newVendor.rank = this.vendor.rank;
      newVendor.avgScore = this.vendor.avgScore;
      newVendor.vendorWebsite = this.vendor.vendorWebsite;
      newVendor.vendorMainEmail = this.vendor.vendorMainEmail;
      newVendor.vendorMainPhoneNumber = this.vendor.vendorMainPhoneNumber;
      newVendor.vendorTagging = this.vendor.vendorTagging;

      if (this.errors.items.length === 0) {
        newVendor.save();

        this.$notify({
          message: "Vendor Updated Successfully!",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "success",
        });
      } else {
        this.$notify({
          message: this.errors.items[0].msg,
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "danger",
        });
      }

      this.selectedField = null;
    },
  },
  computed: {
    logoText: function () {
      if (!this.vendor.vendorDisplayName) {
        return null;
      } else {
        const titleWords = this.vendor.vendorDisplayName.split(" ");
        if (titleWords.length > 1 && titleWords[titleWords.length - 1].length > 0) {
          return titleWords[0].charAt(0) + titleWords[titleWords.length - 1].charAt(0);
        } else {
          return titleWords[0].charAt(0);
        }
      }
    },
    vendorCapacities: function () {
      if (this.vendor.vendorProperties) {
        return this.vendor.vendorProperties.filter((item) => item.categoryTitle === "Capacity");
      } else {
        return [];
      }
    },
    vendorLogoImage: function () {
      if (this.vendor.vendorProperties) {
        return this.vendor.vendorProperties.filter((item) => item.name === "Logo" && item.type === "image");
      } else {
        return [];
      }
    },
    vendorExtraImage: function () {
      if (this.vendor.vendorProperties) {
        return this.vendor.vendorProperties.filter((item) => item.name != "Logo" && item.type === "image");
      } else {
        return [];
      }
    },
    vendorPricesAndRules: function () {
      if (this.vendor.vendorProperties) {
        return this.vendor.vendorProperties.filter((item) => item.categoryTitle === "Cost Elements");
      } else {
        return [];
      }
    },
    vendorServicesList: function () {
      if (this.vendor.vendorProperties) {
        return this.vendor.vendorProperties.filter(
          (item) => item.categoryTitle === "Services" || item.categoryTitle === "Included services and amenities",
        );
      } else {
        return [];
      }
    },
    vendorRestrictions: function () {
      if (this.vendor.vendorProperties) {
        return this.vendor.vendorProperties.filter((item) => item.categoryTitle === "Restrictions");
      } else {
        return [];
      }
    },
    getGalleryImages: function () {
      let temp = [];
      if (this.bgImages.length > 0) {
        this.bgImages.forEach((item) => {
          if (item != this.defaultImg) {
            temp.push({
              thumb: item,
              src: item,
              caption: "",
              srcset: "",
            });
          }
        });
        return temp;
      } else {
        return [];
      }
    },
  },
  filters: {},
  watch: {},
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/md/_variables.scss";
@import "@/assets/scss/md/_colors.scss";
.md-layout {
  &.bg-white {
    background: #fff;

    .text-group {
      color: red;
      padding: 2em 1em;
    }

    .button-group {
      .md-purple,
      .md-success {
        margin-right: 1em;

        @media (max-width: $screen-sm-min) {
          display: flex;
        }
      }
      h4 {
        color: #45cdde;
        font-size: 12px;
        font-weight: 600;
        padding-right: 24em;
        margin-top: 0.5em;
        width: 100%;
        @media (max-width: $screen-sm-min) {
          padding: 0;
        }
      }
      @media (max-width: $screen-sm-min) {
        display: flex;
        flex-direction: column;
        text-align: left;
      }
    }

    .title-cont {
      display: flex;

      .title-child {
        padding: 0 1em;
        img,
        .default-text-logo {
          width: 120px;
          height: 120px;
          position: relative;
          top: -2rem;
        }
        .default-text-logo {
          border: 3px solid #ffffff;
          border-radius: 3px;
          background-color: #999999;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
        }
        label {
          font-size: 12px;
        }
        .favorite {
          i {
            font-size: 12px !important;
            color: $purple-500 !important;
          }
          font-size: 12px;
          text-transform: capitalize;
        }
      }
    }
  }
}
.banner-description {
  padding: 0 1em;
  .banner-description-title {
    display: flex;
    i {
      display: block;
      margin-right: 0.5em;
      color: $purple-500 !important;
    }
    h4 {
      flex: 1;
      font-weight: 400;
    }
  }
}
.tabs-container {
  display: flex;
  justify-content: flex-start;
  position: relative;
  text-align: center;
  margin-top: 15px;
  z-index: 999;

  .tab-item {
    padding: 20px 1em;
    position: relative;
    width: 240px;
    background: #e3e3e3;
    color: #b6b6b6;
    font-weight: 500;
    font-size: 18px;

    &:first-child {
      border-radius: 5px 0 0 5px;
      margin-left: 2em;

      @media (max-width: $screen-sm-min) {
        margin-left: 0;
      }
    }

    &:last-child {
      border-radius: 0 5px 5px 0;
    }

    &.active {
      //color: $brand-primary;
      background: $brand-warning;
      color: $white-color;

      span {
        border-color: #fff;
      }

      label {
        color: #3c4858 !important;
      }

      &:before {
        border-color: $brand-primary;
        background: $brand-primary;
      }
    }
  }
}

.tab-wrapper {
  padding: 2em 2em 4em 2em;
  position: relative;
  top: -2em;

  .tab-content {
    padding-top: 2em;

    .tab-item-content {
      .tab-item-content-title {
        display: flex;
        i {
          display: block;
          margin-top: 0;
          margin-right: 0.5em;
          color: $purple-500;
        }
        h4 {
          flex: 1;
          font-weight: 400;
          margin-top: 0;
        }
      }
      .tab-item-content-body {
        display: flex;
        flex-wrap: wrap;

        ul.check-list {
          flex-basis: 100%;
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            i {
              color: $grey-500;
            }
          }
          li.normal {
            i {
              color: $pink-262;
            }
          }
          li.disabled {
            i {
              color: $grey-500;
            }
            span {
              color: #c2c2c2;
              text-decoration: line-through;
            }
          }
        }
        .notes {
          background: $grey-100;
          flex-basis: 100%;
          border: 1;
          border: 1px solid $grey-300;
          margin-top: 2em;
          padding: 1em 2em;

          .notes-title {
            h4 {
              margin-top: 0;
              font-weight: 600;
              font-size: 16px;
              margin-bottom: 0.5em;
            }
          }
          .notes-body {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            flex-flow: row wrap;

            .note-item {
              margin-right: 2em;
              width: 40%;
              color: $purple-500;
              i {
                color: $purple-500;
              }

              @media (max-width: $screen-sm-min) {
                margin-right: 0;
                width: 100%;
              }
            }
          }
        }
        .text-vertical {
          width: 25%;
          text-align: center;

          h5 {
            font-weight: 600;
          }
          @media (max-width: $screen-sm-min) {
            margin-right: 0;
            width: 50%;
          }
        }
        .icon-text-vertical {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding-right: 2em;
          text-align: center;

          i {
            font-size: 36px !important;
          }

          h5 {
            font-weight: 600;
            margin: 1em 0 5px 0;
          }

          @media (max-width: $screen-sm-min) {
            margin: 0;
            padding: 0;
            width: 33.33%;
          }
        }
        a.more {
          color: $purple-500;
        }
      }
    }

    .md-divider {
      background: #f9f9f9;
      height: 2px;
      margin: 2em 0;

      @media (max-width: $screen-sm-min) {
        margin: 1em 0;
      }
    }
  }

  @media (max-width: $screen-sm-min) {
    padding: 1em;
    top: 0;
  }
}
.capitalize {
  text-transform: capitalize;
}
.auto-width {
  display: inline-block;
  width: auto;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.display-flex {
  display: flex;
}
.mt-2 {
  margin-top: 1rem !important;
}
.md-save {
  position: relative;
  top: -16px;
  margin-left: 1em;
}
</style>
