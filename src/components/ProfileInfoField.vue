<template>
  <div class="profile-info-field">
    <div class="d-flex justify-content-between">
      <div class="label">
        <img v-if="icon" :src="icon" class="label-icon" /><span>{{ fieldLabel }}</span>
      </div>
      <md-button class="md-simple edit-btn" :class="`${theme}`" @click="edit"> Edit</md-button>
    </div>
    <div v-if="description" class="mt-10 color-gray">{{ description }}</div>
    <div class="profile-field-value" v-if="isEditing">
      <template v-if="fieldName === 'password' || editor === 'password'">
        <input type="password" style="width: 100%" v-model="content" placeholder="New password" />
        <input type="password" style="width: 100%; margin-top: 20px" v-model="passwordConfirm" placeholder="Confirm " />
      </template>
      <vue-google-autocomplete
        v-else-if="editor === 'location'"
        :id="fieldName"
        ref="address"
        class="my-10 width-100 address"
        :placeholder="content ? content : 'Enter an an address, zipcode, or location'"
        v-on:placechanged="getAddressData"
      />
      <div class="social-editor" v-else-if="editor === 'social'">
        <div class="field d-flex align-center" v-for="(s, sIndex) in socialMediaBlocks" :key="sIndex">
          <div class="label">
            <img :src="`${$iconURL}Vendor Signup/${s.icon}`" />
            <span>{{ s.name }}</span>
          </div>
          <input class="flex-1" type="text" placeholder="Paste link here" v-model="content[s.name]" />
        </div>
      </div>
      <div class="signature-editor" v-else-if="editor == 'signature'">
        <md-button class="md-outlined maryoku-btn md-simple md-vendor" @click="uploadSignatureFile">
          Choose File
        </md-button>
        <div class="or">Or</div>
        <div class="sign-here">
          <img v-if="signatureData" :src="`${signatureData}`" />
          <vueSignature v-else ref="signature" :sigOption="option" :w="'100%'" :h="'100%'" />
          <md-button class="md-simple md-vendor edit-btn" @click="clear">Clear</md-button>
        </div>
        <input
          type="file"
          class="d-none"
          ref="signatureFile"
          name="vendorSignature"
          accept="image/gif, image/jpg, image/png"
          @change="onSignatureFilePicked"
        />
      </div>
      <input v-else-if="editor === 'input'" type="text" style="width: 100%" v-model="content" />
      <textarea v-else style="width: 100%" v-model="content" rows="6"></textarea>
      <div class="text-right mt-10">
        <md-button class="md-simple maryoku-btn" :class="`${theme}`" @click="cancelEdit">Cancel</md-button>
        <md-button class="maryoku-btn" :class="`${theme}`" :disabled="!canSave" @click="saveField">Save</md-button>
      </div>
    </div>
    <div v-else class="profile-field-value">
      <template v-if="editor === 'social'">
        <div class="social-value d-flex align-center">
          <div
            class="item mr-20"
            v-for="(s, sIndex) in socialMediaBlocks.filter((item) => defaultValue[item.name])"
            :key="sIndex"
          >
            <a :href="defaultValue[s.name]" target="_blank">
              <img :src="`${$iconURL}Vendor Signup/${s.icon}`" />
            </a>
          </div>
        </div>
      </template>
      <template v-else-if="editor === 'signature'">
        <div
          class="sign"
          v-if="defaultValue"
          style="max-width: 300px"
          :style="`
                  background-image: url(${defaultValue});
                  width: 100%;
                  background-repeat: no-repeat;
                  height: 162px;
                  background-size: contain;
                `"
        />
      </template>
      <template v-else>
        {{ fieldName === "password" ? "********" : defaultValue }}
      </template>
    </div>
  </div>
</template>
<script>
import VueGoogleAutocomplete from "vue-google-autocomplete";
import vueSignature from "vue-signature";
import { getBase64 } from "@/utils/file.util";
import S3Service from "@/services/s3.service";
export default {
  components: {
    VueGoogleAutocomplete,
    vueSignature,
  },
  props: {
    fieldName: {
      type: String,
      default: "",
    },
    fieldLabel: {
      type: String,
      default: "",
    },
    defaultValue: {
      type: [String, Object],
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    theme: {
      type: String,
      default: "md-red",
    },
    editor: {
      type: String,
      default: "input",
    },
    description: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isEditing: false,
      content: "",
      signatureData: "",
      passwordConfirm: "",
      socialMediaBlocks: [
        {
          name: "website",
          icon: "Asset 539.svg",
        },
        {
          name: "facebook",
          icon: "Asset 540.svg",
        },
        {
          name: "instagram",
          icon: "Group 4569 (2).svg",
        },
        {
          name: "youtube",
          icon: "socialmedia/Youtube.svg",
        },
        {
          name: "linkedin",
          icon: "socialmedia/Linkdin.svg",
        },
        {
          name: "google",
          icon: "socialmedia/GooglePlus.svg",
        },
        {
          name: "pinterest",
          icon: "socialmedia/Pinterest.svg",
        },
        {
          name: "foursquare",
          icon: "socialmedia/foursquare.svg",
        },
        {
          name: "reddit",
          icon: "socialmedia/Twitter.svg",
        },
        {
          name: "tiktok",
          icon: "socialmedia/Tiktok.svg",
        },
      ],
      option: {
        penColor: "rgb(0, 0, 0)",
        backgroundColor: "rgb(255,255,255)",
      },
    };
  },
  created() {
    this.content = this.defaultValue;
  },
  methods: {
    edit() {
      this.isEditing = true;
    },
    cancelEdit() {
      this.isEditing = false;
      this.content = this.defaultValue;
    },
    saveField() {
      this.isEditing = false;
      if (this.fieldName === "signature") {
        if (!this.signatureData) {
          let jpeg = this.$refs.signature.save("image/jpeg");
          this.content = jpeg;
          this.$emit("save", { name: this.fieldName, value: jpeg });
        } else {
          this.$emit("save", { name: this.fieldName, value: this.content });
        }
      } else {
        this.$emit("save", { name: this.fieldName, value: this.content });
      }
    },
    getAddressData: function (addressData, placeResultData, id) {
      this.content = `${addressData.route}, ${addressData.administrative_area_level_1}, ${addressData.country}`;
    },
    uploadSignatureFile() {
      this.$refs.signatureFile.click();
    },
    clear() {
      this.signatureData = "";
      this.$refs.signature.clear();
    },
    async onSignatureFilePicked(e) {
      const file = e.target.files[0];
      const extension = file.type.split("/")[1];
      const fileId = `${new Date().getTime()}`;
      S3Service.fileUpload(file, fileId, "vendor/signatures").then(async (uploadedName) => {
        this.content = `https://maryoku.s3.amazonaws.com/vendor/signatures/${fileId}.${extension}`;
        this.signatureData = await getBase64(file);
      });

      // this.$refs.signature.fromDataURL(imageData);
    },
  },
  computed: {
    canSave() {
      if (this.fieldName === "password") {
        return this.content && this.content === this.passwordConfirm;
      } else if (this.editor === "signature") {
        return true;
      } else {
        return this.content;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.profile-info-field {
  border-bottom: solid 1px #e0e0e0;
  padding: 35px 0;
  .label {
    img {
      margin-right: 20px;
    }
    span {
      font-weight: bold;
      font-size: 16px;
    }
  }
  .profile-field-value {
    font-size: 16px;
    margin-top: 10px;
    margin-right: 20%;
    line-height: 1.8em;
  }
  .social-value {
    img {
      width: 25px;
      max-height: 30px;
    }
  }
  .social-editor {
    .field {
      margin-top: 10px;
      img {
        width: 20px;
        max-height: 25px;
      }
      .label {
        width: 150px;
      }
    }
  }
  .signature-editor {
    text-align: center;
    .sign-here {
      border: dashed 1px #f51355;
      img {
        max-height: 300px;
        object-fit: contain;
      }
    }
  }
}
</style>