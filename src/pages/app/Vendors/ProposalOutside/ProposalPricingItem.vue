<template>
  <div class="proposal-pricing-items-wrapper">
    <div
      class="pricing-item"
      :class="[{ 'total-wrapper': itemType == 'total' }, { 'bundle-wrapper': itemType == 'bundle' }]"
    >
      <div class="summary" @click="expand()">
        <div class="left">
          <img v-if="itemType == 'price'" :src="getCategoryIcon()" />
          <img v-if="itemType == 'bundle'" :src="`${iconUrl}Asset 577.svg`" />
          <h3 v-if="itemType == 'price'">{{ getServiceCategory(category).title }}</h3>
          <h3 v-if="itemType == 'bundle'">Bundle offer</h3>
          <div v-if="itemType == 'total'" class="total-cont">
            <h4>Total</h4>
            <span v-if="bundleDiscount.isApplied">before discount</span>
          </div>
          <!-- <span v-if="itemType == 'price'">{{ serviceTime.time }}</span> -->
          <div class="bundle-desc" v-if="itemType == 'bundle'">
            <h4>{{ bundleDiscount.percentage }}%</h4>
            <span v-for="(service, index) in bundleDiscount.services" :key="index" style="padding: 0 2px">
              {{ getServiceCategory(service).title }},
            </span>
          </div>
        </div>
        <div class="right">
          <div class="price-cont" v-if="!isExpanded">
            <template v-if="itemType == 'price'">
              <span class="org-price">${{ getTotalPrice(category) | withComma }}</span>
              <!-- <div class="off-cont" v-if="bundleDiscount && bundleDiscount.services.includes(category)">
                ({{ bundleDiscount.percentage }}% off)
                <span>${{ getDiscountedPrice(category) | withComma }}</span>
              </div> -->
              <div class="off-cont" v-if="defaultDiscount.percentage > 0">
                ({{ defaultDiscount.percentage }}% off)
                <span>${{ pricesByCategory[category] | withComma }}</span>
              </div>
            </template>
            <template v-if="itemType == 'total'">
              <!-- <span class="org-price">${{ totalPrice | withComma }}</span> -->
              <template v-if="bundleDiscount && bundleDiscount.isApplied">
                <span class="org-price"
                  >${{ ((getTotalPrice(category) * (100 - bundleDiscount.percentage)) / 100) | withComma }}</span
                >
                <div class="off-cont">
                  ({{ bundleDiscount.percentage }}% off)
                  <span>${{ getTotalPrice(category) | withComma }}</span>
                </div>
              </template>
              <template v-else>
                <span class="org-price">${{ getTotalPrice(category) | withComma }}</span>
              </template>
            </template>
            <template v-if="itemType == 'bundle'">
              <!-- <span class="org-price">${{ totalPrice | withComma }}</span> -->
              <span class="org-price"> -${{ bundleDiscount.price | withComma }} </span>
            </template>
          </div>
          <img
            v-if="itemType == 'price'"
            :src="`${iconUrl}Component 36 (2).svg`"
            :style="`transform: ${isExpanded ? 'rotate(90deg)' : ''}`"
          />
        </div>
      </div>
      <div v-if="isExpanded" class="subitems">
        <div class="editable-sub-items-header">
          <span>Description</span>
          <span class="text-center">QTY</span>
          <span class="text-center">Price per unit</span>
          <span class="text-center">Subtotal</span>
        </div>
        <editable-proposal-sub-item
          v-for="(s, sIndex) in costedServices"
          :key="sIndex"
          :item="s"
          :active="true"
          :isEdit="true"
          :step="3"
          theme="purple"
        />
        <div class="discount-tax-wrapper">
          <div class="item">
            <div class="left">
              <span class="pr-10">Discount</span>
            </div>
            <div class="text-center">
              <span>{{ defaultDiscount.percentage }}%</span>
            </div>
            <div></div>
            <div class="right text-center">
              <span> -${{ getDiscount(category) | withComma }} </span>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <span class="pr-10">Taxes</span>
            </div>
            <div class="text-center">
              <span>{{ defaultTax.percentage }}%</span>
            </div>
            <div></div>
            <div class="right text-center">
              <span> ${{ getTaxPrice(category) | withComma }} </span>
            </div>
          </div>
        </div>
        <div class="editable-sub-items-footer">
          <span>Total</span>
          <span>${{ getTotalPrice(category) | withComma }}</span>
        </div>

        <proposal-requirements
          class="additional-service white-card"
          tableCategory="included"
          label="What Do We Include In This Proposal?"
          icon="includedPrice.png"
          description=""
          key="included"
          :canAdd="false"
          :vendorCategory="category"
        />
        <proposal-requirements
          class="additional-service white-card"
          tableCategory="extra"
          label="Extras"
          icon="cost-requirements.png"
          description="(Asking the client) Wold you like to upgrade & add one of those?"
          key="extra"
          :canAdd="false"
          :vendorCategory="category"
        />
        <div class="attachments-cont" v-if="proposalAttachments[category]">
          <h4>Attachments</h4>
          <div class="files-cont">
            <div class="item" v-for="(file, index) in proposalAttachments[category]" :key="index">
              <img :src="`${iconUrl}Asset 578.svg`" /> Kosher_certificate.pdf
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EditableProposalSubItem from "../Proposal/EditableProposalSubItem.vue";
import CheckListItem from "../components/CheckListItem.vue";
import { categoryNameWithIcons } from "@/constants/vendor";
import { mapGetters } from "vuex";
import ProposalRequirements from "./ProposalRequirements.vue";

export default {
  name: "proposal-pricing-item",
  components: {
    EditableProposalSubItem,
    CheckListItem,
    ProposalRequirements,
  },
  props: {
    category: String,
    isCollapsed: Boolean,
    isDropdown: Boolean,
    proposalRange: Boolean,
    iconUrl: String,
    itemType: String,
    requirements: Array,
  },
  data() {
    return {
      isExpanded: false,
      iconsWithCategory: null,
    };
  },
  methods: {
    expand() {
      if (this.itemType == "price") {
        this.isExpanded = !this.isExpanded;
      }
    },
    getCategoryIcon() {
      console.log(`https://static-maryoku.s3.amazonaws.com/storage/icons/Budget Elements/${this.category}.svg`);
      return `https://static-maryoku.s3.amazonaws.com/storage/icons/Budget Elements/${this.category}.svg`;
    },
    servicesByCategory() {
      return this.requirements.filter((r) => r.requirementsCategory == this.category);
    },
    getOrgPrice() {
      let total = 0;

      if (this.itemType == "price") {
        this.servicesByCategory().forEach((s) => {
          total += s.price;
        });
      } else if (this.itemType == "total") {
        this.requirements.forEach((r) => {
          total += r.price;
        });
      } else {
        total = 0;
      }

      return total;
    },
    getServiceCategory(category) {
      return this.serviceCategories.find((item) => item.key === category);
    },
    getDiscount(category) {
      console.log("this.defaultDiscount.percentage", this.defaultDiscount.percentage);
      return ((this.pricesByCategory[category] * this.defaultDiscount.percentage) / 100).toFixed(2);
    },
    getDiscountedPrice(category) {
      console.log("this.getDiscount()", this.getDiscount(category));
      console.log("this.pricesByCategory[category]", this.pricesByCategory[category]);
      return (this.pricesByCategory[category] - Number(this.getDiscount(category))).toFixed(2);
    },
    getTaxPrice(category) {
      return ((Number(this.getDiscountedPrice(category)) * this.defaultTax.percentage) / 100).toFixed(2);
    },
    getTotalPrice(category) {
      return Number(this.getDiscountedPrice(category)) + Number(this.getTaxPrice(category));
    },
  },
  created() {},
  mounted() {
    this.iconsWithCategory = Object.assign([], categoryNameWithIcons);
  },
  computed: {
    ...mapGetters("proposalForNonMaryoku", [
      "finalPriceOfMainCategory",
      "pricesByCategory",
      "originalPriceOfMainCategory",
      "totalPriceByCategory",
    ]),
    serviceCategories() {
      return this.$store.state.common.serviceCategories;
    },
    bundleDiscount() {
      return this.$store.state.proposalForNonMaryoku.bundleDiscount;
    },
    proposalServices() {
      return this.$store.state.proposalForNonMaryoku.proposalServices;
    },
    proposalAttachments() {
      return this.$store.state.proposalForNonMaryoku.attachments || {};
    },
    totalPrice() {
      let s = 0;
      Object.keys(this.pricesByCategory).forEach((category) => {
        s += this.pricesByCategory[category];
      });
      return s;
    },
    costedServices() {
      return this.$store.state.proposalForNonMaryoku.costServices[this.category];
    },
    includedServices() {
      return this.$store.state.proposalForNonMaryoku.includedServices[this.category];
    },
    extraServices() {
      return this.$store.state.proposalForNonMaryoku.extraServices[this.category];
    },
    services: {
      get: function () {
        if (this.tableCategory === "cost")
          return this.$store.state.proposalForNonMaryoku.costServices[this.vendorCategory];
        else if (this.tableCategory === "included")
          return this.$store.state.proposalForNonMaryoku.includedServices[this.vendorCategory];
        else if (this.tableCategory === "extra")
          return this.$store.state.proposalForNonMaryoku.extraServices[this.vendorCategory];
      },
      set: function (newServices) {
        if (this.tableCategory === "cost")
          this.$store.commit("proposalForNonMaryoku/setCostServices", {
            category: this.vendorCategory,
            services: newServices,
          });
        else if (this.tableCategory === "included")
          this.$store.commit("proposalForNonMaryoku/setIncludedServices", {
            category: this.vendorCategory,
            services: newServices,
          });
        else if (this.tableCategory === "extra")
          this.$store.commit("proposalForNonMaryoku/setExtraServices", {
            category: this.vendorCategory,
            services: newServices,
          });
      },
    },
    defaultTax() {
      return this.$store.state.proposalForNonMaryoku.taxes["total"] || { percentage: 0, price: 0 };
    },
    defaultDiscount() {
      return this.$store.state.proposalForNonMaryoku.discounts["total"] || { percentage: 0, price: 0 };
    },
    // serviceTime() {
    //   // if (!this.proposalRequest) {
    //   //   return {
    //   //     time: "",
    //   //     date: "",
    //   //   };
    //   // }
    //   const proposalRequest = this.$store.state.proposalForNonMaryoku.proposalRequest;
    //   const timelineDates = proposalRequest.eventData.timelineDates;
    //   // if (!timelineDates)
    //   //   return {
    //   //     time: "",
    //   //     date: "",
    //   //   };
    //   let serviceTimeString = this.category === "venuerental" ? "All Day" : "Not planned yet";
    //   let serviceDate = "";
    //   timelineDates.forEach((td) => {
    //     td.timelineItems.forEach((timelineItem) => {
    //       if (
    //         timelineItem &&
    //         timelineItem.eventCategory &&
    //         timelineItem.eventCategory.includes(this.vendor.eventCategory.key)
    //       ) {
    //         console.log(timelineItem.eventCategory, this.vendor.eventCategory.key);
    //         serviceTimeString = `${this.$dateUtil.formatScheduleDay(
    //           Number(timelineItem.startTime),
    //           "hh:mm A",
    //         )}-${this.$dateUtil.formatScheduleDay(Number(timelineItem.endTime), "hh:mm A")}`;
    //         serviceDate = this.$dateUtil.formatScheduleDay(Number(timelineItem.endTime), "MMM DD, YYYY");
    //       }
    //     });
    //   });
    //   if (!serviceDate) {
    //     serviceDate = `${this.$dateUtil.formatScheduleDay(
    //       Number(proposalRequest.eventData.eventStartMillis),
    //       "MMM DD, YYYY",
    //     )}`;
    //   }
    //   return {
    //     time: serviceTimeString,
    //     date: serviceDate,
    //   };
    // },
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
.proposal-pricing-items-wrapper {
  background-color: #ffffff;
  font-family: "Manrope-Regular", sans-serif;
  color: #050505;
  margin: 20px 0;

  .pricing-item {
    padding: 46px 50px 48px 60px;
    background-color: #ffffff;
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
    border-radius: 3px;

    .summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;

      .left {
        display: flex;
        align-items: center;

        h3 {
          margin: 0;
          margin-left: 30px;
          font-size: 30px;
          font-weight: 800;
        }
        span {
          font-size: 20px;
          margin-left: 30px;
        }
        img {
          width: 28px;
        }
        .bundle-desc {
          display: flex;
          align-items: center;
          h4 {
            margin: 0 12px;
            font-size: 30px;
          }
          span {
            font-size: 16px;
            font-weight: 800;
          }
        }
        .total-cont {
          h4 {
            font-size: 22px;
            font-weight: 800;
            margin: 0;
          }
          span {
            margin: 0;
            font-size: 14px;
            margin-top: 7px;
            text-transform: capitalize;
          }
        }
      }
      .right {
        display: flex;

        img {
          width: 12px;
          margin-left: 50px;
        }
        .price-cont {
          text-align: right;
          span {
            &.org-price {
              font-size: 20px;
              font-weight: 800;
            }
          }
          .off-cont {
            padding-top: 9px;
            color: #707070;
            font-size: 14px;
            span {
              text-decoration: line-through;
            }
          }
        }
      }
    }

    &.total-wrapper {
      background-color: #404040;
      color: #ffffff;

      .right {
        .price-cont {
          margin-right: 60px;
          color: #ffffff;
          .off-cont {
            color: #ffffff;
          }
        }
      }
    }

    &.bundle-wrapper {
      background-color: #ffedb7;

      .summary {
        .left {
          .bundle-desc {
            span {
              margin: 0;
            }
          }
        }
        .right {
          .price-cont {
            margin-right: 60px;
          }
        }
      }
    }

    .subitems {
      // background: #f7f7f7;
      margin-top: 30px;

      .editable-sub-items-header {
        padding: 40px 34px 26px 34px;
        display: grid;
        grid-template-columns: 40% 15% 15% 15% 15%;

        span {
          display: inline-block;
          font-size: 16px;
          font-weight: 800;
        }
      }
      .discount-tax-wrapper {
        padding: 0 38px;
        background: #ededed;
        border-top: 1.5px solid #818080;

        .item {
          display: grid;
          grid-template-columns: 40% 15% 15% 15% 15%;

          font-size: 16px;
          font-weight: 800;
          color: #818080;
          padding: 24px 0;
          .left {
            display: grid;
            grid-template-columns: 30% 0%;
          }
          .right {
          }
          &:first-child {
            border-bottom: 1px solid #707070;
          }
        }
      }
      .editable-sub-items-footer {
        background: #424242;
        color: white;
        padding: 20px 40px;
        display: grid;
        grid-template-columns: 70% 30%;

        span {
          font-size: 20px;
          font-weight: 800;

          &:last-child {
            margin-right: 155px;
          }
        }
      }
    }
    .additional-service {
      margin-left: -60px;
      margin-right: -50px;
      padding: 20px;
      background: #ffffff;
      margin-top: 10px;
    }
    .services-check-list-wrapper {
      background-color: #ffffff;
      padding: 50px 0px 60px 0px;
      display: flex;
      flex-wrap: wrap;

      h4 {
        text-transform: capitalize;
        font-size: 22px;
        font-weight: 800;
        margin: 0 0 32px 0;
      }
      .check-list-cont {
        width: 100%;
        ul {
          padding: 0;
          list-style: none;
          -webkit-column-count: 2;
          -moz-column-count: 2;
          column-count: 2;
          list-style-position: inside;
          li {
            a {
              &.add-service {
                cursor: pointer;
                display: inline-block;
                padding: 15px 40px;
                img {
                  width: 0px;
                  margin-right: 0px;
                }
                font-size: 14px;
                border: 1px dashed #f51355;
                border-radius: 3px;
              }
            }
            &:first-child,
            &:nth-child(2n) {
              margin-left: 0 !important;
              margin-right: 70px;
            }
            &:nth-child(2n + 1) {
              margin-left: 60px;
            }
            &:nth-child(2n) {
              &:after {
                content: "";
                background-color: #000;
                position: absolute;
                width: 1px;
                height: auto;
                display: block;
              }
            }
          }
        }
      }
    }
    .extras-wrapper {
      margin-left: -60px;
      margin-right: -50px;
      padding: 60px;
      background: #ffffff;
      border-top: 1px solid #818080;
      h4 {
        font-size: 22px;
        font-weight: 800;
        margin: 0;

        img {
          width: 14px;
          margin-right: 16px;
          top: -2px;
          position: relative;
        }
      }
      p {
        margin-top: 13px;
        margin-bottom: 35px;
        font-size: 16px;
      }
      .extra-items {
        width: 75%;
      }
    }
    .attachments-cont {
      margin-left: -60px;
      margin-right: -50px;
      padding: 60px;
      background: #ffffff;
      border-top: 1px solid #818080;
      h4 {
        font-size: 22px;
        font-weight: 800;
        margin: 0;
        margin-bottom: 30px;
      }
      .files-cont {
        display: flex;
        .item {
          border: 1px solid #f51355;
          color: #f51355;
          border-radius: 3px;
          font-size: 16px;
          padding: 18px 30px;
          margin-right: 40px;

          img {
            width: 12px;
            margin-right: 0px;
            transform: rotate(45deg);
          }

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
