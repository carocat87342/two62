<template>
  <md-card>
    <md-card-header
      class="md-card-header-icon md-card-header-white"
      @mouseleave.native="onMouseLeave"
      @mouseenter.native="onMouseOver"
    >
      <div class="card-icon" style="width: 96px; height: 96px; padding: 0; object-fit: contain;">
        <img
          :src="companyProfile.companyLogo"
          style="object-fit: scale-down; padding: 4px; width: 100%; height: 100%;"
        />
        <vue-element-loading :active="!loaded" :is-full-screen="false" />
        <div v-show="logoButtonsVisible" style="margin-top: -15%; text-align: center;">
          <md-button
            class="md-xs md-just-icon md-round md-info md-icon-button md-fileinput"
            @click="openLogoImageInput"
          >
            <md-icon>edit</md-icon>
            <input ref="logoImageInput" type="file" @change="onFileChange" />
          </md-button>
          <md-button
            v-if="companyProfile.logoFileId"
            class="md-xs md-just-icon md-round md-danger md-icon-button"
            @click="removeImage"
          >
            <md-icon>close</md-icon>
          </md-button>
        </div>
      </div>
      <h4 class="title company-title" style="padding-top: 24px;">
        <label-edit
          :text="companyProfile.name"
          field-name="name"
          :required="true"
          :title="companyProfile.name"
          @text-updated-blur="companyValueChanged"
          @text-updated-enter="companyValueChanged"
        ></label-edit>
      </h4>
    </md-card-header>
    <md-card-content class="company-profile-section">
      <div class="separator">&nbsp;</div>
      <div class="md-layout" style="text-align: left;">
        <div class="md-layout-item md-size-33">
          <span class="text-gray" style="font-weight: 500;">Main Office</span>
        </div>
        <div class="md-layout-item md-size-66 text-right">
          <h6 style="padding: 0;margin: 4px 0; text-transform: none !important;">
            <label-edit
              :text="companyProfile.mainAddress.onelineAddress"
              field-name="mainAddress"
              :title="companyProfile.mainAddress.onelineAddress"
              @text-updated-blur="companyValueChanged"
              @text-updated-enter="companyValueChanged"
            ></label-edit>
          </h6>
        </div>
        <div class="md-layout-item md-size-60">
          <span class="text-gray" style="font-weight: 500;">Number of Guests</span>
        </div>
        <div class="md-layout-item md-size-40 text-right">
          <h6 style="padding: 0;margin: 4px 0; text-transform: none !important;">
            <label-edit
              :text="companyProfile.numberOfEmployees"
              field-name="numberOfEmployees"
              :title="companyProfile.numberOfEmployees"
              @text-updated-blur="companyValueChanged"
              @text-updated-enter="companyValueChanged"
            ></label-edit>
          </h6>
        </div>
        <div class="md-layout-item md-size-33">
          <span class="text-gray" style="font-weight: 500;">Industry</span>
        </div>
        <div class="md-layout-item md-size-66 text-right">
          <h6 style="padding: 0;margin: 4px 0; text-transform: none !important;">
            <label-edit v-bind:text="companyProfile.industry" placeholder="Your Industry"></label-edit>
          </h6>
        </div>
      </div>
      <hr class="divider" />
      <h6 style="margin: 4px 0;">Custom Information</h6>
      <div style="min-height: 140px"></div>
    </md-card-content>
  </md-card>
</template>
<script>
// import auth from '@/auth';
import { LabelEdit } from "@/components";
import CustomerFile from "@/models/CustomerFile";
import Customer from "@/models/Customer";
import VueElementLoading from "vue-element-loading";

export default {
  name: "company-dashboard-info",
  components: {
    LabelEdit,
    VueElementLoading,
  },
  data() {
    return {
      // auth: auth,
      loaded: false,
      logoButtonsVisible: false,
      companyProfile: {
        id: null,
        name: "",
        mainAddress: { onelineAddress: "" },
        numberOfEmployees: "",
        industry: "",
        mainPhoneNumber: "",
        mainEmailAddress: "",
        mainWebSiteAddress: "",
        companyLogo: undefined,
        logoFileId: undefined,
      },
    };
  },
  mounted() {
    this.$auth.currentUser(this, true, () => {
      let customer = this.$auth.user.customer;
      this.companyProfile.id = customer.id;
      this.companyProfile.name = customer.name;
      this.mainAddress = {
        onelineAddress: customer.mainAddress
          ? customer.mainAddress.onelineAddress
          : "",
      };
      this.companyProfile.numberOfEmployees = customer.numberOfEmployees;
      this.companyProfile.industry = customer.industry;
      this.companyProfile.logoFileId = customer.logoFileId;
      this.companyProfile.companyLogo = customer.logoFileId
        ? `${process.env.SERVER_URL}/1/customerFiles/${customer.logoFileId}`
        : "https://static-maryoku.s3.amazonaws.com/storage/img/image_placeholder.jpg";

      this.loaded = true;
    });
  },
  methods: {
    onMouseOver: function () {
      this.logoButtonsVisible = true;
    },
    onMouseLeave: function () {
      this.logoButtonsVisible = false;
    },
    companyValueChanged(val, fieldName) {
      this.companyProfile[fieldName] = val;
      this.saveCompanyDetails();
    },
    saveCompanyDetails() {
      let customer = this.$auth.user.customer;
      new Customer(this.companyProfile).save().then((res) => {
        /* this.$notify(
            {
              message: 'Saved successfully!',
              horizontalAlign: 'center',
              verticalAlign: 'top',
              type: 'success'
            }) */
      });
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    createImage(file, type) {
      let reader = new FileReader();
      let vm = this;

      reader.onload = (e) => {
        this.loaded = false;
        return new CustomerFile({ customerFile: e.target.result })
          .save()
          .then((result) => {
            let customer = this.$auth.user.customer;

            if (customer.logoFileId) {
              new CustomerFile({ id: customer.logoFileId })
                .delete()
                .then((deleteResult) => {
                  customer.logoFileId = result.id;
                  new Customer({
                    id: customer.id,
                    logoFileId: result.id,
                  }).save();
                  this.companyProfile.companyLogo = customer.logoFileId
                    ? `${process.env.SERVER_URL}/1/customerFiles/${customer.logoFileId}`
                    : "https://static-maryoku.s3.amazonaws.com/storage/img/image_placeholder.jpg";
                  this.companyProfile.logoFileId = customer.logoFileId;
                  this.$auth.user.customer.logoFileId = customer.logoFileId;
                  this.$ls.set("user", this.$auth.user, 1000 * 60 * 10);
                  this.loaded = true;
                });
            } else {
              customer.logoFileId = result.id;
              new Customer({ id: customer.id, logoFileId: result.id }).save();
              this.companyProfile.companyLogo = customer.logoFileId
                ? `${process.env.SERVER_URL}/1/customerFiles/${customer.logoFileId}`
                : "https://static-maryoku.s3.amazonaws.com/storage/img/image_placeholder.jpg";
              this.companyProfile.logoFileId = customer.logoFileId;
              this.$auth.user.customer.logoFileId = customer.logoFileId;
              this.$ls.set("user", this.$auth.user, 1000 * 60 * 10);
              this.loaded = true;
            }
          })
          .catch((error) => {
            console.log(error);
            this.loaded = true;
          });
      };
      reader.readAsDataURL(file);
    },
    openLogoImageInput() {
      this.$refs.logoImageInput.click();
    },
    removeImage: function (type) {
      this.loaded = false;
      let customer = this.$auth.user.customer;
      new CustomerFile({ id: customer.logoFileId })
        .delete()
        .then((res) => {
          this.loaded = true;
          customer.logoFileId = null;
          this.companyProfile.logoFileId = undefined;
          this.companyProfile.companyLogo = customer.logoFileId
            ? `${process.env.SERVER_URL}/1/customerFiles/${customer.logoFileId}`
            : "https://static-maryoku.s3.amazonaws.com/storage/img/image_placeholder.jpg";
        })
        .catch((error) => {
          this.loaded = true;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.divider {
  margin-top: 12px;
  margin-bottom: 12px;
  border-color: #ccc;
  border-top: none;
  border-left: none;
  border-right: none;
}
</style>
