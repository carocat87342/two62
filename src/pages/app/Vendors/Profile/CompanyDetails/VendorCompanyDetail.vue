<template>
  <div class="vendor-profile-detail" v-if="companyData">
    <profile-info-field
      class="profile-detail-info"
      fieldName="aboutCompany"
      fieldLabel="About your company"
      theme="md-vendor"
      editor="textarea"
      :defaultValue="companyData.about ? companyData.about.company : ''"
      :icon="`${$iconURL}common/info-gray.svg`"
      @save="saveProfileField"
    ></profile-info-field>
    <profile-info-field
      class="profile-detail-info"
      fieldName="personalMessage"
      fieldLabel="Personal messsage to your clients"
      @save="saveProfileField"
      theme="md-vendor"
      editor="textarea"
      description="(Will be added automatically to future proposals)"
      :defaultValue="companyData.personalMessage"
      :icon="`${$iconURL}common/message-gray.svg`"
    ></profile-info-field>
    <profile-info-field
      class="profile-detail-info"
      :defaultValue="companyData.companyName"
      fieldName="companyName"
      fieldLabel="Company Name"
      @save="saveProfileField"
      theme="md-vendor"
    ></profile-info-field>
    <profile-info-field
      class="profile-detail-info"
      :defaultValue="companyData.vendorMainEmail"
      :icon="`${$iconURL}common/email-gray.svg`"
      fieldName="vendorMainEmail"
      fieldLabel="Business Email Address"
      @save="saveProfileField"
      theme="md-vendor"
    ></profile-info-field>
    <profile-info-field
      class="profile-detail-info"
      :defaultValue="companyData.vendorMainPhoneNumber"
      :icon="`${$iconURL}common/phone-gray.svg`"
      fieldName="vendorMainPhoneNumber"
      fieldLabel="Business Phone Number"
      @save="saveProfileField"
      theme="md-vendor"
    ></profile-info-field>
    <profile-info-field
      class="profile-detail-info"
      :defaultValue="companyData.vendorAddressLine1"
      :icon="`${$iconURL}common/location-gray.svg`"
      fieldName="vendorAddressLine1"
      fieldLabel="Business Location"
      @save="saveProfileField"
      theme="md-vendor"
      editor="location"
    ></profile-info-field>
    <profile-info-field
      class="profile-detail-info"
      :defaultValue="companyData.vendorAddressLine1"
      :icon="`${$iconURL}common/sender-gray.svg`"
      fieldName="vendorAddressLine1"
      fieldLabel="Shipping Address"
      @save="saveProfileField"
      theme="md-vendor"
      editor="location"
    ></profile-info-field>
    <profile-info-field
      class="profile-detail-info"
      :defaultValue="companyData.social"
      fieldName="social"
      fieldLabel="Website & Social Media"
      @save="saveProfileField"
      theme="md-vendor"
      editor="social"
    ></profile-info-field>
    <profile-info-field
      class="profile-detail-info"
      :defaultValue="companyData.signature"
      fieldName="signature"
      fieldLabel="Business Signature"
      @save="saveProfileField"
      theme="md-vendor"
      editor="signature"
    ></profile-info-field>
  </div>
  <div v-else></div>
</template>
<script>
import ProfileInfoField from "@/components/ProfileInfoField.vue";
import Vendors from "@/models/Vendors";
import Swal from "sweetalert2";
export default {
  components: {
    ProfileInfoField,
  },
  data() {
    return {
      editingFieldName: "",
      fullName: "",
      email: "",
      password: "",
      conformPassword: "",
      phoneNumber: "",
      companyName: "",
      companyDescription: "",
    };
  },
  methods: {
    saveProfileField(profileData) {
      let updateData;
      if (profileData.name == "aboutCompany") {
        updateData = { about: { company: profileData.value }, id: this.companyData.id };
      } else {
        updateData = { [profileData.name]: profileData.value, id: this.companyData.id };
      }
      this.$store.dispatch("vendor/updateProfile", updateData);
    },
    deleteProfile() {
      Swal.fire({
        title: "<div style='text-align:center'>Are you sure?</div>",
        text: `You won't be able to login with current credetials!`,
        showCancelButton: true,
        icon: "warning",
        confirmButtonClass: "md-button md-success confirm-btn-bg ",
        cancelButtonClass: "md-button md-danger cancel-btn-bg",
        confirmButtonText: "Yes, I'll delete my profile!",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.$http
            .post(`${process.env.SERVER_URL}/1/delete-profile`, {}, { headers: this.$auth.getAuthHeader() })
            .then((res) => {
              this.$router.push("/signout");
            });
        }
      });
    },
  },
  created() {},
  computed: {
    companyData() {
      return this.$store.state.vendor.profile;
    },
  },
};
</script>
<style lang="scss" scoped>
.vendor-profile-detail {
  text-align: left;
  max-width: 800px;
  font-size: 16px;
  .profile-detail-info {
    border-bottom: solid 1px #e0e0e0;
    /deep/ img.label-icon {
      width: 28px !important;
    }
  }
}
</style>