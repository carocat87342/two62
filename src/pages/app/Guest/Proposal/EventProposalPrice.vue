<template>
  <div class="pricing-section__item element-block p-60 pt-40">
    <div class="d-flex justify-content-between align-center">
      <div class="item-info d-flex justify-content-start align-center">
        <div class="element-title">
          <md-checkbox
            v-model="proposalData.bookedServices"
            :value="serviceCategory"
            @change="changeBookService"
            v-if="!mandatory"
          ></md-checkbox>
          <img :src="`${$iconURL}Budget+Elements/${vendorCategory.icon}`" />
          {{ vendorCategory.fullTitle }}
          <span class="element-duration">For Whole Event</span>
        </div>
      </div>
      <div class="item-pricing d-flex justify-content-end align-center">
        <div class="element-value" v-if="!expand">
          <div class="element-price">${{ totalPrice | withComma }}</div>
          <div class="discount-details" v-if="discount.percentage">
            ({{ discount.percentage }}% off)
            <span>${{ priceOfCostservices | withComma }}</span>
          </div>
        </div>
        <div class="view-element">
          <md-button class="md-just-icon md-simple md-red" :class="{ expanded: expand }" @click="expand = !expand">
            <img :src="`${$iconURL}Submit%20Proposal/Component 36.svg`" />
          </md-button>
        </div>
      </div>
    </div>
    <!-- Expanded Section -->
    <div class="expanded-section" v-if="expand">
      <div
        class="loading"
        v-if="proposalData.attachements && proposalData.attachements.length && !fetchingAllAttachments"
      >
        Loading ...
      </div>
      <div class="element-pricing-table elements-list">
        <div class="element-pricing-table-header">
          <div>Description</div>
          <div class="text-right">QTY</div>
          <div class="text-right">Price per unit</div>
          <div class="text-right">Subtotal</div>
          <div></div>
        </div>
        <div class="element-pricing-table-body">
          <template v-for="(service, index) in costServices">
            <div
              class="element-pricing-table-body-row"
              :key="`cost-service-${index}`"
              v-if="service.plannerOptions.length === 0"
            >
              <div>
                <md-icon class="color-red mr-5" v-if="service.isExtra">add_circle_outline</md-icon>
                {{ service.requirementTitle }}
                <span class="complimentary-tag" v-if="service.isComplimentary">Complimentary</span>
              </div>
              <div class="text-right">{{ service.requirementValue }}</div>
              <div class="text-right" :class="{ crosslinedText: service.isComplimentary }">
                ${{ service.price | withComma }}
              </div>
              <div class="text-right" :class="{ crosslinedText: service.isComplimentary }">
                ${{ (service.requirementValue * service.price) | withComma }}
              </div>
              <div class="element-actions">
                <md-button class="md-simple edit-btn" @click="removeService(service)" v-if="service.isExtra">
                  <img :src="`${$iconURL}common/trash-dark.svg`" />
                </md-button>
              </div>
            </div>
            <template v-else>
              <div class="element-pricing-table-body-row">
                <div>
                  <span class="font-bold">{{ service.requirementTitle }}</span> <br />
                  <span class="font-size-14">Please Choose:</span>
                </div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div class="options-list">
                <img :src="`${$iconURL}common/enter-gray.svg`" />
                <div
                  class="option-row"
                  :class="`${index > 0 ? 'border-top' : ''}`"
                  :key="`planner-option-${index}`"
                  v-for="(option, index) in service.plannerOptions"
                >
                  <div class="d-flex align-center pl-40">
                    <md-radio class="m-0" v-model="service.selectedPlannerOption" :value="index">
                      {{ option.description }}
                    </md-radio>
                  </div>
                  <div class="text-right">{{ option.qty }}</div>
                  <div class="text-right" :class="{ crosslinedText: service.isComplimentary }">
                    ${{ option.price | withComma }}
                  </div>
                  <div class="text-right" :class="{ crosslinedText: service.isComplimentary }">
                    ${{ (option.qty * option.price) | withComma }}
                  </div>
                  <div class="element-actions">
                    <md-button class="md-simple edit-btn" @click="removeService(service)" v-if="service.isExtra">
                      <img :src="`${$iconURL}common/trash-dark.svg`" />
                    </md-button>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
      <div class="element-pricing-table taxes-list">
        <table>
          <tbody>
            <tr>
              <td colspan="3">
                <span class="taxes-title">Discount</span>
                <span class="taxes-percentage">{{ discount.percentage }}%</span>
              </td>
              <td>-${{ discount.price | withComma }}</td>
              <td class="element-actions">
                <md-button class="md-simple md-just-icon">
                  <img :src="`${$iconURL}Submit%20Proposal/Asset 311.svg`" />
                </md-button>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <span class="taxes-title">Taxes</span>
                <span class="taxes-percentage">{{ tax.percentage }}%</span>
              </td>
              <td>${{ tax.price | withComma }}</td>
              <td class="element-actions">
                <md-button class="md-simple md-just-icon">
                  <img :src="`${$iconURL}Submit%20Proposal/Asset 311.svg`" />
                </md-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="element-pricing-table total-list">
        <table>
          <tbody>
            <tr>
              <td colspan="3">
                <b class="font-size-22">Total</b>
                <div class="font-size-14" v-if="discount.percentage">Before discount</div>
              </td>
              <td class="element-value">
                <div class="element-price">${{ totalPrice | withComma }}</div>
                <div class="discount-details" v-if="discount.percentage">
                  ({{ discount.percentage }}% off)
                  <span>${{ priceBeforeDiscount | withComma }}</span>
                </div>
              </td>
              <td class="element-actions">
                <md-button class="md-simple md-just-icon">
                  <img :src="`${$iconURL}Submit%20Proposal/Asset 311.svg`" />
                </md-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="proposal-includes">
        <div class="proposal-includes__title font-size-22">
          <img data-v-5af98ad9="" :src="`${$iconURL}NewSubmitPorposal/includedPrice.png`" class="page-icon mr-10" />
          What Do We Include In This Proposal?
        </div>
        <template v-if="includedServices.length">
          <included-service-item
            class="proposal-includes__item"
            v-for="(item, index) in includedServices"
            :item="item"
            :key="index"
          >
          </included-service-item>
        </template>
      </div>
      <div class="extras-section" v-if="extraServices.length">
        <div class="extras-section__title">
          <h3 class="font-size-22">
            <img
              src="https://static-maryoku.s3.amazonaws.com/storage/icons/budget+screen/SVG/Asset%2010.svg"
              width="12"
            />
            Extras
          </h3>
          <div class="extras-section__header">
            <span>Would you like to upgrade & add one of these?</span>
            <div class="text-center">QTY</div>
            <div class="text-center">Price per unit</div>
          </div>
        </div>
        <div class="extras-section__list">
          <extra-service-item
            class="extras-section__item"
            v-for="(item, index) in extraServices.filter((item) => item.price)"
            :key="`extra-service-item-${index}`"
            :item="item"
            @add="addExtraService(item)"
          ></extra-service-item>
        </div>
      </div>
      <div class="proposal-section attachments-section" v-if="attachedFiles.length">
        <div class="proposal-section__title">Attachments</div>

        <ul class="attachments-list_items">
          <li class="attachments-list_item" v-for="(item, index) in attachedFiles" :key="index">
            <a target="_blank" :href="`${item.fullPath}`">
              <md-icon>attach_file</md-icon>
              {{ item.tag ? item.tag.replace(/_/g, " ") : `Attachment${index + 1}` }}
            </a>
          </li>
        </ul>
      </div>
    </div>
    <!-- ./Expanded Section -->
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import ExtraServiceItem from "./ExtraServiceItem";
import IncludedServiceItem from "./IncludedServiceItem.vue";
export default {
  name: "event-proposal-price",
  components: {
    ExtraServiceItem,
    IncludedServiceItem,
  },
  props: {
    proposalData: {
      type: Object,
      default: () => {},
    },
    serviceCategory: {
      type: String,
      default: "",
    },
    mandatory: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expand: false,
      addedServices: [],
      extraServices: [],
      attachedFiles: [],
    };
  },
  created() {
    this.extraServices = this.proposalData.extraServices[this.serviceCategory]
      ? this.proposalData.extraServices[this.serviceCategory].filter((item) => !item.hideOnProposal)
      : [];
  },
  methods: {
    addExtraService(extraService) {
      const itemIndex = this.extraServices.findIndex((item) => item.requirementTitle === extraService.requirementTitle);
      if (itemIndex >= 0) {
        this.$set(this.extraServices[itemIndex], "added", true);
        extraService.isExtra = true;
        this.costServices.push(extraService);
      }
      this.extraServices = [...this.extraServices];

      console.log("this.extraServices", this.extraServices);
      this.$emit("changeAddedServices", {
        category: this.serviceCategory,
        costServices: this.costServices,
        extraServices: this.extraServices,
      });
      this.$forceUpdate();
    },
    removeService(extraService) {
      const itemIndex = this.extraServices.findIndex((item) => item.requirementTitle === extraService.requirementTitle);
      const addedIndex = this.costServices.findIndex((item) => item.requirementTitle === extraService.requirementTitle);
      if (itemIndex >= 0) {
        this.$set(this.extraServices[itemIndex], "added", false);
        this.costServices.splice(addedIndex, 1);
      }
      this.extraServices = [...this.extraServices];
      this.$emit("changeAddedServices", {
        category: this.serviceCategory,
        costServices: this.costServices,
        extraServices: this.extraServices,
      });
      this.$forceUpdate();
    },
    changeBookService() {
      this.$emit("changeBookedServices");
    },
  },
  computed: {
    ...mapState("event", ["eventData", "eventModalOpen", "modalTitle", "modalSubmitTitle", "editMode"]),
    ...mapGetters({
      components: "event/getComponentsList",
    }),
    extraMissingRequirements() {
      return _.union(this.proposalData.extras, this.proposalData.missing);
    },
    headerBackgroundImage() {
      if (this.proposalData.inspirationalPhotos && this.proposalData.inspirationalPhotos[0])
        return this.proposalData.inspirationalPhotos[0].url;
      if (this.proposalData.vendor.images && this.proposalData.vendor.images[0])
        return this.proposalData.vendor.images[0];
      if (this.proposalData.vendor.vendorImages && this.proposalData.vendor.vendorImages[0])
        return this.proposalData.vendor.vendorImages[0];
      return "";
    },
    discount() {
      if (!this.proposalData.discounts) return { percentage: 0, price: 0 };
      let discount = { ...this.proposalData.discounts["total"] };
      if (!discount) {
        discount = { price: 0, percentage: 0 };
      }
      discount.price = (this.priceOfCostservices * discount.percentage || 0) / 100;
      return discount;
    },
    tax() {
      if (!this.proposalData.taxes) return { percentage: 0, price: 0 };
      let tax = { ...this.proposalData.taxes["total"] };
      if (!tax) {
        tax = { price: 0, percentage: 0 };
      }
      tax.price = Math.round(((this.priceOfCostservices - this.discount.price) * (tax.percentage || 0)) / 100);
      return tax;
    },
    costServices() {
      return this.proposalData.costServices[this.serviceCategory] || [];
    },
    includedServices() {
      return this.proposalData.includedServices[this.serviceCategory] || [];
    },

    priceOfCostservices() {
      if (!this.costServices || this.costServices.length === 0) return 0;
      return (
        this.costServices.reduce((s, item) => {
          return item.isComplimentary ? s : s + item.requirementValue * item.price;
        }, 0) +
        this.addedServices.reduce((s, item) => {
          return s + item.requirementValue * item.price;
        }, 0)
      );
    },
    priceBeforeDiscount() {
      return this.priceOfCostservices - (this.priceOfCostservices * this.tax.percentage) / 100;
    },
    totalPrice() {
      return this.priceOfCostservices - this.discount.price + this.tax.price;
    },
    extraServicePrice() {
      return this.extraServices.reduce((s, item) => {
        return s + item.requirementValue * item.price;
      }, 0);
    },
    validPolicy() {
      if (this.proposalData.vendor.policies)
        return this.proposalData.vendor.policies.filter(
          (item) => item.hasOwnProperty("value") || (item.type === "Including" && item.cost),
        );
      return null;
    },
    additionalRules() {
      return this.proposalData.vendor.additionalRules;
    },
    categories() {
      return this.$store.state.common.serviceCategories;
    },
    vendorCategory() {
      return this.categories.find((item) => item.key === this.serviceCategory) || {};
    },
  },
};
</script>
<style lang="scss" scoped>
.element-block {
  color: #050505;
  border-radius: 3px 3px 0 0;
  box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  margin-bottom: 1em;

  .complimentary-tag {
    color: #ba8d05;
    font-weight: normal;
    font-size: 11px;
    display: inline-block;
    border: solid 1px #ba8d05;
    padding: 4px 8px;
    border-radius: 30px;
    margin-left: 0.5em;
    line-height: 1em;
    position: relative;
  }
  &.bundle-offer {
    background-color: #ffedb7;

    .discount-percentage {
      font-weight: normal;
      margin: 0 6px;
    }
    .bundle-title {
      font-size: 14px;
    }

    .original-price {
      font-size: 18px;
      font-weight: 500;
      color: #818080;
      text-decoration: line-through;
    }
    .new-price {
      font-size: 20px;
    }
  }

  .styled-checkbox {
    position: absolute; // take it out of document flow
    opacity: 0; // hide it

    & + label {
      position: relative;
      cursor: pointer;
      padding: 0;
    }

    // Box.
    & + label:before {
      content: "";
      margin-right: 10px;
      display: inline-block;
      vertical-align: text-top;
      width: 25px;
      height: 25px;
      background: white;
      border: 2px solid #a0a0a0;
      border-radius: 2px;
    }

    // Box hover
    &:hover + label:before {
      border-color: $rose;
    }

    // Box checked
    &:checked + label:before {
      border-color: $rose;
    }

    // Disabled state label.
    &:disabled + label {
      color: #b8b8b8;
      cursor: auto;
    }

    // Disabled box.
    &:disabled + label:before {
      box-shadow: none;
      background: #ddd;
    }

    // Checkmark. Could be replaced with an image
    &:checked + label:after {
      content: "";
      position: absolute;
      left: 7px;
      top: 12px;
      background: $rose;
      width: 2px;
      height: 2px;
      box-shadow: -2px 0 0 $rose, 2px 0 0 $rose, 4px 0 0 $rose, 4px -2px 0 $rose, 4px -4px 0 $rose, 4px -6px 0 $rose,
        4px -8px 0 $rose, 4px -10px 0 $rose;
      transform: rotate(45deg);
    }
  }

  .select-item {
    margin-right: 1em;
  }

  .element-title {
    display: flex;
    align-items: center;
    font-size: 28px;

    img {
      width: 30px;
      margin-right: 0.2em;
    }

    .element-duration {
      font-size: 18px;
      font-weight: normal;
      margin-left: 4em;
    }
  }

  .element-value {
    font-size: 18px;
    text-align: right;

    .discount-details {
      font-size: 12px;
      color: #707070;

      span {
        text-decoration: line-through;
        margin-left: 0.7em;
        margin-top: 0.3em;
        display: inline-block;
      }
    }
  }

  .view-element {
    margin-left: 1em;
    img {
      width: 13px;
    }

    .expanded {
      img {
        transform: rotate(90deg);
      }
    }
  }

  .expanded-section {
    margin-top: 1em;

    .proposal-includes {
      padding-right: 20%;
      &__title {
        font-size: 20px;
        font-weight: 800;
        color: #050505;
        margin-bottom: 1em;
      }

      &__item {
        &:not(:last-child) {
          border-bottom: 1px solid #cccccc;
        }
        img {
          width: 20px;
          margin-right: 1em;
        }
        .item-actions {
          img {
            width: 6px;
            margin: auto;
          }
        }

        .item-description {
          float: left;
          font-weight: normal;
          font-size: 12px;
          width: 67%;
          line-height: 1.71;
        }
      }
    }

    .extras-section {
      margin-top: 5em;
      padding-right: 20%;
      position: relative;

      &:after {
        content: " ";
        position: absolute;
        top: -2em;
        left: -25px;
        right: 0;
        width: calc(100% + 50px);
        background: #ccc;
        height: 1px;
      }

      &__header {
        display: grid;
        grid-template-columns: 50% 15% 15% 15% 5%;
      }
      &__title {
        margin-bottom: 1em;
        h3 {
          margin: 0 0 0.5em;
          font-size: 20px;
          font-weight: 800;
        }

        small {
          font-size: 14px;
        }
      }

      &__item:not(:last-child) {
        border-bottom: 1px solid #ccc;
      }
    }
  }
  .element-pricing-table {
    padding: 1.5em;
    font-family: "Manrope-Regular", sans-serif;
    &-header {
      display: grid;
      grid-template-columns: 30% 20% 20% 20% 10%;
      font-weight: bold;
      padding: 1em 0;
    }
    &-body {
      &-row {
        display: grid;
        grid-template-columns: 30% 20% 20% 20% 10%;
        border-top: 1px solid #ddd;
        padding: 1.5em 0;
      }
      .options-list {
        img {
          position: absolute;
        }
      }
      .option-row {
        display: grid;
        grid-template-columns: 30% 20% 20% 20% 10%;
        padding: 1em 0;
        &.border-top {
          border-top: 1px solid #ddd;
        }
      }
    }
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
</style>
