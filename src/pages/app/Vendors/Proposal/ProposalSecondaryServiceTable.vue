<template>
  <div class="proposal-service-table-wrapper">
    <div class="title-cont default">
      <div>
        Mandatory elements to involve in proposals are in the table, we recommend adding these elements as well:
      </div>
      <div class="sub-items-cont">
        <span class="prev" @click="prev()" v-if="serviceSlidePos < 0">
          <md-icon>keyboard_arrow_left</md-icon>
        </span>
        <div class="sub-items" :style="{ left: `${serviceSlidePos}px` }" ref="servicesCont">
          <select-proposal-sub-item
            :selected="isSelectedQuickButton('')"
            :item="requirement.item ? requirement.item : requirement.subCategory"
            v-for="(requirement, sIndex) in optionalRequirements"
            :key="sIndex"
          />
        </div>
        <span class="next" @click="next()">
          <md-icon>keyboard_arrow_right</md-icon>
        </span>
      </div>
      <div class="add-item-cont">
        <div class="fields-cont">
          <div class="field">
            <span>Description</span>
            <input v-model="serviceItem" class="description" />
          </div>
          <div class="field">
            <span>QTY</span>
            <money v-model="qty" v-bind="qtyFormat" @keyup.native="calculateSubTotal()" />
          </div>
          <div class="field">
            <span>Price per unit</span>
            <money v-model="unit" v-bind="currencyFormat" @keyup.native="calculateSubTotal()" />
          </div>
          <div class="field">
            <span>Total</span>
            <money v-model="subTotal" v-bind="currencyFormat" v-if="isNumberVisible" class="total" />
            <money v-model="unit" v-bind="currencyFormat" v-else class="total" />
          </div>
        </div>
        <div class="action-cont">
          <a class="cancel" @click="cancel()">Clear</a>
          <a class="save" :class="{ isDisabled: isDisabledAdd }" @click="saveItem(serviceItem, qty, unit, category)"
            >Add This</a
          >
        </div>
      </div>
    </div>
    <div class="editable-sub-items-cont">
      <div class="editable-sub-items-header">
        <span>Description</span>
        <span class="text-center">QTY</span>
        <span class="text-center">Price per unit</span>
        <span class="text-center">Subtotal</span>
      </div>
      <editable-proposal-sub-item
        v-for="(req, rIndex) in services"
        :key="rIndex"
        :index="rIndex"
        :item="req"
        :active="true"
        :step="1"
        @save="updateItem"
        @remove="removeItem"
      />
      <div class="tax-discount-wrapper">
        <div class="row grid-tax-row">
          <div class="item-cont">
            <div class="plabel">
              <img :src="`${iconUrl}Asset 612.svg`" />
              <span>Add Discount</span>
            </div>
            <div class="ptitle text-center" v-if="isEditDiscount">
              % Percentage
              <br />
              <money
                v-model="discount"
                v-bind="percentageFormat"
                :class="[{ 'active-discount': isDiscountPercentage }, { 'inactive-discount': !isDiscountPercentage }]"
                @keyup.native="setRange(discount, 'discount')"
                @click.native="
                  isDiscountPercentage = true;
                  switchDiscountMethod();
                "
              />
            </div>
          </div>
          <div class="percent-cont text-center" :class="{ 'text-right': isEditDiscount }">
            <span v-if="isEditDiscount">Or</span>
            <span v-else>{{ discount }}%</span>
          </div>
          <div class="price-cont text-center">
            <template v-if="isEditDiscount">
              <span class="pl-2">Amount</span>
              <br />
              <money
                v-model="discount_by_amount"
                v-bind="currencyFormat"
                :class="[{ 'active-discount': !isDiscountPercentage }, { 'inactive-discount': isDiscountPercentage }]"
                @keyup.native="setRange(discount_by_amount, 'discount_by_amount')"
                @click.native="
                  isDiscountPercentage = false;
                  switchDiscountMethod();
                "
              />
            </template>
            <template v-else>
              <span v-if="discount_by_amount == 0">${{ ((totalOffer() * discount) / 100) | withComma }}</span>
              <span v-else>${{ discount_by_amount }}</span>
            </template>
          </div>
          <div class="edit-cont">
            <img class="edit" :src="`${iconUrl}Asset 585.svg`" @click="isEditDiscount = true" v-if="!isEditDiscount" />
            <a class="cancel" v-if="isEditDiscount" @click="cancelDiscount()">Cancel</a>
            <a class="save" v-if="isEditDiscount" @click="saveDiscount()">Save</a>
          </div>
        </div>
        <div class="row grid-tax-row">
          <div class="item-cont">
            <div class="plabel">
              <img :src="`${iconUrl}Asset 613.svg`" />
              <span>Add Taxes</span>
            </div>
            <div class="ptitle" v-if="isEditTax">
              % Percentage
              <br />
              <money
                v-model="tax"
                v-bind="percentageFormat"
                class="active-discount"
                @keyup.native="setRange(tax, 'tax')"
              />
            </div>
          </div>
          <div class="percent-cont">
            <!-- <span>{{tax}}%</span> -->
          </div>
          <div class="price-cont text-center">
            <span>${{ ((totalOffer() * tax) / 100) | withComma }}</span>
          </div>
          <div class="edit-cont">
            <img class="edit" :src="`${iconUrl}Asset 585.svg`" @click="isEditTax = true" v-if="!isEditTax" />
            <a
              class="cancel"
              v-if="isEditTax"
              @click="
                isEditTax = false;
                tax = 0;
              "
              >Cancel</a
            >
            <a class="save" v-if="isEditTax" @click="isEditTax = false">Save</a>
          </div>
        </div>
      </div>
      <div class="editable-sub-items-footer">
        <span>Total</span>
        <span>${{ calculatedTotal | withComma }}</span>
      </div>
    </div>
    <!-- <div class="upload-files-wrapper">
      <div class="title-cont">
        <h3><img :src="`${$iconURL}NewSubmitPorposal/Asset 608.svg`" />Upload These Files:</h3>
        <h5>And add additional if you want</h5>
      </div>
      <div class="files-cont">
        <div class="item" v-for="legalDoc in vendor.eventCategory.legalDocuments" :key="legalDoc">
          <div class="left">
            <span class="filename">{{ legalDoc }}</span>
            <span class="req">Required</span>
          </div>
          <div class="right" @click="uploadDocument(legalDoc)" v-if="getFileByTag(legalDoc) == null">
            <img :src="`${$iconURL}NewSubmitPorposal/Asset 609.svg`" />Upload
          </div>
          <div class="right" v-else>
            <span class="filename">{{ getFileByTag(legalDoc) }}</span>
            <img class="check" :src="`${$iconURL}NewSubmitPorposal/Group 3599 (2).svg`" />
            <img
              class="remove"
              :src="`${$iconURL}NewSubmitPorposal/Group 3671 (2).svg`"
              @click="removeFileByTag(legalDoc)"
            />
          </div>
        </div>
        <input
          type="file"
          class="d-none"
          ref="legalDocument"
          accept="application/text, application/pdf"
          @change="onFilePicked"
        />
        <div class="option">
          <div class="left">
            <span class="filename">Other</span>
            <span class="req">*Optional</span>
          </div>
          <div class="right" @click="uploadDocument('option')" v-if="getFileByTag('option') == null">
            <img :src="`${$iconURL}NewSubmitPorposal/Asset 609.svg`" />Upload
            <input
              type="file"
              class="d-none"
              ref="optionDocument"
              accept="application/text, application/pdf"
              @change="onFilePicked"
            />
          </div>
          <div class="right" v-else>
            <span class="filename">{{ getFileByTag("option") }}</span>
            <img class="check" :src="`${$iconURL}NewSubmitPorposal/Group 3599 (2).svg`" />
            <img
              class="remove"
              :src="`${$iconURL}NewSubmitPorposal/Group 3671 (2).svg`"
              @click="removeFileByTag('option')"
            />
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script>
import ProposalRequest from "@/models/ProposalRequest";
import ProposalRequestFile from "@/models/ProposalRequestFile";

import InputProposalSubItem from "@/components/Inputs/InputProposalSubItem.vue";
import SelectProposalSubItem from "../components/SelectProposalSubItem.vue";
import EditableProposalSubItem from "../components/EditableProposalSubItem.vue";
import { Money } from "v-money";

import vue2Dropzone from "vue2-dropzone";
import S3Service from "@/services/s3.service";
export default {
  name: "proposal-service-table",
  components: {
    InputProposalSubItem,
    SelectProposalSubItem,
    EditableProposalSubItem,
    Money,
    vueDropzone: vue2Dropzone,
  },
  props: {
    category: String,
    isCollapsed: Boolean,
    isDropdown: Boolean,
    proposalRange: Boolean,
    subTitle: String,
    img: String,
    service: Object,
  },
  data() {
    return {
      isAllFilledInfo: false,
      iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/NewSubmitPorposal/",
      isVCollapsed: false,
      isChecked: false,
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
      files: [],
      docTag: null,
      serviceSlidePos: 0,
      servicesWidth: 0,
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
      proposalData: {},
    };
  },
  methods: {
    getObject(item) {
      return JSON.parse(JSON.stringify(item));
    },
    clickItem(category) {
      this.isChecked = !this.isChecked;
      this.$root.$emit("update-additional-services", category);
    },
    setRange(value, type) {
      let val = value;

      if (type != "discount_by_amount") {
        if (value > 100) {
          val = 100;
        }
        if (value < 0) {
          val = 0;
        }
      }

      if (type == "tax") {
        this.tax = val;
        this.discount_by_amount = 0;
      } else if (type == "discount_by_amount") {
        this.discount_by_amount = val;
        this.tax = 0;
      } else {
        this.discount = val;
      }
    },
    cancel() {
      this.selectedQuickButton = "";
      this.qty = 0;
      this.unit = 0;
      this.subTotal = 0;
      this.serviceItem = null;
      this.discount_by_amount = null;
    },
    saveItem(serviceItem, qty, price, category) {
      this.services.unshift({
        comments: [],
        dateCreated: "",
        includedInPrice: true,
        itemNotAvailable: false,
        price: price,
        priceUnit: "qty",
        proposalRequest: { id: this.proposalRequest.id },
        requirementComment: null,
        requirementId: "",
        requirementMandatory: false,
        requirementPriority: null,
        requirementTitle: serviceItem,
        requirementsCategory: category,
        requirementValue: `${qty}`,
      });
      this.$forceUpdate();
      this.$root.$emit("update-proposal-budget-summary", this.proposalRequest, {});
      this.cancel();
    },
    updateItem({ index, item }) {
      this.services[index] = item;
      this.services = this.services;
    },
    removeItem(index) {
      this.services.splice(index, 1);
      this.services = this.services;
    },
    calculateSubTotal() {
      this.subTotal = this.qty * this.unit;
      this.discount_by_amount = this.unit;
    },
    saveDiscount() {
      this.isEditDiscount = false;
      this.$store.state.commit("vendorProposal/setDiscount", { category: this.category, value: this.discount });
      this.$root.$emit("update-proposal-budget-summary", this.proposalRequest, {
        category: this.category,
        value: this.discount,
      });
    },
    cancelDiscount() {
      this.isEditDiscount = false;
      this.discount = 0;
    },
    uploadDocument(fileId = null) {
      this.docTag = fileId;
      this.selectedImage = typeof fileId !== "object" ? fileId : null;
      if (this.docTag == "option") {
        this.$refs.optionDocument.click();
      } else if (this.docTag == "image") {
        this.$refs.imageFile.click();
      } else {
        this.$refs.legalDocument.click();
      }
    },
    onFilePicked(event) {
      let file = event.target.files || event.dataTransfer.files;

      if (!file.length) {
        return;
      }
      if (file[0].size <= 5000000) {
        // 5mb
        this.createProposalFile(file[0]);
      } else {
        this.alretExceedPictureSize = true;
        this.$notify({
          message: "You've Uploaded an Image that Exceed the allowed size, try small one!",
          horizontalAlign: "center",
          verticalAlign: "top",
          icon: "warning",
        });
      }
    },
    createProposalFile(file) {
      let reader = new FileReader();
      let vm = this;

      reader.onload = (e) => {
        let proposalRequest = new ProposalRequest({ id: vm.$route.params.id });

        this.files.push({
          tag: this.docTag,
          filename: file.name,
        });

        if (this.docTag == "image") {
          Swal.fire({
            title: `You've Uploaded an Image named ${file.name}`,
            text: "",
            type: "success",
            timer: 3000,
          });
        }
      };
      reader.readAsDataURL(file);
    },
    getFileByTag(tag) {
      const file = this.files.filter((f) => f.tag == tag);
      if (file.length > 0) {
        return file[0].filename;
      } else {
        return null;
      }
    },
    removeFileByTag(tag) {
      this.files = this.files.filter((f) => f.tag != tag);
    },
    totalOffer() {
      // let total = parseFloat(this.proposalRequest.requirementsCategoryCost)
      let total = 0;
      let vm = this;
      let requirements = [];
      console.log("total.requirements", this.proposalRequest);
      if (this.proposalRequest.requirements.length) {
        requirements = this.proposalRequest.requirements.filter((r) => r.hasOwnProperty("requirementTitle"));
      }

      requirements.map(function (item) {
        if (item.price) {
          if (item.priceUnit === "total") {
            total += parseFloat(String(item.price).replace(/,/g, ""));
          } else {
            if (vm.proposalRequest != undefined) {
              total += parseFloat(String(item.price).replace(/,/g, "")) * parseInt(item.requirementValue);
            }
          }
        }
      });

      return total;
    },
    // calculatedTotal() {
    //   let total = this.totalOffer();

    //   total = total - (total * this.discount) / 100;
    //   if (total > 0) {
    //     total = total - this.discount_by_amount;
    //   }
    //   total += (total * this.tax) / 100;
    //   console.log("calculateTotal", total);
    //   return total;
    // },
    prev() {
      if (this.$refs.servicesCont) {
        this.servicesWidth = this.$refs.servicesCont.clientWidth;
        if (this.servicesWidth - this.serviceSlidePos > 0) {
          this.serviceSlidePos += 200;
        }
      }
    },
    next() {
      if (this.$refs.servicesCont) {
        this.servicesWidth = this.$refs.servicesCont.clientWidth;
        if (this.servicesWidth + this.serviceSlidePos - 200 > 0) {
          this.serviceSlidePos -= 200;
        }
      }
    },
    switchDiscountMethod() {
      this.discount = 0;
      this.discount_by_amount = 0;
    },
    isSelectedQuickButton(item) {
      return false;
    },
    async imageSelected(file) {
      const imageData = await getBase64(file);
      const extension = file.type.split("/")[1];
      // S3Service.fileUpload(file, logoName, "logos").then((res) => {
      //   this.$store.dispatch("campaign/setLogo", { logoUrl: `${this.$uploadURL}logos/${logoName}.${extension}` });
      // });
    },
  },
  created() {
    if (!this.services || this.services.length == 0) {
      const defaultServices = [];
      this.mandatoryRequirements.forEach((item) => {
        defaultServices.push({
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
      this.services = defaultServices;
    }

    this.$forceUpdate();
    this.$root.$emit("update-proposal-budget-summary", this.proposalRequest, {});
    this.$root.$on("remove-proposal-requirement", (item) => {
      this.proposalRequest.requirements = this.proposalRequest.requirements.filter(
        (req) => req.requirementTitle != item.requirementTitle,
      );
      this.$root.$emit("update-proposal-budget-summary", this.proposalRequest, {});
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
      this.proposalRequest.requirements[index] = item;
      this.$root.$emit("update-proposal-budget-summary", this.proposalRequest, {});
      this.$forceUpdate();
    });

    this.$root.$on("clear-slide-pos", (item) => {
      this.serviceSlidePos = 0;
    });

    if (this.$refs.servicesCont) {
      this.servicesWidth = this.$refs.servicesCont.clientWidth;
    }
  },
  filters: {
    withComma(amount) {
      return amount ? amount.toLocaleString() : 0;
    },
  },
  computed: {
    isDisabledAdd() {
      return !this.qty || !this.unit || !this.subTotal || this.subTotal == 0 || !this.serviceItem;
    },
    optionalRequirements() {
      console.log(this.proposalRequest);
      return this.proposalRequest.requirements.filter((item) => !item.mustHave && item.type !== "multi-selection");
    },
    mandatoryRequirements() {
      if (!this.proposalRequest) return [];
      return this.proposalRequest.requirements.filter((item) => item.mustHave);
    },
    proposalRequest() {
      console.log(this.$store.state.vendorProposal.proposalRequest);
      return this.$store.state.vendorProposal.proposalRequest;
    },
    vendor() {
      return this.$store.state.vendorProposal.vendor;
    },
    services: {
      get: function () {
        return this.$store.state.vendorProposal.proposalServices[this.category];
      },
      set: function (newServices) {
        this.$store.commit("vendorProposal/setServices", { category: this.category, services: newServices });
      },
    },

    calculatedTotal() {
      let taxRate = this.$store.state.vendorProposal.taxes[this.categroy];
      if (!taxRate) taxRate = 0;
      let total = this.totalPrice - (this.totalPrice * this.discount) / 100;
      const tax = (total * taxRate) / 100;
      return total - tax;
    },
    totalPrice() {
      const sumPrice = this.services.reduce((s, item) => {
        return s + item.requirementValue * item.price;
      }, 0);
      return sumPrice;
    },
    legalDocs: {
      get: function () {
        return this.$store.state.vendorProposal.legalDocs[this.category];
      },
      set: function (files) {
        this.$store.commit("vendorProposal/setLegalDocs", files);
      },
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
.proposal-service-table-wrapper {
  padding: 0px;
  font-family: "Manrope-Regular", sans-serif;
  color: #050505;
  .dropdown-zone {
    margin: 30px;
  }
  .title-cont {
    .with-subtitle {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .text-cont {
        display: flex;
        align-items: center;
        h3.title {
          font-weight: 800;
          font-size: 30px;
          margin: 0;
          margin-right: 20px;
          img {
            width: 28px;
            margin-right: 19px;
            position: relative;
            top: -3px;
          }
        }
        h5 {
          font-size: 20px;
          margin: 0;
        }
      }
      .action {
        cursor: pointer;
        img {
          width: 20px;
        }
      }
    }
    p {
      font-size: 16px;
      margin: 0;
      margin-top: 23px;

      strong {
        font-weight: 800;
      }
    }

    &.dropdown {
      padding: 8px 8px 42px 0px;
      display: grid;
      grid-template-columns: 50% 50%;
      align-items: center;
      cursor: pointer;

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
          p {
            margin-top: 0;
            font-size: 14px;
          }
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

  .add-item-cont {
    margin-top: 1rem;
    .fields-cont {
      display: grid;
      grid-template-columns: 55% 15% 15% 15%;
      .field {
        margin-right: 1em;
        span {
          margin-bottom: 0.5rem;
          display: inline-block;
          font: 800 16px "Manrope-Regular", sans-serif;
        }
        input {
          text-transform: capitalize;
          width: 100%;
          padding: 1.5rem 1rem;
          border: 1px solid #d5d5d5;
          font: normal 16px "Manrope-Regular", sans-serif;
          color: #050505;
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  .add-attributes-cont {
    display: flex;
  }

  .action-cont {
    text-align: right;
    margin-top: 35px;
    a {
      font-size: 16px;
      font-weight: 800;

      &.clear {
        color: #050505;
        padding: 8px 32px;
        margin-right: 1rem;
      }
      &.add {
        background-color: #d5d5d5;
        border-radius: 3px;
        padding: 8px 32px;
        color: #ffffff;
        max-height: 38px;
        cursor: pointer;

        &.active {
          background-color: #f51355;
          color: #ffffff;
        }
      }
    }
  }

  .editable-sub-items-cont {
    margin-top: 2rem;

    .editable-sub-items-header {
      // border-top: 1px solid #707070;
      border-top: 2px solid #cbcbcb;
      padding: 40px 40px 30px 40px;
      display: grid;
      grid-template-columns: 30% 10% 17.5% 18%;

      span {
        display: inline-block;
        font-size: 16px;
        font-weight: 800;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .tax-discount-wrapper {
      .row {
        padding: 35px;
        border: 2px solid #d5d5d5;
        border-bottom: none;
        display: grid;
        // grid-template-columns: 40% 17.5% 12.5% 30%;
        grid-template-columns: 40% 17.5% 15.5% 24%;
        align-items: center;

        .item-cont {
          display: grid;
          grid-template-columns: 40% 60%;
          align-items: center;

          .plabel {
          }
          .ptitle {
            padding-left: 1rem;
            font: normal 14px "Manrope-Regular", sans-serif;
            text-align: left;
          }
        }
        .percent-cont {
          font: normal 14px "Manrope-Regular", sans-serif;
          color: #050505;
          &.text-right {
            padding-right: 1rem;
            span {
              font-weight: 400 !important;
            }
          }
        }
        .price-cont {
          font: normal 14px "Manrope-Regular", sans-serif;
          span {
            &.pl-2 {
              font: normal 14px "Manrope-Regular", sans-serif;
              color: #050505;
              padding-left: 20px;
            }
          }
        }
        .edit-cont {
          text-align: right;
          .edit {
            width: 21px;
            height: 21px;
            margin-right: 2rem;
            cursor: pointer;
          }
        }

        img {
          width: 15px;
          margin-right: 22px;

          &.edit {
            cursor: pointer;
          }
        }
        span {
          color: #818080;
          font-size: 16px;
          font-weight: 800;
        }
      }
    }
    .editable-sub-items-footer {
      box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
      background-color: #d5d5d5;
      padding: 21px 40px;
      border: 2px solid #d5d5d5;
      border-bottom: none;
      display: grid;
      grid-template-columns: 57.5% 42.5%;

      span {
        font-size: 20px;
        font-weight: 800;
        display: inline-block;
      }
    }
  }

  .active-discount {
    width: 100px;
    margin-top: 5px;
    border: 1px solid #050505;
    text-align: center;
    font: normal 16px "Manrope-Regular", sans-serif;
  }
  .inactive-discount {
    opacity: 0.6;
    width: 100px;
    text-align: center;
    margin-top: 5px;
    background: #d5d5d5;
    border: 1px solid #707070;
    font: normal 16px "Manrope-Regular", sans-serif;
  }

  .upload-files-wrapper {
    margin-top: 60px;
    margin-left: -34px;
    margin-right: -34px;
    padding: 60px 0 10px 0;
    border-top: 1px solid #707070;

    .title-cont {
      display: flex;
      align-items: flex-end;
      margin-bottom: 25px;
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
    }
    .files-cont {
      .item,
      .option {
        display: flex;
        justify-content: space-between;
        padding: 30px 34px;
        border-bottom: 1px solid #707070;

        .left {
          span {
            font-weight: 800;
            &.filename {
              font-size: 20px;
              margin-right: 23px;
            }
            &.req {
              color: #818080;
              font-size: 14px;
            }
          }
        }
        .right {
          cursor: pointer;
          color: #f51355;
          font-size: 16px;
          font-weight: 800;
          img {
            width: 13px;
            margin-right: 9px;

            &.check {
              width: 32px;
              margin-right: 0;
              margin-left: 2rem;
            }
            &.remove {
              margin-right: 0;
              margin-left: 1rem;
            }
          }
          span {
            &.filename {
              color: #050505;
              text-decoration: underline;
              font: 800 16px "Manrope-Regular", sans-serif;
            }
          }
        }
      }
      .option {
        margin-bottom: 10px;
        border: none;
        .left {
          span {
            &.filename {
              font-size: 20px;
              font-weight: normal;
            }
          }
        }
      }
    }
  }

  .additional-photos-wrapper {
    margin-left: -34px;
    margin-right: -34px;
    padding: 60px 0 10px 0;
    border-top: 1px solid #707070;

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
  .pb-40 {
    padding-bottom: 40px;
    cursor: pointer;
  }
  a {
    cursor: pointer;
    padding: 8px 26px;

    &.cancel {
      font: 800 16px "Manrope-Regular", sans-serif;
      color: #050505;
      background: transparent;
    }
    &.save {
      font: 800 16px "Manrope-Regular", sans-serif;
      color: white;
      background: #f51355;
      border-radius: 3px;

      &.isDisabled {
        pointer-events: none;
        cursor: not-allowed;
        background: #d5d5d5;
      }
    }
    &:hover {
      color: #dddddd !important;
    }
  }
  .hide {
    display: none;
  }
}
</style>
