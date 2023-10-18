<template>
  <md-card>
    <md-card-header class="md-card-header-icon md-card-header-rose">
      <div class="card-icon">
        <md-icon>person</md-icon>
      </div>
      <h5 class="title profile-title">Personal Information</h5>
    </md-card-header>
    <md-card-content class="company-profile-section">
      <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" />
      <div class="md-layout">
        <div class="md-layout-item md-size-33" style="text-align: left">
          <span class="text-gray" style="font-weight: 500">Name</span>
        </div>
        <div class="md-layout-item md-size-66 text-right">
          <h6 style="padding: 0; margin: 4px 0; text-transform: none !important">
            <label-edit
              :text="userInfo.displayName"
              field-name="displayName"
              @text-updated-blur="userValueChanged"
              @text-updated-enter="userValueChanged"
            ></label-edit>
          </h6>
        </div>
        <div class="md-layout-item md-size-33" style="text-align: left">
          <span class="text-gray" style="font-weight: 500">Email</span>
        </div>
        <div class="md-layout-item md-size-66 text-right">
          <h6 style="padding: 0; margin: 4px 0; text-transform: none !important">
            <label-edit
              :text="userInfo.emailAddress"
              field-name="emailAddress"
              @text-updated-blur="userValueChanged"
              @text-updated-enter="userValueChanged"
            ></label-edit>
          </h6>
        </div>
        <div class="md-layout-item md-size-33" style="text-align: left">
          <span class="text-gray" style="font-weight: 500">Role</span>
        </div>
        <div class="md-layout-item md-size-66 text-right">
          <h6 style="padding: 0; margin: 4px 0; text-transform: none !important">
            <label-edit
              :text="userInfo.role"
              field-name="role"
              @text-updated-blur="userValueChanged"
              @text-updated-enter="userValueChanged"
            ></label-edit>
          </h6>
        </div>
        <div class="md-layout-item md-size-33" style="text-align: left">
          <span class="text-gray" style="font-weight: 500">Department</span>
        </div>
        <div class="md-layout-item md-size-66 text-right">
          <h6 style="padding: 0; margin: 4px 0; text-transform: none !important">
            <label-edit
              :text="userInfo.department"
              field-name="department"
              @text-updated-blur="userValueChanged"
              @text-updated-enter="userValueChanged"
            ></label-edit>
          </h6>
        </div>
        <div class="md-layout-item md-size-33" style="text-align: left">
          <span class="text-gray" style="font-weight: 500">Branch</span>
        </div>
        <div class="md-layout-item md-size-66 text-right">
          <h6 style="padding: 0; margin: 4px 0; text-transform: none !important">
            <label-edit
              :text="userInfo.location"
              field-name="location"
              @text-updated-blur="userValueChanged"
              @text-updated-enter="userValueChanged"
            ></label-edit>
          </h6>
        </div>
      </div>
    </md-card-content>
  </md-card>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import StatsCard from "@/components/Cards/StatsCard";
import personalInformationModal from "./ProfileModal";
import { LabelEdit } from "@/components";
import Me from "@/models/Me";
export default {
  components: {
    StatsCard,
    personalInformationModal,
    LabelEdit,
    VueElementLoading,
    Me,
  },
  mounted() {},
  props: {
    userInfo: Object,
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      imageUrl: null,
      personalModalFlag: false,
      flag: false,
      dialogConfirmFlag: false,
      dialogMessage: "",
      alretExceedPictureSize: false,
    };
  },
  methods: {
    userValueChanged(val, fieldName) {
      this.userInfo[fieldName] = val;
      let user = { id: this.userInfo.id };
      user[fieldName] = val;
      this.isLoading = true;
      new Me(user).save().then((res) => {
        this.isLoading = false;
        this.$notify({
          message: "Profile saved successfully",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "success",
        });
      });
    },
    uploadImage() {
      this.$refs.inputFile.click();
    },

    onFilePicked(event) {
      let file = event.target.files || event.dataTransfer.files;
      if (!file.length) {
        return;
      }
      if (file[0].size <= 500000) {
        let url = URL.createObjectURL(file[0]);
        this.imageUrl = url;

        const formData = new FormData();
        formData.append("images", file[0], file[0].name); // TODO :: send this object once we have api for userPorfile photo
      } else {
        this.alretExceedPictureSize = true;
      }
    },

    hidePersonalInfoModal() {
      this.flag = !this.flag;
    },

    showPersonalModal() {
      this.flag = true;
    },

    showRemoveConfirmDialog() {
      this.dialogMessage = "Are you sure you want delete profile picture ?";
      this.dialogConfirmFlag = true;
    },

    confirmDelete() {
      this.imageUrl = null;
      this.dialogConfirmFlag = false;
    },
    onCancel() {
      this.dialogConfirmFlag = false;
    },
  },
  watch: {
    userInfo(newVal, oldVal) {},
  },
};
</script>

<style lang="scss" scoped>
/*.personal-Information {
    text-align: center;
    font-family: Roboto;
    font-size: 18px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: left;
    color: #000000;
    padding-top: 20px;
  }

  .header-icon {
    width: 63px;
    height: 64px;
    border-radius: 3px;
    box-shadow: 0px 4px 20px 0 rgba(0, 0, 0, 0.14);
    background-image: linear-gradient(to right, #eb3e79, #d81b60);
  }

  .card-icon {
    padding: 16px 16px 16px 15px;
  }

  .profile-picture {
    box-shadow: 0px 4px 25px 0 rgba(0, 0, 0, 0.12);
    background-color: #999999;
  }

  .profile-button {
    width: 170px;
    height: 33px;
    box-shadow: 0px 4px 20px 0 rgba(0, 0, 0, 0.14);
    background-color: #9c27b0;
    cursor: pointer;
  }

  .profile-button:hover {
    background-color: #999999;
    color: white
  }

  .edit-modal:hover{
    cursor: pointer;
  }

  .hover-clear:hover{
    cursor: pointer;
  }
  .profile-button span {
    width: 141px;
    height: 14px;
    font-family: Roboto;
    font-size: 14px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
  }

  .main-personal {
    width: 349px;
    height: 485px;
    border-radius: 6px;
    // box-shadow: 0px 1px 4px 0 rgba(0, 0, 0, 0.14);
    // background-color: #ffffff;
  }*/
</style>
