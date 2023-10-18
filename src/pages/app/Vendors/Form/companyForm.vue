<template>
  <div class="vendor-form">
    <md-card class="md-card-plain">
      <md-card-header class="md-card-header-icon md-card-header-rose">
        <div class="card-icon">
          <md-icon>mail_outline</md-icon>
        </div>
        <h4 class="title2">
          {{
            selected_vendor.vendorDisplayName ? `${selected_vendor.vendorDisplayName}’s Company` : "Create New Vendor"
          }}
        </h4>
        <md-card-actions md-alignment="right">
          <md-button class="md-default md-sm" @click="closePanel">Close</md-button>
          <md-button v-if="creation_mode" class="md-success md-sm" @click="addVendor">Create</md-button>
          <md-button v-else-if="!creation_mode" class="md-info md-sm" @click="saveVendor">Save</md-button>
        </md-card-actions>
      </md-card-header>
      <md-card-content class="md-layout">
        <div class="md-layout-item md-size-100">
          <md-field
            :class="[
              { 'md-valid': !errors.has('vendorDisplayName') && selected_vendor.vendorDisplayName },
              { 'md-error': errors.has('vendorDisplayName') },
            ]"
          >
            <label>Vendor Name</label>
            <md-input
              v-model="selected_vendor.vendorDisplayName"
              type="text"
              required
              data-vv-name="vendorDisplayName"
              name="vendorDisplayName"
              v-validate="modelValidations.vendorDisplayName"
              v-focus
            ></md-input>
            <slide-y-down-transition>
              <md-icon class="error" v-show="errors.has('vendorDisplayName')">close</md-icon>
            </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon class="success" v-show="!errors.has('vendorDisplayName') && selected_vendor.vendorDisplayName"
                >done</md-icon
              >
            </slide-y-down-transition>
          </md-field>
        </div>
        <div class="md-layout-item md-size-50">
          <md-field
            :class="[
              { 'md-valid': !errors.has('vendorWebsite') && selected_vendor.vendorWebsite },
              { 'md-error': errors.has('vendorWebsite') },
            ]"
          >
            <label>Website</label>
            <md-input
              v-model="selected_vendor.vendorWebsite"
              type="text"
              data-vv-name="vendorWebsite"
              name="vendorWebsite"
            ></md-input>
            <slide-y-down-transition>
              <md-icon class="error" v-show="errors.has('vendorWebsite')">close</md-icon>
            </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon class="success" v-show="!errors.has('vendorWebsite') && selected_vendor.vendorWebsite"
                >done</md-icon
              >
            </slide-y-down-transition>
          </md-field>
        </div>
        <div class="md-layout-item md-size-50">
          <md-field
            :class="[
              { 'md-valid': !errors.has('vendorMainEmail') && selected_vendor.vendorMainEmail },
              { 'md-error': errors.has('vendorMainEmail') },
            ]"
          >
            <label>Email</label>
            <md-input
              v-model="selected_vendor.vendorMainEmail"
              type="email"
              required
              data-vv-name="vendorMainEmail"
              name="vendorMainEmail"
              v-validate="modelValidations.vendorMainEmail"
            ></md-input>
            <slide-y-down-transition>
              <md-icon class="error" v-show="errors.has('vendorMainEmail')">close</md-icon>
            </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon class="success" v-show="!errors.has('vendorMainEmail') && selected_vendor.vendorMainEmail"
                >done</md-icon
              >
            </slide-y-down-transition>
          </md-field>
        </div>
        <div class="md-layout-item md-size-50">
          <md-field>
            <label>Address</label>
            <md-input
              v-model="selected_vendor.vendorAddressLine1"
              type="email"
              v-gmaps-searchbox="vm"
              placeholder
              data-vv-name="vendorAddressLine1"
              name="vendorAddressLine1"
              v-validate="modelValidations.vendorAddressLine1"
            ></md-input>
            <slide-y-down-transition>
              <md-icon class="error" v-show="errors.has('vendorAddressLine1')">close</md-icon>
            </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon class="success" v-show="!errors.has('vendorAddressLine1') && selected_vendor.vendorAddressLine1"
                >done</md-icon
              >
            </slide-y-down-transition>
          </md-field>
        </div>
        <div class="md-layout-item md-size-50">
          <md-field
            :class="[
              { 'md-valid': !errors.has('vendorMainPhoneNumber') && selected_vendor.vendorMainPhoneNumber },
              { 'md-error': errors.has('vendorMainPhoneNumber') },
            ]"
          >
            <label>Phone Number</label>
            <md-input
              v-model="selected_vendor.vendorMainPhoneNumber"
              type="text"
              @keydown="onlyNumber"
              required
              data-vv-name="vendorMainPhoneNumber"
              name="vendorMainPhoneNumber"
              v-validate="modelValidations.vendorMainPhoneNumber"
            ></md-input>
            <slide-y-down-transition>
              <md-icon class="error" v-show="errors.has('vendorMainPhoneNumber')">close</md-icon>
            </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon
                class="success"
                v-show="!errors.has('vendorMainPhoneNumber') && selected_vendor.vendorMainPhoneNumber"
                >done</md-icon
              >
            </slide-y-down-transition>
          </md-field>
        </div>
        <div class="md-layout-item md-size-50">
          <md-field :class="[{ 'md-error': errors.has('vendorCategory') }]" class="select-with-icon">
            <label for="category">Category</label>
            <md-select
              v-model="selected_vendor.vendorCategory"
              name="vendorCategory"
              data-vv-name="vendorCategory"
              v-validate="modelValidations.vendorCategory"
              required
            >
              <md-option v-for="(option, index) in categories" :key="index" :value="option.id">{{
                option.value
              }}</md-option>
            </md-select>
            <span class="md-error" v-if="errors.has('vendorCategory')">The Vendor Category is required</span>
          </md-field>
        </div>
        <div class="md-layout-item md-size-50" v-if="selected_vendor.vendorTagging">
          <md-field>
            <md-chips
              v-model="selected_vendor.vendorTagging"
              class="md-info"
              name="tagging"
              id="tagging"
              md-placeholder="Tags"
              md-check-duplicated
            ></md-chips>
          </md-field>
        </div>
        <div class="md-layout-item md-size-100 margin-bottom_30">&nbsp;</div>
        <div class="md-layout-item md-size-33">
          <label>Contact Person</label>
        </div>
        <div class="md-layout-item md-size-33">
          <label>Email Address</label>
        </div>
        <div class="md-layout-item md-size-30">
          <label>Phone Number</label>
        </div>
        <div
          v-for="(contactPerson, index) in selected_vendor.vendorContactPerson"
          :key="index"
          class="md-layout-item md-size-100 contact-person-list"
        >
          <div class="md-layout-item md-size-33">
            <md-field>
              <md-input v-model="contactPerson.name" :name="'name_' + index" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-size-33">
            <md-field>
              <md-input v-model="contactPerson.email" :name="'email_' + index" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-size-30">
            <md-field>
              <md-input v-model="contactPerson.phone_number" :name="'phone_number_' + index" type="text"></md-input>
            </md-field>
          </div>
          <div class="delete-item" @click="deleteContactPersonItem(index)">
            <md-icon class="md-theme-rose">delete_outline</md-icon>
          </div>
        </div>
        <div class="md-layout-item md-size-100">
          <md-button class="md-purple md-xs" @click="addContactPerson">+ Add contact person</md-button>
        </div>
        <div class="md-layout-item md-size-100 vendor_attachments-file">
          <label>Attachments</label>
          <template v-if="selected_vendor">
            <div
              v-for="(attachment, index) in selected_vendor.vendorAttachments"
              :key="index"
              class="md-layout-item md-size-100 contact-person-list"
            >
              <md-field>
                <md-file class="attachments-file" :ref="'file-' + index" v-model="attachment.path" />
                <div class="delete-item" @click="deleteAttachmentItem(index)">
                  <md-icon class="md-theme-rose">delete_outline</md-icon>
                </div>
              </md-field>
            </div>
          </template>
        </div>
        <div class="md-layout-item md-size-100">
          <md-button class="md-purple md-xs" @click="addAttachment">+ Add Attachment</md-button>
        </div>
      </md-card-content>
    </md-card>
  </div>
</template>
<style lang="scss" >
input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -moz-appearance: none;
  -webkit-appearance: none;
  margin: 0;
}

.vendor_attachments-file {
  .attachments-file {
    pointer-events: none;
    cursor: default;
    margin-right: 22px;
  }
  .md-field.md-has-file {
    &:after,
    &:before,
    label {
      margin-right: 22px;
    }
  }
}

.contact-person-list {
  .delete-item {
    left: auto !important;
    right: -8px;
    opacity: 1 !important;
  }
}
</style>
<script>
import Vue from "vue";
import Vendors from "@/models/Vendors";
import VendorCategories from "@/models/VendorCategories";
import Swal from "sweetalert2";
import { SlideYDownTransition } from "vue2-transitions";

export default {
  components: {
    SlideYDownTransition,
  },
  props: {
    selected_vendor: {
      type: Object,
      default: {},
    },
    creation_mode: {
      type: Boolean,
      default: false,
    },
    categories: Array,
  },
  created() {
    /**
     * Get categories for vendors
     */
    Vendors.find("categories").then(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.log(error);
      },
    );
  },
  beforeUpdate() {
    if (!this.selected_vendor.vendorContactPerson) {
      this.selected_vendor.vendorContactPerson = [
        {
          name: null,
          email: null,
          phone_number: null,
        },
      ];
    }

    if (!this.selected_vendor.vendorAttachments) {
      this.selected_vendor.vendorAttachments = [];
    }

    if (!this.selected_vendor.vendorTagging) {
      this.selected_vendor.vendorTagging = [];
    }
  },
  mounted() {},
  data() {
    return {
      company: {},
      vendorCategory: [],
      contactPersonList: [],
      vendorAttachments: [],
      vm: {
        searchPlace: "",
        location: {},
      },
      selectedVendor: this.selected_vendor,
      modelValidations: {
        vendorDisplayName: {
          required: true,
          min: 5,
        },
        vendorMainEmail: {
          required: true,
          email: true,
        },
        vendorMainPhoneNumber: {
          required: true,
          min: 5,
        },
        vendorCategory: {
          required: true,
          min: 5,
        },
      },
    };
  },
  methods: {
    /**
     * Modify selected vendor from vendors list
     */
    async saveVendor() {
      let vendor = await Vendors.find(this.selected_vendor.id);

      vendor.vendorDisplayName = this.selected_vendor.vendorDisplayName;
      vendor.vendorWebsite = this.selected_vendor.vendorWebsite;
      vendor.vendorMainEmail = this.selected_vendor.vendorMainEmail;
      vendor.vendorAddressLine1 = this.selected_vendor.vendorAddressLine1;
      vendor.vendorMainPhoneNumber = this.selected_vendor.vendorMainPhoneNumber;
      vendor.vendorCategory = this.selected_vendor.vendorCategory;
      vendor.vendorTagging = this.selected_vendor.vendorTagging;
      vendor.vendorContactPerson = this.selected_vendor.vendorContactPerson;
      vendor.vendorAttachments = this.selected_vendor.vendorAttachments;
      vendor.save();

      this.$notify({
        message: "Vendor Updated successfully!",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success",
      });
    },
    /**
     * Add new contact person to the selected vendor
     */
    addContactPerson() {
      this.selected_vendor.vendorContactPerson.push({
        name: null,
        email: null,
        phone_number: null,
      });
      this.$forceUpdate();
    },
    /**
     * Delete item from contact person list
     * @param index
     */
    deleteContactPersonItem(index) {
      this.selected_vendor.vendorContactPerson.splice(index, 1);
    },
    /**
     * Add new attachment file to the selected vendor
     */
    addAttachment() {
      this.selected_vendor.vendorAttachments.push({
        path: null,
      });
      this.$forceUpdate();
      setTimeout(() => {
        this.$refs["file-" + (this.selected_vendor.vendorAttachments.length - 1)][0].$children[0].$el.click();
      }, 200);
    },
    /**
     * Delete item from attachments list
     * @param index
     */
    deleteAttachmentItem(index) {
      this.selected_vendor.vendorAttachments.splice(index, 1);
      this.selected_vendor = {
        ...this.selected_vendor,
      };
    },
    async addVendor() {
      this.$validator.validateAll().then((res) => {
        if (res) {
          let vendor = new Vendors({});

          vendor.attach(this.selected_vendor).then((res) => {
            this.$emit("vendorCreated");
            this.$emit("selectVendor", res.data.item);
            this.$notify({
              message: "Vendor created successfully!",
              horizontalAlign: "center",
              verticalAlign: "top",
              type: "success",
            });
          });
        } else {
          this.$emit("on-validated", res);
          return res;
        }
      });
    },
    onlyNumber(event) {
      const key = event.keyCode ? event.keyCode : event.which;
      if (
        !(
          event.ctrlKey ||
          event.altKey ||
          (key > 47 && key < 58 && event.shiftKey === false) ||
          (key > 95 && key < 106) ||
          key === 8 ||
          key === 9 ||
          (key > 34 && key < 41) ||
          key === 46
        )
      ) {
        // 46 is dot
        event.preventDefault();
      }
    },
    closePanel() {
      this.$emit("closePanel", {
        a: "b",
      });
    },
  },
};
</script>
