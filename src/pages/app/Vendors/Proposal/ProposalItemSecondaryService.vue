<template>
  <div class="proposal-item-secondary-service">
    <div class="title-cont dropdown" :class="{ opened: isExpanded }" @click="toggle($event)">
      <div class="left-side">
        <div class="check-cont" @click="clickItem($event, service.componentId)">
          <img v-if="isChecked" :src="`${$iconURL}Submit%20Proposal/group-5661.svg`" />
          <img v-else :src="`${iconUrl}Rectangle 1245 (2).svg`" />
        </div>
        <h3 class="title">
          <img :src="img" />
          <span>{{ category }}</span>
        </h3>
      </div>
      <div class="right-side">
        <div class="budget-cont">
          <span>Budget</span>
          <span>${{ service.allocatedBudget | withComma }}</span>
        </div>
        <div class="proposal-range-cont">
          <span>You're the First bidder</span>
        </div>
        <img
          @click="toggle($event)"
          :src="`${iconUrl}Component 36 (2).svg`"
          :style="`transform: ${isExpanded ? 'rotate(90deg)' : ''}`"
        />
      </div>
    </div>
    <template v-if="isExpanded">
      <proposal-requirements
        class="additional-service"
        label="Cost Items"
        key="cost"
        tableCategory="cost"
        icon="Group+10662.svg"
        description="Mandatory elements to involve in proposals are in the table, you can add more here:"
        :vendorCategory="service.componentId"
      />
      <proposal-requirements
        class="additional-service"
        tableCategory="included"
        label="Included in Price"
        icon="includedPrice.png"
        description="(from your “included in price” items)"
        key="included"
        :vendorCategory="service.componentId"
      />
      <proposal-requirements
        class="additional-service"
        tableCategory="extra"
        label="Offered Extras"
        icon="cost-requirements.png"
        description="What elements would you like to suggest to the client with extra pay? "
        key="extra"
        :vendorCategory="service.componentId"
      />
      <!-- <proposal-upload-legal></proposal-upload-legal> -->
    </template>
  </div>
</template>
<script>
import ProposalRequest from "@/models/ProposalRequest";
import ProposalRequestFile from "@/models/ProposalRequestFile";

import InputProposalSubItem from "@/components/Inputs/InputProposalSubItem.vue";
import SelectProposalSubItem from "../components/SelectProposalSubItem.vue";
import EditableProposalSubItem from "./EditableProposalSubItem.vue";
import { Money } from "v-money";

import vue2Dropzone from "vue2-dropzone";
import S3Service from "@/services/s3.service";
import ProposalServiceTable from "./ProposalServiceTable";
import ProposalUploadLegal from "./ProposalUploadLegal";
import ProposalRequirements from "./ProposalRequirements.vue";
export default {
  name: "proposal-item",
  components: {
    InputProposalSubItem,
    SelectProposalSubItem,
    EditableProposalSubItem,
    Money,
    vueDropzone: vue2Dropzone,
    ProposalServiceTable,
    ProposalRequirements,
    ProposalUploadLegal,
  },
  props: {
    category: String,
    isCollapsed: Boolean,
    isDropdown: Boolean,
    proposalRange: Boolean,
    subTitle: String,
    img: String,
    step: Number,
    services: Array,
    proposalRequest: Object,
    vendor: Object,
    service: Object,
  },
  data() {
    return {
      iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/NewSubmitPorposal/",
      isEditDiscount: false,
      isEditTax: false,
      clickedItem: false,
      discount: 0,
      discount_by_amount: 0,
      isDiscountPercentage: true,
      tax: 0,
      serviceItem: null,
      qty: null,
      unit: null,
      subTotal: null,
      inputType: "text",
      temp: null,
      isNumberVisible: true,
      newProposalRequest: {},
      files: [],
      docTag: null,
      serviceSlidePos: 0,
      servicesWidth: 0,
      isExpanded: false,
      currencyFormat: {
        decimal: ".",
        thousands: ",",
        prefix: "$",
        suffix: "",
        precision: 0,
        masked: false,
      },
      qtyFormat: {
        decimal: ".",
        thousands: ",",
        prefix: "",
        suffix: "",
        precision: 0,
        masked: false,
      },
      percentageFormat: {
        decimal: ".",
        thousands: ",",
        prefix: "",
        suffix: "  %",
        precision: 0,
        masked: false,
      },
      selectedQuickButton: "",
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 150,
        maxFilesize: 10,
      },
    };
  },
  methods: {
    toggle(event) {
      event.stopPropagation();
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded) {
        this.$store.commit("vendorProposal/setValue", {
          key: "currentSecondaryService",
          value: this.service.componentId,
        });
      }
    },
    changeItem(event){

    },
    clickItem(event, category) {
      event.stopPropagation();

      let services = this.additionalServices;
      if (!this.isChecked) {

        this.isExpanded = true;
        this.$store.commit("vendorProposal/setValue", {
          key: "currentSecondaryService",
          value: this.service.componentId,
        });
        services.push(category);
      } else {
        services = services.filter(s => s !== category);
        this.isExpanded = false;
      }
      this.$store.commit('vendorProposal/setAdditionalServices', services);

      this.$root.$emit("update-additional-services", category);
    },
    cancel() {
      this.selectedQuickButton = "";
      this.qty = 0;
      this.unit = 0;
      this.subTotal = 0;
      this.serviceItem = null;
      this.discount_by_amount = null;
    },
  },
  created() {
    this.newProposalRequest = this.proposalRequest;
    this.mandatoryRequirements.forEach((item) => {
      // if (
      //   this.newProposalRequest.requirements.length == 0 ||
      //   this.newProposalRequest.requirements.findIndex((requirement) => requirement.requirementTitle !== item.item) < 0
      // )
      this.newProposalRequest.requirements.push({
        comments: [],
        dateCreated: "",
        includedInPrice: true,
        itemNotAvailable: false,
        price: 0,
        priceUnit: "qty",
        proposalRequest: { id: this.proposalRequest.id },
        requirementComment: null,
        requirementId: "",
        requirementMandatory: false,
        requirementPriority: null,
        requirementTitle: item.item,
        requirementsCategory: item.category,
        requirementValue: 1,
      });
    });

    this.$forceUpdate();
    this.$root.$emit("update-proposal-budget-summary", this.newProposalRequest, {});
    this.$root.$on("remove-proposal-requirement", (item) => {
      this.newProposalRequest.requirements = this.newProposalRequest.requirements.filter(
        (req) => req.requirementTitle != item.requirementTitle,
      );
      this.$root.$emit("update-proposal-budget-summary", this.newProposalRequest, {});
      this.$forceUpdate();
      this.cancel();
    });

    this.$root.$on("add-service-item", (item) => {
      this.clickedItem = !this.clickedItem;
      this.serviceItem = item;
      this.qty = this.unit = this.subTotal = 0;
      this.selectedQuickButton = item;
    });

    this.$root.$on("save-proposal-requirement", ({ index, item }) => {
      this.proposalRequest.requirements[index] = item;
      this.newProposalRequest.requirements[index] = item;
      this.$root.$emit("update-proposal-budget-summary", this.newProposalRequest, {});
      this.$forceUpdate();
    });

    this.$root.$on("clear-slide-pos", (item) => {
      this.serviceSlidePos = 0;
    });

    if (this.$refs.servicesCont) {
      this.servicesWidth = this.$refs.servicesCont.clientWidth;
    }
  },
  computed: {
    mandatoryRequirements() {
      if (!this.proposalRequest) return [];
      if (!this.proposalRequest.requirements[this.category]) return [];
      return this.proposalRequest.requirements[this.category].filter((item) => item.mustHave);
    },
    isChecked(){
      return this.additionalServices.includes(this.service.componentId);
    },
    additionalServices(){
        return this.$store.state.vendorProposal.additionalServices;
    },
  },
  watch: {
    service(newValue){console.log('proposal.item.secondary.service', newValue)}
  },
};
</script>
<style lang="scss" scoped>
.proposal-item-secondary-service {
  border-radius: 3px;
  box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  // padding: 40px 34px 0px 34px;
  font-family: "Manrope-Regular", sans-serif;
  color: #050505;
  margin: 20px 0 20px 0;

  .dropdown-zone {
    margin: 30px;
  }
  .title-cont {
    &.dropdown {
      padding: 40px 40px;
      display: grid;
      grid-template-columns: 50% 50%;
      align-items: center;
      cursor: pointer;
      &.opened {
        border-bottom: solid 1px #d7d7d7;
      }
      .left-side {
        width: 100%;
        display: grid;
        grid-template-columns: 10% 90%;
        align-items: center;

        .check-cont {
          img {
            width: 33px;
          }
        }
        h3 {
          display: grid;
          align-items: center;
          grid-template-columns: 10% 90%;
          margin: 0;
          font-size: 30px;
          font-weight: 800;

          img {
            width: 34px;
            height: 34px;
          }
        }
      }
      .right-side {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;

        .budget-cont {
          margin-left: 4em;
          span {
            color: #818080;
            &:first-child {
              font-size: 14px;
              margin-right: 1rem;
            }
            &:nth-child(2) {
              font-size: 20px;
              font-weight: 800;
            }
          }
        }
        .proposal-range-cont {
          text-align: right;
          margin-left: 65px;
          span {
            font-size: 14px;
            &.grey {
              color: #818080;
            }
            &:last-child {
              color: #050505;
              font-weight: 800;
            }
          }
        }
        img {
          width: 12px;
          margin-left: 50px;
        }
      }
    }
  }
  .additional-service:not(:last-child) {
    border-bottom: solid 1px #d7d7d7;
  }
  .additional-photos-wrapper {
    margin-left: -34px;
    margin-right: -34px;
    padding: 60px 0 10px 0;
    border-top: 1px solid #d7d7d7;

    .title-cont {
      display: flex;
      align-items: flex-end;
      padding: 0 34px;

      h3 {
        font-size: 30px;
        font-weight: 800;
        margin: 0;
        margin-right: 10px;
        img {
          width: 24px;
          margin-right: 10px;
        }
        margin-right: 10px;
      }
      h5 {
        margin: 0;
        font-size: 14px;
        position: relative;
        top: -6px;
      }
      p {
        font-size: 16px;
        margin: 0;
        margin-left: 72px;
      }
    }
    .upload-cont {
      padding-bottom: 84px;
      p {
        font-size: 16px;
        margin-left: 72px;
        margin-top: 9px;
        margin-bottom: 30px;
      }
      .upload {
        border: 1px dashed #f51355;
        margin: 0 34px;
        padding: 32px;
        cursor: pointer;
        text-align: center;

        a.choose-file {
          font-size: 14px;
          font-weight: 800;
          padding: 8px 24px;
          color: #f51355;
          border: 1px solid #f51355;
          border-radius: 3px;
          display: inline-block;

          img {
            width: 10px;
            margin-right: 8px;
          }
        }
        span {
          display: inline-block;
          &.or {
            padding: 5px 0;
          }
        }
      }
    }
  }
}
</style>
