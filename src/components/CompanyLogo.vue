<template>
  <div class="company-logo">
    <div class="content-wrapper">
      <vue-element-loading :active="isLoading" color="#FF547C"></vue-element-loading>
      <div class="uploading-wrapper">
        <md-button class="maryoku-btn md-simple md-white" @click="onClickAvtar">
          <md-icon>edit</md-icon>Edit
        </md-button>
      </div>
      <img v-if="companyLogo" :src="`${companyLogo}?q=${Math.random()}`" style="margin: auto" />
      <span v-else style="vertical-align: middle">Company Logo</span>
      <input
        style="display: none"
        id="company-logo-file"
        name="company-logo"
        type="file"
        multiple="multiple"
        @change="onUserAvatarChange"
      />
    </div>
  </div>
</template>
<script>
import S3Service from "@/services/s3.service";
import VueElementLoading from "vue-element-loading";
import AvatarCropper from "vue-avatar-cropper";

export default {
  components: {
    VueElementLoading,
    AvatarCropper,
  },
  props: {
    user: {
      type: Object,
      default: {},
    },
    defaultImage: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isLoading: false,
      companyLogo: "",
    };
  },
  created() {
    this.companyLogo = this.defaultImage || this.user.companyLogo;
  },
  methods: {
    onClickAvtar() {
      document.getElementById("company-logo-file").click();
    },
    onUserAvatarChange(event) {
      let files = event.target.files || event.dataTransfer.files;
      if (!files.length) return;

      const extension = files[0].type.split("/")[1];
      let imageName = this.user.id;
      let imageUrl = `https://maryoku.s3.amazonaws.com/company/logos/${this.user.id}.${extension}`;
      this.isLoading = true;
      S3Service.fileUpload(files[0], `${imageName}`, `company/logos`).then((res) => {
        console.log(res);
        this.isLoading = false;
        this.companyLogo = imageUrl;

        this.$emit("set", imageUrl);
      });
    },
  },
  computed: {
    defaultAvatar() {
      return this.defaultImage || this.user.companyLogo;
    },
  },
  watch: {
    defaultAvatar(newValue, oldValue) {
      this.companyLogo = newValue;
    },
  },
};
</script>
<style lang="scss" scoped>
.company-logo {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .content-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .uploading-wrapper {
    display: none;
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    .maryoku-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  &:hover {
    .uploading-wrapper {
      display: block;
    }
  }
}
</style>