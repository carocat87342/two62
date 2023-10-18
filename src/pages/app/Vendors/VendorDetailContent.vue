<template>
  <div class="vendor-detail-summary">
    <div class="inside-container">
      <div class="left-side">
        <div class="tabs">
          <div
            class="tab"
            :class="{ active: t == activeTab }"
            v-for="(t, tIndex) in tabs"
            :key="`tab-${tIndex}`"
            @click="goToSection(t)"
          >
            <span class="point"></span>
            {{ t }}
          </div>
        </div>
      </div>
      <div class="right-side">
        <div class="card">
          <div class="banner">
            <!-- <vendor-images-list :images="vendor.images" class="images mt-30"></vendor-images-list> -->
            <!-- <header-image-carousel :images="vendor.images" class="images"></header-image-carousel> -->
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
                v-for="(item, index) in vendor.images"
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
          <div class="p-60">
            <div class="about-cont profile-section" id="About">
              <div class="block">
                <span class="capacity"> <img :src="`${iconUrl}Asset 545.svg`" />Capacity </span>
                <span class="number" v-if="vendor.capacity">
                  {{ vendor.capacity.low | formatQty }}
                  <img :src="`${iconUrl}Group 4585 (2).svg`" />
                  {{ vendor.capacity.high | formatQty }}
                </span>
              </div>
              <div class="block">
                <div class="title lg"><img :src="`${iconUrl}Asset 563.svg`" /> ABOUT</div>
                <div class="desc" v-if="vendor.about">{{ vendor.about.company }}</div>
              </div>
              <div class="block" v-if="vendor.about">
                <div class="title">
                  <img :src="`${$iconURL}Budget Elements/${vendor.eventCategory.icon}`" />
                  <span> About Our {{ vendor.eventCategory.fullTitle }} </span>
                </div>
                <div class="desc">{{ vendor.about.category }}</div>
              </div>
            </div>
            <div class="fee-cont profile-section" id="What's Included?">
              <div class="title">
                <h3><img :src="`${iconUrl}Asset 562.svg`" /> ELEMENTS IN STARTING FEE</h3>
              </div>
              <div class="cblock">
                <div class="cheader">
                  <div class="first-column">
                    <div>
                      <img :src="`${iconUrl}Asset 543.svg`" />
                      {{ vendor.eventCategory.fullTitle }}
                    </div>
                    <span>QTY</span>
                  </div>
                  <div class="second-column">
                    <span>QTY</span>
                  </div>
                </div>
                <div class="citems">
                  <vendor-starting-fee-item
                    v-for="(fv, fvIndex) in getStartingFeeItems()"
                    :key="`vendor-starting-fee-${fvIndex}`"
                    :item="fv"
                  />
                </div>
              </div>
            </div>
            <div class="extra-cont profile-section" id="Extras">
              <div class="title">
                <h3><img :src="`${iconUrl}Asset 526.svg`" />WITH EXTRA PAY</h3>
              </div>
              <div class="cblock">
                <div class="cheader">
                  <div>
                    <img :src="`${iconUrl}Asset 543.svg`" />
                    {{ vendor.eventCategory.fullTitle }}
                  </div>
                  <span class="text-center">QTY</span>
                  <span class="text-center">Price</span>
                </div>
                <div class="citems">
                  <div class="citem">
                    <vendor-extra-pay-item
                      v-for="(cs, index) in getExtraPayItems()"
                      :key="`extra-${index}`"
                      :item="cs"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="policy-cont profile-section" id="Policy">
              <div class="title"><img :src="`${iconUrl}Group 1471 (2).svg`" /> OUR POLICY</div>
              <div class="rules">
                <div class="rule" v-for="(y, yIndex) in vendor.yesRules" :key="`yes-${yIndex}`">
                  <div class="item">{{ y.name }}</div>
                  <div class="item">
                    <img :src="`${iconUrl}Group 5479 (2).svg`" v-if="vendor.yesRules.includes(y)" />
                  </div>
                </div>
                <div class="rule" v-for="(n, nIndex) in vendor.noRules" :key="`rule-${nIndex}`">
                  <div class="item">{{ n.name }}</div>
                  <div class="item">
                    <img :src="`${iconUrl}Group 5489 (4).svg`" v-if="vendor.noRules.includes(n)" />
                  </div>
                </div>
              </div>
              <div class="not-allowed" v-if="vendor.eventCategory.key == 'venuerental'">
                <h5>We don't allow these 3rd party vendor:</h5>
                <p>{{ mergeStringItems(vendor.notAllowed) }}</p>
              </div>
              <div
                class="dont-work"
                v-if="
                  vendor.selectedWeekdays && vendor.exDonts && vendor.selectedWeekdays.length && vendor.exDonts.length
                "
              >
                <h5>We don't work on:</h5>
                <div class="item" v-if="mergeStringItems(vendor.selectedWeekdays)">
                  <img :src="`${iconUrl}Group 5489 (4).svg`" />
                  {{ mergeStringItems(vendor.selectedWeekdays) }}
                </div>
                <div class="item" v-for="(r, rIndex) in vendor.exDonts" :key="rIndex">
                  <img :src="`${iconUrl}Group 5489 (4).svg`" />
                  {{ r.holiday }}
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
            </div>
            <div class="pricing-policy-cont profile-section" id="Pricing Policy">
              <div class="title"><img :src="`${iconUrl}Asset 560.svg`" /> OUR PRICING POLICY</div>
              <div class="rules">
                <div class="rule" v-for="(policy, yIndex) in validPricingPolicy" :key="yIndex">
                  <div class="item">{{ policy.name }}</div>
                  <div class="item">
                    <span v-if="!policy.isPercentage || policy.unit === '$'">$</span>
                    <span>{{ policy.value | withComma }}</span>
                    <span v-if="policy.isPercentage">%</span>
                    <span class="ml-50" v-if="policy.hasOwnProperty('attendees')">
                      {{ policy.attendees }} attendees
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
            <vendor-detail-reviews></vendor-detail-reviews>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import VueElementLoading from "vue-element-loading";
import Vendors from "@/models/Vendors";
import VendorDetailReviews from "./components/VendorDetailReviews";
import { capitalize } from "@/utils/string.util";
//COMPONENTS
import Icon from "@/components/Icon/Icon.vue";
import VendorServiceItem from "./components/VendorServiceItem.vue";
import carousel from "vue-owl-carousel";
import VendorStartingFeeItem from "./components/VendorStartingFeeItem.vue";
import VendorExtraPayItem from "./components/VendorExtraPayItem.vue";
import _ from "underscore";
import VendorImagesList from "./components/VendorImagesList.vue";
import HeaderImageCarousel from "@/components/HeaderImageCarousel";
export default {
  name: "vendor-signup-step4",
  props: {
    categories: Array,
    icon: String,
    vendor: Object,
  },
  components: {
    VueElementLoading,
    VendorServiceItem,
    carousel,
    VendorStartingFeeItem,
    VendorExtraPayItem,
    VendorDetailReviews,
    VendorImagesList,
    HeaderImageCarousel,
  },
  data() {
    return {
      tabs: ["About", "What's Included?", "Extras", "Policy", "Pricing Policy", "Reviews"],

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
    };
  },
  created() {},
  mounted() {},
  methods: {
    getExtraPayItems() {
      let extraPayItems = [];
      _.each(this.vendor.services, (item) => {
        if (!item.included) {
          extraPayItems.push(item);
        }
      });
      return extraPayItems;
    },
    getStartingFeeItems() {
      let startingFeeItems = [];
      _.each(this.vendor.services, (item) => {
        if (item.included) {
          startingFeeItems.push(item);
        }
      });
      return startingFeeItems;
    },
    prev() {
      const ww = this.vendor.vendorImages.length * 700;
      const sw = this.$refs.imagesCont.clientWidth;
      if (ww / sw > 2) {
        this.imageSlidePos += 700 * 4;
      } else if (ww / sw > 1) {
        this.imageSlidePos += (ww % sw) + 60;
      } else {
        this.imageSlidePos;
      }
    },
    next() {
      const ww = this.vendor.vendorImages.length * 700;
      const sw = this.$refs.imagesCont.clientWidth;
      if (ww / sw > 2) {
        this.imageSlidePos -= 700 * 4;
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
          naItems += `${capitalize(n.name)}, `;
        } else {
          naItems += `${capitalize(n)}, `;
        }
      });
      naItems = naItems.substring(0, naItems.length - 2);
      return naItems;
    },
    dontWorkDays() {
      let selectedDates = "";
      _.each(this.vendor.dontWorkDays.selectedDates, (s) => {
        selectedDates += `${s.date}, `;
      });
      selectedDates = selectedDates.substring(0, selectedDates.length - 2);
      return selectedDates;
    },
    dontWorkTime() {
      return `${this.vendor.dontWorkTime.startTime.hh}:${this.vendor.dontWorkTime.startTime.mm}:${this.vendor.dontWorkTime.amPack.start} ~ ${this.vendor.dontWorkTime.endTime.hh}:${this.vendor.dontWorkTime.endTime.mm}:${this.vendor.dontWorkTime.amPack.end}`;
    },
    getGalleryImages: function () {
      let temp = [];
      if (!this.vendor.vendorImages) return [];
      if (this.vendor.vendorImages.length > 0) {
        this.vendor.vendorImages.forEach((item, index) => {
          temp.push({
            thumb: item,
            src: item,
            caption: index,
          });
        });
        console.log(temp);
        return temp;
      } else {
        return [];
      }
    },
    view() {
      if (this.$refs.lightbox) {
        this.$refs.lightbox.showImage(0);
      }
    },
  },
  computed: {
    validPricingPolicy() {
      if (this.vendor.pricingPolicies) return this.vendor.pricingPolicies.filter((item) => item.value);
      return null;
    },
  },
  filters: {},
  watch: {},
};
</script>
<style lang="scss" scoped>
.vendor-detail-summary {
  font-family: Manrope-Regular, sans-serif;
  padding: 60px 120px;
  .inside-container {
    display: flex;
    color: #050505;

    .left-side {
      flex: 1;
      .tabs {
        display: flex;
        flex-direction: column;
        .tab {
          padding: 1rem 0rem;
          cursor: pointer;
          position: relative;
          &.active {
            font: bold 16px Manrope-Regular, sans-serif;
            .point {
              background-color: #f51355;
            }
          }
          .point {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: inline-block;
            background-color: #818080;
            margin-right: 30px;
          }
          &:not(:last-child)::after {
            content: "";
            position: absolute;
            border-left: dashed 1px #050505;
            height: 50px;
            left: 5px;
            top: 33px;
          }
        }
      }
    }
    .right-side {
      flex: 5;
      max-width: 80%;
      .card {
        background-color: #ffffff;
        box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
        .banner {
          overflow: hidden;
          width: 100%;
          position: relative;
          .header-carousel {
            .carousel-image {
              height: 500px;
              object-fit: cover;
            }
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
          }
        }
        .about-cont {
          padding-bottom: 60px;
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
                  width: 40px;
                  margin: 0 1rem;
                }
              }
            }
            .title {
              margin: 2rem 0 1rem 0;
              img {
                width: 20px;
                margin-right: 1rem;
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
            padding: 2rem 0;
            border-top: 1px solid #dddddd;

            .items {
              display: flex;
              white-space: nowrap;
              margin-top: 2rem;

              .item {
                font: bold 16px Manrope-Regular, sans-serif;
                a {
                  color: #050505;
                  text-decoration: underline;
                }
                img {
                  width: 24px;
                  height: 24px;
                  // margin-right: 1rem;
                }
              }
            }
          }
        }
        .fee-cont {
          border-top: 2px solid #818080;
          margin-left: -60px;
          margin-right: -60px;
          padding: 30px 60px 60px 60px;
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
              grid-template-columns: 48% 48%;
              grid-gap: 4%;
              padding: 1rem 0 1rem 60px;
              background: #ededed;
              margin-left: -60px;
              // width: 100%;
              font: bold 16px Manrope-Regular, sans-serif;

              .first-column {
                display: grid;
                grid-template-columns: 70% 30%;
                align-items: center;
                margin-right: 1rem;
              }
              .second-column {
                text-align: right;
                margin-right: 1rem;
              }

              img {
                width: 24px;
                margin-right: 1rem;
              }
              span {
                text-align: right;
                // margin-right: 5rem;
              }
            }
            .citems {
              width: 100%;
              display: grid;
              align-items: center;
              grid-column-gap: 4%;
              grid-template-columns: 48% 48%;
            }
          }
        }
        .extra-cont {
          border-top: 2px solid #818080;
          margin-left: -60px;
          margin-right: -60px;
          padding: 30px 60px 60px 60px;

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
              padding: 1rem 0 1rem 60px;
              background: #ededed;
              margin: 0 -60px;
              width: calc(100% - 5rem);
              font: bold 16px Manrope-Regular, sans-serif;

              img {
                width: 24px;
                margin-right: 1rem;
              }
            }
            .citems {
              .citem {
                width: calc(100% - 5rem - 60px);
                border-bottom: 1px solid #dddddd;
                cursor: pointer;
              }
            }
          }
        }
        .policy-cont {
          border-top: 2px solid #818080;
          border-bottom: 2px solid #818080;
          padding: 60px;
          margin: auto -60px;

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
        }
        .pricing-policy-cont {
          padding: 60px 60px 0 60px;
          margin: 0 -60px;
          border-bottom: 2px solid #818080;
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
              margin: 2rem 0 1rem -60px;
              padding-left: 60px;
              width: 80%;
            }
          }
          .signatures {
            display: grid;
            grid-template-columns: 50% 50%;
          }
        }
        .review-cont {
          padding: 60px 0 0 0;
          .review-list {
            .review-list-item {
              padding: 30px 0px;
              border-bottom: solid 1px #b7b7b7;
            }
          }
        }
        .profile-section {
          .title {
            img {
              width: 30px;
              margin-right: 1rem;
            }
          }
        }
      }
    }
  }
  .mr-1 {
    margin-right: 1rem;
  }
}
</style>
