<template>
  <div class="vendor-signup-step3-wrapper">
    <div class="inside-container">
      <div class="left-side">
        <img :src="`${iconUrl}step-3.svg`" />
        <h2>
          DISCLAMER &
          <br />POLICY
        </h2>
        <p>
          Don’t worry, you’ll only have to do this once. After that all elements will appear on your future proposals
          automatically
        </p>
        <h2>2/4</h2>
        <p class="color-red font-bold">Good job, you're almost done!</p>
      </div>
      <div class="right-side">
        <div class="policy-wrapper mb-50">
          <div class="title-cont">
            <div class="top">
              <h5><img :src="`${iconUrl}Asset 560.svg`" /> Policy</h5>
            </div>
            <div class="bottom">
              <p>Set {{ getCategoryNameByValue(currentService.vendorCategory) }} rules for your guests</p>
            </div>
            <div class="bottom">
              <p>Use the suggested element or add your own itmes to your disclaimer</p>
              <md-switch v-model="setAsMainPolicy" class="ml-10 md-switch large-switch md-switch-vendor align-center">
                <span class="color-purple font-bold font-size-16">Same as {{ vendor.eventCategory.fullTitle }}</span>
              </md-switch>
            </div>
          </div>
          <div class="card">
            <div class="rules">
              <vendor-policy-item
                v-for="(r, rIndex) in vendorPolicies.items"
                :key="rIndex + 'component'"
                :item="r"
                @update="setPolicy($event, rIndex)"
                theme="purple"
              >
              </vendor-policy-item>
            </div>
            <v-signup-add-rules
              :comType="`rule`"
              :title="rulesDesc"
              :defaultRules="additionalRules"
              theme="purple"
              :isMainService="false"
            />
          </div>
        </div>
        <div class="pricing-policy-wrapper mb-50">
          <div class="title-cont">
            <div class="top">
              <h5><img :src="`${iconUrl}Asset 536.svg`" /> pricing policy</h5>
            </div>
          </div>
          <div class="card">
            <div class="side-label">
              <div class="label-value">Our cancellation approach</div>
            </div>

            <div class="proposal-section__subtitle">
              <div class="subtitle">We allow free cancellation until:</div>
              <div class="desc">30 days before the event</div>
            </div>
            <cancellation-policy></cancellation-policy>

            <div class="side-label">
              <div class="label-value">Extra Fees</div>
            </div>
            <div class="rules">
              <vendor-pricing-policy-item
                v-for="(p, pIndex) in vendorPricingPolicies.items"
                :key="pIndex + 'component'"
                :item="p"
                @update="setPricePolicy($event, pIndex)"
                theme="purple"
              ></vendor-pricing-policy-item>
            </div>
            <div class="additional-disclaimer">
              <div><span class="font-bold"> Additional Disclaimer</span> <span>* Suggested</span></div>
              <div class="mt-10">
                <textarea></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="health-policy-wrapper">
          <div class="title-cont">
            <div class="top">
              <h5><img :src="`${iconUrl}Union 12.svg`" />Health Policy</h5>
            </div>
          </div>
          <div class="card">
            <div class="title-cont">
              <div class="top">COVID 19 - Exceptional Policy</div>
              <div class="bottom mb-10">
                <p>
                  Please indicate any policy related to Corona - observing and complying with rules within your own
                  venue or an exceptional policy for this period
                </p>
              </div>
            </div>
            <div class="main-cont">
              <textarea v-model="currentService.healthPolicy"></textarea>
            </div>
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
import Multiselect from "vue-multiselect";
import _ from "underscore";

//COMPONENTS
import Icon from "@/components/Icon/Icon.vue";
import VendorServiceItem from "../components/VendorServiceItem.vue";
import VSignupAddRules from "@/components/Inputs/VSignupAddRules.vue";
import TimePicker from "@/components/Inputs/TimePicker";
// import VSignupTimeSelect from '@/components/Inputs/VSignupTimeSelect.vue'
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import { FunctionalCalendar } from "vue-functional-calendar";
import { VendorPolicy, VendorPricingPolicy, VendorCategories } from "@/constants/vendor";
import { capitalize } from "@/utils/string.util";
import VueGoogleAutocomplete from "vue-google-autocomplete";
import VendorPolicyItem from "../components/vendor-policy-item";
import VendorPricingPolicyItem from "../components/vendor-pricing-policy-item";
import CancellationPolicy from "@/components/CancellationPolicy.vue";
import MaryokuInput from "@/components/Inputs/MaryokuInput.vue";

export default {
  name: "vendor-signup-step3",
  props: {
    categories: Array,
    icon: String,
  },
  components: {
    VendorPricingPolicyItem,
    VendorPolicyItem,
    VueElementLoading,
    VendorServiceItem,
    VSignupAddRules,
    FunctionalCalendar,
    VueTimepicker,
    Multiselect,
    CancellationPolicy,
    MaryokuInput,
  },
  data() {
    return {
      iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/Vendor Signup/",
      allowThirdVendor: null,
      workAllDay: false,
      date: {
        selectedDates: [],
      },
      rulesDesc: {
        title: "additional rules",
        placeholder: "Event must be / Suitable for children (2-12 years)",
      },
      policyDesc: {
        title: "Add steps to your cancellation approch:",
        subTitle: "You can add more than one step",
        labels: {
          if: "the client cancel the event after:",
          than: "the client wil pay:",
        },
        placeholder: "Like two weeks before the event ",
        // placeholder: {
        //   if: 'Like two weeks before the event ',
        //   than: 'Like: 30% of deposit',
        // },
      },
      yesRules: [],
      noRules: [],
      yesPolicies: [],
      noPolicies: [],
      noteRules: [],
      religions: [],
      markedDates: [
        // "16/6/2020",
      ],
      markedDateRange: [],
      componentKey: 0,
      allowedCategoryFor3rd: ["venuerental", "foodandbeverage", "decor", "entertainment"],
      weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      selectedWeekdays: ["Saturday", "Sunday"],
      selectedReligion: [],
      isWeekday: false,
      exEvery: false,
      exDont: false,
      isReligion: false,
      exLimitation: false,
      exDonts: [],
      notAllowed: [],
      month: null,
      isOtherNa: false,
      startTime: {
        hh: "12",
        mm: "00",
      },
      endTime: {
        hh: "12",
        mm: "00",
      },
      amPack: {
        start: "AM",
        end: "AM",
      },
      defNa: [
        {
          name: "Food & Beverage",
          value: "foodandbeverage",
        },
        {
          name: "Design and Decor",
          value: "decor",
        },
        {
          name: "Entertainment",
          value: "entertainment",
        },
        {
          name: "Security",
          value: "securityservices",
        },
        {
          name: "Videography and Photography",
          value: "videographyandphotography",
        },
        {
          name: "Equipment Rental",
          value: "equipmentrentals",
        },
        {
          name: "Staffing and Guest Services",
          value: "staffingandguestservices",
        },
        {
          name: "Rentals",
          value: "rentals",
        },
        {
          name: "Other",
          value: "Other",
        },
      ],
      policies: VendorPolicy,
      pricingPolicies: VendorPricingPolicy,
      vendorPolicies: {},
      vendorPricingPolicies: {},
      setAsMainPolicy: false,
    };
  },
  methods: {
    getCategoryNameByValue(value) {
      return VendorCategories.filter((c) => c.value == value)[0].name;
    },
    updateExDonts(religion, holiday) {
      console.log("updateExDonts", holiday);
      holiday.selected = !holiday.selected;

      let date = moment(holiday.start).format("YYYY-M-D");
      let day = moment(holiday.start).date();

      console.log("updateExDonts", day, date);
      if (this.markedDates.find((m) => m === date)) {
        this.markedDates = this.markedDates.filter((m) => m !== date);
        $("span.vfc-span-day:contains(" + day + ")").removeClass("vfc-marked vfc-start-marked vfc-end-marked");
      } else {
        this.markedDates.push(date);
      }

      if (this.currentService.exDonts.find((h) => h.holiday === holiday.holiday)) {
        this.currentService.exDonts.filter((h) => h.holiday !== holiday.holiday);
      } else {
        this.currentService.exDonts.push({
          date: holiday.start,
          holiday: holiday.holiday,
          religion: religion.name,
        });
      }
      console.log("updateExDonts.markedDates", date, this.markedDates);

      this.$root.$emit("update-vendor-value", "exDonts", this.currentService.exDonts);
    },
    updateNa(item) {
      if (this.notAllowed.includes(item)) {
        this.notAllowed = this.notAllowed.filter((n) => n != item);
      } else {
        this.notAllowed.push(item);
      }
      this.$root.$emit("update-vendor-value", "notAllowed", this.notAllowed);
    },
    noteRule(item) {
      if (this.noteRules.includes(item)) {
        this.noteRules = this.noteRules.filter((n) => n != item);
      } else {
        this.noteRules.push(item);
      }
    },
    updateWeekdays(item) {
      // console.log("updateWeekdays", item);
      if (this.selectedWeekdays.includes(item)) {
        this.selectedWeekdays = this.selectedWeekdays.filter((s) => s != item);
      } else {
        this.selectedWeekdays.push(item);
      }
      this.componentKey += 1;
      this.$root.$emit("update-vendor-value", "selectedWeekdays", this.selectedWeekdays);
    },
    updateReligion(item) {
      // console.log("updateReligion", item, this.markedDates, this.date.selectedDates);
      if (this.selectedReligion.length && this.selectedReligion.find((s) => s.name === item.name)) {
        this.selectedReligion = this.selectedReligion.filter((s) => s.name !== item.name);
      } else {
        this.selectedReligion.push(item);
      }
      this.$root.$emit("update-vendor-value", "selectedReligion", this.selectedReligion);
    },
    updateDontWorkDays(e) {
      let day = moment(e.date).date();
      let date = moment(e.date).format("YYYY-M-D");
      let selectedDates = this.date.selectedDates;
      if (this.markedDates.find((m) => m === date)) {
        selectedDates = this.date.selectedDates.filter((s) => s.date !== e.date);

        this.markedDates = this.markedDates.filter((m) => m !== date);
        $("span.vfc-span-day:contains(" + day + ")").removeClass("vfc-marked vfc-start-marked vfc-end-marked");
      }
      // console.log("selectedDays", day, e, this.markedDates, this.date);

      this.$root.$emit("update-vendor-value", "dontWorkDays", selectedDates);
    },
    changeMonth(e) {
      // console.log("changeMonth", this.markedDates, this.date);
      this.month = moment(e).month();
    },
    changeYear(e) {
      // console.log("changeYear", e);
      this.month = moment(e).month();
    },
    updateStartA() {
      if (this.amPack.start == "AM") {
        this.amPack.start = "PM";
      } else {
        this.amPack.start = "AM";
      }
    },
    updateEndA() {
      if (this.amPack.end == "AM") {
        this.amPack.end = "PM";
      } else {
        this.amPack.end = "AM";
      }
    },
    updateDontWorkTime() {
      this.$root.$emit("update-vendor-value", "dontWorkTime", {
        startTime: this.startTime,
        endTime: this.endTime,
        amPack: this.amPack,
      });
    },
    optimizeWeekDays(weekDays) {
      let res = [];
      const wds = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

      if (weekDays) {
        weekDays.forEach((wd) => {
          res.push(wds[(wds.indexOf(capitalize(wd.slice(0, 2))) + 6) % 7]);
        });
      }
      return res;
    },
    setPricePolicy(e, index) {
      console.log(e);
      console.log("setPricePolicy", e);
      this.vendorPricingPolicies.items[index] = e;
      this.$root.$emit("update-vendor-value", "pricingPolicies", this.vendorPricingPolicies.items);
    },
    setPolicy(e, index) {
      console.log("setPolicy", e);
      this.vendorPolicies.items[index] = e;
      this.$root.$emit("update-vendor-value", "policies", this.vendorPolicies.items);
    },
    changeCategorySelector(type, item, value) {
      // console.log(type, item, value);
      item.value = value;

      if (type === "policy") {
        this.$root.$emit("update-vendor-value", "policies", this.vendorPolicies.items);
      } else if (type === "pricePolicy") {
        this.$root.$emit("update-vendor-value", "policies", this.vendorPricingPolicies.items);
      }
    },
    updateAllExDonts(data) {
      let value = !this.isAllHolidays(data);

      this.currentService.exDonts.filter((h) => h.religion !== data.name);
      data.holidays.map((it) => {
        it.selected = value;
        let day = moment(it.start).date();
        let date = moment(it.start).format("YYYY-M-D");
        if (value) {
          this.markedDates.push(date);
        } else {
          this.markedDates = this.markedDates.filter((m) => m !== date);
          $("span.vfc-span-day:contains(" + day + ")").removeClass("vfc-marked vfc-start-marked vfc-end-marked");
        }

        if (value) {
          this.currentService.exDonts.push({
            date: it.start,
            holiday: it.holiday,
            religion: data.name,
          });
        } else {
          this.currentService.exDonts = this.currentService.exDonts.filter((e) => e.holiday !== it.holiday);
        }
      });
      console.log("updateAllExDonts", this.markedDates);
      this.$root.$emit("update-vendor-value", "exDonts", this.currentService.exDonts);
    },
    isAllHolidays(data) {
      return data.holidays.every((it) => it.selected);
    },
    init: async function () {
      // set vendorPricingPolicies from initial pricing policies
      let vendorPricingPolicies = this.pricingPolicies.find((p) => p.category === this.currentService.vendorCategory);

      console.log("vendorPricingPolicies", vendorPricingPolicies);
      // replace vendorPricingPolicies with saved vendor
      if (this.currentService.pricingPolicies && this.currentService.pricingPolicies.length) {
        this.$set(this.vendorPricingPolicies, "items", this.currentService.pricingPolicies);
        this.vendorPricingPolicies.items.map((it, idx) => {
          if (vendorPricingPolicies.items[idx] && vendorPricingPolicies.items[idx].type) {
            this.$set(it, "type", vendorPricingPolicies.items[idx].type);
            this.$set(it, "name", vendorPricingPolicies.items[idx].name);
            if (vendorPricingPolicies.items[idx].isExtraService) {
              this.$set(it, "isExtraService", vendorPricingPolicies.items[idx].isExtraService);
              this.$set(it, "extraService", vendorPricingPolicies.items[idx].extraService);
            }
            if (it.type == 'Boolean' && !it.hasOwnProperty("value")) {
              this.$set(it, "value", false);
            }
          }
        });
      } else {
        this.vendorPricingPolicies = vendorPricingPolicies;
        console.log(vendorPricingPolicies);
        this.vendorPricingPolicies.items.map((it) => {
          if (it.type == 'Boolean') {
            this.$set(it, "value", false);
          }
        });
      }
      let vendorPolicies = this.policies.find((p) => p.category === this.currentService.vendorCategory);
      if (this.currentService.policies && this.currentService.policies.length) {
        this.$set(this.vendorPolicies, "items", this.currentService.policies);
        this.vendorPolicies.items.map((it, idx) => {
          this.$set(it, "type", vendorPolicies.items[idx].type);
          if (it.type == 'Boolean' && !it.hasOwnProperty("value")) {
            this.$set(it, "value", false);
          }
        });
      } else {
        this.vendorPolicies = vendorPolicies;
        this.vendorPolicies.items.map((it) => {
          if (it.type == 'Boolean') {
            this.$set(it, "value", false);
          }
        });
      }

      // set selectedReligion from saved vendor
      if (this.currentService.selectedReligion && this.currentService.selectedReligion.length) {
        this.selectedReligion = this.currentService.selectedReligion;
        this.isReligion = true;
        this.exDont = true;
      }

      // get holidays from serve if they are not saved

      this.religions = JSON.parse(localStorage.getItem("two62-app.holidays"));
      if (!this.religions || !this.religions.length) {
        let res = await this.$http.get(`${process.env.SERVER_URL}/1/holidays`);
        this.religions = res.data;
        localStorage.setItem("two62-app.holidays", JSON.stringify(this.religions));
      }
      // console.log('holidays', this.religions);
      if (this.currentService.exDonts && this.currentService.exDonts.length) {
        this.religions.map((r) => {
          r.holidays.map((h) => {
            h.selected = this.currentService.exDonts.findIndex((e) => e.holiday === h.holiday) !== -1;
          });
        });
      }

      // set selectedWeekdays from saved vendor
      if (this.currentService.selectedWeekdays && this.currentService.selectedWeekdays.length) {
        this.selectedWeekdays = this.currentService.selectedWeekdays;
      }

      // set dontWorkSays from saved vendor
      if (this.currentService.dontWorkDays) {
        this.$set(this.date, "selectedDates", this.currentService.dontWorkDays);
        if (this.currentService.dontWorkDays.length > 0) {
          this.markedDates = [];
          _.each(this.currentService.dontWorkDays, (sd) => {
            this.markedDates.push(sd.date);
          });
        }
      }

      //
      if (this.currentService.exDonts && this.currentService.exDonts.length) {
        this.currentService.exDonts.map((h) => {
          // console.log("exdonts", moment(h.date).format("YYYY-M-D"));
          this.markedDates.push(moment(h.date).format("YYYY-M-D"));
        });
      }

      console.log("init.policies", this.vendorPolicies.items);
      console.log("init.pricingPolicies", this.vendorPricingPolicies.items);

      this.optimizeWeekDays(this.selectedWeekdays);
      this.componentKey += 1;
    },

    renderCalendar() {
      $(".vfc-day").each(function (index, day) {
        if (
          $(day).find("span.vfc-span-day").hasClass("vfc-marked") ||
          $(day).find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed")
        ) {
          if (
            ($(day).next().find("span.vfc-span-day").hasClass("vfc-marked") &&
              $(day).prev().find("span.vfc-span-day").hasClass("vfc-marked")) ||
            ($(day).next().find("span.vfc-span-day").hasClass("vfc-marked") &&
              $(day).prev().find("span.vfc-cursor-not-allowed").hasClass("vfc-cursor-not-allowed")) ||
            ($(day).next().find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed") &&
              $(day).prev().find("span.vfc-span-day").hasClass("vfc-marked")) ||
            ($(day).next().find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed") &&
              $(day).prev().find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed"))
          ) {
            $(day).find("span.vfc-span-day").removeClass("vfc-end-marked");
            $(day).find("span.vfc-span-day").removeClass("vfc-start-marked");
            $(day).find("div.vfc-base-start").remove();
            $(day).find("div.vfc-base-end").remove();
            $(day).find("span.vfc-span-day").addClass("selected");
          }

          if (
            ($(day).next().find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed") ||
              $(day).next().find("span.vfc-span-day").hasClass("vfc-marked")) &&
            !$(day).prev().find("span.vfc-span-day").hasClass("vfc-marked") &&
            !$(day).prev().find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed")
          ) {
            $(day).find("span.vfc-span-day").addClass("vfc-start-marked");
            if (!$(day).find("div.vfc-base-start").length) $(day).prepend("<div class='vfc-base-start'></div>");
          }

          if (
            !$(day).next().find("span.vfc-span-day").hasClass("vfc-marked") &&
            !$(day).next().find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed") &&
            ($(day).prev().find("span.vfc-span-day").hasClass("vfc-marked") ||
              $(day).prev().find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed"))
          ) {
            // console.log('vfc-end-mark', day)
            $(day).find("span.vfc-span-day").addClass("vfc-end-marked");
            if (!$(day).find("div.vfc-base-end").length) $(day).prepend("<div class='vfc-base-end'></div>");
          }

          if (
            !$(day).next().find("span.vfc-span-day").hasClass("vfc-marked") &&
            !$(day).prev().find("span.vfc-span-day").hasClass("vfc-marked") &&
            !$(day).next().find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed") &&
            !$(day).prev().find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed")
          ) {
            // console.log("alone", day);
            $(day).find("span.vfc-span-day").addClass("vfc-end-marked");
            $(day).find("div.vfc-base-start").remove();
            $(day).find("div.vfc-base-end").remove();
          }
        } else {
          $(day).find("div.vfc-base-start").remove();
          $(day).find("div.vfc-base-end").remove();
        }
      });
    },
  },
  computed: {
    additionalRules() {
      return this.$store.state.vendorService.service.additionalRules;
    },
    vendor() {
      return this.$store.state.vendorService.vendor;
    },
    currentService() {
      return this.$store.state.vendorService.service;
    },
  },
  filters: {},
  mounted() {
    this.init();
  },
  updated() {
    this.renderCalendar();
  },
  beforeDestroy() {
    // this.$root.$off("update-vendor-value");
  },
  watch: {
    vendor: {
      handler(newVal) {
        console.log("signup.step3", newVal);
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.vendor-signup-step3-wrapper {
  font-family: Manrope-Regular, sans-serif;

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
      width: 80%;
      height: 53px;
      top: -15px;
      left: -3.5em;
    }

    .label-value {
      position: relative;
      z-index: 999;
    }
  }
  .inside-container {
    display: flex;
    color: #050505;

    .left-side {
      flex: 1;
      margin-right: 122px;

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
      flex: 4;

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
            padding: 22px 30px;
            min-width: 75%;
            border: 1px solid #707070;
            border-radius: 0;
          }
          .main-cont {
            display: flex;
            align-items: center;

            .suffix {
              flex: 3;
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
        .checks-cont {
          display: flex;
          justify-content: flex-start;
          .check-item {
            display: flex;
            align-items: center;
            margin-right: 5rem;
            cursor: pointer;

            img {
              width: 30px;
              height: 30px;
              margin-right: 14px;
            }
          }
          span {
            &.unchecked {
              display: inline-block;
              width: 30px;
              height: 30px;
              border: 1px solid #707070;
              border-radius: 50%;
              background: #ffffff;
              margin-right: 14px;
            }
          }
        }
        .not-allow-cont {
          margin-top: 3rem;
          h4 {
            font: bold 16px Manrope-Regular, sans-serif;
          }
          .na-check-list {
            ul {
              margin: 0;
              list-style: none;
              padding: 0;
              display: grid;
              grid-template-columns: 30% 25% 25% 20%;
              li {
                margin-bottom: 1rem;
                cursor: pointer;
                // display: flex;
                img {
                  width: 27px;
                  height: 27px;
                  margin-right: 0.5rem;
                }
                input {
                  font-size: 16px;
                  padding: 22px 30px;
                  min-width: 75%;
                  border: 1px solid #dddddd;
                  border-radius: 0;
                }
              }
            }
          }
        }
        h5 {
          font: 800 16px Manrope-Regular, sans-serif;
        }
      }
    }
  }
  .title-cont {
    img {
      width: 24px;
      margin-right: 0.5rem;
    }
    h5 {
      text-transform: capitalize;
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
  .calendar-cont {
    display: flex;
    padding: 2rem 0;

    .calendar {
      flex: 1;
      border: solid 1px #a0a0a0;
      height: max-content;
      .calendar-title {
        position: absolute;
        z-index: 999;
        margin: 1.5rem;
        font: normal 16px Manrope-Regular, sans-serif;
      }
      /deep/ .vfc-main-container {
        padding-top: 3rem;
        width: 100%;
      }
      /deep/ .vfc-top-date {
        a {
          text-decoration: none !important;
          font: 600 16px Manrope-Regular, sans-serif;
          color: #050505;
        }
      }
      /deep/ .vfc-arrow-left,
      /deep/ .vfc-arrow-right {
        width: 10px;
        height: 10px;
        color: #f51355;
        border-color: #f51355;
        border-top: 3px solid;
      }
      /deep/ .vfc-arrow-left {
        border-left: 3px solid;
      }
      /deep/ .vfc-arrow-right {
        border-right: 3px solid;
      }
      /deep/ .vfc-dayNames {
        .vfc-day {
          color: #a0a0a0;
          font: 800 14px Manrope-Regular, sans-serif;
        }
      }
      /deep/ .vfc-span-day {
        font: normal 16px Manrope-Regular, sans-serif;
        // padding: 6px 0;
      }
      /deep/ .vfc-base-start,
      .vfc-base-end {
        background: #f51355;
        color: #ffffff;
      }
      /deep/ span.vfc-span-day {
        &.vfc-marked {
          background-color: #f51355;
          color: #ffffff;

          &:not(.vfc-start-marked):not(.vfc-end-marked):before {
            background-color: #f51355 !important;
          }
        }

        &.vfc-cursor-not-allowed {
          color: #fff !important;
          background-color: #f51355;
          z-index: 1;

          &.selected:before {
            background-color: #f51355 !important;
            top: 0;
            left: 0;
            position: absolute;
            content: "";
            width: 100%;
            height: 100%;
            z-index: -1;
          }
        }
      }
      /deep/ .vfc-span-day.vfc-start-marked {
        background-color: #fc1355;
        color: #ffffff;
        z-index: 200;

        &:before {
          border-top-left-radius: 50%;
          border-bottom-left-radius: 50%;
        }
      }
      /deep/ .vfc-span-day.vfc-end-marked {
        &:before {
          border-top-right-radius: 50%;
          border-bottom-right-radius: 50%;
        }
      }
      /deep/ .vfc-week .vfc-day .vfc-base-end {
        background-color: #fc1355;
        color: #ffffff;
      }
      /deep/ .vfc-week .vfc-day span.vfc-span-day.vfc-hovered {
        background-color: #fc1355;
        color: #ffffff;
      }
      /deep/ .vfc-today {
        background-color: #ffd9e4;
        color: #f51355;
        font: 600 14px Manrope-Regular, sans-serif;
      }

      .vfc-select-start {
        background: linear-gradient(90deg, #ffffff 50%, #f51355 50%);
      }

      .vfc-half-end {
        background: linear-gradient(90deg, #f51355 50%, #ffffff 50%);
      }
    }
    .check-list {
      flex: 2;
      margin-right: 2rem;

      .block {
        padding: 1rem 0;
        .title {
          margin-bottom: 1rem;
        }
        .check-field {
          cursor: pointer;
          img {
            width: 27px;
            margin-right: 0.5rem;
          }
          span {
            &.checked {
              font: 600 16px Manrope-Regular, sans-serif;
            }
          }
        }
        .holidays {
          display: flex;

          .dont {
            width: 24px;
            margin-right: 1rem;
            img {
              width: 24px;
            }
          }
          ul {
            padding: 0;
            list-style: none;
            margin: 0;
            display: grid;
            grid-template-columns: 50% 50%;

            li {
              margin-bottom: 1rem;
            }
          }
        }
        .cdropdown {
          border: 1px solid #818080;
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 3rem;
          margin: 1rem 0;
          border-radius: 3px;
          text-align: center;
          cursor: pointer;
          max-width: 250px;

          span {
            flex: 5;
            display: inline-block;
          }
          img {
            width: 8px;
            margin-left: 1rem;
            transform: rotate(90deg);
          }
        }
        .cdropdown-cont {
          border: 1px solid #050505;
          -webkit-box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
          box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
          max-width: 250px;
          padding: 1rem;
          margin-top: -1rem;

          .weekdays {
            text-transform: capitalize;
            display: flex;
            cursor: pointer;
            margin-bottom: 0.5rem;
            img {
              width: 24px;
              height: 24px;
              margin-right: 1rem;
            }
            span {
              display: inline-block;
              width: 24px;
              height: 24px;
              border: 1px solid #050505;
              border-radius: 50%;
              margin-right: 1rem;
            }
            &.last-child {
              margin-bottom: 0;
            }
          }
        }
        .exLimitation {
          .select-time-cont {
            display: flex;
            align-items: center;
            margin: 1rem 0 0 3rem;

            img {
              width: 18px;
              height: 18px;
              margin-right: 1rem;
            }
            .border-line {
              background: black;
              width: 1rem;
              height: 2px;
              margin: 0 1rem;
            }
            .am-field {
              position: relative;
              cursor: pointer;
              input {
                width: 56px;
                height: 45px;
                cursor: pointer;
                border-radius: 3px;
                font: normal 18px Manrope-Regular, sans-serif;
                margin-left: 0.5rem;
                border: 1px solid #707070;
                text-align: center;
              }
              &:before {
                position: absolute;
                content: ">";
                transform: translateX(50%) translateY(calc(100% + 1.2rem)) rotate(90deg);
                left: 40%;
                font-size: 20px;
                font-weight: 800;
              }
            }
            /deep/ .time-picker {
              width: unset;
              input {
                text-align: center;
                width: 110px;
                height: 45px;
                border-radius: 3px;
                font: normal 18px Manrope-Regular, sans-serif;
                border: 1px solid #707070;
                text-align: center;
              }
            }
          }
        }
        &.border {
          border-top: 1px solid #dddddd;
          border-bottom: 1px solid #dddddd;
        }
      }
    }
  }
  .w-16 {
    width: 16px !important;
  }
  .mb-50 {
    margin-bottom: 3rem !important;
  }
  .m-0 {
    margin: 0 !important;
  }
  .mt-1 {
    margin-top: 1rem;
  }
  .mt-2 {
    margin-top: 2rem;
  }
  .ml-title {
    padding: 1rem 0;
    background-color: #ededed;
    width: calc(75% + 60px);
    margin-left: -60px !important;
    padding-left: 60px;

    h4 {
      margin: 0;
      text-transform: capitalize;
      font: 800 16px Manrope-Regular, sans-serif;
    }
  }
  .rules {
    margin-bottom: 3rem;
    .rule {
      padding: 2rem 0;
      border-bottom: 1px solid #dddddd;
      font: 600 16px Manrope-Regular, sans-serif;

      &:first-child {
        padding-top: 0;
      }
      display: flex;
      justify-content: flex-start;
      .left {
        flex: 1;
      }
      .v-grid-with-desc {
        display: grid;
        grid-template-rows: 20% 80%;
      }
      .right {
        flex: 1;
        .top {
          display: flex;
          align-items: start;

          .item {
            display: flex;
            justify-content: flex-start;
            margin-right: 2rem;
            text-align: right;
            cursor: pointer;

            span {
              &.unchecked {
                display: inline-block;
                width: 30px;
                height: 30px;
                border: 1px solid #707070;
                border-radius: 50%;
                background: #ffffff;
                margin-right: 14px;
                position: relative;
                top: -4px;
              }
            }
            img {
              width: 30px;
              height: 30px;
              margin-right: 1rem;
              position: relative;
              top: -4px;
            }
            a {
              font: 800 16px Manrope-Regular, sans-serif;
              cursor: pointer;
              &.note {
                color: #f51355;
              }
              &.cancel {
                color: #050505;
              }
            }
            &:last-child {
              margin-right: 0;
            }
            textarea {
              width: 100% !important;
            }
            &.noflex {
              flex: 1;
              display: inline-block;
              cursor: none;
            }
          }
        }
        .bottom {
          margin-top: 2rem;
          span {
            font: normal 16px Manrope-Regular, sans-serif;
            margin-bottom: 1rem;
            display: inline-block;
          }
          .suffix {
            &:before {
              content: "$";
              position: absolute;
              font-size: 16px;
              color: #818080;
              margin-top: 13px;
              margin-left: 2rem;
            }
            &.percentage {
              &:before {
                content: "%";
              }
            }
            input {
              text-align: center;
              font-size: 16px;
              padding: 22px 30px;
              /*width: 40%;*/
              width: 12rem;
              border: 1px solid #dddddd;
              border-radius: 0;
            }
          }
          .number-field {
            text-align: center;
            font-size: 16px;
            padding: 22px 30px;
            /*width: 40%;*/
            width: 12rem;
            border: 1px solid #dddddd;
            border-radius: 0;
          }
        }
      }
    }
  }
  textarea {
    resize: none;
    width: 100%;
    padding: 1.5rem 2rem;
    font-size: 15px;
    border: 1px solid #dddddd;

    &.desc {
      display: block;
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      min-width: 250px !important;
    }
  }
  .flex-1 {
    flex: 1;
  }
  .no-margin {
    margin: 0 !important;
  }
  .unit-select {
    border: 1px solid #dddddd;
    padding: 15px;
    font-size: 16px;
    color: #32325d;
    // #32325d;
    box-shadow: 0 1px 3px 0 #e6ebf1;
  }

  .multiple-selection {
    width: 18rem;
    display: inline-block;
    height: 50px;

    .multiselect__select {
      top: 15px;
    }
    .multiselect__tags {
      height: 50px;
      border: 1px solid #dddddd;

      .multiselect__single {
        line-height: 30px;
      }
      .multiselect__tags-wrap {
        display: flex;
        overflow: hidden;

        span {
          margin-right: 5px;
          flex-shrink: 0;
          font-size: 16px;
          font-family: "Manrope-regular";
        }
      }
    }
    .multiselect__input {
      height: 30px;
      text-transform: capitalize;
    }
    .multiselect__placeholder {
      line-height: 20px;
    }
  }
}
</style>
