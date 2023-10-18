<template>
  <div class="profile-detail">
    <profile-info-field
      class="profile-detail-info"
      :defaultValue="userData.name"
      fieldName="name"
      :icon="`${$iconURL}common/user-dark.svg`"
      fieldLabel="Full Name"
      @save="saveProfileField"
    ></profile-info-field>
    <profile-info-field
      class="profile-detail-info"
      :defaultValue="userData.email || userData.username"
      fieldName="email"
      :icon="`${$iconURL}common/email-dark.svg`"
      fieldLabel="Email Address"
      @save="saveProfileField"
    ></profile-info-field>
    <profile-info-field
      class="profile-detail-info"
      :defaultValue="userData.password"
      fieldName="password"
      :icon="`${$iconURL}common/password-dark.svg`"
      fieldLabel="Password"
      @save="saveProfileField"
    ></profile-info-field>
    <profile-info-field
      class="profile-detail-info"
      :defaultValue="userData.phoneNumber"
      fieldName="phoneNumber"
      :icon="`${$iconURL}common/phone-dark.svg`"
      fieldLabel="Phone Number"
      @save="saveProfileField"
    ></profile-info-field>
    <profile-info-field
      class="profile-detail-info"
      :defaultValue="userData.company"
      fieldName="company"
      :icon="`${$iconURL}common/company-dark.svg`"
      fieldLabel="Company Name"
      @save="saveProfileField"
    ></profile-info-field>
    <div class="profile-detail-info mt-30">
      <div class="d-flex justify-content-between">About your company</div>
      <div>Lorem ipsum dolor sit amet, consetetur sadipscing</div>
      <textarea class="mb-30" placeholder="Write description here" v-model="companyDescription"></textarea>
    </div>
    <div class="mt-30 pb-50">
      <md-button class="md-simple edit-btn" @click="deleteProfile">Delete My Profile</md-button>
      <div>You will receive an email to confirm your decision.</div>
      <div>
        Please note, that all events you have created will be permanently erased. You may want to save backups of these
        events or export them.
      </div>
    </div>
  </div>
</template>
<script>
import ProfileInfoField from "@/components/ProfileInfoField.vue";
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
      this.$store.dispatch("auth/updateProfile", { [profileData.name]: profileData.value, id: this.userData.id });
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
  created() {
    this.fullName = this.userData.name;
    this.email = this.userData.email || this.userData.username;
    this.phoneNumber = this.userData.phoneNumber;
    this.companyName = this.userData.company;
  },
  computed: {
    userData() {
      return this.$store.state.auth.user;
    },
  },
};
</script>
<style lang="scss" scoped>
.profile-detail {
  text-align: left;
  max-width: 800px;
  font-size: 16px;
  .profile-detail-info {
    border-bottom: solid 1px #e0e0e0;
  }
}
</style>