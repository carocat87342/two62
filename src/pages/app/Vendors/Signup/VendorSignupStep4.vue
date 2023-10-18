<template>
  <div class="vendor-signup-step4-wrapper">
    <div class="md-layout inside-container">
      <div class="left-side md-layout-item md-size-25">
        <img :src="`${iconUrl}Group 5225 (2).svg`" />
        <h2>SUMMARY</h2>
        <p>This is a summary of your company's info which we'll use in future proposal creating</p>
        <h2>4/5</h2>
      </div>
      <div class="right-side md-layout-item md-size-75">
        <div class="card">
          <div class="tabs">
            <div
              class="tab"
              :class="{ active: t == activeTab }"
              v-for="(t, tIndex) in tabs"
              :key="tIndex"
              @click="goToSection(t)"
            >
              {{ t }}
            </div>
          </div>
          <div class="banner">
            <carousel
              :items="1"
              :margin="0"
              :dots="false"
              :nav="false"
              class="header-carousel"
              :key="`carousel-${vendor.images.length}`"
            >
              <template slot="prev">
                <span class="prev handle-btn">
                  <md-icon>keyboard_arrow_left</md-icon>
                </span>
              </template>
              <img
                :src="item"
                v-for="(item, index) in vendor.images.filter(it => it != null)"
                :key="`carousel-item-${index}`"
                class="carousel-image"
              />
              <template slot="next" v-if="vendor.images.length > 1">
                <span class="next handle-btn">
                  <md-icon>keyboard_arrow_right</md-icon>
                </span>
              </template>
            </carousel>
          </div>
          <div class="about-cont" id="About">
            <div class="block">
              <span class="capacity"> <img :src="`${iconUrl}Asset 545.svg`" />Capacity </span>
              <span class="number">
                {{ vendor.capacity.low }}
                <img :src="`${iconUrl}Group 4585 (2).svg`" />
                {{ vendor.capacity.high }}
              </span>
            </div>
            <div class="block">
              <div class="title lg"><img :src="`${iconUrl}Asset 563.svg`" /> ABOUT</div>
              <div class="desc">{{ vendor.about.company }}</div>
            </div>
            <div class="block">
              <div class="title">
                <img :src="`${$iconURL}Budget Elements/${getCategoryIconByValue(vendor.vendorCategories[0])}`" width="30px"/>
                About Our {{ getCategoryNameByValue(vendor.vendorCategories[0]) }}
              </div>
              <div class="desc">{{ vendor.about.category }}</div>
            </div>
            <vendor-images-list :images="[...vendor.images.filter(it => it != null), ...vendor.images.filter(it => it != null)]" class="images"></vendor-images-list>
            <div class="contact-us" id="Contact">
              <h4>CONTACT US</h4>
              <div class="items">
                <div class="item">
                  <img :src="`${iconUrl}Asset 547.svg`" />
                  {{ vendor.vendorMainEmail }}
                </div>
                <div class="item">
                  <img :src="`${iconUrl}Asset 550.svg`" />
                  {{ vendor.vendorAddressLine1 }}
                </div>
                <div class="item">
                  <img :src="`${iconUrl}Asset 548.svg`" />
                  {{ vendor.vendorMainPhoneNumber }}
                </div>
              </div>
            </div>
            <div class="social" v-if="isSocial()">
              Website & social
              <div class="items">
                <div
                  class="item"
                  v-for="(s, sIndex) in socialMediaBlocks"
                  :key="sIndex"
                  :class="{ 'mr-20': vendor.social[s.name] }"
                >
                  <a v-if="vendor.social[s.name]" :href="vendor.social[s.name]" target="_blank">
                    <img :src="`${iconUrl}${s.icon}`" />
                    {{ vendor.social[s.name] }}
                  </a>
                </div>
              </div>
            </div>

            <div class="personal-message mt-40" v-if="vendor.personalMessage">
              <div class="font-bold mb-20">
                <img class="mr-10" :src="`${$iconURL}common/message-dark.svg`" />
                Personal message to your clients
              </div>
              <div class="content">{{ vendor.personalMessage }}</div>
            </div>
            <div class="attachments mt-50">
              <div class="mb-30">Attachments</div>
              <!-- <attachment-tag-list
                :defaultValue="vendor.attachments"
                @add="addNewAttachment"
                @remove="removeAttachment"
              ></attachment-tag-list> -->
              <attachment-item
                v-for="attachment in attachments"
                :key="attachment.name"
                :attachment="attachment"
                :vendor="vendor"
                class="attachment"
                @uploaded="setAttachment"
                @remove="removeAttachment"
              ></attachment-item>
            </div>
          </div>
          <div class="fee-cont" id="Pricing">
            <div class="title">
              <h3><img :src="`${iconUrl}Asset 562.svg`" /> ELEMENTS IN STARTING FEE</h3>
            </div>
            <div class="cblock">
              <div class="cheader">
                <div class="first-column">
                  <div>
                    <img :src="`${$iconURL}Budget Elements/${getCategoryIconByValue(vendor.vendorCategories[0])}`" />
                    {{ getCategoryNameByValue(vendor.vendorCategories[0]) }}
                  </div>
                  <!-- <span>QTY</span> -->
                </div>
                <div class="second-column">
                  <!-- <span>QTY</span> -->
                </div>
              </div>
              <div class="citems">
                <vendor-starting-fee-item v-for="(fv, fvIndex) in getStartingFeeItems()" :key="fvIndex" :item="fv" />
              </div>
            </div>
          </div>
          <div class="extra-cont" id="Pricing">
            <div class="title">
              <h3><img :src="`${iconUrl}Asset 526.svg`" />WITH EXTRA PAY</h3>
            </div>
            <div class="cblock">
              <div class="cheader">
                <div class="d-flex align-center">
                  <img :src="`${$iconURL}Budget Elements/${getCategoryIconByValue(vendor.vendorCategories[0])}`" />
                  {{ getCategoryNameByValue(vendor.vendorCategories[0]) }}
                </div>
                <span class="text-center">QTY</span>
                <span class="text-center">Price</span>
                <span></span>
              </div>
              <div class="citems">
                <div class="citem">
                  <vendor-extra-pay-item
                    v-for="(cs, csIndex) in getExtraPayItems()"
                    :key="csIndex"
                    :item="cs"
                    @change="changeServiceItem"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="policy-cont" id="Policy">
            <div class="title"><img :src="`${iconUrl}Group 1471 (2).svg`" /> OUR POLICY</div>
            <div class="rules">
              <div class="rule" v-for="(policy, yIndex) in validPolicy" :key="yIndex">
                <div class="item">{{ policy.name }}</div>
                <div class="item" v-if="policy.type === 'MultiSelection'">
                  <span class="mr-10" v-for="(v, vIndex) in policy.value">{{
                    `${v}${vIndex == policy.value.length - 1 ? "" : ","}`
                  }}</span>
                </div>
                <div class="item" v-else-if="policy.type === 'Including'">
                  <span class="mr-10" v-if="policy.value"> Yes </span>
                  <span class="mr-10" v-if="!policy.value && policy.cost"> {{ `$ ${policy.cost | withComma}` }} </span>
                </div>
                <div class="item text-right" v-else>
                  <span v-if="policy.type === 'Number' && !policy.isPercentage && policy.unit !== 'hour' && policy.unit !== 'none'">$</span>
                  <span v-if="policy.type === 'Boolean'">
                    <img v-if="policy.value === true" :src="`${$iconURL}Vendor Signup/Group 5479 (2).svg`" />
                    <img v-else :src="`${$iconURL}Vendor Signup/Group 5489 (4).svg`" />
                    <!-- {{ policy.value === true ? "Yes" : "No" }} -->
                  </span>
                  <span v-else>
                    <img v-if="policy.value === true" :src="`${$iconURL}Vendor Signup/Group 5479 (2).svg`" />
                    <img v-else-if="policy.value === false" :src="`${$iconURL}Vendor Signup/Group 5489 (4).svg`" />
                    <span v-else-if="policy.unit === 'none'">{{policy.desc}}</span>
                    <span v-else>{{ policy.value | withComma }}</span>
                  </span>
                  <span v-if="policy.unit === 'hour'">Hour{{ policy.value > 1 ? "s" : "" }}</span>
                  <span v-if="policy.isPercentage">%</span>
                  <span class="ml-50" v-if="policy.hasOwnProperty('attendees')">
                    {{ policy.attendees }} attendees
                  </span>
                </div>
              </div>
            </div>
            <div class="rules" v-if="additionalRules && additionalRules.length">
              <h5 class="font-bold font-size-20">Additional Rules</h5>
              <div class="rule" v-for="(policy, yIndex) in additionalRules" :key="yIndex">
                <div class="item font-regular">Event must be {{ policy }}</div>
              </div>
            </div>
            <div class="not-allowed" v-if="vendor.vendorCategories[0] == 'venuerental'">
              <template v-if="vendor.notAllowedThirdParty === 2">
                <h5>We don't allow these 3rd party vendor:</h5>
                <p>{{ mergeStringItems(vendor.notAllowed) }}</p>
              </template>
              <template v-if="vendor.notAllowedThirdParty === 0">
                <h5>We allow all 3rd party vendors</h5>
              </template>
              <template v-if="vendor.notAllowedThirdParty === 1">
                <h5>We work only for our venue rental</h5>
              </template>
            </div>
            <div class="dont-work">
              <h5>We don't work on:</h5>
              <div class="item" v-if="mergeStringItems(vendor.selectedWeekdays)">
                <img :src="`${iconUrl}Group 5489 (4).svg`" />
                {{ mergeStringItems(vendor.selectedWeekdays) }}
              </div>
              <div class="item" v-for="(d, dIndex) in vendor.exDonts" :key="dIndex">
                <img :src="`${iconUrl}Group 5489 (4).svg`" />
                {{ d.holiday }}
              </div>
              <div class="item" v-if="vendor.dontWorkDays && vendor.dontWorkDays.length > 0">
                <img :src="`${iconUrl}Group 5489 (4).svg`" />
                {{ dontWorkDays() }}
              </div>
              <div class="item" v-if="vendor.dontWorkTime">
                <img :src="`${iconUrl}Group 5489 (4).svg`" />
                {{ dontWorkTime() }}
              </div>
            </div>
            <div v-if="vendor.healthPolicy || vendor.guaranteed && vendor.guaranteed.length"
                 class="healthy-policy" >
              <h5 class="d-flex align-center">
                <img class="mr-10" :src="`${$iconURL}union-12.svg`" width="26px">
                Health policy</h5>
              <template v-if="vendor.healthPolicy">
                  <div class="rule font-bold-extra my-20">
                      <span class="color-red">COVID 19</span>
                      - Exceptional Policy
                  </div>
                  <p class="width-66">
                    {{vendor.healthPolicy}}
                  </p>
              </template>
              <template v-if="vendor.guaranteed && vendor.guaranteed.length">
                <div class="mt-30 font-bold-extra">Guaranteed with every staff member:</div>
                <div class="md-layout mt-20">
                    <div v-for="option in guaranteedOptions" class="md-layout-item md-size-30 py-10" :key="option.value"
                         :style="{display: vendor.guaranteed.includes(option.value)? '': 'none'}">
                        <div v-if="vendor.guaranteed.includes(option.value)" class="d-flex align-center">
                            <img class="mr-10" :src="`${$iconURL}Vendor Signup/Group 5479 (2).svg`" width="30px">
                            {{option.label}}
                        </div>
                    </div>
                </div>
              </template>
            </div>
          </div>
          <div class="pricing-policy-cont" id="Rules">
            <div class="title"><img :src="`${iconUrl}Asset 560.svg`" /> OUR PRICING POLICY</div>
            <div class="rules">
              <div class="rule" v-for="(policy, yIndex) in validPricingPolicy" :key="yIndex">
                <div class="item">
                  <div>{{ policy.name }}</div>
                  <div class="mt-10 color-gray">{{ policy.desc }}</div>
                </div>
                <div class="item" v-if="policy.type === 'MultiSelection'">
                  <span class="mr-10" v-for="(v, vIndex) in policy.value">{{
                    `${v}${vIndex == policy.value.length - 1 ? "" : ","}`
                  }}</span>
                </div>
                <div class="item" v-else-if="policy.type === 'Including'">
                  <span class="mr-10" v-if="policy.value"> Yes </span>
                  <span class="mr-10" v-if="!policy.value && policy.cost && policy.unit === '$'"> $ </span>
                  <span>{{ Number(policy.cost) | withComma }}</span>
                </div>
                <div class="item" v-else-if="policy.type === 'Boolean' && policy.value && policy.discount">
                  <span class="mr-10" v-if="policy.hasOwnProperty('unit') && policy.unit === '$'"> $ </span>
                  <span class="mr-10" v-if="policy.discount"> {{ policy.discount }} </span>
                  <span class="mr-10" v-if="policy.hasOwnProperty('unit') && policy.unit === '%'"> % </span>
                </div>
                <div class="item" v-else-if="policy.type === 'CostAndQty'">
                  ${{ policy.value | withComma }} per {{ policy.qtyUnit }}({{ policy.defaultQty }}{{ policy.qtyUnit }}s)
                </div>
                <div class="item" v-else-if="policy.type === 'Cost'">
                  ${{ policy.value | withComma }} per {{ policy.qtyUnit }}
                </div>
                <div class="item" v-else>
                  <span v-if="policy.type === 'Number' && !policy.isPercentage && policy.unit !== 'hour'">$</span>
                  <span v-if="policy.value === true">Yes</span>
                  <span v-else>{{ policy.value | withComma }}</span>
                  <span v-if="policy.isPercentage">%</span>
                  <span class="ml-50" v-if="policy.hasOwnProperty('attendees')">
                    {{ policy.attendees }} attendees
                  </span>
                  <span class="ml-50 text-transform-capitalize" v-if="policy.unit">
                    <!-- {{ policy.unit }}{{ policy.value > 1 ? "s" : "" }} -->
                    {{ getUnit(policy) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="item">
              <!-- <h6 class="underline">Relish caterers & venues:</h6> -->
            </div>
            <div class="signatures">
              <div
                class="sign"
                v-if="vendor.signature"
                :style="`
                  background-image: url(${vendor.signature});
                  width: 100%;
                  background-repeat: no-repeat;
                  height: 162px;
                  background-size: contain;
                `"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Vendors from "@/models/Vendors";

//COMPONENTS
import Icon from "@/components/Icon/Icon.vue";
import VendorServiceItem from "../components/VendorServiceItem.vue";
import LightBox from "vue-image-lightbox";
import carousel from "vue-owl-carousel";
import VendorStartingFeeItem from "../components/VendorStartingFeeItem.vue";
import VendorExtraPayItem from "../components/VendorExtraPayItem.vue";
import _ from "underscore";
import VendorImagesList from "../components/VendorImagesList.vue";
import HeaderImageCarousel from "@/components/HeaderImageCarousel.vue";
import { GuaranteedOptions } from "@/constants/options";
import { capitalize } from "@/utils/string.util";
import AttachmentTagList from "../components/AttachmentTagList.vue";
import S3Service from "@/services/s3.service";
import AttachmentItem from "../components/AttachmentItem.vue";
export default {
  name: "vendor-signup-step4",
  props: {
    categories: Array,
    icon: String,
    vendor: Object,
  },
  components: {
    VendorServiceItem,
    LightBox,
    carousel,
    VendorStartingFeeItem,
    VendorExtraPayItem,
    VendorImagesList,
    AttachmentTagList,
    AttachmentItem,
    HeaderImageCarousel,
  },
  data() {
    return {
      tabs: ["About", "Pricing", "Rules", "Policy", "Contact"],
      socialMediaBlocks: [
        {
          name: "website",
          icon: "Asset 539.svg",
        },
        {
          name: "facebook",
          icon: "Asset 540.svg",
        },
        {
          name: "instagram",
          icon: "Group 4569 (2).svg",
        },
        {
          name: "youtube",
          icon: "socialmedia/Youtube.svg",
        },
        {
          name: "linkedin",
          icon: "socialmedia/Linkdin.svg",
        },
        {
          name: "google",
          icon: "socialmedia/GooglePlus.svg",
        },
        {
          name: "pinterest",
          icon: "socialmedia/Pinterest.svg",
        },
        {
          name: "foursquare",
          icon: "socialmedia/foursquare.svg",
        },
        {
          name: "reddit",
          icon: "socialmedia/Twitter.svg",
        },
        {
          name: "tiktok",
          icon: "socialmedia/Tiktok.svg",
        },
      ],
      activeTab: "About",
      feeVenues: [
        {
          value: "Set up",
          qty: null,
        },
        {
          value: "In-house bar services",
          qty: 1,
        },
      ],
      feeCatering: [
        {
          value: "Set up",
          qty: null,
        },
        {
          value: "In-house bar services",
          qty: 2,
        },
      ],
      imageSlidePos: 0,
      iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/Vendor Signup/",
      defRules: "Suitable for pets, Smoking allowed, Suitable for infants(Under 2 years), Dress code, Overtime Cost",
      defNa:
        "Catering, Dj, Photographer, Show / Performance, Flowers, Transporation, Decoration, Rentals, Favours & Gifts, Other",
      categoryNames: [
        {
          name: "Venue Rental",
          value: "venuerental",
          icon: "venuerental.svg",
        },
        {
          name: "Food & Beverage",
          value: "foodandbeverage",
          icon: "foodandbeverage.svg",
        },
        {
          name: "Design and Decor",
          value: "decor",
          icon: "decor.svg",
        },
        {
          name: "Guest Services & Staffing",
          value: "administration",
          icon: "administration.svg",
        },
        {
          name: "Signage / Printing",
          value: "signageprinting",
          icon: "signageprinting.svg",
        },
        {
          name: "Advertising and Promotion",
          value: "advertising-promotion",
          icon: "advertising-promotion.svg",
        },
        {
          name: "AV / Staging",
          value: "audiovisualstagingservices",
          icon: "audiovisualstagingservices.svg",
        },
        {
          name: "Giveaways",
          value: "giveaways",
          icon: "swags.svg",
        },
        {
          name: "Shipping",
          value: "shipping",
          icon: "shipping.svg",
        },
        {
          name: "Transportation & Tour operator",
          value: "transportation",
          icon: "transportation.svg",
        },
        {
          name: "Entertainment",
          value: "entertainment",
          icon: "entertainment.svg",
        },
        {
          name: "Administration",
          value: "administration",
          icon: "administration.svg",
        },
        {
          name: "Security",
          value: "securityservices",
          icon: "securityservices.svg",
        },
        {
          name: "Technology",
          value: "technologyservices",
          icon: "technologyservices.svg",
        },
        {
          name: "Videography and Photography",
          value: "videographyandphotography",
          icon: "videographyandphotography.svg",
        },
        {
          name: "Equipment Rental",
          value: "equipmentrentals",
          icon: "equipmentrentals.svg",
        },
      ],
      guaranteedOptions: GuaranteedOptions,
      medias: [],
    };
  },
  created() {},
  mounted() {
    console.log("vendorSignup.step4", this.vendor);
    if (this.vendor.hasOwnProperty("images") && this.vendor.images.length) {
      this.vendor.images.forEach((item) => {
        this.medias.push({
          thumb: item,
          src: item,
          caption: "test",
        });
      });
    }
  },
  methods: {
    setAttachment(attachment) {
      const defaultAttachments = Object.assign([], this.attachments);
      const currentIndex = defaultAttachments.findIndex((a) => a.name === attachment.name);
      defaultAttachments[currentIndex] = attachment;
      this.$store.commit("vendorSignup/setField", { field: "attachments", value: defaultAttachments });
      // let updateData = { attachments: defaultAttachments, id: this.vendorData.id };
      // this.$store.dispatch("vendor/updateProfile", updateData);
    },
    addNewAttachment(file) {
      S3Service.fileUpload(file, file.name, `vendors/attachments/${this.vendor.id}`).then((res) => {
        const attachments = this.vendor.attachments ? [...this.vendor.attachments] : [];
        attachments.push({
          name: file.name,
          isRequired: false,
          fileName: file.name,
          url: `${res}`,
        });
        this.$store.commit("vendorSignup/setField", { field: "attachments", value: attachments });
      });
    },
    removeAttachment(attachment) {
      const defaultAttachments = this.attachments;
      const currentIndex = defaultAttachments.findIndex((a) => a.name === attachment.name);
      defaultAttachments[currentIndex].fileName = "";
      defaultAttachments[currentIndex].url = "";
      let updateData = { attachments: defaultAttachments, id: this.vendorData.id };
      this.$store.dispatch("vendor/updateProfile", updateData);
    },
    // removeAttachment(item, index) {
    //   const attachments = this.vendor.attachments ? [...this.vendor.attachments] : [];
    //   attachments.splice(index, 1);
    //   this.$store.commit("vendorSignup/setField", { field: "attachments", value: attachments });
    // },
    isSocial() {
      let isBlank = true;

      _.each(this.vendor.social, (s) => {
        isBlank &= s === null;
      });

      return !isBlank;
    },
    getExtraPayItems() {
      console.log("getExtraPayItems");
      let extraPayItems = [];
      _.each(this.vendor.services, (item) => {
        if (item.checked && item.hasOwnProperty("included") && !item.included) {
          extraPayItems.push(item);
        }
      });
      return extraPayItems;
    },
    getStartingFeeItems() {
      let startingFeeItems = [];
      _.each(this.vendor.services, (item) => {
        if (item.checked && item.hasOwnProperty("included") && item.included) {
          startingFeeItems.push(item);
        }
      });
      return startingFeeItems;
    },
    prev() {
      const ww = this.vendor.images.length * 320;
      const sw = this.$refs.imagesCont.clientWidth;
      if (ww / sw > 2) {
        this.imageSlidePos += 320 * 4;
      } else if (ww / sw > 1) {
        this.imageSlidePos += (ww % sw) + 60;
      } else {
        this.imageSlidePos;
      }
    },
    next() {
      const ww = this.vendor.images.length * 320;
      const sw = this.$refs.imagesCont.clientWidth;
      if (ww / sw > 2) {
        this.imageSlidePos -= 320 * 4;
      } else if (ww / sw > 1) {
        this.imageSlidePos -= (ww % sw) + 60;
      } else {
        this.imageSlidePos;
      }
    },
    goToSection(item) {
      this.activeTab = item;
      const theElement = document.getElementById(item);
      const y = theElement.getBoundingClientRect().top + window.pageYOffset;
      const yOffset = -50;
      window.scrollTo({
        top: y + yOffset,
        behavior: "smooth",
      });
    },
    getCategoryIconByValue(value) {
      return this.categoryNames.filter((c) => c.value == value)[0].icon;
    },
    getCategoryNameByValue(value) {
      return this.categoryNames.filter((c) => c.value == value)[0].name;
    },
    mergeStringItems(items) {
      let naItems = "";
      _.each(items, (n) => {
        if (n.constructor.name == "Object") {
          naItems += `${capitalize(n.name)}s, `;
        } else {
          naItems += `${capitalize(n)}s, `;
        }
      });
      naItems = naItems.substring(0, naItems.length - 2);
      return "All " + naItems;
    },
    dontWorkDays() {
      let selectedDates = "";
      _.each(this.vendor.dontWorkDays, (s) => {
        selectedDates += `${s.date}, `;
      });
      selectedDates = selectedDates.substring(0, selectedDates.length - 2);
      return selectedDates;
    },
    dontWorkTime() {
      return `${this.vendor.dontWorkTime.startTime.hh}:${this.vendor.dontWorkTime.startTime.mm}:${this.vendor.dontWorkTime.amPack.start} ~ ${this.vendor.dontWorkTime.endTime.hh}:${this.vendor.dontWorkTime.endTime.mm}:${this.vendor.dontWorkTime.amPack.end}`;
    },

    view() {
      if (this.$refs.lightbox) {
        this.$refs.lightbox.showImage(0);
      }
    },
    changeServiceItem(item) {
      console.log("changeServiceItem", item);
      _.each(this.vendor.services, (s) => {
        if (s.label === item.label) {
          this.vendor.services[s] = item;
        }
      });

      this.$root.$emit("update-vendor-value", "services", this.vendor.services);
    },
    getUnit(policy) {
      if (policy.unit !== "%" && policy.unit !== "$") {
        return `${policy.unit}${policy.value > 1 ? "s" : ""}`;
      }
      if (policy.type === "GroupDiscount") {
        return `For ${policy.groupSize}`;
      }
      return "";
    },
  },
  computed: {
    additionalRules() {
      return this.$store.state.vendorSignup.vendor.additionalRules;
    },
    validPricingPolicy() {
      if (this.vendor.pricingPolicies)
        return this.vendor.pricingPolicies.filter(
          (item) => item.value || item.desc || (item.type === "Including" && item.cost),
        );
      return null;
    },
    validPolicy() {
      if (this.vendor.policies)
        return this.vendor.policies.filter(
          (item) => item.hasOwnProperty("value") || (item.type === "Including" && item.cost),
        );
      return null;
    },
    attachments() {
      if (this.vendor.attachments && this.vendor.attachments.length > 0) return this.vendor.attachments;
      if (this.vendor.eventCategory.legalDocuments) {
        return this.vendor.eventCategory.legalDocuments.map((legal) => {
          return {
            name: legal,
            isRequired:
              this.vendor.eventCategory.mandatoryLegalDocs &&
              this.vendor.eventCategory.mandatoryLegalDocs.findIndex((item) => item === legal) >= 0,
            fileName: "",
          };
        });
      }
      return [];
    },
  },
  filters: {},
  watch: {
    vendor: {
      handler: function (newVal) {
        console.log("handler", newVal);
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.vendor-signup-step4-wrapper {
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
      width: 75%;
      .header-carousel {
        width: 100%;
        position: relative;
        .handle-btn {
          background-color: white !important;
          height: 25px;
          width: 25px;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          i {
            color: #050505;
          }
          &.next {
            right: 50px;
          }
          &.prev {
            left: 50px;
          }
        }
        .item {
          max-height: 200px;
          object-fit: cover;
          border-radius: 5px;
          overflow: hidden;
        }
      }
      .card {
        padding: 30px 0px 50px 0px;
        background-color: #ffffff;
        box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);

        .tabs {
          display: flex;
          margin: -30px 0 0;
          .tab {
            padding: 1rem 2rem;
            border-right: 1px solid #818080;
            cursor: pointer;

            &.active {
              border-top: 5px solid #f51355;
              font: bold 16px Manrope-Regular, sans-serif;
            }
          }
        }
        .banner {
          width: 100%;
          margin: 0px 0px;
          img {
            height: 460px;
            object-fit: cover;
          }
        }
        .about-cont {
          padding: 2rem 0 50px 0;
          // border-bottom: 1px solid #dddddd;
          padding: 50px 50px;
          .block {
            span {
              &.capacity {
                margin-right: 2rem;
                font: bold 16px Manrope-Regular, sans-serif;
                img {
                  width: 26px;
                  margin-right: 1rem;
                }
              }
              &.number {
                font: normal 16px Manrope-Regular, sans-serif;
                img {
                  width: 35px;
                  margin: 0 1rem;
                }
              }
            }
            .title {
              margin: 2rem 0 1rem 0;
              display: flex;
              align-items: center;
              img {
                width: 35px;
                margin-right: 10px;
              }
              font: 800 16px Manrope-Regular, sans-serif;
              &.lg {
                img {
                  width: 50px;
                  margin-left: -10px;
                }
                font: 800 30px Manrope-Regular, sans-serif;
              }
            }
            .desc {
              font: normal 16px Manrope-Regular, sans-serif;
              width: 60%;
            }
          }
          .images {
            margin-right: -50px;
            margin-left: -50px;
          }
          .personal-message {
            .content {
              background-color: #f2f2f2;
              border-radius: 5px;
              max-width: 850px;
              padding: 30px 20% 30px 30px;
            }
          }
          .contact-us {
            padding: 2rem 0;

            h4 {
              margin: 0;
              font: 800 30px Manrope-Regular, sans-serif;
            }
            .items {
              display: flex;
              white-space: nowrap;
              margin-top: 2rem;

              .item {
                margin-right: 3rem;
                font: normal 16px Manrope-Regular, sans-serif;
                text-decoration: underline;
                img {
                  width: 24px;
                  height: 24px;
                  margin-right: 1rem;
                }
              }
            }
          }
          .social {
            padding: 2rem 0 0;
            border-top: 1px solid #dddddd;

            .items {
              display: flex;
              flex-wrap: wrap;
              margin-top: 1rem;

              .item {
                font: bold 16px Manrope-Regular, sans-serif;
                display: block;
                margin: 20px 0;
                a {
                  color: #050505;
                  text-decoration: underline;
                }
                img {
                  width: 24px;
                  height: 24px;
                  margin-right: 10px;
                }
              }
            }
          }
        }
        .fee-cont {
          border-top: 2px solid #818080;
          padding: 30px 50px 50px 50px;
          .title {
            margin: 2rem 0;
            h3 {
              margin: 0;
              font: 800 30px Manrope-Regular, sans-serif;
              img {
                width: 24px;
                margin-right: 1rem;
              }
            }
          }
          .cblock {
            .cheader {
              display: grid;
              grid-template-columns: 50% 50%;
              grid-gap: 3rem;
              padding: 1rem 0 1rem 50px;
              background: #ededed;
              width: 100%;
              font: bold 16px Manrope-Regular, sans-serif;

              margin-left: -50px;
              .first-column {
                display: grid;
                grid-template-columns: 70% 30%;
                align-items: center;
              }
              .second-column {
                text-align: right;
                margin-right: 1.5rem;
              }

              img {
                width: 35px;
                margin-right: 10px;
              }
              span {
                text-align: right;
                margin-right: 5rem;
              }
            }
            .citems {
              width: calc(100% - 7rem);
              display: grid;
              grid-column-gap: 3rem;
              // grid-template-columns: 50% 50%;
              align-items: center;
            }
          }
        }
        .extra-cont {
          border-top: 2px solid #818080;
          padding: 30px 50px 50px 50px;

          .title {
            margin: 2rem 0;
            h3 {
              font: 800 30px Manrope-Regular, sans-serif;
              margin: 0;
              img {
                width: 20px;
                margin-right: 1rem;
              }
            }
          }
          .cblock {
            .cheader {
              display: grid;
              grid-template-columns: 40% 20% 20% 20%;
              padding: 1rem 0 1rem 50px;
              background: #ededed;
              width: calc(100% - 5rem);
              font: bold 16px Manrope-Regular, sans-serif;
              margin-left: -50px;
              img {
                width: 35px;
                margin-right: 10px;
              }
            }
            .citems {
              .citem {
                width: calc(100% - 5rem - 50px);
                border-bottom: 1px solid #dddddd;
                cursor: pointer;
              }
            }
          }
        }
        .policy-cont {
          border-top: 2px solid #818080;
          border-bottom: 2px solid #818080;
          padding: 50px;

          .title {
            img {
              width: 30px;
              margin-right: 1rem;
            }
            font: 800 30px Manrope-Regular, sans-serif;
          }
          .rules {
            margin: 3rem 0;
            .rule {
              padding: 2rem 0;
              border-bottom: 1px solid #dddddd;
              font: 600 16px Manrope-Regular, sans-serif;
              display: flex;
              align-items: center;
              max-width: 900px;
              .item {
                flex: 1;

                img {
                  width: 30px;
                }
              }
              &:first-child {
                border-top: 1px solid #dddddd;
              }
            }
          }
          .not-allowed {
            h5 {
              font: 800 20px Manrope-Regular, sans-serif;
            }
            p {
              font: normal 16px Manrope-Regular, sans-serif;
            }
          }
          .dont-work {
            h5 {
              font: 800 20px Manrope-Regular, sans-serif;
            }
            .item {
              margin-bottom: 1rem;
              display: flex;
              img {
                width: 21px;
                margin-right: 1rem;
              }
            }
          }
          .healthy-policy{
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #dddddd;
            h5 {
              font: 800 20px Manrope-Regular, sans-serif;
            }
          }
        }
        .pricing-policy-cont {
          padding: 50px 50px 0 50px;
          .title {
            margin-bottom: 2rem;
            img {
              width: 30px;
              margin-right: 1rem;
            }
            font: 800 30px Manrope-Regular, sans-serif;
          }
          .rules {
            margin: 3rem 0;
            .rule {
              padding: 2rem 0;
              border-bottom: 1px solid #dddddd;
              font: 600 16px Manrope-Regular, sans-serif;
              display: flex;
              align-items: center;

              .item {
                flex: 1;

                img {
                  width: 30px;
                }
              }
              &:first-child {
                border-top: 1px solid #dddddd;
              }
            }
          }
          .item {
            padding: 1rem 0;
            h5 {
              margin: 0;
              font: 800 20px Manrope-Regular, sans-serif;
            }
            h6 {
              margin: 0;
              font: 800 16px Manrope-Regular, sans-serif;
              text-transform: initial;

              &.underline {
                text-decoration: underline;
              }
            }
            p {
              font: normal 16px Manrope-Regular, sans-serif;
            }
            .ifthan-cont {
              display: flex;
              .ifthan {
                flex: 1;
                b {
                  font: 800 20px Manrope-Regular, sans-serif;
                }
              }
            }
            &.lb {
              background-color: #ededed;
              margin: 2rem 0 1rem 0px;
              padding-left: 50px;
              width: 80%;
            }
          }
          .signatures {
            display: grid;
            grid-template-columns: 50% 50%;
          }
        }
      }
    }
  }
  .mr-1 {
    margin-right: 1rem;
  }
  .attachment:not(:last-child) {
    border-bottom: solid 1px #dbdbdb;
  }
}
</style>
