<template>
  <div class="md-layout">
    <modal v-if="inviteModalOpen" @close="noticeModalHide" container-class="modal-container">
      <template slot="header" class="header-position">
        <h3 class="title">Create new Vendor</h3>
        <button class="btn-position" @click="closeModal">X</button>
      </template>
      <template slot="body">
        <div class="md-layout">
          <div class="md-layout-item md-medium-size-95 md-size-95">
            <div class="grid-col">
              <md-field
                style="margin-right: 10px; width: 97%"
                :class="[
                  { 'md-valid': !errors.has('displayName') && touched.displayName },
                  { 'md-error': errors.has('displayName') },
                ]"
              >
                <label>Vendor name</label>
                <md-input
                  ref="focusable"
                  v-model="name"
                  data-vv-name="displayName"
                  type="text"
                  name="displayName"
                  required
                  autofocus
                  v-validate="modelValidations.displayName"
                >
                </md-input>
                <slide-y-down-transition>
                  <md-icon class="error" v-show="errors.has('displayName')">close</md-icon>
                </slide-y-down-transition>
                <slide-y-down-transition>
                  <md-icon class="success" v-show="!errors.has('displayName') && touched.displayName">done</md-icon>
                </slide-y-down-transition>
              </md-field>

              <md-field class="no-margin">
                <label for="select">Category</label>
                <md-select v-model="category" name="select">
                  <md-option v-for="(option, index) in vendorCategory" :key="index" :value="option.id">{{
                    option.value
                  }}</md-option>
                </md-select>
              </md-field>
            </div>
            <md-field
              :class="[
                { 'md-valid': !errors.has('vendorEmail') && touched.vendorEmail },
                { 'md-error': errors.has('vendorEmail') },
              ]"
            >
              <label>Email Address</label>
              <md-input
                v-model="email"
                data-vv-name="vendorEmail"
                type="text"
                name="email"
                required
                v-validate="modelValidations.vendorEmail"
              >
              </md-input>
              <slide-y-down-transition>
                <md-icon class="error" v-show="errors.has('vendorEmail')">close</md-icon>
              </slide-y-down-transition>
              <slide-y-down-transition>
                <md-icon class="success" v-show="!errors.has('vendorEmail') && touched.vendorEmail">done</md-icon>
              </slide-y-down-transition>
            </md-field>

            <md-field
              :class="[
                { 'md-valid': !errors.has('vendorAddress') && touched.vendorAddress },
                { 'md-error': errors.has('vendorAddress') },
              ]"
            >
              <label>Business Address</label>
              <md-input
                v-model="address"
                data-vv-name="vendorAddress"
                type="text"
                name="vendorAddress"
                required
                v-validate="modelValidations.vendorAddress"
              >
              </md-input>
              <slide-y-down-transition>
                <md-icon class="error" v-show="errors.has('vendorAddress')">close</md-icon>
              </slide-y-down-transition>
              <slide-y-down-transition>
                <md-icon class="success" v-show="!errors.has('vendorAddress') && touched.vendorAddress">done</md-icon>
              </slide-y-down-transition>
            </md-field>
          </div>

          <div class="md-layout-item md-size-95 md-small-size-100">
            <md-field
              :class="[
                { 'md-valid': !errors.has('vendorPhoneNumber') && touched.vendorPhoneNumber },
                { 'md-error': errors.has('vendorPhoneNumber') },
              ]"
            >
              <label>Phone Number</label>
              <md-input
                v-model="phoneNumber"
                data-vv-name="vendorPhoneNumber"
                type="number"
                name="vendorPhoneNumber"
                required
                v-validate="modelValidations.vendorPhoneNumber"
              >
              </md-input>
              <slide-y-down-transition>
                <md-icon class="error" v-show="errors.has('vendorPhoneNumber')">close</md-icon>
              </slide-y-down-transition>
              <slide-y-down-transition>
                <md-icon class="success" v-show="!errors.has('vendorPhoneNumber') && touched.vendorPhoneNumber"
                  >done</md-icon
                >
              </slide-y-down-transition>
            </md-field>
            <md-field
              :class="[
                { 'md-valid': !errors.has('webSite') && touched.webSite },
                { 'md-error': errors.has('webSite') },
              ]"
            >
              <label>Web site address</label>
              <md-input
                v-model="web"
                data-vv-name="webSite"
                type="email"
                name="webSite"
                required
                v-validate="modelValidations.webSite"
              >
              </md-input>
              <slide-y-down-transition>
                <md-icon class="error" v-show="errors.has('webSite')">close</md-icon>
              </slide-y-down-transition>
              <slide-y-down-transition>
                <md-icon class="success" v-show="!errors.has('webSite') && touched.webSite">done</md-icon>
              </slide-y-down-transition>
            </md-field>
          </div>
        </div>
      </template>
      <template slot="footer">
        <md-button class="move-left md-red md-simple" @click="closeModal">Close</md-button>
        <md-button class="md-rose text-rose pull-right" @click="addVendor">Create</md-button>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import vendorsVuex from "../vendors.vuex";
import { Modal } from "@/components";
import Swal from "sweetalert2";
import Vendors from "@/models/Vendors";
import VendorCategories from "@/models/VendorCategories";
import { SlideYDownTransition } from "vue2-transitions";

export default {
  components: {
    Modal,
    SlideYDownTransition,
  },
  data() {
    return {
      inviteModalOpen: false,
      single: null,
      vendorCategory: [],
      categories: ["Space / Venue ", "Catering", "Services ", "Products Rental / Purchase"],
      touched: {
        displayName: false,
        vendorAddress: false,
        vendorEmail: false,
        webSite: false,
        vendorPhoneNumber: false,
      },
      modelValidations: {
        displayName: {
          required: true,
          min: 5,
        },
        vendorAddress: {
          required: true,
          min: 5,
        },
        vendorEmail: {
          required: true,
          email: true,
        },
        webSite: {
          required: true,
          min: 5,
        },
        vendorPhoneNumber: {
          required: true,
          min: 5,
        },
      },
    };
  },
  created() {
    this.$store.registerModule("vendors", vendorsVuex);

    Vendors.find("categories").then(
      (categories) => {
        this.vendorCategory = categories;
      },
      (error) => {
        console.log(error);
      },
    );
  },
  destroyed() {
    console.log(this.$store);
    console.log(this.vendorsMemberData);

    this.$store.unregisterModule("vendors", vendorsVuex);
  },
  computed: {
    ...mapState("vendors", ["vendorsMemberData"]),

    name: {
      get() {
        return this.vendorsMemberData.vendorDisplayName;
      },
      set(value) {
        this.setMemberProperty({ key: "vendorDisplayName", actualValue: value });
      },
    },

    address: {
      get() {
        return this.vendorsMemberData.vendorAddressLine1;
      },
      set(value) {
        this.setMemberProperty({ key: "vendorAddressLine1", actualValue: value });
      },
    },
    email: {
      get() {
        return this.vendorsMemberData.vendorMainEmail;
      },
      set(value) {
        this.setMemberProperty({ key: "vendorMainEmail", actualValue: value });
      },
    },
    category: {
      get() {
        return this.vendorsMemberData.productsCategory;
      },
      set(value) {
        this.setMemberProperty({ key: "productsCategory", actualValue: value });
      },
    },
    web: {
      get() {
        return this.vendorsMemberData.vendorWebsite;
      },
      set(value) {
        this.setMemberProperty({ key: "vendorWebsite", actualValue: value });
      },
    },
    phoneNumber: {
      get() {
        return this.vendorsMemberData.vendorMainPhoneNumber;
      },
      set(value) {
        this.setMemberProperty({ key: "vendorMainPhoneNumber", actualValue: value });
      },
    },
  },
  methods: {
    ...mapMutations("vendors", ["setMemberProperty"]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      return this.$validator.validateAll().then((res) => {
        this.$emit("on-validated", res);
        return res;
      });
    },
    noticeModalHide: function () {
      this.inviteModalOpen = false;
    },
    toggleModal: function (show, ref) {
      this.inviteModalOpen = show;
      setTimeout(() => {
        this.$refs.focusable.$el.focus();
      }, 100);
    },
    closeModal() {
      this.inviteModalOpen = false;
    },
    validateStep(ref) {
      return this.$refs[ref].validate();
    },
    onStepValidated(validated, model) {
      this.wizardModel = { ...this.wizardModel, ...model };
    },

    async addVendor() {
      this.$validator.validateAll().then((res) => {
        if (res) {
          this.inviteModalOpen = false;
          let vendor = new Vendors({});

          this.vendorsMemberData.vendorContactPerson = [
            {
              name: null,
              email: null,
              phone_number: null,
            },
          ];

          this.vendorsMemberData.vendorAttachments = [
            {
              path: null,
            },
          ];

          this.vendorsMemberData.vendorTagging = [];

          vendor.attach(this.vendorsMemberData).then(() => {
            this.$emit("vendorCreated");
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
  },
  watch: {
    displayName() {
      this.touched.displayName = true;
    },
    vendorAddress() {
      this.touched.vendorAddress = true;
    },
    vendorEmail() {
      this.touched.vendorEmail = true;
    },

    webSite() {
      this.touched.webSite = true;
    },
    vendorPhoneNumber() {
      this.touched.vendorPhoneNumber = true;
    },
  },
};
</script>
<style>
.swal2-container {
  z-index: 999999;
}
.btn-position {
  position: absolute;
  right: 15px;
  font-weight: bold;
  top: 20px;
  font-size: 17px;
  background-color: transparent !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
  color: gray !important;
  border-color: transparent;
  cursor: pointer;
}
</style>
