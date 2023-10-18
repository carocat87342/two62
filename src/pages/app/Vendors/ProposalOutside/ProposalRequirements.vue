<template>
  <div class="collapse-panel proposal-bid">
    <div class="collapse-panel-header" @click="isExpanded = !isExpanded">
      <div class="d-flex align-center justify-content-between">
        <div class="text-cont d-flex">
          <h3 class="title font-bold">
            <img :src="`${$iconURL}NewSubmitPorposal/${icon}`" class="page-icon mr-10" />
            {{ label }}
          </h3>
        </div>
        <div class="action">
          <img
            :src="`${$iconURL}NewSubmitPorposal/Component 36 (2).svg`"
            :class="{ isExpanded: isExpanded }"
            class="arrow-img"
          />
        </div>
      </div>
      <div>
        {{ description }}
      </div>
    </div>
    <div class="collapse-panel-content" v-if="isExpanded">
      <proposal-add-item-form
        v-if="canAdd"
        :optionalRequirements="[]"
        :serviceType="tableCategory"
        :profileServices="vendorProfileServices"
        :vendorServices="vendorServices"
        @addItem="addItem"
      ></proposal-add-item-form>
      <proposal-service-table :category="vendorCategory" :tableCategory="tableCategory"></proposal-service-table>
    </div>
  </div>
</template>
<script>
import ProposalAddItemForm from "./ProposalAddItemForm";
import ProposalServiceTable from "./ProposalServiceTable";
import { businessCategories, generalInfos, companyServices } from "@/constants/vendor";

export default {
  components: {
    ProposalServiceTable,
    ProposalAddItemForm,
  },
  props: {
    label: {
      type: String,
      default: "",
    },
    hasCategoryHeader: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: "",
    },
    description: String,
    tableCategory: {
      type: String,
      default: "",
    },
    vendorCategory: {
      type: String,
      default: "",
    },
    canAdd: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      category: "",
      isExpanded: false,
      files: [],
    };
  },
  methods: {
    toggle() {
      this.isExpanded = !this.isExpanded;
    },
    getFileByTag(tag) {
      const file = this.files.filter((f) => f.tag == tag);
      if (file.length > 0) {
        return file[0].filename;
      } else {
        return null;
      }
    },
    addItem(serviceItem) {
      if (!this.services) this.services = [];
      this.services.push(serviceItem);
      this.services = Object.assign([], this.services);
    },
  },
  computed: {
    categoryName() {
      return this.$store.state.proposalForNonMaryoku.vendor.eventCategory.fullTitle;
    },
    vendor() {
      return this.$store.state.proposalForNonMaryoku.vendor;
    },
    proposalRequest() {
      return this.$store.state.proposalForNonMaryoku.proposalRequest;
    },
    requirements() {
      return this.proposalRequest.componentRequirements[this.vendorCategory];
    },
    optionalRequirements() {
      if (!this.requirements) return [];
      const multiSelectionCategories = this.requirements.filter((item) => item.subCategory === "service");
      let optionalRequirements = [];
      multiSelectionCategories.forEach((category) => {
        const selectedOptions = category.options.filter((item) => item.selected);
        optionalRequirements = optionalRequirements.concat(selectedOptions);
      });
      return optionalRequirements;
    },
    //all services that this kind of vendor can provide
    vendorServices() {
      const vendorCategoryService = businessCategories.find((item) => item.name === this.vendorCategory);
      if (vendorCategoryService) {
        return vendorCategoryService.categories;
      }
      return [];
    },
    // services which vendor provides
    vendorProfileServices() {
      return this.vendor.services;
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
  },
  watch:{
    vendorProfileServices(){}
  }
};
</script>
<style lang="scss" scoped>
.collapse-panel {
  background-color: white;
  hr {
    background-color: #dddddd;
    margin: 0 40px;
  }
  .collapse-panel-header {
    position: relative;
    cursor: pointer;
    padding: 20px 40px;
    .collapse-button {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      .icon {
        font-size: 35px !important;
      }
    }
    .arrow-img {
      width: 12px;
      &.isExpanded {
        transform: rotate(90deg);
      }
    }
  }
  .collapse-panel-content {
    padding: 0px 40px 40px;
  }
}
</style>