<template>
  <div class="proposal-review">
    <div class="white-card">
      <div class="proposal-review-header">
        <carousel
          :items="1"
          :margin="0"
          :dots="false"
          :nav="false"
          class="header-carousel"
          :key="`carousel-${coverImage.length}`"
        >
          <template slot="prev">
            <span class="prev handle-btn">
              <md-icon>keyboard_arrow_left</md-icon>
            </span>
          </template>
          <img :src="item" v-for="(item, index) in coverImage" :key="`carousel-item-${index}`" class="carousel-image" />
          <template slot="next" v-if="coverImage.length > 1">
            <span class="next handle-btn">
              <md-icon>keyboard_arrow_right</md-icon>
            </span>
          </template>
        </carousel>
        <div class="preview-header-content">
          <div class="summary-cont">
            <div class="upper">
              <h3>{{ title }}</h3>
              <div class="warning-days" v-if="warning">
                <img :src="`${iconUrl}Asset 575.svg`" /> This proposal is 2 days before the original date
              </div>
            </div>
            <ul>
              <li>
                <span>Name</span>
                <p>{{ event.title }}</p>
              </li>
              <li>
                <span>Date</span>
                <p>{{ $dateUtil.formatScheduleDay(event.eventStartMillis, "MM.DD.YY") }}</p>
              </li>
              <li>
                <span>Guest Arrival Time</span>
                <p>{{ event.arrival }}</p>
              </li>
            </ul>
          </div>
        </div>
        <md-button class="md-vendor maryoku-btn change-cover-btn" @click="chooseFiles">
          <img :src="`${$iconURL}Campaign/Group 2344.svg`" class="mr-10" style="width: 20px" />
          <span>Change Cover</span>
        </md-button>
        <input
          style="display: none"
          id="coverImage"
          name="attachment"
          type="file"
          multiple="multiple"
          @change="onFileChange"
        />
      </div>
      <div class="event-summary-body">
        <div class="cover-letter font-bold-extra mb-50">
          <h4 class="font-bold-extra text-transform-uppercase">
            Dear {{ event.customer ? event.customer.name : "Planner" }},
          </h4>
          <textarea v-model="personalMessage"> </textarea>
        </div>

        <div class="vision-section">
          <div class="font-size-22 font-bold-extra mt-30 mb-20">
            <img :src="`${$iconURL}Vendor+Landing+Page/Asset+491.svg`" class="page-icon" />
            Our vision for your event
          </div>
          <div>
            {{ eventVision }}
          </div>
        </div>
        <div class="font-bold mb-10">Some references to the experience you will get from us</div>
        <proposal-inspirational-photos class="mb-60"></proposal-inspirational-photos>
        <md-button class="md-simple edit-btn md-vendor mb-30" @click="savedItModal = true">
          About us
          <md-icon>navigate_next</md-icon>
        </md-button>
        <div class="about-company">
          {{ vendor.about.company }}
        </div>
        <div class="contact-cont">
          <h4>Contact Us</h4>
          <ul>
            <li>
              <img :src="`${iconUrl}Asset 593.svg`" />
              <span>{{ vendor.vendorMainEmail }}</span>
            </li>
            <li>
              <img :src="`${iconUrl}Asset 573.svg`" />
              <span>{{ vendor.vendorAddressLine1 }}</span>
            </li>
            <li v-if="vendor.vendorMainPhoneNumber">
              <img :src="`${iconUrl}Asset 591.svg`" />
              <span>{{ vendor.vendorMainPhoneNumber }}</span>
            </li>
          </ul>
        </div>
        <attachment-tag-list
          class="mt-40"
          :defaultValue="attachments"
          theme="purple"
          @add="addNewAttachment"
          @remove="removeAttachment"
        ></attachment-tag-list>
      </div>
    </div>
    <div class="pricing-cont">
      <div class="title">
        <h4><img :src="`${iconUrl}Asset 576.svg`" />Pricing & Details</h4>
        <p v-if="vendor.vendorCategory === 'venuerental'">
          <template v-if="vendor.notAllowedThirdParty === 1">
            *Work only with our {{ vendor.eventCategory.fullTitle }}
          </template>
          <template v-if="vendor.notAllowedThirdParty === 2">
            *We don't work with these third party venodrs: {{ mergeStringItems(vendor.notAllowed) }}
          </template>
        </p>
      </div>
      <p>What would you like to take from our suggested services?</p>
      <proposal-pricing-item
        :iconUrl="iconUrl"
        :categoryIcon="`${iconUrl}Asset 614.svg`"
        :itemType="`price`"
        :category="c"
        v-for="(c, cIndex) in categories.filter((category) => this.pricesByCategory[category] > 0)"
        :key="cIndex"
      />
      <proposal-pricing-item :iconUrl="iconUrl" :itemType="`bundle`" v-if="bundleDiscount.isApplied" />
      <div class="total-proposal-price">
        <div class="d-flex justify-content-between">
          <div class="font-size-22 font-bold">Total</div>
          <div class="font-size-20 font-bold">${{ Number(totalPriceOfProposal) | withComma }}</div>
        </div>
        <div class="d-flex justify-content-between" v-if="bundleDiscount && bundleDiscount.isApplied">
          <div class="font-size-16">Before Bundle Offer</div>
          <div class="font-size-16 crosslinedText">${{ Number(totalBeforeBundle) | withComma }}</div>
        </div>
        <div class="d-flex justify-content-between" v-if="defaultDiscount.percentage">
          <div class="font-size-16">Before Discount</div>
          <div class="font-size-16">
            ({{ defaultDiscount.percentage }}% off)
            <span class="crosslinedText"> ${{ Number(totalBeforeDiscount) | withComma }} </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="vendor.healthPolicy || (vendor.guaranteed && vendor.guaranteed.length)" class="policy-cont">
      <div class="title">
        <img class="mr-10" :src="`${$iconURL}union-12.svg`" width="26px" />
        Health policy
      </div>
      <div class="policy-wrapper">
        <template v-if="vendor.healthPolicy">
          <div class="rule font-bold-extra my-20">
            <span class="color-vendor">COVID 19</span>
            - Exceptional Policy
          </div>
          <p class="width-66">
            {{ vendor.healthPolicy }}
          </p>
        </template>
        <template v-if="vendor.guaranteed && vendor.guaranteed.length">
          <div class="mt-30 font-bold-extra">Guaranteed with every staff member:</div>
          <div class="md-layout mt-20">
            <div
              v-for="option in guaranteedOptions"
              class="md-layout-item md-size-30 py-10"
              :key="option.value"
              :style="{ display: vendor.guaranteed.includes(option.value) ? '' : 'none' }"
            >
              <div v-if="vendor.guaranteed.includes(option.value)" class="d-flex align-center">
                <img class="mr-10" :src="`${$storageURL}ok%20check%20V.svg`" width="30px" />
                {{ option.label }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div
      class="white-card mt-20 additional-requirements"
      v-if="vendor.vendorCategory === 'venuerental' && sittingArrangement && Object.keys(sittingArrangement).length"
    >
      <div class="p-40">
        <div>
          <img :src="`${$iconURL}common/seating-purple.png`" />
          <span class="font-size-30 font-bold ml-20"> Seating Arrangement </span>
        </div>
        <div class="mt-40">
          <div class="d-flex align-stretch seats-list">
            <div class="d-flex mb-30">
              <template v-for="(sit, index) in sittingArrangement.options">
                <div
                  v-if="sit.selected"
                  :key="`sitarrangement-${index}`"
                  class="d-flex flex-column justify-content-between seat-type"
                >
                  <div class="font-bold">'{{ sit.item }}'</div>
                  <div><img :src="`${$iconURL}Requirements/${sit.icon}`" /></div>
                </div>
              </template>
              <div v-if="sittingArrangement.hasOtherOption" class="d-flex flex-column seat-type">
                <div class="font-bold">'Other'</div>
                <div class="mt-20">{{ sittingArrangement.otherOptionContent }}</div>
              </div>
            </div>
            <div v-if="!editingNewSeating" class="d-flex align-center">
              <md-button class="md-simple md-outlined md-vendor maryoku-btn" @click="editingNewSeating = true">
                Suggest new seating arrangement
              </md-button>
            </div>
            <div v-else class="p-10" style="min-width: 350px">
              <div class="font-bold mb-10">Suggest new seating arrangement</div>
              <textarea v-model="suggestedNewSeatings" rows="4" placeholder="Type your idea here"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="policy-cont">
      <div class="title">
        <h4><img :src="`${iconUrl}Asset 594.svg`" /> Our Policy</h4>
      </div>
      <div class="policy-wrapper">
        <div class="policy mb-50">
          <div class="mb-10" v-for="(policy, index) in vendor.yesRules" :key="index">
            <span class="font-bold" style="width: 50%; display: inline-block">{{ policy.name }}</span>
            <img :src="`${$iconURL}Vendor Signup/Group 5479 (2).svg`" class="label-icon" />
          </div>
          <div class="mb-10" v-for="(policy, index) in vendor.noRules" :key="index">
            <span class="font-bold" style="min-width: 50%; display: inline-block">{{ policy.name }}</span>
            <img :src="`${$iconURL}Vendor Signup/Group 5489 (4).svg`" class="label-icon" />
          </div>
        </div>
        <div class="cancellation">
          <h5 class="subtitle">Our cancellation approach</h5>
          <div id="Policy">
            <div class="rules">
              <div class="rule" v-for="(policy, yIndex) in cancellationData" :key="yIndex">
                <div class="item">
                  <span class="font-bold-extra">If</span> {{ policy.notice }}
                  <span class="font-bold-extra">Then</span>
                  {{ policy.vendorPayout }} <span class="font-bold-extra">and</span> {{ policy.cancellationFee }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cancellation">
          <h5 class="subtitle">Act of God</h5>
          <div id="Policy">
            <div class="rules">
              <span class="font-bold"> {{ vendor.companyName }}</span>
              is not liable for any acts of God, dangerous incident to the sea, fires, acts of government or other
              authorities, wars, acts of terrorism, civil unrest, strikes, riots, thefts, pilferage, epidemics,
              quarantines, other diseases, climatic aberrations, or from any other cause beyond company’s control.
            </div>
          </div>
        </div>
        <div class="cancellation">
          <h5 class="subtitle">Our Policy</h5>
          <div id="Policy">
            <div class="rules">
              <div class="rules">
                <div class="rule" v-for="(policy, yIndex) in validPolicy" :key="yIndex">
                  <div class="item">{{ policy.name }}</div>
                  <div class="item" v-if="policy.type === 'MultiSelection'">
                    <span class="mr-10" v-for="(v, vIndex) in policy.value" :key="`policy-${vIndex}`">{{
                      `${v}${vIndex == policy.value.length - 1 ? "" : ","}`
                    }}</span>
                  </div>
                  <div class="item" v-else-if="policy.type === 'Including'">
                    <span class="mr-10" v-if="policy.value"> Yes </span>
                    <span class="mr-10" v-if="!policy.value && policy.cost"> {{ `$ ${policy.cost}` }} </span>
                  </div>
                  <div class="item" v-else>
                    <span v-if="policy.type === 'Number' && !policy.isPercentage && policy.unit !== 'hour'">$</span>
                    <span v-if="policy.type === 'Boolean'">
                      <img v-if="policy.value === true" :src="`${$storageURL}ok%20check%20V.svg`" />
                      <img v-else :src="`${$iconURL}VendorsProposalPage/group-17076.svg`" />
                      <!-- {{ policy.value === true ? "Yes" : "No" }} -->
                    </span>
                    <span v-else>
                      <img v-if="policy.value === true" :src="`${$storageURL}ok%20check%20V.svg`" />
                      <img v-else-if="policy.value === false" :src="`${$iconURL}VendorsProposalPage/group-17076.svg`" />
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
            </div>
          </div>
          <div class="not-allowed mb-30" v-if="vendor.vendorCategories[0] == 'venuerental'">
            <h5>We don't allow these 3rd party vendor:</h5>
            <p>{{ mergeStringItems(vendor.notAllowed) }}</p>
          </div>
          <!-- <div class="dont-work mt-20">
              <h5>We don't work on:</h5>
              <div class="item" v-if="mergeStringItems(vendor.selectedWeekdays)">
                <img :src="`${$iconURL}Vendor Signup/Group 5489 (4).svg`" />
                {{ mergeStringItems(vendor.selectedWeekdays) }}
              </div>
              <div class="item" v-for="(d, dIndex) in vendor.exDonts" :key="dIndex">
                <img :src="`${$iconURL}Vendor Signup/Group 5489 (4).svg`" />
                {{ d.holiday }}
              </div>
              <div class="item" v-if="vendor.dontWorkDays && vendor.dontWorkDays.length > 0">
                <img :src="`${$iconURL}Vendor Signup/Group 5489 (4).svg`" />
                {{ dontWorkDays() }}
              </div>
              <div class="item" v-if="vendor.dontWorkTime">
                <img :src="`${$iconURL}Vendor Signup/Group 5489 (4).svg`" />
                {{ dontWorkTime() }}
              </div>
            </div> -->
        </div>
        <div class="cancellation pricing-policy-cont" id="Rules">
          <!-- <h5 class="subtitle">OUR PRICING POLICY</h5>
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
                  <span class="mr-10" v-if="!policy.value && policy.cost"> {{ `$ ${policy.cost}` }} </span>
                </div>
                <div class="item" v-else-if="policy.type === Boolean && policy.value && policy.discount">
                  <span class="mr-10" v-if="policy.hasOwnProperty('unit') && policy.unit === '$'"> $ </span>
                  <span class="mr-10" v-if="policy.discount"> {{ policy.discount }} </span>
                  <span class="mr-10" v-if="policy.hasOwnProperty('unit') && policy.unit === '%'"> % </span>
                </div>
                <div class="item" v-else>
                  <span v-if="policy.type === Number && !policy.isPercentage">$</span>
                  <span v-if="policy.value === true">Yes</span>
                  <span v-else>{{ policy.value }}</span>
                  <span v-if="policy.isPercentage">%</span>
                  <span class="ml-50" v-if="policy.hasOwnProperty('attendees')">
                    {{ policy.attendees }} attendees
                  </span>
                  <span class="ml-50" v-if="policy.unit">
                    {{ policy.unit }}
                  </span>
                </div>
              </div>
            </div> -->

          <div class="signature-wrapper">
            <div class="half-side">
              <h6>{{ vendor.companyName }}</h6>
              <div class="signature-client">
                <template v-if="vendor.signature == null && !signatureImage">
                  <div class="card red-border">
                    <div class="upload-cont">
                      <a class @click="uploadVendorSignature">
                        <img :src="`$${$iconURL}Vendor Signup/Asset 559.svg`" />
                        Choose File
                      </a>
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
                        @change="onUploadVendorSignature"
                      />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div
                    class
                    :style="`
                        background-image: url(${vendor.signature || signatureImage});width: 100%;
                        background-position: center;
                        background-repeat: no-repeat;
                        height: 162px;
                        background-size: contain;
                      `"
                  />
                </template>
              </div>
            </div>

            <div class="half-side">
              <h6>Client</h6>
              <div class="signature-client signature-bidder"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import ProposalPricingItem from "./ProposalPricingItem.vue";
import vueSignature from "vue-signature";
import ProposalInspirationalPhotos from "./ProposalInspirationalPhotos.vue";
import { getBase64 } from "@/utils/file.util";
import { capitalize } from "@/utils/string.util";
import _ from "underscore";
import AttachmentTagList from "../components/AttachmentTagList.vue";
import { PROPOSAL_DIRECTORY } from "@/constants/s3Directories";
import S3Service from "@/services/s3.service";
import carousel from "vue-owl-carousel";
import { GuaranteedOptions, CancellationData } from "@/constants/options";

export default {
  name: "proposal-event-summary",
  components: {
    ProposalPricingItem,
    ProposalInspirationalPhotos,
    vueSignature,
    AttachmentTagList,
    carousel,
  },
  props: {
    title: String,
    eventData: Object,
    isEdit: Boolean,
    iconUrl: String,
    itemType: String,
    services: Array,
  },
  data() {
    return {
      currentTab: 1,
      savedItModal: false,
      isTimeUp: false,
      hover: false,
      considerUpdate: false,
      warning: false,
      categories: [],
      signatureImage: "",
      cancellationData: CancellationData,
      option: {
        penColor: "rgb(0, 0, 0)",
        backgroundColor: "rgb(255,255,255)",
      },
      guaranteedOptions: GuaranteedOptions,
      editingNewSeating: false,
    };
  },
  created() {
    console.log(this.vendor);
    //Get attachments from vendor profile,
    this.$store.commit("proposalForNonMaryoku/setValue", { key: "attachments", value: this.vendor.attachments });
  },
  mounted() {
    this.savedItModal = false;
    this.isTimeUp = true;
    this.categories.push(this.vendor.vendorCategory);
    this.additionalServices.forEach((service) => {
      this.categories.push(service);
    });
  },
  methods: {
    chooseFiles() {
      document.getElementById("coverImage").click();
    },
    hideModal() {
      this.savedItModal = false;
    },
    mouseOver() {
      this.hover = true;
    },
    mouseLeave() {
      this.hover = false;
    },
    uploadVendorSignature(imageId = null, attachmentType = null) {
      this.$refs.signatureFile.click();
    },

    async onUploadVendorSignature(event) {
      this.signatureImage = await getBase64(event.target.files[0]);
    },
    save() {
      let _this = this;
      let jpeg = _this.$refs.signature.save("image/jpeg");
      this.$root.$emit("update-proposal-value", "signature", jpeg);
      console.log(this.vendor);
    },
    clear() {
      let _this = this;
      _this.$refs.signature.clear();
    },
    removeSignature() {},
    getServices(category) {
      if (this.tableCategory === "cost") return this.$store.state.proposalForNonMaryoku.costServices[category];
      else if (this.tableCategory === "included")
        return this.$store.state.proposalForNonMaryoku.includedServices[category];
      else if (this.tableCategory === "extra") return this.$store.state.proposalForNonMaryoku.extraServices[category];
    },
    flatDeep(arr, d = 1) {
      return d > 0
        ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? this.flatDeep(val, d - 1) : val), [])
        : arr.slice();
    },
    servicesByCategory(category) {
      const services = this.services.filter((s) => s.name == category);

      if (services.length > 0) {
        return this.flatDeep(
          services[0].categories.map((s) => s.subCategories.map((sc) => sc.items.map((dd) => dd.name))),
          Infinity,
        );
      } else {
        return [];
      }
    },
    selectedServices() {
      return this.event.components.filter((item) => this.categories.includes(item.componentId));
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
      if (naItems) return "All " + naItems;
      return "";
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
    async onFileChange(event) {
      let image = await getBase64(event.target.files[0]);
      this.coverImage = [image, ...this.coverImage];
    },
    addNewAttachment(file) {
      S3Service.fileUpload(file, file.name, `${PROPOSAL_DIRECTORY}/attachments/${this.vendor.id}`).then((res) => {
        const attachments = this.attachments ? [...this.attachments] : [];
        attachments.push({
          name: file.name,
          isRequired: false,
          fileName: file.name,
          url: `${res}`,
        });
        this.$store.commit("proposalForNonMaryoku/setValue", { key: "attachments", value: attachments });
      });
    },
    removeAttachment(index) {
      const attachments = this.attachments ? [...this.attachments] : [];
      attachments.splice(index, 1);
      this.$store.commit("proposalForNonMaryoku/setValue", { key: "attachments", value: attachments });
    },
  },
  computed: {
    ...mapGetters("proposalForNonMaryoku", [
      "totalPriceOfProposal",
      "totalBeforeDiscount",
      "totalBeforeBundle",
      "pricesByCategory",
    ]),
    personalMessage: {
      get() {
        return this.$store.state.proposalForNonMaryoku.personalMessage;
      },
      set(value) {
        this.$store.commit("proposalForNonMaryoku/setValue", { key: "personalMessage", value });
      },
    },
    attachments: {
      get() {
        return this.$store.state.proposalForNonMaryoku.attachments;
      },
      set(value) {
        this.$store.commit("proposalForNonMaryoku/setValue", { key: "attachments", value });
      },
    },
    sittingArrangement() {
      return this.$store.state.proposalForNonMaryoku.seatingData || {};
    },
    suggestedNewSeatings:{
      get() {
        return this.$store.state.proposalForNonMaryoku.suggestedNewSeatings;
      },
      set(value){
        this.$store.commit("proposalForNonMaryoku/setValue", { key: "suggestedNewSeatings", value });
      }
    },
    eventVision() {
      return this.$store.state.proposalForNonMaryoku.eventVision;
    },
    vendor() {
      return this.$store.state.proposalForNonMaryoku.vendor;
    },

    event() {
      return this.$store.state.proposalForNonMaryoku.eventData;
    },
    additionalServices() {
      return this.$store.state.proposalForNonMaryoku.additionalServices;
    },
    extraServices() {
      return this.event.components.filter((item) => item.componentId !== "unexpected");
    },
    step() {
      return this.$store.state.proposalForNonMaryoku.wizardStep;
    },
    validPolicy() {
      if (this.vendor.policies)
        return this.vendor.policies.filter(
          (item) => item.hasOwnProperty("value") || (item.type === "Including" && item.cost),
        );
      return null;
    },
    validPricingPolicy() {
      if (this.vendor.pricingPolicies)
        return this.vendor.pricingPolicies.filter(
          (item) => item.value || item.desc || (item.type === "Including" && item.cost),
        );
      return null;
    },
    headerBackgroundImage() {
      if (this.coverImage) return this.coverImage;
      if (this.vendor.images && this.vendor.images[0]) return this.vendor.images[0];
      if (this.vendor.vendorImages && this.vendor.vendorImages[0]) return this.vendor.vendorImages[0];
      return "";
    },
    coverImage: {
      get() {
        return this.$store.state.proposalForNonMaryoku.coverImage;
      },
      set(value) {
        this.$store.commit("proposalForNonMaryoku/setValue", { key: "coverImage", value });
      },
    },
    bundleDiscount() {
      return this.$store.state.proposalForNonMaryoku.bundleDiscount;
    },
    defaultTax() {
      return this.$store.state.proposalForNonMaryoku.taxes["total"] || { percentage: 0, price: 0 };
    },
    defaultDiscount() {
      return this.$store.state.proposalForNonMaryoku.discounts["total"] || { percentage: 0, price: 0 };
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
.proposal-review {
  border-radius: 3px;
  background-color: #f5f5f5;
  font-family: "Manrope-Regular", sans-serif;
  margin-top: 20px;
  color: #050505;
  .proposal-review-header {
    background-color: #ffffff;
    min-height: 500px;
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
        z-index: 2;
        cursor: pointer;
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
    .preview-header-content {
      position: absolute;
      width: 100%;
      left: 0;
      top: 0;
      z-index: 1;
      .summary-cont {
        padding: 60px;
        background: rgba(255, 255, 255, 0.7);
        .upper {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          h3 {
            font-size: 22px;
            font-weight: 800;
            margin: 0;
            margin-right: 36px;
          }
          .warning-days {
            padding: 12px 28px;
            background-color: #ffe5ec;
            display: inline-block;
            font-size: 14px;

            img {
              width: 27px;
              height: 27px;
              margin-right: 12px;
            }
          }
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;

          li {
            padding: 0 95px;
            border-right: 1px solid #818080;
            font-size: 16px;

            span {
              font-weight: 800;
              color: #818080;
            }
            p {
              margin: 0;
              margin-top: 13px;
              font-weight: normal;
            }

            &:first-child {
              padding-left: 0;
            }
            &:last-child {
              border: none;
            }
          }
        }
      }
    }
  }

  .about-company {
    word-break: break-word;
  }
  .change-cover-btn {
    transform: translate(-50%, -50%);
    position: absolute;
    left: 50%;
    top: 70%;
    z-index: 3;
  }
  .tabs-cont {
    display: flex;
    justify-content: flex-start;
    position: relative;
    text-align: center;
    border-radius: 3px;
    .tab-item {
      flex: 1;
      font-size: 22px;
      padding: 27px 0 32px 0;
      border: solid 3px #818080;
      cursor: pointer;

      span {
        color: #050505;
        font-weight: normal;
      }

      &:first-child {
        border-right: none;
      }
      &.active {
        border-top: solid 5px #641856;
        span {
          color: #641856;
          font-weight: 800;
        }
      }
    }
  }

  .event-summary-body {
    padding: 60px;
    .cover-letter {
      h4 {
        font-size: 30px;
        margin: 0;
        padding-bottom: 25px;
      }
      textarea {
        height: 170px;
        padding: 30px;
      }
      p {
        margin: 0;
        font-size: 14px;

        strong {
          text-transform: capitalize;
          font-weight: 800;
        }
      }
      span {
        display: inline-block;
        font-weight: 800;
        padding-top: 36px;
        padding-bottom: 60px;
        font-size: 16px;
        color: #641856;
        text-transform: capitalize;
        cursor: pointer;
        i {
          color: #641856;
        }
      }
    }
    .vision-section {
      margin-bottom: 50px;
      word-break: break-word;
    }
    .contact-cont {
      margin-top: 30px;
      h4 {
        font-size: 22px;
        font-weight: 800;
        margin: 0;
      }
      ul {
        display: flex;
        list-style: none;
        padding: 0;
        margin: 0;
        margin-top: 20px;
        li {
          font-size: 16px;
          margin-right: 55px;

          span {
            text-decoration: underline;
          }

          img {
            width: 26px;
            height: 26px;
            margin-right: 14px;
          }

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    .image-slider {
      padding-left: 60px;
      display: flex;
      overflow: hidden;

      .item {
        flex: 1;

        img {
          width: 30px;

          &.purple {
            filter: invert(16%) sepia(49%) saturate(2942%) hue-rotate(286deg) brightness(82%) contrast(97%);
          }
        }
      }
      a.more {
        cursor: pointer;
        position: absolute;
        background: white;
        border-radius: 20px;
        margin-top: 75px;
      }
    }

    .check-list-wrapper {
      padding: 0 60px;
      h4 {
        font-size: 22px;
        font-weight: 800;
        margin: 0;
        margin-top: 40px;
        margin-bottom: 30px;
        text-transform: capitalize;
      }
      ul {
        padding: 0;
        list-style: none;
        -webkit-column-count: 3;
        -moz-column-count: 3;
        column-count: 3;
        li {
          margin-bottom: 33px;

          i {
            color: #641856;
            font-size: 22px;
            margin-right: 22px;
          }
        }
      }
    }
  }
  .pricing-cont {
    padding: 30px 0;
    .title {
      display: flex;
      align-items: flex-end;
      background-color: #f5f5f5;
      padding-top: 23px;
      padding-bottom: 0px;

      h4 {
        font-size: 22px;
        font-weight: 800;
        margin: 0;
        margin-right: 10px;

        img {
          width: 22px;
          height: 22px;
          margin-right: 5px;
        }
      }
      p {
        font-size: 16px;
        margin: 0;
        color: #641856;
      }
    }
    p {
      font-size: 16px;
      font-weight: normal;
      margin-top: 14px;
      margin-bottom: 30px;
    }
  }

  .policy-cont {
    padding: 20px 0;
    .title {
      img {
        width: 30px;
        margin-right: 1rem;
      }
      font: 800 30px Manrope-Regular, sans-serif;
    }
    .rules {
      margin: 3rem 0;
      font-size: 18px;
      .rule {
        padding: 2rem 2rem 2rem 0;
        border-bottom: 1px solid #dddddd;
        display: flex;
        align-items: center;

        .item {
          flex: 1;

          img {
            width: 30px;
            &.purple {
              filter: invert(16%) sepia(49%) saturate(2942%) hue-rotate(286deg) brightness(82%) contrast(97%);
            }
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
    .title {
      display: flex;
      align-items: center;
      padding-bottom: 30px;
      position: relative;

      h4 {
        margin: 0;
        font-size: 30px;
        font-weight: 800;
        margin-right: 30px;

        img {
          width: 30px;
          margin-right: 16px;
        }
      }
      p {
        img {
          width: 27px;
          margin-right: 12px;
        }
      }
      .consider-update {
        position: absolute;
        background-color: #ffedb7;
        padding: 0px 15px 15px 15px;
        color: #050505;
        font-size: 14px;
        left: 180px;
        top: 70px;
        max-width: 350px;
        text-align: center;

        h3 {
          font-size: 20px;
          font-weight: 800;
        }
        p {
          font-size: 16px;
        }
        &::after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          top: 4px;
          left: 70px;
          box-sizing: border-box;

          border: 12px solid black;
          border-color: transparent transparent #ffedb7 #ffedb7;

          transform-origin: 0 0;
          transform: rotate(135deg);
        }
      }
    }
    .policy-wrapper {
      background: #ffffff;
      box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
      padding: 60px;

      .condition {
        h6 {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 8px;
          text-transform: none;
        }
        p {
          margin: 0;
          margin-bottom: 60px;
        }
      }
      .cancellation {
        h5.subtitle {
          margin: 0;
          padding: 15px 53px 20px 55px;
          margin-left: -60px;
          background-color: #ededed;
          display: inline-block;
          font-size: 20px;
          font-weight: 800;
          text-transform: none;
        }
        h6 {
          font-size: 20px;
          font-weight: 800;
          margin-top: 30px;
          margin-bottom: 8px;
          text-transform: none;
        }
        p {
          font-size: 16px;
          margin: 0;
        }
        .semi-column {
          display: flex;
          margin-top: 35px;

          p {
            flex: 1;
            margin: 0;
            font-size: 16px;
            strong {
              font-size: 20px;
              font-weight: 800;
            }
          }
        }
        .additional {
          margin-top: 60px;

          h6 {
            font-size: 16px;
            font-weight: 800;
          }
          p {
            margin-top: 13px;
            font-size: 16px;
          }
        }
        .signature-wrapper {
          display: grid;
          grid-gap: 20%;
          grid-template-columns: 40% 40%;
          padding-top: 60px;

          .half-side {
            text-align: center;
            h6 {
              text-transform: capitalize;
              text-decoration: underline;
              font-size: 16px;
              font-weight: 800;
              margin: 0;
            }

            .signature-client {
              margin-top: 23px;
              min-width: 350px;
              min-height: 270px;
              border: 1px dashed #641856 !important;
              border-radius: 3px;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            &:first-child {
              h6 {
                text-align: left;
              }
            }

            .upload-cont {
              a {
                margin: 0.5rem auto;
                display: inline-block;
                font: 800 14px Manrope-Regular, sans-serif;
                border: 1px solid #641856;
                padding: 0.5rem;
                color: #641856;
                cursor: pointer;
                img {
                  width: 10px;
                }
              }
              .sign-here {
                .save,
                .clear {
                  background-color: #ffffff;
                  font: 800 14px Manrope-Regular, sans-serif;
                  border: 1px solid #641856;
                  padding: 0.5rem;
                  color: #641856;
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
                right: 1rem;
                bottom: 3rem;
              }
            }
          }
        }
      }
    }
  }
  .hide {
    display: none !important;
  }
  .total-proposal-price {
    background-color: #404040;
    color: #ffffff;
    padding: 46px 50px 48px 60px;
    // box-shadow: 0 3px 41px 0 rgb(0 0 0 / 8%);
    border-radius: 3px;
  }
  .seats-list {
    flex-wrap: wrap;
    .seat-type {
      margin-right: 30px;
      position: relative;
      padding: 10px;
      &.suggested-seat {
        display: flex;
        justify-content: start;
        align-items: center;
      }
      &::after {
        content: "Or";
        position: absolute;
        left: 100%;
        top: 50%;
      }
      &:last-child::after {
        content: "";
        display: none !important;
      }
    }
  }
}
</style>
