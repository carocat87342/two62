<template>
  <div class="proposal-page_details">
    <div class="proposal-content">
      <md-button
        v-if="!landingPage"
        class="close-btn md-simple maryoku-btn md-black md-icon-button"
        @click="closeDetail"
      >
        <md-icon>close</md-icon>
      </md-button>
      <div class="proposal-info">
        <div class="proposal-header" :style="`background: url('${headerBackgroundImage}') center center no-repeat`">
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
                <div class="info-text" v-if="!vendorProposal.suggestionDate">
                  {{ eventData.eventStartMillis | formatDate }}
                </div>
                <div v-else>
                  {{ eventDate() }}
                  <!-- {{ new Date(vendorProposal.suggestionDate[0].date).getTime() | formatTime }} -->
                </div>
              </li>
              <li class="event-details__item">
                <label>Guest Arrival Time</label>
                <div class="info-text">
                  {{ eventData.eventStartMillis | formatTime }}
                </div>
              </li>
            </ul>
          </div>
<!--          <timer-panel-->
<!--            class="time-counter"-->
<!--            :target="targetTime"-->
<!--            :pending="negotiationPending"-->
<!--            :approved="negotiationProcessed"-->
<!--            @updateExpireDate="updateExpireDate"-->
<!--            :theme="theme"-->
<!--          ></timer-panel>-->
        </div>

        <div class="proposal-body">
          <md-button class="md-simple md-icon-button md-raised save-btn" @click="favorite">
            <img
              :src="`${$iconURL}${
                vendorProposal.isFavorite ? 'Requirements/Group+16153.svg' : 'comments/SVG/heart-dark.svg'
              }`"
            />
          </md-button>

          <h1 class="font-size-30">
            Dear {{ nonMaryoku ? vendorProposal.eventData.customer.name : $store.state.auth.user.name }},
          </h1>
          <p>
            {{ vendorProposal.personalMessage }}
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
            <carousel :items="4" :margin="25" :dots="false" :nav="false" class="proposal-images-carousel">
              <template slot="prev">
                <span class="prev handle-btn">
                  <md-icon>keyboard_arrow_left</md-icon>
                </span>
              </template>

              <div v-for="item in vendorProposal.inspirationalPhotos.filter((item) => !!item)" :key="item.url">
                <img class="item" :src="item.url" />
                <div class="mt-5">{{ item.caption }}</div>
              </div>
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
        </div>
      </div>

      <div class="proposal-section pricing-section">
        <div class="proposal-section__title font-size-22 font-bold-extra">
          <img
            src="https://static-maryoku.s3.amazonaws.com/storage/icons/budget+screen/SVG/Asset%2010.svg"
            width="15"
          />
          Pricing & Details
          <span class="font-regular font-size-16">*We work only with our catering</span>
        </div>
        <div class="mt-20 mb-10">What would you like to take from our suggested services?</div>
        <event-proposal-price
          :proposalData="vendorProposal"
          :serviceCategory="vendorProposal.vendor.vendorCategory"
          :key="`${vendorProposal.vendor.vendorCategory}-section`"
          @changeAddedServices="updateAddedServices"
          @changeBookedServices="changeBookedServices"
          :mandatory="true"
        ></event-proposal-price>
        <event-proposal-price
          v-for="service in this.vendorProposal.additionalServices"
          :proposalData="vendorProposal"
          :serviceCategory="service"
          :key="`secondary-${service}-section`"
          @changeBookedServices="changeBookedServices"
        ></event-proposal-price>
        <div
          class="bundle-section d-flex justify-content-between align-center"
          v-if="vendorProposal.bundleDiscount && vendorProposal.bundleDiscount.isApplied && checkedAllBundledOffers"
        >
          <div>
            <span class="font-size-30 font-bold">Bundle offer</span>
            <span>{{ vendorProposal.bundleDiscount.percentage }}%</span>
            <span>{{ getBundleServices(vendorProposal.bookedServices) }}</span>
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
      </div>

      <div
        v-if="
          vendorProposal.vendor.healthPolicy ||
          (vendorProposal.vendor.guaranteed && vendorProposal.vendor.guaranteed.length)
        "
        class="proposal-section policy-section"
      >
        <div class="proposal-section__title"><img :src="`${$iconURL}union-12.svg`" width="20" /> Health policy</div>

        <div class="policy-content">
          <template v-if="vendorProposal.vendor.healthPolicy">
            <div class="mt-20 font-bold-extra">
              <span class="color-red">COVID 19</span>
              - Exceptional Policy
            </div>
            <p class="my-10">
              {{ vendorProposal.vendor.healthPolicy }}
            </p>
          </template>
          <template v-if="vendorProposal.vendor.guaranteed && vendorProposal.vendor.guaranteed.length">
            <div class="mt-30 font-bold-extra">Guaranteed with every staff member:</div>
            <div class="md-layout mt-20">
              <div
                v-for="option in guaranteedOptions"
                class="md-layout-item md-size-30 py-10"
                :key="option.value"
                :style="{ display: vendorProposal.vendor.guaranteed.includes(option.value) ? '' : 'none' }"
              >
                <div v-if="vendorProposal.vendor.guaranteed.includes(option.value)" class="d-flex align-center">
                  <img class="mr-10" :src="`${$iconURL}Vendor Signup/Group 5479 (2).svg`" width="30px" />
                  {{ option.label }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="proposal-section policy-section">
        <div class="proposal-section__title">
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

          <cancellation-policy></cancellation-policy>

          <div class="side-label">
            <div class="label-value">Act of God</div>
          </div>
          <div class="rules">
            <span class="font-bold"> {{ vendorProposal.vendor.companyName }}</span>
            is not liable for any acts of God, dangerous incident to the sea, fires, acts of government or other
            authorities, wars, acts of terrorism, civil unrest, strikes, riots, thefts, pilferage, epidemics,
            quarantines, other diseases, climatic aberrations, or from any other cause beyond company’s control.
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
      </div>
    </div>

    <div class="book-proposal-form" v-if="!isLoading">
      <div class="form-title">
        Would You Like To Book
        <a :href="`/#/vendors/${this.vendorProposal.vendor.id}/detail`" target="_blank" class="font-bold-extra">
          {{ vendorProposal.vendor.companyName }} </a
        >?
      </div>
      <div class="agree-checkbox" v-if="this.vendorProposal.suggestionDate">
        <md-checkbox v-model="acceptNewTimes">I agree to the new time of this proposal</md-checkbox>
        <div class="alert alert-danger">Please indicate that you accept the new time of this proposal</div>
      </div>
    </div>
    <div v-if="!landingPage" class="proposal-footer white-card d-flex justify-content-between">
      <div>
        <md-button @click="back" class="md-simple maryoku-btn md-black">
          <md-icon>arrow_back</md-icon>
          Back
        </md-button>
        <md-button @click="scrollToTop" class="md-button md-simple md-just-icon md-theme-default scroll-top-button">
          <img :src="`${$iconURL}Budget+Requirements/Asset+49.svg`" width="17" />
        </md-button>
      </div>
      <div>
        <md-menu md-size="medium" md-align-trigger md-direction="top-end" class="schedule-menu">
          <md-button md-menu-trigger class="md-simple maryoku-btn md-black">
            <span class="font-size-16"> Contact vendor </span>
          </md-button>
          <md-menu-content>
            <md-menu-item class="text-center" @click="negotiate">
              <span class="font-size-16 font-bold-extra"> Negotiate rate </span>
            </md-menu-item>
            <md-menu-item class="text-center" @click="askQuestion">
              <span class="font-size-16 font-bold-extra"> Ask question </span>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
        <md-button
          class="md-red maryoku-btn"
          @click="bookVendor"
          :disabled="this.vendorProposal.suggestionDate && !acceptNewTimes"
          >Book this vendor
        </md-button>
      </div>
    </div>
  </div>
</template>

<script>
//MAIN MODULES
import ChartComponent from "@/components/Cards/ChartComponent";
import CancellationPolicy from "@/components/CancellationPolicy";
import { ChartCard } from "@/components";
import _ from "underscore";

// import auth from '@/auth';
import moment from "moment";
import carousel from "vue-owl-carousel";

import { mapState, mapMutations, mapGetters, mapActions } from "vuex";

import { Tabs, Modal, Loader } from "@/components";

// import EventBudgetVendors from "../components/EventBudgetVendors";
// import EditEventBlocksBudget from "../components/EditEventBlocksBudget";
import Proposal from "@/models/Proposal";

//COMPONENTS

import SideBar from "@/components/SidebarPlugin/NewSideBar";
import SidebarItem from "@/components/SidebarPlugin/NewSidebarItem.vue";
import { GuaranteedOptions } from "@/constants/options";
import { NEGOTIATION_REQUEST_STATUS, NEGOTIATION_REQUEST_TYPE } from "@/constants/status";
// import ProgressSidebar from "../components/progressSidebar";

import HeaderActions from "@/components/HeaderActions";
// import CommentEditorPanel from "../components/CommentEditorPanel";
import { CommentMixins, ShareMixins } from "@/mixins";
import ExtraServiceItem from "./ExtraServiceItem";
import IncludedServiceItem from "./IncludedServiceItem.vue";
import { socialMediaBlocks } from "@/constants/vendor";
import EventProposalPrice from "./EventProposalPrice.vue";
// import TimerPanel from "../components/TimerPanel.vue";
import Swal from "sweetalert2";

export default {
  components: {
    Tabs,
    // EventBudgetVendors,
    ChartComponent,
    ChartCard,
    SideBar,
    SidebarItem,
    Modal,
    // EditEventBlocksBudget,
    carousel,
    // ProgressSidebar,
    HeaderActions,
    // CommentEditorPanel,
    CancellationPolicy,
    ExtraServiceItem,
    IncludedServiceItem,
    EventProposalPrice,
    Loader,
    // TimerPanel,
  },
  props: {
    vendorProposal: {
      type: Object,
      default: () => {},
    },
    category: {
      type: String,
    },
    landingPage: {
      type: Boolean,
      default: false,
    },
    nonMaryoku: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "red",
    },
  },
  mixins: [CommentMixins, ShareMixins],
  data() {
    return {
      // auth: auth,
      showCommentEditorPanel: false,
      calendarEvent: {},
      selectedComponents: [],
      currentTab: "blocks",
      eventId: null,
      isLoading: true,
      event: {
        statistics: {},
      },
      routeName: null,
      budgetPerEmployee: 0,
      menuIconsURL: "https://static-maryoku.s3.amazonaws.com/storage/icons/menu%20_%20checklist/SVG/",
      iconsURL: "https://static-maryoku.s3.amazonaws.com/storage/icons/Event%20Page/",
      submitProposalIcon: "https://static-maryoku.s3.amazonaws.com/storage/icons/Submit%20Proposal/",
      // vendorProposal: {},
      extraTotal: 0,
      serverUrl: process.env.SERVER_URL,
      images: [],
      attachedFiles: [],
      fetchingAllAttachments: false,
      acceptNewTimes: false,
      expand: true,
      extraServices: [],
      showAboutUs: false,
      addedServices: {},
      socialMediaBlocks,
      guaranteedOptions: GuaranteedOptions,
    };
  },
  created() {
    this.extraServices = this.vendorProposal.extraServices[this.vendorProposal.vendor.eventCategory.key];
  },

  methods: {
    ...mapMutations("EventPlannerVuex", [
      "setEventModal",
      "setEditMode",
      "setModalSubmitTitle",
      "setEventModalAndEventData",
      "setNumberOfParticipants",
      "setEventData",
    ]),
    ...mapActions("event", ["updateProposal"]),
    getBundleServices(bundleServices) {
      const serviceNames = bundleServices.map((service) => {
        return this.getCategory(service).title;
      });
      return serviceNames.join(" + ");
    },
    getCategory(key) {
      return this.categories.find((item) => item.key === key);
    },
    back() {
      this.$router.go(-1);
    },
    negotiate() {},
    askQuestion() {},
    bookVendor() {
      new Proposal({ ...this.vendorProposal }).save().then((proposal) => {
        this.$router.push({
          name: "CheckoutWithVendor",
          params: {
            proposalId: this.vendorProposal.id,
          },
        });
      });
    },
    getEvent() {},
    scrollToTop() {
      window.scrollTo(0, 0);
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
    getImages() {
      let vm = this;
      this.images = [];
      this.attachedFiles = [];

      this.vendorProposal.attachements.forEach((item, index) => {
        const fullPath = `${this.serverUrl}/1/proposal-requests/${vm.$route.params.proposalId}/files/${item.id}`;

        this.$http.get(fullPath, { headers: this.$auth.getAuthHeader() }).then((response) => {
          if (response && response.headers) {
            if (response.headers["content-type"].indexOf("image") > -1) {
              this.images.push({
                thumb: fullPath,
                src: fullPath,
                caption: "",
                srcset: "",
              });
            } else {
              this.attachedFiles.push({
                fullPath: fullPath,
                tag: item.tag,
                name: item.name,
              });
            }
          }

          if (index + 1 == vm.vendorProposal.attachements.length) {
            setTimeout(function () {
              vm.fetchingAllAttachments = true;
            }, 2000);
          }
        });
      });
    },
    toggleCommentMode(mode) {
      this.showCommentEditorPanel = mode;
    },
    exportToPdf() {
      this.$refs.html2Pdf.generatePdf();
    },
    isSocial() {
      let isBlank = true;
      _.each(this.vendorProposal.vendor.social, (s) => {
        isBlank &= s === null;
      });

      return !isBlank;
    },
    updateAddedServices({ category, costServices, extraServices }) {
      this.vendorProposal.costServices[category] = costServices;
      this.vendorProposal.extraServices[category] = extraServices;
      this.$emit("updateProposal", this.vendorProposal);
    },
    closeDetail() {
      this.$emit("close");
    },
    updateExpireDate() {
      console.log("updateExpireDate");
      this.$emit("ask", "expiredDate");
    },
    async changeBookedServices() {
      await this.$store.dispatch("event/updateProposal", {
        category: this.category,
        proposal: this.vendorProposal,
      });
    },
    favorite() {
      this.$emit("favorite", !this.vendorProposal.isFavorite);
    },
  },
  computed: {
    ...mapState("event", ["eventData", "eventModalOpen", "modalTitle", "modalSubmitTitle", "editMode"]),
    ...mapGetters({
      components: "event/getComponentsList",
    }),
    targetTime() {
      return new Date(this.vendorProposal.expiredDate);
    },
    negotiationProcessed() {
      // return !!this.vendorProposal.negotiations.length && this.vendorProposal.negotiations.every(it =>
      //     it.status === NEGOTIATION_REQUEST_STATUS.PROCESSED && it.type === NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME)
      return false;
    },
    negotiationPending() {
      console.log("negotiationPending", this.vendorProposal);
      return (
        !!this.vendorProposal.negotiations.length &&
        this.vendorProposal.negotiations.some(
          (it) => it.status === NEGOTIATION_REQUEST_STATUS.NONE && it.type === NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME,
        )
      );
    },
    extraMissingRequirements() {
      return _.union(this.vendorProposal.extras, this.vendorProposal.missing);
    },
    headerBackgroundImage() {
      if (this.vendorProposal.coverImage && this.vendorProposal.coverImage[0]) return this.vendorProposal.coverImage[0];
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
    checkedAllBundledOffers() {
      return (
        this.vendorProposal.bundleDiscount.services &&
        this.vendorProposal.bundleDiscount.services.length &&
        this.vendorProposal.bookedServices.length &&
        this.vendorProposal.bundleDiscount.services.every((it) => this.vendorProposal.bookedServices.includes(it))
      );
    },
    tax() {
      if (!this.vendorProposal.taxes) return { percentage: 0, price: 0 };
      let tax = this.vendorProposal.taxes["total"];
      if (!tax) {
        tax = { price: 0, percentage: 0 };
      }
      return tax;
    },
    discount() {
      if (!this.vendorProposal.discounts) return { percentage: 0, price: 0 };
      let discount = this.vendorProposal.discounts["total"];
      if (!discount) {
        discount = { price: 0, percentage: 0 };
      }
      return discount;
    },
    bundledDiscountPrice() {
      let bundledServicePrice = 0;

      if (!this.checkedAllBundledOffers) return 0;
      this.vendorProposal.bundleDiscount.services.forEach((serviceCategory) => {
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
      return (bundledServicePrice * this.vendorProposal.bundleDiscount.percentage) / 100 || 0;
    },

    totalPriceOfProposal() {
      let totalPrice = 0;
      this.vendorProposal.bookedServices.forEach((serviceCategory) => {
        const sumOfService = this.vendorProposal.costServices[serviceCategory].reduce((s, service) => {
          return service.isComplimentary ? s : s + service.requirementValue * service.price;
        }, 0);
        totalPrice += sumOfService;
      });

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
  filters: {
    formatDate: function (date) {
      return moment(date).format("MMM Do YYYY ");
    },
    formatTime: function (date) {
      return moment(date).format("h:00 A");
    },
    formatDuration: function (startDate, endDate) {
      return moment(endDate).diff(startDate, "hours");
    },
  },
  watch: {
    proposal(newVal) {},
  },
};
</script>

<style lang="scss" scoped>
.md-layout,
.md-layout-item {
  width: initial;
}

.tab-content {
  background-color: transparent !important;
}
.time-counter {
  position: absolute;
  right: 30px;
  top: 60px;
}
.proposal-page {
  &_details {
    .alert-danger {
      background-color: #ffe5ec;
      font-size: 12px;
      color: #050505;
      margin-left: 1em;
      box-shadow: none;
      padding: 0.6em 1.4em;
      display: inline-block;
    }

    .proposal-content {
      // margin: 0 2em;
      position: relative;
      .save-btn {
        position: absolute;
        right: 20px;
        top: 20px;
        width: 50px;
        height: 50px;
        z-index: 2;
        background: white !important;
        border-radius: 50%;
        box-shadow: none;

        /deep/ .md-ripple {
          padding: 0px;
        }
        img.non-selected {
          padding: 3px;
        }
        img {
          width: 50px;
          height: 50px;
        }
      }
      .close-btn {
        position: absolute;
        right: 20px;
        top: 30px;
        font-size: 40px !important;
        i {
          font-size: 28px;
        }
      }
      .proposal-info {
        background: #fff;
        box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
      }

      .proposal-header {
        background-size: cover !important;
        height: 500px;
        position: relative;
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
        position: relative;

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
          flex-flow: wrap;
          .item {
            padding: 5px;
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
    .back-btn {
      .md-ripple {
        color: #000;
        font-weight: 800;
        text-transform: capitalize;
      }
    }

    .book-proposal-form {
      padding: 2em;
      border-bottom: 1px solid #cfcfcf;

      .form-title {
        font-size: 28px;
        color: #050505;
        margin-bottom: 1em;

        a {
          color: #050505;
          text-decoration: underline;

          &:hover {
            color: #cd1047;
          }
        }
      }

      .agree-checkbox {
        position: relative;

        .alert-danger {
          position: absolute;
          left: -20px;
          top: 100%;
          margin: 0;
          padding: 0.6em 3em;

          &:after {
            bottom: 100%;
            left: 1.6em;
            border: solid transparent;
            content: " ";
            height: 0;
            width: 0;
            position: absolute;
            pointer-events: none;
            border-bottom-color: #ffe5ec;
            border-width: 10px;
          }
        }
      }
    }
  }

  &_header {
    padding: 0.5em 1em;
    font-size: 30px;
    a {
      text-decoration: underline;
      font-weight: 800;
      font-size: 30px;
      color: #050505 !important;
      text-transform: capitalize;
    }

    img {
      width: 30px;
      margin-right: 0.5em;
    }
  }
}
</style>


