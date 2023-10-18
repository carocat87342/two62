<template>
  <section class="proposal-content">
    <section class="proposal-info">
      <section class="proposal-header" :style="`background: url('${headerBackgroundImage}') center center no-repeat`">
        <div class="event-info">
          <div class="section-header d-flex justify-content-start">
            <h3>Event Information & Details</h3>
            <div class="alert alert-danger mb-0" v-if="vendorProposal.suggestionDate">
              <span v-if="getDiffDaysFromOriginal() < 0" class="whitspace-nowrap">
                This proposal is {{ -getDiffDaysFromOriginal() }}days before your original date
              </span>
              <span v-else class="whitspace-nowrap">
                This proposal is {{ getDiffDaysFromOriginal() }}days later your original date
              </span>
            </div>
          </div>
          <ul class="event-details mt-20">
            <li class="event-details__item">
              <label>Name</label>
              <div class="info-text">
                {{ eventData.title || (eventData.concept ? eventData.concept.title : "Untitled event") }}
              </div>
            </li>
            <li class="event-details__item">
              <label>Date</label>
              <div class="info-text" v-if="vendorProposal.nonMaryoku">
                    {{ eventData.startTime * 1000 | date("MMM Do YYYY") }}
              </div>
              <div class="info-text" v-else-if="!vendorProposal.suggestionDate">
                {{ eventData.eventStartMillis | date("MMM Do YYYY") }}
              </div>
              <div v-else>
                {{ eventDate() }}
                <!-- {{ new Date(vendorProposal.suggestionDate[0].date).getTime() | formatTime }} -->
              </div>
            </li>
            <li class="event-details__item">
              <label>Guest Arrival Time</label>
              <div class="info-text" v-if="vendorProposal.nonMaryoku">
                {{ eventData.startTime * 1000 | date("MMM Do YYYY") }}
              </div>
              <div class="info-text" v-else>
                {{ eventData.eventStartMillis | date("MMM Do YYYY") }}
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section class="proposal-body">
        <h1 class="font-size-30 text-capitalize" v-if="eventData.hasOwnProperty('owner') && eventData.owner">Dear {{ eventData.owner.name }},</h1>
        <h1 class="font-size-30 text-capitalize" v-else-if="eventData.hasOwnProperty('customer')">Dear {{ eventData.customer.name }},</h1>
        <p class="mt-10">
          {{ vendorProposal.personalMessage }}

          <!-- <br />Sincerely,
                    <span class="proposal-title">{{ vendorProposal.vendor.vendorDisplayName }}</span> -->
        </p>
        <div class="vision mt-30 font-size-22 mb-40">
          <div class="font-bold">
            <img :src="`${$iconURL}Vendor+Landing+Page/Asset+491.svg`" />
            Our vision for your event
          </div>
          <p class="mt-10">{{ vendorProposal.eventVision }}</p>
        </div>
        <div class="proposal-images mb-40">
          <div class="font-bold mb-10">Some references to the experience you will get from us</div>
          <div class="html2pdf__page-break" />
          <carousel :items="4" :margin="25" :dots="false" :nav="false" class="proposal-images-carousel">
            <template slot="prev">
              <span class="prev handle-btn">
                <md-icon>keyboard_arrow_left</md-icon>
              </span>
            </template>

            <template v-if="vendorProposal.inspirationalPhotos">
              <div v-for="item in vendorProposal.inspirationalPhotos.filter((item) => !!item)" :key="item.url">
                <img class="item" :src="item.url" />
                <div class="mt-5">{{ item.caption }}</div>
              </div>
            </template>
            <template slot="next">
              <span class="next handle-btn">
                <md-icon>keyboard_arrow_right</md-icon>
              </span>
            </template>
          </carousel>
        </div>
        <div class="about-us mb-40">
          <md-button class="md-red edit-btn md-simple" @click="showAboutUs = !showAboutUs">
            <span class="color-red font-bold">
              About Us <md-icon class="color-red">keyboard_arrow_right</md-icon>
            </span>
          </md-button>
          <div class="about-content mt-10" v-if="showAboutUs">{{ vendorProposal.vendor.about.company }}</div>
        </div>
        <div class="contact-section mb-40">
          <div class="proposal-section__title font-size-22 font-bold-extra">Contact Us</div>
          <ul class="contact-list_items d-flex justify-content-start">
            <li class="contact-list_item" v-if="vendorProposal.vendor.vendorMainEmail">
              <a href>
                <img :src="`${submitProposalIcon}Asset 286.svg`" />
                {{ vendorProposal.vendor.vendorMainEmail }}
              </a>
            </li>
            <li class="contact-list_item" v-if="vendorProposal.vendor.vendorAddressLine1">
              <a href>
                <img :src="`${submitProposalIcon}Asset 285.svg`" />
                {{ vendorProposal.vendor.vendorAddressLine1 }}
                {{ vendorProposal.vendor.vendorAddressLine2 }}
              </a>
            </li>
            <li class="contact-list_item" v-if="vendorProposal.vendor.vendorMainPhoneNumber">
              <a href>
                <img :src="`${submitProposalIcon}Asset 284.svg`" />
                {{ vendorProposal.vendor.vendorMainPhoneNumber }}
              </a>
            </li>
          </ul>
        </div>
        <div class="social-section mb-30" v-if="isSocial()">
          <div>Website & social</div>
          <div class="items mt-10">
            <div
              class="item"
              v-for="(s, sIndex) in socialMediaBlocks"
              :key="sIndex"
              :class="{ 'mr-20': vendorProposal.vendor.social[s.name] }"
            >
              <a
                v-if="vendorProposal.vendor.social[s.name]"
                :href="vendorProposal.vendor.social[s.name]"
                target="_blank"
              >
                <img :src="`${$iconURL}Vendor Signup/${s.icon}`" class="page-icon" />
                {{ vendorProposal.vendor.social[s.name] }}
              </a>
            </div>
          </div>
        </div>
        <div class="attachment-section mb-30" v-if="attachments && attachments.length > 0">
          <div class="attachment-tag-list">
            <div
              class="attachment-tag"
              v-for="(attachment, index) in attachments.filter((attachement) => attachement.url)"
              :key="index"
            >
              <img :src="`${$iconURL}common/pin-red.svg`" />
              <a class="color-red" :href="attachment.url" target="_blank">{{ attachment.name }}</a>
            </div>
          </div>
        </div>
      </section>
    </section>
    <section class="proposal-section pricing-section">
      <div class="proposal-section__title font-size-22 font-bold-extra px-40">
        <img src="https://static-maryoku.s3.amazonaws.com/storage/icons/budget+screen/SVG/Asset%2010.svg" width="15" />
        Pricing & Details
        <span class="font-regular font-size-16">*We work only with our catering</span>
      </div>
      <div class="px-40 mt-20 mb-10">What would you like to take from our suggested services?</div>
      <EventProposalPrice
        :proposalData="vendorProposal"
        :serviceCategory="vendorProposal.vendor.vendorCategory"
        :key="`${vendorProposal.vendor.vendorCategory}-section`"
        @changeAddedServices="updateAddedServices"
        :mandatory="true"
      ></EventProposalPrice>
      <EventProposalPrice
        v-for="service in this.vendorProposal.additionalServices"
        :proposalData="vendorProposal"
        :serviceCategory="service"
        :key="`secondary-${service}-section`"
        :mandatory="true"
      ></EventProposalPrice>
      <div
        class="bundle-section d-flex justify-content-between align-center"
        v-if="vendorProposal.bundleDiscount && vendorProposal.bundleDiscount.isApplied"
      >
        <div>
          <span class="font-size-30 font-bold">Bundle offer</span>
          <span>{{ vendorProposal.bundleDiscount.percentage }}%</span>
          <span>{{ getBundleServices(vendorProposal.bundleDiscount.services) }}</span>
        </div>
        <div class="font-size-30 font-bold">-${{ bundledDiscountPrice | withComma }}</div>
      </div>
      <div class="total-section d-flex justify-content-between mt-15">
        <div>
          <span class="font-bold-extra font-size-30">Total</span>
        </div>
        <div>
          <span class="font-bold-extra font-size-30">${{ discounedAndTaxedPrice | withComma }}</span>
        </div>
      </div>
    </section>
    <section v-if="vendorProposal.vendor.healthPolicy || vendorProposal.vendor.guaranteed && vendorProposal.vendor.guaranteed.length"
           class="proposal-section policy-section"
      >
          <div class="proposal-section__title px-40">
              <img :src="`${$iconURL}union-12.svg`" width="20" /> Health policy
          </div>

          <div class="policy-content">
              <template v-if="vendorProposal.vendor.healthPolicy">
                  <div class="mt-20 font-bold-extra">
                      <span class="color-red">COVID 19</span>
                      - Exceptional Policy
                  </div>
                  <p class="my-10">
                      {{vendorProposal.vendor.healthPolicy}}
                  </p>
              </template>
              <template v-if="vendorProposal.vendor.guaranteed && vendorProposal.vendor.guaranteed.length">
                  <div class="mt-30 font-bold-extra">Guaranteed with every staff member:</div>
                  <div class="md-layout mt-20">
                      <div v-for="option in guaranteedOptions" class="md-layout-item md-size-30 py-10" :key="option.value"
                           :style="{display: vendorProposal.vendor.guaranteed.includes(option.value)? '': 'none'}">
                          <div v-if="vendorProposal.vendor.guaranteed.includes(option.value)" class="d-flex align-center">
                              <img class="mr-10" :src="`${$iconURL}Vendor Signup/Group 5479 (2).svg`" width="30px">
                              {{option.label}}
                          </div>
                      </div>
                  </div>
              </template>

          </div>
    </section>

    <section class="proposal-section policy-section">
      <div class="proposal-section__title px-40">
        <img :src="`${submitProposalIcon}Asset 287.svg`" width="20" /> Our Policy
      </div>

      <div class="policy-content">
        <div class="side-label">
          <div class="label-value">Our Policy</div>
        </div>
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
              <span class="mr-10" v-if="!policy.value && policy.cost"> {{ `$ ${policy.cost}` }} </span>
            </div>
            <div class="item text-right" v-else>
              <span v-if="policy.type === 'Number' && !policy.isPercentage && policy.unit !== 'hour'">$</span>
              <span v-if="policy.type === 'Boolean'">
                <img
                  v-if="policy.value === true"
                  :src="`${$iconURL}Vendor Signup/Group 5479 (2).svg`"
                  class="page-icon"
                />
                <img v-else :src="`${$iconURL}Vendor Signup/Group 5489 (4).svg`" class="page-icon" />
                <!-- {{ policy.value === true ? "Yes" : "No" }} -->
              </span>
              <span v-else>
                <img
                  class="page-icon"
                  v-if="policy.value === true"
                  :src="`${$iconURL}Vendor Signup/Group 5479 (2).svg`"
                />
                <img
                  class="page-icon"
                  v-else-if="policy.value === false"
                  :src="`${$iconURL}Vendor Signup/Group 5489 (4).svg`"
                />
                <span v-else>{{ policy.value }}</span>
              </span>
              <span v-if="policy.unit === 'hour'">Hour{{ policy.value > 1 ? "s" : "" }}</span>
              <span v-if="policy.isPercentage">%</span>
              <span class="ml-50" v-if="policy.hasOwnProperty('attendees')"> {{ policy.attendees }} attendees </span>
            </div>
          </div>
        </div>
        <div class="rules" v-if="additionalRules && additionalRules.length > 0">
          <h5 class="font-bold font-size-20">Additional Rules</h5>
          <div class="rule" v-for="(policy, yIndex) in additionalRules" :key="yIndex">
            <div class="item">Event must be {{ policy }}</div>
          </div>
        </div>
        <div class="side-label">
          <div class="label-value">Our cancellation approach</div>
        </div>

        <div class="proposal-section__subtitle">
          <div class="subtitle">We allow free cancellation until:</div>
          <div class="desc">30 days before the event</div>
        </div>

        <CancellationPolicy></CancellationPolicy>

        <div class="side-label">
          <div class="label-value">Act of God</div>
        </div>
        <div class="rules">
          <span class="font-bold"> {{ vendorProposal.vendor.companyName }}</span>
          is not liable for any acts of God, dangerous incident to the sea, fires, acts of government or other
          authorities, wars, acts of terrorism, civil unrest, strikes, riots, thefts, pilferage, epidemics, quarantines,
          other diseases, climatic aberrations, or from any other cause beyond company’s control.
        </div>

        <div class="signature-section">
          <div class="signature-section__vendor">
            {{ vendorProposal.vendor.vendorDisplayName }}
          </div>
          <div class="signature-section__image">
            <img :src="vendorProposal.vendor.signature" />
          </div>
        </div>
      </div>
    </section>
    <md-button class="md-simple md-just-icon md-round modal-default-button" @click="$emit('close')">
      <md-icon>close</md-icon>
    </md-button>
  </section>
</template>
<script>
import moment from "moment";
import { socialMediaBlocks } from "@/constants/vendor";
import { GuaranteedOptions } from "@/constants/options";
import _ from "underscore";

const components = {
    carousel: () => import('vue-owl-carousel'),
    EventProposalPrice: () => import("../../Events/Proposal/EventProposalPrice.vue"),
    CancellationPolicy: () => import("@/components/CancellationPolicy.vue")
}

export default {
  components,
  props: {
    vendorProposal: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      menuIconsURL: "https://static-maryoku.s3.amazonaws.com/storage/icons/menu%20_%20checklist/SVG/",
      iconsURL: "https://static-maryoku.s3.amazonaws.com/storage/icons/Event%20Page/",
      submitProposalIcon: "https://static-maryoku.s3.amazonaws.com/storage/icons/Submit%20Proposal/",
      eventData: {},
      showAboutUs: false,
      socialMediaBlocks,
      addedServices: {},
      guaranteedOptions: GuaranteedOptions,
      editingNewSeating: false,
    };
  },
  mounted() {
    console.log("detail.mounted", this.vendorProposal);
    if (this.vendorProposal.nonMaryoku) {
      this.eventData = this.vendorProposal.eventData;

    } else {
      this.eventData = this.vendorProposal.proposalRequest.eventData;
    }
      console.log("detail.mounted", this.eventData);
  },
  computed: {
    extraMissingRequirements() {
      return _.union(this.vendorProposal.extras, this.vendorProposal.missing);
    },
    headerBackgroundImage() {
      if (this.vendorProposal.coverImage && this.vendorProposal.coverImage[0])
        return this.vendorProposal.coverImage[0];
      if (this.vendorProposal.inspirationalPhotos && this.vendorProposal.inspirationalPhotos[0])
        return this.vendorProposal.inspirationalPhotos[0].url;
      if (this.vendorProposal.vendor.images && this.vendorProposal.vendor.images[0])
        return this.vendorProposal.vendor.images[0];
      if (this.vendorProposal.vendor.vendorImages && this.vendorProposal.vendor.vendorImages[0])
        return this.vendorProposal.vendor.vendorImages[0];

      return "";
    },
    attachments() {
      if (this.vendorProposal.attachments && this.vendorProposal.attachments.length > 0)
        return this.vendorProposal.attachments;
      if (this.vendorProposal.vendor.attachments && this.vendorProposal.vendor.attachments.length > 0)
        return this.vendorProposal.vendor.attachments;
      return [];
    },
    validPolicy() {
      if (this.vendorProposal.vendor.policies)
        return this.vendorProposal.vendor.policies.filter(
          (item) => item.hasOwnProperty("value") || (item.type === "Including" && item.cost),
        );
      return null;
    },
    additionalRules() {
      return this.vendorProposal.vendor.additionalRules;
    },
    categories() {
      return this.$store.state.common.serviceCategories;
    },
    tax() {
      if (!this.vendorProposal.taxes) return { percentage: 0, price: 0 };
      let tax = this.vendorProposal.taxes["total"];
      if (!tax) {
        tax = { price: 0, percentage: 0 };
      }
      console.log("tax", tax);
      return tax;
    },
    discount() {
      if (!this.vendorProposal.discounts) return { percentage: 0, price: 0 };
      let discount = this.vendorProposal.discounts["total"];
      if (!discount) {
        discount = { price: 0, percentage: 0 };
      }
      console.log("discount", discount);
      return discount;
    },
    bundledDiscountPrice() {
      let bundledServicePrice = 0;
        let services =
            this.vendorProposal.bundleDiscount && this.vendorProposal.bundleDiscount.isApplied
                ? this.vendorProposal.bookedServices
                : this.vendorProposal.bundleDiscount.services;
      if (!services) return 0;
      services.forEach((serviceCategory) => {
        const sumOfService = this.vendorProposal.costServices[serviceCategory].reduce((s, service) => {
          return service.isComplimentary ? s : s + service.requirementValue * service.price;
        }, 0);
        bundledServicePrice += sumOfService;
        if (this.addedServices[serviceCategory]) {
          const sumOfService = this.addedServices[serviceCategory].reduce((s, service) => {
            return service.isComplimentary ? s : s + service.requirementValue * service.price;
          }, 0);
          bundledServicePrice += sumOfService;
        }
      });
      return (bundledServicePrice * this.vendorProposal.bundleDiscount.percentage) / 100;
    },

    totalPriceOfProposal() {
      let totalPrice = 0;
      Object.keys(this.vendorProposal.costServices).forEach((serviceCategory) => {
        const sumOfService = this.vendorProposal.costServices[serviceCategory].reduce((s, service) => {
          return service.isComplimentary ? s : s + service.requirementValue * service.price;
        }, 0);
        console.log("sumOFserive", sumOfService);
        totalPrice += sumOfService;
      });

      console.log(this.addedServices);
      // added service item price
      Object.keys(this.addedServices).forEach((serviceCategory) => {
        const sumOfService = this.addedServices[serviceCategory].reduce((s, service) => {
          return s + service.requirementValue * service.price;
        }, 0);
        totalPrice += sumOfService;
      });
      return totalPrice;
    },
    discounedAndTaxedPrice() {
      const discounted =
        this.totalPriceOfProposal -
        (this.totalPriceOfProposal * this.discount.percentage) / 100 -
        this.bundledDiscountPrice;
      return discounted + (discounted * this.tax.percentage) / 100;
    },
  },
  methods: {
    getDiffDaysFromOriginal() {
      const suggestionDate = this.vendorProposal.suggestionDate;
      if (!this.eventData) return "-";

      let orignStartDate = moment(new Date(this.eventData.eventStartMillis));
      if (suggestionDate && suggestionDate.length > 0) {
        let suggestedDate = moment(suggestionDate[0].date, "DD/MM/YYYY");
        return suggestedDate.diff(orignStartDate, "days");
      }
      return 0;
    },
    eventDate() {
      const suggestionDate = this.vendorProposal.suggestionDate;
      if (!this.eventData) return "-";

      let startDate = new Date(this.eventData.eventStartMillis);
      let endDate = new Date(this.eventData.eventEndMillis);
      if (suggestionDate && suggestionDate.length > 0) {
        return `${moment(suggestionDate[0].date, "DD/MM/YYYY").format("MMM D, YYYY")} - ${moment(
          suggestionDate[suggestionDate.length - 1].date,
          "DD/MM/YYYY",
        ).format("MMM D, YYYY")}`;
      }
      return `${moment(startDate).format("MMM D, YYYY")} - ${moment(endDate).format("MMM D, YYYY")}`;
    },
    getBundleServices(bundleServices) {
      const serviceNames = bundleServices.map((service) => {
        return this.getCategory(service).title;
      });
      return serviceNames.join(" + ");
    },
    getCategory(key) {
      return this.categories.find((item) => item.key === key);
    },
    isSocial() {
      let isBlank = true;
      _.each(this.vendorProposal.vendor.social, (s) => {
        isBlank &= s === null;
      });

      return !isBlank;
    },
    updateAddedServices({ category, services }) {
      this.addedServices[category] = services;
      this.addedServices = { ...this.addedServices };
    },
  },
  watch: {
    vendorProposal(newVal, oldVal) {
      console.log("download", this.vendorProposal);
      this.eventData = this.vendorProposal ? this.vendorProposal.proposalRequest.eventData : {};
    },
  },
};
</script>
<style lang="scss" scoped>
.proposal-content {
  position: relative;
  text-align: left !important;
  background-color: white;

  .proposal-info {
    background: #fff;
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
  }

  .proposal-header {
    background-size: cover !important;
    height: 500px;

    .event-info {
      background: rgba(255, 255, 255, 0.76);
      align-items: center;
      padding: 2.5em;

      h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 800;
        color: #050505;
      }
    }

    .event-details {
      list-style: none;
      display: flex;
      flex-direction: row;
      margin: 0;
      padding: 0;

      &__item {
        font-size: 14px;
        padding-bottom: 10px;

        &:not(:last-child) {
          border-right: 1px solid #818080;
          padding-right: 80px;
          margin-right: 80px;
        }

        label {
          font-weight: 800;
          margin-bottom: 1em;
        }

        .info-text {
          color: #050505;
        }
      }
    }
  }

  .md-rose {
    &.md-outline {
      background: none !important;
      border: none;
      box-shadow: none;
      min-width: auto;

      .md-ripple {
        color: #f51355;
        font-size: 14px;
        font-weight: 800;
        padding: 0 !important;
        text-transform: capitalize;

        .md-icon {
          color: #f51355 !important;
        }
      }
    }
  }

  .proposal-body {
    padding: 1em 2.5em;

    h1 {
      margin: 1em 0 0;
      font-size: 28px;
      font-weight: 800;
      color: #050505;
    }

    p {
      font-size: 14px;
      color: #050505;

      .proposal-title {
        font-weight: 800;
        display: block;
      }
    }

    .proposal-includes {
      margin: 3em 0;
      padding-right: 20%;

      &__title {
        margin-bottom: 1em;
      }

      &__item {
        display: inline-block;
        width: 29%;
        margin-bottom: 1.5em;

        img {
          width: 20px;
          margin-right: 1em;
        }
      }
    }
  }

  .proposal-section {
    &__title {
      font-size: 20px;
      font-weight: 800;
      color: #050505;

      img {
        margin-right: 0.2em;
      }

      small {
        margin-top: 0.5em;
        font-size: 14px;
        color: #050505;
        display: block;
      }
    }

    &.contact-section {
      border-top: 1px solid #808181;
      padding: 2em 2.5em;
    }
  }

  .social-section {
    .items {
      display: flex;
      align-content: center;

      .item {
        a {
          color: black;
        }

        img {
          width: 20px !important;
          height: 20px;
        }
      }
    }
  }

  .attachment-section {
    .attachment-tag {
      border: solid 1px #f51355;
      display: inline-block;
      padding: 15px;
      border-radius: 3px;
      margin-right: 10px;
    }
  }

  .pricing-section {
    margin-top: 4em;

    &__table,
    &__list {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0 1em;

      margin-top: 1em;

      > tbody {
        tr {
          height: 90px !important;

          td {
            padding: 20px 25px;

            &:nth-child(3) {
              text-align: right;
            }
          }
        }
      }

      .taxes {
        background-color: #e0e0e0;
        color: #818080;
        font-size: 14px;
      }

      .total {
        color: #fff;
        background-color: #424242;
        font-size: 18px;
        font-weight: bold;
      }

      .element-pricing-table {
        padding: 1.5em;
        font-family: "Manrope-Regular", sans-serif;

        &.elements-list {
          background: #f7f7f7;
          margin-bottom: -21px;

          th,
          td {
            font-size: 16px;
          }

          th {
            font-family: "Manrope-ExtraBold", sans-serif;
            padding-bottom: 15px;
          }

          tr {
            td {
              font-weight: normal;
              border-top: 1px solid #ddd;
              padding: 21px 0;

              &.element-actions {
                .md-button {
                  visibility: hidden;
                }
              }
            }

            &:hover {
              td {
                font-weight: bold;

                &.element-actions {
                  .md-button {
                    visibility: visible;
                  }
                }
              }
            }
          }
        }

        &.taxes-list {
          background: #ededed;
          color: #818080;
          padding: 0.6em 1.5em;
          border-top: 1px solid;

          tr {
            &:first-child {
              td {
                border-bottom: 1px solid;
              }
            }

            td {
              .taxes-title {
                display: inline-block;
                width: 90px;
              }

              .taxes-percentage {
                margin-left: 1em;
              }

              &.element-actions {
                .md-button {
                  visibility: hidden;
                }
              }
            }
          }
        }

        &.total-list {
          background: #404040;
          color: #fff;
          margin-bottom: 3em;

          td {
            .discount-details {
              color: #fff !important;
            }

            small {
              display: block;
            }

            &.element-actions {
              .md-button {
                visibility: hidden;
              }
            }
          }
        }

        table {
          width: 100%;
          border-collapse: collapse;

          thead {
            text-align: left;
          }

          td,
          th {
            &:nth-last-child(2):not(:first-child),
            &:nth-last-child(3):not(:first-child),
            &:nth-last-child(4):not(:first-child) {
              width: 150px;
              text-align: center;
            }

            .md-button {
              img {
                width: 15px;
              }
            }

            &.element-actions {
              width: 20px;
            }

            &.element-value {
              text-align: right !important;
              padding-right: 44px;
            }
          }
        }
      }
    }

    &__item {
      padding: 40px 60px;
    }
  }

  .attachments-list {
    &_items {
      list-style: none;
      padding: 0;
      margin: 1.5em 0 0;
    }

    &_item {
      display: inline-block;

      &:not(:last-child) {
        margin-right: 1em;
      }

      a {
        border-radius: 3px;
        border: solid 1px #f51355;
        text-align: center;
        font-size: 14px;
        color: #f51355;
        display: inline-block;
        padding: 8px 20px;
        font-weight: 400;
        text-transform: capitalize;

        .md-icon {
          color: #f51355 !important;
          font-size: 18px !important;
        }
      }
    }
  }

  .bundle-section {
    padding: 40px 60px;
    background-color: #ffedb7;
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
    border-radius: 3px;
  }

  .policy-section {
    margin-top: 4em;

    .proposal-section__subtitle {
      color: #050505;
      margin: 1em auto;

      .subtitle {
        font-size: 18px;
        font-weight: 800;
      }

      .desc {
        font-size: 14px;
      }
    }

    .side-label {
      font-size: 18px;
      font-weight: 800;
      color: #050505;
      margin: 3em 0 1.5em;
      position: relative;

      &:before {
        content: " ";
        position: absolute;
        background-color: #ededed;
        width: 288px;
        height: 53px;
        top: -15px;
        left: -2.5em;
      }

      .label-value {
        position: relative;
        z-index: 999;
      }
    }

    .policy-content {
      margin-top: 1.5em;
      background: #fff;
      box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
      padding: 2em 2.5em;

      .rules {
        width: 80%;
        padding-right: 20%;

        .rule {
          border-top: solid 1px #ddd;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 0px;
          padding-right: 50%;

          &:last-child {
            border-bottom: solid 1px #ddd;
          }
        }
      }
    }
  }

  .policies-list {
    font-size: 14px;
    color: #050505;

    &__item {
      width: 42%;
      display: inline-block;
      margin-bottom: 1em;

      b {
        font-size: 18px;
        font-weight: 800;
      }
    }
  }

  .additional-info {
    margin-top: 1em;
    font-size: 14px;
    color: #050505;

    &__title {
      font-weight: 800;
      margin-bottom: 0.5em;
    }

    &__content {
      width: 59%;
    }
  }

  .signature-section {
    margin-top: 3em;

    &__vendor {
      font-size: 14px;
      font-weight: 800;
      color: #050505;
      text-decoration: underline;
    }

    &__image {
      img {
        width: 200px;
      }
    }
  }

  .contact-list {
    &_items {
      padding: 0;
      margin: 1em 0 0;
      list-style: none;
    }

    &_item {
      margin-right: 3em;

      a {
        color: #050505;
        text-decoration: underline;

        &:hover {
          color: #000;
        }

        img {
          width: 20px;
          margin-right: 1em;
        }
      }
    }
  }
}

.total-section {
  color: white;
  background-color: #404040;
  padding: 40px 60px;
  border-radius: 3px;
}

.proposal-footer {
  text-align: center;
  padding: 40px;
}

.vision {
  img {
    width: 25px;
    margin-right: 10px;
  }
}

.proposal-images {
  &-carousel {
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

      &.next {
        right: 20px;
      }

      &.prev {
        left: 20px;
      }
    }

    .item {
      height: 200px;
      object-fit: cover;
      border-radius: 5px;
      overflow: hidden;
    }
  }
}
</style>
