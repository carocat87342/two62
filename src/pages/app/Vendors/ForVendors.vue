<template>
  <div class="for-vendor-wrapper">
    <h4>So what are the details?</h4>
    <div class="main-cont">
      <div class="one-row">
        <div class="left-side">
          <h3 v-if="proposalRequest">
            {{
              proposalRequest.eventData.concept
                ? proposalRequest.eventData.concept.name
                : proposalRequest.eventData.eventType.name
            }}
          </h3>
          <h3 v-else>No Event Data</h3>

          <p v-if="proposalRequest">
            {{ proposalRequest.eventData.concept ? proposalRequest.eventData.concept.description : "" }}
            <br />
            <br />
          </p>
          <p v-else>
            There is no proposal request for this id. So, we can't show any event data now. But, we can just show how
            you would make a proposal here when you would get an email from us.
            <br />
            <br />
          </p>
        </div>
        <div class="right-side">
          <div class="summary-cont">
            <ul>
              <li>
                <img :src="`${iconsUrl}Path 251.svg`" />
                <strong>Date:</strong>
                {{ serviceTime.date }}
              </li>
              <li>
                <img :src="`${iconsUrl}Group 6085.svg`" />
                <strong>Time:</strong>
                {{ serviceTime.time }}
              </li>
              <li>
                <img :src="`${iconsUrl}Asset 506.svg`" />
                <strong>Address:</strong>
                <span>{{ getLocation }}</span>
              </li>
              <li>
                <img :src="`${iconsUrl}Asset 505.svg`" />
                <strong>Guests:</strong>
                {{ proposalRequest ? proposalRequest.eventData.numberOfParticipants : "-" | withComma }}
              </li>
              <li>
                <img :src="`${iconsUrl}Path 1942.svg`" />
                <strong>Type:</strong>
                {{
                  proposalRequest && proposalRequest.eventData.eventType
                    ? proposalRequest.eventData.eventType.name
                    : "-"
                }}
              </li>
              <li>
                <img :src="`${iconsUrl}Path 1383.svg`" />
                <strong>Invited:</strong>
                {{ proposalRequest && proposalRequest.eventData.guestType ? proposalRequest.eventData.guestType : "-" }}
              </li>
              <li>
                <div class="new-time" v-if="vendor.eventCategory.key == 'venuerental'">
                  Already Booked?
                  <a @click="showChooseDateModal()">Suggest New time</a>
                  <span v-if="suggestionDate">
                    ( {{ suggestionDate[0].date }} - {{ suggestionDate[suggestionDate.length - 1].date }})</span
                  >
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr />
      <vendor-budget-list
        :title="`Budget`"
        :description="`Usually budget is flexible and could change according to needs`"
        :proposalRequest="proposalRequest"
        :requirements="requiredServices"
      />
    </div>
    <div class="rank-cont">
      <h3>Would you like to submit your bid?</h3>
      <div class="check-cont">
        <md-checkbox class="check-condition md-vendor" v-model="isAgreed">
          <span class="regular" @mouseover="conditionTooltip = true" @mouseleave="conditionTooltip = false"
            >I accept</span
          >
        </md-checkbox>
        <a class="condition" target="_blank" href="https://www.maryoku.com/terms">Maryoku's Terms & Conditions</a>
      </div>
      <!-- <div class="condition-tooltip" v-if="conditionTooltip"> -->
      <div class="condition-tooltip" v-if="true">
        <img :src="`${iconsUrl}Group 1175 (10).svg`" />
        Let us know that you are on board with our teams & conditions
      </div>
    </div>
    <div class="action-cont">
      <button class="no" @click="showNotBiddingModal">Thank You, But No.</button>
      <button class="no no-border" @click="showReferModal">
        Refer Another Vendor
        <div class="refer-tooltip" v-if="referTooltip">
          <h5>
            Refer a new vendor
            <br />and get a commission!
          </h5>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
        </div>
        <img :src="`${iconsUrl}Group 5522.svg`" @mouseover="referTooltip = true" @mouseleave="referTooltip = false" />
      </button>
      <div class="with-description">
        <p>
          You're the
          {{ proposalRequest ? proposalRequest.bidderRank : "1" | numeral("Oo") }}
          <span class="text-transform-lowercase">{{ vendor.eventCategory.title }} </span>bidder
        </p>

        <button class="yes" @click="goToForm()">Submit Proposal</button>
      </div>
    </div>
    <modal v-if="referModal" class="refer-vendor-modal" container-class="modal-container sl">
      <template slot="header">
        <div class="refer-vendor-modal__header">
          <h3>Refer a vendor</h3>
          <div class="header-description">
            <p>Add the vendor's info</p>
          </div>
        </div>
        <button class="close" @click="hideModal()">
          <img :src="`${iconsUrl}Group 3602.svg`" />
        </button>
      </template>
      <template slot="body">
        <div class="refer-vendor-modal__body">
          <input-proposal-sub-item
            :title="`Vendor's Name`"
            :placeholder="`Type vendor's name here`"
            :style="`width: 100%`"
            @change="setReferredVendorProperty('companyName', ...arguments)"
          />
          <input-proposal-sub-item
            :title="`Category`"
            :placeholder="``"
            :style="`width: 100%`"
            :img="`https://static-maryoku.s3.amazonaws.com/storage/icons/NewSubmitPorposal/Component 36 (2).svg`"
            :items="categories"
            @change="setReferredVendorProperty('vendorCategory', ...arguments)"
          />
          <input-proposal-sub-item
            :title="`Email`"
            :placeholder="`Type your email address here`"
            :style="`width: 100%`"
            :img="`${iconsUrl}Asset 499.svg`"
            :isLeft="true"
            @change="setReferredVendorProperty('vendorMainEmail', ...arguments)"
          />
          <input-proposal-sub-item
            :title="`Link to Website`"
            :placeholder="`Paste link here`"
            :style="`width: 100%`"
            :img="`${iconsUrl}Asset 498.svg`"
            :isLeft="true"
            @change="setReferredVendorProperty('social.website', ...arguments)"
          />
        </div>
      </template>
      <template slot="footer">
        <div class="refer-vendor-modal__footer">
          <a class="cancel" @click="hideModal">Cancel</a>
          <a class="cool" @click="referNewVendor">Refer</a>
        </div>
      </template>
    </modal>
    <modal v-if="notBiddingModal" class="not-bidding-modal" container-class="modal-container lg">
      <template slot="header">
        <div class="not-bidding-modal__header">
          <h3>
            <strong>We are sorry to hear you're not bidding,</strong>
            <br />and would love to know,
            <strong>what's the reason?</strong>
          </h3>
          <div class="header-description">You can choose more than one</div>
        </div>
        <button class="close" @click="hideModal()">
          <img :src="`${iconsUrl}Group 3602.svg`" />
        </button>
      </template>
      <template slot="body">
        <div class="not-bidding-modal__body">
          <ul>
            <li>
              <md-checkbox
                v-model="reasonIsDate"
                :style="`border-color: ${reasonIsDate ? '#fc1355!important;' : 'inherit'}`"
              >
                <span class="colored" :class="[{ bold: reasonIsDate }]"
                  >I'm fully booked around the date of the event</span
                >
              </md-checkbox>
              <a class="another-date" @click="showChooseDateModal()" v-if="vendor.eventCategory.key == 'venuerental'"
                >Suggest Another Date</a
              >
              <a class="another-date" @click="showChooseDateModal()" v-else>Suggest Another Time</a>
            </li>
            <li>
              <md-checkbox
                v-model="reasonIsBudget"
                :style="`border-color: ${reasonIsBudget ? '#fc1355!important;' : 'inherit'}`"
              >
                <span class="colored" :class="[{ bold: reasonIsBudget }]">I'm way out of your budget</span>
              </md-checkbox>
            </li>
            <li>
              <md-checkbox
                v-model="reasonIsService"
                :style="`border-color: ${reasonIsService ? '#fc1355!important;' : 'inherit'}`"
              >
                <span class="colored" :class="[{ bold: reasonIsService }]"
                  >I don't think my services are compatible to your requirements</span
                >
              </md-checkbox>
            </li>
            <li>
              <md-checkbox
                v-model="reasonIsInfo"
                :style="`border-color: ${reasonIsInfo ? '#fc1355!important;' : 'inherit'}`"
              >
                <span class="colored" :class="[{ bold: reasonIsInfo }]"
                  >I don't enough information about the event</span
                >
              </md-checkbox>
            </li>
            <li>
              <md-checkbox
                v-model="reasonIsOther"
                :style="`border-color: ${reasonIsOther ? '#fc1355!important;' : 'inherit'}`"
              >
                <span class="colored" :class="[{ bold: reasonIsOther }]">Other</span>
              </md-checkbox>
            </li>
          </ul>
          <textarea
            v-if="reasonIsOther"
            rows="4"
            maxlength="500"
            type="text"
            class="form-control"
            placeholder="Type your reason here..."
          />
        </div>
      </template>
      <template slot="footer">
        <div class="not-bidding-modal__footer">
          <button class="cancel" @click="hideModal()">Cancel</button>
          <div class="refer-another-vendor-cont">
            <img class="hand" :src="`${$iconURL}Submit Proposal/group-17528.svg`" />
            <a @click="showReferModal()">Refer Another Vendor</a>
            <img class="question" :src="`${iconsUrl}Group 5522.svg`" />
          </div>
          <button class="cool" @click="declineRequest()">Send</button>
        </div>
      </template>
    </modal>
    <modal v-if="sorryModal" class="sorry-modal" container-class="modal-container lg">
      <template slot="header">
        <div class="sorry-modal__header">
          <div class="left-side">
            <img :src="`${iconsUrl}Group 5811.svg`" />
          </div>
          <div class="right-side">
            <h3>
              We are sorry, but someone else got there
              <br />before you and already won this bid
            </h3>
            <div class="header-description">But no worries! We will be with you soon with the next one</div>
          </div>
        </div>
        <button class="close" @click="hideModal()">
          <img :src="`${iconsUrl}Group 3602.svg`" />
        </button>
      </template>
      <template slot="body">
        <div class="sorry-modal__body"></div>
      </template>
      <template slot="footer">
        <div class="sorry-modal__footer">
          <button class="cool" @click="hideModal()">OK, Thanks</button>
        </div>
      </template>
    </modal>
    <modal v-if="chooseDateModal" class="choose-date-modal" container-class="modal-container lg">
      <template slot="header">
        <div class="choose-date-modal__header">
          <h3>What is your new time suggestion?</h3>
          <div class="header-description">
            <img :src="`${iconsUrl}Group 1175 (9).svg`" />
            A new time suggestion would be possible up to three days before or after the original event
          </div>
        </div>
        <button class="close" @click="hideModal()">
          <img :src="`${iconsUrl}Group 3602.svg`" />
        </button>
      </template>
      <template slot="body">
        <div class="choose-date-modal__body">
          <div class="left-side"></div>
          <div class="right-side">
            <template>
              <div class="calendar-wrapper">
                <div class="calendar-title">Date Range Picker</div>
                <functional-calendar
                  :key="componentKey"
                  :change-month-function="true"
                  :change-year-function="true"
                  :is-multiple-date-picker="true"
                  :minSelDays="1"
                  :sundayStart="true"
                  :arrow-position="`space-between`"
                  :limits="limitDateRange"
                  :marked-dates="markedDataRange"
                  v-model="suggestedDates"
                  ref="calendar"
                />
              </div>
            </template>
            <div class="select-time-cont">
              <img :src="`${iconsUrl}Group 6085.svg`" />
              <vue-timepicker
                manual-input
                input-class="time-class"
                hide-dropdown
                format="hh:mm"
                v-model="startTime"
                hide-clear-button
              />
              <div class="am-field" @click="updateStartA()">
                <input type="text" v-model="amPack.start" readonly />
              </div>
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="choose-date-modal__footer">
          <button class="cancel" @click="hideModal()">Cancel</button>
          <button class="send" @click="suggestAnotherDay()">Create Proposal With This Time</button>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import moment from "moment";
import Swal from "sweetalert2";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import ProposalRequest from "@/models/ProposalRequest";

//COMPONENTS
import InputProposalSubItem from "@/components/Inputs/InputProposalSubItem.vue";
import VendorBudgetList from "./components/VendorBudgetList.vue";
import { FunctionalCalendar } from "vue-functional-calendar";
import { Modal, Loader } from "@/components";


export default {
  components: {
    Modal,
    Loader,
    InputProposalSubItem,
    VendorBudgetList,
    FunctionalCalendar,
    VueTimepicker,
  },
  data() {
    return {
      category: null,
      notBiddingModal: false,
      chooseDateModal: false,
      referModal: false,
      sorryModal: false,
      reasonIsDate: false,
      reasonIsBudget: false,
      reasonIsService: false,
      reasonIsInfo: false,
      reasonIsOther: false,
      iconsUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/NewLandingPage/",
      isAgreed: null,
      referTooltip: false,
      conditionTooltip: false,
      proposalRequestRequirements: [],
      proposals: [],
      firstTime: false,
      suggest: false,
      categories: [],
      amPack: {
        start: "AM",
        end: "AM",
      },
      startTime: {
        hh: "12",
        mm: "00",
      },
      limitDateRange: {
        min: null,
        max: null,
      },
      markedDataRange: [],
      today: null,
      suggestedDates: [],
      referredVendor: {
        companyName: "",
        vendorCategory: "",
        vendorMainEmail: "",
        social: {
          website: "",
        },
      },
    };
  },
  mounted() {
    this.today = moment(new Date());
    this.limitDateRange = {
      min: moment(new Date()).add(-3, "days").format("DD/MM/YYYY"),
      max: moment(new Date()).add(3, "days").format("DD/MM/YYYY"),
    };
    this.markedDataRange.push({ date: moment(new Date()).add(-4, "days").format("DD/MM/YYYY"), class: "marked_end" });
    this.markedDataRange.push({ date: moment(new Date()).add(4, "days").format("DD/MM/YYYY"), class: "marked_start" });

    console.log('markedDateRange', this.markedDataRange);
    this.$root.$on("go-to-proposal-form", () => {
      if (this.isAgreed) {
        this.$router.push(`/vendors/${this.vendor.id}/proposal-request/${this.proposalRequest.id}/form/submit`);
      } else {
        window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        this.conditionTooltip = true;
      }
    });

    if (this.proposalRequest) {
      this.isAgreed = this.proposalRequest.isAgreed;
    }
    this.categories = [];
    this.$store.dispatch("common/fetchAllCategories").then((services) => {
      services.forEach((serviceCategory) => {
        if (serviceCategory.type == "service") this.categories.push(serviceCategory.fullTitle);
      });
    });
    console.log('forvendor.mounted', this.categories);
  },
  methods: {
    setReferredVendorProperty(property, value) {
      if (property.includes(".")) {
        const properties = property.split(".");
        this.referredVendor[properties[0]][properties[1]] = value;
      } else if (property == "vendorCategory") {
        this.referredVendor[property] = this.findVendorCategoryByTitle(value);
      } else {
        this.referredVendor[property] = value;
      }
    },
    referNewVendor() {
      this.$http
        .post(`${process.env.SERVER_URL}/1/vendors/refer/${this.proposalRequest.componentInstance.id}`, {
          isEditing: true,
          referringVendorId: this.vendor.id,
          ...this.referredVendor,
        })
        .then((res) => {
          console.log(res);
          Swal.fire({
            title: "Thank you for your referring! ",
            html: `We will send proposal request to this vendor`,
            showCancelButton: true,
            confirmButtonClass: "md-button md-success confirm-btn-bg ",
            cancelButtonClass: "md-button md-danger cancel-btn-bg",
            buttonsStyling: false,
          }).then(() => {
            this.hideModal();
          });
        })
        .catch((err) => {
          Swal.fire({
            title: "Please check information! ",
            html: `You may try to refer the existing vendor on our system`,
            showCancelButton: false,
            confirmButtonClass: "md-button md-success confirm-btn-bg ",
            buttonsStyling: false,
          }).then(() => {
            this.hideModal();
          });
        });
    },
    goToForm() {
      if (this.isAgreed) {
        this.$router.push(`/vendors/${this.vendor.id}/proposal-request/${this.proposalRequest.id}/form/submit`);
        // if (this.proposalRequest) {
        //   this.$router.push(`/vendors/${this.vendor.id}/proposal-request/${this.proposalRequest.id}/form`);
        // } else {
        //   this.proposalRequest = new ProposalRequest({
        //     id: this.$route.params.id,
        //   });
        //   this.$router.push({
        //     path: `/vendors/${this.vendor.id}/proposal-request/${this.proposalRequest.id}/form`,
        //     props: {
        //       proposalRequest: this.proposalRequest,
        //     },
        //   });
        // }
      } else {
        window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        this.conditionTooltip = true;
      }
    },
    hideModal() {
      this.chooseDateModal = false;
      this.notBiddingModal = false;
      this.referModal = false;
      this.sorryModal = false;
    },
    showNotBiddingModal() {
      this.hideModal();
      this.notBiddingModal = true;
    },
    showChooseDateModal() {
      this.hideModal();
      this.chooseDateModal = true;
    },
    showReferModal() {
      this.hideModal();
      this.referModal = true;
    },
    showSorryModal() {
      this.hideModal();
      this.sorryModal = true;
    },

    isDateDisabled(date) {
      let startDate = new Date(this.proposalRequest.eventData.eventStartMillis);
      let endDate = new Date(this.proposalRequest.eventData.eventStartMillis);
      let numberOfDaysToAdd = 3;
      startDate.setDate(startDate.getDate() - 4);
      endDate.setDate(endDate.getDate() + numberOfDaysToAdd);

      return !(date >= startDate && date <= endDate);
    },
    suggestAnotherDay() {
      this.suggest = true;
      console.log(this.suggestedDates);
      if (this.suggestedDates.selectedDates && this.suggestedDates.selectedDates.length > 0) {
        this.$store.commit("vendorProposal/setValue", {
          key: "suggestionDate",
          value: this.suggestedDates.selectedDates,
        });
      }
      if (this.proposalRequest) {
        this.proposalRequest.suggestedDates = new Date(this.proposalRequest.eventData.eventStartMillis);
      }
      this.hideModal();
    },
    updateStartA() {
      if (this.amPack.start == "AM") {
        this.amPack.start = "PM";
      } else {
        this.amPack.start = "AM";
      }
    },
    declineRequest() {
      new ProposalRequest({ id: this.proposalRequest.id, declineMessage: "I don't want it" }).save().then((res) => {
        console.log(res);
        Swal.fire({
          title: "Thank you! ",
          html: `We hope to see you next time.`,
          showCancelButton: true,
          confirmButtonClass: "md-button md-success confirm-btn-bg ",
          cancelButtonClass: "md-button md-danger cancel-btn-bg",
          buttonsStyling: false,
        }).then(() => {
          this.notBiddingModal = false;
        });
      });
    },
    findVendorCategoryByTitle(title) {
      console.log('findVendorCategoryByTitle', this.vendorCategories, title);
      return this.vendorCategories.find((item) => item.fullTitle == title).key;
    },
    findVendorCategoryTitleByKey(key) {
      return this.vendorCategories.find((item) => item.fullkey == key).key;
    },
    getDateByFormat(data, format){
        if (typeof data == 'string') data = parseInt(data);
        return moment(data).format(format);
    }
  },
  computed: {
    vendor() {
      return this.$store.state.vendorProposal.vendor;
    },
    proposalRequest() {
      try {
        if (this.$store.state.vendorProposal.proposalRequest.plannerRequirement.period) {
          this.startTime = this.$store.state.vendorProposal.proposalRequest.plannerRequirement.period.startTime.time;
          this.amPack.start = this.$store.state.vendorProposal.proposalRequest.plannerRequirement.period.startTime.ampm;
        }
      } catch (e) {}

      return this.$store.state.vendorProposal.proposalRequest;
    },
    timelineDates() {
      return this.$store.state.vendorProposal.timelineDates;
    },
    eventDate() {
      if (!this.proposalRequest) return "-";

      let startDate = new Date(this.proposalRequest.eventData.eventStartMillis);
      let endDate = new Date(this.proposalRequest.eventData.eventEndMillis);
      return `${moment(startDate).format("MMM D, YYYY")} - ${moment(endDate).format("MMM D, YYYY")}`;
    },
    eventTime() {
      if (!this.proposalRequest) return "-";

      let startDate = new Date(this.proposalRequest.eventData.eventStartMillis);
      let endDate = new Date(this.proposalRequest.eventData.eventEndMillis);
      return `${moment(startDate).format("hh:mmA")} - ${moment(endDate).format("hh:mmA")}`;
    },
    serviceTime() {
      if (!this.proposalRequest) {
        return {
          time: "",
          date: "",
        };
      }
      // let serviceTimeString = this.vendor.eventCategory.key === "venuerental" ? "All Day" : "Not planned yet";
      let serviceTimeString = "";
      let serviceDate = "";
      this.timelineDates.forEach((td) => {
        td.timelineItems.forEach((timelineItem) => {
          if (
            timelineItem &&
            timelineItem.eventCategory &&
            timelineItem.eventCategory.includes(this.vendor.eventCategory.key)
          ) {
            console.log(timelineItem.eventCategory, this.vendor.eventCategory.key);
            serviceTimeString = `${this.$dateUtil.formatScheduleDay(
              Number(timelineItem.startTime),
              "hh:mm A",
            )}-${this.$dateUtil.formatScheduleDay(Number(timelineItem.endTime), "hh:mm A")}`;
            serviceDate = this.$dateUtil.formatScheduleDay(Number(timelineItem.endTime), "MMM DD, YYYY");
          }
        });
      });
      if ( !serviceDate ) {
        let startDate = this.getDateByFormat(this.proposalRequest.eventData.eventStartMillis, "MMM DD, YYYY");
        let endDate = this.getDateByFormat(this.proposalRequest.eventData.eventEndMillis, "MMM DD, YYYY");
        serviceDate = startDate === endDate ? startDate : `${startDate} - ${endDate}`;
      }

      if (this.proposalRequest.plannerRequirement.isEntireEvent) {
        serviceTimeString = "All Day";
      } else if (this.proposalRequest.plannerRequirement.period) {
        const period = this.proposalRequest.plannerRequirement.period;

        let startTime = this.getDateByFormat(period.startTime, 'hh:mm:a');
        let endTime = this.getDateByFormat(period.endTime, 'hh:mm:a');
        serviceTimeString = startTime === endTime ? startTime : `${startTime} - ${endTime}`;
      } else {
          let startTime = this.getDateByFormat(this.proposalRequest.eventData.eventStartMillis, 'hh:mm:a');
          let endTime = this.getDateByFormat(this.proposalRequest.eventData.eventEndMillis, 'hh:mm:a');
          serviceTimeString = startTime === endTime ? startTime : `${startTime} - ${endTime}`;
      }
      return {
        time: serviceTimeString,
        date: serviceDate,
      };
    },
    getEventDuration() {
      return moment
        .duration(this.proposalRequest.eventData.eventEndMillis - this.proposalRequest.eventData.eventStartMillis)
        .humanize();
    },
    getLocation() {
      if (this.proposalRequest) {
        return this.proposalRequest.eventData.location || "-";
      } else {
        return "-";
      }
    },
    getServiceCategory() {
      if (this.proposalRequest.requirementsCategory) {
        return this.proposalRequest.requirementsCategory;
      } else {
        return this.vendorCategory;
      }
    },
    requiredServices() {
      if (this.proposalRequest) return this.proposalRequest.eventData.components.sort((a, b) => a.order - b.order);
      return [];
    },
    suggestionDate() {
      return this.$store.state.vendorProposal.suggestionDate;
    },
    vendorCategories() {
      return this.$store.state.common.serviceCategories;
    },
  },
  filters: {
    withComma(amount) {
      return amount ? amount.toLocaleString() : 0;
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
.marked_end {
  border-top-right-radius: 50% !important;
  border-bottom-right-radius: 50% !important;
}
.marked_start {
  border-top-left-radius: 50% !important;
  border-bottom-left-radius: 50% !important;
}
.for-vendor-wrapper {
  position: relative;
  background-color: #ffffff;
  box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
  border-radius: 3px;
  max-width: calc(100% - 128px);
  margin: -64px auto 0 auto;
  padding: 83px 114px;
  font-family: Manrope-Regular, sans-serif;

  h4 {
    margin: 0;
    font-size: 22px;
    color: #050505;
    font-weight: bold;
  }

  .calendar-wrapper {
    border: solid 1px #caced5;
    padding: 0 1em;
    width: max-content;
    .vfc-popover-container {
      width: max-content;
    }
  }
  .main-cont {
    background-color: #f2f2f2;
    border: 1px solid #707070;
    border-radius: 3px;
    margin-top: 50px;
    padding: 60px;
    color: #050505;

    .one-row {
      display: flex;
      align-items: flex-start;

      .left-side {
        padding-right: 50px;
        border-right: 1px solid #050505;
        h3 {
          margin: 0;
          text-transform: uppercase;
          font-family: "Cooperative-Regular", sans-serif;
          font-size: 44px;
          font-weight: normal;
        }
        h4 {
          margin: 0;
          text-transform: capitalize;
          font-size: 20px;
          margin-top: 19px;
          margin-bottom: 37px;
        }
        p {
          font-size: 16px;
          max-width: 426px;
          line-height: 1.69;
        }
      }
      .right-side {
        padding: 50px 80px 0px 76px;

        .summary-cont {
          ul {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
              font-size: 20px;
              margin-bottom: 53px;

              img {
                width: 15.4px;
                height: 19.2px;
                margin-right: 13px;
              }
              strong {
                margin-right: 18px;
                min-width: 86px;
                display: inline-block;
              }
              .new-time {
                background-color: #ffedb7;
                padding: 23px 35px 22px 35px;
                font-size: 16px;
                font-weight: 800;
                display: inline-block;

                a {
                  margin-left: 15px;
                  cursor: pointer;
                  color: #641856;
                }
              }
              span {
                max-width: 500px;
                display: inline-block;
                vertical-align: middle;
              }
            }
          }
        }
      }
    }
  }

  .marked_end {
    border-top-right-radius: 50% !important;
    border-bottom-right-radius: 50% !important;
  }
  .marked_start {
    border-top-left-radius: 50% !important;
    border-bottom-left-radius: 50% !important;
  }
  .rank-cont {
    color: #050505;
    padding-top: 84px;
    h3 {
      font-size: 40px;
      font-weight: bold;
      line-height: 1.68;
      margin: 0;
      margin-bottom: 30px;
    }
    .check-cont {
      display: flex;
      align-items: center;
      .check-condition {
        font-size: 20px;
        color: #641856;

        span.regular {
          padding-left: 14px;
          color: #050505;
        }
      }
      a.condition {
        text-decoration: underline;
        font: bold 20px Manrope-Regular, sans-serif;
        color: #050505;
        margin-top: 1px;
        margin-left: -0.5rem;
      }
    }
    .condition-tooltip {
      position: absolute;
      background-color: #ffe5ec;
      padding: 18px 29px 18px 29px;
      color: #050505;
      font-size: 14px;
      margin-left: -40px;
      margin-top: 10px;
      img {
        margin-right: 12px;
        width: 27px;
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
        border-color: transparent transparent #ffe5ec #ffe5ec;

        transform-origin: 0 0;
        transform: rotate(135deg);
      }
    }
  }

  .action-cont {
    text-align: right;
    padding-top: 130px;
    .no {
      padding: 25px 75px;
      color: #641856;
      font-size: 20px;
      font-weight: 800;
      border: none;
      cursor: pointer;
      border-right: 1px solid #707070;
      text-decoration: underline;
      background: transparent;
      font-family: Manrope-Regular, sans-serif;

      img {
        padding-left: 19px;
        width: 36px;
      }
    }
    .no-border {
      border: none !important;
    }
    .refer-tooltip {
      position: absolute;
      background-color: #ffedb7;
      max-width: 301px;
      padding: 26px 36px 36px 36px;
      color: #050505;
      margin-top: -260px;

      h5 {
        margin: 0;
        font-size: 20px;
        font-weight: 800;
        margin-bottom: 22px;
        text-transform: capitalize;
      }
      p {
        font-size: 16px;
        font-weight: normal;
        line-break: 1.63;
      }
      &::after {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        margin-left: -0.5em;
        bottom: -20px;
        left: 80%;
        box-sizing: border-box;

        border: 12px solid black;
        border-color: transparent transparent #ffedb7 #ffedb7;

        transform-origin: 0 0;
        transform: rotate(-45deg);
      }
    }
    .with-description {
      display: inline-block;
      text-align: center;
      p {
        font-size: 22px;
        margin-bottom: 31px;
      }
      .yes {
        font-family: Manrope-Regular, sans-serif;
        min-width: 473px;
        padding: 20px 0;
        font-size: 20px;
        font-weight: 800;
        letter-spacing: 0.42px;
        border: none;
        border-radius: 3px;
        color: #ffffff;
        background-color: #641856;
        cursor: pointer;
      }
    }
  }

  .refer-vendor-modal {
    &__header {
      width: 100%;
      padding: 20px 20px 0;
      h3 {
        color: #050505;
        font-size: 30px;
        font-weight: 800;
        margin: 0;
      }
      .header-description {
        p {
          font-size: 16px;
          font-weight: normal;
          line-height: 1.29;
          margin-top: 8px;
          margin-bottom: 0;
        }
      }
      & + .close {
        background: transparent;
        border: none;
        position: absolute;
        top: 61px;
        right: 50px;
        color: #050505;
        cursor: pointer;
        img {
          width: 20px;
        }
      }
    }
    &__body {
      padding: 0.5rem 1rem;

      .input-proposal-sub-item-wrapper {
        position: relative;
        margin-bottom: 40px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    &__footer {
      width: 100%;
      text-align: right;
      margin: 0 1rem;
      margin-top: -16px;
      padding: 1.5rem 0 1rem 0;
      .cancel {
        font-size: 16px;
        font-weight: bold;
        color: #050505;
        background-color: transparent;
        padding: 8px 36px;
        cursor: pointer;
        border: none;
      }
    }
  }

  .not-bidding-modal {
    font-family: Manrope-Regular, sans-serif;
    &__header {
      width: 100%;
      padding: 20px 20px 0;
      h3 {
        font-size: 30px;
        color: #050505;
        font-weight: normal;
        line-height: 1.53;
        margin: 0;
        strong {
          font-weight: bold;
        }
      }
      p {
        font-size: 14px;
        line-height: 1.29;
      }
      & + .close {
        background: transparent;
        border: none;
        position: absolute;
        top: 61px;
        right: 60px;
        color: #050505;
        cursor: pointer;
        img {
          width: 20px;
        }
      }
    }
    &__body {
      padding: 0.5rem 1rem;
      ul {
        padding: 0;
        margin: 0;
        list-style: none;
        text-align: left;

        li {
          span {
            &.colored {
              color: #050505;
              padding-left: 14px;
            }
            &.bold {
              font-weight: 800;
            }
          }
          &:first-child {
            display: flex;
            align-items: center;
            .another-date {
              font-size: 16px;
              color: #641856;
              font-weight: 800;
              text-decoration: underline;
              cursor: pointer;
              padding-left: 18px;
              margin-right: 23px;
            }
          }
        }
      }
      textarea {
        font-family: Manrope-Regular, sans-serif;
        margin-left: 3rem;
        margin-top: 1em;
        width: calc(100% - 3rem);
        min-height: 8em;
        border-radius: 3px;
        border: solid 1px #707070;
        padding: 1rem;
      }
    }
    &__footer {
      padding: 10px 40px 40px 40px;
      display: flex;
      align-items: center;

      .cancel {
        font-size: 16px;
        font-weight: bold;
        color: #050505;
        background-color: transparent;
        padding: 8px 36px;
        cursor: pointer;
        border: none;
        border-right: 1px solid #707070;
      }
      .refer-another-vendor-cont {
        margin: 0 30px;
        .hand {
          width: 52px;
          margin-right: 14px;
        }
        .question {
          width: 27px;
          margin-left: 9px;
        }
        a {
          font-size: 16px;
          font-weight: 800;
          text-decoration: underline;
          cursor: pointer;
          color: #641856;
        }
      }
      .send {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
        background-color: #641856;
        border-radius: 3px;
        padding: 8px 36px;
        cursor: pointer;
        border: none;
      }
    }
  }

  .sorry-modal {
    &__header {
      width: 100%;
      padding: 20px 20px 0;
      display: flex;

      .left-side {
        img {
          width: 92px;
          margin-right: 50px;
        }
      }

      .right-side {
        h3 {
          font-size: 30px;
          color: #641856;
          font-weight: bold;
          line-height: 1.53;
          margin: 0;
        }
        .header-description {
          margin-top: 20px;
          margin-bottom: -1rem;
          font-size: 20px;
          line-height: 1.29;
        }
      }

      & + .close {
        background: transparent;
        border: none;
        position: absolute;
        top: 61px;
        right: 60px;
        color: #050505;
        cursor: pointer;
        img {
          width: 20px;
        }
      }
    }
    &__body {
      padding: 0;
    }
    &__footer {
      padding: 1rem;
      .cancel {
        font-size: 16px;
        font-weight: bold;
        color: #050505;
        background-color: transparent;
        padding: 8px 36px;
        cursor: pointer;
        border: none;
      }
      .send {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
        background-color: #641856;
        border-radius: 3px;
        padding: 8px 36px;
        cursor: pointer;
        border: none;
      }
    }
  }

  .choose-date-modal {
    &__header {
      width: 100%;
      padding: 20px 20px 0;
      h3 {
        font-size: 30px;
        font-weight: 800;
        color: #050505;
        line-height: 1.53;
        margin: 0;
      }
      .header-description {
        margin-top: 20px;
        font-size: 14px;
        img {
          width: 27px;
          margin-right: 15px;
        }
      }
      p {
        font-size: 14px;
        line-height: 1.29;
      }
      & + .close {
        background: transparent;
        border: none;
        position: absolute;
        top: 61px;
        right: 60px;
        color: #050505;
        cursor: pointer;
        img {
          width: 20px;
        }
      }
    }
    &__body {
      padding: 36px 40px;
      display: flex;
      justify-content: center;
      align-items: center;

      .left-side {
        margin-right: 60px;
      }
      .right-side {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-gap: 3rem;
        position: relative;
        width: 100%;

        .calendar-title {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          z-index: 999;
          font: normal 16px Manrope-Regular, sans-serif;
          color: #818080;
        }

        img {
          width: 23px;
          height: 23px;
          margin-right: 24px;
        }
        /deep/ .vfc-main-container {
          max-width: 370px;
          padding-top: 4rem;
        }
        /deep/ .vfc-top-date {
          margin-top: 2rem;
          a {
            text-decoration: none !important;
            font: 600 16px Manrope-Regular, sans-serif;
            color: #050505;
          }
        }
        /deep/ .vfc-separately-navigation-buttons div {
          margin: 1rem 0.8rem !important;
        }
        /deep/ .vfc-arrow-left,
        /deep/ .vfc-arrow-right {
          width: 10px;
          height: 10px;
          color: #641856;
          border-color: #641856;
          border-top: 2px solid;
          background-color: white !important;
        }
        /deep/ .vfc-arrow-left {
          border-left: 2px solid;
        }
        /deep/ .vfc-arrow-right {
          border-right: 2px solid;
        }
        /deep/ .vfc-disabled,
        /deep/ .vfc-cursor-not-allowed {
          opacity: 0.48;
          color: #43425d !important;
          background: #d5d5d5;
          &.marked_start {
            border-top-left-radius: 50% !important;
            border-bottom-left-radius: 50% !important;
          }
          &.marked_end {
            border-top-right-radius: 50% !important;
            border-bottom-right-radius: 50% !important;
          }
        }
        /deep/ .vfc-week {
          .vfc-day {
            span.vfc-disabled {
              border-radius: 0;
            }
            &:first-child {
              span.vfc-disabled {
                border-top-left-radius: 50%;
                border-bottom-left-radius: 50%;
              }
            }
            &:last-child {
              span.vfc-disabled {
                border-top-right-radius: 50%;
                border-bottom-right-radius: 50%;
              }
            }
          }
        }
        .time {
          padding: 15px 32px;
          border-radius: 3px;
          font-size: 30px;
          border: solid 0.5px #707070;
          max-width: 183px;
          margin-right: 13px;
        }
        .pm {
          padding: 15px 24px;
          font-size: 30px;
          border-radius: 3px;
          border: solid 0.5px #707070;
        }
        .select-time-cont {
          display: flex;
          align-items: center;

          .am-field {
            position: relative;
            cursor: pointer;
            input {
              width: 85px;
              height: 65px;
              cursor: pointer;
              border-radius: 3px;
              font: normal 30px Manrope-Regular, sans-serif;
              margin-left: 0.5rem;
              border: 1px solid #707070;
              text-align: center;
            }
            &:before {
              position: absolute;
              content: ">";
              transform: translateX(50%) translateY(calc(100% + 1.2rem)) rotate(90deg);
              top: 1.5rem;
              left: 40%;
              font-size: 20px;
              font-weight: 800;
              color: #a0a0a0;
            }
          }
          /deep/ .time-picker {
            width: unset;
            input {
              text-align: center;
              border-radius: 3px;
              width: 160px;
              height: 65px;
              font: normal 30px Manrope-Regular, sans-serif;
              border: 1px solid #707070;
              text-align: center;
            }
          }
        }
      }
    }
    &__footer {
      padding: 10px 40px 40px 40px;
      .cancel {
        font-size: 16px;
        font-weight: bold;
        color: #050505;
        background-color: transparent;
        padding: 8px 36px;
        cursor: pointer;
        border: none;
      }
      .send {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
        background-color: #641856;
        border-radius: 3px;
        padding: 8px 36px;
        cursor: pointer;
        border: none;
      }
    }
  }
  .cool {
    font-size: 16px;
    font-weight: 800;
    color: #ffffff;
    background-color: #641856;
    border-radius: 3px;
    padding: 8px 36px;
    cursor: pointer;
    border: none;
    max-height: 44px;

    &:hover {
      color: #dddddd !important;
    }
  }
}
</style>
