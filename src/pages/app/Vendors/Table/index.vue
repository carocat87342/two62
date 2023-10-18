<template>
  <div style="position: relative">
    <md-table table-header-color="rose" class="table-striped table-hover">
      <md-table-row>
        <md-table-cell md-label="Vendor">Vendor</md-table-cell>
        <md-table-cell md-label="Category">Category</md-table-cell>
        <md-table-cell md-label="Web site">Web site</md-table-cell>
        <md-table-cell md-label="Address">Address</md-table-cell>
        <md-table-cell md-label="Email">Email</md-table-cell>
        <md-table-cell md-label="Phone">Phone</md-table-cell>
        <md-table-cell md-label="Actions">Actions</md-table-cell>
      </md-table-row>
      <md-table-row v-for="(item, index) in vendorsList" :key="index" slot="md-table-row">
        <md-table-cell>{{ item.vendorDisplayName }}</md-table-cell>
        <md-table-cell>{{ item.productsCategory }}</md-table-cell>
        <md-table-cell>{{ item.vendorWebsite }}</md-table-cell>
        <md-table-cell>{{ item.vendorAddressLine1 }}</md-table-cell>
        <md-table-cell>{{ item.vendorMainEmail }}</md-table-cell>
        <md-table-cell>{{ item.vendorMainPhoneNumber }} </md-table-cell>
        <md-table-cell>
          <md-button @click="openPopover(index)" class="md-raised md-info md-icon-button">
            <md-icon>thumb_up</md-icon>
          </md-button>

          <md-button class="md-raised md-primary md-icon-button" @click.native="deleteVendor(item.id)">
            <md-icon>delete</md-icon>
          </md-button>

          <!--<md-button class="md-raised md-primary md-icon-button" @click.native="test">-->
          <!--<md-icon>share</md-icon>-->
          <!--<md-tooltip md-direction="left">Share</md-tooltip>-->
          <!--</md-button>-->

          <md-button class="md-raised md-primary md-icon-button" @click="openPopoverTags(index)">
            <md-icon>local_offer</md-icon>
          </md-button>
        </md-table-cell>

        <div
          class="popup-box"
          v-click-outside="closeModal"
          v-if="tooltipModels[index].value && openPopup"
          :md-active.sync="tooltipModels[index].value"
          md-direction="left"
        >
          <div class="header-position">
            <h3 class="title">Ranking</h3>
            <button class="btn-position" @click="closeModal">X</button>
          </div>
          <div class="md-layout-item md-size-100 md-small-size-100">
            <div v-for="(item, index) in tooltipModels[index].rankingParameters" class="space-between box-rate">
              <h3 class="">{{ item.name }}</h3>
              <div class="pull-right">
                <div class="star-rating">
                  <label
                    class="star-rating__star"
                    v-for="rating in ratings"
                    :class="{ 'is-selected': item.value >= rating && item.value != null }"
                    v-on:click="setRanking(rating, index)"
                  >
                    <input
                      class="star-rating star-rating__checkbox"
                      type="radio"
                      :value="rating"
                      :name="name"
                      v-model="item.value"
                    />★</label
                  >
                </div>
              </div>
            </div>

            <md-field class="border-field">
              <label class="label-right">Your review</label>
              <md-textarea v-model="tooltipModels[index].textarea" md-counter="80"></md-textarea>
            </md-field>
          </div>
          <div class="popup-footer">
            <md-button class="move-left md-red md-simple" @click="closeModal">Close</md-button>
            <md-button class="btn-success md-success">Submit</md-button>
          </div>
        </div>
        <div
          class="popup-box"
          v-click-outside="closeTagsModal"
          v-if="tooltipModels[index].value && openPopupTags"
          :md-active.sync="tooltipModels[index].value"
          md-direction="left"
        >
          <div class="header-position">
            <h3 class="title">Tagging</h3>
            <button class="btn-position" @click="closeTagsModal">X</button>
          </div>
          <div class="md-layout-item md-size-100 md-small-size-100">
            <div class="md-layout-item">
              <md-field>
                <label for="tag">Tags</label>
                <md-select v-model="tag" name="select">
                  <md-option v-for="(option, index) in tags" :key="index" :value="option">{{ option }}</md-option>
                </md-select>
              </md-field>
            </div>
          </div>
          <div class="popup-footer">
            <md-button class="move-left md-red md-simple" @click="closeTagsModal">Close</md-button>
            <md-button class="btn-success md-success">Submit</md-button>
          </div>
        </div>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import { Modal, SimpleWizard, WizardTab } from "@/components";
import Swal from "sweetalert2";
import Vendors from "@/models/Vendors";
import RankingModal from "./RankingModal";
import TagsModal from "./TagsModal";
import ClickOutside from "vue-click-outside";

export default {
  components: {
    Modal,
    SimpleWizard,
    WizardTab,
    TagsModal,
    RankingModal,
    ClickOutside,
  },
  props: {
    vendorsList: {
      type: Array,
      default: () => {
        return {};
      },
    },
    tooltipModels: {
      type: Array,
      default: () => {
        return {};
      },
    },
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  created() {},
  data() {
    return {
      tagsModalOpen: false,
      openPopup: false,
      openPopupTags: false,
      tags: [],
      tag: " ",
      name: "Direction",
      ratings: [1, 2, 3, 4, 5],
    };
  },
  methods: {
    openInviteModal() {
      this.$refs.inviteModal.toggleModal(true);
    },
    setRanking: function (value, index) {
      if (!this.disabled) {
        this.temp_value = value;
        console.log(value, "temp_value");
        return (this.rankingParameters[index].value = value);
      }
    },

    openTagsModal() {
      this.$refs.tagsModal.toggleModal(true);
    },
    noticeModalHide: function () {
      this.inviteModalOpen = false;
    },
    toggleModal: function (show) {
      this.inviteModalOpen = show;
    },
    noticeModalHide: function () {
      this.tagsModalOpen = false;
    },
    toggleModal: function (show) {
      this.tagsModalOpen = show;
    },
    validateStep(ref) {
      return this.$refs[ref].validate();
    },
    onStepValidated(validated, model) {
      this.wizardModel = { ...this.wizardModel, ...model };
    },
    wizardComplete() {
      swal("Good job!", "You clicked the finish button!", "success");
    },
    openPopover(index) {
      this.tooltipModels[index].value = !this.tooltipModels[index].value && (this.openPopup = true);

      this.tooltipModels.map((item, itemIndex) => {
        if (index !== itemIndex) {
          this.tooltipModels[itemIndex].value = false;
        }
      });
    },
    openPopoverTags(index) {
      this.tooltipModels[index].value = !this.tooltipModels[index].value && (this.openPopupTags = true);

      this.tooltipModels.map((item, itemIndex) => {
        if (index !== itemIndex) {
          this.tooltipModels[itemIndex].value = false;
        }
      });
    },
    closeModal() {
      this.openPopup = false;
    },
    closeTagsModal() {
      this.openPopupTags = false;
    },
    deleteVendor(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonClass: "md-button md-success confirm-btn-bg  btn-fill",
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
        }
      });
    },
  },
};
</script>
<style lang="scss">
.md-table-cell-container {
  position: relative;
}
#target {
  position: relative;
}
.connected {
  right: 133px;
  z-index: 9999999999999;
  top: -300px;
  position: absolute;
}
.swal2-container {
  z-index: 999999;
}
.md-toolbar + .md-toolbar {
  margin-top: 16px;
  background-color: transparent !important;
}
.md-toolbar {
  background-color: transparent !important;
}
.md-toolbar .md-title {
  color: #555555 !important;
}
.border-field {
  box-shadow: 0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 12px -5px rgba(153, 153, 153, 0.46);
  font-size: 13px;
}
.label-right {
  left: 16px !important;
  font-size: 13px !important;
}
.space-between {
  justify-content: space-between;
}
.space-between .pull-right span {
  cursor: pointer;
}
.white {
  color: white !important;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
}
.fill-yellow {
  color: yellow !important;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
}
%visually-hidden {
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  height: 1px;
  width: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
}

.star-rating {
  &__star {
    display: inline-block;
    padding: 3px;
    vertical-align: middle;
    line-height: 1;
    font-size: 1.5em;
    color: #ababab;
    transition: color 0.2s ease-out;

    &:hover {
      cursor: pointer;
    }

    &.is-selected {
      color: #ffd700;
    }
  }

  &__checkbox {
    @extend %visually-hidden;
  }
}
.header-position {
  position: relative;
  padding: 15px;
}
.btn-position {
  position: absolute;
  right: 15px;
  font-weight: bold;
  top: 20px;
  font-size: 17px;
  background-color: transparent !important;
  box-shadow: none !important;
  color: gray !important;
  border-color: transparent;
  cursor: pointer;

  &:hover,
  &:visited,
  &:focus,
  &:active {
    background-color: transparent !important;
    box-shadow: none !important;
    color: gray !important;
  }
}
.box-rate {
  border-bottom: 1px solid #ddd;

  & h3 {
    font-size: 13px;
    display: inline-block;
    margin-top: 5px;
  }
}
.popup-box {
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  right: 145px;
  z-index: 9999;
  width: 360px;
  position: absolute;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.14);
}
.clearfix {
  clear: both;
}

.header-position {
  position: relative;
}
.btn-position {
  position: absolute;
  right: 15px;
  font-weight: bold;
  top: 20px;
  font-size: 17px;
  background-color: transparent !important;
  box-shadow: none !important;
  color: gray !important;
  border-color: transparent;
  cursor: pointer;

  &:hover,
  &:visited,
  &:focus,
  &:active {
    background-color: transparent !important;
    box-shadow: none !important;
    color: gray !important;
  }
}
.popup-footer {
  padding: 15px 15px 15px 0px;
  text-align: right;
  & .move-left {
    width: 68px;
    margin-right: 15px;
    padding: 0px;
  }
  & .btn-success {
    width: 68px;
    padding: 0px;
  }
}
</style>
