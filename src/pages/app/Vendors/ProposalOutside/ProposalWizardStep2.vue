<template>
  <div class="mt-10">
    <proposal-item-secondary-service
      :category="vendor.eventCategory.title"
      :services="[]"
      :isCollapsed="true"
      :isDropdown="true"
      :proposalRange="true"
      :img="`${$iconURL}Budget Elements/${vendor.eventCategory.icon}`"
      :serviceCategory="vendor.eventCategory.key"
    />
    <template v-if="vendor.secondaryServices && vendor.secondaryServices.length">
      <h3>Would you like to change or add services to this offer?</h3>
      <p>Select additional services you offer as part of this proposal.</p>
      <proposal-item-secondary-service
        v-for="service in vendor.secondaryServices"
        :key="service.id"
        :category="service.eventCategory.title"
        :services="[]"
        :isCollapsed="true"
        :isDropdown="true"
        :proposalRange="true"
        :img="`${$iconURL}Budget Elements/${service.eventCategory.icon}`"
        :serviceCategory="service.vendorCategory"
      />
    </template>
  </div>
</template>
<script>
import ReferNewVendor from "../components/ReferNewVendor";
import ProposalItemSecondaryService from "./ProposalItemSecondaryService";
import _ from "underscore";

export default {
  components: {
    ReferNewVendor,
    ProposalItemSecondaryService,
  },
  created() {
    let taxRate = 0;
    let discountRate = 0;
    if (this.vendor.pricingPolicies) {
      this.vendor.pricingPolicies.forEach((item) => {
        if (item.name === "Tax rate" && item.value) {
          taxRate = Number(item.value);
        }
      });
    }

    if (!taxRate) taxRate = this.getTaxFromState();
    console.log('taxRate', taxRate);

    if (!this.$store.state.proposalForNonMaryoku.initialized) {
      this.setInitServices(
        this.vendor.eventCategory.key,
        this.vendor.services || [],
        this.vendor.pricingPolicies || [],
      );

      if (this.vendor.secondaryServices) {
        this.vendor.secondaryServices.forEach((secondaryService) => {
          this.setInitServices(
            secondaryService.vendorCategory,
            secondaryService.services,
            secondaryService.pricingPolicies,
          );
        });
      }

      this.$store.commit("proposalForNonMaryoku/setValue", { key: "initialized", value: true });

      if (Object.keys(this.$store.state.vendorProposal.taxes).length === 0) {
        this.$store.commit("proposalForNonMaryoku/setValue", {
            key: "taxes",
            value: { [this.vendor.eventCategory.key]: { percentage: taxRate, price: 0 } },
        });
        this.$store.commit("proposalForNonMaryoku/setValue", {
            key: "taxes",
            value: { total: { percentage: taxRate, price: 0 } },
        });
      }
    }
  },
  methods: {
      getTaxFromState() {
          console.log('taxRate', this.event.location);
          if (!this.event.location) return 0;

          let tax = 0
          this.taxes.map(it => {
              const arr = this.event.location.split(', ');
              if (arr[arr.length - 1] === 'USA' && arr[arr.length - 2] === it.code) {
                  tax = it.tax;
              }
          })
          return tax;
      },
    setInitServices(serviceName, services, pricingPolicies) {
      let includedVendorServices = [];
      let costVendorServices = [];
      const includedSevices = [];
      _.each(services, (vendorService) => {
        // Set included services from vendor profile
        if (!vendorService.xIncluded && vendorService.checked && vendorService.included) {
          includedVendorServices.push(vendorService);
          const service = {
            comments: [],
            dateCreated: "",
            includedInPrice: true,
            itemNotAvailable: false,
            price: 0,
            priceUnit: "qty",
            requirementComment: null,
            requirementId: "",
            requirementMandatory: false,
            requirementPriority: null,
            requirementTitle: vendorService.label,
            requirementsCategory: vendorService.category,
            requirementValue: vendorService.defaultQty ? vendorService.defaultQty : 1,
            requirementSize: vendorService.defaultSize ? vendorService.defaultSize : "",
            requirementNote: vendorService.desc,
            plannerOptions: [],
            isMandatory: true,
            isComplementary: false,
            isComplimentary: false,
          };
          includedSevices.push(service);
        } else if (!vendorService.included) {
          costVendorServices.push(vendorService);
        }
      });
      const extraServices = [];
      if (pricingPolicies) {
        pricingPolicies.forEach((item) => {
          if (item.isExtraService || !item.hideOnProposal) {
            extraServices.push({
              comments: [],
              dateCreated: "",
              includedInPrice: true,
              itemNotAvailable: false,
              price: Number(item.value),
              priceUnit: "qty",
              requirementComment: null,
              requirementId: "",
              requirementMandatory: false,
              requirementPriority: null,
              requirementTitle: item.extraService ? item.extraService.label : item.name,
              requirementsCategory: item.category,
              requirementValue: item.defaultQty ? item.defaultQty : 1,
              requirementSize: item.defaultSize ? item.defaultSize : "",
              plannerOptions: [],
              isMandatory: true,
            });
          }
        });
      }
      this.$store.commit("proposalForNonMaryoku/setCostServices", {
        category: serviceName,
        services: [],
      });
      this.$store.commit("proposalForNonMaryoku/setIncludedServices", {
        category: serviceName,
        services: includedSevices,
      });

      this.$store.commit("proposalForNonMaryoku/setExtraServices", {
        category: serviceName,
        services: extraServices,
      });
    },
  },
  computed: {
    vendor() {
      return this.$store.state.proposalForNonMaryoku.vendor;
    },
    event(){
      return this.$store.state.proposalForNonMaryoku.eventData;
    },
    taxes(){
      return this.$store.state.common.taxes;
    },
    costServiceItems() {
      return this.$store.state.proposalForNonMaryoku.costServices[this.vendor.eventCategory.key];
    },
    includedServiceItems() {
      return this.$store.state.proposalForNonMaryoku.includedServices[this.vendor.eventCategory.key];
    },
  },
  watch: {
    // remove costServiceItem already in included section
    costServiceItems: {
      handler(newVal) {
        console.log("handler", this.costServiceItems);
        let includeItems = this.includedServiceItems;
        if (newVal.length) {
          newVal.map((costItem) => {
            includeItems = includeItems.filter(
              (it) => it.requirementTitle.toLowerCase() !== costItem.requirementTitle.toLowerCase(),
            );
          });
        }
        console.log("costServiceItems", includeItems);
        this.$store.commit("proposalForNonMaryoku/setIncludedServices", {
          category: this.vendor.eventCategory.key,
          services: includeItems,
        });
      },
      deep: true,
    },
  },
};
</script>
