<template>
  <div>
    <div class="picture-container">
      <div class="picture">
        <div v-if="!imageUrl">
          <img class="avatar" title src="https://static-maryoku.s3.amazonaws.com/storage/img/profile-picture.png" />
        </div>
        <div v-else>
          <img v-model="imageUrl" class="avatar" :src="imageUrl" />
        </div>
        <input type="file" accept="image/x-png, image/gif, image/jpeg" @change="onFileChange" />
      </div>
      <div v-if="!imageUrl">
        <button class="description choose-button">Choose Picture</button>
      </div>
    </div>
    <div v-if="imageUrl" class="remove">
      <button v-on:click="clearImg" class="description choose-button">
        <h6 class="description">Remove</h6>
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.avatar {
  width: 50% !important;
  border-radius: 50% !important;
}
.choose-button {
  background: #9034ab !important;
  padding: 4px;
  width: 50%;
  padding-top: 8px;
  border: 12px;
  border-radius: 5px;
}
.remove {
  width: 100%;
  h6 {
    margin: 4px !important;
  }
  text-align: center;
}
.description {
  color: #fff;
}
.picture {
  width: 100% !important;
  max-width: 100%;
  padding: 24px;
}
.picture-src {
  width: 100%;
}
</style>

<script>
import { LabelEdit } from "@/components";
import Me from "@/models/Me";
import UserFile from "@/models/UserFile";
import Swal from "sweetalert2";
export default {
  components: {
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
      alretExceedPictureSize: false,
    };
  },
  methods: {
    onFileChange(event) {
      let file = event.target.files || event.dataTransfer.files;
      if (!file.length) {
        return;
      }
      if (file[0].size <= 500000) {
        let url = URL.createObjectURL(file[0]);
        this.imageUrl = url;
        this.sendImage(file[0]);
      } else {
        this.alretExceedPictureSize = true;
      }
    },
    clearImg() {
      Swal.fire({
        title: "Are you sure you want remove it?",
        text: ``,
        showCancelButton: true,
        confirmButtonClass: "md-button md-success",
        cancelButtonClass: "md-button md-danger",
        confirmButtonText: "Yes, delete it!",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.loaded = false;
          this.imageUrl = "";
        }
      });
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
    async sendImage(file) {
      this.csvUploading = true;
      let reader = new FileReader();
      let _this = this;

      reader.onload = (e) => {
        let UserFile = new UserFile({ userFile: e.target.result });
        UserFile.save()
          .then((result) => {
            this.$notify({
              message: "profile Picture is uploaded successfully",
              horizontalAlign: "center",
              verticalAlign: "top",
              type: "success",
            });
            this.currentStep++;
            this.$root.$emit("switch-panel", 1);
          })
          .catch((error) => {
            _this.csvUploading = false;
            this.$notify({
              message: "profile Picture is not uploaded, please try again",
              horizontalAlign: "center",
              verticalAlign: "top",
              icon: "warning",
            });

            console.log(error);
          });
      };
      reader.readAsDataURL(file);
    },

    removeImage: function (type) {
      // sremoveImagehowRemoveConfirmDialog()
      Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        showCancelButton: true,
        confirmButtonClass: "md-button md-success",
        cancelButtonClass: "md-button md-danger",
        confirmButtonText: "Yes, delete it!",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.loaded = false;
        }
      });

      // let customer = this.$auth.user.customer;
      // new CustomerFile({id: customer.logoFileId}).delete().then(res => {
      //     this.loaded = true;
      //     customer.logoFileId = null;
      //     this.companyProfile.logoFileId = undefined;
      //     this.companyProfile.companyLogo = customer.logoFileId ? `${process.env.SERVER_URL}/1/customerFiles/${customer.logoFileId}` : 'https://static-maryoku.s3.amazonaws.com/storage/img/image_placeholder.jpg';
      // }).catch((error) => {
      //     this.loaded = true;
      // });
    },
  },
  watch: {
    userInfo(newVal, oldVal) {},
  },
};
</script>

<style lang="scss" scoped>
.picture-container {
  position: relative;
  cursor: pointer;
  text-align: center;

  .description {
    margin: 0;
    margin-bottom: 0.5rem;
  }

  .picture input[type="file"] {
    cursor: pointer;
    display: block;
    height: 100%;
    left: 0;
    opacity: 0 !important;
    position: absolute;
    top: 0;
    width: 100%;
  }

  .picture-src {
    width: 100%;
  }
}
</style>
