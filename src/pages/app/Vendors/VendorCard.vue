<template>
  <div :class="!grid && 'list'">
    <md-card class="md-elevation" :class="!grid && 'list'">
      <md-card-header>
        <div class="md-title">{{ vendor.vendorDisplayName }}</div>
        <div class="md-subhead">{{ vendor.vendorCategory }}</div>
      </md-card-header>

      <md-card-content>{{ vendor.vendorMainEmail || "-" }}</md-card-content>

      <md-card-actions>
        <md-button
          :name="`vendors-list-delete-vendor-${index}`"
          class="md-danger md-just-icon md-round"
          @click.native="deleteVendor(vendor.id)"
        >
          <md-icon>delete</md-icon>
        </md-button>
        <md-button
          :name="`vendors-list-delete-vendor-${index}`"
          class="md-info md-just-icon md-round"
          @click.native="selectVendor(vendor)"
        >
          <md-icon>edit</md-icon>
        </md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>
<script>
import { Modal, SimpleWizard, WizardTab } from "@/components";
import Swal from "sweetalert2";
import Vendors from "@/models/Vendors";
import RankingModal from "./Table/RankingModal";
import TagsModal from "./Table/TagsModal";
import ClickOutside from "vue-click-outside";
// import auth from '@/auth';

import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import EventComponent from "@/models/EventComponent";
import EventComponentVendor from "@/models/EventComponentVendor";
import _ from "underscore";

export default {
  props: {
    vendor: Object,
    grid: Boolean,
    index: Number,
    vendorsList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    buildingBlocksList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    tooltipModels: {
      type: Array,
      default: () => {
        return {};
      },
    },
    fetchVendors: {
      type: Function,
    },
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    mode: String,
    selectedBlock: {
      type: Object,
      default: null,
    },
    event: {
      type: Object,
      default: null,
    },
  },
  name: "vendor-card",
  methods: {
    async setRanking(id, ranking) {
      console.log("sss");
      let vendor = await Vendors.find(id);
      vendor.rank = ranking;
      vendor.save();

      this.$notify({
        message: "Vendor Ranked successfully!",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success",
      });
    },
    closeModal() {
      this.openPopup = false;
    },
    openPopover(index) {
      this.tooltipModels[index].value = !this.tooltipModels[index].value && (this.openPopup = true);

      this.tooltipModels.map((item, itemIndex) => {
        if (index !== itemIndex) {
          this.tooltipModels[itemIndex].value = false;
        }
      });
    },
    categoryTitle(categoryId) {
      let category = _.findWhere(this.buildingBlocksList, { id: categoryId });
      return category ? category.value : categoryId;
      const buildingBlock = _.findWhere(this.buildingBlocksList, {
        id: categoryId,
      });
      return buildingBlock ? buildingBlock.value : "";
    },
    deleteVendor(id) {
      Swal.fire({
        title: "Are you sure you want to delete this vendor?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonClass: "md-button md-success confirm-btn-bg btn-fill",
        cancelButtonClass: "md-button md-danger cancel-btn-bg btn-fill",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.value) {
          let vendor = await Vendors.find(id);
          vendor.delete();

          let vendorIndex = this.vendorsList.findIndex((obj) => obj.id === id);

          this.vendorsList.splice(vendorIndex, 1);
          this.$notify({
            message: "Vendor deleted successfully!",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "success",
          });

          if (this.selectedVendor === id) {
            this.$set(this, "selectedVendor", undefined);
            this.$emit("close-vendor", {});
          }
        }
      });
    },
    selectVendor(item) {
      let _self = this;

      if (_self.selectedVendor != item.id) {
        _self.$set(_self, "selectedVendor", item.id);
        _self.$emit("select-vendor", item);
      } else {
        _self.$set(_self, "selectedVendor", undefined);
        _self.$emit("close-vendor", {});
      }
    },
    resetSelectedVendor(data) {
      this.$set(this, "selectedVendor", data);
    },
    addVendor(data) {
      this.$emit("add-vendor", data);
      this.getBlockVendors();
    },
    removeVendor(data) {
      this.$emit("remove-vendor", data);
      this.getBlockVendors();
    },
    getBlockVendors() {
      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      if (this.event) {
        let event = new CalendarEvent({ id: this.event.id });
        let selected_block = new EventComponent({ id: this.selectedBlock.id });

        new EventComponentVendor()
          .for(calendar, event, selected_block)
          .get()
          .then((resp) => {
            this.blockVendors = resp;
          })
          .catch((error) => {
            console.log("error =>", error);
          });
      }
    },
    isSelected(vendorId) {
      let isSelected = _.find(this.blockVendors, function (vendor) {
        return vendor.vendorId === vendorId;
      });
      return !!isSelected;
    },
  },
};
</script>
<style lang="scss" scoped>
.md-content {
  width: 100px;
  margin: 24px !important;
  height: 100px;
  align-items: center;
  justify-content: center;
}
.md-card {
  margin: 12px;
  min-width: 200px;

  max-width: 200px;
}
.md-card-content {
  word-wrap: break-word;
  min-height: 80px;
}
.md-title {
  min-height: 80px;
}
.list {
  width: 100%;
  min-width: 100% !important;
}
</style>
